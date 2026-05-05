import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { setupTestDatabase, cleanupTestDatabase, closeTestDatabase } from '../src/__tests__/setup';

/**
 * API Integration Tests using Supertest
 * Tests HTTP endpoints with real database (hotel_test)
 *
 * Run: npm run test -- --testPathPattern="api.spec.ts"
 * Watch: npm run test:watch -- --testPathPattern="api.spec.ts"
 */

describe('Hotel Booking API (E2E)', () => {
  let app: INestApplication;
  let testData: any;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
    testData = await setupTestDatabase();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
    await closeTestDatabase();
    await app.close();
  });

  // ============= AUTH ENDPOINTS =============

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const registerDto = {
        email: 'newuser@test.com',
        fullName: 'New Test User',
        password: 'ValidPassword@123456',
        phone: '0987654324',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body.user.email).toBe(registerDto.email);
      expect(response.body.user).toHaveProperty('id');
    });

    it('should reject duplicate email', async () => {
      const registerDto = {
        email: testData.guestUser.email, // already exists
        fullName: 'Another User',
        password: 'ValidPassword@123456',
        phone: '0987654325',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(409);
    });

    it('should validate weak password', async () => {
      const registerDto = {
        email: 'weak@test.com',
        fullName: 'Weak Password User',
        password: 'weak', // too short
        phone: '0987654326',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(400);
    });

    it('should validate email format', async () => {
      const registerDto = {
        email: 'invalid-email',
        fullName: 'Invalid Email User',
        password: 'ValidPassword@123456',
        phone: '0987654327',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(400);
    });
  });

  describe('POST /auth/login', () => {
    it('should login with valid credentials', async () => {
      const loginDto = {
        email: testData.guestUser.email,
        password: 'Guest@123456', // from setup
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(201);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(testData.guestUser.email);

      jwtToken = response.body.accessToken;
    });

    it('should reject invalid email', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'Password@123456',
        })
        .expect(401);
    });

    it('should reject wrong password', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testData.guestUser.email,
          password: 'WrongPassword@123456',
        })
        .expect(401);
    });
  });

  describe('GET /auth/profile', () => {
    it('should return current user profile with valid token', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testData.guestUser.email,
          password: 'Guest@123456',
        });

      const response = await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(testData.guestUser.email);
    });

    it('should reject request without token', async () => {
      await request(app.getHttpServer())
        .get('/auth/profile')
        .expect(401);
    });

    it('should reject request with invalid token', async () => {
      await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', 'Bearer invalid_token')
        .expect(401);
    });
  });

  // ============= ROOMS ENDPOINTS =============

  describe('GET /rooms', () => {
    it('should return all rooms for a hotel', async () => {
      const response = await request(app.getHttpServer())
        .get(`/rooms/hotel/${testData.hotel.id}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('roomNumber');
      expect(response.body[0]).toHaveProperty('roomType');
    });

    it('should return empty array for non-existent hotel', async () => {
      const response = await request(app.getHttpServer())
        .get('/rooms/hotel/nonexistent')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('GET /rooms/:id', () => {
    it('should return room details with availability', async () => {
      const roomId = testData.rooms[0].id;

      const response = await request(app.getHttpServer())
        .get(`/rooms/${roomId}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', roomId);
      expect(response.body).toHaveProperty('roomNumber');
      expect(response.body).toHaveProperty('roomType');
    });

    it('should return 404 for non-existent room', async () => {
      await request(app.getHttpServer())
        .get('/rooms/nonexistent')
        .expect(404);
    });
  });

  // ============= BOOKINGS ENDPOINTS =============

  describe('POST /bookings', () => {
    it('should create a booking with valid data', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testData.guestUser.email,
          password: 'Guest@123456',
        });

      const checkIn = '2025-06-01';
      const checkOut = '2025-06-03';

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

      const response = await request(app.getHttpServer())
        .post('/bookings')
        .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
        .send(bookingDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.status).toBe('PENDING');
    });

    it('should prevent overbooking same room', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testData.guestUser.email,
          password: 'Guest@123456',
        });

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

      // First booking
      await request(app.getHttpServer())
        .post('/bookings')
        .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
        .send(bookingDto)
        .expect(201);

      // Second booking same room same dates should fail
      await request(app.getHttpServer())
        .post('/bookings')
        .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
        .send(bookingDto)
        .expect(409);
    });

    it('should validate check-in before check-out', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testData.guestUser.email,
          password: 'Guest@123456',
        });

      const bookingDto = {
        hotelId: testData.hotel.id,
        checkIn: '2025-06-03',
        checkOut: '2025-06-01', // invalid
        rooms: [
          {
            roomId: testData.rooms[0].id,
            price: testData.roomType.basePrice,
          },
        ],
        totalPrice: testData.roomType.basePrice * 2,
      };

      await request(app.getHttpServer())
        .post('/bookings')
        .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
        .send(bookingDto)
        .expect(400);
    });

    it('should require authentication', async () => {
      const bookingDto = {
        hotelId: testData.hotel.id,
        checkIn: '2025-06-01',
        checkOut: '2025-06-03',
        rooms: [
          {
            roomId: testData.rooms[0].id,
            adults: 1,
          },
        ],
      };

      await request(app.getHttpServer())
        .post('/bookings')
        .send(bookingDto)
        .expect(401);
    });
  });

  describe('GET /bookings', () => {
    it('should return user bookings with pagination', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testData.guestUser.email,
          password: 'Guest@123456',
        });

      const response = await request(app.getHttpServer())
        .get('/bookings/my?page=1')
        .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /bookings/:id', () => {
    it('should return booking details', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testData.guestUser.email,
          password: 'Guest@123456',
        });

      // Create a booking first
      const bookingResponse = await request(app.getHttpServer())
        .post('/bookings')
        .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
        .send({
          hotelId: testData.hotel.id,
          checkIn: '2025-08-01',
          checkOut: '2025-08-03',
          rooms: [
            {
              roomId: testData.rooms[1].id,
              adults: 1,
            },
          ],
        });

      const response = await request(app.getHttpServer())
        .get(`/bookings/${bookingResponse.body.id}`)
        .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
        .expect(200);

      expect(response.body.id).toBe(bookingResponse.body.id);
    });
  });
});
