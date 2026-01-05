import React, { useState } from 'react';
import { ArrowLeft, Heart, AlertTriangle, CheckCircle, RotateCcw, Activity } from 'lucide-react';

interface KillipResult {
  class: number;
  classification: string;
  description: string;
  clinicalFeatures: string[];
  mortality: string;
  managementRecommendations: string[];
  color: string;
}

const KillipCalculator: React.FC = () => {  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [result, setResult] = useState<KillipResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const killipClasses = [
    {
      class: 1,
      title: 'Klasa I',
      description: 'Brak objawów niewydolności serca',
      details: 'Brak rzężeń nad płucami, brak III tonu serca, brak objawów klinicznych niewydolności serca'
    },
    {
      class: 2,
      title: 'Klasa II',
      description: 'Łagodna do umiarkowanej niewydolność serca',
      details: 'Rzężenia nad mniej niż 50% pól płucnych, może być obecny III ton serca, może być obecny podwyższony ucisk żylny'
    },
    {
      class: 3,
      title: 'Klasa III',
      description: 'Ciężka niewydolność serca',
      details: 'Rzężenia nad więcej niż 50% pól płucnych, obrzęk płuc'
    },
    {
      class: 4,
      title: 'Klasa IV',
      description: 'Wstrząs kardiogenny',
      details: 'Ciśnienie skurczowe <90 mmHg, objawy hipoperfuzji (oliguria, sinica, pocenie)'
    }
  ];

  const getResult = (killipClass: number): KillipResult => {
    const resultMap: Record<number, Omit<KillipResult, 'class'>> = {
      1: {
        classification: 'Klasa I - Brak niewydolności serca',
        description: 'Pacjent z ostrym zawałem mięśnia sercowego bez objawów klinicznych niewydolności serca.',
        clinicalFeatures: [
          'Brak rzężeń nad płucami',
          'Brak III tonu serca (galop)',
          'Prawidłowy ucisk żylny',
          'Brak objawów zastoju płucnego',
          'Dobra tolerancja wysiłku'
        ],
        mortality: '6%',
        managementRecommendations: [
          'Standardowe leczenie ostrego zespołu wieńcowego',
          'Leki przeciwpłytkowe (aspiryna, klopidogrel)',
          'Inhibitory ACE lub ARB',
          'Beta-blokery (jeśli brak przeciwwskazań)',
          'Statyny',
          'Monitorowanie objawów niewydolności serca',
          'Edukacja pacjenta nt. modyfikacji stylu życia'
        ],
        color: 'green'
      },
      2: {
        classification: 'Klasa II - Łagodna niewydolność serca',
        description: 'Pacjent z ostrym zawałem i łagodnymi do umiarkowanych objawami niewydolności serca.',
        clinicalFeatures: [
          'Rzężenia nad <50% pól płucnych',
          'Może być obecny III ton serca',
          'Podwyższony ucisk żylny (JVP)',
          'Łagodna duszność',
          'Możliwe obrzęki obwodowe'
        ],
        mortality: '17%',
        managementRecommendations: [
          'Standardowe leczenie ACS + terapia niewydolności serca',
          'Diuretyki pętlowe (furosemid)',
          'Inhibitory ACE w zwiększonych dawkach',
          'Beta-blokery (ostrożne dawkowanie)',
          'Monitorowanie bilansu płynów',
          'Ograniczenie spożycia sodu (<2g/dobę)',
          'Regularne kontrole echokardiograficzne'
        ],
        color: 'yellow'
      },
      3: {
        classification: 'Klasa III - Ciężka niewydolność serca',
        description: 'Pacjent z ostrym zawałem i ciężką niewydolnością serca z obrzękiem płuc.',
        clinicalFeatures: [
          'Rzężenia nad >50% pól płucnych',
          'Obrzęk płuc',
          'Znaczna duszność spoczynkowa',
          'Ortopnoe',
          'Możliwa sinica',
          'Tachykardia >100/min'
        ],
        mortality: '38%',
        managementRecommendations: [
          'PILNE leczenie obrzęku płuc',
          'Duże dawki diuretyków i.v. (furosemid 40-80mg)',
          'Nitraty i.v. (jeśli SBP >90mmHg)',
          'Pozycja półsiedząca',
          'Tlen o wysokim przepływie',
          'Rozważenie CPAP/BiPAP',
          'Monitorowanie w unit intensywnej opieki',
          'Możliwa intubacja przy pogorszeniu'
        ],
        color: 'orange'
      },
      4: {
        classification: 'Klasa IV - Wstrząs kardiogenny',
        description: 'Pacjent z ostrym zawałem i wstrząsem kardiogennym - stan zagrażający życiu.',
        clinicalFeatures: [
          'Ciśnienie skurczowe <90 mmHg',
          'Objawy hipoperfuzji narządowej',
          'Oliguria (<0.5ml/kg/h)',
          'Sinica, mramorowa skóra',
          'Pocenie, chłodne kończyny',
          'Zaburzenia świadomości',
          'Acidoza metaboliczna'
        ],
        mortality: '67%',
        managementRecommendations: [
          'NATYCHMIASTOWA intensywna terapia!',
          'Leki inotropowe (dobutamina, dopamina)',
          'Leki wazopresyjne (noradrenalina)',
          'Pilna rewaskularyzacja (PCI/CABG)',
          'Rozważenie IABP (wewnątrzaortalnej pompy balonowej)',
          'Mechaniczne wspomaganie krążenia (ECMO, Impella)',
          'Intensywne monitorowanie hemodynamiczne',
          'Korekta zaburzeń elektrolitowych i kwasowo-zasadowych'
        ],
        color: 'red'
      }
    };

    return {
      class: killipClass,
      classification: resultMap[killipClass].classification,
      description: resultMap[killipClass].description,
      clinicalFeatures: resultMap[killipClass].clinicalFeatures,
      mortality: resultMap[killipClass].mortality,
      managementRecommendations: resultMap[killipClass].managementRecommendations,
      color: resultMap[killipClass].color
    };
  };

  const handleCalculate = () => {
    if (selectedClass === null) return;
    
    const calculatedResult = getResult(selectedClass);
    setResult(calculatedResult);
    setShowResult(true);
  };

  const handleReset = () => {
    setSelectedClass(null);
    setResult(null);
    setShowResult(false);
  };

  const getClassColor = (killipClass: number) => {
    const colors = {
      1: 'text-green-600 bg-green-50 border-green-200',
      2: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      3: 'text-orange-600 bg-orange-50 border-orange-200',
      4: 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[killipClass as keyof typeof colors] || colors[1];
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
                Klasyfikacja Killipa-Kimball
              </h1>
              <p className="text-gray-600 text-sm">
                Killip-Kimball Classification
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
                Informacje o klasyfikacji
              </h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p><strong>Zastosowanie:</strong> Ocena stopnia niewydolności serca w ostrym zespole wieńcowym</p>
                <p><strong>Cel:</strong> Prognostyczna ocena ciężkości niewydolności serca po zawale mięśnia sercowego</p>
                <p><strong>Interpretacja:</strong> Im wyższa klasa, tym większe ryzyko powikłań i zgonu</p>
              </div>
            </div>

            {/* Calculator Form */}
            <div className="bg-white rounded-xl shadow-md border border-red-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Wybierz klasę na podstawie objawów klinicznych:
              </h3>
              
              <div className="space-y-3">
                {killipClasses.map(option => (
                  <label
                    key={option.class}
                    className={`block p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedClass === option.class
                        ? 'border-red-300 bg-red-50 shadow-md'
                        : 'border-gray-200 hover:border-red-200 hover:bg-red-25'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="radio"
                        name="killip"
                        value={option.class}
                        checked={selectedClass === option.class}
                        onChange={(e) => setSelectedClass(parseInt(e.target.value))}
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
                  Oceń klasę Killip
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
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getClassColor(result.class)}`}>
                      <span className="mr-2">
                        {result.class === 1 && '✅'}
                        {result.class === 2 && '⚠️'}
                        {result.class === 3 && '🟠'}
                        {result.class === 4 && '🚨'}
                      </span>
                      Śmiertelność szpitalna: {result.mortality}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Opis:</h4>
                    <p className="text-gray-700">{result.description}</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Objawy kliniczne:</h4>
                    <ul className="space-y-2">
                      {result.clinicalFeatures.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Activity className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
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

                  {result.class >= 3 && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-red-800 mb-1">
                            UWAGA: Wysokie ryzyko!
                          </p>
                          <p className="text-xs text-red-700">
                            {result.class === 3 
                              ? 'Ciężka niewydolność serca wymaga intensywnego leczenia i monitorowania.'
                              : 'Wstrząs kardiogenny - stan zagrażający życiu. Natychmiastowa intensywna terapia!'}
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
                  Klasyfikacja Killipa-Kimball
                </h3>
                <p className="text-gray-500">
                  Wybierz klasę na podstawie objawów klinicznych i kliknij "Oceń klasę Killip"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KillipCalculator;