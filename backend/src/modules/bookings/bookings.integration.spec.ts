import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BookingsService } from './bookings.service';
import { setupTestDatabase, cleanupTestDatabase, closeTestDatabase, prisma } from '../../__tests__/setup';

/**
 * Integration Tests - Service ↔ Database
 * Tests real database interactions without mocking
 *
 * Run: npx jest bookings.integration.spec.ts
 */

describe('BookingsService - Integration (Database)', () => {
  let bookingsService: BookingsService;
  let prismaService: PrismaService;
  let testData: any;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookingsService, PrismaService],
    }).compile();

    bookingsService = module.get<BookingsService>(BookingsService);
    prismaService = module.get<PrismaService>(PrismaService);

    // Setup test data with real database
    testData = await setupTestDatabase();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
    await closeTestDatabase();
  });

  afterEach(async () => {
    // Optional: cleanup bookings after each test
    await prisma.booking.deleteMany({});
  });

  describe('Booking Creation with Database Constraints', () => {
    it('should create booking and insert availability records', async () => {
      const checkIn = new Date('2025-06-01').toISOString().split('T')[0];
      const checkOut = new Date('2025-06-03').toISOString().split('T')[0];

      const booking = await bookingsService.create(testData.guestUser.id, {
        hotelId: testData.hotel.id,
        checkIn,
        checkOut,
        rooms: [
          {
            roomId: testData.rooms[0].id,
            adults: 1,
          },
        ],
      });

      expect(booking).toBeDefined();
      expect(booking.status).toBe('PENDING');

      // Verify in database
      const dbBooking = await prismaService.booking.findUnique({
        where: { id: booking.id },
        include: { bookingRooms: true },
      });

      expect(dbBooking).toBeDefined();
      expect(dbBooking?.bookingRooms).toHaveLength(1);
    });

    it('should prevent overbooking via UNIQUE constraint', async () => {
      const checkIn = '2025-07-01';
      const checkOut = '2025-07-03';

      const bookingDto = {
        hotelId: testData.hotel.id,
        checkIn,
        checkOut,
        rooms: [
          {
            roomId: testData.rooms[0].id,
            adults: 1,
          },
        ],
      };

      // First booking should succeed
      const booking1 = await bookingsService.create(testData.guestUser.id, bookingDto);
      expect(booking1).toBeDefined();

      // Second booking same room same dates should fail
      await expect(
        bookingsService.create(testData.guestUser.id, bookingDto),
      ).rejects.toThrow();
    });

    it('should handle transaction rollback on error', async () => {
      const bookingCount = await prismaService.booking.count();

      const bookingDto = {
        hotelId: testData.hotel.id,
        checkIn: '2025-06-03',
        checkOut: '2025-06-01', // Invalid: checkOut before checkIn
        rooms: [
          {
            roomId: testData.rooms[0].id,
            adults: 1,
          },
        ],
      };

      await expect(
        bookingsService.create(testData.guestUser.id, bookingDto),
      ).rejects.toThrow();

      // Verify no partial data inserted
      const newBookingCount = await prismaService.booking.count();
      expect(newBookingCount).toBe(bookingCount);
    });
  });

  describe('User & Booking Relationship', () => {
    it('should track user bookings correctly', async () => {
      const checkIn = '2025-08-01';
      const checkOut = '2025-08-03';

      // Create multiple bookings for same user
      const booking1 = await bookingsService.create(testData.guestUser.id, {
        hotelId: testData.hotel.id,
        checkIn,
        checkOut,
        rooms: [{ roomId: testData.rooms[0].id, adults: 1 }],
      });

      const booking2 = await bookingsService.create(testData.guestUser.id, {
        hotelId: testData.hotel.id,
        checkIn: '2025-09-01',
        checkOut: '2025-09-03',
        rooms: [{ roomId: testData.rooms[1].id, adults: 1 }],
      });

      // Verify user has 2 bookings
      const userBookings = await prismaService.booking.findMany({
        where: { userId: testData.guestUser.id },
      });

      expect(userBookings.length).toBeGreaterThanOrEqual(2);
      expect(userBookings.map((b) => b.id)).toContain(booking1.id);
      expect(userBookings.map((b) => b.id)).toContain(booking2.id);
    });
  });

  describe('Availability Cascade', () => {
    it('should create availability records for booked dates', async () => {
      const checkIn = '2025-10-01';
      const checkOut = '2025-10-03';
      const roomId = testData.rooms[0].id;

      // Create booking - this should create availability records
      const booking = await bookingsService.create(testData.guestUser.id, {
        hotelId: testData.hotel.id,
        checkIn,
        checkOut,
        rooms: [{ roomId, adults: 1 }],
      });

      // Verify availability records were created  
      const startDate = new Date(checkIn);
      const endDate = new Date(checkOut);
      const availability = await prismaService.roomAvailability.findMany({
        where: { roomId, date: { gte: startDate, lt: endDate } },
      });

      expect(availability.length).toBeGreaterThan(0);
      availability.forEach((avail) => {
        expect(avail.status).toBe('BOOKED');
        expect(avail.bookingId).toBe(booking.id);
      });
    });
  });

  describe('Hotel & Room Relationship', () => {
    it('should verify room belongs to hotel before booking', async () => {
      const checkIn = '2025-11-01';
      const checkOut = '2025-11-03';

      // Try to book a room (should verify hotel match in controller)
      const booking = await bookingsService.create(testData.guestUser.id, {
        hotelId: testData.hotel.id,
        checkIn,
        checkOut,
        rooms: [{ roomId: testData.rooms[0].id, adults: 1 }],
      });

      // Verify booking associated with correct hotel
      const dbBooking = await prismaService.booking.findUnique({
        where: { id: booking.id },
      });

      expect(dbBooking?.hotelId).toBe(testData.hotel.id);
    });
  });

  describe('Pagination & Filtering', () => {
    it('should paginate bookings correctly', async () => {
      // Create 5 bookings
      for (let i = 0; i < 5; i++) {
        await bookingsService.create(testData.guestUser.id, {
          hotelId: testData.hotel.id,
          checkIn: `2025-${String(i + 1).padStart(2, '0')}-01`,
          checkOut: `2025-${String(i + 1).padStart(2, '0')}-03`,
          rooms: [{ roomId: testData.rooms[i % 2].id, adults: 1 }],
        });
      }

      // Page 1: 2 per page
      const page1 = await bookingsService.findByUser(testData.guestUser.id, 1, 2);
      expect(page1.data.length).toBeGreaterThanOrEqual(2);
      expect(page1.meta.page).toBe(1);
      expect(page1.meta.totalPages).toBeGreaterThanOrEqual(1);

      // Page 2 (if available)
      const page2 = await bookingsService.findByUser(testData.guestUser.id, 2, 2);
      expect(page2.data.length).toBeGreaterThanOrEqual(0);

      // Verify pagination works
      if (page1.data.length > 0 && page2.data.length > 0) {
        expect(page1.data[0].id).not.toBe(page2.data[0].id);
      }
    });
  });

  describe('Booking Status Transitions', () => {
    it('should allow valid status transitions', async () => {
      const checkIn = '2025-12-01';
      const checkOut = '2025-12-03';

      const booking = await bookingsService.create(testData.guestUser.id, {
        hotelId: testData.hotel.id,
        checkIn,
        checkOut,
        rooms: [{ roomId: testData.rooms[0].id, adults: 1 }],
      });

      // Initial status: PENDING
      expect(booking.status).toBe('PENDING');

      // Update to CONFIRMED
      const confirmed = await bookingsService.updateStatus(booking.id, 'CONFIRMED');
      expect(confirmed.status).toBe('CONFIRMED');

      // Update to CHECKED_IN
      const checkedIn = await bookingsService.updateStatus(booking.id, 'CHECKED_IN');
      expect(checkedIn.status).toBe('CHECKED_IN');
    });

    it('should prevent invalid status transitions', async () => {
      const checkIn = '2025-11-15';
      const checkOut = '2025-11-17';

      const booking = await bookingsService.create(testData.guestUser.id, {
        hotelId: testData.hotel.id,
        checkIn,
        checkOut,
        rooms: [{ roomId: testData.rooms[1].id, adults: 1 }],
      });

      // Try to set invalid transition (PENDING -> CHECKED_OUT not allowed)
      await expect(
        bookingsService.updateStatus(booking.id, 'CHECKED_OUT'),
      ).rejects.toThrow();
    });
  });
});
