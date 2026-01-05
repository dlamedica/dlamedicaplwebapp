import React, { useState, useEffect } from 'react';
import {
  UniversityIcon,
  LocationIcon,
  StarIcon,
  CourseIcon,
  SearchIcon,
  EyeIcon,
  CompareIcon,
  FilterIcon,
  HeartIcon,
  CloseIcon,
  ArrowRightIcon,
  ChartIcon,
  UsersIcon,
  BookIcon,
  HistoryIcon
} from '../icons/UniversityIcons';
import { MockUniversityService, University } from '../../services/mockUniversityService';



interface Review {
  id: number;
  universityId: number;
  author: string;
  course: string;
  year: string;
  rating: number;
  comment: string;
  date: string;
}

interface UniversitiesPageProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const UniversitiesPage: React.FC<UniversitiesPageProps> = ({ darkMode, fontSize }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [sortBy, setSortBy] = useState('rating_desc');
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [compareList, setCompareList] = useState<number[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem('favoriteUniversities');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedStudentCount, setSelectedStudentCount] = useState('');
  const [selectedYearFounded, setSelectedYearFounded] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isFiltersSticky, setIsFiltersSticky] = useState(false);
  const ITEMS_PER_PAGE = 9;

  // Obsługa sticky filters
  useEffect(() => {
    const handleScroll = () => {
      const filtersSection = document.getElementById('filters-section');
      if (filtersSection) {
        const rect = filtersSection.getBoundingClientRect();
        setIsFiltersSticky(rect.top <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.title = 'Ranking uczelni medycznych w Polsce | DlaMedica.pl';

    let descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      descriptionMeta.setAttribute('content', 'Ranking uczelni medycznych w Polsce z opiniami studentów. Sprawdź oceny, kierunki studiów i wybierz najlepszą uczelnię.');
    }

    let ogTitleMeta = document.querySelector('meta[property="og:title"]');
    if (ogTitleMeta) {
      ogTitleMeta.setAttribute('content', 'Ranking uczelni medycznych w Polsce | DlaMedica.pl');
    }

    let ogDescriptionMeta = document.querySelector('meta[property="og:description"]');
    if (ogDescriptionMeta) {
      ogDescriptionMeta.setAttribute('content', 'Kompleksowy ranking uczelni medycznych z opiniami studentów, informacjami o kierunkach i ocenami jakości kształcenia.');
    }


    // Wczytaj opinie z localStorage
    const savedReviews = localStorage.getItem('universityReviews');
    if (savedReviews) {
      try {
        setReviews(JSON.parse(savedReviews));
      } catch (e) {
        console.error('Błąd parsowania opinii uczelni:', e);
        // Fallback to initial reviews or empty if desired, but here just don't set if fail
        // Since initial reviews are set below if empty, this is fine
        localStorage.removeItem('universityReviews'); // Clear corrupted data
      }
    }
  }, []);

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

  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUniversities = async () => {
      setLoading(true);
      try {
        const data = await MockUniversityService.getUniversities();
        setUniversities(data);
      } catch (error) {
        console.error('Failed to fetch universities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);


  // Mockowane opinie
  const initialReviews: Review[] = [
    {
      id: 1,
      universityId: 1,
      author: 'Anna K.',
      course: 'Lekarski',
      year: '2022',
      rating: 5,
      comment: 'Świetna uczelnia z doskonałą kadrą nauczycielską. Bardzo dobra baza dydaktyczna i możliwości praktyk.',
      date: '2024-01-15'
    },
    {
      id: 2,
      universityId: 1,
      author: 'Michał P.',
      course: 'Lekarski',
      year: '2023',
      rating: 4,
      comment: 'Wysokiej jakości kształcenie, choć czasem organizacja pozostawia wiele do życzenia.',
      date: '2024-01-10'
    },
    {
      id: 3,
      universityId: 2,
      author: 'Katarzyna M.',
      course: 'Farmacja',
      year: '2021',
      rating: 5,
      comment: 'Prestiżowa uczelnia z długą tradycją. Profesorowie na najwyższym poziomie.',
      date: '2024-01-08'
    },
    {
      id: 4,
      universityId: 3,
      author: 'Tomasz W.',
      course: 'Pielęgniarstwo',
      year: '2022',
      rating: 4,
      comment: 'Bardzo dobre warunki studiowania, nowoczesne laboratoria.',
      date: '2024-01-05'
    },
    {
      id: 5,
      universityId: 2,
      author: 'Anonimowy',
      course: 'Lekarski',
      year: '2020',
      rating: 5,
      comment: 'Najlepsza uczelnia medyczna w Polsce. Tradycja i nowoczesność w jednym.',
      date: '2024-01-03'
    }
  ];

  // Inicjalizuj opinie jeśli nie ma ich w localStorage
  useEffect(() => {
    if (reviews.length === 0) {
      setReviews(initialReviews);
      localStorage.setItem('universityReviews', JSON.stringify(initialReviews));
    }
  }, []);

  // Uzyskaj wszystkie dostępne kierunki
  const allCourses = Array.from(new Set(universities.flatMap(uni => uni.courses))).sort();

  // Uzyskaj wszystkie dostępne miasta
  const allCities = Array.from(new Set(universities.map(uni => uni.city))).sort();

  // Uzyskaj wszystkie typy uczelni
  const allTypes = Array.from(new Set(universities.map(uni => uni.type))).sort();

  // Sortowanie opcje
  const sortOptions = [
    { value: 'rating_desc', label: 'Najwyżej oceniane' },
    { value: 'rating_asc', label: 'Najniżej oceniane' },
    { value: 'reviews_desc', label: 'Najwięcej opinii' },
    { value: 'reviews_asc', label: 'Najmniej opinii' },
    { value: 'name_asc', label: 'Nazwa A-Z' },
    { value: 'name_desc', label: 'Nazwa Z-A' },
    { value: 'students_desc', label: 'Najwięcej studentów' },
    { value: 'students_asc', label: 'Najmniej studentów' },
    { value: 'founded_desc', label: 'Najnowsze uczelnie' },
    { value: 'founded_asc', label: 'Najstarsze uczelnie' },
    { value: 'tuition_desc', label: 'Najdroższe czesne' },
    { value: 'tuition_asc', label: 'Najtańsze czesne' },
    { value: 'favorites', label: 'Tylko ulubione' },
  ];

  // Funkcja sortowania
  const sortUniversities = (universities: University[], sortBy: string) => {
    let filtered = [...universities];

    // Jeśli sortowanie po ulubionych, najpierw filtruj
    if (sortBy === 'favorites') {
      filtered = filtered.filter(uni => favorites.includes(uni.id));
      if (filtered.length === 0) return filtered;
    }

    return filtered.sort((a, b) => {
      const aReviews = getUniversityReviews(a.id);
      const bReviews = getUniversityReviews(b.id);
      const aRating = aReviews.length > 0 ? calculateAverageRating(a.id) : a.averageRating;
      const bRating = bReviews.length > 0 ? calculateAverageRating(b.id) : b.averageRating;
      const aReviewCount = aReviews.length > 0 ? aReviews.length : a.reviewCount;
      const bReviewCount = bReviews.length > 0 ? bReviews.length : b.reviewCount;

      switch (sortBy) {
        case 'rating_desc':
          return bRating - aRating;
        case 'rating_asc':
          return aRating - bRating;
        case 'reviews_desc':
          return bReviewCount - aReviewCount;
        case 'reviews_asc':
          return aReviewCount - bReviewCount;
        case 'name_asc':
          return a.name.localeCompare(b.name, 'pl');
        case 'name_desc':
          return b.name.localeCompare(a.name, 'pl');
        case 'students_desc':
          return (b.studentCount || 0) - (a.studentCount || 0);
        case 'students_asc':
          return (a.studentCount || 0) - (b.studentCount || 0);
        case 'founded_desc':
          return (b.yearFounded || 0) - (a.yearFounded || 0);
        case 'founded_asc':
          return (a.yearFounded || 0) - (b.yearFounded || 0);
        case 'tuition_desc':
          return (b.tuitionFee || 0) - (a.tuitionFee || 0);
        case 'tuition_asc':
          return (a.tuitionFee || 0) - (b.tuitionFee || 0);
        case 'favorites':
          // Sortuj ulubione po ocenie
          return bRating - aRating;
        default:
          return bRating - aRating;
      }
    });
  };

  const filteredUniversities = universities.filter(uni => {
    // Filtr wyszukiwania
    if (searchTerm && !uni.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !uni.city.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Filtr kierunku
    if (selectedCourse && !uni.courses.includes(selectedCourse)) {
      return false;
    }

    // Filtr oceny
    if (selectedRating) {
      const minRating = parseFloat(selectedRating);
      const uniReviews = getUniversityReviews(uni.id);
      const avgRating = uniReviews.length > 0 ? calculateAverageRating(uni.id) : uni.averageRating;
      if (avgRating < minRating) {
        return false;
      }
    }

    // Filtr miasta
    if (selectedCity && uni.city !== selectedCity) {
      return false;
    }

    // Filtr typu uczelni
    if (selectedType && uni.type !== selectedType) {
      return false;
    }

    // Filtr liczby studentów
    if (selectedStudentCount) {
      const studentCount = uni.studentCount || 0;
      switch (selectedStudentCount) {
        case 'small':
          if (studentCount >= 3000) return false;
          break;
        case 'medium':
          if (studentCount < 3000 || studentCount >= 6000) return false;
          break;
        case 'large':
          if (studentCount < 6000) return false;
          break;
      }
    }

    // Filtr roku założenia
    if (selectedYearFounded) {
      const year = uni.yearFounded || 0;
      switch (selectedYearFounded) {
        case 'old':
          if (year < 1950) return false;
          break;
        case 'medium':
          if (year < 1950 || year >= 2000) return false;
          break;
        case 'new':
          if (year < 2000) return false;
          break;
      }
    }

    return true;
  });

  // Funkcje porównywania
  const toggleCompare = (universityId: number) => {
    setCompareList(prev => {
      if (prev.includes(universityId)) {
        return prev.filter(id => id !== universityId);
      } else if (prev.length < 3) {
        return [...prev, universityId];
      }
      return prev;
    });
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const getCompareUniversities = () => {
    return universities.filter(uni => compareList.includes(uni.id));
  };

  // Funkcje ulubionych
  const toggleFavorite = (universityId: number) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(universityId)
        ? prev.filter(id => id !== universityId)
        : [...prev, universityId];
      localStorage.setItem('favoriteUniversities', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (universityId: number) => {
    return favorites.includes(universityId);
  };

  // Funkcja resetowania filtrów
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCourse('');
    setSelectedRating('');
    setSelectedCity('');
    setSelectedType('');
    setSelectedStudentCount('');
    setSelectedYearFounded('');
    setSortBy('rating_desc');
    setCurrentPage(1);
  };

  // Sprawdź czy są aktywne filtry
  const hasActiveFilters = searchTerm || selectedCourse || selectedRating || selectedCity || selectedType || selectedStudentCount || selectedYearFounded;

  const getUniversityReviews = (universityId: number) => {
    return reviews.filter(review => review.universityId === universityId);
  };

  const calculateAverageRating = (universityId: number) => {
    const uniReviews = getUniversityReviews(universityId);
    if (uniReviews.length === 0) return 0;
    const sum = uniReviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / uniReviews.length;
  };

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

  const handleViewReviews = (university: University) => {
    // Nawiguj do strony informacyjnej uczelni
    window.history.pushState({}, '', `/uczelnie/${university.slug}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };




  // Paginacja
  const sortedUniversities = sortUniversities(filteredUniversities, sortBy);
  const totalPages = Math.ceil(sortedUniversities.length / ITEMS_PER_PAGE);
  const paginatedUniversities = sortedUniversities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset strony przy zmianie filtrów
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCourse, selectedRating, selectedCity, selectedType, selectedStudentCount, selectedYearFounded, sortBy]);

  // Funkcja zwracająca kolor oceny
  const getRatingColor = (rating: number) => {
    if (rating >= 4) return '#10B981'; // zielony
    if (rating >= 3) return '#F59E0B'; // żółty
    return '#EF4444'; // czerwony
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950' : 'bg-gray-50'} transition-colors duration-300`}>
      {/* Hero Section */}
      <div className={`py-8 md:py-12 ${darkMode ? 'bg-gradient-to-b from-gray-900 to-gray-950' : 'bg-gradient-to-b from-white to-gray-50'}`}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#38b6ff] to-[#2a9fe5] rounded-xl flex items-center justify-center shadow-lg">
                <UniversityIcon size={28} color="white" />
              </div>
            </div>
            <h1 className={`font-bold mb-3 text-2xl md:text-3xl lg:text-4xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Ranking uczelni medycznych w Polsce
            </h1>
            <p className={`text-base md:text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
              Sprawdź oceny studentów, kierunki studiów, miasta i opinie. Znajdź najlepszą uczelnię dla siebie.
            </p>
          </div>

          {/* Statistics Boxes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto">
            <div className={`rounded-xl p-4 text-center shadow-md border transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-gray-100'
              }`}>
              <div className="flex items-center justify-center mb-2">
                <UniversityIcon size={24} color="#38b6ff" />
              </div>
              <div className={`text-2xl md:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {universities.length}
              </div>
              <div className={`text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Uczelni
              </div>
            </div>
            <div className={`rounded-xl p-4 text-center shadow-md border transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-gray-100'
              }`}>
              <div className="flex items-center justify-center mb-2">
                <BookIcon size={24} color="#38b6ff" />
              </div>
              <div className={`text-2xl md:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {allCourses.length}
              </div>
              <div className={`text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Kierunków
              </div>
            </div>
            <div className={`rounded-xl p-4 text-center shadow-md border transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-gray-100'
              }`}>
              <div className="flex items-center justify-center mb-2">
                <LocationIcon size={24} color="#38b6ff" />
              </div>
              <div className={`text-2xl md:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {allCities.length}
              </div>
              <div className={`text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Miast
              </div>
            </div>
            <div className={`rounded-xl p-4 text-center shadow-md border transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-gray-100'
              }`}>
              <div className="flex items-center justify-center mb-2">
                <StarIcon size={24} color="#38b6ff" filled />
              </div>
              <div className={`text-2xl md:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {reviews.length}
              </div>
              <div className={`text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Opinii
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 pb-12">

        {/* Mobile Filters Button */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className={`w-full py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 ${darkMode
              ? 'bg-gray-800 text-white border border-gray-700'
              : 'bg-white text-gray-900 border border-gray-200 shadow-sm'
              }`}
          >
            <FilterIcon size={18} color="#38b6ff" />
            Filtry
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-[#38b6ff] rounded-full"></span>
            )}
          </button>
        </div>

        {/* Sticky Filters Section */}
        <div
          id="filters-section"
          className={`sticky top-0 z-30 -mx-6 lg:-mx-8 px-6 lg:px-8 py-4 mb-6 transition-all duration-300 ${isFiltersSticky
            ? darkMode
              ? 'bg-gray-950/95 backdrop-blur-md border-b border-gray-800 shadow-lg'
              : 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg'
            : ''
            } ${showMobileFilters ? 'block' : 'hidden md:block'}`}
        >
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <SearchIcon size={18} color={darkMode ? '#9CA3AF' : '#6B7280'} />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Wyszukaj uczelnię po nazwie lub mieście..."
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] focus:border-[#38b6ff] ${darkMode
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                  }`}
              />
            </div>

            {/* Filter Row */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              {/* Course Filter */}
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className={`px-3 py-2 rounded-lg border text-sm min-w-[140px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${selectedCourse
                  ? 'border-[#38b6ff] ring-1 ring-[#38b6ff]'
                  : darkMode ? 'border-gray-700' : 'border-gray-200'
                  } ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                  }`}
              >
                <option value="">Kierunek</option>
                {allCourses.map((course) => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>

              {/* City Filter */}
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className={`px-3 py-2 rounded-lg border text-sm min-w-[120px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${selectedCity
                  ? 'border-[#38b6ff] ring-1 ring-[#38b6ff]'
                  : darkMode ? 'border-gray-700' : 'border-gray-200'
                  } ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                  }`}
              >
                <option value="">Miasto</option>
                {allCities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>

              {/* Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className={`px-3 py-2 rounded-lg border text-sm min-w-[120px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${selectedType
                  ? 'border-[#38b6ff] ring-1 ring-[#38b6ff]'
                  : darkMode ? 'border-gray-700' : 'border-gray-200'
                  } ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                  }`}
              >
                <option value="">Typ</option>
                <option value="publiczna">Publiczna</option>
                <option value="prywatna">Prywatna</option>
              </select>

              {/* Rating Filter */}
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className={`px-3 py-2 rounded-lg border text-sm min-w-[130px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${selectedRating
                  ? 'border-[#38b6ff] ring-1 ring-[#38b6ff]'
                  : darkMode ? 'border-gray-700' : 'border-gray-200'
                  } ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                  }`}
              >
                <option value="">Min. ocena</option>
                <option value="4.5">4.5★ i wyżej</option>
                <option value="4.0">4.0★ i wyżej</option>
                <option value="3.5">3.5★ i wyżej</option>
                <option value="3.0">3.0★ i wyżej</option>
              </select>

              {/* Spacer */}
              <div className="flex-1"></div>

              {/* Reset Filters Button */}
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all duration-200 ${darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  <CloseIcon size={14} color={darkMode ? '#9CA3AF' : '#6B7280'} />
                  Wyczyść filtry
                </button>
              )}

            </div>
          </div>
        </div>

        {/* Results Bar */}
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-4 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white shadow-sm border border-gray-100'
          }`}>
          {/* Results Count */}
          <div className="flex items-center gap-4">
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Znaleziono: <span className="font-bold text-[#38b6ff]">{sortedUniversities.length}</span> uczelni
            </div>

            {/* Favorites Button */}
            {favorites.length > 0 && (
              <button
                onClick={() => {
                  if (sortBy === 'favorites') {
                    setSortBy('rating_desc');
                  } else {
                    setSortBy('favorites');
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all duration-200 ${sortBy === 'favorites'
                  ? 'bg-red-500 text-white'
                  : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                <HeartIcon
                  size={14}
                  color={sortBy === 'favorites' ? 'white' : '#EF4444'}
                  filled={sortBy === 'favorites'}
                />
                Ulubione ({favorites.length})
              </button>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`flex-1 sm:flex-none px-3 py-2 rounded-lg border text-sm min-w-[180px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-200 text-gray-900'
                }`}
            >
              {sortOptions.filter(opt => opt.value !== 'favorites').map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className={`flex items-center rounded-lg overflow-hidden border ${darkMode ? 'border-gray-600' : 'border-gray-200'
              }`}>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-all duration-200 ${viewMode === 'grid'
                  ? 'bg-[#38b6ff] text-white'
                  : darkMode
                    ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                title="Widok siatki"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-all duration-200 ${viewMode === 'list'
                  ? 'bg-[#38b6ff] text-white'
                  : darkMode
                    ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                title="Widok listy"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#38b6ff]"></div>
          </div>
        )}

        {/* Universities Grid/List */}
        {!loading && (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'
            : 'flex flex-col gap-4'
          }>
            {paginatedUniversities.map((university) => {
              const uniReviews = getUniversityReviews(university.id);
              const avgRating = uniReviews.length > 0 ? calculateAverageRating(university.id) : university.averageRating;
              const reviewCount = uniReviews.length > 0 ? uniReviews.length : university.reviewCount;

              return (
                <div
                  key={university.id}
                  className={`group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col ${viewMode === 'list' ? 'md:flex-row md:items-stretch' : ''
                    } ${darkMode
                      ? 'bg-gray-800 border border-gray-700'
                      : 'bg-white border border-gray-100'
                    }`}
                >
                  {/* Card Header with Logo */}
                  <div className={`relative p-5 ${viewMode === 'list' ? 'md:w-64 md:flex-shrink-0' : ''}`}>
                    <div className="flex items-start gap-4">
                      <div className="relative flex-shrink-0">
                        <img
                          src={university.logo}
                          alt={`Logo ${university.name}`}
                          className="w-14 h-14 rounded-xl object-cover shadow-sm"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        {/* Type Badge */}
                        <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold mb-2 ${university.type === 'publiczna'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-violet-100 text-violet-700'
                          }`}>
                          {university.type === 'publiczna' ? 'Publiczna' : 'Prywatna'}
                        </span>
                        {/* Location */}
                        <div className={`flex items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          <LocationIcon size={14} color={darkMode ? '#9CA3AF' : '#6B7280'} />
                          <span className="ml-1">{university.city}</span>
                        </div>
                      </div>
                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(university.id);
                        }}
                        className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${isFavorite(university.id)
                          ? 'bg-red-50 text-red-500'
                          : darkMode
                            ? 'hover:bg-gray-700 text-gray-500 hover:text-red-500'
                            : 'hover:bg-gray-100 text-gray-400 hover:text-red-500'
                          }`}
                      >
                        <HeartIcon
                          size={18}
                          color={isFavorite(university.id) ? '#EF4444' : 'currentColor'}
                          filled={isFavorite(university.id)}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className={`flex-1 px-5 pb-5 ${viewMode === 'list' ? 'md:py-5 md:px-0 md:pr-5' : ''}`}>
                    {/* University Name */}
                    <h3 className={`text-lg font-bold mb-2 leading-tight group-hover:text-[#38b6ff] transition-colors ${darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                      {university.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`text-2xl font-bold`} style={{ color: getRatingColor(avgRating) }}>
                        {avgRating.toFixed(1)}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          {renderStars(avgRating)}
                        </div>
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {reviewCount} opinii studentów
                        </span>
                      </div>
                    </div>

                    {/* Courses Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {university.courses.slice(0, viewMode === 'list' ? 4 : 3).map((course, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 text-xs rounded-md border ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-gray-300'
                            : 'bg-[#38b6ff]/10 border-[#38b6ff]/20 text-[#38b6ff]'
                            }`}
                        >
                          {course}
                        </span>
                      ))}
                      {university.courses.length > (viewMode === 'list' ? 4 : 3) && (
                        <span className={`px-2 py-1 text-xs rounded-md ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
                          }`}>
                          +{university.courses.length - (viewMode === 'list' ? 4 : 3)}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className={`text-sm leading-relaxed line-clamp-2 mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                      {university.description}
                    </p>

                    {/* Info in List View */}
                    {viewMode === 'list' && (
                      <div className="flex items-center gap-4 text-xs mb-4">
                        {university.studentCount && (
                          <div className={`flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            <UsersIcon size={14} color={darkMode ? '#9CA3AF' : '#6B7280'} />
                            <span>{university.studentCount.toLocaleString('pl-PL')} studentów</span>
                          </div>
                        )}
                        {university.yearFounded && (
                          <div className={`flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            <HistoryIcon size={14} color={darkMode ? '#9CA3AF' : '#6B7280'} />
                            <span>Założona {university.yearFounded}</span>
                          </div>
                        )}
                        <div className={`flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <CourseIcon size={14} color={darkMode ? '#9CA3AF' : '#6B7280'} />
                          <span>{university.courses.length} kierunków</span>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className={`flex gap-2 ${viewMode === 'list' ? '' : 'flex-col sm:flex-row'}`}>
                      <button
                        onClick={() => handleViewReviews(university)}
                        className="flex-1 py-2.5 px-4 text-sm font-semibold rounded-xl bg-[#38b6ff] text-white hover:bg-[#2da7ef] transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <EyeIcon size={16} color="white" />
                        Zobacz szczegóły
                      </button>
                      <button
                        onClick={() => toggleCompare(university.id)}
                        disabled={compareList.length >= 3 && !compareList.includes(university.id)}
                        className={`py-2.5 px-4 text-sm font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${compareList.includes(university.id)
                          ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                          : compareList.length >= 3
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : darkMode
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        <CompareIcon size={16} color={compareList.includes(university.id) ? 'white' : (darkMode ? '#D1D5DB' : '#6B7280')} />
                        {compareList.includes(university.id) ? 'W porównaniu' : 'Porównaj'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* No Results */}
        {!loading && sortedUniversities.length === 0 && (
          <div className={`text-center py-16 rounded-2xl ${darkMode ? 'bg-gray-800/50' : 'bg-white'}`}>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <UniversityIcon size={32} color="#9CA3AF" />
            </div>
            <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Nie znaleziono uczelni
            </h2>
            <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Spróbuj zmienić kryteria wyszukiwania
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-[#38b6ff] text-white hover:bg-[#2da7ef] transition-colors"
            >
              Wyczyść filtry
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : darkMode
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
            >
              Poprzednia
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Pokaż tylko kilka stron w okolicy aktualnej
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${currentPage === page
                        ? 'bg-[#38b6ff] text-white'
                        : darkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                        }`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return (
                    <span key={page} className={`px-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : darkMode
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
            >
              Następna
            </button>
          </div>
        )}
      </div>

      {/* Sticky Compare Panel */}
      {compareList.length > 0 && (
        <div className={`fixed bottom-4 right-4 z-40 p-4 rounded-2xl shadow-2xl border transition-all duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
          <div className="flex items-center gap-3">
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <span className="font-bold text-[#38b6ff]">{compareList.length}</span>/3 do porównania
            </div>
            <button
              onClick={() => setShowCompareModal(true)}
              disabled={compareList.length < 2}
              className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-200 ${compareList.length >= 2
                ? 'bg-[#38b6ff] text-white hover:bg-[#2da7ef]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
              <CompareIcon size={16} color={compareList.length >= 2 ? 'white' : '#9CA3AF'} />
              Porównaj
            </button>
            <button
              onClick={clearCompare}
              className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
            >
              <CloseIcon size={18} color={darkMode ? '#9CA3AF' : '#6B7280'} />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Bottom Bar */}
      <div className={`fixed bottom-0 left-0 right-0 md:hidden z-30 p-3 border-t ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        }`}>
        <div className="flex items-center justify-around">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
          >
            <FilterIcon size={20} color={darkMode ? '#9CA3AF' : '#6B7280'} />
            <span className="text-xs">Filtry</span>
          </button>
          <button
            onClick={() => {
              const nextSort = sortBy === 'rating_desc' ? 'students_desc' :
                sortBy === 'students_desc' ? 'founded_asc' : 'rating_desc';
              setSortBy(nextSort);
            }}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
          >
            <ChartIcon size={20} color={darkMode ? '#9CA3AF' : '#6B7280'} />
            <span className="text-xs">Sortuj</span>
          </button>
          {compareList.length > 0 && (
            <button
              onClick={() => setShowCompareModal(true)}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg text-[#38b6ff]"
            >
              <CompareIcon size={20} color="#38b6ff" />
              <span className="text-xs">Porównaj ({compareList.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Compare Modal */}
      {showCompareModal && compareList.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className={`rounded-lg max-w-6xl w-full p-6 my-8 ${darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-2xl font-bold flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <span className="mr-2">
                  <CompareIcon size={24} color="#38b6ff" />
                </span>
                Porównanie uczelni
              </h3>
              <button
                onClick={() => setShowCompareModal(false)}
                className={`hover:opacity-70 transition-opacity ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
              >
                <CloseIcon size={24} color={darkMode ? '#9CA3AF' : '#6B7280'} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className={`w-full ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <thead>
                  <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                    <th className="text-left p-4 font-semibold">Kryterium</th>
                    {getCompareUniversities().map((uni) => (
                      <th key={uni.id} className="text-left p-4 font-semibold">
                        <div className="flex flex-col items-start">
                          <span className="font-bold">{uni.name}</span>
                          <span className="text-sm font-normal text-gray-500">{uni.city}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <td className="p-4 font-medium">Ocena</td>
                    {getCompareUniversities().map((uni) => {
                      const uniReviews = getUniversityReviews(uni.id);
                      const avgRating = uniReviews.length > 0 ? calculateAverageRating(uni.id) : uni.averageRating;
                      return (
                        <td key={uni.id} className="p-4">
                          <div className="flex items-center gap-2">
                            {renderStars(avgRating)}
                            <span className="font-bold">{avgRating.toFixed(1)}</span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                  <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <td className="p-4 font-medium">Liczba opinii</td>
                    {getCompareUniversities().map((uni) => {
                      const uniReviews = getUniversityReviews(uni.id);
                      const reviewCount = uniReviews.length > 0 ? uniReviews.length : uni.reviewCount;
                      return (
                        <td key={uni.id} className="p-4">{reviewCount}</td>
                      );
                    })}
                  </tr>
                  <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <td className="p-4 font-medium">Typ uczelni</td>
                    {getCompareUniversities().map((uni) => (
                      <td key={uni.id} className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${uni.type === 'publiczna'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                          }`}>
                          {uni.type === 'publiczna' ? 'Publiczna' : 'Prywatna'}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <td className="p-4 font-medium">Liczba studentów</td>
                    {getCompareUniversities().map((uni) => (
                      <td key={uni.id} className="p-4">{uni.studentCount?.toLocaleString('pl-PL') || 'N/A'}</td>
                    ))}
                  </tr>
                  <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <td className="p-4 font-medium">Rok założenia</td>
                    {getCompareUniversities().map((uni) => (
                      <td key={uni.id} className="p-4">{uni.yearFounded || 'N/A'}</td>
                    ))}
                  </tr>
                  <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <td className="p-4 font-medium">Czesne</td>
                    {getCompareUniversities().map((uni) => (
                      <td key={uni.id} className="p-4">
                        {uni.tuitionFee === 0 ? 'Bezpłatne' : `${uni.tuitionFee?.toLocaleString('pl-PL')} PLN`}
                      </td>
                    ))}
                  </tr>
                  <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <td className="p-4 font-medium">Kierunki studiów</td>
                    {getCompareUniversities().map((uni) => (
                      <td key={uni.id} className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {uni.courses.slice(0, 3).map((course, idx) => (
                            <span key={idx} className="px-2 py-1 bg-[#38b6ff] text-black text-xs rounded-full">
                              {course}
                            </span>
                          ))}
                          {uni.courses.length > 3 && (
                            <span className={`px-2 py-1 text-xs rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                              }`}>
                              +{uni.courses.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">Akcje</td>
                    {getCompareUniversities().map((uni) => (
                      <td key={uni.id} className="p-4">
                        <button
                          onClick={() => handleViewReviews(uni)}
                          className="px-4 py-2 bg-gradient-to-r from-[#38b6ff] to-[#2da7ef] text-white rounded-lg hover:from-[#2da7ef] hover:to-[#38b6ff] transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 text-sm flex items-center gap-2"
                        >
                          <EyeIcon size={14} color="white" />
                          Zobacz szczegóły
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowCompareModal(false)}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                Zamknij
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversitiesPage;
