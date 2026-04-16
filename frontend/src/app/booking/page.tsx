'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useBookingStore } from '@/stores/bookingStore';
import { bookingsService } from '@/services/bookings.service';
import { roomTypesService } from '@/services/room-types.service';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { formatCurrency, calculateNights } from '@/lib/utils';
import type { RoomType } from '@/types';
import { ShieldCheck, BadgeCheck } from 'lucide-react';

function BookingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const bookingStore = useBookingStore();

  const [roomType, setRoomType] = useState<RoomType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Get params from URL
  const roomTypeId = searchParams.get('roomTypeId');
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/booking?roomTypeId=${roomTypeId}&checkIn=${checkIn}&checkOut=${checkOut}`);
    }
  }, [isAuthenticated, router, roomTypeId, checkIn, checkOut]);

  // Load room type details
  useEffect(() => {
    if (!roomTypeId) return;

    const loadRoomType = async () => {
      try {
        const data = await roomTypesService.getById('default-hotel-id', roomTypeId);
        setRoomType(data);
        bookingStore.setRoomType(data, 1);
      } catch (err) {
        setError('Failed to load room details');
      }
    };

    loadRoomType();
  }, [roomTypeId]);

  // Update booking store with dates
  useEffect(() => {
    if (checkIn && checkOut) {
      bookingStore.setDates(checkIn, checkOut);
    }
  }, [checkIn, checkOut, bookingStore]);

  const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0;
  const subtotal = roomType ? roomType.basePrice * nights : 0;
  const taxAmount = subtotal * 0.1;
  const total = subtotal + taxAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!roomType || !checkIn || !checkOut) {
        throw new Error('Missing required booking information');
      }

      const booking = await bookingsService.create({
        hotelId: 'default-hotel-id',
        checkIn,
        checkOut,
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
      setError(err.response?.data?.message || 'Lỗi khi tạo đặt phòng');
    } finally {
      setIsLoading(false);
    }
  };

  if (!roomType || !checkIn || !checkOut) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="font-serif text-xl italic text-sky-800">Secure Booking Experience</p>
          <h1 className="text-3xl font-semibold text-sky-900">Xác nhận đặt phòng</h1>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sky-900">Thông tin khách hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <Input
                    label="Họ và tên"
                    value={bookingStore.guestName}
                    onChange={(e) =>
                      bookingStore.setGuestInfo({
                        ...bookingStore,
                        guestName: e.target.value,
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
                        ...bookingStore,
                        guestEmail: e.target.value,
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
                        ...bookingStore,
                        guestPhone: e.target.value,
                      })
                    }
                    required
                  />

                  <div className="pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yêu cầu đặc biệt (tùy chọn)
                    </label>
                    <textarea
                      value={bookingStore.specialRequests}
                      onChange={(e) =>
                        bookingStore.setGuestInfo({
                          ...bookingStore,
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
                    <Button type="submit" className="mt-1 w-full" isLoading={isLoading}>
                      Xác nhận đặt phòng
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg text-sky-900">Thông tin đặt phòng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold text-sky-900">{roomType.name}</p>
                  <p className="mt-1 text-sm text-slate-600">{roomType.bedType}</p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Nhận phòng:</span>
                    <span className="font-medium">{checkIn}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Trả phòng:</span>
                    <span className="font-medium">{checkOut}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Số đêm:</span>
                    <span className="font-medium">{nights} đêm</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Tiền phòng:</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Thuế (10%):</span>
                    <span>{formatCurrency(taxAmount)}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 flex justify-between">
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

function BookingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const bookingStore = useBookingStore();

  const [roomType, setRoomType] = useState<RoomType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [couponError, setCouponError] = useState('');

  // Get params from URL
  const roomTypeId = searchParams.get('roomTypeId');
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/booking?roomTypeId=${roomTypeId}&checkIn=${checkIn}&checkOut=${checkOut}`);
    }
  }, [isAuthenticated, router, roomTypeId, checkIn, checkOut]);

  // Load room type details
  useEffect(() => {
    if (!roomTypeId) return;

    const loadRoomType = async () => {
      try {
        const data = await roomTypesService.getById('default-hotel-id', roomTypeId);
        setRoomType(data);
        bookingStore.setRoomType(data, 1);
      } catch (err) {
        setError('Failed to load room details');
      }
    };

    loadRoomType();
  }, [roomTypeId]);

  // Update booking store with dates
  useEffect(() => {
    if (checkIn && checkOut) {
      bookingStore.setDates(checkIn, checkOut);
    }
  }, [checkIn, checkOut, bookingStore]);

  const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0;
  const subtotal = roomType ? roomType.basePrice * nights : 0;
  const taxAmount = subtotal * 0.1;
  const total = subtotal + taxAmount - bookingStore.discountAmount;

  const handleValidateCoupon = async () => {
    if (!bookingStore.couponCode) return;

    setCouponError('');
    try {
      const result = await couponsService.validate({
        code: bookingStore.couponCode,
        hotelId: 'default-hotel-id',
        amount: subtotal,
        nights,
      });

      if (result.valid) {
        bookingStore.setCoupon(bookingStore.couponCode, result.discountAmount);
      } else {
        setCouponError('Mã coupon không hợp lệ');
      }
    } catch (err) {
      setCouponError('Lỗi khi xác thực coupon');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!roomType || !checkIn || !checkOut) {
        throw new Error('Missing required booking information');
      }

      const booking = await bookingsService.create({
        hotelId: 'default-hotel-id',
        checkIn,
        checkOut,
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
        couponCode: bookingStore.couponCode || undefined,
      });

      router.push(`/bookings/${booking.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi tạo đặt phòng');
    } finally {
      setIsLoading(false);
    }
  };

  if (!roomType || !checkIn || !checkOut) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="font-serif text-xl italic text-sky-800">Secure Booking Experience</p>
          <h1 className="text-3xl font-semibold text-sky-900">Xác nhận đặt phòng</h1>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sky-900">Thông tin khách hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <Input
                    label="Họ và tên"
                    value={bookingStore.guestName}
                    onChange={(e) =>
                      bookingStore.setGuestInfo({
                        ...bookingStore,
                        guestName: e.target.value,
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
                        ...bookingStore,
                        guestEmail: e.target.value,
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
                        ...bookingStore,
                        guestPhone: e.target.value,
                      })
                    }
                    required
                  />

                  <div className="pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yêu cầu đặc biệt (tùy chọn)
                    </label>
                    <textarea
                      value={bookingStore.specialRequests}
                      onChange={(e) =>
                        bookingStore.setGuestInfo({
                          ...bookingStore,
                          specialRequests: e.target.value,
                        })
                      }
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
                        value={bookingStore.couponCode}
                        onChange={(e) =>
                          bookingStore.setCoupon(e.target.value, bookingStore.discountAmount)
                        }
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleValidateCoupon}
                      >
                        Áp dụng
                      </Button>
                    </div>
                    {couponError && (
                      <p className="mt-1 text-sm text-red-600">{couponError}</p>
                    )}
                    {bookingStore.discountAmount > 0 && (
                      <p className="mt-2 text-sm text-green-600">
                        ✓ Giảm {formatCurrency(bookingStore.discountAmount)}
                      </p>
                    )}
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
                    <Button type="submit" className="mt-1 w-full" isLoading={isLoading}>
                      Xác nhận đặt phòng
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg text-sky-900">Thông tin đặt phòng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold text-sky-900">{roomType.name}</p>
                  <p className="mt-1 text-sm text-slate-600">{roomType.bedType}</p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Nhận phòng:</span>
                    <span className="font-medium">{checkIn}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Trả phòng:</span>
                    <span className="font-medium">{checkOut}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Số đêm:</span>
                    <span className="font-medium">{nights} đêm</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Tiền phòng:</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Thuế (10%):</span>
                    <span>{formatCurrency(taxAmount)}</span>
                  </div>
                  {bookingStore.discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Giảm giá:</span>
                      <span>-{formatCurrency(bookingStore.discountAmount)}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <span className="font-semibold">Tổng cộng:</span>
                  <span className="text-xl font-semibold text-[#0077B6]">
                    {formatCurrency(Math.max(0, total))}
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
