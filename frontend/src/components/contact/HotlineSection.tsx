import { Phone, MessageCircle } from 'lucide-react';

export function HotlineSection() {
  return (
    <section className="bg-[var(--color-primary)] py-16 sm:py-20 text-white">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="mb-2 text-3xl font-semibold sm:text-4xl">
            Cần hỗ trợ ngay?
          </h2>
          <p className="mb-8 text-lg text-white/80">
            Gọi hotline hoặc nhắn tin Zalo cho chúng tôi bất cứ lúc nào
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <a
              href="tel:0912326997"
              className="inline-flex items-center justify-center gap-3 rounded-lg bg-[var(--color-secondary)] px-8 py-4 font-semibold text-[var(--color-primary)] transition-all hover:scale-105 hover:shadow-lg"
            >
              <Phone size={24} />
              <span>Gọi: 0912 326 997</span>
            </a>

            <a
              href="https://zalo.me/0912326997"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 rounded-lg border-2 border-[var(--color-secondary)] px-8 py-4 font-semibold transition-all hover:bg-white/10 hover:scale-105"
            >
              <MessageCircle size={24} />
              <span>Nhắn Zalo</span>
            </a>
          </div>

          <p className="mt-8 text-sm text-white/70">
            ⏱️ Trả lời trong 2 giờ • Thứ Hai - Chủ Nhật, 8:00 - 22:00
          </p>
        </div>
      </div>
    </section>
  );
}
