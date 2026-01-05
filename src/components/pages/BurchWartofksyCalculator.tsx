import React, { useState } from 'react';
import { ArrowLeft, Flame, AlertTriangle, CheckCircle, RotateCcw, Activity, Zap, Heart } from 'lucide-react';

interface BurchWartofksyCategory {
  id: string;
  name: string;
  options: BurchWartofksyOption[];
}

interface BurchWartofksyOption {
  score: number;
  description: string;
  details: string;
}

interface BurchWartofksyResult {
  scores: Record<string, number>;
  totalScore: number;
  maxScore: number;
  likelihood: 'unlikely' | 'possible' | 'highly_likely';
  interpretation: string;
  mortality: string;
  emergencyManagement: string[];
  treatmentProtocol: string[];
  monitoring: string[];
  prognosis: string;
  color: string;
}

const BurchWartofksyCalculator: React.FC = () => {  const [scores, setScores] = useState<Record<string, number>>({
    temperature: 0,
    cnsSymptoms: 0,
    giSymptoms: 0,
    tachycardia: 0,
    heartFailure: 0,
    atrialFibrillation: 0,
    precipitantHistory: 0
  });
  const [result, setResult] = useState<BurchWartofksyResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const burchWartofksyCategories: BurchWartofksyCategory[] = [
    {
      id: 'temperature',
      name: 'Temperatura ciała',
      options: [
        { score: 0, description: '<37,2°C', details: 'Temperatura prawidłowa' },
        { score: 5, description: '37,2-37,7°C', details: 'Subfebryla' },
        { score: 10, description: '37,8-38,2°C', details: 'Febryla łagodna' },
        { score: 15, description: '38,3-38,8°C', details: 'Febryla umiarkowana' },
        { score: 20, description: '38,9-39,4°C', details: 'Febryla wysoka' },
        { score: 25, description: '39,5-39,9°C', details: 'Febryla bardzo wysoka' },
        { score: 30, description: '≥40°C', details: 'Hipertermia ekstremalna' }
      ]
    },
    {
      id: 'cnsSymptoms',
      name: 'Objawy ze strony ośrodkowego układu nerwowego',
      options: [
        { score: 0, description: 'Brak', details: 'Stan neurologiczny prawidłowy' },
        { score: 10, description: 'Łagodna agitacja', details: 'Niepokój, lekka pobudliwość, bezsenność' },
        { score: 20, description: 'Umiarkowana agitacja, delirium', details: 'Dezorientacja, majaczenie, znaczna agitacja' },
        { score: 30, description: 'Ciężka apatia, stupor, śpiączka', details: 'Zaburzenia świadomości, stupor lub śpiączka' }
      ]
    },
    {
      id: 'giSymptoms',
      name: 'Objawy żołądkowo-jelitowe',
      options: [
        { score: 0, description: 'Brak', details: 'Przewód pokarmowy bez objawów' },
        { score: 10, description: 'Biegunka, nudności, wymioty, ból brzucha', details: 'Objawy ze strony przewodu pokarmowego' },
        { score: 20, description: 'Niewyjaśniona żółtaczka', details: 'Żółtaczka bez innych przyczyn' }
      ]
    },
    {
      id: 'tachycardia',
      name: 'Częstość akcji serca',
      options: [
        { score: 0, description: '<90/min', details: 'Częstość serca prawidłowa' },
        { score: 5, description: '90-109/min', details: 'Łagodna tachykardia' },
        { score: 10, description: '110-119/min', details: 'Umiarkowana tachykardia' },
        { score: 15, description: '120-129/min', details: 'Znaczna tachykardia' },
        { score: 20, description: '130-139/min', details: 'Ciężka tachykardia' },
        { score: 25, description: '≥140/min', details: 'Ekstremalna tachykardia' }
      ]
    },
    {
      id: 'heartFailure',
      name: 'Niewydolność serca',
      options: [
        { score: 0, description: 'Brak', details: 'Brak objawów niewydolności serca' },
        { score: 5, description: 'Łagodna (obrzęki stóp)', details: 'Niewydolność serca NYHA I' },
        { score: 10, description: 'Umiarkowana (rzężenia bazalne)', details: 'Niewydolność serca NYHA II-III' },
        { score: 15, description: 'Ciężka (obrzęk płuc)', details: 'Niewydolność serca NYHA IV, obrzęk płuc' }
      ]
    },
    {
      id: 'atrialFibrillation',
      name: 'Migotanie przedsionków',
      options: [
        { score: 0, description: 'Nieobecne', details: 'Rytm zatokowy prawidłowy' },
        { score: 10, description: 'Obecne', details: 'Migotanie przedsionków w EKG' }
      ]
    },
    {
      id: 'precipitantHistory',
      name: 'Czynnik wyzwalający',
      options: [
        { score: 0, description: 'Brak', details: 'Brak wyraźnego czynnika wyzwalającego' },
        { score: 10, description: 'Obecny', details: 'Infekcja, operacja, stress, jod, przerwanie leczenia antytyreoidowego' }
      ]
    }
  ];

  const getResult = (scores: Record<string, number>): BurchWartofksyResult => {
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    
    let likelihood: 'unlikely' | 'possible' | 'highly_likely';
    let interpretation: string;
    let color: string;
    let mortality: string;
    let emergencyManagement: string[];
    let treatmentProtocol: string[];
    let monitoring: string[];
    let prognosis: string;

    if (totalScore < 25) {
      likelihood = 'unlikely';
      interpretation = 'Przełom tarczycowy mało prawdopodobny';
      color = 'green';
      mortality = 'Niska (<5%)';
      emergencyManagement = [
        'Podstawowe badania laboratoryjne (TSH, fT3, fT4)',
        'Wykluczenie innych przyczyn objawów',
        'Obserwacja kliniczna',
        'Leczenie objawowe',
        'Rozważenie przyczyn hipertyreoidyzmu',
        'Kontrolne badania za 24-48h przy pogorszeniu'
      ];
      treatmentProtocol = [
        'Standardowe leczenie hipertyreoidyzmu',
        'Tiamazol lub propyltiouracyl per os',
        'Beta-blokery przy tachykardii',
        'Leczenie przyczyn towarzyszących',
        'Unikanie jodu i leków prowokujących',
        'Regularne kontrole ambulatoryjne'
      ];
      monitoring = [
        'Kontrole ambulatoryjne co 2-4 tygodnie',
        'Monitorowanie TSH, fT3, fT4',
        'Ocena objawów klinicznych',
        'Kontrola funkcji wątroby przy lekach antytyreoidowych'
      ];
      prognosis = 'Bardzo dobre rokowanie przy odpowiednim leczeniu ambulatoryjnym hipertyreoidyzmu.';
    } else if (totalScore < 45) {
      likelihood = 'possible';
      interpretation = 'Przełom tarczycowy możliwy - wymaga ścisłej obserwacji';
      color = 'orange';
      mortality = 'Umiarkowana (10-20%)';
      emergencyManagement = [
        'PILNE badania laboratoryjne (TSH, fT3, fT4, morfologia, elektrolity)',
        'Hospitalizacja na oddziale wewnętrznym/intensywnej opieki',
        'Monitorowanie funkcji życiowych',
        'Płynoterapia i.v.',
        'Rozważenie leczenia przełomu tarczycowego',
        'Identyfikacja i leczenie czynnika wyzwalającego',
        'Konsultacja endokrynologiczna'
      ];
      treatmentProtocol = [
        'Leki antytyreoidowe dożylnie: Propyltiouracyl lub Tiamazol',
        'Beta-blokery: Propranolol 40-80mg co 6h',
        'Jod anorganiczny (po 1h od antytyreoidowych)',
        'Kortykosteroidy: Hydrocortyzon 100-300mg i.v.',
        'Leczenie objawowe (antipyretyki, płyny)',
        'Leczenie czynnika wyzwalającego',
        'Digitalizacja przy migotaniu przedsionków'
      ];
      monitoring = [
        'Monitorowanie w warunkach szpitalnych',
        'Kontrole parametrów życiowych co 4-6h',
        'Badania hormonów tarczycy co 12-24h początkowo',
        'Monitorowanie EKG, elektrolity, funkcji nerek i wątroby',
        'Ocena stanu neurologicznego'
      ];
      prognosis = 'Umiarkowane rokowanie. Konieczne intensywne leczenie szpitalne i ścisłe monitorowanie.';
    } else {
      likelihood = 'highly_likely';
      interpretation = 'Przełom tarczycowy wysoce prawdopodobny - stan zagrożenia życia';
      color = 'red';
      mortality = 'Wysoka (20-50% bez leczenia)';
      emergencyManagement = [
        'NATYCHMIASTOWA hospitalizacja na OIOM/OITN',
        'Agresywna resuscytacja płynowa i elektrolitowa',
        'Monitorowanie hemodynamiczne',
        'Wspomaganie funkcji życiowych',
        'PILNE leczenie przeciwtarczycowe',
        'Intensywne chłodzenie (nie aspiryna!)',
        'Leczenie powikłań (arytmie, niewydolność serca)',
        'Rozważenie plazmaferezyz lub dialuzy w przypadkach opomych'
      ];
      treatmentProtocol = [
        'WYSOKIE DAWKI leków antytyreoidowych i.v.',
        'Propyltiouracyl 200-300mg co 6h LUB Tiamazol 20-30mg co 8h',
        'Propranolol i.v. 1-2mg każde 5 min do kontroli HR',
        'Jod anorganiczny: Lugol 8 kropli co 6h lub NaI 1-2g i.v.',
        'Methylprednizolon 40-60mg i.v. co 8h',
        'Agresywne chłodzenie pacjenta',
        'Leczenie migotania przedsionków (digoksyna, amiodaron)',
        'Leczenie niewydolności serca diuretykami i inhibitorami ACE'
      ];
      monitoring = [
        'CIĄGŁE monitorowanie w OIOM',
        'Inwazyjne monitorowanie ciśnienia tętniczego',
        'Monitorowanie temperatury centralnej',
        'Kontrole hormonów tarczycy co 6-12h',
        'Ciągłe EKG, saturacja, diureza',
        'Badania laboratoryjne co 4-6h',
        'Echokardiografia przy niewydolności serca'
      ];
      prognosis = 'Poważne zagrożenie życia. Śmiertelność 20-50% mimo leczenia. Konieczna natychmiastowa intensywna terapia.';
    }

    return {
      scores,
      totalScore,
      maxScore: 140,
      likelihood,
      interpretation,
      mortality,
      emergencyManagement,
      treatmentProtocol,
      monitoring,
      prognosis,
      color
    };
  };

  const handleScoreChange = (categoryId: string, score: number) => {
    setScores(prev => ({
      ...prev,
      [categoryId]: score
    }));
  };

  const handleCalculate = () => {
    const calculatedResult = getResult(scores);
    setResult(calculatedResult);
    setShowResult(true);
  };

  const handleReset = () => {
    setScores({
      temperature: 0,
      cnsSymptoms: 0,
      giSymptoms: 0,
      tachycardia: 0,
      heartFailure: 0,
      atrialFibrillation: 0,
      precipitantHistory: 0
    });
    setResult(null);
    setShowResult(false);
  };

  const getLikelihoodColor = (likelihood: string) => {
    const colors = {
      'unlikely': 'text-green-600 bg-green-50 border-green-200',
      'possible': 'text-orange-600 bg-orange-50 border-orange-200',
      'highly_likely': 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[likelihood as keyof typeof colors] || colors.unlikely;
  };

  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-orange-100">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
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
                <div className="p-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-full">
                  <Flame className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Skala Burch-Wartofsky'ego
              </h1>
              <p className="text-gray-600 text-sm">
                Burch-Wartofsky Point Scale - Diagnostyka przełomu tarczycowego
              </p>
            </div>
            <div className="w-32"></div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info and Score Display */}
          <div className="space-y-6">
            {/* Info Card */}
            <div className="bg-white rounded-xl shadow-md border border-orange-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Informacje o skali
              </h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p><strong>Zastosowanie:</strong> Diagnostyka i ocena ciężkości przełomu tarczycowego</p>
                <p><strong>Parametry:</strong> 7 kategorii klinicznych</p>
                <p><strong>Zakres:</strong> 0-140 punktów</p>
                <p><strong>Interpretacja:</strong> &lt;25 mało prawdopodobny, 25-44 możliwy, ≥45 wysoce prawdopodobny</p>
              </div>
            </div>

            {/* Current Score Display */}
            <div className="bg-white rounded-xl shadow-md border border-orange-100 p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {totalScore}/140
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  Aktualny wynik w skali Burch-Wartofsky'ego
                </div>
                <div className="text-xs text-gray-500">
                  {totalScore < 25 ? 'Mało prawdopodobny' : 
                   totalScore < 45 ? 'Możliwy' : 'Wysoce prawdopodobny'}
                </div>
              </div>
            </div>

            {/* Critical Alert */}
            {totalScore >= 45 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-red-800 mb-1">
                      ALERT: Przełom tarczycowy!
                    </h3>
                    <p className="text-xs text-red-700">
                      Wynik ≥45 pkt wskazuje na wysokie prawdopodobieństwo przełomu tarczycowego. Konieczna natychmiastowa hospitalizacja!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Calculator */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-md border border-orange-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Oceń obecność i nasilenie objawów:
              </h3>
              
              <div className="space-y-6">
                {burchWartofksyCategories.map((category) => (
                  <div key={category.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                    <h4 className="text-md font-semibold text-orange-700 mb-3">
                      {category.name}:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {category.options.map((option) => (
                        <label
                          key={`${category.id}-${option.score}`}
                          className={`block p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                            scores[category.id] === option.score
                              ? 'border-orange-300 bg-orange-50 shadow-sm'
                              : 'border-gray-200 hover:border-orange-200 hover:bg-orange-25'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <input
                              type="radio"
                              name={category.id}
                              value={option.score}
                              checked={scores[category.id] === option.score}
                              onChange={(e) => handleScoreChange(category.id, parseInt(e.target.value))}
                              className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900 text-sm">
                                  {option.score} pkt
                                </span>
                                <span className="text-sm text-gray-700">
                                  {option.description}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">{option.details}</div>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleCalculate}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <CheckCircle className="w-5 h-5 inline mr-2" />
                  Oceń ryzyko przełomu
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
            <div className={`bg-white rounded-xl shadow-lg border-2 p-6 ${
              result.color === 'green' ? 'border-green-200' :
              result.color === 'orange' ? 'border-orange-200' :
              result.color === 'red' ? 'border-red-200' :
              'border-gray-200'
            }`}>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Skala Burch-Wartofsky'ego: {result.totalScore}/{result.maxScore}
                </h3>
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getLikelihoodColor(result.likelihood)}`}>
                  <span className="mr-2">
                    {result.likelihood === 'unlikely' && '✅'}
                    {result.likelihood === 'possible' && '⚠️'}
                    {result.likelihood === 'highly_likely' && '🚨'}
                  </span>
                  {result.likelihood === 'unlikely' ? 'Mało prawdopodobny' :
                   result.likelihood === 'possible' ? 'Możliwy' :
                   'Wysoce prawdopodobny'}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Interpretacja:</h4>
                  <p className="text-gray-700 text-sm mb-3">{result.interpretation}</p>
                  <h4 className="font-semibold text-gray-900 mb-2">Śmiertelność:</h4>
                  <p className="text-red-600 font-medium text-sm mb-3">{result.mortality}</p>
                  <h4 className="font-semibold text-gray-900 mb-2">Rokowanie:</h4>
                  <p className="text-gray-700 text-sm">{result.prognosis}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 mb-2">Szczegółowe wyniki:</h4>
                  {Object.entries(result.scores).map(([key, value], index) => {
                    const labels = ['Temperatura', 'Objawy OUN', 'Objawy GI', 'Tachykardia', 'Niewydolność serca', 'Migotanie przedsionków', 'Czynnik wyzwalający'];
                    return (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-gray-600">{labels[index]}:</span>
                        <span className="font-medium">{value} pkt</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Postępowanie nagłe:</h4>
                  <ul className="space-y-2">
                    {result.emergencyManagement.slice(0, 4).map((management, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Zap className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{management}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Protokół leczenia:</h4>
                  <ul className="space-y-2">
                    {result.treatmentProtocol.slice(0, 4).map((treatment, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Heart className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{treatment}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Monitorowanie:</h4>
                  <ul className="space-y-2">
                    {result.monitoring.slice(0, 4).map((monitor, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Activity className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{monitor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {result.likelihood === 'highly_likely' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-red-800 mb-1">
                        UWAGA: Przełom tarczycowy wysoce prawdopodobny!
                      </p>
                      <p className="text-xs text-red-700">
                        Wynik ≥45 punktów. Stan zagrożenia życia. Konieczna natychmiastowa hospitalizacja w OIOM i intensywna terapia przeciwtarczycowa.
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

export default BurchWartofksyCalculator;