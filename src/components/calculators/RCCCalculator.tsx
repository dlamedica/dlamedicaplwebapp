import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';

interface RCCCalculatorProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  onResultsChange: (results: any) => void;
}

interface RCCFormData {
  tStage: string;
  nStage: string;
  tumorSize: string;
  nuclearGrade: string;
  tumorNecrosis: string;
}

const RCCCalculator: React.FC<RCCCalculatorProps> = ({ darkMode, fontSize, onResultsChange }) => {
  const [formData, setFormData] = useState<RCCFormData>({
    tStage: '',
    nStage: '',
    tumorSize: '',
    nuclearGrade: '',
    tumorNecrosis: ''
  });

  const [results, setResults] = useState<{
    score: number;
    riskGroup: string;
    interpretation: string;
    color: string;
  } | null>(null);

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          cardTitle: 'text-lg',
          cardText: 'text-sm',
          buttonText: 'text-sm',
          resultTitle: 'text-xl',
          resultText: 'text-base'
        };
      case 'large':
        return {
          cardTitle: 'text-xl md:text-2xl',
          cardText: 'text-lg',
          buttonText: 'text-lg',
          resultTitle: 'text-3xl',
          resultText: 'text-xl'
        };
      default:
        return {
          cardTitle: 'text-xl',
          cardText: 'text-base',
          buttonText: 'text-base',
          resultTitle: 'text-2xl',
          resultText: 'text-lg'
        };
    }
  };

  const fontSizes = getFontSizeClasses();

  const tStageOptions = [
    { value: 'T1a', label: 'T1a', points: 0 },
    { value: 'T1b', label: 'T1b', points: 2 },
    { value: 'T2', label: 'T2', points: 3 },
    { value: 'T3a', label: 'T3a', points: 4 },
    { value: 'T3b', label: 'T3b', points: 4 },
    { value: 'T3c', label: 'T3c', points: 4 },
    { value: 'T4', label: 'T4', points: 6 }
  ];

  const nStageOptions = [
    { value: 'N0', label: 'N0', points: 0 },
    { value: 'N1', label: 'N1', points: 2 },
    { value: 'N2', label: 'N2', points: 2 }
  ];

  const tumorSizeOptions = [
    { value: '<10', label: '<10 cm', points: 0 },
    { value: '≥10', label: '≥10 cm', points: 1 }
  ];

  const nuclearGradeOptions = [
    { value: '1', label: 'Stopień 1', points: 0 },
    { value: '2', label: 'Stopień 2', points: 0 },
    { value: '3', label: 'Stopień 3', points: 1 },
    { value: '4', label: 'Stopień 4', points: 3 }
  ];

  const tumorNecrosisOptions = [
    { value: 'absent', label: 'Nieobecna', points: 0 },
    { value: 'present', label: 'Obecna', points: 1 }
  ];

  const calculateScore = () => {
    let totalScore = 0;
    
    const tStageScore = tStageOptions.find(opt => opt.value === formData.tStage)?.points || 0;
    const nStageScore = nStageOptions.find(opt => opt.value === formData.nStage)?.points || 0;
    const tumorSizeScore = tumorSizeOptions.find(opt => opt.value === formData.tumorSize)?.points || 0;
    const nuclearGradeScore = nuclearGradeOptions.find(opt => opt.value === formData.nuclearGrade)?.points || 0;
    const tumorNecrosisScore = tumorNecrosisOptions.find(opt => opt.value === formData.tumorNecrosis)?.points || 0;
    
    totalScore = tStageScore + nStageScore + tumorSizeScore + nuclearGradeScore + tumorNecrosisScore;
    
    return totalScore;
  };

  const getRiskGroup = (score: number) => {
    if (score >= 0 && score <= 2) {
      return {
        riskGroup: 'Niskie ryzyko',
        interpretation: 'Low risk - excellent prognosis with very low risk of progression',
        color: 'green'
      };
    } else if (score >= 3 && score <= 5) {
      return {
        riskGroup: 'Średnie ryzyko',
        interpretation: 'Intermediate risk - moderate risk of progression, requires regular surveillance',
        color: 'yellow'
      };
    } else {
      return {
        riskGroup: 'Wysokie ryzyko',
        interpretation: 'High risk - significant risk of progression, consider adjuvant therapy',
        color: 'red'
      };
    }
  };

  useEffect(() => {
    if (Object.values(formData).every(value => value !== '')) {
      const score = calculateScore();
      const riskAssessment = getRiskGroup(score);
      
      const newResults = {
        score,
        ...riskAssessment
      };
      
      setResults(newResults);
      onResultsChange(newResults);
    } else {
      setResults(null);
      onResultsChange(null);
    }
  }, [formData, onResultsChange]);

  const handleInputChange = (field: keyof RCCFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      tStage: '',
      nStage: '',
      tumorSize: '',
      nuclearGrade: '',
      tumorNecrosis: ''
    });
  };

  const isFormComplete = Object.values(formData).every(value => value !== '');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`${fontSizes.cardTitle} font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
          Model Leibovich dla RCC
        </h2>
        <button
          onClick={resetForm}
          className={`px-3 py-1 text-sm rounded-lg transition-colors duration-200 ${
            darkMode
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Wyczyść
        </button>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* T Stage */}
        <div className={`p-4 rounded-lg ${
          darkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <h3 className={`${fontSizes.cardText} font-semibold ${darkMode ? 'text-white' : 'text-black'} mb-3`}>
            Stopień zaawansowania T (TNM)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {tStageOptions.map((option) => (
              <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="tStage"
                  value={option.value}
                  checked={formData.tStage === option.value}
                  onChange={(e) => handleInputChange('tStage', e.target.value)}
                  className="w-4 h-4 text-[#38b6ff] focus:ring-[#38b6ff]"
                />
                <span className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {option.label} ({option.points} pkt)
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* N Stage */}
        <div className={`p-4 rounded-lg ${
          darkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <h3 className={`${fontSizes.cardText} font-semibold ${darkMode ? 'text-white' : 'text-black'} mb-3`}>
            Stopień zaawansowania N (węzły chłonne)
          </h3>
          <div className="space-y-2">
            {nStageOptions.map((option) => (
              <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="nStage"
                  value={option.value}
                  checked={formData.nStage === option.value}
                  onChange={(e) => handleInputChange('nStage', e.target.value)}
                  className="w-4 h-4 text-[#38b6ff] focus:ring-[#38b6ff]"
                />
                <span className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {option.label} ({option.points} pkt)
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Tumor Size */}
        <div className={`p-4 rounded-lg ${
          darkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <h3 className={`${fontSizes.cardText} font-semibold ${darkMode ? 'text-white' : 'text-black'} mb-3`}>
            Rozmiar guza
          </h3>
          <div className="space-y-2">
            {tumorSizeOptions.map((option) => (
              <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="tumorSize"
                  value={option.value}
                  checked={formData.tumorSize === option.value}
                  onChange={(e) => handleInputChange('tumorSize', e.target.value)}
                  className="w-4 h-4 text-[#38b6ff] focus:ring-[#38b6ff]"
                />
                <span className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {option.label} ({option.points} pkt)
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Nuclear Grade */}
        <div className={`p-4 rounded-lg ${
          darkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <h3 className={`${fontSizes.cardText} font-semibold ${darkMode ? 'text-white' : 'text-black'} mb-3`}>
            Stopień złośliwości jądrowej (Nuclear Grade)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {nuclearGradeOptions.map((option) => (
              <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="nuclearGrade"
                  value={option.value}
                  checked={formData.nuclearGrade === option.value}
                  onChange={(e) => handleInputChange('nuclearGrade', e.target.value)}
                  className="w-4 h-4 text-[#38b6ff] focus:ring-[#38b6ff]"
                />
                <span className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {option.label} ({option.points} pkt)
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Tumor Necrosis */}
        <div className={`p-4 rounded-lg ${
          darkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <h3 className={`${fontSizes.cardText} font-semibold ${darkMode ? 'text-white' : 'text-black'} mb-3`}>
            Martwica guza
          </h3>
          <div className="space-y-2">
            {tumorNecrosisOptions.map((option) => (
              <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="tumorNecrosis"
                  value={option.value}
                  checked={formData.tumorNecrosis === option.value}
                  onChange={(e) => handleInputChange('tumorNecrosis', e.target.value)}
                  className="w-4 h-4 text-[#38b6ff] focus:ring-[#38b6ff]"
                />
                <span className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {option.label} ({option.points} pkt)
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      {!isFormComplete && (
        <div className={`p-4 rounded-lg ${
          darkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'
        }`}>
          <div className="flex items-center space-x-3">
            <FaInfoCircle className="text-blue-500" />
            <span className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Wypełnij wszystkie pola, aby obliczyć wynik
            </span>
          </div>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className={`p-6 rounded-xl border-2 ${
          results.color === 'green'
            ? 'bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-700'
            : results.color === 'yellow'
            ? 'bg-yellow-50 border-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-700'
            : 'bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-700'
        }`}>
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              results.color === 'green' ? 'bg-green-500' :
              results.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
            }`}>
              {results.color === 'green' ? (
                <FaCheckCircle className="text-white text-xl" />
              ) : (
                <FaExclamationTriangle className="text-white text-xl" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-2">
                <span className={`${fontSizes.resultTitle} font-bold ${
                  results.color === 'green' ? 'text-green-700 dark:text-green-300' :
                  results.color === 'yellow' ? 'text-yellow-700 dark:text-yellow-300' :
                  'text-red-700 dark:text-red-300'
                }`}>
                  {results.score} punktów
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                  results.color === 'green' ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200' :
                  results.color === 'yellow' ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200' :
                  'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200'
                }`}>
                  {results.riskGroup}
                </span>
              </div>
              <p className={`${fontSizes.resultText} font-semibold ${
                results.color === 'green' ? 'text-green-800 dark:text-green-200' :
                results.color === 'yellow' ? 'text-yellow-800 dark:text-yellow-200' :
                'text-red-800 dark:text-red-200'
              }`}>
                {results.interpretation}
              </p>
            </div>
          </div>
          
          <div className={`mt-4 p-3 rounded-lg ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-black'} mb-2`}>
              Interpretacja wyników:
            </h4>
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} space-y-2`}>
              {results.riskGroup === 'Niskie ryzyko' && (
                <div>
                  <p>• 5-letnie przeżycie bez progresji: &gt;95%</p>
                  <p>• 5-letnie przeżycie swoiste dla nowotworu: &gt;98%</p>
                  <p>• Rozważ aktywne obserwowanie w wybranych przypadkach</p>
                </div>
              )}
              {results.riskGroup === 'Średnie ryzyko' && (
                <div>
                  <p>• 5-letnie przeżycie bez progresji: 70-80%</p>
                  <p>• 5-letnie przeżycie swoiste dla nowotworu: 85-90%</p>
                  <p>• Regularne kontrole obrazowe co 6 miesięcy</p>
                </div>
              )}
              {results.riskGroup === 'Wysokie ryzyko' && (
                <div>
                  <p>• 5-letnie przeżycie bez progresji: &lt;50%</p>
                  <p>• 5-letnie przeżycie swoiste dla nowotworu: &lt;70%</p>
                  <p>• Rozważ terapię adiuwantową i ścisłe monitorowanie</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Scoring Summary */}
      <div className={`p-4 rounded-lg ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
      }`}>
        <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-black'} mb-3`}>
          Podsumowanie punktacji:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className={`p-3 rounded ${darkMode ? 'bg-green-900/20' : 'bg-green-50'}`}>
            <div className="font-medium text-green-700 dark:text-green-300">Niskie ryzyko</div>
            <div className={darkMode ? 'text-gray-300' : 'text-gray-600'}>0-2 punkty</div>
          </div>
          <div className={`p-3 rounded ${darkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'}`}>
            <div className="font-medium text-yellow-700 dark:text-yellow-300">Średnie ryzyko</div>
            <div className={darkMode ? 'text-gray-300' : 'text-gray-600'}>3-5 punktów</div>
          </div>
          <div className={`p-3 rounded ${darkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
            <div className="font-medium text-red-700 dark:text-red-300">Wysokie ryzyko</div>
            <div className={darkMode ? 'text-gray-300' : 'text-gray-600'}>≥6 punktów</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RCCCalculator;