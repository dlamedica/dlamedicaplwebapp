// 🔒 BEZPIECZEŃSTWO: Validation Schemas - walidacja po stronie klienta z użyciem Zod

import { z } from 'zod';

/**
 * Schema dla emaila
 */
export const emailSchema = z.string()
  .email('Nieprawidłowy format email')
  .min(5, 'Email jest za krótki')
  .max(254, 'Email jest za długi')
  .toLowerCase()
  .trim();

/**
 * Schema dla hasła
 */
export const passwordSchema = z.string()
  .min(8, 'Hasło musi mieć minimum 8 znaków')
  .max(128, 'Hasło jest za długie')
  .regex(/[A-Z]/, 'Hasło musi zawierać co najmniej jedną wielką literę')
  .regex(/[a-z]/, 'Hasło musi zawierać co najmniej jedną małą literę')
  .regex(/[0-9]/, 'Hasło musi zawierać co najmniej jedną cyfrę')
  .regex(/[^A-Za-z0-9]/, 'Hasło musi zawierać co najmniej jeden znak specjalny');

/**
 * Schema dla UUID
 */
export const uuidSchema = z.string()
  .uuid('Nieprawidłowy format UUID')
  .trim();

/**
 * Schema dla nazwy użytkownika
 */
export const nameSchema = z.string()
  .min(2, 'Imię musi mieć minimum 2 znaki')
  .max(100, 'Imię jest za długie')
  .regex(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-]+$/, 'Imię może zawierać tylko litery, spacje i myślniki')
  .trim();

/**
 * Schema dla numeru telefonu
 */
export const phoneSchema = z.string()
  .regex(/^[\d\s\-\+\(\)]+$/, 'Nieprawidłowy format numeru telefonu')
  .min(9, 'Numer telefonu jest za krótki')
  .max(20, 'Numer telefonu jest za długi')
  .optional()
  .or(z.literal(''));

/**
 * Schema dla rejestracji użytkownika
 */
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  fullName: nameSchema.optional(),
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
  phone: phoneSchema,
  profession: z.string().optional(),
  studyField: z.string().optional(),
  isCompany: z.boolean().default(false),
  companyName: z.string().max(200).optional(),
  newsletterConsent: z.boolean().default(false),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Hasła nie są identyczne',
  path: ['confirmPassword'],
});

/**
 * Schema dla logowania
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Hasło jest wymagane'),
});

/**
 * Schema dla formularza oferty pracy
 */
export const jobOfferSchema = z.object({
  company: z.string()
    .min(2, 'Nazwa firmy jest wymagana')
    .max(100, 'Nazwa firmy jest za długa')
    .trim(),
  position: z.string()
    .min(2, 'Stanowisko jest wymagane')
    .max(100, 'Stanowisko jest za długie')
    .trim(),
  contractType: z.enum([
    'Umowa o pracę',
    'Umowa zlecenie',
    'Umowa o dzieło',
    'B2B',
    'Kontrakt',
    'Praktyki/Staż'
  ], {
    errorMap: () => ({ message: 'Nieprawidłowy typ umowy' })
  }),
  location: z.string()
    .min(2, 'Lokalizacja jest wymagana')
    .max(100, 'Lokalizacja jest za długa')
    .trim(),
  category: z.enum([
    'Lekarze',
    'Pielęgniarki',
    'Ratownicy',
    'Fizjoterapeuci',
    'Technicy',
    'Farmaceuci',
    'Inne'
  ], {
    errorMap: () => ({ message: 'Nieprawidłowa kategoria' })
  }),
  description: z.string()
    .min(10, 'Opis musi mieć minimum 10 znaków')
    .max(5000, 'Opis jest za długi')
    .trim(),
  salary: z.string().max(50).optional(),
  salaryType: z.string().max(50).optional(),
  facilityType: z.string().max(100).optional(),
  zamow_medyczny: z.boolean().default(false),
});

/**
 * Schema dla aplikacji na ofertę pracy
 */
export const jobApplicationSchema = z.object({
  job_offer_id: uuidSchema,
  candidate_name: nameSchema,
  candidate_email: emailSchema,
  candidate_phone: phoneSchema,
  cover_letter: z.string().max(2000).optional(),
  cv_url: z.string().url('Nieprawidłowy URL').optional(),
});

/**
 * Schema dla zamówienia
 */
export const orderSchema = z.object({
  items: z.array(z.object({
    ebook: z.string(),
    quantity: z.number().int().min(1).max(100),
  })).min(1, 'Koszyk nie może być pusty'),
  payment_method: z.enum(['card', 'transfer', 'blik', 'paypal']),
  shipping_address: z.object({
    full_name: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    address: z.string().max(200).optional(),
    city: z.string().max(100).optional(),
    postal_code: z.string().max(20).optional(),
    country: z.string().min(2).max(100),
  }),
});

/**
 * Schema dla wydarzenia
 */
export const eventSchema = z.object({
  title: z.string()
    .min(5, 'Tytuł musi mieć minimum 5 znaków')
    .max(200, 'Tytuł jest za długi')
    .trim(),
  description: z.string()
    .min(10, 'Opis musi mieć minimum 10 znaków')
    .max(5000, 'Opis jest za długi')
    .trim(),
  type: z.enum(['conference', 'workshop', 'webinar', 'course', 'other']),
  date: z.string().datetime('Nieprawidłowa data'),
  end_time: z.string().datetime().optional().nullable(),
  location: z.string().max(200).optional().nullable(),
  online_url: z.string().url('Nieprawidłowy URL').optional().nullable(),
  is_online: z.boolean(),
  max_participants: z.number().int().min(1).max(10000).optional().nullable(),
  registration_fee: z.number().min(0).max(100000).optional().nullable(),
  is_free: z.boolean(),
  contact_email: emailSchema,
  contact_phone: phoneSchema,
  registration_deadline: z.string().datetime().optional().nullable(),
  target_audience: z.string().max(500),
  speakers: z.string().max(1000).optional(),
  program: z.string().max(5000).optional(),
  certificates_available: z.boolean(),
  cme_points: z.number().int().min(0).max(1000).optional().nullable(),
});

/**
 * Schema dla komentarza/recenzji
 */
export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string()
    .min(10, 'Komentarz musi mieć minimum 10 znaków')
    .max(1000, 'Komentarz jest za długi')
    .trim(),
  product_id: z.string(),
});

/**
 * Helper function do walidacji z lepszymi komunikatami błędów
 */
export function validateWithSchema<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
} {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: { _general: 'Wystąpił błąd walidacji' } };
  }
}

/**
 * Safe parse - nie rzuca wyjątku
 */
export function safeParse<T>(schema: z.ZodSchema<T>, data: unknown): z.SafeParseReturnType<unknown, T> {
  return schema.safeParse(data);
}

