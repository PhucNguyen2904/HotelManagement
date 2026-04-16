// Enums (mapping từ backend)
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  HOTEL_ADMIN = 'HOTEL_ADMIN',
  STAFF = 'STAFF',
  GUEST = 'GUEST',
}

export enum RoomStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  MAINTENANCE = 'MAINTENANCE',
  OUT_OF_ORDER = 'OUT_OF_ORDER',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CHECKED_IN = 'CHECKED_IN',
  CHECKED_OUT = 'CHECKED_OUT',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
  REFUNDED = 'REFUNDED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CREDIT_CARD = 'CREDIT_CARD',
  MOMO = 'MOMO',
  VNPAY = 'VNPAY',
  ZALOPAY = 'ZALOPAY',
}

export enum BedType {
  SINGLE = 'SINGLE',
  DOUBLE = 'DOUBLE',
  TWIN = 'TWIN',
  QUEEN = 'QUEEN',
  KING = 'KING',
}

// Entities
export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
}

export interface Hotel {
  id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  province: string;
  phone?: string;
  email?: string;
  starRating: number;
  checkInTime: string;
  checkOutTime: string;
  coverUrl?: string;
  isActive: boolean;
}

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
  bedCount: number;
  areaSize?: number;
  images: RoomImage[];
  amenities: Amenity[];
  availableRooms?: number;
}

export interface RoomImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

export interface Amenity {
  id: string;
  name: string;
  icon?: string;
}

export interface Room {
  id: string;
  roomTypeId: string;
  roomNumber: string;
  floor: number;
  status: RoomStatus;
  isActive: boolean;
}

export interface Booking {
  id: string;
  bookingCode: string;
  userId: string;
  hotelId: string;
  status: BookingStatus;
  checkIn: string;
  checkOut: string;
  totalNights: number;
  adults: number;
  children: number;
  infants: number;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
  rooms: BookingRoom[];
}

export interface BookingRoom {
  id: string;
  roomId: string;
  roomNumber: string;
  roomTypeName: string;
  pricePerNight: number;
  totalPrice: number;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionRef?: string;
  paidAt?: string;
}

export interface Review {
  id: string;
  userId: string;
  bookingId: string;
  roomTypeId: string;
  rating: number;
  title?: string;
  comment?: string;
  response?: string;
  isVisible: boolean;
  createdAt: string;
  user?: {
    fullName: string;
  };
}

export interface Coupon {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT';
  value: number;
  maxDiscount?: number;
  minNights?: number;
  minAmount?: number;
}

// API Response types
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

// Availability types
export interface AvailabilityQuery {
  hotelId: string;
  checkIn: string;
  checkOut: string;
  roomTypeId?: string;
}

export interface AvailabilityResult {
  checkIn: string;
  checkOut: string;
  totalNights: number;
  roomTypes: RoomTypeAvailability[];
}

export interface RoomTypeAvailability {
  id: string;
  name: string;
  basePrice: number;
  availableCount: number;
  pricePerNight: number;
  totalPrice: number;
}

// Booking request
export interface CreateBookingRequest {
  hotelId: string;
  checkIn: string;
  checkOut: string;
  rooms: {
    roomTypeId: string;
    quantity: number;
    adults: number;
    children: number;
  }[];
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
  couponCode?: string;
}

// Coupon validation
export interface CouponValidation {
  valid: boolean;
  code: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT';
  value: number;
  discountAmount: number;
  message: string;
}
