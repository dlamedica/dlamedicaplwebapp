import React, { useState, useEffect } from 'react';
import {
  BookOpenIcon,
  ChartLineIcon,
  ClockIcon,
  TrophyIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  UserInjuredIcon,
  AllSubjectsIcon,
  PreclinicalIcon,
  ClinicalIcon,
  SpecializedIcon,
  MyPatientIcon,
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
  ProfessionsIcon
} from './icons/EducationIcons';
import { LockIcon } from '../icons/PlatformIcons';
import SubjectGrid from './SubjectGrid';
import ProgressBar from './ProgressBar';
import Sidebar from '../navigation/Sidebar';
import { useUser } from '../../hooks/useUser';
import './styles/educationStyles.css';

interface EducationDashboardProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

interface DashboardStats {
  totalModules: number;
  completedModules: number;
  studyTimeThisWeek: number;
  currentStreak: number;
}

const EnhancedEducationDashboard: React.FC<EducationDashboardProps> = ({ darkMode, fontSize }) => {
  const { isAuthenticated, loading } = useUser();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({
    preclinical: true,
    clinical: false,
    specialized: false,
    myPatient: false
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setShowLoginPrompt(true);
    } else if (loading) {
      const timer = setTimeout(() => {
        if (!isAuthenticated) {
          setShowLoginPrompt(true);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [loading, isAuthenticated]);

  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalModules: 0,
    completedModules: 0,
    studyTimeThisWeek: 0,
    currentStreak: 0
  });

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

  useEffect(() => {
    document.title = 'Edukacja medyczna | DlaMedica.pl';

    if (isAuthenticated) {
      loadDashboardStats();
    }
  }, [isAuthenticated]);

  const loadDashboardStats = async () => {
    try {
      setDashboardStats({
        totalModules: 25,
        completedModules: 8,
        studyTimeThisWeek: 240,
        currentStreak: 5
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  const categories = [
    { id: 'all', name: 'Wszystkie', icon: AllSubjectsIcon, count: 45 + (isAuthenticated ? 1 : 0), color: 'from-blue-500 to-cyan-500' },
    { id: 'preclinical', name: 'Przedkliniczne', icon: PreclinicalIcon, count: 10, color: 'from-purple-500 to-pink-500' },
    { id: 'clinical', name: 'Kliniczne', icon: ClinicalIcon, count: 22, color: 'from-red-500 to-orange-500' },
    { id: 'specialized', name: 'Specjalistyczne', icon: SpecializedIcon, count: 13, color: 'from-yellow-500 to-amber-500' },
    ...(isAuthenticated ? [{ id: 'my-patient', name: 'Mój pacjent', icon: MyPatientIcon, count: 1, color: 'from-green-500 to-emerald-500' }] : [])
  ];

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const mockSubjects = {
    preclinical: [
      { id: '1', name: 'Anatomia', icon: AnatomyIcon, modules: 15, hours: 120, difficulty: 'medium', progress: 45, isEnrolled: true, color: '#e74c3c' },
      { id: '2', name: 'Fizjologia', icon: PhysiologyIcon, modules: 12, hours: 100, difficulty: 'hard', progress: 20, isEnrolled: true, color: '#3498db' },
      { id: '3', name: 'Biochemia', icon: BiochemistryIcon, modules: 10, hours: 80, difficulty: 'hard', progress: 0, isEnrolled: false, color: '#9b59b6' },
      { id: '4', name: 'Biofizyka', icon: BiophysicsIcon, modules: 8, hours: 60, difficulty: 'medium', progress: 0, isEnrolled: false, color: '#1abc9c' },
      { id: '5', name: 'Mikrobiologia', icon: MicrobiologyIcon, modules: 12, hours: 90, difficulty: 'medium', progress: 0, isEnrolled: false, color: '#e67e22' }
    ],
    clinical: [
      { id: '11', name: 'Kardiologia', icon: CardiologyIcon, modules: 20, hours: 150, difficulty: 'hard', progress: 15, isEnrolled: true, color: '#e74c3c' },
      { id: '12', name: 'Pulmonologia', icon: PulmonologyIcon, modules: 15, hours: 120, difficulty: 'hard', progress: 0, isEnrolled: false, color: '#3498db' },
      { id: '13', name: 'Gastroenterologia', icon: GastroenterologyIcon, modules: 18, hours: 140, difficulty: 'hard', progress: 0, isEnrolled: false, color: '#f39c12' },
      { id: '14', name: 'Nefrologia', icon: NephrologyIcon, modules: 12, hours: 100, difficulty: 'hard', progress: 0, isEnrolled: false, color: '#9b59b6' },
      { id: '15', name: 'Endokrynologia', icon: EndocrinologyIcon, modules: 14, hours: 110, difficulty: 'hard', progress: 0, isEnrolled: false, color: '#1abc9c' }
    ],
    specialized: [
      { id: '101', name: 'EKG - Elektrokardiografia', icon: EKGIcon, modules: 8, hours: 40, difficulty: 'medium', progress: 60, isEnrolled: true, color: '#e74c3c' },
      { id: '102', name: 'Ultrasonografia', icon: UltrasoundIcon, modules: 15, hours: 100, difficulty: 'hard', progress: 0, isEnrolled: false, color: '#3498db' },
      { id: '103', name: 'Radiologia', icon: RadiologyIcon, modules: 20, hours: 120, difficulty: 'hard', progress: 0, isEnrolled: false, color: '#34495e' }
    ]
  };

  const recentActivity = [
    {
      id: 1,
      type: 'module_completed',
      title: 'Anatomia Układu Krążenia',
      time: '2 godziny temu',
      progress: 100
    },
    {
      id: 2,
      type: 'quiz_passed',
      title: 'Test z kardiologii',
      time: '1 dzień temu',
      score: 85
    },
    {
      id: 3,
      type: 'module_started',
      title: 'Podstawy EKG',
      time: '3 dni temu',
      progress: 25
    }
  ];

  if (loading && !showLoginPrompt) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'}`}>
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-[#38b6ff] border-r-[#38b6ff] mx-auto"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-b-[#2a9fe5] border-l-[#2a9fe5] animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className={`mt-6 ${fontSizes.cardText} font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Sprawdzanie uprawnień...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || showLoginPrompt) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'} transition-colors duration-300`}>
        <div className="flex items-center justify-center min-h-screen p-6">
          <div className={`max-w-2xl w-full p-10 rounded-2xl shadow-2xl backdrop-blur-sm ${darkMode ? 'bg-gray-800/90 border border-gray-700/50' : 'bg-white/90 border border-gray-200/50'
            } education-glass education-scale-in`}>
            <div className="text-center">
              <div className="mb-8">
                <div className={`inline-block p-6 rounded-2xl ${darkMode ? 'bg-gradient-to-br from-gray-700 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-cyan-50'
                  } education-icon-wrapper`}>
                  <LockIcon className={`w-20 h-20 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} size={80} />
                </div>
              </div>
              <h2 className={`${fontSizes.title} font-bold mb-4 bg-gradient-to-r ${darkMode ? 'from-white to-gray-300' : 'from-gray-900 to-gray-700'} bg-clip-text text-transparent`}>
                Dostęp tylko dla zalogowanych użytkowników
              </h2>
              <p className={`${fontSizes.subtitle} mb-10 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Aby korzystać z platformy edukacyjnej, musisz być zalogowany. Zaloguj się, aby uzyskać dostęp do modułów,
                przedmiotów, fiszek i innych materiałów edukacyjnych.
              </p>
              <button
                onClick={() => {
                  window.history.pushState({}, '', '/login');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                className={`px-10 py-4 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-[#38b6ff] to-[#2a9fe5] text-white ${fontSizes.buttonText} shadow-lg hover:shadow-2xl transform hover:scale-105 education-button`}
              >
                Zaloguj się
              </button>
              <p className={`${fontSizes.cardText} mt-8 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Nie masz konta?{' '}
                <button
                  onClick={() => {
                    window.history.pushState({}, '', '/register');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }}
                  className={`font-semibold hover:underline transition-all ${darkMode ? 'text-[#38b6ff] hover:text-[#2a9fe5]' : 'text-[#38b6ff] hover:text-[#2a9fe5]'}`}
                >
                  Zarejestruj się
                </button>
              </p>

              <div className="mt-8 pt-6 border-t border-gray-200/10">
                <button
                  onClick={() => {
                    window.history.pushState({}, '', '/');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }}
                  className={`text-sm font-medium transition-colors duration-300 flex items-center justify-center mx-auto ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                    }`}
                >
                  <span className="mr-2">←</span> Wróć do strony głównej
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'} transition-colors duration-300`}>
      <div className="flex">
        <div className="w-80">
          <Sidebar
            darkMode={darkMode}
            isOpen={true}
            currentPage="edukacja"
            onNavigate={(path) => {
              window.history.pushState({}, '', path);
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
          />
        </div>

        <div className="flex-1 p-8">
          {/* Header z gradientem */}
          <div className="mb-10 education-fade-in">
            <h1 className={`${fontSizes.title} font-bold mb-3 bg-gradient-to-r ${darkMode ? 'from-white via-blue-200 to-cyan-200' : 'from-gray-900 via-blue-600 to-cyan-600'} bg-clip-text text-transparent`}>
              Platforma Edukacyjna
            </h1>
            <p className={`${fontSizes.subtitle} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Rozwijaj swoje umiejętności medyczne z najlepszymi materiałami edukacyjnymi
            </p>
          </div>

          {/* Statystyki z ulepszonym designem */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} shadow-lg education-stat-card education-glass border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} education-fade-in`} style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center">
                <div className={`p-4 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 mr-4 education-icon-wrapper shadow-lg`}>
                  <BookOpenIcon className="text-white" size={24} />
                </div>
                <div>
                  <p className={`${fontSizes.buttonText} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
                    Ukończone moduły
                  </p>
                  <p className={`${fontSizes.cardTitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {dashboardStats.completedModules}
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} shadow-lg education-stat-card education-glass border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} education-fade-in`} style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center">
                <div className={`p-4 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 mr-4 education-icon-wrapper shadow-lg`}>
                  <ClockIcon className="text-white" size={24} />
                </div>
                <div>
                  <p className={`${fontSizes.buttonText} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
                    Czas nauki (tydzień)
                  </p>
                  <p className={`${fontSizes.cardTitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {Math.floor(dashboardStats.studyTimeThisWeek / 60)}h {dashboardStats.studyTimeThisWeek % 60}m
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} shadow-lg education-stat-card education-glass border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} education-fade-in`} style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center">
                <div className={`p-4 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500 mr-4 education-icon-wrapper shadow-lg`}>
                  <TrophyIcon className="text-white" size={24} />
                </div>
                <div>
                  <p className={`${fontSizes.buttonText} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
                    Passa
                  </p>
                  <p className={`${fontSizes.cardTitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {dashboardStats.currentStreak} dni
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} shadow-lg education-stat-card education-glass border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} education-fade-in`} style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center">
                <div className={`p-4 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 mr-4 education-icon-wrapper shadow-lg`}>
                  <ChartLineIcon className="text-white" size={24} />
                </div>
                <div>
                  <p className={`${fontSizes.buttonText} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
                    Postęp ogólny
                  </p>
                  <p className={`${fontSizes.cardTitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {Math.round((dashboardStats.completedModules / dashboardStats.totalModules) * 100)}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Ostatnia aktywność z ulepszonym designem */}
          <div className={`mb-10 p-8 rounded-2xl ${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} shadow-xl education-glass border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} education-fade-in`}>
            <h3 className={`${fontSizes.cardTitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6 flex items-center`}>
              <span className="w-1 h-8 bg-gradient-to-b from-[#38b6ff] to-[#2a9fe5] rounded-full mr-3"></span>
              Ostatnia aktywność
            </h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={activity.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-opacity-50 transition-all education-card-hover" style={{
                  backgroundColor: darkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 0.5)',
                  animationDelay: `${index * 0.1}s`
                }}>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-4 shadow-lg ${activity.type === 'module_completed' ? 'bg-green-500 animate-pulse' :
                        activity.type === 'quiz_passed' ? 'bg-blue-500 animate-pulse' : 'bg-yellow-500 animate-pulse'
                      }`} />
                    <div>
                      <p className={`${fontSizes.buttonText} font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {activity.title}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {activity.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {activity.progress !== undefined ? (
                      <span className={`text-sm font-bold px-3 py-1 rounded-full ${darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'}`}>
                        {activity.progress}%
                      </span>
                    ) : activity.score !== undefined ? (
                      <span className={`text-sm font-bold px-3 py-1 rounded-full ${activity.score >= 70 ? darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700' : darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'}`}>
                        {activity.score} punktów
                      </span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kategorie z ulepszonym designem */}
          <div className="flex justify-center mb-10">
            <div className={`flex space-x-2 rounded-2xl p-2 ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} education-glass backdrop-blur-sm border ${darkMode ? 'border-gray-700/30' : 'border-gray-200/30'}`}>
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 relative overflow-hidden ${selectedCategory === category.id
                        ? `bg-gradient-to-r ${category.color} text-white shadow-xl transform scale-105`
                        : darkMode
                          ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                          : 'text-gray-700 hover:bg-white hover:text-gray-900'
                      } education-category-tab ${selectedCategory === category.id ? 'active' : ''}`}
                  >
                    <span className="flex items-center space-x-2 relative z-10">
                      <IconComponent className="w-5 h-5" size={20} />
                      <span className={fontSizes.buttonText}>{category.name}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${selectedCategory === category.id
                          ? 'bg-white/20 text-white'
                          : darkMode
                            ? 'bg-gray-600 text-gray-300'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                        {category.count}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sekcje kategorii - kontynuacja w następnej części ze względu na długość */}
          {/* ... reszta kodu podobna do oryginału ale z ulepszonymi stylami ... */}
        </div>
      </div>
    </div>
  );
};

export default EnhancedEducationDashboard;

