import api from './api';
import type { ApiResponse, Room } from '@/types';

export interface HotelRoom extends Room {
  roomType?: {
    id: string;
    name: string;
    basePrice?: number | string;
    description?: string | null;
  } | null;
}

export const roomsService = {
  async getAllByHotel(hotelId: string): Promise<HotelRoom[]> {
    const response = await api.get<ApiResponse<HotelRoom[]>>(`/rooms/hotel/${hotelId}`);
    return response.data.data;
  },

  async getById(id: string): Promise<HotelRoom> {
    const response = await api.get<ApiResponse<HotelRoom>>(`/rooms/${id}`);
    return response.data.data;
  },

  async update(id: string, room: Partial<Room>): Promise<HotelRoom> {
    const response = await api.patch<ApiResponse<HotelRoom>>(`/rooms/${id}`, room);
    return response.data.data;
  },
};