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
  const primaryImage = room.images.find((img) => img.isPrimary) || room.images[0];

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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image - click để xem chi tiết */}
      <Link href={detailUrl}>
        <div className="relative h-48 w-full cursor-pointer group">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={room.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
          {room.availableRooms !== undefined && (
            <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
              Còn {room.availableRooms} phòng
            </span>
          )}
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 text-white bg-black/50 px-3 py-1 rounded transition-opacity">
              Xem chi tiết
            </span>
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={detailUrl}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
            {room.name}
          </h3>
        </Link>

        {/* Room info với bedCount */}
        <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
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
        <div className="flex flex-wrap gap-1 mb-4">
          {room.amenities.slice(0, 4).map((amenity) => (
            <span
              key={amenity.id}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
            >
              {amenity.name}
            </span>
          ))}
          {room.amenities.length > 4 && (
            <span className="text-xs text-gray-500">+{room.amenities.length - 4}</span>
          )}
        </div>

        {/* Price and booking */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-primary-600">
              {formatCurrency(room.basePrice)}
            </span>
            <span className="text-sm text-gray-500">/đêm</span>
          </div>
          <Link href={bookingUrl}>
            <Button size="sm">Đặt ngay</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
