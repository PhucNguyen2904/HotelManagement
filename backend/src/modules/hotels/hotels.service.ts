import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreateHotelDto, UpdateHotelDto } from './dto/hotel.dto';

@Injectable()
export class HotelsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateHotelDto) {
    return this.prisma.hotel.create({ data: dto });
  }

  async findAll() {
    const hotels = await this.prisma.hotel.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    const enriched = await Promise.all(
      hotels.map(async (hotel) => {
        const [roomTypes, bookings] = await Promise.all([
          this.prisma.roomType.count({ where: { hotelId: hotel.id } }),
          this.prisma.booking.count({ where: { hotelId: hotel.id } }),
        ]);
        return {
          ...hotel,
          _count: { roomTypes, bookings },
        };
      }),
    );

    return enriched;
  }

  async findOne(id: string) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { id },
    });

    if (!hotel) throw new NotFoundException('Hotel not found');

    const [roomTypes, bookingCount] = await Promise.all([
      this.prisma.roomType.findMany({
        where: { hotelId: hotel.id, isActive: true },
        orderBy: { createdAt: 'asc' },
        include: { images: true },
      }),
      this.prisma.booking.count({ where: { hotelId: hotel.id } }),
    ]);

    const roomTypesWithCount = await Promise.all(
      roomTypes.map(async (roomType) => ({
        ...roomType,
        _count: {
          rooms: await this.prisma.room.count({ where: { roomTypeId: roomType.id } }),
        },
        images: Array.isArray(roomType.images)
          ? roomType.images.filter((img: any) => img?.is_primary).slice(0, 1)
          : [],
      })),
    );

    return {
      ...hotel,
      roomTypes: roomTypesWithCount,
      _count: { bookings: bookingCount },
    };
  }

  async findBySlug(slug: string) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { slug },
    });

    if (!hotel) throw new NotFoundException('Hotel not found');

    const roomTypes = await this.prisma.roomType.findMany({
      where: { hotelId: hotel.id, isActive: true },
      orderBy: { createdAt: 'asc' },
    });

    const roomTypesWithCount = await Promise.all(
      roomTypes.map(async (roomType) => ({
        ...roomType,
        _count: {
          rooms: await this.prisma.room.count({ where: { roomTypeId: roomType.id } }),
        },
      })),
    );

    return {
      ...hotel,
      roomTypes: roomTypesWithCount,
    };
  }

  async update(id: string, dto: UpdateHotelDto) {
    await this.findOne(id);
    return this.prisma.hotel.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.hotel.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
