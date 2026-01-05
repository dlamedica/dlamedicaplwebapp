import React from 'react';
import { FaFire, FaCalendarAlt } from 'react-icons/fa';

interface PopularArticle {
  id: number;
  title: string;
  slug: string;
  thumbnail: string;
  readTime: string;
  views: number;
  publishedDate: string;
}

interface PopularArticlesProps {
  darkMode: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const PopularArticles: React.FC<PopularArticlesProps> = ({ darkMode, highContrast, fontSize }) => {
  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          title: 'text-sm',
          meta: 'text-xs'
        };
      case 'large':
        return {
          title: 'text-lg',
          meta: 'text-base'
        };
      default:
        return {
          title: 'text-base',
          meta: 'text-sm'
        };
    }
  };

  const fontSizes = getFontSizeClasses();

  // Mockowane dane popularnych artykułów
  const popularArticles: PopularArticle[] = [
    {
      id: 1,
      title: "Najnowsze wytyczne ERC 2024 - co się zmieniło w resuscytacji?",
      slug: "wytyczne-erc-2024-resuscytacja",
      thumbnail: "https://via.placeholder.com/80x60/7ec8ff/ffffff?text=ERC",
      readTime: "5 min",
      views: 15420,
      publishedDate: "2024-01-15"
    },
    {
      id: 2,
      title: "Sztuczna inteligencja w diagnostyce medycznej - przełom czy zagrożenie?",
      slug: "ai-diagnostyka-medyczna",
      thumbnail: "https://via.placeholder.com/80x60/7ec8ff/ffffff?text=AI",
      readTime: "8 min",
      views: 12890,
      publishedDate: "2024-01-12"
    },
    {
      id: 3,
      title: "Nowe standardy leczenia COVID-19 - aktualizacja protokołów",
      slug: "standardy-leczenia-covid19",
      thumbnail: "https://via.placeholder.com/80x60/7ec8ff/ffffff?text=COVID",
      readTime: "6 min",
      views: 11650,
      publishedDate: "2024-01-10"
    },
    {
      id: 4,
      title: "Terapia genowa chorób rzadkich - nowe możliwości leczenia",
      slug: "terapia-genowa-choroby-rzadkie",
      thumbnail: "https://via.placeholder.com/80x60/7ec8ff/ffffff?text=DNA",
      readTime: "10 min",
      views: 9840,
      publishedDate: "2024-01-08"
    },
    {
      id: 5,
      title: "Oporność na antybiotyki - jak walczyć z globalnym problemem?",
      slug: "opornosc-antybiotyki",
      thumbnail: "https://via.placeholder.com/80x60/7ec8ff/ffffff?text=AB",
      readTime: "7 min",
      views: 8750,
      publishedDate: "2024-01-05"
    }
  ];

  const handleArticleClick = (slug: string) => {
    // Navigate to article page
    window.history.pushState({}, '', `/artykul/${slug}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className={`rounded-lg p-6 shadow-lg ${
      highContrast 
        ? 'bg-white border-2 border-black' 
        : darkMode 
          ? 'bg-gray-800 border border-gray-700' 
          : 'bg-white border border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-center mb-4">
        <FaFire className={`mr-2 text-lg ${
          highContrast ? 'text-black' : 'text-red-500'
        }`} />
        <h3 className={`text-xl font-bold ${
          highContrast ? 'text-black' : darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Najczęściej czytane
        </h3>
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {popularArticles.map((article, index) => (
          <article 
            key={article.id}
            className={`flex items-start space-x-3 p-3 rounded-lg transition-all duration-200 cursor-pointer ${
              highContrast
                ? 'hover:bg-gray-100 border border-gray-300'
                : darkMode
                  ? 'hover:bg-gray-700'
                  : 'hover:bg-gray-50'
            }`}
            onClick={() => handleArticleClick(article.slug)}
          >
            {/* Ranking Number */}
            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              index < 3
                ? highContrast
                  ? 'bg-black text-white'
                  : 'bg-[#38b6ff] text-black'
                : highContrast
                  ? 'bg-gray-300 text-black'
                  : darkMode
                    ? 'bg-gray-600 text-gray-300'
                    : 'bg-gray-200 text-gray-600'
            }`}>
              {index + 1}
            </div>

            {/* Thumbnail */}
            <div className="flex-shrink-0">
              <img
                src={article.thumbnail}
                alt={article.title}
                className="w-16 h-12 rounded object-cover"
                loading="lazy"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className={`${fontSizes.title} font-medium leading-tight mb-2 ${
                highContrast ? 'text-black' : darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {article.title}
              </h4>
              
              {/* Meta Information */}
              <div className={`flex items-center space-x-3 ${fontSizes.meta} ${
                highContrast ? 'text-gray-600' : darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-1" />
                  {formatDate(article.publishedDate)}
                </div>
                <span>• {article.readTime}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={() => handleArticleClick('wszystkie')}
          className={`w-full py-2 px-4 rounded-lg transition-all duration-200 ${fontSizes.title} font-medium ${
            highContrast
              ? 'bg-white text-black border-2 border-black hover:bg-black hover:text-white'
              : darkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-[#38b6ff] hover:text-black'
          }`}
        >
          Zobacz wszystkie artykuły
        </button>
      </div>
    </div>
  );
};

export default PopularArticles;