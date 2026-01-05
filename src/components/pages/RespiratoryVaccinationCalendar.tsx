import React, { useState } from 'react';
import { Wind, FileText, Info, ExternalLink } from 'lucide-react';

interface VaccinationSchedule {
  id: number;
  vaccine: string;
  scheme: string;
  description: string;
  footnote?: string;
}

const respiratoryVaccinationSchedules: VaccinationSchedule[] = [
  {
    id: 1,
    vaccine: 'Grypa (IIV)',
    scheme: '1 dawka co roku, w czasie sezonu infekcyjnego (najlepiej na początku sezonu)*',
    description: 'Szczepionka przeciwko grypie sezonowej - priorytet dla pacjentów z chorobami układu oddechowego',
    footnote: '*Szczepienia przeciwko grypie powinny być wykonywane w okresie jesienno-zimowym (wrzesień-listopad)'
  },
  {
    id: 2,
    vaccine: 'Pneumokokom (PCV, PPSV)',
    scheme: '1 dawka PCV-15 + PPSV-23 (z zachowaniem odstępu ≥8 tygodni) lub 1 dawka PCV-20',
    description: 'Ochrona przed zakażeniami pneumokokowymi - szczególnie ważna u pacjentów z POChP, astmą',
  },
  {
    id: 3,
    vaccine: 'Błonica, tężec, krztuścowi (Tdap)',
    scheme: '1 dawka co 10 lat',
    description: 'Szczepienie podstawowe - dodatkowa ochrona dróg oddechowych przed krztuścem',
  },
  {
    id: 4,
    vaccine: 'Covid-19',
    scheme: 'Liczba dawek zależy od historii szczepień i aktualnych zaleceń',
    description: 'Szczepienie przeciwko SARS-CoV-2 - kluczowe dla pacjentów z chorobami układu oddechowego',
  },
  {
    id: 5,
    vaccine: 'Syncytalnemu wirusowi oddechowemu (RSV)',
    scheme: '1 dawka u osób w wieku ≥60 lat',
    description: 'Ochrona przed RSV - szczególnie ważna u starszych pacjentów z chorobami płuc',
  },
  {
    id: 6,
    vaccine: 'Półpaścowi (RZV)',
    scheme: '2 dawki w odstępie 2-6 miesięcy',
    description: 'Szczepienie przeciwko półpaścowi - zalecane dla wszystkich dorosłych ≥50 lat',
  }
];


const RespiratoryVaccinationCalendar: React.FC = () => {

  const [showFootnotes, setShowFootnotes] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#6B7280] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Wind className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold uppercase leading-tight">
                KALENDARZ SZCZEPIEŃ DOROSŁYCH
              </h1>
              <h2 className="text-xl md:text-2xl font-bold uppercase text-gray-200 leading-tight">
                PACJENCI Z CHOROBAMI UKŁADU ODDECHOWEGO
              </h2>
              <p className="text-gray-200 mt-2 text-sm md:text-base">
                Szczepienia zalecane dla pacjentów z astmą, POChP, mukowiscydozą i innymi chorobami płuc
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-gray-200">
            <Wind className="w-4 h-4" />
            <span className="text-sm">Zgodne z aktualnym Programem Szczepień Ochronnych</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Vaccination Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <Wind className="w-5 h-5 mr-2 text-[#6B7280]" />
              Harmonogram szczepień
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Szczepienia priorytetowe dla pacjentów z chorobami układu oddechowego
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-[#6B7280] text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Szczepienia przeciw
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Schemat szczepienia
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {respiratoryVaccinationSchedules.map((schedule, index) => (
                  <tr key={schedule.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <div className="w-1 h-16 mr-4 rounded bg-gray-400 flex-shrink-0"></div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {schedule.vaccine}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 max-w-xs">
                            {schedule.description}
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
                <Info className="w-5 h-5 mr-2 text-[#6B7280]" />
                Przypisy i wyjaśnienia skrótów
              </h3>
              <div className={`transform transition-transform ${showFootnotes ? 'rotate-180' : ''}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
          </div>

          {showFootnotes && (
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Skróty szczepionek:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li><strong>IIV</strong> - Inaktywowana szczepionka przeciwko grypie</li>
                    <li><strong>PCV</strong> - Pneumokokowa szczepionka koniugowana</li>
                    <li><strong>PPSV</strong> - Pneumokokowa szczepionka polisacharydowa</li>
                    <li><strong>Tdap</strong> - Szczepionka przeciwko tężcowi, błonicy i krztuścowi</li>
                    <li><strong>RSV</strong> - Syncytalny wirus oddechowy</li>
                    <li><strong>RZV</strong> - Szczepionka przeciwko półpaścowi</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Choroby układu oddechowego:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li><strong>POChP</strong> - Przewlekła obturacyjna choroba płuc</li>
                    <li><strong>Astma oskrzelowa</strong> - wszystkie stopnie zaawansowania</li>
                    <li><strong>Mukowiscydoza</strong> - choroba genetyczna płuc</li>
                    <li><strong>Śródmiąższowe choroby płuc</strong></li>
                    <li><strong>Rozstrzenie oskrzeli</strong></li>
                    <li><strong>Przewlekłe zapalenie oskrzeli</strong></li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mt-4">
                <p className="text-sm text-blue-800">
                  <strong>*Przypomnienie:</strong> Szczepienia przeciwko grypie należy wykonywać corocznie
                  w okresie jesienno-zimowym (wrzesień-listopad), aby zapewnić ochronę przed sezonem grypowym.
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
                <li>Skonsultuj się z lekarzem prowadzącym/pulmonologiem</li>
                <li>Poinformuj o aktualnym stanie choroby podstawowej</li>
                <li>Zgłoś przyjmowane leki (szczególnie steroidy, immunosupresanty)</li>
                <li>Sprawdź przeciwwskazania do poszczególnych szczepień</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-amber-800 mb-2">Szczególne zalecenia:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-amber-700">
                <li>Pacjenci z POChP - priorytet dla szczepień przeciwko grypie i pneumokokom</li>
                <li>Osoby z astmą - unikaj szczepień w okresie zaostrzeń</li>
                <li>Mukowiscydoza - szczepienia zgodnie ze schematem indywidualnym</li>
                <li>Prowadź dokumentację wszystkich wykonanych szczepień</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer with institutional logos */}
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
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-xs">PTK</span>
                </div>
                <span>Polskie Towarzystwo Kardiologiczne</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 text-center">
            <p className="text-sm text-gray-500 mb-1">
              <strong>Źródło:</strong> Program Szczepień Ochronnych | Ministerstwo Zdrowia
            </p>
            <p className="text-sm text-gray-500 mb-1">
              <strong>Aktualizacja:</strong> 2024 | <strong>Wersja:</strong> 2.1
            </p>
            <p className="text-xs text-gray-400">
              Szczegółowe informacje dostępne na: gov.pl/szczepienia | pzh.gov.pl
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RespiratoryVaccinationCalendar;