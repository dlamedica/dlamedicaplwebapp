import React, { useState } from 'react';
import { ArrowLeft, Activity, AlertTriangle, CheckCircle, RotateCcw, Heart, Stethoscope, Shield } from 'lucide-react';

interface ChildPughParameter {
  id: string;
  name: string;
  options: ChildPughOption[];
}

interface ChildPughOption {
  points: number;
  description: string;
  details: string;
  range: string;
}

interface ChildPughResult {
  scores: Record<string, number>;
  totalScore: number;
  maxScore: number;
  childClass: 'A' | 'B' | 'C';
  interpretation: string;
  oneYearSurvival: string;
  twoYearSurvival: string;
  prognosis: string;
  recommendations: string[];
  monitoring: string[];
  treatmentOptions: string[];
  contraindications: string[];
  followUp: string[];
  color: string;
}

const ChildPughCalculator: React.FC = () => {
  const [scores, setScores] = useState<Record<string, number>>({
    bilirubin: 0,
    albumin: 0,
    inr: 0,
    ascites: 0,
    encephalopathy: 0
  });
  const [result, setResult] = useState<ChildPughResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const childPughParameters: ChildPughParameter[] = [
    {
      id: 'bilirubin',
      name: 'Bilirubina całkowita',
      options: [
        { points: 1, description: '<2 mg/dl', details: 'Prawidłowy poziom bilirubiny', range: '<34 μmol/l' },
        { points: 2, description: '2-3 mg/dl', details: 'Umiarkowanie podwyższona bilirubina', range: '34-51 μmol/l' },
        { points: 3, description: '>3 mg/dl', details: 'Znacznie podwyższona bilirubina', range: '>51 μmol/l' }
      ]
    },
    {
      id: 'albumin',
      name: 'Albumina',
      options: [
        { points: 1, description: '>3,5 g/dl', details: 'Prawidłowy poziom albuminy', range: '>35 g/l' },
        { points: 2, description: '2,8-3,5 g/dl', details: 'Umiarkowanie obniżona albumina', range: '28-35 g/l' },
        { points: 3, description: '<2,8 g/dl', details: 'Znacznie obniżona albumina', range: '<28 g/l' }
      ]
    },
    {
      id: 'inr',
      name: 'INR (International Normalized Ratio)',
      options: [
        { points: 1, description: '<1,7', details: 'Prawidłowa krzepliwość', range: 'Norma' },
        { points: 2, description: '1,7-2,3', details: 'Umiarkowanie zaburzona krzepliwość', range: 'Umiarkowana koagulopatia' },
        { points: 3, description: '>2,3', details: 'Znacznie zaburzona krzepliwość', range: 'Ciężka koagulopatia' }
      ]
    },
    {
      id: 'ascites',
      name: 'Wodobrzusze',
      options: [
        { points: 1, description: 'Brak', details: 'Brak płynu w jamie brzusznej', range: 'Bez objawów' },
        { points: 2, description: 'Łagodne', details: 'Kontrolowane farmakologicznie', range: 'Odpowiada na diuretyki' },
        { points: 3, description: 'Nasilone', details: 'Oporne na leczenie farmakologiczne', range: 'Wymaga paracentezy' }
      ]
    },
    {
      id: 'encephalopathy',
      name: 'Encefalopatia wątrobowa',
      options: [
        { points: 1, description: 'Brak', details: 'Prawidłowy stan świadomości', range: 'Bez objawów neurologicznych' },
        { points: 2, description: 'Stopień 1-2', details: 'Łagodna do umiarkowanej', range: 'Dezorientacja, senność' },
        { points: 3, description: 'Stopień 3-4', details: 'Ciężka encefalopatia', range: 'Stupor, śpiączka' }
      ]
    }
  ];

  const getResult = (scores: Record<string, number>): ChildPughResult => {
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    
    let childClass: 'A' | 'B' | 'C';
    let interpretation: string;
    let oneYearSurvival: string;
    let twoYearSurvival: string;
    let prognosis: string;
    let color: string;
    let recommendations: string[];
    let monitoring: string[];
    let treatmentOptions: string[];
    let contraindications: string[];
    let followUp: string[];

    if (totalScore <= 6) {
      childClass = 'A';
      interpretation = 'Klasa A - Funkcja wątroby dobrze zachowana';
      oneYearSurvival = '100%';
      twoYearSurvival = '85%';
      prognosis = 'Doskonałe rokowanie. Kompensowana marskość wątroby.';
      color = 'green';
      recommendations = [
        'Regularne kontrole funkcji wątroby co 6 miesięcy',
        'Eliminacja alkoholu i hepatotoksycznych leków',
        'Szczepienia przeciw HAV, HBV, grypie',
        'Kontrola przyczyn marskości (leczenie HCV, HBV)',
        'Zdrowa dieta, aktywność fizyczna',
        'Obserwacja pod kątem powikłań (żylaki przełyku)'
      ];
      monitoring = [
        'ALT, AST, GGTP co 3-6 miesięcy',
        'Gastroskopia co 2-3 lata (żylaki przełyku)',
        'USG jamy brzusznej co 6 miesięcy',
        'AFP (alfa-fetoproteina) co 6 miesięcy',
        'Pełna morfologia, koagulogram'
      ];
      treatmentOptions = [
        'Leczenie przyczynowe marskości',
        'Beta-blokery przy żylakach przełyku (propranolol)',
        'Profilaktyka SBP przy wodobrzuszu',
        'Suplementacja witamin rozpuszczalnych w tłuszczach',
        'Laktuloza przy subklinicznej encefalopatii'
      ];
      contraindications = [
        'Hepatotoksyczne leki (paracetamol >2g/dzień)',
        'Alkohol bezwzględnie',
        'NSAIDs przy wodobrzuszu',
        'Sedacja bez wskazań'
      ];
    } else if (totalScore <= 9) {
      childClass = 'B';
      interpretation = 'Klasa B - Umiarkowana dysfunkcja wątroby';
      oneYearSurvival = '81%';
      twoYearSurvival = '57%';
      prognosis = 'Umiarkowane rokowanie. Dekompensowana marskość wątroby.';
      color = 'orange';
      recommendations = [
        'Częstsze kontrole funkcji wątroby co 3 miesiące',
        'PILNA eliminacja wszystkich czynników hepatotoksycznych',
        'Przygotowanie do transplantacji wątroby',
        'Leczenie powikłań marskości',
        'Ścisłe monitorowanie stanu klinicznego',
        'Kompleksowa opieka hepatologiczna'
      ];
      monitoring = [
        'Parametry wątrobowe co 1-3 miesiące',
        'Gastroskopia co 12-24 miesiące',
        'USG + badania obrazowe co 3-6 miesięcy',
        'AFP co 3-6 miesięcy',
        'Ocena stanu odżywienia',
        'Monitorowanie powikłań'
      ];
      treatmentOptions = [
        'Intensywne leczenie przyczynowe',
        'Leczenie wodobrzusza (diuretyki, paracenteza)',
        'Profilaktyka krwawienia z żylaków',
        'Leczenie encefalopatii wątrobowej',
        'Kwalifikacja do transplantacji',
        'TIPS przy opornym wodobrzuszu'
      ];
      contraindications = [
        'Wszystkie hepatotoksyczne substancje',
        'Leki nefrotoksyczne',
        'Nadmierne ograniczenie sodu (<2g/dzień)',
        'Sedatywne bez monitowania'
      ];
    } else {
      childClass = 'C';
      interpretation = 'Klasa C - Zaawansowana dysfunkcja wątroby';
      oneYearSurvival = '45%';
      twoYearSurvival = '35%';
      prognosis = 'Poważne rokowanie. Dekompensowana marskość z wielonarządową dysfunkcją.';
      color = 'red';
      recommendations = [
        'PILNA kompleksowa opieka hepatologiczna',
        'NATYCHMIASTOWA kwalifikacja do transplantacji',
        'Intensywne leczenie powikłań marskości',
        'Wsparcie żywieniowe i metaboliczne',
        'Przygotowanie do leczenia paliatywnego',
        'Opieka psychoonkologiczna dla pacjenta i rodziny'
      ];
      monitoring = [
        'Parametry wątrobowe co 2-4 tygodnie',
        'Monitoring ciągły w warunkach szpitalnych',
        'Ocena powikłań wielonarządowych',
        'Monitorowanie infekcji',
        'Kontrola stanu odżywienia',
        'Ocena jakości życia'
      ];
      treatmentOptions = [
        'PILNE przygotowanie do HTx (transplantacja)',
        'Paracenteza przy nasilonym wodobrzuszu',
        'Leczenie krwawień z żylaków (band ligation)',
        'Intensywne leczenie encefalopatii',
        'Leczenie infekcji (SBP, inne)',
        'Wsparcie żywieniowe (białko, witaminy)',
        'Leczenie objawowe powikłań'
      ];
      contraindications = [
        'Wszelkie hepatotoksyczne substancje',
        'Paracetamol >1g/dzień',
        'Nadmierne ograniczenie płynów',
        'Leki o wąskim indeksie terapeutycznym'
      ];
    }

    followUp = [
      `Kontrole hepatologiczne co ${childClass === 'A' ? '6' : childClass === 'B' ? '3' : '1-2'} miesiące`,
      'Monitorowanie parametrów laboratoryjnych',
      'Badania obrazowe kontrolne',
      'Ocena funkcjonalna i jakość życia',
      'Edukacja pacjenta i rodziny',
      childClass !== 'A' ? 'Rozważenie transplantacji wątroby' : 'Profilaktyka powikłań'
    ];

    return {
      scores,
      totalScore,
      maxScore: 15,
      childClass,
      interpretation,
      oneYearSurvival,
      twoYearSurvival,
      prognosis,
      recommendations,
      monitoring,
      treatmentOptions,
      contraindications,
      followUp,
      color
    };
  };

  const handleScoreChange = (parameterId: string, points: number) => {
    setScores(prev => ({
      ...prev,
      [parameterId]: points
    }));
  };

  const handleCalculate = () => {
    const calculatedResult = getResult(scores);
    setResult(calculatedResult);
    setShowResult(true);
  };

  const handleReset = () => {
    setScores({
      bilirubin: 0,
      albumin: 0,
      inr: 0,
      ascites: 0,
      encephalopathy: 0
    });
    setResult(null);
    setShowResult(false);
  };

  const getClassColor = (childClass: string) => {
    const colors = {
      'A': 'text-green-600 bg-green-50 border-green-200',
      'B': 'text-orange-600 bg-orange-50 border-orange-200',
      'C': 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[childClass as keyof typeof colors] || colors.A;
  };

  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const allParametersCompleted = Object.values(scores).every(score => score > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-amber-100">
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
                <div className="p-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full">
                  <Activity className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Skala Child-Pugha
              </h1>
              <p className="text-gray-600 text-sm">
                Child-Pugh Score - Ocena funkcji wątroby
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
            <div className="bg-white rounded-xl shadow-md border border-amber-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Informacje o skali
              </h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p><strong>Zastosowanie:</strong> Ocena funkcji wątroby u pacjentów z marskością</p>
                <p><strong>Parametry:</strong> 5 parametrów klinicznych i laboratoryjnych</p>
                <p><strong>Zakres:</strong> 5-15 punktów (Klasy A, B, C)</p>
                <p><strong>Znaczenie:</strong> Rokowanie i kwalifikacja do transplantacji</p>
              </div>
            </div>

            {/* Current Score Display */}
            {allParametersCompleted && (
              <div className="bg-white rounded-xl shadow-md border border-amber-100 p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {totalScore}/15
                  </div>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    totalScore <= 6 ? 'bg-green-100 text-green-800' :
                    totalScore <= 9 ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    Klasa {totalScore <= 6 ? 'A' : totalScore <= 9 ? 'B' : 'C'}
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    Child-Pugh Score
                  </div>
                </div>
              </div>
            )}

            {/* Calculator Form */}
            <div className="bg-white rounded-xl shadow-md border border-amber-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Oceń pacjenta w każdej kategorii:
              </h3>
              
              {childPughParameters.map((parameter) => (
                <div key={parameter.id} className="mb-6">
                  <h4 className="text-md font-semibold text-amber-700 mb-3">
                    {parameter.name}:
                  </h4>
                  <div className="space-y-2">
                    {parameter.options.map((option) => (
                      <label
                        key={`${parameter.id}-${option.points}`}
                        className={`block p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                          scores[parameter.id] === option.points
                            ? 'border-amber-300 bg-amber-50 shadow-sm'
                            : 'border-gray-200 hover:border-amber-200 hover:bg-amber-25'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <input
                            type="radio"
                            name={parameter.id}
                            value={option.points}
                            checked={scores[parameter.id] === option.points}
                            onChange={() => handleScoreChange(parameter.id, option.points)}
                            className="mt-1 h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="font-medium text-gray-900 text-sm">
                                {option.description}
                              </div>
                              <span className="text-sm font-semibold text-amber-600">
                                {option.points} {option.points === 1 ? 'punkt' : 'punkty'}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600 mt-1">{option.range}</div>
                            <div className="text-xs text-gray-500 mt-1">{option.details}</div>
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
                  disabled={!allParametersCompleted}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    allParametersCompleted
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle className="w-5 h-5 inline mr-2" />
                  Oblicz Child-Pugh
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
                      Child-Pugh Klasa {result.childClass}
                    </h3>
                    <div className="text-3xl font-bold text-amber-600 mb-2">
                      {result.totalScore}/15 punktów
                    </div>
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getClassColor(result.childClass)}`}>
                      <span className="mr-2">
                        {result.childClass === 'A' && '✅'}
                        {result.childClass === 'B' && '⚠️'}
                        {result.childClass === 'C' && '🚨'}
                      </span>
                      {result.childClass === 'A' ? 'Dobrze zachowana funkcja' :
                       result.childClass === 'B' ? 'Umiarkowana dysfunkcja' :
                       'Zaawansowana dysfunkcja'}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Interpretacja:</h4>
                    <p className="text-gray-700 text-sm mb-3">{result.interpretation}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Przeżywalność roczna:</span>
                        <div className="text-lg font-bold text-amber-600">{result.oneYearSurvival}</div>
                      </div>
                      <div>
                        <span className="font-medium">Przeżywalność 2-letnia:</span>
                        <div className="text-lg font-bold text-amber-600">{result.twoYearSurvival}</div>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm mt-3"><strong>Rokowanie:</strong> {result.prognosis}</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Szczegółowe wyniki:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(result.scores).map(([key, value], index) => {
                        const labels = ['Bilirubina', 'Albumina', 'INR', 'Wodobrzusze', 'Encefalopatia'];
                        return (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-600">{labels[index]}:</span>
                            <span className="font-medium">{value} pkt</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Zalecenia postępowania:</h4>
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
                      {result.monitoring.map((monitor, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Stethoscope className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{monitor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Opcje leczenia:</h4>
                    <ul className="space-y-2">
                      {result.treatmentOptions.map((option, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Heart className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{option}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Przeciwwskazania:</h4>
                    <ul className="space-y-2">
                      {result.contraindications.map((contraindication, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{contraindication}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {result.childClass === 'C' && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-red-800 mb-1">
                            UWAGA: Zaawansowana dysfunkcja wątroby!
                          </p>
                          <p className="text-xs text-red-700">
                            Klasa C Child-Pugh (10-15 punktów). Konieczna pilna konsultacja hepatologiczna i rozważenie transplantacji wątroby.
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
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Skala Child-Pugha
                </h3>
                <p className="text-gray-500 mb-4">
                  Oceń wszystkie parametry i kliknij "Oblicz Child-Pugh"
                </p>
                <div className="text-sm text-gray-600">
                  Aktualny wynik: {totalScore}/15 punktów
                  {totalScore > 0 && (
                    <div className="mt-1">
                      Klasa: {totalScore <= 6 ? 'A' : totalScore <= 9 ? 'B' : 'C'}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildPughCalculator;