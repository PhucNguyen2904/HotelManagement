import Link from 'next/link';

const IconFacebook = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const IconZalo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const IconPhone = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.77 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.68 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const IconEmail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const IconLocation = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const IconClock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

export function Footer() {
  return (
    <footer className="border-t border-[#F2EFE9]/10 bg-[#1B3A4B]">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold text-[#F2EFE9]">
              Khách Sạn Ngân Hà
            </h3>
            <p className="mt-2 text-sm text-[#F2EFE9]/70">
              Nghỉ dưỡng tuyệt vời tại đảo Quan Lạn, vịnh Bái Tử Long
            </p>
            <div className="mt-4 flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F2EFE9]/70 hover:text-[#C9A96E]"
              >
                <IconFacebook />
              </a>
              <a
                href="https://zalo.me/0912326997"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F2EFE9]/70 hover:text-[#C9A96E]"
              >
                <IconZalo />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-[#F2EFE9]">Loại phòng</h4>
            <ul className="mt-2 space-y-2 text-sm text-[#F2EFE9]/70">
              <li>
                <Link href="/rooms?type=doi-2-giuong" className="hover:text-[#C9A96E]">
                  Phòng Đôi 2 Giường
                </Link>
              </li>
              <li>
                <Link href="/rooms?type=don-view-bien" className="hover:text-[#C9A96E]">
                  Phòng Đơn View Biển
                </Link>
              </li>
              <li>
                <Link href="/rooms?type=vip" className="hover:text-[#C9A96E]">
                  Phòng VIP
                </Link>
              </li>
              <li>
                <Link href="/rooms?type=gia-dinh" className="hover:text-[#C9A96E]">
                  Phòng Gia Đình
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-[#F2EFE9]">Hỗ trợ</h4>
            <ul className="mt-2 space-y-2 text-sm text-[#F2EFE9]/70">
              <li>
                <Link href="/about" className="hover:text-[#C9A96E]">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#C9A96E]">
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link href="/policy" className="hover:text-[#C9A96E]">
                  Chính sách đặt phòng
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#C9A96E]">
                  Điều khoản sử dụng
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-[#F2EFE9]">Liên hệ</h4>
            <ul className="mt-2 space-y-2 text-sm text-[#F2EFE9]/70">
              <li className="flex items-center">
                <span className="mr-3 mt-0.5 text-[#C9A96E]"><IconPhone /></span>
                <a href="tel:0912326997" className="hover:text-[#C9A96E]">
                  0912 326 997
                </a>
              </li>
              <li className="flex items-center">
                <span className="mr-3 mt-0.5 text-[#C9A96E]"><IconEmail /></span>
                <a
                  href="mailto:nganhahotelquanlan@gmail.com"
                  className="hover:text-[#C9A96E]"
                >
                  nganhahotelquanlan@gmail.com
                </a>
              </li>
              <li className="flex items-start">
                <span className="mr-3 mt-0.5 text-[#C9A96E]"><IconLocation /></span>
                <span>Đảo Quan Lạn, Vân Đồn, Quảng Ninh</span>
              </li>
              <li className="flex items-center">
                <span className="mr-3 mt-0.5 text-[#C9A96E]"><IconClock /></span>
                <span>Check-in: 13:00 • Check-out: 12:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-[#F2EFE9]/10 pt-8 text-center text-sm text-[#F2EFE9]/50">
          <p>&copy; 2026 Khách Sạn Ngân Hà - Quan Lạn. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
