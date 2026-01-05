import React, { useState } from 'react';
import { ArrowLeft, Baby, AlertTriangle, CheckCircle, RotateCcw, Clock, Heart } from 'lucide-react';

interface ApgarCategory {
  id: string;
  name: string;
  criteria: ApgarCriteria[];
}

interface ApgarCriteria {
  score: number;
  description: string;
}

interface ApgarTimeScore {
  minute: number;
  scores: Record<string, number>;
  totalScore: number;
}

interface ApgarResult {
  timeScores: ApgarTimeScore[];
  interpretation: string[];
  recommendations: string[];
  clinicalSignificance: string;
  followUp: string[];
  color: string;
}

const ApgarCalculator: React.FC = () => {  const [selectedTimes, setSelectedTimes] = useState<Set<number>>(new Set([1, 5]));
  const [scores, setScores] = useState<Record<string, Record<string, number>>>({
    '1': { heartRate: 0, respiration: 0, muscleTone: 0, reflexes: 0, color: 0 },
    '5': { heartRate: 0, respiration: 0, muscleTone: 0, reflexes: 0, color: 0 },
    '10': { heartRate: 0, respiration: 0, muscleTone: 0, reflexes: 0, color: 0 }
  });
  const [result, setResult] = useState<ApgarResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const apgarCategories: ApgarCategory[] = [
    {
      id: 'heartRate',
      name: 'Częstość akcji serca',
      criteria: [
        { score: 2, description: '>100/min - rytm prawidłowy' },
        { score: 1, description: '<100/min - bradykardia' },
        { score: 0, description: 'Brak akcji serca - asystolia' }
      ]
    },
    {
      id: 'respiration',
      name: 'Oddech',
      criteria: [
        { score: 2, description: 'Dobry, regularny, głośny płacz' },
        { score: 1, description: 'Słaby płacz, nieregularny oddech' },
        { score: 0, description: 'Brak oddechu - bezdechy' }
      ]
    },
    {
      id: 'muscleTone',
      name: 'Napięcie mięśniowe',
      criteria: [
        { score: 2, description: 'Aktywne ruchy, dobre napięcie mięśniowe' },
        { score: 1, description: 'Słabe napięcie, niewielka aktywność' },
        { score: 0, description: 'Wiotkie, brak napięcia mięśniowego' }
      ]
    },
    {
      id: 'reflexes',
      name: 'Drażliwość odruchowa',
      criteria: [
        { score: 2, description: 'Energiczna odpowiedź, kichanie, kaszel, cofanie' },
        { score: 1, description: 'Słaba odpowiedź, grymas' },
        { score: 0, description: 'Brak odpowiedzi na bodźce' }
      ]
    },
    {
      id: 'color',
      name: 'Zabarwienie skóry',
      criteria: [
        { score: 2, description: 'Różowe ciało i kończyny' },
        { score: 1, description: 'Różowe ciało, sinawe kończyny (akrocjanoza)' },
        { score: 0, description: 'Sinawe/blade całe ciało (cjanoza centralna)' }
      ]
    }
  ];

  const getResult = (timeScores: ApgarTimeScore[]): ApgarResult => {
    const interpretations: string[] = [];
    const recommendations: string[] = [];
    let clinicalSignificance = '';
    let followUp: string[] = [];
    let color = 'green';

    timeScores.forEach(timeScore => {
      const { minute, totalScore } = timeScore;
      
      if (totalScore >= 8) {
        interpretations.push(`${minute} min: ${totalScore}/10 - Stan dobry`);
        if (minute === 1) {
          recommendations.push('Rutynowa opieka noworodka');
          recommendations.push('Osuszenie i utrzymanie ciepłoty');
          recommendations.push('Kontakt skóra do skóry z matką');
        }
      } else if (totalScore >= 4) {
        interpretations.push(`${minute} min: ${totalScore}/10 - Stan średni`);
        recommendations.push('Stymulacja delikatna (osuszenie, pozycjonowanie)');
        recommendations.push('Podanie tlenu w razie potrzeby');
        recommendations.push('Monitorowanie częstości akcji serca');
        recommendations.push('Przygotowanie do ewentualnej reanimacji');
        if (color === 'green') color = 'orange';
      } else {
        interpretations.push(`${minute} min: ${totalScore}/10 - Stan ciężki`);
        recommendations.push('NATYCHMIASTOWA reanimacja noworodka');
        recommendations.push('Wentylacja ciśnieniowo-dodatnia (IPPV)');
        recommendations.push('Masaż serca jeśli HR <60/min');
        recommendations.push('Intubacja jeśli wskazana');
        recommendations.push('Leki reanimacyjne (adrenalina, płyny)');
        color = 'red';
      }
    });

    // Clinical significance based on pattern
    const minute1 = timeScores.find(t => t.minute === 1)?.totalScore || 0;
    const minute5 = timeScores.find(t => t.minute === 5)?.totalScore || 0;
    const minute10 = timeScores.find(t => t.minute === 10);

    if (minute1 >= 8 && minute5 >= 8) {
      clinicalSignificance = 'Doskonała adaptacja do życia pozamacicznego. Ryzyko powikłań minimalne.';
      followUp = [
        'Standardowa opieka noworodkowa',
        'Karmienie piersią w pierwszej godzinie życia',
        'Monitorowanie rutynowe',
        'Profilaktyka witaminą K1'
      ];
    } else if (minute1 < 7 && minute5 >= 8) {
      clinicalSignificance = 'Prawidłowa adaptacja pomimo początkowych trudności. Dobre rokowanie.';
      followUp = [
        'Wzmożona obserwacja przez pierwsze 24h',
        'Monitorowanie funkcji oddechowej',
        'Ocena neurologiczna',
        'Kontrola saturacji'
      ];
    } else if (minute5 < 7) {
      clinicalSignificance = 'Zaburzona adaptacja. Zwiększone ryzyko powikłań neurologicznych i oddechowych.';
      followUp = [
        'Intensywne monitorowanie',
        'Konsultacja neonatologiczna',
        'Badania dodatkowe (gazometria, RTG)',
        'Rozważenie hospitalizacji na OITN',
        'Długoterminowe monitorowanie rozwoju'
      ];
    }

    if (minute10 && minute10.totalScore < 7) {
      clinicalSignificance += ' Wynik w 10. minucie <7 pkt wiąże się ze zwiększonym ryzykiem powikłań neurologicznych.';
      followUp.push('Konsultacja neurologiczna');
      followUp.push('MRI mózgu w przypadku objawów neurologicznych');
    }

    return {
      timeScores,
      interpretation: interpretations,
      recommendations: Array.from(new Set(recommendations)),
      clinicalSignificance,
      followUp,
      color
    };
  };

  const handleTimeToggle = (minute: number) => {
    const newSelected = new Set(selectedTimes);
    if (newSelected.has(minute)) {
      if (newSelected.size > 1) { // Zawsze przynajmniej jeden czas
        newSelected.delete(minute);
      }
    } else {
      newSelected.add(minute);
    }
    setSelectedTimes(newSelected);
  };

  const handleScoreChange = (minute: number, category: string, score: number) => {
    setScores(prev => ({
      ...prev,
      [minute]: {
        ...prev[minute],
        [category]: score
      }
    }));
  };

  const handleCalculate = () => {
    const timeScores: ApgarTimeScore[] = Array.from(selectedTimes)
      .sort((a, b) => a - b)
      .map(minute => {
        const minuteScores = scores[minute];
        const totalScore = Object.values(minuteScores).reduce((sum, score) => sum + score, 0);
        
        return {
          minute,
          scores: minuteScores,
          totalScore
        };
      });

    const calculatedResult = getResult(timeScores);
    setResult(calculatedResult);
    setShowResult(true);
  };

  const handleReset = () => {
    setSelectedTimes(new Set([1, 5]));
    setScores({
      '1': { heartRate: 0, respiration: 0, muscleTone: 0, reflexes: 0, color: 0 },
      '5': { heartRate: 0, respiration: 0, muscleTone: 0, reflexes: 0, color: 0 },
      '10': { heartRate: 0, respiration: 0, muscleTone: 0, reflexes: 0, color: 0 }
    });
    setResult(null);
    setShowResult(false);
  };

  const getScoreColor = (totalScore: number) => {
    if (totalScore >= 8) return 'text-green-600 bg-green-50 border-green-200';
    if (totalScore >= 4) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const allRequiredScoresCompleted = Array.from(selectedTimes).every(minute => {
    const minuteScores = scores[minute];
    return Object.values(minuteScores).every(score => score !== undefined);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-pink-100">
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
                <div className="p-2 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full">
                  <Baby className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                Skala Apgar
              </h1>
              <p className="text-gray-600 text-sm">
                Apgar Score - Ocena stanu noworodka
              </p>
            </div>
            <div className="w-32"></div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info and Time Selection */}
          <div className="space-y-6">
            {/* Info Card */}
            <div className="bg-white rounded-xl shadow-md border border-pink-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Informacje o skali
              </h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p><strong>Zastosowanie:</strong> Ocena stanu klinicznego noworodka w pierwszych minutach życia</p>
                <p><strong>Cel:</strong> Szybka ocena adaptacji noworodka do życia pozamacicznego</p>
                <p><strong>Pomiary:</strong> Standardowo 1. i 5. minuta, opcjonalnie 10. minuta</p>
                <p><strong>Zakres:</strong> 0-10 punktów w każdym pomiarze</p>
              </div>
            </div>

            {/* Time Selection */}
            <div className="bg-white rounded-xl shadow-md border border-pink-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Wybierz czasy pomiarów:
              </h3>
              <div className="space-y-2">
                {[1, 5, 10].map(minute => (
                  <label
                    key={minute}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedTimes.has(minute)
                        ? 'border-pink-300 bg-pink-50 shadow-sm'
                        : 'border-gray-200 hover:border-pink-200 hover:bg-pink-25'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedTimes.has(minute)}
                      onChange={() => handleTimeToggle(minute)}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                    />
                    <Clock className="w-4 h-4 ml-2 mr-2 text-pink-600" />
                    <span className="text-sm font-medium text-gray-900">
                      {minute} minuta życia {minute === 10 ? '(opcjonalnie)' : '(standardowo)'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Current Scores */}
            <div className="bg-white rounded-xl shadow-md border border-pink-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Aktualne wyniki:
              </h3>
              <div className="space-y-2">
                {Array.from(selectedTimes).sort().map(minute => {
                  const totalScore = Object.values(scores[minute]).reduce((sum, score) => sum + score, 0);
                  return (
                    <div key={minute} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">{minute} min:</span>
                      <span className="font-bold text-gray-900">{totalScore}/10</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Calculator */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-md border border-pink-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Oceń noworodka w każdej kategorii:
              </h3>
              
              {Array.from(selectedTimes).sort().map(minute => (
                <div key={minute} className="mb-8">
                  <div className="flex items-center mb-4">
                    <Clock className="w-5 h-5 text-pink-600 mr-2" />
                    <h4 className="text-lg font-semibold text-pink-700">
                      {minute} minuta życia
                    </h4>
                  </div>
                  
                  {apgarCategories.map((category) => (
                    <div key={`${minute}-${category.id}`} className="mb-6">
                      <h5 className="text-md font-semibold text-gray-800 mb-2">
                        {category.name}:
                      </h5>
                      <div className="space-y-2">
                        {category.criteria.map((criteria) => (
                          <label
                            key={`${minute}-${category.id}-${criteria.score}`}
                            className={`block p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                              scores[minute][category.id] === criteria.score
                                ? 'border-pink-300 bg-pink-50 shadow-sm'
                                : 'border-gray-200 hover:border-pink-200 hover:bg-pink-25'
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <input
                                type="radio"
                                name={`${minute}-${category.id}`}
                                value={criteria.score}
                                checked={scores[minute][category.id] === criteria.score}
                                onChange={(e) => handleScoreChange(minute, category.id, parseInt(e.target.value))}
                                className="mt-1 h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                              />
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-gray-900 text-sm">
                                    {criteria.score} punkt{criteria.score !== 1 ? (criteria.score >= 2 ? 'y' : 'ów') : ''}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-600 mt-1">{criteria.description}</div>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Wynik {minute} min:</span>
                      <span className="text-lg font-bold text-gray-900">
                        {Object.values(scores[minute]).reduce((sum, score) => sum + score, 0)}/10
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handleCalculate}
                  disabled={!allRequiredScoresCompleted}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    allRequiredScoresCompleted
                      ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:from-pink-600 hover:to-rose-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle className="w-5 h-5 inline mr-2" />
                  Oceń stan noworodka
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
        </div>

        {/* Results */}
        {showResult && result && (
          <div className="mt-8">
            <div className="bg-white rounded-xl shadow-lg border-2 border-pink-200 p-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Wyniki Skali Apgar
                </h3>
                <div className="flex justify-center space-x-4 mb-4">
                  {result.timeScores.map((timeScore, index) => (
                    <div key={index} className={`px-4 py-2 rounded-full text-sm font-semibold border ${getScoreColor(timeScore.totalScore)}`}>
                      {timeScore.minute} min: {timeScore.totalScore}/10
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Interpretacja:</h4>
                  <ul className="space-y-2">
                    {result.interpretation.map((interp, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Heart className="w-4 h-4 text-pink-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{interp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
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
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Znaczenie kliniczne:</h4>
                <p className="text-gray-700 text-sm">{result.clinicalSignificance}</p>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Dalsze postępowanie:</h4>
                <ul className="space-y-2">
                  {result.followUp.map((followUp, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Baby className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{followUp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {result.timeScores.some(t => t.totalScore < 4) && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-red-800 mb-1">
                        UWAGA: Stan krytyczny noworodka!
                      </p>
                      <p className="text-xs text-red-700">
                        Wynik &lt;4 punkty wskazuje na konieczność natychmiastowej reanimacji noworodka zgodnie z algorytmami NRP.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApgarCalculator;