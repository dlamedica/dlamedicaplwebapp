import React, { useState } from 'react';
import { ArrowLeft, Shield, AlertTriangle, CheckCircle, RotateCcw, Activity, Heart } from 'lucide-react';

interface ApfelRiskFactor {
  id: string;
  factor: string;
  description: string;
}

interface ApfelResult {
  riskFactors: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'very_high';
  ponvProbability: string;
  interpretation: string;
  prophylaxisRecommendations: string[];
  treatmentRecommendations: string[];
  monitoringRecommendations: string[];
  color: string;
}

const ApfelCalculator: React.FC = () => {  const [selectedFactors, setSelectedFactors] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<ApfelResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const apfelRiskFactors: ApfelRiskFactor[] = [
    {
      id: 'female',
      factor: 'Płeć żeńska',
      description: 'Kobiety mają około 2-3 razy wyższe ryzyko PONV niż mężczyźni'
    },
    {
      id: 'history_kinetosis',
      factor: 'Choroba lokomocyjna lub PONV w wywiadzie',
      description: 'Historia choroby morskiej/powietrznej lub poprzednie epizody PONV po anestezji'
    },
    {
      id: 'non_smoker',
      factor: 'Nie palenie tytoniu',
      description: 'Niepalacze mają wyższe ryzyko PONV - nikotyna ma działanie przeciwwymiotne'
    },
    {
      id: 'postop_opioids',
      factor: 'Planowane pooperacyjne leczenie opioidami',
      description: 'Użycie opioidów w okresie pooperacyjnym zwiększa ryzyko nudności i wymiotów'
    }
  ];

  const getResult = (riskFactorsCount: number): ApfelResult => {
    switch (riskFactorsCount) {
      case 0:
        return {
          riskFactors: riskFactorsCount,
          riskLevel: 'low',
          ponvProbability: '10%',
          interpretation: 'Bardzo niskie ryzyko pooperacyjnych nudności i wymiotów',
          prophylaxisRecommendations: [
            'Brak profilaktyki przeciwwymiotnej',
            'Standardowe postępowanie anestezjologiczne',
            'Unikanie znanych czynników prowokujących PONV',
            'Optymalizacja nawodnienia',
            'Minimalizacja użycia opioidów'
          ],
          treatmentRecommendations: [
            'W przypadku wystąpienia PONV - leczenie objawowe',
            'Ondansetron 4-8 mg i.v. jako pierwsza linia',
            'Metoklopramid 10 mg i.v. jako alternatywa',
            'Deksametazon 4-8 mg i.v.',
            'Kontrola bólu z ograniczeniem opioidów'
          ],
          monitoringRecommendations: [
            'Standardowe monitorowanie pooperacyjne',
            'Obserwacja objawów PONV przez pierwsze 24h',
            'Ocena komfortu pacjenta',
            'Monitorowanie przyjmowania pokarmów'
          ],
          color: 'green'
        };

      case 1:
        return {
          riskFactors: riskFactorsCount,
          riskLevel: 'moderate',
          ponvProbability: '20%',
          interpretation: 'Niskie do umiarkowanego ryzyko PONV',
          prophylaxisRecommendations: [
            'Rozważenie profilaktyki przeciwwymiotnej',
            'Deksametazon 4-8 mg i.v. w indukcji',
            'Unikanie podtlenku azotu',
            'Preferencyjne użycie propofolu do utrzymania anestezji',
            'Minimalizacja opioidów śródoperacyjnych',
            'Odpowiednie nawodnienie'
          ],
          treatmentRecommendations: [
            'Przygotowanie leków przeciwwymiotnych',
            'Ondansetron 4 mg i.v. w przypadku PONV',
            'Deksametazon 4 mg i.v. jeśli nie podano profilaktycznie',
            'Metoklopramid 10 mg i.v. jako druga linia',
            'Rozważenie skopolaminy przezskórnej'
          ],
          monitoringRecommendations: [
            'Uważne monitorowanie przez pierwsze 6h',
            'Regularna ocena nudności (skala 0-10)',
            'Obserwacja objawów wymiotów',
            'Kontrola stanu nawodnienia',
            'Ocena gotowości do wypisu'
          ],
          color: 'yellow'
        };

      case 2:
        return {
          riskFactors: riskFactorsCount,
          riskLevel: 'high',
          ponvProbability: '40%',
          interpretation: 'Umiarkowane do wysokiego ryzyko PONV',
          prophylaxisRecommendations: [
            'ZALECANA kombinowana profilaktyka przeciwwymiotna (2 leki)',
            'Deksametazon 8 mg i.v. w indukcji',
            'Ondansetron 4 mg i.v. pod koniec operacji',
            'Unikanie podtlenku azotu i halogenków',
            'TIVA (total intravenous anesthesia) z propofolem',
            'Minimalizacja opioidów, preferencja dla nieopioidowych analgetyków'
          ],
          treatmentRecommendations: [
            'Agresywne leczenie PONV gdy wystąpi',
            'Rescue antiemetics: Metoklopramid 10 mg i.v.',
            'Alizaprid 50-100 mg i.v.',
            'Dimenhydrynat 40-80 mg i.v.',
            'Rozważenie skopolaminy lub droperidolu',
            'Optymalizacja multimodalnej analgezji'
          ],
          monitoringRecommendations: [
            'Intensywne monitorowanie przez pierwsze 24h',
            'Częsta ocena nudności i wymiotów',
            'Kontrola bilansu płynowego',
            'Monitorowanie elektrolitów',
            'Opóźnienie wypisu w przypadku ciężkiego PONV'
          ],
          color: 'orange'
        };

      case 3:
      case 4:
        return {
          riskFactors: riskFactorsCount,
          riskLevel: 'very_high',
          ponvProbability: riskFactorsCount === 3 ? '60%' : '80%',
          interpretation: `${riskFactorsCount === 3 ? 'Wysokie' : 'Bardzo wysokie'} ryzyko PONV`,
          prophylaxisRecommendations: [
            'OBOWIĄZKOWA kombinowana profilaktyka (3-4 leki o różnych mechanizmach)',
            'Deksametazon 8-12 mg i.v. w indukcji',
            'Ondansetron 8 mg i.v. pod koniec operacji',
            'Droperidol 0,625-1,25 mg i.v. (ostrożnie - wydłużenie QT)',
            'Skopolamina przezskórna 1,5 mg patch przed operacją',
            'Bezwzględnie TIVA z propofolem',
            'Całkowite unikanie podtlenku azotu i halogenków',
            'Regionalne/neuraksjonalne techniki anestezji gdy możliwe'
          ],
          treatmentRecommendations: [
            'Natychmiastowe i agresywne leczenie PONV',
            'Alizaprid 100 mg i.v. lub Metoklopramid 20 mg i.v.',
            'Dimenhydrynat 80 mg i.v.',
            'Haloperidol 0,5-2 mg i.v. (ostatnia linia)',
            'Rozważenie NK-1 antagonistów (aprepitant)',
            'Sedacja z propofol w małych dawkach',
            'Kompletna zmiana strategii analgetycznej'
          ],
          monitoringRecommendations: [
            'Bardzo intensywne monitorowanie przez 48h',
            'Ciągła ocena PONV co 2-4h',
            'Monitorowanie EKG (droperidol)',
            'Ścisła kontrola bilansu płynowo-elektrolitowego',
            'Rozważenie hospitalizacji ambulatoryjnych pacjentów',
            'Planowanie długoterminowej strategii przeciwwymiotnej'
          ],
          color: 'red'
        };

      default:
        return getResult(0);
    }
  };

  const handleFactorChange = (factorId: string, checked: boolean) => {
    const newSelected = new Set(selectedFactors);
    if (checked) {
      newSelected.add(factorId);
    } else {
      newSelected.delete(factorId);
    }
    setSelectedFactors(newSelected);
  };

  const handleCalculate = () => {
    const factorCount = selectedFactors.size;
    const calculatedResult = getResult(factorCount);
    setResult(calculatedResult);
    setShowResult(true);
  };

  const handleReset = () => {
    setSelectedFactors(new Set());
    setResult(null);
    setShowResult(false);
  };

  const getRiskColor = (riskLevel: string) => {
    const colors = {
      'low': 'text-green-600 bg-green-50 border-green-200',
      'moderate': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'high': 'text-orange-600 bg-orange-50 border-orange-200',
      'very_high': 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[riskLevel as keyof typeof colors] || colors.low;
  };

  const currentRiskFactors = selectedFactors.size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-indigo-100">
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
                <div className="p-2 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Skala Apfel
              </h1>
              <p className="text-gray-600 text-sm">
                Apfel Risk Score for PONV
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
            <div className="bg-white rounded-xl shadow-md border border-indigo-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Informacje o skali
              </h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p><strong>PONV:</strong> Post-Operative Nausea and Vomiting (pooperacyjne nudności i wymioty)</p>
                <p><strong>Zastosowanie:</strong> Ocena ryzyka PONV w pierwszych 24h po operacji</p>
                <p><strong>Czynniki:</strong> 4 główne czynniki ryzyka (0-4 punkty)</p>
                <p><strong>Cel:</strong> Planowanie profilaktyki przeciwwymiotnej</p>
              </div>
            </div>

            {/* Current Score Display */}
            <div className="bg-white rounded-xl shadow-md border border-indigo-100 p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {currentRiskFactors}/4
                </div>
                <div className="text-sm text-gray-600">
                  Czynniki ryzyka PONV
                </div>
                <div className="mt-2 text-lg font-semibold text-indigo-600">
                  Ryzyko: {
                    currentRiskFactors === 0 ? '10%' :
                    currentRiskFactors === 1 ? '20%' :
                    currentRiskFactors === 2 ? '40%' :
                    currentRiskFactors === 3 ? '60%' : '80%'
                  }
                </div>
              </div>
            </div>

            {/* Calculator Form */}
            <div className="bg-white rounded-xl shadow-md border border-indigo-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Zaznacz występujące czynniki ryzyka:
              </h3>
              
              <div className="space-y-4">
                {apfelRiskFactors.map(factor => (
                  <label
                    key={factor.id}
                    className={`block p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedFactors.has(factor.id)
                        ? 'border-indigo-300 bg-indigo-50 shadow-sm'
                        : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-25'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedFactors.has(factor.id)}
                        onChange={(e) => handleFactorChange(factor.id, e.target.checked)}
                        className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 text-sm mb-1">
                          {factor.factor}
                        </div>
                        <div className="text-xs text-gray-600">
                          {factor.description}
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
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <CheckCircle className="w-5 h-5 inline mr-2" />
                  Oceń ryzyko PONV
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
                      Skala Apfel: {result.riskFactors}/4
                    </h3>
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getRiskColor(result.riskLevel)}`}>
                      <span className="mr-2">
                        {result.riskLevel === 'low' && '✅'}
                        {result.riskLevel === 'moderate' && '⚠️'}
                        {result.riskLevel === 'high' && '🟠'}
                        {result.riskLevel === 'very_high' && '🚨'}
                      </span>
                      Ryzyko PONV: {result.ponvProbability}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Interpretacja:</h4>
                    <p className="text-gray-700 text-sm">{result.interpretation}</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Profilaktyka przeciwwymiotna:</h4>
                    <ul className="space-y-2">
                      {result.prophylaxisRecommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Shield className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Leczenie rescue (gdy wystąpi PONV):</h4>
                    <ul className="space-y-2">
                      {result.treatmentRecommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Heart className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
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
                          <Activity className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {result.riskLevel === 'very_high' && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-red-800 mb-1">
                            UWAGA: Bardzo wysokie ryzyko PONV!
                          </p>
                          <p className="text-xs text-red-700">
                            Ryzyko {result.ponvProbability} wymaga agresywnej kombinowanej profilaktyki przeciwwymiotnej i specjalnej uwagi anestezjologa.
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
                <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Skala Apfel
                </h3>
                <p className="text-gray-500 mb-4">
                  Zaznacz czynniki ryzyka i kliknij "Oceń ryzyko PONV"
                </p>
                <div className="text-sm text-gray-600">
                  Czynniki ryzyka: <span className="font-semibold">{currentRiskFactors}/4</span>
                  <br />
                  Przewidywane ryzyko PONV: <span className="font-semibold">{
                    currentRiskFactors === 0 ? '10%' :
                    currentRiskFactors === 1 ? '20%' :
                    currentRiskFactors === 2 ? '40%' :
                    currentRiskFactors === 3 ? '60%' : '80%'
                  }</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApfelCalculator;