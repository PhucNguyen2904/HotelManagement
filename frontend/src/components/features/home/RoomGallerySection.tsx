'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BedDouble, Users } from 'lucide-react';
import { ROOMS_DATA } from './image-data';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN').format(price);
}

export function RoomGallerySection() {
  return (
    <section className="bg-[var(--color-accent)] py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-semibold text-[var(--color-primary)] md:text-4xl">
            Các Loại Phòng
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[var(--color-text)]/80">
            26 phòng nghỉ với 3 loại phòng phù hợp mọi nhu cầu
          </p>
        </div>

        {/* Room Grid - clean lifestyle grid */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
          {ROOMS_DATA.map((room) => (
            <Link
              key={room.id}
              href={`/rooms/${room.slug}?hotelId=hotel_nganha_001`}
              className="group overflow-hidden rounded border border-[var(--color-secondary)]/25 bg-white transition-all duration-300 hover:shadow-md"
            >
              {/* Image container */}
              <div className="relative h-60 overflow-hidden">
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                
                {/* Capacity badge */}
                <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded bg-[var(--color-primary)] px-3 py-1 text-sm font-medium text-[var(--color-text-light)] backdrop-blur-sm">
                  <Users size={14} strokeWidth={1.5} />
                  {room.capacity} người
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="mb-2 text-xl font-semibold text-[var(--color-primary)] transition-colors group-hover:text-[var(--color-secondary)]">
                  {room.name}
                </h3>
                
                {/* Bed info */}
                <p className="mb-1 inline-flex items-center gap-1 text-sm text-[var(--color-text)]/80">
                  <BedDouble size={14} strokeWidth={1.5} color="#1B3A4B" />
                  {room.bedInfo}
                </p>
                
                <p className="mb-4 text-sm text-[var(--color-text)]/65">
                  {room.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <p className="text-xl font-semibold text-[var(--color-secondary)]">
                    {formatPrice(room.price)}
                    <span className="text-sm font-normal text-[var(--color-text)]/65"> VND/đêm</span>
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-10">
          <Link
            href="/rooms"
            className="inline-block rounded bg-[var(--color-secondary)] px-8 py-3 font-semibold text-[var(--color-primary)] transition-colors duration-300 hover:bg-[var(--color-primary)] hover:text-[var(--color-secondary)]"
          >
            Xem tất cả phòng
          </Link>
        </div>
      </div>
    </section>
  );
}
