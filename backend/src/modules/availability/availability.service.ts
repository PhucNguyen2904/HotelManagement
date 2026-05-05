import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma';

@Injectable()
export class AvailabilityService {
  constructor(private prisma: PrismaService) {}

  /**
   * Tìm phòng trống theo khoảng ngày
   * Returns room types có phòng available cho TẤT CẢ các ngày
   */
  async checkAvailability(hotelId: string, checkIn: string, checkOut: string) {
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    if (startDate >= endDate) {
      throw new BadRequestException('Check-out must be after check-in');
    }

    const totalNights = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / 86400000,
    );

    // Generate date array
    const dates: Date[] = [];
    for (
      let d = new Date(startDate);
      d < endDate;
      d.setDate(d.getDate() + 1)
    ) {
      dates.push(new Date(d));
    }

    // Get all room types for this hotel
    const roomTypes = await this.prisma.roomType.findMany({
      where: { hotelId, isActive: true },
      orderBy: { createdAt: 'asc' },
      include: { images: true, amenities: true },
    });

    const result: any[] = [];

    for (const roomType of roomTypes) {
      const rooms = await this.prisma.room.findMany({
        where: {
          roomTypeId: roomType.id,
          isActive: true,
          status: 'AVAILABLE',
        },
      });
      const availableRooms: any[] = [];

      for (const room of rooms) {
        // Check if this room has any bookings for the date range
        const bookedDays = await this.prisma.roomAvailability.count({
          where: {
            roomId: room.id,
            date: { in: dates },
            status: { not: 'AVAILABLE' },
          },
        });

        if (bookedDays === 0) {
          availableRooms.push({
            id: room.id,
            roomNumber: room.roomNumber,
            floor: room.floor,
          });
        }
      }

      if (availableRooms.length > 0) {
        result.push({
          roomType: {
            id: roomType.id,
            name: roomType.name,
            slug: roomType.slug,
            description: roomType.description,
            basePrice: roomType.basePrice,
            maxAdults: roomType.maxAdults,
            maxChildren: roomType.maxChildren,
            bedType: roomType.bedType,
            areaSize: roomType.areaSize,
            image: Array.isArray(roomType.images)
              ? roomType.images.find((image: any) => image?.is_primary) ?? roomType.images[0] ?? null
              : null,
            amenities: Array.isArray(roomType.amenities) ? roomType.amenities : [],
          },
          availableCount: availableRooms.length,
          totalRooms: rooms.length,
          rooms: availableRooms,
          pricing: {
            pricePerNight: Number(roomType.basePrice),
            totalNights,
            totalPrice: Number(roomType.basePrice) * totalNights,
          },
        });
      }
    }

    return {
      hotelId,
      checkIn,
      checkOut,
      totalNights,
      availableRoomTypes: result,
    };
  }

  /**
   * Get calendar view of a room's availability
   */
  async getRoomCalendar(roomId: string, month: number, year: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // Last day of month

    const availability = await this.prisma.roomAvailability.findMany({
      where: {
        roomId,
        date: { gte: startDate, lte: endDate },
      },
      orderBy: { date: 'asc' },
    });

    // Fill in missing days as AVAILABLE
    const calendar: any[] = [];
    const daysInMonth = endDate.getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const entry = availability.find(
        (a) => a.date.toISOString().slice(0, 10) === date.toISOString().slice(0, 10),
      );

      calendar.push({
        date: date.toISOString().slice(0, 10),
        status: entry?.status || 'AVAILABLE',
        bookingId: entry?.bookingId || null,
      });
    }

    return { roomId, month, year, calendar };
  }
}
