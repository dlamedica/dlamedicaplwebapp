import React, { useState } from 'react';
import { ShieldAlert, FileText, Info, ExternalLink, AlertTriangle } from 'lucide-react';

interface VaccinationSchedule {
  id: number;
  vaccine: string;
  scheme: string;
  description: string;
  aspleniRisk: string;
  priority: 'critical' | 'high' | 'standard';
  timing?: string;
}

const aspleniVaccinationSchedules: VaccinationSchedule[] = [
  {
    id: 1,
    vaccine: 'Pneumokokom (PCV, PPSV)',
    scheme: '1 dawka PCV-15 + 1 dawka PPSV-23 (w odstępie ≥8 tygodni) lub 1 dawka PCV-20',
    description: 'Najważniejsze szczepienie - pneumokoki to główne zagrożenie u pacjentów z asplenią',
    aspleniRisk: 'Ryzyko inwazyjnej choroby pneumokokowej zwiększone 25-50 razy',
    priority: 'critical',
    timing: 'Jak najszybciej po diagnozie/splenektomii'
  },
  {
    id: 2,
    vaccine: 'Meningokokom (MenB, MenACWY)',
    scheme: 'MenB: 2 dawki w odstępie 1 miesiąca (Bexsero), 3 dawki: 2. dawka po 2 miesiącach po dawce 1, 3. dawka po 6 miesiącach po dawce 2. (Trumenba), dawki przypominające: pierwsza po roku od szczepienia podstawowego, kolejne co 2-5 lata, MenACWY: 2 dawki w odstępie 2 miesiące',
    description: 'Ochrona przed inwazyjną chorobą meningokokową',
    aspleniRisk: 'Zwiększone ryzyko sepsy meningokokowej i zapalenia opon mózgowych',
    priority: 'critical',
    timing: 'Jak najszybciej, dawki przypominające co 2-5 lat'
  },
  {
    id: 3,
    vaccine: 'Zakażeniu Haemophilus influenzae typu b (Hib)',
    scheme: '1 dawka',
    description: 'Ochrona przed inwazyjnymi zakażeniami Haemophilus influenzae typu b',
    aspleniRisk: 'Zwiększone ryzyko sepsy i zapalenia opon mózgowych przez Hib',
    priority: 'critical',
    timing: 'Jednorazowo po diagnozie'
  },
  {
    id: 4,
    vaccine: 'Błonica, tężec, krztuścowi (Tdap)',
    scheme: '1 dawka co 10 lat (osoba zaszczepiona w przeszłości w schemacie podstawowym)',
    description: 'Szczepienie podstawowe - bez specjalnych modyfikacji w asplenią',
    aspleniRisk: 'Standardowe ryzyko jak w populacji ogólnej',
    priority: 'standard'
  },
  {
    id: 5,
    vaccine: 'Odra, świnka, różyczka (MMR)',
    scheme: '2 dawki (osoba, która nie chorowała na odrę lub różyczkę i nie była szczepiona)',
    description: 'Szczepionka żywa - podać tylko jeśli nie ma przeciwwskazań immunologicznych',
    aspleniRisk: 'Ryzyko ciężkiego przebiegu chorób wirusowych',
    priority: 'high',
    timing: 'Przed splenektomią lub jeśli asplenia wrodzona bez ciężkich defektów odporności'
  },
  {
    id: 6,
    vaccine: 'Wirusowemu zapaleniu wątroby typu B (HBV)',
    scheme: '3 dawki (osoba, która nie była wcześniej szczepiona)',
    description: 'Szczepienie podstawowe - zwiększona odpowiedź może być potrzebna',
    aspleniRisk: 'Możliwa słabsza odpowiedź immunologiczna',
    priority: 'high'
  },
  {
    id: 7,
    vaccine: 'Grypa (IIV)',
    scheme: '1 dawka co roku, w czasie sezonu infekcyjnego (najlepiej na początku sezonu)**',
    description: 'Szczepienie sezonowe - ważne ze względu na ryzyko wtórnych zakażeń bakteryjnych',
    aspleniRisk: 'Zwiększone ryzyko pneumonii bakteryjnej wtórnej do grypy',
    priority: 'high'
  },
  {
    id: 8,
    vaccine: 'Covid-19',
    scheme: 'Szczepienie wg aktualnych zaleceń',
    description: 'Szczepienie przeciwko SARS-CoV-2 - dodatkowe dawki dla immunokompromitowanych',
    aspleniRisk: 'Zwiększone ryzyko ciężkiego przebiegu COVID-19',
    priority: 'high'
  },
  {
    id: 9,
    vaccine: 'Półpaścowi (RZV)',
    scheme: '2 dawki w odstępie 2-6 miesięcy',
    description: 'Szczepionka inaktywowana - bezpieczna u pacjentów z asplenią',
    aspleniRisk: 'Standardowe ryzyko półpaśca',
    priority: 'standard'
  }
];


const AspleniVaccinationCalendar: React.FC = () => {

  const [showFootnotes, setShowFootnotes] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const filteredSchedules = aspleniVaccinationSchedules.filter(schedule =>
    filterPriority === 'all' || schedule.priority === filterPriority
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'standard': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'critical': return 'KRYTYCZNE';
      case 'high': return 'WYSOKI PRIORYTET';
      case 'standard': return 'STANDARDOWY';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#991B1B] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold uppercase leading-tight">
                KALENDARZ SZCZEPIEŃ DOROSŁYCH
              </h1>
              <h2 className="text-xl md:text-2xl font-bold uppercase text-red-200 leading-tight">
                PACJENCI Z ASPLENIĄ LUB DYSFUNKCJĄ ŚLEDZIONY
              </h2>
              <p className="text-red-200 mt-2 text-sm md:text-base">
                Szczepienia dla pacjentów po splenektomii, z asplenią wrodzoną lub dysfunkcją śledziony
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-red-200">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">Zwiększone ryzyko inwazyjnych zakażeń bakteryjnych</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Critical Alert */}
        <div className="bg-red-50 border border-red-300 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-red-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4 text-red-700" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-red-800">OSTRZEŻENIE MEDYCZNE</h3>
              <p className="text-sm text-red-700 mt-1">
                Pacjenci z asplenią mają 25-50 razy wyższe ryzyko inwazyjnych zakażeń bakteryjnych,
                szczególnie pneumokokowych i meningokokowych. Szczepienia mogą uratować życie!
              </p>
            </div>
          </div>
        </div>

        {/* Medical Alert Card */}
        <div className="bg-white border-l-4 border-red-500 rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Karta pacjenta z asplenią</h3>
              <p className="text-sm text-gray-700 mb-3">
                Każdy pacjent z asplenią powinien nosić kartę identyfikującą stan medyczny i posiadać:
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Kartę identyfikacyjną "ASPLENIA"</li>
                  <li>Zapas antybiotyku (penicylina/amoksycylina)</li>
                  <li>Instrukcje postępowania w gorączce</li>
                </ul>
                <ul className="list-disc list-inside space-y-1">
                  <li>Kontakt do lekarza prowadzącego</li>
                  <li>Listę wykonanych szczepień</li>
                  <li>Informacje o profilaktyce antybiotykowej</li>
                </ul>
              </div>
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
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#991B1B] focus:border-transparent"
            >
              <option value="all">Wszystkie szczepienia</option>
              <option value="critical">Krytyczne</option>
              <option value="high">Wysoki priorytet</option>
              <option value="standard">Standardowy</option>
            </select>
          </div>
        </div>

        {/* Main Vaccination Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <ShieldAlert className="w-5 h-5 mr-2 text-[#991B1B]" />
              Harmonogram szczepień ({filteredSchedules.length} pozycji)
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Szczepienia życiowo ważne dla pacjentów z asplenią lub dysfunkcją śledziony
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-[#991B1B] text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Szczepienia przeciw
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Schemat szczepienia
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSchedules.map((schedule) => (
                  <tr key={schedule.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <div className="w-1 h-16 mr-4 rounded bg-red-800 flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-900">
                            {schedule.vaccine}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 mb-2">
                            {schedule.description}
                          </div>
                          <div className="text-xs text-gray-600 mb-2 bg-red-50 p-2 rounded">
                            <strong>Ryzyko w asplenią:</strong> {schedule.aspleniRisk}
                          </div>
                          {schedule.timing && (
                            <div className="text-xs text-blue-600 mb-2 bg-blue-50 p-2 rounded">
                              <strong>Timing:</strong> {schedule.timing}
                            </div>
                          )}
                          <div>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded border ${getPriorityColor(schedule.priority)}`}>
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
                <Info className="w-5 h-5 mr-2 text-[#991B1B]" />
                Szczegółowe informacje o asplenią
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
                  <h4 className="font-semibold text-gray-900 mb-3">Przyczyny asplenią:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• <strong>Splenektomia</strong> (chirurgiczna, urazowa)</li>
                    <li>• <strong>Asplenia wrodzona</strong> (zespoły genetyczne)</li>
                    <li>• <strong>Dysfunkcja śledziony:</strong></li>
                    <li>&nbsp;&nbsp;- Anemia sierpowatokrwinkowa</li>
                    <li>&nbsp;&nbsp;- Beta-talasemia major</li>
                    <li>&nbsp;&nbsp;- Celiachia</li>
                    <li>&nbsp;&nbsp;- Alkoholizm przewlekły</li>
                    <li>&nbsp;&nbsp;- Choroby autoimmunologiczne</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Główne zagrożenia:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• <strong>OPSI</strong> (Overwhelming Post-Splenectomy Infection)</li>
                    <li>• Inwazyjne zakażenia pneumokokowe</li>
                    <li>• Sepsa meningokokowa</li>
                    <li>• Zakażenia Haemophilus influenzae typu b</li>
                    <li>• Kaposi (śmiertelność 50-70%)</li>
                    <li>• Babeszjoza (w obszarach endemicznych)</li>
                    <li>• Malaria (ciężki przebieg)</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2">Szczepienia KRYTYCZNE (ratujące życie):</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                    <li><strong>Pneumokoki</strong> - najważniejsze, zwiększone dawki mogą być potrzebne</li>
                    <li><strong>Meningokoki</strong> - dawki przypominające co 2-5 lat</li>
                    <li><strong>Haemophilus influenzae typu b</strong> - jednorazowo</li>
                  </ul>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-800 mb-2">**Szczepienia przeciwko grypie:</h4>
                  <p className="text-sm text-orange-700">
                    Grypa może prowadzić do wtórnych zakażeń bakteryjnych, szczególnie pneumokokowych.
                    U pacjentów z asplenią może to być śmiertelne.
                  </p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">Timing szczepień:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700">
                    <li>Najlepiej 2 tygodnie przed planowaną splenektomią</li>
                    <li>Jeśli po splenektomii - jak najszybciej (najlepiej w ciągu 14 dni)</li>
                    <li>W asplenią wrodzonej - zgodnie z kalendarzem szczepień</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Profilaktyka antybiotykowa:</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
                    <div>
                      <p className="font-medium mb-2">Długotrwała profilaktyka:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Penicylina V 250mg 2x/dzień</li>
                        <li>Amoksycylina 250mg 2x/dzień</li>
                        <li>Erytromycyna (uczulenie na penicylinę)</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium mb-2">Postępowanie w gorączce:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Gorączka &gt;38°C = natychmiast do szpitala</li>
                        <li>Amoksycylina-kw.klawulanowy 875mg</li>
                        <li>Posiew krwi przed antybiotykoterapią</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>



        {/* Important Information */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-amber-800 mb-4">Ważne informacje dla pacjentów z asplenią</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-amber-800 mb-2">Obowiązkowe działania:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-amber-700">
                <li>Nosić kartę identyfikującą asplenię</li>
                <li>Przyjmować profilaktyczne antybiotyki</li>
                <li>Szczepienia zgodnie z harmonogramem</li>
                <li>Natychmiastowa pomoc przy gorączce &gt;38°C</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-amber-800 mb-2">Unikaj:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-amber-700">
                <li>Podróży do obszarów endemicznych dla malarii</li>
                <li>Kontaktu z osobami chorymi</li>
                <li>Odkładania wizyt lekarskich</li>
                <li>Samoleczenia w przypadku infekcji</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center mb-4">
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

          <div className="border-t border-gray-200 pt-4 text-center">
            <p className="text-sm text-gray-500 mb-1">
              <strong>Źródło:</strong> Program Szczepień Ochronnych | Zalecenia dla pacjentów z asplenią
            </p>
            <p className="text-sm text-gray-500 mb-1">
              <strong>Aktualizacja:</strong> 2024 | <strong>Wersja:</strong> 3.8
            </p>
            <p className="text-xs text-gray-400">
              Konsultacje hematologiczne/immunologiczne zalecane | Informacje: gov.pl/szczepienia
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AspleniVaccinationCalendar;