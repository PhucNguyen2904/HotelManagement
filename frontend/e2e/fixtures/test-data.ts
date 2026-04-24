/**
 * Test Data - Pre-defined test data for consistent testing
 */

export const testData = {
  // Test Users
  users: {
    guest: {
      email: 'guest@test.com',
      password: 'TestPassword123!',
      fullName: 'Test Guest',
      phone: '0901234567',
    },
    staff: {
      email: 'staff@test.com',
      password: 'TestPassword123!',
      fullName: 'Test Staff',
      phone: '0909876543',
    },
    existingGuest: {
      email: 'existing@test.com',
      password: 'TestPassword123!',
      fullName: 'Existing Guest',
      phone: '0912345678',
    },
  },

  // Hotel Info
  hotels: {
    testHotel: {
      id: '', // Will be filled from API
      name: 'Khách sạn Ngân Hà',
      slug: 'khach-san-ngan-ha',
      city: 'Đà Lạt',
    },
  },

  // Room Types
  roomTypes: {
    deluxe: {
      id: '',
      name: 'Phòng Deluxe',
      slug: 'phong-deluxe',
      basePrice: 800000,
      maxAdults: 2,
      maxChildren: 1,
    },
    suite: {
      id: '',
      name: 'Phòng Suite',
      slug: 'phong-suite',
      basePrice: 1500000,
      maxAdults: 2,
      maxChildren: 2,
    },
  },

  // Booking Data
  bookings: {
    standard: {
      guestName: 'Nguyen Van A',
      guestEmail: 'nguyen@example.com',
      guestPhone: '0901111111',
      adults: 2,
      children: 0,
      specialRequests: 'Late check-in after 22:00',
    },
    withChild: {
      guestName: 'Tran Thi B',
      guestEmail: 'tran@example.com',
      guestPhone: '0902222222',
      adults: 2,
      children: 1,
      specialRequests: 'Need crib for baby',
    },
    family: {
      guestName: 'Le Van C',
      guestEmail: 'le@example.com',
      guestPhone: '0903333333',
      adults: 2,
      children: 2,
      specialRequests: '',
    },
  },

  // Coupons
  coupons: {
    welcome: {
      code: 'WELCOME10',
      type: 'PERCENTAGE',
      value: 10,
    },
    summer: {
      code: 'SUMMER2024',
      type: 'PERCENTAGE',
      value: 15,
    },
    fixed: {
      code: 'FIXED100K',
      type: 'FIXED_AMOUNT',
      value: 100000,
    },
  },

  // Invalid/Edge Cases
  invalid: {
    emails: [
      'invalid-email',
      'test@',
      '@test.com',
      'test@@example.com',
    ],
    passwords: [
      '123456', // Too short, no uppercase
      'password', // No numbers, no special chars
      'Pass123', // Too short (8 chars)
    ],
    weakPassword: 'test123',
    longName: 'A'.repeat(256),
    invalidPhone: 'not-a-number',
  },
};

/**
 * Generate unique email for test
 */
export function generateTestEmail(prefix = 'test'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `${prefix}-${timestamp}-${random}@test.com`;
}

/**
 * Generate unique booking code
 */
export function generateBookingCode(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `BK${year}${month}${day}${random}`;
}

export const testDataUtil = {
  testData,
  generateTestEmail,
  generateBookingCode,
};
