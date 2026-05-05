'use client';

import { useMemo, useState } from 'react';
import { Bar, BarChart, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useManager } from '@/components/manager';
import { buildOccupancyByWeek, buildRevenueByDayData, buildTopRoomTypes } from '@/lib/hotel-admin-data';
import { formatCurrency } from '@/lib/utils';

const donutColors = ['#0f766e', '#14b8a6', '#99f6e4'];

export default function OperationReportsPage() {
  const { bookings, rooms } = useManager();
  const [month, setMonth] = useState('2026-04');

  const headerText = useMemo(() => {
    const [year, monthValue] = month.split('-');
    return `Tháng ${monthValue}/${year}`;
  }, [month]);

  const revenueByDay = useMemo(() => buildRevenueByDayData(bookings, month), [bookings, month]);
  const occupancyByWeek = useMemo(() => buildOccupancyByWeek(bookings, rooms.length, month), [bookings, rooms.length, month]);
  const topRoomTypes = useMemo(() => buildTopRoomTypes(bookings, rooms), [bookings, rooms]);

  return (
    <div className="space-y-5">
      <section className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Báo cáo vận hành</h2>
          <p className="mt-1 text-sm text-slate-500">Theo dõi doanh thu, công suất phòng và loại phòng được đặt nhiều nhất.</p>
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">Lọc theo tháng</label>
          <input type="month" value={month} onChange={(event) => setMonth(event.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm xl:col-span-2">
          <h3 className="text-lg font-semibold text-slate-900">Doanh thu theo ngày - {headerText}</h3>
          <div className="mt-3 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueByDay}>
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Line type="monotone" dataKey="revenue" stroke="#0f766e" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Top loại phòng</h3>
          <div className="mt-3 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={topRoomTypes} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90}>
                  {topRoomTypes.map((item, index) => (
                    <Cell key={item.name} fill={donutColors[index % donutColors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Công suất phòng theo tuần</h3>
        <div className="mt-3 h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={occupancyByWeek}>
              <XAxis dataKey="week" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip formatter={(value: number) => `${value}%`} />
              <Bar dataKey="occupancy" fill="#14b8a6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
