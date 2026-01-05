import React, { useState } from 'react';
import { ArrowLeft, Baby, AlertTriangle, CheckCircle, RotateCcw, Activity, Heart } from 'lucide-react';

interface BishopParameter {
  id: string;
  name: string;
  options: BishopOption[];
}

interface BishopOption {
  score: number;
  description: string;
  details: string;
}

interface BishopResult {
  scores: Record<string, number>;
  totalScore: number;
  maxScore: number;
  maturity: 'immature' | 'partially_mature' | 'mature';
  interpretation: string;
  spontaneousLaborProbability: string;
  inductionRecommendation: string;
  recommendations: string[];
  clinicalImplications: string[];
  contraindications: string[];
  followUp: string[];
  color: string;
}

const BishopCalculator: React.FC = () => {  const [scores, setScores] = useState<Record<string, number>>({
    dilation: 0,
    effacement: 0,
    position: 0,
    consistency: 0,
    station: 0
  });
  const [result, setResult] = useState<BishopResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const bishopParameters: BishopParameter[] = [
    {
      id: 'dilation',
      name: 'Rozwarcie szyjki macicy',
      options: [
        { score: 0, description: 'Zamknięta (0 cm)', details: 'Szyjka macicy całkowicie zamknięta' },
        { score: 1, description: '1-2 cm', details: 'Niewielkie rozwarcie szyjki macicy' },
        { score: 2, description: '3-4 cm', details: 'Umiarkowane rozwarcie szyjki macicy' },
        { score: 3, description: '≥5 cm', details: 'Znaczne rozwarcie szyjki macicy' }
      ]
    },
    {
      id: 'effacement',
      name: 'Zacieranie szyjki macicy',
      options: [
        { score: 0, description: '0-30%', details: 'Szyjka gruba, słabo zacierana' },
        { score: 1, description: '40-50%', details: 'Umiarkowane zacieranie szyjki' },
        { score: 2, description: '60-70%', details: 'Zaawansowane zacieranie szyjki' },
        { score: 3, description: '≥80%', details: 'Szyjka cienka, niemal całkowicie zacierana' }
      ]
    },
    {
      id: 'position',
      name: 'Pozycja szyjki macicy',
      options: [
        { score: 0, description: 'Tylna', details: 'Szyjka skierowana ku krzyżowej ścianie miednicy' },
        { score: 1, description: 'Środkowa', details: 'Szyjka w pozycji centralnej' },
        { score: 2, description: 'Przednia', details: 'Szyjka skierowana ku symphysis pubis' }
      ]
    },
    {
      id: 'consistency',
      name: 'Konsystencja szyjki macicy',
      options: [
        { score: 0, description: 'Twarda', details: 'Szyjka o twardej konsystencji, sztywna' },
        { score: 1, description: 'Średnia', details: 'Szyjka o umiarkowanej konsystencji' },
        { score: 2, description: 'Miękka', details: 'Szyjka miękka, podatna na rozciągnięcie' }
      ]
    },
    {
      id: 'station',
      name: 'Wysokość części przodującej płodu',
      options: [
        { score: 0, description: '-3 (wysoko)', details: 'Część przodująca wysoko nad równią wejścia do miednicy' },
        { score: 1, description: '-2', details: 'Część przodująca powyżej równi wejścia do miednicy' },
        { score: 2, description: '-1, 0', details: 'Część przodująca na wysokości równi wejścia lub poniżej' },
        { score: 3, description: '+1, +2 (nisko)', details: 'Część przodująca nisko, poniżej równi wejścia do miednicy' }
      ]
    }
  ];

  const getResult = (scores: Record<string, number>): BishopResult => {
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    
    let maturity: 'immature' | 'partially_mature' | 'mature';
    let interpretation: string;
    let color: string;
    let spontaneousLaborProbability: string;
    let inductionRecommendation: string;
    let recommendations: string[];
    let clinicalImplications: string[];
    let contraindications: string[];
    let followUp: string[];

    if (totalScore <= 5) {
      maturity = 'immature';
      interpretation = 'Szyjka niedojrzała - niekorzystne warunki do indukcji porodu';
      color = 'red';
      spontaneousLaborProbability = '~50% w ciągu 24 godzin';
      inductionRecommendation = 'Niezalecana bez przygotowania szyjki';
      recommendations = [
        'Przygotowanie szyjki macicy (prostaglandyny E2 lub E1)',
        'Balon Foley\'a lub laminaria dla dojrzewania mechanicznego',
        'Rozważenie cesarskiego cięcia przy pilnych wskazaniach',
        'Ponowna ocena Bishop po 12-24h przygotowania',
        'Unikanie forsownej indukcji',
        'Ścisłe monitorowanie stanu płodu',
        'Informowanie pacjentki o zwiększonym ryzyku powikłań'
      ];
      clinicalImplications = [
        'Zwiększone ryzyko niepowodzenia indukcji (50-70%)',
        'Wydłużony czas porodu',
        'Zwiększone ryzyko cesarskiego cięcia',
        'Możliwe powikłania: infekcja, krwawienie',
        'Wyższe koszty hospitalizacji'
      ];
      contraindications = [
        'Względne przeciwwskazania do indukcji',
        'Konieczne szczególne wskazania medyczne',
        'Unikać w przypadku wcześniejszych operacji macicy',
        'Ostrożność przy nieprawidłowym położeniu płodu'
      ];
      followUp = [
        'Kontrola stanu szyjki co 12-24h',
        'Monitorowanie CTG',
        'Ocena postępu po zastosowaniu metod dojrzewania',
        'Przygotowanie do cesarskiego cięcia w razie potrzeby'
      ];
    } else if (totalScore <= 8) {
      maturity = 'partially_mature';
      interpretation = 'Szyjka częściowo dojrzała - umiarkowane warunki do indukcji';
      color = 'orange';
      spontaneousLaborProbability = '~70% w ciągu 24 godzin';
      inductionRecommendation = 'Możliwa indukcja z przygotowaniem szyjki';
      recommendations = [
        'Możliwa indukcja z ostrożnym przygotowaniem szyjki',
        'Rozważenie krótszego przygotowania prostaglandynami',
        'Amniotomia jeśli błony owodniowe napięte',
        'Powolne zwiększanie dawki oksytocyny',
        'Regularne oceny postępu porodu',
        'Przygotowanie do cesarskiego cięcia',
        'Informowanie o umiarkowanym ryzyku'
      ];
      clinicalImplications = [
        'Umiarkowane ryzyko niepowodzenia indukcji (30-50%)',
        'Średni czas trwania porodu',
        'Możliwość powodzenia indukcji przy właściwym postępowaniu',
        'Ryzyko powikłań niższe niż przy niedojrzałej szyjce'
      ];
      contraindications = [
        'Standardowe przeciwwskazania do indukcji',
        'Ostrożność przy nieprawidłowościach w wywiadzie położniczym',
        'Szczególna uwaga przy przebytych operacjach'
      ];
      followUp = [
        'Monitorowanie postępu porodu co 2-4h',
        'CTG ciągłe podczas indukcji',
        'Ocena stanu szyjki po rozpoczęciu indukcji',
        'Przygotowanie do interwencji w przypadku braku postępu'
      ];
    } else {
      maturity = 'mature';
      interpretation = 'Szyjka dojrzała - korzystne warunki do indukcji porodu';
      color = 'green';
      spontaneousLaborProbability = '~95% w ciągu 24 godzin';
      inductionRecommendation = 'Korzystne warunki - indukcja zalecana';
      recommendations = [
        'Bezpieczna indukcja porodu bez przygotowania szyjki',
        'Możliwa amniotomia jako pierwsza metoda',
        'Niskie dawki oksytocyny zwykle wystarczające',
        'Wysokie prawdopodobieństwo porodów drogami natury',
        'Standardowe monitorowanie porodu',
        'Rutynowe postępowanie położnicze',
        'Optymalne warunki dla pacjentki'
      ];
      clinicalImplications = [
        'Wysokie prawdopodobieństwo powodzenia indukcji (90-95%)',
        'Krótszy czas indukcji i porodu',
        'Niskie ryzyko cesarskiego cięcia',
        'Minimalne ryzyko powikłań',
        'Korzystny stosunek kosztów do korzyści'
      ];
      contraindications = [
        'Tylko standardowe przeciwwskazania do indukcji',
        'Bezpieczna indukcja w większości przypadków',
        'Minimalne ryzyko powikłań'
      ];
      followUp = [
        'Standardowe monitorowanie porodu',
        'CTG podczas indukcji według protokołu',
        'Regulne oceny postępu',
        'Przygotowanie do normalnego przebiegu porodu'
      ];
    }

    return {
      scores,
      totalScore,
      maxScore: 13,
      maturity,
      interpretation,
      spontaneousLaborProbability,
      inductionRecommendation,
      recommendations,
      clinicalImplications,
      contraindications,
      followUp,
      color
    };
  };

  const handleScoreChange = (parameterId: string, score: number) => {
    setScores(prev => ({
      ...prev,
      [parameterId]: score
    }));
  };

  const handleCalculate = () => {
    const calculatedResult = getResult(scores);
    setResult(calculatedResult);
    setShowResult(true);
  };

  const handleReset = () => {
    setScores({
      dilation: 0,
      effacement: 0,
      position: 0,
      consistency: 0,
      station: 0
    });
    setResult(null);
    setShowResult(false);
  };

  const getMaturityColor = (maturity: string) => {
    const colors = {
      'mature': 'text-green-600 bg-green-50 border-green-200',
      'partially_mature': 'text-orange-600 bg-orange-50 border-orange-200',
      'immature': 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[maturity as keyof typeof colors] || colors.immature;
  };

  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const allParametersCompleted = Object.values(scores).every(score => score !== undefined);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-rose-100">
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
                <div className="p-2 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full">
                  <Baby className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                Skala Bishopa
              </h1>
              <p className="text-gray-600 text-sm">
                Bishop Score - Ocena dojrzałości szyjki macicy
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
            <div className="bg-white rounded-xl shadow-md border border-rose-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Informacje o skali
              </h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p><strong>Zastosowanie:</strong> Ocena gotowości szyjki macicy do porodu i indukcji</p>
                <p><strong>Parametry:</strong> 5 parametrów ocenianych podczas badania ginekologicznego</p>
                <p><strong>Zakres:</strong> 0-13 punktów</p>
                <p><strong>Znaczenie:</strong> ≤5 niedojrzała, 6-8 częściowo dojrzała, ≥9 dojrzała</p>
              </div>
            </div>

            {/* Current Score Display */}
            {allParametersCompleted && (
              <div className="bg-white rounded-xl shadow-md border border-rose-100 p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {totalScore}/13
                  </div>
                  <div className="text-sm text-gray-600">
                    Aktualny wynik w skali Bishopa
                  </div>
                </div>
              </div>
            )}

            {/* Calculator Form */}
            <div className="bg-white rounded-xl shadow-md border border-rose-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Oceń każdy parametr podczas badania ginekologicznego:
              </h3>
              
              {bishopParameters.map((parameter) => (
                <div key={parameter.id} className="mb-6">
                  <h4 className="text-md font-semibold text-rose-700 mb-3">
                    {parameter.name}:
                  </h4>
                  <div className="space-y-2">
                    {parameter.options.map((option) => (
                      <label
                        key={`${parameter.id}-${option.score}`}
                        className={`block p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                          scores[parameter.id] === option.score
                            ? 'border-rose-300 bg-rose-50 shadow-sm'
                            : 'border-gray-200 hover:border-rose-200 hover:bg-rose-25'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <input
                            type="radio"
                            name={parameter.id}
                            value={option.score}
                            checked={scores[parameter.id] === option.score}
                            onChange={(e) => handleScoreChange(parameter.id, parseInt(e.target.value))}
                            className="mt-1 h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 text-sm">
                              {option.score} punkt{option.score !== 1 ? (option.score >= 2 && option.score <= 4 ? 'y' : 'ów') : ''} - {option.description}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">{option.details}</div>
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
                      ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:from-rose-600 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle className="w-5 h-5 inline mr-2" />
                  Oceń dojrzałość szyjki
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
                      Skala Bishopa: {result.totalScore}/{result.maxScore}
                    </h3>
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getMaturityColor(result.maturity)}`}>
                      <span className="mr-2">
                        {result.maturity === 'mature' && '✅'}
                        {result.maturity === 'partially_mature' && '⚠️'}
                        {result.maturity === 'immature' && '🚨'}
                      </span>
                      {result.maturity === 'mature' ? 'Szyjka dojrzała' :
                       result.maturity === 'partially_mature' ? 'Częściowo dojrzała' :
                       'Szyjka niedojrzała'}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Interpretacja:</h4>
                    <p className="text-gray-700 text-sm">{result.interpretation}</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Prawdopodobieństwo spontanicznego porodu:</h4>
                    <p className="text-rose-600 font-medium text-sm">{result.spontaneousLaborProbability}</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Zalecenia dotyczące indukcji:</h4>
                    <p className="text-gray-700 text-sm mb-3">{result.inductionRecommendation}</p>
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
                    <h4 className="font-semibold text-gray-900 mb-3">Implikacje kliniczne:</h4>
                    <ul className="space-y-2">
                      {result.clinicalImplications.map((implication, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Heart className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{implication}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Monitorowanie i kontrole:</h4>
                    <ul className="space-y-2">
                      {result.followUp.map((followUp, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Activity className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{followUp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {result.maturity === 'immature' && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-red-800 mb-1">
                            UWAGA: Szyjka niedojrzała!
                          </p>
                          <p className="text-xs text-red-700">
                            Wynik ≤5 punktów wskazuje na niekorzystne warunki do indukcji. Zalecane przygotowanie szyjki przed indukcją porodu.
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
                <Baby className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Skala Bishopa
                </h3>
                <p className="text-gray-500 mb-4">
                  Oceń wszystkie parametry szyjki macicy i kliknij "Oceń dojrzałość szyjki"
                </p>
                <div className="text-sm text-gray-600">
                  Aktualny wynik: {totalScore}/13 punktów
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BishopCalculator;