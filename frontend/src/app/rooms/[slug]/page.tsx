'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { roomTypesService } from '@/services/room-types.service';
import { formatCurrency, getBedLabel, getCapacityLabel } from '@/lib/utils';
import { ImageGallery, Button, Card, CardContent } from '@/components/ui';
import { Users, Maximize, Bed, Check, ArrowLeft } from 'lucide-react';
import type { RoomType } from '@/types';

const NGANHA_HOTEL_ID = 'hotel_nganha_001';

export default function RoomDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const hotelId = searchParams.get('hotelId') || NGANHA_HOTEL_ID;

  const [room, setRoom] = useState<RoomType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRoom() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await roomTypesService.getBySlug(hotelId, slug);
        setRoom(data);
      } catch (err) {
        console.error('Failed to fetch room:', err);
        setError('Không tìm thấy thông tin phòng');
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      fetchRoom();
    }
  }, [slug, hotelId]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
          <div className="h-96 bg-gray-200 rounded mb-4" />
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Không tìm thấy phòng'}
          </h1>
          <Link href="/rooms">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại danh sách phòng
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-primary-600">
                Trang chủ
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/rooms" className="hover:text-primary-600">
                Danh sách phòng
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium">{room.name}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <ImageGallery images={room.images} alt={room.name} />

            {/* Room Info */}
            <Card>
              <CardContent className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{room.name}</h1>

                {/* Quick Info */}
                <div className="flex flex-wrap gap-6 text-gray-600 mb-6 pb-6 border-b">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary-600" />
                    <span>{getCapacityLabel(room.maxAdults, room.maxChildren)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-primary-600" />
                    <span>{getBedLabel(room.bedType, room.bedCount)}</span>
                  </div>
                  {room.areaSize && (
                    <div className="flex items-center gap-2">
                      <Maximize className="h-5 w-5 text-primary-600" />
                      <span>{room.areaSize}m²</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {room.description && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Mô tả</h2>
                    <p className="text-gray-600 leading-relaxed">{room.description}</p>
                  </div>
                )}

                {/* Amenities */}
                {room.amenities && room.amenities.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                      Tiện nghi phòng
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {room.amenities.map((amenity) => (
                        <div
                          key={amenity.id}
                          className="flex items-center gap-2 text-gray-600"
                        >
                          <Check className="h-4 w-4 text-green-500" />
                          <span>{amenity.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bed Type Info Box */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-blue-900 mb-3">
                  Thông tin giường
                </h2>
                <div className="flex items-center gap-4">
                  <div className="text-4xl">
                    {room.bedType === 'SINGLE' && '🛏️'}
                    {room.bedType === 'TWIN' && '🛏️🛏️'}
                    {room.bedType === 'DOUBLE' && '🛌'}
                    {room.bedType === 'QUEEN' && '👑🛌'}
                    {room.bedType === 'KING' && '👑🛌'}
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">
                      {getBedLabel(room.bedType, room.bedCount)}
                    </p>
                    <p className="text-sm text-blue-700">
                      {room.bedType === 'SINGLE' && 'Phòng đơn phù hợp cho 1 người'}
                      {room.bedType === 'TWIN' &&
                        'Phòng có 2 giường đơn riêng biệt, phù hợp cho bạn bè hoặc đồng nghiệp'}
                      {room.bedType === 'DOUBLE' &&
                        'Phòng có 1 giường đôi lớn, phù hợp cho các cặp đôi'}
                      {room.bedType === 'QUEEN' && 'Phòng có 1 giường Queen size cao cấp'}
                      {room.bedType === 'KING' && 'Phòng có 1 giường King size sang trọng'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <span className="text-3xl font-bold text-primary-600">
                      {formatCurrency(room.basePrice)}
                    </span>
                    <span className="text-gray-500">/đêm</span>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Sức chứa</span>
                      <span className="font-medium">
                        {getCapacityLabel(room.maxAdults, room.maxChildren)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Loại giường</span>
                      <span className="font-medium">
                        {getBedLabel(room.bedType, room.bedCount)}
                      </span>
                    </div>
                    {room.areaSize && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Diện tích</span>
                        <span className="font-medium">{room.areaSize}m²</span>
                      </div>
                    )}
                  </div>

                  <Link href={`/booking?roomTypeId=${room.id}`}>
                    <Button className="w-full" size="lg">
                      Đặt phòng ngay
                    </Button>
                  </Link>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    Giá chưa bao gồm thuế và phí dịch vụ
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
