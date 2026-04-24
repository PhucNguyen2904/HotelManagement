# 📖 Frontend Testing Guide - Hướng Dẫn Test

**Phiên bản**: 1.0  
**Ngày**: April 17, 2026  
**Dự án**: Hotel Booking - Frontend Testing Phase 2

---

## 📋 Mục Lục

1. [Giới Thiệu](#giới-thiệu)
2. [Cài Đặt & Chạy Test](#cài-đặt--chạy-test)
3. [Cấu Trúc Test](#cấu-trúc-test)
4. [Hướng Dẫn Viết Test](#hướng-dẫn-viết-test)
5. [Ví Dụ Thực Tế](#ví-dụ-thực-tế)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

---

## Giới Thiệu

### Test Framework Stack

| Tool | Phiên bản | Mục đích |
|------|----------|---------|
| **Jest** | 30.3.0 | Test runner & assertions |
| **React Testing Library** | 16.3.2 | DOM testing |
| **ts-jest** | Latest | TypeScript support |
| **userEvent** | Latest | User interaction simulation |

### Phạm Vi Test

```
Phase 2 - Frontend Testing
├── Phase 2a: ✅ DONE - Jest Setup + Auth Tests
├── Phase 2b: In Progress - Rooms & Booking
├── Phase 2c: TODO - Reviews & Layout
└── Phase 2d: TODO - Coverage & Integration
```

---

## Cài Đặt & Chạy Test

### 1. Cài Đặt Dependencies

```bash
# Đã cài sẵn trong package.json
cd frontend
npm install
```

### 2. Chạy Test

```bash
# Chạy tất cả test
npm test

# Chạy test trong watch mode (auto-reload on file change)
npm run test:watch

# Chạy test coverage
npm run test:coverage

# Chạy test debug mode
npm run test:debug

# Chạy test từ file cụ thể
npm test -- auth.service

# Chạy test với tên matching pattern
npm test -- --testNamePattern="login"
```

### 3. Test Output Ví Dụ

```
PASS src/services/__tests__/auth.service.test.ts
  authService
    login
      ✓ should successfully login and return auth response (6 ms)
      ✓ should handle login error (9 ms)
      ✓ should handle network error (1 ms)
    ...
    
Test Suites: 1 passed, 1 total
Tests:       11 passed, 11 total
Time:        1.63 s
```

---

## Cấu Trúc Test

### Folder Structure

```
frontend/
├── src/
│   ├── components/features/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── LoginForm.test.tsx         ← Test cùng thư mục
│   │   │   ├── RegisterForm.tsx
│   │   │   └── RegisterForm.test.tsx
│   │   ├── rooms/
│   │   │   ├── RoomCard.tsx
│   │   │   └── RoomCard.test.tsx          ← Test tương tự
│   │   └── ...
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── __tests__/
│   │       └── auth.service.test.ts       ← Service tests riêng
│   └── ...
├── __tests__/
│   ├── mocks/
│   │   ├── axios.ts                       ← API mock
│   │   └── next-router.ts                 ← Router mock
│   └── utils/
│       ├── test-data.ts                   ← Mock data
│       └── render.tsx                     ← Custom render
├── jest.config.js                         ← Jest config
└── jest.setup.js                          ← Global setup
```

### Test File Naming Convention

```
ComponentName.test.tsx          ← Component tests
service-name.test.ts            ← Service tests
utility-function.test.ts        ← Utility tests
```

---

## Hướng Dẫn Viết Test

### 1. Test cho Service

**Pattern**: Mock API, test logic

```typescript
// src/services/__tests__/example.service.test.ts

import { exampleService } from '../example.service'
import { mockAxios } from '@/__tests__/mocks/axios'

jest.mock('@/services/api')

describe('exampleService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getExample', () => {
    it('should fetch example data', async () => {
      const mockData = { id: '1', name: 'Example' }
      mockAxios.get.mockResolvedValue({ data: { data: mockData } })

      const result = await exampleService.getExample('1')

      expect(result).toEqual(mockData)
      expect(mockAxios.get).toHaveBeenCalledWith('/example/1')
    })

    it('should handle error', async () => {
      mockAxios.get.mockRejectedValue(new Error('Network Error'))

      await expect(exampleService.getExample('1')).rejects.toThrow('Network Error')
    })
  })
})
```

### 2. Test cho Component

**Pattern**: Render, interact, assert

```typescript
// src/components/features/example/ExampleForm.test.tsx

'use client'

import React from 'react'
import { render, screen, waitFor } from '@/__tests__/utils/render'
import userEvent from '@testing-library/user-event'
import { ExampleForm } from './ExampleForm'

describe('ExampleForm', () => {
  describe('Rendering', () => {
    it('should render form with inputs', () => {
      render(<ExampleForm />)
      expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
    })
  })

  describe('Interaction', () => {
    it('should submit form with data', async () => {
      const user = userEvent.setup()
      render(<ExampleForm />)

      const input = screen.getByPlaceholderText('Enter name')
      const button = screen.getByRole('button', { name: /submit/i })

      await user.type(input, 'Test Name')
      await user.click(button)

      // Assert action happened
      await waitFor(() => {
        expect(screen.getByText('Success')).toBeInTheDocument()
      })
    })
  })

  describe('Validation', () => {
    it('should show error for empty input', async () => {
      const user = userEvent.setup()
      render(<ExampleForm />)

      const button = screen.getByRole('button', { name: /submit/i })
      await user.click(button)

      expect(screen.getByText('Name is required')).toBeInTheDocument()
    })
  })
})
```

### 3. Test cho Hook

**Pattern**: Render hook, test state changes

```typescript
// src/hooks/__tests__/useExample.test.ts

import { renderHook, act } from '@testing-library/react'
import { useExample } from '../useExample'

describe('useExample', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useExample())
    expect(result.current.value).toBe('')
  })

  it('should update value on change', () => {
    const { result } = renderHook(() => useExample())

    act(() => {
      result.current.setValue('test')
    })

    expect(result.current.value).toBe('test')
  })
})
```

---

## Ví Dụ Thực Tế

### Example 1: RoomCard Component Test

```typescript
// src/components/features/rooms/RoomCard.test.tsx

'use client'

import React from 'react'
import { render, screen } from '@/__tests__/utils/render'
import userEvent from '@testing-library/user-event'
import { RoomCard } from './RoomCard'
import { mockRoomType } from '@/__tests__/utils/test-data'

describe('RoomCard', () => {
  it('should render room information', () => {
    const onSelect = jest.fn()
    render(<RoomCard room={mockRoomType} onSelect={onSelect} />)

    expect(screen.getByText('Phòng Deluxe')).toBeInTheDocument()
    expect(screen.getByText(/800000/)).toBeInTheDocument()
  })

  it('should call onSelect when clicked', async () => {
    const user = userEvent.setup()
    const onSelect = jest.fn()
    render(<RoomCard room={mockRoomType} onSelect={onSelect} />)

    const card = screen.getByRole('button')
    await user.click(card)

    expect(onSelect).toHaveBeenCalledWith(mockRoomType.id)
  })
})
```

### Example 2: SearchBar Component Test

```typescript
// src/components/features/rooms/SearchBar.test.tsx

'use client'

import React from 'react'
import { render, screen, waitFor } from '@/__tests__/utils/render'
import userEvent from '@testing-library/user-event'
import { SearchBar } from './SearchBar'

describe('SearchBar', () => {
  it('should submit with valid dates', async () => {
    const user = userEvent.setup()
    const onSearch = jest.fn()
    render(<SearchBar onSearch={onSearch} />)

    const checkInInput = screen.getByPlaceholderText('Check-in')
    const checkOutInput = screen.getByPlaceholderText('Check-out')
    const searchButton = screen.getByRole('button', { name: /search/i })

    await user.type(checkInInput, '2024-03-01')
    await user.type(checkOutInput, '2024-03-03')
    await user.click(searchButton)

    expect(onSearch).toHaveBeenCalledWith({
      checkIn: '2024-03-01',
      checkOut: '2024-03-03',
    })
  })

  it('should show error for invalid dates', async () => {
    const user = userEvent.setup()
    render(<SearchBar onSearch={jest.fn()} />)

    const checkInInput = screen.getByPlaceholderText('Check-in')
    const checkOutInput = screen.getByPlaceholderText('Check-out')
    const searchButton = screen.getByRole('button', { name: /search/i })

    await user.type(checkInInput, '2024-03-03')
    await user.type(checkOutInput, '2024-03-01')
    await user.click(searchButton)

    await waitFor(() => {
      expect(screen.getByText(/check-out must be after check-in/i)).toBeInTheDocument()
    })
  })
})
```

### Example 3: BookingForm Component Test

```typescript
// src/components/features/booking/BookingForm.test.tsx

'use client'

import React from 'react'
import { render, screen, waitFor } from '@/__tests__/utils/render'
import userEvent from '@testing-library/user-event'
import { BookingForm } from './BookingForm'
import { bookingsService } from '@/services/bookings.service'

jest.mock('@/services/bookings.service')

describe('BookingForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should submit booking form', async () => {
    const user = userEvent.setup()
    ;(bookingsService.create as jest.Mock).mockResolvedValue({
      id: 'booking-1',
      bookingCode: 'BK240301001',
    })

    render(<BookingForm roomTypeId="room-1" hotelId="hotel-1" />)

    const nameInput = screen.getByPlaceholderText('Guest name')
    const emailInput = screen.getByPlaceholderText('Email')
    const submitButton = screen.getByRole('button', { name: /book/i })

    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.click(submitButton)

    await waitFor(() => {
      expect(bookingsService.create).toHaveBeenCalled()
      expect(screen.getByText(/booking confirmed/i)).toBeInTheDocument()
    })
  })

  it('should validate required fields', async () => {
    const user = userEvent.setup()
    render(<BookingForm roomTypeId="room-1" hotelId="hotel-1" />)

    const submitButton = screen.getByRole('button', { name: /book/i })
    await user.click(submitButton)

    expect(screen.getByText(/name is required/i)).toBeInTheDocument()
    expect(screen.getByText(/email is required/i)).toBeInTheDocument()
  })
})
```

---

## Best Practices

### 1. **Query Selection (RTL)**

```typescript
// ✅ GOOD: Query by role (accessible to users)
screen.getByRole('button', { name: /submit/i })
screen.getByRole('textbox', { name: /email/i })

// ✅ GOOD: Query by label text
screen.getByLabelText('Full Name')

// ✅ GOOD: Query by placeholder for inputs
screen.getByPlaceholderText('email@example.com')

// ❌ BAD: Query by CSS class (not user-accessible)
screen.getByClassName('submit-btn')

// ❌ BAD: Query by test ID (last resort)
screen.getByTestId('submit-btn')
```

### 2. **Async Testing**

```typescript
// ✅ GOOD: Use waitFor for async operations
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument()
})

// ✅ GOOD: Use userEvent for user interactions
const user = userEvent.setup()
await user.type(input, 'text')
await user.click(button)

// ❌ BAD: Don't use fireEvent (not realistic)
fireEvent.click(button)

// ❌ BAD: Don't use setTimeout (flaky)
await new Promise(resolve => setTimeout(resolve, 100))
```

### 3. **Mocking Best Practices**

```typescript
// ✅ GOOD: Clear mocks between tests
beforeEach(() => {
  jest.clearAllMocks()
})

// ✅ GOOD: Mock specific return values
mockAxios.post.mockResolvedValue({ data: { ... } })

// ✅ GOOD: Test both success and error cases
mockAxios.post.mockRejectedValue(new Error('Network Error'))

// ❌ BAD: Don't mock everything (only external dependencies)
// Don't mock: React, React Testing Library, userEvent
// DO mock: API calls, router, stores
```

### 4. **Test Organization**

```typescript
describe('ComponentName', () => {
  // Group by feature
  describe('Rendering', () => {
    it('should render...', () => {})
  })

  describe('User Interaction', () => {
    it('should handle click...', () => {})
  })

  describe('Form Validation', () => {
    it('should validate...', () => {})
  })

  describe('Error Handling', () => {
    it('should show error...', () => {})
  })
})
```

---

## Troubleshooting

### ❌ "React is not defined"

**Giải pháp**: Add `import React` to component files with JSX

```typescript
import React from 'react'
import { useState } from 'react'
```

### ❌ "Cannot find module '@/__tests__/...'"

**Giải pháp**: Check `jest.config.js` moduleNameMapper

```javascript
moduleNameMapper: {
  '^@/__tests__/(.+)$': '<rootDir>/__tests__/$1',
  '^@/(.+)$': '<rootDir>/src/$1',
}
```

### ❌ "Mock is not being called"

**Giải pháp**: Make sure mock is set up BEFORE render

```typescript
// ✅ CORRECT
jest.mock('@/services/api')
const mockApi = require('@/services/api')

beforeEach(() => {
  mockApi.default.post.mockResolvedValue({ data: {...} })
})

render(<Component />)

// ❌ WRONG (mock setup after render)
render(<Component />)
mockApi.default.post.mockResolvedValue({ data: {...} })
```

### ❌ "Test timeout"

**Giải pháp**: Increase timeout or check for missing `await`

```typescript
// Option 1: Increase timeout
it('should...', async () => {
  // test code
}, 10000) // 10 second timeout

// Option 2: Add missing await
await waitFor(() => {
  expect(...).toBeInTheDocument()
})
```

### ❌ "Cannot read property 'mock' of undefined"

**Giải pháp**: Import mock properly

```typescript
// ✅ CORRECT
jest.mock('@/services/auth.service')
const { authService } = require('@/services/auth.service')

// ❌ WRONG
const authService = require('@/services/auth.service')
authService.login.mockResolvedValue(...) // authService is not mocked
```

---

## Mock Data Reference

### Available Mock Data (`__tests__/utils/test-data.ts`)

```typescript
// User
export const mockUser = { id, email, fullName, role, ... }
export const mockAuthResponse = { accessToken, user }

// Rooms
export const mockRoomType = { id, name, basePrice, maxAdults, bedType, ... }
export const mockRoom = { id, roomNumber, floor, status, ... }

// Booking
export const mockBooking = { id, bookingCode, status, totalAmount, ... }
export const mockPayment = { id, amount, method, status, ... }

// Reviews
export const mockReview = { id, rating, title, comment, ... }

// Hotel
export const mockHotel = { id, name, city, starRating, ... }

// Availability
export const mockAvailability = { checkIn, checkOut, roomTypes, ... }
```

**Import chúng như sau**:

```typescript
import { mockUser, mockRoomType, mockBooking } from '@/__tests__/utils/test-data'
```

---

## Checklist for Writing Tests

Trước khi submit test, kiểm tra:

- [ ] ✅ Test name rõ ràng mô tả hành vi cần test
- [ ] ✅ Setup data trước test (beforeEach hoặc trong test)
- [ ] ✅ Render component hoặc gọi hàm
- [ ] ✅ Thực hiện user action (type, click, etc.)
- [ ] ✅ Assert kết quả
- [ ] ✅ Cleanup sau test (tự động qua React Testing Library)
- [ ] ✅ Mocks được clear giữa các test
- [ ] ✅ Không có hardcoded timeout
- [ ] ✅ Không test implementation details (test behavior thay vì code)
- [ ] ✅ Test chạy độc lập (không phụ thuộc test khác)

---

## Tài Liệu Tham Khảo

- [Jest Docs](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [userEvent Docs](https://testing-library.com/docs/user-event/intro)

---

## FAQ

**Q: Tôi nên test service hay component trước?**  
A: Test service trước (unit test), sau đó test component (integration test). Services là độc lập.

**Q: Tôi có cần test mọi cái không?**  
A: Không. Focus vào:
- Business logic (services)
- User interactions (components)
- Edge cases và error handling

**Q: Snapshot test có tốt không?**  
A: Tránh snapshot tests nếu có thể. Chỉ dùng cho UI changes detection.

**Q: Làm sao để test async logic?**  
A: Dùng `waitFor()` hoặc `act()` từ React Testing Library.

```typescript
await waitFor(() => {
  expect(screen.getByText('Done')).toBeInTheDocument()
})
```

---

**Cập nhật lần cuối**: April 17, 2026  
**Tác giả**: Copilot  
**Phiên bản**: 1.0
