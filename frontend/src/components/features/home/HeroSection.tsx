'use client';

import { SearchForm } from '@/components/features/rooms';
import { ABOUT_IMAGES_DATA } from './image-data';

export function HeroSection() {
  // Sử dụng ảnh khách sạn làm background (index 0)
  const heroImage = ABOUT_IMAGES_DATA[0]?.image || '/images/quan-lan-3.png';

  return (
    <section className="relative flex min-h-[88vh] items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: heroImage ? `url('${heroImage}')` : undefined,
        }}
      />
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(27,58,75,0.3), rgba(27,58,75,0.6))',
        }}
      />

      {/* Content */}
      <div className="relative mx-auto flex min-h-[88vh] w-full max-w-7xl flex-col justify-center px-4 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-secondary)]">
            Est. 1924 • Coastal Heritage
          </p>
          <h1 className="mb-6 text-5xl leading-tight text-white md:text-7xl lg:text-8xl">
            Khách Sạn Ngân Hà
          </h1>
          <p
            className="mb-12 font-serif text-2xl italic text-[var(--color-accent)] md:text-3xl"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.22)' }}
          >
            Where the Manor Meets the Sea
          </p>
        </div>

        {/* Floating booking widget */}
        <div className="mx-auto w-full max-w-5xl">
          <SearchForm />
        </div>
      </div>
    </section>
  );
}
