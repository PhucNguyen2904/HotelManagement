'use client';

import { LoginForm } from '@/components/features/auth';

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <LoginForm />
    </div>
  );
}
