import type { Metadata } from 'next';
import {
  ContactHero,
  ContactInfo,
  ContactForm,
  ContactMap,
  HotlineSection,
  SocialLinks,
  DirectionsTips,
} from '@/components/contact';

export const metadata: Metadata = {
  title: 'Liên Hệ — Khách Sạn Ngân Hà | Quan Lạn, Quảng Ninh',
  description:
    'Liên hệ Khách Sạn Ngân Hà để đặt phòng, hỏi đáp, hoặc gửi phản hồi. Hotline 0912 326 997. Email: nganhahotelquanlan@gmail.com. Địa chỉ: Đảo Quan Lạn, Vân Đồn, Quảng Ninh.',
  openGraph: {
    title: 'Liên Hệ — Khách Sạn Ngân Hà',
    description:
      'Liên hệ ngay với Khách Sạn Ngân Hà. Chúng tôi sẵn sàng hỗ trợ bạn 24/7.',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1595933707802-6b2be8b81e41?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Liên Hệ Khách Sạn Ngân Hà',
      },
    ],
  },
};

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactInfo />
      <ContactForm />
      <ContactMap />
      <HotlineSection />
      <DirectionsTips />
      <SocialLinks />
    </>
  );
}

