# Room Type Module - Data Mapping Documentation

## 📋 Overview

Tài liệu này mô tả mapping dữ liệu giữa các tầng: **Database ↔ Backend ↔ Frontend** cho module Room Type trong hệ thống quản lý khách sạn.

---

## 🗄️ Database Schema

### Table: `room_types`

| Column | Type | Default | Description |
|--------|------|---------|-------------|
| `id` | TEXT (CUID) | auto | Primary key |
| `hotel_id` | TEXT | - | Foreign key → hotels |
| `name` | VARCHAR(255) | - | Tên loại phòng (VD: "Phòng đôi giường đơn") |
| `slug` | VARCHAR(255) | - | URL-friendly slug |
| `description` | TEXT | NULL | Mô tả chi tiết |
| `base_price` | DECIMAL(12,0) | - | Giá cơ bản (VND) |
| `max_adults` | INT | 2 | Số người lớn tối đa |
| `max_children` | INT | 1 | Số trẻ em tối đa |
| `bed_type` | ENUM | DOUBLE | Loại giường |
| `bed_count` | INT | 1 | **Số lượng giường** |
| `area_size` | FLOAT | NULL | Diện tích (m²) |
| `is_active` | BOOLEAN | true | Trạng thái hoạt động |
| `sort_order` | INT | 0 | Thứ tự hiển thị |
| `created_at` | TIMESTAMP | now() | Thời gian tạo |
| `updated_at` | TIMESTAMP | auto | Thời gian cập nhật |

### Enum: `BedType`

```sql
CREATE TYPE "BedType" AS ENUM (
  'SINGLE',   -- Giường đơn
  'DOUBLE',   -- Giường đôi
  'TWIN',     -- 2 giường đơn
  'QUEEN',    -- Giường Queen
  'KING'      -- Giường King
);
```

### Constraints

- `UNIQUE(hotel_id, slug)` - Slug duy nhất trong mỗi khách sạn
- `INDEX(hotel_id)` - Tìm kiếm theo khách sạn
- `INDEX(base_price)` - Sắp xếp theo giá

---

## 🔧 Backend (NestJS)

### Prisma Model

```prisma
model RoomType {
  id          String   @id @default(cuid())
  hotelId     String   @map("hotel_id")
  name        String   @db.VarChar(255)
  slug        String   @db.VarChar(255)
  description String?  @db.Text
  basePrice   Decimal  @map("base_price") @db.Decimal(12, 0)
  maxAdults   Int      @default(2) @map("max_adults")
  maxChildren Int      @default(1) @map("max_children")
  bedType     BedType  @default(DOUBLE) @map("bed_type")
  bedCount    Int      @default(1) @map("bed_count")
  areaSize    Float?   @map("area_size")
  isActive    Boolean  @default(true) @map("is_active")
  sortOrder   Int      @default(0) @map("sort_order")
  // ... timestamps & relations
}
```

### DTOs

**CreateRoomTypeDto:**
```typescript
{
  name: string;           // required
  slug: string;           // required
  description?: string;
  basePrice: number;      // required, min: 0
  maxAdults?: number;     // default: 2, min: 1, max: 10
  maxChildren?: number;   // default: 1, min: 0, max: 5
  bedType?: BedType;      // default: DOUBLE
  bedCount?: number;      // default: 1, min: 1, max: 4
  areaSize?: number;      // min: 1
}
```

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/hotels/:hotelId/room-types` | Admin | Tạo mới |
| GET | `/hotels/:hotelId/room-types` | Public | Danh sách |
| GET | `/hotels/:hotelId/room-types/by-slug/:slug` | Public | Chi tiết theo slug |
| GET | `/hotels/:hotelId/room-types/:id` | Public | Chi tiết theo ID |
| PATCH | `/hotels/:hotelId/room-types/:id` | Admin | Cập nhật |
| DELETE | `/hotels/:hotelId/room-types/:id` | Admin | Soft delete |

### API Response Example

```json
{
  "id": "clh1234567890",
  "hotelId": "hotel_nganha_001",
  "name": "Phòng đôi giường đơn",
  "slug": "phong-doi-giuong-don",
  "description": "Phòng rộng rãi với 2 giường đơn...",
  "basePrice": 450000,
  "maxAdults": 2,
  "maxChildren": 1,
  "bedType": "TWIN",
  "bedCount": 2,
  "areaSize": 25,
  "isActive": true,
  "sortOrder": 2,
  "images": [
    { "id": "img1", "url": "/images/MG_0454-300x255.jpg", "isPrimary": true }
  ],
  "amenities": [
    { "id": "am1", "name": "WiFi miễn phí", "icon": "wifi" }
  ]
}
```

---

## 🖥️ Frontend (Next.js)

### TypeScript Interface

```typescript
// types/index.ts
export interface RoomType {
  id: string;
  hotelId: string;
  name: string;
  slug: string;
  description?: string;
  basePrice: number;
  maxAdults: number;
  maxChildren: number;
  bedType: BedType;
  bedCount: number;        // ← New field
  areaSize?: number;
  images: RoomImage[];
  amenities: Amenity[];
  availableRooms?: number;
}

export enum BedType {
  SINGLE = 'SINGLE',
  DOUBLE = 'DOUBLE',
  TWIN = 'TWIN',
  QUEEN = 'QUEEN',
  KING = 'KING',
}
```

### Helper Functions

```typescript
// lib/utils.ts

// Labels tiếng Việt
export const BED_TYPE_LABELS = {
  SINGLE: 'Giường đơn',
  DOUBLE: 'Giường đôi',
  TWIN: 'Giường đơn',
  QUEEN: 'Giường Queen',
  KING: 'Giường King',
};

// Get bed label với số lượng
getBedLabel(BedType.TWIN, 2)  // → "2 giường đơn"
getBedLabel(BedType.DOUBLE, 1) // → "1 giường đôi"

// Get bed icon
getBedIcon(BedType.TWIN, 2)   // → "🛏️🛏️"
getBedIcon(BedType.DOUBLE, 1)  // → "🛌"

// Get capacity label
getCapacityLabel(2, 1)        // → "2 người lớn, 1 trẻ em"
```

### Services

```typescript
// services/room-types.service.ts
roomTypesService.getAll({ hotelId, checkIn, checkOut, adults })
roomTypesService.getById(hotelId, id)
roomTypesService.getBySlug(hotelId, slug)
```

---

## 📊 Field Mapping Matrix

| Database | Backend (Prisma) | Backend (API) | Frontend |
|----------|-----------------|---------------|----------|
| id | id | id | id |
| hotel_id | hotelId | hotelId | hotelId |
| name | name | name | name |
| slug | slug | slug | slug |
| description | description | description | description |
| base_price | basePrice | basePrice | basePrice |
| max_adults | maxAdults | maxAdults | maxAdults |
| max_children | maxChildren | maxChildren | maxChildren |
| bed_type | bedType | bedType | bedType |
| **bed_count** | **bedCount** | **bedCount** | **bedCount** |
| area_size | areaSize | areaSize | areaSize |
| is_active | isActive | - | - |
| sort_order | sortOrder | - | - |

---

## 🏨 Business Rules

### Room Type Validation

| Room Type | maxAdults | bedType | bedCount | basePrice |
|-----------|-----------|---------|----------|-----------|
| Phòng đơn | 1 | SINGLE | 1 | 350,000đ |
| Phòng đôi giường đơn (Twin) | 2 | TWIN | 2 | 450,000đ |
| Phòng đôi giường kép (Double) | 2 | DOUBLE | 1 | 500,000đ |

### Auto-validation Rules

Backend service tự động validate:

1. **TWIN room** → `bedCount` phải >= 2
2. **SINGLE room** → `bedCount` = 1
3. **Auto-set bedCount** nếu không provided:
   - TWIN → bedCount = 2
   - Others → bedCount = 1
4. **Auto-set maxAdults** nếu không provided:
   - SINGLE → maxAdults = 1
   - Others → maxAdults = 2

---

## 🖼️ UI Components

### RoomCard

Hiển thị thông tin giường:
```
👤 2 người  |  🛏️ 2 giường đơn  |  📐 25m²
```

### Room Detail Page

- **URL**: `/rooms/[slug]?hotelId=xxx`
- **Gallery**: Carousel với thumbnails
- **Bed Info Box**: Highlight loại giường với icon và mô tả

---

## 🔄 Data Flow

```
Frontend UI
    ↓ useRoomTypes() hook
    ↓ roomTypesService.getAll()
    ↓ API: GET /hotels/:hotelId/room-types
    ↓ RoomTypesController.findAll()
    ↓ RoomTypesService.findAllByHotel()
    ↓ Prisma Query
    ↓ PostgreSQL (room_types table)
```

---

## 📝 Migration Notes

### Backward Compatibility

1. **New field `bed_count`** có DEFAULT = 1
2. Seed data tự động update:
   - TWIN rooms → bedCount = 2
   - Others → bedCount = 1
3. API response thêm field mới, không remove cũ
4. Frontend cũ vẫn hoạt động (ignore field mới)

### Seed Data

3 loại phòng cơ bản được tạo:
1. Phòng đơn (8 phòng: 101-108)
2. Phòng đôi giường đơn (10 phòng: 109-118)
3. Phòng đôi giường kép (8 phòng: 119-126)

---

*Last updated: March 2026*
