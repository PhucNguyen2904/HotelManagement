'use client';

import { LogOut } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export function Header({
  managerName,
  onLogout,
}: {
  managerName: string;
  onLogout: () => void;
}) {
  const today = format(new Date(), "EEEE, 'ngày' dd/MM/yyyy", { locale: vi });

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-5">
        <div>
          <p className="text-xs uppercase tracking-wide text-teal-700">Hotel Manager Dashboard</p>
          <p className="text-sm text-slate-500">{today}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-full bg-teal-50 px-3 py-1.5 text-sm font-medium text-teal-700">{managerName}</div>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
