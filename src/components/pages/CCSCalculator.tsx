import React, { useState } from 'react';
import { ArrowLeft, Heart, AlertTriangle, CheckCircle, RotateCcw, Activity, Zap } from 'lucide-react';

interface CCSClass {
  class: number;
  name: string;
  description: string;
  detailedDescription: string[];
  functionalLimitation: string;
  examples: string[];
}

interface CCSResult {
  selectedClass: CCSClass;
  functionalCapacity: string;
  prognosis: string;
  treatmentRecommendations: string[];
  lifestyleModifications: string[];
  followUpRecommendations: string[];
  revascularizationIndications: string[];
  medicationOptions: string[];
  color: string;
}

const CCSCalculator: React.FC = () => {  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [result, setResult] = useState<CCSResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const ccsClasses: CCSClass[] = [
    {
      class: 1,
      name: 'Klasa I - Bez ograniczeń zwykłej aktywności fizycznej',
      description: 'Dławica występuje tylko podczas wyjątkowo intensywnego wysiłku',
      detailedDescription: [
        'Normalna aktywność (chodzenie, wchodzenie po schodach) nie wywołuje dławicy',
        'Dławica może wystąpić przy bardzo szybkim chodzeniu lub bieganiu',
        'Wysiłek musi być wyjątkowo intensywny lub długotrwały',
        'Pacjent prowadzi normalny tryb życia bez ograniczeń'
      ],
      functionalLimitation: 'Brak ograniczeń w codziennej aktywności',
      examples: [
        'Chodzenie po płaskim terenie bez ograniczeń',
        'Wchodzenie po schodach w normalnym tempie',
        'Wykonywanie prac domowych bez problemów',
        'Dławica tylko przy bardzo intensywnym sporcie'
      ]
    },
    {
      class: 2,
      name: 'Klasa II - Niewielkie ograniczenie zwykłej aktywności',
      description: 'Dławica występuje przy umiarkowanym wysiłku fizycznym',
      detailedDescription: [
        'Dławica przy szybkim chodzeniu lub wchodzeniu pod górę',
        'Dławica przy wchodzeniu po schodach po posiłku, na zimnie lub pod wpływem stresu',
        'Chodzenie więcej niż 2 przecznice w normalnym tempie po płaskim terenie',
        'Wchodzenie na więcej niż 1 piętro w normalnym tempie może wywołać dławicę'
      ],
      functionalLimitation: 'Niewielkie ograniczenia przy intensywniejszym wysiłku',
      examples: [
        'Dławica przy szybkim marszu',
        'Dławica przy wchodzeniu na 2-3 piętra',
        'Problemy przy chodzeniu pod górę',
        'Dławica w zimne dni lub po posiłkach'
      ]
    },
    {
      class: 3,
      name: 'Klasa III - Znaczne ograniczenie zwykłej aktywności',
      description: 'Dławica przy niewielkim wysiłku fizycznym',
      detailedDescription: [
        'Dławica podczas chodzenia 1-2 przecznic po płaskim terenie w normalnym tempie',
        'Dławica przy wchodzeniu na 1 piętro w normalnym tempie',
        'Komfortowe wykonywanie tylko lekkiej aktywności fizycznej',
        'Znaczne ograniczenia w codziennym funkcjonowaniu'
      ],
      functionalLimitation: 'Znaczne ograniczenia codziennej aktywności',
      examples: [
        'Dławica przy chodzeniu na krótkie dystanse',
        'Dławica przy wchodzeniu na 1 piętro',
        'Problemy z wykonywaniem prac domowych',
        'Konieczność częstych przerw podczas aktywności'
      ]
    },
    {
      class: 4,
      name: 'Klasa IV - Niemożność wykonywania jakiejkolwiek aktywności fizycznej bez dyskomfortu',
      description: 'Dławica spoczynkowa lub przy minimalnym wysiłku',
      detailedDescription: [
        'Dławica spoczynkowa - może występować w spoczynku',
        'Dławica przy minimalnym wysiłku (ubieranie się, mycie)',
        'Znaczne ograniczenie jakiejkolwiek aktywności fizycznej',
        'Objawy mogą występować podczas normalnych czynności dnia codziennego'
      ],
      functionalLimitation: 'Całkowite lub niemal całkowite ograniczenie aktywności',
      examples: [
        'Dławica podczas ubierania się',
        'Dławica przy powolnym chodzeniu po mieszkaniu',
        'Objawy w spoczynku',
        'Niemożność wykonywania podstawowych czynności bez objawów'
      ]
    }
  ];

  const getResult = (selectedClass: CCSClass): CCSResult => {
    let functionalCapacity: string;
    let prognosis: string;
    let treatmentRecommendations: string[];
    let lifestyleModifications: string[];
    let followUpRecommendations: string[];
    let revascularizationIndications: string[];
    let medicationOptions: string[];
    let color: string;

    switch (selectedClass.class) {
      case 1:
        functionalCapacity = 'Bardzo dobra - >7 METs';
        prognosis = 'Doskonałe rokowanie przy optymalnym leczeniu farmakologicznym. Niska śmiertelność roczna (<1%).';
        color = 'green';
        treatmentRecommendations = [
          'Optymalne leczenie farmakologiczne',
          'Modyfikacja czynników ryzyka',
          'Regularna aktywność fizyczna',
          'Kontrola cholesterolu LDL <70 mg/dl',
          'Kontrola ciśnienia tętniczego <130/80 mmHg',
          'Leczenie przeciwpłytkowe (aspiryna)'
        ];
        lifestyleModifications = [
          'Regularna aktywność fizyczna (150 min/tydzień)',
          'Dieta śródziemnomorska',
          'Rzucenie palenia tytoniu',
          'Kontrola masy ciała (BMI <25)',
          'Ograniczenie alkoholu',
          'Zarządzanie stresem'
        ];
        followUpRecommendations = [
          'Wizyty kontrolne co 6 miesięcy',
          'Próby wysiłkowe co 12 miesięcy lub przy zmianie objawów',
          'Echo serca co 12 miesięcy',
          'Lipidogram co 6 miesięcy',
          'Edukacja pacjenta o objawach pogorszenia'
        ];
        revascularizationIndications = [
          'Zazwyczaj nieskuteczne leczenie farmakologiczne',
          'Pogorszenie objawów mimo optymalnej farmakoterapii',
          'Duży obszar miokardium zagrożony w badaniach obrazowych',
          'Główna choroba pnia lewej tętnicy wieńcowej'
        ];
        medicationOptions = [
          'Beta-blokery (metoprolol, bisoprolol)',
          'Antagoniści wapnia (amloipina, nifedypina)',
          'Długodziałające azotany',
          'Statyny wysokiej intensywności',
          'Aspiryna 75-100mg',
          'Inhibitory ACE lub sartany'
        ];
        break;

      case 2:
        functionalCapacity = 'Dobra - 5-7 METs';
        prognosis = 'Dobre rokowanie przy odpowiednim leczeniu. Średnia śmiertelność roczna 1-3%.';
        color = 'yellow';
        treatmentRecommendations = [
          'Intensyfikacja leczenia farmakologicznego',
          'Ścisła kontrola czynników ryzyka',
          'Kontrolowana aktywność fizyczna',
          'Rozważenie rehabilitacji kardiologicznej',
          'Regularne monitorowanie objawów',
          'Edukacja o objawach niestabilnych'
        ];
        lifestyleModifications = [
          'Kontrolowany program ćwiczeń',
          'Dieta niskocholesterolowa i niskosolna',
          'Bezwzględne rzucenie palenia',
          'Redukcja masy ciała przy nadwadze',
          'Ograniczenie wysiłków wyzwalających dławicę',
          'Techniki relaksacyjne'
        ];
        followUpRecommendations = [
          'Wizyty kontrolne co 3-4 miesiące',
          'Monitorowanie tolerancji wysiłku',
          'Próby wysiłkowe co 6-12 miesięcy',
          'Echokardiografia co 12 miesięcy',
          'Kontrola parametrów laboratoryjnych co 3 miesiące'
        ];
        revascularizationIndications = [
          'Progresja objawów mimo optymalnej farmakoterapii',
          'Nietolerancja leków antystenokardiycznych',
          'Znaczne ograniczenia w jakości życia',
          'Duże obszary niedokrwienia w badaniach obrazowych'
        ];
        medicationOptions = [
          'Dwulecznictwo: beta-blokery + antagoniści wapnia',
          'Długodziałające azotany',
          'Ranisolazyna jako lek III linii',
          'Statyny w maksymalnych tolerowanych dawkach',
          'Aspiryna + clopidogrel u wybranych pacjentów',
          'Inhibitory ACE/sartany'
        ];
        break;

      case 3:
        functionalCapacity = 'Ograniczona - 2-5 METs';
        prognosis = 'Umiarkowane rokowanie. Średnia śmiertelność roczna 3-8%. Wysokie ryzyko zdarzeń sercowych.';
        color = 'orange';
        treatmentRecommendations = [
          'Maksymalne leczenie farmakologiczne',
          'PILNA ocena na temat rewaskularyzacji',
          'Konsultacja kardiologiczna specjalistyczna',
          'Ograniczenie aktywności fizycznej',
          'Ścisłe monitorowanie kliniczne',
          'Przygotowanie do potencjalnych interwencji'
        ];
        lifestyleModifications = [
          'Znaczne ograniczenie aktywności fizycznej',
          'Kontrolowana rehabilitacja pod nadzorem',
          'Dieta kardioprotective',
          'Unikanie sytuacji stresowych',
          'Regulny tryb życia bez nadmiernych wysiłków',
          'Wsparcie psychologiczne'
        ];
        followUpRecommendations = [
          'Częste wizyty kontrolne co 1-2 miesiące',
          'Natychmiastowy kontakt przy pogorszeniu objawów',
          'Regulne badania obrazowe co 6 miesięcy',
          'Monitorowanie funkcji serca',
          'Przygotowanie do procedur inwazyjnych'
        ];
        revascularizationIndications = [
          'SILNIE ZALECANA ocena rewaskularyzacji',
          'Koronarografia diagnostyczna',
          'PCI lub CABG w zależności od anatomii',
          'Procedura powinna być wykonana w trybie pilnym',
          'Korzyść przewyższa ryzyko w większości przypadków'
        ];
        medicationOptions = [
          'Maksymalne dawki wszystkich grup leków',
          'Kombinacja 3-4 leków antystenokardiicznych',
          'Ranisolazyna jako dodatek',
          'Intensywne leczenie hipolipidizujące',
          'Podwójne leczenie przeciwpłytkowe',
          'Diuretyki przy objawach zastoju'
        ];
        break;

      case 4:
        functionalCapacity = 'Bardzo ograniczona - <2 METs';
        prognosis = 'Poważne rokowanie. Wysoka śmiertelność roczna >8%. Wysokie ryzyko zawału serca i nagłej śmierci.';
        color = 'red';
        treatmentRecommendations = [
          'NATYCHMIASTOWA ocena kardiologiczna',
          'PILNA kwalifikacja do rewaskularyzacji',
          'Maksymalne leczenie farmakologiczne',
          'Hospitalizacja przy niestabilności',
          'Leczenie niewydolności serca jeśli obecne',
          'Kompleksowa opieka kardiologiczna'
        ];
        lifestyleModifications = [
          'Unikanie wysiłku fizycznego do rewaskularyzacji',
          'Ścisły odpoczynek przy objawach spoczynkowych',
          'Dieta płynna przy dławicy wysiłkowej',
          'Wsparcie psychologiczne i socjalne',
          'Planowanie opieki długoterminowej',
          'Edukacja rodziny o objawach nagłych'
        ];
        followUpRecommendations = [
          'PILNE wizyty kardiologiczne w ciągu 1-2 tygodni',
          'Monitorowanie ciągłe objawów',
          'Natychmiastowy kontakt przy pogorszeniu',
          'Przygotowanie do interwencji kardiochirurgicznej',
          'Regulne hospitalizacje kontrolne'
        ];
        revascularizationIndications = [
          'WSKAZANIE KLASY I do rewaskularyzacji',
          'Procedura w trybie pilnym/nagłym',
          'Koronarografia i interwencja ASAP',
          'PCI lub CABG zależnie od anatomii',
          'Korzyść zdecydowanie przewyższa ryzyko',
          'Brak rewaskularyzacji = wysokie ryzyko śmierci'
        ];
        medicationOptions = [
          'Maksymalne dawki wszystkich dostępnych leków',
          'IV nitrogliceryna przy dławicy spoczynkowej',
          'Morfina przy bólu nie kontrolowanym',
          'Intensywne leczenie przeciwzakrzepowe',
          'Statyny w dawkach maksymalnych',
          'Beta-blokery jeśli tolerowane'
        ];
        break;

      default:
        return getResult(ccsClasses[0]);
    }

    return {
      selectedClass,
      functionalCapacity,
      prognosis,
      treatmentRecommendations,
      lifestyleModifications,
      followUpRecommendations,
      revascularizationIndications,
      medicationOptions,
      color
    };
  };

  const handleClassSelection = (classNumber: number) => {
    setSelectedClass(classNumber);
  };

  const handleCalculate = () => {
    if (selectedClass === null) return;
    
    const selectedCCSClass = ccsClasses.find(c => c.class === selectedClass)!;
    const calculatedResult = getResult(selectedCCSClass);
    setResult(calculatedResult);
    setShowResult(true);
  };

  const handleReset = () => {
    setSelectedClass(null);
    setResult(null);
    setShowResult(false);
  };

  const getClassColor = (classNumber: number) => {
    const colors = {
      1: 'text-green-600 bg-green-50 border-green-200',
      2: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      3: 'text-orange-600 bg-orange-50 border-orange-200',
      4: 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[classNumber as keyof typeof colors] || colors[1];
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
                Skala CCS
              </h1>
              <p className="text-gray-600 text-sm">
                Canadian Cardiovascular Society Angina Classification
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
                <p><strong>Zastosowanie:</strong> Klasyfikacja nasilenia dławicy piersiowej</p>
                <p><strong>Klasy:</strong> I-IV, gdzie I = brak ograniczeń, IV = dławica spoczynkowa</p>
                <p><strong>Cel:</strong> Ocena ograniczeń funkcjonalnych spowodowanych dławicą</p>
                <p><strong>Znaczenie:</strong> Pomaga w planowaniu leczenia i kwalifikacji do rewaskularyzacji</p>
              </div>
            </div>

            {/* Current Selection Display */}
            {selectedClass !== null && (
              <div className="bg-white rounded-xl shadow-md border border-red-100 p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    Klasa {selectedClass}
                  </div>
                  <div className="text-sm text-gray-600">
                    Wybrana klasa CCS
                  </div>
                </div>
              </div>
            )}

            {/* Calculator Form */}
            <div className="bg-white rounded-xl shadow-md border border-red-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Wybierz klasę najlepiej opisującą ograniczenia aktywności fizycznej pacjenta:
              </h3>
              
              <div className="space-y-4">
                {ccsClasses.map((ccsClass) => (
                  <label
                    key={ccsClass.class}
                    className={`block p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedClass === ccsClass.class
                        ? 'border-red-300 bg-red-50 shadow-sm'
                        : 'border-gray-200 hover:border-red-200 hover:bg-red-25'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="radio"
                        name="ccs-class"
                        value={ccsClass.class}
                        checked={selectedClass === ccsClass.class}
                        onChange={() => handleClassSelection(ccsClass.class)}
                        className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="font-bold text-xl text-red-600">
                            {ccsClass.class}
                          </div>
                          <div className="font-medium text-gray-900 text-sm">
                            {ccsClass.name}
                          </div>
                        </div>
                        <div className="text-sm text-gray-700 mb-2">
                          {ccsClass.description}
                        </div>
                        <div className="text-xs text-gray-500">
                          <strong>Przykłady:</strong> {ccsClass.examples.slice(0, 2).join(', ')}
                          {ccsClass.examples.length > 2 && '...'}
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
                  disabled={selectedClass === null}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    selectedClass !== null
                      ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle className="w-5 h-5 inline mr-2" />
                  Oceń klasę dławicy
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
                      {result.selectedClass.class}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Klasa CCS {result.selectedClass.class}
                    </h3>
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getClassColor(result.selectedClass.class)}`}>
                      <span className="mr-2">
                        {result.selectedClass.class === 1 && '✅'}
                        {result.selectedClass.class === 2 && '⚠️'}
                        {result.selectedClass.class === 3 && '🟠'}
                        {result.selectedClass.class === 4 && '🚨'}
                      </span>
                      {result.selectedClass.class === 1 ? 'Bez ograniczeń' :
                       result.selectedClass.class === 2 ? 'Niewielkie ograniczenia' :
                       result.selectedClass.class === 3 ? 'Znaczne ograniczenia' :
                       'Dławica spoczynkowa'}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Wydolność funkcyjna:</h4>
                    <p className="text-red-600 font-medium text-sm mb-3">{result.functionalCapacity}</p>
                    <h4 className="font-semibold text-gray-900 mb-2">Rokowanie:</h4>
                    <p className="text-gray-700 text-sm">{result.prognosis}</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Charakterystyczne objawy:</h4>
                    <ul className="space-y-2">
                      {result.selectedClass.detailedDescription.map((desc, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Heart className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Zalecenia leczenia:</h4>
                    <ul className="space-y-2">
                      {result.treatmentRecommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Modyfikacje stylu życia:</h4>
                    <ul className="space-y-2">
                      {result.lifestyleModifications.map((modification, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Activity className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{modification}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Wskazania do rewaskularyzacji:</h4>
                    <ul className="space-y-2">
                      {result.revascularizationIndications.map((indication, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Zap className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{indication}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {result.selectedClass.class >= 3 && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-red-800 mb-1">
                            {result.selectedClass.class === 3 ? 'UWAGA: Znaczne ograniczenia funkcjonalne!' : 'UWAGA: Dławica spoczynkowa!'}
                          </p>
                          <p className="text-xs text-red-700">
                            {result.selectedClass.class === 3 
                              ? 'Klasa III wymaga pilnej oceny kardiologicznej i rozważenia rewaskularyzacji.'
                              : 'Klasa IV to wskazanie do natychmiastowej oceny i interwencji kardiologicznej.'}
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
                  Skala CCS
                </h3>
                <p className="text-gray-500 mb-4">
                  Wybierz klasę dławicy piersiowej i kliknij "Oceń klasę dławicy"
                </p>
                <div className="text-sm text-gray-600 space-y-1">
                  <div><strong>I</strong> - Bez ograniczeń</div>
                  <div><strong>II</strong> - Niewielkie ograniczenia</div>
                  <div><strong>III</strong> - Znaczne ograniczenia</div>
                  <div><strong>IV</strong> - Dławica spoczynkowa</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CCSCalculator;