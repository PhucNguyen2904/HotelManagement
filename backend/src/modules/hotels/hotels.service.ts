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
    return this.prisma.hotel.findMany({
      where: { isActive: true },
      include: {
        _count: { select: { roomTypes: true, bookings: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { id },
      include: {
        roomTypes: {
          where: { isActive: true },
          include: {
            _count: { select: { rooms: true } },
            images: { where: { isPrimary: true }, take: 1 },
          },
          orderBy: { sortOrder: 'asc' },
        },
        taxRates: { where: { isActive: true } },
        _count: { select: { bookings: true } },
      },
    });

    if (!hotel) throw new NotFoundException('Hotel not found');
    return hotel;
  }

  async findBySlug(slug: string) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { slug },
      include: {
        roomTypes: {
          where: { isActive: true },
          include: {
            images: true,
            amenities: { include: { amenity: true } },
            _count: { select: { rooms: true } },
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!hotel) throw new NotFoundException('Hotel not found');
    return hotel;
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
