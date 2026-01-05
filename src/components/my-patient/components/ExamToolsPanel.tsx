/**
 * Panel narzędzi badania fizykalnego
 * Wybór trybu: osłuchiwanie, palpacja, perkusja, inspekcja
 */

import React from 'react';
import { ExamToolsPanelProps, ExamType } from '../types/physicalExam';
import { RippleButton } from '../../education/components';

const ExamToolsPanel: React.FC<ExamToolsPanelProps> = ({
  selectedExamType,
  onSelectExamType,
  examProgress,
  examLimits,
  darkMode,
  disabled = false
}) => {
  const examTools: { type: ExamType; name: string; namePL: string; icon: string; description: string }[] = [
    {
      type: 'inspection',
      name: 'Inspection',
      namePL: 'Inspekcja',
      icon: '👁️',
      description: 'Oglądanie - ocena wizualna'
    },
    {
      type: 'palpation',
      name: 'Palpation',
      namePL: 'Palpacja',
      icon: '✋',
      description: 'Badanie dotykiem'
    },
    {
      type: 'percussion',
      name: 'Percussion',
      namePL: 'Perkusja',
      icon: '🔨',
      description: 'Opukiwanie'
    },
    {
      type: 'auscultation',
      name: 'Auscultation',
      namePL: 'Osłuchiwanie',
      icon: '🩺',
      description: 'Osłuchiwanie stetoskopem'
    }
  ];

  const getExamCount = (type: ExamType): number => {
    switch (type) {
      case 'auscultation': return examProgress.auscultationCount;
      case 'palpation': return examProgress.palpationCount;
      case 'percussion': return examProgress.percussionCount;
      case 'inspection': return examProgress.inspectionCount;
      default: return 0;
    }
  };

  const getExamLimit = (type: ExamType): number => {
    switch (type) {
      case 'auscultation': return examLimits.auscultation;
      case 'palpation': return examLimits.palpation;
      case 'percussion': return examLimits.percussion;
      case 'inspection': return examLimits.inspection;
      default: return 0;
    }
  };

  const isLimitReached = (type: ExamType): boolean => {
    return getExamCount(type) >= getExamLimit(type);
  };

  const totalCount = examProgress.auscultationCount + examProgress.palpationCount + 
                     examProgress.percussionCount + examProgress.inspectionCount;

  return (
    <div className={`exam-tools-panel p-4 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
      {/* Nagłówek */}
      <div className="mb-4">
        <h4 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
          🔧 Narzędzia badania
        </h4>
        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Wybierz typ badania, a następnie kliknij na mapie ciała
        </p>
      </div>

      {/* Przyciski narzędzi */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {examTools.map(tool => {
          const count = getExamCount(tool.type);
          const limit = getExamLimit(tool.type);
          const limitReached = isLimitReached(tool.type);
          const isSelected = selectedExamType === tool.type;

          return (
            <button
              key={tool.type}
              onClick={() => !disabled && !limitReached && onSelectExamType(tool.type)}
              disabled={disabled || limitReached}
              className={`relative p-4 rounded-xl text-left transition-all duration-300 ${
                isSelected
                  ? 'bg-gradient-to-br from-[#38b6ff] to-[#2a9fe5] text-white shadow-lg transform scale-[1.02]'
                  : limitReached
                    ? darkMode 
                      ? 'bg-gray-600/50 text-gray-500 cursor-not-allowed' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : darkMode
                      ? 'bg-gray-600/50 text-gray-300 hover:bg-gray-600 hover:transform hover:scale-[1.02]'
                      : 'bg-white text-gray-700 hover:bg-gray-50 hover:transform hover:scale-[1.02] border border-gray-200'
              }`}
            >
              {/* Ikona i nazwa */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{tool.icon}</span>
                <span className="font-semibold text-sm">{tool.namePL}</span>
              </div>
              
              {/* Opis */}
              <p className={`text-xs ${isSelected ? 'text-white/80' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {tool.description}
              </p>

              {/* Licznik */}
              <div className={`mt-2 flex items-center justify-between`}>
                <span className={`text-xs font-medium ${
                  isSelected ? 'text-white/90' : 
                  limitReached ? 'text-red-500' : 
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {count}/{limit}
                </span>
                
                {/* Progress bar */}
                <div className={`flex-1 ml-2 h-1.5 rounded-full overflow-hidden ${
                  isSelected ? 'bg-white/30' : darkMode ? 'bg-gray-500' : 'bg-gray-300'
                }`}>
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      limitReached ? 'bg-red-500' : isSelected ? 'bg-white' : 'bg-blue-500'
                    }`}
                    style={{ width: `${(count / limit) * 100}%` }}
                  />
                </div>
              </div>

              {/* Badge "aktywne" */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white">
                    AKTYWNE
                  </span>
                </div>
              )}

              {/* Badge "limit" */}
              {limitReached && (
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-500">
                    LIMIT
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Podsumowanie postępu */}
      <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-600/30' : 'bg-white'} border ${darkMode ? 'border-gray-600/50' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Postęp badania
          </span>
          <span className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {totalCount}/{examLimits.total}
          </span>
        </div>
        
        {/* Progress bar całkowity */}
        <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-gray-500' : 'bg-gray-200'}`}>
          <div 
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
            style={{ width: `${(totalCount / examLimits.total) * 100}%` }}
          />
        </div>

        {/* Kluczowe punkty */}
        <div className="mt-3 flex items-center justify-between">
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Kluczowe punkty zbadane
          </span>
          <span className={`text-xs font-bold ${
            examProgress.keyPointsExamined.length >= examProgress.totalKeyPoints 
              ? 'text-green-500' 
              : darkMode ? 'text-yellow-400' : 'text-yellow-600'
          }`}>
            {examProgress.keyPointsExamined.length}/{examProgress.totalKeyPoints}
          </span>
        </div>
      </div>

      {/* Ostrzeżenie o limicie */}
      {totalCount >= examLimits.total && (
        <div className={`mt-3 p-3 rounded-lg ${darkMode ? 'bg-red-500/20' : 'bg-red-50'} border ${darkMode ? 'border-red-500/30' : 'border-red-200'}`}>
          <p className={`text-xs font-medium ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
            ⚠️ Osiągnięto limit badań! Przejdź do diagnozy.
          </p>
        </div>
      )}
    </div>
  );
};

export default ExamToolsPanel;

