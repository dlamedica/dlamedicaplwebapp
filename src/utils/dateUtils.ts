/**
 * Date utility functions
 * Senior specialist implementation
 */

/**
 * Check if date is today
 */
export function isToday(date: Date | string | number): boolean {
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  const today = new Date();
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if date is yesterday
 */
export function isYesterday(date: Date | string | number): boolean {
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return (
    dateObj.getDate() === yesterday.getDate() &&
    dateObj.getMonth() === yesterday.getMonth() &&
    dateObj.getFullYear() === yesterday.getFullYear()
  );
}

/**
 * Check if date is in the past
 */
export function isPast(date: Date | string | number): boolean {
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  return dateObj.getTime() < Date.now();
}

/**
 * Check if date is in the future
 */
export function isFuture(date: Date | string | number): boolean {
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  return dateObj.getTime() > Date.now();
}

/**
 * Get start of day
 */
export function startOfDay(date: Date = new Date()): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Get end of day
 */
export function endOfDay(date: Date = new Date()): Date {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * Get start of week
 */
export function startOfWeek(date: Date = new Date(), weekStartsOn: number = 1): Date {
  const result = new Date(date);
  const day = result.getDay();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  result.setDate(result.getDate() - diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Get end of week
 */
export function endOfWeek(date: Date = new Date(), weekStartsOn: number = 1): Date {
  const result = startOfWeek(date, weekStartsOn);
  result.setDate(result.getDate() + 6);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * Get start of month
 */
export function startOfMonth(date: Date = new Date()): Date {
  const result = new Date(date);
  result.setDate(1);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Get end of month
 */
export function endOfMonth(date: Date = new Date()): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + 1, 0);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * Add days to date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Add months to date
 */
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

/**
 * Add years to date
 */
export function addYears(date: Date, years: number): Date {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
}

/**
 * Get difference in days
 */
export function differenceInDays(date1: Date | string | number, date2: Date | string | number): number {
  const d1 = typeof date1 === 'string' || typeof date1 === 'number' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' || typeof date2 === 'number' ? new Date(date2) : date2;
  
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Get difference in hours
 */
export function differenceInHours(date1: Date | string | number, date2: Date | string | number): number {
  const d1 = typeof date1 === 'string' || typeof date1 === 'number' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' || typeof date2 === 'number' ? new Date(date2) : date2;
  
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60));
}

/**
 * Get difference in minutes
 */
export function differenceInMinutes(date1: Date | string | number, date2: Date | string | number): number {
  const d1 = typeof date1 === 'string' || typeof date1 === 'number' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' || typeof date2 === 'number' ? new Date(date2) : date2;
  
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60));
}

/**
 * Check if date is between two dates
 */
export function isBetween(
  date: Date | string | number,
  startDate: Date | string | number,
  endDate: Date | string | number
): boolean {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  const start = typeof startDate === 'string' || typeof startDate === 'number' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' || typeof endDate === 'number' ? new Date(endDate) : endDate;

  return d.getTime() >= start.getTime() && d.getTime() <= end.getTime();
}

/**
 * Get age from birthdate
 */
export function getAge(birthdate: Date | string | number): number {
  const birth = typeof birthdate === 'string' || typeof birthdate === 'number'
    ? new Date(birthdate)
    : birthdate;

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

