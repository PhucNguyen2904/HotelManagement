import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { createMockPrismaService, mockBooking } from '../../__tests__/mocks';
import { PrismaService } from '../../prisma/prisma.service';

describe('BookingsService (Unit)', () => {
  let service: BookingsService;
  let prismaService: any;

  beforeEach(async () => {
    const mockPrisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    prismaService = module.get(PrismaService);
  });

  describe('create', () => {
    it('should create a booking with valid dates', async () => {
      const checkInStr = '2025-06-01';
      const checkOutStr = '2025-06-03';

      const createDto = {
        hotelId: 'hotel-1',
        checkIn: checkInStr,
        checkOut: checkOutStr,
        rooms: [{ roomTypeId: 'roomtype-1', adults: 1 }],
      };

      prismaService.$transaction.mockImplementation(async (callback) => {
        return callback({
          roomType: {
            findMany: jest.fn().mockResolvedValue([
              { id: 'roomtype-1', basePrice: 500000, name: 'Deluxe' },
            ]),
          },
          room: {
            findMany: jest.fn().mockResolvedValue([
              { 
                id: 'room-1', 
                roomTypeId: 'roomtype-1', 
                isActive: true,
                roomNumber: '101',
              },
            ]),
          },
          roomAvailability: {
            findMany: jest.fn().mockResolvedValue([]),
            createMany: jest.fn().mockResolvedValue({ count: 2 }),
          },
          bookingRoom: {
            createMany: jest.fn().mockResolvedValue({ count: 1 }),
            findMany: jest.fn().mockResolvedValue([]),
          },
          booking: {
            findFirst: jest.fn().mockResolvedValue(null),
            findUnique: jest.fn().mockResolvedValue({
              id: 'booking-1',
              bookingCode: 'BK-001',
              userId: 'user-1',
              hotelId: 'hotel-1',
              status: 'PENDING',
              checkIn: new Date(checkInStr),
              checkOut: new Date(checkOutStr),
              totalNights: 2,
              subtotal: 1000000,
              taxRate: 10,
              taxAmount: 100000,
              totalAmount: 1100000,
            }),
            create: jest.fn().mockResolvedValue({
              id: 'booking-1',
              bookingCode: 'BK-001',
              userId: 'user-1',
              hotelId: 'hotel-1',
              status: 'PENDING',
              checkIn: new Date(checkInStr),
              checkOut: new Date(checkOutStr),
              totalNights: 2,
              subtotal: 1000000,
              taxRate: 10,
              taxAmount: 100000,
              totalAmount: 1100000,
            }),
            count: jest.fn().mockResolvedValue(0),
          },
          user: {
            findUnique: jest.fn().mockResolvedValue({ id: 'user-1', fullName: 'Test', email: 'test@test.com', phone: '123' }),
          },
          hotel: {
            findUnique: jest.fn().mockResolvedValue({ id: 'hotel-1', name: 'Hotel', slug: 'hotel' }),
          },
          payment: {
            findMany: jest.fn().mockResolvedValue([]),
          },
        } as any);
      });

      const result = await service.create('user-1', createDto);

      expect(result).toHaveProperty('id');
      expect(result.status).toBe('PENDING');
    });

    it('should throw BadRequestException if checkOut before checkIn', async () => {
      const createDto = {
        hotelId: 'hotel-1',
        checkIn: '2025-06-03',
        checkOut: '2025-06-01',
        rooms: [{ roomTypeId: 'roomtype-1', adults: 1 }],
      };

      await expect(service.create('user-1', createDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should reject stay longer than 30 nights', async () => {
      const createDto = {
        hotelId: 'hotel-1',
        checkIn: '2025-06-01',
        checkOut: '2025-08-01',
        rooms: [{ roomTypeId: 'roomtype-1', adults: 1 }],
      };

      await expect(service.create('user-1', createDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should prevent overbooking with Serializable transaction', async () => {
      const createDto = {
        hotelId: 'hotel-1',
        checkIn: '2025-06-01',
        checkOut: '2025-06-03',
        rooms: [{ roomTypeId: 'roomtype-1', adults: 1 }],
      };

      prismaService.$transaction.mockRejectedValue(
        new Error('Unique constraint failed'),
      );

      await expect(service.create('user-1', createDto)).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should return paginated bookings for user', async () => {
      const mockBookings = [mockBooking];
      prismaService.booking.findMany.mockResolvedValue(mockBookings);
      prismaService.booking.count.mockResolvedValue(1);
      // findOne calls these for each booking in the list
      prismaService.booking.findUnique.mockResolvedValue(mockBooking);
      prismaService.user.findUnique.mockResolvedValue({ id: 'user-1', fullName: 'Test', email: 'test@test.com', phone: '123' });
      prismaService.hotel.findUnique.mockResolvedValue({ id: 'hotel-1', name: 'Hotel', slug: 'hotel' });
      prismaService.bookingRoom.findMany.mockResolvedValue([]);
      prismaService.payment.findMany.mockResolvedValue([]);
      prismaService.room.findMany.mockResolvedValue([]);
      prismaService.roomType.findMany.mockResolvedValue([]);

      const result = await service.findByUser('user-1', 1, 10);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return booking by id', async () => {
      prismaService.booking.findUnique.mockResolvedValue(mockBooking);
      prismaService.user.findUnique.mockResolvedValue({ id: 'user-1', fullName: 'Test', email: 'test@test.com', phone: '123' });
      prismaService.hotel.findUnique.mockResolvedValue({ id: 'hotel-1', name: 'Hotel', slug: 'hotel' });
      prismaService.bookingRoom.findMany.mockResolvedValue([]);
      prismaService.payment.findMany.mockResolvedValue([]);
      prismaService.room.findMany.mockResolvedValue([]);
      prismaService.roomType.findMany.mockResolvedValue([]);

      const result = await service.findOne('booking-1');

      expect(result.id).toBe('booking-1');
      expect(result.status).toBe('CONFIRMED');
    });

    it('should throw NotFoundException if booking not found', async () => {
      prismaService.booking.findUnique.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('cancel', () => {
    it('should cancel a booking with pending status', async () => {
      const pendingBooking = { ...mockBooking, status: 'PENDING', userId: 'user-1' };
      prismaService.booking.findUnique.mockResolvedValue(pendingBooking);
      prismaService.user.findUnique.mockResolvedValue({ id: 'user-1', fullName: 'Test', email: 'test@test.com', phone: '123' });
      prismaService.hotel.findUnique.mockResolvedValue({ id: 'hotel-1', name: 'Hotel', slug: 'hotel' });
      prismaService.bookingRoom.findMany.mockResolvedValue([]);
      prismaService.payment.findMany.mockResolvedValue([]);
      prismaService.room.findMany.mockResolvedValue([]);
      prismaService.roomType.findMany.mockResolvedValue([]);
      prismaService.roomAvailability.deleteMany.mockResolvedValue({ count: 2 });
      prismaService.booking.update.mockResolvedValue({
        ...pendingBooking,
        status: 'CANCELLED',
        cancelledAt: new Date(),
      });

      const result = await service.cancel('booking-1', 'user-1', 'USER');

      expect(result.status).toBe('CANCELLED');
    });

    it('should prevent cancelling checked-in bookings', async () => {
      const checkedInBooking = { ...mockBooking, status: 'CHECKED_IN', userId: 'user-1' };
      prismaService.booking.findUnique.mockResolvedValue(checkedInBooking);
      prismaService.user.findUnique.mockResolvedValue({ id: 'user-1', fullName: 'Test', email: 'test@test.com', phone: '123' });
      prismaService.hotel.findUnique.mockResolvedValue({ id: 'hotel-1', name: 'Hotel', slug: 'hotel' });
      prismaService.bookingRoom.findMany.mockResolvedValue([]);
      prismaService.payment.findMany.mockResolvedValue([]);
      prismaService.room.findMany.mockResolvedValue([]);
      prismaService.roomType.findMany.mockResolvedValue([]);

      await expect(service.cancel('booking-1', 'user-1', 'USER')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
