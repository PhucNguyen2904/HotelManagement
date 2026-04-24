'use client';

import { useMemo, useState } from 'react';
import { mockReviews } from '@/data/reviews';
import { RatingSummary } from '@/components/reviews/RatingSummary';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { ReviewFilter } from '@/components/reviews/ReviewFilter';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { Button } from '@/components/ui/Button';

const ITEMS_PER_PAGE = 6;

export default function ReviewsPage() {
  const [selectedStars, setSelectedStars] = useState<number | null>(null);
  const [selectedRoomType, setSelectedRoomType] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'highest'>('newest');
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);

  const filteredReviews = useMemo(() => {
    let filtered = [...mockReviews];

    if (selectedStars) {
      filtered = filtered.filter((review) => review.rating === selectedStars);
    }

    if (selectedRoomType) {
      filtered = filtered.filter((review) => review.roomType === selectedRoomType);
    }

    if (sortBy === 'newest') {
      filtered.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else if (sortBy === 'highest') {
      filtered.sort(
        (a, b) =>
          b.rating - a.rating ||
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }

    return filtered;
  }, [selectedRoomType, selectedStars, sortBy]);

  const displayedReviews = filteredReviews.slice(0, displayedCount);
  const hasMore = displayedCount < filteredReviews.length;

  const handleLoadMore = () => setDisplayedCount((prev) => prev + ITEMS_PER_PAGE);
  const handleReset = () => setDisplayedCount(ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-manor-surface">
      <section className="bg-gradient-to-b from-manor-primary to-manor-primary-container py-16 text-white md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-4 font-serif text-4xl font-bold md:text-5xl">
              Đánh giá từ khách hàng
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-white/90 md:text-xl">
              Hãy xem những chia sẻ từ những vị khách đã trải nghiệm sự tuyệt vời
              tại Khách Sạn Ngân Hà
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RatingSummary />

          <ReviewFilter
            onStarFilterChange={setSelectedStars}
            onRoomTypeChange={setSelectedRoomType}
            onSortChange={setSortBy}
          />

          <div className="mb-12">
            {filteredReviews.length === 0 ? (
              <div className="editorial-shadow rounded-xl bg-white py-16 text-center">
                <div className="mb-4 text-6xl">😔</div>
                <h3 className="mb-2 text-2xl font-semibold text-manor-primary">
                  Không có đánh giá nào
                </h3>
                <p className="text-slate-600">
                  Không tìm thấy đánh giá phù hợp với bộ lọc của bạn.
                </p>
                <Button
                  onClick={() => {
                    setSelectedStars(null);
                    setSelectedRoomType(null);
                    handleReset();
                  }}
                  variant="primary"
                  size="lg"
                  className="mt-6"
                >
                  Xóa bộ lọc
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-8 grid grid-cols-1 gap-6">
                  {displayedReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>

                {hasMore && (
                  <div className="text-center">
                    <Button onClick={handleLoadMore} variant="primary" size="lg">
                      ↓ Tải thêm đánh giá (
                      {filteredReviews.length - displayedCount} còn lại)
                    </Button>
                  </div>
                )}

                <div className="mt-6 text-center text-slate-600">
                  <p>
                    Đang hiển thị{' '}
                    <span className="font-semibold text-manor-primary">
                      {displayedReviews.length}
                    </span>{' '}
                    trên{' '}
                    <span className="font-semibold text-manor-primary">
                      {filteredReviews.length}
                    </span>{' '}
                    đánh giá
                  </p>
                </div>
              </>
            )}
          </div>

          <ReviewForm />

          <section className="editorial-shadow mt-16 rounded-xl bg-gradient-to-r from-manor-primary to-manor-primary-container p-8 text-center text-white md:p-12">
            <h2 className="mb-4 font-serif text-3xl font-bold md:text-4xl">
              Chưa từng ở tại Khách Sạn Ngân Hà?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">
              Hãy trải nghiệm thiên đường nghỉ dưỡng tại đảo Quan Lạn ngay hôm nay
            </p>
            <Button
              onClick={() => (window.location.href = '/rooms')}
              variant="secondary"
              size="lg"
            >
              🏩 Khám phá phòng của chúng tôi
            </Button>
          </section>
        </div>
      </section>
    </div>
  );
}

