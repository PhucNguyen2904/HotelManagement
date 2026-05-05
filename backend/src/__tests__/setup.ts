import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/**
 * Test Database Setup & Teardown
 * Handles seed data creation and cleanup
 */

export async function setupTestDatabase() {
  // Clean up existing test data
  await cleanupTestDatabase();

  // Create test hotel
  const hotel = await prisma.hotel.create({
    data: {
      name: 'Test Hotel',
      slug: 'test-hotel',
      address: '123 Test St',
      city: 'Test City',
      province: 'Test Province',
      phone: '0123456789',
      email: 'hotel@test.com',
      checkInTime: '14:00',
      checkOutTime: '12:00',
      starRating: 4,
    },
  });

  // Create test room type
  const roomType = await prisma.roomType.create({
    data: {
      hotelId: hotel.id,
      name: 'Deluxe Room',
      slug: 'deluxe-room',
      description: 'Spacious room with a view',
      basePrice: 500000, // VND
      bedType: 'DOUBLE',
    },
  });

  // Create test rooms
  const room1 = await prisma.room.create({
    data: {
      roomTypeId: roomType.id,
      roomNumber: '101',
      floor: 1,
      isActive: true,
    },
  });

  const room2 = await prisma.room.create({
    data: {
      roomTypeId: roomType.id,
      roomNumber: '102',
      floor: 1,
      isActive: true,
    },
  });

  // Create test user (admin)
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@test.com',
      fullName: 'Test Admin',
      passwordHash: await bcrypt.hash('Test@123456', 10),
      phone: '0987654321',
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });

  // Create test user (guest)
  const guestUser = await prisma.user.create({
    data: {
      email: 'guest@test.com',
      fullName: 'Test Guest',
      passwordHash: await bcrypt.hash('Guest@123456', 10),
      phone: '0987654322',
      role: 'GUEST',
      isActive: true,
    },
  });

  return {
    hotel,
    roomType,
    rooms: [room1, room2],
    adminUser,
    guestUser,
  };
}

export async function cleanupTestDatabase() {
  // Delete in order of foreign key dependencies
  await prisma.roomAvailability.deleteMany({});
  await prisma.bookingRoom.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.room.deleteMany({});
  await prisma.roomType.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.hotel.deleteMany({});
}

export async function closeTestDatabase() {
  await prisma.$disconnect();
}

export { prisma };
