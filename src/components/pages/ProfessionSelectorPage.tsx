import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { MEDICAL_PROFESSIONS_10 } from '../../constants/professions';
import MainLayout from '../layout/MainLayout';
import { FaCheck, FaArrowRight, FaUserMd, FaGraduationCap, FaStar, FaHeart } from 'react-icons/fa';

interface ProfessionSelectorPageProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const ProfessionSelectorPage: React.FC<ProfessionSelectorPageProps> = ({ darkMode, fontSize }) => {
  const { profile, updateProfile } = useAuth();
  const [selectedProfession, setSelectedProfession] = useState<string>(profile?.zawod || '');
  const [hoveredProfession, setHoveredProfession] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Wybierz zawód medyczny – DlaMedica.pl';
  }, []);

  const handleProfessionSelect = async (professionValue: string) => {
    if (loading) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await updateProfile({ zawod: professionValue });
      
      if (result.error) {
        setError('Wystąpił błąd podczas zapisywania zawodu');
      } else {
        setSelectedProfession(professionValue);
        setSuccess(true);
        
        setTimeout(() => {
          window.history.pushState({}, '', '/dashboard');
          window.dispatchEvent(new PopStateEvent('popstate'));
        }, 2000);
      }
    } catch (err) {
      setError('Wystąpił błąd podczas zapisywania zawodu');
    } finally {
      setLoading(false);
    }
  };

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          title: 'text-4xl',
          subtitle: 'text-xl',
          cardTitle: 'text-lg',
          cardDescription: 'text-sm',
          buttonText: 'text-sm'
        };
      case 'large':
        return {
          title: 'text-6xl',
          subtitle: 'text-2xl',
          cardTitle: 'text-xl',
          cardDescription: 'text-base',
          buttonText: 'text-base'
        };
      default:
        return {
          title: 'text-5xl',
          subtitle: 'text-xl',
          cardTitle: 'text-lg',
          cardDescription: 'text-sm',
          buttonText: 'text-sm'
        };
    }
  };

  const fontSizes = getFontSizeClasses();

  // Professional medical icons with SVG-like styling
  const getIconComponent = (iconName: string, color: string, isSelected: boolean, isHovered: boolean) => {
    const iconStyle = {
      fontSize: '3.5rem',
      color: isSelected ? '#ffffff' : color,
      filter: isSelected ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: isHovered ? 'scale(1.15) rotate(5deg)' : 'scale(1)',
    };
    
    // Icons removed - returning empty div
    return (
      <div className="relative flex items-center justify-center">
        {/* Icon removed */}
        {isSelected && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <FaCheck className="text-green-500 text-xs" />
          </div>
        )}
      </div>
    );
  };

  if (success) {
    return (
      <MainLayout darkMode={darkMode} showSidebar={false} currentPage="profession-selector">
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
          {/* Success Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600"></div>
          
          {/* Floating Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/20 rounded-full animate-bounce animation-delay-1000"></div>
            <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-white/20 rounded-full animate-bounce animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-white/20 rounded-full animate-bounce animation-delay-3000"></div>
            <FaHeart className="absolute top-1/2 left-1/4 text-white/30 text-6xl animate-pulse" />
            <FaStar className="absolute top-1/4 right-1/3 text-white/30 text-4xl animate-spin-slow" />
          </div>

          <div className="text-center relative z-10 text-white p-8">
            <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl animate-bounce">
              <FaCheck className="text-8xl text-emerald-500" />
            </div>
            <h1 className={`${fontSizes.title} font-black mb-6 tracking-tight`}>
              Doskonale!
            </h1>
            <p className={`${fontSizes.subtitle} opacity-90 mb-4`}>
              Twój zawód został pomyślnie zaktualizowany
            </p>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
              <span className="text-lg">Przekierowujemy Cię do platformy...</span>
              <div className="w-2 h-2 bg-white rounded-full animate-ping animation-delay-500"></div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout darkMode={darkMode} showSidebar={false} currentPage="profession-selector">
      <div className={`min-h-screen relative ${
        darkMode 
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
          : 'bg-gradient-to-br from-slate-50 via-white to-blue-50'
      }`}>
        
        {/* Decorative Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Medical Cross Pattern */}
          <div className="absolute top-20 left-10 opacity-5">
            <div className="w-8 h-32 bg-blue-500 rounded-full"></div>
            <div className="w-32 h-8 bg-blue-500 rounded-full absolute top-12 -left-12"></div>
          </div>
          <div className="absolute bottom-20 right-10 opacity-5">
            <div className="w-6 h-24 bg-green-500 rounded-full"></div>
            <div className="w-24 h-6 bg-green-500 rounded-full absolute top-9 -left-9"></div>
          </div>
          
          {/* Floating Medical Elements */}
          <div className="absolute top-1/4 right-1/4 text-6xl opacity-10 animate-float">⚕️</div>
          <div className="absolute bottom-1/3 left-1/5 text-4xl opacity-10 animate-float animation-delay-2000">🫀</div>
          <div className="absolute top-1/2 left-1/4 text-5xl opacity-10 animate-float animation-delay-4000">🧬</div>
        </div>

        <div className="relative z-10 py-12 px-4">
          <div className="max-w-7xl mx-auto">
            
            {/* Header Section */}
            <div className="text-center mb-16">
              {/* Icon Header */}
              <div className="flex items-center justify-center mb-8">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3">
                    <FaUserMd className="text-4xl text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-xl transform -rotate-12">
                    <FaGraduationCap className="text-xl text-white" />
                  </div>
                </div>
              </div>

              <h1 className={`${fontSizes.title} font-black mb-6 ${
                darkMode 
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400' 
                  : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600'
              } tracking-tight`}>
                Wybierz swoją ścieżkę kariery
              </h1>
              
              <p className={`${fontSizes.subtitle} max-w-3xl mx-auto leading-relaxed ${
                darkMode ? 'text-slate-300' : 'text-slate-600'
              } mb-8`}>
                <strong>Spersonalizuj</strong> swoją podróż edukacyjną<br/>
                Otrzymaj <strong>ekskluzywne materiały</strong> dopasowane do Twojej specjalizacji
              </p>

              {/* Stats */}
              <div className="flex items-center justify-center space-x-8 mb-8">
                <div className={`text-center ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  <div className="text-2xl font-bold text-blue-600">10+</div>
                  <div className="text-sm">Specjalizacji</div>
                </div>
                <div className={`w-px h-8 ${darkMode ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
                <div className={`text-center ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  <div className="text-2xl font-bold text-purple-600">1000+</div>
                  <div className="text-sm">Materiałów</div>
                </div>
                <div className={`w-px h-8 ${darkMode ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
                <div className={`text-center ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  <div className="text-2xl font-bold text-emerald-600">24/7</div>
                  <div className="text-sm">Dostęp</div>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-12 max-w-md mx-auto">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4">
                      {/* Warning icon removed */}
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-800 mb-1">Wystąpił błąd</h4>
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Professions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {MEDICAL_PROFESSIONS_10.map((profession, index) => {
                const isSelected = selectedProfession === profession.value;
                const isHovered = hoveredProfession === profession.value;
                
                return (
                  <div
                    key={profession.value}
                    className={`group relative transition-all duration-700 cursor-pointer ${
                      loading ? 'pointer-events-none' : ''
                    }`}
                    onClick={() => !loading && handleProfessionSelect(profession.value)}
                    onMouseEnter={() => setHoveredProfession(profession.value)}
                    onMouseLeave={() => setHoveredProfession('')}
                    style={{
                      animationDelay: `${index * 150}ms`,
                    }}
                  >
                    {/* Card */}
                    <div
                      className={`relative overflow-hidden rounded-3xl transition-all duration-500 ${
                        isSelected
                          ? 'transform scale-105 shadow-2xl ring-4 ring-offset-4'
                          : isHovered
                          ? 'transform scale-102 shadow-xl'
                          : 'shadow-lg hover:shadow-xl'
                      } ${
                        darkMode ? 'bg-slate-800' : 'bg-white'
                      } ${
                        isSelected ? 'ring-offset-slate-100' : ''
                      }`}
                      style={{
                        background: isSelected 
                          ? `linear-gradient(135deg, ${profession.color}, ${profession.color}dd)` 
                          : isHovered
                          ? darkMode 
                            ? `linear-gradient(135deg, ${profession.color}20, ${profession.color}10)`
                            : `linear-gradient(135deg, ${profession.color}15, ${profession.color}08)`
                          : darkMode ? '#1e293b' : '#ffffff',
                        ringColor: isSelected ? profession.color : undefined,
                      }}
                    >
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div 
                          className="absolute -top-10 -right-10 w-32 h-32 rounded-full"
                          style={{ backgroundColor: profession.color }}
                        ></div>
                        <div 
                          className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full"
                          style={{ backgroundColor: profession.color }}
                        ></div>
                      </div>

                      {/* Content */}
                      <div className="relative p-6">
                        {/* Icon Section */}
                        <div className="text-center mb-6">
                          <div 
                            className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center transition-all duration-300 ${
                              isSelected ? 'shadow-2xl' : 'shadow-lg'
                            }`}
                            style={{
                              background: isSelected
                                ? 'rgba(255,255,255,0.2)'
                                : `${profession.color}20`,
                              backdropFilter: isSelected ? 'blur(10px)' : 'none',
                            }}
                          >
                            {getIconComponent(profession.icon, profession.color, isSelected, isHovered)}
                          </div>
                        </div>

                        {/* Text Content */}
                        <div className="text-center space-y-3">
                          <h3 className={`${fontSizes.cardTitle} font-bold leading-tight ${
                            isSelected ? 'text-white' : darkMode ? 'text-white' : 'text-slate-800'
                          }`}>
                            {profession.label}
                          </h3>
                          
                          <p className={`${fontSizes.cardDescription} leading-relaxed ${
                            isSelected ? 'text-white/90' : darkMode ? 'text-slate-300' : 'text-slate-600'
                          }`}>
                            {profession.description}
                          </p>
                        </div>

                        {/* Action Button */}
                        <div className="mt-6">
                          <button
                            disabled={loading}
                            className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${fontSizes.buttonText} ${
                              isSelected
                                ? 'bg-white/20 text-white backdrop-blur-sm shadow-lg transform scale-105'
                                : isHovered
                                ? 'bg-slate-100 text-slate-800 shadow-md'
                                : darkMode
                                ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {loading && selectedProfession === profession.value ? (
                              <div className="flex items-center justify-center space-x-2">
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                <span>Zapisywanie...</span>
                              </div>
                            ) : isSelected ? (
                              <div className="flex items-center justify-center space-x-2">
                                <FaCheck />
                                <span>Wybrano</span>
                                <FaArrowRight />
                              </div>
                            ) : (
                              'Wybierz'
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Info Section */}
            <div className="mt-16">
              <div className={`rounded-3xl p-8 ${
                darkMode 
                  ? 'bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600' 
                  : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100'
              } shadow-xl`}>
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                      {/* Graduation icon removed */}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-2xl font-bold mb-4 ${
                      darkMode ? 'text-white' : 'text-slate-800'
                    }`}>
                      Dlaczego warto wybrać swoją specjalizację?
                    </h4>
                    <div className={`space-y-3 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      <div className="flex items-start space-x-3">
                        {/* Book icon removed */}
                        <div>
                          <strong>Materiały na miarę:</strong> Otrzymujesz treści edukacyjne, kalkulatory i narzędzia specjalnie dobrane dla Twojej dziedziny medycyny.
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        {/* Lightning icon removed */}
                        <div>
                          <strong>Szybka personalizacja:</strong> Platforma natychmiast dostosuje się do Twoich potrzeb edukacyjnych.
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        {/* Refresh icon removed */}
                        <div>
                          <strong>Pełna elastyczność:</strong> Możesz zmienić swoją specjalizację w każdej chwili w ustawieniach profilu.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Custom CSS */}
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          
          .animate-spin-slow {
            animation: spin-slow 10s linear infinite;
          }
          
          .animation-delay-500 {
            animation-delay: 0.5s;
          }
          
          .animation-delay-1000 {
            animation-delay: 1s;
          }
          
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          
          .animation-delay-3000 {
            animation-delay: 3s;
          }
          
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>
      </div>
    </MainLayout>
  );
};

export default ProfessionSelectorPage;