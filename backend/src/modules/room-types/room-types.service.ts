import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaClientInitializationError } from '@prisma/client/runtime/library';
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
    const roomTypes = await this.prisma.roomType.findMany({
      where: { hotelId, isActive: true },
      orderBy: { createdAt: 'asc' },
    });

    return Promise.all(
      roomTypes.map(async (roomType) => ({
        ...roomType,
        _count: {
          rooms: await this.prisma.room.count({ where: { roomTypeId: roomType.id } }),
          reviews: await this.prisma.review.count({ where: { roomTypeId: roomType.id } }),
        },
      })),
    );
  }

  async findPublicByHotel(
    hotelId: string,
    query: { checkIn?: string; checkOut?: string; adults?: number },
  ) {
    const { checkIn, checkOut, adults } = query;

    if (checkIn && checkOut) {
      const startDate = new Date(checkIn);
      const endDate = new Date(checkOut);
      if (startDate >= endDate) {
        throw new BadRequestException('checkOut must be after checkIn');
      }
    }

    try {
      const roomTypes = await this.prisma.roomType.findMany({
        where: {
          hotelId,
          isActive: true,
          ...(adults ? { maxAdults: { gte: adults } } : {}),
        },
        orderBy: { createdAt: 'asc' },
        include: { images: true },
      });

      const availableRoomsEntries = await Promise.all(
        roomTypes.map(async (roomType) => [
          roomType.id,
          await this.prisma.room.count({
            where: { roomTypeId: roomType.id, isActive: true },
          }),
        ] as const),
      );
      const availableRoomsMap = new Map(availableRoomsEntries);

      return {
        hotelId,
        checkIn: checkIn ?? null,
        checkOut: checkOut ?? null,
        adults: adults ?? null,
        roomTypes: roomTypes.map((roomType) => ({
          id: roomType.id,
          name: roomType.name,
          slug: roomType.slug,
          description: roomType.description,
          basePrice: Number(roomType.basePrice),
          maxAdults: roomType.maxAdults,
          maxChildren: roomType.maxChildren,
          bedType: roomType.bedType,
          bedCount: roomType.bedCount,
          areaSize: roomType.areaSize,
          availableRooms: availableRoomsMap.get(roomType.id) ?? 0,
          images: Array.isArray(roomType.images)
            ? roomType.images.map((image: any) => ({
                url: image?.url ?? null,
                alt: image?.alt_text ?? null,
                isPrimary: Boolean(image?.is_primary),
              }))
            : [],
        })),
        source: 'database',
      };
    } catch (error: unknown) {
      if (
        !(error instanceof PrismaClientInitializationError) &&
        !(error instanceof NotFoundException)
      ) {
        throw error;
      }
    }

    const mockRoomTypes = [
      {
        id: 'mock-single',
        name: 'Phòng đơn',
        slug: 'phong-don',
        description: 'Phòng đơn ấm cúng, phù hợp cho 1 khách.',
        basePrice: 350000,
        maxAdults: 1,
        maxChildren: 0,
        bedType: BedType.SINGLE,
        bedCount: 1,
        areaSize: 18,
        availableRooms: 8,
        images: [{ url: '/images/MG_0454-300x255.jpg', alt: 'Phòng đơn', isPrimary: true }],
      },
      {
        id: 'mock-twin',
        name: 'Phòng đôi giường đơn',
        slug: 'phong-doi-giuong-don',
        description: 'Phòng rộng rãi với 2 giường đơn.',
        basePrice: 450000,
        maxAdults: 2,
        maxChildren: 1,
        bedType: BedType.TWIN,
        bedCount: 2,
        areaSize: 25,
        availableRooms: 10,
        images: [{ url: '/images/MG_0458-300x255.jpg', alt: 'Phòng twin', isPrimary: true }],
      },
      {
        id: 'mock-double',
        name: 'Phòng đôi giường kép',
        slug: 'phong-doi-giuong-kep',
        description: 'Phòng với 1 giường đôi lớn cho 2 khách.',
        basePrice: 500000,
        maxAdults: 2,
        maxChildren: 1,
        bedType: BedType.DOUBLE,
        bedCount: 1,
        areaSize: 28,
        availableRooms: 8,
        images: [{ url: '/images/MG_0478-300x255.jpg', alt: 'Phòng double', isPrimary: true }],
      },
    ];

    return {
      hotelId,
      checkIn: checkIn ?? null,
      checkOut: checkOut ?? null,
      adults: adults ?? null,
      roomTypes: adults
        ? mockRoomTypes.filter((roomType) => roomType.maxAdults >= adults)
        : mockRoomTypes,
      source: 'mock',
    };
  }

  async findOne(id: string) {
    const roomType = await this.prisma.roomType.findUnique({
      where: { id },
    });

    if (!roomType) throw new NotFoundException('Room type not found');
    const [hotel, rooms, pricing, reviewsRaw] = await Promise.all([
      this.prisma.hotel.findUnique({
        where: { id: roomType.hotelId },
        select: { id: true, name: true, slug: true },
      }),
      this.prisma.room.findMany({
        where: { roomTypeId: roomType.id, isActive: true },
        select: { id: true, roomNumber: true, floor: true, status: true },
        orderBy: { roomNumber: 'asc' },
      }),
      this.prisma.pricingRule.findMany({
        where: { roomTypeId: roomType.id, isActive: true },
        orderBy: { priority: 'desc' },
      }),
      this.prisma.review.findMany({
        where: { roomTypeId: roomType.id, isVisible: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    const userMap = new Map(
      (
        await this.prisma.user.findMany({
          where: { id: { in: reviewsRaw.map((review) => review.userId) } },
          select: { id: true, fullName: true },
        })
      ).map((u) => [u.id, u.fullName]),
    );

    const reviews = reviewsRaw.map((review) => ({
      ...review,
      user: { fullName: userMap.get(review.userId) ?? null },
    }));

    return {
      ...roomType,
      hotel,
      rooms,
      pricing,
      reviews,
    };
  }

  async findBySlug(hotelId: string, slug: string) {
    const roomType = await this.prisma.roomType.findUnique({
      where: { hotelId_slug: { hotelId, slug } },
    });

    if (!roomType) throw new NotFoundException('Room type not found');
    const [hotel, rooms, pricing, reviewsRaw, roomCount, reviewCount] =
      await Promise.all([
        this.prisma.hotel.findUnique({
          where: { id: roomType.hotelId },
          select: { id: true, name: true, slug: true },
        }),
        this.prisma.room.findMany({
          where: { roomTypeId: roomType.id, isActive: true },
          select: { id: true, roomNumber: true, floor: true, status: true },
          orderBy: { roomNumber: 'asc' },
        }),
        this.prisma.pricingRule.findMany({
          where: { roomTypeId: roomType.id, isActive: true },
          orderBy: { priority: 'desc' },
        }),
        this.prisma.review.findMany({
          where: { roomTypeId: roomType.id, isVisible: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
        }),
        this.prisma.room.count({ where: { roomTypeId: roomType.id } }),
        this.prisma.review.count({ where: { roomTypeId: roomType.id } }),
      ]);

    const userMap = new Map(
      (
        await this.prisma.user.findMany({
          where: { id: { in: reviewsRaw.map((review) => review.userId) } },
          select: { id: true, fullName: true },
        })
      ).map((u) => [u.id, u.fullName]),
    );

    const reviews = reviewsRaw.map((review) => ({
      ...review,
      user: { fullName: userMap.get(review.userId) ?? null },
    }));

    return {
      ...roomType,
      hotel,
      rooms,
      pricing,
      reviews,
      _count: { rooms: roomCount, reviews: reviewCount },
    };
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
