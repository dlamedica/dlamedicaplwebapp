import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaHeart, FaEye, FaStar, FaTrophy } from 'react-icons/fa';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useViewedProducts } from '../../hooks/useViewedProducts';
import { PersonalizationService } from '../../services/personalizationService';

interface UserStatsProps {
  darkMode: boolean;
}

const UserStats: React.FC<UserStatsProps> = ({ darkMode }) => {
  const { getTotalItems, getTotalPrice } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { viewedProducts } = useViewedProducts();
  const [stats, setStats] = useState({
    totalPurchases: 0,
    totalSpent: 0,
    averageOrderValue: 0,
    favoriteCategory: '',
    loyaltyPoints: 0,
  });

  useEffect(() => {
    // Pobierz statystyki użytkownika
    const preferences = PersonalizationService.getUserPreferences();
    const purchasedProducts = preferences.purchasedProducts;
    
    // Symulacja danych - w rzeczywistości z API
    const mockStats = {
      totalPurchases: purchasedProducts.length,
      totalSpent: purchasedProducts.length * 150, // Średnia wartość zamówienia
      averageOrderValue: purchasedProducts.length > 0 ? 150 : 0,
      favoriteCategory: preferences.preferredCategories[0] || 'Brak',
      loyaltyPoints: purchasedProducts.length * 10, // 10 punktów za zakup
    };

    setStats(mockStats);
  }, []);

  const StatCard = ({ 
    icon: Icon, 
    title, 
    value, 
    subtitle 
  }: { 
    icon: React.ComponentType<{ className?: string }>; 
    title: string; 
    value: string | number; 
    subtitle?: string;
  }) => (
    <div className={`p-4 rounded-lg ${
      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
    }`}>
      <div className="flex items-center gap-3 mb-2">
        <Icon className={darkMode ? 'text-[#38b6ff]' : 'text-[#38b6ff]'} size={20} />
        <h3 className={`font-semibold ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {title}
        </h3>
      </div>
      <p className={`text-2xl font-bold ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>
        {value}
      </p>
      {subtitle && (
        <p className={`text-sm mt-1 ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {subtitle}
        </p>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>
        Twoje statystyki
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={FaShoppingCart}
          title="Produkty w koszyku"
          value={getTotalItems()}
          subtitle={`Wartość: ${new Intl.NumberFormat('pl-PL', {
            style: 'currency',
            currency: 'PLN',
          }).format(getTotalPrice())}`}
        />
        <StatCard
          icon={FaHeart}
          title="Lista życzeń"
          value={wishlistItems.length}
          subtitle="Zapisane produkty"
        />
        <StatCard
          icon={FaEye}
          title="Ostatnio przeglądane"
          value={viewedProducts.length}
          subtitle="Produkty"
        />
        <StatCard
          icon={FaShoppingCart}
          title="Zakupy"
          value={stats.totalPurchases}
          subtitle={`Średnia wartość: ${new Intl.NumberFormat('pl-PL', {
            style: 'currency',
            currency: 'PLN',
          }).format(stats.averageOrderValue)}`}
        />
        <StatCard
          icon={FaStar}
          title="Wydane łącznie"
          value={new Intl.NumberFormat('pl-PL', {
            style: 'currency',
            currency: 'PLN',
          }).format(stats.totalSpent)}
          subtitle="Wszystkie zamówienia"
        />
        <StatCard
          icon={FaTrophy}
          title="Punkty lojalnościowe"
          value={stats.loyaltyPoints}
          subtitle={`Ulubiona kategoria: ${stats.favoriteCategory}`}
        />
      </div>
    </div>
  );
};

export default UserStats;

