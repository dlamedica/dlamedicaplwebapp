// 🔒 BEZPIECZEŃSTWO: Secure Storage - bezpieczne przechowywanie danych w localStorage

/**
 * Utility do bezpiecznego przechowywania danych w localStorage
 * - Sanityzuje dane przed zapisem
 * - Waliduje dane przy odczycie
 * - Ogranicza przechowywanie wrażliwych danych
 */

// Lista kluczy, które NIE powinny być przechowywane w localStorage (zbyt wrażliwe)
const SENSITIVE_KEYS = [
  'password',
  'token',
  'secret',
  'key',
  'auth',
  'session',
  'credential',
];

/**
 * Sprawdza czy klucz nie zawiera wrażliwych danych
 */
function isSensitiveKey(key: string): boolean {
  const lowerKey = key.toLowerCase();
  return SENSITIVE_KEYS.some(sensitive => lowerKey.includes(sensitive));
}

/**
 * Sanityzuje wartość przed zapisem (usuwa potencjalnie niebezpieczne znaki)
 */
function sanitizeValue(value: any, key?: string): string {
  if (value === null || value === undefined) {
    return '';
  }
  
  // Konwertuj do JSON string
  const jsonString = JSON.stringify(value);
  
  // Sprawdź czy nie zawiera potencjalnie niebezpiecznych skryptów
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // onclick=, onerror=, etc.
    /eval\(/i,
    /expression\(/i,
  ];
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(jsonString)) {
      console.warn(`⚠️ Potencjalnie niebezpieczna wartość wykryta w localStorage: ${key || 'unknown'}`);
      throw new Error('Nieprawidłowa wartość - zawiera potencjalnie niebezpieczne dane');
    }
  }
  
  return jsonString;
}

/**
 * Waliduje wartość przy odczycie
 */
function validateValue(value: string, key: string): any {
  try {
    const parsed = JSON.parse(value);
    
    // Dodatkowa walidacja dla wrażliwych danych
    if (isSensitiveKey(key)) {
      console.warn(`⚠️ Próba odczytu wrażliwych danych z localStorage: ${key}`);
      // Nie zwracaj wartości - bezpieczniej
      return null;
    }
    
    return parsed;
  } catch (error) {
    console.error(`❌ Błąd parsowania wartości z localStorage dla klucza ${key}:`, error);
    return null;
  }
}

/**
 * Bezpieczne zapisanie do localStorage
 */
export function setSecureItem(key: string, value: any): boolean {
  try {
    // Sprawdź czy klucz nie jest wrażliwy
    if (isSensitiveKey(key)) {
      console.error(`❌ Próba zapisu wrażliwych danych do localStorage: ${key}`);
      return false;
    }
    
    // Sanityzuj wartość
    const sanitized = sanitizeValue(value, key);
    
    // Sprawdź rozmiar (localStorage ma limit ~5-10MB)
    if (sanitized.length > 5 * 1024 * 1024) {
      console.error(`❌ Wartość zbyt duża dla localStorage: ${key} (${sanitized.length} bytes)`);
      return false;
    }
    
    localStorage.setItem(key, sanitized);
    return true;
  } catch (error) {
    console.error(`❌ Błąd zapisu do localStorage dla klucza ${key}:`, error);
    return false;
  }
}

/**
 * Bezpieczne odczytanie z localStorage
 */
export function getSecureItem<T = any>(key: string): T | null {
  try {
    const value = localStorage.getItem(key);
    
    if (value === null) {
      return null;
    }
    
    // Waliduj wartość
    return validateValue(value, key) as T;
  } catch (error) {
    console.error(`❌ Błąd odczytu z localStorage dla klucza ${key}:`, error);
    return null;
  }
}

/**
 * Usunięcie z localStorage
 */
export function removeSecureItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`❌ Błąd usuwania z localStorage dla klucza ${key}:`, error);
  }
}

/**
 * Wyczyszczenie wszystkich bezpiecznych danych (zachowuje tylko nie-wrażliwe)
 */
export function clearSecureStorage(): void {
  try {
    const keysToKeep = ['theme', 'language', 'fontSize']; // Przykładowe klucze do zachowania
    
    const allKeys = Object.keys(localStorage);
    
    allKeys.forEach(key => {
      // Usuń tylko wrażliwe klucze
      if (isSensitiveKey(key) && !keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('❌ Błąd czyszczenia localStorage:', error);
  }
}

/**
 * Sprawdza czy localStorage jest dostępny i bezpieczny
 */
export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Pobiera rozmiar używanego localStorage
 */
export function getStorageSize(): { used: number; available: number } {
  try {
    let used = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length;
      }
    }
    
    // Przybliżony limit localStorage (zwykle 5-10MB)
    const available = 5 * 1024 * 1024; // 5MB
    
    return { used, available };
  } catch (error) {
    return { used: 0, available: 0 };
  }
}

