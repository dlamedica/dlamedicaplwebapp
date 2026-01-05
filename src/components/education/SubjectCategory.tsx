import React, { useState, useEffect } from 'react';
import SubjectGrid from './SubjectGrid';
import {
  AnatomyIcon,
  PhysiologyIcon,
  BiochemistryIcon,
  BiophysicsIcon,
  MicrobiologyIcon,
  CardiologyIcon,
  PulmonologyIcon,
  GastroenterologyIcon,
  NephrologyIcon,
  EndocrinologyIcon,
  EKGIcon,
  UltrasoundIcon,
  RadiologyIcon,
  AllSubjectsIcon,
  BookOpenIcon,
  ClockIcon,
  StarIcon
} from './icons/EducationIcons';
import { SearchIcon, ExclamationCircleIcon } from '../icons/PlatformIcons';
import { Breadcrumbs, CountUp, AnimatedSection, RippleButton } from './components';
import { SkeletonCard, SkeletonStats } from './skeletons';
import './styles/educationStyles.css';

interface Subject {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string; size?: number | string; color?: string }>;
  difficulty: 'easy' | 'medium' | 'hard';
  modules: number;
  estimatedHours: number;
  professions: string[];
  categories?: string[];
  prerequisites?: string[];
  color: string;
  progress?: number;
  isEnrolled?: boolean;
}

interface SubjectCategoryProps {
  category: string;
  searchTerm: string;
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const SubjectCategory: React.FC<SubjectCategoryProps> = ({ 
  category, 
  searchTerm, 
  darkMode, 
  fontSize 
}) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSubjects();
  }, [category]);

  const loadSubjects = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock API call - in production, fetch from backend
      const mockSubjects: Record<string, Subject[]> = {
        preclinical: [
          {
            id: '1',
            name: 'Anatomia',
            description: 'Budowa ciała ludzkiego - anatomia opisowa, czynnościowa i topograficzna',
            icon: AnatomyIcon,
            difficulty: 'medium',
            modules: 15,
            estimatedHours: 120,
            professions: ['lekarz', 'pielęgniarka', 'fizjoterapeuta', 'ratownik_medyczny'],
            categories: ['opisowa', 'czynnościowa', 'topograficzna'],
            prerequisites: [],
            color: '#e74c3c',
            progress: 45,
            isEnrolled: true
          },
          {
            id: '2',
            name: 'Fizjologia',
            description: 'Funkcjonowanie organizmów żywych - fizjologia ogólna, układów i wysiłku',
            icon: PhysiologyIcon,
            difficulty: 'hard',
            modules: 12,
            estimatedHours: 100,
            professions: ['lekarz', 'pielęgniarka', 'fizjoterapeuta'],
            categories: ['ogólna', 'układów', 'wysiłku'],
            prerequisites: ['1'],
            color: '#3498db',
            progress: 20,
            isEnrolled: true
          },
          {
            id: '3',
            name: 'Biochemia',
            description: 'Procesy chemiczne w organizmie - biochemia ogólna, kliniczna i żywienia',
            icon: BiochemistryIcon,
            difficulty: 'hard',
            modules: 10,
            estimatedHours: 80,
            professions: ['lekarz', 'dietetyk', 'analityk_medyczny'],
            categories: ['ogólna', 'kliniczna', 'żywienia'],
            prerequisites: [],
            color: '#9b59b6',
            progress: 0,
            isEnrolled: false
          },
          {
            id: '4',
            name: 'Biofizyka',
            description: 'Zastosowanie fizyki w medycynie - podstawy biofizyki i biomechaniki',
            icon: BiophysicsIcon,
            difficulty: 'medium',
            modules: 8,
            estimatedHours: 60,
            professions: ['lekarz', 'fizjoterapeuta', 'radiolog'],
            categories: ['podstawy', 'biomechanika'],
            prerequisites: [],
            color: '#1abc9c',
            progress: 0,
            isEnrolled: false
          },
          {
            id: '5',
            name: 'Mikrobiologia',
            description: 'Drobnoustroje chorobotwórcze - bakterie, wirusy, grzyby i pasożyty',
            icon: MicrobiologyIcon,
            difficulty: 'medium',
            modules: 12,
            estimatedHours: 90,
            professions: ['lekarz', 'pielęgniarka', 'analityk_medyczny'],
            categories: ['bakterie', 'wirusy', 'grzyby', 'pasożyty'],
            prerequisites: [],
            color: '#e67e22',
            progress: 0,
            isEnrolled: false
          }
        ],
        clinical: [
          {
            id: '11',
            name: 'Kardiologia',
            description: 'Choroby serca i układu krążenia',
            icon: CardiologyIcon,
            difficulty: 'hard',
            modules: 20,
            estimatedHours: 150,
            professions: ['lekarz', 'pielęgniarka_kardiologiczna'],
            prerequisites: ['1', '2', '7'],
            color: '#e74c3c',
            progress: 15,
            isEnrolled: true
          },
          {
            id: '12',
            name: 'Pulmonologia',
            description: 'Choroby układu oddechowego',
            icon: PulmonologyIcon,
            difficulty: 'hard',
            modules: 15,
            estimatedHours: 120,
            professions: ['lekarz', 'fizjoterapeuta_oddechowy'],
            prerequisites: ['1', '2'],
            color: '#3498db',
            progress: 0,
            isEnrolled: false
          },
          {
            id: '13',
            name: 'Gastroenterologia',
            description: 'Choroby układu pokarmowego',
            icon: GastroenterologyIcon,
            difficulty: 'hard',
            modules: 18,
            estimatedHours: 140,
            professions: ['lekarz', 'dietetyk'],
            prerequisites: ['1', '2', '3'],
            color: '#f39c12',
            progress: 0,
            isEnrolled: false
          },
          {
            id: '14',
            name: 'Nefrologia',
            description: 'Choroby nerek i układu moczowego',
            icon: NephrologyIcon,
            difficulty: 'hard',
            modules: 12,
            estimatedHours: 100,
            professions: ['lekarz', 'pielęgniarka_nefrologiczna'],
            prerequisites: ['1', '2'],
            color: '#9b59b6',
            progress: 0,
            isEnrolled: false
          },
          {
            id: '15',
            name: 'Endokrynologia',
            description: 'Choroby gruczołów wydzielania wewnętrznego',
            icon: EndocrinologyIcon,
            difficulty: 'hard',
            modules: 14,
            estimatedHours: 110,
            professions: ['lekarz', 'dietetyk'],
            prerequisites: ['2', '3'],
            color: '#1abc9c',
            progress: 0,
            isEnrolled: false
          }
        ],
        specialized: [
          {
            id: '101',
            name: 'EKG - Elektrokardiografia',
            description: 'Interpretacja zapisów EKG - od podstaw do zaawansowanych przypadków',
            icon: EKGIcon,
            difficulty: 'medium',
            modules: 8,
            estimatedHours: 40,
            professions: ['lekarz', 'pielęgniarka', 'ratownik_medyczny'],
            prerequisites: ['11'],
            color: '#e74c3c',
            progress: 60,
            isEnrolled: true
          },
          {
            id: '102',
            name: 'Ultrasonografia',
            description: 'Badania USG - POCUS, brzucha, serca, położnicze',
            icon: UltrasoundIcon,
            difficulty: 'hard',
            modules: 15,
            estimatedHours: 100,
            professions: ['lekarz', 'sonografista'],
            prerequisites: ['1'],
            color: '#3498db',
            progress: 0,
            isEnrolled: false
          },
          {
            id: '103',
            name: 'Radiologia',
            description: 'Interpretacja obrazów rentgenowskich, CT, MRI',
            icon: RadiologyIcon,
            difficulty: 'hard',
            modules: 20,
            estimatedHours: 120,
            professions: ['lekarz', 'radiolog'],
            prerequisites: ['1'],
            color: '#34495e',
            progress: 0,
            isEnrolled: false
          }
        ]
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      let categorySubjects: Subject[] = [];
      if (category === 'all') {
        categorySubjects = [
          ...mockSubjects.preclinical,
          ...mockSubjects.clinical,
          ...mockSubjects.specialized
        ];
      } else {
        categorySubjects = mockSubjects[category] || [];
      }

      setSubjects(categorySubjects);
    } catch (err) {
      setError('Nie udało się załadować przedmiotów');
      console.error('Error loading subjects:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter subjects based on search term
  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.categories?.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getCategoryTitle = () => {
    switch (category) {
      case 'preclinical':
        return 'Przedmioty przedkliniczne';
      case 'clinical':
        return 'Przedmioty kliniczne';
      case 'specialized':
        return 'Moduły specjalistyczne';
      default:
        return 'Wszystkie przedmioty';
    }
  };

  const getCategoryDescription = () => {
    switch (category) {
      case 'preclinical':
        return 'Podstawy nauk medycznych - anatomia, fizjologia, biochemia i inne przedmioty fundamentalne';
      case 'clinical':
        return 'Przedmioty kliniczne - specjalizacje medyczne i praktyka kliniczna';
      case 'specialized':
        return 'Specjalistyczne umiejętności i techniki - EKG, USG, radiologia';
      default:
        return 'Kompleksowa biblioteka edukacyjnych materiałów medycznych';
    }
  };

  if (loading) {
    return (
      <AnimatedSection animation="fadeIn" delay={0}>
        {/* Skeleton Header */}
        <AnimatedSection animation="slideDown" delay={100}>
          <div className={`mb-8 p-6 rounded-2xl ${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} education-glass border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} shadow-lg`}>
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 animate-pulse"></div>
            <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6 animate-pulse"></div>
            <SkeletonStats darkMode={darkMode} count={4} />
          </div>
        </AnimatedSection>
        {/* Skeleton Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard darkMode={darkMode} count={6} />
        </div>
      </AnimatedSection>
    );
  }

  if (error) {
    return (
      <AnimatedSection animation="fadeIn" delay={0}>
        <div className="text-center py-16">
          <div className={`p-12 rounded-2xl max-w-lg mx-auto ${darkMode ? 'bg-gradient-to-br from-red-900/90 to-rose-900/80 border border-red-500/50' : 'bg-gradient-to-br from-red-50/90 to-rose-50/80 border border-red-200/50'} education-glass shadow-2xl relative overflow-hidden`}>
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-red-500 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '2s' }}></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-rose-500 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '3s', animationDelay: '1s' }}></div>
            </div>
            
            <div className="relative z-10">
              <div className="mb-6">
                <div className="inline-block p-6 rounded-2xl bg-gradient-to-br from-red-500/30 to-rose-500/20 education-icon-wrapper animate-bounce" style={{ animationDuration: '1.5s', animationIterationCount: 'infinite' }}>
                  <ExclamationCircleIcon className={`${darkMode ? 'text-red-400' : 'text-red-600'} animate-pulse`} size={64} />
                </div>
              </div>
              <h3 className={`text-2xl font-bold mb-3 bg-gradient-to-r ${darkMode ? 'from-white via-red-200 to-rose-300' : 'from-gray-900 via-red-700 to-rose-800'} bg-clip-text text-transparent animate-gradient`}>
                Wystąpił błąd
              </h3>
              <p className={`text-lg font-semibold mb-6 ${darkMode ? 'text-red-300' : 'text-red-700'}`}>{error}</p>
              <RippleButton
                onClick={loadSubjects}
                variant="primary"
                darkMode={darkMode}
                className="px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Spróbuj ponownie
              </RippleButton>
            </div>
          </div>
        </div>
      </AnimatedSection>
    );
  }

  return (
    <AnimatedSection animation="fadeIn" delay={0}>
      {/* Category Header */}
      <AnimatedSection animation="slideDown" delay={100}>
        <div className={`mb-8 p-6 rounded-2xl ${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} education-glass border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} shadow-lg`}>
        <h2 className={`${fontSize === 'large' ? 'text-3xl' : fontSize === 'small' ? 'text-xl' : 'text-2xl'} font-bold mb-2 bg-gradient-to-r ${darkMode ? 'from-white via-blue-200 to-cyan-200' : 'from-gray-900 via-blue-600 to-cyan-600'} bg-clip-text text-transparent`}>
          {getCategoryTitle()}
        </h2>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
          {getCategoryDescription()}
        </p>
        
        {/* Category Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-4 rounded-xl flex items-center ${darkMode ? 'bg-gray-700/50 border border-gray-600/50' : 'bg-blue-50 border border-blue-200/50'}`}>
            <div className={`p-2 rounded-lg mr-3 ${darkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
              <AllSubjectsIcon className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`} size={18} />
            </div>
            <div>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Przedmiotów</p>
              <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <CountUp end={filteredSubjects.length} duration={1500} />
              </p>
            </div>
          </div>
          <div className={`p-4 rounded-xl flex items-center ${darkMode ? 'bg-gray-700/50 border border-gray-600/50' : 'bg-purple-50 border border-purple-200/50'}`}>
            <div className={`p-2 rounded-lg mr-3 ${darkMode ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
              <BookOpenIcon className={`${darkMode ? 'text-purple-400' : 'text-purple-600'}`} size={18} />
            </div>
            <div>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Modułów</p>
              <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <CountUp end={filteredSubjects.reduce((sum, s) => sum + s.modules, 0)} duration={1500} />
              </p>
            </div>
          </div>
          <div className={`p-4 rounded-xl flex items-center ${darkMode ? 'bg-gray-700/50 border border-gray-600/50' : 'bg-green-50 border border-green-200/50'}`}>
            <div className={`p-2 rounded-lg mr-3 ${darkMode ? 'bg-green-500/20' : 'bg-green-100'}`}>
              <ClockIcon className={`${darkMode ? 'text-green-400' : 'text-green-600'}`} size={18} />
            </div>
            <div>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Godzin</p>
              <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                ~<CountUp end={filteredSubjects.reduce((sum, s) => sum + s.estimatedHours, 0)} duration={1500} />
              </p>
            </div>
          </div>
          <div className={`p-4 rounded-xl flex items-center ${darkMode ? 'bg-gray-700/50 border border-gray-600/50' : 'bg-yellow-50 border border-yellow-200/50'}`}>
            <div className={`p-2 rounded-lg mr-3 ${darkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'}`}>
              <StarIcon className={`${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} size={18} />
            </div>
            <div>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Zapisanych</p>
              <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <CountUp end={filteredSubjects.filter(s => s.isEnrolled).length} duration={1500} />
              </p>
            </div>
          </div>
        </div>
        </div>
      </AnimatedSection>

      {/* Search Results Info */}
      {searchTerm && (
        <AnimatedSection animation="slideUp" delay={200}>
          <div className={`mb-6 p-4 rounded-xl ${darkMode ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30' : 'bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200'} education-glass shadow-lg relative overflow-hidden`}>
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '2s' }}></div>
            </div>
            
            <div className="flex items-center relative z-10">
              <div className={`p-2 rounded-lg mr-3 ${darkMode ? 'bg-blue-500/20' : 'bg-blue-100'} animate-pulse`} style={{ animationDuration: '2s' }}>
                <SearchIcon className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`} size={18} />
              </div>
              <p className={`${darkMode ? 'text-blue-300' : 'text-blue-700'} font-medium`}>
                Znaleziono <strong className="font-bold"><CountUp end={filteredSubjects.length} duration={800} /></strong> przedmiotów dla zapytania "<strong className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{searchTerm}</strong>"
              </p>
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Subjects Grid */}
      {filteredSubjects.length > 0 ? (
        <AnimatedSection animation="fadeIn" delay={300}>
          <SubjectGrid 
            subjects={filteredSubjects} 
            darkMode={darkMode} 
            fontSize={fontSize}
          />
        </AnimatedSection>
      ) : (
        <AnimatedSection animation="fadeIn" delay={200}>
          <div className="text-center py-16">
            <div className={`p-12 rounded-2xl max-w-lg mx-auto ${darkMode ? 'bg-gradient-to-br from-gray-800/90 to-gray-900/80 border border-gray-700/50' : 'bg-gradient-to-br from-white/90 to-gray-50/80 border border-gray-200/50'} education-glass shadow-2xl relative overflow-hidden`}>
              {/* Animated Background */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '3s' }}></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
              </div>
              
              <div className="relative z-10">
                <div className="mb-6">
                  <div className="inline-block p-6 rounded-2xl bg-gradient-to-br from-gray-500/30 to-gray-600/20 education-icon-wrapper animate-bounce" style={{ animationDuration: '2s', animationIterationCount: 'infinite' }}>
                    <SearchIcon className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} animate-pulse`} size={64} />
                  </div>
                </div>
                <h3 className={`text-2xl font-bold mb-3 bg-gradient-to-r ${darkMode ? 'from-white via-gray-200 to-gray-300' : 'from-gray-900 via-gray-700 to-gray-600'} bg-clip-text text-transparent animate-gradient`}>
                  Nie znaleziono przedmiotów
                </h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6 text-lg`}>
                  {searchTerm 
                    ? `Brak wyników dla "${searchTerm}". Spróbuj innych słów kluczowych.`
                    : 'W tej kategorii nie ma jeszcze dostępnych przedmiotów.'
                  }
                </p>
                {searchTerm && (
                  <RippleButton
                    onClick={() => {
                      // Clear search - this would need to be passed as prop or handled differently
                      window.location.reload();
                    }}
                    variant="primary"
                    darkMode={darkMode}
                    className="px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Wyczyść wyszukiwanie
                  </RippleButton>
                )}
              </div>
            </div>
          </div>
        </AnimatedSection>
      )}
    </AnimatedSection>
  );
};

export default SubjectCategory;