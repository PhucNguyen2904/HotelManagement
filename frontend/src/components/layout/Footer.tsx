import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Khách Sạn Ngân Hà
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Nghỉ dưỡng tuyệt vời tại đảo Quan Lạn, vịnh Bái Tử Long
            </p>
            <div className="mt-4 flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-600"
              >
                <span className="text-xl">📘</span>
              </a>
              <a
                href="https://zalo.me/0912326997"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-600"
              >
                <span className="text-xl">💬</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900">Loại phòng</h4>
            <ul className="mt-2 space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/rooms?type=doi-2-giuong" className="hover:text-primary-600">
                  Phòng Đôi 2 Giường
                </Link>
              </li>
              <li>
                <Link href="/rooms?type=don-view-bien" className="hover:text-primary-600">
                  Phòng Đơn View Biển
                </Link>
              </li>
              <li>
                <Link href="/rooms?type=vip" className="hover:text-primary-600">
                  Phòng VIP
                </Link>
              </li>
              <li>
                <Link href="/rooms?type=gia-dinh" className="hover:text-primary-600">
                  Phòng Gia Đình
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900">Hỗ trợ</h4>
            <ul className="mt-2 space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/about" className="hover:text-primary-600">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary-600">
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link href="/policy" className="hover:text-primary-600">
                  Chính sách đặt phòng
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary-600">
                  Điều khoản sử dụng
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900">Liên hệ</h4>
            <ul className="mt-2 space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <span className="mr-2">📞</span>
                <a href="tel:0912326997" className="hover:text-primary-600">
                  0912 326 997
                </a>
              </li>
              <li className="flex items-center">
                <span className="mr-2">✉️</span>
                <a
                  href="mailto:nganhahotelquanlan@gmail.com"
                  className="hover:text-primary-600"
                >
                  nganhahotelquanlan@gmail.com
                </a>
              </li>
              <li className="flex items-start">
                <span className="mr-2">📍</span>
                <span>Đảo Quan Lạn, Vân Đồn, Quảng Ninh</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">🕐</span>
                <span>Check-in: 13:00 • Check-out: 12:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
          <p>&copy; 2026 Khách Sạn Ngân Hà - Quan Lạn. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
