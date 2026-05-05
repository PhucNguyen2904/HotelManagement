'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  BedDouble,
  CalendarCheck2,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/bookings', label: 'Đặt phòng', icon: CalendarCheck2 },
  { href: '/admin/rooms', label: 'Quản lý phòng', icon: BedDouble },
  { href: '/admin/customers', label: 'Khách hàng', icon: Users },
  { href: '/admin/reports', label: 'Báo cáo', icon: BarChart3 },
];

export function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'sticky top-0 h-screen border-r border-teal-900/40 bg-teal-900 text-teal-50 transition-all duration-200',
        collapsed ? 'w-[86px]' : 'w-[250px]'
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-teal-800 px-4 py-5">
          {!collapsed ? <p className="text-sm font-semibold">Hotel Manager</p> : null}
          <button
            type="button"
            className="rounded-md p-1.5 hover:bg-teal-800"
            onClick={onToggle}
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <nav className="space-y-1 p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                  active ? 'bg-teal-700 text-white' : 'text-teal-100 hover:bg-teal-800'
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
