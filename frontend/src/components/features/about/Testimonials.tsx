'use client';

import { Star } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const TESTIMONIALS = [
  {
    name: 'Phạm Thị Lan Anh',
    location: 'Hà Nội',
    rating: 5,
    text: 'Lần đầu đến Quan Lạn và thật may mắn chọn Ngân Hà Hotel. Phòng sạch sẽ, view biển tuyệt đẹp, nhân viên cực kỳ thân thiện. Bữa sáng hải sản tươi ngon không thể nào quên. Chắc chắn sẽ quay lại!',
    date: 'Tháng 8, 2025',
  },
  {
    name: 'Trần Đức Huy',
    location: 'TP. Hồ Chí Minh',
    rating: 5,
    text: 'Đã ở nhiều khách sạn trên đảo nhưng Ngân Hà thực sự nổi bật. Kiến trúc đẹp, không gian yên tĩnh, đặc biệt đội ngũ hướng dẫn tour lặn biển rất chuyên nghiệp. Gia đình tôi rất hài lòng.',
    date: 'Tháng 6, 2025',
  },
  {
    name: 'Nguyễn Minh Châu',
    location: 'Đà Nẵng',
    rating: 5,
    text: 'Một kỳ nghỉ hoàn hảo cho cặp đôi! Phòng VIP đẹp lung linh, ban công nhìn thẳng ra biển. Dịch vụ BBQ hải sản trên bãi biển buổi tối là điểm nhấn tuyệt vời. Cảm ơn Ngân Hà rất nhiều!',
    date: 'Tháng 7, 2025',
  },
] as const;

export function Testimonials() {
  const [refHeading, isHeadingVisible] = useScrollAnimation();

  return (
    <section id="about-testimonials" className="relative overflow-hidden py-20 sm:py-28 lg:py-32">
      {/* Decorative */}
      <div className="absolute right-0 top-1/3 h-72 w-72 rounded-full bg-[var(--color-secondary)]/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div
          ref={refHeading}
          className={`mx-auto mb-14 max-w-2xl text-center transition-all duration-700 ease-out ${
            isHeadingVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <span className="inline-block h-px w-12 bg-[var(--color-secondary)]" />
          <p className="mt-3 font-serif text-sm tracking-[0.25em] uppercase text-[var(--color-secondary)]">
            Khách Hàng Nói Gì
          </p>
          <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
            Cảm Nhận Từ <span className="italic text-[var(--color-secondary)]">Du Khách</span>
          </h2>
        </div>

        {/* Testimonial cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial, index) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: (typeof TESTIMONIALS)[number];
  index: number;
}) {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`relative rounded-2xl border border-manor-outline/30 bg-white p-8 transition-all duration-700 ease-out hover:-translate-y-1 hover:shadow-lg ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Decorative quote mark */}
      <span className="absolute -top-3 left-6 font-serif text-6xl leading-none text-[var(--color-secondary)]/20">
        &ldquo;
      </span>

      {/* Stars */}
      <div className="flex gap-1">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star
            key={i}
            className="h-4 w-4 fill-[var(--color-secondary)] text-[var(--color-secondary)]"
          />
        ))}
      </div>

      {/* Quote */}
      <p className="mt-5 text-sm leading-relaxed text-manor-muted">
        &ldquo;{testimonial.text}&rdquo;
      </p>

      {/* Author */}
      <div className="mt-6 flex items-center gap-3 border-t border-manor-outline/20 pt-5">
        {/* Initials avatar */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)]">
          <span className="font-serif text-sm font-bold text-[var(--color-secondary)]">
            {testimonial.name
              .split(' ')
              .map((w) => w[0])
              .join('')
              .slice(-2)}
          </span>
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--color-primary)]">{testimonial.name}</p>
          <p className="text-xs text-manor-muted">
            {testimonial.location} • {testimonial.date}
          </p>
        </div>
      </div>
    </div>
  );
}
