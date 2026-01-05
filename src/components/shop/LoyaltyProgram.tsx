import React, { useState, useEffect } from 'react';
import { FaStar, FaTrophy, FaGift } from 'react-icons/fa';
import { getUserLoyaltyPoints, getPointsHistory, LoyaltyPoints, PointsTransaction } from '../../services/loyaltyService';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';

interface LoyaltyProgramProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const LoyaltyProgram: React.FC<LoyaltyProgramProps> = ({ darkMode, fontSize }) => {
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyPoints | null>(null);
  const [history, setHistory] = useState<PointsTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { showError } = useToast();

  const fontSizes = {
    small: { title: 'text-xl', text: 'text-sm', button: 'text-sm' },
    medium: { title: 'text-2xl', text: 'text-base', button: 'text-base' },
    large: { title: 'text-3xl', text: 'text-lg', button: 'text-lg' },
  }[fontSize];

  useEffect(() => {
    if (user) {
      loadLoyaltyData();
    }
  }, [user]);

  const loadLoyaltyData = async () => {
    try {
      setLoading(true);
      const [points, transactions] = await Promise.all([
        getUserLoyaltyPoints(),
        getPointsHistory(),
      ]);
      setLoyaltyData(points);
      setHistory(transactions);
    } catch (error: any) {
      console.error('Error loading loyalty data:', error);
      showError('Nie udało się załadować danych programu lojalnościowego');
    } finally {
      setLoading(false);
    }
  };

  const getLevelInfo = (level: string) => {
    switch (level) {
      case 'platinum':
        return { name: 'Platyna', color: 'text-purple-500', icon: FaTrophy, discount: 15 };
      case 'gold':
        return { name: 'Złoto', color: 'text-yellow-500', icon: FaStar, discount: 10 };
      case 'silver':
        return { name: 'Srebro', color: 'text-gray-400', icon: FaStar, discount: 5 };
      default:
        return { name: 'Brąz', color: 'text-orange-600', icon: FaGift, discount: 0 };
    }
  };

  if (!user) {
    return (
      <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Zaloguj się, aby zobaczyć swój program lojalnościowy
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Ładowanie...
        </p>
      </div>
    );
  }

  if (!loyaltyData) {
    return null;
  }

  const levelInfo = getLevelInfo(loyaltyData.level);
  const LevelIcon = levelInfo.icon;

  return (
    <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className={`${fontSizes.title} font-bold mb-6 flex items-center gap-2 ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>
        <FaGift />
        Program lojalnościowy
      </h2>

      {/* Level Card */}
      <div className={`p-6 rounded-lg mb-6 ${
        darkMode ? 'bg-gray-700' : 'bg-gray-50'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <LevelIcon className={`text-4xl ${levelInfo.color}`} />
            <div>
              <p className={`${fontSizes.text} font-semibold ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Poziom: {levelInfo.name}
              </p>
              {levelInfo.discount > 0 && (
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Zniżka: {levelInfo.discount}%
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Points */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Dostępne punkty
            </p>
            <p className={`${fontSizes.subtitle} font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {loyaltyData.available_points}
            </p>
          </div>
          <div>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Wszystkie punkty
            </p>
            <p className={`${fontSizes.subtitle} font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {loyaltyData.total_points}
            </p>
          </div>
          <div>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Użyte punkty
            </p>
            <p className={`${fontSizes.subtitle} font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {loyaltyData.used_points}
            </p>
          </div>
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div>
          <h3 className={`${fontSizes.subtitle} font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Historia transakcji
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {history.slice(0, 10).map((transaction) => (
              <div
                key={transaction.id}
                className={`p-3 rounded-lg flex items-center justify-between ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}
              >
                <div>
                  <p className={`${fontSizes.text} ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {transaction.description}
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {new Date(transaction.created_at).toLocaleDateString('pl-PL')}
                  </p>
                </div>
                <p className={`${fontSizes.text} font-bold ${
                  transaction.points > 0
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}>
                  {transaction.points > 0 ? '+' : ''}{transaction.points}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoyaltyProgram;

