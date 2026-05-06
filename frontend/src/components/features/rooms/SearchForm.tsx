'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Select } from '@/components/ui';

interface SearchFormProps {
  hotelId?: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialAdults?: number;
  initialSlug?: string;
}

export function SearchForm({
  hotelId,
  initialCheckIn = '',
  initialCheckOut = '',
  initialAdults = 2,
  initialSlug = '',
}: SearchFormProps) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [adults, setAdults] = useState(initialAdults);
  const [slug, setSlug] = useState(initialSlug);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (hotelId) params.set('hotelId', hotelId);
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    params.set('adults', adults.toString());
    if (slug) params.set('slug', slug);

    router.push(`/rooms?${params.toString()}`);
  };

  // Get tomorrow as min date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const roomTypeOptions = [
    { value: '', label: 'Tất cả loại phòng' },
    { value: 'phong-don', label: 'Phòng đơn' },
    { value: 'phong-doi-giuong-don', label: 'Phòng đôi giường đơn' },
    { value: 'phong-doi-giuong-kep', label: 'Phòng đôi giường kép' },
  ];

  return (
    <form
      onSubmit={handleSearch}
      className="grid grid-cols-1 gap-4 rounded-xl p-4 backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-5"
      style={{
        background: 'rgba(242, 239, 233, 0.15)',
        boxShadow: '0 20px 40px rgba(27,58,75,0.2)',
      }}
    >
      <div>
        <Input
          type="date"
          label="Ngày nhận phòng"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          min={minDate}
        />
      </div>
      <div>
        <Input
          type="date"
          label="Ngày trả phòng"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          min={checkIn || minDate}
        />
      </div>
      <div>
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
      <div>
        <Select
          label="Loại phòng"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          options={roomTypeOptions}
        />
      </div>
      <div className="flex items-end">
        <Button
          type="submit"
          className="w-full bg-[var(--color-secondary)] font-semibold text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-secondary)]"
        >
          Tìm kiếm
        </Button>
      </div>
    </form>
  );
}
