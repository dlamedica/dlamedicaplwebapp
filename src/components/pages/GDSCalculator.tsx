import React, { useState } from 'react';
import { ArrowLeft, Brain, AlertTriangle, CheckCircle, RotateCcw, HelpCircle } from 'lucide-react';

interface GDSQuestion {
  id: number;
  question: string;
  positiveAnswer: 'tak' | 'nie'; // Answer that gives 1 point
}

interface GDSResult {
  score: number;
  maxScore: number;
  interpretation: string;
  severity: 'none' | 'mild' | 'moderate' | 'severe';
  recommendations: string[];
  nextSteps: string[];
  color: string;
}

const GDSCalculator: React.FC = () => {  const [answers, setAnswers] = useState<Record<number, 'tak' | 'nie' | null>>({});
  const [result, setResult] = useState<GDSResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const gdsQuestions: GDSQuestion[] = [
    {
      id: 1,
      question: 'Czy jesteś zadowolony/a ze swojego życia?',
      positiveAnswer: 'nie'
    },
    {
      id: 2,
      question: 'Czy porzuciłeś/aś wiele swoich aktywności i zainteresowań?',
      positiveAnswer: 'tak'
    },
    {
      id: 3,
      question: 'Czy czujesz, że Twoje życie jest puste?',
      positiveAnswer: 'tak'
    },
    {
      id: 4,
      question: 'Czy często się nudzisz?',
      positiveAnswer: 'tak'
    },
    {
      id: 5,
      question: 'Czy masz nadzieję na przyszłość?',
      positiveAnswer: 'nie'
    },
    {
      id: 6,
      question: 'Czy dręczą Cię niepokojące myśli, których nie możesz pozbyć się z głowy?',
      positiveAnswer: 'tak'
    },
    {
      id: 7,
      question: 'Czy zazwyczaj masz dobry nastrój?',
      positiveAnswer: 'nie'
    },
    {
      id: 8,
      question: 'Czy obawiasz się, że stanie się coś złego?',
      positiveAnswer: 'tak'
    },
    {
      id: 9,
      question: 'Czy zazwyczaj czujesz się szczęśliwy/a?',
      positiveAnswer: 'nie'
    },
    {
      id: 10,
      question: 'Czy często czujesz się bezradny/a?',
      positiveAnswer: 'tak'
    },
    {
      id: 11,
      question: 'Czy często jesteś niespokojny/a i podenerwowany/a?',
      positiveAnswer: 'tak'
    },
    {
      id: 12,
      question: 'Czy wolisz zostać w domu, niż wychodzić i robić nowe rzeczy?',
      positiveAnswer: 'tak'
    },
    {
      id: 13,
      question: 'Czy często martwisz się o przyszłość?',
      positiveAnswer: 'tak'
    },
    {
      id: 14,
      question: 'Czy czujesz, że masz więcej problemów z pamięcią niż większość ludzi?',
      positiveAnswer: 'tak'
    },
    {
      id: 15,
      question: 'Czy uważasz, że wspaniale jest żyć w dzisiejszych czasach?',
      positiveAnswer: 'nie'
    }
  ];

  const calculateScore = (): number => {
    let score = 0;
    gdsQuestions.forEach(question => {
      const answer = answers[question.id];
      if (answer === question.positiveAnswer) {
        score += 1;
      }
    });
    return score;
  };

  const getResult = (score: number): GDSResult => {
    const maxScore = 15;
    
    if (score <= 4) {
      return {
        score,
        maxScore,
        interpretation: 'Brak objawów depresji',
        severity: 'none',
        recommendations: [
          'Kontynuuj aktywny tryb życia',
          'Utrzymuj regularne kontakty społeczne',
          'Dbaj o regularne nawyki - sen, posiłki, aktywność fizyczna',
          'Kontynuuj hobby i zainteresowania',
          'Regularne badania kontrolne u lekarza POZ'
        ],
        nextSteps: [
          'Obserwacja stanu psychicznego',
          'Kontynuacja zdrowego trybu życia',
          'Powtórna ocena za 6-12 miesięcy'
        ],
        color: 'green'
      };
    } else if (score <= 8) {
      return {
        score,
        maxScore,
        interpretation: 'Łagodne objawy depresji',
        severity: 'mild',
        recommendations: [
          'Zwiększ aktywność fizyczną - spacery, gimnastyka',
          'Utrzymuj regularne kontakty z rodziną i przyjaciółmi',
          'Dołącz do grup wsparcia lub zajęć dla seniorów',
          'Zadbaj o regularny rytm dnia i jakość snu',
          'Rozważ poradnictwo psychologiczne'
        ],
        nextSteps: [
          'Konsultacja z lekarzem rodzinnym',
          'Ocena psychologiczna',
          'Ponowna ocena GDS za 4-6 tygodni',
          'Rozważenie psychoterapii wspomagającej'
        ],
        color: 'yellow'
      };
    } else if (score <= 11) {
      return {
        score,
        maxScore,
        interpretation: 'Umiarkowane objawy depresji',
        severity: 'moderate',
        recommendations: [
          'Natychmiastowa konsultacja z lekarzem',
          'Rozważenie farmakoterapii',
          'Psychoterapia poznawczo-behawioralna',
          'Strukturyzacja dnia i aktywności',
          'Wsparcie rodziny i opiekunów'
        ],
        nextSteps: [
          'PILNA konsultacja z lekarzem rodzinnym lub psychiatrą',
          'Ocena ryzyka samobójczego',
          'Plan leczenia - farmakoterapia i/lub psychoterapia',
          'Regularne kontrole co 2-4 tygodnie',
          'Informowanie rodziny o stanie pacjenta'
        ],
        color: 'orange'
      };
    } else {
      return {
        score,
        maxScore,
        interpretation: 'Ciężkie objawy depresji',
        severity: 'severe',
        recommendations: [
          'NATYCHMIASTOWA interwencja medyczna',
          'Kompleksowa ocena psychiatryczna',
          'Farmakoterapia pod nadzorem specjalisty',
          'Intensywna psychoterapia',
          'Rozważenie hospitalizacji',
          'Ciągły nadzór nad bezpieczeństwem pacjenta'
        ],
        nextSteps: [
          'NATYCHMIASTOWA konsultacja psychiatryczna',
          'Ocena ryzyka samobójczego - priorytet!',
          'Rozpoczęcie leczenia farmakologicznego',
          'Rozważenie hospitalizacji psychiatrycznej',
          'Zaangażowanie rodziny/opiekunów w plan leczenia',
          'Cotygodniowe kontrole w początkowym okresie'
        ],
        color: 'red'
      };
    }
  };

  const handleAnswerChange = (questionId: number, answer: 'tak' | 'nie') => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleCalculate = () => {
    const answeredQuestions = Object.keys(answers).length;
    if (answeredQuestions < gdsQuestions.length) {
      alert(`Proszę odpowiedzieć na wszystkie pytania. Brakuje odpowiedzi na ${gdsQuestions.length - answeredQuestions} pytań.`);
      return;
    }
    
    const score = calculateScore();
    const calculatedResult = getResult(score);
    setResult(calculatedResult);
    setShowResult(true);
  };

  const handleReset = () => {
    setAnswers({});
    setResult(null);
    setShowResult(false);
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      'none': 'text-green-600 bg-green-50 border-green-200',
      'mild': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'moderate': 'text-orange-600 bg-orange-50 border-orange-200',
      'severe': 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[severity as keyof typeof colors] || colors.none;
  };

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === gdsQuestions.length;

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
                  <Brain className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Geriatryczna Skala Depresji
              </h1>
              <p className="text-gray-600 text-sm">
                Geriatric Depression Scale (GDS-15)
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
                Informacje o skali
              </h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p><strong>Zastosowanie:</strong> Przesiewowa ocena depresji u osób 65+</p>
                <p><strong>Cel:</strong> Wstępne wykrywanie objawów depresyjnych u pacjentów geriatrycznych</p>
                <p><strong>Interpretacja:</strong> 0-4 (brak), 5-8 (łagodna), 9-11 (umiarkowana), 12-15 (ciężka)</p>
                <div 
                  className="mt-3 p-3 border rounded-lg"
                  style={{
                    backgroundColor: 'rgba(56, 182, 255, 0.05)',
                    borderColor: 'rgba(56, 182, 255, 0.2)'
                  }}
                >
                  <p className="text-xs" style={{color: '#1e40af'}}>
                    <HelpCircle className="w-4 h-4 inline mr-1" />
                    <strong>Ważne:</strong> To jest narzędzie przesiewowe. Ostateczna diagnoza wymaga konsultacji z lekarzem.
                  </p>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="bg-white rounded-xl shadow-md border border-purple-100 p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Postęp</h3>
                <span className="text-sm text-gray-600">
                  {answeredCount}/{gdsQuestions.length} pytań
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-400 to-indigo-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(answeredCount / gdsQuestions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Questions */}
            <div className="bg-white rounded-xl shadow-md border border-purple-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Pytania kwestionariusza:
              </h3>
              
              <div className="space-y-6">
                {gdsQuestions.map((question, index) => (
                  <div key={question.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <p className="text-sm font-medium text-gray-900 mb-3">
                      {index + 1}. {question.question}
                    </p>
                    <div className="flex space-x-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value="tak"
                          checked={answers[question.id] === 'tak'}
                          onChange={() => handleAnswerChange(question.id, 'tak')}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">Tak</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value="nie"
                          checked={answers[question.id] === 'nie'}
                          onChange={() => handleAnswerChange(question.id, 'nie')}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">Nie</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleCalculate}
                  disabled={!allAnswered}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    allAnswered
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle className="w-5 h-5 inline mr-2" />
                  Oceń wynik GDS
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
                      Wynik: {result.score}/{result.maxScore} punktów
                    </h3>
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getSeverityColor(result.severity)}`}>
                      <span className="mr-2">
                        {result.severity === 'none' && '✅'}
                        {result.severity === 'mild' && '⚠️'}
                        {result.severity === 'moderate' && '🟠'}
                        {result.severity === 'severe' && '🚨'}
                      </span>
                      {result.interpretation}
                    </div>
                  </div>

                  <div className="mb-6">
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

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Dalsze postępowanie:</h4>
                    <ul className="space-y-2">
                      {result.nextSteps.map((step, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{color: '#38b6ff'}} />
                          <span className="text-gray-700 text-sm">{step}</span>
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
                            UWAGA: Wysokie ryzyko depresji!
                          </p>
                          <p className="text-xs text-red-700">
                            Wynik wskazuje na ciężkie objawy depresji. Konieczna jest natychmiastowa konsultacja medyczna.
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
                <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Kwestionariusz GDS-15
                </h3>
                <p className="text-gray-500 mb-4">
                  Odpowiedz na wszystkie 15 pytań, a następnie kliknij "Oceń wynik GDS"
                </p>
                <div className="text-sm text-gray-600">
                  Odpowiedzi udzielone: <span className="font-semibold">{answeredCount}/15</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GDSCalculator;