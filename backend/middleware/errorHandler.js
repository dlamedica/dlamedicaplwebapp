// 🔒 BEZPIECZEŃSTWO: Centralized Error Handler - bezpieczna obsługa błędów

const SecurityLogger = require('./securityLogger');

/**
 * Klasa błędów aplikacji
 */
class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Błąd walidacji
 */
class ValidationError extends AppError {
  constructor(message, details = {}) {
    super(message, 400);
    this.details = details;
  }
}

/**
 * Błąd autoryzacji
 */
class UnauthorizedError extends AppError {
  constructor(message = 'Brak autoryzacji') {
    super(message, 401);
  }
}

/**
 * Błąd uprawnień
 */
class ForbiddenError extends AppError {
  constructor(message = 'Brak uprawnień') {
    super(message, 403);
  }
}

/**
 * Błąd nie znaleziono
 */
class NotFoundError extends AppError {
  constructor(message = 'Nie znaleziono') {
    super(message, 404);
  }
}

/**
 * Middleware do obsługi błędów
 */
const errorHandler = (err, req, res, next) => {
  // Loguj błąd
  const errorLog = {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id,
    timestamp: new Date().toISOString(),
  };

  console.error('❌ Error:', errorLog);

  // Loguj do SecurityLogger jeśli to błąd bezpieczeństwa
  if (err.statusCode === 401 || err.statusCode === 403) {
    SecurityLogger.logUnauthorizedAccess(req, err.message);
  }

  // Określ status code
  const statusCode = err.statusCode || err.status || 500;
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Przygotuj response
  const response = {
    error: getErrorMessage(err, statusCode),
    timestamp: new Date().toISOString(),
  };

  // W development dodaj szczegóły
  if (isDevelopment) {
    response.message = err.message;
    if (err.details) {
      response.details = err.details;
    }
    if (err.stack && isDevelopment) {
      response.stack = err.stack;
    }
  }

  // Dodatkowe informacje dla niektórych błędów
  if (err instanceof ValidationError && err.details) {
    response.details = err.details;
  }

  res.status(statusCode).json(response);
};

/**
 * Zwraca bezpieczny komunikat błędu dla użytkownika
 */
function getErrorMessage(err, statusCode) {
  // Nie ujawniaj szczegółów błędów systemowych
  if (statusCode >= 500 && !err.isOperational) {
    return 'Wystąpił błąd serwera. Spróbuj ponownie później.';
  }

  // Użyj wiadomości z błędu jeśli jest bezpieczna
  if (err.message && !err.message.includes('stack') && !err.message.includes('at ')) {
    return err.message;
  }

  // Domyślne komunikaty
  const defaultMessages = {
    400: 'Nieprawidłowe żądanie',
    401: 'Brak autoryzacji',
    403: 'Brak uprawnień',
    404: 'Nie znaleziono',
    409: 'Konflikt danych',
    429: 'Zbyt wiele requestów. Spróbuj ponownie później.',
    500: 'Wystąpił błąd serwera',
    503: 'Serwis niedostępny',
  };

  return defaultMessages[statusCode] || 'Wystąpił błąd';
}

/**
 * Async handler wrapper - automatycznie obsługuje błędy
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  AppError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  errorHandler,
  asyncHandler,
  getErrorMessage,
};

