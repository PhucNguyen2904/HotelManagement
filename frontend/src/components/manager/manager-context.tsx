'use client';

import { createContext, useContext, useMemo, useReducer } from 'react';
import { initialBookings, initialRooms } from '@/components/manager/mock-data';
import { Booking, BookingStatus, Room, RoomStatus } from '@/components/manager/types';

interface ManagerState {
  rooms: Room[];
  bookings: Booking[];
}

type ManagerAction =
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

const initialState: ManagerState = {
  rooms: initialRooms,
  bookings: initialBookings,
};

function managerReducer(state: ManagerState, action: ManagerAction): ManagerState {
  switch (action.type) {
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
  const [state, dispatch] = useReducer(managerReducer, initialState);

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
