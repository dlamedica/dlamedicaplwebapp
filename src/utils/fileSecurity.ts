// 🔒 BEZPIECZEŃSTWO: File Security - zabezpieczenia dla uploadów plików

/**
 * Dozwolone typy MIME dla różnych kategorii plików
 */
export const ALLOWED_FILE_TYPES = {
  documents: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
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
} as const;

/**
 * Maksymalne rozmiary plików (w bajtach)
 */
export const MAX_FILE_SIZES = {
  document: 10 * 1024 * 1024, // 10MB
  image: 5 * 1024 * 1024, // 5MB
  csv: 50 * 1024 * 1024, // 50MB
  default: 10 * 1024 * 1024, // 10MB
} as const;

/**
 * Niebezpieczne rozszerzenia plików (nigdy nie dozwolone)
 */
const DANGEROUS_EXTENSIONS = [
  '.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js', '.jar',
  '.app', '.deb', '.pkg', '.rpm', '.msi', '.dmg', '.sh', '.ps1', '.py',
  '.php', '.asp', '.aspx', '.jsp', '.html', '.htm', '.swf', '.fla',
];

/**
 * Niebezpieczne typy MIME (nigdy nie dozwolone)
 */
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

/**
 * Sprawdza czy rozszerzenie pliku jest niebezpieczne
 */
export function isDangerousExtension(filename: string): boolean {
  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return DANGEROUS_EXTENSIONS.includes(extension);
}

/**
 * Sprawdza czy typ MIME jest niebezpieczny
 */
export function isDangerousMimeType(mimeType: string): boolean {
  return DANGEROUS_MIME_TYPES.includes(mimeType.toLowerCase());
}

/**
 * Waliduje plik przed uploadem
 */
export interface FileValidationResult {
  valid: boolean;
  error?: string;
  sanitizedFilename?: string;
}

export function validateFile(
  file: File,
  allowedTypes: readonly string[],
  maxSize: number,
  category: 'documents' | 'images' | 'csv' = 'documents'
): FileValidationResult {
  // 1. Sprawdź rozszerzenie
  if (isDangerousExtension(file.name)) {
    return {
      valid: false,
      error: `Niebezpieczny typ pliku: ${file.name.substring(file.name.lastIndexOf('.'))}`,
    };
  }

  // 2. Sprawdź typ MIME
  if (isDangerousMimeType(file.type)) {
    return {
      valid: false,
      error: 'Niebezpieczny typ MIME pliku',
    };
  }

  // 3. Sprawdź czy typ MIME jest dozwolony
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Nieobsługiwany typ pliku. Dozwolone: ${allowedTypes.join(', ')}`,
    };
  }

  // 4. Sprawdź rozmiar
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `Plik jest za duży. Maksymalny rozmiar: ${maxSizeMB}MB`,
    };
  }

  // 5. Sprawdź czy plik nie jest pusty
  if (file.size === 0) {
    return {
      valid: false,
      error: 'Plik jest pusty',
    };
  }

  // 6. Sanityzuj nazwę pliku
  const sanitizedFilename = sanitizeFilename(file.name);

  return {
    valid: true,
    sanitizedFilename,
  };
}

/**
 * Sanityzuje nazwę pliku - usuwa niebezpieczne znaki
 */
export function sanitizeFilename(filename: string): string {
  // Usuń ścieżkę (tylko nazwa pliku)
  let sanitized = filename.split('/').pop()?.split('\\').pop() || filename;
  
  // Usuń niebezpieczne znaki
  sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, '_');
  
  // Usuń wielokrotne podkreślenia
  sanitized = sanitized.replace(/_+/g, '_');
  
  // Usuń podkreślenia na początku i końcu
  sanitized = sanitized.replace(/^_+|_+$/g, '');
  
  // Ogranicz długość (max 255 znaków)
  if (sanitized.length > 255) {
    const extension = sanitized.substring(sanitized.lastIndexOf('.'));
    const nameWithoutExt = sanitized.substring(0, sanitized.lastIndexOf('.'));
    sanitized = nameWithoutExt.substring(0, 255 - extension.length) + extension;
  }
  
  return sanitized;
}

/**
 * Sprawdza czy plik jest obrazem
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/') && ALLOWED_FILE_TYPES.images.includes(file.type);
}

/**
 * Sprawdza czy plik jest dokumentem
 */
export function isDocumentFile(file: File): boolean {
  return ALLOWED_FILE_TYPES.documents.includes(file.type);
}

/**
 * Sprawdza czy plik jest CSV
 */
export function isCSVFile(file: File): boolean {
  return ALLOWED_FILE_TYPES.csv.includes(file.type) || 
         file.name.toLowerCase().endsWith('.csv');
}

/**
 * Generuje bezpieczną nazwę pliku z timestampem i UUID
 */
export function generateSecureFilename(
  originalFilename: string,
  userId?: string,
  prefix?: string
): string {
  const sanitized = sanitizeFilename(originalFilename);
  const extension = sanitized.substring(sanitized.lastIndexOf('.'));
  const nameWithoutExt = sanitized.substring(0, sanitized.lastIndexOf('.'));
  
  const parts: string[] = [];
  if (prefix) parts.push(prefix);
  if (userId) parts.push(userId);
  parts.push(Date.now().toString());
  parts.push(nameWithoutExt || 'file');
  
  return parts.join('_') + extension;
}

/**
 * Sprawdza zawartość pliku (magic bytes) dla dodatkowej walidacji
 */
export async function validateFileContent(file: File, expectedMimeType: string): Promise<boolean> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      const bytes = new Uint8Array(arrayBuffer.slice(0, 4));
      
      // Magic bytes dla różnych typów plików
      const magicBytes: Record<string, number[][]> = {
        'application/pdf': [[0x25, 0x50, 0x44, 0x46]], // %PDF
        'image/jpeg': [[0xFF, 0xD8, 0xFF]],
        'image/png': [[0x89, 0x50, 0x4E, 0x47]],
        'image/gif': [[0x47, 0x49, 0x46, 0x38]], // GIF8
      };
      
      const expectedBytes = magicBytes[expectedMimeType];
      if (!expectedBytes) {
        // Nie mamy magic bytes dla tego typu - zaakceptuj
        resolve(true);
        return;
      }
      
      // Sprawdź czy magic bytes się zgadzają
      const matches = expectedBytes.some(pattern => {
        return pattern.every((byte, index) => bytes[index] === byte);
      });
      
      resolve(matches);
    };
    
    reader.onerror = () => resolve(false);
    reader.readAsArrayBuffer(file.slice(0, 4));
  });
}

