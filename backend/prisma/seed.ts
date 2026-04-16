import { PrismaClient, BedType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Fixed IDs for consistent reference
const HOTEL_ID = 'hotel_nganha_001';

async function main() {
  console.log('🌱 Seeding database...\n');

  // 1. Create Hotel with fixed ID
  const hotel = await prisma.hotel.upsert({
    where: { slug: 'khach-san-ngan-ha' },
    update: { id: HOTEL_ID },
    create: {
      id: HOTEL_ID,
      name: 'Khách sạn Ngân Hà',
      slug: 'khach-san-ngan-ha',
      description: 'Khách sạn Ngân Hà - Nghỉ dưỡng chất lượng',
      address: 'Quảng Ninh, Việt Nam',
      city: 'Hạ Long',
      province: 'Quảng Ninh',
      phone: '0123456789',
      email: 'info@khachsannganha.com',
      website: 'https://khachsannganha.com',
      starRating: 3,
    },
  });
  console.log(`✅ Hotel: ${hotel.name} (ID: ${hotel.id})`);

  // 2. Create Admin User
  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@khachsannganha.com' },
    update: {},
    create: {
      email: 'admin@khachsannganha.com',
      passwordHash: adminPassword,
      fullName: 'Admin',
      role: 'HOTEL_ADMIN',
      phone: '0901234567',
      emailVerified: true,
    },
  });
  console.log(`✅ Admin: ${admin.email}`);

  // 3. Create Guest User
  const guestPassword = await bcrypt.hash('Guest@123', 12);
  const guest = await prisma.user.upsert({
    where: { email: 'guest@example.com' },
    update: {},
    create: {
      email: 'guest@example.com',
      passwordHash: guestPassword,
      fullName: 'Nguyễn Văn A',
      role: 'GUEST',
      phone: '0909876543',
      emailVerified: true,
    },
  });
  console.log(`✅ Guest: ${guest.email}`);

  // 4. Create Tax Rate
  const taxRate = await prisma.taxRate.upsert({
    where: { id: 'default-vat' },
    update: {},
    create: {
      id: 'default-vat',
      hotelId: hotel.id,
      name: 'VAT',
      rate: 10,
      isDefault: true,
    },
  });
  console.log(`✅ Tax: ${taxRate.name} ${taxRate.rate}%`);

  // 5. Create Amenities
  const amenities = await Promise.all(
    [
      { name: 'WiFi miễn phí', icon: 'wifi', category: 'general' },
      { name: 'Điều hòa', icon: 'ac', category: 'room' },
      { name: 'TV màn hình phẳng', icon: 'tv', category: 'room' },
      { name: 'Minibar', icon: 'minibar', category: 'room' },
      { name: 'Két an toàn', icon: 'safe', category: 'room' },
      { name: 'Vòi sen', icon: 'shower', category: 'bathroom' },
      { name: 'Máy sấy tóc', icon: 'hairdryer', category: 'bathroom' },
      { name: 'Bãi đỗ xe', icon: 'parking', category: 'general' },
      { name: 'Nhà hàng', icon: 'restaurant', category: 'general' },
      { name: 'Lễ tân 24h', icon: 'reception', category: 'general' },
    ].map((a) =>
      prisma.roomAmenity.upsert({
        where: { name: a.name },
        update: {},
        create: a,
      }),
    ),
  );
  console.log(`✅ Amenities: ${amenities.length} items`);

  // 6. Create 3 Room Types theo yêu cầu nghiệp vụ

  // Room images (sử dụng ảnh từ thư mục /images)
  const roomImages = [
    '/images/MG_0454-300x255.jpg',
    '/images/MG_0458-300x255.jpg',
    '/images/MG_0478-300x255.jpg',
    '/images/MG_0502-1-300x255.jpg',
  ];

  // 6.1. Phòng đơn (Single Room) — 1 người, 1 giường đơn
  const singleRoom = await prisma.roomType.upsert({
    where: { hotelId_slug: { hotelId: hotel.id, slug: 'phong-don' } },
    update: {
      bedType: BedType.SINGLE,
      bedCount: 1,
      maxAdults: 1,
    },
    create: {
      hotelId: hotel.id,
      name: 'Phòng đơn',
      slug: 'phong-don',
      description:
        'Phòng đơn ấm cúng với 1 giường đơn, phù hợp cho khách đi công tác hoặc du lịch một mình.',
      basePrice: 350000,
      maxAdults: 1,
      maxChildren: 0,
      maxInfants: 0,
      bedType: BedType.SINGLE,
      bedCount: 1,
      areaSize: 18,
      sortOrder: 1,
    },
  });
  console.log(
    `✅ Room Type: ${singleRoom.name} — ${Number(singleRoom.basePrice).toLocaleString()}đ/đêm`,
  );

  // 6.2. Phòng đôi giường đơn (Twin Room) — 2 người, 2 giường đơn
  const twinRoom = await prisma.roomType.upsert({
    where: { hotelId_slug: { hotelId: hotel.id, slug: 'phong-doi-giuong-don' } },
    update: {
      bedType: BedType.TWIN,
      bedCount: 2,
      maxAdults: 2,
    },
    create: {
      hotelId: hotel.id,
      name: 'Phòng đôi giường đơn',
      slug: 'phong-doi-giuong-don',
      description:
        'Phòng rộng rãi với 2 giường đơn, phù hợp cho bạn bè hoặc đồng nghiệp đi cùng nhau.',
      basePrice: 450000,
      maxAdults: 2,
      maxChildren: 1,
      maxInfants: 1,
      bedType: BedType.TWIN,
      bedCount: 2,
      areaSize: 25,
      sortOrder: 2,
    },
  });
  console.log(
    `✅ Room Type: ${twinRoom.name} — ${Number(twinRoom.basePrice).toLocaleString()}đ/đêm`,
  );

  // 6.3. Phòng đôi giường kép (Double Room) — 2 người, 1 giường đôi
  const doubleRoom = await prisma.roomType.upsert({
    where: { hotelId_slug: { hotelId: hotel.id, slug: 'phong-doi-giuong-kep' } },
    update: {
      bedType: BedType.DOUBLE,
      bedCount: 1,
      maxAdults: 2,
    },
    create: {
      hotelId: hotel.id,
      name: 'Phòng đôi giường kép',
      slug: 'phong-doi-giuong-kep',
      description:
        'Phòng lãng mạn với 1 giường đôi lớn, lý tưởng cho các cặp đôi hoặc vợ chồng.',
      basePrice: 500000,
      maxAdults: 2,
      maxChildren: 1,
      maxInfants: 1,
      bedType: BedType.DOUBLE,
      bedCount: 1,
      areaSize: 28,
      sortOrder: 3,
    },
  });
  console.log(
    `✅ Room Type: ${doubleRoom.name} — ${Number(doubleRoom.basePrice).toLocaleString()}đ/đêm`,
  );

  // Deactivate old room type if exists
  await prisma.roomType.updateMany({
    where: {
      hotelId: hotel.id,
      slug: 'phong-doi-2-giuong',
    },
    data: { isActive: false },
  });

  // Add images to each room type
  const roomTypes = [singleRoom, twinRoom, doubleRoom];
  for (const rt of roomTypes) {
    // Delete existing images
    await prisma.roomImage.deleteMany({ where: { roomTypeId: rt.id } });

    // Add new images
    for (let i = 0; i < roomImages.length; i++) {
      await prisma.roomImage.create({
        data: {
          roomTypeId: rt.id,
          url: roomImages[i],
          alt: `${rt.name} - Ảnh ${i + 1}`,
          sortOrder: i,
          isPrimary: i === 0,
        },
      });
    }
  }
  console.log(`✅ Room Images: ${roomImages.length} images per room type`);

  // Link amenities to all room types
  for (const rt of roomTypes) {
    for (const amenity of amenities.slice(0, 7)) {
      await prisma.roomTypeAmenity.upsert({
        where: {
          roomTypeId_amenityId: {
            roomTypeId: rt.id,
            amenityId: amenity.id,
          },
        },
        update: {},
        create: { roomTypeId: rt.id, amenityId: amenity.id },
      });
    }
  }

  // 7. Create Rooms for each room type
  const roomCounts = {
    [singleRoom.id]: 8, // 8 phòng đơn
    [twinRoom.id]: 10, // 10 phòng twin
    [doubleRoom.id]: 8, // 8 phòng double
  };

  let roomNumber = 101;
  for (const [roomTypeId, count] of Object.entries(roomCounts)) {
    for (let i = 0; i < count; i++) {
      const roomNum = String(roomNumber);
      const floor = Math.floor(roomNumber / 100);

      await prisma.room.upsert({
        where: {
          roomTypeId_roomNumber: {
            roomTypeId,
            roomNumber: roomNum,
          },
        },
        update: {},
        create: {
          roomTypeId,
          roomNumber: roomNum,
          floor,
          status: 'AVAILABLE',
        },
      });
      roomNumber++;
    }
  }
  console.log(`✅ Rooms: 26 rooms created (8 single + 10 twin + 8 double)`);

  // 8. Create Pricing Rules for each room type
  for (const rt of roomTypes) {
    await prisma.pricingRule.upsert({
      where: { id: `weekend-${rt.id}` },
      update: {},
      create: {
        id: `weekend-${rt.id}`,
        roomTypeId: rt.id,
        name: 'Giá cuối tuần',
        type: 'WEEKEND',
        price: Number(rt.basePrice) * 1.2, // +20% cho cuối tuần
        daysOfWeek: [0, 6], // Sunday, Saturday
        priority: 1,
      },
    });
  }
  console.log(`✅ Pricing rules: Weekend pricing (+20%) for all room types`);

  console.log('\n🎉 Seeding completed!');
  console.log('\n📋 Test accounts:');
  console.log('   Admin: admin@khachsannganha.com / Admin@123');
  console.log('   Guest: guest@example.com / Guest@123');
  console.log('\n📋 Room Types:');
  console.log('   1. Phòng đơn (Single) — 1 người, 1 giường đơn — 350,000đ');
  console.log('   2. Phòng đôi giường đơn (Twin) — 2 người, 2 giường đơn — 450,000đ');
  console.log('   3. Phòng đôi giường kép (Double) — 2 người, 1 giường đôi — 500,000đ');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
