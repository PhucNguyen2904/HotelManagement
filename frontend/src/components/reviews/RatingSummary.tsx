'use client';

import { getAverageRating, getRatingPercentage, mockReviews } from '@/data/reviews';

const RatingBar = ({ stars, percentage }: { stars: number; percentage: number }) => (
  <div className="flex items-center gap-3 mb-3">
    <div className="flex items-center gap-1 w-12">
      <span className="text-sm font-semibold text-manor-primary">{stars}★</span>
    </div>
    <div className="flex-1 h-3 bg-manor-surface-high rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-manor-secondary to-yellow-400 rounded-full transition-all duration-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
    <span className="w-12 text-right text-sm font-medium text-slate-600">{percentage}%</span>
  </div>
);

export function RatingSummary() {
  const averageRating = getAverageRating();
  const totalReviews = mockReviews.length;

  return (
    <div className="bg-white rounded-xl editorial-shadow p-8 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Average Rating */}
        <div className="flex flex-col items-center justify-center">
          <p className="text-sm text-slate-500 mb-2">Điểm đánh giá tổng thể</p>
          <div className="text-6xl font-bold text-manor-primary mb-2">{averageRating}</div>
          <div className="flex items-center gap-2 mb-4">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className="text-2xl text-yellow-400">★</span>
            ))}
          </div>
          <p className="text-slate-600">Dựa trên {totalReviews} đánh giá</p>
        </div>

        {/* Right: Rating Distribution */}
        <div className="flex flex-col justify-center">
          <h3 className="text-lg font-semibold text-manor-primary mb-6">Phân bổ đánh giá</h3>
          {[5, 4, 3, 2, 1].map((stars) => (
            <RatingBar key={stars} stars={stars} percentage={getRatingPercentage(stars)} />
          ))}
        </div>
      </div>
    </div>
  );
}
