/**
 * Date Utility - Helper functions for date manipulation
 */

/**
 * Format date to YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse YYYY-MM-DD string to Date
 */
export function parseDate(dateString: string): Date {
  return new Date(dateString + 'T00:00:00');
}

/**
 * Get today's date as YYYY-MM-DD
 */
export function getToday(): string {
  return formatDate(new Date());
}

/**
 * Get tomorrow's date as YYYY-MM-DD
 */
export function getTomorrow(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return formatDate(tomorrow);
}

/**
 * Add days to a date
 */
export function addDays(dateString: string, days: number): string {
  const date = parseDate(dateString);
  date.setDate(date.getDate() + days);
  return formatDate(date);
}

/**
 * Calculate number of nights between two dates
 */
export function calculateNights(checkIn: string, checkOut: string): number {
  const startDate = parseDate(checkIn);
  const endDate = parseDate(checkOut);
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Get future date (X days from now)
 */
export function getFutureDate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatDate(date);
}

/**
 * Get past date (X days ago)
 */
export function getPastDate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return formatDate(date);
}

/**
 * Check if date is in the past
 */
export function isPastDate(dateString: string): boolean {
  const date = parseDate(dateString);
  return date < new Date();
}

/**
 * Common test date ranges
 */
export const testDates = {
  checkInSoon: getFutureDate(1),
  checkOutSoon: getFutureDate(3),
  checkInLater: getFutureDate(7),
  checkOutLater: getFutureDate(10),
  pastCheckIn: getPastDate(5),
  pastCheckOut: getPastDate(2),
};

export const dateUtil = {
  formatDate,
  parseDate,
  getToday,
  getTomorrow,
  addDays,
  calculateNights,
  getFutureDate,
  getPastDate,
  isPastDate,
  testDates,
};
