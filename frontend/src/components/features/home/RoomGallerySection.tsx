'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ROOMS_DATA } from './image-data';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN').format(price);
}

export function RoomGallerySection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Các Loại Phòng
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            26 phòng nghỉ với 3 loại phòng phù hợp mọi nhu cầu
          </p>
        </div>

        {/* Room Grid - 1 col mobile, 3 col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {ROOMS_DATA.map((room) => (
            <Link
              key={room.id}
              href={`/rooms/${room.slug}?hotelId=hotel_nganha_001`}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
            >
              {/* Image container */}
              <div className="relative h-52 overflow-hidden">
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
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                  👥 {room.capacity} người
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-semibold text-xl text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {room.name}
                </h3>
                
                {/* Bed info */}
                <p className="text-sm text-gray-600 mb-1">
                  {room.bedInfo}
                </p>
                
                <p className="text-sm text-gray-500 mb-4">
                  {room.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <p className="text-primary-600 font-bold text-xl">
                    {formatPrice(room.price)}
                    <span className="text-sm font-normal text-gray-500"> VND/đêm</span>
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
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
          >
            Xem tất cả phòng
          </Link>
        </div>
      </div>
    </section>
  );
}
