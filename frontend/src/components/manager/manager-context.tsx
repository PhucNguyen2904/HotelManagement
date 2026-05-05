'use client';

import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { Booking, BookingStatus, Room, RoomStatus } from '@/components/manager/types';
import { NGANHA_HOTEL_ID, toManagerBooking, toManagerRoom } from '@/lib/hotel-admin-data';
import { bookingsService } from '@/services/bookings.service';
import { roomsService } from '@/services/rooms.service';

interface ManagerState {
  rooms: Room[];
  bookings: Booking[];
}

type ManagerAction =
  | { type: 'SET_DATA'; payload: ManagerState }
  | { type: 'ADD_BOOKING'; payload: Booking }
  | { type: 'UPDATE_BOOKING_STATUS'; payload: { id: string; status: BookingStatus; cancelReason?: string } }
  | { type: 'ADD_ROOM'; payload: Room }
  | { type: 'UPDATE_ROOM'; payload: Room }
  | { type: 'UPDATE_ROOM_STATUS'; payload: { roomId: string; status: RoomStatus } };

interface ManagerContextValue extends ManagerState {
  addBooking: (booking: Booking) => void;
  updateBookingStatus: (id: string, status: BookingStatus, cancelReason?: string) => void;
  addRoom: (room: Room) => void;
  updateRoom: (room: Room) => void;
  updateRoomStatus: (roomId: string, status: RoomStatus) => void;
}

const ManagerContext = createContext<ManagerContextValue | undefined>(undefined);

function managerReducer(state: ManagerState, action: ManagerAction): ManagerState {
  switch (action.type) {
    case 'SET_DATA':
      return action.payload;
    case 'ADD_BOOKING':
      return { ...state, bookings: [action.payload, ...state.bookings] };
    case 'UPDATE_BOOKING_STATUS':
      return {
        ...state,
        bookings: state.bookings.map((booking) =>
          booking.id === action.payload.id
            ? { ...booking, status: action.payload.status, cancelReason: action.payload.cancelReason }
            : booking
        ),
      };
    case 'ADD_ROOM':
      return { ...state, rooms: [action.payload, ...state.rooms] };
    case 'UPDATE_ROOM':
      return {
        ...state,
        rooms: state.rooms.map((room) => (room.id === action.payload.id ? action.payload : room)),
      };
    case 'UPDATE_ROOM_STATUS':
      return {
        ...state,
        rooms: state.rooms.map((room) =>
          room.id === action.payload.roomId ? { ...room, status: action.payload.status } : room
        ),
      };
    default:
      return state;
  }
}

export function ManagerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(managerReducer, { rooms: [], bookings: [] });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [bookingsResponse, roomsResponse] = await Promise.all([
          bookingsService.getHotelBookings(NGANHA_HOTEL_ID, { limit: 100 }),
          roomsService.getAllByHotel(NGANHA_HOTEL_ID),
        ]);

        const mappedRooms = roomsResponse.map((room) => toManagerRoom(room));
        const mappedBookings = bookingsResponse.data.map((booking) => toManagerBooking(booking));

        dispatch({ type: 'SET_DATA', payload: { rooms: mappedRooms, bookings: mappedBookings } });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    loadData();
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      addBooking: (booking: Booking) => dispatch({ type: 'ADD_BOOKING', payload: booking }),
      updateBookingStatus: (id: string, status: BookingStatus, cancelReason?: string) =>
        dispatch({ type: 'UPDATE_BOOKING_STATUS', payload: { id, status, cancelReason } }),
      addRoom: (room: Room) => dispatch({ type: 'ADD_ROOM', payload: room }),
      updateRoom: (room: Room) => dispatch({ type: 'UPDATE_ROOM', payload: room }),
      updateRoomStatus: (roomId: string, status: RoomStatus) =>
        dispatch({ type: 'UPDATE_ROOM_STATUS', payload: { roomId, status } }),
    }),
    [state]
  );

  return <ManagerContext.Provider value={value}>{children}</ManagerContext.Provider>;
}

export function useManager() {
  const context = useContext(ManagerContext);
  if (!context) {
    throw new Error('useManager must be used within ManagerProvider');
  }
  return context;
}
