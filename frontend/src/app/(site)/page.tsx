import Link from 'next/link';
import {
  HeroSection,
  AboutSection,
  RoomGallerySection,
} from '@/components/features/home';
import { MapPin, Waves, BedDouble, BadgeCheck } from 'lucide-react';

// Remove unused import warning
void Link;

const IconPhone = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#1B3A4B"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.77 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.68 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const IconEmail = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#1B3A4B"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const IconLocation = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#1B3A4B"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconClock = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#1B3A4B"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* About Section */}
      <AboutSection />

      {/* Room Gallery Section */}
      <RoomGallerySection />

      {/* Features Section */}
      <section className="bg-white py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-semibold text-[var(--color-primary)]">
            Tại sao chọn Ngân Hà Hotel?
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="rounded-xl border border-[#EAE6DF] bg-white p-6 text-center transition-all duration-200 hover:border-[var(--color-secondary)] hover:shadow-[0_4px_20px_rgba(27,58,75,0.1)]">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[rgba(201,169,110,0.1)]">
                <MapPin size={48} strokeWidth={1.5} color="#C9A96E" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-[#1B3A4B]">
                Vị trí tuyệt đẹp
              </h3>
              <p className="text-sm text-[#6B7280]">
                Nằm trên đảo Quan Lạn, vịnh Bái Tử Long với bãi biển hoang sơ
              </p>
            </div>
            <div className="rounded-xl border border-[#EAE6DF] bg-white p-6 text-center transition-all duration-200 hover:border-[var(--color-secondary)] hover:shadow-[0_4px_20px_rgba(27,58,75,0.1)]">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[rgba(201,169,110,0.1)]">
                <Waves size={48} strokeWidth={1.5} color="#C9A96E" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-[#1B3A4B]">
                View biển tuyệt đẹp
              </h3>
              <p className="text-sm text-[#6B7280]">
                Phòng nghỉ view biển, ngắm bình minh và hoàng hôn tuyệt vời
              </p>
            </div>
            <div className="rounded-xl border border-[#EAE6DF] bg-white p-6 text-center transition-all duration-200 hover:border-[var(--color-secondary)] hover:shadow-[0_4px_20px_rgba(27,58,75,0.1)]">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[rgba(201,169,110,0.1)]">
                <BedDouble size={48} strokeWidth={1.5} color="#C9A96E" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-[#1B3A4B]">
                Phòng sạch đẹp
              </h3>
              <p className="text-sm text-[#6B7280]">
                Phòng nghỉ tiện nghi, điều hòa, WiFi, minibar đầy đủ
              </p>
            </div>
            <div className="rounded-xl border border-[#EAE6DF] bg-white p-6 text-center transition-all duration-200 hover:border-[var(--color-secondary)] hover:shadow-[0_4px_20px_rgba(27,58,75,0.1)]">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[rgba(201,169,110,0.1)]">
                <BadgeCheck size={48} strokeWidth={1.5} color="#C9A96E" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-[#1B3A4B]">
                Giá tốt nhất
              </h3>
              <p className="text-sm text-[#6B7280]">
                Cam kết giá tốt nhất khi đặt trực tiếp, từ 400,000đ/đêm
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="bg-[var(--color-accent)] py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-semibold text-[var(--color-primary)]">
                Vị Trí & Liên Hệ
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="mr-4 mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C9A96E]/15">
                    <IconLocation />
                  </span>
                  <div>
                    <h4 className="font-semibold">Địa chỉ</h4>
                    <p className="text-[var(--color-text)]/80">
                      Đảo Quan Lạn, Huyện Vân Đồn, Tỉnh Quảng Ninh
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="mr-4 mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C9A96E]/15">
                    <IconPhone />
                  </span>
                  <div>
                    <h4 className="font-semibold">Hotline</h4>
                    <p className="text-[var(--color-text)]/80">
                      <a
                        href="tel:0912326997"
                        className="text-[var(--color-secondary)] hover:underline"
                      >
                        0912 326 997
                      </a>
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="mr-4 mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C9A96E]/15">
                    <IconEmail />
                  </span>
                  <div>
                    <h4 className="font-semibold">Email</h4>
                    <p className="text-[var(--color-text)]/80">
                      <a
                        href="mailto:nganhahotelquanlan@gmail.com"
                        className="text-[var(--color-secondary)] hover:underline"
                      >
                        nganhahotelquanlan@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="mr-4 mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C9A96E]/15">
                    <IconClock />
                  </span>
                  <div>
                    <h4 className="font-semibold">Giờ nhận/trả phòng</h4>
                    <p className="text-[var(--color-text)]/80">
                      Check-in: 13:00 • Check-out: 12:00
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-80 overflow-hidden rounded border border-[var(--color-secondary)]/25 bg-[var(--color-surface)]">
              <iframe
                src="https://www.google.com/maps?q=Quan+L%E1%BA%A1n,+V%C3%A2n+%C4%90%E1%BB%93n,+Qu%E1%BA%A3ng+Ninh&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Bản đồ Quan Lạn"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-24 text-[var(--color-primary)]">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Left: Content */}
            <div>
              <h2 className="mb-6 text-4xl font-semibold leading-tight text-[var(--color-primary)]">
                Cần tư vấn về kỳ nghỉ của bạn?
              </h2>
              <p className="mb-6 text-lg text-[var(--color-primary)]/80">
                Đội ngũ chuyên gia của chúng tôi sẵn sàng giúp bạn lên kế hoạch
                cho kỳ nghỉ hoàn hảo tại Ngân Hà Hotel. Chúng tôi sẽ tư vấn chi
                tiết về các phòng, dịch vụ và hoạt động phù hợp nhất với nhu cầu
                của bạn.
              </p>

              <div className="mb-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-secondary)]">
                    <span className="font-semibold text-white">✓</span>
                  </div>
                  <span className="text-[var(--color-primary)]">
                    Tư vấn phòng phù hợp với ngân sách
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-secondary)]">
                    <span className="font-semibold text-white">✓</span>
                  </div>
                  <span className="text-[var(--color-primary)]">
                    Gợi ý các hoạt động và dịch vụ đặc biệt
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-secondary)]">
                    <span className="font-semibold text-white">✓</span>
                  </div>
                  <span className="text-[var(--color-primary)]">
                    Hỗ trợ sắp xếp từ lúc booking đến check-in
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Contact Options */}
            <div className="space-y-4">
              <a
                href="tel:0912326997"
                className="flex items-center gap-4 rounded-xl border border-[var(--color-secondary)]/30 bg-[var(--color-secondary)]/15 p-5 transition-all hover:bg-[var(--color-secondary)]/25"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-secondary)]">
                  <IconPhone />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-[var(--color-secondary)]">
                    Gọi ngay
                  </p>
                  <p className="text-lg font-bold text-[var(--color-primary)]">
                    0912 326 997
                  </p>
                </div>
              </a>

              <a
                href="mailto:nganhahotelquanlan@gmail.com"
                className="flex items-center gap-4 rounded-xl border border-[var(--color-secondary)]/30 bg-[var(--color-secondary)]/15 p-5 transition-all hover:bg-[var(--color-secondary)]/25"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-secondary)]">
                  <IconEmail />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-[var(--color-secondary)]">
                    Gửi email
                  </p>
                  <p className="truncate text-lg font-bold text-[var(--color-primary)]">
                    nganhahotelquanlan@gmail.com
                  </p>
                </div>
              </a>

              <Link
                href="/contact"
                className="flex items-center justify-center gap-3 rounded-xl bg-[var(--color-secondary)] px-8 py-4 font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
              >
                <span>Liên hệ qua form</span>
                <span>→</span>
              </Link>

              <p className="pt-4 text-center text-sm text-[var(--color-primary)]/60">
                Chúng tôi trả lời trong vòng 2 giờ trong giờ làm việc
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

