import React, { useState, useEffect } from 'react';
import Sidebar from '../navigation/Sidebar';
import { useUser } from '../../hooks/useUser';

interface ExamsPageProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

type ExamType = 'LEK' | 'LDEK' | 'PES' | null;

interface ExamInfo {
  id: ExamType;
  name: string;
  fullName: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
  targetAudience: string;
  questionsCount: number;
  passingScore: string;
  duration: string;
}

const ExamsPage: React.FC<ExamsPageProps> = ({ darkMode, fontSize }) => {
  const { isAuthenticated } = useUser();
  const [selectedExam, setSelectedExam] = useState<ExamType>(null);
  const [showFreeAccessBanner, setShowFreeAccessBanner] = useState(true);

  // Initialize sidebar state from localStorage
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('education_sidebar_open');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('education_sidebar_open', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'small': return 'text-sm';
      case 'large': return 'text-lg';
      default: return 'text-base';
    }
  };

  const exams: ExamInfo[] = [
    {
      id: 'LEK',
      name: 'LEK',
      fullName: 'Lekarski Egzamin Końcowy',
      description: 'Egzamin dla absolwentów kierunku lekarskiego, wymagany do uzyskania pełnego prawa wykonywania zawodu lekarza.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v6a1 1 0 001 1h6" />
        </svg>
      ),
      color: '#38b6ff',
      bgGradient: 'from-[#38b6ff]/20 to-[#38b6ff]/5',
      targetAudience: 'Absolwenci kierunku lekarskiego',
      questionsCount: 200,
      passingScore: '56%',
      duration: '4 godziny'
    },
    {
      id: 'LDEK',
      name: 'LDEK',
      fullName: 'Lekarsko-Dentystyczny Egzamin Końcowy',
      description: 'Egzamin dla absolwentów kierunku lekarsko-dentystycznego, wymagany do uzyskania pełnego prawa wykonywania zawodu lekarza dentysty.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      color: '#10b981',
      bgGradient: 'from-emerald-500/20 to-emerald-500/5',
      targetAudience: 'Absolwenci stomatologii',
      questionsCount: 200,
      passingScore: '56%',
      duration: '4 godziny'
    },
    {
      id: 'PES',
      name: 'PES',
      fullName: 'Państwowy Egzamin Specjalizacyjny',
      description: 'Egzamin dla lekarzy kończących specjalizację, wymagany do uzyskania tytułu specjalisty w danej dziedzinie medycyny.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      color: '#8b5cf6',
      bgGradient: 'from-violet-500/20 to-violet-500/5',
      targetAudience: 'Lekarze w trakcie/po specjalizacji',
      questionsCount: 120,
      passingScore: '60%',
      duration: '3 godziny'
    }
  ];

  const handleExamSelect = (examId: ExamType) => {
    setSelectedExam(examId);
    // W przyszłości tutaj będzie nawigacja do podstrony egzaminu
    window.history.pushState({}, '', `/egzaminy/${examId?.toLowerCase()}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-gray-50 to-white'}`}>
      <div className="flex">
        {/* Sidebar */}
        <div className={`${isSidebarOpen ? 'w-80' : 'w-0'} shrink-0 transition-all duration-300 ease-in-out`}>
          <Sidebar
            darkMode={darkMode}
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            currentPage="exams"
            onNavigate={(path) => {
              window.history.pushState({}, '', path);
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Hero Section */}
      <div className={`relative overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-[#38b6ff]/10 via-white to-emerald-50'}`}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-[#38b6ff]/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl" />
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center">
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${
              darkMode ? 'bg-[#38b6ff]/20 text-[#38b6ff]' : 'bg-[#38b6ff]/10 text-[#38b6ff]'
            }`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="font-semibold">100% Darmowe</span>
            </div>

            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Egzaminy <span className="text-[#38b6ff]">Medyczne</span>
            </h1>
            
            <p className={`text-xl max-w-3xl mx-auto mb-8 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            } ${getFontSizeClass()}`}>
              Przygotuj się do najważniejszych egzaminów w karierze medycznej. 
              Baza pytań, testy próbne i materiały edukacyjne - wszystko za darmo!
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="text-center">
                <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>10,000+</div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Pytań w bazie</div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>3</div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Typy egzaminów</div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>100%</div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Bezpłatnie</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Free Access Banner for Non-Logged Users */}
      {!isAuthenticated && showFreeAccessBanner && (
        <div className={`relative mx-4 sm:mx-8 -mt-8 mb-8 ${
          darkMode ? 'bg-gradient-to-r from-green-900/80 to-emerald-900/80 border-green-700' : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
        } border rounded-2xl p-6 shadow-lg`}>
          <button
            onClick={() => setShowFreeAccessBanner(false)}
            className={`absolute top-3 right-3 p-1 rounded-full ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center ${
              darkMode ? 'bg-green-800' : 'bg-green-100'
            }`}>
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className={`text-lg font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Dostęp do egzaminów jest całkowicie darmowy!
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Nie musisz się logować, aby korzystać z bazy pytań i testów próbnych.
                Zaloguj się tylko jeśli chcesz śledzić swoje postępy.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  window.history.pushState({}, '', '/login');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  darkMode
                    ? 'bg-green-600 text-white hover:bg-green-500'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                Zaloguj się
              </button>
              <button
                onClick={() => {
                  window.history.pushState({}, '', '/register');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  darkMode
                    ? 'border border-green-600 text-green-400 hover:bg-green-900/50'
                    : 'border border-green-600 text-green-700 hover:bg-green-50'
                }`}
              >
                Załóż konto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exam Selection Cards */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className={`text-2xl sm:text-3xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Wybierz egzamin
          </h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} ${getFontSizeClass()}`}>
            Kliknij na kartę egzaminu, aby rozpocząć naukę
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {exams.map((exam) => (
            <button
              key={exam.id}
              onClick={() => handleExamSelect(exam.id)}
              className={`group relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl ${
                darkMode 
                  ? 'bg-gray-800 border border-gray-700 hover:border-gray-600' 
                  : `bg-gradient-to-br ${exam.bgGradient} border border-gray-200 hover:border-gray-300`
              }`}
            >
              {/* Decorative gradient */}
              <div 
                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"
                style={{ backgroundColor: exam.color }}
              />

              {/* Icon */}
              <div 
                className={`inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4 transition-colors ${
                  darkMode ? 'bg-gray-700' : 'bg-white shadow-sm'
                }`}
                style={{ color: exam.color }}
              >
                {exam.icon}
              </div>

              {/* Content */}
              <div className="relative">
                <h3 
                  className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}
                  style={{ color: exam.color }}
                >
                  {exam.name}
                </h3>
                <p className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {exam.fullName}
                </p>
                <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'} ${getFontSizeClass()}`}>
                  {exam.description}
                </p>

                {/* Info badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    darkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-700 shadow-sm'
                  }`}>
                    <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {exam.questionsCount} pytań
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    darkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-700 shadow-sm'
                  }`}>
                    <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {exam.duration}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    darkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-700 shadow-sm'
                  }`}>
                    <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Próg: {exam.passingScore}
                  </span>
                </div>

                {/* Target audience */}
                <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Dla: {exam.targetAudience}
                </div>

                {/* Arrow indicator */}
                <div 
                  className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: exam.color }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'} py-16`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className={`text-2xl sm:text-3xl font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Co oferujemy?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                ),
                title: 'Baza pytań',
                description: 'Aktualizowana baza pytań z poprzednich sesji egzaminacyjnych'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                ),
                title: 'Testy próbne',
                description: 'Symulacje egzaminu w warunkach zbliżonych do rzeczywistych'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: 'Statystyki',
                description: 'Śledzenie postępów i analiza słabych punktów'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: 'Społeczność',
                description: 'Dyskusje i wymiana wiedzy z innymi uczącymi się'
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className={`p-6 rounded-xl ${
                  darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-sm'
                }`}
              >
                <div className="text-[#38b6ff] mb-4">
                  {feature.icon}
                </div>
                <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {feature.title}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className={`rounded-2xl p-8 sm:p-12 text-center ${
          darkMode 
            ? 'bg-gradient-to-r from-[#38b6ff]/20 to-violet-500/20 border border-gray-700' 
            : 'bg-gradient-to-r from-[#38b6ff]/10 to-violet-500/10'
        }`}>
          <h2 className={`text-2xl sm:text-3xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Gotowy do nauki?
          </h2>
          <p className={`mb-8 max-w-2xl mx-auto ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          } ${getFontSizeClass()}`}>
            Wybierz egzamin powyżej i zacznij przygotowania już teraz. Bez rejestracji, bez opłat - po prostu ucz się!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-8 py-3 bg-[#38b6ff] text-white font-semibold rounded-xl hover:bg-[#2da7ef] transition-colors shadow-lg hover:shadow-xl"
            >
              Rozpocznij teraz
            </button>
            <button
              onClick={() => {
                window.history.pushState({}, '', '/kontakt');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className={`px-8 py-3 font-semibold rounded-xl transition-colors ${
                darkMode 
                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
              }`}
            >
              Masz pytania?
            </button>
          </div>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
};

export default ExamsPage;


