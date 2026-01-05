import React, { useState, useEffect } from 'react';
import { FaNewspaper } from 'react-icons/fa';

interface NewsItem {
  id: number;
  title: string;
  date: string;
  category?: 'pilne' | 'normal' | 'info';
}

interface NewsTickerProps {
  darkMode: boolean;
  highContrast: boolean;
}

const NewsTicker: React.FC<NewsTickerProps> = ({ darkMode, highContrast }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Wszystkie wiadomości z kategoriami
  const allNewsItems: NewsItem[] = [
    { id: 1, title: "Wykryto nowy wariant wirusa grypy - zalecenia MZ", date: "2024-01-15", category: "pilne" },
    { id: 2, title: "Ministerstwo Zdrowia publikuje nowe standardy leczenia COVID-19", date: "2024-01-14", category: "normal" },
    { id: 3, title: "Wstrzymano serię leków - komunikat GIF", date: "2024-01-13", category: "pilne" },
    { id: 4, title: "WHO ostrzega przed wzrostem oporności na antybiotyki w Europie", date: "2024-01-12", category: "info" },
    { id: 5, title: "Zmiana wytycznych resuscytacji - natychmiast wdrożyć", date: "2024-01-11", category: "pilne" },
    { id: 6, title: "Sztuczna inteligencja w diagnostyce onkologicznej", date: "2024-01-10", category: "normal" },
    { id: 7, title: "Alert epidemiologiczny - ognisko zakażeń szpitalnych", date: "2024-01-09", category: "pilne" }
  ];

  // Filtruj tylko pilne wiadomości
  const newsItems = allNewsItems.filter(item => item.category === 'pilne');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
    }, 4000); // Change news every 4 seconds

    return () => clearInterval(interval);
  }, [newsItems.length]);

  return (
    <div className={`w-full ${
      highContrast 
        ? 'bg-white border-b-2 border-black' 
        : darkMode 
          ? 'bg-gray-900 border-b border-gray-700' 
          : 'bg-gray-50 border-b border-gray-200'
    } transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center py-3">
          {/* News Icon */}
          <div className={`flex-shrink-0 mr-4 ${
            highContrast ? 'text-black' : 'text-[#38b6ff]'
          }`}>
            <FaNewspaper className="text-lg" />
          </div>
          
          {/* Breaking News Label */}
          <div className={`flex-shrink-0 mr-4 px-2 py-1 rounded text-xs font-bold ${
            highContrast 
              ? 'bg-black text-white border border-black' 
              : 'bg-red-600 text-white'
          }`}>
            PILNE
          </div>
          
          {/* News Content with Animation */}
          <div className="flex-1 overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {newsItems.map((item) => (
                <div 
                  key={item.id} 
                  className="w-full flex-shrink-0 flex items-center"
                >
                  <span className={`text-sm font-medium truncate ${
                    highContrast 
                      ? 'text-black' 
                      : darkMode 
                        ? 'text-white' 
                        : 'text-gray-800'
                  }`}>
                    {item.title}
                  </span>
                  <span className={`ml-2 text-xs ${
                    highContrast 
                      ? 'text-gray-600' 
                      : darkMode 
                        ? 'text-gray-400' 
                        : 'text-gray-500'
                  }`}>
                    • {new Date(item.date).toLocaleDateString('pl-PL')}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Progress Indicators */}
          <div className="flex-shrink-0 flex items-center space-x-1 mx-4">
            {newsItems.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  index === currentIndex
                    ? highContrast 
                      ? 'bg-black' 
                      : 'bg-[#38b6ff]'
                    : highContrast 
                      ? 'bg-gray-300' 
                      : darkMode 
                        ? 'bg-gray-600' 
                        : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;