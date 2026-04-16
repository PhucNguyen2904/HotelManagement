'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui';

export function HeroAbout() {
  return (
    <section id="about-hero" className="relative h-[75vh] min-h-[540px] w-full overflow-hidden">
      {/* Background image */}
      <Image
        src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80"
        alt="Khách Sạn Ngân Hà — toàn cảnh view biển"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(27,58,75,0.55)] via-[rgba(27,58,75,0.40)] to-[rgba(27,58,75,0.70)]" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        {/* Decorative line */}
        <span className="mb-4 inline-block h-px w-16 bg-[var(--color-secondary)]" />

        <p className="font-serif text-base tracking-[0.3em] uppercase text-[var(--color-secondary)]">
          Về Chúng Tôi
        </p>

        <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
          Nơi Biển Xanh <br className="hidden sm:block" />
          <span className="italic text-[var(--color-secondary)]">Gặp Gỡ Sự Thanh Thản</span>
        </h1>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
          Khách Sạn Ngân Hà — ốc đảo yên bình giữa vịnh Bái Tử Long, nơi mỗi khoảnh khắc đều là trải nghiệm đáng nhớ.
        </p>

        <Link href="/rooms" className="mt-10">
          <Button size="lg" className="bg-[var(--color-secondary)] px-10 py-4 text-base font-bold tracking-wide text-[var(--color-primary)] shadow-lg transition-all duration-300 hover:bg-[#d6bb87] hover:shadow-xl">
            Đặt Phòng Ngay
          </Button>
        </Link>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--color-accent)] to-transparent" />
    </section>
  );
}
