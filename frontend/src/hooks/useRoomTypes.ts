'use client';

import { useState, useEffect, useCallback } from 'react';
import type { RoomType } from '@/types';
import { roomTypesService, RoomTypesQuery } from '@/services/room-types.service';

export function useRoomTypes(query: RoomTypesQuery | null) {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoomTypes = useCallback(async () => {
    if (!query?.hotelId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await roomTypesService.getAll(query);
      setRoomTypes(data);
    } catch (err) {
      setError('Failed to fetch room types');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [query?.hotelId, query?.checkIn, query?.checkOut, query?.adults]);

  useEffect(() => {
    fetchRoomTypes();
  }, [fetchRoomTypes]);

  return { roomTypes, isLoading, error, refetch: fetchRoomTypes };
}
