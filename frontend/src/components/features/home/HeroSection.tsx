'use client';

import { SearchForm } from '@/components/features/rooms';
import { ABOUT_IMAGES_DATA } from './image-data';

export function HeroSection() {
  // Sử dụng ảnh khách sạn làm background (index 0)
  const heroImage = ABOUT_IMAGES_DATA[0]?.image || '/images/quan-lan-3.png';

  return (
    <section className="relative bg-primary-900 text-white min-h-[500px]">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: heroImage ? `url('${heroImage}')` : undefined,
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-900/70" />

      {/* Content */}
      <div className="relative container mx-auto px-4 py-24">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
            Khách Sạn Ngân Hà
          </h1>
          <p className="text-xl md:text-2xl mb-2 text-gray-100">
            Đảo Quan Lạn - Vân Đồn - Quảng Ninh
          </p>
          <p className="text-lg mb-8 text-gray-200">
            Nghỉ dưỡng tuyệt vời bên bãi biển trong xanh vịnh Bái Tử Long
          </p>
        </div>

        {/* Search Form */}
        <div className="mt-8 max-w-4xl">
          <SearchForm />
        </div>
      </div>
    </section>
  );
}
