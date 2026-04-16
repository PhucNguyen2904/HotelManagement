# 🚀 Frontend Setup & Deployment Guide

## Quick Start (5 minutes)

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 3. Backend Must Be Running
```bash
# In another terminal
cd backend
npm run start:dev
```

Backend API: http://localhost:3001/api

---

## Environment Setup

### .env.local Configuration
Already created with default values:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

**For Production:** Update API URL to your production backend.

### Available Scripts

```bash
npm run dev              # Development (http://localhost:3000)
npm run build            # Production build
npm run start            # Run production build
npm run lint             # Check code style
npm run format           # Auto-format with Prettier
npm run format:check     # Check formatting without changes
```

---

## Project Structure

### Pages (8 total)

| Route | File | Purpose |
|-------|------|---------|
| `/` | `app/page.tsx` | Homepage with hero + search |
| `/rooms` | `app/rooms/page.tsx` | Room search & filter |
| `/booking` | `app/booking/page.tsx` | Confirm booking + payment info |
| `/bookings` | `app/bookings/page.tsx` | User's bookings list |
| `/bookings/:id` | `app/bookings/[id]/page.tsx` | Booking details & cancel |
| `/(auth)/login` | `app/(auth)/login/page.tsx` | Login form |
| `/(auth)/register` | `app/(auth)/register/page.tsx` | Register form |
| `*` | `app/not-found.tsx` | 404 page |

### Components (12 total)

**UI Base** (3)
- `Button` - with 5 variants (primary, secondary, outline, ghost, danger)
- `Input` - with label, error state
- `Card` - composable (header, title, content, footer)

**Layout** (2)
- `Header` - navigation, auth status
- `Footer` - site footer

**Features**
- **Auth** (2): `LoginForm`, `RegisterForm`
- **Rooms** (2): `RoomCard`, `SearchForm`
- **Booking** (2): `BookingSummary`, `GuestInfoForm`

### Services (7 total)

Each service wraps API endpoints:

```typescript
// Authentication
authService.login(email, password)
authService.register(data)
authService.getProfile()

// Hotels & Rooms
hotelsService.getAll(query)
hotelsService.getById(id)
roomTypesService.getAll(query)
roomTypesService.getById(id)

// Booking
availabilityService.check(query)
bookingsService.getAll(query)
bookingsService.getById(id)
bookingsService.create(data)
bookingsService.cancel(id, reason)

// Coupons
couponsService.validate(query)
```

### Hooks (3 total)

```typescript
// Auto-checks auth on mount
const { user, isAuthenticated, logout } = useAuth();

// Fetch room types
const { roomTypes, isLoading } = useRoomTypes({
  hotelId, checkIn, checkOut, adults
});

// Check availability
const { checkAvailability, result } = useAvailability();
```

### Stores (2 total - Zustand)

```typescript
// Auth state - persisted to localStorage
useAuthStore()
  .user
  .isAuthenticated
  .login(email, password)
  .logout()

// Booking state
useBookingStore()
  .checkIn, .checkOut, .adults, .children
  .guestName, .guestEmail, .guestPhone
  .selectedRoomType, .quantity
  .couponCode, .discountAmount
```

---

## Code Conventions

### File Naming

| Type | Convention | Example |
|------|------------|---------|
| Pages | kebab-case | `page.tsx` |
| Components | PascalCase | `RoomCard.tsx` |
| Services | kebab-case | `auth.service.ts` |
| Hooks | camelCase with `use` | `useRoomTypes.ts` |
| Stores | camelCase | `authStore.ts` |

### Import Order

```typescript
// 1. External packages
import { useState } from 'react';
import Link from 'next/link';

// 2. Internal modules (from src/)
import { Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services';

// 3. Types
import type { User } from '@/types';
```

### 'use client' Directive

Required for components using:
- Hooks (useState, useEffect, etc)
- Event handlers
- Zustand stores

```typescript
'use client';

import { useState } from 'react';

export function MyComponent() {
  const [count, setCount] = useState(0);
  // ...
}
```

### Tailwind Classes

Always use composition, no custom CSS:

```tsx
// ✅ Good
className={cn('px-4 py-2 rounded-lg bg-primary-600', className)}

// ❌ Bad
className="my-custom-btn"  // requires CSS
```

---

## Authentication Flow

### Login Process
1. User submits email + password
2. `LoginForm` calls `useAuthStore().login()`
3. `authService.login()` → backend returns JWT token
4. Token saved in localStorage
5. User state saved in Zustand store
6. Redirect to home page

### Protected Pages
```typescript
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function ProtectedPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated]);

  // ...
}
```

### JWT Interceptor
All API requests automatically include:
```
Authorization: Bearer <token>
```

If response is 401 (unauthorized):
1. Clear token from localStorage
2. Redirect to `/login`

---

## API Integration

### Response Format

**Success** (HTTP 200):
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": { ... }
}
```

**Error** (HTTP 4xx/5xx):
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [...]
}
```

### Usage Example

```typescript
import { hotelsService } from '@/services';

// In a component or hook
const hotels = await hotelsService.getAll({ city: 'Da Lat' });
```

### Error Handling

```typescript
try {
  const data = await bookingsService.create(bookingData);
} catch (err: any) {
  const message = err.response?.data?.message || 'Unknown error';
  setError(message);
}
```

---

## Type Safety

### Types File (40+ items)
Located in `src/types/index.ts`

Includes:
- Enums: `UserRole`, `RoomStatus`, `BookingStatus`, `PaymentStatus`, etc.
- Entities: `User`, `Hotel`, `RoomType`, `Room`, `Booking`, `Payment`, `Review`, `Coupon`
- API: `ApiResponse<T>`, `PaginatedResponse<T>`
- Requests: `LoginRequest`, `CreateBookingRequest`, `ValidateCouponQuery`

### Usage

```typescript
import type { Hotel, Booking, User } from '@/types';

const hotel: Hotel = {
  id: 'clxxx',
  name: 'Khách Sạn Ngân Hà',
  // ...
};
```

---

## Development Tips

### Common Tasks

**Add a new page:**
1. Create folder in `src/app/`
2. Create `page.tsx` inside
3. Use existing components and hooks
4. Call services for data

**Add a new component:**
1. Create in `src/components/features/<feature>/`
2. Make it reusable (accept props)
3. Export from `index.ts`

**Add a new service:**
1. Create in `src/services/[name].service.ts`
2. Follow service pattern (use `api` client)
3. Export from `src/services/index.ts`

**Add a custom hook:**
1. Create in `src/hooks/[hookName].ts`
2. Start with `use` prefix
3. Export from `src/hooks/index.ts`

### Code Formatting

Auto-format before committing:
```bash
npm run format
```

Check without changes:
```bash
npm run format:check
```

---

## Troubleshooting

### API Connection Issues

**Error**: `Cannot reach http://localhost:3001/api`

**Solution**: Ensure backend is running:
```bash
cd ../backend
npm run start:dev
```

### Auth Not Persisting

Check browser DevTools → Application → LocalStorage:
- Should contain `auth-storage` key with user data

### 404 on Routes

**Issue**: Page not found after navigation

**Solution**: Ensure page file exists at correct path:
```
/bookings/123  →  src/app/bookings/[id]/page.tsx
/rooms         →  src/app/rooms/page.tsx
```

### Build Errors

```bash
npm run build
```

Check output for messages. Common issues:
- TypeScript errors: check `tsconfig.json`
- Missing dependencies: `npm install`
- Environment variables: verify `.env.local`

---

## Production Deployment

### Build

```bash
npm run build
npm run start
```

### Environment Variables

Update `.env.local` for production:
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Static Exports (if needed)

In `next.config.mjs`:
```javascript
export const output = 'export';
```

---

## Related Documentation

- Backend API: `../backend/README.md`
- Database Schema: `../docs/database-design.md`
- API Endpoints: `../docs/api-spec.md`
- Architecture: `../docs/architecture.md`
- Project Guidelines: `../CLAUDE.md`
- Frontend README: `./README.md`

---

## Support

For issues or questions:
1. Check existing code patterns in similar pages
2. Review type definitions in `src/types/index.ts`
3. Check API specification in `../docs/api-spec.md`
4. Review backend implementation in `../backend/`

---

**Frontend Ready for Development** ✅
Created: March 2026
