-- ============================================================================
-- HOTEL MANAGEMENT SYSTEM - PostgreSQL Database Schema
-- Generated from: docs/database-design.md
-- ============================================================================

-- ============================================================================
-- 1. EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- For gen_random_uuid()

-- ============================================================================
-- 2. ENUM TYPES
-- ============================================================================

-- User roles
CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'HOTEL_ADMIN', 'STAFF', 'GUEST');

-- Room status (physical room state)
CREATE TYPE room_status AS ENUM ('AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'OUT_OF_ORDER');

-- Room availability status (calendar)
CREATE TYPE availability_status AS ENUM ('AVAILABLE', 'BOOKED', 'BLOCKED', 'MAINTENANCE');

-- Booking lifecycle status
CREATE TYPE booking_status AS ENUM (
    'PENDING', 
    'CONFIRMED', 
    'CHECKED_IN', 
    'CHECKED_OUT', 
    'CANCELLED', 
    'NO_SHOW', 
    'REFUNDED'
);

-- Payment status
CREATE TYPE payment_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED');

-- Payment methods
CREATE TYPE payment_method AS ENUM ('CASH', 'BANK_TRANSFER', 'CREDIT_CARD', 'MOMO', 'VNPAY', 'ZALOPAY');

-- Dynamic pricing types
CREATE TYPE pricing_type AS ENUM ('BASE', 'WEEKEND', 'SEASONAL', 'HOLIDAY', 'PROMOTION', 'LAST_MINUTE');

-- Bed types
CREATE TYPE bed_type AS ENUM ('SINGLE', 'DOUBLE', 'TWIN', 'QUEEN', 'KING');

-- ============================================================================
-- 3. CORE TABLES
-- ============================================================================

-- -----------------------------------------------------------------------------
-- hotels - Main hotel entity (supports multi-hotel system)
-- -----------------------------------------------------------------------------
CREATE TABLE hotels (
    id VARCHAR(25) PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR(25),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    address VARCHAR(500),
    city VARCHAR(100),
    province VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Vietnam',
    postal_code VARCHAR(20),
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
     star_rating INT CHECK (star_rating BETWEEN 1 AND 5),
    check_in_time VARCHAR(5) DEFAULT '14:00',
    check_out_time VARCHAR(5) DEFAULT '12:00',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- users - User accounts for all roles
-- -----------------------------------------------------------------------------
CREATE TABLE users (
    id VARCHAR(25) PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR(25),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    id_number VARCHAR(50), -- CCCD/Passport
    role user_role DEFAULT 'GUEST',
    avatar_url VARCHAR(500),
    hotel_id VARCHAR(25) REFERENCES hotels(id) ON DELETE SET NULL, -- For staff/admin
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- room_types - Room categories (Deluxe, Suite, etc.)
-- -----------------------------------------------------------------------------
CREATE TABLE room_types (
    id VARCHAR(25) PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR(25),
    hotel_id VARCHAR(25) NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    base_price DECIMAL(12, 0) NOT NULL DEFAULT 0, -- VND
    max_adults INT DEFAULT 2,
    max_children INT DEFAULT 1,
    max_occupancy INT GENERATED ALWAYS AS (max_adults + max_children) STORED,
    bed_type bed_type DEFAULT 'DOUBLE',
    bed_count INT DEFAULT 1,
    area_size REAL, -- Square meters
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE (hotel_id, slug)
);

-- -----------------------------------------------------------------------------
-- rooms - Physical room instances
-- -----------------------------------------------------------------------------
CREATE TABLE rooms (
    id VARCHAR(25) PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR(25),
    room_type_id VARCHAR(25) NOT NULL REFERENCES room_types(id) ON DELETE CASCADE,
    room_number VARCHAR(20) NOT NULL,
    floor INT,
    notes TEXT,
    status room_status DEFAULT 'AVAILABLE',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE (room_type_id, room_number)
);

-- -----------------------------------------------------------------------------
-- room_availability - CRITICAL: Prevents overbooking at DB level
-- -----------------------------------------------------------------------------
CREATE TABLE room_availability (
    id VARCHAR(25) PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR(25),
    room_id VARCHAR(25) NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status availability_status DEFAULT 'AVAILABLE',
    booking_id VARCHAR(25), -- Will add FK after bookings table created
    price DECIMAL(12, 0), -- Override price for this date
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- CRITICAL CONSTRAINT: Prevents overbooking!
    UNIQUE (room_id, date)
);

-- -----------------------------------------------------------------------------
-- bookings - Main booking record
-- -----------------------------------------------------------------------------
CREATE TABLE bookings (
    id VARCHAR(25) PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR(25),
    booking_code VARCHAR(20) NOT NULL UNIQUE,
    user_id VARCHAR(25) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    hotel_id VARCHAR(25) NOT NULL REFERENCES hotels(id) ON DELETE RESTRICT,
    status booking_status DEFAULT 'PENDING',
    
    -- Dates
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    total_nights INT NOT NULL,
    
    -- Guest counts
    adults INT DEFAULT 1,
    children INT DEFAULT 0,
    infants INT DEFAULT 0,
    
    -- Pricing
    subtotal DECIMAL(12, 0) DEFAULT 0, -- Room charges
    tax_rate DECIMAL(5, 2) DEFAULT 10.00, -- 10% VAT
    tax_amount DECIMAL(12, 0) DEFAULT 0,
    discount_amount DECIMAL(12, 0) DEFAULT 0,
    total_amount DECIMAL(12, 0) DEFAULT 0, -- Final amount

    -- Guest info (can differ from user)
    guest_name VARCHAR(255),
    guest_email VARCHAR(255),
    guest_phone VARCHAR(20),
    guest_id_number VARCHAR(50),
    
    -- Additional info
    special_requests TEXT,
    internal_notes TEXT, -- Staff only
    source VARCHAR(50) DEFAULT 'WEBSITE', -- WEBSITE, PHONE, WALK_IN, OTA
    
    -- Timestamps
    confirmed_at TIMESTAMP,
    checked_in_at TIMESTAMP,
    checked_out_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    cancellation_reason TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_dates CHECK (check_out > check_in)
);

-- Add FK for room_availability -> bookings
ALTER TABLE room_availability 
ADD CONSTRAINT fk_room_availability_booking 
FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL;

-- -----------------------------------------------------------------------------
-- booking_rooms - Junction table for multi-room bookings
-- -----------------------------------------------------------------------------
CREATE TABLE booking_rooms (
    id VARCHAR(25) PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR(25),
    booking_id VARCHAR(25) NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    room_id VARCHAR(25) NOT NULL REFERENCES rooms(id) ON DELETE RESTRICT,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    price_per_night DECIMAL(12, 0) NOT NULL,
    total_price DECIMAL(12, 0) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- payments - Payment transactions
-- -----------------------------------------------------------------------------
CREATE TABLE payments (
    id VARCHAR(25) PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR(25),
    booking_id VARCHAR(25) NOT NULL REFERENCES bookings(id) ON DELETE RESTRICT,
    amount DECIMAL(12, 0) NOT NULL,
    method payment_method NOT NULL,
    status payment_status DEFAULT 'PENDING',
    transaction_ref VARCHAR(100), -- Gateway reference
    gateway_response JSONB, -- Full gateway response
    paid_at TIMESTAMP,
    refunded_at TIMESTAMP,
    refund_amount DECIMAL(12, 0),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- pricing_rules - Dynamic pricing configuration
-- -----------------------------------------------------------------------------
CREATE TABLE pricing_rules (
    id VARCHAR(25) PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR(25),
    room_type_id VARCHAR(25) NOT NULL REFERENCES room_types(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type pricing_type NOT NULL,
    price DECIMAL(12, 0) NOT NULL,
    percentage_adjustment DECIMAL(5, 2), -- For percentage-based adjustments
    start_date DATE,
    end_date DATE,
    days_of_week INT[] DEFAULT '{}', -- 0=Sunday, 6=Saturday
    priority INT DEFAULT 0, -- Higher = more important
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- reviews - Guest reviews
-- -----------------------------------------------------------------------------
CREATE TABLE reviews (
    id VARCHAR(25) PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR(25),
    user_id VARCHAR(25) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    booking_id VARCHAR(25) NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
    room_type_id VARCHAR(25) NOT NULL REFERENCES room_types(id) ON DELETE CASCADE,
    hotel_id VARCHAR(25) NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title VARCHAR(255),
    comment TEXT,
    pros TEXT,
    cons TEXT,
    response TEXT, -- Hotel response
    response_at TIMESTAMP,
    is_visible BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE, -- Verified stay
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 4. SUPPORTING TABLES
-- ============================================================================

-- -----------------------------------------------------------------------------
-- amenities - Master list of hotel/room features
-- -----------------------------------------------------------------------------
CREATE TABLE amenities (
    id VARCHAR(25) PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR(25),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- room_type_amenities - Junction table for room type features
-- -----------------------------------------------------------------------------
CREATE TABLE room_type_amenities (
    id VARCHAR(25) PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR(25),
    room_type_id VARCHAR(25) NOT NULL REFERENCES room_types(id) ON DELETE CASCADE,
    amenity_id VARCHAR(25) NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (room_type_id, amenity_id)
);

-- -----------------------------------------------------------------------------
-- hotel_images - Hotel photo gallery
-- -----------------------------------------------------------------------------
CREATE TABLE hotel_images (
    id VARCHAR(25) PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR(25),
    hotel_id VARCHAR(25) NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    sort_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- room_type_images - Room type photo gallery
-- -----------------------------------------------------------------------------
CREATE TABLE room_type_images (
    id VARCHAR(25) PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR(25),
    room_type_id VARCHAR(25) NOT NULL REFERENCES room_types(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    sort_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- refresh_tokens - JWT refresh token storage
-- -----------------------------------------------------------------------------
CREATE TABLE refresh_tokens (
    id VARCHAR(25) PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR(25),
    user_id VARCHAR(25) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- audit_logs - System audit trail
-- -----------------------------------------------------------------------------
CREATE TABLE audit_logs (
    id VARCHAR(25) PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR(25),
    user_id VARCHAR(25) REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id VARCHAR(25),
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 5. INDEXES
-- ============================================================================

-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_hotel ON users(hotel_id) WHERE hotel_id IS NOT NULL;

-- Hotels
CREATE INDEX idx_hotels_slug ON hotels(slug);
CREATE INDEX idx_hotels_city ON hotels(city);
CREATE INDEX idx_hotels_active ON hotels(is_active) WHERE is_active = TRUE;

-- Room Types
CREATE INDEX idx_room_types_hotel ON room_types(hotel_id);
CREATE INDEX idx_room_types_slug ON room_types(hotel_id, slug);

-- Rooms
CREATE INDEX idx_rooms_type ON rooms(room_type_id);
CREATE INDEX idx_rooms_status ON rooms(status);
CREATE INDEX idx_rooms_active ON rooms(is_active) WHERE is_active = TRUE;

-- Room Availability (Critical for performance)
CREATE INDEX idx_room_availability_date ON room_availability(date);
CREATE INDEX idx_room_availability_status ON room_availability(status);
CREATE INDEX idx_room_availability_date_status ON room_availability(date, status);
CREATE INDEX idx_room_availability_room_date ON room_availability(room_id, date);
CREATE INDEX idx_room_availability_booking ON room_availability(booking_id) WHERE booking_id IS NOT NULL;

-- Bookings
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_hotel ON bookings(hotel_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_code ON bookings(booking_code);
CREATE INDEX idx_bookings_checkin ON bookings(check_in);
CREATE INDEX idx_bookings_checkout ON bookings(check_out);
CREATE INDEX idx_bookings_dates ON bookings(check_in, check_out);
CREATE INDEX idx_bookings_created ON bookings(created_at DESC);

-- Booking Rooms
CREATE INDEX idx_booking_rooms_booking ON booking_rooms(booking_id);
CREATE INDEX idx_booking_rooms_room ON booking_rooms(room_id);

-- Payments
CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_method ON payments(method);
CREATE INDEX idx_payments_created ON payments(created_at DESC);

-- Pricing Rules
CREATE INDEX idx_pricing_rules_room_type ON pricing_rules(room_type_id);
CREATE INDEX idx_pricing_rules_dates ON pricing_rules(start_date, end_date);
CREATE INDEX idx_pricing_rules_active ON pricing_rules(is_active) WHERE is_active = TRUE;

-- Reviews
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_hotel ON reviews(hotel_id);
CREATE INDEX idx_reviews_room_type ON reviews(room_type_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_visible ON reviews(is_visible) WHERE is_visible = TRUE;

-- Refresh Tokens
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens(expires_at);

-- Audit Logs
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);

-- ============================================================================
-- 6. FUNCTIONS & TRIGGERS
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_hotels_updated_at BEFORE UPDATE ON hotels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_room_types_updated_at BEFORE UPDATE ON room_types
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_room_availability_updated_at BEFORE UPDATE ON room_availability
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_booking_rooms_updated_at BEFORE UPDATE ON booking_rooms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_rules_updated_at BEFORE UPDATE ON pricing_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Generate booking code
CREATE OR REPLACE FUNCTION generate_booking_code()
RETURNS TRIGGER AS $$
DECLARE
    new_code VARCHAR(20);
    code_exists BOOLEAN;
BEGIN
    LOOP
        -- Format: BK + YYMMDD + 4 random chars
        new_code := 'BK' || TO_CHAR(CURRENT_DATE, 'YYMMDD') || 
                    UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4));
        
        SELECT EXISTS(SELECT 1 FROM bookings WHERE booking_code = new_code) INTO code_exists;
        EXIT WHEN NOT code_exists;
    END LOOP;
    
    NEW.booking_code := new_code;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_booking_code_trigger
BEFORE INSERT ON bookings
FOR EACH ROW
WHEN (NEW.booking_code IS NULL)
EXECUTE FUNCTION generate_booking_code();

-- ============================================================================
-- 7. VIEWS
-- ============================================================================

-- Available rooms view (for search)
CREATE OR REPLACE VIEW v_available_rooms AS
SELECT 
    r.id AS room_id,
    r.room_number,
    r.floor,
    rt.id AS room_type_id,
    rt.name AS room_type_name,
    rt.base_price,
    rt.max_adults,
    rt.max_children,
    rt.bed_type,
    rt.area_size,
    h.id AS hotel_id,
    h.name AS hotel_name,
    h.city
FROM rooms r
JOIN room_types rt ON r.room_type_id = rt.id
JOIN hotels h ON rt.hotel_id = h.id
WHERE r.is_active = TRUE 
  AND r.status = 'AVAILABLE'
  AND rt.is_active = TRUE
  AND h.is_active = TRUE;

-- Booking summary view
CREATE OR REPLACE VIEW v_booking_summary AS
SELECT 
    b.id,
    b.booking_code,
    b.status,
    b.check_in,
    b.check_out,
    b.total_nights,
    b.adults,
    b.children,
    b.total_amount,
    b.guest_name,
    b.guest_phone,
    b.created_at,
    h.name AS hotel_name,
    u.full_name AS booked_by,
    u.email AS user_email,
    COUNT(br.id) AS room_count,
    COALESCE(SUM(p.amount) FILTER (WHERE p.status = 'COMPLETED'), 0) AS paid_amount
FROM bookings b
JOIN hotels h ON b.hotel_id = h.id
JOIN users u ON b.user_id = u.id
LEFT JOIN booking_rooms br ON b.id = br.booking_id
LEFT JOIN payments p ON b.id = p.booking_id
GROUP BY b.id, h.name, u.full_name, u.email;

-- Hotel statistics view
CREATE OR REPLACE VIEW v_hotel_stats AS
SELECT 
    h.id AS hotel_id,
    h.name AS hotel_name,
    COUNT(DISTINCT rt.id) AS room_type_count,
    COUNT(DISTINCT r.id) AS total_rooms,
    COUNT(DISTINCT r.id) FILTER (WHERE r.status = 'AVAILABLE') AS available_rooms,
    COUNT(DISTINCT b.id) FILTER (WHERE b.status IN ('CONFIRMED', 'CHECKED_IN')) AS active_bookings,
    COALESCE(AVG(rv.rating), 0) AS avg_rating,
    COUNT(DISTINCT rv.id) AS review_count
FROM hotels h
LEFT JOIN room_types rt ON h.id = rt.hotel_id AND rt.is_active = TRUE
LEFT JOIN rooms r ON rt.id = r.room_type_id AND r.is_active = TRUE
LEFT JOIN bookings b ON h.id = b.hotel_id
LEFT JOIN reviews rv ON h.id = rv.hotel_id AND rv.is_visible = TRUE
WHERE h.is_active = TRUE
GROUP BY h.id;

-- ============================================================================
-- 8. SAMPLE DATA - Dữ liệu từ Khách Sạn Ngân Hà (Quan Lạn, Vân Đồn, Quảng Ninh)
-- ============================================================================

-- -----------------------------------------------------------------------------
-- 8.1 HOTEL - Khách sạn Ngân Hà
-- -----------------------------------------------------------------------------
INSERT INTO hotels (
    id, name, slug, description, address, city, province, country,
    phone, email, star_rating, check_in_time, check_out_time, is_active
) VALUES (
    'hotel_nganha_001',
    'Khách Sạn Ngân Hà',
    'khach-san-ngan-ha',
    'Khách sạn Ngân Hà tọa lạc tại đảo Quan Lạn, một trong những hòn đảo đẹp nhất vịnh Bái Tử Long. Với vị trí thuận lợi, bãi biển trong xanh và dịch vụ chất lượng, đây là điểm đến lý tưởng cho kỳ nghỉ của bạn.',
    'Đảo Quan Lạn, Huyện Vân Đồn',
    'Quảng Ninh',
    'Quảng Ninh',
    'Vietnam',
    '0912326997',
    'nganhahotelquanlan@gmail.com',
    3,
    '13:00',
    '12:00',
    TRUE
);

-- -----------------------------------------------------------------------------
-- 8.2 USERS - Admin & Staff accounts
-- -----------------------------------------------------------------------------
-- Password: Admin@123 (hash này cần thay bằng bcrypt hash thực tế)
INSERT INTO users (id, email, password_hash, full_name, phone, role, hotel_id, email_verified, is_active)
VALUES 
    -- Super Admin
    (
        'user_superadmin_001',
        'superadmin@khachsannganha.com',
        '$2b$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- SuperAdmin@123
        'Super Admin',
        '0988888888',
        'SUPER_ADMIN',
        'hotel_nganha_001',
        TRUE,
        TRUE
    ),
    -- Hotel Admin
    (
        'user_admin_001',
        'admin@khachsannganha.com',
        '$2b$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- Admin@123
        'Quản trị viên Ngân Hà',
        '0912326997',
        'HOTEL_ADMIN',
        'hotel_nganha_001',
        TRUE,
        TRUE
    ),
    -- Sample Guest
    (
        'user_guest_001',
        'guest@example.com',
        '$2b$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- Guest@123
        'Nguyễn Văn A',
        '0901234567',
        'GUEST',
        NULL,
        TRUE,
        TRUE
    );

-- -----------------------------------------------------------------------------
INSERT INTO room_types (
    id, hotel_id, name, slug, description, base_price, 
    max_adults, max_children, bed_type, bed_count, area_size, is_active
) VALUES 
    (
        'rt_phong_don',
        'hotel_nganha_001',
        'Phòng đơn',
        'phong-don',
        'Phòng đơn ấm cúng với 1 giường đơn, phù hợp cho khách đi công tác hoặc du lịch một mình.',
        350000,
        1,
        0,
        'SINGLE',
        1,
        18,
        TRUE
    ),
    (
        'rt_phong_twin',
        'hotel_nganha_001',
        'Phòng đôi giường đơn',
        'phong-doi-giuong-don',
        'Phòng rộng rãi với 2 giường đơn, phù hợp cho bạn bè hoặc đồng nghiệp đi cùng nhau.',
        450000,
        2,
        1,
        'TWIN',
        2,
        25,
        TRUE
    ),
    (
        'rt_phong_double',
        'hotel_nganha_001',
        'Phòng đôi giường kép',
        'phong-doi-giuong-kep',
        'Phòng lãng mạn với 1 giường đôi lớn, lý tưởng cho các cặp đôi hoặc vợ chồng.',
        500000,
        2,
        1,
        'DOUBLE',
        1,
        28,
        TRUE
    );

-- -----------------------------------------------------------------------------
-- 8.3.1 AMENITIES DATA
-- -----------------------------------------------------------------------------
INSERT INTO amenities (id, name, icon) VALUES
    ('am_wifi', 'WiFi miễn phí', 'wifi'),
    ('am_ac', 'Điều hòa', 'ac'),
    ('am_tv', 'TV màn hình phẳng', 'tv'),
    ('am_minibar', 'Minibar', 'minibar'),
    ('am_safe', 'Két an toàn', 'safe'),
    ('am_shower', 'Vòi sen', 'shower');

INSERT INTO room_type_amenities (room_type_id, amenity_id)
SELECT rt.id, am.id FROM room_types rt, amenities am WHERE rt.is_active = TRUE;

-- -----------------------------------------------------------------------------
-- 8.4 ROOMS - Các phòng cụ thể
-- -----------------------------------------------------------------------------

-- Phòng đơn (8 phòng)
INSERT INTO rooms (id, room_type_id, room_number, floor, status, is_active) VALUES
    ('room_s_101', 'rt_phong_don', '101', 1, 'AVAILABLE', TRUE),
    ('room_s_102', 'rt_phong_don', '102', 1, 'AVAILABLE', TRUE),
    ('room_s_103', 'rt_phong_don', '103', 1, 'AVAILABLE', TRUE),
    ('room_s_104', 'rt_phong_don', '104', 1, 'AVAILABLE', TRUE),
    ('room_s_105', 'rt_phong_don', '105', 1, 'AVAILABLE', TRUE),
    ('room_s_106', 'rt_phong_don', '106', 1, 'AVAILABLE', TRUE),
    ('room_s_107', 'rt_phong_don', '107', 1, 'AVAILABLE', TRUE),
    ('room_s_108', 'rt_phong_don', '108', 1, 'AVAILABLE', TRUE);

-- Phòng twin (10 phòng)
INSERT INTO rooms (id, room_type_id, room_number, floor, status, is_active) VALUES
    ('room_t_201', 'rt_phong_twin', '201', 2, 'AVAILABLE', TRUE),
    ('room_t_202', 'rt_phong_twin', '202', 2, 'AVAILABLE', TRUE),
    ('room_t_203', 'rt_phong_twin', '203', 2, 'AVAILABLE', TRUE),
    ('room_t_204', 'rt_phong_twin', '204', 2, 'AVAILABLE', TRUE),
    ('room_t_205', 'rt_phong_twin', '205', 2, 'AVAILABLE', TRUE),
    ('room_t_206', 'rt_phong_twin', '206', 2, 'AVAILABLE', TRUE),
    ('room_t_207', 'rt_phong_twin', '207', 2, 'AVAILABLE', TRUE),
    ('room_t_208', 'rt_phong_twin', '208', 2, 'AVAILABLE', TRUE),
    ('room_t_209', 'rt_phong_twin', '209', 2, 'AVAILABLE', TRUE),
    ('room_t_210', 'rt_phong_twin', '210', 2, 'AVAILABLE', TRUE);

-- Phòng double (8 phòng)
INSERT INTO rooms (id, room_type_id, room_number, floor, status, is_active) VALUES
    ('room_d_301', 'rt_phong_double', '301', 3, 'AVAILABLE', TRUE),
    ('room_d_302', 'rt_phong_double', '302', 3, 'AVAILABLE', TRUE),
    ('room_d_303', 'rt_phong_double', '303', 3, 'AVAILABLE', TRUE),
    ('room_d_304', 'rt_phong_double', '304', 3, 'AVAILABLE', TRUE),
    ('room_d_305', 'rt_phong_double', '305', 3, 'AVAILABLE', TRUE),
    ('room_d_306', 'rt_phong_double', '306', 3, 'AVAILABLE', TRUE),
    ('room_d_307', 'rt_phong_double', '307', 3, 'AVAILABLE', TRUE),
    ('room_d_308', 'rt_phong_double', '308', 3, 'AVAILABLE', TRUE);

-- -----------------------------------------------------------------------------
-- 8.5 PRICING RULES - Bảng giá động
-- -----------------------------------------------------------------------------
INSERT INTO pricing_rules (id, room_type_id, name, type, price, start_date, end_date, priority, is_active) VALUES
    -- Giá cuối tuần (+20%)
    ('pr_don_weekend', 'rt_phong_don', 'Giá cuối tuần', 'WEEKEND', 420000, NULL, NULL, 5, TRUE),
    ('pr_twin_weekend', 'rt_phong_twin', 'Giá cuối tuần', 'WEEKEND', 540000, NULL, NULL, 5, TRUE),
    ('pr_double_weekend', 'rt_phong_double', 'Giá cuối tuần', 'WEEKEND', 600000, NULL, NULL, 5, TRUE);

-- Update days_of_week for weekend pricing (5=Friday, 6=Saturday, 0=Sunday)
UPDATE pricing_rules SET days_of_week = ARRAY[5, 6, 0] WHERE type = 'WEEKEND';

-- -----------------------------------------------------------------------------
-- 8.7 SAMPLE BOOKING (Booking mẫu)
-- -----------------------------------------------------------------------------
INSERT INTO bookings (
    id, booking_code, user_id, hotel_id, status,
    check_in, check_out, total_nights,
    adults, children, infants,
    subtotal, tax_rate, tax_amount, discount_amount, total_amount,
    guest_name, guest_email, guest_phone, guest_id_number,
    special_requests, source
) VALUES (
    'booking_sample_001',
    'BK260401A1B2',
    'user_guest_001',
    'hotel_nganha_001',
    'CONFIRMED',
    '2026-04-15',
    '2026-04-17',
    2,
    2, 1, 0,
    1000000, -- 500k x 2 đêm
    10.00,
    100000,
    0,
    1100000,
    'Nguyễn Văn A',
    'guest@example.com',
    '0901234567',
    '001234567890',
    'Cần phòng view biển, check-in sớm nếu được',
    'WEBSITE'
);

-- Booking room
INSERT INTO booking_rooms (id, booking_id, room_id, check_in, check_out, price_per_night, total_price)
VALUES ('br_001', 'booking_sample_001', 'room_t_201', '2026-04-15', '2026-04-17', 450000, 900000);

-- Room availability for booked dates
INSERT INTO room_availability (id, room_id, date, status, booking_id, price)
VALUES 
    ('ra_001', 'room_t_201', '2026-04-15', 'BOOKED', 'booking_sample_001', 450000),
    ('ra_002', 'room_t_201', '2026-04-16', 'BOOKED', 'booking_sample_001', 450000);

-- Payment
INSERT INTO payments (id, booking_id, amount, method, status, transaction_ref, paid_at)
VALUES ('pay_001', 'booking_sample_001', 1100000, 'BANK_TRANSFER', 'COMPLETED', 'VCB20260401001', CURRENT_TIMESTAMP);

-- -----------------------------------------------------------------------------
-- 8.8 SAMPLE REVIEW
-- -----------------------------------------------------------------------------
INSERT INTO reviews (
    id, user_id, booking_id, room_type_id, hotel_id,
    rating, title, comment, pros, cons, is_visible, is_verified
) VALUES (
    'review_001',
    'user_guest_001',
    'booking_sample_001',
    'rt_phong_twin',
    'hotel_nganha_001',
    5,
    'Kỳ nghỉ tuyệt vời tại Quan Lạn',
    'Khách sạn rất đẹp, nhân viên thân thiện, vị trí gần biển. Phòng sạch sẽ, view đẹp. Chắc chắn sẽ quay lại!',
    'Vị trí đẹp, gần biển, nhân viên nhiệt tình, phòng sạch sẽ',
    'Wifi hơi chậm vào buổi tối',
    TRUE,
    TRUE
);

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
