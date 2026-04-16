'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';

interface SearchFormProps {
  hotelId?: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialAdults?: number;
}

export function SearchForm({
  hotelId,
  initialCheckIn = '',
  initialCheckOut = '',
  initialAdults = 2,
}: SearchFormProps) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [adults, setAdults] = useState(initialAdults);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (hotelId) params.set('hotelId', hotelId);
    params.set('checkIn', checkIn);
    params.set('checkOut', checkOut);
    params.set('adults', adults.toString());

    router.push(`/rooms?${params.toString()}`);
  };

  // Get tomorrow as min date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-lg shadow-md"
    >
      <div className="flex-1">
        <Input
          type="date"
          label="Ngày nhận phòng"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          min={minDate}
          required
        />
      </div>
      <div className="flex-1">
        <Input
          type="date"
          label="Ngày trả phòng"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          min={checkIn || minDate}
          required
        />
      </div>
      <div className="w-full md:w-32">
        <Input
          type="number"
          label="Số khách"
          value={adults}
          onChange={(e) => setAdults(parseInt(e.target.value))}
          min={1}
          max={10}
          required
        />
      </div>
      <div className="flex items-end">
        <Button type="submit" className="w-full md:w-auto">
          Tìm phòng
        </Button>
      </div>
    </form>
  );
}
