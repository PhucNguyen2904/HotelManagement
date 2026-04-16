import { create } from 'zustand';
import type { RoomType, Hotel } from '@/types';

interface BookingState {
  // Search params
  hotel: Hotel | null;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;

  // Selected room
  selectedRoomType: RoomType | null;
  quantity: number;

  // Guest info
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests: string;

  // Actions
  setHotel: (hotel: Hotel) => void;
  setDates: (checkIn: string, checkOut: string) => void;
  setGuests: (adults: number, children: number) => void;
  setRoomType: (roomType: RoomType, quantity: number) => void;
  setGuestInfo: (info: {
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    specialRequests?: string;
  }) => void;
  reset: () => void;
}

const initialState = {
  hotel: null,
  checkIn: '',
  checkOut: '',
  adults: 2,
  children: 0,
  selectedRoomType: null,
  quantity: 1,
  guestName: '',
  guestEmail: '',
  guestPhone: '',
  specialRequests: '',
};

export const useBookingStore = create<BookingState>()((set) => ({
  ...initialState,

  setHotel: (hotel) => set({ hotel }),

  setDates: (checkIn, checkOut) => set({ checkIn, checkOut }),

  setGuests: (adults, children) => set({ adults, children }),

  setRoomType: (selectedRoomType, quantity) =>
    set({ selectedRoomType, quantity }),

  setGuestInfo: (info) =>
    set({
      guestName: info.guestName,
      guestEmail: info.guestEmail,
      guestPhone: info.guestPhone,
      specialRequests: info.specialRequests || '',
    }),

  reset: () => set(initialState),
}));
