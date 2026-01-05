/**
 * Formatting utilities
 * Senior specialist implementation
 */

/**
 * Format number with thousand separators
 */
export function formatNumber(
  value: number | string,
  decimals: number = 0,
  locale: string = 'pl-PL'
): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0';

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Format currency
 */
export function formatCurrency(
  value: number | string,
  currency: string = 'PLN',
  locale: string = 'pl-PL'
): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return `0,00 ${currency}`;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(num);
}

/**
 * Format date
 */
export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
  locale: string = 'pl-PL'
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }

  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(
  date: Date | string | number,
  locale: string = 'pl-PL'
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'przed chwilą';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minutę' : 'minut'} temu`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'godzinę' : 'godzin'} temu`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? 'dzień' : 'dni'} temu`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? 'miesiąc' : 'miesięcy'} temu`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} ${diffInYears === 1 ? 'rok' : 'lat'} temu`;
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Format phone number
 */
export function formatPhoneNumber(phone: string, country: string = 'PL'): string {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');

  if (country === 'PL') {
    // Polish format: +48 XXX XXX XXX
    if (digits.length === 9) {
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    }
    if (digits.length === 11 && digits.startsWith('48')) {
      return `+${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
    }
  }

  return phone;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Format slug from text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Format initials from name
 */
export function getInitials(name: string, maxInitials: number = 2): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 0) return '';

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  return words
    .slice(0, maxInitials)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
}

/**
 * Format percentage
 */
export function formatPercentage(
  value: number | string,
  decimals: number = 1
): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0%';

  return `${num.toFixed(decimals)}%`;
}

