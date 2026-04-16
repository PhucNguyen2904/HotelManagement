'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useEffect, useRef, useState } from 'react';

const STATS = [
  { value: 26, suffix: '', label: 'Phòng Nghỉ', description: 'Đa dạng hạng phòng' },
  { value: 2015, suffix: '', label: 'Năm Thành Lập', description: 'Gần 1 thập kỷ đồng hành' },
  { value: 15, suffix: 'K+', label: 'Lượt Khách', description: 'Đã tin tưởng và lưu trú' },
  { value: 4, suffix: '', label: 'Giải Thưởng', description: 'Du lịch & Dịch vụ xuất sắc' },
] as const;

function useCountUp(target: number, isVisible: boolean, duration = 2000) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now();

    function step(currentTime: number) {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }, [isVisible, target, duration]);

  return count;
}

export function KeyStats() {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.3 });

  return (
    <section id="about-stats" className="relative overflow-hidden py-20 sm:py-28">
      {/* Decorative */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-accent)] via-[var(--color-surface)] to-[var(--color-accent)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`grid gap-8 sm:grid-cols-2 lg:grid-cols-4 transition-all duration-700 ease-out ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          {STATS.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} index={i} parentVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatItem({
  stat,
  index,
  parentVisible,
}: {
  stat: (typeof STATS)[number];
  index: number;
  parentVisible: boolean;
}) {
  const count = useCountUp(stat.value, parentVisible, 2000);

  return (
    <div
      className="group relative text-center transition-all duration-500"
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Accent top line */}
      <div className="mx-auto mb-6 h-px w-10 bg-[var(--color-secondary)] transition-all duration-500 group-hover:w-16" />

      <p className="font-serif text-5xl font-bold text-[var(--color-primary)] sm:text-6xl">
        {count}
        {stat.suffix && (
          <span className="text-[var(--color-secondary)]">{stat.suffix}</span>
        )}
      </p>
      <h3 className="mt-3 font-serif text-lg font-semibold text-[var(--color-primary)]">
        {stat.label}
      </h3>
      <p className="mt-1 text-sm text-manor-muted">{stat.description}</p>
    </div>
  );
}
