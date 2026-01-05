import React, { useState } from 'react';
import { ArrowLeft, Stethoscope, AlertTriangle, CheckCircle, RotateCcw, Activity } from 'lucide-react';

interface AlvaradoCriteria {
  id: string;
  symptom: string;
  points: number;
  description: string;
}

interface AlvaradoResult {
  totalScore: number;
  risk: 'low' | 'intermediate' | 'high';
  probability: string;
  interpretation: string;
  recommendations: string[];
  diagnosticRecommendations: string[];
  treatmentRecommendations: string[];
  color: string;
}

const AlvaradoCalculator: React.FC = () => {  const [selectedCriteria, setSelectedCriteria] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<AlvaradoResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const alvaradoCriteria: AlvaradoCriteria[] = [
    {
      id: 'migration',
      symptom: 'Migracja bólu',
      points: 1,
      description: 'Ból rozpoczyna się w okolicy pępkowej, następnie przesuwa się do prawego dołu biodrowego'
    },
    {
      id: 'anorexia',
      symptom: 'Brak apetytu (anoreksja)',
      points: 1,
      description: 'Pacjent nie ma ochoty na jedzenie, odmawia pokarmów'
    },
    {
      id: 'nausea_vomiting',
      symptom: 'Nudności i wymioty',
      points: 1,
      description: 'Występowanie nudności lub wymiotów w przebiegu choroby'
    },
    {
      id: 'tenderness_rlq',
      symptom: 'Tkliwość w prawym dole biodrowym',
      points: 2,
      description: 'Bolesność uciskowa w punkcie McBurneya i okolicy prawego dołu biodrowego'
    },
    {
      id: 'rebound_pain',
      symptom: 'Objaw Blumberga',
      points: 1,
      description: 'Ból odbijający (rebound) - nasilenie bólu po gwałtownym zwolnieniu ucisku'
    },
    {
      id: 'temperature',
      symptom: 'Gorączka ≥37,3°C',
      points: 1,
      description: 'Podwyższona temperatura ciała ≥37,3°C (99,1°F)'
    },
    {
      id: 'leukocytosis',
      symptom: 'Leukocytoza ≥10 000/μl',
      points: 2,
      description: 'Podwyższona liczba leukocytów we krwi ≥10 000/μl'
    },
    {
      id: 'shift_left',
      symptom: 'Przesunięcie leukocytarne w lewo',
      points: 1,
      description: 'Neutrofilia >75% lub obecność form młodszych neutrofili'
    }
  ];

  const getResult = (totalScore: number): AlvaradoResult => {
    if (totalScore <= 4) {
      return {
        totalScore,
        risk: 'low',
        probability: '<25%',
        interpretation: 'Niskie prawdopodobieństwo ostrego zapalenia wyrostka robaczkowego',
        recommendations: [
          'Obserwacja kliniczna w warunkach ambulatoryjnych',
          'Instruktaż pacjenta o objawach alarmowych',
          'Kontrola za 24-48 godzin lub wcześniej przy pogorszeniu',
          'Rozważenie alternatywnych diagnoz',
          'Dokumentacja przebiegu choroby',
          'Edukacja pacjenta i rodziny'
        ],
        diagnosticRecommendations: [
          'Podstawowe badania laboratoryjne (morfologia, CRP)',
          'Badanie ogólne moczu',
          'Rozważenie USG jamy brzusznej',
          'W przypadku kobiet - test ciążowy, konsultacja ginekologiczna',
          'Obserwacja dynamiki objawów klinicznych'
        ],
        treatmentRecommendations: [
          'Leczenie objawowe (leki przeciwbólowe, spazmalityczne)',
          'Dieta łatwo strawna, unikanie pokarmów drażniących',
          'Odpoczynek, unikanie wysiłku fizycznego',
          'Kontrola ambulatoryjna w przypadku braku poprawy'
        ],
        color: 'green'
      };
    } else if (totalScore <= 6) {
      return {
        totalScore,
        risk: 'intermediate',
        probability: '25-50%',
        interpretation: 'Umiarkowane prawdopodobieństwo ostrego zapalenia wyrostka robaczkowego',
        recommendations: [
          'Obserwacja w warunkach szpitalnych przez 12-24 godziny',
          'Regularne kontrole stanu klinicznego co 4-6 godzin',
          'Kontrolne badania laboratoryjne',
          'Konsultacja chirurgiczna',
          'Przygotowanie do ewentualnej interwencji chirurgicznej',
          'Ścisłe monitorowanie objawów'
        ],
        diagnosticRecommendations: [
          'Rozszerzona diagnostyka laboratoryjna',
          'USG jamy brzusznej przez doświadczonego diagnostę',
          'Rozważenie tomografii komputerowej brzucha',
          'Konsultacje specjalistyczne (chirurg, ginekolog)',
          'Powtórzenie skali Alvarado po 6-12 godzinach'
        ],
        treatmentRecommendations: [
          'Pozostawanie na czczo (NPO)',
          'Infuzjoterapia i.v.',
          'Leki przeciwbólowe z ostrożnością',
          'Przygotowanie przedoperacyjne',
          'Antybiotykoprofilaktyka w razie konieczności operacji'
        ],
        color: 'orange'
      };
    } else {
      return {
        totalScore,
        risk: 'high',
        probability: '>50%',
        interpretation: 'Wysokie prawdopodobieństwo ostrego zapalenia wyrostka robaczkowego',
        recommendations: [
          'PILNA konsultacja chirurgiczna',
          'Przygotowanie do operacji appendektomii',
          'Intensywne monitorowanie stanu pacjenta',
          'Przygotowanie przedoperacyjne (kwalifikacja anestezjologiczna)',
          'Antybiotykoprofilaktyka przedoperacyjna',
          'Informowanie pacjenta i rodziny o konieczności operacji',
          'Szybkie postępowanie w celu uniknięcia powikłań'
        ],
        diagnosticRecommendations: [
          'Pilne badania przedoperacyjne',
          'Morfologia, elektrolity, koagulogram',
          'Grupa krwi, próba krzyżowa',
          'USG lub CT brzucha dla potwierdzenia i oceny powikłań',
          'EKG, RTG klatki piersiowej',
          'Konsultacja anestezjologiczna'
        ],
        treatmentRecommendations: [
          'NATYCHMIASTOWE przygotowanie do appendektomii',
          'Pozostawanie na czczo',
          'Żylny dostęp, infuzjoterapia',
          'Antybiotyki przedoperacyjne (cefazolina + metronidazol)',
          'Leki przeciwbólowe po ustaleniu diagnozy',
          'Profilaktyka przeciwzakrzepowa',
          'Monitorowanie funkcji życiowych'
        ],
        color: 'red'
      };
    }
  };

  const handleCriteriaChange = (criteriaId: string, checked: boolean) => {
    const newSelected = new Set(selectedCriteria);
    if (checked) {
      newSelected.add(criteriaId);
    } else {
      newSelected.delete(criteriaId);
    }
    setSelectedCriteria(newSelected);
  };

  const handleCalculate = () => {
    const totalScore = Array.from(selectedCriteria).reduce((sum, criteriaId) => {
      const criteria = alvaradoCriteria.find(c => c.id === criteriaId);
      return sum + (criteria?.points || 0);
    }, 0);
    
    const calculatedResult = getResult(totalScore);
    setResult(calculatedResult);
    setShowResult(true);
  };

  const handleReset = () => {
    setSelectedCriteria(new Set());
    setResult(null);
    setShowResult(false);
  };

  const getRiskColor = (risk: string) => {
    const colors = {
      'low': 'text-green-600 bg-green-50 border-green-200',
      'intermediate': 'text-orange-600 bg-orange-50 border-orange-200',
      'high': 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[risk as keyof typeof colors] || colors.low;
  };

  const currentScore = Array.from(selectedCriteria).reduce((sum, criteriaId) => {
    const criteria = alvaradoCriteria.find(c => c.id === criteriaId);
    return sum + (criteria?.points || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-emerald-100">
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
                <div className="p-2 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Skala Alvarado
              </h1>
              <p className="text-gray-600 text-sm">
                Alvarado Score for Acute Appendicitis
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
            <div className="bg-white rounded-xl shadow-md border border-emerald-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Informacje o skali
              </h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p><strong>Zastosowanie:</strong> Ocena prawdopodobieństwa ostrego zapalenia wyrostka robaczkowego</p>
                <p><strong>Cel:</strong> Wspomaganie diagnostyki różnicowej bólu w prawym dole biodrowym</p>
                <p><strong>Zakres:</strong> 0-10 punktów</p>
                <p><strong>Interpretacja:</strong> ≤4 pkt = niskie ryzyko, 5-6 pkt = umiarkowane, ≥7 pkt = wysokie</p>
              </div>
            </div>

            {/* Current Score Display */}
            <div className="bg-white rounded-xl shadow-md border border-emerald-100 p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {currentScore}/10
                </div>
                <div className="text-sm text-gray-600">
                  Aktualny wynik w skali Alvarado
                </div>
              </div>
            </div>

            {/* Calculator Form */}
            <div className="bg-white rounded-xl shadow-md border border-emerald-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Zaznacz występujące objawy i cechy:
              </h3>
              
              <div className="space-y-3">
                {alvaradoCriteria.map(criteria => (
                  <label
                    key={criteria.id}
                    className={`block p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedCriteria.has(criteria.id)
                        ? 'border-emerald-300 bg-emerald-50 shadow-sm'
                        : 'border-gray-200 hover:border-emerald-200 hover:bg-emerald-25'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedCriteria.has(criteria.id)}
                        onChange={(e) => handleCriteriaChange(criteria.id, e.target.checked)}
                        className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900 text-sm">{criteria.symptom}</span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                            {criteria.points} pkt
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">{criteria.description}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Score Summary */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  Wybrane objawy: <strong>{selectedCriteria.size}</strong> | 
                  Łączna liczba punktów: <strong>{currentScore}/10</strong>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleCalculate}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <CheckCircle className="w-5 h-5 inline mr-2" />
                  Oceń ryzyko Alvarado
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
                      Skala Alvarado: {result.totalScore}/10
                    </h3>
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getRiskColor(result.risk)}`}>
                      <span className="mr-2">
                        {result.risk === 'low' && '✅'}
                        {result.risk === 'intermediate' && '⚠️'}
                        {result.risk === 'high' && '🚨'}
                      </span>
                      Prawdopodobieństwo: {result.probability}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Interpretacja:</h4>
                    <p className="text-gray-700 text-sm">{result.interpretation}</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Zalecenia ogólne:</h4>
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
                    <h4 className="font-semibold text-gray-900 mb-3">Diagnostyka:</h4>
                    <ul className="space-y-2">
                      {result.diagnosticRecommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Activity className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Leczenie:</h4>
                    <ul className="space-y-2">
                      {result.treatmentRecommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Stethoscope className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{recommendation}</span>
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
                            UWAGA: Wysokie ryzyko ostrego zapalenia wyrostka!
                          </p>
                          <p className="text-xs text-red-700">
                            Wynik ≥7 punktów wskazuje na wysokie prawdopodobieństwo ostrego zapalenia wyrostka robaczkowego. Konieczna pilna konsultacja chirurgiczna.
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
                  Skala Alvarado
                </h3>
                <p className="text-gray-500 mb-4">
                  Zaznacz występujące objawy i kliknij "Oceń ryzyko Alvarado"
                </p>
                <div className="text-sm text-gray-600">
                  Aktualny wynik: <span className="font-semibold">{currentScore}/10 punktów</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlvaradoCalculator;