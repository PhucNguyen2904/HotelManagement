'use client';

import { Button, Input } from '@/components/ui';

interface GuestInfoFormProps {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests: string;
  couponCode: string;
  discountAmount: number;
  onGuestChange: (field: string, value: string) => void;
  onCouponChange: (code: string) => void;
  onValidateCoupon: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error?: string;
  couponError?: string;
}

export function GuestInfoForm({
  guestName,
  guestEmail,
  guestPhone,
  specialRequests,
  couponCode,
  discountAmount,
  onGuestChange,
  onCouponChange,
  onValidateCoupon,
  onSubmit,
  isLoading,
  error,
  couponError,
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

      {/* Coupon Section */}
      <div className="pt-4 border-t border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mã giảm giá
        </label>
        <div className="flex gap-2">
          <Input
            className="flex-1"
            placeholder="Nhập mã coupon..."
            value={couponCode}
            onChange={(e) => onCouponChange(e.target.value)}
          />
          <Button type="button" variant="outline" onClick={onValidateCoupon}>
            Áp dụng
          </Button>
        </div>
        {couponError && (
          <p className="mt-1 text-sm text-red-600">{couponError}</p>
        )}
        {discountAmount > 0 && (
          <p className="mt-2 text-sm text-green-600">
            ✓ Giảm {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(discountAmount)}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full mt-6" isLoading={isLoading}>
        Xác nhận đặt phòng
      </Button>
    </form>
  );
}
