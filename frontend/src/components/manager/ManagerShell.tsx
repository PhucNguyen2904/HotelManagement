'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/manager/Header';
import { Sidebar } from '@/components/manager/Sidebar';

export function ManagerShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((prev) => !prev)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header managerName="Le Thi Hoa" onLogout={() => router.push('/')} />
        <main className="flex-1 p-5">{children}</main>
      </div>
    </div>
  );
}
