import { Booking, Customer, Room, StaffMember } from '@/components/manager/types';

export const initialRooms: Room[] = [
  {
    id: 'R-201',
    roomNumber: '201',
    type: 'Standard',
    floor: 2,
    pricePerNight: 700000,
    status: 'available',
    description: 'Phu hop 2 nguoi, view san vuon.',
    amenities: ['Wifi', 'TV', 'May lanh'],
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600',
  },
  {
    id: 'R-202',
    roomNumber: '202',
    type: 'Deluxe',
    floor: 2,
    pricePerNight: 1100000,
    status: 'occupied',
    description: 'Phong rong, cua so lon.',
    amenities: ['Wifi', 'TV', 'Bon tam', 'Minibar'],
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600',
  },
  {
    id: 'R-301',
    roomNumber: '301',
    type: 'Suite',
    floor: 3,
    pricePerNight: 1800000,
    status: 'cleaning',
    description: 'Phong suite cao cap cho gia dinh.',
    amenities: ['Wifi', 'TV', 'Bon tam', 'Ban cong'],
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600',
  },
  {
    id: 'R-302',
    roomNumber: '302',
    type: 'Deluxe',
    floor: 3,
    pricePerNight: 1200000,
    status: 'maintenance',
    description: 'Dang bao tri he thong nuoc.',
    amenities: ['Wifi', 'TV'],
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600',
  },
  {
    id: 'R-401',
    roomNumber: '401',
    type: 'Suite',
    floor: 4,
    pricePerNight: 2100000,
    status: 'available',
    description: 'Suite VIP, huong bien.',
    amenities: ['Wifi', 'TV', 'Bon tam', 'Kitchenette'],
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600',
  },
  {
    id: 'R-402',
    roomNumber: '402',
    type: 'Standard',
    floor: 4,
    pricePerNight: 780000,
    status: 'occupied',
    description: 'Phong tieu chuan, view thanh pho.',
    amenities: ['Wifi', 'TV'],
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600',
  },
];

export const initialBookings: Booking[] = [
  {
    id: 'BK-2401',
    guestName: 'Nguyen Minh Anh',
    email: 'anh.nguyen@gmail.com',
    phone: '0901122233',
    roomId: 'R-202',
    checkIn: '2026-04-23',
    checkOut: '2026-04-25',
    status: 'checked-in',
    totalAmount: 2200000,
    note: 'Can check-in som.',
    createdAt: '2026-04-20',
  },
  {
    id: 'BK-2402',
    guestName: 'Tran Quoc Bao',
    email: 'bao.tran@gmail.com',
    phone: '0918899777',
    roomId: 'R-401',
    checkIn: '2026-04-23',
    checkOut: '2026-04-26',
    status: 'confirmed',
    totalAmount: 6300000,
    createdAt: '2026-04-22',
  },
  {
    id: 'BK-2403',
    guestName: 'Le Phuong Linh',
    email: 'linh.le@gmail.com',
    phone: '0986111222',
    roomId: 'R-301',
    checkIn: '2026-04-24',
    checkOut: '2026-04-25',
    status: 'pending',
    totalAmount: 1800000,
    createdAt: '2026-04-23',
  },
  {
    id: 'BK-2399',
    guestName: 'Pham Hoang Nam',
    email: 'nam.pham@gmail.com',
    phone: '0933334444',
    roomId: 'R-402',
    checkIn: '2026-04-22',
    checkOut: '2026-04-23',
    status: 'checked-out',
    totalAmount: 780000,
    createdAt: '2026-04-19',
  },
];

export const mockCustomers: Customer[] = [
  { id: 'CUS-01', name: 'Nguyen Minh Anh', email: 'anh.nguyen@gmail.com', phone: '0901122233', bookingCount: 4, lastStay: '2026-04-25' },
  { id: 'CUS-02', name: 'Tran Quoc Bao', email: 'bao.tran@gmail.com', phone: '0918899777', bookingCount: 2, lastStay: '2026-04-26' },
  { id: 'CUS-03', name: 'Le Phuong Linh', email: 'linh.le@gmail.com', phone: '0986111222', bookingCount: 1, lastStay: '2026-04-25' },
  { id: 'CUS-04', name: 'Pham Hoang Nam', email: 'nam.pham@gmail.com', phone: '0933334444', bookingCount: 6, lastStay: '2026-04-23' },
];

export const mockStaff: StaffMember[] = [
  { id: 'EMP-01', name: 'Hoang Thu', role: 'Receptionist', shift: 'Sáng', status: 'on-duty' },
  { id: 'EMP-02', name: 'Mai Dang', role: 'Receptionist', shift: 'Chiều', status: 'off-duty' },
  { id: 'EMP-03', name: 'Ngoc Bich', role: 'Housekeeping', shift: 'Sáng', status: 'on-duty' },
  { id: 'EMP-04', name: 'Vu Long', role: 'Housekeeping', shift: 'Tối', status: 'on-duty' },
];

export const revenueByDay = [
  { day: '01', revenue: 6200000 },
  { day: '05', revenue: 8900000 },
  { day: '10', revenue: 11200000 },
  { day: '15', revenue: 10600000 },
  { day: '20', revenue: 13800000 },
  { day: '23', revenue: 15200000 },
];

export const occupancyByWeek = [
  { week: 'Tuan 1', occupancy: 66 },
  { week: 'Tuan 2', occupancy: 73 },
  { week: 'Tuan 3', occupancy: 78 },
  { week: 'Tuan 4', occupancy: 71 },
];

export const topRoomTypes = [
  { name: 'Standard', value: 35 },
  { name: 'Deluxe', value: 42 },
  { name: 'Suite', value: 23 },
];
