import { BookingStatus, RoomStatus } from '@/components/manager/types';
import { cn } from '@/lib/utils';

type StatusValue = RoomStatus | BookingStatus;

const statusMap: Record<StatusValue, { label: string; className: string }> = {
  available: { label: 'Trống', className: 'bg-emerald-100 text-emerald-700' },
  occupied: { label: 'Có khách', className: 'bg-red-100 text-red-700' },
  cleaning: { label: 'Đang dọn', className: 'bg-amber-100 text-amber-700' },
  maintenance: { label: 'Bảo trì', className: 'bg-slate-200 text-slate-700' },
  pending: { label: 'Chờ xác nhận', className: 'bg-amber-100 text-amber-700' },
  confirmed: { label: 'Đã xác nhận', className: 'bg-teal-100 text-teal-700' },
  'checked-in': { label: 'Đã check-in', className: 'bg-blue-100 text-blue-700' },
  'checked-out': { label: 'Đã check-out', className: 'bg-purple-100 text-purple-700' },
  cancelled: { label: 'Đã hủy', className: 'bg-rose-100 text-rose-700' },
};

export function StatusBadge({ status }: { status: StatusValue }) {
  const config = statusMap[status];
  return (
    <span className={cn('inline-flex rounded-full px-2 py-1 text-xs font-semibold', config.className)}>
      {config.label}
    </span>
  );
}
