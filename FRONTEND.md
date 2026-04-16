# Frontend Setup - Khách Sạn Ngân Hà

Frontend application hoàn toàn mới được xây dựng với **Next.js 14 (App Router) + TypeScript + Tailwind CSS**.

## 📋 Tóm tắt

| Aspect | Details |
|--------|---------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State | Zustand |
| HTTP | Axios |
| Port | 3000 |

## 🗂️ Cấu trúc

```
frontend/
├── src/
│   ├── app/                  # Pages (App Router)
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── booking/
│   │   ├── rooms/
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/               # Base components
│   │   ├── layout/           # Header, Footer
│   │   └── features/
│   │       └── rooms/        # Room-related components
│   ├── services/             # API clients
│   ├── hooks/                # Custom hooks
│   ├── stores/               # Zustand state
│   ├── types/                # TypeScript types
│   └── lib/                  # Utilities (formatCurrency, cn, etc)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.mjs
├── .eslintrc.json
├── .env.local.example
└── README.md
```

## 🚀 Khởi động

### Installation

```bash
cd frontend
npm install
cp .env.local.example .env.local
```

### Development

```bash
npm run dev
# Mở http://localhost:3000
```

### Production

```bash
npm run build
npm start
```

## 🔧 Cấu hình

### .env.local

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 📦 Dependencies

- `next@14.2.3` - Framework
- `react@18.3.1` - UI library
- `axios@1.7.2` - HTTP client
- `zustand@4.5.2` - State management
- `react-hook-form@7.51.5` - Form handling
- `tailwindcss@3.4.3` - Styling
- `lucide-react@0.378.0` - Icons

## 🎯 Pages

| Page | Route | Auth | Purpose |
|------|-------|------|---------|
| Home | `/` | No | Search & hero |
| Rooms | `/rooms` | No | Search results |
| Login | `/(auth)/login` | No | Login form |
| Register | `/(auth)/register` | No | Registration |
| Booking | `/booking` | Yes | Confirm booking |

## 🔑 Key Files

| File | Purpose |
|------|---------|
| `src/types/index.ts` | All TypeScript types (matching backend) |
| `src/services/api.ts` | Axios instance + JWT interceptors |
| `src/stores/authStore.ts` | Auth state (user, login, logout) |
| `src/stores/bookingStore.ts` | Booking state (dates, room, guest info) |
| `src/components/layout/Header.tsx` | Navigation & auth display |
| `src/lib/utils.ts` | formatCurrency, cn(), calculateNights |

## 📡 API Integration

### Services (one per backend module)

```typescript
// Services wrap API calls
import { authService, hotelsService, bookingsService } from '@/services';

// Usage
const { accessToken, user } = await authService.login(email, password);
const hotels = await hotelsService.getAll({ city: 'Da Lat' });
const booking = await bookingsService.create(bookingData);
```

### Interceptors

- **Request**: Adds JWT token from localStorage
- **Response**: 401 → clears token + redirects to /login

## 🎨 UI Components

### Base Components

- `Button` - Variants: primary, secondary, outline, ghost, danger
- `Input` - Input with label & error state
- `Card` - Container with header/content/footer sections

### Feature Components

- `RoomCard` - Room display with image, amenities, price
- `SearchForm` - Date & guest picker for room search
- `Header` - Navigation bar
- `Footer` - Site footer

## 🪝 Custom Hooks

```typescript
// Auto-checks auth on mount
const { user, isAuthenticated, logout } = useAuth();

// Fetches room types by filters
const { roomTypes, isLoading, error } = useRoomTypes({
  hotelId, checkIn, checkOut, adults
});

// Check availability
const { checkAvailability, result, isLoading } = useAvailability();
```

## 🗂️ State Management

### Auth Store (Zustand)
```typescript
const { user, login, logout, isAuthenticated } = useAuthStore();
```

Persists to localStorage, checks auth on app load.

### Booking Store (Zustand)
```typescript
const {
  checkIn, checkOut, adults, children,
  guestName, guestEmail, guestPhone,
  selectedRoomType, quantity,
  couponCode, discountAmount,
  setDates, setGuests, setRoomType, setGuestInfo, setCoupon
} = useBookingStore();
```

## 📝 Conventions

### File Naming
- Components: `PascalCase` + `.tsx` → `RoomCard.tsx`
- Services: `kebab-case` + `.service.ts` → `auth.service.ts`
- Hooks: `camelCase` with `use` → `useRoomTypes.ts`
- Types: `snake_case` in index → `user_role`

### Component Template
```typescript
'use client';  // If using hooks

import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface Props extends HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary';
}

export function MyComponent({ className, variant = 'primary', ...props }: Props) {
  return <div className={cn('base', className)} {...props} />;
}
```

### Tailwind Usage
```tsx
// ✅ Use composition
className={cn('px-4 py-2 rounded-lg', className)}

// ❌ Avoid custom CSS classes
className="my-custom-btn"
```

## 🔐 Authentication Flow

1. User fills login form
2. `authService.login()` → JWT token
3. Store token in localStorage
4. Axios adds `Authorization: Bearer <token>` header
5. Check auth on app load with `useAuth()`
6. 401 response → clear token + redirect to /login

## 💾 Data Flow Example

### Booking Page
1. `useRoomTypes()` → fetch room details
2. User fills `<form>` → store in `useBookingStore`
3. Validate coupon → `couponsService.validate()`
4. Submit → `bookingsService.create()`
5. Redirect to booking confirmation

## ✅ Testing

Run linter:
```bash
npm run lint
```

## 📚 References

- **Backend API**: `../backend/` (NestJS + Prisma)
- **API Spec**: `../docs/api-spec.md`
- **Database**: `../docs/database-design.md`
- **Architecture**: `../docs/architecture.md`
- **Guidelines**: `../CLAUDE.md`
- **Frontend README**: `./README.md`

## 🔄 Next Steps

1. Install dependencies: `npm install`
2. Setup `.env.local` with backend URL
3. Start backend: `cd ../backend && npm run start:dev`
4. Start frontend: `npm run dev`
5. Open http://localhost:3000

---

**Status**: ✅ Frontend scaffold complete with all core features
**Last Updated**: March 2026
