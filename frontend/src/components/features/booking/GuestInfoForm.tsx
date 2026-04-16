'use client';

import { Button, Input } from '@/components/ui';

interface GuestInfoFormProps {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests: string;
  onGuestChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error?: string;
}

export function GuestInfoForm({
  guestName,
  guestEmail,
  guestPhone,
  specialRequests,
  onGuestChange,
  onSubmit,
  isLoading,
  error,
}: GuestInfoFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <Input
        label="Họ và tên"
        value={guestName}
        onChange={(e) => onGuestChange('guestName', e.target.value)}
        required
      />

      <Input
        type="email"
        label="Email"
        value={guestEmail}
        onChange={(e) => onGuestChange('guestEmail', e.target.value)}
        required
      />

      <Input
        type="tel"
        label="Số điện thoại"
        value={guestPhone}
        onChange={(e) => onGuestChange('guestPhone', e.target.value)}
        required
      />

      <div className="pt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Yêu cầu đặc biệt (tùy chọn)
        </label>
        <textarea
          value={specialRequests}
          onChange={(e) => onGuestChange('specialRequests', e.target.value)}
          placeholder="Ghi chú thêm..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full mt-6" isLoading={isLoading}>
        Xác nhận đặt phòng
      </Button>
    </form>
  );
}
