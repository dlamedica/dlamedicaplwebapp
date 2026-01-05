import React, { useState } from 'react';
import { ArrowLeft, Activity, AlertTriangle, CheckCircle, RotateCcw, Zap } from 'lucide-react';

interface LownResult {
  grade: string;
  classification: string;
  description: string;
  riskLevel: string;
  prognosticSignificance: string;
  managementRecommendations: string[];
  color: string;
}

const LownCalculator: React.FC = () => {  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [result, setResult] = useState<LownResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const lownGrades = [
    {
      grade: '0',
      title: 'Stopień 0',
      description: 'Brak dodatkowych skurczów komorowych',
      details: 'Prawidłowy rytm zatokowy bez żadnych dodatkowych skurczów komorowych (VPC/VES)'
    },
    {
      grade: '1',
      title: 'Stopień 1',
      description: 'Izolowane, jednokształtne VPC',
      details: 'Rzadkie dodatkowe skurcze komorowe (<30/godzinę), wszystkie o tej samej morfologii'
    },
    {
      grade: '2',
      title: 'Stopień 2',
      description: 'Częste VPC',
      details: 'Dodatkowe skurcze komorowe >30/godzinę, jednokształtne'
    },
    {
      grade: '3',
      title: 'Stopień 3',
      description: 'Wielokształtne VPC',
      details: 'Dodatkowe skurcze komorowe o różnej morfologii (polimorficzne)'
    },
    {
      grade: '4A',
      title: 'Stopień 4A',
      description: 'Sprzężone VPC (couplets)',
      details: 'Dwa kolejne dodatkowe skurcze komorowe następujące po sobie'
    },
    {
      grade: '4B',
      title: 'Stopień 4B',
      description: 'Częstoskurcz komorowy',
      details: '≥3 kolejne VPC następujące po sobie (salvos), nietrwały częstoskurcz komorowy'
    },
    {
      grade: '5',
      title: 'Stopień 5',
      description: 'Wczesne VPC (R na T)',
      details: 'VPC nakładające się na załamek T poprzedzającego skurczu (zjawisko R na T)'
    }
  ];

  const getResult = (grade: string): LownResult => {
    const resultMap: Record<string, Omit<LownResult, 'grade'>> = {
      '0': {
        classification: 'Stopień 0 - Brak VPC',
        description: 'Prawidłowy rytm zatokowy bez dodatkowych skurczów komorowych.',
        riskLevel: 'Minimalne',
        prognosticSignificance: 'Brak zwiększonego ryzyka nagłego zgonu sercowego. Prawidłowy rytm serca.',
        managementRecommendations: [
          'Brak konieczności leczenia antyarytmicznego',
          'Kontynuacja standardowej opieki kardiologicznej',
          'Regularne kontrole EKG zgodnie z wytycznymi',
          'Utrzymanie zdrowego stylu życia',
          'Kontrola czynników ryzyka sercowo-naczyniowego'
        ],
        color: 'green'
      },
      '1': {
        classification: 'Stopień 1 - Izolowane VPC',
        description: 'Rzadkie, jednokształtne dodatkowe skurcze komorowe.',
        riskLevel: 'Niskie',
        prognosticSignificance: 'Minimalne zwiększenie ryzyka. Zazwyczaj bez znaczenia klinicznego u osób bez choroby serca.',
        managementRecommendations: [
          'Zwykle nie wymaga leczenia antyarytmicznego',
          'Ocena objawów (palpitacje, zawroty głowy)',
          'Wykluczenie przyczyn metabolicznych (elektrolitowych)',
          'Ograniczenie kofeiny, alkoholu, nikotyny',
          'Kontrola po 6-12 miesiącach'
        ],
        color: 'green'
      },
      '2': {
        classification: 'Stopień 2 - Częste VPC',
        description: 'Częste dodatkowe skurcze komorowe, ale jednokształtne.',
        riskLevel: 'Niskie do umiarkowanego',
        prognosticSignificance: 'Lekko zwiększone ryzyko, szczególnie u pacjentów z chorobą serca strukturalną.',
        managementRecommendations: [
          'Ocena występowania objawów klinicznych',
          'Echokardiografia - wykluczenie choroby strukturalnej serca',
          'Rozważenie 24h Holtera dla oceny obciążenia VPC',
          'Leczenie antyarytmiczne jeśli objawy nasilone',
          'Beta-blokery jako leczenie pierwszego rzutu',
          'Kontrola co 3-6 miesięcy'
        ],
        color: 'yellow'
      },
      '3': {
        classification: 'Stopień 3 - Wielokształtne VPC',
        description: 'Dodatkowe skurcze komorowe o różnej morfologii.',
        riskLevel: 'Umiarkowane',
        prognosticSignificance: 'Umiarkowanie zwiększone ryzyko arytmii zagrażających życiu, szczególnie przy strukturalnej chorobie serca.',
        managementRecommendations: [
          'Obowiązkowa ocena kardiologiczna',
          'Echokardiografia i możliwy test wysiłkowy',
          '24-48h monitorowanie Holter',
          'Leczenie antyarytmiczne częściej wskazane',
          'Beta-blokery lub antagoniści wapnia',
          'Rozważenie amiodaronu w przypadkach opornych',
          'Regularne kontrole co 3 miesiące'
        ],
        color: 'orange'
      },
      '4A': {
        classification: 'Stopień 4A - Couplets',
        description: 'Sprzężone dodatkowe skurcze komorowe (pary VPC).',
        riskLevel: 'Podwyższone',
        prognosticSignificance: 'Zwiększone ryzyko rozwoju bardziej złożonych arytmii komorowych i nagłego zgonu sercowego.',
        managementRecommendations: [
          'PILNA ocena kardiologiczna',
          'Kompleksowa diagnostyka (ECHO, Holter, test wysiłkowy)',
          'Wykluczenie ostrego zespołu wieńcowego',
          'Leczenie antyarytmiczne zwykle wskazane',
          'Beta-blokery lub amiodaron',
          'Rozważenie elektrofizjologii',
          'Ścisłe monitorowanie - kontrole co 4-6 tygodni'
        ],
        color: 'orange'
      },
      '4B': {
        classification: 'Stopień 4B - Nietrwały VT',
        description: 'Nietrwały częstoskurcz komorowy (≥3 kolejne VPC).',
        riskLevel: 'Wysokie',
        prognosticSignificance: 'Znacząco zwiększone ryzyko trwałego częstoskurczu komorowego i nagłego zgonu sercowego.',
        managementRecommendations: [
          'NATYCHMIASTOWA ocena kardiologiczna/arytmologiczna',
          'Hospitalizacja do monitorowania',
          'Kompleksowa diagnostyka inwazyjna',
          'Badanie elektrofizjologiczne',
          'Agresywne leczenie antyarytmiczne (amiodaron)',
          'Rozważenie ICD (kardiowerter-defibrylator)',
          'Ciągłe monitorowanie telemetryczne'
        ],
        color: 'red'
      },
      '5': {
        classification: 'Stopień 5 - R na T',
        description: 'Wczesne VPC nakładające się na załamek T (zjawisko R na T).',
        riskLevel: 'Bardzo wysokie (groźne)',
        prognosticSignificance: 'BARDZO WYSOKIE ryzyko wywołania migotania komór i nagłej śmierci sercowej. Zjawisko R na T może być wyzwalaczem VF.',
        managementRecommendations: [
          'NATYCHMIASTOWA hospitalizacja na oddziale intensywnej terapii',
          'Ciągłe monitorowanie telemetryczne z gotowością do defibrylacji',
          'Pilne leczenie przyczyny podstawowej',
          'Korekta zaburzeń elektrolitowych (K+, Mg2+)',
          'Amiodaron lub lidokaina i.v.',
          'Przygotowanie do interwencji ratujących życie',
          'Rozważenie pilnej implantacji tymczasowego ICD',
          'Konsultacja arytmologa w trybie pilnym'
        ],
        color: 'red'
      }
    };

    return {
      grade,
      classification: resultMap[grade].classification,
      description: resultMap[grade].description,
      riskLevel: resultMap[grade].riskLevel,
      prognosticSignificance: resultMap[grade].prognosticSignificance,
      managementRecommendations: resultMap[grade].managementRecommendations,
      color: resultMap[grade].color
    };
  };

  const handleCalculate = () => {
    if (!selectedGrade) return;
    
    const calculatedResult = getResult(selectedGrade);
    setResult(calculatedResult);
    setShowResult(true);
  };

  const handleReset = () => {
    setSelectedGrade('');
    setResult(null);
    setShowResult(false);
  };

  const getRiskColor = (grade: string) => {
    if (['0', '1'].includes(grade)) return 'text-green-600 bg-green-50 border-green-200';
    if (['2', '3'].includes(grade)) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (['4A'].includes(grade)) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
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
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Klasyfikacja Lown
              </h1>
              <p className="text-gray-600 text-sm">
                Lown Classification of Ventricular Premature Complexes
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
                <p><strong>Zastosowanie:</strong> Stratyfikacja ryzyka w arytmiach komorowych</p>
                <p><strong>Cel:</strong> Klasyfikacja prognostyczna dodatkowych skurczów komorowych (VPC/VES)</p>
                <p><strong>Interpretacja:</strong> Im wyższy stopień, tym większe ryzyko arytmii zagrażających życiu</p>
              </div>
            </div>

            {/* Calculator Form */}
            <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Wybierz typ obserwowanych dodatkowych skurczów komorowych:
              </h3>
              
              <div className="space-y-3">
                {lownGrades.map(option => (
                  <label
                    key={option.grade}
                    className={`block p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedGrade === option.grade
                        ? 'border-blue-300 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-blue-200 hover:bg-blue-25'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="radio"
                        name="lown"
                        value={option.grade}
                        checked={selectedGrade === option.grade}
                        onChange={(e) => setSelectedGrade(e.target.value)}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-blue-700">{option.title}:</span>
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
                  disabled={!selectedGrade}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    selectedGrade
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle className="w-5 h-5 inline mr-2" />
                  Oceń stopień Lown
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
                      {result.classification}
                    </h3>
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getRiskColor(result.grade)}`}>
                      <span className="mr-2">
                        {['0', '1'].includes(result.grade) && '✅'}
                        {['2', '3'].includes(result.grade) && '⚠️'}
                        {['4A'].includes(result.grade) && '🟠'}
                        {['4B', '5'].includes(result.grade) && '🚨'}
                      </span>
                      Ryzyko: {result.riskLevel}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Opis:</h4>
                    <p className="text-gray-700">{result.description}</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Znaczenie prognostyczne:</h4>
                    <p className="text-gray-700">{result.prognosticSignificance}</p>
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

                  {['4B', '5'].includes(result.grade) && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-red-800 mb-1">
                            UWAGA: Bardzo wysokie ryzyko!
                          </p>
                          <p className="text-xs text-red-700">
                            {result.grade === '5' 
                              ? 'Zjawisko R na T może wywołać migotanie komór - zagrożenie życia!'
                              : 'Nietrwały częstoskurcz komorowy wymaga natychmiastowej interwencji.'}
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
                  Klasyfikacja Lown
                </h3>
                <p className="text-gray-500">
                  Wybierz typ VPC i kliknij "Oceń stopień Lown"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LownCalculator;