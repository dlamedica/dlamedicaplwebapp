import React, { useState, useEffect } from 'react';
import { FaSpinner, FaEye, FaChartLine, FaBox, FaShoppingBag, FaUsers, FaDollarSign } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { getUserOrders } from '../../services/orderService';
import AdvancedShopStats from '../admin/AdvancedShopStats';
import DataExport from '../admin/DataExport';

interface ShopAdminPanelProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const ShopAdminPanel: React.FC<ShopAdminPanelProps> = ({ darkMode, fontSize }) => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          title: 'text-2xl',
          subtitle: 'text-lg',
          text: 'text-sm',
        };
      case 'large':
        return {
          title: 'text-4xl',
          subtitle: 'text-2xl',
          text: 'text-lg',
        };
      default:
        return {
          title: 'text-3xl',
          subtitle: 'text-xl',
          text: 'text-base',
        };
    }
  };

  const fontSizes = getFontSizeClasses();

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      // Pobierz wszystkie zamówienia (w rzeczywistej aplikacji byłoby zapytanie do API admina)
      const orders = await getUserOrders();
      
      // Oblicz statystyki
      const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
      const uniqueCustomers = new Set(orders.map(order => order.user_id)).size;
      
      setStats({
        totalOrders: orders.length,
        totalRevenue,
        totalProducts: 10, // Mock - w rzeczywistej aplikacji z bazy danych
        totalCustomers: uniqueCustomers,
      });

      // Najnowsze zamówienia
      setRecentOrders(orders.slice(0, 10));
    } catch (error) {
      console.error('Błąd podczas ładowania danych admina:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-[#38b6ff] mx-auto mb-4" />
          <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Ładowanie danych...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`${fontSizes.title} font-bold mb-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Panel administracyjny sklepu
          </h1>
          <p className={`${fontSizes.subtitle} ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Przegląd statystyk i zamówień (tylko wgląd)
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`p-6 rounded-lg shadow-md ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`${fontSizes.text} font-semibold ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Zamówienia
              </h3>
              <FaShoppingBag className={`text-2xl ${
                darkMode ? 'text-[#38b6ff]' : 'text-[#38b6ff]'
              }`} />
            </div>
            <p className={`${fontSizes.subtitle} font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {stats.totalOrders}
            </p>
          </div>

          <div className={`p-6 rounded-lg shadow-md ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`${fontSizes.text} font-semibold ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Przychód
              </h3>
              <FaDollarSign className={`text-2xl ${
                darkMode ? 'text-green-400' : 'text-green-600'
              }`} />
            </div>
            <p className={`${fontSizes.subtitle} font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {formatPrice(stats.totalRevenue)}
            </p>
          </div>

          <div className={`p-6 rounded-lg shadow-md ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`${fontSizes.text} font-semibold ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Produkty
              </h3>
              <FaBox className={`text-2xl ${
                darkMode ? 'text-purple-400' : 'text-purple-600'
              }`} />
            </div>
            <p className={`${fontSizes.subtitle} font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {stats.totalProducts}
            </p>
          </div>

          <div className={`p-6 rounded-lg shadow-md ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`${fontSizes.text} font-semibold ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Klienci
              </h3>
              <FaUsers className={`text-2xl ${
                darkMode ? 'text-orange-400' : 'text-orange-600'
              }`} />
            </div>
            <p className={`${fontSizes.subtitle} font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {stats.totalCustomers}
            </p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className={`p-6 rounded-lg shadow-md ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <h2 className={`${fontSizes.subtitle} font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Najnowsze zamówienia
          </h2>
          
          {recentOrders.length === 0 ? (
            <p className={`${fontSizes.text} ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Brak zamówień
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <th className={`text-left py-3 px-4 ${fontSizes.text} font-semibold ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      ID
                    </th>
                    <th className={`text-left py-3 px-4 ${fontSizes.text} font-semibold ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Data
                    </th>
                    <th className={`text-left py-3 px-4 ${fontSizes.text} font-semibold ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Status
                    </th>
                    <th className={`text-left py-3 px-4 ${fontSizes.text} font-semibold ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Kwota
                    </th>
                    <th className={`text-left py-3 px-4 ${fontSizes.text} font-semibold ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Akcje
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className={`border-b ${
                      darkMode ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                      <td className={`py-3 px-4 ${fontSizes.text} ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        #{order.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className={`py-3 px-4 ${fontSizes.text} ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {formatDate(order.created_at)}
                      </td>
                      <td className={`py-3 px-4 ${fontSizes.text} ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          order.status === 'completed'
                            ? darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'
                            : order.status === 'processing'
                            ? darkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
                            : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className={`py-3 px-4 ${fontSizes.text} font-semibold ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {formatPrice(order.total_amount)}
                      </td>
                      <td className={`py-3 px-4 ${fontSizes.text}`}>
                        <button
                          onClick={() => {
                            // Tylko wgląd - przekieruj do szczegółów zamówienia
                            window.history.pushState({}, '', `/sklep/zamowienie/${order.id}`);
                            window.dispatchEvent(new PopStateEvent('popstate'));
                          }}
                          className={`px-3 py-1 rounded transition-colors ${
                            darkMode
                              ? 'bg-gray-700 text-white hover:bg-gray-600'
                              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                          }`}
                          title="Zobacz szczegóły (tylko wgląd)"
                        >
                          <FaEye />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className={`mt-6 p-4 rounded-lg ${
          darkMode ? 'bg-blue-900 bg-opacity-30 border border-blue-700' : 'bg-blue-50 border border-blue-200'
        }`}>
          <p className={`${fontSizes.text} ${
            darkMode ? 'text-blue-300' : 'text-blue-800'
          }`}>
            <strong>Uwaga:</strong> Panel administratora ma tylko uprawnienia do przeglądania danych. 
            Edycja produktów, zamówień i innych danych wymaga dodatkowych uprawnień.
          </p>
        </div>
      </div>

      {/* Advanced Stats */}
      <div className="mt-8">
        <AdvancedShopStats darkMode={darkMode} />
      </div>

      {/* Data Export */}
      <div className="mt-8">
        <DataExport
          darkMode={darkMode}
          data={recentOrders}
          dataType="orders"
        />
      </div>
    </div>
  );
};

export default ShopAdminPanel;

