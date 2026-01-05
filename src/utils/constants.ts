/**
 * Application constants
 * Senior specialist - centralized constants
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  TIMEOUT: 30000, // 30 seconds
  RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_PAGE_SIZE: 100,
} as const;

// Debounce/Throttle delays
export const DELAYS = {
  SEARCH_DEBOUNCE: 500, // ms
  SCROLL_THROTTLE: 100, // ms
  RESIZE_THROTTLE: 150, // ms
  INPUT_DEBOUNCE: 300, // ms
} as const;

// Toast/Notification
export const TOAST = {
  DEFAULT_DURATION: 5000, // 5 seconds
  SUCCESS_DURATION: 3000,
  ERROR_DURATION: 7000,
  WARNING_DURATION: 5000,
  INFO_DURATION: 4000,
} as const;

// Cache keys
export const CACHE_KEYS = {
  USER_PROFILE: 'user_profile',
  USER_PREFERENCES: 'user_preferences',
  SEARCH_RESULTS: 'search_results',
  API_RESPONSES: 'api_responses',
} as const;

// Validation
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 30,
  MAX_EMAIL_LENGTH: 254,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10 MB
} as const;

// File upload
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10 MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
} as const;

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'DD MMMM YYYY',
  DISPLAY_WITH_TIME: 'DD MMMM YYYY, HH:mm',
  SHORT: 'DD.MM.YYYY',
  ISO: 'YYYY-MM-DD',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
} as const;

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// Z-index layers
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080,
} as const;

// Animation durations
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  REQUIRED: 'To pole jest wymagane',
  INVALID_EMAIL: 'Nieprawidłowy format email',
  INVALID_PHONE: 'Nieprawidłowy format numeru telefonu',
  PASSWORD_TOO_SHORT: `Hasło musi mieć minimum ${VALIDATION.MIN_PASSWORD_LENGTH} znaków`,
  PASSWORD_TOO_LONG: `Hasło może mieć maksimum ${VALIDATION.MAX_PASSWORD_LENGTH} znaków`,
  PASSWORDS_DONT_MATCH: 'Hasła nie są identyczne',
  FILE_TOO_LARGE: 'Plik jest za duży. Maksymalny rozmiar: 10 MB',
  INVALID_FILE_TYPE: 'Nieprawidłowy typ pliku',
  NETWORK_ERROR: 'Błąd połączenia z serwerem',
  UNKNOWN_ERROR: 'Wystąpił nieoczekiwany błąd',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  SAVED: 'Zapisano pomyślnie',
  DELETED: 'Usunięto pomyślnie',
  CREATED: 'Utworzono pomyślnie',
  UPDATED: 'Zaktualizowano pomyślnie',
  SENT: 'Wysłano pomyślnie',
} as const;


