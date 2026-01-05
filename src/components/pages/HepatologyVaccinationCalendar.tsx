import React, { useState } from 'react';
import { Activity, FileText, Info, ExternalLink } from 'lucide-react';

interface VaccinationSchedule {
  id: number;
  vaccine: string;
  scheme: string;
  description: string;
  priority: 'high' | 'medium' | 'standard';
  footnote?: string;
}

const hepatologyVaccinationSchedules: VaccinationSchedule[] = [
  {
    id: 1,
    vaccine: 'Wirusowemu zapaleniu wątroby typu B***',
    scheme: '3 dawki w schemacie 0, 1, 6 miesiący',
    description: 'Szczepienie priorytetowe - szczególnie ważne u pacjentów z chorobami wątroby',
    priority: 'high',
    footnote: '***Obowiązkowe u wszystkich pacjentów z przewlekłymi chorobami wątroby'
  },
  {
    id: 2,
    vaccine: 'Wirusowemu zapaleniu wątroby typu A',
    scheme: '2 dawki w odstępie 6-12 miesięcy',
    description: 'Ochrona przed hepatitis A - ważna u pacjentów z chorobami wątroby',
    priority: 'high'
  },
  {
    id: 3,
    vaccine: 'Grypa (IIV)',
    scheme: '1 dawka co roku, w czasie sezonu infekcyjnego (najlepiej na początku sezonu)**',
    description: 'Szczepienie sezonowe - szczególnie zalecane u pacjentów immunokompromitowanych',
    priority: 'high',
    footnote: '**Szczepienia w okresie jesienno-zimowym (wrzesień-listopad)'
  },
  {
    id: 4,
    vaccine: 'Pneumokokom (PCV, PPSV)',
    scheme: '1 dawka PCV-15 + 1 dawka PPSV-23 (w odstępie ≥8 tygodni) lub 1 dawka PCV-20',
    description: 'Ochrona przed zakażeniami pneumokokowymi',
    priority: 'high'
  },
  {
    id: 5,
    vaccine: 'Błonica, tężec, krztuścowi (Tdap)',
    scheme: '1 dawka co 10 lat (osoba zaszczepiona w przeszłości w schemacie podstawowym)',
    description: 'Szczepienie podstawowe - przypomnienia co 10 lat',
    priority: 'medium'
  },
  {
    id: 6,
    vaccine: 'COVID-19',
    scheme: 'Liczba dawek zależy od historii szczepień i aktualnych zaleceń',
    description: 'Szczepienie przeciwko SARS-CoV-2 - kluczowe dla pacjentów z chorobami wątroby',
    priority: 'high'
  },
  {
    id: 7,
    vaccine: 'Meningokokom (MenB, MenACWY)',
    scheme: 'MenB: 2 dawki w odstępie ≥1 miesiąca; MenACWY: 1 dawka',
    description: 'Ochrona przed zakażeniami meningokokowymi',
    priority: 'medium'
  },
  {
    id: 8,
    vaccine: 'Ospa wietrzna',
    scheme: '2 dawki w odstępie ≥6 tygodni (u osób, które nie chorowały na ospę wietrzną)',
    description: 'Szczepienie dla osób bez historii choroby',
    priority: 'medium'
  },
  {
    id: 9,
    vaccine: 'Odra, świnka, różyczka (MMR)',
    scheme: '2 dawki (u osób, które nie chorowały na odrę lub różyczkę i nie były szczepione)',
    description: 'Szczepienie dla osób bez udokumentowanej odporności',
    priority: 'medium'
  },
  {
    id: 10,
    vaccine: 'Półpaścowi (RZV)',
    scheme: '2 dawki w odstępie 2-6 miesięcy',
    description: 'Szczepienie przeciwko półpaścowi dla osób ≥50 lat',
    priority: 'standard'
  },
  {
    id: 11,
    vaccine: 'Syncytalnemu wirusowi oddechowemu (RSV)',
    scheme: '1 dawka u osób w wieku ≥60 lat',
    description: 'Ochrona przed RSV u osób starszych',
    priority: 'standard'
  }
];


const HepatologyVaccinationCalendar: React.FC = () => {

  const [showFootnotes, setShowFootnotes] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const filteredSchedules = hepatologyVaccinationSchedules.filter(schedule =>
    filterPriority === 'all' || schedule.priority === filterPriority
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'standard': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Wysoki priorytet';
      case 'medium': return 'Średni priorytet';
      case 'standard': return 'Standardowy';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#8B1538] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold uppercase leading-tight">
                KALENDARZ SZCZEPIEŃ DOROSŁYCH
              </h1>
              <h2 className="text-xl md:text-2xl font-bold uppercase text-red-200 leading-tight">
                PACJENCI Z PRZEWLEKŁĄ CHOROBĄ WĄTROBY
              </h2>
              <p className="text-red-200 mt-2 text-sm md:text-base">
                Szczepienia zalecane dla pacjentów z marskością, hepatitis, chorobą alkoholową wątroby
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-red-200">
            <Activity className="w-4 h-4" />
            <span className="text-sm">Zgodne z aktualnym Programem Szczepień Ochronnych</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <label className="text-sm font-medium text-gray-700">Filtruj według priorytetu:</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
            >
              <option value="all">Wszystkie szczepienia</option>
              <option value="high">Wysoki priorytet</option>
              <option value="medium">Średni priorytet</option>
              <option value="standard">Standardowy</option>
            </select>
          </div>
        </div>

        {/* Main Vaccination Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-[#8B1538]" />
              Harmonogram szczepień ({filteredSchedules.length} pozycji)
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Szczepienia priorytetowe dla pacjentów z przewlekłymi chorobami wątroby
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-[#8B1538] text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Szczepienia przeciw
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Schemat szczepienia
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSchedules.map((schedule, index) => (
                  <tr key={schedule.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <div className="w-1 h-16 mr-4 rounded bg-red-500 flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-900">
                            {schedule.vaccine}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {schedule.description}
                          </div>
                          <div className="mt-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(schedule.priority)}`}>
                              {getPriorityLabel(schedule.priority)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="max-w-md">
                        {schedule.scheme}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footnotes Section */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="p-6 border-b border-gray-200">
            <button
              onClick={() => setShowFootnotes(!showFootnotes)}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Info className="w-5 h-5 mr-2 text-[#8B1538]" />
                Przypisy i wyjaśnienia szczegółowe
              </h3>
              <div className={`transform transition-transform ${showFootnotes ? 'rotate-180' : ''}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
          </div>

          {showFootnotes && (
            <div className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Choroby wątroby objęte kalendarzem:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Marskość wątroby (wszystkie etiologie)</li>
                    <li>• Przewlekłe wirusowe zapalenie wątroby (HBV, HCV)</li>
                    <li>• Choroba alkoholowa wątroby</li>
                    <li>• Niealkoholowa stłuszczeniowa choroba wątroby (NASH)</li>
                    <li>• Pierwotna żółciowa marskość wątroby (PBC)</li>
                    <li>• Pierwotne stwardniające zapalenie dróg żółciowych (PSC)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Szczególne uwagi:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Szczepienia przeciwko HBV i HAV są priorytetowe</li>
                    <li>• Unikaj szczepionek żywych u pacjentów immunokompromitowanych</li>
                    <li>• Skonsultuj z hepatologiem przed szczepieniami</li>
                    <li>• Sprawdź poziom przeciwciał przed szczepieniem HBV</li>
                    <li>• Monitoruj odpowiedź na szczepienia</li>
                    <li>• Rozważ dodatkowe dawki przypominające</li>
                  </ul>
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>***Szczepienia przeciwko HBV:</strong> Obowiązkowe u wszystkich pacjentów z przewlekłymi chorobami wątroby.
                  Sprawdź HBsAg, anti-HBc, anti-HBs przed szczepieniem. W przypadku braku odpowiedzi rozważ dodatkowe dawki.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>**Szczepienia przeciwko grypie:</strong> Wykonywać corocznie w okresie jesienno-zimowym.
                  Szczególnie ważne u pacjentów z marskością wątroby ze względu na zwiększone ryzyko powikłań.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Important Information */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-amber-800 mb-4">Ważne informacje dla pacjentów</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-amber-800 mb-2">Przed szczepieniem:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-amber-700">
                <li>Skonsultuj się z hepatologiem</li>
                <li>Sprawdź aktualny stan funkcji wątroby</li>
                <li>Poinformuj o przyjmowanych lekach</li>
                <li>Sprawdź poziom przeciwciał (anti-HBs, anti-HAV)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-amber-800 mb-2">Szczególne zalecenia:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-amber-700">
                <li>Priorytet dla szczepień przeciwko hepatitis A i B</li>
                <li>Unikaj szczepionek żywych w dekompensacji</li>
                <li>Rozważ dodatkowe dawki przy słabej odpowiedzi</li>
                <li>Monitoruj odpowiedź serologiczną</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center mb-4">
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
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

          <div className="border-t border-gray-200 pt-4 text-center">
            <p className="text-sm text-gray-500 mb-1">
              <strong>Źródło:</strong> Program Szczepień Ochronnych | Ministerstwo Zdrowia
            </p>
            <p className="text-sm text-gray-500 mb-1">
              <strong>Aktualizacja:</strong> 2024 | <strong>Wersja:</strong> 3.1
            </p>
            <p className="text-xs text-gray-400">
              Szczegółowe informacje: gov.pl/szczepienia | Konsultacje hepatologiczne zalecane
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HepatologyVaccinationCalendar;