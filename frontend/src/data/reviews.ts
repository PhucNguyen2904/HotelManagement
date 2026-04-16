export interface Review {
  id: string;
  guestName: string;
  guestCountry: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  rating: number;
  title: string;
  content: string;
  images?: string[];
  hotelResponse?: string;
  createdAt: string;
  verified: boolean;
}

export const mockReviews: Review[] = [
  {
    id: '1',
    guestName: 'Nguyễn Thị Hương',
    guestCountry: 'Việt Nam',
    roomType: 'Phòng Deluxe Sea View',
    checkInDate: '2026-04-10',
    checkOutDate: '2026-04-12',
    rating: 5,
    title: 'Chuyến đi tuyệt vời, view biển đẹp mê hồn',
    content:
      'Khách sạn rất sạch sẽ, nhân viên thân thiện và nhiệt tình. Phòng rộng rãi với view biển tuyệt đẹp. Bữa sáng đa dạng và ngon lành. Sẽ quay lại chắc chắn!',
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&h=500&fit=crop',
    ],
    hotelResponse:
      'Cảm ơn bạn đã lựa chọn Khách Sạn Ngân Hà. Chúng tôi rất vui nhận được feedback tích cực từ bạn. Hy vọng sẽ đón tiếp bạn sớm!',
    createdAt: '2026-04-14T10:30:00',
    verified: true,
  },
  {
    id: '2',
    guestName: 'James Wilson',
    guestCountry: 'Hoa Kỳ',
    roomType: 'Phòng Suite Premium',
    checkInDate: '2026-04-05',
    checkOutDate: '2026-04-08',
    rating: 5,
    title: 'Amazing location and perfect service',
    content:
      'Had an incredible stay at this beautiful hotel. The rooms are spacious and well-decorated. The beach is just steps away. Staff is extremely helpful and attentive. Highly recommend!',
    images: [
      'https://images.unsplash.com/photo-1629140727571-7e4fb4ce299e?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&h=500&fit=crop',
    ],
    hotelResponse:
      'Thank you so much for the wonderful review! We are delighted to have hosted you. Looking forward to your next visit!',
    createdAt: '2026-04-12T14:22:00',
    verified: true,
  },
  {
    id: '3',
    guestName: 'Tanaka Yuki',
    guestCountry: 'Nhật Bản',
    roomType: 'Phòng Standard View Biển',
    checkInDate: '2026-03-28',
    checkOutDate: '2026-03-31',
    rating: 4,
    title: 'とても快適な滞在でした',
    content:
      'ホテルは清潔で、スタッフは非常に親切です。朝食は美味しく、部屋の景色も素晴らしいです。少し値段が高いですが、価値があります。',
    images: [],
    createdAt: '2026-04-01T09:15:00',
    verified: true,
  },
  {
    id: '4',
    guestName: 'Trần Minh Đức',
    guestCountry: 'Việt Nam',
    roomType: 'Phòng Deluxe Standard',
    checkInDate: '2026-04-08',
    checkOutDate: '2026-04-10',
    rating: 4,
    title: 'Khá tốt nhưng giá hơi cao',
    content:
      'Phòng ốc sạch sẽ, view đẹp nhưng phần nào hơi chật chội. Nhân viên lễ tân rất tốt bụng. Bữa sáng không quá ấn tượng. Tuy nhiên vị trí khách sạn rất tuyệt vời, gần bãi biển sạch đẹp.',
    images: [],
    hotelResponse:
      'Cảm ơn bạn đã feedback cho chúng tôi. Chúng tôi sẽ cải thiện chất lượng bữa sáng dần dần. Mong bạn sẽ quay lại!',
    createdAt: '2026-04-11T16:45:00',
    verified: true,
  },
  {
    id: '5',
    guestName: 'Sarah Anderson',
    guestCountry: 'Anh',
    roomType: 'Phòng Deluxe Sea View',
    checkInDate: '2026-04-01',
    checkOutDate: '2026-04-03',
    rating: 5,
    title: 'Paradise found in Quan Lan Island',
    content:
      'This is absolutely stunning! From the moment we arrived, we felt pampered. The room is elegantly decorated with premium amenities. The beach is pristine and the sunset views are breathtaking. Worth every penny!',
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&h=500&fit=crop',
    ],
    createdAt: '2026-04-05T11:20:00',
    verified: true,
  },
  {
    id: '6',
    guestName: 'Lê Quỳnh Anh',
    guestCountry: 'Việt Nam',
    roomType: 'Phòng Standard View Biển',
    checkInDate: '2026-04-06',
    checkOutDate: '2026-04-07',
    rating: 3,
    title: 'Bình thường, có một vài lỗi',
    content:
      'Phòng còn một số hạn chế: wifi chậm, điều hòa hơi ồn. Nhân viên tuy thân thiện nhưng đôi lúc phục vụ chậm. Giá thì hơi cao với mức chất lượng này.',
    images: [],
    hotelResponse:
      'Xin lỗi vì những bất tiện bạn gặp phải. Chúng tôi sẽ sửa chữa hệ thống wifi và kiểm tra điều hòa. Cảm ơn bạn đã góp ý!',
    createdAt: '2026-04-09T13:30:00',
    verified: true,
  },
  {
    id: '7',
    guestName: 'Kim Min-jun',
    guestCountry: 'Hàn Quốc',
    roomType: 'Phòng Suite Premium',
    checkInDate: '2026-04-02',
    checkOutDate: '2026-04-04',
    rating: 5,
    title: '완벽한 휴가를 보냈습니다',
    content:
      '훌륭한 호텔입니다. 깨끗한 방, 훌륭한 서비스, 아름다운 해변. 모든 것이 기대 이상이었습니다. 직원들도 매우 친절했습니다. 다시 오고 싶습니다!',
    images: [
      'https://images.unsplash.com/photo-1629140727571-7e4fb4ce299e?w=500&h=500&fit=crop',
    ],
    createdAt: '2026-04-06T08:10:00',
    verified: true,
  },
  {
    id: '8',
    guestName: 'Phạm Tuấn Linh',
    guestCountry: 'Việt Nam',
    roomType: 'Phòng Deluxe Sea View',
    checkInDate: '2026-04-11',
    checkOutDate: '2026-04-13',
    rating: 4,
    title: 'Địa điểm tuyệt vời, thiết bị hiện đại',
    content:
      'Khách sạn nằm ở vị trí đắc địa. Phòng được trang bị hiện đại, thoải mái. Nhân viên rất chuyên nghiệp. Một điểm cộng là có hồ bơi sạch đẹp. Nếu như bữa tối có thêm các lựa chọn khác sẽ tốt hơn.',
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&h=500&fit=crop',
    ],
    createdAt: '2026-04-14T10:00:00',
    verified: true,
  },
  {
    id: '9',
    guestName: 'Emily Thompson',
    guestCountry: 'Úc',
    roomType: 'Phòng Standard View Biển',
    checkInDate: '2026-03-25',
    checkOutDate: '2026-03-27',
    rating: 5,
    title: 'Best place to relax and unwind',
    content:
      "Absolutely love this hotel! The tranquility here is unmatched. Great value for money, excellent breakfast, and the beach is just perfect. The staff went above and beyond to make our stay memorable. Highly recommended for anyone looking for a peaceful getaway.",
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&h=500&fit=crop',
    ],
    hotelResponse:
      'Thank you Emily! We are thrilled to hear that you had such a wonderful experience. We hope to welcome you back soon!',
    createdAt: '2026-03-30T15:45:00',
    verified: true,
  },
  {
    id: '10',
    guestName: 'Võ Hải Đăng',
    guestCountry: 'Việt Nam',
    roomType: 'Phòng Suite Premium',
    checkInDate: '2026-04-09',
    checkOutDate: '2026-04-11',
    rating: 5,
    title: 'Hoàn hảo! Sẽ quay lại lần nữa',
    content:
      'Tuyệt vời! Mọi thứ đều tốt. Phòng sang trọng, view biển tuyệt đẹp, nhân viên rất tư vấn tốt. Bữa sáng phong phú. Giá cao nhưng xứng đáng. Cảm ơn khách sạn đã làm cho chuyến du lịch của tôi thêm ý nghĩa.',
    images: [
      'https://images.unsplash.com/photo-1629140727571-7e4fb4ce299e?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&h=500&fit=crop',
    ],
    hotelResponse:
      'Cảm ơn bạn rất nhiều! Chúng tôi rất hạnh phúc được phục vụ bạn. Mong sớm được đón tiếp bạn trở lại!',
    createdAt: '2026-04-13T12:15:00',
    verified: true,
  },
];

export function getAverageRating(): number {
  const sum = mockReviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / mockReviews.length) * 10) / 10;
}

export function getRatingDistribution() {
  const distribution = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  mockReviews.forEach((review) => {
    distribution[review.rating as keyof typeof distribution]++;
  });

  return distribution;
}

export function getRatingPercentage(stars: number): number {
  const count = mockReviews.filter((r) => r.rating === stars).length;
  return Math.round((count / mockReviews.length) * 100);
}
