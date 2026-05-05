import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreateRoomDto, UpdateRoomDto } from './dto/room.dto';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateRoomDto) {
    return this.prisma.room.create({
      data: dto,
      include: { roomType: { select: { name: true } } },
    });
  }

  async findAllByHotel(hotelId: string) {
    return this.prisma.room.findMany({
      where: {
        isActive: true,
        roomType: { hotel: { id: hotelId } },
      },
      include: {
        roomType: { select: { id: true, name: true, basePrice: true } },
      },
      orderBy: [{ roomTypeId: 'asc' }, { roomNumber: 'asc' }],
    });
  }

  async findOne(id: string) {
    const room = await this.prisma.room.findUnique({
      where: { id },
      include: {
        roomType: true,
      },
    });

    if (!room) throw new NotFoundException('Room not found');

    return room;
  }

  async update(id: string, dto: UpdateRoomDto) {
    await this.findOne(id);
    return this.prisma.room.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.room.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
