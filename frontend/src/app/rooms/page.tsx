'use client';

import { useSearchParams } from 'next/navigation';
import { useRoomTypes } from '@/hooks/useRoomTypes';
import { RoomCard, SearchForm } from '@/components/features/rooms';

// Default hotel ID cho Khách Sạn Ngân Hà
const NGANHA_HOTEL_ID = 'hotel_nganha_001';

export default function RoomsPage() {
  const searchParams = useSearchParams();

  const hotelId = searchParams.get('hotelId') || NGANHA_HOTEL_ID;
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const adults = parseInt(searchParams.get('adults') || '2');

  const { roomTypes, isLoading, error } = useRoomTypes(
    hotelId
      ? {
          hotelId,
          checkIn: checkIn || undefined,
          checkOut: checkOut || undefined,
          adults,
        }
      : null
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Section */}
      <div className="bg-primary-900 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-white mb-2">
            Tìm phòng tại Ngân Hà Hotel
          </h1>
          <p className="text-primary-200 mb-4">
            Quan Lạn, Vân Đồn, Quảng Ninh • 26 phòng nghỉ
          </p>
          <SearchForm
            hotelId={hotelId}
            initialCheckIn={checkIn}
            initialCheckOut={checkOut}
            initialAdults={adults}
          />
        </div>
      </div>

      {/* Room Info Banner */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-6 text-sm text-gray-600">
            <span className="flex items-center">
              <span className="mr-2">🛏️</span>
              Phòng đơn (1 người): <strong className="ml-1">350,000đ</strong>
            </span>
            <span className="flex items-center">
              <span className="mr-2">🛏️🛏️</span>
              Phòng đôi giường đơn (2 người): <strong className="ml-1">450,000đ</strong>
            </span>
            <span className="flex items-center">
              <span className="mr-2">🛌</span>
              Phòng đôi giường kép (2 người): <strong className="ml-1">500,000đ</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải danh sách phòng...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        ) : roomTypes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏨</div>
            <p className="text-gray-600 mb-4">
              Không tìm thấy phòng trống trong khoảng thời gian này.
            </p>
            <p className="text-sm text-gray-500">
              Vui lòng thử lại với ngày khác hoặc liên hệ{' '}
              <a href="tel:0912326997" className="text-primary-600 font-medium">
                0912 326 997
              </a>{' '}
              để được hỗ trợ.
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Tìm thấy <strong>{roomTypes.length}</strong> loại phòng phù hợp
              </p>
              <div className="text-sm text-gray-500">
                Check-in: 14:00 • Check-out: 12:00
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          </>
        )}
      </div>

      {/* Amenities Section */}
      <div className="bg-white border-t py-8">
        <div className="container mx-auto px-4">
          <h3 className="text-lg font-semibold mb-4">Tiện nghi tại Ngân Hà Hotel</h3>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
              📶 WiFi miễn phí
            </span>
            <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
              ❄️ Điều hòa
            </span>
            <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
              📺 TV
            </span>
            <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
              🚿 Phòng tắm riêng
            </span>
            <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
              🌅 View biển
            </span>
            <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
              🅿️ Bãi đỗ xe
            </span>
            <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
              🍽️ Nhà hàng
            </span>
            <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
              🏖️ Gần bãi biển
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
