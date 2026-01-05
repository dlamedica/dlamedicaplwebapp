import React, { useState, useEffect } from 'react';
import { Ebook } from '../../types/ebook';
import EbookCard from './EbookCard';
import { PersonalizationService } from '../../services/personalizationService';

interface PersonalizedRecommendationsProps {
  darkMode: boolean;
  onViewDetails: (ebookId: string) => void;
  onAddToCart: (ebook: Ebook) => void;
  onQuickView?: (ebook: Ebook) => void;
  title?: string;
  limit?: number;
}

const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({
  darkMode,
  onViewDetails,
  onAddToCart,
  onQuickView,
  title = 'Rekomendowane dla Ciebie',
  limit = 8,
}) => {
  const [recommendations, setRecommendations] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecommendations = () => {
      setLoading(true);
      const personalized = PersonalizationService.getPersonalizedRecommendations(limit);
      setRecommendations(personalized);
      setLoading(false);
    };

    loadRecommendations();
    
    // Odśwież rekomendacje co 30 sekund (w przypadku zmian w preferencjach)
    const interval = setInterval(loadRecommendations, 30000);
    return () => clearInterval(interval);
  }, [limit]);

  if (loading) {
    return (
      <div className="mt-12">
        <h2 className={`text-2xl font-bold mb-6 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`h-96 rounded-lg animate-pulse ${
                darkMode ? 'bg-gray-800' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {title}
        </h2>
        <span className={`text-sm ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Dostosowane do Twoich preferencji
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((ebook) => (
          <EbookCard
            key={ebook.id}
            ebook={ebook}
            darkMode={darkMode}
            onViewDetails={onViewDetails}
            onAddToCart={onAddToCart}
            onQuickView={onQuickView}
          />
        ))}
      </div>
    </div>
  );
};

export default PersonalizedRecommendations;

