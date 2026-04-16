# Hướng Dẫn Cài Đặt Database PostgreSQL

## Mục Lục

1. [Yêu Cầu Hệ Thống](#yêu-cầu-hệ-thống)
2. [Cài Đặt PostgreSQL](#cài-đặt-postgresql)
3. [Tạo Database](#tạo-database)
4. [Chạy Script](#chạy-script)
5. [Kiểm Tra Kết Quả](#kiểm-tra-kết-quả)
6. [Tài Khoản Mặc Định](#tài-khoản-mặc-định)
7. [Cấu Hình Môi Trường](#cấu-hình-môi-trường)
8. [Khắc Phục Sự Cố](#khắc-phục-sự-cố)

---

## Yêu Cầu Hệ Thống

| Thành phần | Phiên bản tối thiểu |
|------------|---------------------|
| PostgreSQL | 14.0+ |
| Node.js | 18.0+ |
| npm | 9.0+ |

---

## Cài Đặt PostgreSQL

### Windows

1. Tải PostgreSQL từ: https://www.postgresql.org/download/windows/
2. Chạy installer và làm theo hướng dẫn
3. Ghi nhớ password cho user `postgres`
4. Thêm PostgreSQL vào PATH:
   ```
   C:\Program Files\PostgreSQL\16\bin
   ```

### macOS

```bash
# Sử dụng Homebrew
brew install postgresql@16
brew services start postgresql@16
```

### Ubuntu/Debian

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

---

## Tạo Database

### Bước 1: Kết nối PostgreSQL

```bash
# Windows (PowerShell)
psql -U postgres

# macOS/Linux
sudo -u postgres psql
```

### Bước 2: Tạo Database và User

```sql
-- Tạo database
CREATE DATABASE hotel_nganha;

-- Tạo user (thay 'your_password' bằng mật khẩu mạnh)
CREATE USER hotel_admin WITH ENCRYPTED PASSWORD 'your_password';

-- Cấp quyền
GRANT ALL PRIVILEGES ON DATABASE hotel_nganha TO hotel_admin;

-- Kết nối vào database
\c hotel_nganha

-- Cấp quyền schema
GRANT ALL ON SCHEMA public TO hotel_admin;

-- Thoát
\q
```

---

## Chạy Script

### Cách 1: Sử dụng psql (Khuyến nghị)

```bash
# Di chuyển đến thư mục backend/prisma
cd backend/prisma

# Chạy script
psql -U postgres -d hotel_nganha -f schema.sql
```

### Cách 2: Sử dụng pgAdmin

1. Mở pgAdmin
2. Kết nối đến server PostgreSQL
3. Click chuột phải vào database `hotel_nganha`
4. Chọn **Query Tool**
5. Mở file `schema.sql` (File → Open)
6. Nhấn **F5** hoặc click **Execute**

### Cách 3: Sử dụng DBeaver

1. Kết nối đến PostgreSQL
2. Chọn database `hotel_nganha`
3. Click chuột phải → **SQL Editor** → **New SQL Script**
4. Dán nội dung `schema.sql`
5. Nhấn **Ctrl+Enter** để chạy

---

## Kiểm Tra Kết Quả

### Kiểm tra bảng đã tạo

```sql
-- Kết nối database
\c hotel_nganha

-- Liệt kê tất cả bảng
\dt

-- Kết quả mong đợi:
--  Schema |       Name        | Type  |  Owner
-- --------+-------------------+-------+----------
--  public | audit_logs        | table | postgres
--  public | booking_rooms     | table | postgres
--  public | bookings          | table | postgres
--  public | coupons           | table | postgres
--  public | hotel_images      | table | postgres
--  public | hotels            | table | postgres
--  public | payments          | table | postgres
--  public | pricing_rules     | table | postgres
--  public | refresh_tokens    | table | postgres
--  public | reviews           | table | postgres
--  public | room_availability | table | postgres
--  public | room_type_images  | table | postgres
--  public | room_types        | table | postgres
--  public | rooms             | table | postgres
--  public | users             | table | postgres
```

### Kiểm tra dữ liệu mẫu

```sql
-- Kiểm tra khách sạn
SELECT id, name, city, phone FROM hotels;

-- Kiểm tra loại phòng
SELECT name, base_price, max_adults FROM room_types;

-- Đếm số phòng
SELECT rt.name, COUNT(r.id) as total_rooms
FROM room_types rt
LEFT JOIN rooms r ON rt.id = r.room_type_id
GROUP BY rt.name;

-- Kiểm tra users
SELECT email, role FROM users;
```

### Kết quả mong đợi

```
       name        | base_price | max_adults
-------------------+------------+------------
 Phòng Đôi 2 Giường |     500000 |          4
 Phòng Đơn View Biển|     400000 |          2
 Phòng VIP          |     800000 |          2
 Phòng Gia Đình     |    1000000 |          4

        name        | total_rooms
--------------------+-------------
 Phòng Đôi 2 Giường |          26
 Phòng Đơn View Biển|           8
 Phòng VIP          |           4
 Phòng Gia Đình     |           2
```

---

## Tài Khoản Mặc Định

### Thông tin đăng nhập

| Email | Password | Role | Ghi chú |
|-------|----------|------|---------|
| admin@nganha.com | Admin@123 | SUPER_ADMIN | Quản trị toàn hệ thống |
| manager@nganha.com | Admin@123 | HOTEL_ADMIN | Quản lý khách sạn |
| staff@nganha.com | Admin@123 | STAFF | Nhân viên lễ tân |
| guest@example.com | Admin@123 | GUEST | Khách hàng mẫu |

> ⚠️ **QUAN TRỌNG**: Đổi password ngay sau khi deploy lên production!

### Đổi password trong database

```sql
-- Tạo hash mới với bcrypt (cost factor = 10)
-- Sử dụng tool: https://bcrypt-generator.com/

UPDATE users 
SET password_hash = '$2b$10$YOUR_NEW_HASH_HERE'
WHERE email = 'admin@nganha.com';
```

---

## Cấu Hình Môi Trường

### Tạo file `.env` trong thư mục `backend/`

```env
# Database
DATABASE_URL="postgresql://hotel_admin:your_password@localhost:5432/hotel_nganha?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN="http://localhost:3000"
```

### Biến môi trường quan trọng

| Biến | Mô tả | Ví dụ |
|------|-------|-------|
| DATABASE_URL | Connection string PostgreSQL | postgresql://user:pass@host:port/db |
| JWT_SECRET | Khóa bí mật cho JWT | Chuỗi ngẫu nhiên 32+ ký tự |
| JWT_EXPIRES_IN | Thời gian hết hạn token | 7d, 24h, 1h |
| PORT | Port chạy backend | 3001 |

---

## Khắc Phục Sự Cố

### Lỗi: "permission denied for schema public"

```sql
-- Chạy với user postgres
GRANT ALL ON SCHEMA public TO hotel_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO hotel_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO hotel_admin;
```

### Lỗi: "database does not exist"

```bash
# Tạo database trước
createdb -U postgres hotel_nganha
```

### Lỗi: "role does not exist"

```sql
-- Tạo role/user
CREATE USER hotel_admin WITH ENCRYPTED PASSWORD 'your_password';
```

### Lỗi: "extension pgcrypto does not exist"

```sql
-- Kết nối với superuser (postgres)
\c hotel_nganha postgres
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

### Lỗi: "duplicate key value violates unique constraint"

Script đã chạy trước đó. Cần xóa data hoặc reset:

```sql
-- CẢNH BÁO: Xóa toàn bộ dữ liệu!
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO hotel_admin;
GRANT ALL ON SCHEMA public TO public;

-- Sau đó chạy lại schema.sql
```

### Lỗi encoding UTF-8

```sql
-- Kiểm tra encoding
SHOW server_encoding;

-- Nếu không phải UTF8, tạo lại database
DROP DATABASE hotel_nganha;
CREATE DATABASE hotel_nganha ENCODING 'UTF8' LC_COLLATE='en_US.UTF-8' LC_CTYPE='en_US.UTF-8' TEMPLATE=template0;
```

---

## Cấu Trúc Database

### ERD Tóm Tắt

```
hotels ─────┬──────> room_types ────> rooms ────> room_availability
            │              │                            │
            │              └──> pricing_rules           │
            │                                           │
            └──> coupons                                │
                                                        │
users ──────────────> bookings <────────────────────────┘
                          │
                          ├──> booking_rooms
                          ├──> payments
                          └──> reviews
```

### Bảng quan trọng

| Bảng | Mô tả |
|------|-------|
| `hotels` | Thông tin khách sạn |
| `room_types` | Loại phòng (Deluxe, VIP...) |
| `rooms` | Phòng vật lý (101, 102...) |
| `room_availability` | Lịch phòng - **chống overbooking** |
| `bookings` | Đặt phòng |
| `payments` | Thanh toán |

---

## Tài Liệu Liên Quan

- [Database Design](../../docs/database-design.md) - Thiết kế chi tiết
- [API Specification](../../docs/api-spec.md) - API endpoints
- [Architecture](../../docs/architecture.md) - Kiến trúc hệ thống

---

## Hỗ Trợ

Nếu gặp vấn đề, vui lòng:

1. Kiểm tra log PostgreSQL: `tail -f /var/log/postgresql/postgresql-16-main.log`
2. Đọc kỹ thông báo lỗi
3. Tìm trong phần [Khắc Phục Sự Cố](#khắc-phục-sự-cố)
4. Liên hệ team backend

---

*Cập nhật: Tháng 3/2026*
