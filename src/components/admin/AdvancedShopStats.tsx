import React, { useState, useEffect } from 'react';
import { FaChartLine, FaUsers, FaShoppingCart, FaDollarSign, FaArrowUp, FaArrowDown, FaCalendar } from 'react-icons/fa';
import { mockEbooks } from '../../data/mockEbooks';

interface AdvancedShopStatsProps {
  darkMode: boolean;
}

interface StatData {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  conversionRate: number;
  revenueChange: number;
  ordersChange: number;
  customersChange: number;
  topProducts: Array<{ id: string; title: string; sales: number; revenue: number }>;
  salesByCategory: Array<{ category: string; sales: number; revenue: number }>;
  salesByDay: Array<{ date: string; sales: number; revenue: number }>;
}

const AdvancedShopStats: React.FC<AdvancedShopStatsProps> = ({ darkMode }) => {
  const [stats, setStats] = useState<StatData | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Symulacja pobierania danych
    const loadStats = async () => {
      setLoading(true);
      
      // Symulacja opóźnienia API
      await new Promise(resolve => setTimeout(resolve, 500));

      // Generuj mockowe dane
      const mockStats: StatData = {
        totalRevenue: 125000,
        totalOrders: 450,
        totalCustomers: 320,
        averageOrderValue: 277.78,
        conversionRate: 3.2,
        revenueChange: 12.5,
        ordersChange: 8.3,
        customersChange: 15.2,
        topProducts: mockEbooks.slice(0, 5).map((ebook, index) => ({
          id: ebook.id,
          title: ebook.title,
          sales: Math.floor(Math.random() * 100) + 20,
          revenue: (Math.floor(Math.random() * 100) + 20) * ebook.price,
        })),
        salesByCategory: [
          { category: 'Anatomia', sales: 120, revenue: 36000 },
          { category: 'Farmakologia', sales: 95, revenue: 28500 },
          { category: 'Chirurgia', sales: 80, revenue: 32000 },
          { category: 'Kardiologia', sales: 65, revenue: 19500 },
          { category: 'Neurologia', sales: 50, revenue: 15000 },
        ],
        salesByDay: Array.from({ length: 30 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (29 - i));
          return {
            date: date.toISOString().split('T')[0],
            sales: Math.floor(Math.random() * 20) + 5,
            revenue: (Math.floor(Math.random() * 20) + 5) * 250,
          };
        }),
      };

      setStats(mockStats);
      setLoading(false);
    };

    loadStats();
  }, [timeRange]);

  if (loading || !stats) {
    return (
      <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
    }).format(value);
  };

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    format = (v: number) => v.toString() 
  }: {
    title: string;
    value: number;
    change?: number;
    icon: React.ComponentType<{ className?: string }>;
    format?: (value: number) => string;
  }) => (
    <div className={`p-4 rounded-lg ${
      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <Icon className={darkMode ? 'text-gray-400' : 'text-gray-600'} size={20} />
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs ${
            change >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {change >= 0 ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
            <span>{Math.abs(change).toFixed(1)}%</span>
          </div>
        )}
      </div>
      <h3 className={`text-sm font-medium mb-1 ${
        darkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        {title}
      </h3>
      <p className={`text-2xl font-bold ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>
        {format(value)}
      </p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Zaawansowane statystyki
        </h2>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d' | 'all')}
            className={`px-4 py-2 rounded-lg border ${
              darkMode
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="7d">Ostatnie 7 dni</option>
            <option value="30d">Ostatnie 30 dni</option>
            <option value="90d">Ostatnie 90 dni</option>
            <option value="all">Wszystkie</option>
          </select>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Całkowity przychód"
          value={stats.totalRevenue}
          change={stats.revenueChange}
          icon={FaDollarSign}
          format={formatCurrency}
        />
        <StatCard
          title="Zamówienia"
          value={stats.totalOrders}
          change={stats.ordersChange}
          icon={FaShoppingCart}
        />
        <StatCard
          title="Klienci"
          value={stats.totalCustomers}
          change={stats.customersChange}
          icon={FaUsers}
        />
        <StatCard
          title="Średnia wartość zamówienia"
          value={stats.averageOrderValue}
          icon={FaChartLine}
          format={formatCurrency}
        />
      </div>

      {/* Conversion Rate */}
      <div className={`p-4 rounded-lg ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Współczynnik konwersji
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className={`h-4 rounded-full overflow-hidden ${
              darkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <div
                className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                style={{ width: `${stats.conversionRate}%` }}
              />
            </div>
          </div>
          <span className={`text-2xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {stats.conversionRate}%
          </span>
        </div>
      </div>

      {/* Top Products */}
      <div className={`p-4 rounded-lg ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Najlepiej sprzedające się produkty
        </h3>
        <div className="space-y-3">
          {stats.topProducts.map((product, index) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-opacity-50 transition-colors duration-200"
              style={{
                backgroundColor: darkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 0.5)',
              }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <p className={`font-semibold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {product.title}
                  </p>
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {product.sales} sprzedaży
                  </p>
                </div>
              </div>
              <span className={`font-bold ${
                darkMode ? 'text-[#38b6ff]' : 'text-[#38b6ff]'
              }`}>
                {formatCurrency(product.revenue)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sales by Category */}
      <div className={`p-4 rounded-lg ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Sprzedaż według kategorii
        </h3>
        <div className="space-y-3">
          {stats.salesByCategory.map((category) => {
            const maxRevenue = Math.max(...stats.salesByCategory.map(c => c.revenue));
            const percentage = (category.revenue / maxRevenue) * 100;
            
            return (
              <div key={category.category}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-medium ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {category.category}
                  </span>
                  <span className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {category.sales} sprzedaży • {formatCurrency(category.revenue)}
                  </span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sales Chart */}
      <div className={`p-4 rounded-lg ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Sprzedaż w czasie
        </h3>
        <div className="h-64 flex items-end gap-1">
          {stats.salesByDay.map((day, index) => {
            const maxRevenue = Math.max(...stats.salesByDay.map(d => d.revenue));
            const height = (day.revenue / maxRevenue) * 100;
            
            return (
              <div
                key={index}
                className="flex-1 group relative"
                title={`${day.date}: ${formatCurrency(day.revenue)}`}
              >
                <div
                  className={`w-full rounded-t transition-all duration-200 ${
                    darkMode
                      ? 'bg-gradient-to-t from-blue-600 to-blue-400'
                      : 'bg-gradient-to-t from-blue-500 to-blue-300'
                  } group-hover:opacity-80`}
                  style={{ height: `${height}%` }}
                />
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
          <FaCalendar size={14} />
          <span>Ostatnie 30 dni</span>
        </div>
      </div>
    </div>
  );
};

export default AdvancedShopStats;

