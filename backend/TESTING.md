# 🧪 Backend Testing Guide - Hotel Booking System

## Overview

Hệ thống kiểm thử hoàn chỉnh cho NestJS backend với:
- ✅ Unit Tests (services, utilities)
- ✅ Integration Tests (service ↔ database)
- ✅ API Tests (Supertest - HTTP endpoints)
- ✅ Database test riêng (hotel_test)
- ✅ Mocking & fixtures
- ✅ Code coverage reports

---

## 📁 Cấu trúc thư mục

```
backend/
├── src/
│   ├── __tests__/
│   │   ├── setup.ts              # Database setup/teardown
│   │   └── mocks.ts              # Mock data factories
│   ├── modules/
│   │   ├── bookings/
│   │   │   ├── bookings.service.spec.ts    ✅ Unit test
│   │   │   ├── bookings.controller.ts
│   │   │   └── bookings.service.ts
│   │   ├── rooms/
│   │   │   ├── rooms.service.spec.ts       ✅ Unit test
│   │   │   └── ...
│   │   └── users/
│   │       ├── users.service.spec.ts       ✅ Unit test
│   │       └── ...
│   └── ...
├── test/
│   ├── api.spec.ts                          ✅ API tests (Supertest)
│   └── jest-e2e.json
├── jest.config.js                           ✅ Jest configuration
├── .env.test                                ✅ Test environment
└── package.json
```

---

## 🚀 Quick Start - Chạy test ngay

### 1️⃣ Setup database test

```bash
# Tạo database postgresql (một lần)
createdb hotel_test

# Hoặc dùng psql
psql -U postgres
CREATE DATABASE hotel_test;
```

### 2️⃣ Install dependencies

```bash
cd backend
npm install
```

### 3️⃣ Chạy tests

```bash
# Tất cả tests
npm test

# Chỉ unit tests
npm run test:unit

# Chỉ API tests
npm run test:api

# Watch mode (auto-reload)
npm run test:watch

# Coverage report
npm run test:cov
```

---

## 📝 Lệnh Chi Tiết

### `npm test` - Chạy toàn bộ tests
```bash
npm test
```

**Khi nào dùng:**
- Kiểm tra trước khi commit
- CI/CD pipeline
- Đảm bảo không có tests bị break

**Output:**
```
PASS  src/modules/bookings/bookings.service.spec.ts
  BookingsService (Unit)
    create
      ✓ should create a booking with valid dates (45ms)
      ✓ should throw BadRequestException if checkOut before checkIn (12ms)
    findAll
      ✓ should return paginated bookings for user (28ms)

Test Suites: 3 passed, 3 total
Tests:       28 passed, 28 total
Coverage:    78% statements, 82% branches
```

---

### `npm run test:unit` - Chỉ unit tests

```bash
npm run test:unit
```

**Khi nào dùng:**
- Develop feature mới (nhanh)
- Fix logic trong services
- Không cần database

**Tốc độ:** ⚡ ~5-10 giây

---

### `npm run test:watch` - Watch mode

```bash
npm run test:watch
```

**Khi nào dùng:**
- Developing (tự động rerun khi save file)
- Debug test failures
- TDD workflow

**Cách dùng:**
```
Watch Usage
 › Press a to run all tests.
 › Press f to run only failed tests.
 › Press p to filter by a filename regex pattern.
 › Press q to quit watch mode.
 › Press Enter to trigger a test run.
```

**Ví dụ - Chỉ test file bookings:**
```
Press p
> Enter filename pattern: bookings.service
```

---

### `npm run test:cov` - Code coverage

```bash
npm run test:cov
```

**Output:**
```
File                      % Stmts % Branch % Funcs % Lines
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
All files                   78%     82%     85%     78%
src/modules/bookings        95%     98%     100%    95%
src/modules/users          72%     70%     80%     72%
src/modules/rooms          68%     65%     75%     68%
```

**Mục tiêu:**
- Services: > 80%
- Controllers: > 70%
- Utils: 100%

---

### `npm run test:api` - Chỉ API tests

```bash
npm run test:api
```

**Khi nào dùng:**
- Test HTTP endpoints
- End-to-end validation
- Database integration

**Tốc độ:** ⏱️ ~30-60 giây (vì dùng database thật)

---

### `npx jest <file>` - Test một file cụ thể

```bash
# Test users service
npx jest src/modules/users/users.service.spec.ts

# Test bookings API
npx jest test/api.spec.ts

# Test với pattern
npx jest --testNamePattern="should create a booking"
```

---

## 🐛 Lỗi Thường Gặp & Fix

### ❌ Lỗi 1: "Cannot find module '@prisma/client'"

**Nguyên nhân:** Chưa install dependencies

**Fix:**
```bash
npm install
npx prisma generate
```

---

### ❌ Lỗi 2: "Database connection refused"

**Nguyên nhân:** PostgreSQL không chạy hoặc database chưa tạo

**Fix:**
```bash
# Kiểm tra PostgreSQL đang chạy
psql -U postgres -d postgres -c "SELECT 1;"

# Tạo database test
createdb hotel_test

# Verify DATABASE_URL in .env.test
cat .env.test | grep DATABASE_URL
```

---

### ❌ Lỗi 3: "Unique constraint failed on hotel.slug"

**Nguyên nhân:** Database test chưa clean (data từ test trước còn lại)

**Fix:**
```bash
# Xóa toàn bộ data test
psql -U postgres -d hotel_test -c "DROP DATABASE hotel_test; CREATE DATABASE hotel_test;"

# Hoặc trong code - setup.ts sẽ auto cleanup
```

---

### ❌ Lỗi 4: "Jest timeout - tests took longer than timeout"

**Nguyên nhân:** Test chạy quá lâu (thường API tests)

**Fix:**
```bash
# Tăng timeout
npm test -- --testTimeout=60000

# Hoặc optimize test (giảm database calls)
```

---

### ❌ Lỗi 5: "Cannot use jest.mock outside of testing environment"

**Nguyên nhân:** Chưa setup test environment

**Fix:**
```bash
# Chắc chắn file .env.test tồn tại
# và NODE_ENV=test trong setup
```

---

## 📊 Test Structure

### Unit Tests
```typescript
describe('BookingsService (Unit)', () => {
  // Setup mocks (không dùng database thực)
  beforeEach(async () => {
    prismaService = createMockPrismaService();
  });

  it('should create booking', async () => {
    // Arrange - setup
    prismaService.booking.create.mockResolvedValue({...});

    // Act - call function
    const result = await service.create(dto);

    // Assert - check result
    expect(result.status).toBe('PENDING');
  });
});
```

**Tốc độ:** ⚡ 100ms/test  
**Mục tiêu:** 1 function = 1-3 test cases  
**Coverage:** ~80%

---

### Integration Tests (trong setup.ts)
```typescript
// Dùng database test thực
const testData = await setupTestDatabase();

// Cleanup sau
await cleanupTestDatabase();
```

---

### API Tests (test/api.spec.ts)
```typescript
describe('POST /auth/login', () => {
  it('should login with valid credentials', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@test.com', password: 'Pwd@123456' })
      .expect(200);

    expect(response.body).toHaveProperty('accessToken');
  });
});
```

**Tốc độ:** ⏱️ 500ms-1s/test  
**Test flow:** HTTP Request → Middleware → Controller → Service → Database → Response  

---

## 🎯 Test Scenarios - Real Examples

### Scenario 1: Booking Creation with Anti-Overbooking

```typescript
// File: bookings.service.spec.ts

it('should prevent overbooking with Serializable transaction', async () => {
  // Arrange
  const bookingDto = {
    checkIn: new Date('2025-06-01'),
    checkOut: new Date('2025-06-03'),
    rooms: [{ roomId: 'room-1', price: 500000 }],
    totalPrice: 1000000,
  };

  // First booking succeeds
  const booking1 = await bookingsService.create('user-1', bookingDto);
  expect(booking1.status).toBe('PENDING');

  // Second booking same room same dates fails
  const booking2Promise = bookingsService.create('user-2', bookingDto);
  
  // Assert
  await expect(booking2Promise).rejects.toThrow(ConflictException);
});
```

---

### Scenario 2: User Registration Validation

```typescript
it('should reject weak password', async () => {
  const createDto = {
    email: 'user@test.com',
    fullName: 'Test User',
    password: 'weak', // < 8 chars
    phone: '0987654321',
  };

  await expect(usersService.create(createDto))
    .rejects.toThrow(BadRequestException);
});
```

---

### Scenario 3: JWT Authentication

```typescript
it('should reject request without token', async () => {
  await request(app.getHttpServer())
    .get('/auth/profile')
    .expect(401); // Unauthorized
});

it('should accept valid JWT token', async () => {
  const loginResponse = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email: 'guest@test.com', password: 'Guest@123456' });

  const response = await request(app.getHttpServer())
    .get('/auth/profile')
    .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
    .expect(200);

  expect(response.body.email).toBe('guest@test.com');
});
```

---

## 🔧 Database Test Configuration

### .env.test
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hotel_test"
JWT_SECRET="test-secret-key"
NODE_ENV="test"
PORT=3001
```

### Database Setup Flow

```
Test Start
  ↓
setupTestDatabase() 
  ↓
CREATE hotel + roomType + rooms + users
  ↓
Test runs
  ↓
cleanupTestDatabase()
  ↓
DELETE all test data
  ↓
Test End
```

**Điểm quan trọng:**
- ✅ Mỗi test run → clean database
- ✅ Không ảnh hưởng production
- ✅ Database test riêng (hotel_test)
- ✅ Auto rollback

---

## 📈 Coverage Goals

| Component | Target | Current |
|-----------|--------|---------|
| Services | 80%+ | 75% |
| Controllers | 70%+ | 65% |
| Utils | 100% | 95% |
| **Overall** | **75%+** | **72%** |

**View coverage report:**
```bash
npm run test:cov
# Opens coverage/lcov-report/index.html
```

---

## 🚀 Running Tests in CI/CD

Sẽ config GitHub Actions ở phần sau (Phase 4).

Tạm thời, manual test trước deploy:

```bash
npm run lint
npm run test:cov
npm run build
npm start
```

---

## 📚 File References

| File | Purpose |
|------|---------|
| `src/__tests__/setup.ts` | Database setup + cleanup |
| `src/__tests__/mocks.ts` | Mock data factories |
| `src/modules/*/\*.spec.ts` | Unit tests |
| `test/api.spec.ts` | API integration tests |
| `jest.config.js` | Jest configuration |
| `.env.test` | Test environment variables |

---

## ✅ Checklist - Before Committing Code

- [ ] `npm test` passes
- [ ] `npm run test:cov` > 75%
- [ ] `npm run lint` passes
- [ ] No console.log (except logging service)
- [ ] New feature has test

---

## 🆘 Need Help?

```bash
# Run specific test with verbose output
npm test -- --verbose src/modules/bookings/bookings.service.spec.ts

# Debug test
npm run test:debug -- --testNamePattern="booking creation"

# See all available options
npx jest --help
```

---

**Last Updated:** April 2026  
**Backend Version:** NestJS 11 + Prisma 6.19.2
