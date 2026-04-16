'use client';

import { useState } from 'react';

interface ReviewFilterProps {
  onStarFilterChange: (stars: number | null) => void;
  onRoomTypeChange: (roomType: string | null) => void;
  onSortChange: (sort: 'newest' | 'highest') => void;
}

const roomTypes = [
  'Phòng Deluxe Sea View',
  'Phòng Suite Premium',
  'Phòng Deluxe Standard',
  'Phòng Standard View Biển',
];

export function ReviewFilter({
  onStarFilterChange,
  onRoomTypeChange,
  onSortChange,
}: ReviewFilterProps) {
  const [selectedStars, setSelectedStars] = useState<number | null>(null);
  const [selectedRoomType, setSelectedRoomType] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'highest'>('newest');

  const handleStarClick = (star: number) => {
    const newStar = selectedStars === star ? null : star;
    setSelectedStars(newStar);
    onStarFilterChange(newStar);
  };

  const handleRoomTypeChange = (roomType: string) => {
    const newRoomType = selectedRoomType === roomType ? null : roomType;
    setSelectedRoomType(newRoomType);
    onRoomTypeChange(newRoomType);
  };

  const handleSortChange = (newSort: 'newest' | 'highest') => {
    setSortBy(newSort);
    onSortChange(newSort);
  };

  return (
    <div className="bg-white rounded-xl editorial-shadow p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Filter by Stars */}
        <div>
          <h3 className="text-lg font-semibold text-manor-primary mb-4">Lọc theo sao</h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <button
                key={star}
                onClick={() => handleStarClick(star)}
                className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  selectedStars === star
                    ? 'bg-manor-secondary text-white'
                    : 'bg-manor-surface-high text-manor-primary hover:bg-manor-secondary/20'
                }`}
              >
                <span className="flex gap-0.5">
                  {Array.from({ length: star }).map((_, i) => (
                    <span key={i} className="text-lg">★</span>
                  ))}
                </span>
                <span className="text-sm">({star} sao)</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filter by Room Type */}
        <div>
          <h3 className="text-lg font-semibold text-manor-primary mb-4">Loại phòng</h3>
          <div className="space-y-2">
            {roomTypes.map((roomType) => (
              <button
                key={roomType}
                onClick={() => handleRoomTypeChange(roomType)}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                  selectedRoomType === roomType
                    ? 'bg-manor-secondary text-white'
                    : 'bg-manor-surface-high text-manor-primary hover:bg-manor-secondary/20'
                }`}
              >
                {roomType}
              </button>
            ))}
          </div>
        </div>

        {/* Sort By */}
        <div>
          <h3 className="text-lg font-semibold text-manor-primary mb-4">Sắp xếp</h3>
          <div className="space-y-2">
            <button
              onClick={() => handleSortChange('newest')}
              className={`w-full px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                sortBy === 'newest'
                  ? 'bg-manor-secondary text-white'
                  : 'bg-manor-surface-high text-manor-primary hover:bg-manor-secondary/20'
              }`}
            >
              📅 Mới nhất
            </button>
            <button
              onClick={() => handleSortChange('highest')}
              className={`w-full px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                sortBy === 'highest'
                  ? 'bg-manor-secondary text-white'
                  : 'bg-manor-surface-high text-manor-primary hover:bg-manor-secondary/20'
              }`}
            >
              ⭐ Điểm cao nhất
            </button>
          </div>

          {/* Clear Filters */}
          {(selectedStars || selectedRoomType) && (
            <button
              onClick={() => {
                setSelectedStars(null);
                setSelectedRoomType(null);
                onStarFilterChange(null);
                onRoomTypeChange(null);
              }}
              className="w-full mt-4 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              ✕ Xóa bộ lọc
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
