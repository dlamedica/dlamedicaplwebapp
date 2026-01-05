import React, { useState } from 'react';
import { ArrowLeft, Activity, AlertTriangle, CheckCircle, RotateCcw, Shield, Zap, Heart } from 'lucide-react';

interface ISSRegion {
  id: string;
  name: string;
  description: string;
  examples: Record<number, string>;
}

interface ISSResult {
  aisScores: Record<string, number>;
  topThreeScores: number[];
  issScore: number;
  severity: 'minor' | 'moderate' | 'severe' | 'critical';
  interpretation: string;
  mortality: string;
  careLevel: string;
  recommendations: string[];
  monitoring: string[];
  interventions: string[];
  prognosis: string;
  color: string;
}

const ISSCalculator: React.FC = () => {
  const [aisScores, setAisScores] = useState<Record<string, number>>({
    head: 0,
    face: 0,
    chest: 0,
    abdomen: 0,
    extremities: 0,
    external: 0
  });
  const [result, setResult] = useState<ISSResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const issRegions: ISSRegion[] = [
    {
      id: 'head',
      name: 'Głowa i szyja',
      description: 'Obrażenia czaszkowo-mózgowe i kręgosłupa szyjnego',
      examples: {
        1: 'Powierzchowne rany skóry głowy, stłuczenia',
        2: 'Wstrząśnienie mózgu bez utraty świadomości, drobne złamania twarzy',
        3: 'Wstrząśnienie z utratą świadomości <1h, złamania podstawy czaszki',
        4: 'Krwiak podtwardówkowy, złamanie czaszki z zapadnięciem',
        5: 'Rozległy uraz mózgu, masywne krwawienie śródczaszkowe',
        6: 'Urazy obecnie niekompatybilne z życiem'
      }
    },
    {
      id: 'face',
      name: 'Twarz',
      description: 'Obrażenia struktur twarzoczaszki',
      examples: {
        1: 'Powierzchowne rany, stłuczenia twarzy',
        2: 'Złamanie pojedynczej kości twarzy (nos, żuchwa)',
        3: 'Złamanie wielokostnowe twarzy, uszkodzenie zębów',
        4: 'Złamanie kompleksu środkowej części twarzy (Le Fort II-III)',
        5: 'Rozległe zmiażdżenie twarzy z uszkodzeniem oka/mózgu',
        6: 'Całkowite zniszczenie struktury twarzy'
      }
    },
    {
      id: 'chest',
      name: 'Klatka piersiowa',
      description: 'Obrażenia ściany klatki piersiowej i organów wewnętrznych',
      examples: {
        1: 'Powierzchowne rany, stłuczenia ściany klatki',
        2: 'Złamanie 1-2 żeber, mały odma opłucnowa',
        3: 'Złamanie 3-4 żeber, umiarkowany odma/krwotok opłucnowy',
        4: 'Złamanie >4 żeber, duży odma/hemotoraks, stłuczenie płuc',
        5: 'Rozległy odma obustronna, masywne uszkodzenie płuc/serca',
        6: 'Całkowite zmiażdżenie klatki piersiowej'
      }
    },
    {
      id: 'abdomen',
      name: 'Jama brzuszna',
      description: 'Obrażenia organów jamy brzusznej i przestrzeni zaotrzewnowej',
      examples: {
        1: 'Powierzchowne rany brzucha, stłuczenia',
        2: 'Niewielkie uszkodzenie pojedynczego narządu (śledziona, wątroba)',
        3: 'Umiarkowane uszkodzenie narządów, mały krwotok wewnętrzny',
        4: 'Rozległe uszkodzenia wielonarządowe, duży krwotok',
        5: 'Masywne zniszczenie narządów, krytyczny krwotok',
        6: 'Całkowite zmiażdżenie jamy brzusznej'
      }
    },
    {
      id: 'extremities',
      name: 'Kończyny i miednica',
      description: 'Obrażenia kończyn górnych, dolnych i miednicy',
      examples: {
        1: 'Powierzchowne rany, stłuczenia, skręcenia',
        2: 'Złamanie pojedynczej kości długiej, zwichnięcie',
        3: 'Złamanie wielokostnowe, amputacja palca/dłoni',
        4: 'Złamanie miednicy, amputacja przedramienia/goleni',
        5: 'Złamanie otwarte miednicy, amputacja ramienia/uda',
        6: 'Amputacja obu kończyn dolnych powyżej kolan'
      }
    },
    {
      id: 'external',
      name: 'Powierzchnia ciała',
      description: 'Oparzenia, odmrożenia, urazy skóry',
      examples: {
        1: 'Oparzenia I° <10% powierzchni ciała',
        2: 'Oparzenia II° 10-20% lub III° <10%',
        3: 'Oparzenia II° 20-30% lub III° 10-20%',
        4: 'Oparzenia II° 30-40% lub III° 20-30%',
        5: 'Oparzenia III° 30-40% lub II°-III° >65%',
        6: 'Oparzenia III° >40% powierzchni ciała'
      }
    }
  ];

  const getResult = (aisScores: Record<string, number>): ISSResult => {
    // Get non-zero AIS scores and sort them in descending order
    const nonZeroScores = Object.values(aisScores).filter(score => score > 0);
    const sortedScores = nonZeroScores.sort((a, b) => b - a);
    
    // Get top 3 scores (if any AIS = 6, ISS = 75)
    const hasAIS6 = sortedScores.some(score => score === 6);
    if (hasAIS6) {
      const topThreeScores = [6, 0, 0];
      const issScore = 75;
      
      return {
        aisScores,
        topThreeScores,
        issScore,
        severity: 'critical',
        interpretation: 'Urazy obecnie niekompatybilne z życiem',
        mortality: '>95%',
        careLevel: 'Natychmiastowe leczenie podtrzymujące życie',
        recommendations: [
          'NATYCHMIASTOWA resuscytacja w trybie ratowania życia',
          'Zabezpieczenie dróg oddechowych i oddychania',
          'Agresywna resuscytacja krążeniowa',
          'Pilne zabiegi operacyjne ratujące życie',
          'Leczenie w najwyższej referencyjności ośrodku',
          'Rozważenie ograniczenia terapii do komfortu'
        ],
        monitoring: [
          'Ciągłe monitorowanie funkcji życiowych',
          'Inwazyjne monitorowanie ciśnienia',
          'Kontrola gazometrii i elektrolitów',
          'Imaging kontrolny co 4-6h',
          'Neurologiczne kontrole ciągłe'
        ],
        interventions: [
          'Zabiegi ratujące życie w trybie natychmiastowym',
          'Chirurgia kontroli uszkodzeń (damage control)',
          'Wspomaganie wielonarządowe',
          'Transfuzje masywne',
          'Neurochirurgiczne interwencje pilne'
        ],
        prognosis: 'Bardzo poważne rokowanie. Wysokie ryzyko zgonu lub trwałego inwalidztwa.',
        color: 'red'
      };
    }
    
    // Normal ISS calculation: sum of squares of top 3 AIS scores
    const topThreeScores = [...sortedScores.slice(0, 3)];
    while (topThreeScores.length < 3) {
      topThreeScores.push(0);
    }
    
    const issScore = topThreeScores.reduce((sum, score) => sum + (score * score), 0);
    
    let severity: 'minor' | 'moderate' | 'severe' | 'critical';
    let interpretation: string;
    let mortality: string;
    let careLevel: string;
    let color: string;
    let recommendations: string[];
    let monitoring: string[];
    let interventions: string[];
    let prognosis: string;

    if (issScore <= 15) {
      severity = 'minor';
      interpretation = 'Łagodne urazy - dobra prognoza';
      mortality = '<1%';
      careLevel = 'Podstawowa opieka medyczna lub ambulatoryjna';
      color = 'green';
      recommendations = [
        'Standardowa ocena i leczenie urazów',
        'Obserwacja przez 4-6 godzin',
        'Leczenie objawowe bólu',
        'Edukacja pacjenta o objawach alarmowych',
        'Kontrola ambulatoryjna w razie potrzeby'
      ];
      monitoring = [
        'Podstawowe parametry życiowe',
        'Obserwacja objawów pogorszenia',
        'Kontrola ran i opatrunków',
        'Ocena bólu i funkcji'
      ];
      interventions = [
        'Opatrunki i uszywanie ran',
        'Stabilizacja drobnych złamań',
        'Leczenie przeciwbólowe',
        'Szczepienia (tężec)'
      ];
      prognosis = 'Doskonałe rokowanie. Pełne wyzdrowienie oczekiwane.';
    } else if (issScore <= 24) {
      severity = 'moderate';
      interpretation = 'Umiarkowane urazy - wymagają hospitalizacji';
      mortality = '10-15%';
      careLevel = 'Hospitalizacja na oddziale chirurgicznym';
      color = 'orange';
      recommendations = [
        'Hospitalizacja i kompleksowa diagnostyka',
        'Wielodyscyplinarna opieka medyczna',
        'Regulne kontrole i monitoring',
        'Wczesna mobilizacja i fizjoterapia',
        'Przygotowanie do zabiegów operacyjnych',
        'Profilaktyka powikłań (zakrzepica, infekcje)'
      ];
      monitoring = [
        'Monitorowanie funkcji życiowych co 2-4h',
        'Kontrolne badania obrazowe',
        'Laboratoryjne kontrole co 6-12h',
        'Ocena neurologiczna regularna',
        'Monitorowanie diurezy i bilansu płynów'
      ];
      interventions = [
        'Zabiegi chirurgiczne planowe',
        'Stabilizacja złamań',
        'Drenaże i opatrunki złożone',
        'Transfuzje w razie potrzeby',
        'Leczenie wielospecjalistyczne'
      ];
      prognosis = 'Dobre rokowanie przy odpowiednim leczeniu. Możliwe powikłania wymagają nadzoru.';
    } else if (issScore <= 40) {
      severity = 'severe';
      interpretation = 'Ciężkie urazy - wysokie ryzyko powikłań';
      mortality = '30-50%';
      careLevel = 'Intensywna opieka medyczna (ICU/CCU)';
      color = 'red';
      recommendations = [
        'PILNA hospitalizacja w ośrodku referencyjnym',
        'Intensywna opieka wielospecjalistyczna',
        'Przygotowanie do licznych zabiegów',
        'Agresywna resuscytacja i stabilizacja',
        'Ścisłe monitorowanie wielonarządowe',
        'Profilaktyka i leczenie powikłań'
      ];
      monitoring = [
        'Ciągłe monitorowanie w ICU',
        'Inwazyjne monitorowanie hemodynamiczne',
        'Kontrole obrazowe co 4-8h',
        'Laboratoryjne kontrole co 4-6h',
        'Neurologiczne oceny ciągłe',
        'Monitorowanie funkcji nerek, wątroby'
      ];
      interventions = [
        'Zabiegi operacyjne w trybie pilnym',
        'Chirurgia kontroli uszkodzeń',
        'Wspomaganie oddechu i krążenia',
        'Transfuzje i korekta koagulopatii',
        'Neurochirurgiczne interwencje',
        'Stabilizacja złamań zewnętrzna'
      ];
      prognosis = 'Poważne rokowanie. Wysokie ryzyko zgonu i trwałego inwalidztwa.';
    } else {
      severity = 'critical';
      interpretation = 'Krytyczne urazy - zagrożenie życia';
      mortality = '>80%';
      careLevel = 'Najwyższego stopnia intensywna terapia';
      color = 'red';
      recommendations = [
        'NATYCHMIASTOWA resuscytacja ratująca życie',
        'Transport do ośrodka I stopnia referencyjności',
        'Wielodyscyplinarne zespoły chirurgiczne',
        'Zabiegi w trybie damage control',
        'Maksymalne wspomaganie wielonarządowe',
        'Przygotowanie do długotrwałej intensywnej terapii'
      ];
      monitoring = [
        'Monitoring ciągły wszystkich systemów',
        'Inwazyjne monitorowanie wieloparametrowe',
        'Imaging kontrolny co 2-4h',
        'Biochemiczne kontrole co 2-4h',
        'Neurologiczne monitorowanie ICP',
        'Kontrola perfuzji tkankowej'
      ];
      interventions = [
        'Zabiegi ratujące życie natychmiast',
        'Damage control surgery',
        'ECMO/inne wspomaganie',
        'Masywne protokoły transfuzyjne',
        'Neurointensywna terapia',
        'Profilaktyka zespołu przegrodowego'
      ];
      prognosis = 'Bardzo poważne rokowanie. Ekstremalne ryzyko zgonu. Możliwe trwałe następstwa.';
    }

    return {
      aisScores,
      topThreeScores,
      issScore,
      severity,
      interpretation,
      mortality,
      careLevel,
      recommendations,
      monitoring,
      interventions,
      prognosis,
      color
    };
  };

  const handleAISChange = (regionId: string, aisScore: number) => {
    setAisScores(prev => ({
      ...prev,
      [regionId]: aisScore
    }));
  };

  const handleCalculate = () => {
    const calculatedResult = getResult(aisScores);
    setResult(calculatedResult);
    setShowResult(true);
  };

  const handleReset = () => {
    setAisScores({
      head: 0,
      face: 0,
      chest: 0,
      abdomen: 0,
      extremities: 0,
      external: 0
    });
    setResult(null);
    setShowResult(false);
  };


  const getSeverityColor = (severity: string) => {
    const colors = {
      'minor': 'text-green-600 bg-green-50 border-green-200',
      'moderate': 'text-orange-600 bg-orange-50 border-orange-200',
      'severe': 'text-red-600 bg-red-50 border-red-200',
      'critical': 'text-red-700 bg-red-100 border-red-300'
    };
    return colors[severity as keyof typeof colors] || colors.minor;
  };

  // Calculate current ISS for display
  const currentNonZeroScores = Object.values(aisScores).filter(score => score > 0);
  const currentSortedScores = currentNonZeroScores.sort((a, b) => b - a);
  const currentTopThree = [...currentSortedScores.slice(0, 3)];
  while (currentTopThree.length < 3) {
    currentTopThree.push(0);
  }
  const currentISS = currentNonZeroScores.some(score => score === 6) ? 75 : 
    currentTopThree.reduce((sum, score) => sum + (score * score), 0);

  const anyRegionScored = Object.values(aisScores).some(score => score > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-red-100">
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
                <div className="p-2 bg-gradient-to-r from-red-400 to-orange-500 rounded-full">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                Skala ISS
              </h1>
              <p className="text-gray-600 text-sm">
                Injury Severity Score - Skala Ciężkości Urazów
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
            <div className="bg-white rounded-xl shadow-md border border-red-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Informacje o skali
              </h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p><strong>Zastosowanie:</strong> Ocena ciężkości wielonarządowych obrażeń urazowych</p>
                <p><strong>Regiony:</strong> 6 regionów anatomicznych (AIS 1-6)</p>
                <p><strong>Zakres ISS:</strong> 1-75 punktów</p>
                <p><strong>Obliczenie:</strong> Suma kwadratów 3 najwyższych AIS</p>
              </div>
            </div>

            {/* Current ISS Display */}
            {anyRegionScored && (
              <div className="bg-white rounded-xl shadow-md border border-red-100 p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    ISS: {currentISS}
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    Aktualna wartość ISS
                  </div>
                  <div className="text-xs text-gray-500">
                    Najwyższe AIS: {currentTopThree.join(', ')}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {currentTopThree[0]}² + {currentTopThree[1]}² + {currentTopThree[2]}² = {currentISS}
                  </div>
                </div>
              </div>
            )}

            {/* Critical Warning */}
            {currentISS >= 25 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-red-800 mb-1">
                      {currentISS >= 40 ? 'KRYTYCZNE URAZY!' : 'CIĘŻKIE URAZY!'}
                    </h3>
                    <p className="text-xs text-red-700">
                      ISS ≥{currentISS >= 40 ? '40' : '25'} - {currentISS >= 40 ? 'Zagrożenie życia' : 'Wysokie ryzyko powikłań'}. 
                      Konieczna pilna specjalistyczna opieka medyczna.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Calculator */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-md border border-red-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Oceń najcięższe obrażenia w każdym regionie ciała (AIS 1-6):
              </h3>
              
              <div className="space-y-6">
                {issRegions.map((region) => (
                  <div key={region.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                    <h4 className="text-md font-semibold text-red-700 mb-3">
                      {region.name}:
                    </h4>
                    <p className="text-xs text-gray-600 mb-3">{region.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <label className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name={region.id}
                          value={0}
                          checked={aisScores[region.id] === 0}
                          onChange={() => handleAISChange(region.id, 0)}
                          className="h-4 w-4 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm">Brak obrażeń</span>
                      </label>
                      
                      {[1, 2, 3, 4, 5, 6].map((aisScore) => (
                        <label
                          key={`${region.id}-${aisScore}`}
                          className={`flex items-start space-x-2 p-2 border rounded cursor-pointer transition-all ${
                            aisScores[region.id] === aisScore
                              ? 'border-red-300 bg-red-50'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name={region.id}
                            value={aisScore}
                            checked={aisScores[region.id] === aisScore}
                            onChange={() => handleAISChange(region.id, aisScore)}
                            className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">AIS {aisScore}</span>
                              <span className={`text-xs px-2 py-1 rounded ${
                                aisScore <= 2 ? 'bg-green-100 text-green-700' :
                                aisScore <= 4 ? 'bg-orange-100 text-orange-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {aisScore <= 2 ? 'Łagodne-Umiarkowane' :
                                 aisScore <= 4 ? 'Poważne-Ciężkie' :
                                 aisScore === 5 ? 'Krytyczne' : 'Niekompatybilne'}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              {region.examples[aisScore]}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleCalculate}
                  disabled={!anyRegionScored}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    anyRegionScored
                      ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white hover:from-red-600 hover:to-orange-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle className="w-5 h-5 inline mr-2" />
                  Oblicz ISS
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
              result.color === 'orange' ? 'border-orange-200' :
              result.color === 'red' ? 'border-red-200' :
              'border-gray-200'
            }`}>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  ISS: {result.issScore}/75
                </h3>
                <div className="text-lg text-gray-600 mb-2">
                  Obliczenie: {result.topThreeScores[0]}² + {result.topThreeScores[1]}² + {result.topThreeScores[2]}² = {result.issScore}
                </div>
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getSeverityColor(result.severity)}`}>
                  <span className="mr-2">
                    {result.severity === 'minor' && '✅'}
                    {result.severity === 'moderate' && '⚠️'}
                    {result.severity === 'severe' && '🔴'}
                    {result.severity === 'critical' && '🚨'}
                  </span>
                  {result.severity === 'minor' ? 'Łagodne urazy' :
                   result.severity === 'moderate' ? 'Umiarkowane urazy' :
                   result.severity === 'severe' ? 'Ciężkie urazy' :
                   'Krytyczne urazy'}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Interpretacja:</h4>
                  <p className="text-gray-700 text-sm mb-3">{result.interpretation}</p>
                  <h4 className="font-semibold text-gray-900 mb-2">Śmiertelność:</h4>
                  <p className="text-red-600 font-medium text-sm mb-3">{result.mortality}</p>
                  <h4 className="font-semibold text-gray-900 mb-2">Poziom opieki:</h4>
                  <p className="text-gray-700 text-sm">{result.careLevel}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 mb-2">Najwyższe wyniki AIS:</h4>
                  {Object.entries(result.aisScores)
                    .filter(([, score]) => score > 0)
                    .sort(([, a], [, b]) => b - a)
                    .map(([regionId, score]) => {
                      const region = issRegions.find(r => r.id === regionId);
                      return (
                        <div key={regionId} className="flex justify-between text-sm">
                          <span className="text-gray-600">{region?.name}:</span>
                          <span className="font-medium">AIS {score}</span>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Zalecenia postępowania:</h4>
                  <ul className="space-y-2">
                    {result.recommendations.slice(0, 4).map((recommendation, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Monitorowanie:</h4>
                  <ul className="space-y-2">
                    {result.monitoring.slice(0, 4).map((monitor, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Activity className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{monitor}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Interwencje:</h4>
                  <ul className="space-y-2">
                    {result.interventions.slice(0, 4).map((intervention, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Zap className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{intervention}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Rokowanie:</h4>
                <p className="text-gray-700 text-sm">{result.prognosis}</p>
              </div>

              {result.severity === 'critical' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-red-800 mb-1">
                        UWAGA: Krytyczne urazy wielonarządowe!
                      </p>
                      <p className="text-xs text-red-700">
                        ISS {result.issScore} wskazuje na zagrożenie życia. Konieczna natychmiastowa kompleksowa opieka w ośrodku referencyjnym.
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {!showResult && anyRegionScored && (
          <div className="mt-8 bg-white rounded-xl shadow-md border border-gray-200 p-8 text-center">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Skala ISS
            </h3>
            <p className="text-gray-500 mb-4">
              Oceń wszystkie regiony i kliknij "Oblicz ISS"
            </p>
            <div className="text-sm text-gray-600">
              Aktualne ISS: {currentISS}/75
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ISSCalculator;