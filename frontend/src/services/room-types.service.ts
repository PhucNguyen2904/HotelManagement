import api from './api';
import type { ApiResponse, RoomType } from '@/types';

export interface RoomTypesQuery {
  hotelId: string;
  checkIn?: string;
  checkOut?: string;
  adults?: number;
}

export const roomTypesService = {
  async getAll(query: RoomTypesQuery): Promise<RoomType[]> {
    const response = await api.get<
      ApiResponse<
        RoomType[] | { roomTypes?: RoomType[] }
      >
    >(
      `/hotels/${query.hotelId}/room-types`,
      {
        params: {
          checkIn: query.checkIn,
          checkOut: query.checkOut,
          adults: query.adults,
        },
      },
    );
    const payload = response.data.data;
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray(payload.roomTypes)) return payload.roomTypes;
    return [];
  },

  async getById(hotelId: string, id: string): Promise<RoomType> {
    const response = await api.get<ApiResponse<RoomType>>(
      `/hotels/${hotelId}/room-types/${id}`,
    );
    return response.data.data;
  },

  async getBySlug(hotelId: string, slug: string): Promise<RoomType> {
    const response = await api.get<ApiResponse<RoomType>>(
      `/hotels/${hotelId}/room-types/by-slug/${slug}`,
    );
    return response.data.data;
  },
};
