import React, { useState, useEffect } from 'react';
import { FaDownload, FaSpinner, FaFileInvoice, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { getUserOrders, Order } from '../../services/orderService';
import { generateInvoiceData, generateInvoicePDF } from '../../services/invoiceService';
import { useToast } from '../../hooks/useToast';

interface OrderHistoryPageProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const OrderHistoryPage: React.FC<OrderHistoryPageProps> = ({ darkMode, fontSize }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError } = useToast();

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return <FaCheckCircle className="text-green-500" />;
      case 'processing':
        return <FaClock className="text-yellow-500" />;
      case 'cancelled':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Oczekujące';
      case 'processing':
        return 'W realizacji';
      case 'completed':
        return 'Zrealizowane';
      case 'cancelled':
        return 'Anulowane';
      case 'refunded':
        return 'Zwrócone';
      default:
        return status;
    }
  };

  useEffect(() => {
    if (!user) {
      window.history.pushState({}, '', '/logowanie?redirect=/sklep/moje-zamowienia');
      window.dispatchEvent(new PopStateEvent('popstate'));
      return;
    }

    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const userOrders = await getUserOrders();
      setOrders(userOrders);
    } catch (err: any) {
      console.error('Błąd podczas pobierania zamówień:', err);
      setError(err.message || 'Nie udało się pobrać zamówień');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async (order: Order) => {
    try {
      const invoiceData = generateInvoiceData(order);
      const pdfBlob = await generateInvoicePDF(invoiceData);
      
      // Utwórz link do pobrania
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `faktura-${invoiceData.invoiceNumber}.html`; // W rzeczywistości byłoby .pdf
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showSuccess('Faktura została pobrana');
    } catch (error: any) {
      console.error('Błąd podczas generowania faktury:', error);
      showError('Nie udało się wygenerować faktury');
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-[#38b6ff] mx-auto mb-4" />
          <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Ładowanie zamówień...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`${fontSizes.title} font-bold mb-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Moje zamówienia
          </h1>
          <p className={`${fontSizes.subtitle} ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Historia wszystkich Twoich zakupów
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

        {orders.length === 0 ? (
          <div className={`text-center py-16 rounded-lg ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}>
            <div className="flex justify-center mb-6">
              <FaFileInvoice 
                className={darkMode ? 'text-gray-600' : 'text-gray-400'}
                size={80}
              />
            </div>
            <h2 className={`${fontSizes.title} font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Brak zamówień
            </h2>
            <p className={`${fontSizes.text} mb-8 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Nie masz jeszcze żadnych zamówień. Rozpocznij zakupy w naszym sklepie!
            </p>
            <button
              onClick={() => {
                window.history.pushState({}, '', '/sklep');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                darkMode
                  ? 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
                  : 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
              } ${fontSizes.button}`}
            >
              Przejdź do sklepu
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className={`p-6 rounded-lg shadow-md ${
                  darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}
              >
                {/* Order Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 pb-4 border-b border-gray-300 dark:border-gray-700">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <button
                        onClick={() => handleDownloadInvoice(order)}
                        className={`p-2 rounded-lg transition-colors duration-200 ${
                          darkMode
                            ? 'text-gray-400 hover:text-[#38b6ff] hover:bg-gray-700'
                            : 'text-gray-600 hover:text-[#38b6ff] hover:bg-gray-100'
                        }`}
                        title="Pobierz fakturę"
                      >
                        <FaFileInvoice />
                      </button>
                      <h3 className={`${fontSizes.subtitle} font-bold ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        Zamówienie #{order.id.slice(0, 8).toUpperCase()}
                      </h3>
                    </div>
                    <p className={`${fontSizes.text} ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mt-4 md:mt-0">
                    {getStatusIcon(order.status)}
                    <span className={`${fontSizes.text} font-semibold ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex-1">
                        <p className={`${fontSizes.text} font-medium ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {item.ebook_title}
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {item.ebook_author} • Ilość: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`${fontSizes.text} font-semibold ${
                          darkMode ? 'text-[#38b6ff]' : 'text-[#38b6ff]'
                        }`}>
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between pt-4 border-t border-gray-300 dark:border-gray-700">
                  <div className="mb-4 md:mb-0">
                    <p className={`${fontSizes.text} ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Metoda płatności: <span className="font-semibold">{order.payment_method}</span>
                    </p>
                    <p className={`${fontSizes.text} ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Status płatności: <span className={`font-semibold ${
                        order.payment_status === 'paid'
                          ? darkMode ? 'text-green-400' : 'text-green-600'
                          : darkMode ? 'text-yellow-400' : 'text-yellow-600'
                      }`}>
                        {order.payment_status === 'paid' ? 'Opłacone' : 'Oczekujące'}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`${fontSizes.subtitle} font-bold ${
                      darkMode ? 'text-[#38b6ff]' : 'text-[#38b6ff]'
                    }`}>
                      {formatPrice(order.total_amount)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;

