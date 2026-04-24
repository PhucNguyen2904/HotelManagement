import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreateRoomDto, UpdateRoomDto } from './dto/room.dto';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateRoomDto) {
    const room = await this.prisma.room.create({ data: dto });
    const roomType = await this.prisma.roomType.findUnique({
      where: { id: room.roomTypeId },
      select: { name: true },
    });

    return {
      ...room,
      roomType,
    };
  }

  async findAllByHotel(hotelId: string) {
    const roomTypes = await this.prisma.roomType.findMany({
      where: {
        hotelId,
        isActive: true,
      },
      select: { id: true, name: true, basePrice: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    if (roomTypes.length === 0) return [];

    const roomTypeMap = new Map(roomTypes.map((rt) => [rt.id, rt]));
    const rooms = await this.prisma.room.findMany({
      where: {
        isActive: true,
        roomTypeId: { in: roomTypes.map((rt) => rt.id) },
      },
      orderBy: [{ roomTypeId: 'asc' }, { roomNumber: 'asc' }],
    });

    return rooms
      .map((room) => ({
        ...room,
        roomType: roomTypeMap.get(room.roomTypeId) ?? null,
      }))
      .sort((a, b) => {
        const sortA = a.roomType?.createdAt ? new Date(a.roomType.createdAt).getTime() : 0;
        const sortB = b.roomType?.createdAt ? new Date(b.roomType.createdAt).getTime() : 0;
        if (sortA !== sortB) return sortA - sortB;
        return a.roomNumber.localeCompare(b.roomNumber);
      });
  }

  async findOne(id: string) {
    const room = await this.prisma.room.findUnique({
      where: { id },
    });

    if (!room) throw new NotFoundException('Room not found');

    const [roomType, availability] = await Promise.all([
      this.prisma.roomType.findUnique({
        where: { id: room.roomTypeId },
      }),
      this.prisma.roomAvailability.findMany({
        where: { roomId: room.id, date: { gte: new Date() } },
        orderBy: { date: 'asc' },
        take: 60,
      }),
    ]);

    return {
      ...room,
      roomType,
      availability,
    };
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
