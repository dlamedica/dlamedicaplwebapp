// 🔒 BEZPIECZEŃSTWO: Production Logger - bezpieczne logowanie w produkcji

/**
 * Bezpieczne logowanie - nie ujawnia wrażliwych danych w produkcji
 */
class ProductionLogger {
  /**
   * Sprawdza czy jesteśmy w produkcji
   */
  static isProduction() {
    return process.env.NODE_ENV === 'production';
  }

  /**
   * Maskuje wrażliwe dane w logach
   */
  static maskSensitiveData(data) {
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    const sensitiveKeys = [
      'password',
      'token',
      'secret',
      'key',
      'apiKey',
      'accessToken',
      'refreshToken',
      'authorization',
      'cookie',
      'creditCard',
      'cvv',
      'ssn',
    ];

    const masked = Array.isArray(data) ? [...data] : { ...data };

    for (const key in masked) {
      if (masked.hasOwnProperty(key)) {
        const lowerKey = key.toLowerCase();
        const isSensitive = sensitiveKeys.some(sk => lowerKey.includes(sk.toLowerCase()));

        if (isSensitive && typeof masked[key] === 'string') {
          masked[key] = '[REDACTED]';
        } else if (typeof masked[key] === 'object' && masked[key] !== null) {
          masked[key] = this.maskSensitiveData(masked[key]);
        }
      }
    }

    return masked;
  }

  /**
   * Bezpieczne logowanie - maskuje wrażliwe dane w produkcji
   */
  static log(level, message, data = {}) {
    if (this.isProduction()) {
      // W produkcji maskuj wrażliwe dane
      const safeData = this.maskSensitiveData(data);
      console[level](message, safeData);
    } else {
      // W development pokaż wszystko
      console[level](message, data);
    }
  }

  /**
   * Log info
   */
  static info(message, data = {}) {
    this.log('info', message, data);
  }

  /**
   * Log warning
   */
  static warn(message, data = {}) {
    this.log('warn', message, data);
  }

  /**
   * Log error
   */
  static error(message, data = {}) {
    this.log('error', message, data);
  }

  /**
   * Log debug (tylko w development)
   */
  static debug(message, data = {}) {
    if (!this.isProduction()) {
      console.debug(message, data);
    }
  }
}

module.exports = ProductionLogger;

