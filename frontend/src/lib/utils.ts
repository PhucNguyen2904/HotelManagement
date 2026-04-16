import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { BedType } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateRange(checkIn: string, checkOut: string): string {
  return `${formatDate(checkIn)} - ${formatDate(checkOut)}`;
}

export function calculateNights(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// ==================== BED TYPE HELPERS ====================

/**
 * Mapping BedType enum sang label tiếng Việt
 */
export const BED_TYPE_LABELS: Record<BedType, string> = {
  [BedType.SINGLE]: 'Giường đơn',
  [BedType.DOUBLE]: 'Giường đôi',
  [BedType.TWIN]: 'Giường đơn',
  [BedType.QUEEN]: 'Giường Queen',
  [BedType.KING]: 'Giường King',
};

/**
 * Mapping BedType enum sang icon (emoji hoặc class name)
 */
export const BED_TYPE_ICONS: Record<BedType, string> = {
  [BedType.SINGLE]: '🛏️',
  [BedType.DOUBLE]: '🛌',
  [BedType.TWIN]: '🛏️',
  [BedType.QUEEN]: '👑',
  [BedType.KING]: '👑',
};

/**
 * Lấy label đầy đủ cho bed type bao gồm số lượng giường
 * @example getBedLabel(BedType.TWIN, 2) => "2 giường đơn"
 * @example getBedLabel(BedType.DOUBLE, 1) => "1 giường đôi"
 */
export function getBedLabel(bedType: BedType, bedCount: number = 1): string {
  const label = BED_TYPE_LABELS[bedType] || 'Giường';
  return `${bedCount} ${label}`;
}

/**
 * Lấy icon cho bed type (hỗ trợ hiển thị nhiều icon nếu có nhiều giường)
 * @example getBedIcon(BedType.TWIN, 2) => "🛏️🛏️"
 */
export function getBedIcon(bedType: BedType, bedCount: number = 1): string {
  const icon = BED_TYPE_ICONS[bedType] || '🛏️';
  return icon.repeat(Math.min(bedCount, 3)); // Tối đa 3 icons
}

/**
 * Lấy full display string: icon + label
 * @example getBedDisplay(BedType.TWIN, 2) => "🛏️🛏️ 2 giường đơn"
 */
export function getBedDisplay(bedType: BedType, bedCount: number = 1): string {
  return `${getBedIcon(bedType, bedCount)} ${getBedLabel(bedType, bedCount)}`;
}

/**
 * Lấy capacity label
 * @example getCapacityLabel(2) => "2 người"
 */
export function getCapacityLabel(maxAdults: number, maxChildren: number = 0): string {
  if (maxChildren > 0) {
    return `${maxAdults} người lớn, ${maxChildren} trẻ em`;
  }
  return `${maxAdults} người`;
}
