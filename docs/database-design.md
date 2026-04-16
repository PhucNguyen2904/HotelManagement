# Database Design

## Overview

- **Database**: PostgreSQL
- **ORM**: Prisma
- **Naming**: snake_case for tables/columns, PascalCase for models

## ERD (Entity Relationship Diagram)

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   hotels    │──────<│ room_types  │──────<│    rooms    │
└─────────────┘       └─────────────┘       └─────────────┘
      │                     │                      │
      │                     │                      │
      ▼                     ▼                      ▼
┌─────────────┐       ┌─────────────┐       ┌─────────────────┐
│  bookings   │──────<│booking_rooms│       │room_availability│
└─────────────┘       └─────────────┘       └─────────────────┘
      │
      ├──────────────<┌─────────────┐
      │               │  payments   │
      │               └─────────────┘
      │
      ├──────────────<┌─────────────┐
      │               │   reviews   │
      │               └─────────────┘
      │
      └──────────────>┌─────────────┐
                      │    users    │
                      └─────────────┘
```

## Enums

| Enum | Values |
|------|--------|
| `UserRole` | SUPER_ADMIN, HOTEL_ADMIN, STAFF, GUEST |
| `RoomStatus` | AVAILABLE, OCCUPIED, MAINTENANCE, OUT_OF_ORDER |
| `AvailabilityStatus` | AVAILABLE, BOOKED, BLOCKED, MAINTENANCE |
| `BookingStatus` | PENDING, CONFIRMED, CHECKED_IN, CHECKED_OUT, CANCELLED, NO_SHOW, REFUNDED |
| `PaymentStatus` | PENDING, COMPLETED, FAILED, REFUNDED, PARTIALLY_REFUNDED |
| `PaymentMethod` | CASH, BANK_TRANSFER, CREDIT_CARD, MOMO, VNPAY, ZALOPAY |
| `PricingType` | BASE, WEEKEND, SEASONAL, HOLIDAY, PROMOTION, LAST_MINUTE |
| `BedType` | SINGLE, DOUBLE, TWIN, QUEEN, KING |
| `CouponType` | PERCENTAGE, FIXED_AMOUNT |

## Core Tables

### hotels
Main entity - supports multi-hotel system.

| Column | Type | Description |
|--------|------|-------------|
| id | cuid | Primary key |
| name | varchar(255) | Hotel name |
| slug | varchar(255) | URL-friendly name (unique) |
| address | varchar(500) | Full address |
| city, province | varchar(100) | Location |
| phone, email | varchar | Contact info |
| star_rating | int | 1-5 stars |
| check_in_time | varchar(5) | Default: "14:00" |
| check_out_time | varchar(5) | Default: "12:00" |
| is_active | boolean | Soft delete flag |

### users
User accounts for all roles.

| Column | Type | Description |
|--------|------|-------------|
| id | cuid | Primary key |
| email | varchar(255) | Unique, indexed |
| password_hash | varchar(255) | Bcrypt hashed |
| full_name | varchar(255) | Display name |
| phone | varchar(20) | Optional |
| id_number | varchar(50) | CCCD/Passport |
| role | UserRole | Permission level |
| is_active | boolean | Account status |
| email_verified | boolean | Email confirmed |
| last_login_at | timestamp | Last login time |

### room_types
Room categories (Deluxe, Suite, etc.)

| Column | Type | Description |
|--------|------|-------------|
| id | cuid | Primary key |
| hotel_id | cuid | FK → hotels |
| name | varchar(255) | "Phòng Deluxe" |
| slug | varchar(255) | "phong-deluxe" |
| base_price | decimal(12,0) | Base price in VND |
| max_adults | int | Default: 2 |
| max_children | int | Default: 1 |
| bed_type | BedType | SINGLE, DOUBLE, etc. |
| area_size | float | Square meters |

**Unique**: (hotel_id, slug)

### rooms
Physical room instances.

| Column | Type | Description |
|--------|------|-------------|
| id | cuid | Primary key |
| room_type_id | cuid | FK → room_types |
| room_number | varchar(20) | "101", "201A" |
| floor | int | Floor number |
| status | RoomStatus | Current status |
| is_active | boolean | Active flag |

**Unique**: (room_type_id, room_number)

### room_availability
**CRITICAL TABLE** - Prevents overbooking.

| Column | Type | Description |
|--------|------|-------------|
| id | cuid | Primary key |
| room_id | cuid | FK → rooms |
| date | date | Specific date |
| status | AvailabilityStatus | AVAILABLE/BOOKED/etc. |
| booking_id | cuid? | FK → bookings (if booked) |
| price | decimal? | Override price for this date |

**Unique**: (room_id, date) - **Database-level overbooking prevention!**

### bookings
Main booking record.

| Column | Type | Description |
|--------|------|-------------|
| id | cuid | Primary key |
| booking_code | varchar(20) | Human-readable code (unique) |
| user_id | cuid | FK → users (who booked) |
| hotel_id | cuid | FK → hotels |
| status | BookingStatus | Current status |
| check_in | date | Check-in date |
| check_out | date | Check-out date |
| total_nights | int | Calculated nights |
| adults, children, infants | int | Guest counts |
| subtotal | decimal | Room charges |
| tax_rate | decimal(5,2) | Tax percentage |
| tax_amount | decimal | Calculated tax |
| discount_amount | decimal | Coupon discounts |
| total_amount | decimal | Final amount |
| guest_* | varchar | Guest info (can differ from user) |
| special_requests | text | Guest requests |

### booking_rooms
Junction table for multi-room bookings.

| Column | Type | Description |
|--------|------|-------------|
| id | cuid | Primary key |
| booking_id | cuid | FK → bookings |
| room_id | cuid | FK → rooms |
| check_in | date | Room check-in |
| check_out | date | Room check-out |
| price_per_night | decimal | Nightly rate |
| total_price | decimal | Room total |

### payments
Payment transactions.

| Column | Type | Description |
|--------|------|-------------|
| id | cuid | Primary key |
| booking_id | cuid | FK → bookings |
| amount | decimal | Payment amount |
| method | PaymentMethod | CASH, MOMO, VNPAY... |
| status | PaymentStatus | PENDING/COMPLETED/etc. |
| transaction_ref | varchar | Gateway reference |
| paid_at | timestamp | Payment time |
| metadata | json | Gateway response |

### pricing_rules
Dynamic pricing configuration.

| Column | Type | Description |
|--------|------|-------------|
| id | cuid | Primary key |
| room_type_id | cuid | FK → room_types |
| name | varchar | Rule name |
| type | PricingType | BASE/WEEKEND/SEASONAL... |
| price | decimal | Price for this rule |
| start_date | date? | Valid from |
| end_date | date? | Valid until |
| days_of_week | int[] | [0,6] for Sat/Sun |
| priority | int | Higher = more important |

### coupons
Discount codes.

| Column | Type | Description |
|--------|------|-------------|
| id | cuid | Primary key |
| hotel_id | cuid | FK → hotels |
| code | varchar(50) | "SUMMER2024" |
| type | CouponType | PERCENTAGE/FIXED_AMOUNT |
| value | decimal | 10 (%) or 100000 (VND) |
| min_nights | int? | Minimum stay |
| min_amount | decimal? | Minimum booking value |
| max_discount | decimal? | Cap for percentage |
| max_usage | int? | Total usage limit |
| used_count | int | Current usage |
| start_date, end_date | date | Validity period |

### reviews
Guest reviews.

| Column | Type | Description |
|--------|------|-------------|
| id | cuid | Primary key |
| user_id | cuid | FK → users |
| booking_id | cuid | FK → bookings (unique) |
| room_type_id | cuid | FK → room_types |
| rating | int | 1-5 stars |
| title | varchar? | Review title |
| comment | text? | Review body |
| response | text? | Hotel response |
| is_visible | boolean | Moderation flag |

## Indexes

```sql
-- Performance indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_rooms_status ON rooms(status);
CREATE INDEX idx_room_availability_date_status ON room_availability(date, status);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_checkin_checkout ON bookings(check_in, check_out);
CREATE INDEX idx_payments_status ON payments(status);
```

## Key Constraints

1. **Overbooking Prevention**
   ```sql
   UNIQUE (room_id, date) ON room_availability
   ```

2. **One Review Per Booking**
   ```sql
   UNIQUE (booking_id) ON reviews
   ```

3. **Room Number Uniqueness**
   ```sql
   UNIQUE (room_type_id, room_number) ON rooms
   ```

4. **Coupon Code Per Hotel**
   ```sql
   UNIQUE (hotel_id, code) ON coupons
   ```

## Data Flow Example: Create Booking

```
1. Check room_availability WHERE date BETWEEN check_in AND check_out
2. BEGIN TRANSACTION
3. INSERT booking
4. INSERT booking_rooms (for each room)
5. UPDATE room_availability SET status='BOOKED', booking_id=?
6. COMMIT
```

## Related Docs

- [Architecture](./architecture.md)
- [API Specification](./api-spec.md)
