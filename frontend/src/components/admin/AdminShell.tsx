'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Sidebar as AdminSidebar } from '@/components/admin/Sidebar';
import { Header as ManagerHeader } from '@/components/manager/Header';
import { Sidebar as ManagerSidebar } from '@/components/manager/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout, isLoading } = useAuth();

  const isManager =
    user?.role === UserRole.HOTEL_ADMIN || user?.role === UserRole.STAFF;

  // Prevent UI jumping while auth is being verified
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-700"></div>
          <p className="text-slate-600">Đang xác thực...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      {isManager ? (
        <ManagerSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((prev) => !prev)}
        />
      ) : (
        <AdminSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((prev) => !prev)}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {isManager ? (
          <ManagerHeader
            managerName={user?.fullName ?? 'Manager'}
            onLogout={() => { logout(); router.replace('/login'); }}
          />
        ) : (
          <AdminHeader
            hotelName="Khách Sạn Ngân Hà"
            userName={user?.fullName ?? 'Superadmin'}
            onLogout={() => { logout(); router.replace('/login'); }}
          />
        )}
        <main className="flex-1 p-5">{children}</main>
      </div>
    </div>
  );
}
