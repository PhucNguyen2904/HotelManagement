'use client';

import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui';
import { getInitials } from '@/lib/utils';

interface AdminHeaderProps {
  hotelName: string;
  userName: string;
  onLogout: () => void;
}

export function AdminHeader({ hotelName, userName, onLogout }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-5">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Hệ thống quản trị</p>
          <h1 className="text-lg font-semibold text-slate-900">{hotelName}</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-700 text-xs font-semibold text-white">
              {getInitials(userName)}
            </div>
            <p className="text-sm font-medium text-slate-700">{userName}</p>
          </div>
          <Button variant="outline" className="gap-2 border-slate-300" onClick={onLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
