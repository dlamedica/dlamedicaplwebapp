import React, { useState, useEffect } from 'react';
import { FaStar, FaMapMarkerAlt, FaGraduationCap, FaTimes, FaUniversity, FaSearch, FaEye, FaFilter, FaSort, FaPhoneAlt, FaEnvelope, FaGlobe, FaUsers, FaBookOpen } from 'react-icons/fa';

interface BiotechUniversity {
  id: number;
  name: string;
  slug: string;
  city: string;
  voivodeship: string;
  type: 'publiczna' | 'prywatna';
  logo: string;
  ranking: number;
  averageRating: number;
  reviewCount: number;
  description: string;
  courses: string[];
  postgraduateCourses: string[];
  address: string;
  phone: string;
  email: string;
  website: string;
  studentCount?: number;
  yearFounded?: number;
}

interface BiotechnologyUniversitiesPageProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const BiotechnologyUniversitiesPage: React.FC<BiotechnologyUniversitiesPageProps> = ({ darkMode, fontSize }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedVoivodeship, setSelectedVoivodeship] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [sortBy, setSortBy] = useState('ranking');
  const [selectedUniversity, setSelectedUniversity] = useState<BiotechUniversity | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    document.title = 'Ranking uczelni z kierunkiem Biotechnologia | DlaMedica.pl';
    
    let descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      descriptionMeta.setAttribute('content', 'Kompleksowy ranking uczelni oferujących kierunek Biotechnologia w Polsce. Sprawdź najlepsze uniwersytety biotechnologiczne z opiniami studentów.');
    }

    let ogTitleMeta = document.querySelector('meta[property="og:title"]');
    if (ogTitleMeta) {
      ogTitleMeta.setAttribute('content', 'Ranking uczelni z kierunkiem Biotechnologia | DlaMedica.pl');
    }

    let ogDescriptionMeta = document.querySelector('meta[property="og:description"]');
    if (ogDescriptionMeta) {
      ogDescriptionMeta.setAttribute('content', 'Znajdź najlepszą uczelnię biotechnologiczną w Polsce. Ranking z pełnymi informacjami, kontaktami i opiniami studentów.');
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
          buttonText: 'text-sm',
          detailText: 'text-xs md:text-sm'
        };
      case 'large':
        return {
          title: 'text-4xl md:text-5xl',
          subtitle: 'text-xl md:text-2xl',
          cardTitle: 'text-2xl md:text-3xl',
          cardText: 'text-lg md:text-xl',
          buttonText: 'text-lg',
          detailText: 'text-base md:text-lg'
        };
      default:
        return {
          title: 'text-3xl md:text-4xl',
          subtitle: 'text-lg md:text-xl',
          cardTitle: 'text-xl md:text-2xl',
          cardText: 'text-base md:text-lg',
          buttonText: 'text-base',
          detailText: 'text-sm md:text-base'
        };
    }
  };

  const fontSizes = getFontSizeClasses();

  // Kompletne dane uczelni biotechnologicznych
  const biotechUniversities: BiotechUniversity[] = [
    {
      id: 1,
      name: 'Uniwersytet Medyczny im. Karola Marcinkowskiego w Poznaniu',
      slug: 'uniwersytet-medyczny-poznan-biotechnologia',
      city: 'Poznań',
      voivodeship: 'wielkopolskie',
      type: 'publiczna',
      logo: 'https://via.placeholder.com/80x80/38b6ff/ffffff?text=UMP',
      ranking: 1,
      averageRating: 4.8,
      reviewCount: 245,
      description: 'Wiodąca uczelnia medyczna oferująca najwyżej oceniane studia biotechnologiczne w Polsce.',
      courses: ['Biotechnologia', 'Biotechnologia medyczna', 'Lekarski', 'Farmacja', 'Pielęgniarstwo', 'Fizjoterapia'],
      postgraduateCourses: ['Medyczna genetyka molekularna', 'Bioinformatyka medyczna', 'Terapie molekularne'],
      address: 'ul. Fredry 10, 61-701 Poznań',
      phone: '+48 61 854 60 00',
      email: 'info@ump.edu.pl',
      website: 'www.ump.edu.pl',
      studentCount: 8500,
      yearFounded: 1919
    },
    {
      id: 2,
      name: 'Uniwersytet Medyczny w Łodzi',
      slug: 'uniwersytet-medyczny-lodz-biotechnologia',
      city: 'Łódź',
      voivodeship: 'łódzkie',
      type: 'publiczna',
      logo: 'https://via.placeholder.com/80x80/38b6ff/ffffff?text=UMŁ',
      ranking: 2,
      averageRating: 4.6,
      reviewCount: 312,
      description: 'Prestiżowa uczelnia z bogatymi tradycjami w zakresie biotechnologii medycznej.',
      courses: ['Biotechnologia', 'Biotechnologia medyczna', 'Lekarski', 'Farmacja', 'Analityka medyczna', 'Fizjoterapia'],
      postgraduateCourses: ['Molekularne podstawy chorób', 'Diagnostyka laboratoryjna', 'Biotechnologia farmaceutyczna'],
      address: 'al. Kościuszki 4, 90-419 Łódź',
      phone: '+48 42 272 58 03',
      email: 'rektor@umed.lodz.pl',
      website: 'www.umed.pl',
      studentCount: 7200,
      yearFounded: 1950
    },
    {
      id: 3,
      name: 'Uniwersytet Medyczny im. Piastów Śląskich we Wrocławiu',
      slug: 'uniwersytet-medyczny-wroclaw-biotechnologia',
      city: 'Wrocław',
      voivodeship: 'dolnośląskie',
      type: 'publiczna',
      logo: 'https://via.placeholder.com/80x80/38b6ff/ffffff?text=UMW',
      ranking: 3,
      averageRating: 4.5,
      reviewCount: 189,
      description: 'Wiodąca uczelnia biotechnologiczna na Dolnym Śląsku z nowoczesnymi laboratoriami.',
      courses: ['Biotechnologia', 'Biotechnologia medyczna', 'Lekarski', 'Farmacja', 'Pielęgniarstwo'],
      postgraduateCourses: ['Inżynieria genetyczna', 'Biologia molekularna', 'Diagnostyka molekularna'],
      address: 'wyb. Ludwika Pasteura 1, 50-367 Wrocław',
      phone: '+48 71 784 17 25',
      email: 'rektor@umw.edu.pl',
      website: 'www.umw.edu.pl',
      studentCount: 6800,
      yearFounded: 1945
    },
    {
      id: 4,
      name: 'Uniwersytet Wrocławski - Wydział Biotechnologii',
      slug: 'uniwersytet-wroclawski-biotechnologia',
      city: 'Wrocław',
      voivodeship: 'dolnośląskie',
      type: 'publiczna',
      logo: 'https://via.placeholder.com/80x80/38b6ff/ffffff?text=UWr',
      ranking: 4,
      averageRating: 4.4,
      reviewCount: 156,
      description: 'Innowacyjny wydział biotechnologii z szeroką ofertą specjalizacji molekularnych.',
      courses: ['Biotechnologia', 'Medyczna biotechnologia molekularna', 'Biologia molekularna', 'Bioinformatyka'],
      postgraduateCourses: ['Biotechnologia przemysłowa', 'Molekularna diagnostyka medyczna', 'Bioinżynieria'],
      address: 'ul. Fryderyka Joliot-Curie 14a, 50-383 Wrocław',
      phone: '+48 71 375 29 95',
      email: 'dziekanat@biotech.uni.wroc.pl',
      website: 'www.biotech.uni.wroc.pl',
      studentCount: 4200,
      yearFounded: 1702
    },
    {
      id: 5,
      name: 'Collegium Medicum im. Ludwika Rydygiera w Bydgoszczy (UMK)',
      slug: 'collegium-medicum-bydgoszcz-biotechnologia',
      city: 'Bydgoszcz',
      voivodeship: 'kujawsko-pomorskie',
      type: 'publiczna',
      logo: 'https://via.placeholder.com/80x80/38b6ff/ffffff?text=CM',
      ranking: 5,
      averageRating: 4.3,
      reviewCount: 198,
      description: 'Dynamicznie rozwijające się centrum biotechnologii klinicznej w północnej Polsce.',
      courses: ['Biotechnologia', 'Biotechnologia medyczna', 'Lekarski', 'Farmacja', 'Pielęgniarstwo'],
      postgraduateCourses: ['Biotechnologia kliniczna', 'Genetyka medyczna', 'Medycyna regeneracyjna'],
      address: 'ul. Jagiellońska 13-15, 85-067 Bydgoszcz',
      phone: '+48 52 585 33 88',
      email: 'cm@cm.umk.pl',
      website: 'www.cm.umk.pl',
      studentCount: 3200,
      yearFounded: 1999
    },
    {
      id: 6,
      name: 'Uniwersytet Rolniczy im. Hugona Kołłątaja w Krakowie',
      slug: 'uniwersytet-rolniczy-krakow-biotechnologia',
      city: 'Kraków',
      voivodeship: 'małopolskie',
      type: 'publiczna',
      logo: 'https://via.placeholder.com/80x80/38b6ff/ffffff?text=URK',
      ranking: 6,
      averageRating: 4.2,
      reviewCount: 143,
      description: 'Wiodąca uczelnia w zakresie biotechnologii rolniczej i żywnościowej.',
      courses: ['Biotechnologia', 'Biotechnologia żywności', 'Bioinżynieria', 'Ochrona środowiska'],
      postgraduateCourses: ['Biotechnologia roślin', 'Biotechnologia przemysłowa', 'Inżynieria biomedyczna'],
      address: 'al. 29 Listopada 54, 31-425 Kraków',
      phone: '+48 12 662 43 00',
      email: 'rektor@urk.edu.pl',
      website: 'www.urk.edu.pl',
      studentCount: 12000,
      yearFounded: 1890
    },
    {
      id: 7,
      name: 'Uniwersytet im. Adama Mickiewicza w Poznaniu',
      slug: 'uniwersytet-adama-mickiewicza-biotechnologia',
      city: 'Poznań',
      voivodeship: 'wielkopolskie',
      type: 'publiczna',
      logo: 'https://via.placeholder.com/80x80/38b6ff/ffffff?text=UAM',
      ranking: 7,
      averageRating: 4.1,
      reviewCount: 167,
      description: 'Jedna z najstarszych uczelni w Polsce z nowoczesnym programem biotechnologii.',
      courses: ['Biotechnologia', 'Biologia molekularna', 'Bioinformatyka', 'Chemia'],
      postgraduateCourses: ['Biotechnologia farmaceutyczna', 'Biologia molekularna', 'Genetyka stosowana'],
      address: 'ul. Wieniawskiego 1, 61-712 Poznań',
      phone: '+48 61 829 10 00',
      email: 'rektor@amu.edu.pl',
      website: 'www.amu.edu.pl',
      studentCount: 38000,
      yearFounded: 1919
    },
    {
      id: 8,
      name: 'Politechnika Wrocławska',
      slug: 'politechnika-wroclawska-biotechnologia',
      city: 'Wrocław',
      voivodeship: 'dolnośląskie',
      type: 'publiczna',
      logo: 'https://via.placeholder.com/80x80/38b6ff/ffffff?text=PWr',
      ranking: 8,
      averageRating: 4.0,
      reviewCount: 134,
      description: 'Wiodąca politechnika z innowacyjnym podejściem do biotechnologii inżynierskiej.',
      courses: ['Biotechnologia', 'Inżynieria biomedyczna', 'Chemia', 'Inżynieria chemiczna'],
      postgraduateCourses: ['Biotechnologia przemysłowa', 'Inżynieria bioprocesów', 'Technologie medyczne'],
      address: 'wyb. Stanisława Wyspiańskiego 27, 50-370 Wrocław',
      phone: '+48 71 320 20 19',
      email: 'rektor@pwr.edu.pl',
      website: 'www.pwr.edu.pl',
      studentCount: 35000,
      yearFounded: 1945
    }
  ];

  const voivodeships = [
    'wielkopolskie', 'łódzkie', 'dolnośląskie', 'kujawsko-pomorskie', 
    'małopolskie', 'mazowieckie', 'śląskie', 'pomorskie'
  ];

  // Filtrowanie i sortowanie
  const filteredUniversities = biotechUniversities
    .filter(university => {
      const matchesSearch = university.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           university.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           university.courses.some(course => course.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = selectedType === '' || university.type === selectedType;
      const matchesVoivodeship = selectedVoivodeship === '' || university.voivodeship === selectedVoivodeship;
      const matchesRating = selectedRating === '' || 
        (selectedRating === '4+' && university.averageRating >= 4.0) ||
        (selectedRating === '4.5+' && university.averageRating >= 4.5);

      return matchesSearch && matchesType && matchesVoivodeship && matchesRating;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'ranking':
          return a.ranking - b.ranking;
        case 'rating':
          return b.averageRating - a.averageRating;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'city':
          return a.city.localeCompare(b.city);
        default:
          return a.ranking - b.ranking;
      }
    });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('');
    setSelectedVoivodeship('');
    setSelectedRating('');
    setSortBy('ranking');
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="text-yellow-400" style={{ clipPath: 'inset(0 50% 0 0)' }} />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300" />);
    }

    return stars;
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Hero Section */}
      <div 
        className="text-white py-16"
        style={{ background: 'linear-gradient(to right, #38b6ff, #2ea3e6)' }}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className={`font-bold mb-4 ${fontSizes.title}`}>
            Ranking Uczelni Biotechnologicznych
          </h1>
          <p className={`max-w-3xl mx-auto mb-8 ${fontSizes.subtitle}`}>
            Odkryj najlepsze uczelnie oferujące kierunek Biotechnologia w Polsce. 
            Kompleksowy przewodnik z opiniami, kontaktami i szczegółowymi informacjami.
          </p>
          <div className="flex justify-center items-center gap-6 text-white/90">
            <div className="flex items-center gap-2">
              <FaUniversity className="w-5 h-5" />
              <span className={fontSizes.detailText}>8 najlepszych uczelni</span>
            </div>
            <div className="flex items-center gap-2">
              <FaUsers className="w-5 h-5" />
              <span className={fontSizes.detailText}>1,644 opinii studentów</span>
            </div>
            <div className="flex items-center gap-2">
              <FaBookOpen className="w-5 h-5" />
              <span className={fontSizes.detailText}>Kierunek: Biotechnologia</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className={`sticky top-0 z-40 ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="container mx-auto px-4 py-4">
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Szukaj uczelni, miasta lub kierunku..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${fontSizes.cardText}`}
                style={{ borderColor: '#38b6ff' }}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${fontSizes.buttonText} ${
                showFilters 
                  ? 'text-white' 
                  : darkMode 
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={showFilters ? { backgroundColor: '#38b6ff' } : {}}
            >
              <FaFilter className="w-4 h-4" />
              Filtry
            </button>
          </div>

          {/* Extended Filters */}
          {showFilters && (
            <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className={`block mb-2 font-medium ${fontSizes.detailText}`}>Typ uczelni</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className={`w-full p-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } ${fontSizes.detailText}`}
                  >
                    <option value="">Wszystkie</option>
                    <option value="publiczna">Publiczna</option>
                    <option value="prywatna">Prywatna</option>
                  </select>
                </div>

                <div>
                  <label className={`block mb-2 font-medium ${fontSizes.detailText}`}>Województwo</label>
                  <select
                    value={selectedVoivodeship}
                    onChange={(e) => setSelectedVoivodeship(e.target.value)}
                    className={`w-full p-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } ${fontSizes.detailText}`}
                  >
                    <option value="">Wszystkie</option>
                    {voivodeships.map(voivodeship => (
                      <option key={voivodeship} value={voivodeship}>
                        {voivodeship.charAt(0).toUpperCase() + voivodeship.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block mb-2 font-medium ${fontSizes.detailText}`}>Ocena</label>
                  <select
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(e.target.value)}
                    className={`w-full p-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } ${fontSizes.detailText}`}
                  >
                    <option value="">Wszystkie</option>
                    <option value="4+">4+ gwiazdek</option>
                    <option value="4.5+">4.5+ gwiazdek</option>
                  </select>
                </div>

                <div>
                  <label className={`block mb-2 font-medium ${fontSizes.detailText}`}>Sortuj według</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={`w-full p-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } ${fontSizes.detailText}`}
                  >
                    <option value="ranking">Miejsce w rankingu</option>
                    <option value="rating">Najwyższe oceny</option>
                    <option value="name">Nazwa A-Z</option>
                    <option value="city">Miasto A-Z</option>
                  </select>
                </div>
              </div>

              <button
                onClick={clearFilters}
                className={`text-sm px-4 py-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Wyczyść filtry
              </button>
            </div>
          )}

          {/* Results Counter */}
          <div className={`mt-4 ${fontSizes.detailText} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Znaleziono {filteredUniversities.length} z {biotechUniversities.length} uczelni
          </div>
        </div>
      </div>

      {/* Universities List */}
      <div className="container mx-auto px-4 py-8">
        {filteredUniversities.length === 0 ? (
          <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <FaUniversity className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className={`font-semibold mb-2 ${fontSizes.cardTitle}`}>Nie znaleziono uczelni</h3>
            <p className={fontSizes.cardText}>Spróbuj zmienić kryteria wyszukiwania lub wyczyść filtry.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredUniversities.map((university) => (
              <div
                key={university.id}
                className={`rounded-lg border transition-all duration-200 hover:shadow-lg ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Logo and Ranking */}
                    <div className="flex-shrink-0 text-center lg:text-left">
                      <div className="relative inline-block">
                        <img 
                          src={university.logo} 
                          alt={`Logo ${university.name}`}
                          className="w-20 h-20 mx-auto lg:mx-0 rounded-lg border-2 border-gray-200"
                        />
                        <div 
                          className="absolute -top-2 -right-2 w-8 h-8 rounded-full text-white text-sm font-bold flex items-center justify-center"
                          style={{ backgroundColor: '#38b6ff' }}
                        >
                          #{university.ranking}
                        </div>
                      </div>
                      <div className={`mt-2 font-medium ${fontSizes.detailText}`} style={{ color: '#38b6ff' }}>
                        Miejsce #{university.ranking}
                      </div>
                    </div>

                    {/* Main Info */}
                    <div className="flex-grow">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                        <div>
                          <h2 className={`font-bold mb-2 ${fontSizes.cardTitle}`}>
                            {university.name}
                          </h2>
                          
                          <div className="flex flex-wrap items-center gap-4 mb-3">
                            <div className="flex items-center gap-1">
                              <FaMapMarkerAlt className="w-4 h-4 text-gray-500" />
                              <span className={`${fontSizes.detailText} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {university.city}, {university.voivodeship}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <FaUniversity className="w-4 h-4 text-gray-500" />
                              <span className={`${fontSizes.detailText} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {university.type}
                              </span>
                            </div>

                            {university.yearFounded && (
                              <div className="flex items-center gap-1">
                                <FaGraduationCap className="w-4 h-4 text-gray-500" />
                                <span className={`${fontSizes.detailText} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                  od {university.yearFounded}
                                </span>
                              </div>
                            )}
                          </div>

                          <p className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
                            {university.description}
                          </p>
                        </div>

                        {/* Rating */}
                        <div className="text-center lg:text-right flex-shrink-0">
                          <div className="flex items-center justify-center lg:justify-end gap-1 mb-1">
                            {renderStars(university.averageRating)}
                          </div>
                          <div className={`font-bold ${fontSizes.cardText}`} style={{ color: '#38b6ff' }}>
                            {university.averageRating}/5
                          </div>
                          <div className={`${fontSizes.detailText} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            ({university.reviewCount} opinii)
                          </div>
                        </div>
                      </div>

                      {/* Courses */}
                      <div className="mb-4">
                        <h3 className={`font-semibold mb-2 ${fontSizes.detailText}`}>Kierunki studiów:</h3>
                        <div className="flex flex-wrap gap-2">
                          {university.courses.map((course, index) => (
                            <span
                              key={index}
                              className={`px-3 py-1 rounded-full text-xs ${
                                darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {course}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                        <div className="flex items-center gap-2">
                          <FaPhoneAlt className="w-4 h-4 text-gray-500" />
                          <span className={`${fontSizes.detailText} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {university.phone}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaEnvelope className="w-4 h-4 text-gray-500" />
                          <span className={`${fontSizes.detailText} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {university.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaGlobe className="w-4 h-4 text-gray-500" />
                          <span className={`${fontSizes.detailText} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {university.website}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => setSelectedUniversity(university)}
                          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors text-white ${fontSizes.buttonText}`}
                          style={{ backgroundColor: '#38b6ff' }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2ea3e6'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#38b6ff'}
                        >
                          <FaEye className="w-4 h-4" />
                          Zobacz szczegóły
                        </button>
                        
                        <button
                          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${fontSizes.buttonText} ${
                            darkMode 
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <FaGlobe className="w-4 h-4" />
                          Strona uczelni
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* University Detail Modal */}
      {selectedUniversity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-lg ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="sticky top-0 flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className={`font-bold ${fontSizes.cardTitle}`}>
                {selectedUniversity.name}
              </h2>
              <button
                onClick={() => setSelectedUniversity(null)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <img 
                      src={selectedUniversity.logo} 
                      alt={`Logo ${selectedUniversity.name}`}
                      className="w-16 h-16 rounded-lg border"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {renderStars(selectedUniversity.averageRating)}
                        <span className={`font-bold ${fontSizes.cardText}`}>
                          {selectedUniversity.averageRating}/5
                        </span>
                      </div>
                      <p className={`${fontSizes.detailText} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Miejsce #{selectedUniversity.ranking} w rankingu • {selectedUniversity.reviewCount} opinii
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className={`font-semibold mb-3 ${fontSizes.cardText}`}>Podstawowe informacje</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="w-4 h-4 text-gray-500" />
                        <span className={fontSizes.detailText}>{selectedUniversity.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaPhoneAlt className="w-4 h-4 text-gray-500" />
                        <span className={fontSizes.detailText}>{selectedUniversity.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaEnvelope className="w-4 h-4 text-gray-500" />
                        <span className={fontSizes.detailText}>{selectedUniversity.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaGlobe className="w-4 h-4 text-gray-500" />
                        <span className={fontSizes.detailText}>{selectedUniversity.website}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className={`font-semibold mb-3 ${fontSizes.cardText}`}>Kierunki studiów</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedUniversity.courses.map((course, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1 rounded-full ${fontSizes.detailText} ${
                            darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div>
                  <div className="mb-6">
                    <h3 className={`font-semibold mb-3 ${fontSizes.cardText}`}>Studia podyplomowe</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedUniversity.postgraduateCourses.map((course, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1 rounded-full ${fontSizes.detailText}`}
                          style={{ backgroundColor: 'rgba(56, 182, 255, 0.1)', color: '#38b6ff' }}
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className={`font-semibold mb-3 ${fontSizes.cardText}`}>O uczelni</h3>
                    <p className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
                      {selectedUniversity.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                      {selectedUniversity.studentCount && (
                        <div>
                          <div className={`font-semibold ${fontSizes.detailText}`}>Liczba studentów</div>
                          <div className={`${fontSizes.cardText}`} style={{ color: '#38b6ff' }}>
                            {selectedUniversity.studentCount.toLocaleString()}
                          </div>
                        </div>
                      )}
                      {selectedUniversity.yearFounded && (
                        <div>
                          <div className={`font-semibold ${fontSizes.detailText}`}>Rok założenia</div>
                          <div className={`${fontSizes.cardText}`} style={{ color: '#38b6ff' }}>
                            {selectedUniversity.yearFounded}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors text-white ${fontSizes.buttonText}`}
                      style={{ backgroundColor: '#38b6ff' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2ea3e6'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#38b6ff'}
                    >
                      Strona uczelni
                    </button>
                    <button
                      className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${fontSizes.buttonText} ${
                        darkMode 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Kontakt
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BiotechnologyUniversitiesPage;