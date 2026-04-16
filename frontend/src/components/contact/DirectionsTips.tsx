import { ArrowRight, Plane, MapPin } from 'lucide-react';

export function DirectionsTips() {
  const directions = [
    {
      icon: Plane,
      title: 'Từ Sân Bay Nội Bài (Hà Nội)',
      details: 'Khoảng 200km, 4-5 tiếng lái xe. Quốc lộ 5 → Quốc lộ 3 → Vân Đồn → Tuyến sà lan tới Quan Lạn.',
    },
    {
      icon: ArrowRight,
      title: 'Từ Thành Phố Hạ Long',
      details: 'Khoảng 50km, 1-1.5 tiếng. Quốc lộ 18 → Vân Đồn → Cảng sà lan Cái Rồng.',
    },
    {
      icon: MapPin,
      title: 'Từ Cảng Cái Rồng (Vân Đồn)',
      details: 'Khoảng 25km đường biển, 45 phút tuyến sà lan. Chúng tôi có thể sắp xếp dịch vụ đón từ cảng.',
    },
  ];

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-semibold text-[var(--color-primary)]">
            Hướng Dẫn Di Chuyển
          </h2>
          <p className="text-[var(--color-text)]/75">
            Cách đến Khách Sạn Ngân Hà từ các địa điểm chính
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {directions.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="rounded-xl border border-[var(--color-secondary)]/15 bg-[var(--color-accent)]/50 p-6 transition-all hover:border-[var(--color-secondary)] hover:shadow-sm"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-secondary)]/15">
                  <Icon className="text-[var(--color-secondary)]" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-[var(--color-primary)]">
                  {item.title}
                </h3>
                <p className="text-sm text-[var(--color-text)]/75">{item.details}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 rounded-xl bg-[var(--color-secondary)]/10 p-8 text-center">
          <p className="mb-4 text-[var(--color-text)]">
            📞 Cần hỗ trợ sắp xếp xe đón từ cảng hoặc sân bay?{' '}
            <a
              href="tel:0912326997"
              className="font-semibold text-[var(--color-secondary)] hover:underline"
            >
              Gọi ngay 0912 326 997
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
