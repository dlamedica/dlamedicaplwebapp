import React from 'react';
import {
  BookOpenIcon,
  UsersIcon,
  LockIcon,
  PlayIcon,
  StarIcon,
  ProfessionsIcon,
  ClockIcon
} from './icons/EducationIcons';
import { RippleButton, CountUp, Badge, ProgressRing } from './components';
import AnimatedSection from './components/AnimatedSection';
import { useToast } from '../../hooks/useToast';
import { ToastContainer } from './components';
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
  isFavorite?: boolean;
  isRecommended?: boolean;
  href?: string;
}

interface SubjectGridProps {
  subjects: Subject[];
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const SubjectGrid: React.FC<SubjectGridProps> = ({ subjects, darkMode, fontSize }) => {
  const { toasts, showSuccess, showError, removeToast } = useToast();

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          cardTitle: 'text-lg',
          cardText: 'text-sm',
          buttonText: 'text-sm',
          metaText: 'text-xs'
        };
      case 'large':
        return {
          cardTitle: 'text-2xl',
          cardText: 'text-lg',
          buttonText: 'text-lg',
          metaText: 'text-sm'
        };
      default:
        return {
          cardTitle: 'text-xl',
          cardText: 'text-base',
          buttonText: 'text-base',
          metaText: 'text-sm'
        };
    }
  };

  const fontSizes = getFontSizeClasses();


  const handleSubjectClick = (subject: Subject) => {
    // Navigate to subject detail page
    const targetPath = subject.href || `/edukacja/przedmiot/${subject.id}`;
    window.history.pushState({}, '', targetPath);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <>
      <AnimatedSection animation="fadeIn" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"> {/* Reduced gap from 6 to 5 */}
        {subjects.map((subject, index) => {
          // Unified progress color logic if needed, currently using subject.color which is good for variety, 
          // but user asked for consistency (e.g. blue=progress). 
          // However, keeping subject color for branding is often better. 
          // User request: "Anatomia red bar, Fizjo gray bar... fix: single palette".
          // Let's enforce a standard progress color scheme or stick to subject brand color but ensure it's visible.
          // To strictly follow "single palette - blue=progress", we should override the color in the progress bar.
          const progressColor = '#3b82f6'; // blue-500

          return (
            <div
              key={subject.id}
              onClick={() => handleSubjectClick(subject)}
              title="Kliknij, aby wejść do modułu"
              className={`group relative rounded-2xl p-5 cursor-pointer education-subject-card education-card-hover transition-all duration-500 ${darkMode
                ? 'bg-gray-800/80 border border-gray-700/50'
                : 'bg-white/80 border border-gray-200/50'
                } education-glass shadow-md hover:shadow-xl hover:scale-[1.01] hover:-translate-y-1`}
              style={{
                background: darkMode
                  ? `linear-gradient(135deg, ${subject.color}15 0%, rgba(17, 24, 39, 0.8) 100%)`
                  : `linear-gradient(135deg, ${subject.color}08 0%, rgba(255, 255, 255, 0.8) 100%)`,
                animationDelay: `${index * 0.1}s`
              }}
            >
              {/* Hover Glow Effect */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"
                style={{
                  background: `radial-gradient(circle at center, ${subject.color}40, transparent 70%)`
                }}
              />

              {/* Animated Border Glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  border: `2px solid ${subject.color}40`,
                  boxShadow: `0 0 20px ${subject.color}30`
                }}
              />

              {/* Favorite Star - Always present */}
              <div className="absolute top-4 right-4 z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Toggle favorite for:', subject.id);
                  }}
                  className={`p-1.5 rounded-full transition-all duration-300 ${subject.isFavorite
                    ? 'text-yellow-500 hover:text-yellow-400 transform scale-110'
                    : 'text-gray-300 hover:text-yellow-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                  <StarIcon size={20} className={subject.isFavorite ? 'fill-current drop-shadow-lg' : ''} />
                </button>
              </div>

              {/* Header */}
              <div className="flex items-start mb-4 pr-8">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 education-icon-wrapper shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shrink-0`}
                  style={{
                    background: `linear-gradient(135deg, ${subject.color}30, ${subject.color}10)`,
                    border: `2px solid ${subject.color}40`,
                    boxShadow: `0 4px 15px ${subject.color}30`
                  }}
                >
                  {React.createElement(subject.icon, { size: 24, color: subject.color })}
                </div>
                <div className="min-w-0">
                  <h3 className={`${fontSizes.cardTitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1 truncate leading-tight`}>
                    {subject.name}
                  </h3>
                  {subject.isRecommended && (
                    <Badge variant="info" size="sm" darkMode={darkMode} animated>
                      Rekomendowane
                    </Badge>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className={`${fontSizes.cardText} ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-5 line-clamp-2 min-h-[3rem]`}>
                {subject.description}
              </p>

              {/* Stats Grid - Unified Icons & Text */}
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-5">
                {/* Count */}
                <div className="flex items-center" title="Liczba modułów">
                  <BookOpenIcon className={`${darkMode ? 'text-blue-400' : 'text-blue-600'} mr-2`} size={16} />
                  <span className={`${fontSizes.metaText} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <CountUp end={subject.modules} duration={800} /> modułów
                  </span>
                </div>

                {/* Difficulty - Unified Colors/Labels */}
                <div className="flex items-center" title="Poziom trudności">
                  <div className={`w-2.5 h-2.5 rounded-full mr-2 ${subject.difficulty === 'easy' ? 'bg-green-500' :
                      subject.difficulty === 'medium' ? 'bg-blue-500' : 'bg-red-500'
                    }`}></div>
                  <span className={`${fontSizes.metaText} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {subject.difficulty === 'easy' ? 'Łatwy' : subject.difficulty === 'medium' ? 'Średni' : 'Trudny'}
                  </span>
                </div>

                {/* Time - Unified Format */}
                <div className="flex items-center" title="Szacowany czas nauki">
                  <ClockIcon className={`${darkMode ? 'text-green-400' : 'text-green-600'} mr-2`} size={16} />
                  <span className={`${fontSizes.metaText} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    ~<CountUp end={subject.estimatedHours} duration={1000} /> h nauki
                  </span>
                </div>

                {/* Enrolled Status (Optional) or other meta */}
                <div className="flex items-center" title="Docelowe zawody">
                  <ProfessionsIcon className={`${darkMode ? 'text-purple-400' : 'text-purple-600'} mr-2`} size={16} />
                  <span className={`${fontSizes.metaText} ${darkMode ? 'text-gray-300' : 'text-gray-700'} truncate`}>
                    {subject.professions[0]}
                  </span>
                </div>
              </div>

              {/* Progress Bar - Unified */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Postęp
                  </span>
                  <span className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {subject.progress || 0}%
                  </span>
                </div>
                <div className={`w-full h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div
                    className="h-full rounded-full transition-all duration-500 education-progress-bar"
                    style={{
                      width: `${subject.progress || 0}%`,
                      background: progressColor
                    }}
                  />
                </div>
              </div>

              {/* Action Button - Unified CTA */}
              <RippleButton
                onClick={(e) => {
                  e.stopPropagation(); // Even though card is clickable, button is main CTA
                  handleSubjectClick(subject);
                }}
                variant="primary"
                darkMode={darkMode}
                className={`w-full py-3 rounded-xl font-bold ${fontSizes.buttonText} shadow-md hover:shadow-lg transition-transform transform active:scale-95`}
              >
                <span className="flex items-center justify-center">
                  <PlayIcon className="mr-2" size={16} />
                  {subject.progress && subject.progress > 0 ? 'Kontynuuj naukę' : 'Rozpocznij naukę'}
                </span>
              </RippleButton>

            </div>
          );
        })}
      </AnimatedSection>
      <ToastContainer
        toasts={toasts}
        onClose={removeToast}
        darkMode={darkMode}
        position="top-right"
      />
    </>
  );
};

export default SubjectGrid;