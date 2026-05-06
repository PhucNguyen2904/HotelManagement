import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { RoomType } from '@/types';
import { formatCurrency, getBedLabel } from '@/lib/utils';
import { Card, CardContent, Button } from '@/components/ui';
import { Users, Maximize, Bed } from 'lucide-react';

interface RoomCardProps {
  room: RoomType;
  checkIn?: string;
  checkOut?: string;
  hotelId?: string;
}

export function RoomCard({ room, checkIn, checkOut, hotelId }: RoomCardProps) {
  const images = Array.isArray(room.images) ? room.images : [];
  const amenities = Array.isArray(room.amenities) ? room.amenities : [];
  const primaryImage = images.find((img) => img.isPrimary) || images[0];

  // State to handle image loading errors
  const [imgSrc, setImgSrc] = useState(primaryImage?.url || '/images/placeholder.jpg');

  // Link đến trang chi tiết phòng với query params
  const detailUrl = hotelId
    ? `/rooms/${room.slug}?hotelId=${hotelId}`
    : `/rooms/${room.slug}`;

  // Link đến trang booking nếu có ngày
  const bookingUrl =
    checkIn && checkOut
      ? `/booking?roomTypeId=${room.id}&checkIn=${checkIn}&checkOut=${checkOut}`
      : detailUrl;

  return (
    <Card className="group overflow-hidden rounded-xl bg-manor-surface-lowest transition-all hover:translate-y-[-2px]">
      {/* Image - click để xem chi tiết */}
      <Link href={detailUrl}>
        <div className="relative aspect-[4/5] w-full cursor-pointer overflow-hidden">
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={room.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              onError={() => setImgSrc('/images/placeholder.jpg')}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-200">
              <span className="text-slate-400">Không có ảnh</span>
            </div>
          )}
          {room.availableRooms !== undefined && (
            <span className="absolute right-4 top-4 rounded bg-[var(--color-primary)] px-3 py-1 text-xs font-medium text-[var(--color-text-light)] backdrop-blur">
              Còn {room.availableRooms} phòng
            </span>
          )}
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <span className="rounded bg-black/50 px-3 py-1 text-white opacity-0 transition-opacity group-hover:opacity-100">
              Xem chi tiết
            </span>
          </div>
        </div>
      </Link>

      <CardContent className="p-6">
        <Link href={detailUrl}>
          <h3 className="mb-2 text-2xl text-[var(--color-primary)] transition-colors hover:text-[var(--color-secondary)]">
            {room.name}
          </h3>
        </Link>

        {/* Room info với bedCount */}
        <div className="mb-4 flex flex-wrap gap-3 text-sm text-[var(--color-text)]/80">
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {room.maxAdults} người
          </span>
          {room.areaSize && (
            <span className="flex items-center gap-1">
              <Maximize className="h-4 w-4" />
              {room.areaSize}m²
            </span>
          )}
          <span className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            {getBedLabel(room.bedType, room.bedCount)}
          </span>
        </div>

        {/* Amenities */}
        <div className="mb-6 flex flex-wrap gap-2">
          {amenities.slice(0, 4).map((amenity) => (
              <span
                key={amenity.id}
                className="rounded-full bg-[var(--color-surface)] px-3 py-1 text-[11px] uppercase tracking-wide text-[var(--color-text)]/75"
              >
                {amenity.name}
              </span>
            ))}
          {amenities.length > 4 && (
            <span className="text-xs text-[var(--color-text)]/60">+{amenities.length - 4}</span>
          )}
        </div>

        {/* Price and booking */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-semibold text-[var(--color-secondary)]">
              {formatCurrency(room.basePrice)}
            </span>
            <span className="text-sm text-[var(--color-text)]/65">/đêm</span>
          </div>
          <Link href={bookingUrl}>
            <Button size="sm">Xem chi tiết</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

