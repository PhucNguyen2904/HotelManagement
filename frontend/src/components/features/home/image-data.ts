// Image data configuration
// Images từ thư mục /images - tự động phân loại

const ALL_IMAGES = [
  'Gemini_Generated_Image_172bu2172bu2172b.png',
  'Gemini_Generated_Image_l03yxdl03yxdl03y.png',
  'MG_0454-300x255.jpg',
  'MG_0458-300x255.jpg',
  'MG_0478-300x255.jpg',
  'MG_0502-1-300x255.jpg',
  'quan-lan-3.png',
];

// Ảnh bắt đầu bằng "MG" → phòng khách sạn
export const ROOM_IMAGES = ALL_IMAGES.filter((img) => img.startsWith('MG'));

// Ảnh còn lại → giới thiệu khách sạn
export const ABOUT_IMAGES = ALL_IMAGES.filter((img) => !img.startsWith('MG'));

// Room data - 3 loại phòng chính (matching với database)
export const ROOMS_DATA = [
  {
    id: 1,
    image: '/images/MG_0454-300x255.jpg',
    name: 'Phòng đơn',
    slug: 'phong-don',
    price: 350000,
    description: '1 giường đơn • 18m²',
    bedInfo: '🛏️ 1 giường đơn',
    capacity: 1,
  },
  {
    id: 2,
    image: '/images/MG_0458-300x255.jpg',
    name: 'Phòng đôi giường đơn',
    slug: 'phong-doi-giuong-don',
    price: 450000,
    description: '2 giường đơn • 25m²',
    bedInfo: '🛏️🛏️ 2 giường đơn',
    capacity: 2,
  },
  {
    id: 3,
    image: '/images/MG_0478-300x255.jpg',
    name: 'Phòng đôi giường kép',
    slug: 'phong-doi-giuong-kep',
    price: 500000,
    description: '1 giường đôi • 28m²',
    bedInfo: '🛌 1 giường đôi',
    capacity: 2,
  },
];

// About images với paths
export const ABOUT_IMAGES_DATA = ABOUT_IMAGES.map((image, index) => ({
  id: index + 1,
  image: `/images/${image}`,
  alt: ['Khách sạn Ngân Hà', 'Khu vực nghỉ dưỡng', 'Bãi biển Quan Lạn'][index] || `Ảnh giới thiệu ${index + 1}`,
}));
