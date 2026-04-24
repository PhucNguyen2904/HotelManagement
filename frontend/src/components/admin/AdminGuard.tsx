'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';

const DEFAULT_ALLOWED_ROLES: UserRole[] = [
  UserRole.SUPER_ADMIN,
  UserRole.HOTEL_ADMIN,
  UserRole.STAFF,
];

export function AdminGuard({
  children,
  allowedRoles = DEFAULT_ALLOWED_ROLES,
}: {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  const isAllowed = useMemo(() => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  }, [allowedRoles, user]);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace('/login?redirect=/admin');
      return;
    }

    if (!isAllowed) {
      router.replace('/');
    }
  }, [isAllowed, isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-slate-900" />
      </div>
    );
  }

  if (!isAuthenticated || !isAllowed) return null;

  return children;
}

