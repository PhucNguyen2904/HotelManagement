// ============================================================
// MIGRATION SCRIPT — WordPress/AweBooking → PostgreSQL/Prisma
// Usage: npx ts-node scripts/migrate.ts
// ============================================================

import mysql from 'mysql2/promise';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const mysqlPool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'khachsanng_khachsannganha',
});

// ============================================================
// HELPERS
// ============================================================

function mode(arr: number[]): number {
  const freq = new Map<number, number>();
  let maxFreq = 0;
  let result = arr[0];
  for (const val of arr) {
    const count = (freq.get(val) || 0) + 1;
    freq.set(val, count);
    if (count > maxFreq) {
      maxFreq = count;
      result = val;
    }
  }
  return result;
}

function generateBookingCode(index: number): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  return `BK-${dateStr}-${String(index).padStart(3, '0')}`;
}

// ============================================================
// MAIN MIGRATION
// ============================================================

async function migrate() {
  console.log('🚀 Starting migration...\n');
  console.log('='.repeat(60));

  // ----------------------------------------------------------
  // STEP 1: Create Hotel
  // ----------------------------------------------------------
  console.log('\n📍 Step 1: Creating hotel...');

  const [optionsRows] = await mysqlPool.query<any[]>(`
    SELECT option_name, option_value FROM sh_options
    WHERE option_name IN ('blogname', 'blogdescription', 'admin_email', 'siteurl')
  `);
  const options = new Map(optionsRows.map((r: any) => [r.option_name, r.option_value]));

  const hotel = await prisma.hotel.create({
    data: {
      name: options.get('blogname') || 'Khách sạn Ngân Hà',
      slug: 'khach-san-ngan-ha',
      description: options.get('blogdescription') || '',
      address: 'Quảng Ninh, Việt Nam',
      city: 'Quảng Ninh',
      province: 'Quảng Ninh',
      phone: '0123456789',
      email: options.get('admin_email') || 'admin@khachsannganha.com',
      website: options.get('siteurl') || 'https://khachsannganha.com',
      starRating: 3,
    },
  });
  console.log(`  ✅ Hotel created: ${hotel.id} (${hotel.name})`);

  // ----------------------------------------------------------
  // STEP 2: Migrate Users
  // ----------------------------------------------------------
  console.log('\n👤 Step 2: Migrating users...');

  const [wpUsers] = await mysqlPool.query<any[]>('SELECT * FROM sh_users');
  const userMap = new Map<number, string>();

  for (const wpUser of wpUsers) {
    const user = await prisma.user.create({
      data: {
        email: wpUser.user_email,
        passwordHash: wpUser.user_pass,
        fullName: wpUser.display_name || wpUser.user_nicename,
        role: 'HOTEL_ADMIN',
        isActive: wpUser.user_status === 0,
        emailVerified: true,
      },
    });
    userMap.set(wpUser.ID, user.id);
    console.log(`  ✅ User: ${wpUser.user_email} → ${user.id}`);
  }

  // ----------------------------------------------------------
  // STEP 3: Migrate Room Types
  // ----------------------------------------------------------
  console.log('\n🏠 Step 3: Migrating room types...');

  const [wpRoomTypes] = await mysqlPool.query<any[]>(`
    SELECT p.ID, p.post_title, p.post_content, p.post_name
    FROM sh_posts p
    WHERE p.post_type = 'room_type' AND p.post_status = 'publish'
  `);

  const roomTypeMap = new Map<number, string>();

  for (const wpRT of wpRoomTypes) {
    const [meta] = await mysqlPool.query<any[]>(
      'SELECT meta_key, meta_value FROM sh_postmeta WHERE post_id = ?',
      [wpRT.ID],
    );
    const metaMap = new Map(meta.map((m: any) => [m.meta_key, m.meta_value]));

    const roomType = await prisma.roomType.create({
      data: {
        hotelId: hotel.id,
        name: wpRT.post_title || 'Classic Room',
        slug: wpRT.post_name || `room-type-${wpRT.ID}`,
        description: wpRT.post_content || null,
        basePrice: parseInt(metaMap.get('base_price') || '500000'),
        maxAdults: parseInt(metaMap.get('maximum_adults') || '2'),
        maxChildren: parseInt(metaMap.get('maximum_children') || '1'),
        bedType: 'DOUBLE',
      },
    });
    roomTypeMap.set(wpRT.ID, roomType.id);
    console.log(`  ✅ RoomType: "${wpRT.post_title}" → ${roomType.id}`);
  }

  // Fallback: nếu không tìm thấy room_type posts, tạo default
  if (roomTypeMap.size === 0) {
    console.log('  ⚠️ No room types found in posts, creating default...');
    const defaultRT = await prisma.roomType.create({
      data: {
        hotelId: hotel.id,
        name: 'Phòng đôi 2 giường',
        slug: 'phong-doi-2-giuong',
        description: 'Phòng đôi 2 giường tiêu chuẩn',
        basePrice: 500000,
        maxAdults: 2,
        maxChildren: 1,
        bedType: 'TWIN',
      },
    });
    roomTypeMap.set(1368, defaultRT.id); // 1368 = room_type from old data
    console.log(`  ✅ Default RoomType created: ${defaultRT.id}`);
  }

  // ----------------------------------------------------------
  // STEP 4: Migrate Rooms
  // ----------------------------------------------------------
  console.log('\n🚪 Step 4: Migrating rooms...');

  const [wpRooms] = await mysqlPool.query<any[]>(
    'SELECT * FROM sh_awebooking_rooms ORDER BY `order`',
  );
  const roomMap = new Map<number, string>();

  for (const wpRoom of wpRooms) {
    let roomTypeId = roomTypeMap.get(wpRoom.room_type);

    // Fallback: dùng room type đầu tiên nếu không match
    if (!roomTypeId) {
      roomTypeId = roomTypeMap.values().next().value;
      if (!roomTypeId) {
        console.warn(`  ⚠️ Skipping room ${wpRoom.id}: no room type available`);
        continue;
      }
    }

    const roomNumber = String(wpRoom.order + 1).padStart(3, '0');
    const floor = Math.ceil((wpRoom.order + 1) / 10) || 1;

    const room = await prisma.room.create({
      data: {
        roomTypeId,
        roomNumber,
        floor,
        status: 'AVAILABLE',
      },
    });
    roomMap.set(wpRoom.id, room.id);
  }
  console.log(`  ✅ Migrated ${roomMap.size} rooms`);

  // ----------------------------------------------------------
  // STEP 5: Migrate Availability (Calendar Matrix → Row-per-day)
  // ----------------------------------------------------------
  console.log('\n📅 Step 5: Migrating availability...');

  const [wpAvail] = await mysqlPool.query<any[]>('SELECT * FROM sh_awebooking_availability');
  let availCount = 0;

  for (const row of wpAvail) {
    const roomId = roomMap.get(row.room_id);
    if (!roomId) continue;

    const daysInMonth = new Date(row.year, row.month, 0).getDate();
    const records = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const colName = `d${day}`;
      const value = Number(row[colName] || 0);
      const date = new Date(row.year, row.month - 1, day);

      records.push({
        roomId,
        date,
        status: value > 0 ? ('BOOKED' as const) : ('AVAILABLE' as const),
      });
    }

    await prisma.roomAvailability.createMany({
      data: records,
      skipDuplicates: true,
    });
    availCount += records.length;
  }
  console.log(`  ✅ Migrated ${availCount} availability records`);

  // ----------------------------------------------------------
  // STEP 6: Migrate Pricing
  // ----------------------------------------------------------
  console.log('\n💰 Step 6: Migrating pricing...');

  const [wpPricing] = await mysqlPool.query<any[]>('SELECT * FROM sh_awebooking_pricing');
  let pricingCount = 0;

  for (const row of wpPricing) {
    const roomTypeId = roomTypeMap.get(row.rate_id);
    if (!roomTypeId) continue;

    const prices: number[] = [];
    for (let day = 1; day <= 31; day++) {
      const val = Number(row[`d${day}`] || 0);
      if (val > 0) prices.push(val);
    }

    if (prices.length > 0) {
      const basePrice = mode(prices);
      await prisma.roomType.update({
        where: { id: roomTypeId },
        data: { basePrice },
      });
      pricingCount++;
    }
  }
  console.log(`  ✅ Updated pricing for ${pricingCount} room types`);

  // ----------------------------------------------------------
  // STEP 7: Migrate Tax Rates
  // ----------------------------------------------------------
  console.log('\n🧾 Step 7: Migrating tax rates...');

  const [wpTaxes] = await mysqlPool.query<any[]>('SELECT * FROM sh_awebooking_tax_rates');

  for (const tax of wpTaxes) {
    await prisma.taxRate.create({
      data: {
        hotelId: hotel.id,
        name: tax.name || 'VAT',
        rate: parseFloat(tax.rate || '10'),
        isDefault: true,
        isActive: true,
      },
    });
  }
  console.log(`  ✅ Migrated ${wpTaxes.length} tax rates`);

  // ----------------------------------------------------------
  // STEP 8: Migrate Bookings
  // ----------------------------------------------------------
  console.log('\n📋 Step 8: Migrating bookings...');

  const [wpBookingItems] = await mysqlPool.query<any[]>(`
    SELECT
      bi.booking_item_id,
      bi.booking_item_name,
      bi.booking_item_type,
      bi.booking_id,
      MAX(CASE WHEN bim.meta_key = '_room_id' THEN bim.meta_value END) as room_id,
      MAX(CASE WHEN bim.meta_key = '_room_type_id' THEN bim.meta_value END) as room_type_id,
      MAX(CASE WHEN bim.meta_key = '_check_in' THEN bim.meta_value END) as check_in,
      MAX(CASE WHEN bim.meta_key = '_check_out' THEN bim.meta_value END) as check_out,
      MAX(CASE WHEN bim.meta_key = '_adults' THEN bim.meta_value END) as adults,
      MAX(CASE WHEN bim.meta_key = '_children' THEN bim.meta_value END) as children,
      MAX(CASE WHEN bim.meta_key = '_infants' THEN bim.meta_value END) as infants,
      MAX(CASE WHEN bim.meta_key = '_line_subtotal' THEN bim.meta_value END) as line_subtotal,
      MAX(CASE WHEN bim.meta_key = '_line_total' THEN bim.meta_value END) as line_total,
      MAX(CASE WHEN bim.meta_key = '_line_total_tax' THEN bim.meta_value END) as line_total_tax
    FROM sh_awebooking_booking_items bi
    LEFT JOIN sh_awebooking_booking_itemmeta bim
      ON bi.booking_item_id = bim.booking_item_id
    WHERE bi.booking_item_type = 'line_item'
    GROUP BY bi.booking_item_id, bi.booking_item_name, bi.booking_item_type, bi.booking_id
  `);

  let bookingIndex = 0;
  const defaultUserId = userMap.values().next().value!;

  for (const item of wpBookingItems) {
    if (!item.check_in || !item.check_out) {
      console.warn(`  ⚠️ Skipping booking item ${item.booking_item_id}: missing dates`);
      continue;
    }

    bookingIndex++;
    const checkIn = new Date(item.check_in);
    const checkOut = new Date(item.check_out);
    const nights = Math.max(
      1,
      Math.ceil((checkOut.getTime() - checkIn.getTime()) / 86400000),
    );
    const subtotal = parseInt(item.line_total || item.line_subtotal || '0');
    const taxAmount = parseInt(item.line_total_tax || '0');

    const booking = await prisma.booking.create({
      data: {
        bookingCode: generateBookingCode(bookingIndex),
        userId: defaultUserId,
        hotelId: hotel.id,
        status: 'CHECKED_OUT',
        checkIn,
        checkOut,
        totalNights: nights,
        adults: parseInt(item.adults || '1'),
        children: parseInt(item.children || '0'),
        infants: parseInt(item.infants || '0'),
        subtotal,
        taxRate: 10,
        taxAmount,
        discountAmount: 0,
        totalAmount: subtotal + taxAmount,
      },
    });

    // Link booking → room (if room exists in map)
    const oldRoomId = parseInt(item.room_id || '0');
    const newRoomId = roomMap.get(oldRoomId);

    if (newRoomId) {
      await prisma.bookingRoom.create({
        data: {
          bookingId: booking.id,
          roomId: newRoomId,
          checkIn,
          checkOut,
          pricePerNight: Math.round(subtotal / nights),
          totalPrice: subtotal,
          adults: parseInt(item.adults || '1'),
          children: parseInt(item.children || '0'),
        },
      });
    }

    console.log(
      `  ✅ Booking: ${booking.bookingCode} | ${item.check_in} → ${item.check_out} | ${subtotal.toLocaleString()}đ`,
    );
  }

  // ----------------------------------------------------------
  // DONE
  // ----------------------------------------------------------
  console.log('\n' + '='.repeat(60));
  console.log('🎉 Migration completed successfully!\n');
  console.log('📊 Summary:');
  console.log(`   • Hotel:        1`);
  console.log(`   • Users:        ${userMap.size}`);
  console.log(`   • Room Types:   ${roomTypeMap.size}`);
  console.log(`   • Rooms:        ${roomMap.size}`);
  console.log(`   • Availability: ${availCount} records`);
  console.log(`   • Bookings:     ${bookingIndex}`);
  console.log(`   • Tax Rates:    ${wpTaxes.length}`);
  console.log('\n⚠️  Post-migration tasks:');
  console.log('   1. Rehash user passwords (WP uses phpass, NestJS should use bcrypt)');
  console.log('   2. Verify room type metadata (amenities, images)');
  console.log('   3. Update hotel contact information');
  console.log('   4. Run prisma db seed for default amenities');

  await prisma.$disconnect();
  await mysqlPool.end();
}

migrate().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
