# Frontend - Khách Sạn Ngân Hà

Hotel booking system frontend built with Next.js 14, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Date Handling**: date-fns
- **Icons**: Lucide React

## Folder Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── (auth)/               # Auth group (login, register)
│   ├── booking/              # Booking page
│   ├── rooms/                # Room search page
│   └── page.tsx              # Home page
├── components/               # React components
│   ├── ui/                   # Base components (Button, Input, Card)
│   ├── layout/               # Layout components (Header, Footer)
│   └── features/             # Feature-specific components
│       ├── auth/             # Auth components
│       ├── rooms/            # Room components
│       └── booking/          # Booking components
├── services/                 # API service layer
│   ├── api.ts                # Axios instance + interceptors
│   ├── auth.service.ts
│   ├── hotels.service.ts
│   ├── room-types.service.ts
│   ├── availability.service.ts
│   ├── bookings.service.ts
│   └── coupons.service.ts
├── hooks/                    # Custom React hooks
│   ├── useAuth.ts
│   ├── useRoomTypes.ts
│   └── useAvailability.ts
├── stores/                   # Zustand stores
│   ├── authStore.ts
│   └── bookingStore.ts
├── types/                    # TypeScript types
│   └── index.ts              # All type definitions
├── lib/                      # Utility functions
│   └── utils.ts              # formatCurrency, cn(), etc.
└── globals.css               # Global styles

```

## Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local

# Edit .env.local with your backend URL
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Running

```bash
# Development
npm run dev

# Production build
npm run build
npm start

# Linting
npm run lint
```

The app runs on `http://localhost:3000`

## Features

### Pages

- **Home** (`/`): Hero section with search form
- **Rooms** (`/rooms`): Room search and listing with filters
- **Booking** (`/booking`): Booking confirmation and payment info
- **Login** (`/(auth)/login`): User authentication
- **Register** (`/(auth)/register`): New user registration

### Components

#### UI Components
- `Button` - Variants: primary, secondary, outline, ghost, danger
- `Input` - Text input with label & error state
- `Card` - Flexible card container with header/content/footer

#### Feature Components
- `RoomCard` - Room display with price & amenities
- `SearchForm` - Search hotels by date & guests
- `Header` - Navigation & auth status
- `Footer` - Site footer

### Services

Each service wraps API calls for a specific module:

```typescript
// Usage
import { hotelsService } from '@/services';

const hotels = await hotelsService.getAll({ city: 'Da Lat' });
```

Available services:
- `authService` - Login, register, profile
- `hotelsService` - Hotel CRUD
- `roomTypesService` - Room types listing
- `availabilityService` - Availability checking
- `bookingsService` - Booking CRUD
- `couponsService` - Coupon validation

### State Management

**Zustand Stores**:

```typescript
// Auth store
import { useAuthStore } from '@/stores/authStore';
const { user, isAuthenticated, login, logout } = useAuthStore();

// Booking store
import { useBookingStore } from '@/stores/bookingStore';
const { checkIn, checkOut, setCoupon } = useBookingStore();
```

### Custom Hooks

```typescript
// Auto-checks auth on mount
const { user, isAuthenticated } = useAuth();

// Fetches room types by hotel
const { roomTypes, isLoading } = useRoomTypes({
  hotelId: '...',
  checkIn: '2024-03-01',
  checkOut: '2024-03-03',
});

// Check availability
const { checkAvailability } = useAvailability();
const result = await checkAvailability({ hotelId, checkIn, checkOut });
```

## API Integration

### Base URL

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Authentication

JWT tokens stored in `localStorage`:
- Login sets `accessToken`
- Axios interceptor adds `Authorization: Bearer <token>` to all requests
- 401 responses clear token and redirect to `/login`

### Response Format

Success:
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": { ... }
}
```

Error:
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [...]
}
```

## Conventions

### Naming

| Type | Convention | Example |
|------|------------|---------|
| Files | kebab-case | `room-card.tsx` |
| Components | PascalCase | `RoomCard` |
| Hooks | camelCase with `use` | `useRoomTypes` |
| Functions | camelCase | `formatCurrency()` |
| Constants | SCREAMING_SNAKE | `MAX_GUESTS` |

### Component Structure

```typescript
'use client'; // If using hooks/interactivity

import { useState } from 'react';
import type { ComponentProps } from '@/types';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface Props extends HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary';
}

export function MyComponent({ className, variant = 'primary' }: Props) {
  return <div className={cn('base-class', className)}>Content</div>;
}
```

### Tailwind Classes

Use composition over custom classes:
```tsx
// ✅ Good
className={cn('px-4 py-2 rounded-lg bg-primary-600', className)}

// ❌ Bad
className="custom-btn-primary"  // defined in CSS
```

## Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Note: Only variables prefixed with `NEXT_PUBLIC_` are exposed to browser.

## Design System

### Colors

- Primary: Blue (`primary-600` = `#2563eb`)
- Grays: `gray-50` to `gray-900`
- Success: Green
- Warning: Yellow
- Error: Red

### Spacing

Uses Tailwind's default scale (4px base):
- `px-4` = 1rem = 16px
- `py-8` = 2rem = 32px

### Typography

- Headers: `font-bold` or `font-semibold`
- Body: `text-base` or `text-sm`
- Labels: `text-sm font-medium`

## Related Files

- Backend: `../backend/`
- API Spec: `../docs/api-spec.md`
- Database Schema: `../docs/database-design.md`
- Architecture: `../docs/architecture.md`
- Guidelines: `../CLAUDE.md`

## Notes

- App Router: all routes in `src/app/` (no `pages/` folder)
- Client components: explicitly mark with `'use client'`
- Server-side rendering by default
- Image optimization via Next.js `Image` component
- Async components: can be used directly in App Router
