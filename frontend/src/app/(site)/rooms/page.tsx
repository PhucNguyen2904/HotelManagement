'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRoomTypes } from '@/hooks/useRoomTypes';
import { RoomCard, SearchForm } from '@/components/features/rooms';

const NGANHA_HOTEL_ID = 'hotel_nganha_001';

function RoomsPageContent() {
  const searchParams = useSearchParams();
  const hotelId = searchParams.get('hotelId') || NGANHA_HOTEL_ID;
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const adults = parseInt(searchParams.get('adults') || '2', 10);

  const roomTypesQuery = useMemo(() => (
    hotelId
      ? {
          hotelId,
          checkIn: checkIn || undefined,
          checkOut: checkOut || undefined,
          adults,
        }
      : null
  ), [hotelId, checkIn, checkOut, adults]);

  const { roomTypes, isLoading, error } = useRoomTypes(roomTypesQuery);

  return (
    <div className="min-h-screen bg-[var(--color-accent)]">
      <section className="mx-auto w-full max-w-screen-2xl px-8 pb-14 pt-32">
        <div className="mb-8">
          <p className="mb-3 text-xs uppercase tracking-[0.28em] text-[var(--color-secondary)]">
            Curated Sanctuaries
          </p>
          <h1 className="max-w-4xl text-5xl leading-tight md:text-7xl">
            Our Rooms & Suites
          </h1>
        </div>
        <SearchForm
          hotelId={hotelId}
          initialCheckIn={checkIn}
          initialCheckOut={checkOut}
          initialAdults={adults}
        />
      </section>

      <section className="mx-auto flex w-full max-w-screen-2xl flex-col gap-16 px-8 pb-24 lg:flex-row">
        <aside className="w-full flex-shrink-0 lg:w-72">
          <div className="sticky top-32 space-y-10">
            <section>
              <h3 className="mb-4 text-xs uppercase tracking-[0.2em] text-[var(--color-text)]/70">
                Price Range
              </h3>
              <input
                className="h-1 w-full cursor-pointer accent-[var(--color-secondary)]"
                type="range"
                min={300000}
                max={2500000}
                step={50000}
                defaultValue={900000}
                aria-label="Price range"
              />
            </section>
            <section>
              <h3 className="mb-4 text-xs uppercase tracking-[0.2em] text-[var(--color-text)]/70">
                View Preference
              </h3>
              <div className="space-y-3 text-sm text-[var(--color-primary)]">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="rounded border-[var(--color-secondary)]/50 text-[var(--color-secondary)]"
                  />
                  Ocean Panorama
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="rounded border-[var(--color-secondary)]/50 text-[var(--color-secondary)]"
                  />
                  Garden Retreat
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="rounded border-[var(--color-secondary)]/50 text-[var(--color-secondary)]"
                  />
                  Sunrise Balcony
                </label>
              </div>
            </section>
          </div>
        </aside>

        <div className="flex-grow">
          {isLoading ? (
            <div className="py-20 text-center text-[var(--color-text)]/70">
              Đang tải danh sách phòng...
            </div>
          ) : error ? (
            <div className="py-20 text-center text-red-600">{error}</div>
          ) : roomTypes.length === 0 ? (
            <div className="py-20 text-center">
              <p className="mb-2 text-[var(--color-primary)]">
                Không tìm thấy phòng trống trong thời gian đã chọn.
              </p>
              <p className="text-sm text-[var(--color-text)]/70">
                Vui lòng thử ngày khác hoặc liên hệ 0912 326 997.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
              {roomTypes.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  hotelId={hotelId}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function RoomsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center bg-[var(--color-accent)]">
          <p className="text-[var(--color-text)]/70">Đang tải danh sách phòng...</p>
        </div>
      }
    >
      <RoomsPageContent />
    </Suspense>
  );
}

