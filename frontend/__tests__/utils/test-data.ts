export const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  fullName: 'Test User',
  phone: '0901234567',
  role: 'GUEST',
  emailVerified: true,
  isActive: true,
}

export const mockAuthResponse = {
  accessToken: 'mock-token-12345',
  user: mockUser,
}

export const mockRoomType = {
  id: 'room-type-1',
  hotelId: 'hotel-1',
  name: 'Phòng Deluxe',
  slug: 'phong-deluxe',
  basePrice: 800000,
  maxAdults: 2,
  maxChildren: 1,
  bedType: 'DOUBLE',
  areaSize: 25,
  images: [
    {
      id: 'img-1',
      url: 'https://example.com/room.jpg',
      isPrimary: true,
    },
  ],
  amenities: [
    { id: 'am-1', name: 'WiFi', icon: 'wifi' },
    { id: 'am-2', name: 'Điều hòa', icon: 'ac' },
  ],
}

export const mockRoom = {
  id: 'room-1',
  roomTypeId: 'room-type-1',
  roomNumber: '101',
  floor: 1,
  status: 'AVAILABLE',
  isActive: true,
}

export const mockBooking = {
  id: 'booking-1',
  bookingCode: 'BK240301001',
  userId: 'user-1',
  hotelId: 'hotel-1',
  status: 'PENDING',
  checkIn: '2024-03-01',
  checkOut: '2024-03-03',
  totalNights: 2,
  adults: 2,
  children: 0,
  infants: 0,
  subtotal: 1600000,
  taxRate: 10,
  taxAmount: 160000,
  discountAmount: 0,
  totalAmount: 1760000,
  guestName: 'Test User',
  guestEmail: 'test@example.com',
  guestPhone: '0901234567',
  specialRequests: '',
  rooms: [
    {
      id: 'br-1',
      bookingId: 'booking-1',
      roomId: 'room-1',
      checkIn: '2024-03-01',
      checkOut: '2024-03-03',
      pricePerNight: 800000,
      totalPrice: 1600000,
    },
  ],
}

export const mockPayment = {
  id: 'payment-1',
  bookingId: 'booking-1',
  amount: 1760000,
  method: 'VNPAY',
  status: 'COMPLETED',
  transactionRef: 'TXN240301001',
  paidAt: '2024-03-01T10:00:00Z',
}

export const mockReview = {
  id: 'review-1',
  userId: 'user-1',
  bookingId: 'booking-1',
  roomTypeId: 'room-type-1',
  rating: 5,
  title: 'Tuyệt vời!',
  comment: 'Phòng sạch sẽ, nhân viên thân thiện',
  response: null,
  isVisible: true,
}

export const mockHotel = {
  id: 'hotel-1',
  name: 'Khách sạn Ngân Hà',
  slug: 'khach-san-ngan-ha',
  address: '123 Đường XYZ',
  city: 'Đà Lạt',
  province: 'Lâm Đồng',
  phone: '0262123456',
  email: 'info@nganhadlat.com',
  starRating: 3,
  checkInTime: '14:00',
  checkOutTime: '12:00',
  isActive: true,
}

export const mockAvailability = {
  checkIn: '2024-03-01',
  checkOut: '2024-03-03',
  totalNights: 2,
  roomTypes: [
    {
      id: 'room-type-1',
      name: 'Phòng Deluxe',
      basePrice: 800000,
      availableCount: 3,
      pricePerNight: 850000,
      totalPrice: 1700000,
    },
  ],
}
