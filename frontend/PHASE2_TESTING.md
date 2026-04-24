# Phase 2: Frontend Testing - Chi Tiết Thực Hiện

**Status**: 🟢 Phase 2a COMPLETE | Phase 2b-2d IN PROGRESS

---

## 📊 Tổng Quan

### Phase Breakdown

```
Phase 2: Frontend Testing (Total: ~100 test cases)
├── Phase 2a: ✅ Jest Setup + Auth Tests (COMPLETE)
│   ├── Jest infrastructure setup
│   ├── Mock data & utilities
│   ├── Auth service tests: 11/11 ✅
│   └── Auth component tests: 34 test cases (templates ready)
│
├── Phase 2b: 🔄 Rooms & Booking Tests (IN PROGRESS)
│   ├── Rooms module tests (~20 tests)
│   ├── Booking module tests (~25 tests)
│   └── Services tests (~15 tests)
│
├── Phase 2c: ⏳ Reviews & Layout Tests (TODO)
│   ├── Reviews module tests (~15 tests)
│   └── Layout component tests (~10 tests)
│
└── Phase 2d: ⏳ Coverage & Integration (TODO)
    ├── Integration tests (~10 tests)
    └── Coverage optimization (target 75%)
```

---

## 🎯 Phase 2a: Jest Setup + Auth Tests

### ✅ What's Done

#### 1. Jest Infrastructure
- [x] Jest + ts-jest setup
- [x] jsdom environment configured
- [x] TypeScript support enabled
- [x] Module path mapping configured (@/ → src/)
- [x] Test discovery patterns set

#### 2. Test Utilities
- [x] `__tests__/utils/render.tsx` - Custom RTL render
- [x] `__tests__/utils/test-data.ts` - Mock data (748 lines)
- [x] `__tests__/mocks/axios.ts` - API mocking
- [x] `__tests__/mocks/next-router.ts` - Router mocking

#### 3. Auth Module Tests
- [x] `src/services/__tests__/auth.service.test.ts` - **11/11 tests ✅**
  - Login (3 tests): success, error, network error
  - Register (3 tests): success, email exists, validation
  - GetProfile (3 tests): success, 401 error, network error
  - Logout (2 tests): token removal, no token edge case

- [x] `src/components/features/auth/LoginForm.test.tsx` - 15 test cases
  - Rendering (4 tests)
  - Form submission (4 tests)
  - Validation (2 tests)
  - Loading states (2 tests)
  - Error handling (3 tests)

- [x] `src/components/features/auth/RegisterForm.test.tsx` - 19 test cases
  - Rendering (4 tests)
  - Form submission (6 tests)
  - Validation (4 tests)
  - Loading states (2 tests)
  - Error handling (3 tests)

#### 4. Documentation
- [x] `TESTING_GUIDE.md` - Complete testing guide with examples
- [x] `PHASE2_TESTING.md` - This file (progress tracking)

### 📁 Files Created

```
frontend/
├── jest.config.js                         ← Jest config
├── jest.setup.js                          ← Global mocks
├── TESTING_GUIDE.md                       ← Testing documentation
├── PHASE2_TESTING.md                      ← This file
├── __tests__/
│   ├── setup.ts                           ← Test utilities
│   ├── mocks/
│   │   ├── axios.ts                       ← API mocking
│   │   └── next-router.ts                 ← Router mocking
│   └── utils/
│       ├── test-data.ts                   ← Mock data (748 lines)
│       └── render.tsx                     ← Custom render
├── src/services/__tests__/
│   └── auth.service.test.ts               ← 11/11 ✅
└── src/components/features/auth/
    ├── LoginForm.test.tsx                 ← 15 tests
    └── RegisterForm.test.tsx              ← 19 tests
```

### 🚀 Running Phase 2a Tests

```bash
# Run all tests
npm test

# Run just auth service tests
npm test -- auth.service

# Run in watch mode
npm run test:watch

# Get coverage
npm run test:coverage
```

### ✅ Phase 2a Results

```
PASS src/services/__tests__/auth.service.test.ts
  authService
    login
      ✓ should successfully login and return auth response
      ✓ should handle login error
      ✓ should handle network error
    register
      ✓ should successfully register new user
      ✓ should handle registration error - email already exists
      ✓ should handle validation error
    getProfile
      ✓ should fetch user profile
      ✓ should handle unauthorized error
      ✓ should handle network error
    logout
      ✓ should remove access token from localStorage
      ✓ should handle logout when no token exists

Test Suites: 1 passed, 1 total
Tests:       11 passed, 11 total
Time:        1.63 s
```

---

## 🔄 Phase 2b: Rooms & Booking Tests (IN PROGRESS)

### 📋 To-Do List

#### Rooms Module (RoomCard, RoomList, SearchBar)

```typescript
// [ ] RoomCard.test.tsx (8 test cases)
describe('RoomCard', () => {
  // Rendering tests
  it('should render room name and price')
  it('should render room image')
  it('should display max guests')
  it('should show bed type')
  
  // Interaction tests
  it('should call onSelect when clicked')
  it('should show availability badge')
  
  // Conditional tests
  it('should show "Booked" badge if unavailable')
  it('should format price correctly')
})

// [ ] RoomList.test.tsx (10 test cases)
describe('RoomList', () => {
  // Rendering tests
  it('should render multiple RoomCards')
  it('should show loading skeleton')
  it('should show empty state')
  
  // Filter tests
  it('should filter by bed type')
  it('should filter by price range')
  it('should filter by guests capacity')
  
  // Sort tests
  it('should sort by price')
  
  // Search tests
  it('should search by name')
  
  // Pagination tests
  it('should handle pagination')
})

// [ ] SearchBar.test.tsx (10 test cases)
describe('SearchBar', () => {
  // Rendering tests
  it('should render date pickers')
  it('should render guests input')
  it('should render hotel select')
  
  // Validation tests
  it('should validate checkout > checkin')
  it('should show error for invalid dates')
  
  // Interaction tests
  it('should submit with valid data')
  it('should preset common dates')
  
  // Edge cases
  it('should handle date edge cases')
})

// [ ] room-types.service.test.ts (8 test cases)
describe('roomTypesService', () => {
  it('should get room types for hotel')
  it('should get room types with availability')
  it('should get single room type')
  it('should handle errors')
})
```

#### Booking Module (BookingForm, BookingSummary, BookingConfirmation)

```typescript
// [ ] BookingForm.test.tsx (12 test cases)
describe('BookingForm', () => {
  // Multi-step form tests
  it('should show step 1: guest info')
  it('should show step 2: special requests')
  it('should show step 3: coupon code')
  
  // Validation tests
  it('should validate required fields')
  it('should validate email format')
  it('should validate phone format')
  
  // Coupon tests
  it('should apply coupon code')
  it('should show discount')
  
  // Submission tests
  it('should submit form')
  it('should show loading state')
  it('should show error on failure')
  it('should redirect on success')
})

// [ ] BookingSummary.test.tsx (8 test cases)
describe('BookingSummary', () => {
  it('should display room details')
  it('should show check-in/out dates')
  it('should calculate subtotal')
  it('should calculate tax')
  it('should show coupon discount')
  it('should display total amount')
  it('should format prices correctly')
  it('should show booking code')
})

// [ ] BookingConfirmation.test.tsx (5 test cases)
describe('BookingConfirmation', () => {
  it('should show booking code')
  it('should show confirmation message')
  it('should display booking details')
  it('should have "Pay Now" button')
  it('should have navigation buttons')
})

// [ ] bookings.service.test.ts (15 test cases)
describe('bookingsService', () => {
  it('should create booking')
  it('should list bookings')
  it('should get booking by ID')
  it('should update booking status')
  it('should cancel booking')
  it('should handle overbooking error')
  // ... more edge cases
})
```

### 🎯 Phase 2b Goals

- [ ] 20+ rooms module tests
- [ ] 25+ booking module tests
- [ ] 15+ service tests
- [ ] All tests passing ✅
- [ ] Coverage > 70%

---

## ⏳ Phase 2c: Reviews & Layout Tests (TODO)

### Reviews Module

```typescript
// [ ] ReviewForm.test.tsx (8 test cases)
// [ ] ReviewList.test.tsx (8 test cases)
// [ ] reviews.service.test.ts (5 test cases)
```

### Layout Module

```typescript
// [ ] Navbar.test.tsx (10 test cases)
// [ ] Footer.test.tsx (5 test cases)
```

### Phase 2c Goals
- [ ] 15+ reviews tests
- [ ] 10+ layout tests
- [ ] Coverage > 75%

---

## 🔧 Phase 2d: Coverage & Integration (TODO)

### Integration Tests

```typescript
// [ ] Booking flow: SearchBar → RoomCard → BookingForm → Confirmation
// [ ] Auth flow: Register → Login → Profile
// [ ] Payment flow: BookingForm → Payment → Confirmation
```

### Coverage Optimization

```bash
npm run test:coverage

# Target coverage:
# - Statements: 75%
# - Branches: 70%
# - Functions: 75%
# - Lines: 75%
```

---

## 📚 How to Write Tests for Phase 2b+

### Step 1: Create Test File

```typescript
// src/components/features/rooms/RoomCard.test.tsx

'use client'

import React from 'react'
import { render, screen } from '@/__tests__/utils/render'
import userEvent from '@testing-library/user-event'
import { RoomCard } from './RoomCard'
import { mockRoomType } from '@/__tests__/utils/test-data'
```

### Step 2: Setup Tests

```typescript
describe('RoomCard', () => {
  describe('Rendering', () => {
    it('should render room name', () => {
      render(<RoomCard room={mockRoomType} onSelect={jest.fn()} />)
      expect(screen.getByText(mockRoomType.name)).toBeInTheDocument()
    })
  })

  describe('Interaction', () => {
    it('should call onSelect when clicked', async () => {
      const user = userEvent.setup()
      const onSelect = jest.fn()
      render(<RoomCard room={mockRoomType} onSelect={onSelect} />)

      const card = screen.getByRole('button')
      await user.click(card)

      expect(onSelect).toHaveBeenCalledWith(mockRoomType.id)
    })
  })
})
```

### Step 3: Run and Verify

```bash
npm test -- RoomCard

# Output should show all tests passing
PASS src/components/features/rooms/RoomCard.test.tsx
  RoomCard
    Rendering
      ✓ should render room name
    Interaction
      ✓ should call onSelect when clicked

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
```

---

## 🆘 Common Issues & Fixes

### Issue 1: Mock not working

**Problem**: API call not being mocked

**Fix**: Ensure mock is setup BEFORE component render
```typescript
// ✅ Correct order
jest.mock('@/services/api')
const mockApi = require('@/services/api').default

beforeEach(() => {
  mockApi.post.mockResolvedValue({ data: {...} })
})

render(<Component />)  // NOW render
```

### Issue 2: "Cannot read property 'mock' of undefined"

**Problem**: Service is not properly mocked

**Fix**: Check import path matches mock path
```typescript
// In component
import { exampleService } from '@/services/example.service'

// In test
jest.mock('@/services/example.service')
const { exampleService } = require('@/services/example.service')
```

### Issue 3: Test timeout

**Problem**: Async operation taking too long

**Fix**: Use proper waitFor + timeout
```typescript
await waitFor(() => {
  expect(screen.getByText('Done')).toBeInTheDocument()
}, { timeout: 3000 })
```

---

## 📊 Test Coverage Target

```
Current (Phase 2a):
├── Services: 100% (auth.service)
├── Auth Components: 70% (LoginForm, RegisterForm)
└── Overall: ~40%

Phase 2b Target:
├── Services: 100% (all)
├── Components: 80% (core modules)
└── Overall: ~70%

Phase 2c Target:
├── Services: 100%
├── Components: 85%
└── Overall: ~75%
```

---

## 🚀 Quick Start Commands

```bash
# Install & setup (already done)
npm install

# Run Phase 2a tests
npm test -- auth.service
npm test -- LoginForm
npm test -- RegisterForm

# Run all tests
npm test

# Watch mode (recommended for development)
npm run test:watch

# Get coverage report
npm run test:coverage

# Debug a specific test
npm run test:debug -- RoomCard.test.tsx
```

---

## 📖 Documentation

- **`TESTING_GUIDE.md`** - Complete guide with examples
- **`jest.config.js`** - Jest configuration details
- **`__tests__/utils/test-data.ts`** - Available mock data
- **`__tests__/utils/render.tsx`** - Custom render function

---

## 📝 Checklist for Phase 2b

Before moving to Phase 2c, ensure:

### RoomCard Tests
- [ ] Render tests passing
- [ ] Interaction tests passing
- [ ] Edge case tests (unavailable, loading, etc.)
- [ ] Coverage > 80%

### RoomList Tests
- [ ] Render with multiple items
- [ ] Filter functionality
- [ ] Sort functionality
- [ ] Pagination
- [ ] Loading/Empty states
- [ ] Coverage > 80%

### SearchBar Tests
- [ ] Date validation
- [ ] Form submission
- [ ] Error display
- [ ] Guest count validation
- [ ] Coverage > 80%

### Booking Module
- [ ] BookingForm multi-step
- [ ] Form validation
- [ ] API submission
- [ ] Coupon handling
- [ ] Error handling
- [ ] Coverage > 80%

### Services Tests
- [ ] room-types.service (100%)
- [ ] bookings.service (100%)
- [ ] availability.service (100%)

---

## 📞 Support

For questions or issues:
1. Check `TESTING_GUIDE.md` FAQ section
2. Review existing tests in `src/services/__tests__/`
3. Check Jest docs: https://jestjs.io/
4. Check RTL docs: https://testing-library.com/

---

**Last Updated**: April 17, 2026  
**Current Phase**: 2a ✅ Complete | 2b 🔄 In Progress  
**Next Review**: After Phase 2b completion
