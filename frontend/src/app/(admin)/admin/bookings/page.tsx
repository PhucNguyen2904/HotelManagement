'use client';

import { FormEvent, useMemo, useState } from 'react';
import { BookingTable, Modal, StatusBadge, useManager } from '@/components/manager';
import { Booking, BookingStatus, Room } from '@/components/manager/types';
import { calculateNights, formatCurrency, formatDate } from '@/lib/utils';

const statusOptions: Array<{ label: string; value: BookingStatus | 'all' }> = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Chờ xác nhận', value: 'pending' },
  { label: 'Đã xác nhận', value: 'confirmed' },
  { label: 'Đã check-in', value: 'checked-in' },
  { label: 'Đã check-out', value: 'checked-out' },
  { label: 'Đã hủy', value: 'cancelled' },
];

function hasDateOverlap(roomId: string, checkIn: string, checkOut: string, bookings: Booking[]) {
  const nextStart = new Date(checkIn).getTime();
  const nextEnd = new Date(checkOut).getTime();
  return bookings.some((booking) => {
    if (booking.roomId !== roomId || booking.status === 'cancelled' || booking.status === 'checked-out') return false;
    const currentStart = new Date(booking.checkIn).getTime();
    const currentEnd = new Date(booking.checkOut).getTime();
    return nextStart < currentEnd && nextEnd > currentStart;
  });
}

export default function BookingManagementPage() {
  const { rooms, bookings, addBooking, updateBookingStatus } = useManager();

  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | 'all'>('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [form, setForm] = useState({
    guestName: '',
    email: '',
    phone: '',
    roomId: '',
    checkIn: '',
    checkOut: '',
    note: '',
  });

  const availableRooms = useMemo(
    () =>
      rooms.filter((room) => {
        if (room.status !== 'available') return false;
        if (!form.checkIn || !form.checkOut) return true;
        return !hasDateOverlap(room.id, form.checkIn, form.checkOut, bookings);
      }),
    [rooms, form.checkIn, form.checkOut, bookings]
  );

  const filteredBookings = bookings.filter((booking) => {
    const statusMatch = selectedStatus === 'all' || booking.status === selectedStatus;
    const dateMatch = !selectedDate || booking.checkIn === selectedDate || booking.checkOut === selectedDate;
    return statusMatch && dateMatch;
  });

  const createBooking = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.roomId || !form.checkIn || !form.checkOut || !form.guestName) return;

    const selectedRoom = rooms.find((room) => room.id === form.roomId);
    if (!selectedRoom) return;

    const nights = calculateNights(form.checkIn, form.checkOut);
    addBooking({
      id: `BK-${Date.now().toString().slice(-4)}`,
      guestName: form.guestName,
      email: form.email,
      phone: form.phone,
      roomId: form.roomId,
      checkIn: form.checkIn,
      checkOut: form.checkOut,
      status: 'pending',
      totalAmount: nights * selectedRoom.pricePerNight,
      note: form.note,
      createdAt: new Date().toISOString().slice(0, 10),
    });

    setForm({ guestName: '', email: '', phone: '', roomId: '', checkIn: '', checkOut: '', note: '' });
    setShowCreateModal(false);
  };

  const updateStatus = (status: BookingStatus) => {
    if (!selectedBooking) return;
    if (status === 'cancelled' && !cancelReason.trim()) return;
    updateBookingStatus(selectedBooking.id, status, status === 'cancelled' ? cancelReason : undefined);
    setSelectedBooking(null);
    setCancelReason('');
  };

  const roomById = new Map(rooms.map((room) => [room.id, room]));

  return (
    <div className="space-y-5">
      <section className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Quản lý đặt phòng</h2>
          <p className="mt-1 text-sm text-slate-500">Lọc, tạo booking walk-in, và xử lý trạng thái nhanh.</p>
        </div>
        <button
          type="button"
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
          onClick={() => setShowCreateModal(true)}
        >
          + Tạo booking mới
        </button>
      </section>

      <section className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3">
        <select
          value={selectedStatus}
          onChange={(event) => setSelectedStatus(event.target.value as BookingStatus | 'all')}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={selectedDate}
          onChange={(event) => setSelectedDate(event.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <div className="flex items-center justify-end text-sm text-slate-600">
          Kết quả: <span className="ml-2 rounded-full bg-teal-100 px-2 py-0.5 font-semibold text-teal-700">{filteredBookings.length}</span>
        </div>
      </section>

      <BookingTable bookings={filteredBookings} rooms={rooms} onViewDetail={setSelectedBooking} />

      <Modal open={showCreateModal} title="Tạo booking walk-in" onClose={() => setShowCreateModal(false)}>
        <form onSubmit={createBooking} className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Tên khách" value={form.guestName} onChange={(e) => setForm((prev) => ({ ...prev, guestName: e.target.value }))} />
          <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="SĐT" value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} />
          <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2" placeholder="Email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
          <input type="date" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={form.checkIn} onChange={(e) => setForm((prev) => ({ ...prev, checkIn: e.target.value }))} />
          <input type="date" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={form.checkOut} onChange={(e) => setForm((prev) => ({ ...prev, checkOut: e.target.value }))} />
          <select className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2" value={form.roomId} onChange={(e) => setForm((prev) => ({ ...prev, roomId: e.target.value }))}>
            <option value="">Chọn phòng trống</option>
            {availableRooms.map((room) => (
              <option key={room.id} value={room.id}>
                Phòng {room.roomNumber} - {room.type} - {formatCurrency(room.pricePerNight)}/đêm
              </option>
            ))}
          </select>
          <textarea className="min-h-[90px] rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2" placeholder="Ghi chú" value={form.note} onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))} />
          <button type="submit" className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 md:col-span-2">
            Lưu booking
          </button>
        </form>
      </Modal>

      <Modal open={Boolean(selectedBooking)} title="Chi tiết booking" onClose={() => setSelectedBooking(null)}>
        {selectedBooking ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm md:grid-cols-2">
              <p><span className="font-semibold">Mã:</span> {selectedBooking.id}</p>
              <p><span className="font-semibold">Khách:</span> {selectedBooking.guestName}</p>
              <p><span className="font-semibold">SĐT:</span> {selectedBooking.phone}</p>
              <p><span className="font-semibold">Email:</span> {selectedBooking.email}</p>
              <p><span className="font-semibold">Phòng:</span> {roomById.get(selectedBooking.roomId)?.roomNumber}</p>
              <p><span className="font-semibold">Lịch:</span> {formatDate(selectedBooking.checkIn)} - {formatDate(selectedBooking.checkOut)}</p>
              <p><span className="font-semibold">Tổng tiền:</span> {formatCurrency(selectedBooking.totalAmount)}</p>
              <p><span className="font-semibold">Trạng thái:</span> <StatusBadge status={selectedBooking.status} /></p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button type="button" className="rounded-lg bg-teal-600 px-3 py-2 text-sm font-medium text-white hover:bg-teal-700" onClick={() => updateStatus('confirmed')}>
                Xác nhận
              </button>
              <button type="button" className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700" onClick={() => updateStatus('checked-in')}>
                Check-in
              </button>
              <button type="button" className="rounded-lg bg-purple-600 px-3 py-2 text-sm font-medium text-white hover:bg-purple-700" onClick={() => updateStatus('checked-out')}>
                Check-out
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Lý do hủy booking</label>
              <textarea value={cancelReason} onChange={(event) => setCancelReason(event.target.value)} className="min-h-[90px] w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Nhập lý do hủy..." />
              <button type="button" className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-700" onClick={() => updateStatus('cancelled')}>
                Hủy booking
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
