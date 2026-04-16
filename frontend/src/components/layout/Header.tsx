'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  return (
    <header className="fixed top-0 z-50 w-full bg-[rgba(27,58,75,0.95)] backdrop-blur-xl">
      <div className="mx-auto flex h-24 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-serif text-[2.25rem] tracking-tight text-[var(--color-text-light)]">
            Ngân Hà Hotel
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/rooms"
            className="font-serif text-lg text-[var(--color-text-light)] transition-colors hover:text-white"
          >
            Phòng nghỉ
          </Link>
          <Link
            href="/reviews"
            className="font-serif text-lg text-[var(--color-text-light)] transition-colors hover:text-white"
          >
            Đánh giá
          </Link>
          <Link
            href="/about"
            className="font-serif text-lg text-[var(--color-text-light)] transition-colors hover:text-white"
          >
            Giới thiệu
          </Link>
          <Link
            href="/contact"
            className="font-serif text-lg text-[var(--color-text-light)] transition-colors hover:text-white"
          >
            Liên hệ
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link
                href="/bookings"
                className="text-lg font-medium text-[var(--color-text-light)] hover:text-white"
              >
                Đặt phòng của tôi
              </Link>
              <div className="flex items-center space-x-2">
                <span className="text-lg text-[var(--color-text-light)]">{user?.fullName}</span>
                <Button variant="outline" size="sm" onClick={logout}>
                  Đăng xuất
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button
                  size="sm"
                  className="border border-[var(--color-secondary)] bg-transparent text-[var(--color-secondary)] hover:bg-[var(--color-secondary)] hover:text-[var(--color-primary)]"
                >
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/rooms">
                <Button
                  size="sm"
                  className="bg-[var(--color-secondary)] font-bold text-[var(--color-primary)] hover:bg-[#d6bb87]"
                >
                  Reserve Now
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
