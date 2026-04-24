import { Booking, Room } from '@/components/manager/types';
import { StatusBadge } from '@/components/manager/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';

interface BookingTableProps {
  bookings: Booking[];
  rooms: Room[];
  onViewDetail?: (booking: Booking) => void;
}

export function BookingTable({ bookings, rooms, onViewDetail }: BookingTableProps) {
  const roomMap = new Map(rooms.map((room) => [room.id, room.roomNumber]));

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-teal-50 text-xs uppercase tracking-wide text-slate-600">
          <tr>
            <th className="px-4 py-3">Mã booking</th>
            <th className="px-4 py-3">Khách</th>
            <th className="px-4 py-3">Phòng</th>
            <th className="px-4 py-3">Nhận/Trả</th>
            <th className="px-4 py-3">Trạng thái</th>
            <th className="px-4 py-3">Tổng tiền</th>
            <th className="px-4 py-3">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="border-t border-slate-100 text-slate-700">
              <td className="px-4 py-3 font-medium">{booking.id}</td>
              <td className="px-4 py-3">{booking.guestName}</td>
              <td className="px-4 py-3">#{roomMap.get(booking.roomId) ?? '-'}</td>
              <td className="px-4 py-3">
                {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={booking.status} />
              </td>
              <td className="px-4 py-3 font-semibold">{formatCurrency(booking.totalAmount)}</td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  className="rounded-md bg-teal-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-700"
                  onClick={() => onViewDetail?.(booking)}
                >
                  Chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
