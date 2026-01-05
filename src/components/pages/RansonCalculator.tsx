import React, { useState } from 'react';
import { ArrowLeft, Activity, AlertTriangle, CheckCircle, RotateCcw, Clipboard } from 'lucide-react';

interface RansonCriteria {
  id: string;
  label: string;
  category: 'admission' | 'within48h';
}

interface RansonResult {
  criteriaCount: number;
  severity: 'mild' | 'moderate' | 'severe' | 'critical';
  mortality: string;
  description: string;
  managementRecommendations: string[];
  monitoringRecommendations: string[];
  color: string;
}

const RansonCalculator: React.FC = () => {  const [selectedCriteria, setSelectedCriteria] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<RansonResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const ransonCriteria: RansonCriteria[] = [
    // Admission criteria (0 hours)
    {
      id: 'age',
      label: 'Wiek >55 lat',
      category: 'admission'
    },
    {
      id: 'wbc',
      label: 'Leukocytoza >16 000/μl',
      category: 'admission'
    },
    {
      id: 'glucose',
      label: 'Glikemia >200 mg/dl (11,1 mmol/l)',
      category: 'admission'
    },
    {
      id: 'ldh',
      label: 'LDH >350 U/l',
      category: 'admission'
    },
    {
      id: 'ast',
      label: 'AST (SGOT) >250 U/l',
      category: 'admission'
    },
    // Within 48 hours criteria
    {
      id: 'hematocrit',
      label: 'Spadek hematokrytu >10%',
      category: 'within48h'
    },
    {
      id: 'bun',
      label: 'Wzrost mocznika >5 mg/dl (1,79 mmol/l)',
      category: 'within48h'
    },
    {
      id: 'calcium',
      label: 'Wapń w surowicy <8 mg/dl (2,0 mmol/l)',
      category: 'within48h'
    },
    {
      id: 'pao2',
      label: 'PaO₂ <60 mmHg',
      category: 'within48h'
    },
    {
      id: 'base_deficit',
      label: 'Deficyt zasad >4 mEq/l',
      category: 'within48h'
    },
    {
      id: 'fluid_sequestration',
      label: 'Sekwestracja płynów >6 litrów',
      category: 'within48h'
    }
  ];

  const getResult = (criteriaCount: number): RansonResult => {
    if (criteriaCount <= 2) {
      return {
        criteriaCount,
        severity: 'mild',
        mortality: '<1%',
        description: 'Łagodne ostre zapalenie trzustki. Rokowanie bardzo dobre.',
        managementRecommendations: [
          'Leczenie zachowawcze',
          'Doustne lub dożylne uzupełnianie płynów',
          'Leki przeciwbólowe (unikać morfiny)',
          'Dieta płynna, postupowo poszerzanie',
          'Monitorowanie podstawowych parametrów życiowych',
          'Obserwacja objawów progresji choroby'
        ],
        monitoringRecommendations: [
          'Regularne kontrole laboratoryjne co 12-24h',
          'Monitorowanie bólu brzucha',
          'Kontrola bilansu płynowego',
          'Obserwacja objawów powikłań miejscowych'
        ],
        color: 'green'
      };
    } else if (criteriaCount <= 4) {
      return {
        criteriaCount,
        severity: 'moderate',
        mortality: '15%',
        description: 'Umiarkowanie ciężkie ostre zapalenie trzustki. Zwiększone ryzyko powikłań.',
        managementRecommendations: [
          'Intensywne leczenie zachowawcze',
          'Agresywne uzupełnianie płynów i.v.',
          'Skuteczna kontrola bólu',
          'Żywienie dojelitowe lub parenteralne',
          'Antybiotykoterapia profilaktyczna (kontrowersyjna)',
          'Monitorowanie w warunkach zwiększonego nadzoru',
          'Przygotowanie do potencjalnych interwencji'
        ],
        monitoringRecommendations: [
          'Częste kontrole laboratoryjne co 6-12h',
          'Monitorowanie parametrów życiowych',
          'Kontrola funkcji narządów',
          'Obrazowanie CT w przypadku pogorszenia',
          'Obserwacja objawów SIRS/sepsis'
        ],
        color: 'yellow'
      };
    } else if (criteriaCount <= 6) {
      return {
        criteriaCount,
        severity: 'severe',
        mortality: '40%',
        description: 'Ciężkie ostre zapalenie trzustki. Wysokie ryzyko powikłań ogólnoustrojowych.',
        managementRecommendations: [
          'Intensywna terapia wielonarządowa',
          'Agresywna resuscytacja płynowa',
          'Wspomaganie funkcji oddechowej',
          'Żywienie parenteralne całkowite',
          'Antybiotykoterapia celowana',
          'Kontrola glikemii',
          'Leczenie wspomagające funkcje narządów',
          'Rozważenie interwencji chirurgicznej lub endoskopowej'
        ],
        monitoringRecommendations: [
          'Ciągłe monitorowanie w ICU',
          'Kontrole laboratoryjne co 4-6h',
          'Monitorowanie hemodynamiczne',
          'Regularne obrazowanie CT/MRI',
          'Ocena funkcji oddechowej',
          'Kontrola funkcji nerek i wątroby'
        ],
        color: 'orange'
      };
    } else {
      return {
        criteriaCount,
        severity: 'critical',
        mortality: '≥100%',
        description: 'Krytycznie ciężkie ostre zapalenie trzustki. Bardzo wysokie ryzyko zgonu.',
        managementRecommendations: [
          'NATYCHMIASTOWA intensywna terapia',
          'Kompleksowe wspomaganie funkcji życiowych',
          'Mechaniczne wspomaganie oddychania',
          'Terapia nerkozastępcza',
          'Leki wazopresyjne i inotropowe',
          'Pilna interwencja chirurgiczna lub radiologiczna',
          'Kompleksowa antybiotykoterapia',
          'Leczenie powikłań miejscowych i ogólnoustrojowych',
          'Rozważenie ECMO w przypadkach skrajnych'
        ],
        monitoringRecommendations: [
          'Intensywne monitorowanie w ICU',
          'Ciągłe monitorowanie hemodynamiczne',
          'Kontrole laboratoryjne co 2-4h',
          'Codzienne obrazowanie',
          'Monitorowanie wszystkich funkcji narządowych',
          'Regulna ocena neurológiczna',
          'Planowanie długoterminowej opieki'
        ],
        color: 'red'
      };
    }
  };

  const handleCriteriaChange = (criteriaId: string, checked: boolean) => {
    const newSelected = new Set(selectedCriteria);
    if (checked) {
      newSelected.add(criteriaId);
    } else {
      newSelected.delete(criteriaId);
    }
    setSelectedCriteria(newSelected);
  };

  const handleCalculate = () => {
    const criteriaCount = selectedCriteria.size;
    const calculatedResult = getResult(criteriaCount);
    setResult(calculatedResult);
    setShowResult(true);
  };

  const handleReset = () => {
    setSelectedCriteria(new Set());
    setResult(null);
    setShowResult(false);
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      'mild': 'text-green-600 bg-green-50 border-green-200',
      'moderate': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'severe': 'text-orange-600 bg-orange-50 border-orange-200',
      'critical': 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[severity as keyof typeof colors] || colors.mild;
  };

  const admissionCriteria = ransonCriteria.filter(c => c.category === 'admission');
  const within48hCriteria = ransonCriteria.filter(c => c.category === 'within48h');

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-orange-100">
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
                <div className="p-2 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full">
                  <Clipboard className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                Kryteria Ransona
              </h1>
              <p className="text-gray-600 text-sm">
                Ranson Criteria for Acute Pancreatitis
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
            <div className="bg-white rounded-xl shadow-md border border-orange-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Informacje o kryteriach
              </h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p><strong>Zastosowanie:</strong> Ocena ciężkości i rokowania w ostrym zapaleniu trzustki</p>
                <p><strong>Cel:</strong> Prognostyczne kryteria oparte na parametrach klinicznych i laboratoryjnych</p>
                <p><strong>Interpretacja:</strong> Im więcej kryteriów, tym większe ryzyko ciężkiego przebiegu</p>
              </div>
            </div>

            {/* Calculator Form */}
            <div className="bg-white rounded-xl shadow-md border border-orange-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Zaznacz spełnione kryteria:
              </h3>
              
              {/* Admission Criteria */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-orange-700 mb-3">
                  Kryteria przy przyjęciu (0 godzin):
                </h4>
                <div className="space-y-3">
                  {admissionCriteria.map(criteria => (
                    <label
                      key={criteria.id}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedCriteria.has(criteria.id)
                          ? 'border-orange-300 bg-orange-50 shadow-sm'
                          : 'border-gray-200 hover:border-orange-200 hover:bg-orange-25'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCriteria.has(criteria.id)}
                        onChange={(e) => handleCriteriaChange(criteria.id, e.target.checked)}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-900">{criteria.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Within 48h Criteria */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-orange-700 mb-3">
                  Kryteria w ciągu 48 godzin:
                </h4>
                <div className="space-y-3">
                  {within48hCriteria.map(criteria => (
                    <label
                      key={criteria.id}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedCriteria.has(criteria.id)
                          ? 'border-orange-300 bg-orange-50 shadow-sm'
                          : 'border-gray-200 hover:border-orange-200 hover:bg-orange-25'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCriteria.has(criteria.id)}
                        onChange={(e) => handleCriteriaChange(criteria.id, e.target.checked)}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-900">{criteria.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Criteria Counter */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  Spełnionych kryteriów: <strong>{selectedCriteria.size}/11</strong>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handleCalculate}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-600 text-white rounded-lg hover:from-orange-600 hover:to-yellow-700 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <CheckCircle className="w-5 h-5 inline mr-2" />
                  Oceń ryzyko Ranson
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
                      Kryteria Ransona: {result.criteriaCount}/11
                    </h3>
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getSeverityColor(result.severity)}`}>
                      <span className="mr-2">
                        {result.severity === 'mild' && '✅'}
                        {result.severity === 'moderate' && '⚠️'}
                        {result.severity === 'severe' && '🟠'}
                        {result.severity === 'critical' && '🚨'}
                      </span>
                      Śmiertelność: {result.mortality}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Interpretacja:</h4>
                    <p className="text-gray-700">{result.description}</p>
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
                          <Activity className="w-4 h-4 mt-0.5 flex-shrink-0" style={{color: '#38b6ff'}} />
                          <span className="text-gray-700 text-sm">{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {result.severity === 'critical' && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-red-800 mb-1">
                            UWAGA: Krytycznie ciężkie zapalenie trzustki!
                          </p>
                          <p className="text-xs text-red-700">
                            Bardzo wysokie ryzyko zgonu. Konieczna natychmiastowa intensywna terapia i rozważenie interwencji chirurgicznej.
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
                <Clipboard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Kryteria Ransona
                </h3>
                <p className="text-gray-500 mb-4">
                  Zaznacz spełnione kryteria i kliknij "Oceń ryzyko Ranson"
                </p>
                <div className="text-sm text-gray-600">
                  Wybrane kryteria: <span className="font-semibold">{selectedCriteria.size}/11</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RansonCalculator;