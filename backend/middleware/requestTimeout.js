// 🔒 BEZPIECZEŃSTWO: Request Timeout - ochrona przed długimi requestami

/**
 * Middleware do ustawiania timeout dla requestów
 */
const requestTimeout = (timeoutMs = 30000) => { // 30 sekund default
  return (req, res, next) => {
    // Ustaw timeout
    req.setTimeout(timeoutMs, () => {
      if (!res.headersSent) {
        res.status(408).json({
          error: 'Request timeout',
          message: 'Request took too long to process',
          timestamp: new Date().toISOString(),
        });
      }
    });

    next();
  };
};

/**
 * Różne timeouty dla różnych typów requestów
 */
const timeouts = {
  default: 30000, // 30 sekund
  upload: 120000, // 2 minuty dla uploadów
  export: 60000, // 1 minuta dla eksportów
  calculation: 10000, // 10 sekund dla kalkulacji
};

module.exports = {
  requestTimeout,
  timeouts,
};

