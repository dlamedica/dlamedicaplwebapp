import { z } from 'zod';

/**
 * Schematy walidacji używające Zod
 * Centralne miejsce dla wszystkich schematów walidacji w aplikacji
 */

// ============================================
// WALIDACJA AUTORYZACJI
// ============================================

export const emailSchema = z
  .string()
  .min(1, 'Email jest wymagany')
  .email('Nieprawidłowy format email');

export const passwordSchema = z
  .string()
  .min(8, 'Hasło musi mieć minimum 8 znaków')
  .regex(/[A-Z]/, 'Hasło musi zawierać przynajmniej jedną wielką literę')
  .regex(/[a-z]/, 'Hasło musi zawierać przynajmniej jedną małą literę')
  .regex(/[0-9]/, 'Hasło musi zawierać przynajmniej jedną cyfrę')
  .regex(/[^A-Za-z0-9]/, 'Hasło musi zawierać przynajmniej jeden znak specjalny');

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Hasło jest wymagane'),
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Potwierdzenie hasła jest wymagane'),
  fullName: z
    .string()
    .min(2, 'Imię i nazwisko musi mieć minimum 2 znaki')
    .max(100, 'Imię i nazwisko może mieć maksimum 100 znaków')
    .regex(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-]+$/, 'Imię i nazwisko może zawierać tylko litery, spacje i myślniki'),
  isCompany: z.boolean().optional(),
  companyName: z.string().optional(),
  phone: z
    .string()
    .regex(/^[0-9+\s()-]{9,15}$/, 'Nieprawidłowy format numeru telefonu')
    .optional()
    .or(z.literal('')),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'Musisz zaakceptować regulamin',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Hasła nie są identyczne',
  path: ['confirmPassword'],
});

// ============================================
// WALIDACJA PROFILU
// ============================================

export const profileUpdateSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Imię i nazwisko musi mieć minimum 2 znaki')
    .max(100, 'Imię i nazwisko może mieć maksimum 100 znaków')
    .optional(),
  firstName: z.string().max(50, 'Imię może mieć maksimum 50 znaków').optional(),
  lastName: z.string().max(50, 'Nazwisko może mieć maksimum 50 znaków').optional(),
  phone: z
    .string()
    .regex(/^[0-9+\s()-]{9,15}$/, 'Nieprawidłowy format numeru telefonu')
    .optional()
    .or(z.literal('')),
  city: z.string().max(100, 'Miasto może mieć maksimum 100 znaków').optional(),
  bio: z.string().max(1000, 'Bio może mieć maksimum 1000 znaków').optional(),
  specialization: z.string().max(100, 'Specjalizacja może mieć maksimum 100 znaków').optional(),
});

// ============================================
// WALIDACJA OFERT PRACY
// ============================================

export const jobOfferSchema = z.object({
  company: z.string().min(1, 'Nazwa firmy jest wymagana').max(200, 'Nazwa firmy może mieć maksimum 200 znaków'),
  position: z.string().min(1, 'Stanowisko jest wymagane').max(200, 'Stanowisko może mieć maksimum 200 znaków'),
  contractType: z.enum(['umowa o pracę', 'umowa zlecenie', 'umowa o dzieło', 'praktyki', 'staż'], {
    errorMap: () => ({ message: 'Wybierz typ umowy' }),
  }),
  location: z.string().min(1, 'Lokalizacja jest wymagana').max(200, 'Lokalizacja może mieć maksimum 200 znaków'),
  category: z.string().min(1, 'Kategoria jest wymagana'),
  description: z
    .string()
    .min(50, 'Opis musi mieć minimum 50 znaków')
    .max(5000, 'Opis może mieć maksimum 5000 znaków'),
  salary: z.string().max(100, 'Wynagrodzenie może mieć maksimum 100 znaków').optional(),
  salaryType: z.enum(['brutto', 'netto', 'do negocjacji']).optional(),
  facilityType: z.string().optional(),
});

// ============================================
// WALIDACJA WYDARZEŃ
// ============================================

export const eventSchema = z.object({
  title: z.string().min(1, 'Tytuł jest wymagany').max(200, 'Tytuł może mieć maksimum 200 znaków'),
  description: z
    .string()
    .min(50, 'Opis musi mieć minimum 50 znaków')
    .max(5000, 'Opis może mieć maksimum 5000 znaków'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Nieprawidłowy format daty'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Nieprawidłowy format czasu'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Nieprawidłowy format czasu').optional(),
  location: z.string().max(200, 'Lokalizacja może mieć maksimum 200 znaków').optional(),
  onlineUrl: z.string().url('Nieprawidłowy format URL').optional().or(z.literal('')),
  contactEmail: z.string().email('Nieprawidłowy format email'),
  type: z.enum(['conference', 'webinar', 'workshop', 'symposium', 'other']),
  targetAudience: z.array(z.string()).min(1, 'Wybierz przynajmniej jedną grupę docelową'),
});

// ============================================
// WALIDACJA KONTAKTU
// ============================================

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Imię musi mieć minimum 2 znaki').max(100, 'Imię może mieć maksimum 100 znaków'),
  email: emailSchema,
  subject: z.string().min(3, 'Temat musi mieć minimum 3 znaki').max(200, 'Temat może mieć maksimum 200 znaków'),
  message: z
    .string()
    .min(10, 'Wiadomość musi mieć minimum 10 znaków')
    .max(2000, 'Wiadomość może mieć maksimum 2000 znaków'),
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Waliduje dane używając schematu Zod
 * Zwraca obiekt z success flag i errors
 */
export function validateWithZod<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: boolean; errors: Record<string, string>; data?: T } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, errors: {}, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { success: false, errors, data: undefined };
    }
    return { success: false, errors: { _general: 'Wystąpił błąd walidacji' }, data: undefined };
  }
}

/**
 * Safe parse - nie rzuca wyjątku
 */
export function safeParseWithZod<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: boolean; data?: T; error?: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}

/**
 * Pobiera pierwszą wiadomość błędu dla pola
 */
export function getFieldError(errors: Record<string, string>, field: string): string | undefined {
  return errors[field];
}

/**
 * Sprawdza czy formularz ma błędy
 */
export function hasFormErrors(errors: Record<string, string>): boolean {
  return Object.keys(errors).length > 0;
}

