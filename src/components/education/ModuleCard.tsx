import React from 'react';
import {
  PlayIcon,
  CheckCircleIcon,
  ClockIcon,
  BookOpenIcon,
  QuestionCircleIcon,
  LockIcon,
  StarIcon,
  EyeIcon
} from './icons/EducationIcons';
import { PremiumIcon } from '../icons/PlatformIcons';
import { RippleButton, CountUp, AnimatedSection } from './components';
import ProgressBar from './ProgressBar';
import './styles/educationStyles.css';

interface Module {
  id: string;
  subjectId: string;
  name: string;
  description: string;
  order: number;
  estimatedHours: number;
  difficulty: 'easy' | 'medium' | 'hard';
  topics: number;
  isCompleted: boolean;
  progress: number;
  isLocked?: boolean;
  prerequisites?: string[];
  hasQuiz?: boolean;
  userProgress?: {
    completed: boolean;
    progress: number;
    timeStudied: number;
    lastAccessed: string;
    startedAt: string;
  };
}

interface ModuleCardProps {
  module: Module;
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  onClick?: (module: Module) => void;
  onStart?: (module: Module) => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ 
  module, 
  darkMode, 
  fontSize, 
  onClick,
  onStart 
}) => {
  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          title: 'text-lg',
          text: 'text-sm',
          meta: 'text-xs'
        };
      case 'large':
        return {
          title: 'text-2xl',
          text: 'text-lg',
          meta: 'text-base'
        };
      default:
        return {
          title: 'text-xl',
          text: 'text-base',
          meta: 'text-sm'
        };
    }
  };

  const fontSizes = getFontSizeClasses();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return darkMode 
          ? 'bg-green-500/20 text-green-400 border-green-500/30' 
          : 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return darkMode 
          ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' 
          : 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard':
        return darkMode 
          ? 'bg-red-500/20 text-red-400 border-red-500/30' 
          : 'bg-red-100 text-red-800 border-red-200';
      default:
        return darkMode 
          ? 'bg-gray-700/50 text-gray-300 border-gray-600' 
          : 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'Łatwy';
      case 'medium':
        return 'Średni';
      case 'hard':
        return 'Trudny';
      default:
        return 'Nieznany';
    }
  };

  const getStatusInfo = () => {
    if (module.isLocked) {
      return {
        icon: LockIcon,
        text: 'Zablokowany',
        color: 'text-gray-500',
        bgGradient: 'from-gray-500 to-gray-600',
        borderColor: 'border-gray-500/30'
      };
    } else if (module.isCompleted) {
      return {
        icon: CheckCircleIcon,
        text: 'Ukończony',
        color: 'text-green-500',
        bgGradient: 'from-green-500 to-emerald-500',
        borderColor: 'border-green-500/30'
      };
    } else if (module.progress > 0) {
      return {
        icon: PlayIcon,
        text: 'W trakcie',
        color: 'text-blue-500',
        bgGradient: 'from-blue-500 to-cyan-500',
        borderColor: 'border-blue-500/30'
      };
    } else {
      return {
        icon: StarIcon,
        text: 'Nowy',
        color: 'text-yellow-500',
        bgGradient: 'from-yellow-500 to-amber-500',
        borderColor: 'border-yellow-500/30'
      };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  const formatTime = (hours: number) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)} min`;
    }
    return `${hours}h`;
  };

  const formatLastAccessed = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Dzisiaj';
    } else if (diffDays === 1) {
      return 'Wczoraj';
    } else if (diffDays < 7) {
      return `${diffDays} dni temu`;
    } else {
      return date.toLocaleDateString('pl-PL');
    }
  };

  const handleCardClick = () => {
    if (onClick && !module.isLocked) {
      onClick(module);
    }
  };

  const handleStartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onStart && !module.isLocked) {
      onStart(module);
    }
  };

  return (
    <AnimatedSection animation="slideUp" delay={(module.order - 1) * 50}>
      <div
        onClick={handleCardClick}
        className={`group relative rounded-2xl p-6 education-module-card education-card-hover transition-all duration-500 ${
          module.isLocked 
            ? 'opacity-60 cursor-not-allowed' 
            : 'cursor-pointer hover:shadow-2xl hover:scale-[1.01] hover:-translate-y-1'
        } ${
          darkMode 
            ? 'bg-gray-800/80 border border-gray-700/50' 
            : 'bg-white/80 border border-gray-200/50'
        } education-glass shadow-lg`}
      >
        {/* Hover Glow Effect */}
        {!module.isLocked && (
          <div 
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"
            style={{
              background: module.isCompleted 
                ? 'radial-gradient(circle at center, rgba(16, 185, 129, 0.4), transparent 70%)'
                : module.progress > 0
                  ? 'radial-gradient(circle at center, rgba(59, 130, 246, 0.4), transparent 70%)'
                  : 'radial-gradient(circle at center, rgba(156, 163, 175, 0.2), transparent 70%)'
            }}
          />
        )}
      {/* Timeline Line */}
      {!module.isLocked && (
        <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${
          module.isCompleted 
            ? 'from-green-500 to-green-600'
            : module.progress > 0
              ? 'from-blue-500 to-cyan-500'
              : 'from-gray-300 to-gray-400'
        } rounded-l-2xl`} />
      )}

      {/* Module Number Badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shadow-lg transition-all ${
          module.isCompleted 
            ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white animate-pulse'
            : module.progress > 0
              ? 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white'
              : darkMode 
                ? 'bg-gray-700/50 text-gray-300 border border-gray-600'
                : 'bg-gray-200 text-gray-600 border border-gray-300'
        }`}>
          <CountUp end={module.order} duration={500} />
        </div>
      </div>

      {/* Status Icon with Background */}
      <div className="mb-4 flex items-center space-x-3">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${statusInfo.bgGradient} education-icon-wrapper shadow-lg`}>
          <StatusIcon className="text-white" size={24} />
        </div>
        <div>
          <span className={`text-xs font-semibold px-2 py-1 rounded-lg border ${statusInfo.borderColor} ${
            darkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-100 text-gray-700'
          }`}>
            {statusInfo.text}
          </span>
        </div>
      </div>

      {/* Module Header */}
      <div className="mb-4">
        <h3 className={`${fontSizes.title} font-bold mb-2 ${
          darkMode ? 'text-white' : 'text-gray-900'
        } pr-14`}>
          {module.name}
        </h3>
        
        <p className={`${fontSizes.text} ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        } mb-3 line-clamp-2`}>
          {module.description}
        </p>

        {/* Difficulty Badge */}
        <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border ${getDifficultyColor(module.difficulty)}`}>
          {getDifficultyText(module.difficulty)}
        </span>
      </div>

      {/* Progress Bar */}
      {module.progress > 0 && !module.isLocked && (
        <div className="mb-4">
          <ProgressBar 
            progress={module.progress} 
            darkMode={darkMode}
            size="small"
            animated={true}
            showPercentage={true}
          />
        </div>
      )}

      {/* Module Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className={`flex items-center p-2 rounded-lg ${
          darkMode ? 'bg-gray-700/30' : 'bg-gray-50'
        }`}>
          <div className={`p-1.5 rounded-lg mr-2 ${
            darkMode ? 'bg-blue-500/20' : 'bg-blue-100'
          }`}>
            <ClockIcon className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`} size={14} />
          </div>
          <span className={`${fontSizes.meta} font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {formatTime(module.estimatedHours)}
          </span>
        </div>
        <div className={`flex items-center p-2 rounded-lg ${
          darkMode ? 'bg-gray-700/30' : 'bg-gray-50'
        }`}>
          <div className={`p-1.5 rounded-lg mr-2 ${
            darkMode ? 'bg-purple-500/20' : 'bg-purple-100'
          }`}>
            <BookOpenIcon className={`${darkMode ? 'text-purple-400' : 'text-purple-600'}`} size={14} />
          </div>
          <span className={`${fontSizes.meta} font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <CountUp end={module.topics} duration={800} /> tematów
          </span>
        </div>
      </div>

      {/* Additional Info */}
      <div className="space-y-2 mb-4">
        {module.hasQuiz && (
          <div className={`flex items-center p-2 rounded-lg ${
            darkMode ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-100'
          }`}>
            <QuestionCircleIcon className={`${darkMode ? 'text-blue-400' : 'text-blue-600'} mr-2`} size={16} />
            <span className={`${fontSizes.meta} font-medium ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
              Zawiera quiz
            </span>
          </div>
        )}
        
        {module.userProgress?.lastAccessed && (
          <div className="flex items-center">
            <EyeIcon className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`} size={16} />
            <span className={`${fontSizes.meta} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Ostatnio: {formatLastAccessed(module.userProgress.lastAccessed)}
            </span>
          </div>
        )}

        {module.userProgress?.timeStudied && module.userProgress.timeStudied > 0 && (
          <div className={`flex items-center p-2 rounded-lg ${
            darkMode ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-100'
          }`}>
            <ClockIcon className={`${darkMode ? 'text-green-400' : 'text-green-600'} mr-2`} size={16} />
            <span className={`${fontSizes.meta} font-medium ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
              Studiowano: {formatTime(module.userProgress.timeStudied / 60)}
            </span>
          </div>
        )}
      </div>

      {/* Prerequisites Warning */}
      {module.prerequisites && module.prerequisites.length > 0 && !module.isCompleted && (
        <div className={`mb-4 p-3 rounded-xl border-2 ${
          darkMode ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-center">
            <div className={`p-1.5 rounded-lg mr-2 ${
              darkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'
            }`}>
              <LockIcon className="text-yellow-500" size={16} />
            </div>
            <span className={`${fontSizes.meta} font-medium ${
              darkMode ? 'text-yellow-300' : 'text-yellow-800'
            }`}>
              Wymaga ukończenia {module.prerequisites.length} poprzednich modułów
            </span>
          </div>
        </div>
      )}

      {/* Action Button */}
      <RippleButton
        onClick={handleStartClick}
        disabled={module.isLocked}
        variant={module.isLocked ? 'secondary' : module.isCompleted ? 'primary' : module.progress > 0 ? 'primary' : 'outline'}
        darkMode={darkMode}
        className={`w-full py-3.5 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl ${
          module.isLocked ? 'opacity-50 cursor-not-allowed' : ''
        } ${
          module.isCompleted
            ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
            : module.progress > 0
              ? 'bg-gradient-to-r from-[#38b6ff] to-[#2a9fe5] text-white'
              : ''
        } ${fontSizes.text}`}
      >
        <span className="flex items-center justify-center">
          {module.isLocked ? (
            <>
              <LockIcon className="mr-2" size={16} />
              Zablokowany
            </>
          ) : module.isCompleted ? (
            <>
              <CheckCircleIcon className="mr-2" size={16} />
              Przejrzyj ponownie
            </>
          ) : module.progress > 0 ? (
            <>
              <PlayIcon className="mr-2" size={16} />
              Kontynuuj ({module.progress}%)
            </>
          ) : (
            <>
              <StarIcon className="mr-2" size={16} />
              Rozpocznij moduł
            </>
          )}
        </span>
      </RippleButton>

      {/* Premium Badge */}
      {module.difficulty === 'hard' && !module.userProgress && (
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 text-black px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg education-badge animate-pulse">
            <PremiumIcon size={14} color="currentColor" className="inline-block" />
            PREMIUM
          </span>
        </div>
      )}
      </div>
    </AnimatedSection>
  );
};

export default ModuleCard;