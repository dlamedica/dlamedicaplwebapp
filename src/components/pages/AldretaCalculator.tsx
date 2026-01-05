import React, { useState } from 'react';
import { ArrowLeft, Thermometer, AlertTriangle, CheckCircle, RotateCcw, Activity, Gauge } from 'lucide-react';

interface AldretaCategory {
  category: string;
  parameters: AldretaParameter[];
}

interface AldretaParameter {
  score: number;
  description: string;
}

interface AldretaResult {
  totalScore: number;
  readiness: 'not_ready' | 'requires_monitoring' | 'ready';
  interpretation: string;
  recommendations: string[];
  monitoringRequirements: string[];
  dischargeRequirements: string[];
  color: string;
}

const AldretaCalculator: React.FC = () => {  const [scores, setScores] = useState<Record<string, number>>({
    activity: 0,
    respiration: 0,
    circulation: 0,
    consciousness: 0,
    oxygen: 0
  });
  const [result, setResult] = useState<AldretaResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const aldretaCategories: AldretaCategory[] = [
    {
      category: 'Aktywność ruchowa',
      parameters: [
        {
          score: 2,
          description: 'Porusza wszystkimi kończynami dobrowolnie lub na polecenie'
        },
        {
          score: 1,
          description: 'Porusza 2 kończynami dobrowolnie lub na polecenie'
        },
        {
          score: 0,
          description: 'Nie porusza żadną kończyną dobrowolnie lub na polecenie'
        }
      ]
    },
    {
      category: 'Oddychanie',
      parameters: [
        {
          score: 2,
          description: 'Oddycha głęboko i kaszel swobodnie'
        },
        {
          score: 1,
          description: 'Duszność lub ograniczone oddychanie'
        },
        {
          score: 0,
          description: 'Bezdechy lub wymaga wspomagania oddychania'
        }
      ]
    },
    {
      category: 'Krążenie (ciśnienie tętnicze)',
      parameters: [
        {
          score: 2,
          description: 'BP ±20 mmHg od wartości przedoperacyjnej'
        },
        {
          score: 1,
          description: 'BP ±20-50 mmHg od wartości przedoperacyjnej'
        },
        {
          score: 0,
          description: 'BP ±50 mmHg od wartości przedoperacyjnej'
        }
      ]
    },
    {
      category: 'Świadomość',
      parameters: [
        {
          score: 2,
          description: 'Całkowicie przytomny, odpowiada na pytania'
        },
        {
          score: 1,
          description: 'Budzi się na wołanie'
        },
        {
          score: 0,
          description: 'Nie odpowiada na bodźce'
        }
      ]
    },
    {
      category: 'Saturacja O₂',
      parameters: [
        {
          score: 2,
          description: 'SpO₂ >92% na powietrzu atmosferycznym'
        },
        {
          score: 1,
          description: 'Wymaga suplementacji O₂ dla utrzymania SpO₂ >90%'
        },
        {
          score: 0,
          description: 'SpO₂ <90% mimo suplementacji O₂'
        }
      ]
    }
  ];

  const getResult = (totalScore: number): AldretaResult => {
    if (totalScore >= 9) {
      return {
        totalScore,
        readiness: 'ready',
        interpretation: 'Pacjent gotowy do wypisu z pooperacyjnej sali wybudzeniowej',
        recommendations: [
          'Pacjent może być przeniesiony na oddział',
          'Kontynuacja standardowej opieki pooperacyjnej',
          'Monitorowanie podstawowych funkcji życiowych',
          'Ocena bólu i podawanie leków przeciwbólowych wg potrzeb',
          'Mobilizacja zgodnie z protokołem pooperacyjnym',
          'Informowanie pacjenta o dalszym postępowaniu'
        ],
        monitoringRequirements: [
          'Standardowe monitorowanie pooperacyjne na oddziale',
          'Kontrole podstawowych funkcji życiowych co 2-4h',
          'Ocena stanu rany operacyjnej',
          'Monitorowanie objawów powikłań pooperacyjnych'
        ],
        dischargeRequirements: [
          'Wszystkie parametry w normie przez minimum 30 minut',
          'Brak objawów powikłań pooperacyjnych',
          'Pacjent świadomy i zorientowany',
          'Stabilne funkcje życiowe'
        ],
        color: 'green'
      };
    } else if (totalScore >= 8) {
      return {
        totalScore,
        readiness: 'requires_monitoring',
        interpretation: 'Pacjent wymaga dodatkowego monitorowania przed wypusem',
        recommendations: [
          'Kontynuacja opieki w sali wybudzeniowej',
          'Częstsze kontrole parametrów życiowych',
          'Identyfikacja i leczenie przyczyn obniżonego wyniku',
          'Optymalizacja leczenia objawowego',
          'Ponowna ocena po 15-30 minutach',
          'Rozważenie konsultacji anestezjologa'
        ],
        monitoringRequirements: [
          'Ciągłe monitorowanie w sali wybudzeniowej',
          'Kontrole co 15-30 minut',
          'Monitorowanie saturacji, BP, HR, RR',
          'Ocena stanu świadomości',
          'Obserwacja objawów powikłań'
        ],
        dischargeRequirements: [
          'Osiągnięcie minimum 9 punktów w skali Aldreta',
          'Stabilne parametry przez minimum 1 godzinę',
          'Brak objawów niewydolności oddechowej',
          'Przywrócenie odpowiedniej perfuzji'
        ],
        color: 'orange'
      };
    } else {
      return {
        totalScore,
        readiness: 'not_ready',
        interpretation: 'Pacjent nie jest gotowy do wypisu z sali wybudzeniowej',
        recommendations: [
          'PRZEDŁUŻENIE pobytu w sali wybudzeniowej',
          'Intensywne monitorowanie i leczenie wspomagające',
          'Natychmiastowa ocena przyczyn niskiego wyniku',
          'Pilna konsultacja anestezjologa',
          'Rozważenie powrotu do sali operacyjnej w przypadkach krytycznych',
          'Leczenie powikłań pooperacyjnych',
          'Wsparcie funkcji życiowych'
        ],
        monitoringRequirements: [
          'Intensywne ciągłe monitorowanie',
          'Kontrole co 5-15 minut',
          'Monitorowanie EKG, SpO₂, BP, HR',
          'Ocena gazometrii arterialnej',
          'Monitorowanie diurezy',
          'Obserwacja objawów neurologicznych'
        ],
        dischargeRequirements: [
          'Znaczna poprawa stanu klinicznego',
          'Osiągnięcie minimum 8-9 punktów',
          'Stabilne parametry życiowe',
          'Wykluczenie poważnych powikłań pooperacyjnych',
          'Decyzja anestezjologa o możliwości przeniesienia'
        ],
        color: 'red'
      };
    }
  };

  const handleScoreChange = (category: string, score: number) => {
    setScores(prev => ({
      ...prev,
      [category]: score
    }));
  };

  const handleCalculate = () => {
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const calculatedResult = getResult(totalScore);
    setResult(calculatedResult);
    setShowResult(true);
  };

  const handleReset = () => {
    setScores({
      activity: 0,
      respiration: 0,
      circulation: 0,
      consciousness: 0,
      oxygen: 0
    });
    setResult(null);
    setShowResult(false);
  };

  const getReadinessColor = (readiness: string) => {
    const colors = {
      'ready': 'text-green-600 bg-green-50 border-green-200',
      'requires_monitoring': 'text-orange-600 bg-orange-50 border-orange-200',
      'not_ready': 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[readiness as keyof typeof colors] || colors.not_ready;
  };

  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const categoryKeys = ['activity', 'respiration', 'circulation', 'consciousness', 'oxygen'];
  const allCategoriesCompleted = categoryKeys.every(key => scores[key] !== undefined);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-cyan-100">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                window.history.pushState({}, '', '/kalkulatory');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Powrót do kalkulatorów
            </button>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <div className="p-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full">
                  <Thermometer className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Skala Aldreta
              </h1>
              <p className="text-gray-600 text-sm">
                Aldrete Post-Anesthesia Recovery Score
              </p>
            </div>
            <div className="w-32"></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator */}
          <div className="space-y-6">
            {/* Info Card */}
            <div className="bg-white rounded-xl shadow-md border border-cyan-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Informacje o skali
              </h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p><strong>Zastosowanie:</strong> Ocena gotowości pacjenta do wypisu z sali wybudzeniowej</p>
                <p><strong>Cel:</strong> Ocena stanu pooperacyjnego po anestezji ogólnej lub znieczuleniu regionalnym</p>
                <p><strong>Zakres:</strong> 0-10 punktów (≥9 = gotowy do wypisu)</p>
                <p><strong>Częstość oceny:</strong> Co 15-30 minut w okresie pooperacyjnym</p>
              </div>
            </div>

            {/* Current Score Display */}
            {allCategoriesCompleted && (
              <div className="bg-white rounded-xl shadow-md border border-cyan-100 p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {totalScore}/10
                  </div>
                  <div className="text-sm text-gray-600">
                    Aktualny wynik w skali Aldreta
                  </div>
                </div>
              </div>
            )}

            {/* Calculator Form */}
            <div className="bg-white rounded-xl shadow-md border border-cyan-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Oceń pacjenta w każdej kategorii:
              </h3>
              
              {aldretaCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="mb-6">
                  <h4 className="text-md font-semibold text-cyan-700 mb-3">
                    {category.category}:
                  </h4>
                  <div className="space-y-2">
                    {category.parameters.map((parameter) => (
                      <label
                        key={parameter.score}
                        className={`block p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                          scores[categoryKeys[categoryIndex]] === parameter.score
                            ? 'border-cyan-300 bg-cyan-50 shadow-sm'
                            : 'border-gray-200 hover:border-cyan-200 hover:bg-cyan-25'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <input
                            type="radio"
                            name={categoryKeys[categoryIndex]}
                            value={parameter.score}
                            checked={scores[categoryKeys[categoryIndex]] === parameter.score}
                            onChange={(e) => handleScoreChange(categoryKeys[categoryIndex], parseInt(e.target.value))}
                            className="mt-1 h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 text-sm">
                              {parameter.score} punkt{parameter.score !== 1 ? (parameter.score >= 2 && parameter.score <= 4 ? 'y' : 'ów') : ''}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">{parameter.description}</div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handleCalculate}
                  disabled={!allCategoriesCompleted}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    allCategoriesCompleted
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle className="w-5 h-5 inline mr-2" />
                  Oceń gotowość do wypisu
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <RotateCcw className="w-5 h-5 inline mr-2" />
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {showResult && result && (
              <>
                {/* Result Card */}
                <div className={`bg-white rounded-xl shadow-lg border-2 p-6 ${
                  result.color === 'green' ? 'border-green-200' :
                  result.color === 'orange' ? 'border-orange-200' :
                  result.color === 'red' ? 'border-red-200' :
                  'border-gray-200'
                }`}>
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Skala Aldreta: {result.totalScore}/10
                    </h3>
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getReadinessColor(result.readiness)}`}>
                      <span className="mr-2">
                        {result.readiness === 'ready' && '✅'}
                        {result.readiness === 'requires_monitoring' && '⚠️'}
                        {result.readiness === 'not_ready' && '🚨'}
                      </span>
                      {result.readiness === 'ready' ? 'Gotowy do wypisu' :
                       result.readiness === 'requires_monitoring' ? 'Wymaga monitorowania' :
                       'Nie gotowy do wypisu'}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Interpretacja:</h4>
                    <p className="text-gray-700 text-sm">{result.interpretation}</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Zalecenia:</h4>
                    <ul className="space-y-2">
                      {result.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Monitorowanie:</h4>
                    <ul className="space-y-2">
                      {result.monitoringRequirements.map((requirement, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Activity className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {result.readiness === 'not_ready' && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-red-800 mb-1">
                            UWAGA: Pacjent nie jest gotowy do wypisu!
                          </p>
                          <p className="text-xs text-red-700">
                            Wynik &lt;8 punktów wskazuje na konieczność przedłużenia pobytu w sali wybudzeniowej i intensywnego monitorowania.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  
                </div>
              </>
            )}

            {!showResult && (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 text-center">
                <Gauge className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Skala Aldreta
                </h3>
                <p className="text-gray-500 mb-4">
                  Oceń wszystkie kategorie i kliknij "Oceń gotowość do wypisu"
                </p>
                <div className="text-sm text-gray-600">
                  Aktualny wynik: {totalScore}/10 punktów
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AldretaCalculator;