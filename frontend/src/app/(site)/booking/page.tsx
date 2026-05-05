'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, BadgeCheck } from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import { useBookingStore } from '@/stores/bookingStore';
import { bookingsService } from '@/services/bookings.service';
import { roomTypesService } from '@/services/room-types.service';
import { calculateNights, formatCurrency } from '@/lib/utils';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/components/ui';
import type { RoomType } from '@/types';

function BookingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const bookingStore = useBookingStore();
  const setStoreRoomType = useBookingStore((state) => state.setRoomType);
  const setStoreDates = useBookingStore((state) => state.setDates);

  const [roomType, setRoomType] = useState<RoomType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const roomTypeId = searchParams.get('roomTypeId');
  const queryCheckIn = searchParams.get('checkIn');
  const queryCheckOut = searchParams.get('checkOut');

  const storeCheckIn = useBookingStore((state) => state.checkIn);
  const storeCheckOut = useBookingStore((state) => state.checkOut);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultCheckIn = today.toISOString().split('T')[0];
  const defaultCheckOut = tomorrow.toISOString().split('T')[0];

  const checkIn = queryCheckIn || storeCheckIn || defaultCheckIn;
  const checkOut = queryCheckOut || storeCheckOut || defaultCheckOut;

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push(
        `/login?redirect=/booking?roomTypeId=${roomTypeId}&checkIn=${checkIn}&checkOut=${checkOut}`,
      );
    }
  }, [authLoading, checkIn, checkOut, isAuthenticated, roomTypeId, router]);

  useEffect(() => {
    if (!roomTypeId) return;

    const loadRoomType = async () => {
      try {
        const data = await roomTypesService.getById('default-hotel-id', roomTypeId);
        setRoomType(data);
        setStoreRoomType(data, 1);
      } catch {
        setError('Failed to load room details');
      }
    };

    loadRoomType();
  }, [roomTypeId, setStoreRoomType]);

  useEffect(() => {
    if (checkIn && checkOut) setStoreDates(checkIn, checkOut);
  }, [checkIn, checkOut, setStoreDates]);

  const currentCheckIn = storeCheckIn || checkIn;
  const currentCheckOut = storeCheckOut || checkOut;

  const nights = currentCheckIn && currentCheckOut ? calculateNights(currentCheckIn, currentCheckOut) : 0;
  const taxPercent = 10;
  const subtotal = roomType ? roomType.basePrice * nights : 0;
  const taxAmount = subtotal * (taxPercent / 100);
  const total = subtotal + taxAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!roomType || !currentCheckIn || !currentCheckOut) {
        throw new Error('Missing required booking information');
      }

      if (nights <= 0) {
        throw new Error('Check-out date must be after check-in date');
      }

      const booking = await bookingsService.create({
        hotelId: roomType.hotelId,
        checkIn: currentCheckIn,
        checkOut: currentCheckOut,
        rooms: [
          {
            roomTypeId: roomType.id,
            quantity: bookingStore.quantity,
            adults: bookingStore.adults,
            children: bookingStore.children,
          },
        ],
        guestName: bookingStore.guestName,
        guestEmail: bookingStore.guestEmail,
        guestPhone: bookingStore.guestPhone,
        specialRequests: bookingStore.specialRequests,
      });

      router.push(`/bookings/${booking.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Lỗi khi tạo đặt phòng');
    } finally {
      setIsLoading(false);
    }
  };

  if (!roomType) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary-600" />
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="font-serif text-xl italic text-sky-800">
            Secure Booking Experience
          </p>
          <h1 className="text-3xl font-semibold text-sky-900">
            Xác nhận đặt phòng
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sky-900">Thông tin khách hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      type="date"
                      label="Ngày nhận phòng"
                      value={currentCheckIn}
                      onChange={(e) => setStoreDates(e.target.value, currentCheckOut)}
                      min={defaultCheckIn}
                      required
                    />
                    <Input
                      type="date"
                      label="Ngày trả phòng"
                      value={currentCheckOut}
                      onChange={(e) => setStoreDates(currentCheckIn, e.target.value)}
                      min={currentCheckIn}
                      required
                    />
                  </div>

                  <Input
                    label="Họ và tên"
                    value={bookingStore.guestName}
                    onChange={(e) =>
                      bookingStore.setGuestInfo({
                        guestName: e.target.value,
                        guestEmail: bookingStore.guestEmail,
                        guestPhone: bookingStore.guestPhone,
                        specialRequests: bookingStore.specialRequests,
                      })
                    }
                    required
                  />

                  <Input
                    type="email"
                    label="Email"
                    value={bookingStore.guestEmail}
                    onChange={(e) =>
                      bookingStore.setGuestInfo({
                        guestName: bookingStore.guestName,
                        guestEmail: e.target.value,
                        guestPhone: bookingStore.guestPhone,
                        specialRequests: bookingStore.specialRequests,
                      })
                    }
                    required
                  />

                  <Input
                    type="tel"
                    label="Số điện thoại"
                    value={bookingStore.guestPhone}
                    onChange={(e) =>
                      bookingStore.setGuestInfo({
                        guestName: bookingStore.guestName,
                        guestEmail: bookingStore.guestEmail,
                        guestPhone: e.target.value,
                        specialRequests: bookingStore.specialRequests,
                      })
                    }
                    required
                  />

                  <div className="pt-4">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Yêu cầu đặc biệt (tùy chọn)
                    </label>
                    <textarea
                      value={bookingStore.specialRequests}
                      onChange={(e) =>
                        bookingStore.setGuestInfo({
                          guestName: bookingStore.guestName,
                          guestEmail: bookingStore.guestEmail,
                          guestPhone: bookingStore.guestPhone,
                          specialRequests: e.target.value,
                        })
                      }
                      placeholder="Ghi chú thêm..."
                      className="w-full rounded-lg border border-gray-300 px-3 py-2"
                      rows={3}
                    />
                  </div>

                  <div className="rounded border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-3 flex items-center gap-4 text-sm text-slate-600">
                      <span className="inline-flex items-center gap-1">
                        <BadgeCheck className="h-4 w-4 text-sky-700" />
                        Best Rate Guaranteed
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <ShieldCheck className="h-4 w-4 text-sky-700" />
                        Secure Booking
                      </span>
                    </div>
                    <Button type="submit" className="mt-1 w-full" isLoading={isLoading} disabled={nights <= 0}>
                      Xác nhận đặt phòng
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-32">
              <CardHeader>
                <CardTitle className="text-lg text-sky-900">
                  Thông tin đặt phòng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold text-sky-900">{roomType.name}</p>
                  <p className="mt-1 text-sm text-slate-600">{roomType.bedType}</p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="mb-2 flex justify-between text-sm">
                    <span>Nhận phòng:</span>
                    <span className="font-medium">{currentCheckIn}</span>
                  </div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span>Trả phòng:</span>
                    <span className="font-medium">{currentCheckOut}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Số đêm:</span>
                    <span className="font-medium">{nights > 0 ? nights : 0} đêm</span>
                  </div>
                </div>

                <div className="space-y-2 border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Tiền phòng:</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Thuế (10%):</span>
                    <span>{formatCurrency(taxAmount)}</span>
                  </div>
                </div>

                <div className="flex justify-between border-t border-gray-200 pt-4">
                  <span className="font-semibold">Tổng cộng:</span>
                  <span className="text-xl font-semibold text-[#0077B6]">
                    {formatCurrency(total)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center bg-slate-50">
          <p className="text-slate-600">Đang tải trang đặt phòng...</p>
        </div>
      }
    >
      <BookingPageContent />
    </Suspense>
  );
}

