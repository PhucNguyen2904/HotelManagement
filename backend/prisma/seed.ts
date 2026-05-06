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
      city: 'Vân Đồn',
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
      hotelId: hotel.id,
      phone: '0901234567',
      emailVerified: true,
    },
  });
  console.log(`✅ Admin: ${admin.email}`);

  // 2.5 Create Super Admin User
  const superAdminPassword = await bcrypt.hash('SuperAdmin@123', 12);
  const superadmin = await prisma.user.upsert({
    where: { email: 'superadmin@khachsannganha.com' },
    update: {},
    create: {
      email: 'superadmin@khachsannganha.com',
      passwordHash: superAdminPassword,
      fullName: 'Super Admin',
      role: 'SUPER_ADMIN',
      hotelId: hotel.id,
      phone: '0988888888',
      emailVerified: true,
    },
  });
  console.log(`✅ Super Admin: ${superadmin.email}`);

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

  // 4. Create Amenities
  const amenityData = [
    { name: 'WiFi miễn phí', icon: 'wifi' },
    { name: 'Điều hòa', icon: 'ac' },
    { name: 'TV màn hình phẳng', icon: 'tv' },
    { name: 'Minibar', icon: 'minibar' },
    { name: 'Két an toàn', icon: 'safe' },
    { name: 'Vòi sen', icon: 'shower' },
    { name: 'Máy sấy tóc', icon: 'hairdryer' },
    { name: 'Bãi đỗ xe', icon: 'parking' },
    { name: 'Nhà hàng', icon: 'restaurant' },
    { name: 'Lễ tân 24h', icon: 'reception' },
  ];

  const amenities: any[] = [];
  for (const a of amenityData) {
    const amenity = await prisma.amenity.upsert({
      where: { name: a.name },
      update: {},
      create: a,
    });
    amenities.push(amenity);
  }
  console.log(`✅ Amenities: ${amenities.length} items`);

  // 5. Create 3 Room Types theo yêu cầu nghiệp vụ

  // Room images (sử dụng ảnh từ thư mục /images)
  const roomImages = [
    '/images/MG_0454-300x255.jpg',
    '/images/MG_0458-300x255.jpg',
    '/images/MG_0478-300x255.jpg',
    '/images/MG_0502-1-300x255.jpg',
  ];

  // 5.1. Phòng đơn (Single Room) — 1 người, 1 giường đơn
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
      bedType: BedType.SINGLE,
      bedCount: 1,
      areaSize: 18,
    },
  });
  console.log(
    `✅ Room Type: ${singleRoom.name} — ${Number(singleRoom.basePrice).toLocaleString()}đ/đêm`,
  );

  // 5.2. Phòng đôi giường đơn (Twin Room) — 2 người, 2 giường đơn
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
      bedType: BedType.TWIN,
      bedCount: 2,
      areaSize: 25,
    },
  });
  console.log(
    `✅ Room Type: ${twinRoom.name} — ${Number(twinRoom.basePrice).toLocaleString()}đ/đêm`,
  );

  // 5.3. Phòng đôi giường kép (Double Room) — 2 người, 1 giường đôi
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
      bedType: BedType.DOUBLE,
      bedCount: 1,
      areaSize: 28,
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
    await prisma.room_type_images.deleteMany({ where: { room_type_id: rt.id } });

    // Add new images
    for (let i = 0; i < roomImages.length; i++) {
      await prisma.room_type_images.create({
        data: {
          room_type_id: rt.id,
          url: roomImages[i],
          alt_text: `${rt.name} - Ảnh ${i + 1}`,
          sort_order: i,
          is_primary: i === 0,
        },
      });
    }
  }
  console.log(`✅ Room Images: ${roomImages.length} images per room type`);

  // Link amenities to all room types
  for (const rt of roomTypes) {
    for (const amenity of amenities.slice(0, 7)) {
      await prisma.room_type_amenity.upsert({
        where: {
          room_type_id_amenity_id: {
            room_type_id: rt.id,
            amenity_id: amenity.id,
          },
        },
        update: {},
        create: { room_type_id: rt.id, amenity_id: amenity.id },
      });
    }
  }

  // 6. Create Rooms for each room type
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

  // 7. Create Pricing Rules for each room type
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
  console.log('   Super Admin: superadmin@khachsannganha.com / SuperAdmin@123');
  console.log('   Admin: admin@khachsannganha.com / Admin@123');
  console.log('   Guest: guest@example.com / Guest@123');
  console.log('\n📋 Room Types:');
  console.log('   1. Phòng đơn (Single) — 1 người, 1 giường đơn — 350,000đ');
  console.log('   2. Phòng đôi giường đơn (Twin) — 2 người, 2 giường đơn — 450,000đ');
  console.log('   3. Phòng đôi giường kép (Double) — 2 người, 1 giường đôi — 500,000đ');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
