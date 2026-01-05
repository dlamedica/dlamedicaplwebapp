import React, { useState } from 'react';
import { ArrowLeft, Stethoscope, AlertTriangle, CheckCircle, RotateCcw, Activity, Eye } from 'lucide-react';

interface LungField {
  id: string;
  name: string;
  position: string;
  anatomicalDescription: string;
}

interface AdditionalCriteria {
  id: string;
  name: string;
  points: number;
  description: string;
}

interface BiaterveldResult {
  fieldScores: Record<string, number>;
  additionalScores: Record<string, boolean>;
  totalScore: number;
  maxScore: number;
  severity: 'minimal' | 'mild' | 'moderate' | 'severe';
  interpretation: string;
  clinicalCorrelation: string;
  recommendations: string[];
  followUpRecommendations: string[];
  radiologicalFeatures: string[];
  prognosis: string;
  color: string;
}

const BiaterveldCalculator: React.FC = () => {  const [fieldScores, setFieldScores] = useState<Record<string, number>>({
    upperRight: 0,
    middleRight: 0,
    lowerRight: 0,
    upperLeft: 0,
    middleLeft: 0,
    lowerLeft: 0
  });
  const [additionalCriteria, setAdditionalCriteria] = useState<Record<string, boolean>>({
    pleuralEffusion: false,
    lymphNodes: false
  });
  const [result, setResult] = useState<BiaterveldResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const lungFields: LungField[] = [
    {
      id: 'upperRight',
      name: 'Pole górne prawe',
      position: 'Prawe górne',
      anatomicalDescription: 'Płat górny prawego płuca powyżej poziomu II żebra'
    },
    {
      id: 'middleRight',
      name: 'Pole środkowe prawe',
      position: 'Prawe środkowe',
      anatomicalDescription: 'Płat środkowy prawego płuca między poziomem II a IV żebra'
    },
    {
      id: 'lowerRight',
      name: 'Pole dolne prawe',
      position: 'Prawe dolne',
      anatomicalDescription: 'Płat dolny prawego płuca poniżej poziomu IV żebra'
    },
    {
      id: 'upperLeft',
      name: 'Pole górne lewe',
      position: 'Lewe górne',
      anatomicalDescription: 'Płat górny lewego płuca powyżej poziomu II żebra'
    },
    {
      id: 'middleLeft',
      name: 'Pole środkowe lewe',
      position: 'Lewe środkowe',
      anatomicalDescription: 'Lingula i część płata górnego lewego płuca'
    },
    {
      id: 'lowerLeft',
      name: 'Pole dolne lewe',
      position: 'Lewe dolne',
      anatomicalDescription: 'Płat dolny lewego płuca poniżej poziomu IV żebra'
    }
  ];

  const additionalCriteriaList: AdditionalCriteria[] = [
    {
      id: 'pleuralEffusion',
      name: 'Płyn w jamie opłucnowej',
      points: 2,
      description: 'Obecność płynu w jamie opłucnowej widocznego na RTG'
    },
    {
      id: 'lymphNodes',
      name: 'Powiększenie węzłów chłonnych wnęk',
      points: 1,
      description: 'Powiększone węzły chłonne wnęk płucnych (>1cm)'
    }
  ];

  const scoreDescriptions = [
    { score: 0, description: 'Brak zmian', details: 'Prawidłowy obraz radiologiczny pola płucnego' },
    { score: 1, description: 'Zmiany dyskretne', details: 'Słabo widoczne zacienienia śródmiąższowe, subtelne zmiany' },
    { score: 2, description: 'Zmiany umiarkowane', details: 'Wyraźne zacienienia śródmiąższowe, widoczne zgrubienia przegród' },
    { score: 3, description: 'Zmiany nasilone', details: 'Gęste zacienienia, zatarcie struktur, konsolidacje' }
  ];

  const getResult = (fieldScores: Record<string, number>, additionalScores: Record<string, boolean>): BiaterveldResult => {
    const fieldTotal = Object.values(fieldScores).reduce((sum, score) => sum + score, 0);
    const additionalTotal = (additionalScores.pleuralEffusion ? 2 : 0) + (additionalScores.lymphNodes ? 1 : 0);
    const totalScore = fieldTotal + additionalTotal;
    
    let severity: 'minimal' | 'mild' | 'moderate' | 'severe';
    let interpretation: string;
    let color: string;
    let clinicalCorrelation: string;
    let recommendations: string[];
    let followUpRecommendations: string[];
    let radiologicalFeatures: string[];
    let prognosis: string;

    if (totalScore <= 3) {
      severity = 'minimal';
      interpretation = 'Zmiany minimalne w śródmiąższu płuc';
      color = 'green';
      clinicalCorrelation = 'Objawy kliniczne zwykle nieobecne lub bardzo łagodne. Funkcja płuc prawdopodobnie w normie.';
      recommendations = [
        'Obserwacja kliniczna',
        'Kontrola RTG za 3-6 miesięcy',
        'Spirometria dla oceny funkcji płuc',
        'Unikanie czynników szkodliwych',
        'Monitorowanie objawów oddechowych'
      ];
      followUpRecommendations = [
        'RTG kontrolne za 6 miesięcy',
        'Spirometria co 12 miesięcy',
        'Konsultacja pulmonologiczna przy pogorszeniu objawów',
        'Unikanie palenia tytoniu'
      ];
      radiologicalFeatures = [
        'Prawidłowy lub niemal prawidłowy obraz RTG',
        'Subtelne zacienienia w pojedynczych polach',
        'Zachowana ostrość struktur płucnych',
        'Brak cech zaawansowanych zmian śródmiąższowych'
      ];
      prognosis = 'Bardzo dobre rokowanie. Zmiany mogą być przejściowe lub nie wymagać leczenia.';
    } else if (totalScore <= 8) {
      severity = 'mild';
      interpretation = 'Łagodne zmiany śródmiąższowe w płucach';
      color = 'yellow';
      clinicalCorrelation = 'Możliwe łagodne objawy: suchy kaszel, niewielka duszność wysiłkowa. Spirometria może wykazywać łagodne ograniczenia.';
      recommendations = [
        'Diagnostyka etiologiczna zmian śródmiąższowych',
        'Spirometria z oceną DLCO',
        'Rozważenie HRCT klatki piersiowej',
        'Konsultacja pulmonologiczna',
        'Leczenie objawowe',
        'Kontrola czynników ryzyka',
        'Rehabilitacja oddechowa jeśli wskazana'
      ];
      followUpRecommendations = [
        'RTG kontrolne co 3-4 miesiące',
        'Spirometria co 6 miesięcy',
        'HRCT co 12 miesięcy lub przy pogorszeniu',
        'Regularne konsultacje pulmonologiczne',
        'Monitorowanie saturacji wysiłkowej'
      ];
      radiologicalFeatures = [
        'Zacienienia śródmiąższowe w kilku polach płucnych',
        'Dyskretne zgrubienia przegród międzyzrazikowych',
        'Możliwe drobne ogniska konsolidacji',
        'Zachowana czytelność struktur naczyniowych'
      ];
      prognosis = 'Dobre rokowanie przy wczesnym rozpoznaniu i leczeniu. Możliwa stabilizacja lub poprawa.';
    } else if (totalScore <= 15) {
      severity = 'moderate';
      interpretation = 'Umiarkowane zmiany śródmiąższowe w płucach';
      color = 'orange';
      clinicalCorrelation = 'Wyraźne objawy kliniczne: kaszel, duszność, zmniejszona tolerancja wysiłku. Spirometria: umiarkowane ograniczenia.';
      recommendations = [
        'Pilna diagnostyka różnicowa chorób śródmiąższu',
        'HRCT wysokiej rozdzielczości obowiązkowe',
        'Bronchoskopia z BAL i biopsją',
        'Pełna diagnostyka immunologiczna',
        'Leczenie przeciwzapalne (steroidy)',
        'Tlenoterapia jeśli hipoksemia',
        'Intensywna rehabilitacja oddechowa',
        'Rozważenie immunosupresji'
      ];
      followUpRecommendations = [
        'RTG co 4-6 tygodni',
        'Spirometria co 3 miesiące',
        'HRCT co 6 miesięcy',
        'Gazometria co 3 miesiące',
        'Test 6-minutowego marszu',
        'Regulne konsultacje pulmonologiczne'
      ];
      radiologicalFeatures = [
        'Rozległe zacienienia śródmiąższowe',
        'Wyraźne zgrubienia przegród',
        'Ogniska konsolidacji w kilku polach',
        'Możliwe zacienienia mieszane (śródmiąższowe i pęcherzykowe)',
        'Zacienienia typu "matowej szyby"'
      ];
      prognosis = 'Umiarkowane rokowanie. Konieczne intensywne leczenie. Możliwa progresja bez leczenia.';
    } else {
      severity = 'severe';
      interpretation = 'Ciężkie zmiany śródmiąższowe w płucach';
      color = 'red';
      clinicalCorrelation = 'Ciężkie objawy: znaczna duszność spoczynkowa, kaszel, hipoksemia. Spirometria: ciężkie ograniczenia wentylacji.';
      recommendations = [
        'PILNA hospitalizacja pulmonologiczna',
        'Agresywna diagnostyka (HRCT, bronchoskopia, biopsja)',
        'Wysokodawkowa steroidoterapia',
        'Tlenoterapia ciągła',
        'Rozważenie immunosupresji kombinowanej',
        'Konsultacja transplantologiczna',
        'Leczenie wspomagające (mukolityki, bronchodilatatory)',
        'Intensywna opieka medyczna',
        'Profilaktyka powikłań'
      ];
      followUpRecommendations = [
        'Monitorowanie w warunkach szpitalnych',
        'RTG co 1-2 tygodnie',
        'Spirometria co miesiąc',
        'HRCT co 2-3 miesiące',
        'Gazometria co tydzień',
        'Ocena kwalifikacji do transplantacji',
        'Rehabilitacja oddechowa w warunkach kontrolowanych'
      ];
      radiologicalFeatures = [
        'Rozległe gęste zacienienia w większości pól płucnych',
        'Zatarcie struktur naczyniowych i oskrzelowych',
        'Liczne ogniska konsolidacji',
        'Możliwe zacienienia typu "plaster miodu"',
        'Cechy zwłóknienia płuc',
        'Ograniczenie przezierności płuc'
      ];
      prognosis = 'Poważne rokowanie. Wysokie ryzyko progresji do niewydolności oddechowej. Może wymagać transplantacji płuc.';
    }

    return {
      fieldScores,
      additionalScores,
      totalScore,
      maxScore: 21,
      severity,
      interpretation,
      clinicalCorrelation,
      recommendations,
      followUpRecommendations,
      radiologicalFeatures,
      prognosis,
      color
    };
  };

  const handleFieldScoreChange = (fieldId: string, score: number) => {
    setFieldScores(prev => ({
      ...prev,
      [fieldId]: score
    }));
  };

  const handleAdditionalCriteriaChange = (criteriaId: string, checked: boolean) => {
    setAdditionalCriteria(prev => ({
      ...prev,
      [criteriaId]: checked
    }));
  };

  const handleCalculate = () => {
    const calculatedResult = getResult(fieldScores, additionalCriteria);
    setResult(calculatedResult);
    setShowResult(true);
  };

  const handleReset = () => {
    setFieldScores({
      upperRight: 0,
      middleRight: 0,
      lowerRight: 0,
      upperLeft: 0,
      middleLeft: 0,
      lowerLeft: 0
    });
    setAdditionalCriteria({
      pleuralEffusion: false,
      lymphNodes: false
    });
    setResult(null);
    setShowResult(false);
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      'minimal': 'text-green-600 bg-green-50 border-green-200',
      'mild': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'moderate': 'text-orange-600 bg-orange-50 border-orange-200',
      'severe': 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[severity as keyof typeof colors] || colors.minimal;
  };

  const totalFieldScore = Object.values(fieldScores).reduce((sum, score) => sum + score, 0);
  const additionalScore = (additionalCriteria.pleuralEffusion ? 2 : 0) + (additionalCriteria.lymphNodes ? 1 : 0);
  const currentTotalScore = totalFieldScore + additionalScore;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-teal-100">
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
                <div className="p-2 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                Skala Biäterveld
              </h1>
              <p className="text-gray-600 text-sm">
                Radiologiczna ocena śródmiąższowej choroby płuc
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
            <div className="bg-white rounded-xl shadow-md border border-teal-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Informacje o skali
              </h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p><strong>Zastosowanie:</strong> Radiologiczna ocena zaawansowania śródmiąższowej choroby płuc</p>
                <p><strong>Podstawa:</strong> Analiza RTG klatki piersiowej w projekcji PA</p>
                <p><strong>Pola:</strong> 6 pól płucnych (po 3 z każdej strony)</p>
                <p><strong>Zakres:</strong> 0-21 punktów</p>
              </div>
            </div>

            {/* Current Score Display */}
            <div className="bg-white rounded-xl shadow-md border border-teal-100 p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {currentTotalScore}/21
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  Aktualny wynik w skali Biäterveld
                </div>
                <div className="space-y-1 text-xs text-gray-500">
                  <div>Pola płucne: {totalFieldScore}/18</div>
                  <div>Dodatkowe: {additionalScore}/3</div>
                </div>
              </div>
            </div>

            {/* Lung Field Diagram */}
            <div className="bg-white rounded-xl shadow-md border border-teal-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Schemat pól płucnych
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-700 mb-2">Prawa strona</div>
                  <div className="space-y-1">
                    <div className="p-2 bg-teal-50 border border-teal-200 rounded text-xs">Górne ({fieldScores.upperRight}/3)</div>
                    <div className="p-2 bg-teal-50 border border-teal-200 rounded text-xs">Środkowe ({fieldScores.middleRight}/3)</div>
                    <div className="p-2 bg-teal-50 border border-teal-200 rounded text-xs">Dolne ({fieldScores.lowerRight}/3)</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-700 mb-2">Lewa strona</div>
                  <div className="space-y-1">
                    <div className="p-2 bg-teal-50 border border-teal-200 rounded text-xs">Górne ({fieldScores.upperLeft}/3)</div>
                    <div className="p-2 bg-teal-50 border border-teal-200 rounded text-xs">Środkowe ({fieldScores.middleLeft}/3)</div>
                    <div className="p-2 bg-teal-50 border border-teal-200 rounded text-xs">Dolne ({fieldScores.lowerLeft}/3)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Calculator */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-md border border-teal-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Oceń zmiany radiologiczne w każdym polu płucnym:
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {lungFields.map((field) => (
                  <div key={field.id} className="space-y-3">
                    <div>
                      <h4 className="text-md font-semibold text-teal-700 mb-1">
                        {field.name}
                      </h4>
                      <p className="text-xs text-gray-500 mb-3">{field.anatomicalDescription}</p>
                    </div>
                    
                    <div className="space-y-2">
                      {scoreDescriptions.map((desc) => (
                        <label
                          key={`${field.id}-${desc.score}`}
                          className={`block p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                            fieldScores[field.id] === desc.score
                              ? 'border-teal-300 bg-teal-50 shadow-sm'
                              : 'border-gray-200 hover:border-teal-200 hover:bg-teal-25'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <input
                              type="radio"
                              name={field.id}
                              value={desc.score}
                              checked={fieldScores[field.id] === desc.score}
                              onChange={(e) => handleFieldScoreChange(field.id, parseInt(e.target.value))}
                              className="mt-1 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                            />
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 text-sm">
                                {desc.score} pkt - {desc.description}
                              </div>
                              <div className="text-xs text-gray-600 mt-1">{desc.details}</div>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional Criteria */}
              <div className="border-t pt-6">
                <h4 className="text-md font-semibold text-teal-700 mb-4">
                  Dodatkowe kryteria:
                </h4>
                <div className="space-y-3">
                  {additionalCriteriaList.map((criteria) => (
                    <label
                      key={criteria.id}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                        additionalCriteria[criteria.id]
                          ? 'border-teal-300 bg-teal-50 shadow-sm'
                          : 'border-gray-200 hover:border-teal-200 hover:bg-teal-25'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={additionalCriteria[criteria.id]}
                        onChange={(e) => handleAdditionalCriteriaChange(criteria.id, e.target.checked)}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900 text-sm">{criteria.name}</span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-teal-100 text-teal-800">
                            +{criteria.points} pkt
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">{criteria.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleCalculate}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg hover:from-teal-600 hover:to-blue-700 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <CheckCircle className="w-5 h-5 inline mr-2" />
                  Oceń zmiany radiologiczne
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
              result.color === 'yellow' ? 'border-yellow-200' :
              result.color === 'orange' ? 'border-orange-200' :
              result.color === 'red' ? 'border-red-200' :
              'border-gray-200'
            }`}>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Skala Biäterveld: {result.totalScore}/{result.maxScore}
                </h3>
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getSeverityColor(result.severity)}`}>
                  <span className="mr-2">
                    {result.severity === 'minimal' && '✅'}
                    {result.severity === 'mild' && '⚠️'}
                    {result.severity === 'moderate' && '🟠'}
                    {result.severity === 'severe' && '🚨'}
                  </span>
                  {result.interpretation}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Korelacja kliniczna:</h4>
                  <p className="text-gray-700 text-sm">{result.clinicalCorrelation}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Cechy radiologiczne:</h4>
                  <ul className="space-y-1">
                    {result.radiologicalFeatures.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Eye className="w-3 h-3 text-teal-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Rokowanie:</h4>
                  <p className="text-gray-700 text-sm">{result.prognosis}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Zalecenia diagnostyczne i terapeutyczne:</h4>
                  <ul className="space-y-2">
                    {result.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Kontrole i monitorowanie:</h4>
                  <ul className="space-y-2">
                    {result.followUpRecommendations.map((followUp, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Activity className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{followUp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {result.severity === 'severe' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-red-800 mb-1">
                        UWAGA: Ciężkie zmiany śródmiąższowe!
                      </p>
                      <p className="text-xs text-red-700">
                        Wynik wskazuje na zaawansowane zmiany śródmiąższowe wymagające pilnej diagnostyki i intensywnego leczenia pulmonologicznego.
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

export default BiaterveldCalculator;