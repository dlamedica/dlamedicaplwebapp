import React, { useState } from 'react';
import { ArrowLeft, Brain, AlertTriangle, CheckCircle, RotateCcw, HelpCircle } from 'lucide-react';

interface MMSEQuestion {
  id: string;
  category: string;
  question: string;
  maxPoints: number;
  instruction?: string;
}

interface MMSEResult {
  totalScore: number;
  maxScore: number;
  adjustedScore: number;
  interpretation: string;
  severity: 'normal' | 'mild' | 'moderate' | 'severe';
  recommendations: string[];
  furtherAssessment: string[];
  color: string;
}

const MMSECalculator: React.FC = () => {  const [scores, setScores] = useState<Record<string, number>>({});
  const [educationLevel, setEducationLevel] = useState<'basic' | 'secondary' | 'higher'>('secondary');
  const [result, setResult] = useState<MMSEResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const mmseQuestions: MMSEQuestion[] = [
    // Orientation in time (5 points)
    {
      id: 'year',
      category: 'Orientacja w czasie',
      question: 'Jaki jest rok?',
      maxPoints: 1
    },
    {
      id: 'season',
      category: 'Orientacja w czasie',
      question: 'Jaka jest pora roku?',
      maxPoints: 1
    },
    {
      id: 'month',
      category: 'Orientacja w czasie',
      question: 'Jaki jest miesiąc?',
      maxPoints: 1
    },
    {
      id: 'date',
      category: 'Orientacja w czasie',
      question: 'Jaka jest data?',
      maxPoints: 1
    },
    {
      id: 'day',
      category: 'Orientacja w czasie',
      question: 'Jaki jest dzień tygodnia?',
      maxPoints: 1
    },
    // Orientation in place (5 points)
    {
      id: 'country',
      category: 'Orientacja w miejscu',
      question: 'W jakim kraju jesteśmy?',
      maxPoints: 1
    },
    {
      id: 'state',
      category: 'Orientacja w miejscu',
      question: 'W jakim województwie?',
      maxPoints: 1
    },
    {
      id: 'city',
      category: 'Orientacja w miejscu',
      question: 'W jakim mieście?',
      maxPoints: 1
    },
    {
      id: 'building',
      category: 'Orientacja w miejscu',
      question: 'W jakim budynku?',
      maxPoints: 1
    },
    {
      id: 'floor',
      category: 'Orientacja w miejscu',
      question: 'Na którym piętrze?',
      maxPoints: 1
    },
    // Registration (3 points)
    {
      id: 'registration',
      category: 'Zapamiętywanie',
      question: 'Powtórzenie 3 słów: "jabłko", "grosz", "stół"',
      maxPoints: 3,
      instruction: 'Po 1 pkt za każde poprawnie powtórzone słowo'
    },
    // Attention and calculation (5 points)
    {
      id: 'attention',
      category: 'Uwaga i liczenie',
      question: 'Odejmowanie po 7 od 100: 93, 86, 79, 72, 65',
      maxPoints: 5,
      instruction: 'Po 1 pkt za każde poprawne odejmowanie LUB przeliterowanie "ŚWIAT" od tyłu'
    },
    // Recall (3 points)
    {
      id: 'recall',
      category: 'Przypominanie',
      question: 'Przypomnienie 3 słów z zapamiętywania',
      maxPoints: 3,
      instruction: 'Po 1 pkt za każde przypominane słowo'
    },
    // Naming (2 points)
    {
      id: 'naming',
      category: 'Nazywanie',
      question: 'Nazwanie przedmiotów: zegarek, ołówek',
      maxPoints: 2,
      instruction: 'Po 1 pkt za każdy poprawnie nazwany przedmiot'
    },
    // Repetition (1 point)
    {
      id: 'repetition',
      category: 'Powtarzanie',
      question: 'Powtórz: "Ani tak, ani nie, ani ale"',
      maxPoints: 1
    },
    // Following commands (3 points)
    {
      id: 'commands',
      category: 'Wykonanie polecenia',
      question: 'Polecenie trzyczęściowe',
      maxPoints: 3,
      instruction: 'Weź kartkę do prawej ręki (1p), złóż na pół (1p), połóż na podłodze (1p)'
    },
    // Reading and following (1 point)
    {
      id: 'reading',
      category: 'Czytanie i wykonanie',
      question: 'Przeczytaj i wykonaj: "Zamknij oczy"',
      maxPoints: 1
    },
    // Writing (1 point)
    {
      id: 'writing',
      category: 'Pisanie',
      question: 'Napisz zdanie (podmiot + orzeczenie)',
      maxPoints: 1
    },
    // Drawing (1 point)
    {
      id: 'drawing',
      category: 'Rysowanie',
      question: 'Przerysuj dwa przecinające się pięciokąty',
      maxPoints: 1
    }
  ];

  const getEducationAdjustment = (rawScore: number, education: string): number => {
    // Simplified education adjustment
    switch (education) {
      case 'basic':
        return Math.min(30, rawScore + 2); // Add 2 points for basic education
      case 'higher':
        return rawScore; // No adjustment for higher education
      default:
        return Math.min(30, rawScore + 1); // Add 1 point for secondary education
    }
  };

  const getResult = (totalScore: number, adjustedScore: number): MMSEResult => {
    let severity: 'normal' | 'mild' | 'moderate' | 'severe';
    let interpretation: string;
    let color: string;
    let recommendations: string[];
    let furtherAssessment: string[];

    if (adjustedScore >= 27) {
      severity = 'normal';
      interpretation = 'Wynik w normie - funkcje poznawcze prawidłowe';
      color = 'green';
      recommendations = [
        'Kontynuacja aktywności intelektualnej',
        'Regularna aktywność fizyczna',
        'Utrzymanie kontaktów społecznych',
        'Zdrowa dieta śródziemnomorska',
        'Kontrola czynników ryzyka naczyniowego'
      ];
      furtherAssessment = [
        'Regularne kontrole co 1-2 lata',
        'W przypadku pojawiania się skarg poznawczych - ponowna ocena',
        'Edukacja rodziny nt. objawów wczesnych zaburzeń poznawczych'
      ];
    } else if (adjustedScore >= 24) {
      severity = 'mild';
      interpretation = 'Łagodne zaburzenia funkcji poznawczych (MCI)';
      color = 'yellow';
      recommendations = [
        'Pogłębiona diagnostyka neuropsychologiczna',
        'Poszukiwanie przyczyn odwracalnych',
        'Optymalizacja leczenia chorób współistniejących',
        'Treningi funkcji poznawczych',
        'Regularna aktywność fizyczna i intelektualna',
        'Kontrola ciśnienia tętniczego i glikemii'
      ];
      furtherAssessment = [
        'Kontrole co 6 miesięcy',
        'Rozszerzenie diagnostyki (neuroimaging, markery CSF)',
        'Ocena neuropsychologiczna',
        'Informowanie rodziny o ryzyku progresji'
      ];
    } else if (adjustedScore >= 18) {
      severity = 'moderate';
      interpretation = 'Umiarkowane zaburzenia poznawcze - prawdopodobna demencja';
      color = 'orange';
      recommendations = [
        'Kompleksowa diagnostyka różnicowa demencji',
        'Leczenie farmakologiczne (inhibitory cholinesterazy)',
        'Wsparcie opiekuna i rodziny',
        'Ocena bezpieczeństwa w domu',
        'Planowanie opieki długoterminowej',
        'Leczenie objawów behawioralnych',
        'Fizjoterapia i terapia zajęciowa'
      ];
      furtherAssessment = [
        'Konsultacja neurologiczna/geriatryczna',
        'Bilddiagnostyka mózgu (CT/MRI)',
        'Badania laboratoryjne (TSH, B12, kwas foliowy)',
        'Ocena funkcjonalna (ADL, IADL)',
        'Regularne kontrole co 3-6 miesięcy'
      ];
    } else {
      severity = 'severe';
      interpretation = 'Ciężkie zaburzenia poznawcze - zaawansowana demencja';
      color = 'red';
      recommendations = [
        'Kompleksowa opieka geriatryczna',
        'Leczenie farmakologiczne objawowe',
        'Wsparcie całodobowej opieki',
        'Leczenie powikłań (infekcje, upadki)',
        'Opieka paliatywna w terminalnej fazie',
        'Wsparcie psychologiczne rodziny',
        'Fizjoterapia zapobiegająca kontrakturom'
      ];
      furtherAssessment = [
        'Regularne wizyty lekarza rodzinnego',
        'Ocena jakości życia',
        'Monitorowanie powikłań',
        'Planowanie opieki terminalnej',
        'Wsparcie opiekunów i rodziny'
      ];
    }

    return {
      totalScore,
      maxScore: 30,
      adjustedScore,
      interpretation,
      severity,
      recommendations,
      furtherAssessment,
      color
    };
  };

  const handleScoreChange = (questionId: string, score: number) => {
    setScores(prev => ({
      ...prev,
      [questionId]: score
    }));
  };

  const handleCalculate = () => {
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const adjustedScore = getEducationAdjustment(totalScore, educationLevel);
    const calculatedResult = getResult(totalScore, adjustedScore);
    setResult(calculatedResult);
    setShowResult(true);
  };

  const handleReset = () => {
    setScores({});
    setEducationLevel('secondary');
    setResult(null);
    setShowResult(false);
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      'normal': 'text-green-600 bg-green-50 border-green-200',
      'mild': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'moderate': 'text-orange-600 bg-orange-50 border-orange-200',
      'severe': 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[severity as keyof typeof colors] || colors.normal;
  };

  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const completedQuestions = Object.keys(scores).length;

  // Group questions by category
  const categorizedQuestions = mmseQuestions.reduce((acc, question) => {
    if (!acc[question.category]) acc[question.category] = [];
    acc[question.category].push(question);
    return acc;
  }, {} as Record<string, typeof mmseQuestions>);

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
                  <Brain className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                MMSE
              </h1>
              <p className="text-gray-600 text-sm">
                Mini-Mental State Examination
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
                Informacje o teście
              </h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p><strong>Zastosowanie:</strong> Ocena zaburzeń funkcji poznawczych i demencji</p>
                <p><strong>Cel:</strong> Najczęściej używany test przesiewowy do oceny funkcji kognitywnych</p>
                <p><strong>Czas:</strong> 5-10 minut</p>
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 text-xs">
                    <HelpCircle className="w-4 h-4 inline mr-1" />
                    <strong>Ważne:</strong> Wynik należy interpretować z uwzględnieniem wykształcenia, wieku i stanu zdrowia pacjenta.
                  </p>
                </div>
              </div>
            </div>

            {/* Education Level */}
            <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Poziom wykształcenia:
              </h3>
              <div className="space-y-2">
                {[
                  { value: 'basic', label: 'Podstawowe' },
                  { value: 'secondary', label: 'Średnie' },
                  { value: 'higher', label: 'Wyższe' }
                ].map(option => (
                  <label
                    key={option.value}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                      educationLevel === option.value
                        ? 'border-blue-300 bg-blue-50 shadow-sm'
                        : 'border-gray-200 hover:border-blue-200 hover:bg-blue-25'
                    }`}
                  >
                    <input
                      type="radio"
                      name="education"
                      value={option.value}
                      checked={educationLevel === option.value}
                      onChange={(e) => setEducationLevel(e.target.value as any)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-900">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Progress */}
            <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Postęp</h3>
                <span className="text-sm text-gray-600">
                  {completedQuestions}/{mmseQuestions.length} pytań | Punkty: {totalScore}/30
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-400 to-indigo-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(completedQuestions / mmseQuestions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Test Questions */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Pytania testowe:
              </h3>
              
              {Object.entries(categorizedQuestions).map(([category, questions]) => (
                <div key={category} className="mb-6">
                  <h4 className="text-md font-semibold text-blue-700 mb-3">
                    {category} ({questions.reduce((sum, q) => sum + q.maxPoints, 0)} pkt)
                  </h4>
                  
                  {questions.map(question => (
                    <div key={question.id} className="mb-4 p-3 border border-gray-200 rounded-lg">
                      <div className="mb-2">
                        <span className="text-sm font-medium text-gray-900">{question.question}</span>
                        {question.instruction && (
                          <p className="text-xs text-gray-500 mt-1">{question.instruction}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 min-w-[60px]">Punkty:</span>
                        <div className="flex space-x-1">
                          {Array.from({ length: question.maxPoints + 1 }, (_, i) => (
                            <label key={i} className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name={question.id}
                                value={i}
                                checked={(scores[question.id] || 0) === i}
                                onChange={(e) => handleScoreChange(question.id, parseInt(e.target.value))}
                                className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="ml-1 text-xs text-gray-700">{i}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleCalculate}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <CheckCircle className="w-5 h-5 inline mr-2" />
                  Oblicz wynik MMSE
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
              result.color === 'yellow' ? 'border-yellow-200' :
              result.color === 'orange' ? 'border-orange-200' :
              result.color === 'red' ? 'border-red-200' :
              'border-gray-200'
            }`}>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  MMSE: {result.adjustedScore}/30 punktów
                </h3>
                <div className="text-sm text-gray-600 mb-2">
                  Wynik surowy: {result.totalScore}/30
                </div>
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getSeverityColor(result.severity)}`}>
                  <span className="mr-2">
                    {result.severity === 'normal' && '✅'}
                    {result.severity === 'mild' && '⚠️'}
                    {result.severity === 'moderate' && '🟠'}
                    {result.severity === 'severe' && '🚨'}
                  </span>
                  {result.interpretation}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Dalsze postępowanie:</h4>
                  <ul className="space-y-2">
                    {result.furtherAssessment.map((assessment, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <AlertTriangle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{assessment}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {result.severity === 'severe' && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-red-800 mb-1">
                        UWAGA: Ciężkie zaburzenia poznawcze!
                      </p>
                      <p className="text-xs text-red-700">
                        Wynik wskazuje na zaawansowaną demencję. Konieczna kompleksowa opieka geriatryczna i wsparcie rodziny.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MMSECalculator;