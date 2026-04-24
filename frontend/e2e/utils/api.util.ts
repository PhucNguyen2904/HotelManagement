/**
 * API Utility - Direct API calls for test setup/verification
 * Bypasses frontend to set up test data or verify state
 */

const API_BASE_URL = 'http://localhost:3001/api';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
  body?: unknown;
  headers?: Record<string, string>;
  token?: string;
}

/**
 * Make HTTP request to backend
 */
export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    method = 'GET',
    body,
    headers = {},
    token,
  } = options;

  const url = `${API_BASE_URL}${path}`;
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error [${response.status}]: ${error}`);
  }

  return response.json() as Promise<T>;
}

/**
 * Register a test user
 */
export async function registerUser(data: {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}): Promise<{ id: string; email: string; role: string }> {
  const response = await apiRequest<{
    data: { id: string; email: string; role: string };
  }>('/auth/register', {
    method: 'POST',
    body: data,
  });
  return response.data;
}

/**
 * Login user and get token
 */
export async function loginUser(email: string, password: string): Promise<{
  accessToken: string;
  user: { id: string; email: string; fullName: string; role: string };
}> {
  const response = await apiRequest<{
    data: {
      accessToken: string;
      user: { id: string; email: string; fullName: string; role: string };
    };
  }>('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
  return response.data;
}

/**
 * Get all hotels
 */
export async function getHotels(): Promise<Array<{ id: string; name: string; slug: string }>> {
  const response = await apiRequest<{
    data: Array<{ id: string; name: string; slug: string }>;
  }>('/hotels');
  return response.data;
}

/**
 * Get room types for hotel
 */
export async function getRoomTypes(hotelId: string, params?: {
  checkIn?: string;
  checkOut?: string;
  adults?: number;
}): Promise<Array<{ id: string; name: string; basePrice: number }>> {
  let path = `/room-types?hotelId=${hotelId}`;
  if (params?.checkIn) path += `&checkIn=${params.checkIn}`;
  if (params?.checkOut) path += `&checkOut=${params.checkOut}`;
  if (params?.adults) path += `&adults=${params.adults}`;

  const response = await apiRequest<{
    data: Array<{ id: string; name: string; basePrice: number }>;
  }>(path);
  return response.data;
}

/**
 * Check availability
 */
export async function checkAvailability(hotelId: string, checkIn: string, checkOut: string) {
  const response = await apiRequest<{
    data: {
      checkIn: string;
      checkOut: string;
      totalNights: number;
      roomTypes: Array<{ id: string; name: string; availableCount: number }>;
    };
  }>(`/availability?hotelId=${hotelId}&checkIn=${checkIn}&checkOut=${checkOut}`);
  return response.data;
}

/**
 * Create booking
 */
export async function createBooking(token: string, data: {
  hotelId: string;
  checkIn: string;
  checkOut: string;
  rooms: Array<{ roomTypeId: string; quantity: number; adults: number; children: number }>;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
}) {
  const response = await apiRequest<{
    data: {
      id: string;
      bookingCode: string;
      status: string;
      totalAmount: number;
    };
  }>('/bookings', {
    method: 'POST',
    body: data,
    token,
  });
  return response.data;
}

/**
 * Get booking by ID
 */
export async function getBooking(bookingId: string, token: string) {
  const response = await apiRequest<{
    data: {
      id: string;
      bookingCode: string;
      status: string;
      checkIn: string;
      checkOut: string;
      totalAmount: number;
    };
  }>(`/bookings/${bookingId}`, { token });
  return response.data;
}

/**
 * Validate coupon
 */
export async function validateCoupon(code: string, hotelId: string) {
  const response = await apiRequest<{
    data: { value: number; type: 'PERCENTAGE' | 'FIXED_AMOUNT' };
  }>(`/coupons/validate?code=${code}&hotelId=${hotelId}`);
  return response.data;
}

/**
 * Create payment
 */
export async function createPayment(token: string, data: {
  bookingId: string;
  amount: number;
  method: 'VNPAY' | 'MOMO' | 'CASH' | 'BANK_TRANSFER';
}) {
  const response = await apiRequest<{
    data: { id: string; paymentUrl?: string; transactionRef: string };
  }>('/payments', {
    method: 'POST',
    body: data,
    token,
  });
  return response.data;
}

/**
 * Get reviews for room type
 */
export async function getReviews(roomTypeId: string) {
  const response = await apiRequest<{
    data: Array<{ id: string; rating: number; title: string; comment: string }>;
  }>(`/reviews?roomTypeId=${roomTypeId}`);
  return response.data;
}

/**
 * Create review
 */
export async function createReview(token: string, data: {
  bookingId: string;
  rating: number;
  title: string;
  comment: string;
}) {
  const response = await apiRequest<{
    data: { id: string; rating: number };
  }>('/reviews', {
    method: 'POST',
    body: data,
    token,
  });
  return response.data;
}

export const apiUtil = {
  apiRequest,
  registerUser,
  loginUser,
  getHotels,
  getRoomTypes,
  checkAvailability,
  createBooking,
  getBooking,
  validateCoupon,
  createPayment,
  getReviews,
  createReview,
};
