import React, { useState } from 'react';
import { ArrowLeft, Activity, AlertTriangle, CheckCircle, RotateCcw, Heart, Zap, Stethoscope } from 'lucide-react';

interface CentorCriteria {
  id: string;
  name: string;
  description: string;
  details: string;
}

interface CentorResult {
  criteria: Record<string, boolean>;
  age: number;
  rawScore: number;
  finalScore: number;
  probability: string;
  interpretation: string;
  risk: 'low' | 'moderate' | 'high';
  recommendations: string[];
  antibioticRecommendation: string;
  testingRecommendation: string;
  followUp: string[];
  color: string;
}

const CentorCalculator: React.FC = () => {
  const [criteria, setCriteria] = useState<Record<string, boolean>>({
    fever: false,
    noCough: false,
    lymphNodes: false,
    exudate: false
  });
  const [age, setAge] = useState<number>(25);
  const [result, setResult] = useState<CentorResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const centorCriteria: CentorCriteria[] = [
    {
      id: 'fever',
      name: 'Gorączka >38°C',
      description: 'Temperatura ciała powyżej 38°C',
      details: 'Może być podawana w wywiadzie lub zmierzona podczas badania'
    },
    {
      id: 'noCough',
      name: 'Brak kaszlu',
      description: 'Pacjent nie kaszle lub kaszel jest minimalny',
      details: 'Suchy kaszel nie dyskwalifikuje - chodzi o produktywny kaszel'
    },
    {
      id: 'lymphNodes',
      name: 'Powiększone i bolesne węzły chłonne szyjne',
      description: 'Węzły chłonne przednie szyjne',
      details: 'Wyczuwalne, powiększone, bolesne przy palpacji'
    },
    {
      id: 'exudate',
      name: 'Naloty na migdałkach lub ich obrzęk',
      description: 'Białe lub żółtawe naloty na migdałkach',
      details: 'Znaczny obrzęk migdałków; samo zaczerwienienie nie wystarczy'
    }
  ];

  const getResult = (criteria: Record<string, boolean>, age: number): CentorResult => {
    // Calculate raw score (1 point per criterion)
    const rawScore = Object.values(criteria).filter(Boolean).length;
    
    // Age modification
    let ageModification = 0;
    if (age >= 3 && age <= 14) {
      ageModification = 1;
    } else if (age >= 45) {
      ageModification = -1;
    }
    
    const finalScore = Math.max(0, rawScore + ageModification);
    
    let probability: string;
    let interpretation: string;
    let risk: 'low' | 'moderate' | 'high';
    let color: string;
    let recommendations: string[];
    let antibioticRecommendation: string;
    let testingRecommendation: string;
    let followUp: string[];

    if (finalScore <= 1) {
      probability = '1-7%';
      interpretation = 'Niskie prawdopodobieństwo infekcji paciorkowcowej';
      risk = 'low';
      color = 'green';
      antibioticRecommendation = 'Nie zaleca się antybiotykoterapii';
      testingRecommendation = 'Nie wykonuj posiewu ani testu szybkiego';
      recommendations = [
        'Leczenie objawowe (paracetamol, ibuprofen)',
        'Płukanie gardła słoną wodą',
        'Nawadnianie organizmu',
        'Odpoczynek',
        'Unikanie palenia tytoniu',
        'Obserwacja objawów przez 3-5 dni'
      ];
      followUp = [
        'Obserwacja domowa',
        'Kontakt w przypadku pogorszenia',
        'Powrót jeśli objawy utrzymują się >7 dni',
        'Pilny kontakt przy duszności lub trudnościach z przełykaniem'
      ];
    } else if (finalScore <= 3) {
      probability = '15-32%';
      interpretation = 'Umiarkowane prawdopodobieństwo infekcji paciorkowcowej';
      risk = 'moderate';
      color = 'orange';
      antibioticRecommendation = 'Rozważ antybiotykoterapię na podstawie testu';
      testingRecommendation = 'Wykonaj test szybki lub posiew';
      recommendations = [
        'Test szybki na paciorkowca grupy A (RADT)',
        'Posiew z gardła (jeśli brak dostępu do RADT)',
        'Leczenie objawowe do otrzymania wyniku',
        'Antybiotyk tylko przy dodatnim teście',
        'Izolacja do 24h po rozpoczęciu antybiotyku (jeśli wskazany)',
        'Edukacja pacjenta o objawach powikłań'
      ];
      followUp = [
        'Ocena wyniku testu w ciągu 24-48h',
        'Rozpoczęcie antybiotyku przy dodatnim wyniku',
        'Kontakt przy braku poprawy po 48h leczenia',
        'Obserwacja objawów powikłań'
      ];
    } else {
      probability = '51-56%';
      interpretation = 'Wysokie prawdopodobieństwo infekcji paciorkowcowej';
      risk = 'high';
      color = 'red';
      antibioticRecommendation = 'Zaleca się empiryczną antybiotykoterapię';
      testingRecommendation = 'Można leczyć empirycznie lub wykonać test potwierdzający';
      recommendations = [
        'Antybiotykoterapia empiryczna',
        'Penicylina V 500mg 2x/dzień przez 10 dni',
        'Alternatywa: Amoksycylina 500mg 3x/dzień',
        'Przy alergii na penicylinę: erytromycyna lub azytromycyna',
        'Leczenie objawowe (przeciwbólowe, przeciwgorączkowe)',
        'Izolacja przez 24h po rozpoczęciu antybiotyku'
      ];
      followUp = [
        'Ocena po 48-72h leczenia',
        'Kontakt przy braku poprawy',
        'Obserwacja objawów powikłań',
        'Zakończenie izolacji po 24h antybiotyku'
      ];
    }

    return {
      criteria,
      age,
      rawScore,
      finalScore,
      probability,
      interpretation,
      risk,
      recommendations,
      antibioticRecommendation,
      testingRecommendation,
      followUp,
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
    const calculatedResult = getResult(criteria, age);
    setResult(calculatedResult);
    setShowResult(true);
  };

  const handleReset = () => {
    setCriteria({
      fever: false,
      noCough: false,
      lymphNodes: false,
      exudate: false
    });
    setAge(25);
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

  const currentScore = Object.values(criteria).filter(Boolean).length + 
    (age >= 3 && age <= 14 ? 1 : age >= 45 ? -1 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-green-100">
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
                <div className="p-2 bg-gradient-to-r from-green-400 to-teal-500 rounded-full">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                Skala Centora
              </h1>
              <p className="text-gray-600 text-sm">
                Centor Score - Diagnostyka paciorkowcowego zapalenia gardła
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
            <div className="bg-white rounded-xl shadow-md border border-green-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Informacje o skali
              </h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p><strong>Zastosowanie:</strong> Ocena prawdopodobieństwa paciorkowcowego zapalenia gardła</p>
                <p><strong>Kryteria:</strong> 4 kliniczne + modyfikacja wiekowa</p>
                <p><strong>Zakres:</strong> 0-5 punktów (z modyfikacją wiekową)</p>
                <p><strong>Cel:</strong> Racjonalne stosowanie antybiotyków</p>
              </div>
            </div>

            {/* Current Score Display */}
            <div className="bg-white rounded-xl shadow-md border border-green-100 p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {Math.max(0, currentScore)}/5
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Aktualny wynik w skali Centora
                </div>
                <div className="text-xs text-gray-500">
                  Prawdopodobieństwo: {
                    currentScore <= 1 ? '1-7%' : 
                    currentScore <= 3 ? '15-32%' : '51-56%'
                  }
                </div>
              </div>
            </div>

            {/* Age Input */}
            <div className="bg-white rounded-xl shadow-md border border-green-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Wiek pacjenta:
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                    Wiek (w latach):
                  </label>
                  <input
                    type="number"
                    id="age"
                    min="0"
                    max="120"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="text-xs text-gray-500">
                  <p><strong>Modyfikacja wiekowa:</strong></p>
                  <p>• 3-14 lat: +1 punkt</p>
                  <p>• 15-44 lata: bez zmian</p>
                  <p>• ≥45 lat: -1 punkt</p>
                </div>
              </div>
            </div>

            {/* Calculator Form */}
            <div className="bg-white rounded-xl shadow-md border border-green-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Oceń obecność objawów i cech klinicznych:
              </h3>
              
              <div className="space-y-4">
                {centorCriteria.map((criterion) => (
                  <div key={criterion.id} className="border border-gray-200 rounded-lg p-4">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={criteria[criterion.id]}
                        onChange={(e) => handleCriteriaChange(criterion.id, e.target.checked)}
                        className="mt-1 h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 text-sm">
                          {criterion.name} {criteria[criterion.id] && <span className="text-green-600">✓</span>}
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
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <CheckCircle className="w-5 h-5 inline mr-2" />
                  Oblicz ryzyko paciorkowca
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
                      Skala Centora: {result.finalScore}/5
                    </h3>
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getRiskColor(result.risk)}`}>
                      <span className="mr-2">
                        {result.risk === 'low' && '✅'}
                        {result.risk === 'moderate' && '⚠️'}
                        {result.risk === 'high' && '🚨'}
                      </span>
                      {result.risk === 'low' ? 'Niskie ryzyko' :
                       result.risk === 'moderate' ? 'Umiarkowane ryzyko' :
                       'Wysokie ryzyko'}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Interpretacja:</h4>
                    <p className="text-gray-700 text-sm mb-3">{result.interpretation}</p>
                    <h4 className="font-semibold text-gray-900 mb-2">Prawdopodobieństwo infekcji paciorkowcowej:</h4>
                    <p className="text-green-600 font-medium text-sm">{result.probability}</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Szczegóły wyniku:</h4>
                    <div className="text-sm space-y-1">
                      <div>Wynik surowy: {result.rawScore}/4</div>
                      <div>Modyfikacja wiekowa: {result.age >= 3 && result.age <= 14 ? '+1' : result.age >= 45 ? '-1' : '0'} (wiek: {result.age} lat)</div>
                      <div>Wynik końcowy: {result.finalScore}/5</div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Zalecenia dotyczące antybiotyków:</h4>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-700 text-sm font-medium">{result.antibioticRecommendation}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Zalecenia dotyczące testów:</h4>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-gray-700 text-sm font-medium">{result.testingRecommendation}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Postępowanie:</h4>
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
                    <h4 className="font-semibold text-gray-900 mb-3">Kontrole i obserwacja:</h4>
                    <ul className="space-y-2">
                      {result.followUp.map((followUp, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Heart className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{followUp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {result.risk === 'high' && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-red-800 mb-1">
                            Wysokie prawdopodobieństwo infekcji paciorkowcowej
                          </p>
                          <p className="text-xs text-red-700">
                            Rozważ rozpoczęcie empirycznej antybiotykoterapii. Monitor objawów powikłań.
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
                <Stethoscope className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Skala Centora
                </h3>
                <p className="text-gray-500 mb-4">
                  Oceń obecność kryteriów i kliknij "Oblicz ryzyko paciorkowca"
                </p>
                <div className="text-sm text-gray-600">
                  Aktualny wynik: {Math.max(0, currentScore)}/5 punktów
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CentorCalculator;