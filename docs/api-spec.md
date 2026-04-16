# API Specification

## Base URL

```
Development: http://localhost:3001/api
Production:  https://api.khachsannganha.com
```

## Authentication

All protected endpoints require JWT token in header:

```http
Authorization: Bearer <access_token>
```

## Response Format

### Success

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": { ... }
}
```

### Error

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [
    { "field": "email", "message": "Invalid email format" }
  ]
}
```

---

## Auth Module

### POST /auth/register
Register new user account.

**Public**: Yes

**Body**:
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "fullName": "Nguyen Van A",
  "phone": "0901234567"
}
```

**Response**: `201 Created`
```json
{
  "data": {
    "id": "clxxx...",
    "email": "user@example.com",
    "fullName": "Nguyen Van A",
    "role": "GUEST"
  }
}
```

### POST /auth/login
Authenticate user.

**Public**: Yes

**Body**:
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Response**: `200 OK`
```json
{
  "data": {
    "accessToken": "eyJhbGci...",
    "user": {
      "id": "clxxx...",
      "email": "user@example.com",
      "fullName": "Nguyen Van A",
      "role": "GUEST"
    }
  }
}
```

### GET /auth/profile
Get current user profile.

**Auth**: Required

**Response**: `200 OK`
```json
{
  "data": {
    "id": "clxxx...",
    "email": "user@example.com",
    "fullName": "Nguyen Van A",
    "phone": "0901234567",
    "role": "GUEST"
  }
}
```

---

## Hotels Module

### GET /hotels
List all hotels.

**Public**: Yes

**Query**:
| Param | Type | Description |
|-------|------|-------------|
| city | string | Filter by city |
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10) |

**Response**: `200 OK`
```json
{
  "data": [
    {
      "id": "clxxx...",
      "name": "Khách sạn Ngân Hà",
      "slug": "khach-san-ngan-ha",
      "city": "Đà Lạt",
      "starRating": 3,
      "coverUrl": "https://..."
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### GET /hotels/:id
Get hotel details.

**Public**: Yes

---

## Room Types Module

### GET /room-types
List room types for a hotel.

**Public**: Yes

**Query**:
| Param | Type | Description |
|-------|------|-------------|
| hotelId | string | Required - Hotel ID |
| checkIn | date | Filter available from date |
| checkOut | date | Filter available to date |
| adults | number | Filter by capacity |

**Response**: `200 OK`
```json
{
  "data": [
    {
      "id": "clxxx...",
      "name": "Phòng Deluxe",
      "slug": "phong-deluxe",
      "basePrice": 800000,
      "maxAdults": 2,
      "maxChildren": 1,
      "bedType": "DOUBLE",
      "areaSize": 25,
      "images": [
        { "url": "https://...", "isPrimary": true }
      ],
      "amenities": [
        { "name": "WiFi", "icon": "wifi" },
        { "name": "Điều hòa", "icon": "ac" }
      ],
      "availableRooms": 3
    }
  ]
}
```

### GET /room-types/:id
Get room type details with availability.

---

## Rooms Module

### GET /rooms
List physical rooms.

**Auth**: STAFF, HOTEL_ADMIN, SUPER_ADMIN

**Query**:
| Param | Type | Description |
|-------|------|-------------|
| roomTypeId | string | Filter by room type |
| status | string | AVAILABLE, OCCUPIED, etc. |
| floor | number | Filter by floor |

### POST /rooms
Create new room.

**Auth**: HOTEL_ADMIN, SUPER_ADMIN

**Body**:
```json
{
  "roomTypeId": "clxxx...",
  "roomNumber": "101",
  "floor": 1
}
```

### PATCH /rooms/:id/status
Update room status.

**Auth**: STAFF+

**Body**:
```json
{
  "status": "MAINTENANCE",
  "notes": "AC repair"
}
```

---

## Availability Module

### GET /availability
Check room availability.

**Public**: Yes

**Query**:
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| hotelId | string | Yes | Hotel ID |
| checkIn | date | Yes | Start date (YYYY-MM-DD) |
| checkOut | date | Yes | End date (YYYY-MM-DD) |
| roomTypeId | string | No | Specific room type |

**Response**: `200 OK`
```json
{
  "data": {
    "checkIn": "2024-03-01",
    "checkOut": "2024-03-03",
    "totalNights": 2,
    "roomTypes": [
      {
        "id": "clxxx...",
        "name": "Phòng Deluxe",
        "basePrice": 800000,
        "availableCount": 3,
        "pricePerNight": 850000,
        "totalPrice": 1700000
      }
    ]
  }
}
```

### POST /availability/block
Block dates for a room.

**Auth**: STAFF+

**Body**:
```json
{
  "roomId": "clxxx...",
  "startDate": "2024-03-15",
  "endDate": "2024-03-20",
  "reason": "Renovation"
}
```

---

## Bookings Module

### GET /bookings
List bookings.

**Auth**: Required (GUEST sees own, STAFF sees hotel's, ADMIN sees all)

**Query**:
| Param | Type | Description |
|-------|------|-------------|
| status | string | Filter by status |
| hotelId | string | Filter by hotel |
| checkIn | date | Filter by check-in date |
| page, limit | number | Pagination |

### POST /bookings
Create new booking.

**Auth**: Required

**Body**:
```json
{
  "hotelId": "clxxx...",
  "checkIn": "2024-03-01",
  "checkOut": "2024-03-03",
  "rooms": [
    {
      "roomTypeId": "clxxx...",
      "quantity": 1,
      "adults": 2,
      "children": 0
    }
  ],
  "guestName": "Nguyen Van A",
  "guestEmail": "guest@example.com",
  "guestPhone": "0901234567",
  "specialRequests": "Late check-in"
}
```

**Response**: `201 Created`
```json
{
  "data": {
    "id": "clxxx...",
    "bookingCode": "BK240301001",
    "status": "PENDING",
    "checkIn": "2024-03-01",
    "checkOut": "2024-03-03",
    "totalNights": 2,
    "subtotal": 1600000,
    "taxAmount": 160000,
    "discountAmount": 100000,
    "totalAmount": 1660000,
    "rooms": [...]
  }
}
```

### GET /bookings/:id
Get booking details.

### PATCH /bookings/:id/status
Update booking status.

**Auth**: STAFF+

**Body**:
```json
{
  "status": "CONFIRMED"
}
```

### PATCH /bookings/:id/check-in
Process check-in.

**Auth**: STAFF+

### PATCH /bookings/:id/check-out
Process check-out.

**Auth**: STAFF+

### POST /bookings/:id/cancel
Cancel booking.

**Auth**: Owner or STAFF+

**Body**:
```json
{
  "reason": "Change of plans"
}
```

---

## Payments Module

### POST /payments
Create payment for booking.

**Auth**: Required

**Body**:
```json
{
  "bookingId": "clxxx...",
  "amount": 1660000,
  "method": "VNPAY"
}
```

**Response**: `201 Created`
```json
{
  "data": {
    "id": "clxxx...",
    "paymentUrl": "https://vnpay.vn/...",
    "transactionRef": "TXN240301001"
  }
}
```

### POST /payments/webhook
Payment gateway callback.

**Public**: Yes (verified by signature)

### GET /payments/:id
Get payment details.

### POST /payments/:id/refund
Refund payment.

**Auth**: HOTEL_ADMIN+

---

## Reviews Module

### GET /reviews
List reviews for a room type.

**Public**: Yes

**Query**:
| Param | Type | Description |
|-------|------|-------------|
| roomTypeId | string | Required |
| rating | number | Filter by rating |

### POST /reviews
Create review (after checkout).

**Auth**: Required (must have completed booking)

**Body**:
```json
{
  "bookingId": "clxxx...",
  "rating": 5,
  "title": "Tuyệt vời!",
  "comment": "Phòng sạch sẽ, nhân viên thân thiện..."
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Validation failed |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource conflict (e.g., overbooking) |
| 422 | Unprocessable - Business rule violation |
| 429 | Too Many Requests - Rate limited |
| 500 | Internal Server Error |

## Rate Limiting

- Public endpoints: 100 requests/minute
- Authenticated endpoints: 300 requests/minute
- Booking creation: 10 requests/minute

---

## Related Docs

- [Architecture](./architecture.md)
- [Database Design](./database-design.md)
- [User Flows](./flow.md)
