const { RateLimiterMemory, RateLimiterRedis } = require('rate-limiter-flexible');

// 🔒 BEZPIECZEŃSTWO: Rate Limiting - ochrona przed atakami brute force i DDoS

// Konfiguracja dla różnych typów requestów
const createRateLimiter = (points, duration, blockDuration = 0) => {
  // W produkcji użyj Redis, w development memory
  const limiter = process.env.REDIS_URL
    ? new RateLimiterRedis({
        storeClient: require('redis').createClient(process.env.REDIS_URL),
        points, // Liczba requestów
        duration, // W sekundach
        blockDuration, // Blokada w sekundach po przekroczeniu limitu
      })
    : new RateLimiterMemory({
        points,
        duration,
        blockDuration,
      });

  return limiter;
};

// Rate limiter dla autoryzacji (logowanie, rejestracja) - bardziej restrykcyjny
const authLimiter = createRateLimiter(
  5, // 5 prób
  15 * 60, // w ciągu 15 minut
  30 * 60 // blokada na 30 minut po przekroczeniu
);

// Rate limiter dla API endpoints - standardowy
const apiLimiter = createRateLimiter(
  100, // 100 requestów
  60, // w ciągu 1 minuty
  60 // blokada na 1 minutę
);

// Rate limiter dla quiz submissions - bardziej restrykcyjny
const quizLimiter = createRateLimiter(
  10, // 10 prób
  60, // w ciągu 1 minuty
  120 // blokada na 2 minuty
);

// Rate limiter dla progress updates - mniej restrykcyjny
const progressLimiter = createRateLimiter(
  200, // 200 requestów
  60, // w ciągu 1 minuty
  30 // blokada na 30 sekund
);

// Middleware do użycia z Express
const rateLimitMiddleware = (limiter, keyGenerator = null) => {
  return async (req, res, next) => {
    try {
      // Generuj klucz - domyślnie IP, ale można użyć user ID dla zalogowanych
      const key = keyGenerator
        ? keyGenerator(req)
        : req.ip || req.connection.remoteAddress || 'unknown';

      await limiter.consume(key);
      
      // Dodaj informacje o rate limit w headers
      const rateLimitInfo = await limiter.get(key);
      if (rateLimitInfo) {
        res.setHeader('X-RateLimit-Remaining', rateLimitInfo.remainingPoints || 0);
        res.setHeader('X-RateLimit-Reset', Math.ceil(rateLimitInfo.msBeforeNext / 1000));
      }
      
      next();
    } catch (rejRes) {
      // Limit przekroczony
      const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
      
      // Loguj próbę przekroczenia limitu (security monitoring)
      console.warn(`⚠️ Rate limit exceeded for IP: ${req.ip}, Path: ${req.path}, Time remaining: ${secs}s`);
      
      res.status(429).json({
        error: 'Too many requests',
        message: `Przekroczono limit requestów. Spróbuj ponownie za ${secs} sekund.`,
        retryAfter: secs,
        timestamp: new Date().toISOString()
      });
    }
  };
};

// Key generator dla zalogowanych użytkowników (używa user ID zamiast IP)
const userKeyGenerator = (req) => {
  return req.user?.id ? `user:${req.user.id}` : req.ip || 'unknown';
};

module.exports = {
  authLimiter: rateLimitMiddleware(authLimiter),
  apiLimiter: rateLimitMiddleware(apiLimiter),
  quizLimiter: rateLimitMiddleware(quizLimiter),
  progressLimiter: rateLimitMiddleware(progressLimiter),
  // Custom limiter dla specyficznych przypadków
  createCustomLimiter: (points, duration, blockDuration) => 
    rateLimitMiddleware(createRateLimiter(points, duration, blockDuration)),
  // Limiter z user ID jako kluczem
  userApiLimiter: rateLimitMiddleware(apiLimiter, userKeyGenerator),
};

