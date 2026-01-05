import React, { useState, useEffect } from 'react';
import MainLayout from '../layout/MainLayout';
import { 
  FaPlus, 
  FaPlay, 
  FaPause, 
  FaEdit, 
  FaEye, 
  FaTrash, 
  FaShare,
  FaStar,
  FaFire,
  FaClock,
  FaBookOpen,
  FaDumbbell,
  FaUser,
  FaChartLine,
  FaFilter,
  FaSearch,
  FaCheckCircle
} from 'react-icons/fa';

interface StudyPlan {
  id: number;
  title: string;
  description: string;
  category: string;
  profession: string;
  status: 'active' | 'template' | 'completed' | 'paused';
  duration: string;
  lessons: number;
  exercises: number;
  flashcards: number;
  progress: number;
  difficulty: number; // 1-5
  rating: number;
  studentsEnrolled: number;
  author: string;
  thumbnail: string;
  nextLesson?: string;
  timeLeft?: string;
  lastAccessed?: string;
}

interface StudyPlansLibraryProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const StudyPlansLibrary: React.FC<StudyPlansLibraryProps> = ({ darkMode, fontSize }) => {
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [activeTab, setActiveTab] = useState<'my-plans' | 'recommended' | 'templates' | 'create'>('my-plans');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('wszystkie');

  useEffect(() => {
    document.title = 'Plany Nauki – DlaMedica.pl';
    
    // Mock study plans data
    const mockPlans: StudyPlan[] = [
      {
        id: 1,
        title: "Przygotowanie do LEK - Kardiologia",
        description: "Kompletny plan przygotowania do egzaminu LEK w zakresie kardiologii. 8 tygodni intensywnej nauki z materiałami video, quizami i przypadkami klinicznymi.",
        category: "Przygotowanie do egzaminów",
        profession: "Lekarz",
        status: "active",
        duration: "8 tygodni",
        lessons: 45,
        exercises: 120,
        flashcards: 300,
        progress: 51,
        difficulty: 4,
        rating: 4.8,
        studentsEnrolled: 1247,
        author: "Dr. Jan Kowalski",
        thumbnail: "🫀",
        nextLesson: "EKG - interpretacja podstawowa",
        timeLeft: "3 tygodnie",
        lastAccessed: "2 godziny temu"
      },
      {
        id: 2,
        title: "Anatomia układu nerwowego - podstawy",
        description: "Systematyczna nauka anatomii układu nerwowego z wykorzystaniem modeli 3D, atlasów i interaktywnych ćwiczeń.",
        category: "Rozwój zawodowy",
        profession: "Lekarz",
        status: "paused",
        duration: "6 tygodni",
        lessons: 32,
        exercises: 85,
        flashcards: 200,
        progress: 23,
        difficulty: 3,
        rating: 4.6,
        studentsEnrolled: 856,
        author: "Prof. Anna Nowak",
        thumbnail: "🧠",
        nextLesson: "Pień mózgu - budowa",
        timeLeft: "4 tygodnie",
        lastAccessed: "5 dni temu"
      },
      {
        id: 3,
        title: "Pielęgniarstwo chirurgiczne - zaawansowane",
        description: "Specjalistyczny kurs dla pielęgniarek chirurgicznych. Opieka przed- i pooperacyjna, powikłania, nowoczesne techniki.",
        category: "Specjalizacja",
        profession: "Pielęgniarka",
        status: "template", 
        duration: "12 tygodni",
        lessons: 60,
        exercises: 180,
        flashcards: 400,
        progress: 0,
        difficulty: 4,
        rating: 4.9,
        studentsEnrolled: 543,
        author: "Mgr Ewa Kowalczyk",
        thumbnail: "🏥"
      },
      {
        id: 4,
        title: "Fizjoterapia neurologiczna - NDT-Bobath",
        description: "Metoda NDT-Bobath w rehabilitacji neurologicznej. Od teorii do praktycznego zastosowania w terapii pacjentów po udarze.",
        category: "Specjalizacja",
        profession: "Fizjoterapeuta",
        status: "completed",
        duration: "16 tygodni",
        lessons: 72,
        exercises: 250,
        flashcards: 350,
        progress: 100,
        difficulty: 5,
        rating: 4.7,
        studentsEnrolled: 234,
        author: "Dr. Tomasz Wiśniewski",
        thumbnail: "🦴",
        lastAccessed: "2 tygodnie temu"
      },
      {
        id: 5,
        title: "Farmakologia kliniczna - podstawy",
        description: "Wprowadzenie do farmakologii klinicznej dla farmaceutów. Interakcje lekowe, farmakokinetyka, TDM.",
        category: "Rozwój zawodowy",
        profession: "Farmaceuta",
        status: "template",
        duration: "10 tygodni", 
        lessons: 40,
        exercises: 100,
        flashcards: 250,
        progress: 0,
        difficulty: 3,
        rating: 4.5,
        studentsEnrolled: 678,
        author: "Prof. Magdalena Jabłońska",
        thumbnail: "💊"
      }
    ];
    
    setPlans(mockPlans);
  }, []);

  const handleCreatePlan = () => {
    window.history.pushState({}, '', '/plany-nauki/create');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handleStartPlan = (planId: number) => {
    // Start plan logic
    setPlans(prev => prev.map(plan => 
      plan.id === planId ? { ...plan, status: 'active' as const } : plan
    ));
  };

  const handleContinuePlan = (planId: number) => {
    window.history.pushState({}, '', `/plany-nauki/active/${planId}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handlePausePlan = (planId: number) => {
    setPlans(prev => prev.map(plan => 
      plan.id === planId ? { ...plan, status: 'paused' as const } : plan
    ));
  };

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          title: 'text-2xl',
          subtitle: 'text-base',
          cardTitle: 'text-lg',
          cardText: 'text-sm',
          buttonText: 'text-sm',
          statValue: 'text-xl',
          statLabel: 'text-xs'
        };
      case 'large':
        return {
          title: 'text-4xl',
          subtitle: 'text-xl',
          cardTitle: 'text-2xl',
          cardText: 'text-lg',
          buttonText: 'text-lg',
          statValue: 'text-3xl',
          statLabel: 'text-base'
        };
      default:
        return {
          title: 'text-3xl',
          subtitle: 'text-lg',
          cardTitle: 'text-xl',
          cardText: 'text-base',
          buttonText: 'text-base',
          statValue: 'text-2xl',
          statLabel: 'text-sm'
        };
    }
  };

  const fontSizes = getFontSizeClasses();

  // Filter plans based on active tab and search
  const getFilteredPlans = () => {
    let filtered = plans;

    // Filter by tab
    switch (activeTab) {
      case 'my-plans':
        filtered = plans.filter(p => p.status === 'active' || p.status === 'paused' || p.status === 'completed');
        break;
      case 'recommended':
        filtered = plans.filter(p => p.profession === 'Lekarz' && p.rating >= 4.5); // Mock AI recommendation
        break;
      case 'templates':
        filtered = plans.filter(p => p.status === 'template');
        break;
    }

    // Apply search and category filters
    if (searchTerm) {
      filtered = filtered.filter(plan => 
        plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'wszystkie') {
      filtered = filtered.filter(plan => plan.category === selectedCategory);
    }

    return filtered;
  };

  const getStatusConfig = (status: StudyPlan['status']) => {
    switch (status) {
      case 'active':
        return {
          badge: '🔥 Aktywny',
          color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
          actions: [
            { label: 'Kontynuuj', icon: FaPlay, primary: true, action: 'continue' },
            { label: 'Wstrzymaj', icon: FaPause, action: 'pause' },
            { label: 'Edytuj', icon: FaEdit, action: 'edit' }
          ]
        };
      case 'template':
        return {
          badge: '📋 Szablon',
          color: 'bg-[#38b6ff]/20 text-[#2a9fe5] dark:bg-[#38b6ff]/10 dark:text-[#38b6ff]',
          actions: [
            { label: 'Rozpocznij', icon: FaPlay, primary: true, action: 'start' },
            { label: 'Podgląd', icon: FaEye, action: 'preview' },
            { label: 'Dostosuj', icon: FaEdit, action: 'customize' }
          ]
        };
      case 'completed':
        return {
          badge: '✅ Ukończony',
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
          actions: [
            { label: 'Zobacz wyniki', icon: FaChartLine, primary: true, action: 'results' },
            { label: 'Powtórz', icon: FaPlay, action: 'repeat' },
            { label: 'Udostępnij', icon: FaShare, action: 'share' }
          ]
        };
      case 'paused':
        return {
          badge: '⏸️ Wstrzymany',
          color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
          actions: [
            { label: 'Wznów', icon: FaPlay, primary: true, action: 'resume' },
            { label: 'Edytuj', icon: FaEdit, action: 'edit' },
            { label: 'Usuń', icon: FaTrash, action: 'delete' }
          ]
        };
    }
  };

  const handlePlanAction = (planId: number, action: string) => {
    switch (action) {
      case 'continue':
      case 'resume':
        handleContinuePlan(planId);
        break;
      case 'start':
        handleStartPlan(planId);
        break;
      case 'pause':
        handlePausePlan(planId);
        break;
      // Add more action handlers as needed
    }
  };

  // Calculate stats
  const activePlans = plans.filter(p => p.status === 'active').length;
  const completedPlans = plans.filter(p => p.status === 'completed').length;
  const studyStreak = 7; // Mock data

  return (
    <MainLayout darkMode={darkMode} showSidebar={true} currentPage="study-plans">
      <div className={`p-8 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="max-w-7xl mx-auto">
          {/* Header with Stats */}
          <div className="mb-8">
            <h1 className={`${fontSizes.title} font-bold mb-4`}>
              📚 Plany nauki
            </h1>
            <p className={`${fontSizes.subtitle} ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
              Zorganizowane ścieżki rozwoju dla Twojego zawodu
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className={`p-6 rounded-xl ${darkMode ? 'bg-green-900/20 border border-green-700/50' : 'bg-green-50 border border-green-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`${fontSizes.statValue} font-bold ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                      {activePlans}
                    </p>
                    <p className={`${fontSizes.statLabel} ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                      Aktywne plany
                    </p>
                  </div>
                  <FaChartLine className={`text-3xl ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                </div>
              </div>

              <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`${fontSizes.statValue} font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {completedPlans}
                    </p>
                    <p className={`${fontSizes.statLabel} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Ukończone
                    </p>
                  </div>
                  <FaCheckCircle className={`text-3xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                </div>
              </div>

              <div className={`p-6 rounded-xl ${darkMode ? 'bg-red-900/20 border border-red-700/50' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`${fontSizes.statValue} font-bold ${darkMode ? 'text-red-300' : 'text-red-700'}`}>
                      {studyStreak} dni
                    </p>
                    <p className={`${fontSizes.statLabel} ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                      Dni nauki z rzędu
                    </p>
                  </div>
                  <FaFire className={`text-3xl ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { id: 'my-plans', label: '🎯 Moje plany nauki', desc: 'Plany które obecnie śledzisz' },
                { id: 'recommended', label: '💡 Rekomendowane', desc: 'AI-powered plany dla lekarzy' },
                { id: 'templates', label: '📖 Przeglądaj szablony', desc: 'Gotowe plany ekspertów' },
                { id: 'create', label: '✏️ Utwórz własny', desc: 'Zaprojektuj spersonalizowaną ścieżkę' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => tab.id === 'create' ? handleCreatePlan() : setActiveTab(tab.id as any)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[#38b6ff] text-black'
                      : darkMode 
                        ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700' 
                        : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300'
                  } ${fontSizes.buttonText}`}
                  title={tab.desc}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search and Filters */}
            {activeTab !== 'create' && (
              <div className="flex gap-4 items-center mb-6">
                {/* Search */}
                <div className="flex-1 relative">
                  <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <input
                    type="text"
                    placeholder="Wyszukaj plany nauki..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } ${fontSizes.buttonText}`}
                  />
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-2">
                  <FaFilter className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={`px-4 py-3 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } ${fontSizes.buttonText}`}
                  >
                    <option value="wszystkie">Wszystkie kategorie</option>
                    <option value="Przygotowanie do egzaminów">Przygotowanie do egzaminów</option>
                    <option value="Rozwój zawodowy">Rozwój zawodowy</option>
                    <option value="Specjalizacja">Specjalizacja</option>
                    <option value="Hobby/Zainteresowania">Hobby/Zainteresowania</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {getFilteredPlans().map(plan => {
              const statusConfig = getStatusConfig(plan.status);
              
              return (
                <div
                  key={plan.id}
                  className={`rounded-xl p-6 transition-all duration-300 hover:scale-105 ${
                    darkMode 
                      ? 'bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-gray-600' 
                      : 'bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                  } shadow-lg hover:shadow-xl`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl bg-gray-100 dark:bg-gray-700 mr-4">
                        {plan.thumbnail}
                      </div>
                      <div className="flex-1">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${statusConfig.color}`}>
                          {statusConfig.badge}
                        </span>
                        <h3 className={`${fontSizes.cardTitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                          {plan.title}
                        </h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {plan.profession} • {plan.category}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className={`${fontSizes.cardText} ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4 line-clamp-3`}>
                    {plan.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <FaClock className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={14} />
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {plan.duration}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaBookOpen className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={14} />
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {plan.lessons} lekcji
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaDumbbell className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={14} />
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {plan.exercises} ćwiczeń
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        📇 {plan.flashcards} fiszek
                      </span>
                    </div>
                  </div>

                  {/* Progress (for active/paused/completed plans) */}
                  {(plan.status === 'active' || plan.status === 'paused' || plan.status === 'completed') && (
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Postęp: {plan.progress}%
                        </span>
                        {plan.nextLesson && plan.status === 'active' && (
                          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Następnie: {plan.nextLesson}
                          </span>
                        )}
                      </div>
                      <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            plan.status === 'completed' 
                              ? 'bg-green-400' 
                              : plan.status === 'paused'
                                ? 'bg-orange-400'
                                : 'bg-gradient-to-r from-[#38b6ff] to-[#2a9fe5]'
                          }`}
                          style={{ width: `${plan.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(star => (
                          <FaStar
                            key={star}
                            className={`text-sm ${
                              star <= plan.difficulty 
                                ? 'text-yellow-400' 
                                : darkMode ? 'text-gray-600' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        ⭐ {plan.rating}/5 ({plan.studentsEnrolled} uczniów)
                      </span>
                    </div>
                  </div>

                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                    <FaUser className="inline mr-1" size={12} />
                    {plan.author}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {statusConfig.actions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handlePlanAction(plan.id, action.action)}
                        className={`${
                          action.primary 
                            ? 'flex-1 bg-[#38b6ff] hover:bg-[#2a9fe5] text-black' 
                            : darkMode 
                              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        } py-2 px-3 rounded-lg font-semibold transition-colors text-sm flex items-center justify-center gap-1`}
                      >
                        <action.icon className="text-xs" />
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {getFilteredPlans().length === 0 && (
            <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <div className="text-6xl mb-4">📚</div>
              <h3 className={`${fontSizes.cardTitle} font-semibold mb-4`}>
                {searchTerm ? 'Nie znaleziono planów' : 'Brak planów nauki'}
              </h3>
              <p className={`${fontSizes.cardText} mb-6`}>
                {searchTerm 
                  ? 'Spróbuj zmienić kryteria wyszukiwania'
                  : activeTab === 'my-plans'
                    ? 'Rozpocznij swoją przygodę z planami nauki'
                    : 'Wybierz szablon i rozpocznij naukę'}
              </p>
              {!searchTerm && (
                <button
                  onClick={handleCreatePlan}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors bg-[#38b6ff] hover:bg-[#2a9fe5] text-black ${fontSizes.buttonText}`}
                >
                  Utwórz pierwszy plan
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default StudyPlansLibrary;