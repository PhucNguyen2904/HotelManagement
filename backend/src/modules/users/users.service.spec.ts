import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { createMockPrismaService, mockUser, mockAdmin } from '../../__tests__/mocks';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

describe('UsersService (Unit)', () => {
  let service: UsersService;
  let prismaService: any;

  beforeEach(async () => {
    const mockPrisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get(PrismaService);
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const mockUsers = [mockUser, mockAdmin];
      prismaService.user.findMany.mockResolvedValue(mockUsers);
      prismaService.user.count.mockResolvedValue(2);

      const result = await service.findAll(1, 10);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.data).toEqual(mockUsers);
      expect(result.meta.total).toBe(2);
      expect(result.meta.page).toBe(1);
      expect(prismaService.user.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        select: expect.any(Object),
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should handle pagination correctly on page 2', async () => {
      prismaService.user.findMany.mockResolvedValue([mockUser]);
      prismaService.user.count.mockResolvedValue(25);

      await service.findAll(2, 10);

      expect(prismaService.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      prismaService.user.findUnique.mockResolvedValue({
        ...mockUser,
      });
      prismaService.booking.count.mockResolvedValue(2);
      prismaService.review.count.mockResolvedValue(1);

      const result = await service.findOne('user-1');

      expect(result).toEqual(expect.objectContaining({
        id: mockUser.id,
        email: mockUser.email,
      }));
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        select: expect.any(Object),
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update user fields', async () => {
      const updateDto = { fullName: 'Updated Name' };
      prismaService.user.findUnique.mockResolvedValue(mockUser);
      prismaService.booking.count.mockResolvedValue(0);
      prismaService.review.count.mockResolvedValue(0);
      prismaService.user.update.mockResolvedValue({
        ...mockUser,
        fullName: updateDto.fullName,
      });

      const result = await service.update('user-1', updateDto);

      expect(result.fullName).toBe('Updated Name');
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: updateDto,
        select: expect.any(Object),
      });
    });

    it('should not allow updating email to existing one', async () => {
      const updateDto = { email: 'admin@test.com' }; // already exists
      prismaService.user.findUnique.mockResolvedValue(mockUser);
      prismaService.booking.count.mockResolvedValue(0);
      prismaService.review.count.mockResolvedValue(0);
      prismaService.user.update.mockRejectedValue(
        new Error('Unique constraint failed'),
      );

      await expect(service.update('user-1', updateDto)).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('should soft delete user', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockUser);
      prismaService.booking.count.mockResolvedValue(0);
      prismaService.review.count.mockResolvedValue(0);
      prismaService.user.update.mockResolvedValue({
        ...mockUser,
        isActive: false,
      });

      const result = await service.remove('user-1');

      expect(result.isActive).toBe(false);
    });
  });
});
