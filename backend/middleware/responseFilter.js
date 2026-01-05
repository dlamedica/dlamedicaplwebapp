// 🔒 BEZPIECZEŃSTWO: Response Filter - filtrowanie wrażliwych danych z odpowiedzi API

/**
 * Pola które NIE powinny być zwracane w odpowiedziach API
 */
const SENSITIVE_FIELDS = [
  'password',
  'password_hash',
  'passwordHash',
  'secret',
  'secret_key',
  'api_key',
  'apiKey',
  'token',
  'access_token',
  'refresh_token',
  'auth_token',
  'private_key',
  'privateKey',
  'credit_card',
  'creditCard',
  'cvv',
  'ssn',
  'social_security_number',
  'bank_account',
  'bankAccount',
  'pin',
  'otp',
  'verification_code',
  'verificationCode',
];

/**
 * Rekurencyjnie usuwa wrażliwe pola z obiektu
 */
function filterSensitiveData(obj, depth = 0, maxDepth = 10) {
  // Ochrona przed zbyt głęboką rekursją
  if (depth > maxDepth) {
    return obj;
  }

  if (obj === null || obj === undefined) {
    return obj;
  }

  // Jeśli to tablica, przefiltruj każdy element
  if (Array.isArray(obj)) {
    return obj.map(item => filterSensitiveData(item, depth + 1, maxDepth));
  }

  // Jeśli to obiekt, przefiltruj pola
  if (typeof obj === 'object') {
    const filtered = {};
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const lowerKey = key.toLowerCase();
        
        // Sprawdź czy pole jest wrażliwe
        const isSensitive = SENSITIVE_FIELDS.some(field => 
          lowerKey.includes(field.toLowerCase())
        );
        
        if (isSensitive) {
          // Zastąp wrażliwe pole placeholderem
          filtered[key] = '[REDACTED]';
        } else {
          // Rekurencyjnie przefiltruj wartość
          filtered[key] = filterSensitiveData(obj[key], depth + 1, maxDepth);
        }
      }
    }
    
    return filtered;
  }

  // Wartości prymitywne zwróć bez zmian
  return obj;
}

/**
 * Endpointy które muszą zwracać tokeny (logowanie, rejestracja, odświeżanie)
 */
const AUTH_TOKEN_ENDPOINTS = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/refresh',
];

/**
 * Middleware do filtrowania odpowiedzi
 */
const filterResponse = (req, res, next) => {
  // Zapisz oryginalną funkcję json
  const originalJson = res.json.bind(res);

  // Nadpisz funkcję json
  res.json = function(data) {
    // Nie filtruj tokenów dla endpointów auth - one MUSZĄ zwracać tokeny
    const isAuthEndpoint = AUTH_TOKEN_ENDPOINTS.some(ep => req.path === ep || req.originalUrl === ep);

    if (isAuthEndpoint) {
      return originalJson(data);
    }

    // Filtruj dane przed wysłaniem
    const filteredData = filterSensitiveData(data);

    // Wywołaj oryginalną funkcję z przefiltrowanymi danymi
    return originalJson(filteredData);
  };

  next();
};

/**
 * Funkcja do ręcznego filtrowania danych
 */
function sanitizeResponse(data) {
  return filterSensitiveData(data);
}

module.exports = {
  filterResponse,
  sanitizeResponse,
  filterSensitiveData,
  SENSITIVE_FIELDS,
};

