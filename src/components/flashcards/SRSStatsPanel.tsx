import React, { useState, useEffect } from 'react';
import { 
  FaChartLine, 
  FaFire, 
  FaCalendarAlt, 
  FaCheckCircle, 
  FaTimesCircle,
  FaClock,
  FaTrophy
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { calculateSRSStats, calculateHeatmap, type SRSProgress, type SRSStats, type HeatmapData } from '../../services/srsService';

interface SRSStatsPanelProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  totalCards: number;
  onClose?: () => void;
}

const SRSStatsPanel: React.FC<SRSStatsPanelProps> = ({ 
  darkMode, 
  fontSize, 
  totalCards,
  onClose 
}) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<SRSStats | null>(null);
  const [heatmap, setHeatmap] = useState<HeatmapData[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('year');

  useEffect(() => {
    if (!user) return;

    // Load progress from localStorage (w produkcji z API)
    const savedProgress = localStorage.getItem(`srs_progress_${user.id}`);
    if (savedProgress) {
      const progressData: SRSProgress[] = JSON.parse(savedProgress).map((p: any) => ({
        ...p,
        nextReview: new Date(p.nextReview),
        lastReview: p.lastReview ? new Date(p.lastReview) : undefined
      }));

      const calculatedStats = calculateSRSStats(progressData, totalCards);
      setStats(calculatedStats);

      const days = selectedPeriod === 'week' ? 7 : selectedPeriod === 'month' ? 30 : 365;
      const heatmapData = calculateHeatmap(progressData, days);
      setHeatmap(heatmapData);
    } else {
      // Initialize empty stats
      const emptyStats = calculateSRSStats([], totalCards);
      setStats(emptyStats);
      setHeatmap([]);
    }
  }, [user, totalCards, selectedPeriod]);

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small': return { title: 'text-xl', subtitle: 'text-lg', text: 'text-sm', button: 'text-sm' };
      case 'large': return { title: 'text-3xl', subtitle: 'text-xl', text: 'text-lg', button: 'text-lg' };
      default: return { title: 'text-2xl', subtitle: 'text-lg', text: 'text-base', button: 'text-base' };
    }
  };
  const fontSizes = getFontSizeClasses();

  if (!stats) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#38b6ff]"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          {onClose && (
            <button
              onClick={onClose}
              className={`mb-4 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              ← Powrót
            </button>
          )}
          <h1 className={`${fontSizes.title} font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Statystyki SRS
          </h1>
          <p className={`${fontSizes.subtitle} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Analiza Twojego postępu w nauce
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="flex items-center justify-between mb-2">
              <FaChartLine className="text-[#38b6ff]" size={24} />
              <span className={`text-2xl font-bold text-[#38b6ff]`}>{stats.totalCards}</span>
            </div>
            <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Wszystkie karty</p>
          </div>

          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="flex items-center justify-between mb-2">
              <FaFire className="text-orange-500" size={24} />
              <span className={`text-2xl font-bold text-orange-500`}>{stats.newCards}</span>
            </div>
            <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Nowe karty</p>
          </div>

          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="flex items-center justify-between mb-2">
              <FaCheckCircle className="text-green-500" size={24} />
              <span className={`text-2xl font-bold text-green-500`}>{stats.masteredCards}</span>
            </div>
            <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Opanowane</p>
          </div>

          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="flex items-center justify-between mb-2">
              <FaTrophy className="text-yellow-500" size={24} />
              <span className={`text-2xl font-bold text-yellow-500`}>{stats.retentionRate.toFixed(1)}%</span>
            </div>
            <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Retencja</p>
          </div>
        </div>

        {/* Due Cards */}
        <div className={`mb-8 p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h2 className={`${fontSizes.subtitle} font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Karty do powtórki
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Dzisiaj</p>
              <p className={`${fontSizes.subtitle} font-bold text-orange-500`}>{stats.cardsDueToday}</p>
            </div>
            <div className="text-center">
              <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Jutro</p>
              <p className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {stats.cardsDueTomorrow}
              </p>
            </div>
            <div className="text-center">
              <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Ten tydzień</p>
              <p className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {stats.cardsDueThisWeek}
              </p>
            </div>
          </div>
        </div>

        {/* Heatmap */}
        <div className={`mb-8 p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`${fontSizes.subtitle} font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Heatmap aktywności
            </h2>
            <div className="flex gap-2">
              {['week', 'month', 'year'].map(period => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period as any)}
                  className={`px-3 py-1 rounded text-xs ${
                    selectedPeriod === period
                      ? 'bg-[#38b6ff] text-white'
                      : darkMode
                      ? 'bg-gray-700 text-gray-300'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {period === 'week' ? 'Tydzień' : period === 'month' ? 'Miesiąc' : 'Rok'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {heatmap.map((day, index) => {
              const intensity = day.level;
              const colors = [
                darkMode ? 'bg-gray-800' : 'bg-gray-100', // 0 - brak
                'bg-green-200 dark:bg-green-900', // 1 - mało
                'bg-green-400 dark:bg-green-700', // 2 - średnio
                'bg-green-600 dark:bg-green-500', // 3 - dużo
                'bg-green-800 dark:bg-green-300', // 4 - bardzo dużo
              ];
              return (
                <div
                  key={index}
                  className={`w-3 h-3 rounded ${colors[intensity]} cursor-pointer`}
                  title={`${day.date}: ${day.count} powtórek`}
                />
              );
            })}
          </div>
          <div className="flex items-center justify-end gap-4 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gray-100 dark:bg-gray-800"></div>
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Brak</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-200 dark:bg-green-900"></div>
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Mało</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-600 dark:bg-green-500"></div>
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Dużo</span>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h2 className={`${fontSizes.subtitle} font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Szczegółowe statystyki
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>W trakcie nauki</p>
              <p className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {stats.learningCards}
              </p>
            </div>
            <div>
              <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Średni Ease Factor</p>
              <p className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {stats.averageEaseFactor.toFixed(2)}
              </p>
            </div>
            <div>
              <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Do powtórki</p>
              <p className={`${fontSizes.subtitle} font-bold text-orange-500`}>{stats.reviewCards}</p>
            </div>
            <div>
              <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Retencja</p>
              <p className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {stats.retentionRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SRSStatsPanel;

