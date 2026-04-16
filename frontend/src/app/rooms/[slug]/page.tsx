'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { roomTypesService } from '@/services/room-types.service';
import { formatCurrency, getBedLabel, getCapacityLabel } from '@/lib/utils';
import { ImageGallery, Button, Card, CardContent } from '@/components/ui';
import { Users, Maximize, Bed, Check, ArrowLeft, ShieldCheck, Star } from 'lucide-react';
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
      <div className="mx-auto w-full max-w-7xl px-4 py-8">
        <div className="animate-pulse">
          <div className="mb-4 h-8 w-1/4 rounded bg-manor-surface-high" />
          <div className="mb-4 h-96 rounded bg-manor-surface-high" />
          <div className="mb-2 h-4 w-3/4 rounded bg-manor-surface-high" />
          <div className="h-4 w-1/2 rounded bg-manor-surface-high" />
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-8 text-center">
        <h1 className="mb-4 text-2xl">{error || 'Không tìm thấy phòng'}</h1>
        <Link href="/rooms">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách phòng
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-manor-surface pb-24 pt-28">
      <div className="mx-auto grid w-full max-w-screen-2xl grid-cols-12 gap-16 px-8">
        <div className="col-span-12 lg:col-span-8">
          <div className="mb-8">
            <Link href="/rooms" className="inline-flex items-center gap-2 text-sm text-manor-muted hover:text-manor-primary">
              <ArrowLeft className="h-4 w-4" />
              Danh sách phòng
            </Link>
          </div>

          <div className="mb-12 overflow-hidden rounded-xl">
            <ImageGallery images={room.images} alt={room.name} />
          </div>

          <Card className="bg-manor-surface-low p-2">
            <CardContent className="p-8">
              <div className="mb-6 flex flex-wrap items-center gap-8 border-b border-manor-outline/20 pb-6 text-xs uppercase tracking-widest text-manor-muted">
                <span className="inline-flex items-center gap-2">
                  <Maximize className="h-4 w-4 text-manor-secondary" />
                  {room.areaSize ? `${room.areaSize}m²` : 'Luxury space'}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Bed className="h-4 w-4 text-manor-secondary" />
                  {getBedLabel(room.bedType, room.bedCount)}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Users className="h-4 w-4 text-manor-secondary" />
                  {getCapacityLabel(room.maxAdults, room.maxChildren)}
                </span>
              </div>

              <h1 className="mb-6 text-4xl">{room.name}</h1>
              {room.description && (
                <p className="mb-8 max-w-3xl text-lg leading-relaxed text-manor-muted">{room.description}</p>
              )}

              {room.amenities.length > 0 && (
                <div>
                  <h2 className="mb-5 text-2xl">Curated Amenities</h2>
                  <div className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2">
                    {room.amenities.map((amenity) => (
                      <div key={amenity.id} className="flex items-center gap-3 text-manor-primary">
                        <Check className="h-4 w-4 text-manor-secondary" />
                        <span>{amenity.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <div className="sticky top-32">
            <Card className="rounded-xl border border-manor-outline/20 bg-manor-surface-lowest">
              <CardContent className="p-8">
                <div className="mb-8 flex items-baseline justify-between">
                  <span className="text-3xl">{formatCurrency(room.basePrice)}</span>
                  <span className="text-sm text-manor-muted">/đêm</span>
                </div>

                <div className="mb-8 space-y-3 border-b border-manor-outline/20 pb-8 text-sm">
                  <div className="flex justify-between">
                    <span className="text-manor-muted">Sức chứa</span>
                    <span>{getCapacityLabel(room.maxAdults, room.maxChildren)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-manor-muted">Loại giường</span>
                    <span>{getBedLabel(room.bedType, room.bedCount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-manor-muted">Điểm nổi bật</span>
                    <span className="inline-flex items-center gap-1 text-manor-secondary">
                      <Star className="h-4 w-4" />
                      Signature
                    </span>
                  </div>
                </div>

                <Link href={`/booking?roomTypeId=${room.id}`}>
                  <Button className="w-full py-4">Reserve Suite</Button>
                </Link>

                <div className="mt-5 flex items-center justify-center gap-2 text-xs uppercase tracking-wider text-manor-muted">
                  <ShieldCheck className="h-4 w-4 text-manor-secondary" />
                  Secure booking
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
