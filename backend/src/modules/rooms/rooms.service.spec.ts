import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { createMockPrismaService, mockRoom, mockRoom2, mockRoomType } from '../../__tests__/mocks';
import { PrismaService } from '../../prisma/prisma.service';

describe('RoomsService (Unit)', () => {
  let service: RoomsService;
  let prismaService: any;

  beforeEach(async () => {
    const mockPrisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<RoomsService>(RoomsService);
    prismaService = module.get(PrismaService);
  });

  describe('create', () => {
    it('should create a new room', async () => {
      const createDto = {
        roomTypeId: 'roomtype-1',
        roomNumber: '101',
        floor: 1,
        isActive: true,
      };

      prismaService.room.create.mockResolvedValue({
        ...createDto,
        id: 'room-1',
        status: 'AVAILABLE',
        createdAt: new Date(),
        updatedAt: new Date(),
        roomType: { name: 'Deluxe Room' },
      });

      const result = await service.create(createDto);

      expect(result).toHaveProperty('id');
      expect(result.roomNumber).toBe('101');
      expect(prismaService.room.create).toHaveBeenCalledWith({
        data: createDto,
        include: { roomType: { select: { name: true } } },
      });
    });
  });

  describe('findAllByHotel', () => {
    it('should return all active rooms for a hotel', async () => {
      const mockRooms = [mockRoom, mockRoom2];
      prismaService.room.findMany.mockResolvedValue(mockRooms);

      const result = await service.findAllByHotel('hotel-1');

      expect(result).toHaveLength(2);
      expect(result[0].roomNumber).toBe('101');
      expect(prismaService.room.findMany).toHaveBeenCalledWith({
        where: {
          isActive: true,
          roomType: { hotel: { id: 'hotel-1' } },
        },
        include: expect.any(Object),
        orderBy: expect.any(Array),
      });
    });

    it('should return empty array when no rooms exist', async () => {
      prismaService.room.findMany.mockResolvedValue([]);

      const result = await service.findAllByHotel('hotel-2');

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return room with availability data', async () => {
      prismaService.room.findUnique.mockResolvedValue({
        ...mockRoom,
        roomType: mockRoomType,
      });

      const result = await service.findOne('room-1');

      expect(result.id).toBe('room-1');
      expect(prismaService.room.findUnique).toHaveBeenCalledWith({
        where: { id: 'room-1' },
        include: {
          roomType: true,
        },
      });
    });

    it('should throw NotFoundException when room not found', async () => {
      prismaService.room.findUnique.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update room details', async () => {
      const updateDto = { floor: 2 };
      prismaService.room.findUnique.mockResolvedValue(mockRoom);
      prismaService.room.update.mockResolvedValue({
        ...mockRoom,
        floor: 2,
      });

      const result = await service.update('room-1', updateDto);

      expect(result.floor).toBe(2);
      expect(prismaService.room.update).toHaveBeenCalledWith({
        where: { id: 'room-1' },
        data: updateDto,
      });
    });

    it('should not update non-existent room', async () => {
      prismaService.room.findUnique.mockResolvedValue(null);

      await expect(service.update('nonexistent', { floor: 2 })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should soft delete room', async () => {
      prismaService.room.findUnique.mockResolvedValue(mockRoom);
      prismaService.room.update.mockResolvedValue({
        ...mockRoom,
        isActive: false,
      });

      const result = await service.remove('room-1');

      expect(result.isActive).toBe(false);
    });
  });
});
