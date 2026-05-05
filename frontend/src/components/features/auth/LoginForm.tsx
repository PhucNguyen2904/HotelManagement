'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/stores/authStore'
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { UserRole } from '@/types'
import { Eye, EyeOff } from 'lucide-react'

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, logout, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Auto-clear session when landing on login page
  React.useEffect(() => {
    logout();
  }, [logout]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);

      // If user came from a protected route, honor that redirect first.
      const redirectPath = searchParams.get('redirect');
      if (redirectPath) {
        router.push(redirectPath);
        return;
      }

      const currentUser = useAuthStore.getState().user;
      if (
        currentUser?.role === UserRole.SUPER_ADMIN ||
        currentUser?.role === UserRole.HOTEL_ADMIN ||
        currentUser?.role === UserRole.STAFF
      ) {
        router.push('/admin');
        return;
      }

      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Đăng nhập</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Input
            type="email"
            label="Email"
            value={email}
            onChange={handleEmailChange}
            placeholder="email@example.com"
            required
          />

          <Input
            type={showPassword ? "text" : "password"}
            label="Mật khẩu"
            value={password}
            onChange={handlePasswordChange}
            placeholder="••••••••"
            required
            endIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 hover:text-[var(--color-primary)] focus:outline-none"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Đăng nhập
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Chưa có tài khoản?{' '}
          <Link href="/register" className="text-primary-600 hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
