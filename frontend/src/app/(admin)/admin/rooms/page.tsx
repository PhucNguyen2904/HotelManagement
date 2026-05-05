'use client';

import { FormEvent, useMemo, useState } from 'react';
import { Modal, StatusBadge, useManager } from '@/components/manager';
import { Room, RoomStatus, RoomType } from '@/components/manager/types';
import { formatCurrency } from '@/lib/utils';

const amenityOptions = ['Wifi', 'TV', 'May lanh', 'Bon tam', 'Ban cong', 'Minibar'];
const statusOptions: RoomStatus[] = ['available', 'occupied', 'cleaning', 'maintenance'];
const roomTypeOptions: RoomType[] = ['Single', 'Twin', 'Double', 'Suite'];
const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const initialForm = {
  id: '',
  roomNumber: '',
  type: 'Single' as RoomType,
  floor: 1,
  pricePerNight: 700000,
  description: '',
  amenities: [] as string[],
  image: '',
};

export default function RoomManagementPage() {
  const { rooms, bookings, addRoom, updateRoom, updateRoomStatus } = useManager();
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [form, setForm] = useState(initialForm);

  const openCreate = () => {
    setEditingRoom(null);
    setForm(initialForm);
    setShowRoomForm(true);
  };

  const openEdit = (room: Room) => {
    setEditingRoom(room);
    setForm({
      id: room.id,
      roomNumber: room.roomNumber,
      type: room.type,
      floor: room.floor,
      pricePerNight: room.pricePerNight,
      description: room.description,
      amenities: room.amenities,
      image: room.image,
    });
    setShowRoomForm(true);
  };

  const submitRoom = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload: Room = {
      id: form.id || `R-${form.roomNumber}`,
      roomNumber: form.roomNumber,
      type: form.type,
      floor: Number(form.floor),
      pricePerNight: Number(form.pricePerNight),
      description: form.description,
      amenities: form.amenities,
      image: form.image || 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600',
      status: editingRoom?.status ?? 'available',
    };
    if (editingRoom) updateRoom(payload);
    else addRoom(payload);
    setShowRoomForm(false);
  };

  const occupancyCalendar = useMemo(
    () =>
      rooms.map((room) => {
        const roomBookings = bookings.filter(
          (booking) =>
            booking.roomId === room.id && booking.status !== 'cancelled' && booking.status !== 'checked-out'
        );
        return { room, roomBookings };
      }),
    [rooms, bookings]
  );

  return (
    <div className="space-y-5">
      <section className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Quản lý phòng</h2>
          <p className="mt-1 text-sm text-slate-500">Thêm/sửa phòng, đổi trạng thái nhanh và xem lịch bận theo tuần.</p>
        </div>
        <button type="button" className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700" onClick={openCreate}>
          + Thêm phòng
        </button>
      </section>

      <section className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-teal-50 text-xs uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">Số phòng</th>
              <th className="px-4 py-3">Loại</th>
              <th className="px-4 py-3">Tầng</th>
              <th className="px-4 py-3">Giá/đêm</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium">#{room.roomNumber}</td>
                <td className="px-4 py-3">{room.type}</td>
                <td className="px-4 py-3">{room.floor}</td>
                <td className="px-4 py-3">{formatCurrency(room.pricePerNight)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={room.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className="rounded-md border border-slate-300 px-3 py-1 text-xs hover:bg-slate-100" onClick={() => openEdit(room)}>
                      Sửa
                    </button>
                    <select className="rounded-md border border-slate-300 px-2 py-1 text-xs" value={room.status} onChange={(event) => updateRoomStatus(room.id, event.target.value as RoomStatus)}>
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-lg font-semibold text-slate-900">Lịch phòng (mini calendar)</h3>
        <div className="space-y-3">
          {occupancyCalendar.map(({ room, roomBookings }) => (
            <div key={room.id} className="rounded-lg border border-slate-100 p-3">
              <p className="mb-2 text-sm font-semibold text-slate-900">Phòng {room.roomNumber}</p>
              <div className="grid grid-cols-7 gap-1">
                {weekDays.map((day, index) => {
                  const busy = roomBookings.length > 0 && index < Math.min(5, roomBookings.length + 1);
                  return (
                    <div key={day} className={`rounded-md px-2 py-1 text-center text-xs ${busy ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Modal open={showRoomForm} title={editingRoom ? 'Sửa phòng' : 'Thêm phòng'} onClose={() => setShowRoomForm(false)}>
        <form onSubmit={submitRoom} className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Số phòng" value={form.roomNumber} onChange={(event) => setForm((prev) => ({ ...prev, roomNumber: event.target.value }))} required />
          <select className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={form.type} onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value as RoomType }))}>
            {roomTypeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <input type="number" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Tầng" value={form.floor} onChange={(event) => setForm((prev) => ({ ...prev, floor: Number(event.target.value) }))} />
          <input type="number" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Giá/đêm" value={form.pricePerNight} onChange={(event) => setForm((prev) => ({ ...prev, pricePerNight: Number(event.target.value) }))} />
          <textarea className="min-h-[90px] rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2" placeholder="Mô tả" value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} />
          <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2" placeholder="Ảnh URL" value={form.image} onChange={(event) => setForm((prev) => ({ ...prev, image: event.target.value }))} />
          <div className="md:col-span-2">
            <p className="mb-2 text-sm font-medium text-slate-700">Tiện nghi</p>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              {amenityOptions.map((amenity) => (
                <label key={amenity} className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.amenities.includes(amenity)}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        amenities: event.target.checked
                          ? [...prev.amenities, amenity]
                          : prev.amenities.filter((item) => item !== amenity),
                      }))
                    }
                  />
                  {amenity}
                </label>
              ))}
            </div>
          </div>
          <button type="submit" className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 md:col-span-2">
            Lưu phòng
          </button>
        </form>
      </Modal>
    </div>
  );
}
