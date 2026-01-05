// 🔒 BEZPIECZEŃSTWO: File Validation Middleware - walidacja uploadów plików

const SecurityLogger = require('./securityLogger');
const multer = require('multer');
const path = require('path');

// Niebezpieczne rozszerzenia plików
const DANGEROUS_EXTENSIONS = [
  '.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js', '.jar',
  '.app', '.deb', '.pkg', '.rpm', '.msi', '.dmg', '.sh', '.ps1', '.py',
  '.php', '.asp', '.aspx', '.jsp', '.html', '.htm', '.swf', '.fla',
];

// Niebezpieczne typy MIME
const DANGEROUS_MIME_TYPES = [
  'application/x-executable',
  'application/x-msdownload',
  'application/x-sh',
  'application/x-shellscript',
  'text/x-shellscript',
  'application/javascript',
  'application/x-javascript',
  'text/javascript',
];

// Dozwolone typy plików dla różnych kategorii
const ALLOWED_TYPES = {
  documents: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  images: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ],
  csv: [
    'text/csv',
    'application/vnd.ms-excel',
    'text/plain',
  ],
};

// Maksymalne rozmiary plików (w bajtach)
const MAX_SIZES = {
  document: 10 * 1024 * 1024, // 10MB
  image: 5 * 1024 * 1024, // 5MB
  csv: 50 * 1024 * 1024, // 50MB
  default: 10 * 1024 * 1024, // 10MB
};

/**
 * Sprawdza czy rozszerzenie jest niebezpieczne
 */
function isDangerousExtension(filename) {
  const ext = path.extname(filename).toLowerCase();
  return DANGEROUS_EXTENSIONS.includes(ext);
}

/**
 * Sprawdza czy typ MIME jest niebezpieczny
 */
function isDangerousMimeType(mimeType) {
  return DANGEROUS_MIME_TYPES.includes(mimeType.toLowerCase());
}

/**
 * Sanityzuje nazwę pliku
 */
function sanitizeFilename(filename) {
  // Usuń ścieżkę
  let sanitized = path.basename(filename);
  
  // Usuń niebezpieczne znaki
  sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, '_');
  
  // Usuń wielokrotne podkreślenia
  sanitized = sanitized.replace(/_+/g, '_');
  
  // Usuń podkreślenia na początku i końcu
  sanitized = sanitized.replace(/^_+|_+$/g, '');
  
  // Ogranicz długość
  if (sanitized.length > 255) {
    const ext = path.extname(sanitized);
    const nameWithoutExt = path.basename(sanitized, ext);
    sanitized = nameWithoutExt.substring(0, 255 - ext.length) + ext;
  }
  
  return sanitized;
}

/**
 * Middleware do walidacji uploadów plików
 */
const validateFileUpload = (category = 'documents', maxSize = null) => {
  const allowedTypes = ALLOWED_TYPES[category] || ALLOWED_TYPES.documents;
  const maxFileSize = maxSize || MAX_SIZES[category] || MAX_SIZES.default;

  return (req, res, next) => {
    if (!req.file && !req.files) {
      return next(); // Brak pliku - nie waliduj
    }

    const files = req.files ? (Array.isArray(req.files) ? req.files : [req.files]) : [req.file];
    
    for (const file of files) {
      if (!file) continue;

      // 1. Sprawdź rozszerzenie
      if (isDangerousExtension(file.originalname)) {
        SecurityLogger.logInjectionAttempt(req, 'DANGEROUS_FILE_EXTENSION', {
          filename: file.originalname,
          extension: path.extname(file.originalname),
        });
        return res.status(400).json({
          error: 'Niebezpieczny typ pliku',
          message: `Rozszerzenie ${path.extname(file.originalname)} nie jest dozwolone`,
        });
      }

      // 2. Sprawdź typ MIME
      if (isDangerousMimeType(file.mimetype)) {
        SecurityLogger.logInjectionAttempt(req, 'DANGEROUS_MIME_TYPE', {
          filename: file.originalname,
          mimetype: file.mimetype,
        });
        return res.status(400).json({
          error: 'Niebezpieczny typ MIME',
          message: `Typ MIME ${file.mimetype} nie jest dozwolony`,
        });
      }

      // 3. Sprawdź czy typ jest dozwolony
      if (!allowedTypes.includes(file.mimetype)) {
        SecurityLogger.logSuspiciousActivity(req, 'INVALID_FILE_TYPE', {
          filename: file.originalname,
          mimetype: file.mimetype,
          allowed: allowedTypes,
        });
        return res.status(400).json({
          error: 'Nieobsługiwany typ pliku',
          message: `Dozwolone typy: ${allowedTypes.join(', ')}`,
        });
      }

      // 4. Sprawdź rozmiar
      if (file.size > maxFileSize) {
        const maxSizeMB = (maxFileSize / (1024 * 1024)).toFixed(2);
        return res.status(400).json({
          error: 'Plik jest za duży',
          message: `Maksymalny rozmiar: ${maxSizeMB}MB`,
        });
      }

      // 5. Sprawdź czy plik nie jest pusty
      if (file.size === 0) {
        return res.status(400).json({
          error: 'Plik jest pusty',
        });
      }

      // 6. Sanityzuj nazwę pliku
      file.originalname = sanitizeFilename(file.originalname);
    }

    next();
  };
};

/**
 * Konfiguracja Multer z bezpiecznym storage
 */
const storage = multer.memoryStorage(); // Użyj memory storage dla większej kontroli

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_SIZES.default,
    files: 5, // Maksymalnie 5 plików
  },
  fileFilter: (req, file, cb) => {
    // Podstawowa walidacja przed zapisem
    if (isDangerousExtension(file.originalname)) {
      return cb(new Error('Niebezpieczny typ pliku'));
    }
    cb(null, true);
  },
});

module.exports = {
  validateFileUpload,
  upload,
  sanitizeFilename,
  isDangerousExtension,
  isDangerousMimeType,
  ALLOWED_TYPES,
  MAX_SIZES,
};

