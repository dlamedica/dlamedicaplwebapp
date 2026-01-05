// 🔒 BEZPIECZEŃSTWO: Environment Variables Validator - walidacja zmiennych środowiskowych
// PostgreSQL - używamy lokalnej bazy PostgreSQL

/**
 * Wymagane zmienne środowiskowe dla backendu
 */
const REQUIRED_ENV_VARS = {
  DB_HOST: {
    required: true,
    description: 'Host bazy danych PostgreSQL',
    default: 'localhost',
    validate: (value) => !!value,
  },
  DB_NAME: {
    required: true,
    description: 'Nazwa bazy danych PostgreSQL',
    default: 'dlamedica_db',
    validate: (value) => !!value,
  },
  DB_USER: {
    required: true,
    description: 'Użytkownik bazy danych PostgreSQL',
    default: 'dlamedica',
    validate: (value) => !!value,
  },
  DB_PASSWORD: {
    required: true,
    description: 'Hasło do bazy danych PostgreSQL',
    validate: (value) => !!value,
  },
  JWT_SECRET: {
    required: true,
    description: 'Sekretny klucz do podpisywania tokenów JWT',
    validate: (value) => {
      if (!value) return false;
      return value.length >= 32; // Minimum 32 znaki dla bezpieczeństwa
    },
  },
};

/**
 * Opcjonalne zmienne środowiskowe z walidacją
 */
const OPTIONAL_ENV_VARS = {
  PORT: {
    default: '3001',
    validate: (value) => {
      const port = parseInt(value, 10);
      return port > 0 && port < 65536;
    },
  },
  DB_PORT: {
    default: '5432',
    validate: (value) => {
      const port = parseInt(value, 10);
      return port > 0 && port < 65536;
    },
  },
  NODE_ENV: {
    default: 'development',
    validate: (value) => {
      return ['development', 'production', 'test'].includes(value);
    },
  },
  FRONTEND_URL: {
    default: 'http://localhost:5173',
    validate: (value) => {
      if (!value) return true;
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
  },
  JWT_EXPIRES_IN: {
    default: '7d',
    validate: (value) => {
      if (!value) return true;
      return /^\d+[smhd]$/.test(value) || /^\d+$/.test(value);
    },
  },
  JWT_REFRESH_EXPIRES_IN: {
    default: '30d',
    validate: (value) => {
      if (!value) return true;
      return /^\d+[smhd]$/.test(value) || /^\d+$/.test(value);
    },
  },
};

/**
 * Waliduje wszystkie zmienne środowiskowe
 */
function validateEnvironmentVariables() {
  const errors = [];
  const warnings = [];

  // Sprawdź wymagane zmienne
  for (const [key, config] of Object.entries(REQUIRED_ENV_VARS)) {
    let value = process.env[key];
    
    // Użyj wartości domyślnej jeśli jest dostępna
    if (!value && config.default) {
      process.env[key] = config.default;
      value = config.default;
      warnings.push(`⚠️ Użyto domyślnej wartości dla ${key}: ${config.default}`);
    }
    
    if (!value && config.required) {
      errors.push(`❌ WYMAGANE: ${key} - ${config.description}`);
      continue;
    }

    if (value && config.validate && !config.validate(value)) {
      errors.push(`❌ NIEPRAWIDŁOWE: ${key} - wartość nie przechodzi walidacji`);
    }
  }

  // Sprawdź opcjonalne zmienne
  for (const [key, config] of Object.entries(OPTIONAL_ENV_VARS)) {
    const value = process.env[key];
    
    if (!value && config.default) {
      process.env[key] = config.default;
      continue; // Nie loguj domyślnych wartości dla opcjonalnych
    }

    if (value && config.validate && !config.validate(value)) {
      warnings.push(`⚠️ NIEPRAWIDŁOWE: ${key} - wartość może być nieprawidłowa`);
    }
  }

  return { errors, warnings };
}

/**
 * Inicjalizuje i waliduje zmienne środowiskowe przy starcie
 */
function initializeEnvironment() {
  console.log('🔍 Walidacja zmiennych środowiskowych...');
  
  const { errors, warnings } = validateEnvironmentVariables();

  if (warnings.length > 0) {
    console.warn('\n⚠️ OSTRZEŻENIA:');
    warnings.forEach(warning => console.warn(warning));
  }

  if (errors.length > 0) {
    console.error('\n❌ BŁĘDY KONFIGURACJI:');
    errors.forEach(error => console.error(error));
    console.error('\n💡 Aby naprawić, ustaw wymagane zmienne środowiskowe:');
    console.error('   DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, JWT_SECRET');
    throw new Error('Invalid environment configuration');
  }

  console.log('✅ Wszystkie wymagane zmienne środowiskowe są poprawne\n');
}

module.exports = {
  validateEnvironmentVariables,
  initializeEnvironment,
  REQUIRED_ENV_VARS,
  OPTIONAL_ENV_VARS,
};
