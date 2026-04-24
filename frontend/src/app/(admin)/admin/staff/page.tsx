'use client';

import { FormEvent, useState } from 'react';
import { Modal } from '@/components/manager';
import { mockStaff } from '@/components/manager/mock-data';
import { ShiftType, StaffMember, StaffRole, StaffStatus } from '@/components/manager/types';

const roleOptions: StaffRole[] = ['Receptionist', 'Housekeeping'];
const shiftOptions: ShiftType[] = ['Sáng', 'Chiều', 'Tối'];
const statusOptions: StaffStatus[] = ['on-duty', 'off-duty'];

const initialForm = { id: '', name: '', role: 'Receptionist' as StaffRole, shift: 'Sáng' as ShiftType, status: 'on-duty' as StaffStatus };

export default function StaffManagementPage() {
  const [staff, setStaff] = useState<StaffMember[]>(mockStaff);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);

  const openCreate = () => {
    setEditingStaff(null);
    setForm(initialForm);
    setShowModal(true);
  };

  const openEdit = (member: StaffMember) => {
    setEditingStaff(member);
    setForm(member);
    setShowModal(true);
  };

  const submitStaff = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name) return;
    if (editingStaff) {
      setStaff((prev) => prev.map((item) => (item.id === editingStaff.id ? { ...form, id: editingStaff.id } : item)));
    } else {
      setStaff((prev) => [{ ...form, id: `EMP-${String(prev.length + 1).padStart(2, '0')}` }, ...prev]);
    }
    setShowModal(false);
  };

  const assignShift = (id: string, shift: ShiftType) => {
    setStaff((prev) => prev.map((item) => (item.id === id ? { ...item, shift } : item)));
  };

  return (
    <div className="space-y-5">
      <section className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Quản lý nhân viên nội bộ</h2>
          <p className="mt-1 text-sm text-slate-500">Quản lý role, trạng thái và phân công ca sáng/chiều/tối.</p>
        </div>
        <button type="button" className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700" onClick={openCreate}>
          + Thêm nhân viên
        </button>
      </section>

      <section className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-teal-50 text-xs uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">Tên</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Ca làm</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((member) => (
              <tr key={member.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium">{member.name}</td>
                <td className="px-4 py-3">{member.role}</td>
                <td className="px-4 py-3">
                  <select className="rounded-md border border-slate-300 px-2 py-1 text-xs" value={member.shift} onChange={(event) => assignShift(member.id, event.target.value as ShiftType)}>
                    {shiftOptions.map((shift) => (
                      <option key={shift} value={shift}>
                        {shift}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${member.status === 'on-duty' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                    {member.status === 'on-duty' ? 'Đang trực' : 'Nghỉ'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button type="button" className="rounded-md border border-slate-300 px-3 py-1 text-xs hover:bg-slate-100" onClick={() => openEdit(member)}>
                    Sửa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <Modal open={showModal} title={editingStaff ? 'Sửa nhân viên' : 'Thêm nhân viên'} onClose={() => setShowModal(false)}>
        <form onSubmit={submitStaff} className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2" placeholder="Tên nhân viên" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
          <select className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={form.role} onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value as StaffRole }))}>
            {roleOptions.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <select className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={form.shift} onChange={(event) => setForm((prev) => ({ ...prev, shift: event.target.value as ShiftType }))}>
            {shiftOptions.map((shift) => (
              <option key={shift} value={shift}>
                {shift}
              </option>
            ))}
          </select>
          <select className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2" value={form.status} onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as StaffStatus }))}>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status === 'on-duty' ? 'Đang trực' : 'Nghỉ'}
              </option>
            ))}
          </select>
          <button type="submit" className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 md:col-span-2">
            Lưu nhân viên
          </button>
        </form>
      </Modal>
    </div>
  );
}
