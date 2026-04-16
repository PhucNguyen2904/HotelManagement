import Image from 'next/image';
import { Review } from '@/data/reviews';

interface ReviewCardProps {
  review: Review;
}

const StarRating = ({ rating }: { rating: number }) => {
  const stars = Array.from({ length: 5 }, (_, i) => i < rating);
  
  return (
    <div className="flex items-center gap-1">
      {stars.map((filled, i) => (
        <span key={i} className={filled ? 'text-yellow-400 text-lg' : 'text-gray-300 text-lg'}>
          ★
        </span>
      ))}
    </div>
  );
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const calculateNights = (checkIn: string, checkOut: string): number => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export function ReviewCard({ review }: ReviewCardProps) {
  const nights = calculateNights(review.checkInDate, review.checkOutDate);

  return (
    <div className="rounded-xl bg-manor-surface-lowest editorial-shadow p-6 hover:shadow-lg transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-manor-secondary/20 flex items-center justify-center text-manor-primary font-semibold">
              {review.guestName.charAt(0)}
            </div>
          </div>

          {/* Guest Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-manor-primary">{review.guestName}</h3>
              {review.verified && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  ✓ Đã xác minh
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500">{review.guestCountry}</p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex-shrink-0">
          <StarRating rating={review.rating} />
        </div>
      </div>

      {/* Room & Date Info */}
      <div className="mb-4 pb-4 border-b border-manor-surface-high">
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="flex items-center gap-1">
            <span className="font-medium text-manor-primary">🏠</span>
            <span className="text-slate-600">{review.roomType}</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="font-medium text-manor-primary">📅</span>
            <span className="text-slate-600">
              {formatDate(review.checkInDate)} - {formatDate(review.checkOutDate)} ({nights} đêm)
            </span>
          </span>
        </div>
      </div>

      {/* Review Content */}
      <div className="mb-4">
        <h4 className="font-semibold text-manor-primary mb-2">{review.title}</h4>
        <p className="text-slate-700 text-sm leading-relaxed">{review.content}</p>
      </div>

      {/* Images */}
      {review.images && review.images.length > 0 && (
        <div className="mb-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {review.images.map((image, idx) => (
              <div key={idx} className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
                <Image
                  src={image}
                  alt={`Review image ${idx + 1}`}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hotel Response */}
      {review.hotelResponse && (
        <div className="bg-manor-surface-low p-4 rounded-lg border-l-4 border-manor-secondary">
          <p className="text-xs font-semibold text-manor-primary mb-2">📢 Phản hồi từ Khách Sạn</p>
          <p className="text-sm text-slate-700">{review.hotelResponse}</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-manor-surface-high">
        <p className="text-xs text-slate-500">
          Đánh giá vào {new Date(review.createdAt).toLocaleDateString('vi-VN')}
        </p>
      </div>
    </div>
  );
}
