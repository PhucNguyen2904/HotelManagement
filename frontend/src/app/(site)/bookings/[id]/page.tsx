'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { useAuth } from '@/hooks/useAuth';
import { bookingsService } from '@/services/bookings.service';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Booking } from '@/types';

export default function BookingDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  const fetchBooking = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await bookingsService.getById(params.id);
      setBooking(data);
    } catch (err) {
      setError('Không thể tải chi tiết đặt phòng');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!authLoading) {
      fetchBooking();
    }
  }, [isAuthenticated, authLoading, fetchBooking, router]);

  const handleCancel = async () => {
    // eslint-disable-next-line no-alert
    if (!confirm('Bạn có chắc muốn hủy đặt phòng này?')) return;

    setIsCancelling(true);
    try {
      await bookingsService.cancel(params.id, 'Hủy từ client');
      setBooking((prev) => (prev ? { ...prev, status: 'CANCELLED' as any } : null));
    } catch {
      // eslint-disable-next-line no-alert
      alert('Không thể hủy đặt phòng');
    } finally {
      setIsCancelling(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary-600" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="py-8 text-center">
            <p className="mb-4 text-red-600">{error || 'Không tìm thấy đặt phòng'}</p>
            <Link href="/bookings">
              <Button variant="outline">Quay lại danh sách</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const canCancelBooking = booking.status === 'PENDING' || booking.status === 'CONFIRMED';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Link href="/bookings" className="mb-6 text-primary-600 hover:underline">
          ← Quay lại danh sách
        </Link>

        <div className="max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Chi tiết đặt phòng</h1>
              <p className="mt-1 text-gray-600">Mã: {booking.bookingCode}</p>
            </div>
            <span
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                booking.status === 'CONFIRMED'
                  ? 'bg-green-100 text-green-700'
                  : booking.status === 'CHECKED_IN'
                    ? 'bg-blue-100 text-blue-700'
                    : booking.status === 'CANCELLED'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {booking.status}
            </span>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Thông tin khách hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Tên</p>
                  <p className="font-medium">{booking.guestName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{booking.guestEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Số điện thoại</p>
                  <p className="font-medium">{booking.guestPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Số khách</p>
                  <p className="font-medium">
                    {booking.adults} người lớn
                    {booking.children > 0 ? `, ${booking.children} trẻ em` : ''}
                  </p>
                </div>
              </div>
              {booking.specialRequests && (
                <div className="border-t border-gray-200 pt-3">
                  <p className="text-sm text-gray-500">Yêu cầu đặc biệt</p>
                  <p className="font-medium">{booking.specialRequests}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Chi tiết đặt phòng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nhận phòng</p>
                  <p className="font-medium">{formatDate(booking.checkIn)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Trả phòng</p>
                  <p className="font-medium">{formatDate(booking.checkOut)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Số đêm</p>
                  <p className="font-medium">{booking.totalNights}</p>
                </div>
              </div>

              {booking.bookingRooms?.length > 0 && (
                <div className="border-t border-gray-200 pt-4">
                  <p className="mb-3 font-semibold">Phòng được đặt</p>
                  <div className="space-y-2">
                    {booking.bookingRooms?.map((room) => (
                      <div
                        key={room.id}
                        className="flex justify-between rounded bg-gray-50 p-3 text-sm"
                      >
                        <span>
                          {room.roomTypeName} ({room.roomNumber})
                        </span>
                        <span className="font-medium">
                          {formatCurrency(room.totalPrice)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Chi phí</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Tiền phòng</span>
                <span>{formatCurrency(booking.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Thuế ({booking.taxRate}%)</span>
                <span>{formatCurrency(booking.taxAmount)}</span>
              </div>
              {booking.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá</span>
                  <span>-{formatCurrency(booking.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-gray-200 pt-2 text-lg font-semibold">
                <span>Tổng tiền</span>
                <span className="text-primary-600">
                  {formatCurrency(booking.totalAmount)}
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Link href="/bookings" className="flex-1">
              <Button variant="outline" className="w-full">
                Quay lại danh sách
              </Button>
            </Link>
            {canCancelBooking && (
              <Button variant="danger" onClick={handleCancel} isLoading={isCancelling}>
                Hủy đặt phòng
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

