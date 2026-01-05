// Auto-deploy test
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

// 🔒 BEZPIECZEŃSTWO: Walidacja zmiennych środowiskowych przy starcie
const { initializeEnvironment } = require('./utils/envValidator');
try {
  initializeEnvironment();
} catch (error) {
  console.error('❌ Błąd konfiguracji środowiska:', error.message);
  process.exit(1);
}

const { apiLimiter } = require('./middleware/rateLimiter');
const { sanitizeInput, limitBodySize } = require('./middleware/inputValidation');
const { generateCSRF } = require('./middleware/csrf');
const { errorHandler } = require('./middleware/errorHandler');
const { filterResponse } = require('./middleware/responseFilter');
const { trackRequest, detectSuspiciousRequests } = require('./middleware/requestTracking');
const { checkBlockedIP } = require('./middleware/ipBlocking');
const { addSecurityHeaders } = require('./middleware/securityHeaders');
const { requestTimeout, timeouts } = require('./middleware/requestTimeout');

const app = express();
const PORT = process.env.PORT || 3001;

// 🔒 BEZPIECZEŃSTWO: Trust proxy dla prawidłowego IP w rate limiting
app.set('trust proxy', 1);

// 🔒 BEZPIECZEŃSTWO: Wymuszenie HTTPS w produkcji
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      return res.redirect(301, `https://${req.header('host')}${req.url}`);
    }
    next();
  });
}

// 🔒 BEZPIECZEŃSTWO: Dodatkowe security headers
app.use(addSecurityHeaders);

// 🔒 BEZPIECZEŃSTWO: Ukryj informacje o wersji
const { hideVersionInfo } = require('./middleware/versionHeader');
app.use(hideVersionInfo);

// 🔒 BEZPIECZEŃSTWO: Walidacja bezpieczeństwa sesji
const { validateSession } = require('./middleware/sessionSecurity');
app.use(validateSession);

// 🔒 BEZPIECZEŃSTWO: Helmet - security headers (CSP, XSS protection, etc.)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"], // Lokalne API
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "same-origin" }, // Wszystko lokalnie
}));

// 🔒 BEZPIECZEŃSTWO: CORS - tylko dozwolone domeny
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  process.env.FRONTEND_URL_PROD,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://57.128.242.148:5173',
  'http://57.128.242.148:5174',
  'http://57.128.242.148:5175',
  'https://dlamedica.pl',
  'https://www.dlamedica.pl',
].filter(Boolean); // Usuń undefined wartości

app.use(cors({
  origin: (origin, callback) => {
    // Pozwól na requesty bez origin (mobile apps, Postman, etc.) tylko w development
    if (!origin && process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    // Sprawdź czy origin jest na whitelist
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Session-ID'],
  exposedHeaders: ['X-RateLimit-Remaining', 'X-RateLimit-Reset'],
  maxAge: 86400, // 24 godziny
}));

// 🔒 BEZPIECZEŃSTWO: Bezpieczna kompresja
const secureCompression = require('./middleware/compressionSecurity');
app.use(secureCompression);
app.use(morgan('combined'));

// 🔒 BEZPIECZEŃSTWO: Sprawdź zablokowane IP (przed wszystkimi requestami)
app.use(checkBlockedIP);

// 🔒 BEZPIECZEŃSTWO: Request tracking - śledzenie wszystkich requestów
app.use(trackRequest);

// 🔒 BEZPIECZEŃSTWO: Wykrywanie podejrzanych requestów
app.use(detectSuspiciousRequests);

// 🔒 BEZPIECZEŃSTWO: Rate limiting dla wszystkich API endpoints
app.use('/api', apiLimiter);

// 🔒 BEZPIECZEŃSTWO: Request timeout - ochrona przed długimi requestami
app.use(requestTimeout(timeouts.default));

// 🔒 BEZPIECZEŃSTWO: Ograniczenie rozmiaru body
app.use(limitBodySize(10 * 1024 * 1024)); // 10MB max

// 🔒 BEZPIECZEŃSTWO: Walidacja Content-Type dla POST/PUT/PATCH
app.use((req, res, next) => {
  const methodsRequiringBody = ['POST', 'PUT', 'PATCH'];
  if (methodsRequiringBody.includes(req.method)) {
    const contentType = req.headers['content-type'];
    // Pozwól na puste body lub application/json (z opcjonalnym charset)
    if (req.headers['content-length'] !== '0' && contentType) {
      if (!contentType.includes('application/json') && !contentType.includes('application/x-www-form-urlencoded')) {
        return res.status(415).json({ 
          error: 'Unsupported Media Type',
          message: 'Content-Type musi być application/json lub application/x-www-form-urlencoded'
        });
      }
    }
  }
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 🔒 BEZPIECZEŃSTWO: Sanityzacja wszystkich danych wejściowych
app.use(sanitizeInput);

// 🔒 BEZPIECZEŃSTWO: Sanityzacja query parameters
const { sanitizeQueryParams } = require('./middleware/querySanitizer');
app.use(sanitizeQueryParams);

// 🔒 BEZPIECZEŃSTWO: Walidacja struktury requestów
const { validateRequestStructure, validateRequestSize } = require('./middleware/requestValidator');
app.use(validateRequestStructure);
app.use(validateRequestSize);

// 🔒 BEZPIECZEŃSTWO: Filtrowanie wrażliwych danych z odpowiedzi
app.use(filterResponse);

// 🔒 BEZPIECZEŃSTWO: Dodatkowa sanityzacja odpowiedzi
const { sanitizeResponse } = require('./middleware/responseSanitizer');
app.use(sanitizeResponse);

// 🔒 BEZPIECZEŃSTWO: CSRF Protection - generuj tokeny dla GET requestów
app.use(generateCSRF);

// Routes
app.use('/api/auth', require('./routes/auth')); // 🔐 Autoryzacja 
app.use('/api/subjects', require('./routes/subjects'));
app.use('/api/modules', require('./routes/modules'));
app.use('/api/content', require('./routes/content'));
app.use('/api/topics', require('./routes/topics'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/users', require('./routes/users'));
app.use('/api/quiz', require('./routes/quiz'));
app.use('/api/security', require('./routes/security')); // 🔒 Security endpoints
app.use('/api/profile', require('./routes/profile')); // Unified profile endpoints
app.use('/api/articles', require('./routes/articles')); // 📰 Artykuły

// 🔒 BEZPIECZEŃSTWO: Bezpieczny health check
const { secureHealthCheck, detailedHealthCheck } = require('./middleware/healthCheckSecurity');
const { authenticateToken, requireRole } = require('./middleware/auth');
app.get('/api/health', secureHealthCheck);
app.get('/api/health/detailed', authenticateToken, requireRole(['admin']), detailedHealthCheck);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.originalUrl 
  });
});

// 🔒 BEZPIECZEŃSTWO: Centralized Error Handler
app.use(errorHandler);

// 🚀 Uruchomienie serwera
const server = app.listen(PORT, () => {
  console.log(`🚀 Education API server running on port ${PORT}`);
  console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// 🔒 BEZPIECZEŃSTWO: Graceful Shutdown
const db = require('./db');

async function gracefulShutdown(signal) {
  console.log(`\n📛 Received ${signal}, shutting down gracefully...`);
  
  server.close(async () => {
    console.log('🔌 HTTP server closed');
    
    try {
      await db.close();
      console.log('📦 Database connections closed');
      console.log('✅ Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
      process.exit(1);
    }
  });

  // Wymuś zamknięcie po 10 sekundach
  setTimeout(() => {
    console.error('⚠️ Forcing shutdown after timeout');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = app;