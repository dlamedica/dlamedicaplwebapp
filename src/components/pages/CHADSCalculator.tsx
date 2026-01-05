import React, { useState } from 'react';
import { ArrowLeft, Heart, AlertTriangle, CheckCircle, RotateCcw, Activity, Zap, Shield } from 'lucide-react';

interface CHADSCriteria {
  id: string;
  name: string;
  fullName: string;
  description: string;
  details: string;
  points: number;
}

interface CHADSResult {
  criteria: Record<string, boolean>;
  totalScore: number;
  maxScore: number;
  annualStrokeRisk: string;
  riskCategory: 'low' | 'moderate' | 'high';
  interpretation: string;
  anticoagulationRecommendation: string;
  medications: string[];
  monitoring: string[];
  alternatives: string[];
  limitations: string[];
  color: string;
}

const CHADSCalculator: React.FC = () => {
  const [criteria, setCriteria] = useState<Record<string, boolean>>({
    chf: false,
    hypertension: false,
    age75: false,
    diabetes: false,
    stroke: false
  });
  const [result, setResult] = useState<CHADSResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const chadsCriteria: CHADSCriteria[] = [
    {
      id: 'chf',
      name: 'C - Congestive Heart Failure',
      fullName: 'Niewydolność serca',
      description: 'Klinicznie jawna niewydolność serca',
      details: 'Dysfunkcja skurczowa lewej komory (EF <40%) lub hospitalizacja z powodu niewydolności serca',
      points: 1
    },
    {
      id: 'hypertension',
      name: 'H - Hypertension',
      fullName: 'Nadciśnienie tętnicze',
      description: 'Nadciśnienie tętnicze w wywiadzie',
      details: 'Obecnie leczone nadciśnienie lub RR >140/90 mmHg w powtarzanych pomiarach',
      points: 1
    },
    {
      id: 'age75',
      name: 'A - Age ≥75 lat',
      fullName: 'Wiek ≥75 lat',
      description: 'Wiek 75 lat lub więcej',
      details: 'Zaawansowany wiek jest niezależnym czynnikiem ryzyka udaru',
      points: 1
    },
    {
      id: 'diabetes',
      name: 'D - Diabetes',
      fullName: 'Cukrzyca',
      description: 'Cukrzyca typu 1 lub 2',
      details: 'Leczona dietą, doustnymi lekami przeciwcukrzycowymi lub insuliną',
      points: 1
    },
    {
      id: 'stroke',
      name: 'S - Stroke/TIA',
      fullName: 'Udar/TIA w wywiadzie',
      description: 'Przebyty udar mózgu, TIA lub zator obwodowy',
      details: 'Historia udaru mózgu, przemijającego ataku niedokrwiennego lub zatoru obwodowego',
      points: 2
    }
  ];

  const getResult = (criteria: Record<string, boolean>): CHADSResult => {
    let totalScore = 0;
    
    // Calculate score
    chadsCriteria.forEach(criterion => {
      if (criteria[criterion.id]) {
        totalScore += criterion.points;
      }
    });
    
    let annualStrokeRisk: string;
    let riskCategory: 'low' | 'moderate' | 'high';
    let interpretation: string;
    let color: string;
    let anticoagulationRecommendation: string;
    let medications: string[];
    let monitoring: string[];
    let alternatives: string[];
    let limitations: string[];

    if (totalScore === 0) {
      annualStrokeRisk = '1,9%';
      riskCategory = 'low';
      interpretation = 'Niskie ryzyko udaru - może nie wymagać antykoagulacji';
      color = 'green';
      anticoagulationRecommendation = 'Kwas acetylosalicylowy 75-325mg lub brak leczenia';
      medications = [
        'Kwas acetylosalicylowy 75-325mg dziennie',
        'Alternatywnie: obserwacja bez leczenia',
        'Rozważenie antykoagulantów przy innych wskazaniach'
      ];
      monitoring = [
        'Regulne kontrole kardiologiczne co 6-12 miesięcy',
        'Monitorowanie pojawienia się nowych czynników ryzyka',
        'Edukacja pacjenta o objawach udaru'
      ];
    } else if (totalScore === 1) {
      annualStrokeRisk = '2,8%';
      riskCategory = 'moderate';
      interpretation = 'Umiarkowane ryzyko udaru - rozważyć antykoagulację';
      color = 'orange';
      anticoagulationRecommendation = 'Kwas acetylosalicylowy lub antykoagulant doustny';
      medications = [
        'Kwas acetylosalicylowy 75-325mg dziennie',
        'LUB warfaryna (INR 2,0-3,0)',
        'LUB NOAC (dabigatran, rivaroxaban, apixaban)',
        'Decyzja indywidualna na podstawie ryzyka krwawienia'
      ];
      monitoring = [
        'Przy warfarynie: INR co 2-4 tygodnie',
        'Przy NOAC: kontrole co 3-6 miesięcy',
        'Ocena ryzyka krwawienia (skala HAS-BLED)',
        'Kontrole kardiologiczne co 6 miesięcy'
      ];
    } else {
      if (totalScore === 2) annualStrokeRisk = '4,0%';
      else if (totalScore === 3) annualStrokeRisk = '5,9%';
      else if (totalScore === 4) annualStrokeRisk = '8,5%';
      else if (totalScore === 5) annualStrokeRisk = '12,5%';
      else annualStrokeRisk = '18,2%';
      
      riskCategory = 'high';
      interpretation = 'Wysokie ryzyko udaru - wskazana antykoagulacja';
      color = 'red';
      anticoagulationRecommendation = 'Antykoagulant doustny (warfaryna lub NOAC)';
      medications = [
        'NOAC (preferowane): dabigatran, rivaroxaban, apixaban, edoxaban',
        'Warfaryna (jeśli NOAC przeciwwskazane) - INR 2,0-3,0',
        'Unikanie kwasu acetylosalicylowego jako jedynego leczenia',
        'Rozważenie podwójnej terapii tylko w szczególnych przypadkach'
      ];
      monitoring = [
        'NOAC: kontrole co 3-6 miesięcy',
        'Warfaryna: INR co 2-4 tygodnie',
        'Monitorowanie funkcji nerek i wątroby',
        'Ocena ryzyka krwawienia przed rozpoczęciem leczenia',
        'Regulne kontrole kardiologiczne'
      ];
    }

    alternatives = [
      'Przy przeciwwskazaniach do antykoagulacji: zamknięcie uszka lewego przedsionka',
      'Kontrola rytmu serca (kardiowersja, ablacja)',
      'Optymalizacja leczenia chorób towarzyszących',
      'Modyfikacja stylu życia (dieta, aktywność fizyczna)'
    ];

    limitations = [
      'Skala CHADS została zastąpiona przez CHA₂DS₂-VASc',
      'CHA₂DS₂-VASc jest bardziej precyzyjna, szczególnie u młodszych pacjentów',
      'CHADS nie uwzględnia wieku 65-74 lat jako czynnika ryzyka',
      'Brak oceny choroby naczyniowej i płci żeńskiej'
    ];

    return {
      criteria,
      totalScore,
      maxScore: 6,
      annualStrokeRisk,
      riskCategory,
      interpretation,
      anticoagulationRecommendation,
      medications,
      monitoring,
      alternatives,
      limitations,
      color
    };
  };

  const handleCriteriaChange = (criteriaId: string, value: boolean) => {
    setCriteria(prev => ({
      ...prev,
      [criteriaId]: value
    }));
  };

  const handleCalculate = () => {
    const calculatedResult = getResult(criteria);
    setResult(calculatedResult);
    setShowResult(true);
  };

  const handleReset = () => {
    setCriteria({
      chf: false,
      hypertension: false,
      age75: false,
      diabetes: false,
      stroke: false
    });
    setResult(null);
    setShowResult(false);
  };


  const getRiskColor = (risk: string) => {
    const colors = {
      'low': 'text-green-600 bg-green-50 border-green-200',
      'moderate': 'text-orange-600 bg-orange-50 border-orange-200',
      'high': 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[risk as keyof typeof colors] || colors.low;
  };

  const currentScore = chadsCriteria.reduce((total, criterion) => {
    return total + (criteria[criterion.id] ? criterion.points : 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-purple-100">
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
                <div className="p-2 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full">
                  <Heart className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Skala CHADS
              </h1>
              <p className="text-gray-600 text-sm">
                Congestive Heart Failure, Hypertension, Age, Diabetes, Stroke
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
            <div className="bg-white rounded-xl shadow-md border border-purple-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Informacje o skali
              </h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p><strong>Zastosowanie:</strong> Ocena ryzyka udaru u pacjentów z migotaniem przedsionków</p>
                <p><strong>Czynniki:</strong> 5 czynników ryzyka (0-6 punktów)</p>
                <p><strong>Status:</strong> Zastąpiona przez CHA₂DS₂-VASc</p>
                <p><strong>Cel:</strong> Kwalifikacja do antykoagulacji</p>
              </div>
            </div>

            {/* Current Score Display */}
            <div className="bg-white rounded-xl shadow-md border border-purple-100 p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {currentScore}/6
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Aktualny wynik w skali CHADS
                </div>
                <div className="text-xs text-gray-500">
                  Roczne ryzyko udaru: {
                    currentScore === 0 ? '1,9%' :
                    currentScore === 1 ? '2,8%' :
                    currentScore === 2 ? '4,0%' :
                    currentScore === 3 ? '5,9%' :
                    currentScore === 4 ? '8,5%' :
                    currentScore === 5 ? '12,5%' : '18,2%'
                  }
                </div>
              </div>
            </div>

            {/* Warning about CHADS vs CHA2DS2-VASc */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-yellow-800 mb-1">
                    Uwaga: Starsza wersja skali
                  </h3>
                  <p className="text-xs text-yellow-700">
                    Skala CHADS została zastąpiona przez CHA₂DS₂-VASc, która jest bardziej precyzyjna. 
                    Obecnie zaleca się używanie CHA₂DS₂-VASc do oceny ryzyka udaru.
                  </p>
                </div>
              </div>
            </div>

            {/* Calculator Form */}
            <div className="bg-white rounded-xl shadow-md border border-purple-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Zaznacz obecne czynniki ryzyka u pacjenta z migotaniem przedsionków:
              </h3>
              
              <div className="space-y-4">
                {chadsCriteria.map((criterion) => (
                  <div key={criterion.id} className="border border-gray-200 rounded-lg p-4">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={criteria[criterion.id]}
                        onChange={(e) => handleCriteriaChange(criterion.id, e.target.checked)}
                        className="mt-1 h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-gray-900 text-sm">
                            {criterion.name} {criteria[criterion.id] && <span className="text-purple-600">✓</span>}
                          </div>
                          <span className="text-sm text-gray-500">
                            {criterion.points} {criterion.points === 1 ? 'punkt' : 'punkty'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{criterion.description}</div>
                        <div className="text-xs text-gray-500 mt-1">{criterion.details}</div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleCalculate}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <CheckCircle className="w-5 h-5 inline mr-2" />
                  Oblicz ryzyko udaru
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
                      Skala CHADS: {result.totalScore}/{result.maxScore}
                    </h3>
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getRiskColor(result.riskCategory)}`}>
                      <span className="mr-2">
                        {result.riskCategory === 'low' && '✅'}
                        {result.riskCategory === 'moderate' && '⚠️'}
                        {result.riskCategory === 'high' && '🚨'}
                      </span>
                      {result.riskCategory === 'low' ? 'Niskie ryzyko' :
                       result.riskCategory === 'moderate' ? 'Umiarkowane ryzyko' :
                       'Wysokie ryzyko'}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Interpretacja:</h4>
                    <p className="text-gray-700 text-sm mb-3">{result.interpretation}</p>
                    <h4 className="font-semibold text-gray-900 mb-2">Roczne ryzyko udaru:</h4>
                    <p className="text-purple-600 font-medium text-lg">{result.annualStrokeRisk}</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Zalecenia antykoagulacji:</h4>
                    <div className="p-3 bg-purple-50 rounded-lg mb-4">
                      <p className="text-gray-700 text-sm font-medium">{result.anticoagulationRecommendation}</p>
                    </div>
                    <ul className="space-y-2">
                      {result.medications.map((medication, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Shield className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{medication}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Monitorowanie:</h4>
                    <ul className="space-y-2">
                      {result.monitoring.map((monitor, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Activity className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{monitor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Alternatywne opcje:</h4>
                    <ul className="space-y-2">
                      {result.alternatives.map((alternative, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Zap className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{alternative}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Ograniczenia skali CHADS:</h4>
                    <ul className="space-y-2">
                      {result.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {result.riskCategory === 'high' && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-red-800 mb-1">
                            Wysokie ryzyko udaru!
                          </p>
                          <p className="text-xs text-red-700">
                            Wynik ≥2 punktów. Antykoagulacja jest wskazana, jeśli nie ma przeciwwskazań.
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
                <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Skala CHADS
                </h3>
                <p className="text-gray-500 mb-4">
                  Zaznacz czynniki ryzyka i kliknij "Oblicz ryzyko udaru"
                </p>
                <div className="text-sm text-gray-600">
                  Aktualny wynik: {currentScore}/6 punktów
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CHADSCalculator;