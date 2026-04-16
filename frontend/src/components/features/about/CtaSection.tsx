'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export function CtaSection() {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section id="about-cta" className="relative overflow-hidden py-20 sm:py-28">
      {/* Background image */}
      <Image
        src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1920&q=80"
        alt="Hoàng hôn trên biển Quan Lạn"
        fill
        className="object-cover"
        sizes="100vw"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[rgba(27,58,75,0.85)] to-[rgba(27,58,75,0.70)]" />

      {/* Content */}
      <div
        ref={ref}
        className={`relative z-10 mx-auto max-w-3xl px-4 text-center transition-all duration-700 ease-out sm:px-6 lg:px-8 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <span className="inline-block h-px w-12 bg-[var(--color-secondary)]" />
        <h2 className="mt-6 font-serif text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
          Bắt Đầu Kỳ Nghỉ <br />
          <span className="italic text-[var(--color-secondary)]">Trong Mơ Của Bạn</span>
        </h2>
        <p className="mt-5 text-base leading-relaxed text-white/70 sm:text-lg">
          Hãy để chúng tôi chăm sóc bạn giữa thiên nhiên biển đảo tuyệt đẹp. Đặt phòng ngay hôm
          nay để nhận ưu đãi đặc biệt dành riêng cho bạn.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/rooms">
            <Button
              size="lg"
              className="bg-[var(--color-secondary)] px-10 py-4 text-base font-bold tracking-wide text-[var(--color-primary)] shadow-lg transition-all duration-300 hover:bg-[#d6bb87] hover:shadow-xl"
            >
              Đặt Phòng Ngay
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              variant="outline"
              size="lg"
              className="border-white/50 px-10 py-4 text-base text-white hover:border-white hover:bg-white/10"
            >
              Liên Hệ Tư Vấn
            </Button>
          </Link>
        </div>

        {/* Trust signals */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs uppercase tracking-widest text-white/50">
          <span>✓ Giá tốt nhất đảm bảo</span>
          <span className="hidden sm:inline">•</span>
          <span>✓ Hủy miễn phí 24h</span>
          <span className="hidden sm:inline">•</span>
          <span>✓ Thanh toán an toàn</span>
        </div>
      </div>
    </section>
  );
}
