import React, { useState } from 'react';
import { ArrowLeft, Brain, AlertTriangle, CheckCircle, RotateCcw, Heart, Shield, Phone } from 'lucide-react';

interface BeckItem {
  id: string;
  name: string;
  options: BeckOption[];
}

interface BeckOption {
  score: number;
  description: string;
}

interface BeckResult {
  scores: Record<string, number>;
  totalScore: number;
  maxScore: number;
  severity: 'minimal' | 'mild' | 'moderate' | 'severe';
  interpretation: string;
  recommendations: string[];
  treatmentOptions: string[];
  monitoring: string[];
  emergencyContacts: string[];
  prognosis: string;
  color: string;
  requiresUrgentAttention: boolean;
}

const BeckDepressionCalculator: React.FC = () => {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [result, setResult] = useState<BeckResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const beckItems: BeckItem[] = [
    {
      id: 'sadness',
      name: 'Smutek',
      options: [
        { score: 0, description: 'Nie czuję się smutny/a' },
        { score: 1, description: 'Czuję się smutny/a przez większość czasu' },
        { score: 2, description: 'Cały czas jestem smutny/a' },
        { score: 3, description: 'Jestem tak smutny/a, że nie mogę tego znieść' }
      ]
    },
    {
      id: 'pessimism',
      name: 'Pesymizm',
      options: [
        { score: 0, description: 'Nie jestem pesymistycznie nastawiony/a do przyszłości' },
        { score: 1, description: 'Czuję się bardziej pesymistycznie niż zwykle' },
        { score: 2, description: 'Nie spodziewam się, że cokolwiek się ułoży' },
        { score: 3, description: 'Czuję, że przyszłość jest beznadziejna' }
      ]
    },
    {
      id: 'failure',
      name: 'Poczucie porażki',
      options: [
        { score: 0, description: 'Nie czuję się jak porażka' },
        { score: 1, description: 'Poniosłem/łam więcej porażek niż przeciętny człowiek' },
        { score: 2, description: 'Patrząc wstecz, widzę wiele porażek' },
        { score: 3, description: 'Czuję się całkowitą porażką jako osoba' }
      ]
    },
    {
      id: 'guilt',
      name: 'Poczucie winy',
      options: [
        { score: 0, description: 'Nie czuję się szczególnie winny/a' },
        { score: 1, description: 'Czuję się winny/a przez większość czasu' },
        { score: 2, description: 'Czuję się bardzo winny/a przez większość czasu' },
        { score: 3, description: 'Czuję się winny/a cały czas' }
      ]
    },
    {
      id: 'punishment',
      name: 'Samokara',
      options: [
        { score: 0, description: 'Nie czuję, że jestem karany/a' },
        { score: 1, description: 'Czuję, że mogę zostać ukarany/a' },
        { score: 2, description: 'Spodziewam się zostać ukarany/a' },
        { score: 3, description: 'Czuję, że jestem karany/a' }
      ]
    },
    {
      id: 'suicide',
      name: 'Myśli samobójcze',
      options: [
        { score: 0, description: 'Nie mam myśli o skrzywdzeniu siebie' },
        { score: 1, description: 'Mam myśli o skrzywdzeniu siebie, ale nie zrobiłbym/łabym tego' },
        { score: 2, description: 'Chciałbym/chciałabym się zabić' },
        { score: 3, description: 'Zabiłbym/zabałabym się, gdybym miał/miała okazję' }
      ]
    },
    {
      id: 'crying',
      name: 'Płaczliwość',
      options: [
        { score: 0, description: 'Nie płaczę więcej niż zwykle' },
        { score: 1, description: 'Płaczę więcej niż kiedyś' },
        { score: 2, description: 'Płaczę z byle powodu' },
        { score: 3, description: 'Chciałbym/chciałabym płakać, ale nie mogę' }
      ]
    },
    {
      id: 'irritability',
      name: 'Drażliwość',
      options: [
        { score: 0, description: 'Nie jestem bardziej drażliwy/a niż zwykle' },
        { score: 1, description: 'Jestem bardziej drażliwy/a niż zwykle' },
        { score: 2, description: 'Jestem znacznie bardziej drażliwy/a niż zwykle' },
        { score: 3, description: 'Jestem drażliwy/a cały czas' }
      ]
    },
    {
      id: 'social_withdrawal',
      name: 'Wycofanie społeczne',
      options: [
        { score: 0, description: 'Nie straciłem/łam zainteresowania innymi ludźmi' },
        { score: 1, description: 'Mniej niż zwykle interesuję się innymi ludźmi' },
        { score: 2, description: 'Straciłem/łam większość zainteresowania innymi ludźmi' },
        { score: 3, description: 'Straciłem/łam całe zainteresowanie innymi ludźmi' }
      ]
    },
    {
      id: 'indecisiveness',
      name: 'Niezdecydowanie',
      options: [
        { score: 0, description: 'Podejmuję decyzje równie dobrze jak kiedyś' },
        { score: 1, description: 'Odkładam podejmowanie decyzji częściej niż kiedyś' },
        { score: 2, description: 'Mam większe trudności z podejmowaniem decyzji' },
        { score: 3, description: 'Nie mogę już podejmować żadnych decyzji' }
      ]
    },
    {
      id: 'body_image',
      name: 'Obraz ciała',
      options: [
        { score: 0, description: 'Nie czuję, że wyglądam gorzej niż kiedyś' },
        { score: 1, description: 'Martwię się, że wyglądam starzej lub mniej atrakcyjnie' },
        { score: 2, description: 'Czuję, że zaszły trwałe zmiany w moim wyglądzie' },
        { score: 3, description: 'Wierzę, że wyglądam brzydko' }
      ]
    },
    {
      id: 'work_inhibition',
      name: 'Hamowanie aktywności',
      options: [
        { score: 0, description: 'Mogę pracować równie dobrze jak kiedyś' },
        { score: 1, description: 'Wymaga większego wysiłku, aby zacząć coś robić' },
        { score: 2, description: 'Muszę się mocno zmuszać, aby coś zrobić' },
        { score: 3, description: 'Nie mogę wykonywać żadnej pracy' }
      ]
    },
    {
      id: 'sleep',
      name: 'Zaburzenia snu',
      options: [
        { score: 0, description: 'Śpię równie dobrze jak kiedyś' },
        { score: 1, description: 'Nie śpię tak dobrze jak kiedyś' },
        { score: 2, description: 'Budzę się o 1-2 godziny wcześniej i trudno mi zasnąć' },
        { score: 3, description: 'Budzę się kilka godzin wcześniej i nie mogę zasnąć' }
      ]
    },
    {
      id: 'fatigue',
      name: 'Zmęczenie',
      options: [
        { score: 0, description: 'Nie jestem bardziej zmęczony/a niż zwykle' },
        { score: 1, description: 'Męczę się łatwiej niż kiedyś' },
        { score: 2, description: 'Męczę się przy wykonywaniu niemal wszystkiego' },
        { score: 3, description: 'Jestem zbyt zmęczony/a, aby cokolwiek robić' }
      ]
    },
    {
      id: 'appetite',
      name: 'Utrata apetytu',
      options: [
        { score: 0, description: 'Mój apetyt nie jest gorszy niż zwykle' },
        { score: 1, description: 'Mój apetyt nie jest tak dobry jak kiedyś' },
        { score: 2, description: 'Mój apetyt jest znacznie gorszy' },
        { score: 3, description: 'Nie mam w ogóle apetytu' }
      ]
    },
    {
      id: 'weight_loss',
      name: 'Utrata masy ciała',
      options: [
        { score: 0, description: 'Nie schudłem/łam ostatnio' },
        { score: 1, description: 'Schudłem/łam więcej niż 2 kg' },
        { score: 2, description: 'Schudłem/łam więcej niż 5 kg' },
        { score: 3, description: 'Schudłem/łam więcej niż 7 kg' }
      ]
    },
    {
      id: 'somatic',
      name: 'Problemy somatyczne',
      options: [
        { score: 0, description: 'Nie martwię się o swoje zdrowie bardziej niż zwykle' },
        { score: 1, description: 'Martwię się problemami fizycznymi (bóle, żołądek)' },
        { score: 2, description: 'Bardzo martwię się problemami fizycznymi' },
        { score: 3, description: 'Tak bardzo martwię się problemami fizycznymi, że nie mogę myśleć o niczym innym' }
      ]
    },
    {
      id: 'libido',
      name: 'Utrata libido',
      options: [
        { score: 0, description: 'Nie zauważyłem/łam zmian w zainteresowaniu seksem' },
        { score: 1, description: 'Mniej niż zwykle interesuję się seksem' },
        { score: 2, description: 'Znacznie mniej interesuję się seksem' },
        { score: 3, description: 'Całkowicie straciłem/łam zainteresowanie seksem' }
      ]
    }
  ];

  const getResult = (scores: Record<string, number>): BeckResult => {
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    
    let severity: 'minimal' | 'mild' | 'moderate' | 'severe';
    let interpretation: string;
    let color: string;
    let recommendations: string[];
    let treatmentOptions: string[];
    let monitoring: string[];
    let emergencyContacts: string[];
    let prognosis: string;
    let requiresUrgentAttention: boolean;

    // Check for suicidal ideation
    const suicidalScore = scores['suicide'] || 0;
    requiresUrgentAttention = suicidalScore >= 2;

    if (totalScore <= 13) {
      severity = 'minimal';
      interpretation = 'Depresja minimalna - brak lub bardzo słabe objawy depresyjne';
      color = 'green';
      recommendations = [
        'Kontynuuj regulną aktywność fizyczną i społeczną',
        'Utrzymuj zdrowy tryb życia (sen, dieta, aktywność)',
        'Techniki zarządzania stresem i relaksacyjne',
        'Budowanie sieci wsparcia społecznego',
        'Samoobserwacja objawów nastroju',
        'Rozważenie profilaktycznej psychoedukacji'
      ];
      treatmentOptions = [
        'Wsparcie psychologiczne w razie potrzeby',
        'Grupy wsparcia lub psychoedukacja',
        'Techniki mindfulness i medytacji',
        'Programy promocji zdrowia psychicznego',
        'Interwencje społeczne i aktywizujące'
      ];
      prognosis = 'Bardzo dobre rokowanie. Ryzyko rozwoju depresji klinicznej niskie.';
    } else if (totalScore <= 19) {
      severity = 'mild';
      interpretation = 'Depresja łagodna - objawy wpływają na jakość życia, ale funkcjonowanie jest zachowane';
      color = 'orange';
      recommendations = [
        'Konsultacja psychologiczna lub psychiatryczna',
        'Psychoterapia (CBT, terapia interpersonalna)',
        'Zwiększenie aktywności fizycznej i społecznej',
        'Poprawa higieny snu i diety',
        'Regulne monitorowanie objawów',
        'Wsparcie rodzinne i przyjaciół'
      ];
      treatmentOptions = [
        'Psychoterapia jako leczenie pierwszego rzutu',
        'Terapia poznawczo-behawioralna (CBT)',
        'Terapia interpersonalna (IPT)',
        'Grupy wsparcia dla osób z depresją',
        'Rozważenie farmakoterapii przy braku poprawy'
      ];
      prognosis = 'Dobre rokowanie przy odpowiednim wsparciu psychologicznym i terapii.';
    } else if (totalScore <= 28) {
      severity = 'moderate';
      interpretation = 'Depresja umiarkowana - wyraźne objawy wymagające leczenia specjalistycznego';
      color = 'orange';
      recommendations = [
        'OBOWIĄZKOWA konsultacja psychiatryczna',
        'Kompleksowe leczenie: psychoterapia + farmakoterapia',
        'Regularne kontrole psychiatryczne',
        'Wsparcie psychosocjalne intensywne',
        'Możliwe zwolnienie z pracy/nauki',
        'Informowanie bliskich o stanie zdrowia'
      ];
      treatmentOptions = [
        'Kombinacja psychoterapii i farmakoterapii',
        'SSRI lub SNRI jako leki pierwszego wyboru',
        'Terapia poznawczo-behawioralna intensywna',
        'Program dziennego leczenia psychiatrycznego',
        'Rozważenie hospitalizacji przy pogorszeniu'
      ];
      prognosis = 'Umiarkowane rokowanie. Konieczne długoterminowe leczenie specjalistyczne.';
    } else {
      severity = 'severe';
      interpretation = 'Depresja ciężka - poważne zaburzenie wymagające pilnej interwencji psychiatrycznej';
      color = 'red';
      recommendations = [
        'PILNA konsultacja psychiatryczna (w ciągu 24-48h)',
        'Rozważenie hospitalizacji psychiatrycznej',
        'Intensywna farmakoterapia pod nadzorem',
        'Psychoterapia intensywna po stabilizacji',
        'Wsparcie rodziny i opiekunów',
        'Zwolnienie z obowiązków zawodowych/szkolnych',
        'Opieka środowiskowa i monitoring bezpieczeństwa'
      ];
      treatmentOptions = [
        'Hospitalizacja psychiatryczna przy wskazaniach',
        'Intensywna farmakoterapia (możliwe kombinacje)',
        'Elektrowstrząsy (ECT) w przypadkach opornych',
        'Program intensywnego leczenia ambulatoryjnego',
        'Stymulacja magnetyczna (rTMS) w ośrodkach specjalistycznych'
      ];
      prognosis = 'Poważne rokowanie. Wymaga intensywnego, długoterminowego leczenia psychiatrycznego.';
    }

    monitoring = [
      `Kontrole ${severity === 'minimal' ? 'w razie potrzeby' : 
                  severity === 'mild' ? 'co 2-4 tygodnie' :
                  severity === 'moderate' ? 'co 1-2 tygodnie' : 'co kilka dni początkowo'}`,
      'Monitorowanie myśli samobójczych',
      'Ocena skuteczności leczenia',
      'Kontrola działań niepożądanych leków (jeśli stosowane)',
      'Obserwacja funkcjonowania społecznego i zawodowego'
    ];

    emergencyContacts = [
      'Pogotowie Ratunkowe: 112',
      'Centrum Interwencji Kryzysowej: 116 123',
      'Telefon Zaufania: 116 111',
      'Niebieska Linia: 800 120 002',
      'Najbliższy Szpitalny Oddział Ratunkowy',
      'Dyżurna poradnia psychiatryczna'
    ];

    return {
      scores,
      totalScore,
      maxScore: 63,
      severity,
      interpretation,
      recommendations,
      treatmentOptions,
      monitoring,
      emergencyContacts,
      prognosis,
      color,
      requiresUrgentAttention
    };
  };

  const handleScoreChange = (itemId: string, score: number) => {
    setScores(prev => ({
      ...prev,
      [itemId]: score
    }));
  };

  const handleCalculate = () => {
    if (!privacyAccepted) {
      alert('Proszę zaakceptować informację o poufności przed kontynuowaniem.');
      return;
    }
    
    const calculatedResult = getResult(scores);
    setResult(calculatedResult);
    setShowResult(true);
  };

  const handleReset = () => {
    setScores({});
    setResult(null);
    setShowResult(false);
  };


  const getSeverityColor = (severity: string) => {
    const colors = {
      'minimal': 'text-green-600 bg-green-50 border-green-200',
      'mild': 'text-orange-600 bg-orange-50 border-orange-200',
      'moderate': 'text-red-600 bg-red-50 border-red-200',
      'severe': 'text-red-700 bg-red-100 border-red-300'
    };
    return colors[severity as keyof typeof colors] || colors.minimal;
  };

  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const completedItems = Object.keys(scores).length;
  const allItemsCompleted = completedItems === beckItems.length;
  const suicidalScore = scores['suicide'] || 0;

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
                  <Brain className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Skala Depresji Becka
              </h1>
              <p className="text-gray-600 text-sm">
                Beck Depression Inventory (BDI) - Samoocena depresji
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
            {/* Privacy Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <Shield className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Informacja o poufności
                  </h3>
                  <div className="text-sm text-blue-800 space-y-2 mb-4">
                    <p>Skala Depresji Becka jest narzędziem diagnostycznym służącym do oceny nasilenia objawów depresyjnych.</p>
                    <p><strong>Ważne:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>To narzędzie NIE zastępuje diagnozy lekarskiej</li>
                      <li>Wyniki mają charakter orientacyjny</li>
                      <li>Przy wyniku &gt;20 konieczna konsultacja specjalisty</li>
                      <li>Dane są przetwarzane lokalnie i nie są przechowywane</li>
                    </ul>
                  </div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={privacyAccepted}
                      onChange={(e) => setPrivacyAccepted(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-blue-800">
                      Rozumiem i akceptuję powyższe informacje
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Current Score Display */}
            {completedItems > 0 && (
              <div className="bg-white rounded-xl shadow-md border border-indigo-100 p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {totalScore}/63
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    Ukończono: {completedItems}/21 pozycji
                  </div>
                  {totalScore > 0 && (
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      totalScore <= 13 ? 'bg-green-100 text-green-800' :
                      totalScore <= 19 ? 'bg-orange-100 text-orange-800' :
                      totalScore <= 28 ? 'bg-red-100 text-red-800' :
                      'bg-red-200 text-red-900'
                    }`}>
                      {totalScore <= 13 ? 'Minimalna' :
                       totalScore <= 19 ? 'Łagodna' :
                       totalScore <= 28 ? 'Umiarkowana' : 'Ciężka'}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Suicide Alert */}
            {suicidalScore >= 2 && (
              <div className="bg-red-100 border border-red-300 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-900 mb-2">
                      PILNA UWAGA!
                    </h3>
                    <p className="text-sm text-red-800 mb-3">
                      Zaznaczono obecność myśli samobójczych. Konieczny natychmiastowy kontakt ze specjalistą!
                    </p>
                    <div className="space-y-1 text-sm text-red-800">
                      <div><Phone className="inline w-4 h-4 mr-1" />Pogotowie: <strong>112</strong></div>
                      <div><Phone className="inline w-4 h-4 mr-1" />Kryzys: <strong>116 123</strong></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Info Card */}
            <div className="bg-white rounded-xl shadow-md border border-indigo-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Informacje o skali
              </h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p><strong>Zastosowanie:</strong> Samoocena nasilenia objawów depresyjnych</p>
                <p><strong>Pytania:</strong> 21 kategorii objawów (0-3 punkty każda)</p>
                <p><strong>Zakres:</strong> 0-63 punkty</p>
                <p><strong>Okres:</strong> Objawy w ciągu ostatnich 2 tygodni</p>
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md border border-indigo-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Przeczytaj każdą grupę stwierdzeń i wybierz to, które najlepiej opisuje Twoje samopoczucie w ciągu ostatnich 2 tygodni:
              </h3>
              
              <div className="space-y-6 max-h-96 overflow-y-auto">
                {beckItems.map((item, itemIndex) => (
                  <div key={item.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <h4 className="text-md font-semibold text-indigo-700 mb-3">
                      {itemIndex + 1}. {item.name}:
                    </h4>
                    <div className="space-y-2">
                      {item.options.map((option) => (
                        <label
                          key={`${item.id}-${option.score}`}
                          className={`block p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                            scores[item.id] === option.score
                              ? 'border-indigo-300 bg-indigo-50 shadow-sm'
                              : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-25'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <input
                              type="radio"
                              name={item.id}
                              value={option.score}
                              checked={scores[item.id] === option.score}
                              onChange={() => handleScoreChange(item.id, option.score)}
                              className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-900">
                                  {option.description}
                                </span>
                                <span className="text-sm font-semibold text-indigo-600">
                                  {option.score} pkt
                                </span>
                              </div>
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
                  disabled={!allItemsCompleted || !privacyAccepted}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    allItemsCompleted && privacyAccepted
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle className="w-5 h-5 inline mr-2" />
                  Oceń wynik BDI
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
                  Skala Depresji Becka: {result.totalScore}/63
                </h3>
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getSeverityColor(result.severity)}`}>
                  <span className="mr-2">
                    {result.severity === 'minimal' && '✅'}
                    {result.severity === 'mild' && '⚠️'}
                    {result.severity === 'moderate' && '🔴'}
                    {result.severity === 'severe' && '🚨'}
                  </span>
                  {result.severity === 'minimal' ? 'Depresja minimalna' :
                   result.severity === 'mild' ? 'Depresja łagodna' :
                   result.severity === 'moderate' ? 'Depresja umiarkowana' :
                   'Depresja ciężka'}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Interpretacja:</h4>
                <p className="text-gray-700 text-sm mb-3">{result.interpretation}</p>
                <h4 className="font-semibold text-gray-900 mb-2">Rokowanie:</h4>
                <p className="text-gray-700 text-sm">{result.prognosis}</p>
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
                      <Heart className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{option}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Monitorowanie:</h4>
                <ul className="space-y-2">
                  {result.monitoring.map((monitor, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Shield className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{monitor}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {(result.requiresUrgentAttention || result.severity !== 'minimal') && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Kontakty w sytuacjach kryzysowych:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {result.emergencyContacts.map((contact, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded text-sm">
                        <Phone className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <span className="text-gray-700">{contact}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.requiresUrgentAttention && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-red-800 mb-1">
                        UWAGA: Wykryto myśli samobójcze!
                      </p>
                      <p className="text-xs text-red-700">
                        Konieczna natychmiastowa konsultacja z psychiatrą lub psychologiem. W razie zagrożenia życia dzwoń 112.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {result.severity !== 'minimal' && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-yellow-800 mb-1">
                        Ważna informacja
                      </p>
                      <p className="text-xs text-yellow-700">
                        Wynik wskazuje na obecność objawów depresyjnych. Zaleca się konsultację ze specjalistą zdrowia psychicznego.
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

export default BeckDepressionCalculator;