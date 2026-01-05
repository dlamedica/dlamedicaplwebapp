import { useState, useCallback } from 'react';
import { z } from 'zod';
import { validateWithZod, getFieldError, hasFormErrors } from '../utils/validation';

interface UseFormValidationOptions<T> {
  schema: z.ZodSchema<T>;
  onSubmit?: (data: T) => void | Promise<void>;
  initialValues?: Partial<T>;
}

interface FormValidationResult<T> {
  values: Partial<T>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
  setValue: (field: keyof T, value: unknown) => void;
  setError: (field: keyof T, message: string) => void;
  clearError: (field: keyof T) => void;
  validateField: (field: keyof T) => boolean;
  validateForm: () => boolean;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  reset: () => void;
  getFieldError: (field: keyof T) => string | undefined;
  isFieldTouched: (field: keyof T) => boolean;
  isFieldValid: (field: keyof T) => boolean;
}

/**
 * Hook do walidacji formularzy z Zod
 * 
 * @example
 * const { values, errors, setValue, handleSubmit } = useFormValidation({
 *   schema: registerSchema,
 *   onSubmit: async (data) => {
 *     await signUp(data.email, data.password);
 *   }
 * });
 */
export function useFormValidation<T extends Record<string, unknown>>({
  schema,
  onSubmit,
  initialValues = {},
}: UseFormValidationOptions<T>): FormValidationResult<T> {
  const [values, setValues] = useState<Partial<T>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback((field: keyof T, value: unknown) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Auto-validate on change if field was touched
    if (touched[field as string]) {
      validateField(field);
    }
  }, [touched]);

  const setError = useCallback((field: keyof T, message: string) => {
    setErrors((prev) => ({ ...prev, [field as string]: message }));
  }, []);

  const clearError = useCallback((field: keyof T) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field as string];
      return newErrors;
    });
  }, []);

  const validateField = useCallback((field: keyof T): boolean => {
    // Create a partial schema for just this field
    const fieldValue = values[field];
    const fieldSchema = schema.shape?.[field as string] as z.ZodTypeAny | undefined;

    if (!fieldSchema) {
      return true; // Field not in schema, assume valid
    }

    try {
      fieldSchema.parse(fieldValue);
      clearError(field);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        setError(field, firstError.message);
        return false;
      }
      return false;
    }
  }, [values, schema, setError, clearError]);

  const validateForm = useCallback((): boolean => {
    const result = validateWithZod(schema, values);
    setErrors(result.errors);
    
    // Mark all fields as touched
    const allFields = Object.keys(values);
    setTouched((prev) => {
      const newTouched = { ...prev };
      allFields.forEach((field) => {
        newTouched[field] = true;
      });
      return newTouched;
    });

    return result.success;
  }, [values, schema]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    setIsSubmitting(true);

    // Validate all fields
    const isValid = validateForm();

    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    try {
      // Parse to get typed data
      const validatedData = schema.parse(values) as T;
      
      if (onSubmit) {
        await onSubmit(validatedData);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      if (error instanceof z.ZodError) {
        const formErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          formErrors[path] = err.message;
        });
        setErrors(formErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [values, schema, validateForm, onSubmit]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const getFieldErrorHelper = useCallback((field: keyof T): string | undefined => {
    return getFieldError(errors, field as string);
  }, [errors]);

  const isFieldTouched = useCallback((field: keyof T): boolean => {
    return touched[field as string] || false;
  }, [touched]);

  const isFieldValid = useCallback((field: keyof T): boolean => {
    return !errors[field as string];
  }, [errors]);

  const isValid = !hasFormErrors(errors);

  return {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    setValue,
    setError,
    clearError,
    validateField,
    validateForm,
    handleSubmit,
    reset,
    getFieldError: getFieldErrorHelper,
    isFieldTouched,
    isFieldValid,
  };
}
