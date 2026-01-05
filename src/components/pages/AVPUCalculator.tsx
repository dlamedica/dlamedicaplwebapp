import React, { useState } from 'react';
import { ArrowLeft, Eye, AlertTriangle, CheckCircle, RotateCcw, Activity, Brain } from 'lucide-react';

interface AVPULevel {
  id: 'A' | 'V' | 'P' | 'U';
  name: string;
  fullName: string;
  description: string;
  clinicalSigns: string[];
  gcsCorrelation: string;
}

interface AVPUResult {
  level: AVPULevel;
  interpretation: string;
  urgency: 'low' | 'moderate' | 'high' | 'critical';
  recommendations: string[];
  treatmentPriorities: string[];
  monitoringRequirements: string[];
  differentialDiagnosis: string[];
  color: string;
}

const AVPUCalculator: React.FC = () => {  const [selectedLevel, setSelectedLevel] = useState<'A' | 'V' | 'P' | 'U' | null>(null);
  const [result, setResult] = useState<AVPUResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const avpuLevels: AVPULevel[] = [
    {
      id: 'A',
      name: 'Alert',
      fullName: 'Przytomny',
      description: 'Pacjent jest w pełni przytomny, orientacja zachowana, spontaniczne otwieranie oczu, odpowiednia odpowiedź na pytania',
      clinicalSigns: [
        'Spontaniczne otwieranie oczu',
        'Orientacja w miejscu, czasie i osobie',
        'Logiczne odpowiedzi na pytania',
        'Normalna mowa i zachowanie',
        'Adekwatne reakcje na bodźce',
        'Zachowane funkcje poznawcze'
      ],
      gcsCorrelation: 'GCS 15 punktów'
    },
    {
      id: 'V',
      name: 'Voice',
      fullName: 'Odpowiada na głos',
      description: 'Pacjent reaguje na bodźce słowne, może być splątany lub dezorientowany, otwiera oczy na wołanie, odpowiada na proste polecenia',
      clinicalSigns: [
        'Otwiera oczy na wołanie imienia',
        'Reaguje na polecenia słowne',
        'Może być splątany lub dezorientowany',
        'Odpowiedzi opóźnione lub nieadekwatne',
        'Potrzebuje powtarzania poleceń',
        'Może mieć zaburzoną orientację czasowo-przestrzenną'
      ],
      gcsCorrelation: 'GCS 11-14 punktów'
    },
    {
      id: 'P',
      name: 'Pain',
      fullName: 'Odpowiada na ból',
      description: 'Pacjent reaguje tylko na bodźce bólowe, brak reakcji na głos, może wydawać dźwięki lub poruszać się, wymaga stymulacji bólowej do reakcji',
      clinicalSigns: [
        'Brak reakcji na głos',
        'Reakcja tylko na bodźce bólowe',
        'Może wydawać nieartykułowane dźwięki',
        'Ruchy obronne lub cofanie się',
        'Możliwe otwieranie oczu na ból',
        'Brak spontanicznych reakcji'
      ],
      gcsCorrelation: 'GCS 7-10 punktów'
    },
    {
      id: 'U',
      name: 'Unresponsive',
      fullName: 'Bez reakcji',
      description: 'Brak jakiejkolwiek reakcji na żadne bodźce, stan nieprzytomności, wymaga natychmiastowej interwencji',
      clinicalSigns: [
        'Brak reakcji na głos',
        'Brak reakcji na bodźce bólowe',
        'Brak spontanicznych ruchów',
        'Możliwe zaburzenia oddychania',
        'Brak reakcji źrenic (możliwe)',
        'Stan śpiączki lub głębokiej nieprzytomności'
      ],
      gcsCorrelation: 'GCS 3-6 punktów'
    }
  ];

  const getResult = (level: AVPULevel): AVPUResult => {
    switch (level.id) {
      case 'A':
        return {
          level,
          interpretation: 'Stan świadomości prawidłowy. Pacjent w pełni przytomny i zorientowany.',
          urgency: 'low',
          recommendations: [
            'Kontynuacja standardowej opieki medycznej',
            'Regularne kontrole stanu świadomości',
            'Monitorowanie podstawowych funkcji życiowych',
            'Leczenie przyczyny podstawowej',
            'Edukacja pacjenta o stanie zdrowia',
            'Planowanie dalszego leczenia ambulatoryjnego'
          ],
          treatmentPriorities: [
            'Leczenie choroby podstawowej',
            'Kontrola bólu i dyskomfortu',
            'Utrzymanie homeostazy',
            'Prewencja powikłań',
            'Rehabilitacja jeśli wskazana'
          ],
          monitoringRequirements: [
            'Standardowe monitorowanie funkcji życiowych',
            'Obserwacja zmian stanu klinicznego',
            'Kontrola co 4-6 godzin lub wg potrzeb',
            'Ocena odpowiedzi na leczenie'
          ],
          differentialDiagnosis: [
            'Stan prawidłowy',
            'Lęk lub stres',
            'Ból przewlekły',
            'Lekkie zaburzenia metaboliczne'
          ],
          color: 'green'
        };

      case 'V':
        return {
          level,
          interpretation: 'Łagodne do umiarkowanych zaburzenia świadomości. Wymaga dalszej oceny przyczyny.',
          urgency: 'moderate',
          recommendations: [
            'Pogłębiona ocena neurologiczna',
            'Badania laboratoryjne (morfologia, elektrolity, glukoza)',
            'Ocena leków i substancji toksycznych',
            'Monitorowanie funkcji życiowych',
            'Rozważenie obrazowania mózgu',
            'Częstsze kontrole stanu świadomości',
            'Bezpieczne pozycjonowanie pacjenta'
          ],
          treatmentPriorities: [
            'Identyfikacja i leczenie przyczyny zaburzeń świadomości',
            'Stabilizacja funkcji życiowych',
            'Korekta zaburzeń metabolicznych',
            'Kontrola ciśnienia wewnątrzczaszkowego',
            'Ochrona dróg oddechowych'
          ],
          monitoringRequirements: [
            'Kontrole AVPU co 1-2 godziny',
            'Monitorowanie saturacji, HR, BP, RR',
            'Ocena reakcji źrenic',
            'Kontrola poziomu glukozy',
            'Obserwacja objawów neurologicznych'
          ],
          differentialDiagnosis: [
            'Zaburzenia metaboliczne (hipoglikemia, hiperglikemia)',
            'Intoksykacja alkoholowa lub lekowa',
            'Infekcje OUN (zapalenie opon, ropniak)',
            'Uraz głowy',
            'Hipoksja lub hiperkapnia',
            'Zaburzenia elektrolitowe'
          ],
          color: 'yellow'
        };

      case 'P':
        return {
          level,
          interpretation: 'Ciężkie zaburzenia świadomości. Wymaga pilnej diagnostyki i leczenia.',
          urgency: 'high',
          recommendations: [
            'PILNA konsultacja neurologiczna lub neurochirurgiczna',
            'Natychmiastowe badania laboratoryjne podstawowe',
            'Gazometria arterielna',
            'Obrazowanie mózgu (CT/MRI)',
            'Ocena i zabezpieczenie dróg oddechowych',
            'Dostęp żylny, infuzjoterapia',
            'Monitorowanie ciągłe w warunkach intensywnej opieki'
          ],
          treatmentPriorities: [
            'ABC - drożność dróg oddechowych, oddychanie, krążenie',
            'Identyfikacja przyczyny życie zagrażającej',
            'Kontrola ciśnienia wewnątrzczaszkowego',
            'Leczenie objawowe (drgawki, hiperthermia)',
            'Korekta zaburzeń metabolicznych',
            'Rozważenie intubacji i wentylacji mechanicznej'
          ],
          monitoringRequirements: [
            'Ciągłe monitorowanie w OIOM/OITN',
            'Kontrole AVPU co 15-30 minut',
            'Monitorowanie ICP jeśli wskazane',
            'Gazometria co 4-6h lub częściej',
            'Kontrola glikemii, elektrolitów',
            'EEG jeśli podejrzenie stanu padaczkowego'
          ],
          differentialDiagnosis: [
            'Uraz czaszkowo-mózgowy',
            'Udar mózgu (krwotoczny, niedokrwienny)',
            'Status epilepticus',
            'Ciężka hipoglikemia lub kwasica ketonowa',
            'Zatrucie (alkohol, leki, toksyny)',
            'Zapalenie opon mózgowo-rdzeniowych',
            'Hipoksja ciężka'
          ],
          color: 'orange'
        };

      case 'U':
        return {
          level,
          interpretation: 'Stan krytyczny - głęboka nieprzytomność. Zagrożenie życia. Wymaga natychmiastowej reanimacji.',
          urgency: 'critical',
          recommendations: [
            'NATYCHMIASTOWA reanimacja według algorytmu ABCDE',
            'Zabezpieczenie dróg oddechowych - rozważenie intubacji',
            'Wspomaganie oddychania i krążenia',
            'Pilny dostęp żylny, płynoterapia',
            'Natychmiastowe badania POC (glukoza, gazometria)',
            'Pilne obrazowanie mózgu (CT)',
            'Transfer do OIOM/OITN',
            'Powiadomienie zespołu stroke/trauma według wskazań'
          ],
          treatmentPriorities: [
            'Podstawowe czynności resuscytacyjne (ABC)',
            'Natychmiastowa korekta stanów zagrożenia życia',
            'Intubacja i wentylacja mechaniczna',
            'Stabilizacja hemodynamiczna',
            'Kontrola ciśnienia wewnątrzczaszkowego',
            'Leczenie drgawek jeśli obecne',
            'Neuroprotekcja'
          ],
          monitoringRequirements: [
            'Ciągłe monitorowanie multiparametryczne',
            'Inwazyjne monitorowanie ciśnienia tętniczego',
            'Monitorowanie ciśnienia wewnątrzczaszkowego',
            'Kontrola gazometrii co 2-4h',
            'EEG ciągłe jeśli wskazane',
            'Monitorowanie temperatury centralnej',
            'Kontrola diurezy godzinowej'
          ],
          differentialDiagnosis: [
            'Masywny udar mózgu',
            'Ciężki uraz czaszkowo-mózgowy',
            'Zatrzymanie krążenia z anoksją mózgu',
            'Status epilepticus niekonwulsyjny',
            'Ciężkie zatrucie (opiaty, benzodiazepiny)',
            'Śpiączka metaboliczna (wątrobowa, mocznicowa)',
            'Zapalenie mózgu',
            'Krwiak podtwardówkowy/nadtwardówkowy'
          ],
          color: 'red'
        };

      default:
        return getResult(avpuLevels[0]);
    }
  };

  const handleLevelChange = (levelId: 'A' | 'V' | 'P' | 'U') => {
    setSelectedLevel(levelId);
  };

  const handleCalculate = () => {
    if (!selectedLevel) return;
    
    const level = avpuLevels.find(l => l.id === selectedLevel)!;
    const calculatedResult = getResult(level);
    setResult(calculatedResult);
    setShowResult(true);
  };

  const handleReset = () => {
    setSelectedLevel(null);
    setResult(null);
    setShowResult(false);
  };

  const getUrgencyColor = (urgency: string) => {
    const colors = {
      'low': 'text-green-600 bg-green-50 border-green-200',
      'moderate': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'high': 'text-orange-600 bg-orange-50 border-orange-200',
      'critical': 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[urgency as keyof typeof colors] || colors.low;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-blue-100">
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
                <div className="p-2 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full">
                  <Eye className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Skala AVPU
              </h1>
              <p className="text-gray-600 text-sm">
                Alert, Voice, Pain, Unresponsive Scale
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
            <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Informacje o skali
              </h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p><strong>Zastosowanie:</strong> Szybka ocena poziomu świadomości w stanach nagłych</p>
                <p><strong>Cel:</strong> Uproszczona alternatywa dla skali Glasgow w ratownictwie medycznym</p>
                <p><strong>Poziomy:</strong> A - Alert, V - Voice, P - Pain, U - Unresponsive</p>
                <p><strong>Zalety:</strong> Szybka, łatwa w zastosowaniu, uniwersalna</p>
              </div>
            </div>

            {/* Current Selection */}
            {selectedLevel && (
              <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {selectedLevel}
                  </div>
                  <div className="text-sm text-gray-600">
                    {avpuLevels.find(l => l.id === selectedLevel)?.fullName}
                  </div>
                </div>
              </div>
            )}

            {/* Calculator Form */}
            <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Wybierz najlepszą odpowiedź pacjenta na bodźce:
              </h3>
              
              <div className="space-y-4">
                {avpuLevels.map(level => (
                  <label
                    key={level.id}
                    className={`block p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedLevel === level.id
                        ? 'border-blue-300 bg-blue-50 shadow-sm'
                        : 'border-gray-200 hover:border-blue-200 hover:bg-blue-25'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="radio"
                        name="avpu-level"
                        value={level.id}
                        checked={selectedLevel === level.id}
                        onChange={() => handleLevelChange(level.id)}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="font-bold text-2xl text-blue-600">
                            {level.id}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">
                              {level.name} - {level.fullName}
                            </div>
                            <div className="text-xs text-blue-600 font-medium">
                              {level.gcsCorrelation}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 mb-2">
                          {level.description}
                        </div>
                        <div className="text-xs text-gray-500">
                          <strong>Objawy:</strong> {level.clinicalSigns.slice(0, 3).join(', ')}
                          {level.clinicalSigns.length > 3 && '...'}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleCalculate}
                  disabled={!selectedLevel}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    selectedLevel
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle className="w-5 h-5 inline mr-2" />
                  Oceń poziom świadomości
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
                  result.color === 'yellow' ? 'border-yellow-200' :
                  result.color === 'orange' ? 'border-orange-200' :
                  result.color === 'red' ? 'border-red-200' :
                  'border-gray-200'
                }`}>
                  <div className="text-center mb-6">
                    <div className="text-5xl font-bold text-gray-900 mb-2">
                      {result.level.id}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {result.level.fullName}
                    </h3>
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getUrgencyColor(result.urgency)}`}>
                      <span className="mr-2">
                        {result.urgency === 'low' && '✅'}
                        {result.urgency === 'moderate' && '⚠️'}
                        {result.urgency === 'high' && '🟠'}
                        {result.urgency === 'critical' && '🚨'}
                      </span>
                      {result.urgency === 'low' ? 'Niskie zagrożenie' :
                       result.urgency === 'moderate' ? 'Umiarkowane zagrożenie' :
                       result.urgency === 'high' ? 'Wysokie zagrożenie' :
                       'Stan krytyczny'}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Interpretacja:</h4>
                    <p className="text-gray-700 text-sm">{result.interpretation}</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Korelacja z GCS:</h4>
                    <p className="text-blue-600 font-medium text-sm">{result.level.gcsCorrelation}</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Objawy kliniczne:</h4>
                    <ul className="space-y-2">
                      {result.level.clinicalSigns.map((sign, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Brain className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{sign}</span>
                        </li>
                      ))}
                    </ul>
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
                    <h4 className="font-semibold text-gray-900 mb-3">Priorytety leczenia:</h4>
                    <ul className="space-y-2">
                      {result.treatmentPriorities.map((priority, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Activity className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{priority}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Diagnostyka różnicowa:</h4>
                    <ul className="space-y-2">
                      {result.differentialDiagnosis.map((diagnosis, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Eye className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{diagnosis}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {result.urgency === 'critical' && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-red-800 mb-1">
                            UWAGA: Stan krytyczny - U (Unresponsive)!
                          </p>
                          <p className="text-xs text-red-700">
                            Pacjent bez reakcji wymaga natychmiastowej reanimacji według algorytmu ABCDE. Zagrożenie życia!
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
                <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Skala AVPU
                </h3>
                <p className="text-gray-500 mb-4">
                  Wybierz poziom odpowiedzi pacjenta i kliknij "Oceń poziom świadomości"
                </p>
                <div className="text-sm text-gray-600 space-y-1">
                  <div><strong>A</strong> - Alert (Przytomny)</div>
                  <div><strong>V</strong> - Voice (Odpowiada na głos)</div>
                  <div><strong>P</strong> - Pain (Odpowiada na ból)</div>
                  <div><strong>U</strong> - Unresponsive (Bez reakcji)</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AVPUCalculator;