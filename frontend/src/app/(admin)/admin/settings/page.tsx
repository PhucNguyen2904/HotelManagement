'use client';

import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui';

export default function SystemSettingsPage() {
  const [form, setForm] = useState({
    hotelName: 'Khách Sạn Ngân Hà',
    address: 'Bãi Sơn Hào, Quan Lạn, Vân Đồn, Quảng Ninh',
    phone: '0203 3988 888',
    email: 'contact@nganhahotel.vn',
    logo: 'https://placehold.co/120x120',
    vatRate: 10,
    freeCancelDays: 5,
    lateCancelFee: 30,
    acceptCash: true,
    acceptBankTransfer: true,
    acceptCreditCard: true,
    timeZone: 'Asia/Ho_Chi_Minh',
    currency: 'VND',
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="space-y-5">
      <section>
        <h2 className="text-2xl font-semibold text-slate-900">Cấu hình hệ thống</h2>
        <p className="mt-1 text-sm text-slate-500">Quản lý thông tin khách sạn, thuế, chính sách hủy và phương thức thanh toán.</p>
      </section>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={form.hotelName} onChange={(e) => setForm((prev) => ({ ...prev, hotelName: e.target.value }))} placeholder="Tên khách sạn" />
          <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={form.address} onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))} placeholder="Địa chỉ" />
          <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} placeholder="Số điện thoại" />
          <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} placeholder="Email liên hệ" />
          <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2" value={form.logo} onChange={(e) => setForm((prev) => ({ ...prev, logo: e.target.value }))} placeholder="URL logo" />
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <label className="rounded-lg border border-slate-300 p-3 text-sm">
            VAT (%)
            <input
              type="number"
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
              value={form.vatRate}
              onChange={(e) => setForm((prev) => ({ ...prev, vatRate: Number(e.target.value) }))}
            />
          </label>
          <label className="rounded-lg border border-slate-300 p-3 text-sm">
            Hủy miễn phí trước (ngày)
            <input
              type="number"
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
              value={form.freeCancelDays}
              onChange={(e) => setForm((prev) => ({ ...prev, freeCancelDays: Number(e.target.value) }))}
            />
          </label>
          <label className="rounded-lg border border-slate-300 p-3 text-sm md:col-span-2">
            Phí hủy muộn (%)
            <input
              type="number"
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
              value={form.lateCancelFee}
              onChange={(e) => setForm((prev) => ({ ...prev, lateCancelFee: Number(e.target.value) }))}
            />
          </label>
        </div>

        <div className="rounded-lg border border-slate-300 p-3">
          <p className="text-sm font-medium text-slate-700">Phương thức thanh toán</p>
          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-3">
            <label className="text-sm"><input type="checkbox" className="mr-2" checked={form.acceptCash} onChange={(e) => setForm((prev) => ({ ...prev, acceptCash: e.target.checked }))} />Tiền mặt</label>
            <label className="text-sm"><input type="checkbox" className="mr-2" checked={form.acceptBankTransfer} onChange={(e) => setForm((prev) => ({ ...prev, acceptBankTransfer: e.target.checked }))} />Chuyển khoản</label>
            <label className="text-sm"><input type="checkbox" className="mr-2" checked={form.acceptCreditCard} onChange={(e) => setForm((prev) => ({ ...prev, acceptCreditCard: e.target.checked }))} />Thẻ tín dụng</label>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <select className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={form.timeZone} onChange={(e) => setForm((prev) => ({ ...prev, timeZone: e.target.value }))}>
            <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh</option>
            <option value="Asia/Bangkok">Asia/Bangkok</option>
            <option value="UTC">UTC</option>
          </select>
          <select className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={form.currency} onChange={(e) => setForm((prev) => ({ ...prev, currency: e.target.value }))}>
            <option value="VND">VND</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit">Lưu cấu hình</Button>
          {saved ? <span className="text-sm font-medium text-emerald-600">Đã lưu thay đổi</span> : null}
        </div>
      </form>
    </div>
  );
}
