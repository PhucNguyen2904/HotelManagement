# Architecture Overview

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router) + React + Tailwind CSS |
| Backend | NestJS + Node.js |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT (passport-jwt) |
| Cache | Redis (ioredis) |
| API Docs | Swagger (@nestjs/swagger) |

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTS                                  │
│              (Web Browser / Mobile App)                         │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (Next.js)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   Pages     │  │ Components  │  │      Services           │ │
│  │  (App Dir)  │  │    (UI)     │  │   (API Calls)           │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└─────────────────────────┬───────────────────────────────────────┘
                          │ HTTP/REST
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (NestJS)                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                     API Gateway                           │  │
│  │    (Rate Limiting / Auth Guard / Validation)              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│  ┌───────────┬───────────┬───────────┬───────────┬──────────┐  │
│  │   Auth    │   Users   │   Rooms   │ Bookings  │ Payments │  │
│  │  Module   │  Module   │  Module   │  Module   │  Module  │  │
│  └───────────┴───────────┴───────────┴───────────┴──────────┘  │
│                              │                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   Common Layer                            │  │
│  │   (Guards / Interceptors / Filters / Decorators)          │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────┬───────────────────────────────────────┘
                          │ Prisma ORM
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                  │
│  ┌─────────────────────┐      ┌─────────────────────────────┐  │
│  │    PostgreSQL       │      │         Redis               │  │
│  │   (Primary DB)      │      │        (Cache)              │  │
│  └─────────────────────┘      └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Folder Structure

```
khachsannganha.com/
├── frontend/          # Next.js application
├── backend/           # NestJS API server
├── docs/              # Documentation
├── _legacy/           # Archived WordPress (read-only)
└── README.md
```

## Backend Structure

```
backend/src/
├── main.ts               # Application entry point
├── app.module.ts         # Root module
├── common/               # Shared utilities
│   ├── decorators/       # Custom decorators (@Public, @Roles, @CurrentUser)
│   ├── filters/          # Exception filters
│   └── interceptors/     # Logging, Transform interceptors
├── config/               # App configuration
├── prisma/               # Prisma service module
└── modules/              # Feature modules
    ├── auth/             # Authentication (JWT, Guards, Strategies)
    ├── users/            # User management
    ├── hotels/           # Hotel information
    ├── rooms/            # Physical rooms
    ├── room-types/       # Room categories
    ├── availability/     # Room calendar
    ├── bookings/         # Booking logic
    ├── payments/         # Payment processing
    └── reviews/          # Guest reviews
```

## Backend Modules

| Module | Responsibility |
|--------|---------------|
| `auth` | Login, Register, JWT, Password reset |
| `users` | User CRUD, Profile management |
| `hotels` | Hotel information, Settings |
| `room-types` | Room categories (Deluxe, Suite...) |
| `rooms` | Physical rooms, Room numbers |
| `availability` | Room calendar, Inventory management |
| `bookings` | Booking CRUD, Status management |
| `payments` | Payment processing, Refunds |
| `reviews` | Guest reviews, Ratings |

## Key Design Decisions

### 1. Multi-hotel Ready
- `Hotel` entity supports multiple properties
- `HotelStaff` junction table for staff assignments
- All queries scoped by `hotelId`

### 2. Anti-overbooking
- `RoomAvailability` table: 1 row = 1 room + 1 date
- Unique constraint `@@unique([roomId, date])` at DB level
- Transaction with row locking on booking creation

### 3. Flexible Pricing
- `PricingRule` supports: base, weekend, seasonal, holiday, promotion
- Priority-based rule matching
- `daysOfWeek` array for weekend pricing

### 4. Separation of Concerns
- Controllers: HTTP handling only
- Services: Business logic
- Prisma: Data access
- DTOs: Validation at edges

## Environment Variables

```bash
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/hotel_db"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"

# Redis
REDIS_HOST="localhost"
REDIS_PORT=6379

# App
PORT=3001
NODE_ENV="development"
```

## API Base URLs

| Environment | URL |
|-------------|-----|
| Development | http://localhost:3001/api |
| Production | https://api.khachsannganha.com |

## Related Docs

- [Database Design](./database-design.md)
- [API Specification](./api-spec.md)
- [User Flows](./flow.md)
