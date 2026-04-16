'use client';

import { Heart, Shield, Leaf, Sparkles } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const VALUES = [
  {
    icon: Heart,
    title: 'Chân Thành Phục Vụ',
    description:
      'Mỗi nụ cười, mỗi cử chỉ đều xuất phát từ sự chân thành. Chúng tôi lắng nghe và thấu hiểu để mang đến trải nghiệm cá nhân hóa cho từng vị khách.',
  },
  {
    icon: Shield,
    title: 'Chất Lượng Nhất Quán',
    description:
      'Từ ga giường mềm mịn đến bữa sáng đậm vị biển đảo — mọi chi tiết đều được chăm chút với tiêu chuẩn cao nhất, không có ngoại lệ.',
  },
  {
    icon: Leaf,
    title: 'Bền Vững & Trách Nhiệm',
    description:
      'Bảo vệ hệ sinh thái biển đảo Quan Lạn là cam kết lâu dài. Chúng tôi ưu tiên vật liệu thân thiện môi trường và hợp tác với cộng đồng địa phương.',
  },
  {
    icon: Sparkles,
    title: 'Trải Nghiệm Khác Biệt',
    description:
      'Không chỉ là nơi lưu trú — Ngân Hà Hotel là cánh cửa mở ra thế giới biển đảo hoang sơ, ẩm thực đặc sản và văn hóa Vịnh Bái Tử Long.',
  },
] as const;

export function MissionValues() {
  const [refHeading, isHeadingVisible] = useScrollAnimation();

  return (
    <section
      id="about-values"
      className="relative overflow-hidden bg-[var(--color-primary)] py-20 sm:py-28 lg:py-32"
    >
      {/* Decorative elements */}
      <div className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-black/10 to-transparent" />
      <div className="absolute -top-20 right-20 h-60 w-60 rounded-full bg-[var(--color-secondary)]/10 blur-3xl" />
      <div className="absolute -bottom-20 left-20 h-48 w-48 rounded-full bg-[var(--color-secondary)]/5 blur-2xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div
          ref={refHeading}
          className={`mx-auto max-w-2xl text-center transition-all duration-700 ease-out ${
            isHeadingVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <span className="inline-block h-px w-12 bg-[var(--color-secondary)]" />
          <p className="mt-3 font-serif text-sm tracking-[0.25em] uppercase text-[var(--color-secondary)]">
            Sứ Mệnh & Giá Trị
          </p>
          <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
            Những Giá Trị <span className="italic text-[var(--color-secondary)]">Cốt Lõi</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-white/60 sm:text-lg">
            Sứ mệnh của chúng tôi là kiến tạo không gian nghỉ dưỡng đẳng cấp, nơi thiên nhiên và
            sự hiếu khách hòa quyện, để mỗi du khách đều mang về ký ức vô giá.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value, index) => (
            <ValueCard key={value.title} value={value} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ValueCard({
  value,
  index,
}: {
  value: (typeof VALUES)[number];
  index: number;
}) {
  const [ref, isVisible] = useScrollAnimation();
  const Icon = value.icon;

  return (
    <div
      ref={ref}
      className={`group rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-700 ease-out hover:border-[var(--color-secondary)]/30 hover:bg-white/10 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--color-secondary)]/15 transition-colors duration-300 group-hover:bg-[var(--color-secondary)]/25">
        <Icon className="h-7 w-7 text-[var(--color-secondary)]" strokeWidth={1.5} />
      </div>
      <h3 className="mt-6 font-serif text-xl font-semibold text-white">{value.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-white/60">{value.description}</p>
    </div>
  );
}
