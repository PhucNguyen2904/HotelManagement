'use client';

import Image from 'next/image';
import { ABOUT_IMAGES_DATA } from './image-data';

export function AboutSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-semibold text-sky-900 md:text-4xl">
            Khách Sạn Ngân Hà
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Điểm đến nghỉ dưỡng lý tưởng tại đảo Quan Lạn, nơi bạn tận hưởng vẻ đẹp hoang sơ của vịnh Bái Tử Long
          </p>
        </div>

        {/* Layout 2 cột: Text + Images */}
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* Text content */}
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-2xl font-semibold text-sky-900">
                Nghỉ dưỡng bên bờ biển xanh
              </h3>
              <p className="leading-relaxed text-slate-600">
                Khách sạn Ngân Hà tọa lạc tại vị trí đắc địa trên đảo Quan Lạn, 
                mang đến cho du khách trải nghiệm nghỉ dưỡng tuyệt vời với tầm nhìn 
                ra biển trong xanh và bãi cát trắng mịn.
              </p>
            </div>
            <div>
              <h3 className="mb-3 text-2xl font-semibold text-sky-900">
                Tiện nghi hiện đại
              </h3>
              <p className="leading-relaxed text-slate-600">
                40 phòng nghỉ được trang bị đầy đủ tiện nghi: điều hòa, WiFi miễn phí, 
                minibar, TV màn hình phẳng. Mỗi phòng đều có ban công hoặc cửa sổ 
                hướng biển, mang đến không gian thư giãn tuyệt đối.
              </p>
            </div>
            <div>
              <h3 className="mb-3 text-2xl font-semibold text-sky-900">
                Dịch vụ tận tâm
              </h3>
              <p className="leading-relaxed text-slate-600">
                Đội ngũ nhân viên nhiệt tình, chu đáo luôn sẵn sàng hỗ trợ bạn 24/7. 
                Chúng tôi cung cấp dịch vụ đưa đón bến tàu, thuê xe máy, tour tham quan 
                đảo và nhiều tiện ích khác.
              </p>
            </div>
          </div>

          {/* Image grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Ảnh lớn chiếm 2 cột */}
            {ABOUT_IMAGES_DATA[0] && (
              <div className="group relative col-span-2 h-72 overflow-hidden rounded">
                <Image
                  src={ABOUT_IMAGES_DATA[0].image}
                  alt={ABOUT_IMAGES_DATA[0].alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/15 transition-colors group-hover:bg-black/10" />
              </div>
            )}
            
            {/* 2 ảnh nhỏ */}
            {ABOUT_IMAGES_DATA.slice(1, 3).map((item) => (
              <div
                key={item.id}
                className="group relative h-52 overflow-hidden rounded"
              >
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/15 transition-colors group-hover:bg-black/10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
