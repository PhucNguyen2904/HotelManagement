'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, ChevronLeft, ChevronRight, ClipboardList, LayoutDashboard, Settings2, Shield, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/staff', label: 'Tài khoản nhân viên', icon: Users },
  { href: '/admin/settings', label: 'Cấu hình hệ thống', icon: Settings2 },
  { href: '/admin/financial-reports', label: 'Báo cáo tài chính', icon: BarChart3 },
  { href: '/admin/audit-log', label: 'Audit Log', icon: ClipboardList },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'sticky top-0 h-screen border-r border-blue-900/70 bg-[#0f2343] text-blue-50 transition-all duration-200',
        collapsed ? 'w-[86px]' : 'w-[260px]'
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-blue-900/80 px-4 py-5">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-200" />
            {!collapsed ? <span className="font-semibold">Superadmin</span> : null}
          </div>
          <button
            type="button"
            onClick={onToggle}
            className="rounded-md p-1.5 text-blue-200 hover:bg-blue-900/60"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <nav className="space-y-1 p-3">
          {navItems.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                  isActive ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-900/60'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed ? <span>{item.label}</span> : null}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
