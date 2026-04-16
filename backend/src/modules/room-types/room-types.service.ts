import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreateRoomTypeDto, UpdateRoomTypeDto } from './dto/room-type.dto';
import { BedType } from '@prisma/client';

/**
 * Business rules cho room types:
 * - SINGLE: capacity=1, bedCount=1, bedType=SINGLE
 * - TWIN: capacity=2, bedCount=2, bedType=SINGLE (2 giường đơn)
 * - DOUBLE: capacity=2, bedCount=1, bedType=DOUBLE
 */
@Injectable()
export class RoomTypesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Validate và auto-correct bedCount dựa trên bedType
   * - TWIN: bedCount phải = 2 (2 giường đơn)
   * - SINGLE/DOUBLE/QUEEN/KING: bedCount mặc định = 1
   */
  private validateAndNormalizeBedData(dto: CreateRoomTypeDto | UpdateRoomTypeDto): {
    bedType?: BedType;
    bedCount?: number;
    maxAdults?: number;
  } {
    const result: { bedType?: BedType; bedCount?: number; maxAdults?: number } = {};

    if (dto.bedType !== undefined) {
      result.bedType = dto.bedType;

      // Auto-set bedCount based on bedType if not provided
      if (dto.bedCount === undefined) {
        result.bedCount = dto.bedType === BedType.TWIN ? 2 : 1;
      } else {
        result.bedCount = dto.bedCount;
      }

      // Validate bedCount phù hợp với bedType
      if (dto.bedType === BedType.TWIN && result.bedCount < 2) {
        throw new BadRequestException(
          'Twin room phải có ít nhất 2 giường (bedCount >= 2)',
        );
      }

      if (dto.bedType === BedType.SINGLE && result.bedCount !== 1) {
        throw new BadRequestException(
          'Single room chỉ có 1 giường (bedCount = 1)',
        );
      }

      // Auto-set maxAdults based on bedType if not provided
      if (dto.maxAdults === undefined) {
        result.maxAdults = dto.bedType === BedType.SINGLE ? 1 : 2;
      }
    } else if (dto.bedCount !== undefined) {
      result.bedCount = dto.bedCount;
    }

    return result;
  }

  async create(hotelId: string, dto: CreateRoomTypeDto) {
    const normalizedData = this.validateAndNormalizeBedData(dto);

    return this.prisma.roomType.create({
      data: {
        ...dto,
        ...normalizedData,
        hotelId,
      },
    });
  }

  async findAllByHotel(hotelId: string) {
    return this.prisma.roomType.findMany({
      where: { hotelId, isActive: true },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        amenities: { include: { amenity: true } },
        _count: {
          select: {
            rooms: { where: { isActive: true } },
            reviews: { where: { isVisible: true } },
          },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(id: string) {
    const roomType = await this.prisma.roomType.findUnique({
      where: { id },
      include: {
        hotel: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { sortOrder: 'asc' } },
        amenities: { include: { amenity: true } },
        rooms: {
          where: { isActive: true },
          select: { id: true, roomNumber: true, floor: true, status: true },
          orderBy: { roomNumber: 'asc' },
        },
        pricing: {
          where: { isActive: true },
          orderBy: { priority: 'desc' },
        },
        reviews: {
          where: { isVisible: true },
          include: {
            user: { select: { fullName: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!roomType) throw new NotFoundException('Room type not found');
    return roomType;
  }

  async findBySlug(hotelId: string, slug: string) {
    const roomType = await this.prisma.roomType.findUnique({
      where: { hotelId_slug: { hotelId, slug } },
      include: {
        hotel: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { sortOrder: 'asc' } },
        amenities: { include: { amenity: true } },
        rooms: {
          where: { isActive: true },
          select: { id: true, roomNumber: true, floor: true, status: true },
          orderBy: { roomNumber: 'asc' },
        },
        pricing: {
          where: { isActive: true },
          orderBy: { priority: 'desc' },
        },
        reviews: {
          where: { isVisible: true },
          include: {
            user: { select: { fullName: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: {
            rooms: { where: { isActive: true } },
            reviews: { where: { isVisible: true } },
          },
        },
      },
    });

    if (!roomType) throw new NotFoundException('Room type not found');
    return roomType;
  }

  async update(id: string, dto: UpdateRoomTypeDto) {
    await this.findOne(id);
    const normalizedData = this.validateAndNormalizeBedData(dto);

    return this.prisma.roomType.update({
      where: { id },
      data: { ...dto, ...normalizedData },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.roomType.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
