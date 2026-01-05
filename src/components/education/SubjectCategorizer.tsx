import React, { useState } from 'react';
import { StarIcon, ChevronDownIcon, ChevronUpIcon, AllSubjectsIcon } from './icons/EducationIcons';
import { RippleButton, CountUp, AnimatedSection } from './components';
import SubjectGrid from './SubjectGrid';
import './styles/educationStyles.css';

interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  modules: number;
  estimatedHours: number;
  professions: string[];
  categories?: string[];
  prerequisites?: string[];
  color: string;
  progress?: number;
  isEnrolled?: boolean;
  isFavorite?: boolean;
  isRecommended?: boolean;
}

interface SubjectCategorizerProps {
  subjects: Subject[];
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  category: 'preclinical' | 'clinical' | 'specialized';
  userProfession: string;
}

const SubjectCategorizer: React.FC<SubjectCategorizerProps> = ({
  subjects,
  darkMode,
  fontSize,
  category,
  userProfession
}) => {
  const [showAllSubjects, setShowAllSubjects] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    favorites: true,
    recommended: true,
    others: false
  });

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          title: 'text-lg',
          sectionTitle: 'text-base',
          buttonText: 'text-sm'
        };
      case 'large':
        return {
          title: 'text-2xl',
          sectionTitle: 'text-xl',
          buttonText: 'text-lg'
        };
      default:
        return {
          title: 'text-xl',
          sectionTitle: 'text-lg',
          buttonText: 'text-base'
        };
    }
  };

  const fontSizes = getFontSizeClasses();

  const getCategoryName = () => {
    switch (category) {
      case 'preclinical':
        return 'Przedklinicznych';
      case 'clinical':
        return 'Klinicznych';
      case 'specialized':
        return 'Specjalistycznych';
      default:
        return '';
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Kategoryzuj przedmioty
  const favoriteSubjects = subjects.filter(s => s.isFavorite);
  const recommendedSubjects = subjects.filter(s => s.isRecommended && !s.isFavorite);
  const otherSubjects = subjects.filter(s => !s.isRecommended && !s.isFavorite);

  if (showAllSubjects) {
    return (
      <div className="education-fade-in">
        {/* Header */}
        <div className={`mb-8 p-6 rounded-2xl ${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} education-glass border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} shadow-lg`}>
          <RippleButton
            onClick={() => setShowAllSubjects(false)}
            variant="outline"
            darkMode={darkMode}
            className="mb-4 px-4 py-2 rounded-lg"
          >
            ← Powrót do kategorii
          </RippleButton>
          <h2 className={`${fontSizes.title} font-bold bg-gradient-to-r ${darkMode ? 'from-white to-gray-300' : 'from-gray-900 to-gray-700'} bg-clip-text text-transparent mb-2`}>
            Wszystkie Przedmioty {getCategoryName()}
          </h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Pełna lista dostępnych przedmiotów w tej kategorii
          </p>
        </div>

        <SubjectGrid subjects={subjects} darkMode={darkMode} fontSize={fontSize} />
      </div>
    );
  }

  return (
    <div className="education-fade-in">
      {/* Header */}
      <div className="mb-8">
        <RippleButton
          onClick={() => setShowAllSubjects(true)}
          variant="primary"
          darkMode={darkMode}
          className={`px-8 py-4 rounded-xl font-semibold ${fontSizes.buttonText} shadow-lg hover:shadow-xl`}
        >
          <span className="flex items-center justify-center">
            <AllSubjectsIcon className="mr-2" size={20} />
            Pokaż wszystkie przedmioty {getCategoryName().toLowerCase()}
          </span>
        </RippleButton>
      </div>

      {/* Ulubione Przedmioty */}
      {favoriteSubjects.length > 0 && (
        <AnimatedSection animation="slideUp" delay={0}>
          <div className="mb-8">
            <RippleButton
              onClick={() => toggleSection('favorites')}
              variant="outline"
              darkMode={darkMode}
              className={`flex items-center w-full mb-4 p-5 rounded-xl education-card-hover ${
                darkMode ? 'bg-yellow-500/10 border border-yellow-500/30 hover:bg-yellow-500/15' : 'bg-yellow-50 border border-yellow-200 hover:bg-yellow-100'
              } education-glass shadow-md`}
            >
            <div className={`p-2.5 rounded-lg mr-4 bg-gradient-to-br from-yellow-500 to-amber-500 education-icon-wrapper shadow-lg`}>
              <StarIcon className="text-white" size={20} />
            </div>
            <h3 className={`${fontSizes.sectionTitle} font-bold ${darkMode ? 'text-yellow-300' : 'text-yellow-800'} flex-1 text-left`}>
              ULUBIONE PRZEDMIOTY (<CountUp end={favoriteSubjects.length} duration={1000} />)
            </h3>
            <div className={`transition-transform duration-300 ${expandedSections.favorites ? 'rotate-180' : ''}`}>
              {expandedSections.favorites ? <ChevronUpIcon size={18} /> : <ChevronDownIcon size={18} />}
            </div>
            </RippleButton>
          
          {expandedSections.favorites && (
            <AnimatedSection animation="slideDown" delay={100}>
              <div className="mb-6 education-expandable-content expanded">
                <SubjectGrid subjects={favoriteSubjects} darkMode={darkMode} fontSize={fontSize} />
              </div>
            </AnimatedSection>
          )}
          </div>
        </AnimatedSection>
      )}

      {/* Wybrane dla Zawodu */}
      {recommendedSubjects.length > 0 && (
        <AnimatedSection animation="slideUp" delay={100}>
          <div className="mb-8">
            <RippleButton
              onClick={() => toggleSection('recommended')}
              variant="outline"
              darkMode={darkMode}
              className={`flex items-center w-full mb-4 p-5 rounded-xl education-card-hover ${
                darkMode ? 'bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/15' : 'bg-blue-50 border border-blue-200 hover:bg-blue-100'
              } education-glass shadow-md`}
            >
            <div className={`p-2.5 rounded-lg mr-4 bg-gradient-to-br from-blue-500 to-cyan-500 education-icon-wrapper shadow-lg`}>
              <StarIcon className="text-white" size={20} />
            </div>
            <h3 className={`${fontSizes.sectionTitle} font-bold ${darkMode ? 'text-blue-300' : 'text-blue-800'} flex-1 text-left`}>
              WYBRANE DLA TWOJEGO ZAWODU: {userProfession.toUpperCase()} (<CountUp end={recommendedSubjects.length} duration={1000} />)
            </h3>
            <div className={`transition-transform duration-300 ${expandedSections.recommended ? 'rotate-180' : ''}`}>
              {expandedSections.recommended ? <ChevronUpIcon size={18} /> : <ChevronDownIcon size={18} />}
            </div>
            </RippleButton>
          
          {expandedSections.recommended && (
            <AnimatedSection animation="slideDown" delay={100}>
              <div className="mb-6 education-expandable-content expanded">
                <SubjectGrid subjects={recommendedSubjects} darkMode={darkMode} fontSize={fontSize} />
              </div>
            </AnimatedSection>
          )}
          </div>
        </AnimatedSection>
      )}

      {/* Pozostałe Przedmioty */}
      {otherSubjects.length > 0 && (
        <AnimatedSection animation="slideUp" delay={200}>
          <div className="mb-8">
            <RippleButton
              onClick={() => toggleSection('others')}
              variant="outline"
              darkMode={darkMode}
              className={`flex items-center w-full mb-4 p-5 rounded-xl education-card-hover ${
                darkMode ? 'bg-gray-800/80 border border-gray-700/50 hover:bg-gray-700/50' : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
              } education-glass shadow-md`}
            >
            <div className={`p-2.5 rounded-lg mr-4 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-200'} education-icon-wrapper`}>
              <AllSubjectsIcon className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`} size={20} />
            </div>
            <h3 className={`${fontSizes.sectionTitle} font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'} flex-1 text-left`}>
              POZOSTAŁE PRZEDMIOTY (<CountUp end={otherSubjects.length} duration={1000} />)
            </h3>
            <div className={`transition-transform duration-300 ${expandedSections.others ? 'rotate-180' : ''}`}>
              {expandedSections.others ? <ChevronUpIcon size={18} /> : <ChevronDownIcon size={18} />}
            </div>
            </RippleButton>
          
          {expandedSections.others && (
            <AnimatedSection animation="slideDown" delay={100}>
              <div className="mb-6 education-expandable-content expanded">
                <SubjectGrid subjects={otherSubjects} darkMode={darkMode} fontSize={fontSize} />
              </div>
            </AnimatedSection>
          )}
          </div>
        </AnimatedSection>
      )}

      {/* Empty State */}
      {favoriteSubjects.length === 0 && recommendedSubjects.length === 0 && otherSubjects.length === 0 && (
        <AnimatedSection animation="fadeIn" delay={300}>
          <div className={`p-12 rounded-2xl text-center education-glass border ${darkMode ? 'bg-gradient-to-br from-gray-800/90 to-gray-900/80 border-gray-700/50' : 'bg-gradient-to-br from-white/90 to-gray-50/80 border-gray-200/50'} shadow-2xl relative overflow-hidden`}>
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-500 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '3s' }}></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-500 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s', animationDelay: '1.5s' }}></div>
            </div>
            
            <div className="relative z-10">
              <div className="mb-6">
                <div className="inline-block p-6 rounded-2xl bg-gradient-to-br from-yellow-500/30 to-amber-500/20 education-icon-wrapper animate-bounce" style={{ animationDuration: '2s', animationIterationCount: 'infinite' }}>
                  <StarIcon className={`${darkMode ? 'text-yellow-400' : 'text-yellow-600'} animate-pulse`} size={64} />
                </div>
              </div>
              <h3 className={`${fontSizes.sectionTitle} font-bold bg-gradient-to-r ${darkMode ? 'from-white via-yellow-200 to-amber-300' : 'from-gray-900 via-yellow-700 to-amber-800'} bg-clip-text text-transparent mb-3 animate-gradient`}>
                Brak przedmiotów w tej kategorii
              </h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6 max-w-md mx-auto text-lg`}>
                Kliknij gwiazdkę na dowolnym przedmiocie, aby dodać go do ulubionych, lub sprawdź inne kategorie
              </p>
            </div>
          </div>
        </AnimatedSection>
      )}
    </div>
  );
};

export default SubjectCategorizer;