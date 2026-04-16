'use client';

import { useState, useCallback } from 'react';
import type { AvailabilityQuery, AvailabilityResult } from '@/types';
import { availabilityService } from '@/services/availability.service';

export function useAvailability() {
  const [result, setResult] = useState<AvailabilityResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAvailability = useCallback(async (query: AvailabilityQuery) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await availabilityService.check(query);
      setResult(data);
      return data;
    } catch (err) {
      setError('Failed to check availability');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { result, isLoading, error, checkAvailability };
}
