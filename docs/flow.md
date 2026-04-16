# User Flows

## Overview

Tài liệu này mô tả các luồng người dùng chính trong hệ thống đặt phòng khách sạn.

---

## 1. Booking Flow (Đặt phòng)

### Guest Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                      BOOKING FLOW                                │
└─────────────────────────────────────────────────────────────────┘

     ┌──────────┐
     │  Guest   │
     └────┬─────┘
          │
          ▼
┌─────────────────┐
│ 1. Search Rooms │  → Chọn ngày, số khách
│   (Homepage)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 2. View Results │  → Danh sách room types
│   (Room List)   │     với giá và availability
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 3. Select Room  │  → Xem chi tiết, ảnh, tiện nghi
│  (Room Detail)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────┐
│ 4. Login/       │────>│   Register   │
│    Register     │     │   (if new)   │
└────────┬────────┘     └──────────────┘
         │
         ▼
┌─────────────────┐
│ 5. Fill Booking │  → Guest info, special requests
│     Form        │     Coupon code (optional)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 6. Review &     │  → Xác nhận thông tin
│    Confirm      │     Tổng tiền
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────┐
│ 7. Payment      │────>│  VNPAY/Momo  │
│                 │<────│   Gateway    │
└────────┬────────┘     └──────────────┘
         │
         ▼
┌─────────────────┐
│ 8. Confirmation │  → Booking code
│    + Email      │     Email xác nhận
└─────────────────┘
```

### API Sequence

```
1. GET  /availability?hotelId=x&checkIn=y&checkOut=z
2. GET  /room-types/:id
3. POST /auth/login (or /register)
4. POST /coupons/validate (optional)
5. POST /bookings
6. POST /payments
7. (Redirect to payment gateway)
8. POST /payments/webhook (from gateway)
```

### State Transitions

```
PENDING → CONFIRMED → CHECKED_IN → CHECKED_OUT
    │         │
    │         └──→ CANCELLED
    │
    └──→ CANCELLED (unpaid timeout)
         NO_SHOW (không đến)
```

---

## 2. Check-in Flow

### Staff Process

```
┌─────────────────────────────────────────────────────────────────┐
│                      CHECK-IN FLOW                               │
└─────────────────────────────────────────────────────────────────┘

     ┌──────────┐
     │  Staff   │
     └────┬─────┘
          │
          ▼
┌─────────────────┐
│ 1. Search       │  → Tìm bằng booking code
│    Booking      │     hoặc tên/phone khách
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 2. Verify       │  → Kiểm tra CCCD/Passport
│    Guest ID     │     So khớp thông tin
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────┐
│ 3. Check        │────>│ Thu tiền nếu │
│    Payment      │     │ chưa thanh   │
└────────┬────────┘     │ toán đủ      │
         │              └──────────────┘
         ▼
┌─────────────────┐
│ 4. Assign Room  │  → Chọn số phòng cụ thể
│    Number       │     (nếu chưa assign)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 5. Issue Key    │  → Đưa chìa khóa/thẻ từ
│    Card         │     Hướng dẫn tiện ích
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 6. Update       │  → Status: CHECKED_IN
│    System       │     Room: OCCUPIED
└─────────────────┘
```

### API Sequence

```
1. GET  /bookings?bookingCode=x (or search)
2. GET  /bookings/:id
3. POST /payments (if needed)
4. PATCH /rooms/:id/status → OCCUPIED
5. PATCH /bookings/:id/check-in
```

---

## 3. Check-out Flow

### Staff Process

```
┌─────────────────────────────────────────────────────────────────┐
│                      CHECK-OUT FLOW                              │
└─────────────────────────────────────────────────────────────────┘

     ┌──────────┐
     │  Staff   │
     └────┬─────┘
          │
          ▼
┌─────────────────┐
│ 1. Lookup       │  → Tìm booking đang
│    Booking      │     CHECKED_IN
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 2. Check Room   │  → Kiểm tra minibar
│    Charges      │     Dịch vụ phát sinh
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────┐
│ 3. Final        │────>│ Thu thêm     │
│    Payment      │     │ nếu có       │
└────────┬────────┘     └──────────────┘
         │
         ▼
┌─────────────────┐
│ 4. Collect Key  │  → Thu lại chìa khóa
│                 │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 5. Update       │  → Status: CHECKED_OUT
│    System       │     Room: AVAILABLE
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 6. Request      │  → Email mời đánh giá
│    Review       │
└─────────────────┘
```

### API Sequence

```
1. GET  /bookings/:id
2. POST /payments (additional charges)
3. PATCH /bookings/:id/check-out
4. PATCH /rooms/:id/status → AVAILABLE
5. (Send review request email)
```

---

## 4. Payment Flow

### Online Payment (VNPay/Momo)

```
┌─────────────────────────────────────────────────────────────────┐
│                      PAYMENT FLOW                                │
└─────────────────────────────────────────────────────────────────┘

┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Client  │    │  Backend │    │  VNPay   │    │ Database │
└────┬─────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘
     │               │               │               │
     │ POST /payments│               │               │
     │──────────────>│               │               │
     │               │               │               │
     │               │ Create payment record         │
     │               │──────────────────────────────>│
     │               │               │               │
     │               │ Generate URL  │               │
     │               │──────────────>│               │
     │               │               │               │
     │   paymentUrl  │<──────────────│               │
     │<──────────────│               │               │
     │               │               │               │
     │ Redirect to VNPay             │               │
     │──────────────────────────────>│               │
     │               │               │               │
     │         (User pays)           │               │
     │               │               │               │
     │               │  Webhook      │               │
     │               │<──────────────│               │
     │               │               │               │
     │               │ Update payment status         │
     │               │──────────────────────────────>│
     │               │               │               │
     │               │ Update booking status         │
     │               │──────────────────────────────>│
     │               │               │               │
     │  Redirect back│               │               │
     │<──────────────────────────────│               │
     │               │               │               │
```

### Payment States

```
PENDING → COMPLETED
    │
    └──→ FAILED

COMPLETED → REFUNDED
         → PARTIALLY_REFUNDED
```

---

## 5. Admin Flow: Room Management

```
┌─────────────────────────────────────────────────────────────────┐
│                    ROOM MANAGEMENT                               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      Dashboard                                   │
│  ┌─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐ │
│  │ Today's │ Today's │Occupied │Available│ Revenue │ Pending │ │
│  │Check-in │Check-out│  Rooms  │  Rooms  │  Today  │ Bookings│ │
│  │    5    │    3    │   12    │    8    │ 15.2M   │    2    │ │
│  └─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Room Calendar  │  │  Booking List   │  │  Guest List     │
│                 │  │                 │  │                 │
│ ┌───┬───┬───┐   │  │ #BK240301001   │  │ Nguyen Van A    │
│ │101│102│103│   │  │ #BK240301002   │  │ Tran Thi B      │
│ ├───┼───┼───┤   │  │ #BK240301003   │  │ Le Van C        │
│ │ ■ │ □ │ □ │   │  │ ...            │  │ ...             │
│ └───┴───┴───┘   │  └─────────────────┘  └─────────────────┘
│ ■ Booked □ Free │
└─────────────────┘
```

---

## 6. Review Flow

```
     [After Checkout]
          │
          ▼
┌─────────────────┐
│ Email: Request  │  → 24h sau checkout
│ for Review      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Guest clicks    │
│ review link     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Submit Review   │  → Rating 1-5
│ Form            │     Title, Comment
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Review saved    │  → isVisible = true
│ (auto-publish)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Admin can       │  → Phản hồi review
│ respond         │     Hide nếu vi phạm
└─────────────────┘
```

---

## Business Rules Summary

| Rule | Description |
|------|-------------|
| **Overbooking** | Không cho phép - DB constraint |
| **Cancellation** | Miễn phí trước 24h, phí 50% sau |
| **Payment** | Đặt cọc 30% khi book, trả hết khi check-in |
| **Check-in time** | Từ 14:00 |
| **Check-out time** | Trước 12:00 |
| **Review** | Chỉ được đánh giá sau check-out |
| **Coupon** | 1 coupon/booking |

---

## Related Docs

- [Architecture](./architecture.md)
- [Database Design](./database-design.md)
- [API Specification](./api-spec.md)
