import type { Metadata } from 'next';
import { HelpCircle, ChevronDown, Search, Info, CreditCard, Calendar, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Câu Hỏi Thường Gặp — Khách Sạn Ngân Hà | Quan Lạn',
  description: 'Giải đáp các thắc mắc phổ biến về đặt phòng, dịch vụ, chính sách và hướng dẫn tại Khách Sạn Ngân Hà, đảo Quan Lạn, Quảng Ninh.',
};

const faqs = [
  {
    category: 'Đặt phòng & Thanh toán',
    icon: <CreditCard className="w-5 h-5" />,
    items: [
      {
        question: 'Làm thế nào để đặt phòng trực tuyến?',
        answer: 'Bạn có thể đặt phòng trực tiếp trên website của chúng tôi bằng cách chọn phòng, nhập thông tin cá nhân và thời gian lưu trú. Sau khi hoàn tất, bạn sẽ nhận được email xác nhận tự động.'
      },
      {
        question: 'Tôi có thể thanh toán bằng những hình thức nào?',
        answer: 'Chúng tôi chấp nhận thanh toán qua chuyển khoản ngân hàng, thẻ tín dụng (Visa, Mastercard) và các ví điện tử phổ biến (Momo, VNPay). Bạn cũng có thể thanh toán tiền mặt tại quầy lễ tân.'
      },
      {
        question: 'Chính sách hoàn hủy phòng như thế nào?',
        answer: 'Hủy phòng trước 7 ngày so với ngày check-in sẽ được hoàn 100% tiền cọc. Hủy từ 3-7 ngày sẽ được hoàn 50%. Hủy dưới 3 ngày sẽ không được hoàn cọc.'
      }
    ]
  },
  {
    category: 'Dịch vụ & Tiện ích',
    icon: <ShieldCheck className="w-5 h-5" />,
    items: [
      {
        question: 'Khách sạn có cung cấp dịch vụ đưa đón không?',
        answer: 'Có, chúng tôi có dịch vụ xe điện đưa đón khách từ cảng Quan Lạn về khách sạn. Vui lòng thông báo giờ tàu cập cảng để chúng tôi sắp xếp chu đáo.'
      },
      {
        question: 'Khách sạn có phục vụ ăn sáng không?',
        answer: 'Bữa sáng được phục vụ miễn phí cho khách lưu trú tại nhà hàng của khách sạn từ 6:30 đến 9:00 hàng ngày.'
      },
      {
        question: 'Tôi có thể mang thú cưng vào khách sạn không?',
        answer: 'Rất tiếc, nhằm đảm bảo vệ sinh và trải nghiệm của tất cả khách hàng, chúng tôi hiện chưa hỗ trợ mang theo thú cưng.'
      }
    ]
  },
  {
    category: 'Thông tin chung',
    icon: <Info className="w-5 h-5" />,
    items: [
      {
        question: 'Giờ nhận và trả phòng là khi nào?',
        answer: 'Giờ nhận phòng (Check-in) là 14:00 và giờ trả phòng (Check-out) là 12:00. Nếu có phòng trống, chúng tôi sẽ hỗ trợ nhận phòng sớm mà không tính thêm phí.'
      },
      {
        question: 'Khách sạn có gần biển không?',
        answer: 'Khách sạn Ngân Hà chỉ cách bãi tắm Quan Lạn khoảng 300m, rất thuận tiện để đi bộ ra biển.'
      }
    ]
  }
];

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-[#1B3A4B]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>
        <div className="container relative mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center p-2 mb-4 rounded-full bg-[#C9A96E]/20 backdrop-blur-sm border border-[#C9A96E]/30">
            <HelpCircle className="w-5 h-5 text-[#C9A96E] mr-2" />
            <span className="text-[#C9A96E] text-sm font-medium uppercase tracking-wider">Hỗ trợ khách hàng</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#F2EFE9] mb-6">
            Câu hỏi thường gặp
          </h1>
          <p className="max-w-2xl mx-auto text-[#F2EFE9]/80 text-lg">
            Tìm kiếm câu trả lời nhanh chóng cho các thắc mắc của bạn về trải nghiệm nghỉ dưỡng tại Khách Sạn Ngân Hà.
          </p>
        </div>
      </section>

      {/* Search Bar - Visual only for now as requested quick fix */}
      <section className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C9A96E] transition-colors" />
            <input 
              type="text" 
              placeholder="Tìm kiếm câu hỏi của bạn..." 
              className="w-full pl-12 pr-4 py-5 rounded-2xl shadow-xl border-none focus:ring-2 focus:ring-[#C9A96E] bg-white text-gray-800 text-lg transition-all"
            />
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          {faqs.map((category, idx) => (
            <div key={idx} className="space-y-6">
              <div className="flex items-center space-x-3 mb-8">
                <div className="p-2 rounded-lg bg-[#1B3A4B] text-[#C9A96E]">
                  {category.icon}
                </div>
                <h2 className="text-2xl font-bold text-[#1B3A4B]">{category.category}</h2>
              </div>
              
              <div className="grid gap-4">
                {category.items.map((item, itemIdx) => (
                  <details 
                    key={itemIdx} 
                    className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:border-[#C9A96E]/30 transition-all overflow-hidden"
                  >
                    <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                      <h3 className="text-lg font-semibold text-[#1B3A4B] pr-8 group-open:text-[#C9A96E] transition-colors">
                        {item.question}
                      </h3>
                      <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform duration-300" />
                    </summary>
                    <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                      {item.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#F2EFE9] py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1B3A4B] mb-4">
            Vẫn còn thắc mắc khác?
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7. Đừng ngần ngại liên hệ trực tiếp với chúng tôi.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="tel:0912326997" 
              className="px-8 py-3 rounded-full bg-[#1B3A4B] text-white font-semibold hover:bg-[#1B3A4B]/90 transition-all shadow-lg"
            >
              Gọi ngay: 0912 326 997
            </a>
            <a 
              href="/contact" 
              className="px-8 py-3 rounded-full border-2 border-[#1B3A4B] text-[#1B3A4B] font-semibold hover:bg-[#1B3A4B] hover:text-white transition-all"
            >
              Gửi tin nhắn
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
