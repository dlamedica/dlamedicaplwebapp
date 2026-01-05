import React, { useState } from 'react';
import { Star, Share2, ChevronDown, ChevronUp, Copy, ArrowRight } from 'lucide-react';

interface PolymyalgiaRheumaticaCalculatorProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const PolymyalgiaRheumaticaCalculator: React.FC<PolymyalgiaRheumaticaCalculatorProps> = ({ darkMode, fontSize }) => {
  const [scores, setScores] = useState({
    morningStiffness: 0,    // <45min = 0, ≥45min = 2
    hipPain: 0,            // No = 0, Yes = 1
    rfAcpa: 0,             // Present = 0, Absent = 2
    otherJointPain: 0,     // Present = 0, Absent = 1
    shoulderUS1: 0,        // No = 0, Yes = 1
    shoulderUS2: 0         // No = 0, Yes = 1
  });

  const [expandedSections, setExpandedSections] = useState({
    whenToUse: false,
    pearlsPitfalls: false
  });

  const [isFavorite, setIsFavorite] = useState(false);

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          title: 'text-xl md:text-2xl',
          subtitle: 'text-base md:text-lg',
          text: 'text-sm md:text-base',
          button: 'text-sm',
          score: 'text-3xl'
        };
      case 'large':
        return {
          title: 'text-3xl md:text-4xl',
          subtitle: 'text-xl md:text-2xl',
          text: 'text-lg md:text-xl',
          button: 'text-lg',
          score: 'text-5xl'
        };
      default:
        return {
          title: 'text-2xl md:text-3xl',
          subtitle: 'text-lg md:text-xl',
          text: 'text-base md:text-lg',
          button: 'text-base',
          score: 'text-4xl'
        };
    }
  };

  const fontSizes = getFontSizeClasses();

  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

  const getResult = () => {
    if (totalScore >= 4) {
      return {
        text: "Spełnia kryteria EULAR/ACR dla klasyfikacji PMR",
        color: "text-green-600",
        bgColor: "bg-green-50 border-green-200"
      };
    } else {
      return {
        text: "Nie spełnia kryteriów EULAR/ACR dla klasyfikacji PMR",
        color: "text-red-600",
        bgColor: "bg-red-50 border-red-200"
      };
    }
  };

  const result = getResult();

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateScore = (field: keyof typeof scores, value: number) => {
    setScores(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const copyResults = () => {
    const resultText = `Kryteria EULAR/ACR 2012 dla Polymyalgia Rheumatica
    
Wynik: ${totalScore} punktów
${result.text}

Szczegóły:
- Sztywność poranna ≥45 min: ${scores.morningStiffness === 2 ? 'Tak (+2)' : 'Nie (0)'}
- Ból bioder/ograniczony zakres ruchu: ${scores.hipPain === 1 ? 'Tak (+1)' : 'Nie (0)'}
- RF lub ACPA: ${scores.rfAcpa === 2 ? 'Nieobecne (+2)' : 'Obecne (0)'}
- Inne bóle stawowe: ${scores.otherJointPain === 1 ? 'Nieobecne (+1)' : 'Obecne (0)'}
- USG - jeden bark: ${scores.shoulderUS1 === 1 ? 'Tak (+1)' : 'Nie (0)'}
- USG - oba barki: ${scores.shoulderUS2 === 1 ? 'Tak (+1)' : 'Nie (0)'}

Wygenerowane przez DlaMedica.pl`;

    navigator.clipboard.writeText(resultText);
    alert('Wyniki skopiowane do schowka!');
  };

  const ToggleButton: React.FC<{
    label: string;
    points: number;
    isSelected: boolean;
    onClick: () => void;
  }> = ({ label, points, isSelected, onClick }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
        isSelected
          ? 'bg-green-500 text-white shadow-md'
          : darkMode
            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {label} {points > 0 && isSelected && `(+${points})`}
    </button>
  );

  return (
    <div className={`max-w-4xl mx-auto p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className={`${fontSizes.title} font-bold mb-2`}>
              Kryteria Klasyfikacyjne EULAR/ACR 2012 dla Polymyalgia Rheumatica
            </h1>
            <p className={`${fontSizes.subtitle} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Klasyfikuje polymyalgia rheumatica według rekomendacji ekspertów.
            </p>
          </div>
          <div className="flex items-center space-x-3 ml-4">
            <button
              onClick={toggleFavorite}
              className={`p-2 rounded-lg transition-colors ${
                isFavorite 
                  ? 'text-yellow-500 hover:text-yellow-600' 
                  : darkMode 
                    ? 'text-gray-400 hover:text-gray-300' 
                    : 'text-gray-500 hover:text-gray-600'
              }`}
            >
              <Star className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button className={`p-2 rounded-lg transition-colors ${
              darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'
            }`}>
              <Share2 className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className={`p-4 rounded-lg mb-6 ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-100 border border-gray-300'
        }`}>
          <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            To narzędzie należy stosować tylko u pacjentów którzy: mają ≥50 lat, prezentują obustronny ból barków i mają nieprawidłowe ESR i/lub CRP.
          </p>
        </div>

        {/* Expandable Sections */}
        <div className="space-y-3 mb-8">
          <div className={`border rounded-lg ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
            <button
              onClick={() => toggleSection('whenToUse')}
              className={`w-full px-4 py-3 text-left flex items-center justify-between ${
                darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
              }`}
            >
              <span className={`${fontSizes.text} font-medium`}>Kiedy używać</span>
              {expandedSections.whenToUse ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {expandedSections.whenToUse && (
              <div className={`px-4 pb-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
                  U pacjentów ≥50 lat z obustronnym bólem barków i podwyższonymi markerami stanu zapalnego.
                </p>
              </div>
            )}
          </div>

          <div className={`border rounded-lg ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
            <button
              onClick={() => toggleSection('pearlsPitfalls')}
              className={`w-full px-4 py-3 text-left flex items-center justify-between ${
                darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
              }`}
            >
              <span className={`${fontSizes.text} font-medium`}>Wskazówki/Pułapki</span>
              {expandedSections.pearlsPitfalls ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {expandedSections.pearlsPitfalls && (
              <div className={`px-4 pb-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
                  Kryteria służą do klasyfikacji, nie do diagnozy. Zawsze wykluczyć inne przyczyny.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Criterion 1: Morning Stiffness */}
          <div className={`p-6 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
            <h3 className={`${fontSizes.text} font-semibold mb-4`}>
              1. Czas trwania sztywności porannej
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <ToggleButton
                label="< 45 min"
                points={0}
                isSelected={scores.morningStiffness === 0}
                onClick={() => updateScore('morningStiffness', 0)}
              />
              <ToggleButton
                label="≥ 45 min"
                points={2}
                isSelected={scores.morningStiffness === 2}
                onClick={() => updateScore('morningStiffness', 2)}
              />
            </div>
          </div>

          {/* Criterion 2: Hip Pain */}
          <div className={`p-6 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
            <h3 className={`${fontSizes.text} font-semibold mb-4`}>
              2. Ból bioder lub ograniczony zakres ruchu
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <ToggleButton
                label="Nie"
                points={0}
                isSelected={scores.hipPain === 0}
                onClick={() => updateScore('hipPain', 0)}
              />
              <ToggleButton
                label="Tak"
                points={1}
                isSelected={scores.hipPain === 1}
                onClick={() => updateScore('hipPain', 1)}
              />
            </div>
          </div>

          {/* Criterion 3: RF or ACPA */}
          <div className={`p-6 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
            <h3 className={`${fontSizes.text} font-semibold mb-4`}>
              3. RF lub ACPA
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <ToggleButton
                label="Obecne"
                points={0}
                isSelected={scores.rfAcpa === 0}
                onClick={() => updateScore('rfAcpa', 0)}
              />
              <ToggleButton
                label="Nieobecne"
                points={2}
                isSelected={scores.rfAcpa === 2}
                onClick={() => updateScore('rfAcpa', 2)}
              />
            </div>
          </div>

          {/* Criterion 4: Other Joint Pain */}
          <div className={`p-6 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
            <h3 className={`${fontSizes.text} font-semibold mb-4`}>
              4. Inne bóle stawowe
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <ToggleButton
                label="Obecne"
                points={0}
                isSelected={scores.otherJointPain === 0}
                onClick={() => updateScore('otherJointPain', 0)}
              />
              <ToggleButton
                label="Nieobecne"
                points={1}
                isSelected={scores.otherJointPain === 1}
                onClick={() => updateScore('otherJointPain', 1)}
              />
            </div>
          </div>

          {/* Ultrasound Criteria */}
          <div className={`p-6 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
            <h3 className={`${fontSizes.text} font-semibold mb-4`}>
              Kryteria USG (opcjonalne)
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className={`${fontSizes.text} font-medium mb-3`}>
                  5. Co najmniej jeden bark z zapaleniem bursy poddeltoidalnej i/lub zapaleniem pochwy ścięgna bicepsa
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <ToggleButton
                    label="Nie"
                    points={0}
                    isSelected={scores.shoulderUS1 === 0}
                    onClick={() => updateScore('shoulderUS1', 0)}
                  />
                  <ToggleButton
                    label="Tak"
                    points={1}
                    isSelected={scores.shoulderUS1 === 1}
                    onClick={() => updateScore('shoulderUS1', 1)}
                  />
                </div>
              </div>

              <div>
                <h4 className={`${fontSizes.text} font-medium mb-3`}>
                  6. Oba barki z zapaleniem bursy poddeltoidalnej, zapaleniem pochwy ścięgna bicepsa
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <ToggleButton
                    label="Nie"
                    points={0}
                    isSelected={scores.shoulderUS2 === 0}
                    onClick={() => updateScore('shoulderUS2', 0)}
                  />
                  <ToggleButton
                    label="Tak"
                    points={1}
                    isSelected={scores.shoulderUS2 === 1}
                    onClick={() => updateScore('shoulderUS2', 1)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-1">
          <div className={`sticky top-6 p-6 rounded-lg border ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
          }`}>
            <div className="text-center mb-6">
              <div className={`${fontSizes.score} font-bold text-[#38b6ff] mb-2`}>
                {totalScore}
              </div>
              <div className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                punktów
              </div>
            </div>

            <div className={`p-4 rounded-lg border-2 ${result.bgColor} ${
              darkMode ? 'bg-gray-700' : ''
            }`}>
              <div className={`${fontSizes.text} font-semibold ${result.color} ${
                darkMode ? 'text-gray-200' : ''
              } text-center`}>
                {result.text}
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={copyResults}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
              >
                <Copy className="w-4 h-4" />
                <span>Kopiuj Wyniki</span>
              </button>
              
              <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2">
                <ArrowRight className="w-4 h-4" />
                <span>Następne Kroki</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolymyalgiaRheumaticaCalculator;