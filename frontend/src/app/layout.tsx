import type { Metadata } from 'next';
import { Cormorant_Garamond, Jost } from 'next/font/google';
import './globals.css';
import { Header, Footer } from '@/components/layout';

const jost = Jost({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-jost',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-cormorant',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Khách Sạn Ngân Hà - Quan Lạn, Vân Đồn, Quảng Ninh',
  description:
    'Khách sạn Ngân Hà tọa lạc tại đảo Quan Lạn, Vân Đồn, Quảng Ninh. Đặt phòng trực tuyến với giá tốt nhất, view biển tuyệt đẹp.',
  keywords: [
    'khách sạn quan lạn',
    'hotel quan lan',
    'ngân hà hotel',
    'vân đồn',
    'quảng ninh',
    'du lịch biển',
  ],
  openGraph: {
    title: 'Khách Sạn Ngân Hà - Quan Lạn, Quảng Ninh',
    description: 'Nghỉ dưỡng tuyệt vời tại đảo Quan Lạn với bãi biển trong xanh',
    locale: 'vi_VN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={`${jost.variable} ${cormorant.variable} bg-[var(--color-accent)] text-[var(--color-text)]`}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
