'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-primary-600">
            🏨 Ngân Hà Hotel
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/rooms"
            className="text-sm font-medium text-gray-600 hover:text-primary-600"
          >
            Phòng nghỉ
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-gray-600 hover:text-primary-600"
          >
            Giới thiệu
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-gray-600 hover:text-primary-600"
          >
            Liên hệ
          </Link>
          <a
            href="tel:0912326997"
            className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center"
          >
            📞 0912 326 997
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link
                href="/bookings"
                className="text-sm font-medium text-gray-600 hover:text-primary-600"
              >
                Đặt phòng của tôi
              </Link>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{user?.fullName}</span>
                <Button variant="outline" size="sm" onClick={logout}>
                  Đăng xuất
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Đăng ký</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
