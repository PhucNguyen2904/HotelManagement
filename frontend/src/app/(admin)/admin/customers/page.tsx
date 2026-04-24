'use client';

import { useMemo, useState } from 'react';
import { useManager } from '@/components/manager';
import { mockCustomers } from '@/components/manager/mock-data';
import { formatDate } from '@/lib/utils';

export default function CustomerManagementPage() {
  const { bookings, rooms } = useManager();
  const [keyword, setKeyword] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');

  const filteredCustomers = useMemo(
    () =>
      mockCustomers.filter((customer) => {
        const q = keyword.trim().toLowerCase();
        if (!q) return true;
        return customer.name.toLowerCase().includes(q) || customer.phone.includes(q);
      }),
    [keyword]
  );

  const selectedCustomer = filteredCustomers.find((customer) => customer.id === selectedCustomerId);
  const customerBookings = selectedCustomer
    ? bookings.filter((booking) => booking.email === selectedCustomer.email || booking.phone === selectedCustomer.phone)
    : [];

  const roomMap = new Map(rooms.map((room) => [room.id, room.roomNumber]));

  return (
    <div className="space-y-5">
      <section>
        <h2 className="text-2xl font-semibold text-slate-900">Quản lý khách hàng</h2>
        <p className="mt-1 text-sm text-slate-500">Tìm kiếm theo tên/SĐT và xem lịch sử booking của từng khách.</p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <input
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm md:max-w-md"
          placeholder="Tìm theo tên hoặc SĐT..."
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-teal-50 text-xs uppercase tracking-wide text-slate-600">
              <tr>
                <th className="px-4 py-3">Tên</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">SĐT</th>
                <th className="px-4 py-3">Số lần đặt</th>
                <th className="px-4 py-3">Lần cuối ở</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className={`cursor-pointer border-t border-slate-100 ${selectedCustomerId === customer.id ? 'bg-teal-50' : ''}`}
                  onClick={() => setSelectedCustomerId(customer.id)}
                >
                  <td className="px-4 py-3 font-medium">{customer.name}</td>
                  <td className="px-4 py-3">{customer.email}</td>
                  <td className="px-4 py-3">{customer.phone}</td>
                  <td className="px-4 py-3">{customer.bookingCount}</td>
                  <td className="px-4 py-3">{formatDate(customer.lastStay)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-lg font-semibold text-slate-900">Lịch sử booking</h3>
          {selectedCustomer ? (
            <div className="space-y-2">
              {customerBookings.map((booking) => (
                <div key={booking.id} className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm">
                  <p className="font-semibold text-slate-900">{booking.id}</p>
                  <p className="text-slate-600">
                    Phòng #{roomMap.get(booking.roomId)} - {formatDate(booking.checkIn)} đến {formatDate(booking.checkOut)}
                  </p>
                </div>
              ))}
              {customerBookings.length === 0 ? <p className="text-sm text-slate-500">Chưa có booking tương ứng trong dữ liệu demo.</p> : null}
            </div>
          ) : (
            <p className="text-sm text-slate-500">Chọn một khách hàng để xem lịch sử booking.</p>
          )}
        </div>
      </section>
    </div>
  );
}
