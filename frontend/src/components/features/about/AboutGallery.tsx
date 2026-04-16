'use client';

import Image from 'next/image';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const GALLERY_IMAGES = [
  {
    src: '/images/z7726945558289_3e231f82d6b6cb36df9c5df617fbcf61.jpg',
    alt: 'Sảnh sự kiện sang trọng',
    span: 'col-span-1 row-span-1 lg:col-span-1 lg:row-span-2',
  },
  {
    src: '/images/z7726945569606_2404721d553f2c2a8dbeaec5ffac7513.jpg',
    alt: 'Hành lang và cầu thang khách sạn',
    span: 'col-span-1 row-span-1 lg:col-span-2 lg:row-span-1',
  },
  {
    src: '/images/z7726945595296_e2df4d8b37eb07709f28a4501921925c.jpg',
    alt: 'Tổ chức sự kiện chuyên nghiệp',
    span: 'col-span-1 row-span-1 lg:col-span-1 lg:row-span-1',
  },
  {
    src: '/images/art1.jpg',
    alt: 'Bãi biển xanh trong tại Quan Lạn',
    span: 'col-span-1 row-span-1 lg:col-span-1 lg:row-span-1',
  },
  {
    src: '/images/art2.jpg',
    alt: 'Bãi cát trắng và biển lặng',
    span: 'col-span-1 row-span-1 lg:col-span-1 lg:row-span-1',
  },
  {
    src: '/images/art3.jpg',
    alt: 'Eo gió ở biển Quan Lạn',
    span: 'col-span-1 row-span-1 lg:col-span-2 lg:row-span-1',
  },
] as const;

export function AboutGallery() {
  const [refHeading, isHeadingVisible] = useScrollAnimation();

  return (
    <section id="about-gallery" className="py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div
          ref={refHeading}
          className={`mx-auto mb-14 max-w-2xl text-center transition-all duration-700 ease-out ${
            isHeadingVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <span className="inline-block h-px w-12 bg-[var(--color-secondary)]" />
          <p className="mt-3 font-serif text-sm tracking-[0.25em] uppercase text-[var(--color-secondary)]">
            Khám Phá
          </p>
          <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
            Không Gian <span className="italic text-[var(--color-secondary)]">Ngân Hà</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid auto-rows-[220px] grid-cols-1 gap-4 sm:grid-cols-2 lg:auto-rows-[260px] lg:grid-cols-3">
          {GALLERY_IMAGES.map((img, index) => (
            <GalleryItem key={img.alt} image={img} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryItem({
  image,
  index,
}: {
  image: (typeof GALLERY_IMAGES)[number];
  index: number;
}) {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`${image.span} group relative overflow-hidden rounded-xl transition-all duration-700 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        quality={100}
        priority={index < 3}
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[rgba(27,58,75,0.65)] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <p className="p-5 font-serif text-base text-white">{image.alt}</p>
      </div>
    </div>
  );
}
