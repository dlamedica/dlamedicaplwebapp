import React, { useState } from 'react';
import { ArrowLeft, Heart, AlertTriangle, CheckCircle, RotateCcw } from 'lucide-react';

interface ASAResult {
  classification: string;
  riskLevel: 'low' | 'moderate' | 'high' | 'severe' | 'critical' | 'special';
  description: string;
  recommendations: string[];
  color: string;
}

const ASACalculator: React.FC = () => {
  const [selectedASA, setSelectedASA] = useState<string>('');
  const [isEmergency, setIsEmergency] = useState(false);
  const [result, setResult] = useState<ASAResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const asaOptions = [
    {
      value: 'I',
      title: 'ASA I',
      description: 'Zdrowy pacjent bez chorób ogólnoustrojowych',
      details: 'Brak chorób organicznych, fizjologicznych, biochemicznych lub psychiatrycznych. Pacjent zdrowy, niepalący, niepijący alkoholu lub pijący minimalnie.'
    },
    {
      value: 'II',
      title: 'ASA II',
      description: 'Pacjent z łagodną chorobą ogólnoustrojową',
      details: 'Łagodne choroby systemowe bez ograniczenia funkcjonalnego (np. kontrolowane nadciśnienie, cukrzyca, łagodna astma).'
    },
    {
      value: 'III',
      title: 'ASA III',
      description: 'Pacjent z ciężką chorobą ogólnoustrojową ograniczającą aktywność, ale nie zagrażającą życiu',
      details: 'Ciężkie choroby systemowe z ograniczeniem funkcjonalnym (np. niestabilna choroba wieńcowa, niewydolność nerek).'
    },
    {
      value: 'IV',
      title: 'ASA IV',
      description: 'Pacjent z ciężką chorobą ogólnoustrojową stanowiącą stałe zagrożenie dla życia',
      details: 'Ciężkie choroby systemowe stanowiące stałe zagrożenie życia (np. niestabilna choroba wieńcowa, niewydolność wielonarządowa).'
    },
    {
      value: 'V',
      title: 'ASA V',
      description: 'Pacjent umierający, który prawdopodobnie nie przeżyje bez operacji',
      details: 'Pacjent umierający, który nie ma szansy na przeżycie bez operacji (np. pęknięcie tętniaka aorty, masywny uraz wielonarządowy).'
    },
    {
      value: 'VI',
      title: 'ASA VI',
      description: 'Pacjent ze stwierdzonym zgonem mózgu, którego narządy są pobierane do transplantacji',
      details: 'Pacjent ze stwierdzonym zgonem mózgowym, którego narządy są pobierane do celów transplantacyjnych.'
    }
  ];

  const getResult = (asaValue: string, emergency: boolean): ASAResult => {
    const emergency_suffix = emergency ? 'E' : '';
    const classification = `ASA ${asaValue}${emergency_suffix}`;

    const resultMap: Record<string, Omit<ASAResult, 'classification'>> = {
      'I': {
        riskLevel: 'low',
        description: 'Minimalne ryzyko anestezjologiczne. Pacjent zdrowy bez istotnych problemów medycznych.',
        recommendations: [
          'Standardowe monitorowanie podstawowe',
          'Możliwość zastosowania wszystkich technik anestezjologicznych',
          'Rutynowe badania przedoperacyjne zgodnie z protokołem',
          'Brak przeciwskazań do chirurgii ambulatoryjnej'
        ],
        color: 'green'
      },
      'II': {
        riskLevel: 'low',
        description: 'Niskie ryzyko anestezjologiczne. Łagodne choroby systemowe pod kontrolą.',
        recommendations: [
          'Standardowe monitorowanie z uwzględnieniem chorób współistniejących',
          'Możliwa optymalizacja leczenia schorzeń podstawowych',
          'Rozszerzone badania przedoperacyjne w zależności od schorzenia',
          'Możliwość chirurgii ambulatoryjnej po odpowiedniej ocenie'
        ],
        color: 'green'
      },
      'III': {
        riskLevel: 'moderate',
        description: 'Umiarkowanie zwiększone ryzyko anestezjologiczne. Ciężkie choroby z ograniczeniem funkcjonalnym.',
        recommendations: [
          'Rozszerzone monitorowanie anestezjologiczne',
          'Konsultacja specjalistyczna przed zabiegiem',
          'Optymalizacja stanu pacjenta przed operacją',
          'Rozważenie intensywnej opieki pooperacyjnej',
          'Ostrożność w wyborze techniki anestezjologicznej'
        ],
        color: 'yellow'
      },
      'IV': {
        riskLevel: 'high',
        description: 'Wysokie ryzyko anestezjologiczne. Ciężkie choroby stanowiące zagrożenie życia.',
        recommendations: [
          'Intensywne monitorowanie anestezjologiczne',
          'Obowiązkowa konsultacja specjalistyczna',
          'Maksymalna optymalizacja stanu przed zabiegiem',
          'Przygotowanie do intensywnej opieki pooperacyjnej',
          'Rozważenie regionalnych technik anestezjologicznych',
          'Dostępność specjalistycznego sprzętu i leków'
        ],
        color: 'red'
      },
      'V': {
        riskLevel: 'critical',
        description: 'Bardzo wysokie ryzyko anestezjologiczne. Pacjent umierający wymagający operacji ratującej życie.',
        recommendations: [
          'Maksymalne monitorowanie anestezjologiczne',
          'Zespół doświadczonych anestezjologów',
          'Natychmiastowa dostępność intensywnej terapii',
          'Minimalna, ale skuteczna anestezja',
          'Przygotowanie na komplikacje śródoperacyjne',
          'Pełna dostępność krwi i preparatów krwiopochodnych'
        ],
        color: 'red'
      },
      'VI': {
        riskLevel: 'special',
        description: 'Szczególna kategoria - pacjent ze zgonem mózgowym, pobieranie narządów do transplantacji.',
        recommendations: [
          'Specjalne protokoły dla dawców narządów',
          'Utrzymanie stabilności hemodynamicznej',
          'Specjalistyczne zespoły transplantacyjne',
          'Koordynacja z ośrodkami transplantacyjnymi',
          'Szczególne procedury konserwacji narządów'
        ],
        color: 'purple'
      }
    };

    return {
      classification,
      ...resultMap[asaValue]
    };
  };

  const handleCalculate = () => {
    if (!selectedASA) return;
    
    const calculatedResult = getResult(selectedASA, isEmergency);
    setResult(calculatedResult);
    setShowResult(true);
  };

  const handleReset = () => {
    setSelectedASA('');
    setIsEmergency(false);
    setResult(null);
    setShowResult(false);
  };


  const getRiskColor = (riskLevel: string) => {
    const colors = {
      'low': 'text-green-600 bg-green-50 border-green-200',
      'moderate': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'high': 'text-red-600 bg-red-50 border-red-200',
      'critical': 'text-red-800 bg-red-100 border-red-300',
      'special': 'text-purple-600 bg-purple-50 border-purple-200'
    };
    return colors[riskLevel as keyof typeof colors] || colors.low;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-red-100">
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
                <div className="p-2 bg-gradient-to-r from-red-400 to-pink-500 rounded-full">
                  <Heart className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                Skala ASA
              </h1>
              <p className="text-gray-600 text-sm">
                American Society of Anesthesiologists
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
            <div className="bg-white rounded-xl shadow-md border border-red-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Informacje o skali
              </h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p><strong>Zastosowanie:</strong> Ocena ryzyka przedoperacyjnego pacjenta</p>
                <p><strong>Cel:</strong> Klasyfikacja stanu fizycznego przed zabiegiem anestezjologicznym i chirurgicznym</p>
                <p><strong>Interpretacja:</strong> Im wyższa kategoria ASA, tym większe ryzyko anestezjologiczne</p>
              </div>
            </div>

            {/* Calculator Form */}
            <div className="bg-white rounded-xl shadow-md border border-red-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Wybierz stan fizyczny pacjenta:
              </h3>
              
              <div className="space-y-3">
                {asaOptions.map(option => (
                  <label
                    key={option.value}
                    className={`block p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedASA === option.value
                        ? 'border-red-300 bg-red-50 shadow-md'
                        : 'border-gray-200 hover:border-red-200 hover:bg-red-25'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="radio"
                        name="asa"
                        value={option.value}
                        checked={selectedASA === option.value}
                        onChange={(e) => setSelectedASA(e.target.value)}
                        className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-red-700">{option.title}:</span>
                          <span className="text-gray-900">{option.description}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{option.details}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Emergency Checkbox */}
              <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isEmergency}
                    onChange={(e) => setIsEmergency(e.target.checked)}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    <span className="font-medium text-orange-800">Zabieg pilny/nagły (E)</span>
                  </div>
                </label>
                <p className="text-sm text-orange-700 mt-1 ml-7">
                  Zaznacz jeśli zabieg ma charakter pilny lub nagły
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleCalculate}
                  disabled={!selectedASA}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    selectedASA
                      ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle className="w-5 h-5 inline mr-2" />
                  Oblicz ryzyko ASA
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
                  result.color === 'red' ? 'border-red-200' :
                  result.color === 'purple' ? 'border-purple-200' :
                  'border-gray-200'
                }`}>
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Wynik: {result.classification}
                    </h3>
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getRiskColor(result.riskLevel)}`}>
                      <span className="mr-2">
                        {result.riskLevel === 'low' && '✅'}
                        {result.riskLevel === 'moderate' && '⚠️'}
                        {result.riskLevel === 'high' && '🚨'}
                        {result.riskLevel === 'critical' && '⚠️'}
                        {result.riskLevel === 'special' && '🏥'}
                      </span>
                      Ryzyko {
                        result.riskLevel === 'low' ? 'niskie' :
                        result.riskLevel === 'moderate' ? 'umiarkowane' :
                        result.riskLevel === 'high' ? 'wysokie' :
                        result.riskLevel === 'critical' ? 'krytyczne' :
                        'szczególne'
                      }
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Opis:</h4>
                    <p className="text-gray-700">{result.description}</p>
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
              </>
            )}

            {!showResult && (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 text-center">
                <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Oczekiwanie na obliczenie
                </h3>
                <p className="text-gray-500">
                  Wybierz klasyfikację ASA i kliknij "Oblicz ryzyko ASA"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ASACalculator;