// 🔒 BEZPIECZEŃSTWO: Secure Headers - dodatkowe nagłówki bezpieczeństwa

/**
 * Middleware do dodawania dodatkowych secure headers
 */
const addSecureHeaders = (req, res, next) => {
  // X-Content-Type-Options - zapobiega MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // X-Frame-Options - zapobiega clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // X-XSS-Protection - dodatkowa ochrona XSS (dla starszych przeglądarek)
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer-Policy - kontroluje ile informacji o referrerze jest wysyłane
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions-Policy - kontroluje dostęp do funkcji przeglądarki
  res.setHeader('Permissions-Policy', [
    'geolocation=()',
    'microphone=()',
    'camera=()',
    'payment=()',
    'usb=()',
    'bluetooth=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()',
  ].join(', '));
  
  // Strict-Transport-Security (HSTS) - wymusza HTTPS
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
  // X-DNS-Prefetch-Control - kontroluje DNS prefetching
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  
  // X-Download-Options - zapobiega otwieraniu plików w kontekście przeglądarki
  res.setHeader('X-Download-Options', 'noopen');
  
  // X-Permitted-Cross-Domain-Policies - kontroluje cross-domain policies
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  
  // Clear-Site-Data - instrukcje dla przeglądarki do czyszczenia danych (opcjonalne)
  // res.setHeader('Clear-Site-Data', '"cache", "cookies", "storage"');
  
  next();
};

module.exports = {
  addSecureHeaders,
};

