import React, { useState } from 'react';
import { Shield, FileText, Info, ExternalLink } from 'lucide-react';

interface VaccinationSchedule {
  id: number;
  vaccine: string;
  scheme: string;
  description: string;
  priority: 'high' | 'medium' | 'standard';
  footnote?: string;
  contraindication?: string;
}

const immunologyVaccinationSchedules: VaccinationSchedule[] = [
  {
    id: 1,
    vaccine: 'Wirusowemu zapaleniu wątroby typu B***',
    scheme: '3 dawki w schemacie 0, 1, 6 miesiący',
    description: 'Szczepienie priorytetowe dla pacjentów immunokompromitowanych',
    priority: 'high',
    footnote: '***Zwiększona liczba dawek może być potrzebna'
  },
  {
    id: 2,
    vaccine: 'Wirusowemu zapaleniu wątroby typu A',
    scheme: '2 dawki w odstępie 6-12 miesięcy',
    description: 'Ochrona przed hepatitis A - ważna u osób z niedoborami odporności',
    priority: 'high'
  },
  {
    id: 3,
    vaccine: 'Grypa (IIV)',
    scheme: '1 dawka co roku, w czasie sezonu infekcyjnego (najlepiej na początku sezonu)**',
    description: 'Szczepienie sezonowe - szczególnie ważne u pacjentów immunokompromitowanych',
    priority: 'high',
    footnote: '**Tylko szczepionki inaktywowane',
    contraindication: 'Unikaj szczepionek żywych'
  },
  {
    id: 4,
    vaccine: 'Pneumokokom (PCV, PPSV)',
    scheme: '1 dawka PCV-15 + 1 dawka PPSV-23 (w odstępie ≥8 tygodni) lub 1 dawka PCV-20',
    description: 'Ochrona przed zakażeniami pneumokokowymi - kluczowa u osób z niedoborami',
    priority: 'high'
  },
  {
    id: 5,
    vaccine: 'Błonica, tężec, krztuścowi (Tdap)',
    scheme: '1 dawka co 10 lat (osoba zaszczepiona w przeszłości w schemacie podstawowym)',
    description: 'Szczepienie podstawowe - bezpieczne u pacjentów z zaburzeniami odporności',
    priority: 'medium'
  },
  {
    id: 6,
    vaccine: 'COVID-19',
    scheme: 'Liczba dawek zależy od historii szczepień i aktualnych zaleceń',
    description: 'Szczepienie przeciwko SARS-CoV-2 - dodatkowe dawki dla immunokompromitowanych',
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
    description: 'UWAGA: Szczepionka żywa - może być przeciwwskazana',
    priority: 'medium',
    contraindication: 'Przeciwwskazana u osób z ciężkimi niedoborami odporności'
  },
  {
    id: 9,
    vaccine: 'Odra, świnka, różyczka (MMR)',
    scheme: '2 dawki (u osób, które nie chorowały na odrę lub różyczkę i nie były szczepione)',
    description: 'UWAGA: Szczepionka żywa - może być przeciwwskazana',
    priority: 'medium',
    contraindication: 'Przeciwwskazana u osób z ciężkimi niedoborami odporności'
  },
  {
    id: 10,
    vaccine: 'Półpaścowi (RZV)',
    scheme: '2 dawki w odstępie 2-6 miesięcy',
    description: 'Szczepionka inaktywowana - bezpieczna dla immunokompromitowanych',
    priority: 'standard'
  },
  {
    id: 11,
    vaccine: 'Syncytalnemu wirusowi oddechowemu (RSV)',
    scheme: '1 dawka u osób w wieku ≥60 lat',
    description: 'Ochrona przed RSV - szczególnie ważna u osób starszych z niedoborami odporności',
    priority: 'standard'
  }
];


const ImmunologyVaccinationCalendar: React.FC = () => {

  const [showFootnotes, setShowFootnotes] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const filteredSchedules = immunologyVaccinationSchedules.filter(schedule =>
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
      <div className="bg-[#EC4899] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold uppercase leading-tight">
                KALENDARZ SZCZEPIEŃ DOROSŁYCH
              </h1>
              <h2 className="text-xl md:text-2xl font-bold uppercase text-pink-200 leading-tight">
                PACJENCI Z ZABURZENIAMI ODPORNOŚCI
              </h2>
              <h3 className="text-lg font-semibold uppercase text-pink-100">
                (Z WYŁĄCZENIEM PACJENTÓW ZAKAŻONYCH HIV)
              </h3>
              <p className="text-pink-200 mt-2 text-sm md:text-base">
                Szczepienia dla pacjentów z niedoborami odporności pierwotnej i wtórnej
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-pink-200">
            <Shield className="w-4 h-4" />
            <span className="text-sm">Zgodne z aktualnym Programem Szczepień Ochronnych</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Alert about live vaccines */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-red-600 text-sm font-bold">!</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-red-800">WAŻNE OSTRZEŻENIE</h3>
              <p className="text-sm text-red-700 mt-1">
                Szczepionki żywe (MMR, ospa wietrzna) mogą być przeciwwskazane u pacjentów z ciężkimi niedoborami odporności.
                Zawsze skonsultuj się z immunologiem przed szczepieniem.
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <label className="text-sm font-medium text-gray-700">Filtruj według priorytetu:</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC4899] focus:border-transparent"
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
              <Shield className="w-5 h-5 mr-2 text-[#EC4899]" />
              Harmonogram szczepień ({filteredSchedules.length} pozycji)
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Szczepienia dla pacjentów z zaburzeniami odporności (z wyłączeniem HIV)
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-[#EC4899] text-white">
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
                        <div className="w-1 h-16 mr-4 rounded bg-pink-500 flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-900">
                            {schedule.vaccine}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {schedule.description}
                          </div>
                          {schedule.contraindication && (
                            <div className="mt-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                              ⚠️ {schedule.contraindication}
                            </div>
                          )}
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
                <Info className="w-5 h-5 mr-2 text-[#EC4899]" />
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
                  <h4 className="font-semibold text-gray-900 mb-3">Zaburzenia odporności objęte kalendarzem:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Pierwotne niedobory odporności</li>
                    <li>• Wtórne niedobory odporności</li>
                    <li>• Pacjenci po transplantacji narządów</li>
                    <li>• Przewlekła terapia immunosupresyjna</li>
                    <li>• Choroby autoimmunologiczne</li>
                    <li>• Terapia biologiczna</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Szczególne zasady:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Tylko szczepionki inaktywowane w ciężkich niedoborach</li>
                    <li>• Monitorowanie odpowiedzi serologicznej</li>
                    <li>• Dodatkowe dawki przy słabej odpowiedzi</li>
                    <li>• Szczepienia przed terapią immunosupresyjną</li>
                    <li>• Konsultacja immunologa obowiązkowa</li>
                    <li>• Unikanie kontaktu z osobami po szczepieniu żywymi szczepionkami</li>
                  </ul>
                </div>
              </div>

              <div className="bg-pink-50 p-4 rounded-lg">
                <p className="text-sm text-pink-800">
                  <strong>***Szczepienia przeciwko HBV:</strong> U pacjentów immunokompromitowanych może być potrzebna zwiększona liczba dawek
                  lub wyższe dawki szczepionki. Kontrola serologiczna po szczepieniu obowiązkowa.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>**Szczepienia przeciwko grypie:</strong> Tylko szczepionki inaktywowane.
                  Unikać szczepionek żywych (LAIV). Szczepić wszystkich członków rodziny.
                </p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">Przeciwwskazania do szczepionek żywych:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                  <li>Ciężkie pierwotne niedobory odporności</li>
                  <li>Aktywna terapia immunosupresyjna</li>
                  <li>Po transplantacji narządów</li>
                  <li>Wysokie dawki steroidów (&gt;20mg prednisolonu/dzień &gt;14 dni)</li>
                </ul>
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
                <li>Obowiązkowa konsultacja immunologa</li>
                <li>Ocena stopnia niedoboru odporności</li>
                <li>Sprawdź przyjmowane leki immunosupresyjne</li>
                <li>Kontrola serologiczna przed szczepieniem</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-amber-800 mb-2">Szczególne zalecenia:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-amber-700">
                <li>Unikaj szczepionek żywych w ciężkich niedoborach</li>
                <li>Monitoruj odpowiedź po każdym szczepieniu</li>
                <li>Szczep rodzinę - ochrona pośrednia</li>
                <li>Dodatkowe dawki przy słabej odpowiedzi</li>
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
              Konsultacje immunologiczne obowiązkowe | Informacje: gov.pl/szczepienia
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImmunologyVaccinationCalendar;