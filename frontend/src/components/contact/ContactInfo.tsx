import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export function ContactInfo() {
  const infoItems = [
    {
      icon: MapPin,
      title: 'Địa chỉ',
      details: 'Đảo Quan Lạn, Huyện Vân Đồn, Tỉnh Quảng Ninh',
    },
    {
      icon: Phone,
      title: 'Hotline',
      details: '0912 326 997',
      href: 'tel:0912326997',
    },
    {
      icon: Mail,
      title: 'Email',
      details: 'nganhahotelquanlan@gmail.com',
      href: 'mailto:nganhahotelquanlan@gmail.com',
    },
    {
      icon: Clock,
      title: 'Giờ hành chính',
      details: 'Thứ Hai - Chủ Nhật: 8:00 - 22:00',
    },
  ];

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {infoItems.map((item, index) => {
            const Icon = item.icon;
            const content = (
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-secondary)]/15">
                  <Icon size={32} className="text-[var(--color-secondary)]" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-[var(--color-primary)]">
                  {item.title}
                </h3>
                <p className="text-[var(--color-text)]/75">{item.details}</p>
              </div>
            );

            return (
              <div key={index}>
                {item.href ? (
                  <a
                    href={item.href}
                    className="block transition-transform hover:scale-105"
                  >
                    {content}
                  </a>
                ) : (
                  content
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
