'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { bookingsService } from '@/services/bookings.service';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Booking } from '@/types';

export default function BookingsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!authLoading) {
      fetchBookings();
    }
  }, [isAuthenticated, authLoading, router]);

  const fetchBookings = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await bookingsService.getAll();
      setBookings(response.data);
    } catch (err) {
      setError('Không thể tải danh sách đặt phòng');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Đặt phòng của tôi</h1>
          <Link href="/rooms">
            <Button>Đặt phòng mới</Button>
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {bookings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600 mb-4">Bạn chưa có đặt phòng nào</p>
              <Link href="/rooms">
                <Button>Đặt phòng ngay</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">
                          {booking.bookingCode}
                        </h3>
                        <span
                          className={`text-xs px-2 py-1 rounded font-medium ${
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

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mt-4">
                        <div>
                          <p className="text-gray-500 text-xs">Nhận phòng</p>
                          <p className="font-medium text-gray-900">
                            {formatDate(booking.checkIn)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Trả phòng</p>
                          <p className="font-medium text-gray-900">
                            {formatDate(booking.checkOut)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Số đêm</p>
                          <p className="font-medium text-gray-900">
                            {booking.totalNights}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Tổng tiền</p>
                          <p className="font-medium text-primary-600">
                            {formatCurrency(booking.totalAmount)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 text-sm">
                        <p className="text-gray-600">
                          Khách: {booking.guestName} ({booking.adults} người lớn
                          {booking.children > 0 ? `, ${booking.children} trẻ em` : ''})
                        </p>
                      </div>
                    </div>

                    <Link href={`/bookings/${booking.id}`}>
                      <Button variant="outline" size="sm" className="ml-4">
                        Chi tiết
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
