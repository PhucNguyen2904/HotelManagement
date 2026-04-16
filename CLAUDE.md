# CLAUDE.md - AI Assistant Guidelines

> Hướng dẫn cho AI khi làm việc với codebase này.

## Project Overview

Hotel booking system với kiến trúc tách biệt frontend/backend.

| Component | Tech | Port |
|-----------|------|------|
| Backend | NestJS + Prisma + PostgreSQL | 3001 |
| Frontend | Next.js 14 (App Router) + Tailwind | 3000 |
| Database | PostgreSQL | 5432 |

## Folder Structure

```
/
├── backend/           # NestJS API
│   ├── src/
│   │   ├── main.ts           # Entry point
│   │   ├── app.module.ts     # Root module
│   │   ├── common/           # Shared (decorators, filters, interceptors)
│   │   ├── config/           # App configuration
│   │   ├── prisma/           # Prisma service
│   │   └── modules/          # Feature modules
│   │       ├── auth/         # Authentication
│   │       ├── users/        # User management
│   │       ├── hotels/       # Hotel info
│   │       ├── rooms/        # Physical rooms
│   │       ├── room-types/   # Room categories
│   │       ├── bookings/     # Booking logic
│   │       ├── payments/     # Payment processing
│   │       ├── availability/ # Room calendar
│   │       ├── reviews/      # Guest reviews
│   │       └── coupons/      # Discount codes
│   └── prisma/
│       └── schema.prisma     # Database schema
│
├── frontend/          # Next.js App (to be setup)
├── docs/              # System documentation
└── _legacy/           # Archived WordPress (read-only)
```

## Quick Commands

```bash
# Backend
cd backend
npm run start:dev      # Dev server
npm run build          # Production build
npm run test           # Run tests
npm run prisma:studio  # Database GUI
npm run prisma:migrate # Run migrations

# Frontend (after setup)
cd frontend
npm run dev            # Dev server
npm run build          # Production build
```

## Conventions

### Naming

| Type | Convention | Example |
|------|------------|---------|
| Files | kebab-case | `create-booking.dto.ts` |
| Classes | PascalCase | `BookingService` |
| Functions | camelCase | `createBooking()` |
| Constants | SCREAMING_SNAKE | `MAX_GUESTS` |
| DB tables | snake_case | `room_types` |

### Backend Module Structure

```
src/modules/[module-name]/
├── [name].module.ts       # Module definition
├── [name].controller.ts   # HTTP endpoints
├── [name].service.ts      # Business logic
└── dto/
    ├── create-[name].dto.ts
    └── update-[name].dto.ts
```

### Import Order

```typescript
// 1. External packages
import { Injectable } from '@nestjs/common';

// 2. Internal modules (from src/)
import { PrismaService } from '../../prisma/prisma.service';

// 3. Same module (relative)
import { CreateBookingDto } from './dto/create-booking.dto';

// 4. Types
import type { Booking } from '@prisma/client';
```

## Key Files to Read First

| Purpose | File |
|---------|------|
| Database schema | `backend/prisma/schema.prisma` |
| App entry | `backend/src/main.ts` |
| Module list | `backend/src/app.module.ts` |
| Auth logic | `backend/src/modules/auth/auth.service.ts` |
| Booking logic | `backend/src/modules/bookings/bookings.service.ts` |

## Documentation

| Doc | Content |
|-----|---------|
| `docs/architecture.md` | System overview, tech stack |
| `docs/database-design.md` | ERD, table descriptions |
| `docs/api-spec.md` | API endpoints reference |
| `docs/flow.md` | User flows (booking, payment) |

## Business Rules

| Rule | Description |
|------|-------------|
| Overbooking | Prevented by DB constraint `UNIQUE(room_id, date)` |
| Auth | JWT in Authorization header |
| Roles | SUPER_ADMIN > HOTEL_ADMIN > STAFF > GUEST |
| Check-in | 14:00 |
| Check-out | 12:00 |
| Payment | VNPay, Momo, Cash, Bank Transfer |

## Do NOT

- Modify `_legacy/` folder (archive only)
- Commit `.env` files
- Import services directly between modules (use module exports)
- Skip validation in DTOs
- Use `any` type without good reason

## AI Workflow Tips

### Reading Code

```
✅ "Đọc backend/src/modules/bookings/" (1 module)
❌ "Đọc toàn bộ backend/" (quá nhiều)
```

### Before Coding

1. Read relevant doc in `docs/`
2. Read the module you'll modify
3. Check `schema.prisma` for data structure

### Creating New Feature

1. Check if similar pattern exists
2. Follow existing module structure
3. Add DTO validation
4. Update Swagger decorators

## Environment Variables

Required in `backend/.env`:

```
DATABASE_URL=postgresql://...
JWT_SECRET=...
JWT_EXPIRES_IN=7d
PORT=3001
```

---

*Last updated: March 2026*
