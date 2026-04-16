'use client';

import { useState, useMemo } from 'react';
import { mockReviews } from '@/data/reviews';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { ReviewFilter } from '@/components/reviews/ReviewFilter';
import { RatingSummary } from '@/components/reviews/RatingSummary';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { Button } from '@/components/ui/Button';

const ITEMS_PER_PAGE = 6;

export default function ReviewsPage() {
  const [selectedStars, setSelectedStars] = useState<number | null>(null);
  const [selectedRoomType, setSelectedRoomType] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'highest'>('newest');
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);

  // Filter and sort reviews
  const filteredReviews = useMemo(() => {
    let filtered = [...mockReviews];

    // Apply filters
    if (selectedStars) {
      filtered = filtered.filter((review) => review.rating === selectedStars);
    }

    if (selectedRoomType) {
      filtered = filtered.filter((review) => review.roomType === selectedRoomType);
    }

    // Apply sorting
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'highest') {
      filtered.sort((a, b) => b.rating - a.rating || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return filtered;
  }, [selectedStars, selectedRoomType, sortBy]);

  const displayedReviews = filteredReviews.slice(0, displayedCount);
  const hasMore = displayedCount < filteredReviews.length;

  const handleLoadMore = () => {
    setDisplayedCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const handleReset = () => {
    setDisplayedCount(ITEMS_PER_PAGE);
  };

  return (
    <div className="min-h-screen bg-manor-surface">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-manor-primary to-manor-primary-container text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Đánh giá từ khách hàng
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Hãy xem những chia sẻ từ những vị khách đã trải nghiệm sự tuyệt vời tại Khách Sạn Ngân Hà
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Rating Summary */}
          <RatingSummary />

          {/* Filter & Sort */}
          <ReviewFilter
            onStarFilterChange={setSelectedStars}
            onRoomTypeChange={setSelectedRoomType}
            onSortChange={setSortBy}
          />

          {/* Reviews List */}
          <div className="mb-12">
            {filteredReviews.length === 0 ? (
              // Empty State
              <div className="text-center py-16 bg-white rounded-xl editorial-shadow">
                <div className="text-6xl mb-4">😔</div>
                <h3 className="text-2xl font-semibold text-manor-primary mb-2">
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
                {/* Reviews Grid */}
                <div className="grid grid-cols-1 gap-6 mb-8">
                  {displayedReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="text-center">
                    <Button
                      onClick={handleLoadMore}
                      variant="primary"
                      size="lg"
                    >
                      ↓ Tải thêm đánh giá ({filteredReviews.length - displayedCount} còn lại)
                    </Button>
                  </div>
                )}

                {/* Results Info */}
                <div className="text-center mt-6 text-slate-600">
                  <p>
                    Đang hiển thị <span className="font-semibold text-manor-primary">{displayedReviews.length}</span> trên{' '}
                    <span className="font-semibold text-manor-primary">{filteredReviews.length}</span> đánh giá
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Review Form */}
          <ReviewForm />

          {/* CTA Section */}
          <section className="mt-16 bg-gradient-to-r from-manor-primary to-manor-primary-container rounded-xl editorial-shadow p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Chưa từng ở tại Khách Sạn Ngân Hà?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Hãy trải nghiệm thiên đường nghỉ dưỡng tại đảo Quan Lạn ngay hôm nay
            </p>
            <Button
              onClick={() => window.location.href = '/rooms'}
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
