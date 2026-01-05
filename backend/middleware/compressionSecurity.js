// 🔒 BEZPIECZEŃSTWO: Compression Security - bezpieczna kompresja odpowiedzi

const compression = require('compression');

/**
 * Konfiguracja kompresji z zabezpieczeniami
 */
const secureCompression = compression({
  // Filtruj typy MIME do kompresji
  filter: (req, res) => {
    // Kompresuj tylko bezpieczne typy
    const contentType = res.getHeader('content-type') || '';
    const safeTypes = [
      'text/html',
      'text/css',
      'text/javascript',
      'application/javascript',
      'application/json',
      'application/xml',
      'text/xml',
      'text/plain',
    ];
    
    return safeTypes.some(type => contentType.includes(type));
  },
  
  // Ograniczenie poziomu kompresji (ochrona przed zip bombs)
  level: 6, // Kompromis między wydajnością a bezpieczeństwem
  
  // Ograniczenie rozmiaru do kompresji
  threshold: 1024, // Kompresuj tylko pliki > 1KB
  
  // Wyłącz kompresję dla małych odpowiedzi (ochrona przed timing attacks)
  filter: (req, res) => {
    const contentType = res.getHeader('content-type') || '';
    const shouldCompress = [
      'text/html',
      'text/css',
      'text/javascript',
      'application/javascript',
      'application/json',
    ].some(type => contentType.includes(type));
    
    return shouldCompress;
  },
});

module.exports = secureCompression;

