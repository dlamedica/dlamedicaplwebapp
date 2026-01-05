// 🔒 BEZPIECZEŃSTWO: Additional Security Headers - dodatkowe nagłówki bezpieczeństwa

/**
 * Middleware do dodawania dodatkowych security headers
 */
const addSecurityHeaders = (req, res, next) => {
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
  ].join(', '));
  
  // Strict-Transport-Security (HSTS) - wymusza HTTPS
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
  // X-DNS-Prefetch-Control - kontroluje DNS prefetching
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  
  // Expect-CT - Certificate Transparency (opcjonalne)
  // res.setHeader('Expect-CT', 'max-age=86400, enforce');
  
  next();
};

module.exports = {
  addSecurityHeaders,
};

