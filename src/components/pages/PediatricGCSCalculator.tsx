import React, { useState } from 'react';
import { ArrowLeft, Baby, AlertTriangle, CheckCircle, RotateCcw, Eye, Mic, Hand } from 'lucide-react';

interface GCSComponent {
  category: 'eye' | 'verbal' | 'motor';
  score: number;
  label: string;
  description: string;
}

interface PediatricGCSResult {
  eyeScore: number;
  verbalScore: number;
  motorScore: number;
  totalScore: number;
  interpretation: string;
  severity: 'mild' | 'moderate' | 'severe';
  prognosis: string;
  managementRecommendations: string[];
  monitoringRecommendations: string[];
  color: string;
}

const PediatricGCSCalculator: React.FC = () => {  const [eyeScore, setEyeScore] = useState<number>(0);
  const [verbalScore, setVerbalScore] = useState<number>(0);
  const [motorScore, setMotorScore] = useState<number>(0);
  const [result, setResult] = useState<PediatricGCSResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const eyeOptions: GCSComponent[] = [
    {
      category: 'eye',
      score: 4,
      label: '4 punkty - Spontaniczne',
      description: 'Dziecko otwiera oczy spontanicznie'
    },
    {
      category: 'eye',
      score: 3,
      label: '3 punkty - Na głos',
      description: 'Otwiera oczy w odpowiedzi na głos'
    },
    {
      category: 'eye',
      score: 2,
      label: '2 punkty - Na ból',
      description: 'Otwiera oczy tylko w odpowiedzi na bodziec bólowy'
    },
    {
      category: 'eye',
      score: 1,
      label: '1 punkt - Brak reakcji',
      description: 'Brak otwierania oczu mimo bodźców'
    }
  ];

  const verbalOptions: GCSComponent[] = [
    {
      category: 'verbal',
      score: 5,
      label: '5 punktów - Odpowiednia reakcja',
      description: 'Płacz odpowiedni, uśmiech, podążanie wzrokiem, interakcja z otoczeniem'
    },
    {
      category: 'verbal',
      score: 4,
      label: '4 punkty - Płacz przy podrażnieniu',
      description: 'Płacz przy podrażnieniu, można dziecko pocieszyć'
    },
    {
      category: 'verbal',
      score: 3,
      label: '3 punkty - Sporadyczny płacz',
      description: 'Sporadyczny płacz i/lub stękanie'
    },
    {
      category: 'verbal',
      score: 2,
      label: '2 punkty - Niepokój',
      description: 'Niepokój, płacz rozdrażniony, trudno pocieszyć'
    },
    {
      category: 'verbal',
      score: 1,
      label: '1 punkt - Brak reakcji',
      description: 'Brak jakiejkolwiek reakcji słownej lub głosowej'
    }
  ];

  const motorOptions: GCSComponent[] = [
    {
      category: 'motor',
      score: 6,
      label: '6 punktów - Ruchy spontaniczne',
      description: 'Ruchy spontaniczne, celowe, adekwatne do wieku'
    },
    {
      category: 'motor',
      score: 5,
      label: '5 punktów - Wycofanie przy dotknięciu',
      description: 'Wycofanie kończyny przy dotknięciu'
    },
    {
      category: 'motor',
      score: 4,
      label: '4 punkty - Wycofanie przy bólu',
      description: 'Wycofanie kończyny w odpowiedzi na bodziec bólowy'
    },
    {
      category: 'motor',
      score: 3,
      label: '3 punkty - Postawa dekortykacyjna',
      description: 'Nieprawidłowa fleksja (postawa dekortykacyjna)'
    },
    {
      category: 'motor',
      score: 2,
      label: '2 punkty - Postawa decerebracyjna',
      description: 'Nieprawidłowa ekstensja (postawa decerebralcyjna)'
    },
    {
      category: 'motor',
      score: 1,
      label: '1 punkt - Brak reakcji',
      description: 'Brak jakiejkolwiek reakcji ruchowej'
    }
  ];

  const getResult = (eye: number, verbal: number, motor: number): PediatricGCSResult => {
    const totalScore = eye + verbal + motor;
    let severity: 'mild' | 'moderate' | 'severe';
    let interpretation: string;
    let color: string;
    let prognosis: string;
    let managementRecommendations: string[];
    let monitoringRecommendations: string[];

    if (totalScore >= 13) {
      severity = 'mild';
      interpretation = 'Łagodny uraz mózgu';
      color = 'yellow';
      prognosis = 'Bardzo dobre rokowanie. Większość dzieci wraca do pełnej sprawności bez trwałych następstw neurologicznych.';
      managementRecommendations = [
        'Obserwacja przez 24 godziny',
        'Regularne kontrole neurologiczne',
        'Leczenie objawowe (ból głowy, nudności)',
        'Stopniowy powrót do normalnej aktywności',
        'Unikanie kontaktowych sportów przez 1-2 tygodnie',
        'Edukacja rodziców nt. objawów pogorszenia'
      ];
      monitoringRecommendations = [
        'Kontrole GCS co 2-4 godziny przez pierwsze 24h',
        'Obserwacja objawów wzrostu ciśnienia wewnątrzczaszkowego',
        'Monitoring podstawowych funkcji życiowych',
        'Ocena reakcji źrenic'
      ];
    } else if (totalScore >= 9) {
      severity = 'moderate';
      interpretation = 'Umiarkowany uraz mózgu';
      color = 'orange';
      prognosis = 'Umiarkowane rokowanie. Możliwe przejściowe lub trwałe następstwa neurologiczne. Konieczna rehabilitacja.';
      managementRecommendations = [
        'Hospitalizacja na oddziale neurochirurgii/intensywnej terapii',
        'Obrazowanie mózgu (CT/MRI)',
        'Kontrola ciśnienia wewnątrzczaszkowego',
        'Leczenie przeciwobrzękowe (mannitol, roztwory hipertoniczne)',
        'Profilaktyka drgawek',
        'Fizjoterapia i rehabilitacja neurologiczna',
        'Długoterminowa opieka neurorehabilitacyjna'
      ];
      monitoringRecommendations = [
        'Ciągłe monitorowanie neurologiczne',
        'Kontrole GCS co 1-2 godziny',
        'Monitorowanie ciśnienia wewnątrzczaszkowego',
        'Regularne obrazowanie kontrolne',
        'Ocena funkcji poznawczych'
      ];
    } else {
      severity = 'severe';
      interpretation = 'Ciężki uraz mózgu';
      color = 'red';
      prognosis = 'Poważne rokowanie. Wysokie ryzyko zgonu lub ciężkich trwałych następstw neurologicznych. Konieczna intensywna terapia.';
      managementRecommendations = [
        'NATYCHMIASTOWA intensywna terapia neurochirurgiczna',
        'Intubacja i mechaniczne wspomaganie oddychania',
        'Monitorowanie i kontrola ciśnienia wewnątrzczaszkowego',
        'Neurochirurgiczne leczenie dekompresyjne',
        'Kontrola hipotermii terapeutycznej',
        'Profilaktyka i leczenie drgawek',
        'Kompleksowe wsparcie funkcji życiowych',
        'Długoterminowa rehabilitacja neurológica'
      ];
      monitoringRecommendations = [
        'Ciągłe monitorowanie w PICU',
        'Inwazyjne monitorowanie ciśnienia wewnątrzczaszkowego',
        'Kontrole GCS co 30-60 minut',
        'Monitorowanie perfuzji mózgowej',
        'Regularne obrazowanie mózgu',
        'EEG w przypadku podejrzenia drgawek',
        'Planowanie długoterminowej opieki'
      ];
    }

    return {
      eyeScore: eye,
      verbalScore: verbal,
      motorScore: motor,
      totalScore,
      interpretation,
      severity,
      prognosis,
      managementRecommendations,
      monitoringRecommendations,
      color
    };
  };

  const handleCalculate = () => {
    if (eyeScore === 0 || verbalScore === 0 || motorScore === 0) {
      alert('Proszę wybrać wartości dla wszystkich trzech kategorii.');
      return;
    }
    
    const calculatedResult = getResult(eyeScore, verbalScore, motorScore);
    setResult(calculatedResult);
    setShowResult(true);
  };

  const handleReset = () => {
    setEyeScore(0);
    setVerbalScore(0);
    setMotorScore(0);
    setResult(null);
    setShowResult(false);
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      'mild': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'moderate': 'text-orange-600 bg-orange-50 border-orange-200',
      'severe': 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[severity as keyof typeof colors] || colors.mild;
  };

  const allScoresSelected = eyeScore > 0 && verbalScore > 0 && motorScore > 0;
  const currentTotal = eyeScore + verbalScore + motorScore;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
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
                <div className="p-2 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full">
                  <Baby className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Pediatryczna Skala Glasgow
              </h1>
              <p className="text-gray-600 text-sm">
                Pediatric Glasgow Coma Scale
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
            <div className="bg-white rounded-xl shadow-md border border-pink-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Informacje o skali
              </h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p><strong>Zastosowanie:</strong> Ocena stanu świadomości u dzieci &lt;2 lat</p>
                <p><strong>Cel:</strong> Modyfikacja skali Glasgow dostosowana do możliwości rozwojowych małych dzieci</p>
                <p><strong>Komponenty:</strong> Otwieranie oczu (E) + Odpowiedź słowna (V) + Odpowiedź ruchowa (M)</p>
                <p><strong>Zakres:</strong> 3-15 punktów</p>
              </div>
            </div>

            {/* Current Score Display */}
            {allScoresSelected && (
              <div className="bg-white rounded-xl shadow-md border border-pink-100 p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {currentTotal}/15
                  </div>
                  <div className="text-sm text-gray-600">
                    E{eyeScore} + V{verbalScore} + M{motorScore}
                  </div>
                </div>
              </div>
            )}

            {/* Calculator Form */}
            <div className="bg-white rounded-xl shadow-md border border-pink-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Oceń najlepszą odpowiedź dziecka:
              </h3>
              
              {/* Eye Opening */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <Eye className="w-5 h-5 text-pink-600 mr-2" />
                  <h4 className="text-md font-semibold text-pink-700">
                    Otwieranie oczu (E):
                  </h4>
                </div>
                <div className="space-y-2">
                  {eyeOptions.map(option => (
                    <label
                      key={option.score}
                      className={`block p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                        eyeScore === option.score
                          ? 'border-pink-300 bg-pink-50 shadow-sm'
                          : 'border-gray-200 hover:border-pink-200 hover:bg-pink-25'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <input
                          type="radio"
                          name="eye"
                          value={option.score}
                          checked={eyeScore === option.score}
                          onChange={(e) => setEyeScore(parseInt(e.target.value))}
                          className="mt-1 h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 text-sm">{option.label}</div>
                          <div className="text-xs text-gray-600 mt-1">{option.description}</div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Verbal Response */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <Mic className="w-5 h-5 text-pink-600 mr-2" />
                  <h4 className="text-md font-semibold text-pink-700">
                    Odpowiedź słowna (V):
                  </h4>
                </div>
                <div className="space-y-2">
                  {verbalOptions.map(option => (
                    <label
                      key={option.score}
                      className={`block p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                        verbalScore === option.score
                          ? 'border-pink-300 bg-pink-50 shadow-sm'
                          : 'border-gray-200 hover:border-pink-200 hover:bg-pink-25'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <input
                          type="radio"
                          name="verbal"
                          value={option.score}
                          checked={verbalScore === option.score}
                          onChange={(e) => setVerbalScore(parseInt(e.target.value))}
                          className="mt-1 h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 text-sm">{option.label}</div>
                          <div className="text-xs text-gray-600 mt-1">{option.description}</div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Motor Response */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <Hand className="w-5 h-5 text-pink-600 mr-2" />
                  <h4 className="text-md font-semibold text-pink-700">
                    Odpowiedź ruchowa (M):
                  </h4>
                </div>
                <div className="space-y-2">
                  {motorOptions.map(option => (
                    <label
                      key={option.score}
                      className={`block p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                        motorScore === option.score
                          ? 'border-pink-300 bg-pink-50 shadow-sm'
                          : 'border-gray-200 hover:border-pink-200 hover:bg-pink-25'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <input
                          type="radio"
                          name="motor"
                          value={option.score}
                          checked={motorScore === option.score}
                          onChange={(e) => setMotorScore(parseInt(e.target.value))}
                          className="mt-1 h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 text-sm">{option.label}</div>
                          <div className="text-xs text-gray-600 mt-1">{option.description}</div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handleCalculate}
                  disabled={!allScoresSelected}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    allScoresSelected
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle className="w-5 h-5 inline mr-2" />
                  Oceń Pediatryczną GCS
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
                  result.color === 'yellow' ? 'border-yellow-200' :
                  result.color === 'orange' ? 'border-orange-200' :
                  result.color === 'red' ? 'border-red-200' :
                  'border-gray-200'
                }`}>
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Pediatryczna GCS: {result.totalScore}/15
                    </h3>
                    <div className="text-sm text-gray-600 mb-3">
                      E{result.eyeScore} + V{result.verbalScore} + M{result.motorScore}
                    </div>
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getSeverityColor(result.severity)}`}>
                      <span className="mr-2">
                        {result.severity === 'mild' && '⚠️'}
                        {result.severity === 'moderate' && '🟠'}
                        {result.severity === 'severe' && '🚨'}
                      </span>
                      {result.interpretation}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Rokowanie:</h4>
                    <p className="text-gray-700 text-sm">{result.prognosis}</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Postępowanie:</h4>
                    <ul className="space-y-2">
                      {result.managementRecommendations.map((recommendation, index) => (
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
                      {result.monitoringRecommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Baby className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {result.severity === 'severe' && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-red-800 mb-1">
                            UWAGA: Ciężki uraz mózgu!
                          </p>
                          <p className="text-xs text-red-700">
                            Wynik GCS ≤8 wskazuje na ciężki uraz mózgu. Konieczna natychmiastowa intensywna terapia neurochirurgiczna.
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
                  Pediatryczna Skala Glasgow
                </h3>
                <p className="text-gray-500 mb-4">
                  Wybierz wartości dla wszystkich trzech kategorii i kliknij "Oceń Pediatryczną GCS"
                </p>
                <div className="text-sm text-gray-600">
                  Wybrane: E{eyeScore} V{verbalScore} M{motorScore} = {currentTotal}/15
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PediatricGCSCalculator;