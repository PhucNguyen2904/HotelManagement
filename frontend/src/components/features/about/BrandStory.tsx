'use client';

import Image from 'next/image';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export function BrandStory() {
  const [refIntro, isIntroVisible] = useScrollAnimation();
  const [refImage, isImageVisible] = useScrollAnimation();
  const [refPhilosophy, isPhilosophyVisible] = useScrollAnimation();

  return (
    <section id="about-story" className="relative overflow-hidden py-20 sm:py-28 lg:py-32">
      {/* Decorative accent */}
      <div className="absolute -right-40 top-0 h-80 w-80 rounded-full bg-[var(--color-secondary)]/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div
          ref={refIntro}
          className={`mx-auto max-w-2xl text-center transition-all duration-700 ease-out ${
            isIntroVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <span className="inline-block h-px w-12 bg-[var(--color-secondary)]" />
          <p className="mt-3 font-serif text-sm tracking-[0.25em] uppercase text-[var(--color-secondary)]">
            Câu Chuyện Của Chúng Tôi
          </p>
          <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
            Từ Giấc Mơ Biển Xanh <br className="hidden sm:block" /> Đến Ngôi Nhà Bên Sóng
          </h2>
        </div>

        {/* Two-column: image + story */}
        <div className="mt-16 grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left — Image */}
          <div
            ref={refImage}
            className={`relative transition-all duration-700 delay-200 ease-out ${
              isImageVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
            }`}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <Image
                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=960&q=80"
                alt="Phòng nghỉ view biển tại Khách Sạn Ngân Hà"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {/* Float badge */}
            <div className="absolute -bottom-6 -right-4 rounded-xl bg-[var(--color-primary)] px-8 py-5 text-center shadow-xl sm:-right-8">
              <p className="font-serif text-3xl font-bold text-[var(--color-secondary)]">2015</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-white/70">Thành Lập</p>
            </div>
          </div>

          {/* Right — Text */}
          <div
            ref={refPhilosophy}
            className={`transition-all duration-700 delay-300 ease-out ${
              isPhilosophyVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
            }`}
          >
            <h3 className="font-serif text-2xl font-semibold sm:text-3xl">
              Lịch Sử & Cảm Hứng
            </h3>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-manor-muted">
              <p>
                Khách Sạn Ngân Hà ra đời từ tình yêu dành cho vùng biển Quan Lạn — hòn đảo thanh
                bình nằm giữa vịnh Bái Tử Long, Quảng Ninh. Năm 2015, những viên gạch đầu tiên
                được đặt xuống với ước mơ giản dị: tạo nên một &ldquo;ngôi nhà thứ hai&rdquo; cho
                du khách, nơi họ có thể tìm thấy sự tĩnh lặng giữa nhịp sống hối hả.
              </p>
              <p>
                Lấy cảm hứng từ kiến trúc ven biển Đông Dương pha trộn nét hiện đại, mỗi
                không gian được thiết kế mở tối đa để đón ánh sáng tự nhiên và gió biển mát rượi.
                Gam màu cát ấm — xanh biển sâu xuyên suốt từ sảnh đón đến từng phòng nghỉ,
                tạo cảm giác hòa mình vào thiên nhiên ngay từ bước chân đầu tiên.
              </p>
              <p>
                Triết lý phục vụ của chúng tôi gói gọn trong ba chữ:{' '}
                <strong className="text-[var(--color-primary)]">Chân Thành — Tỉ Mỉ — Gần Gũi</strong>.
                Đội ngũ nhân viên người địa phương am hiểu sâu sắc văn hóa vùng đảo, luôn sẵn
                lòng chia sẻ những trải nghiệm chân thực nhất, từ tour lặn biển đến bữa hải sản
                nướng dưới ánh hoàng hôn.
              </p>
            </div>

            {/* Signature-style quote */}
            <blockquote className="mt-8 border-l-2 border-[var(--color-secondary)] pl-6">
              <p className="font-serif text-lg italic text-[var(--color-primary)]">
                &ldquo;Chúng tôi không chỉ xây khách sạn — chúng tôi kiến tạo những kỷ niệm
                bên bờ biển.&rdquo;
              </p>
              <cite className="mt-3 block text-sm not-italic text-manor-muted">
                — Ban sáng lập Ngân Hà Hotel
              </cite>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
