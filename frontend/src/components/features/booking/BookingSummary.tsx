import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import type { RoomType } from '@/types';

interface BookingSummaryProps {
  roomType: RoomType;
  checkIn: string;
  checkOut: string;
  nights: number;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
}

export function BookingSummary({
  roomType,
  checkIn,
  checkOut,
  nights,
  subtotal,
  taxAmount,
  discountAmount,
}: BookingSummaryProps) {
  const total = subtotal + taxAmount - discountAmount;

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle className="text-lg">Thông tin đặt phòng</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="font-semibold text-gray-900">{roomType.name}</p>
          <p className="text-sm text-gray-600 mt-1">{roomType.bedType}</p>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Nhận phòng:</span>
            <span className="font-medium">{checkIn}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span>Trả phòng:</span>
            <span className="font-medium">{checkOut}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Số đêm:</span>
            <span className="font-medium">{nights} đêm</span>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Tiền phòng:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Thuế (10%):</span>
            <span>{formatCurrency(taxAmount)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Giảm giá:</span>
              <span>-{formatCurrency(discountAmount)}</span>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 pt-4 flex justify-between">
          <span className="font-semibold">Tổng cộng:</span>
          <span className="text-xl font-bold text-primary-600">
            {formatCurrency(Math.max(0, total))}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
