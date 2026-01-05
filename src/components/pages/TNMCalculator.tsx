import React, { useState } from 'react';
import { ArrowLeft, Target, AlertTriangle, CheckCircle, RotateCcw, Clipboard } from 'lucide-react';

interface TNMResult {
  tnm: string;
  stage: string;
  description: string;
  prognosis: string;
  treatmentRecommendations: string[];
  followUpRecommendations: string[];
  color: string;
}

const TNMCalculator: React.FC = () => {  const [selectedT, setSelectedT] = useState<string>('');
  const [selectedN, setSelectedN] = useState<string>('');
  const [selectedM, setSelectedM] = useState<string>('');
  const [result, setResult] = useState<TNMResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const tOptions = [
    { value: 'TX', label: 'TX - Nie można ocenić guza pierwotnego' },
    { value: 'T0', label: 'T0 - Brak dowodów na obecność guza pierwotnego' },
    { value: 'Tis', label: 'Tis - Rak in situ' },
    { value: 'T1', label: 'T1 - Mały guz ograniczony do narządu pochodzenia' },
    { value: 'T2', label: 'T2 - Większy guz lub ograniczone naciekanie sąsiednich struktur' },
    { value: 'T3', label: 'T3 - Rozleglejsze naciekanie miejscowe' },
    { value: 'T4', label: 'T4 - Naciekanie sąsiednich narządów lub struktur' }
  ];

  const nOptions = [
    { value: 'NX', label: 'NX - Nie można ocenić węzłów chłonnych regionalnych' },
    { value: 'N0', label: 'N0 - Brak przerzutów do regionalnych węzłów chłonnych' },
    { value: 'N1', label: 'N1 - Przerzuty do 1-3 regionalnych węzłów chłonnych' },
    { value: 'N2', label: 'N2 - Przerzuty do 4-9 regionalnych węzłów chłonnych' },
    { value: 'N3', label: 'N3 - Przerzuty do ≥10 regionalnych węzłów chłonnych' }
  ];

  const mOptions = [
    { value: 'MX', label: 'MX - Nie można ocenić przerzutów odległych' },
    { value: 'M0', label: 'M0 - Brak przerzutów odległych' },
    { value: 'M1', label: 'M1 - Obecne przerzuty odległe' }
  ];

  const determineStage = (t: string, n: string, m: string): { stage: string, color: string } => {
    // M1 zawsze oznacza stopień IV
    if (m === 'M1') {
      return { stage: 'IV', color: 'red' };
    }

    // Rak in situ
    if (t === 'Tis' && n === 'N0' && m === 'M0') {
      return { stage: '0', color: 'green' };
    }

    // Nie można określić (zawiera X)
    if (t.includes('X') || n.includes('X') || m.includes('X')) {
      return { stage: 'Nie można określić', color: 'gray' };
    }

    // Uproszczona logika stagingu (przykład ogólny)
    if (m === 'M0') {
      // Stopień I
      if ((t === 'T1' || t === 'T2') && n === 'N0') {
        return { stage: 'I', color: 'green' };
      }
      
      // Stopień II
      if (t === 'T3' && n === 'N0') {
        return { stage: 'II', color: 'yellow' };
      }
      
      if ((t === 'T1' || t === 'T2') && n === 'N1') {
        return { stage: 'II', color: 'yellow' };
      }
      
      // Stopień III
      if (t === 'T4' && (n === 'N0' || n === 'N1')) {
        return { stage: 'III', color: 'orange' };
      }
      
      if ((t === 'T1' || t === 'T2' || t === 'T3') && (n === 'N2' || n === 'N3')) {
        return { stage: 'III', color: 'orange' };
      }
      
      if (t === 'T4' && (n === 'N2' || n === 'N3')) {
        return { stage: 'III', color: 'orange' };
      }
    }

    // Domyślnie jeśli nie pasuje do powyższych kategorii
    return { stage: 'III', color: 'orange' };
  };

  const getResult = (t: string, n: string, m: string): TNMResult => {
    const tnmClassification = `${t}${n}${m}`;
    const stageInfo = determineStage(t, n, m);
    
    const stageDescriptions: Record<string, any> = {
      '0': {
        description: 'Rak in situ - nowotwór ograniczony do miejsca powstania, bez naciekania.',
        prognosis: 'Doskonała prognoza. Prawie 100% przeżyć 5-letnich przy odpowiednim leczeniu.',
        treatmentRecommendations: [
          'Lokalne leczenie (chirurgia, radioterapia)',
          'Zazwyczaj nie wymaga chemioterapii systemowej',
          'Kompletna resekcja z marginesem bezpieczeństwa',
          'Rozważenie terapii oszczędzającej narząd'
        ],
        followUpRecommendations: [
          'Regularne kontrole co 3-6 miesięcy przez pierwsze 2 lata',
          'Następnie kontrole co 6-12 miesięcy',
          'Obrazowanie kontrolne zgodnie z wytycznymi',
          'Edukacja pacjenta nt. objawów nawrotu'
        ]
      },
      'I': {
        description: 'Wczesny nowotwór ograniczony do narządu pochodzenia.',
        prognosis: 'Bardzo dobra prognoza. 80-95% przeżyć 5-letnich w zależności od typu nowotworu.',
        treatmentRecommendations: [
          'Radykalne leczenie chirurgiczne',
          'Adjuvantowa terapia według wskazań',
          'Ocena czynników ryzyka nawrotu',
          'Multidyscyplinarna konsultacja onkologiczna'
        ],
        followUpRecommendations: [
          'Kontrole co 3-4 miesiące przez pierwsze 2 lata',
          'Następnie co 6 miesięcy do 5 lat',
          'Roczne kontrole po 5 latach',
          'Regularne badania obrazowe'
        ]
      },
      'II': {
        description: 'Nowotwór miejscowo zaawansowany z ograniczonymi przerzutami regionalnymi.',
        prognosis: 'Dobra prognoza. 60-80% przeżyć 5-letnich przy multimodalnym leczeniu.',
        treatmentRecommendations: [
          'Multimodalne leczenie (chirurgia + chemo/radio)',
          'Neoadjuvantowa lub adjuvantowa terapia systemowa',
          'Radykalna limfadenektomia',
          'Ocena możliwości leczenia oszczędzającego'
        ],
        followUpRecommendations: [
          'Intensywne kontrole co 3 miesiące przez 2 lata',
          'Co 6 miesięcy do 5 lat',
          'Regularne markery nowotworowe',
          'Obrazowanie co 6 miesięcy'
        ]
      },
      'III': {
        description: 'Miejscowo zaawansowany nowotwór z rozległymi przerzutami regionalnymi.',
        prognosis: 'Umiarkowana prognoza. 30-60% przeżyć 5-letnich, zależnie od odpowiedzi na leczenie.',
        treatmentRecommendations: [
          'Agresywne multimodalne leczenie',
          'Neoadjuvantowa chemioterapia/radioterapia',
          'Rozległa resekcja chirurgiczna',
          'Adjuvantowa terapia systemowa',
          'Rozważenie terapii celowanych'
        ],
        followUpRecommendations: [
          'Bardzo częste kontrole co 2-3 miesiące',
          'Intensywne monitorowanie markerów',
          'Obrazowanie co 3-4 miesiące',
          'Ocena jakości życia i wsparcie psychoonkologiczne'
        ]
      },
      'IV': {
        description: 'Nowotwór z przerzutami odległymi - choroba uogólniona.',
        prognosis: 'Poważna prognoza. <30% przeżyć 5-letnich. Leczenie zazwyczaj paliatywne.',
        treatmentRecommendations: [
          'Leczenie paliatywne/systemowe',
          'Chemioterapia pierwszej linii',
          'Terapie celowane i immunoterapia',
          'Leczenie objawowe i wspomagające',
          'Ocena możliwości resekcji przerzutów',
          'Opieka paliatywna'
        ],
        followUpRecommendations: [
          'Częste kontrole co 6-8 tygodni',
          'Monitorowanie odpowiedzi na leczenie',
          'Ocena tolerancji terapii',
          'Wsparcie psychoonkologiczne',
          'Planowanie opieki w terminalnej fazie'
        ]
      },
      'Nie można określić': {
        description: 'Niewystarczające dane do określenia stopnia zaawansowania.',
        prognosis: 'Prognoza niemożliwa do określenia bez kompletnej diagnostyki.',
        treatmentRecommendations: [
          'Kompletna diagnostyka onkologiczna',
          'Dodatkowe badania obrazowe',
          'Biopsja węzłów chłonnych',
          'Staging molekularny',
          'Konsultacja wielospecjalistyczna'
        ],
        followUpRecommendations: [
          'Uzupełnienie diagnostyki w trybie pilnym',
          'Restaging po uzupełnieniu badań',
          'Planowanie leczenia po otrzymaniu wyników'
        ]
      }
    };

    const stageData = stageDescriptions[stageInfo.stage] || stageDescriptions['III'];

    return {
      tnm: tnmClassification,
      stage: stageInfo.stage,
      description: stageData.description,
      prognosis: stageData.prognosis,
      treatmentRecommendations: stageData.treatmentRecommendations,
      followUpRecommendations: stageData.followUpRecommendations,
      color: stageInfo.color
    };
  };

  const handleCalculate = () => {
    if (!selectedT || !selectedN || !selectedM) return;
    
    const calculatedResult = getResult(selectedT, selectedN, selectedM);
    setResult(calculatedResult);
    setShowResult(true);
  };

  const handleReset = () => {
    setSelectedT('');
    setSelectedN('');
    setSelectedM('');
    setResult(null);
    setShowResult(false);
  };

  const getStageColor = (stage: string) => {
    const colors = {
      '0': 'text-green-600 bg-green-50 border-green-200',
      'I': 'text-green-600 bg-green-50 border-green-200',
      'II': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'III': 'text-orange-600 bg-orange-50 border-orange-200',
      'IV': 'text-red-600 bg-red-50 border-red-200',
      'Nie można określić': 'text-gray-600 bg-gray-50 border-gray-200'
    };
    return colors[stage as keyof typeof colors] || colors['III'];
  };

  const allSelected = selectedT && selectedN && selectedM;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-purple-100">
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
                <div className="p-2 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Klasyfikacja TNM
              </h1>
              <p className="text-gray-600 text-sm">
                TNM Classification of Malignant Tumors
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
            <div className="bg-white rounded-xl shadow-md border border-purple-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Informacje o klasyfikacji
              </h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p><strong>Zastosowanie:</strong> Określenie stopnia zaawansowania nowotworów złośliwych</p>
                <p><strong>Cel:</strong> Międzynarodowy standard opisu anatomicznego zasięgu nowotworów</p>
                <p><strong>Składniki:</strong> T (guz pierwotny), N (węzły chłonne), M (przerzuty odległe)</p>
              </div>
            </div>

            {/* Calculator Form */}
            <div className="bg-white rounded-xl shadow-md border border-purple-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Określ parametry TNM:
              </h3>
              
              {/* T - Primary Tumor */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  T - Guz pierwotny:
                </label>
                <div className="space-y-2">
                  {tOptions.map(option => (
                    <label
                      key={option.value}
                      className={`block p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedT === option.value
                          ? 'border-purple-300 bg-purple-50 shadow-sm'
                          : 'border-gray-200 hover:border-purple-200 hover:bg-purple-25'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="t_stage"
                          value={option.value}
                          checked={selectedT === option.value}
                          onChange={(e) => setSelectedT(e.target.value)}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                        />
                        <span className="text-sm text-gray-900">{option.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* N - Regional Lymph Nodes */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  N - Węzły chłonne regionalne:
                </label>
                <div className="space-y-2">
                  {nOptions.map(option => (
                    <label
                      key={option.value}
                      className={`block p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedN === option.value
                          ? 'border-purple-300 bg-purple-50 shadow-sm'
                          : 'border-gray-200 hover:border-purple-200 hover:bg-purple-25'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="n_stage"
                          value={option.value}
                          checked={selectedN === option.value}
                          onChange={(e) => setSelectedN(e.target.value)}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                        />
                        <span className="text-sm text-gray-900">{option.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* M - Distant Metastasis */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  M - Przerzuty odległe:
                </label>
                <div className="space-y-2">
                  {mOptions.map(option => (
                    <label
                      key={option.value}
                      className={`block p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedM === option.value
                          ? 'border-purple-300 bg-purple-50 shadow-sm'
                          : 'border-gray-200 hover:border-purple-200 hover:bg-purple-25'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="m_stage"
                          value={option.value}
                          checked={selectedM === option.value}
                          onChange={(e) => setSelectedM(e.target.value)}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                        />
                        <span className="text-sm text-gray-900">{option.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleCalculate}
                  disabled={!allSelected}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    allSelected
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle className="w-5 h-5 inline mr-2" />
                  Określ stopień TNM
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
                  result.color === 'gray' ? 'border-gray-200' :
                  'border-gray-200'
                }`}>
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {result.tnm}
                    </h3>
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getStageColor(result.stage)}`}>
                      <span className="mr-2">
                        {result.stage === '0' && '✅'}
                        {result.stage === 'I' && '✅'}
                        {result.stage === 'II' && '⚠️'}
                        {result.stage === 'III' && '🟠'}
                        {result.stage === 'IV' && '🚨'}
                        {result.stage === 'Nie można określić' && '❓'}
                      </span>
                      Stopień {result.stage}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Opis:</h4>
                    <p className="text-gray-700">{result.description}</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Rokowanie:</h4>
                    <p className="text-gray-700">{result.prognosis}</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Zalecenia terapeutyczne:</h4>
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
                    <h4 className="font-semibold text-gray-900 mb-3">Kontrole i obserwacja:</h4>
                    <ul className="space-y-2">
                      {result.followUpRecommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Clipboard className="w-4 h-4 mt-0.5 flex-shrink-0" style={{color: '#38b6ff'}} />
                          <span className="text-gray-700 text-sm">{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {result.stage === 'IV' && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-red-800 mb-1">
                            UWAGA: Choroba uogólniona!
                          </p>
                          <p className="text-xs text-red-700">
                            Obecność przerzutów odległych. Konieczna natychmiastowa konsultacja onkologiczna i rozpoczęcie leczenia systemowego.
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
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Klasyfikacja TNM
                </h3>
                <p className="text-gray-500 mb-4">
                  Wybierz parametry T, N i M, a następnie kliknij "Określ stopień TNM"
                </p>
                <div className="text-sm text-gray-600">
                  Wybrane: {selectedT && `T: ${selectedT}`} {selectedN && `N: ${selectedN}`} {selectedM && `M: ${selectedM}`}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TNMCalculator;