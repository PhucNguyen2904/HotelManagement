'use client';

import { RoomGrid, StatusBadge, useManager } from '@/components/manager';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AdminDashboardPage() {
  const { rooms, bookings } = useManager();
  const today = new Date().toISOString().slice(0, 10);

  const todayCheckIns = bookings.filter((booking) => booking.checkIn === today);
  const todayCheckOuts = bookings.filter((booking) => booking.checkOut === today);
  const pendingBookings = bookings.filter((booking) => booking.status === 'pending');
  const todayRevenue = bookings
    .filter((booking) => booking.status === 'checked-out' && booking.checkOut === today)
    .reduce((sum, booking) => sum + booking.totalAmount, 0);

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Booking chờ xác nhận</p>
          <p className="mt-1 text-3xl font-semibold text-teal-700">{pendingBookings.length}</p>
          <span className="mt-2 inline-flex rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">
            Cần xử lý
          </span>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm xl:col-span-3">
          <p className="text-sm text-slate-500">Doanh thu hôm nay</p>
          <p className="mt-1 text-3xl font-semibold text-slate-900">{formatCurrency(todayRevenue)}</p>
          <p className="text-xs text-slate-500">Chỉ tính các booking đã check-out trong ngày</p>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Trạng thái phòng thời gian thực</h2>
          <div className="flex gap-2">
            <StatusBadge status="available" />
            <StatusBadge status="occupied" />
            <StatusBadge status="cleaning" />
            <StatusBadge status="maintenance" />
          </div>
        </div>
        <RoomGrid rooms={rooms} />
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-lg font-semibold text-slate-900">Check-in hôm nay</h3>
          <div className="space-y-2">
            {todayCheckIns.map((booking) => (
              <div key={booking.id} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                <p className="text-sm font-semibold text-slate-900">{booking.guestName}</p>
                <p className="text-xs text-slate-500">{booking.id}</p>
              </div>
            ))}
            {todayCheckIns.length === 0 ? <p className="text-sm text-slate-500">Không có check-in hôm nay.</p> : null}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-lg font-semibold text-slate-900">Check-out hôm nay</h3>
          <div className="space-y-2">
            {todayCheckOuts.map((booking) => (
              <div key={booking.id} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                <p className="text-sm font-semibold text-slate-900">{booking.guestName}</p>
                <p className="text-xs text-slate-500">
                  {booking.id} - {formatDate(booking.checkOut)}
                </p>
              </div>
            ))}
            {todayCheckOuts.length === 0 ? <p className="text-sm text-slate-500">Không có check-out hôm nay.</p> : null}
          </div>
        </div>
      </section>
    </div>
  );
}

