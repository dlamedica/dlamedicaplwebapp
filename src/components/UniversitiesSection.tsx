import React from 'react';
import {
  UniversityIcon,
  LocationIcon,
  StarIcon,
  ArrowRightIcon
} from './icons/UniversityIcons';

interface UniversitiesSectionProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

interface University {
  id: number;
  name: string;
  slug: string;
  city: string;
  type: 'publiczna' | 'prywatna';
  logo: string;
  averageRating: number;
  reviewCount: number;
  description: string;
  courses: string[];
  studentCount?: number;
}

const UniversitiesSection: React.FC<UniversitiesSectionProps> = ({ darkMode, fontSize }) => {
  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          title: 'text-2xl md:text-3xl',
          subtitle: 'text-lg md:text-xl',
          text: 'text-sm md:text-base',
          cardTitle: 'text-base md:text-lg',
          cardText: 'text-xs md:text-sm',
          buttonText: 'text-xs md:text-sm'
        };
      case 'large':
        return {
          title: 'text-4xl md:text-5xl',
          subtitle: 'text-2xl md:text-3xl',
          text: 'text-lg md:text-xl',
          cardTitle: 'text-xl md:text-2xl',
          cardText: 'text-base md:text-lg',
          buttonText: 'text-base md:text-lg'
        };
      default:
        return {
          title: 'text-3xl md:text-4xl',
          subtitle: 'text-xl md:text-2xl',
          text: 'text-base md:text-lg',
          cardTitle: 'text-lg md:text-xl',
          cardText: 'text-sm md:text-base',
          buttonText: 'text-sm md:text-base'
        };
    }
  };

  const fontSizes = getFontSizeClasses();

  const universities: University[] = [
    {
      id: 1,
      name: 'Warszawski Uniwersytet Medyczny',
      slug: 'warszawski-uniwersytet-medyczny',
      city: 'Warszawa',
      type: 'publiczna',
      logo: 'https://via.placeholder.com/80x80/7ec8ff/ffffff?text=WUM',
      averageRating: 4.5,
      reviewCount: 142,
      description: 'Jedna z najstarszych i najbardziej prestiżowych uczelni medycznych w Polsce.',
      courses: ['Lekarski', 'Lekarsko-dentystyczny', 'Farmacja', 'Pielęgniarstwo'],
      studentCount: 8500
    },
    {
      id: 2,
      name: 'Uniwersytet Jagielloński - Collegium Medicum',
      slug: 'uniwersytet-jagiellonski-collegium-medicum',
      city: 'Kraków',
      type: 'publiczna',
      logo: 'https://via.placeholder.com/80x80/7ec8ff/ffffff?text=UJ-CM',
      averageRating: 4.7,
      reviewCount: 98,
      description: 'Najstarsze collegium medicum w Polsce z bogatą tradycją akademicką.',
      courses: ['Lekarski', 'Lekarsko-dentystyczny', 'Farmacja', 'Pielęgniarstwo'],
      studentCount: 6200
    },
    {
      id: 3,
      name: 'Uniwersytet Medyczny im. Karola Marcinkowskiego',
      slug: 'uniwersytet-medyczny-poznań',
      city: 'Poznań',
      type: 'publiczna',
      logo: 'https://via.placeholder.com/80x80/7ec8ff/ffffff?text=UMP',
      averageRating: 4.2,
      reviewCount: 89,
      description: 'Renomowana uczelnia z bogatą tradycją kształcenia kadr medycznych.',
      courses: ['Lekarski', 'Lekarsko-dentystyczny', 'Farmacja', 'Fizjoterapia'],
      studentCount: 4800
    },
    {
      id: 4,
      name: 'Gdański Uniwersytet Medyczny',
      slug: 'gdanski-uniwersytet-medyczny',
      city: 'Gdańsk',
      type: 'publiczna',
      logo: 'https://via.placeholder.com/80x80/7ec8ff/ffffff?text=GUM',
      averageRating: 4.3,
      reviewCount: 76,
      description: 'Wiodąca uczelnia medyczna na północy Polski z nowoczesną bazą dydaktyczną.',
      courses: ['Lekarski', 'Lekarsko-dentystyczny', 'Farmacja', 'Pielęgniarstwo'],
      studentCount: 5400
    },
    {
      id: 5,
      name: 'Śląski Uniwersytet Medyczny w Katowicach',
      slug: 'slaski-uniwersytet-medyczny',
      city: 'Katowice',
      type: 'publiczna',
      logo: 'https://via.placeholder.com/80x80/7ec8ff/ffffff?text=SUM',
      averageRating: 4.1,
      reviewCount: 67,
      description: 'Dynamicznie rozwijająca się uczelnia z nowoczesnym podejściem do nauczania.',
      courses: ['Lekarski', 'Lekarsko-dentystyczny', 'Farmacja', 'Pielęgniarstwo'],
      studentCount: 7200
    },
    {
      id: 6,
      name: 'Uniwersytet Medyczny w Lublinie',
      slug: 'uniwersytet-medyczny-lublin',
      city: 'Lublin',
      type: 'publiczna',
      logo: 'https://via.placeholder.com/80x80/7ec8ff/ffffff?text=UM',
      averageRating: 4.2,
      reviewCount: 65,
      description: 'Uczelnia z długoletnią tradycją kształcenia lekarzy i specjalistów medycznych.',
      courses: ['Lekarski', 'Lekarsko-dentystyczny', 'Farmacja', 'Pielęgniarstwo'],
      studentCount: 5100
    }
  ];

  const handleNavigation = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <span key={i} className="inline-block">
            <StarIcon size={14} color="#FBBF24" filled={true} />
          </span>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span key={i} className="inline-block relative">
            <StarIcon size={14} color="#D1D5DB" filled={false} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
              <StarIcon size={14} color="#FBBF24" filled={true} />
            </span>
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="inline-block">
            <StarIcon size={14} color="#D1D5DB" filled={false} />
          </span>
        );
      }
    }
    return stars;
  };

  return (
    <section className={`mt-16 rounded-lg shadow-lg p-8 transition-colors duration-300 ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-[#38b6ff] to-[#2a9fe5] rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
            <UniversityIcon size={32} color="white" />
          </div>
        </div>
        <h2 className={`font-bold mb-4 ${fontSizes.title} ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Najlepsze uczelnie medyczne w Polsce
        </h2>
        <p className={`${fontSizes.text} leading-relaxed max-w-3xl mx-auto ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Poznaj najlepsze uczelnie medyczne w Polsce. Sprawdź opinie studentów, dowiedz się o kierunkach 
          studiów i znajdź swoją wymarzoną uczelnię.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {universities.map((university) => (
          <div 
            key={university.id}
            className={`rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
              darkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'
            }`}
          >
            <div className="p-6">
              {/* University Header */}
              <div className="flex items-start space-x-4 mb-4">
                <img 
                  src={university.logo} 
                  alt={university.name}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      university.type === 'publiczna' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {university.type}
                    </span>
                  </div>
                  <h3 className={`font-bold mb-2 ${fontSizes.cardTitle} ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  } leading-tight`}>
                    {university.name}
                  </h3>
                  <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                    <LocationIcon size={14} color={darkMode ? '#9CA3AF' : '#6B7280'} />
                    <span className={fontSizes.cardText}>{university.city}</span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {renderStars(university.averageRating)}
                  </div>
                  <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {university.averageRating.toFixed(1)}
                  </span>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    ({university.reviewCount} opinii)
                  </span>
                </div>
              </div>

              {/* Courses */}
              <div className="mb-4">
                <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Kierunki:
                </p>
                <div className="flex flex-wrap gap-1">
                  {university.courses.slice(0, 2).map((course, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-[#38b6ff] text-black text-xs rounded-full"
                    >
                      {course}
                    </span>
                  ))}
                  {university.courses.length > 2 && (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
                    }`}>
                      +{university.courses.length - 2} więcej
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className={`${fontSizes.cardText} ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              } mb-6 leading-relaxed`}>
                {university.description}
              </p>

              {/* Action Button */}
              <button
                onClick={() => handleNavigation(`/uczelnie/${university.slug}`)}
                className={`w-full py-2 px-4 ${fontSizes.buttonText} font-semibold rounded-lg transition-all duration-200 bg-gradient-to-r from-[#38b6ff] to-[#2da7ef] text-white hover:from-[#2da7ef] hover:to-[#38b6ff] shadow-md hover:shadow-lg flex items-center justify-center transform hover:scale-105`}
              >
                Zobacz szczegóły
                <span className="ml-2">
                  <ArrowRightIcon size={14} color="white" />
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center">
        <button
          onClick={() => handleNavigation('/uczelnie')}
          className={`px-8 py-3 ${fontSizes.buttonText} font-semibold rounded-lg transition-all duration-200 border-2 border-[#38b6ff] text-[#38b6ff] hover:bg-gradient-to-r hover:from-[#38b6ff] hover:to-[#2da7ef] hover:text-white hover:border-transparent shadow-md hover:shadow-lg flex items-center justify-center mx-auto transform hover:scale-105`}
        >
          Zobacz wszystkie uczelnie
          <span className="ml-2">
            <ArrowRightIcon size={16} color="currentColor" />
          </span>
        </button>
      </div>
    </section>
  );
};

export default UniversitiesSection;