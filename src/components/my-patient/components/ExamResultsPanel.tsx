/**
 * Panel wyników badania fizykalnego
 * Lista wykonanych badań z wynikami
 */

import React, { useState } from 'react';
import { ExamResultsPanelProps, PhysicalExamAction, ExamType } from '../types/physicalExam';
import { AnimatedSection } from '../../education/components';

const ExamResultsPanel: React.FC<ExamResultsPanelProps> = ({
  actions,
  onPlayAudio,
  darkMode
}) => {
  const [expandedAction, setExpandedAction] = useState<string | null>(null);
  const [filter, setFilter] = useState<ExamType | 'all'>('all');

  // Filtruj akcje
  const filteredActions = filter === 'all' 
    ? actions 
    : actions.filter(a => a.type === filter);

  // Sortuj od najnowszych
  const sortedActions = [...filteredActions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Ikony typów
  const examTypeIcons: { [key: string]: string } = {
    auscultation: '🩺',
    palpation: '✋',
    percussion: '🔨',
    inspection: '👁️'
  };

  // Etykiety typów
  const examTypeLabels: { [key: string]: string } = {
    auscultation: 'Osłuchiwanie',
    palpation: 'Palpacja',
    percussion: 'Perkusja',
    inspection: 'Inspekcja'
  };

  // Kolor severity
  const severityColors = {
    normal: { bg: 'bg-green-500/20', text: 'text-green-500', border: 'border-green-500/30' },
    mild: { bg: 'bg-yellow-500/20', text: 'text-yellow-500', border: 'border-yellow-500/30' },
    moderate: { bg: 'bg-orange-500/20', text: 'text-orange-500', border: 'border-orange-500/30' },
    severe: { bg: 'bg-red-500/20', text: 'text-red-500', border: 'border-red-500/30' }
  };

  // Formatuj czas
  const formatTime = (date: Date): string => {
    return new Date(date).toLocaleTimeString('pl-PL', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`exam-results-panel p-4 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
      {/* Nagłówek */}
      <div className="flex items-center justify-between mb-4">
        <h4 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          📋 Wyniki badania
        </h4>
        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
          {actions.length} badań
        </span>
      </div>

      {/* Filtry */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            filter === 'all'
              ? 'bg-blue-500 text-white'
              : darkMode ? 'bg-gray-600/50 text-gray-400 hover:bg-gray-600' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          Wszystkie
        </button>
        {(['auscultation', 'palpation', 'percussion', 'inspection'] as ExamType[]).map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
              filter === type
                ? 'bg-blue-500 text-white'
                : darkMode ? 'bg-gray-600/50 text-gray-400 hover:bg-gray-600' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <span>{examTypeIcons[type]}</span>
            {examTypeLabels[type]}
          </button>
        ))}
      </div>

      {/* Lista wyników */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {sortedActions.length === 0 ? (
          <div className={`text-center py-8 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            <span className="text-3xl mb-2 block">🩺</span>
            <p className="text-sm">Brak wykonanych badań</p>
            <p className="text-xs opacity-70 mt-1">Wybierz narzędzie i kliknij na mapie ciała</p>
          </div>
        ) : (
          sortedActions.map((action, index) => {
            const colors = severityColors[action.result.severity];
            const isExpanded = expandedAction === action.id;

            return (
              <AnimatedSection 
                key={action.id} 
                animation="slideLeft" 
                delay={index * 50}
              >
                <div 
                  className={`rounded-lg overflow-hidden transition-all duration-300 border ${
                    isExpanded 
                      ? darkMode ? 'bg-gray-600/50 border-blue-500/50' : 'bg-white border-blue-200'
                      : darkMode ? 'bg-gray-600/30 border-gray-600/50 hover:bg-gray-600/40' : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {/* Nagłówek akcji */}
                  <div 
                    className="p-3 cursor-pointer"
                    onClick={() => setExpandedAction(isExpanded ? null : action.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{examTypeIcons[action.type]}</span>
                        <div>
                          <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {action.regionName}
                          </p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {examTypeLabels[action.type]} • {formatTime(action.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Badge severity */}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${colors.bg} ${colors.text} border ${colors.border}`}>
                          {action.result.isAbnormal ? '⚠️' : '✓'} {
                            action.result.severity === 'normal' ? 'Norma' :
                            action.result.severity === 'mild' ? 'Łagodne' :
                            action.result.severity === 'moderate' ? 'Umiarkowane' : 'Ciężkie'
                          }
                        </span>

                        {/* Ikona rozwinięcia */}
                        <svg 
                          className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Szczegóły (rozwinięte) */}
                  {isExpanded && (
                    <div className={`px-3 pb-3 border-t ${darkMode ? 'border-gray-600/50' : 'border-gray-200'}`}>
                      <div className="pt-3">
                        {/* Opis wyniku */}
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                          {action.result.descriptionPL}
                        </p>

                        {/* Znaczenie kliniczne */}
                        {action.result.clinicalSignificance && (
                          <div className={`p-2 rounded-lg ${darkMode ? 'bg-yellow-500/10' : 'bg-yellow-50'} mb-2`}>
                            <p className={`text-xs ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                              💡 <strong>Znaczenie kliniczne:</strong> {action.result.clinicalSignificance}
                            </p>
                          </div>
                        )}

                        {/* Przycisk audio (jeśli dostępny) */}
                        {action.result.audioUrl && onPlayAudio && (
                          <button
                            onClick={() => onPlayAudio(action.result.audioUrl!)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${
                              darkMode 
                                ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' 
                                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                            } transition-colors`}
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                            Odtwórz nagranie
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </AnimatedSection>
            );
          })
        )}
      </div>

      {/* Podsumowanie */}
      {actions.length > 0 && (
        <div className={`mt-4 p-3 rounded-lg ${darkMode ? 'bg-gray-600/30' : 'bg-white'} border ${darkMode ? 'border-gray-600/50' : 'border-gray-200'}`}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Prawidłowe</p>
              <p className={`text-lg font-bold text-green-500`}>
                {actions.filter(a => !a.result.isAbnormal).length}
              </p>
            </div>
            <div>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Nieprawidłowe</p>
              <p className={`text-lg font-bold text-red-500`}>
                {actions.filter(a => a.result.isAbnormal).length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamResultsPanel;

