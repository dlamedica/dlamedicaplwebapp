// 🔒 BEZPIECZEŃSTWO: Async Handler - bezpieczna obsługa async funkcji w Express

/**
 * Wrapper dla async route handlers - automatycznie obsługuje błędy
 * Zapobiega crashowaniu aplikacji przez nieobsłużone błędy w async funkcjach
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Wrapper dla async middleware - automatycznie obsługuje błędy
 */
const asyncMiddleware = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  asyncHandler,
  asyncMiddleware,
};

