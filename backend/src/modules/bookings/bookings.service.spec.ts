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
        rooms: [{ roomId: 'room-1', adults: 1 }],
      };

      prismaService.$transaction.mockImplementation(async (callback) => {
        return callback({
          room: {
            findMany: jest.fn().mockResolvedValue([
              { 
                id: 'room-1', 
                roomTypeId: 'roomtype-1', 
                isActive: true,
                roomNumber: '101',
                roomType: { basePrice: 500000, name: 'Deluxe' }
              },
            ]),
          },
          roomAvailability: {
            findMany: jest.fn().mockResolvedValue([]),
            createMany: jest.fn().mockResolvedValue({ count: 2 }),
          },
          bookingRoom: {
            createMany: jest.fn().mockResolvedValue({ count: 1 }),
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
              user: { id: 'user-1', fullName: 'Test', email: 'test@test.com', phone: '123' },
              hotel: { id: 'hotel-1', name: 'Hotel', slug: 'hotel' },
              bookingRooms: [],
              payments: [],
              review: null,
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
          taxRate: {
            findFirst: jest.fn().mockResolvedValue({
              id: 'tax-1',
              rate: 10,
            }),
          },
        } as any);
      });

      const result = await service.create('user-1', createDto);

      expect(result).toHaveProperty('id');
      expect(result.status).toBe('PENDING');
    });

    it('should throw BadRequestException if checkOut before checkIn', async () => {
      const createDto = {
        checkIn: new Date('2025-06-03'),
        checkOut: new Date('2025-06-01'),
        rooms: [{ roomId: 'room-1', price: 500000 }],
        totalPrice: 1000000,
      };

      await expect(service.create('user-1', createDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should reject stay longer than 30 nights', async () => {
      const createDto = {
        checkIn: new Date('2025-06-01'),
        checkOut: new Date('2025-08-01'),
        rooms: [{ roomId: 'room-1', price: 500000 }],
        totalPrice: 1000000,
      };

      await expect(service.create('user-1', createDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should prevent overbooking with Serializable transaction', async () => {
      const createDto = {
        checkIn: new Date('2025-06-01'),
        checkOut: new Date('2025-06-03'),
        rooms: [{ roomId: 'room-1', price: 500000 }],
        totalPrice: 1000000,
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

      const result = await service.findAll('user-1', 1, 10);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return booking by id', async () => {
      prismaService.booking.findUnique.mockResolvedValue(mockBooking);

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
      prismaService.roomAvailability.deleteMany.mockResolvedValue({ count: 2 });
      prismaService.booking.update.mockResolvedValue({
        ...pendingBooking,
        status: 'CANCELLED',
        cancelledAt: new Date(),
      });

      const result = await service.cancel('booking-1', 'user-1');

      expect(result.status).toBe('CANCELLED');
    });

    it('should prevent cancelling checked-in bookings', async () => {
      const checkedInBooking = { ...mockBooking, status: 'CHECKED_IN', userId: 'user-1' };
      prismaService.booking.findUnique.mockResolvedValue(checkedInBooking);

      await expect(service.cancel('booking-1', 'user-1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
