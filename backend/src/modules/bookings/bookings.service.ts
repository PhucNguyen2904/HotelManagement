import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreateBookingDto } from './dto/booking.dto';
import { BookingStatus, Prisma } from '@prisma/client';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Tạo booking mới với anti-overbooking protection
   * Sử dụng Serializable transaction + UNIQUE constraint
   */
  async create(userId: string, dto: CreateBookingDto) {
    const checkIn = new Date(dto.checkIn);
    const checkOut = new Date(dto.checkOut);

    if (checkIn >= checkOut) {
      throw new BadRequestException('Check-out must be after check-in');
    }

    const totalNights = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / 86400000,
    );

    if (totalNights < 1 || totalNights > 30) {
      throw new BadRequestException('Stay must be between 1 and 30 nights');
    }

    // Generate date range
    const dates: Date[] = [];
    for (let d = new Date(checkIn); d < checkOut; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }

    // Use Serializable transaction to prevent overbooking
    return this.prisma.$transaction(
      async (tx) => {
        // 1. Verify all rooms exist and belong to the hotel
        const hotelRoomTypes = await tx.roomType.findMany({
          where: { hotelId: dto.hotelId, isActive: true },
          select: { id: true, basePrice: true, name: true },
        });
        const roomTypeMap = new Map(
          hotelRoomTypes.map((roomType) => [roomType.id, roomType]),
        );

        const allocatedRooms: any[] = [];
        const bookingRoomsData: {
          roomId: string;
          pricePerNight: number;
          totalPrice: number;
          adults: number;
          children: number;
        }[] = [];
        let subtotal = 0;

        for (const roomReq of dto.rooms) {
          const roomType = roomTypeMap.get(roomReq.roomTypeId);
          if (!roomType) {
            throw new NotFoundException(`Room type not found`);
          }

          const availableRoomsOfThisType = await tx.room.findMany({
            where: { roomTypeId: roomReq.roomTypeId, isActive: true }
          });

          let roomsAssigned = 0;
          for (const room of availableRoomsOfThisType) {
            const conflicts = await tx.roomAvailability.findMany({
              where: {
                roomId: room.id,
                date: { in: dates },
                status: { not: 'AVAILABLE' }
              }
            });

            if (conflicts.length === 0) {
              allocatedRooms.push(room);
              roomsAssigned++;

              const pricePerNight = Number(roomType.basePrice);
              const totalPrice = pricePerNight * totalNights;
              subtotal += totalPrice;

              bookingRoomsData.push({
                roomId: room.id,
                pricePerNight,
                totalPrice,
                adults: roomReq.adults || 1,
                children: roomReq.children || 0,
              });

              if (roomsAssigned === (roomReq.quantity || 1)) {
                break;
              }
            }
          }

          if (roomsAssigned < (roomReq.quantity || 1)) {
            throw new ConflictException(`Not enough rooms available for type ${roomType.name}`);
          }
        }

        const taxPercent = 10;
        const taxAmount = Math.round(subtotal * (taxPercent / 100));
        const totalAmount = subtotal + taxAmount;

        // 5. Generate booking code
        const bookingCode = await this.generateBookingCode(tx);

        // 6. Create booking
        const booking = await tx.booking.create({
          data: {
            bookingCode,
            userId,
            hotelId: dto.hotelId,
            status: 'PENDING',
            checkIn,
            checkOut,
            totalNights,
            adults: dto.rooms.reduce((sum, r) => sum + (r.adults || 1), 0),
            children: dto.rooms.reduce((sum, r) => sum + (r.children || 0), 0),
            subtotal,
            taxRate: taxPercent,
            taxAmount,
            discountAmount: 0,
            totalAmount,
            guestName: dto.guestName,
            guestEmail: dto.guestEmail,
            guestPhone: dto.guestPhone,
            guestIdNumber: dto.guestIdNumber,
            specialRequests: dto.specialRequests,
          },
        });

        // 7. Create booking rooms
        await tx.bookingRoom.createMany({
          data: bookingRoomsData.map((br) => ({
            bookingId: booking.id,
            roomId: br.roomId,
            checkIn,
            checkOut,
            pricePerNight: br.pricePerNight,
            totalPrice: br.totalPrice,
          })),
        });

        // 8. Block availability (UNIQUE constraint = final defense)
        const availabilityData: Prisma.RoomAvailabilityCreateManyInput[] = [];
        for (const room of allocatedRooms) {
          for (const date of dates) {
            availabilityData.push({
              roomId: room.id,
              date,
              status: 'BOOKED',
              bookingId: booking.id,
            });
          }
        }

        await tx.roomAvailability.createMany({
          data: availabilityData,
        });

        this.logger.log(
          `Booking ${bookingCode} created: ${allocatedRooms.length} rooms × ${totalNights} nights = ${totalAmount.toLocaleString()}đ`,
        );

        return this.findOne(booking.id, tx);
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        timeout: 15000,
      },
    );
  }

  async findAll(
    hotelId: string,
    options?: { status?: BookingStatus; page?: number; limit?: number },
  ) {
    const { status, page = 1, limit = 20 } = options || {};
    const skip = (page - 1) * limit;

    const where: Prisma.BookingWhereInput = { hotelId };
    if (status) where.status = status;

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.booking.count({ where }),
    ]);

    const enriched = await Promise.all(
      bookings.map((booking) => this.findOne(booking.id)),
    );

    return {
      data: enriched,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string, tx?: any) {
    const prisma = tx || this.prisma;
    const booking = await prisma.booking.findFirst({
      where: {
        OR: [
          { id },
          { bookingCode: id },
        ],
      },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    const [user, hotel, bookingRooms, payments] = await Promise.all([
      prisma.user.findUnique({
        where: { id: booking.userId },
        select: { id: true, fullName: true, email: true, phone: true },
      }),
      prisma.hotel.findUnique({
        where: { id: booking.hotelId },
        select: { id: true, name: true, slug: true },
      }),
      prisma.bookingRoom.findMany({
        where: { bookingId: booking.id },
      }),
      prisma.payment.findMany({
        where: { bookingId: booking.id },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const rooms = await prisma.room.findMany({
      where: { id: { in: bookingRooms.map((br: any) => br.roomId) } },
    });
    const roomTypeIds = [...new Set(rooms.map((room: any) => room.roomTypeId))];
    const roomTypes = await prisma.roomType.findMany({
      where: { id: { in: roomTypeIds } },
      select: { id: true, name: true },
    });
    const roomMap = new Map(rooms.map((room: any) => [room.id, room]));
    const roomTypeMap = new Map(roomTypes.map((roomType: any) => [roomType.id, roomType]));

    return {
      ...booking,
      user,
      hotel,
      rooms: bookingRooms.map((bookingRoom: any) => {
        const room = roomMap.get(bookingRoom.roomId) as any;
        const roomType = room ? roomTypeMap.get(room.roomTypeId) as any : null;
        return {
          ...bookingRoom,
          roomNumber: room ? room.roomNumber : 'N/A',
          roomTypeName: roomType ? roomType.name : 'Unknown',
        };
      }),
      payments,
      _count: { payments: payments.length },
    };
  }

  async findByCode(code: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { bookingCode: code },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    return this.findOne(booking.id);
  }

  async findByUser(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.booking.count({ where: { userId } }),
    ]);

    const enriched = await Promise.all(
      bookings.map((booking) => this.findOne(booking.id)),
    );

    return {
      data: enriched,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async updateStatus(id: string, status: BookingStatus) {
    const booking = await this.findOne(id);

    // Validate status transitions
    const validTransitions: Record<string, string[]> = {
      PENDING: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['CHECKED_IN', 'CANCELLED', 'NO_SHOW'],
      CHECKED_IN: ['CHECKED_OUT'],
      CHECKED_OUT: ['REFUNDED'],
      CANCELLED: [],
      NO_SHOW: [],
      REFUNDED: [],
    };

    if (!validTransitions[booking.status]?.includes(status)) {
      throw new BadRequestException(
        `Cannot transition from ${booking.status} to ${status}`,
      );
    }

    const updateData: any = { status };

    if (status === 'CONFIRMED') updateData.confirmedAt = new Date();
    if (status === 'CHECKED_IN') updateData.checkedInAt = new Date();
    if (status === 'CHECKED_OUT') updateData.checkedOutAt = new Date();
    if (status === 'CANCELLED') {
      updateData.cancelledAt = new Date();
      // Release availability
      await this.releaseAvailability(booking.id);
    }

    return this.prisma.booking.update({
      where: { id: booking.id },
      data: updateData,
    });
  }

  async cancel(id: string, userId: string, reason?: string) {
    const booking = await this.findOne(id);

    if (booking.userId !== userId && !['SUPER_ADMIN', 'HOTEL_ADMIN'].includes('')) {
      throw new BadRequestException('You can only cancel your own bookings');
    }

    if (!['PENDING', 'CONFIRMED'].includes(booking.status)) {
      throw new BadRequestException('Cannot cancel this booking');
    }

    await this.releaseAvailability(booking.id);

    return this.prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancellation_reason: reason,
      },
    });
  }

  private async releaseAvailability(bookingId: string) {
    await this.prisma.roomAvailability.deleteMany({
      where: { bookingId },
    });
  }

  private async generateBookingCode(tx: any): Promise<string> {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const count = await tx.booking.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });
    return `BK-${today}-${String(count + 1).padStart(3, '0')}`;
  }
}
