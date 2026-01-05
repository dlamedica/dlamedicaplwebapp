import React, { useState, useEffect } from 'react';
import {
  UniversityIcon,
  LocationIcon,
  StarIcon,
  CourseIcon,
  ArrowLeftIcon,
  UserIcon,
  CalendarIcon,
  CloseIcon,
  HeartIcon,
  ChartIcon,
  UsersIcon,
  AwardIcon,
  HistoryIcon,
  BookIcon
} from '../icons/UniversityIcons';
import UniversityStatsChart from '../universities/UniversityStatsChart';
import CourseDetailsModal from '../universities/CourseDetailsModal';

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
  postgraduateCourses?: string[];
  studentCount?: number;
  yearFounded?: number;
  ranking?: {
    national: number;
    regional: number;
    city: string;
  };
  contact?: {
    address: string;
    phone: string;
    email: string;
    website: string;
  };
}

interface Review {
  id: number;
  universityId: number;
  author: string;
  course: string;
  year: string;
  rating: number;
  comment: string;
  date: string;
  categoryRatings?: {
    faculty: number;
    infrastructure: number;
    internships: number;
    atmosphere: number;
  };
}

interface UniversityDetailPageProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  slug: string | null;
}

const UniversityDetailPage: React.FC<UniversityDetailPageProps> = ({ darkMode, fontSize, slug }) => {
  const [university, setUniversity] = useState<University | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [showPanelModal, setShowPanelModal] = useState(false);
  const [showStatsChart, setShowStatsChart] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    categoryRatings: {
      faculty: 5,
      infrastructure: 5,
      internships: 5,
      atmosphere: 5
    }
  });
  const [selectedCourse, setSelectedCourse] = useState<{ name: string; details?: any } | null>(null);
  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem('favoriteUniversities');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Błąd parsowania ulubionych:', e);
      return [];
    }
  });
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('');

  useEffect(() => {
    // Wczytaj opinie z localStorage
    const savedReviews = localStorage.getItem('universityReviews');
    if (savedReviews) {
      try {
        setReviews(JSON.parse(savedReviews));
      } catch (e) {
        console.error('Błąd parsowania opinii:', e);
        localStorage.removeItem('universityReviews');
      }
    }

    // Znajdź uczelnię na podstawie slug
    const foundUniversity = universities.find(uni => uni.slug === slug);
    if (foundUniversity) {
      setUniversity(foundUniversity);
      document.title = `${foundUniversity.name} - Opinie studentów | DlaMedica.pl`;
    }
  }, [slug]);

  useEffect(() => {
    if (university) {
      let filtered = reviews.filter(review => review.universityId === university.id);

      // Filtr po kierunku studiów
      if (selectedCourseFilter) {
        filtered = filtered.filter(review => review.course === selectedCourseFilter);
      }

      // Sortowanie
      switch (sortBy) {
        case 'newest':
          filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          break;
        case 'oldest':
          filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          break;
        case 'highest':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'lowest':
          filtered.sort((a, b) => a.rating - b.rating);
          break;
      }

      setFilteredReviews(filtered);
    }
  }, [university, reviews, sortBy, selectedCourseFilter]);

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          title: 'text-2xl md:text-3xl',
          subtitle: 'text-base md:text-lg',
          cardTitle: 'text-lg md:text-xl',
          cardText: 'text-sm md:text-base',
          buttonText: 'text-sm'
        };
      case 'large':
        return {
          title: 'text-4xl md:text-5xl',
          subtitle: 'text-xl md:text-2xl',
          cardTitle: 'text-2xl md:text-3xl',
          cardText: 'text-lg md:text-xl',
          buttonText: 'text-lg'
        };
      default:
        return {
          title: 'text-3xl md:text-4xl',
          subtitle: 'text-lg md:text-xl',
          cardTitle: 'text-xl md:text-2xl',
          cardText: 'text-base md:text-lg',
          buttonText: 'text-base'
        };
    }
  };

  const fontSizes = getFontSizeClasses();

  // Mockowane dane uczelni - rozbudowane
  const universities: University[] = [
    {
      id: 1,
      name: 'Warszawski Uniwersytet Medyczny',
      slug: 'warszawski-uniwersytet-medyczny',
      city: 'Warszawa',
      type: 'publiczna',
      logo: '/api/placeholder/120/120',
      averageRating: 4.5,
      reviewCount: 142,
      description: 'Jedna z najstarszych i najbardziej prestiżowych uczelni medycznych w Polsce z bogatą tradycją kształcenia kadr medycznych.',
      yearFounded: 1950,
      ranking: {
        national: 1,
        regional: 1,
        city: 'Warszawa'
      },
      courses: ['Lekarski', 'Lekarsko-dentystyczny', 'Farmacja', 'Pielęgniarstwo', 'Położnictwo', 'Ratownictwo medyczne'],
      postgraduateCourses: [
        'Kardiologia interwencyjna',
        'Endokrynologia',
        'Pediatria',
        'Medycyna estetyczna',
        'USG w medycynie',
        'Psychoterapia'
      ],
      contact: {
        address: 'ul. Żwirki i Wigury 61, 02-091 Warszawa',
        phone: '+48 22 572 00 00',
        email: 'kontakt@wum.edu.pl',
        website: 'www.wum.edu.pl'
      }
    },
    {
      id: 2,
      name: 'Uniwersytet Jagielloński - Collegium Medicum',
      slug: 'uniwersytet-jagiellonski-collegium-medicum',
      city: 'Kraków',
      type: 'publiczna',
      logo: '/api/placeholder/120/120',
      averageRating: 4.7,
      reviewCount: 98,
      description: 'Najstarsza uczelnia w Polsce z tradycjami sięgającymi XIV wieku, kształcąca najwyższej klasy specjalistów.',
      yearFounded: 1364,
      ranking: {
        national: 2,
        regional: 1,
        city: 'Kraków'
      },
      courses: ['Lekarski', 'Lekarsko-dentystyczny', 'Farmacja', 'Pielęgniarstwo', 'Fizjoterapia', 'Dietetyka'],
      postgraduateCourses: [
        'Neurologia',
        'Psychiatria',
        'Chirurgia plastyczna',
        'Medycyna sportowa',
        'Ginekologia estetyczna',
        'Implantologia'
      ],
      contact: {
        address: 'ul. Św. Anny 12, 31-008 Kraków',
        phone: '+48 12 422 58 00',
        email: 'cm@uj.edu.pl',
        website: 'www.cm-uj.krakow.pl'
      }
    },
    {
      id: 3,
      name: 'Gdański Uniwersytet Medyczny',
      slug: 'gdanski-uniwersytet-medyczny',
      city: 'Gdańsk',
      type: 'publiczna',
      logo: '/api/placeholder/80/80',
      averageRating: 4.3,
      reviewCount: 76,
      description: 'Wiodąca uczelnia medyczna na północy Polski z nowoczesną bazą dydaktyczną.',
      courses: ['Lekarski', 'Lekarsko-dentystyczny', 'Farmacja', 'Pielęgniarstwo', 'Ratownictwo medyczne', 'Biotechnologia']
    },
    {
      id: 4,
      name: 'Uniwersytet Medyczny im. Karola Marcinkowskiego w Poznaniu',
      slug: 'uniwersytet-medyczny-poznan',
      city: 'Poznań',
      type: 'publiczna',
      logo: '/api/placeholder/80/80',
      averageRating: 4.2,
      reviewCount: 89,
      description: 'Renomowana uczelnia z bogatą tradycją kształcenia kadr medycznych.',
      courses: ['Lekarski', 'Lekarsko-dentystyczny', 'Farmacja', 'Pielęgniarstwo', 'Położnictwo', 'Fizjoterapia']
    },
    {
      id: 5,
      name: 'Śląski Uniwersytet Medyczny w Katowicach',
      slug: 'slaski-uniwersytet-medyczny',
      city: 'Katowice',
      type: 'publiczna',
      logo: '/api/placeholder/80/80',
      averageRating: 4.1,
      reviewCount: 67,
      description: 'Dynamicznie rozwijająca się uczelnia z nowoczesnym podejściem do nauczania.',
      courses: ['Lekarski', 'Lekarsko-dentystyczny', 'Farmacja', 'Pielęgniarstwo', 'Ratownictwo medyczne', 'Zdrowie publiczne']
    },
    {
      id: 6,
      name: 'Collegium Medicum UMK w Bydgoszczy',
      slug: 'collegium-medicum-umk',
      city: 'Bydgoszcz',
      type: 'publiczna',
      logo: '/api/placeholder/80/80',
      averageRating: 4.0,
      reviewCount: 54,
      description: 'Młoda, ale prężnie rozwijająca się uczelnia medyczna.',
      courses: ['Lekarski', 'Farmacja', 'Pielęgniarstwo', 'Położnictwo', 'Fizjoterapia']
    }
  ];

  const renderStars = (rating: number, size: 'sm' | 'lg' = 'sm') => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const iconSize = size === 'lg' ? 20 : 14;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <span key={i} className="inline-block">
            <StarIcon
              size={iconSize}
              color="#FBBF24"
              filled={true}
            />
          </span>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span key={i} className="inline-block relative">
            <StarIcon
              size={iconSize}
              color="#D1D5DB"
              filled={false}
            />
            <span className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
              <StarIcon
                size={iconSize}
                color="#FBBF24"
                filled={true}
              />
            </span>
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="inline-block">
            <StarIcon
              size={iconSize}
              color="#D1D5DB"
              filled={false}
            />
          </span>
        );
      }
    }
    return stars;
  };

  const calculateAverageRating = () => {
    if (filteredReviews.length === 0) return university?.averageRating || 0;
    const sum = filteredReviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / filteredReviews.length;
  };

  const handleBackToList = () => {
    window.history.pushState({}, '', '/uczelnie');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleAddReview = () => {
    if (!university || !newReview.comment.trim()) return;

    const review: Review = {
      id: Date.now(),
      universityId: university.id,
      author: 'Student',
      course: university.courses[0] || 'Nieznany kierunek',
      year: '2024',
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString()
    };

    const updatedReviews = [...reviews, review];
    setReviews(updatedReviews);
    localStorage.setItem('universityReviews', JSON.stringify(updatedReviews));

    setNewReview({
      rating: 5,
      comment: '',
      categoryRatings: {
        faculty: 5,
        infrastructure: 5,
        internships: 5,
        atmosphere: 5
      }
    });
    setShowReviewModal(false);
  };

  if (!university) {
    return (
      <div className={`min-h-screen py-12 ${darkMode ? 'bg-black' : 'bg-white'} transition-colors duration-300`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className={`text-6xl mb-6 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
              🏫
            </div>
            <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Uczelnia nie została znaleziona
            </h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
              Sprawdź poprawność adresu URL
            </p>
            <button
              onClick={handleBackToList}
              className="py-2 px-4 font-semibold rounded-lg transition-all duration-200 bg-gradient-to-r from-[#38b6ff] to-[#2da7ef] text-white hover:from-[#2da7ef] hover:to-[#38b6ff] shadow-md hover:shadow-lg flex items-center transform hover:scale-105"
            >
              <span className="mr-2">
                <ArrowLeftIcon size={18} color="white" />
              </span>
              Powrót do listy uczelni
            </button>
          </div>
        </div>
      </div>
    );
  }

  const avgRating = calculateAverageRating();

  return (
    <div className={`min-h-screen py-12 ${darkMode ? 'bg-black' : 'bg-white'} transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <button
            onClick={handleBackToList}
            className={`flex items-center py-2 px-4 rounded-lg transition-all duration-200 ${darkMode
              ? 'text-gray-300 hover:text-white hover:bg-gray-800'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              } transform hover:scale-105`}
          >
            <span className="mr-2">
              <ArrowLeftIcon size={18} color={darkMode ? '#D1D5DB' : '#4B5563'} />
            </span>
            Powrót do listy uczelni
          </button>
        </div>

        {/* Simplified Header */}
        <div className={`rounded-lg p-6 mb-8 shadow-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-[#38b6ff] to-[#2a9fe5] flex items-center justify-center shadow-lg">
              <UniversityIcon size={48} color="white" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h1 className={`${fontSizes.title} font-bold ${darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                  {university.name}
                </h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${university.type === 'publiczna'
                  ? 'bg-green-100 text-green-800'
                  : darkMode
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-gray-100 text-gray-800'
                  }`}>
                  {university.type.toUpperCase()}
                </span>
              </div>

              <div className={`flex flex-wrap items-center gap-4 text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                <div className="flex items-center">
                  <span className="mr-2">
                    <LocationIcon size={16} color={darkMode ? '#D1D5DB' : '#4B5563'} />
                  </span>
                  {university.city}
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {renderStars(avgRating, 'lg')}
                </div>
                <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                  {avgRating.toFixed(1)}
                </span>
                <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                  ({filteredReviews.length} opinii)
                </span>
              </div>

              <p className={`${fontSizes.cardText} leading-relaxed mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                {university.description}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  const newFavorites = favorites.includes(university.id)
                    ? favorites.filter(id => id !== university.id)
                    : [...favorites, university.id];
                  setFavorites(newFavorites);
                  localStorage.setItem('favoriteUniversities', JSON.stringify(newFavorites));
                }}
                className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${favorites.includes(university.id)
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                {favorites.includes(university.id) ? (
                  <>
                    <HeartIcon size={18} color="white" filled />
                    Usuń z ulubionych
                  </>
                ) : (
                  <>
                    <HeartIcon size={18} color={darkMode ? '#D1D5DB' : '#4B5563'} filled={false} />
                    Dodaj do ulubionych
                  </>
                )}
              </button>
              <button
                onClick={() => setShowPanelModal(true)}
                className="bg-[#38b6ff] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#2da7ef] transition-colors"
              >
                Panel uczelni
              </button>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Statistics Section */}
            <div className={`rounded-xl p-6 shadow-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-xl font-bold flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <span className="mr-2">
                    <ChartIcon size={20} color="#38b6ff" />
                  </span>
                  Statystyki
                </h2>
                <button
                  onClick={() => setShowStatsChart(!showStatsChart)}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {showStatsChart ? 'Ukryj wykresy' : 'Pokaż wykresy'}
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className={`p-4 rounded-xl text-center transform hover:scale-105 transition-transform duration-200 ${darkMode ? 'bg-gradient-to-br from-gray-700 to-gray-800' : 'bg-gradient-to-br from-gray-50 to-gray-100'
                  }`}>
                  <UsersIcon size={32} color="#38b6ff" className="mx-auto mb-2" />
                  <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {university.studentCount?.toLocaleString('pl-PL') || 'N/A'}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Studentów
                  </div>
                </div>
                <div className={`p-4 rounded-xl text-center transform hover:scale-105 transition-transform duration-200 ${darkMode ? 'bg-gradient-to-br from-gray-700 to-gray-800' : 'bg-gradient-to-br from-gray-50 to-gray-100'
                  }`}>
                  <CourseIcon size={32} color="#38b6ff" className="mx-auto mb-2" />
                  <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {university.courses.length}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Kierunków
                  </div>
                </div>
                <div className={`p-4 rounded-xl text-center transform hover:scale-105 transition-transform duration-200 ${darkMode ? 'bg-gradient-to-br from-gray-700 to-gray-800' : 'bg-gradient-to-br from-gray-50 to-gray-100'
                  }`}>
                  <HistoryIcon size={32} color="#38b6ff" className="mx-auto mb-2" />
                  <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {university.yearFounded || 'N/A'}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Rok założenia
                  </div>
                </div>
                <div className={`p-4 rounded-xl text-center transform hover:scale-105 transition-transform duration-200 ${darkMode ? 'bg-gradient-to-br from-gray-700 to-gray-800' : 'bg-gradient-to-br from-gray-50 to-gray-100'
                  }`}>
                  <AwardIcon size={32} color="#38b6ff" className="mx-auto mb-2" />
                  <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {university.ranking?.national || 'N/A'}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Miejsce w rankingu
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              {showStatsChart && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <UniversityStatsChart
                    title="Rozkład ocen"
                    data={[
                      { label: '5★', value: Math.floor((filteredReviews.filter(r => r.rating === 5).length / Math.max(filteredReviews.length, 1)) * 100), color: '#10B981' },
                      { label: '4★', value: Math.floor((filteredReviews.filter(r => r.rating === 4).length / Math.max(filteredReviews.length, 1)) * 100), color: '#38b6ff' },
                      { label: '3★', value: Math.floor((filteredReviews.filter(r => r.rating === 3).length / Math.max(filteredReviews.length, 1)) * 100), color: '#F59E0B' },
                      { label: '2★', value: Math.floor((filteredReviews.filter(r => r.rating === 2).length / Math.max(filteredReviews.length, 1)) * 100), color: '#EF4444' },
                      { label: '1★', value: Math.floor((filteredReviews.filter(r => r.rating === 1).length / Math.max(filteredReviews.length, 1)) * 100), color: '#DC2626' },
                    ]}
                    darkMode={darkMode}
                    type="bar"
                  />
                  <UniversityStatsChart
                    title="Opinie w czasie"
                    data={(() => {
                      const last6Months = Array.from({ length: 6 }, (_, i) => {
                        const date = new Date();
                        date.setMonth(date.getMonth() - (5 - i));
                        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                        const monthReviews = filteredReviews.filter(r => {
                          const reviewDate = new Date(r.date);
                          return `${reviewDate.getFullYear()}-${String(reviewDate.getMonth() + 1).padStart(2, '0')}` === monthKey;
                        });
                        return {
                          label: date.toLocaleDateString('pl-PL', { month: 'short' }),
                          value: monthReviews.length,
                          color: '#38b6ff'
                        };
                      });
                      return last6Months;
                    })()}
                    darkMode={darkMode}
                    type="line"
                  />
                </div>
              )}
            </div>

            {/* Courses Section */}
            <div className={`rounded-xl p-6 shadow-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
              <h2 className={`text-xl font-bold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <span className="mr-2">
                  <BookIcon size={20} color="#38b6ff" />
                </span>
                Kierunki studiów
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {university.courses.map((course, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedCourse({
                      name: course,
                      details: {
                        name: course,
                        type: course.includes('Lekarski') ? 'jednolite_magisterskie' :
                          course.includes('Lekarsko-dentystyczny') ? 'jednolite_magisterskie' :
                            course.includes('Farmacja') ? 'jednolite_magisterskie' : 'licencjackie',
                        durationYears: course.includes('Lekarski') || course.includes('Lekarsko-dentystyczny') ? 6 : 3,
                        language: 'polish',
                        tuitionFee: university.type === 'publiczna' ? 0 : undefined,
                        description: `Kierunek ${course} na ${university.name} oferuje kompleksowe kształcenie w dziedzinie medycyny.`,
                        admissionRequirements: [
                          'Matura z biologii i chemii',
                          'Minimum 80% z przedmiotów przyrodniczych',
                          'Egzamin wstępny (dla niektórych kierunków)'
                        ],
                        careerProspects: [
                          'Lekarz',
                          'Specjalista',
                          'Badacz',
                          'Nauczyciel akademicki'
                        ]
                      }
                    })}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 cursor-pointer ${darkMode
                      ? 'bg-gradient-to-br from-gray-700 to-gray-800 text-gray-300 hover:from-[#38b6ff]/20 hover:to-[#2da7ef]/20 hover:text-white border border-gray-600 hover:border-[#38b6ff]'
                      : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700 hover:from-[#38b6ff]/10 hover:to-[#2da7ef]/10 hover:text-[#38b6ff] border border-gray-200 hover:border-[#38b6ff]'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{course}</span>
                      <CourseIcon size={16} color={darkMode ? '#9CA3AF' : '#6B7280'} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Course Details Modal */}
              {selectedCourse && selectedCourse.details && (
                <CourseDetailsModal
                  course={selectedCourse.details}
                  darkMode={darkMode}
                  onClose={() => setSelectedCourse(null)}
                />
              )}
            </div>

            {/* Postgraduate Courses Section */}
            {university.postgraduateCourses && university.postgraduateCourses.length > 0 && (
              <div className={`rounded-xl p-6 shadow-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}>
                <h2 className={`text-xl font-bold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <span className="mr-2">
                    <AwardIcon size={20} color="#38b6ff" />
                  </span>
                  Studia podyplomowe
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {university.postgraduateCourses.map((course, index) => (
                    <div
                      key={index}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 ${darkMode
                        ? 'bg-gradient-to-br from-[#38b6ff]/10 to-[#2da7ef]/10 text-[#38b6ff] border border-[#38b6ff]/30 hover:border-[#38b6ff]'
                        : 'bg-gradient-to-br from-[#38b6ff]/5 to-[#2da7ef]/5 text-[#38b6ff] border border-[#38b6ff]/20 hover:border-[#38b6ff]'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{course}</span>
                        <AwardIcon size={16} color="#38b6ff" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info Section */}
            <div className={`rounded-xl p-6 shadow-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Dodatkowe informacje
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl transition-all duration-200 transform hover:scale-105 ${darkMode ? 'bg-gradient-to-br from-gray-700/50 to-gray-800/50' : 'bg-gradient-to-br from-gray-50 to-gray-100'
                  }`}>
                  <div className={`text-sm font-medium mb-2 flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <span className="w-2 h-2 rounded-full bg-[#38b6ff]"></span>
                    Współpraca międzynarodowa
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {university.name} prowadzi wymianę studencką z uczelniami z całej Europy w ramach programu Erasmus+.
                  </div>
                </div>
                <div className={`p-4 rounded-xl transition-all duration-200 transform hover:scale-105 ${darkMode ? 'bg-gradient-to-br from-gray-700/50 to-gray-800/50' : 'bg-gradient-to-br from-gray-50 to-gray-100'
                  }`}>
                  <div className={`text-sm font-medium mb-2 flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <span className="w-2 h-2 rounded-full bg-[#38b6ff]"></span>
                    Projekty badawcze
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Uczelnia realizuje liczne projekty badawcze finansowane z funduszy UE i krajowych.
                  </div>
                </div>
                <div className={`p-4 rounded-xl transition-all duration-200 transform hover:scale-105 ${darkMode ? 'bg-gradient-to-br from-gray-700/50 to-gray-800/50' : 'bg-gradient-to-br from-gray-50 to-gray-100'
                  }`}>
                  <div className={`text-sm font-medium mb-2 flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <span className="w-2 h-2 rounded-full bg-[#38b6ff]"></span>
                    Biblioteka
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Nowoczesna biblioteka z dostępem do międzynarodowych baz danych medycznych.
                  </div>
                </div>
                <div className={`p-4 rounded-xl transition-all duration-200 transform hover:scale-105 ${darkMode ? 'bg-gradient-to-br from-gray-700/50 to-gray-800/50' : 'bg-gradient-to-br from-gray-50 to-gray-100'
                  }`}>
                  <div className={`text-sm font-medium mb-2 flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <span className="w-2 h-2 rounded-full bg-[#38b6ff]"></span>
                    Praktyki kliniczne
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Współpraca z najlepszymi szpitalami w regionie zapewnia wysoką jakość praktyk.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className={`rounded-lg p-6 shadow-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
              <h3 className={`font-bold text-lg mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Podstawowe informacje
              </h3>
              <div className="space-y-3">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Typ uczelni
                  </p>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {university.type === 'publiczna' ? 'Publiczna' : 'Prywatna'}
                  </p>
                </div>
                {university.ranking && (
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Miejsce w rankingu
                    </p>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      #{university.ranking.national} w Polsce
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Section */}
            {university.contact && (
              <div className={`rounded-lg p-6 shadow-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}>
                <h3 className={`font-bold text-lg mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Kontakt
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Adres
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {university.contact.address}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Telefon
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {university.contact.phone}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Email
                    </p>
                    <a
                      href={`mailto:${university.contact.email}`}
                      className="text-sm text-[#38b6ff] hover:underline"
                    >
                      {university.contact.email}
                    </a>
                  </div>
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Strona internetowa
                    </p>
                    <a
                      href={university.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#38b6ff] hover:underline"
                    >
                      {university.contact.website}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>


        {/* Simple Reviews Section */}
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Opinie ({filteredReviews.length})
            </h2>
            <div className="flex flex-wrap items-center gap-4">
              <select
                value={selectedCourseFilter}
                onChange={(e) => setSelectedCourseFilter(e.target.value)}
                className={`px-3 py-2 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] focus:border-[#38b6ff] ${darkMode
                  ? 'bg-gray-800 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                  }`}
              >
                <option value="">Wszystkie kierunki</option>
                {university.courses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'highest' | 'lowest')}
                className={`px-3 py-2 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] focus:border-[#38b6ff] ${darkMode
                  ? 'bg-gray-800 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                  }`}
              >
                <option value="newest">Najnowsze</option>
                <option value="oldest">Najstarsze</option>
                <option value="highest">Najwyższa ocena</option>
                <option value="lowest">Najniższa ocena</option>
              </select>
              <button
                onClick={() => setShowReviewModal(true)}
                className="bg-[#38b6ff] text-white px-4 py-2 rounded-lg hover:bg-[#2da7ef] font-medium transition-colors"
              >
                Dodaj opinię
              </button>
            </div>
          </div>

          {/* Enhanced Rating Overview */}
          {filteredReviews.length > 0 && (
            <div className={`rounded-xl p-6 shadow-lg mb-6 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-4">
                  <div className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {avgRating.toFixed(1)}
                  </div>
                  <div>
                    <div className="flex items-center mb-1">
                      {renderStars(avgRating, 'lg')}
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {filteredReviews.length} opinii
                    </div>
                  </div>
                </div>

                {/* Category Averages */}
                {filteredReviews.some(r => r.categoryRatings) && (
                  <div className="md:col-span-2">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { key: 'faculty', label: 'Kadra' },
                        { key: 'infrastructure', label: 'Infrastruktura' },
                        { key: 'internships', label: 'Praktyki' },
                        { key: 'atmosphere', label: 'Atmosfera' }
                      ].map((category) => {
                        const categoryReviews = filteredReviews.filter(r => r.categoryRatings);
                        const avg = categoryReviews.length > 0
                          ? categoryReviews.reduce((sum, r) => sum + (r.categoryRatings?.[category.key as keyof typeof r.categoryRatings] || 0), 0) / categoryReviews.length
                          : 0;
                        return (
                          <div key={category.key} className={`p-3 rounded-lg transition-all duration-200 transform hover:scale-105 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                            }`}>
                            <div className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {category.label}
                            </div>
                            <div className="flex items-center gap-1">
                              {renderStars(avg, 'sm')}
                              <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {avg > 0 ? avg.toFixed(1) : 'N/A'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reviews List */}
          {filteredReviews.length === 0 ? (
            <div className="text-center py-16">
              <div className={`text-6xl mb-6 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                💬
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Brak opinii do wyświetlenia
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Bądź pierwszy, który podzieli się opinią o tej uczelni!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className={`p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                    }`}
                >
                  {/* Review Header */}
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${darkMode ? 'bg-gradient-to-br from-[#38b6ff] to-[#2a9fe5]' : 'bg-gradient-to-br from-[#38b6ff] to-[#2a9fe5]'
                        }`}>
                        <UserIcon size={24} color="white" />
                      </div>
                      <div>
                        <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {review.author}
                        </h4>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {review.course} • {review.year}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        {renderStars(review.rating)}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-1">
                          <CalendarIcon size={14} color={darkMode ? '#9CA3AF' : '#6B7280'} />
                        </span>
                        {formatDate(review.date)}
                      </div>
                    </div>
                  </div>

                  {/* Review Content */}
                  <p className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-600'
                    } leading-relaxed mb-4`}>
                    {review.comment}
                  </p>

                  {/* Category Ratings */}
                  {review.categoryRatings && (
                    <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'
                      }`}>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <div className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Kadra
                          </div>
                          <div className="flex items-center gap-1">
                            {renderStars(review.categoryRatings.faculty, 'sm')}
                            <span className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {review.categoryRatings.faculty.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Infrastruktura
                          </div>
                          <div className="flex items-center gap-1">
                            {renderStars(review.categoryRatings.infrastructure, 'sm')}
                            <span className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {review.categoryRatings.infrastructure.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Praktyki
                          </div>
                          <div className="flex items-center gap-1">
                            {renderStars(review.categoryRatings.internships, 'sm')}
                            <span className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {review.categoryRatings.internships.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Atmosfera
                          </div>
                          <div className="flex items-center gap-1">
                            {renderStars(review.categoryRatings.atmosphere, 'sm')}
                            <span className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {review.categoryRatings.atmosphere.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Panel Uczelni Modal */}
      {showPanelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg max-w-md w-full p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Panel uczelni
              </h3>
              <button
                onClick={() => setShowPanelModal(false)}
                className={`hover:opacity-70 transition-opacity ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
              >
                <CloseIcon size={24} color={darkMode ? '#9CA3AF' : '#6B7280'} />
              </button>
            </div>
            <div className="space-y-4">
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Aby uzyskać dostęp do panelu uczelni, skontaktuj się z nami:
              </p>
              {university.contact && (
                <div className={`rounded-lg p-4 space-y-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <strong>Email:</strong> {university.contact.email}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <strong>Telefon:</strong> {university.contact.phone}
                  </p>
                </div>
              )}
              <button
                onClick={() => setShowPanelModal(false)}
                className="w-full bg-[#38b6ff] text-white py-2 rounded-lg hover:bg-[#2da7ef] transition-colors"
              >
                Zamknij
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg max-w-md w-full p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Dodaj opinię
              </h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className={`hover:opacity-70 transition-opacity ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
              >
                <CloseIcon size={24} color={darkMode ? '#9CA3AF' : '#6B7280'} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Ogólna ocena
                </label>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="transition-transform duration-200 transform hover:scale-110"
                    >
                      <StarIcon
                        size={32}
                        color={star <= newReview.rating ? '#FBBF24' : (darkMode ? '#4B5563' : '#D1D5DB')}
                        filled={star <= newReview.rating}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Ratings */}
              <div className="space-y-4">
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Szczegółowe oceny
                </label>

                {[
                  { key: 'faculty', label: 'Kadra nauczycielska' },
                  { key: 'infrastructure', label: 'Infrastruktura' },
                  { key: 'internships', label: 'Praktyki i staże' },
                  { key: 'atmosphere', label: 'Atmosfera na uczelni' }
                ].map((category) => (
                  <div key={category.key}>
                    <div className={`text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {category.label}
                    </div>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setNewReview({
                            ...newReview,
                            categoryRatings: {
                              ...newReview.categoryRatings,
                              [category.key]: star
                            }
                          })}
                          className="transition-transform duration-200 transform hover:scale-110"
                        >
                          <StarIcon
                            size={20}
                            color={star <= newReview.categoryRatings[category.key as keyof typeof newReview.categoryRatings] ? '#FBBF24' : (darkMode ? '#4B5563' : '#D1D5DB')}
                            filled={star <= newReview.categoryRatings[category.key as keyof typeof newReview.categoryRatings]}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Twoja opinia
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Podziel się swoją opinią o uczelni..."
                  rows={4}
                  className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] focus:border-[#38b6ff] ${darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddReview}
                  disabled={!newReview.comment.trim()}
                  className={`flex-1 py-2 rounded-lg font-medium transition-colors ${newReview.comment.trim()
                    ? 'bg-[#38b6ff] text-white hover:bg-[#2da7ef]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  Dodaj opinię
                </button>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className={`flex-1 py-2 rounded-lg font-medium transition-colors ${darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  Anuluj
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversityDetailPage;