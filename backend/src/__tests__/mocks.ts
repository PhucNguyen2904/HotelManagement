/**
 * Mock Helpers for Unit Tests
 * Mock PrismaService and other dependencies
 */

import { PrismaService } from '../prisma/prisma.service';

export function createMockPrismaService(): Partial<PrismaService> {
  return {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    } as any,
    room: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any,
    roomType: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any,
    booking: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    } as any,
    roomAvailability: {
      findMany: jest.fn(),
      create: jest.fn(),
      createMany: jest.fn(),
      update: jest.fn(),
      upsert: jest.fn(),
      deleteMany: jest.fn(),
    } as any,
    bookingRoom: {
      findMany: jest.fn(),
      create: jest.fn(),
      createMany: jest.fn(),
      delete: jest.fn(),
    } as any,
    payment: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    } as any,
    hotel: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    } as any,
    review: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    } as any,
    $transaction: jest.fn(),
  };
}

/**
 * Mock data factories for tests
 */

export const mockUser = {
  id: 'user-1',
  email: 'guest@test.com',
  fullName: 'Test Guest',
  password: 'hashed_password',
  phone: '0987654321',
  address: '123 Test St',
  idNumber: null,
  role: 'GUEST' as const,
  isActive: true,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
};

export const mockAdmin = {
  ...mockUser,
  id: 'admin-1',
  email: 'admin@test.com',
  fullName: 'Test Admin',
  role: 'SUPER_ADMIN' as const,
};

export const mockHotel = {
  id: 'hotel-1',
  name: 'Test Hotel',
  slug: 'test-hotel',
  description: 'Test hotel description',
  address: '123 Hotel St',
  city: 'Test City',
  province: 'Test Province',
  phone: '0123456789',
  email: 'hotel@test.com',
  website: null,
  starRating: 4,
  checkInTime: '14:00',
  checkOutTime: '12:00',
  logoUrl: null,
  coverUrl: null,
  isActive: true,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
};

export const mockRoomType = {
  id: 'roomtype-1',
  hotelId: 'hotel-1',
  name: 'Deluxe Room',
  description: 'Spacious deluxe room',
  basePrice: 500000,
  maxGuests: 2,
  bedType: 'DOUBLE' as const,
  amenities: ['WiFi', 'AC', 'TV'],
  sortOrder: 1,
  isActive: true,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
};

export const mockRoom = {
  id: 'room-1',
  roomTypeId: 'roomtype-1',
  roomNumber: '101',
  floor: 1,
  status: 'AVAILABLE' as const,
  isActive: true,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
};

export const mockRoom2 = {
  ...mockRoom,
  id: 'room-2',
  roomNumber: '102',
};

export const mockBooking = {
  id: 'booking-1',
  userId: 'user-1',
  hotelId: 'hotel-1',
  checkIn: new Date('2025-06-01'),
  checkOut: new Date('2025-06-03'),
  totalPrice: 1000000,
  status: 'CONFIRMED' as const,
  notes: null,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
};

export const mockAvailability = {
  id: 'avail-1',
  roomId: 'room-1',
  date: new Date('2025-06-01'),
  status: 'AVAILABLE' as const,
  price: 500000,
  notes: null,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
};

export const mockPayment = {
  id: 'payment-1',
  bookingId: 'booking-1',
  amount: 1000000,
  method: 'VNPAY' as const,
  status: 'COMPLETED' as const,
  transactionId: 'txn-123',
  metadata: {},
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
};
