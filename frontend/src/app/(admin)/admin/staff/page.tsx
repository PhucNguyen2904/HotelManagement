'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Modal } from '@/components/manager';
import { DataTable, TableColumn } from '@/components/admin';
import { UserRole } from '@/types';
import { formatDate, getInitials } from '@/lib/utils';
import { usersService } from '@/services/users.service';

type StaffUser = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: string;
};

const roleOptions: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.HOTEL_ADMIN, UserRole.STAFF];

const initialForm = { id: '', fullName: '', email: '', phone: '', role: UserRole.STAFF as UserRole, password: '' };

export default function StaffManagementPage() {
  const [staff, setStaff] = useState<StaffUser[]>([]);
  const [editingStaff, setEditingStaff] = useState<StaffUser | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    const loadStaff = async () => {
      try {
        const response = await usersService.getAll({ limit: 100 });
        setStaff(
          response.data
            .filter((user) => user.role !== UserRole.GUEST)
            .map((user) => ({
              id: user.id,
              fullName: user.fullName,
              email: user.email,
              phone: user.phone ?? '',
              role: user.role,
              isActive: Boolean(user.isActive),
              createdAt: user.createdAt,
            }))
        );
      } catch (error) {
        console.error('Failed to load staff users', error);
      }
    };

    loadStaff();
  }, []);

  const columns: TableColumn<StaffUser>[] = useMemo(
    () => [
      {
        key: 'fullName',
        header: 'Nhân viên',
        render: (row) => (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-700">
              {getInitials(row.fullName)}
            </div>
            <div>
              <p className="font-medium text-slate-900">{row.fullName}</p>
              <p className="text-xs text-slate-500">{row.email}</p>
            </div>
          </div>
        ),
      },
      { key: 'role', header: 'Vai trò', render: (row) => row.role },
      { key: 'createdAt', header: 'Tạo lúc', render: (row) => (row.createdAt ? formatDate(row.createdAt) : '-') },
      {
        key: 'isActive',
        header: 'Trạng thái',
        render: (row) => (
          <span className={`rounded-full px-2 py-1 text-xs font-semibold ${row.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
            {row.isActive ? 'Hoạt động' : 'Ngưng'}
          </span>
        ),
      },
      {
        key: 'actions',
        header: 'Thao tác',
        render: (row) => (
          <div className="flex gap-2">
            <button type="button" className="rounded-md border border-slate-300 px-3 py-1 text-xs hover:bg-slate-100" onClick={() => openEdit(row)}>
              Sửa
            </button>
            <button type="button" className="rounded-md border border-rose-300 px-3 py-1 text-xs text-rose-700 hover:bg-rose-50" disabled={!row.isActive} onClick={() => deactivateStaff(row.id)}>
              Vô hiệu hóa
            </button>
          </div>
        ),
      },
    ],
    [staff]
  );

  const openEdit = (member: StaffUser) => {
    const selected = staff.find((item) => item.id === member.id);
    if (!selected) return;
    setEditingStaff(selected);
    setForm({
      id: selected.id,
      fullName: selected.fullName,
      email: selected.email,
      phone: selected.phone ?? '',
      role: selected.role,
      password: '',
    });
    setShowModal(true);
  };

  const submitStaff = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.fullName || !form.email) return;
    
    try {
      if (editingStaff) {
        const updated = await usersService.update(editingStaff.id, {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone || undefined,
          role: form.role,
        });

        setStaff((prev) =>
          prev.map((item) =>
            item.id === editingStaff.id
              ? {
                ...item,
                fullName: updated.fullName,
                email: updated.email,
                phone: updated.phone ?? '',
                role: updated.role,
              }
              : item
          )
        );
      } else {
        const created = await usersService.create({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone || undefined,
          role: form.role,
          password: form.password,
        });

        setStaff((prev) => [
          {
            id: created.id,
            fullName: created.fullName,
            email: created.email,
            phone: created.phone ?? '',
            role: created.role,
            isActive: true,
            createdAt: created.createdAt,
          },
          ...prev,
        ]);
      }
    } catch (error) {
      console.error('Failed to save staff user', error);
    }
    setShowModal(false);
  };

  const deactivateStaff = async (id: string) => {
    try {
      await usersService.remove(id);
      setStaff((prev) => prev.map((item) => (item.id === id ? { ...item, isActive: false } : item)));
    } catch (error) {
      console.error('Failed to deactivate staff user', error);
    }
  };

  return (
    <div className="space-y-5">
      <section className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Quản lý nhân sự</h2>
        </div>
        <button
          onClick={() => {
            setEditingStaff(null);
            setForm(initialForm);
            setShowModal(true);
          }}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          + Thêm nhân viên
        </button>
      </section>

      <section className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <DataTable columns={columns} rows={staff} emptyMessage="Chưa có tài khoản nhân sự." />
      </section>

      <Modal open={showModal} title={editingStaff ? 'Sửa nhân viên' : 'Thêm nhân viên'} onClose={() => setShowModal(false)}>
        <form onSubmit={submitStaff} className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2" placeholder="Họ tên" value={form.fullName} onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))} required />
          <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2" type="email" placeholder="Email" value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} required />
          {!editingStaff && (
            <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2" type="password" placeholder="Mật khẩu" value={form.password} onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))} required />
          )}
          <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2" placeholder="Số điện thoại" value={form.phone} onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))} />
          <select className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2" value={form.role} onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value as UserRole }))}>
            {roleOptions.map((role) => (
              <option key={role} value={role}>
                {role}
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
