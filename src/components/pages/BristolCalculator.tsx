import React, { useState } from 'react';
import { ArrowLeft, Stethoscope, AlertTriangle, CheckCircle, RotateCcw } from 'lucide-react';

interface BristolResult {
  type: number;
  classification: string;
  description: string;
  interpretation: string;
  dietaryRecommendations: string[];
  medicalConsiderations: string[];
  color: string;
}

const BristolCalculator: React.FC = () => {  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [result, setResult] = useState<BristolResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const bristolTypes = [
    {
      type: 1,
      title: 'Typ 1',
      description: 'Osobne twarde grudki, jak orzechy',
      details: 'Bardzo trudne do wydalenia. Wskazuje na ciężkie zaparcie. Stolec bardzo długo pozostawał w jelicie grubym.'
    },
    {
      type: 2,
      title: 'Typ 2',
      description: 'W kształcie kiełbasy, ale grudkowaty',
      details: 'Trudny do wydalenia. Wskazuje na zaparcie. Kombinacja twardych grudek połączonych razem.'
    },
    {
      type: 3,
      title: 'Typ 3',
      description: 'Jak kiełbasa, ale z pęknięciami na powierzchni',
      details: 'Normalny kształt, ale z widocznymi pęknięciami. Może wskazywać na lekkie zaparcie lub normę.'
    },
    {
      type: 4,
      title: 'Typ 4',
      description: 'Jak kiełbasa lub wąż, gładki i miękki',
      details: 'IDEALNY STOLEC. Łatwy do wydalenia, gładka powierzchnia, prawidłowa konsystencja.'
    },
    {
      type: 5,
      title: 'Typ 5',
      description: 'Miękkie grudki z wyraźnymi brzegami',
      details: 'Łatwy do wydalenia. Może wskazywać na lekką biegunkę lub przejście ku biegunce.'
    },
    {
      type: 6,
      title: 'Typ 6',
      description: 'Puszysty kawałki z postrzępionymi brzegami',
      details: 'Papkowaty, bez wyraźnego kształtu. Wskazuje na biegunkę. Trudny do kontrolowania.'
    },
    {
      type: 7,
      title: 'Typ 7',
      description: 'Wodny, bez stałych kawałków, całkowicie płynny',
      details: 'Całkowicie płynny stolec. Wskazuje na ostrą biegunkę. Brak kontroli nad wypróżnieniem.'
    }
  ];

  const getResult = (type: number): BristolResult => {
    const resultMap: Record<number, Omit<BristolResult, 'type'>> = {
      1: {
        classification: 'Ciężkie zaparcie',
        description: 'Stolec bardzo twardy, trudny do wydalenia. Wskazuje na poważne zaparcie.',
        interpretation: 'Wyraźne zaparcie - stolec zbyt długo pozostawał w jelicie grubym',
        dietaryRecommendations: [
          'Zwiększ spożycie błonnika (warzywa, owoce, produkty pełnoziarniste)',
          'Pij więcej wody (minimum 2 litry dziennie)',
          'Dodaj suszone śliwki, figi lub inne naturalne przeczyszczające owoce',
          'Zwiększ aktywność fizyczną',
          'Regularne posiłki o stałych porach'
        ],
        medicalConsiderations: [
          'Rozważ konsultację z lekarzem przy długotrwałym zaparciu',
          'Możliwość zastosowania łagodnych środków przeczyszczających',
          'Wykluczenie przyczyn organicznych zaparcia',
          'Ocena leków mogących powodować zaparcia'
        ],
        color: 'red'
      },
      2: {
        classification: 'Zaparcie',
        description: 'Stolec twardy, grudkowaty, trudny do wydalenia.',
        interpretation: 'Zaparcie - stolec za długo pozostawał w jelicie',
        dietaryRecommendations: [
          'Zwiększ spożycie błonnika stopniowo',
          'Pij dużo wody przez cały dzień',
          'Włącz do diety pełnoziarniste produkty',
          'Jedz więcej owoców i warzyw',
          'Rozważ probiotyki'
        ],
        medicalConsiderations: [
          'Monitoruj częstość wypróżnień',
          'Przy braku poprawy - konsultacja lekarska',
          'Możliwość zastosowania łagodnych środków przeczyszczających'
        ],
        color: 'orange'
      },
      3: {
        classification: 'Lekkie zaparcie / Dolna granica normy',
        description: 'Stolec o normalnym kształcie, ale z widocznymi pęknięciami.',
        interpretation: 'Lekkie zaparcie lub dolna granica prawidłowości',
        dietaryRecommendations: [
          'Zwiększ płyny w diecie',
          'Więcej warzyw i owoców',
          'Regularne posiłki',
          'Umiarkowana aktywność fizyczna'
        ],
        medicalConsiderations: [
          'Obserwacja przez kilka dni',
          'Przy pogorszeniu - wprowadź zmiany dietetyczne'
        ],
        color: 'yellow'
      },
      4: {
        classification: 'IDEALNY STOLEC',
        description: 'Perfekt! Gładki, miękki, łatwy do wydalenia.',
        interpretation: 'Prawidłowy stolec - idealna konsystencja i forma',
        dietaryRecommendations: [
          'Kontynuuj obecną dietę',
          'Utrzymuj regularne nawyki żywieniowe',
          'Pij odpowiednią ilość wody',
          'Zachowaj aktywność fizyczną'
        ],
        medicalConsiderations: [
          'Brak konieczności interwencji medycznej',
          'Idealny stan jelit'
        ],
        color: 'green'
      },
      5: {
        classification: 'Lekka biegunka / Górna granica normy',
        description: 'Miękkie grudki, łatwe do wydalenia.',
        interpretation: 'Lekka biegunka lub górna granica prawidłowości',
        dietaryRecommendations: [
          'Ogranicz tłuste i ostre potrawy',
          'Zwiększ spożycie produktów wiążących (ryż, banany)',
          'Pij dużo płynów z elektrolitami',
          'Unikaj alkoholu i kofeiny'
        ],
        medicalConsiderations: [
          'Obserwacja przez 24-48 godzin',
          'Przy nasileniu objawów - konsultacja lekarska'
        ],
        color: 'yellow'
      },
      6: {
        classification: 'Biegunka',
        description: 'Papkowaty stolec, trudny do kontrolowania.',
        interpretation: 'Wyraźna biegunka - przyspieszone pasaż przez jelito',
        dietaryRecommendations: [
          'Dieta BRAT (banany, ryż, jabłka, tosty)',
          'Dużo płynów z elektrolitami',
          'Unikaj mleka i produktów mlecznych',
          'Małe, częste posiłki',
          'Tymczasowe wykluczenie błonnika'
        ],
        medicalConsiderations: [
          'Monitoruj objawy odwodnienia',
          'Przy utrzymywaniu >24h - konsultacja lekarska',
          'Rozważ probiotyki po ustąpieniu objawów'
        ],
        color: 'orange'
      },
      7: {
        classification: 'Ostra biegunka',
        description: 'Całkowicie płynny stolec, brak kontroli.',
        interpretation: 'Ostra biegunka - wymaga natychmiastowej uwagi',
        dietaryRecommendations: [
          'Przede wszystkim nawodnienie!',
          'Płyny z elektrolitami (np. Orsalit)',
          'Jasne buliony, herbatki',
          'Tymczasowo unikaj stałego jedzenia',
          'Stopniowe wprowadzanie łagodnych pokarmów'
        ],
        medicalConsiderations: [
          'PILNA konsultacja lekarska przy utrzymywaniu >12h',
          'Monitoruj objawy odwodnienia',
          'Możliwość zakażenia - badanie kału',
          'U dzieci i starszych osób - natychmiastowa opieka medyczna'
        ],
        color: 'red'
      }
    };

    return {
      type,
      classification: resultMap[type].classification,
      description: resultMap[type].description,
      interpretation: resultMap[type].interpretation,
      dietaryRecommendations: resultMap[type].dietaryRecommendations,
      medicalConsiderations: resultMap[type].medicalConsiderations,
      color: resultMap[type].color
    };
  };

  const handleCalculate = () => {
    if (selectedType === null) return;
    
    const calculatedResult = getResult(selectedType);
    setResult(calculatedResult);
    setShowResult(true);
  };

  const handleReset = () => {
    setSelectedType(null);
    setResult(null);
    setShowResult(false);
  };

  const getTypeColor = (type: number) => {
    if (type <= 2) return 'text-red-600 bg-red-50 border-red-200';
    if (type === 3) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (type === 4) return 'text-green-600 bg-green-50 border-green-200';
    if (type === 5) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-orange-600 bg-orange-50 border-orange-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
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
                <div className="p-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Bristolska Skala Stolca
              </h1>
              <p className="text-gray-600 text-sm">
                Bristol Stool Form Scale
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
                <p><strong>Zastosowanie:</strong> Obiektywna ocena konsystencji stolca</p>
                <p><strong>Cel:</strong> Standardowa klasyfikacja formy stolca w gastroenterologii</p>
                <p><strong>Interpretacja:</strong> Typ 1-2 (zaparcie), Typ 3-4 (norma), Typ 5-7 (biegunka)</p>
              </div>
            </div>

            {/* Calculator Form */}
            <div className="bg-white rounded-xl shadow-md border border-green-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Wybierz typ stolca:
              </h3>
              
              <div className="space-y-3">
                {bristolTypes.map(option => (
                  <label
                    key={option.type}
                    className={`block p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedType === option.type
                        ? 'border-green-300 bg-green-50 shadow-md'
                        : 'border-gray-200 hover:border-green-200 hover:bg-green-25'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="radio"
                        name="bristol"
                        value={option.type}
                        checked={selectedType === option.type}
                        onChange={(e) => setSelectedType(parseInt(e.target.value))}
                        className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-green-700">{option.title}:</span>
                          <span className="text-gray-900">{option.description}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{option.details}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleCalculate}
                  disabled={selectedType === null}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    selectedType !== null
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle className="w-5 h-5 inline mr-2" />
                  Oceń stolec
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
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Wynik: Typ {result.type}
                    </h3>
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getTypeColor(result.type)}`}>
                      <span className="mr-2">
                        {result.type <= 2 && '🔴'}
                        {result.type === 3 && '🟡'}
                        {result.type === 4 && '✅'}
                        {result.type === 5 && '🟡'}
                        {result.type >= 6 && '🟠'}
                      </span>
                      {result.classification}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Interpretacja:</h4>
                    <p className="text-gray-700">{result.interpretation}</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Zalecenia dietetyczne:</h4>
                    <ul className="space-y-2">
                      {result.dietaryRecommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Uwagi medyczne:</h4>
                    <ul className="space-y-2">
                      {result.medicalConsiderations.map((consideration, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{color: '#38b6ff'}} />
                          <span className="text-gray-700 text-sm">{consideration}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  
                </div>
              </>
            )}

            {!showResult && (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 text-center">
                <Stethoscope className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Oczekiwanie na ocenę
                </h3>
                <p className="text-gray-500">
                  Wybierz typ stolca i kliknij "Oceń stolec"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BristolCalculator;