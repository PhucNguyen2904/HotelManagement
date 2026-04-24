'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui';
import { AuditLogRow, auditLogs } from '@/components/admin/mock-data';
import { DataTable, TableColumn } from '@/components/admin/DataTable';

const PAGE_SIZE = 3;

export default function AuditLogPage() {
  const [selectedUser, setSelectedUser] = useState('all');
  const [selectedAction, setSelectedAction] = useState('all');
  const [fromTime, setFromTime] = useState('2026-04-22');
  const [toTime, setToTime] = useState('2026-04-23');
  const [page, setPage] = useState(1);

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((item) => {
      const byUser = selectedUser === 'all' || item.user === selectedUser;
      const byAction = selectedAction === 'all' || item.action === selectedAction;
      const byTime =
        item.timestamp.slice(0, 10) >= fromTime && item.timestamp.slice(0, 10) <= toTime;
      return byUser && byAction && byTime;
    });
  }, [selectedAction, selectedUser, fromTime, toTime]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / PAGE_SIZE));
  const logsOnPage = filteredLogs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns: TableColumn<AuditLogRow>[] = [
    { key: 'user', header: 'Người thao tác', render: (row) => row.user },
    { key: 'action', header: 'Hành động', render: (row) => row.action },
    { key: 'target', header: 'Mục tiêu', render: (row) => row.target },
    { key: 'ip', header: 'IP', render: (row) => row.ip },
    { key: 'timestamp', header: 'Thời gian', render: (row) => row.timestamp },
  ];

  return (
    <div className="space-y-5">
      <section>
        <h2 className="text-2xl font-semibold text-slate-900">Audit Log</h2>
        <p className="mt-1 text-sm text-slate-500">Lịch sử thao tác hệ thống theo user, hành động, thời gian và IP.</p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <select
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={selectedUser}
            onChange={(e) => {
              setSelectedUser(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">Tất cả user</option>
            {Array.from(new Set(auditLogs.map((item) => item.user))).map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>

          <select
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={selectedAction}
            onChange={(e) => {
              setSelectedAction(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">Tất cả hành động</option>
            {Array.from(new Set(auditLogs.map((item) => item.action))).map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>

          <input type="date" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={fromTime} onChange={(e) => setFromTime(e.target.value)} />
          <input type="date" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={toTime} onChange={(e) => setToTime(e.target.value)} />
        </div>
      </section>

      <section className="space-y-3">
        <DataTable columns={columns} rows={logsOnPage} emptyMessage="Không có log phù hợp bộ lọc." />
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Trang {page}/{totalPages}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" disabled={page <= 1} onClick={() => setPage((prev) => prev - 1)}>
              Trang trước
            </Button>
            <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage((prev) => prev + 1)}>
              Trang sau
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
