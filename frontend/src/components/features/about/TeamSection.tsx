'use client';

import Image from 'next/image';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';



export function TeamSection() {
  const [refHeading, isHeadingVisible] = useScrollAnimation();

  return (
    <section
      id="about-team"
      className="relative overflow-hidden bg-[var(--color-surface)] py-20 sm:py-28 lg:py-32"
    >
      {/* Decorative */}
      <div className="absolute -left-32 top-20 h-64 w-64 rounded-full bg-[var(--color-secondary)]/5 blur-3xl" />

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
            Con Người
          </p>
          <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
            Đội Ngũ <span className="italic text-[var(--color-secondary)]">Tận Tâm</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-manor-muted">
            Những con người đứng sau mỗi nụ cười đón chào và từng trải nghiệm hoàn hảo tại Ngân Hà Hotel.
          </p>
        </div>

        {/* Team content */}
        <div className="prose prose-sm sm:prose-base mx-auto max-w-3xl rounded-2xl bg-white p-8 sm:p-12 editorial-shadow">
          <p className="text-base leading-relaxed text-manor-muted sm:text-lg">
            Tại Ngân Hà Hotel, chúng tôi tin rằng sự xuất sắc bắt nguồn từ những con người nhiệt huyết và tận tâm. Đội ngũ chúng tôi gồm các chuyên gia lâu năm trong lĩnh vực quản lý khách sạn, dịch vụ khách hàng và ẩm thực. Mỗi thành viên đều được huấn luyện kỹ lưỡng để đảm bảo rằng mỗi khách hàng đều được đón tiếp một cách ấm áp và chuyên nghiệp.
          </p>
          <p className="mt-6 text-base leading-relaxed text-manor-muted sm:text-lg">
            Chúng tôi cam kết phục vụ với <span className="font-semibold">chính tâm</span>, <span className="font-semibold">tôn trọng</span> và <span className="font-semibold">chất lượng</span>. Những giá trị này là nền tảng của mọi quyết định và hành động mà chúng tôi thực hiện hàng ngày để mang đến cho quý khách một trải nghiệm đáng nhớ tại Ngân Hà Hotel.
          </p>
        </div>
      </div>
    </section>
  );
}

function TeamCard({
  member,
  index,
}: {
  member: (typeof TEAM_MEMBERS)[number];
  index: number;
}) {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`group overflow-hidden rounded-2xl bg-white editorial-shadow transition-all duration-700 ease-out hover:-translate-y-1 hover:shadow-xl ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Photo */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Gradient overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[rgba(27,58,75,0.75)] to-transparent" />
        {/* Name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="font-serif text-2xl font-semibold text-white">{member.name}</h3>
          <p className="mt-1 text-sm uppercase tracking-widest text-[var(--color-secondary)]">
            {member.role}
          </p>
        </div>
      </div>
      {/* Bio */}
      <div className="p-6">
        <p className="text-sm leading-relaxed text-manor-muted">{member.bio}</p>
      </div>
    </div>
  );
}
