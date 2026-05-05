import type { Booking as ApiBooking, Room as ApiRoom } from '@/types';
import type {
  Booking as ManagerBooking,
  BookingStatus as ManagerBookingStatus,
  Customer,
  Room as ManagerRoom,
  RoomStatus as ManagerRoomStatus,
} from '@/components/manager/types';

type BookingWithRelations = ApiBooking & {
  bookingRooms?: Array<{
    id: string;
    roomId: string;
    roomNumber?: string;
    roomTypeName?: string;
    pricePerNight?: number | string;
    totalPrice?: number | string;
  }>;
  user?: {
    id: string;
    fullName: string;
    email: string;
    phone?: string | null;
  };
  confirmedAt?: string | Date | null;
  checkedInAt?: string | Date | null;
  checkedOutAt?: string | Date | null;
  cancelledAt?: string | Date | null;
};

type RoomWithRelations = ApiRoom & {
  roomType?: {
    id: string;
    name: string;
    basePrice?: number | string;
    description?: string | null;
  } | null;
};

export const NGANHA_HOTEL_ID = 'hotel_nganha_001';

const ROOM_TYPE_FALLBACKS = ['Single', 'Twin', 'Double', 'Suite', 'Standard', 'Deluxe'] as const;

function toDateString(value?: string | Date | null) {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
}

function toTimestamp(value?: string | Date | null) {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().replace('T', ' ').slice(0, 19);
}

function mapBookingStatus(status?: string | null): ManagerBookingStatus {
  switch (status) {
    case 'CONFIRMED':
      return 'confirmed';
    case 'CHECKED_IN':
      return 'checked-in';
    case 'CHECKED_OUT':
      return 'checked-out';
    case 'CANCELLED':
      return 'cancelled';
    default:
      return 'pending';
  }
}

function mapRoomStatus(status?: string | null): ManagerRoomStatus {
  switch (status) {
    case 'OCCUPIED':
      return 'occupied';
    case 'MAINTENANCE':
    case 'OUT_OF_ORDER':
      return 'maintenance';
    case 'AVAILABLE':
    default:
      return 'available';
  }
}

function normalizeRoomTypeName(name?: string | null) {
  if (!name) return 'Suite';
  const found = ROOM_TYPE_FALLBACKS.find((type) => type.toLowerCase() === name.toLowerCase());
  return found ?? name;
}

function buildPlaceholderImage(roomType?: string) {
  switch ((roomType || '').toLowerCase()) {
    case 'single':
      return 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600';
    case 'twin':
      return 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600';
    case 'double':
      return 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600';
    default:
      return 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600';
  }
}

function calculateNights(checkIn: string, checkOut: string) {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = end.getTime() - start.getTime();
  return Math.max(1, Math.ceil(diff / 86400000));
}

export function toManagerRoom(room: RoomWithRelations): ManagerRoom {
  const roomTypeName = normalizeRoomTypeName(room.roomType?.name);
  return {
    id: room.id,
    roomNumber: room.roomNumber,
    type: roomTypeName as ManagerRoom['type'],
    floor: room.floor ?? 0,
    pricePerNight: Number(room.roomType?.basePrice ?? 0),
    status: mapRoomStatus(room.status),
    description: room.roomType?.description ?? '',
    amenities: [],
    image: buildPlaceholderImage(roomTypeName),
  };
}

export function toManagerBooking(booking: BookingWithRelations): ManagerBooking {
  const primaryRoom = booking.bookingRooms?.[0];
  const customerName = booking.guestName || booking.user?.fullName || 'Khách đặt phòng';
  const customerEmail = booking.guestEmail || booking.user?.email || '';
  const customerPhone = booking.guestPhone || booking.user?.phone || '';

  return {
    id: booking.bookingCode || booking.id,
    guestName: customerName,
    email: customerEmail,
    phone: customerPhone,
    roomId: primaryRoom?.roomId || '',
    checkIn: toDateString(booking.checkIn),
    checkOut: toDateString(booking.checkOut),
    status: mapBookingStatus(booking.status),
    totalAmount: Number(booking.totalAmount ?? 0),
    note: booking.specialRequests ?? undefined,
    createdAt: toDateString(booking.createdAt),
    bookingCode: booking.bookingCode,
    userId: booking.userId,
    hotelId: booking.hotelId,
    confirmedAt: toTimestamp(booking.confirmedAt),
    checkedInAt: toTimestamp(booking.checkedInAt),
    checkedOutAt: toTimestamp(booking.checkedOutAt),
    cancelledAt: toTimestamp(booking.cancelledAt),
  };
}

export function buildCustomerSummaries(bookings: ManagerBooking[]): Customer[] {
  const customerMap = new Map<string, Customer>();

  bookings.forEach((booking) => {
    const key = `${booking.email || booking.guestName}`.toLowerCase();
    const current = customerMap.get(key);
    const lastStay = booking.checkOut || booking.checkIn;

    if (!current) {
      customerMap.set(key, {
        id: `CUS-${String(customerMap.size + 1).padStart(2, '0')}`,
        name: booking.guestName,
        email: booking.email,
        phone: booking.phone,
        bookingCount: 1,
        lastStay,
      });
      return;
    }

    customerMap.set(key, {
      ...current,
      bookingCount: current.bookingCount + 1,
      lastStay: lastStay > current.lastStay ? lastStay : current.lastStay,
    });
  });

  return Array.from(customerMap.values()).sort(
    (left, right) => right.bookingCount - left.bookingCount || right.lastStay.localeCompare(left.lastStay)
  );
}

export function buildActivityFeed(bookings: ManagerBooking[]) {
  const events: Array<{
    id: string;
    user: string;
    action: string;
    target: string;
    ip: string;
    timestamp: string;
  }> = [];

  bookings.forEach((booking) => {
    const target = booking.bookingCode || booking.id;
    events.push({
      id: `${booking.id}-created`,
      user: booking.guestName,
      action: 'CREATE_BOOKING',
      target,
      ip: '-',
      timestamp: toTimestamp(booking.createdAt) || booking.createdAt,
    });

    if (booking.confirmedAt) {
      events.push({
        id: `${booking.id}-confirmed`,
        user: booking.guestName,
        action: 'CONFIRM_BOOKING',
        target,
        ip: '-',
        timestamp: booking.confirmedAt,
      });
    }

    if (booking.checkedInAt) {
      events.push({
        id: `${booking.id}-checked-in`,
        user: booking.guestName,
        action: 'CHECK_IN',
        target,
        ip: '-',
        timestamp: booking.checkedInAt,
      });
    }

    if (booking.checkedOutAt) {
      events.push({
        id: `${booking.id}-checked-out`,
        user: booking.guestName,
        action: 'CHECK_OUT',
        target,
        ip: '-',
        timestamp: booking.checkedOutAt,
      });
    }

    if (booking.cancelledAt) {
      events.push({
        id: `${booking.id}-cancelled`,
        user: booking.guestName,
        action: 'CANCEL_BOOKING',
        target,
        ip: '-',
        timestamp: booking.cancelledAt,
      });
    }
  });

  return events.sort((left, right) => right.timestamp.localeCompare(left.timestamp));
}

function getMonthRange(month: string) {
  const [year, monthValue] = month.split('-').map(Number);
  const start = new Date(Date.UTC(year, monthValue - 1, 1));
  const end = new Date(Date.UTC(year, monthValue, 0));
  return { start, end };
}

export function buildRevenueByDayData(bookings: ManagerBooking[], month: string) {
  const { start, end } = getMonthRange(month);
  const dayCount = end.getUTCDate();
  const buckets = Array.from({ length: dayCount }, (_, index) => ({
    day: String(index + 1).padStart(2, '0'),
    revenue: 0,
  }));

  bookings.forEach((booking) => {
    if (booking.status !== 'checked-out') return;
    const checkoutDate = booking.checkOut ? new Date(booking.checkOut) : null;
    if (!checkoutDate || Number.isNaN(checkoutDate.getTime())) return;
    if (checkoutDate < start || checkoutDate > end) return;
    buckets[checkoutDate.getUTCDate() - 1].revenue += Number(booking.totalAmount ?? 0);
  });

  return buckets;
}

export function buildRevenueByMonthData(bookings: ManagerBooking[]) {
  const monthly = new Map<string, number>();

  bookings.forEach((booking) => {
    if (booking.status !== 'checked-out') return;
    const checkoutDate = booking.checkOut ? new Date(booking.checkOut) : null;
    if (!checkoutDate || Number.isNaN(checkoutDate.getTime())) return;
    const key = `${checkoutDate.getUTCFullYear()}-${String(checkoutDate.getUTCMonth() + 1).padStart(2, '0')}`;
    monthly.set(key, (monthly.get(key) ?? 0) + Number(booking.totalAmount ?? 0));
  });

  return Array.from(monthly.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([label, revenue]) => ({
      label: `Th${Number(label.slice(5))}`,
      revenue,
    }));
}

export function buildOccupancyByWeek(bookings: ManagerBooking[], roomCount: number, month: string) {
  const { start, end } = getMonthRange(month);
  const totalDays = end.getUTCDate();
  const weeks = Array.from({ length: 4 }, (_, index) => ({
    week: `Tuan ${index + 1}`,
    occupancy: 0,
  }));

  weeks.forEach((week, index) => {
    const rangeStart = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), index * 7 + 1));
    const rangeEnd = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), Math.min(totalDays, (index + 1) * 7)));
    const rangeStartTime = rangeStart.getTime();
    const rangeEndTime = rangeEnd.getTime();
    let occupiedNights = 0;

    bookings.forEach((booking) => {
      const bookingStart = booking.checkIn ? new Date(booking.checkIn) : null;
      const bookingEnd = booking.checkOut ? new Date(booking.checkOut) : null;
      if (!bookingStart || !bookingEnd) return;

      const overlapStart = Math.max(bookingStart.getTime(), rangeStartTime);
      const overlapEnd = Math.min(bookingEnd.getTime(), rangeEndTime + 86400000);
      if (overlapStart >= overlapEnd) return;

      occupiedNights += Math.ceil((overlapEnd - overlapStart) / 86400000);
    });

    const daysInBucket = Math.max(1, Math.ceil((rangeEndTime - rangeStartTime + 86400000) / 86400000));
    const capacity = Math.max(1, roomCount * daysInBucket);
    week.occupancy = Math.round((occupiedNights / capacity) * 100);
  });

  return weeks;
}

export function buildTopRoomTypes(bookings: ManagerBooking[], rooms: ManagerRoom[]) {
  const roomTypeMap = new Map(rooms.map((room) => [room.id, room.type]));
  const counts = new Map<string, number>();

  bookings.forEach((booking) => {
    const roomType = roomTypeMap.get(booking.roomId) ?? 'Suite';
    counts.set(roomType, (counts.get(roomType) ?? 0) + 1);
  });

  const total = Array.from(counts.values()).reduce((sum, value) => sum + value, 0);
  return Array.from(counts.entries()).map(([name, value]) => ({
    name,
    value: total > 0 ? Math.round((value / total) * 100) : 0,
  }));
}

export function buildFinancialRows(bookings: ManagerBooking[], from: string, to: string) {
  const rows = new Map<string, { period: string; revenue: number; bookings: number; totalNights: number }>();

  bookings.forEach((booking) => {
    if (booking.status !== 'checked-out') return;
    const bookingDate = booking.checkOut;
    if (!bookingDate) return;
    if (from && bookingDate < from) return;
    if (to && bookingDate > to) return;

    const current = rows.get(bookingDate) ?? {
      period: bookingDate,
      revenue: 0,
      bookings: 0,
      totalNights: 0,
    };

    current.revenue += Number(booking.totalAmount ?? 0);
    current.bookings += 1;
    current.totalNights += calculateNights(booking.checkIn, booking.checkOut);
    rows.set(bookingDate, current);
  });

  return Array.from(rows.values())
    .sort((left, right) => left.period.localeCompare(right.period))
    .map((row) => ({
      period: row.period,
      revenue: row.revenue,
      bookings: row.bookings,
      avgDailyRate: Math.round(row.revenue / Math.max(row.totalNights, 1)),
    }));
}