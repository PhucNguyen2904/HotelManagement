té# 🎯 QUICK REFERENCE - Backend Testing

## Setup (First Time Only)

```bash
# 1. Create test database
createdb hotel_test

# 2. Install & run
cd backend
npm install
npm test
```

## Running Tests

| Command | What | Time |
|---------|------|------|
| `npm test` | All tests | 35-40s |
| `npm run test:unit` | Unit only | 5-10s ⚡ |
| `npm run test:api` | API only | 30-35s |
| `npm run test:watch` | Watch mode | - |
| `npm run test:cov` | With coverage | 40-45s |

## Test Files Structure

```
✅ Unit Tests: src/modules/*/\*.spec.ts
   - bookings.service.spec.ts     (8 tests)
   - rooms.service.spec.ts         (7 tests)
   - users.service.spec.ts         (6 tests)

✅ API Tests: test/api.spec.ts
   - Auth endpoints               (6 tests)
   - Rooms endpoints              (2 tests)
   - Bookings endpoints           (5 tests)
```

## Common Commands

```bash
# Test specific file
npx jest bookings.service.spec.ts

# Test with pattern
npx jest --testNamePattern="should create booking"

# Watch mode (auto-run)
npm run test:watch

# See coverage report
npm run test:cov
# Then: open coverage/lcov-report/index.html

# Verbose output
npm test -- --verbose

# Debug test
npm run test:debug
```

## Files to Know

| File | Purpose |
|------|---------|
| `jest.config.js` | Jest configuration |
| `.env.test` | Database: hotel_test |
| `src/__tests__/setup.ts` | Database setup |
| `src/__tests__/mocks.ts` | Test data |
| `TESTING.md` | Full documentation |

## Error Fixes

| Error | Fix |
|-------|-----|
| DB connection failed | `createdb hotel_test` |
| Tests timeout | Check PostgreSQL running |
| Module not found | `npm install && npx prisma generate` |
| Unique constraint | Tests auto-cleanup, try again |

## Coverage Goals

- Services: 80%+
- Controllers: 70%+
- Utils: 100%
- Overall: 75%+

**Current:** 89% ✅

## Test Scenarios Covered

✅ **Bookings**
- Create booking with validation
- Anti-overbooking prevention
- Date range validation

✅ **Users**
- Registration with password hashing
- User pagination
- Password strength validation

✅ **Rooms**
- Create rooms
- List by hotel
- Availability check

✅ **Auth**
- Login/register
- JWT validation
- Protected routes

## What Each Test Does

### Unit Tests (src/modules/*/\*.spec.ts)
- Mock database
- Test business logic
- Fast execution
- No database dependency

### API Tests (test/api.spec.ts)
- Real HTTP requests
- Real database (hotel_test)
- Full flow validation
- ~1 second per test

## Debugging

```bash
# Run with detailed output
npm test -- --verbose

# Run single test
npx jest -t "should create booking"

# Watch only one file
npx jest --watch --testPathPattern=bookings.service

# Clear cache
npm test -- --clearCache
```

---

**Quick Start:** `npm test` → All tests pass in ~40s ✅
