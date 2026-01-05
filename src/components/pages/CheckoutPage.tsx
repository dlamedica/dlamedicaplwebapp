import React, { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { createOrder, confirmOrderPayment } from '../../services/orderService';
import { Ebook } from '../../types/ebook';
import { useToast } from '../../hooks/useToast';
import { ToastContainer } from '../Toast';
import { usePushNotifications } from '../../hooks/usePushNotifications';
import { validateDiscountCode, calculateDiscountedPrice } from '../../services/discountService';
import { PersonalizationService } from '../../services/personalizationService';
import { EmailService } from '../../services/emailService';
import PurchaseProgressBar from '../games/PurchaseProgressBar';
import ExpiringRewardsAlert from '../games/ExpiringRewardsAlert';
import { LockIcon } from '../icons/LockIcon';
import { CreditCardIcon } from '../icons/CreditCardIcon';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import { SpinnerIcon } from '../icons/SpinnerIcon';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import { TagIcon } from '../icons/TagIcon';

interface CheckoutPageProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ darkMode, fontSize }) => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toasts, showSuccess, showError, removeToast } = useToast();
  const { showOrderConfirmation } = usePushNotifications();
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [discountMessage, setDiscountMessage] = useState<string | null>(null);

  // Formularz danych
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    country: 'Polska',
    payment_method: 'card' as 'card' | 'transfer' | 'blik',
  });

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          title: 'text-2xl',
          subtitle: 'text-lg',
          text: 'text-sm',
          button: 'text-sm',
        };
      case 'large':
        return {
          title: 'text-4xl',
          subtitle: 'text-2xl',
          text: 'text-lg',
          button: 'text-lg',
        };
      default:
        return {
          title: 'text-3xl',
          subtitle: 'text-xl',
          text: 'text-base',
          button: 'text-base',
        };
    }
  };

  const fontSizes = getFontSizeClasses();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
    }).format(price);
  };

  useEffect(() => {
    if (!user) {
      // Przekieruj do logowania jeśli użytkownik nie jest zalogowany
      window.history.pushState({}, '', '/logowanie?redirect=/sklep/checkout');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }, [user]);

  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        full_name: profile.full_name || prev.full_name,
        email: user?.email || prev.email,
      }));
    }
  }, [profile, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) {
      showError('Wprowadź kod rabatowy');
      return;
    }

    const totalPrice = getTotalPrice();
    const validation = validateDiscountCode(discountCode, totalPrice);

    if (validation.valid) {
      setAppliedDiscount(validation.discount);
      setDiscountMessage(validation.message || null);
      showSuccess(validation.message || 'Kod rabatowy zastosowany!');
    } else {
      setAppliedDiscount(0);
      setDiscountMessage(null);
      showError(validation.message || 'Nieprawidłowy kod rabatowy');
    }
  };

  const handleRemoveDiscount = () => {
    setDiscountCode('');
    setAppliedDiscount(0);
    setDiscountMessage(null);
  };

  const validateForm = (): boolean => {
    if (!formData.full_name.trim()) {
      setError('Proszę podać imię i nazwisko');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Proszę podać prawidłowy adres email');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    if (items.length === 0) {
      setError('Koszyk jest pusty');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: items.map((item) => ({
          ebook: item.ebook,
          quantity: item.quantity,
        })),
        payment_method: formData.payment_method,
        shipping_address: {
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone || undefined,
          address: formData.address || undefined,
          city: formData.city || undefined,
          postal_code: formData.postal_code || undefined,
          country: formData.country,
        },
      };

      const order = await createOrder(orderData);
      setOrderId(order.id);
      setOrderSuccess(true);
      
      // Aktualizuj preferencje personalizacji dla zakupionych produktów
      items.forEach(item => {
        PersonalizationService.updatePreferences('purchase', item.ebook.id);
      });
      
      clearCart();
      
      // Show push notification
      const finalTotal = appliedDiscount 
        ? getTotalPrice() - appliedDiscount
        : getTotalPrice();
      showOrderConfirmation(order.id, finalTotal);

      // Symulacja płatności (w rzeczywistej aplikacji tutaj byłaby integracja z systemem płatności)
      // Po potwierdzeniu płatności, przyznaj punkty i nagrody
      setTimeout(async () => {
        try {
          // W rzeczywistej aplikacji tutaj byłaby aktualizacja statusu płatności
          // Na razie symulujemy, że płatność została potwierdzona
          await confirmOrderPayment(order.id);
          console.log('Płatność zakończona pomyślnie, nagrody przyznane');
        } catch (err) {
          console.error('Błąd podczas przyznawania nagród:', err);
          // Nie pokazujemy błędu użytkownikowi, bo zamówienie już zostało utworzone
        }
      }, 2000);
    } catch (err: any) {
      console.error('Błąd podczas tworzenia zamówienia:', err);
      const errorMessage = err.message || 'Wystąpił błąd podczas przetwarzania zamówienia. Spróbuj ponownie.';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToCart = () => {
    window.history.pushState({}, '', '/sklep/koszyk');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handleBackToShop = () => {
    window.history.pushState({}, '', '/sklep');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  if (orderSuccess) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className={`text-center py-16 rounded-lg shadow-lg ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex justify-center mb-6">
              <CheckCircleIcon className="text-green-500" size={80} />
            </div>
            <h2 className={`${fontSizes.title} font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Zamówienie złożone pomyślnie!
            </h2>
            <p className={`${fontSizes.text} mb-2 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Numer zamówienia: <span className="font-bold">{orderId}</span>
            </p>
            <p className={`${fontSizes.text} mb-8 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Potwierdzenie zostało wysłane na adres: {formData.email}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  window.history.pushState({}, '', '/sklep/moje-zamowienia');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                  darkMode
                    ? 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
                    : 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
                } ${fontSizes.button}`}
              >
                Zobacz moje zamówienia
              </button>
              <button
                onClick={handleBackToShop}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                  darkMode
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                } ${fontSizes.button}`}
              >
                Powrót do sklepu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalPrice = getTotalPrice();
  const finalPrice = totalPrice - appliedDiscount;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBackToCart}
            className={`mb-4 flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              darkMode
                ? 'bg-gray-800 text-white hover:bg-gray-700'
                : 'bg-white text-gray-900 hover:bg-gray-100'
            }`}
          >
            <ArrowLeftIcon size={18} />
            Powrót do koszyka
          </button>
          <h1 className={`${fontSizes.title} font-bold mb-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Finalizacja zamówienia
          </h1>
          <p className={`${fontSizes.subtitle} ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Wypełnij formularz, aby zakończyć zakup
          </p>
        </div>

        {error && (
          <div className={`mb-6 p-4 rounded-lg ${
            darkMode ? 'bg-red-900 bg-opacity-30 border border-red-700' : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`${fontSizes.text} ${
              darkMode ? 'text-red-400' : 'text-red-600'
            }`}>
              {error}
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formularz */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className={`p-6 rounded-lg shadow-md ${
              darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <h2 className={`${fontSizes.subtitle} font-bold mb-6 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Dane do faktury
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className={`block mb-2 ${fontSizes.text} font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Imię i nazwisko *
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2 rounded-lg border transition-colors duration-200 ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-[#38b6ff]'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#38b6ff]'
                    } focus:outline-none focus:ring-2 focus:ring-[#38b6ff]`}
                  />
                </div>

                <div>
                  <label className={`block mb-2 ${fontSizes.text} font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2 rounded-lg border transition-colors duration-200 ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-[#38b6ff]'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#38b6ff]'
                    } focus:outline-none focus:ring-2 focus:ring-[#38b6ff]`}
                  />
                </div>

                <div>
                  <label className={`block mb-2 ${fontSizes.text} font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Telefon
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg border transition-colors duration-200 ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-[#38b6ff]'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#38b6ff]'
                    } focus:outline-none focus:ring-2 focus:ring-[#38b6ff]`}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block mb-2 ${fontSizes.text} font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Miasto
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg border transition-colors duration-200 ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-[#38b6ff]'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#38b6ff]'
                      } focus:outline-none focus:ring-2 focus:ring-[#38b6ff]`}
                    />
                  </div>

                  <div>
                    <label className={`block mb-2 ${fontSizes.text} font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Kod pocztowy
                    </label>
                    <input
                      type="text"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg border transition-colors duration-200 ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-[#38b6ff]'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#38b6ff]'
                      } focus:outline-none focus:ring-2 focus:ring-[#38b6ff]`}
                    />
                  </div>
                </div>
              </div>

              <h2 className={`${fontSizes.subtitle} font-bold mb-4 mt-8 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Metoda płatności
              </h2>

              <div className="space-y-3 mb-6">
                <label className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors duration-200 ${
                  formData.payment_method === 'card'
                    ? darkMode
                      ? 'bg-gray-700 border-[#38b6ff]'
                      : 'bg-blue-50 border-[#38b6ff]'
                    : darkMode
                    ? 'bg-gray-700 border-gray-600 hover:border-gray-500'
                    : 'bg-white border-gray-300 hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    name="payment_method"
                    value="card"
                    checked={formData.payment_method === 'card'}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <CreditCardIcon className="mr-3" size={20} />
                  <span className={`${fontSizes.text} ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Karta płatnicza
                  </span>
                </label>

                <label className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors duration-200 ${
                  formData.payment_method === 'transfer'
                    ? darkMode
                      ? 'bg-gray-700 border-[#38b6ff]'
                      : 'bg-blue-50 border-[#38b6ff]'
                    : darkMode
                    ? 'bg-gray-700 border-gray-600 hover:border-gray-500'
                    : 'bg-white border-gray-300 hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    name="payment_method"
                    value="transfer"
                    checked={formData.payment_method === 'transfer'}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <span className={`${fontSizes.text} ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Przelew bankowy
                  </span>
                </label>

                <label className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors duration-200 ${
                  formData.payment_method === 'blik'
                    ? darkMode
                      ? 'bg-gray-700 border-[#38b6ff]'
                      : 'bg-blue-50 border-[#38b6ff]'
                    : darkMode
                    ? 'bg-gray-700 border-gray-600 hover:border-gray-500'
                    : 'bg-white border-gray-300 hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    name="payment_method"
                    value="blik"
                    checked={formData.payment_method === 'blik'}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <span className={`${fontSizes.text} ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    BLIK
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || items.length === 0}
                className={`w-full px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2 ${
                  loading || items.length === 0
                    ? darkMode
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : darkMode
                    ? 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
                    : 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
                } ${fontSizes.button}`}
              >
                {loading ? (
                  <>
                    <SpinnerIcon size={18} />
                    Przetwarzanie...
                  </>
                ) : (
                  <>
                    <LockIcon size={18} />
                    Złóż zamówienie i zapłać {formatPrice(finalPrice)}
                  </>
                )}
              </button>

              <p className={`text-xs text-center mt-4 ${
                darkMode ? 'text-gray-500' : 'text-gray-500'
              }`}>
                <LockIcon className="inline mr-1" size={14} />
                Bezpieczna płatność • Twoje dane są chronione
              </p>
            </form>
          </div>

          {/* Podsumowanie */}
          <div className="lg:col-span-1">
            <div className={`sticky top-4 p-6 rounded-lg shadow-lg ${
              darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <h2 className={`${fontSizes.subtitle} font-bold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Podsumowanie zamówienia
              </h2>

              {/* Discount Code */}
              <div className="mb-6">
                <label className={`block mb-2 ${fontSizes.text} font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Kod rabatowy
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                    placeholder="Wprowadź kod"
                    className={`flex-1 px-4 py-2 rounded-lg border transition-colors duration-200 ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-[#38b6ff]'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#38b6ff]'
                    } focus:outline-none focus:ring-2 focus:ring-[#38b6ff]`}
                  />
                  {appliedDiscount > 0 ? (
                    <button
                      type="button"
                      onClick={handleRemoveDiscount}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                        darkMode
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-red-600 text-white hover:bg-red-700'
                      }`}
                    >
                      Usuń
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleApplyDiscount}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                        darkMode
                          ? 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
                          : 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
                      }`}
                    >
                      <TagIcon size={18} />
                    </button>
                  )}
                </div>
                {discountMessage && (
                  <p className={`mt-2 text-sm ${
                    appliedDiscount > 0
                      ? darkMode ? 'text-green-400' : 'text-green-600'
                      : darkMode ? 'text-red-400' : 'text-red-600'
                  }`}>
                    {discountMessage}
                  </p>
                )}
              </div>

              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.ebook.id} className="flex justify-between">
                    <div className="flex-1">
                      <p className={`${fontSizes.text} font-medium ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {item.ebook.title}
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {item.quantity} x {formatPrice(item.ebook.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-300 dark:border-gray-700 pt-3 mt-3">
                <div className="flex justify-between mb-2">
                  <span className={`${fontSizes.text} ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Produkty
                  </span>
                  <span className={`${fontSizes.text} font-semibold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between mb-2">
                    <span className={`${fontSizes.text} ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Zniżka
                    </span>
                    <span className={`${fontSizes.text} font-semibold ${
                      darkMode ? 'text-green-400' : 'text-green-600'
                    }`}>
                      -{formatPrice(appliedDiscount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between mb-2">
                  <span className={`${fontSizes.text} ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Dostawa
                  </span>
                  <span className={`${fontSizes.text} font-semibold ${
                    darkMode ? 'text-green-400' : 'text-green-600'
                  }`}>
                    Darmowa
                  </span>
                </div>
                <div className="flex justify-between mt-4 pt-4 border-t border-gray-300 dark:border-gray-700">
                  <span className={`${fontSizes.subtitle} font-bold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Razem
                  </span>
                  <span className={`${fontSizes.subtitle} font-bold ${
                    darkMode ? 'text-[#38b6ff]' : 'text-[#38b6ff]'
                  }`}>
                    {formatPrice(finalPrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Toast Notifications */}
        <ToastContainer toasts={toasts} onClose={removeToast} darkMode={darkMode} />
      </div>
    </div>
  );
};

export default CheckoutPage;

