import React from 'react';
import { CloseIcon, CourseIcon, HistoryIcon, AwardIcon } from '../icons/UniversityIcons';

interface CourseDetails {
  name: string;
  type: 'jednolite_magisterskie' | 'licencjackie' | 'magisterskie' | 'doktoranckie' | 'podyplomowe';
  durationYears: number;
  language: 'polish' | 'english' | 'both';
  tuitionFee?: number;
  admissionRequirements?: string[];
  description?: string;
  careerProspects?: string[];
}

interface CourseDetailsModalProps {
  course: CourseDetails;
  darkMode: boolean;
  onClose: () => void;
}

/**
 * Modal z szczegółami kierunku studiów
 * Unikalny design dla DlaMedica.pl
 */
const CourseDetailsModal: React.FC<CourseDetailsModalProps> = ({ 
  course, 
  darkMode, 
  onClose 
}) => {
  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'jednolite_magisterskie': 'Jednolite magisterskie',
      'licencjackie': 'Licencjackie',
      'magisterskie': 'Magisterskie',
      'doktoranckie': 'Doktoranckie',
      'podyplomowe': 'Podyplomowe'
    };
    return labels[type] || type;
  };

  const getLanguageLabel = (lang: string) => {
    const labels: Record<string, string> = {
      'polish': 'Polski',
      'english': 'Angielski',
      'both': 'Polski i angielski'
    };
    return labels[lang] || lang;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className={`rounded-2xl max-w-2xl w-full p-8 shadow-2xl transform transition-all duration-300 ${
        darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-white to-gray-50'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              darkMode ? 'bg-[#38b6ff]/20' : 'bg-[#38b6ff]/10'
            }`}>
              <CourseIcon size={24} color="#38b6ff" />
            </div>
            <div>
              <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {course.name}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {getTypeLabel(course.type)}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className={`p-2 rounded-lg transition-all duration-200 hover:bg-opacity-20 hover:bg-gray-500 ${
              darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <CloseIcon size={24} color={darkMode ? '#9CA3AF' : '#6B7280'} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Basic Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-xl ${
              darkMode ? 'bg-gray-700/50' : 'bg-gray-100'
            }`}>
              <div className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Czas trwania
              </div>
              <div className={`text-lg font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <HistoryIcon size={18} color="#38b6ff" />
                {course.durationYears} {course.durationYears === 1 ? 'rok' : course.durationYears < 5 ? 'lata' : 'lat'}
              </div>
            </div>
            <div className={`p-4 rounded-xl ${
              darkMode ? 'bg-gray-700/50' : 'bg-gray-100'
            }`}>
              <div className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Język wykładowy
              </div>
              <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {getLanguageLabel(course.language)}
              </div>
            </div>
            {course.tuitionFee !== undefined && (
              <div className={`p-4 rounded-xl ${
                darkMode ? 'bg-gray-700/50' : 'bg-gray-100'
              }`}>
                <div className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Czesne
                </div>
                <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {course.tuitionFee === 0 ? 'Bezpłatne' : `${course.tuitionFee.toLocaleString('pl-PL')} PLN/rok`}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {course.description && (
            <div>
              <h4 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Opis kierunku
              </h4>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                {course.description}
              </p>
            </div>
          )}

          {/* Admission Requirements */}
          {course.admissionRequirements && course.admissionRequirements.length > 0 && (
            <div>
              <h4 className={`font-bold mb-3 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <AwardIcon size={18} color="#38b6ff" />
                Wymagania rekrutacyjne
              </h4>
              <ul className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {course.admissionRequirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                      darkMode ? 'bg-[#38b6ff]' : 'bg-[#38b6ff]'
                    }`}></span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Career Prospects */}
          {course.careerProspects && course.careerProspects.length > 0 && (
            <div>
              <h4 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Perspektywy zawodowe
              </h4>
              <div className="flex flex-wrap gap-2">
                {course.careerProspects.map((prospect, index) => (
                  <span 
                    key={index}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      darkMode 
                        ? 'bg-[#38b6ff]/20 text-[#38b6ff] border border-[#38b6ff]/30' 
                        : 'bg-[#38b6ff]/10 text-[#38b6ff] border border-[#38b6ff]/20'
                    }`}
                  >
                    {prospect}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 bg-gradient-to-r from-[#38b6ff] to-[#2da7ef] text-white hover:from-[#2da7ef] hover:to-[#38b6ff] shadow-md hover:shadow-lg transform hover:scale-105`}
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsModal;

