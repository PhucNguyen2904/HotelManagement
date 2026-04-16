'use client';

import { RegisterForm } from '@/components/features/auth';

export default function RegisterPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-8">
      <RegisterForm />
    </div>
  );
}
