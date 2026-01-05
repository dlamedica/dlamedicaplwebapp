import React, { useState } from 'react';
import { Users, Heart, Shield, Info } from 'lucide-react';

interface VaccinationSchedule {
  id: number;
  vaccine: string;
  description: string;
  footnote?: string;
  ageGroups: {
    '50-59': string;
    '60-64': string;
    '65+': string;
  };
}

const seniorVaccinationSchedules: VaccinationSchedule[] = [
  {
    id: 1,
    vaccine: 'Grypa (IIV)',
    description: '1 dawka co roku, w czasie sezonu infekcyjnego (najlepiej na początku sezonu)*',
    footnote: '*Szczepienia przeciwko grypie powinny być wykonywane w okresie jesienno-zimowym',
    ageGroups: {
      '50-59': '1 dawka co roku*',
      '60-64': '1 dawka co roku*',
      '65+': '1 dawka co roku*'
    }
  },
  {
    id: 2,
    vaccine: 'Błonica, tężec, krztuścowi (Tdap)',
    description: '1 dawka co 10 lat',
    ageGroups: {
      '50-59': '1 dawka co 10 lat',
      '60-64': '1 dawka co 10 lat',
      '65+': '1 dawka co 10 lat'
    }
  },
  {
    id: 3,
    vaccine: 'Covid-19',
    description: 'Liczba dawek zależy od historii szczepień i aktualnych zaleceń',
    ageGroups: {
      '50-59': 'Według aktualnych zaleceń',
      '60-64': 'Według aktualnych zaleceń',
      '65+': 'Według aktualnych zaleceń'
    }
  },
  {
    id: 4,
    vaccine: 'Wirusowemu zapaleniu wątroby typu B (HBV)',
    description: '3 dawki (osoby, które nie były wcześniej szczepione)',
    ageGroups: {
      '50-59': '3 dawki (osoby nieszczepione)',
      '60-64': '3 dawki (osoby nieszczepione)',
      '65+': '3 dawki (osoby nieszczepione)'
    }
  },
  {
    id: 5,
    vaccine: 'Pneumokokom (PCV, PPSV)',
    description: '1 dawka PCV-15 lub PCV-20 / 1 dawka PCV-15 + PPSV-23 (w odstępie ≥8 tygodni) lub 1 dawka PCV-20',
    ageGroups: {
      '50-59': '1 dawka PCV-15 lub PCV-20',
      '60-64': '1 dawka PCV-15 + PPSV-23 (≥8 tyg.) lub 1 dawka PCV-20',
      '65+': '1 dawka PCV-15 + PPSV-23 (≥8 tyg.) lub 1 dawka PCV-20'
    }
  },
  {
    id: 6,
    vaccine: 'Półpaścowi (RZV)',
    description: '2 dawki w odstępie 2-6 miesięcy',
    ageGroups: {
      '50-59': '2 dawki w odstępie 2-6 miesięcy',
      '60-64': '2 dawki w odstępie 2-6 miesięcy',
      '65+': '2 dawki w odstępie 2-6 miesięcy'
    }
  },
  {
    id: 7,
    vaccine: 'Syncytalnemu wirusowi oddechowemu (RSV)',
    description: '1 dawka',
    ageGroups: {
      '50-59': '-',
      '60-64': '1 dawka',
      '65+': '1 dawka'
    }
  },
  {
    id: 8,
    vaccine: 'Kleszowemu zapaleniu mózgu (KZM)',
    description: '3 dawki + dawki przypominające co 3-5 lat',
    ageGroups: {
      '50-59': '3 dawki + dawki przypominające co 3-5 lat',
      '60-64': '3 dawki + dawki przypominające co 3-5 lat',
      '65+': '3 dawki + dawki przypominające co 3-5 lat'
    }
  },
  {
    id: 9,
    vaccine: 'Wirusowemu zapaleniu wątroby typu A (HAV)',
    description: '2 dawki (osoby, które nie były wcześniej szczepione)',
    ageGroups: {
      '50-59': '2 dawki (osoby nieszczepione)',
      '60-64': '2 dawki (osoby nieszczepione)',
      '65+': '2 dawki (osoby nieszczepione)'
    }
  },
  {
    id: 10,
    vaccine: 'Meningokokom (MenB, MenACWY)',
    description: 'MenB: 2 dawki MenACWY: 1 dawka',
    ageGroups: {
      '50-59': 'MenB: 2 dawki, MenACWY: 1 dawka',
      '60-64': 'MenB: 2 dawki, MenACWY: 1 dawka',
      '65+': 'MenB: 2 dawki, MenACWY: 1 dawka'
    }
  }
];

const SeniorVaccinationCalendar: React.FC = () => {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('all');
  const [showFinancing, setShowFinancing] = useState(false);

  const ageGroups = ['50-59', '60-64', '65+'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#22C55E] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold uppercase">KALENDARZ SZCZEPIEŃ DOROSŁYCH</h1>
              <h2 className="text-2xl font-bold uppercase text-green-100">OSOBY STARSZE</h2>
              <p className="text-green-100 mt-2">
                Szczepienia zalecane dla osób w wieku 50+ zgodne z Programem Szczepień Ochronnych
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-green-100">
            <Heart className="w-4 h-4" />
            <span className="text-sm">Ochrona zdrowia osób starszych - szczepienia rekomendowane przez PSO</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <label className="text-sm font-medium text-gray-700">Pokaż szczepienia dla grupy wiekowej:</label>
            <select
              value={selectedAgeGroup}
              onChange={(e) => setSelectedAgeGroup(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
            >
              <option value="all">Wszystkie grupy wiekowe</option>
              <option value="50-59">50-59 lat</option>
              <option value="60-64">60-64 lata</option>
              <option value="65+">≥65 lat</option>
            </select>
          </div>
        </div>

        {/* Vaccination Schedule Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-[#22C55E]" />
              Harmonogram szczepień dla osób starszych
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Wszystkie szczepienia zgodne z aktualnymi zaleceniami Programu Szczepień Ochronnych
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-[#22C55E] text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Szczepienia przeciw
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
                    50-59 lat
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
                    60-64 lata
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
                    ≥65 lat
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {seniorVaccinationSchedules.map((schedule, index) => (
                  <tr key={schedule.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-1 h-12 mr-4 rounded bg-blue-500"></div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {schedule.vaccine}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {schedule.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-700">
                      <span className={schedule.ageGroups['50-59'] === '-' ? 'text-gray-400' : ''}>
                        {schedule.ageGroups['50-59']}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-700">
                      <span className={schedule.ageGroups['60-64'] === '-' ? 'text-gray-400' : ''}>
                        {schedule.ageGroups['60-64']}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-700">
                      <span className={schedule.ageGroups['65+'] === '-' ? 'text-gray-400' : ''}>
                        {schedule.ageGroups['65+']}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financing Section */}
        <div className="bg-white rounded-lg shadow-sm mt-8">
          <div className="p-6 border-b border-gray-200">
            <button
              onClick={() => setShowFinancing(!showFinancing)}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Info className="w-5 h-5 mr-2 text-[#22C55E]" />
                Jak finansowane są szczepienia osób starszych?
              </h3>
              <div className={`transform transition-transform ${showFinancing ? 'rotate-180' : ''}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
          </div>

          {showFinancing && (
            <div className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-3">Szczepienia refundowane przez NFZ</h4>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li>• Grypa - dla osób 65+ (bezpłatnie)</li>
                    <li>• Pneumokoki - dla osób 65+ z chorobami współistniejącymi</li>
                    <li>• Covid-19 - dla wszystkich grup wiekowych</li>
                    <li>• Tężec, błonica, krztuścowi - w ramach szczepień podstawowych</li>
                  </ul>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-3">Szczepienia płatne</h4>
                  <ul className="space-y-2 text-sm text-orange-800">
                    <li>• Półpasiec (RZV) - około 400-500 zł za dawkę</li>
                    <li>• RSV - około 300-400 zł za dawkę</li>
                    <li>• Kleszowe zapalenie mózgu - około 150-200 zł za dawkę</li>
                    <li>• Wirusowe zapalenie wątroby A i B - około 100-150 zł za dawkę</li>
                  </ul>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-3">Dodatkowe możliwości finansowania</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-green-800">
                  <div>
                    <p className="font-medium mb-2">Programy samorządowe:</p>
                    <ul className="space-y-1">
                      <li>• Bezpłatne szczepienia przeciwko grypie</li>
                      <li>• Dofinansowanie szczepień przeciwko pneumokokom</li>
                      <li>• Akcje szczepień w ramach promocji zdrowia</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Pracodawcy i ubezpieczyciele:</p>
                    <ul className="space-y-1">
                      <li>• Pakiety medyczne obejmujące szczepienia</li>
                      <li>• Dofinansowanie przez pracodawcę</li>
                      <li>• Programy profilaktyczne firm ubezpieczeniowych</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Logos and institutional info */}
              <div className="border-t pt-6">
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-xs">NFZ</span>
                    </div>
                    <span>Narodowy Fundusz Zdrowia</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                      <span className="text-green-600 font-bold text-xs">MZ</span>
                    </div>
                    <span>Ministerstwo Zdrowia</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                      <span className="text-red-600 font-bold text-xs">GIS</span>
                    </div>
                    <span>Główny Inspektorat Sanitarny</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-yellow-800 mb-4">Ważne informacje</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-yellow-800 mb-2">Przed szczepieniem:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700">
                <li>Skonsultuj się z lekarzem prowadzącym</li>
                <li>Poinformuj o przyjmowanych lekach</li>
                <li>Zgłoś choroby przewlekłe i alergie</li>
                <li>Sprawdź przeciwwskazania do szczepienia</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-yellow-800 mb-2">Szczególne zalecenia:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700">
                <li>Osoby z chorobami przewlekłymi powinny się szczepić priorytetowo</li>
                <li>Zachowaj odpowiednie odstępy między szczepieniami</li>
                <li>Prowadź dokumentację szczepień</li>
                <li>Regularnie sprawdzaj aktualne zalecenia</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-yellow-100 rounded border border-yellow-300">
            <p className="text-sm text-yellow-800">
              <strong>*Przypomnienie:</strong> Szczepienia przeciwko grypie należy wykonywać corocznie w okresie jesienno-zimowym, 
              najlepiej we wrześniu-listopadzie, aby zapewnić ochronę przed sezonem grypowym.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Źródło: Program Szczepień Ochronnych | Aktualizacja: 2024</p>
          <p className="mt-1">Szczegółowe informacje dostępne na stronie: gov.pl/szczepienia</p>
        </div>
      </div>
    </div>
  );
};

export default SeniorVaccinationCalendar;