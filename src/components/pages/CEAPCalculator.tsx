import React, { useState } from 'react';
import { ArrowLeft, Activity, AlertTriangle, CheckCircle, RotateCcw, Heart, Zap, Stethoscope } from 'lucide-react';

interface CEAPComponent {
  id: string;
  name: string;
  category: 'clinical' | 'etiology' | 'anatomy' | 'pathophysiology' | 'disability';
  options: CEAPOption[];
  required: boolean;
}

interface CEAPOption {
  code: string;
  description: string;
  details: string;
}

interface CEAPResult {
  scores: Record<string, string>;
  fullClassification: string;
  clinicalClass: string;
  disabilityScore: string;
  interpretation: string;
  severity: 'mild' | 'moderate' | 'severe';
  recommendations: string[];
  treatmentOptions: string[];
  prognosis: string;
  followUp: string[];
  color: string;
}

const CEAPCalculator: React.FC = () => {
  const [scores, setScores] = useState<Record<string, string>>({
    clinical: '',
    etiology: '',
    anatomy: '',
    pathophysiology: '',
    disability: ''
  });
  const [result, setResult] = useState<CEAPResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const ceapComponents: CEAPComponent[] = [
    {
      id: 'clinical',
      name: 'C - CLINICAL (Objawy kliniczne)',
      category: 'clinical',
      required: true,
      options: [
        { code: 'C0', description: 'Brak widocznych objawów choroby żył', details: 'Brak żylaków, obrzęków, zmian skórnych' },
        { code: 'C1', description: 'Teleangiektazje, żylaki siatkowate', details: 'Drobne żylaki do 1mm średnicy' },
        { code: 'C2', description: 'Żylaki powierzchowne', details: 'Żylaki >3mm średnicy' },
        { code: 'C3', description: 'Obrzęk', details: 'Obrzęk kończyny dolnej związany z chorobą żył' },
        { code: 'C4a', description: 'Zmiany skórne: hiperpigmentacja, wyprysk żylny', details: 'Zmiany zapalne skóry w obrębie kostki' },
        { code: 'C4b', description: 'Stwardnienie skóry białe (lipodermatosclerosis), atrophie blanche', details: 'Zaawansowane zmiany skórne' },
        { code: 'C5', description: 'Wygojone owrzodzenie żylne', details: 'Historia owrzodzeń żylnych' },
        { code: 'C6', description: 'Czynne owrzodzenie żylne', details: 'Obecne owrzodzenie związane z chorobą żył' }
      ]
    },
    {
      id: 'etiology',
      name: 'E - ETIOLOGY (Etiologia)',
      category: 'etiology',
      required: true,
      options: [
        { code: 'Ec', description: 'Wrodzona', details: 'Wrodzone malformacje żylne' },
        { code: 'Ep', description: 'Pierwotna (nieznana przyczyna)', details: 'Pierwotna niewydolność żylna' },
        { code: 'Es', description: 'Wtórna (znana przyczyna)', details: 'Wtórna do zakrzepicy, urazu, itp.' }
      ]
    },
    {
      id: 'anatomy',
      name: 'A - ANATOMY (Lokalizacja anatomiczna)',
      category: 'anatomy',
      required: true,
      options: [
        { code: 'As', description: 'Żyły powierzchowne', details: 'System żył powierzchownych (odpiszczelowa, odstrzałkowa)' },
        { code: 'Ad', description: 'Żyły głębokie', details: 'System żył głębokich (udowa, podkolanowa)' },
        { code: 'Ap', description: 'Żyły przeszywające (perforujące)', details: 'Żyły łączące system powierzchowny z głębokim' }
      ]
    },
    {
      id: 'pathophysiology',
      name: 'P - PATHOPHYSIOLOGY (Patofizjologia)',
      category: 'pathophysiology',
      required: true,
      options: [
        { code: 'Pr', description: 'Refluks (cofanie krwi)', details: 'Niewydolność zastawek żylnych' },
        { code: 'Po', description: 'Niedrożność', details: 'Blokada przepływu żylnego' },
        { code: 'Pr,o', description: 'Refluks i niedrożność', details: 'Kombinacja obu mechanizmów' }
      ]
    },
    {
      id: 'disability',
      name: 'Stopień niepełnosprawności',
      category: 'disability',
      required: false,
      options: [
        { code: '0', description: 'Asymptomatyczna', details: 'Brak objawów wpływających na jakość życia' },
        { code: '1', description: 'Objawy obecne, ale nie interferują z aktywnością', details: 'Łagodne objawy nieograniczające aktywności' },
        { code: '2', description: 'Objawy interferują z aktywnością, ale pacjent może pracować', details: 'Umiarkowane ograniczenie aktywności' },
        { code: '3', description: 'Objawy uniemożliwiają pracę', details: 'Znaczne ograniczenie aktywności zawodowej' }
      ]
    }
  ];

  const getResult = (scores: Record<string, string>): CEAPResult => {
    const clinical = scores.clinical || 'C0';
    const etiology = scores.etiology || 'Ep';
    const anatomy = scores.anatomy || 'As';
    const pathophysiology = scores.pathophysiology || 'Pr';
    const disability = scores.disability || '0';

    const fullClassification = `${clinical}${etiology}${anatomy}${pathophysiology}`;
    const clinicalClass = clinical;
    
    let severity: 'mild' | 'moderate' | 'severe';
    let interpretation: string;
    let color: string;
    let recommendations: string[];
    let treatmentOptions: string[];
    let prognosis: string;
    let followUp: string[];

    // Określenie ciężkości na podstawie klasy klinicznej
    if (clinical === 'C0' || clinical === 'C1') {
      severity = 'mild';
      interpretation = 'Łagodna choroba żył - kosmetyczny problem';
      color = 'green';
      recommendations = [
        'Profilaktyka: kompresja, aktywność fizyczna',
        'Unikanie długiego stania/siedzenia',
        'Kontrola masy ciała',
        'Regularna aktywność fizyczna',
        'Uniesienie kończyn podczas odpoczynku'
      ];
      treatmentOptions = [
        'Leczenie zachowawcze',
        'Skleroterapia (C1)',
        'Leczenie laserowe',
        'Kompresoterapia profilaktyczna'
      ];
      prognosis = 'Doskonałe rokowanie. Problem głównie kosmetyczny.';
      followUp = [
        'Kontrole raz na 2-3 lata',
        'Obserwacja objawów progresji',
        'Edukacja profilaktyczna'
      ];
    } else if (clinical === 'C2' || clinical === 'C3') {
      severity = 'moderate';
      interpretation = 'Umiarkowana choroba żył - wymagane leczenie';
      color = 'orange';
      recommendations = [
        'Kompresoterapia (20-30 mmHg)',
        'Leczenie przyczynowe żylaków',
        'Redukcja czynników ryzyka',
        'Regularna aktywność fizyczna',
        'Leczenie inwazyjne w przypadku objawów'
      ];
      treatmentOptions = [
        'Skleroterapia',
        'Ablacja endowenous (RFA, EVLA)',
        'Miniflebektomia',
        'Kompresoterapia stała',
        'Farmakoterapia (wenoprotektory)'
      ];
      prognosis = 'Dobre rokowanie przy odpowiednim leczeniu.';
      followUp = [
        'Kontrole co 6-12 miesięcy',
        'Ocena skuteczności leczenia',
        'Monitorowanie progresji'
      ];
    } else {
      severity = 'severe';
      interpretation = 'Zaawansowana choroba żył - konieczne intensywne leczenie';
      color = 'red';
      recommendations = [
        'PILNE leczenie specjalistyczne',
        'Kompresoterapia wysokiej klasy (30-40 mmHg)',
        'Leczenie owrzodzeń (jeśli obecne)',
        'Kompleksowa opieka nad raną',
        'Leczenie chirurgiczne/endowaskularne'
      ];
      treatmentOptions = [
        'Ablacja żył głównych',
        'Chirurgia żył głębokich (jeśli wskazana)',
        'Leczenie owrzodzeń',
        'Kompresoterapia intensywna',
        'Farmakoterapia wspomagająca',
        'Fizjoterapia i limfodrenaz'
      ];
      prognosis = 'Rokowanie zależy od przestrzegania leczenia. Ryzyko powikłań bez leczenia.';
      followUp = [
        'Kontrole co 1-3 miesiące',
        'Monitorowanie gojenia owrzodzeń',
        'Ocena skuteczności kompresji',
        'Regulne badania USG Doppler'
      ];
    }

    return {
      scores,
      fullClassification,
      clinicalClass,
      disabilityScore: disability,
      interpretation,
      severity,
      recommendations,
      treatmentOptions,
      prognosis,
      followUp,
      color
    };
  };

  const handleScoreChange = (componentId: string, value: string) => {
    setScores(prev => ({
      ...prev,
      [componentId]: value
    }));
  };

  const handleCalculate = () => {
    const calculatedResult = getResult(scores);
    setResult(calculatedResult);
    setShowResult(true);
  };

  const handleReset = () => {
    setScores({
      clinical: '',
      etiology: '',
      anatomy: '',
      pathophysiology: '',
      disability: ''
    });
    setResult(null);
    setShowResult(false);
  };


  const getSeverityColor = (severity: string) => {
    const colors = {
      'mild': 'text-green-600 bg-green-50 border-green-200',
      'moderate': 'text-orange-600 bg-orange-50 border-orange-200',
      'severe': 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[severity as keyof typeof colors] || colors.mild;
  };

  const allRequiredCompleted = ceapComponents
    .filter(comp => comp.required)
    .every(comp => scores[comp.id] !== '');

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
                  <Activity className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Klasyfikacja CEAP
              </h1>
              <p className="text-gray-600 text-sm">
                Clinical, Etiological, Anatomical, Pathophysiological
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
                Informacje o klasyfikacji
              </h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p><strong>Zastosowanie:</strong> Kompleksowa ocena przewlekłej choroby żył</p>
                <p><strong>Komponenty:</strong> Klinika, Etiologia, Anatomia, Patofizjologia</p>
                <p><strong>Standard:</strong> Międzynarodowa klasyfikacja CEAP</p>
                <p><strong>Zastosowanie:</strong> Chirurgia naczyniowa, flebologia</p>
              </div>
            </div>

            {/* Current Classification Display */}
            {allRequiredCompleted && (
              <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    {scores.clinical}{scores.etiology}{scores.anatomy}{scores.pathophysiology}
                  </div>
                  {scores.disability && (
                    <div className="text-lg text-gray-600 mb-2">
                      Niepełnosprawność: {scores.disability}
                    </div>
                  )}
                  <div className="text-sm text-gray-600">
                    Aktualna klasyfikacja CEAP
                  </div>
                </div>
              </div>
            )}

            {/* Calculator Form */}
            <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Oceń pacjenta w każdej kategorii CEAP:
              </h3>
              
              {ceapComponents.map((component) => (
                <div key={component.id} className="mb-6">
                  <h4 className="text-md font-semibold text-blue-700 mb-3">
                    {component.name}{component.required && <span className="text-red-500">*</span>}:
                  </h4>
                  <div className="space-y-2">
                    {component.options.map((option) => (
                      <label
                        key={`${component.id}-${option.code}`}
                        className={`block p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                          scores[component.id] === option.code
                            ? 'border-blue-300 bg-blue-50 shadow-sm'
                            : 'border-gray-200 hover:border-blue-200 hover:bg-blue-25'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <input
                            type="radio"
                            name={component.id}
                            value={option.code}
                            checked={scores[component.id] === option.code}
                            onChange={(e) => handleScoreChange(component.id, e.target.value)}
                            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 text-sm">
                              {option.code} - {option.description}
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
                  disabled={!allRequiredCompleted}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    allRequiredCompleted
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle className="w-5 h-5 inline mr-2" />
                  Klasyfikuj CEAP
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
                      Klasyfikacja CEAP
                    </h3>
                    <div className="text-3xl font-mono font-bold text-blue-600 mb-2">
                      {result.fullClassification}
                    </div>
                    {result.disabilityScore && result.disabilityScore !== '0' && (
                      <div className="text-lg text-gray-700 mb-2">
                        Niepełnosprawność: {result.disabilityScore}
                      </div>
                    )}
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getSeverityColor(result.severity)}`}>
                      <span className="mr-2">
                        {result.severity === 'mild' && '✅'}
                        {result.severity === 'moderate' && '⚠️'}
                        {result.severity === 'severe' && '🚨'}
                      </span>
                      {result.severity === 'mild' ? 'Łagodna' :
                       result.severity === 'moderate' ? 'Umiarkowana' :
                       'Zaawansowana'}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Interpretacja:</h4>
                    <p className="text-gray-700 text-sm mb-3">{result.interpretation}</p>
                    <h4 className="font-semibold text-gray-900 mb-2">Rokowanie:</h4>
                    <p className="text-gray-700 text-sm">{result.prognosis}</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Szczegóły klasyfikacji:</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Klinika:</span> {result.scores.clinical}
                      </div>
                      <div>
                        <span className="font-medium">Etiologia:</span> {result.scores.etiology}
                      </div>
                      <div>
                        <span className="font-medium">Anatomia:</span> {result.scores.anatomy}
                      </div>
                      <div>
                        <span className="font-medium">Patofizjologia:</span> {result.scores.pathophysiology}
                      </div>
                    </div>
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
                    <h4 className="font-semibold text-gray-900 mb-3">Opcje leczenia:</h4>
                    <ul className="space-y-2">
                      {result.treatmentOptions.map((option, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Stethoscope className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{option}</span>
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

                  {result.severity === 'severe' && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-red-800 mb-1">
                            UWAGA: Zaawansowana choroba żył!
                          </p>
                          <p className="text-xs text-red-700">
                            Klasyfikacja C4-C6 wymaga specjalistycznego leczenia flebologicznego i regularnej opieki medycznej.
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
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Klasyfikacja CEAP
                </h3>
                <p className="text-gray-500 mb-4">
                  Wypełnij wszystkie wymagane kategorie i kliknij "Klasyfikuj CEAP"
                </p>
                <div className="text-sm text-gray-600">
                  <div><strong>C</strong> - Klinika</div>
                  <div><strong>E</strong> - Etiologia</div>
                  <div><strong>A</strong> - Anatomia</div>
                  <div><strong>P</strong> - Patofizjologia</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CEAPCalculator;