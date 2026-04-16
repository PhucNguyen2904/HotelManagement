import type { Metadata } from 'next';

import {
  HeroAbout,
  BrandStory,
  MissionValues,
  KeyStats,
  AboutGallery,
  TeamSection,
  Testimonials,
  CtaSection,
} from '@/components/features/about';

export const metadata: Metadata = {
  title: 'Giới Thiệu — Khách Sạn Ngân Hà | Quan Lạn, Quảng Ninh',
  description:
    'Tìm hiểu câu chuyện thương hiệu Khách Sạn Ngân Hà — từ giấc mơ bên bờ biển Quan Lạn đến điểm đến nghỉ dưỡng hàng đầu Vịnh Bái Tử Long, Quảng Ninh.',
  openGraph: {
    title: 'Giới Thiệu — Khách Sạn Ngân Hà',
    description:
      'Khám phá câu chuyện, sứ mệnh và đội ngũ đứng sau Khách Sạn Ngân Hà tại đảo Quan Lạn.',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Khách Sạn Ngân Hà — Quan Lạn',
      },
    ],
  },
};

export default function AboutPage() {
  return (
    <>
      <HeroAbout />
      <BrandStory />
      <MissionValues />
      <KeyStats />
      <AboutGallery />
      <TeamSection />
      <Testimonials />
      <CtaSection />
    </>
  );
}
