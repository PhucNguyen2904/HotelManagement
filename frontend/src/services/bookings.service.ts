import api from './api';
import type {
  ApiResponse,
  Booking,
  CreateBookingRequest,
  PaginatedResponse,
} from '@/types';

export interface BookingsQuery {
  status?: string;
  hotelId?: string;
  checkIn?: string;
  page?: number;
  limit?: number;
}

export const bookingsService = {
  async getAll(query?: BookingsQuery): Promise<PaginatedResponse<Booking>> {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<Booking>>>(
        '/bookings/my',
        {
          params: query,
        }
      );
      return response.data.data;
    } catch (error: any) {
      // Treat missing endpoint/user-without-bookings scenarios as empty state.
      if (error?.response?.status === 404) {
        return {
          data: [],
          meta: {
            total: 0,
            page: query?.page ?? 1,
            limit: query?.limit ?? 10,
            totalPages: 0,
          },
        };
      }
      throw error;
    }
  },

  async getHotelBookings(
    hotelId: string,
    query?: Omit<BookingsQuery, 'hotelId'>,
  ): Promise<PaginatedResponse<Booking>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Booking>>>(
      `/bookings/hotel/${hotelId}`,
      {
        params: query,
      }
    );
    return response.data.data;
  },

  async getById(id: string): Promise<Booking> {
    const response = await api.get<ApiResponse<Booking>>(`/bookings/${id}`);
    return response.data.data;
  },

  async create(data: CreateBookingRequest): Promise<Booking> {
    const response = await api.post<ApiResponse<Booking>>('/bookings', data);
    return response.data.data;
  },

  async cancel(id: string, reason?: string): Promise<Booking> {
    const response = await api.post<ApiResponse<Booking>>(
      `/bookings/${id}/cancel`,
      { reason }
    );
    return response.data.data;
  },

  async checkIn(id: string): Promise<Booking> {
    const response = await api.patch<ApiResponse<Booking>>(
      `/bookings/${id}/check-in`
    );
    return response.data.data;
  },

  async checkOut(id: string): Promise<Booking> {
    const response = await api.patch<ApiResponse<Booking>>(
      `/bookings/${id}/check-out`
    );
    return response.data.data;
  },
};
