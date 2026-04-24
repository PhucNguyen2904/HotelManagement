export type RoomStatus = 'available' | 'occupied' | 'cleaning' | 'maintenance';
export type BookingStatus = 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
export type RoomType = 'Standard' | 'Deluxe' | 'Suite';
export type ShiftType = 'Sáng' | 'Chiều' | 'Tối';
export type StaffRole = 'Receptionist' | 'Housekeeping';
export type StaffStatus = 'on-duty' | 'off-duty';

export interface Room {
  id: string;
  roomNumber: string;
  type: RoomType;
  floor: number;
  pricePerNight: number;
  status: RoomStatus;
  description: string;
  amenities: string[];
  image: string;
}

export interface Booking {
  id: string;
  guestName: string;
  email: string;
  phone: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  status: BookingStatus;
  totalAmount: number;
  note?: string;
  cancelReason?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  bookingCount: number;
  lastStay: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  shift: ShiftType;
  status: StaffStatus;
}
