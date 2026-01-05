// 🔒 BEZPIECZEŃSTWO: Security Headers Helper - pomocnicze funkcje dla security headers po stronie klienta

/**
 * Sprawdza czy aplikacja działa przez HTTPS
 */
export function isHTTPS(): boolean {
  return window.location.protocol === 'https:';
}

/**
 * Sprawdza czy aplikacja jest w trybie produkcyjnym
 */
export function isProduction(): boolean {
  return import.meta.env.PROD || import.meta.env.MODE === 'production';
}

/**
 * Sprawdza czy aplikacja jest w trybie deweloperskim
 */
export function isDevelopment(): boolean {
  return import.meta.env.DEV || import.meta.env.MODE === 'development';
}

/**
 * Ostrzeżenie jeśli aplikacja nie używa HTTPS w produkcji
 */
export function checkHTTPS(): void {
  if (isProduction() && !isHTTPS()) {
    console.error('⚠️ BEZPIECZEŃSTWO: Aplikacja powinna działać przez HTTPS w produkcji!');
  }
}

/**
 * Sprawdza czy localStorage jest dostępny i bezpieczny
 */
export function checkStorageSecurity(): {
  localStorage: boolean;
  sessionStorage: boolean;
  cookies: boolean;
} {
  const result = {
    localStorage: false,
    sessionStorage: false,
    cookies: false,
  };

  try {
    // Test localStorage
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    result.localStorage = true;
  } catch (e) {
    console.warn('⚠️ localStorage nie jest dostępny:', e);
  }

  try {
    // Test sessionStorage
    const test = '__session_test__';
    sessionStorage.setItem(test, test);
    sessionStorage.removeItem(test);
    result.sessionStorage = true;
  } catch (e) {
    console.warn('⚠️ sessionStorage nie jest dostępny:', e);
  }

  // Cookies są zawsze dostępne (chyba że użytkownik je wyłączył)
  result.cookies = navigator.cookieEnabled;

  return result;
}

/**
 * Sprawdza czy przeglądarka obsługuje wymagane funkcje bezpieczeństwa
 */
export function checkBrowserSecurityFeatures(): {
  crypto: boolean;
  webCrypto: boolean;
  secureContext: boolean;
} {
  return {
    crypto: typeof crypto !== 'undefined',
    webCrypto: typeof crypto?.subtle !== 'undefined',
    secureContext: window.isSecureContext || false,
  };
}

/**
 * Inicjalizacja sprawdzeń bezpieczeństwa przy starcie aplikacji
 */
export function initializeSecurityChecks(): void {
  // Sprawdź HTTPS
  checkHTTPS();

  // Sprawdź storage
  const storage = checkStorageSecurity();
  if (!storage.localStorage || !storage.sessionStorage) {
    console.warn('⚠️ BEZPIECZEŃSTWO: Niektóre storage nie są dostępne');
  }

  // Sprawdź funkcje przeglądarki
  const features = checkBrowserSecurityFeatures();
  if (!features.secureContext) {
    console.warn('⚠️ BEZPIECZEŃSTWO: Aplikacja nie działa w secure context');
  }

  // Loguj w development
  if (isDevelopment()) {
    console.log('🔒 Security checks:', {
      https: isHTTPS(),
      production: isProduction(),
      storage,
      features,
    });
  }
}

