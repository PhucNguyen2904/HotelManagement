export type StaffRole = 'Manager' | 'Receptionist' | 'Housekeeping';
export type StaffStatus = 'active' | 'inactive';

export interface StaffAccount {
  id: string;
  fullName: string;
  email: string;
  role: StaffRole;
  status: StaffStatus;
}

export interface BookingActivity {
  id: string;
  guestName: string;
  room: string;
  checkIn: string;
  checkOut: string;
  status: 'confirmed' | 'checked-in' | 'pending';
}

export interface RevenuePoint {
  label: string;
  revenue: number;
}

export interface FinancialRow {
  period: string;
  revenue: number;
  bookings: number;
  avgDailyRate: number;
}

export interface AuditLogRow {
  id: string;
  user: string;
  action: string;
  target: string;
  ip: string;
  timestamp: string;
}

export const roomOverview = {
  totalRooms: 120,
  occupiedRooms: 86,
  availableRooms: 27,
  maintenanceRooms: 7,
};

export const revenueSummary = {
  today: 24500000,
  thisWeek: 168300000,
  thisMonth: 728000000,
};

export const occupancyRate = 71.6;

export const revenueLineData: RevenuePoint[] = [
  { label: 'T2', revenue: 22000000 },
  { label: 'T3', revenue: 25400000 },
  { label: 'T4', revenue: 19800000 },
  { label: 'T5', revenue: 31500000 },
  { label: 'T6', revenue: 27900000 },
  { label: 'T7', revenue: 36000000 },
  { label: 'CN', revenue: 30200000 },
];

export const revenueByMonthData: RevenuePoint[] = [
  { label: 'Th1', revenue: 580000000 },
  { label: 'Th2', revenue: 610000000 },
  { label: 'Th3', revenue: 640000000 },
  { label: 'Th4', revenue: 728000000 },
  { label: 'Th5', revenue: 702000000 },
  { label: 'Th6', revenue: 751000000 },
];

export const latestBookings: BookingActivity[] = [
  {
    id: 'BKG-1093',
    guestName: 'Nguyen Van Minh',
    room: 'Suite 501',
    checkIn: '2026-04-23',
    checkOut: '2026-04-25',
    status: 'confirmed',
  },
  {
    id: 'BKG-1092',
    guestName: 'Tran Thi Hoa',
    room: 'Deluxe 302',
    checkIn: '2026-04-22',
    checkOut: '2026-04-24',
    status: 'checked-in',
  },
  {
    id: 'BKG-1091',
    guestName: 'Pham Quoc Huy',
    room: 'Superior 204',
    checkIn: '2026-04-24',
    checkOut: '2026-04-27',
    status: 'pending',
  },
  {
    id: 'BKG-1090',
    guestName: 'Doan Lan Anh',
    room: 'Family 601',
    checkIn: '2026-04-23',
    checkOut: '2026-04-26',
    status: 'confirmed',
  },
  {
    id: 'BKG-1089',
    guestName: 'Le Thanh Son',
    room: 'Deluxe 306',
    checkIn: '2026-04-21',
    checkOut: '2026-04-23',
    status: 'checked-in',
  },
];

export const staffAccounts: StaffAccount[] = [
  {
    id: 'STF-001',
    fullName: 'Nguyen Thu Hang',
    email: 'hang.nguyen@nganhahotel.vn',
    role: 'Manager',
    status: 'active',
  },
  {
    id: 'STF-002',
    fullName: 'Tran Quang Vinh',
    email: 'vinh.tran@nganhahotel.vn',
    role: 'Receptionist',
    status: 'active',
  },
  {
    id: 'STF-003',
    fullName: 'Pham Hoai Nam',
    email: 'nam.pham@nganhahotel.vn',
    role: 'Receptionist',
    status: 'inactive',
  },
  {
    id: 'STF-004',
    fullName: 'Do Minh Chau',
    email: 'chau.do@nganhahotel.vn',
    role: 'Housekeeping',
    status: 'active',
  },
  {
    id: 'STF-005',
    fullName: 'Le Nhat Linh',
    email: 'linh.le@nganhahotel.vn',
    role: 'Housekeeping',
    status: 'active',
  },
];

export const financialRows: FinancialRow[] = [
  { period: '2026-04-17', revenue: 24100000, bookings: 18, avgDailyRate: 1338000 },
  { period: '2026-04-18', revenue: 28400000, bookings: 21, avgDailyRate: 1352000 },
  { period: '2026-04-19', revenue: 32200000, bookings: 24, avgDailyRate: 1341000 },
  { period: '2026-04-20', revenue: 20600000, bookings: 15, avgDailyRate: 1373000 },
  { period: '2026-04-21', revenue: 25300000, bookings: 19, avgDailyRate: 1331000 },
];

export const auditLogs: AuditLogRow[] = [
  {
    id: 'AUD-401',
    user: 'Nguyen Thu Hang',
    action: 'CREATE_STAFF_ACCOUNT',
    target: 'STF-007',
    ip: '14.190.24.12',
    timestamp: '2026-04-23 09:12:33',
  },
  {
    id: 'AUD-400',
    user: 'Superadmin',
    action: 'UPDATE_VAT_CONFIG',
    target: 'VAT 8% -> 10%',
    ip: '14.190.24.11',
    timestamp: '2026-04-23 08:47:19',
  },
  {
    id: 'AUD-399',
    user: 'Tran Quang Vinh',
    action: 'RESET_PASSWORD',
    target: 'STF-003',
    ip: '14.190.24.29',
    timestamp: '2026-04-22 21:03:55',
  },
  {
    id: 'AUD-398',
    user: 'Superadmin',
    action: 'EXPORT_FINANCIAL_REPORT',
    target: '2026-04-01 -> 2026-04-22',
    ip: '14.190.24.11',
    timestamp: '2026-04-22 16:22:08',
  },
  {
    id: 'AUD-397',
    user: 'Do Minh Chau',
    action: 'UPDATE_ROOM_STATUS',
    target: 'Room 407 -> MAINTENANCE',
    ip: '14.190.24.44',
    timestamp: '2026-04-22 10:13:01',
  },
];
