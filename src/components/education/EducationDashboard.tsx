import React, { useState, useEffect } from 'react';
import {
  BookOpenIcon,
  ChartLineIcon,
  ClockIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  AllSubjectsIcon,
  PreclinicalIcon,
  ClinicalIcon,
  SpecializedIcon,
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
  MedicalSoundsIcon,
  ProfessionsIcon
} from './icons/EducationIcons';
import { LockIcon } from '../icons/PlatformIcons';
import SubjectGrid from './SubjectGrid';
import Sidebar from '../navigation/Sidebar';
import { useUser } from '../../hooks/useUser';
import { useStudyField } from '../../hooks/useStudyField';
import { useAuth } from '../../contexts/AuthContext';
import { useUserLocation } from '../../hooks/useUserLocation';
import MedicalSoundsPlayer from './MedicalSoundsPlayer';
import FriendsPanel from './friends/FriendsPanel';
import Leaderboard from './friends/Leaderboard';
import { CountUp, InfoIcon, RippleButton } from './components';
import { UsersIcon, TrophyIcon } from '../icons/PlatformIcons';
import AnimatedSection from './components/AnimatedSection';
import PlatformInfoModal from '../PlatformInfoModal';
import PlatformAccessSection from '../PlatformAccessSection';
import './styles/educationStyles.css';
import { educationService } from '../../services/educationService';
import { DashboardStats, ActivityItem, EducationSubject } from '../../services/mockEducationService';

interface EducationDashboardProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

// Icon Mapping
const iconMap: { [key: string]: React.ElementType } = {
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
  MedicalSoundsIcon,
  ProfessionsIcon
};

const EducationDashboard: React.FC<EducationDashboardProps> = ({ darkMode, fontSize }) => {
  const { isAuthenticated, loading } = useUser();
  const { isAuthenticated: authIsAuthenticated } = useAuth();
  const { country, isForeign, isLoading: locationLoading } = useUserLocation();
  const { fieldData: studyField } = useStudyField();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const CLICK_THRESHOLD = 3;
  
  // Stan dla modala z informacjami o platformie (tylko dla zalogowanych użytkowników zagranicznych)
  const [showPlatformModal, setShowPlatformModal] = useState(false);
  const [showAccessSection, setShowAccessSection] = useState(false);
  const [hasShownModal, setHasShownModal] = useState(false);

  // Check if user has access to medical sounds (medicine or rescue)
  const hasMedicalSoundsAccess = studyField?.value === 'medycyna' || studyField?.value === 'ratownictwo_medyczne';

  // Check URL to see if we should show medical sounds player
  const [showMedicalSounds, setShowMedicalSounds] = useState(false);

  // Initialize from localStorage or default to true
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('education_sidebar_open');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('education_sidebar_open', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/edukacja/odglosy-medyczne') {
      setShowMedicalSounds(true);
    } else {
      setShowMedicalSounds(false);
    }
  }, []);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({
    preclinical: true,
    clinical: false,
    specialized: false
  });
  const [showFriendsPanel, setShowFriendsPanel] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Track clicks for unauthenticated users - show login prompt after 3 clicks
  useEffect(() => {
    if (isAuthenticated) {
      // Reset if user is authenticated
      setShowLoginPrompt(false);
      setClickCount(0);
      return;
    }

    const handleClick = () => {
      setClickCount(prev => {
        const newCount = prev + 1;
        if (newCount > CLICK_THRESHOLD) {
          setShowLoginPrompt(true);
        }
        return newCount;
      });
    };

    // Add click listener only for unauthenticated users
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [isAuthenticated, CLICK_THRESHOLD]);

  // Logika wyświetlania modala dla zalogowanych użytkowników zagranicznych
  useEffect(() => {
    // Sprawdź czy użytkownik jest zalogowany i z zagranicy
    if (!locationLoading && authIsAuthenticated && isForeign && !hasShownModal) {
      // Sprawdź czy użytkownik już widział modal (w localStorage)
      const hasSeenModal = localStorage.getItem('platformInfoModalShown');
      if (!hasSeenModal) {
        // Pokaż modal po interakcji użytkownika (nie od razu)
        const handleUserInteraction = () => {
          setShowPlatformModal(true);
          setHasShownModal(true);
          localStorage.setItem('platformInfoModalShown', 'true');
        };

        // Nasłuchuj na pierwsze kliknięcie użytkownika
        document.addEventListener('click', handleUserInteraction, { once: true });
        return () => document.removeEventListener('click', handleUserInteraction);
      }
    }
  }, [locationLoading, authIsAuthenticated, isForeign, hasShownModal]);

  const handleShowAccess = () => {
    setShowAccessSection(true);
    // Przewiń do sekcji dostępu
    setTimeout(() => {
      const accessSection = document.getElementById('platform-access-section');
      if (accessSection) {
        accessSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalModules: 0,
    completedModules: 0,
    studyTimeThisWeek: 0,
    currentStreak: 0
  });

  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [subjects, setSubjects] = useState<{ preclinical: EducationSubject[], clinical: EducationSubject[], specialized: EducationSubject[] }>({
    preclinical: [],
    clinical: [],
    specialized: []
  });
  const [isLoadingData, setIsLoadingData] = useState(true);

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

    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        const stats = await educationService.getDashboardStats();
        setDashboardStats(stats);

        const activity = await educationService.getRecentActivity();
        setRecentActivity(activity);

        const subjectsData = await educationService.getSubjects();
        // Map string icons to components
        const mapIcons = (list: any[]) => list.map(sub => ({
          ...sub,
          icon: iconMap[sub.iconName] || BookOpenIcon
        }));

        setSubjects({
          preclinical: mapIcons(subjectsData.preclinical),
          clinical: mapIcons(subjectsData.clinical),
          specialized: mapIcons(subjectsData.specialized)
        });

      } catch (err) {
        console.error("Failed to fetch education data", err);
      } finally {
        setIsLoadingData(false);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);


  const categories = [
    { id: 'all', name: 'Wszystkie przedmioty', icon: AllSubjectsIcon, count: 45 + (isAuthenticated ? 1 : 0), color: 'from-blue-500 to-cyan-500' },
    { id: 'preclinical', name: 'Przedmioty przedkliniczne', icon: PreclinicalIcon, count: subjects.preclinical.length, color: 'from-purple-500 to-pink-500' },
    { id: 'clinical', name: 'Przedmioty kliniczne', icon: ClinicalIcon, count: subjects.clinical.length, color: 'from-red-500 to-orange-500' },
    { id: 'specialized', name: 'Przedmioty specjalistyczne', icon: SpecializedIcon, count: subjects.specialized.length, color: 'from-yellow-500 to-amber-500' }
  ];

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };




  // Don't show loading spinner - go straight to login prompt or dashboard

  // If showing medical sounds player, render it instead of dashboard
  if (showMedicalSounds) {
    if (!hasMedicalSoundsAccess) {
      return (
        <div className={`min-h-screen ${darkMode ? 'bg-black' : 'bg-gray-50'} transition-colors duration-300`}>
          <div className="flex">
            <div className={`w-80 shrink-0`}>
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
            <div className="flex-1 p-6">
              <div className={`max-w-2xl mx-auto mt-20 p-8 rounded-lg shadow-xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}>
                <div className="text-center">
                  <div className="mb-4 flex justify-center">
                    <LockIcon className="w-20 h-20 text-[#38b6ff]" size={80} />
                  </div>
                  <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Dostęp ograniczony
                  </h2>
                  <p className={`text-lg mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Odsłuchiwanie odgłosów medycznych jest dostępne wyłącznie dla studentów kierunku lekarskiego i ratowników medycznych.
                  </p>
                  <RippleButton
                    onClick={() => {
                      window.history.pushState({}, '', '/edukacja');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                    variant="primary"
                    darkMode={darkMode}
                    className="px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl"
                  >
                    Powrót do platformy edukacyjnej
                  </RippleButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return <MedicalSoundsPlayer darkMode={darkMode} fontSize={fontSize} />;
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'} transition-colors duration-300`}>
      <div className="flex relative">
        <div className={`${isSidebarOpen ? 'w-80' : 'w-0'} shrink-0 transition-all duration-300 ease-in-out`}>
          <Sidebar
            darkMode={darkMode}
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            currentPage="edukacja"
            onNavigate={(path) => {
              window.history.pushState({}, '', path);
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
          />
        </div>

        <div className="flex-1 p-8 min-w-0">
          {/* Header z gradientem */}
          <div className="mb-10 education-fade-in">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                {!isSidebarOpen && (
                  <RippleButton
                    onClick={() => setIsSidebarOpen(true)}
                    variant="outline"
                    darkMode={darkMode}
                    className="p-2 rounded-lg"
                    aria-label="Pokaż menu"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="3" y1="12" x2="21" y2="12"></line>
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                  </RippleButton>
                )}
                <div>
                  <h1 className={`${fontSizes.title} font-bold mb-3 bg-gradient-to-r ${darkMode ? 'from-white via-blue-200 to-cyan-200' : 'from-gray-900 via-blue-600 to-cyan-600'} bg-clip-text text-transparent`}>
                    Platforma Edukacyjna
                  </h1>
                  <p className={`${fontSizes.subtitle} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Rozwijaj swoje umiejętności medyczne z najlepszymi materiałami edukacyjnymi
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <RippleButton
                  onClick={() => setShowFriendsPanel(!showFriendsPanel)}
                  variant={showFriendsPanel ? 'primary' : 'outline'}
                  darkMode={darkMode}
                  className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200`}
                >
                  <UsersIcon size={18} />
                  <span className={fontSizes.buttonText}>Znajomi</span>
                </RippleButton>
                <RippleButton
                  onClick={() => setShowLeaderboard(!showLeaderboard)}
                  variant={showLeaderboard ? 'primary' : 'outline'}
                  darkMode={darkMode}
                  className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200`}
                >
                  <TrophyIcon size={18} />
                  <span className={fontSizes.buttonText}>Ranking</span>
                </RippleButton>
              </div>
            </div>
          </div>

          {/* Friends Panel */}
          {showFriendsPanel && (
            <AnimatedSection animation="slideDown" delay={0}>
              <div className="mb-6">
                <FriendsPanel
                  darkMode={darkMode}
                  fontSize={fontSize}
                  onClose={() => setShowFriendsPanel(false)}
                />
              </div>
            </AnimatedSection>
          )}

          {/* Leaderboard */}
          {showLeaderboard && (
            <AnimatedSection animation="slideDown" delay={0}>
              <div className="mb-6">
                <Leaderboard
                  darkMode={darkMode}
                  fontSize={fontSize}
                />
              </div>
            </AnimatedSection>
          )}

          {/* Statystyki z ulepszonym designem */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className={`group relative p-6 rounded-2xl ${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} shadow-lg education-stat-card education-glass border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} education-fade-in transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 overflow-hidden`} style={{ animationDelay: '0.1s' }}>
              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl bg-gradient-to-br from-blue-500 to-cyan-500" />

              <div className="flex items-center relative z-10">
                <div className={`p-4 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 mr-4 education-icon-wrapper shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <BookOpenIcon className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className={`${fontSizes.buttonText} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Ukończone moduły
                    </p>
                    <InfoIcon
                      content="Liczba modułów, które ukończyłeś w pełni. Każdy ukończony moduł przybliża Cię do celu!"
                      darkMode={darkMode}
                      size={14}
                    />
                  </div>
                  <p className={`${fontSizes.cardTitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <CountUp
                      end={dashboardStats.completedModules}
                      duration={2000}
                      className={fontSizes.cardTitle}
                    />
                  </p>
                </div>
              </div>
            </div>

            <div className={`group relative p-6 rounded-2xl ${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} shadow-lg education-stat-card education-glass border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} education-fade-in transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 overflow-hidden`} style={{ animationDelay: '0.2s' }}>
              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl bg-gradient-to-br from-green-500 to-emerald-500" />

              <div className="flex items-center relative z-10">
                <div className={`p-4 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 mr-4 education-icon-wrapper shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <ClockIcon className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className={`${fontSizes.buttonText} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Czas nauki (tydzień)
                    </p>
                    <InfoIcon
                      content="Całkowity czas spędzony na nauce w tym tygodniu. Regularna nauka to klucz do sukcesu!"
                      darkMode={darkMode}
                      size={14}
                    />
                  </div>
                  <p className={`${fontSizes.cardTitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <CountUp
                      end={Math.floor(dashboardStats.studyTimeThisWeek / 60)}
                      duration={2000}
                      suffix="h "
                      className={fontSizes.cardTitle}
                    />
                    <CountUp
                      end={dashboardStats.studyTimeThisWeek % 60}
                      duration={2000}
                      suffix="m"
                      className={fontSizes.cardTitle}
                    />
                  </p>
                </div>
              </div>
            </div>

            <div className={`group relative p-6 rounded-2xl ${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} shadow-lg education-stat-card education-glass border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} education-fade-in transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 overflow-hidden`} style={{ animationDelay: '0.3s' }}>
              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl bg-gradient-to-br from-yellow-500 to-amber-500" />

              <div className="flex items-center relative z-10">
                <div className={`p-4 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500 mr-4 education-icon-wrapper shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <TrophyIcon className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className={`${fontSizes.buttonText} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Passa
                    </p>
                    <InfoIcon
                      content="Liczba kolejnych dni, w których uczyłeś się. Utrzymaj passę, aby osiągnąć lepsze wyniki!"
                      darkMode={darkMode}
                      size={14}
                    />
                  </div>
                  <p className={`${fontSizes.cardTitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <CountUp
                      end={dashboardStats.currentStreak}
                      duration={2000}
                      suffix=" dni"
                      className={fontSizes.cardTitle}
                    />
                  </p>
                </div>
              </div>
            </div>

            <div className={`group relative p-6 rounded-2xl ${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} shadow-lg education-stat-card education-glass border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} education-fade-in transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 overflow-hidden`} style={{ animationDelay: '0.4s' }}>
              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl bg-gradient-to-br from-purple-500 to-pink-500" />

              <div className="flex items-center relative z-10">
                <div className={`p-4 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 mr-4 education-icon-wrapper shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <ChartLineIcon className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className={`${fontSizes.buttonText} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Postęp ogólny
                    </p>
                    <InfoIcon
                      content="Twój ogólny postęp w nauce. Pokazuje, jaki procent wszystkich modułów ukończyłeś."
                      darkMode={darkMode}
                      size={14}
                    />
                  </div>
                  <p className={`${fontSizes.cardTitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <CountUp
                      end={dashboardStats.totalModules > 0 ? Math.round((dashboardStats.completedModules / dashboardStats.totalModules) * 100) : 0}
                      duration={2000}
                      suffix="%"
                      className={fontSizes.cardTitle}
                    />
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <AnimatedSection animation="slideUp" delay={500}>
            <div className={`mb-10 p-8 rounded-2xl ${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} shadow-xl education-glass border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
              <h3 className={`${fontSizes.cardTitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6 flex items-center`}>
                <span className="w-1 h-8 bg-gradient-to-b from-[#38b6ff] to-[#2a9fe5] rounded-full mr-3 animate-pulse"></span>
                Ostatnia aktywność
              </h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <AnimatedSection key={activity.id} animation="slideLeft" delay={600 + index * 100}>
                    <div className="group flex items-center justify-between p-4 rounded-xl hover:bg-opacity-50 transition-all education-card-hover relative overflow-hidden" style={{
                      backgroundColor: darkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 0.5)'
                    }}>
                      {/* Hover Glow */}
                      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-xl bg-gradient-to-r from-blue-500 to-cyan-500" />
                      <div className="flex items-center relative z-10">
                        <div className={`w-3 h-3 rounded-full mr-4 shadow-lg group-hover:scale-150 transition-transform duration-300 ${activity.type === 'module_completed' ? 'bg-green-500 animate-pulse' :
                          activity.type === 'quiz_passed' ? 'bg-blue-500 animate-pulse' : 'bg-yellow-500 animate-pulse'
                          }`} />
                        <div>
                          <p className={`${fontSizes.buttonText} font-medium ${darkMode ? 'text-white' : 'text-gray-900'} group-hover:text-[#38b6ff] transition-colors duration-300`}>
                            {activity.title}
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {activity.time}
                          </p>
                        </div>
                      </div>
                      <div className="text-right relative z-10">
                        {activity.progress !== undefined ? (
                          <span className={`text-sm font-bold px-3 py-1 rounded-full group-hover:scale-110 transition-transform duration-300 ${darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'}`}>
                            <CountUp end={activity.progress} duration={1000} />%
                          </span>
                        ) : activity.score !== undefined ? (
                          <span className={`text-sm font-bold px-3 py-1 rounded-full group-hover:scale-110 transition-transform duration-300 ${activity.score >= 70 ? darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700' : darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'}`}>
                            <CountUp end={activity.score} duration={1000} /> punktów
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Centered Category Tabs */}
          <div className="flex justify-center mb-10">
            <div className={`flex space-x-2 rounded-2xl p-2 ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} education-glass backdrop-blur-sm border ${darkMode ? 'border-gray-700/30' : 'border-gray-200/30'}`}>
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <RippleButton
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    variant={selectedCategory === category.id ? 'primary' : 'outline'}
                    darkMode={darkMode}
                    className={`px-6 py-3 rounded-xl font-medium relative overflow-hidden ${selectedCategory === category.id
                      ? `bg-gradient-to-r ${category.color} text-white shadow-xl transform scale-105`
                      : ''
                      } education-category-tab ${selectedCategory === category.id ? 'active' : ''}`}
                  >
                    <span className="flex items-center space-x-2 relative z-10">
                      <IconComponent className="w-5 h-5" size={20} />
                      <span className={fontSizes.buttonText}>{category.name}</span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${selectedCategory === category.id
                        ? 'bg-white/20 text-white'
                        : darkMode
                          ? 'bg-gray-600 text-gray-300'
                          : 'bg-gray-200 text-gray-600'
                        }`}>
                        <CountUp end={category.count} duration={800} />
                      </span>
                    </span>
                  </RippleButton>
                );
              })}
            </div>
          </div>

          {/* Expandable Category Sections */}
          {selectedCategory === 'all' ? (
            <div className="space-y-6">
              {/* Przedkliniczne */}
              <div className={`border rounded-2xl overflow-hidden ${darkMode ? 'border-gray-700/50 bg-gray-800/80' : 'border-gray-200/50 bg-white/80'
                } shadow-xl education-glass education-fade-in`}>
                <RippleButton
                  onClick={() => toggleCategory('preclinical')}
                  variant="outline"
                  darkMode={darkMode}
                  className="w-full p-6 flex justify-between items-center"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 education-icon-wrapper shadow-lg`}>
                      <PreclinicalIcon className="text-white" size={32} />
                    </div>
                    <div className="text-left">
                      <h3 className={`${fontSizes.cardTitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                        Przedkliniczne
                      </h3>
                      <p className={`${fontSizes.buttonText} ${darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                        Podstawy nauk medycznych - anatomia, fizjologia, biochemia
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1.5 rounded-lg text-sm font-bold ${darkMode ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-purple-100 text-purple-700 border border-purple-200'
                      }`}>
                      <CountUp end={subjects.preclinical.length} duration={1000} /> przedmiotów
                    </span>
                    <div className={`transition-transform duration-300 ${expandedCategories['preclinical'] ? 'rotate-180' : ''}`}>
                      {expandedCategories['preclinical'] ?
                        <ChevronUpIcon className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={20} /> :
                        <ChevronDownIcon className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
                      }
                    </div>
                  </div>
                </RippleButton>

                {expandedCategories['preclinical'] && (
                  <div className={`px-6 pb-6 border-t transition-all duration-300 ease-in-out ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'
                    }`}>
                    <div className="pt-6 education-expandable-content expanded">
                      <SubjectGrid
                        subjects={subjects.preclinical as any}
                        darkMode={darkMode}
                        fontSize={fontSize}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Kliniczne */}
              <div className={`border rounded-2xl overflow-hidden ${darkMode ? 'border-gray-700/50 bg-gray-800/80' : 'border-gray-200/50 bg-white/80'
                } shadow-xl education-glass education-fade-in`} style={{ animationDelay: '0.1s' }}>
                <button
                  onClick={() => toggleCategory('clinical')}
                  className={`w-full p-6 flex justify-between items-center transition-all duration-300 ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50/50'
                    }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 education-icon-wrapper shadow-lg`}>
                      <ClinicalIcon className="text-white" size={32} />
                    </div>
                    <div className="text-left">
                      <h3 className={`${fontSizes.cardTitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                        Kliniczne
                      </h3>
                      <p className={`${fontSizes.buttonText} ${darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                        Specjalizacje medyczne i praktyka kliniczna
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1.5 rounded-lg text-sm font-bold ${darkMode ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-red-100 text-red-700 border border-red-200'
                      }`}>
                      {subjects.clinical.length} przedmiotów
                    </span>
                    <div className={`transition-transform duration-300 ${expandedCategories['clinical'] ? 'rotate-180' : ''}`}>
                      {expandedCategories['clinical'] ?
                        <ChevronUpIcon className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={20} /> :
                        <ChevronDownIcon className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
                      }
                    </div>
                  </div>
                </button>

                {expandedCategories['clinical'] && (
                  <div className={`px-6 pb-6 border-t transition-all duration-300 ease-in-out ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'
                    }`}>
                    <div className="pt-6 education-expandable-content expanded">
                      <SubjectGrid
                        subjects={subjects.clinical as any}
                        darkMode={darkMode}
                        fontSize={fontSize}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Specjalistyczne */}
              <div className={`border rounded-2xl overflow-hidden ${darkMode ? 'border-gray-700/50 bg-gray-800/80' : 'border-gray-200/50 bg-white/80'
                } shadow-xl education-glass education-fade-in`} style={{ animationDelay: '0.2s' }}>
                <button
                  onClick={() => toggleCategory('specialized')}
                  className={`w-full p-6 flex justify-between items-center transition-all duration-300 ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50/50'
                    }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500 education-icon-wrapper shadow-lg`}>
                      <SpecializedIcon className="text-white" size={32} />
                    </div>
                    <div className="text-left">
                      <h3 className={`${fontSizes.cardTitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                        Specjalistyczne
                      </h3>
                      <p className={`${fontSizes.buttonText} ${darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                        Zaawansowane umiejętności - EKG, USG, radiologia
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1.5 rounded-lg text-sm font-bold ${darkMode ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                      }`}>
                      {subjects.specialized.length} modułów
                    </span>
                    <div className={`transition-transform duration-300 ${expandedCategories['specialized'] ? 'rotate-180' : ''}`}>
                      {expandedCategories['specialized'] ?
                        <ChevronUpIcon className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={20} /> :
                        <ChevronDownIcon className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
                      }
                    </div>
                  </div>
                </button>

                {expandedCategories['specialized'] && (
                  <div className={`px-6 pb-6 border-t transition-all duration-300 ease-in-out ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'
                    }`}>
                    <div className="pt-6 education-expandable-content expanded">
                      <SubjectGrid
                        subjects={subjects.specialized as any}
                        darkMode={darkMode}
                        fontSize={fontSize}
                      />
                    </div>
                  </div>
                )}
              </div>

            </div>
          ) : (
            /* Single Category View */
            <div>
              <SubjectGrid
                subjects={selectedCategory === 'preclinical' ? subjects.preclinical as any
                  : selectedCategory === 'clinical' ? subjects.clinical as any
                    : subjects.specialized as any}
                darkMode={darkMode}
                fontSize={fontSize}
              />
            </div>
          )}
        </div>
      </div>

      {/* Sekcja z informacjami o dostępie do platformy */}
      {showAccessSection && (
        <div id="platform-access-section" className="mt-8">
          <PlatformAccessSection 
            darkMode={darkMode} 
            userCountry={country}
          />
        </div>
      )}

      {/* Modal z informacjami o platformie (tylko dla zalogowanych użytkowników zagranicznych) */}
      <PlatformInfoModal
        isOpen={showPlatformModal}
        onClose={() => setShowPlatformModal(false)}
        onShowAccess={handleShowAccess}
        darkMode={darkMode}
      />

      {/* Login Overlay - shows after 3 clicks for unauthenticated users */}
      {showLoginPrompt && (
        <div className={`fixed inset-0 z-[60] flex items-center justify-center p-4 ${darkMode ? 'bg-black/80' : 'bg-black/60'} backdrop-blur-sm transition-all duration-300`}>
          <div className={`rounded-3xl p-8 max-w-md w-full text-center shadow-2xl scale-100 opacity-100 transform transition-all duration-300 relative overflow-hidden ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white'}`}>
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>

            <div className={`mb-6 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto shadow-inner ${darkMode ? 'bg-gray-800' : 'bg-blue-50'}`}>
              <LockIcon className="text-blue-500" size={40} />
            </div>

            <h2 className={`text-2xl font-bold mb-4 leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Dostęp tylko dla zalogowanych użytkowników
            </h2>

            <p className={`mb-8 leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Aby korzystać z platformy edukacyjnej, musisz być zalogowany.
              Zaloguj się, aby uzyskać dostęp do modułów, przedmiotów, fiszek i innych materiałów edukacyjnych.
            </p>

            <div className="space-y-4">
              <RippleButton
                onClick={() => {
                  window.history.pushState({}, '', '/login');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                variant="primary"
                darkMode={darkMode}
                className="w-full py-3.5 rounded-xl font-bold text-lg shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5"
              >
                Zaloguj się
              </RippleButton>

              <div className={`text-sm pt-2 pb-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Nie masz konta?{' '}
                <button
                  onClick={() => {
                    window.history.pushState({}, '', '/register');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }}
                  className="text-blue-500 font-semibold hover:text-blue-400 hover:underline transition-colors outline-none focus:outline-none bg-transparent border-none p-0 cursor-pointer"
                >
                  Zarejestruj się
                </button>
              </div>

              <button
                onClick={() => {
                  window.location.href = '/';
                }}
                className={`w-full mt-2 py-3 rounded-xl font-bold text-lg border-2 transition-colors duration-300 ${darkMode
                  ? 'border-gray-700 text-gray-400 hover:border-gray-600 hover:text-white'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-900'
                  }`}
              >
                Wróć na stronę główną
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationDashboard;