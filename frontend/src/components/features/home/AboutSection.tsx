'use client';

import Image from 'next/image';
import { ABOUT_IMAGES_DATA } from './image-data';

export function AboutSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Khách Sạn Ngân Hà
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Điểm đến nghỉ dưỡng lý tưởng tại đảo Quan Lạn, nơi bạn tận hưởng vẻ đẹp hoang sơ của vịnh Bái Tử Long
          </p>
        </div>

        {/* Layout 2 cột: Text + Images */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                Nghỉ dưỡng bên bờ biển xanh
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Khách sạn Ngân Hà tọa lạc tại vị trí đắc địa trên đảo Quan Lạn, 
                mang đến cho du khách trải nghiệm nghỉ dưỡng tuyệt vời với tầm nhìn 
                ra biển trong xanh và bãi cát trắng mịn.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                Tiện nghi hiện đại
              </h3>
              <p className="text-gray-600 leading-relaxed">
                40 phòng nghỉ được trang bị đầy đủ tiện nghi: điều hòa, WiFi miễn phí, 
                minibar, TV màn hình phẳng. Mỗi phòng đều có ban công hoặc cửa sổ 
                hướng biển, mang đến không gian thư giãn tuyệt đối.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                Dịch vụ tận tâm
              </h3>
              <p className="text-gray-600 leading-relaxed">
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
              <div className="col-span-2 relative h-64 overflow-hidden rounded-lg group">
                <Image
                  src={ABOUT_IMAGES_DATA[0].image}
                  alt={ABOUT_IMAGES_DATA[0].alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              </div>
            )}
            
            {/* 2 ảnh nhỏ */}
            {ABOUT_IMAGES_DATA.slice(1, 3).map((item) => (
              <div
                key={item.id}
                className="relative h-48 overflow-hidden rounded-lg group"
              >
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
