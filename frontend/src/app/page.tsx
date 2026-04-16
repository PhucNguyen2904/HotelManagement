import Link from 'next/link';
import { HeroSection, AboutSection, RoomGallerySection } from '@/components/features/home';

// Remove unused import warning
void Link;

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
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Tại sao chọn Ngân Hà Hotel?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏝️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Vị trí tuyệt đẹp</h3>
              <p className="text-gray-600">
                Nằm trên đảo Quan Lạn, vịnh Bái Tử Long với bãi biển hoang sơ
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌅</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">View biển tuyệt đẹp</h3>
              <p className="text-gray-600">
                Phòng nghỉ view biển, ngắm bình minh và hoàng hôn tuyệt vời
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Phòng sạch đẹp</h3>
              <p className="text-gray-600">
                40 phòng nghỉ tiện nghi, điều hòa, WiFi, minibar đầy đủ
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Giá tốt nhất</h3>
              <p className="text-gray-600">
                Cam kết giá tốt nhất khi đặt trực tiếp, từ 400,000đ/đêm
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Vị Trí & Liên Hệ</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-2xl mr-4">📍</span>
                  <div>
                    <h4 className="font-semibold">Địa chỉ</h4>
                    <p className="text-gray-600">
                      Đảo Quan Lạn, Huyện Vân Đồn, Tỉnh Quảng Ninh
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-2xl mr-4">📞</span>
                  <div>
                    <h4 className="font-semibold">Hotline</h4>
                    <p className="text-gray-600">
                      <a href="tel:0912326997" className="text-primary-600 hover:underline">
                        0912 326 997
                      </a>
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-2xl mr-4">✉️</span>
                  <div>
                    <h4 className="font-semibold">Email</h4>
                    <p className="text-gray-600">
                      <a
                        href="mailto:nganhahotelquanlan@gmail.com"
                        className="text-primary-600 hover:underline"
                      >
                        nganhahotelquanlan@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-2xl mr-4">🕐</span>
                  <div>
                    <h4 className="font-semibold">Giờ nhận/trả phòng</h4>
                    <p className="text-gray-600">
                      Check-in: 13:00 • Check-out: 12:00
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg h-80 overflow-hidden">
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
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Đặt phòng ngay hôm nay</h2>
          <p className="text-xl mb-2 text-primary-100">
            Sử dụng mã <span className="font-bold text-white">WELCOME10</span> giảm ngay 10%
          </p>
          <p className="text-lg mb-8 text-primary-200">
            Áp dụng cho khách hàng đặt phòng lần đầu
          </p>
          <Link
            href="/rooms"
            className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Tìm phòng ngay
          </Link>
        </div>
      </section>
    </div>
  );
}
