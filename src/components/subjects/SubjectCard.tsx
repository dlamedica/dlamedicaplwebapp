import React from 'react';
import { FaStar, FaPlay, FaBookOpen, FaUsers } from 'react-icons/fa';

export interface Subject {
  id: number;
  name: string;
  modules: number;
  difficulty: 'Łatwy' | 'Średni' | 'Trudny';
  icon: string;
  priority?: number;
  description: string;
  forProfessions?: string[];
  isFavorite?: boolean;
  category?: string;
  level?: 'Podstawowy' | 'Średniozaawansowany' | 'Ekspert';
  hasCertification?: boolean;
}

interface SubjectCardProps {
  subject: Subject;
  onFavoriteToggle: (subjectId: number) => void;
  darkMode: boolean;
  onClick: () => void;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ 
  subject, 
  onFavoriteToggle, 
  darkMode,
  onClick 
}) => {
  const getDifficultyColor = () => {
    switch (subject.difficulty) {
      case 'Łatwy':
        return darkMode ? 'text-green-400' : 'text-green-600';
      case 'Średni':
        return darkMode ? 'text-yellow-400' : 'text-yellow-600';
      case 'Trudny':
        return darkMode ? 'text-red-400' : 'text-red-600';
      default:
        return darkMode ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const getDifficultyBgColor = () => {
    switch (subject.difficulty) {
      case 'Łatwy':
        return darkMode ? 'bg-green-900/30' : 'bg-green-100';
      case 'Średni':
        return darkMode ? 'bg-yellow-900/30' : 'bg-yellow-100';
      case 'Trudny':
        return darkMode ? 'bg-red-900/30' : 'bg-red-100';
      default:
        return darkMode ? 'bg-gray-800' : 'bg-gray-100';
    }
  };

  return (
    <div 
      className={`
        relative rounded-xl p-6 transition-all duration-300 cursor-pointer transform hover:scale-105
        ${darkMode 
          ? 'bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-gray-600' 
          : 'bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
        } shadow-lg hover:shadow-xl
      `}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl bg-gray-100 dark:bg-gray-700 mr-4">
            {subject.icon}
          </div>
          <div className="flex-1">
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
              {subject.name}
            </h3>
          </div>
        </div>
        
        {/* Favorite Star */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle(subject.id);
          }}
          className={`
            p-2 rounded-full transition-colors duration-200
            ${subject.isFavorite 
              ? 'text-yellow-500 hover:text-yellow-600' 
              : darkMode 
                ? 'text-gray-500 hover:text-yellow-500' 
                : 'text-gray-400 hover:text-yellow-500'
            }
          `}
        >
          <FaStar size={20} className={subject.isFavorite ? 'fill-current' : ''} />
        </button>
      </div>

      {/* Description */}
      <p className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4 line-clamp-2`}>
        {subject.description}
      </p>

      {/* Meta Info */}
      <div className="space-y-3 mb-4">
        {/* Modules */}
        <div className="flex items-center">
          <FaBookOpen className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`} />
          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {subject.modules} modułów
          </span>
        </div>

        {/* Difficulty */}
        <div className="flex items-center">
          <span className={`
            px-3 py-1 rounded-full text-sm font-medium inline-flex items-center
            ${getDifficultyBgColor()} ${getDifficultyColor()}
          `}>
            {subject.difficulty}
          </span>
        </div>

        {/* For Professions */}
        {subject.forProfessions && subject.forProfessions.length > 0 && (
          <div className="flex items-center">
            <FaUsers className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`} />
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Dla: {subject.forProfessions.slice(0, 2).join(', ')}
              {subject.forProfessions.length > 2 && ` +${subject.forProfessions.length - 2}`}
            </span>
          </div>
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 bg-[#38b6ff] hover:bg-[#2a9fe5] text-black flex items-center justify-center"
      >
        <FaPlay className="mr-2" />
        Rozpocznij naukę
      </button>
    </div>
  );
};

export default SubjectCard;