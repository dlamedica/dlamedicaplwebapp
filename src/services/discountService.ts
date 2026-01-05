/**
 * Serwis do zarządzania kodami rabatowymi i promocjami
 */

export interface DiscountCode {
  code: string;
  type: 'percentage' | 'fixed';
  value: number; // Procent lub kwota w PLN
  minPurchase?: number; // Minimalna kwota zakupu
  maxDiscount?: number; // Maksymalna kwota zniżki (dla procentowych)
  validFrom: string;
  validTo: string;
  usageLimit?: number; // Limit użyć
  usedCount: number;
  isActive: boolean;
}

// Przykładowe kody rabatowe (w rzeczywistej aplikacji z bazy danych)
const mockDiscountCodes: DiscountCode[] = [
  {
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    validFrom: '2024-01-01',
    validTo: '2024-12-31',
    isActive: true,
    usedCount: 0,
  },
  {
    code: 'STUDENT20',
    type: 'percentage',
    value: 20,
    minPurchase: 100,
    validFrom: '2024-01-01',
    validTo: '2024-12-31',
    isActive: true,
    usedCount: 0,
  },
  {
    code: 'MEDIC50',
    type: 'fixed',
    value: 50,
    minPurchase: 200,
    validFrom: '2024-01-01',
    validTo: '2024-12-31',
    isActive: true,
    usedCount: 0,
  },
];

/**
 * Sprawdza czy kod rabatowy jest ważny i zwraca zniżkę
 */
export const validateDiscountCode = (
  code: string,
  totalAmount: number
): { valid: boolean; discount: number; message?: string } => {
  const discountCode = mockDiscountCodes.find(
    (dc) => dc.code.toUpperCase() === code.toUpperCase() && dc.isActive
  );

  if (!discountCode) {
    return {
      valid: false,
      discount: 0,
      message: 'Nieprawidłowy kod rabatowy',
    };
  }

  // Sprawdź daty ważności
  const now = new Date();
  const validFrom = new Date(discountCode.validFrom);
  const validTo = new Date(discountCode.validTo);

  if (now < validFrom || now > validTo) {
    return {
      valid: false,
      discount: 0,
      message: 'Kod rabatowy wygasł',
    };
  }

  // Sprawdź minimalną kwotę zakupu
  if (discountCode.minPurchase && totalAmount < discountCode.minPurchase) {
    return {
      valid: false,
      discount: 0,
      message: `Minimalna kwota zakupu: ${discountCode.minPurchase} PLN`,
    };
  }

  // Oblicz zniżkę
  let discount = 0;
  if (discountCode.type === 'percentage') {
    discount = (totalAmount * discountCode.value) / 100;
    if (discountCode.maxDiscount) {
      discount = Math.min(discount, discountCode.maxDiscount);
    }
  } else {
    discount = discountCode.value;
  }

  // Nie może być większa niż całkowita kwota
  discount = Math.min(discount, totalAmount);

  return {
    valid: true,
    discount,
    message: `Zniżka: ${discountCode.value}${discountCode.type === 'percentage' ? '%' : ' PLN'}`,
  };
};

/**
 * Oblicza cenę po zniżce
 */
export const calculateDiscountedPrice = (
  originalPrice: number,
  discount: number
): number => {
  return Math.max(0, originalPrice - discount);
};

