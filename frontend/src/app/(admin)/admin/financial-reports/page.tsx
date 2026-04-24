'use client';

import { useMemo, useState } from 'react';
import { jsPDF } from 'jspdf';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Button } from '@/components/ui';
import { ChartCard } from '@/components/admin/ChartCard';
import { DataTable, TableColumn } from '@/components/admin/DataTable';
import { financialRows, FinancialRow, revenueByMonthData } from '@/components/admin/mock-data';
import { formatCurrency } from '@/lib/utils';

export default function FinancialReportsPage() {
  const [dateRange, setDateRange] = useState({
    from: '2026-04-17',
    to: '2026-04-23',
  });

  const columns: TableColumn<FinancialRow>[] = useMemo(
    () => [
      { key: 'period', header: 'Kỳ báo cáo', render: (row) => row.period },
      { key: 'revenue', header: 'Doanh thu', render: (row) => formatCurrency(row.revenue) },
      { key: 'bookings', header: 'Số booking', render: (row) => row.bookings },
      { key: 'avgDailyRate', header: 'ADR', render: (row) => formatCurrency(row.avgDailyRate) },
    ],
    []
  );

  const exportCsv = () => {
    // Keep CSV export simple so superadmin can quickly share raw numbers.
    const header = 'Period,Revenue,Bookings,ADR\n';
    const body = financialRows
      .map((row) => `${row.period},${row.revenue},${row.bookings},${row.avgDailyRate}`)
      .join('\n');

    const blob = new Blob([header + body], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'financial-report.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportPdf = () => {
    // PDF export uses jsPDF with compact summary rows for offline archive.
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Financial Report', 20, 20);
    doc.setFontSize(11);
    doc.text(`Date range: ${dateRange.from} -> ${dateRange.to}`, 20, 30);

    let currentY = 40;
    financialRows.forEach((row) => {
      doc.text(
        `${row.period} | Revenue: ${formatCurrency(row.revenue)} | Bookings: ${row.bookings}`,
        20,
        currentY
      );
      currentY += 8;
    });

    doc.save('financial-report.pdf');
  };

  return (
    <div className="space-y-5">
      <section>
        <h2 className="text-2xl font-semibold text-slate-900">Báo cáo tài chính</h2>
        <p className="mt-1 text-sm text-slate-500">Theo dõi doanh thu theo khoảng thời gian và xuất file báo cáo.</p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-sm text-slate-600">
            Từ ngày
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange((prev) => ({ ...prev, from: e.target.value }))}
              className="mt-1 block rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="text-sm text-slate-600">
            Đến ngày
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange((prev) => ({ ...prev, to: e.target.value }))}
              className="mt-1 block rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <Button onClick={exportCsv}>Xuất CSV</Button>
          <Button variant="outline" onClick={exportPdf}>
            Xuất PDF
          </Button>
        </div>
      </section>

      <section>
        <DataTable columns={columns} rows={financialRows} />
      </section>

      <section>
        <ChartCard title="So sánh doanh thu theo tháng" description="Biểu đồ doanh thu 6 tháng gần nhất">
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByMonthData}>
                <XAxis dataKey="label" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="revenue" fill="#1e40af" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </section>
    </div>
  );
}
