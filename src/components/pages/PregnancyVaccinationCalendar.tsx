import React, { useState } from 'react';
import { Baby, FileText, Info, ExternalLink, Heart } from 'lucide-react';

interface VaccinationSchedule {
  id: number;
  vaccine: string;
  scheme: string;
  description: string;
  section: 'planning' | 'pregnancy';
  timing?: string;
  safety: 'safe' | 'recommended' | 'contraindicated';
}

const pregnancyVaccinationSchedules: VaccinationSchedule[] = [
  // SEKCJA A: PLANUJĄCE CIĄŻĘ
  {
    id: 1,
    vaccine: 'Wirusowemu zapaleniu wątroby typu B (HBV)',
    scheme: '3 dawki (kobiety, które nie były wcześniej szczepione)',
    description: 'Szczepienie przed ciążą - ochrona matki i dziecka',
    section: 'planning',
    timing: 'Przed planowaną ciążą',
    safety: 'safe'
  },
  {
    id: 2,
    vaccine: 'Ospa wietrzna (VZV)',
    scheme: '2 dawki (kobiety, które nie chorowały na ospę wietrzną i nie były szczepione)',
    description: 'TYLKO przed ciążą - szczepionka żywa przeciwwskazana w ciąży',
    section: 'planning',
    timing: 'Minimum 1 miesiąc przed ciążą',
    safety: 'contraindicated'
  },
  {
    id: 3,
    vaccine: 'Odra, świnka, różyczka (MMR)',
    scheme: '1 lub 2 dawki (kobiety, które nie chorowały na różyczkę i nie były szczepione)',
    description: 'TYLKO przed ciążą - szczepionka żywa przeciwwskazana w ciąży',
    section: 'planning',
    timing: 'Minimum 1 miesiąc przed ciążą',
    safety: 'contraindicated'
  },
  {
    id: 4,
    vaccine: 'Grypa (IIV)',
    scheme: '1 dawka na w czasie sezonu infekcyjnego (najlepiej na początku sezonu)',
    description: 'Szczepienie sezonowe - można kontynuować w ciąży',
    section: 'planning',
    timing: 'Sezon jesienno-zimowy',
    safety: 'safe'
  },
  // SEKCJA B: W CIĄŻY
  {
    id: 5,
    vaccine: 'Grypa (IIV)',
    scheme: '1 dawka, może być podana w każdym okresie ciąży',
    description: 'Bezpieczne i zalecane w każdym trymestrze ciąży',
    section: 'pregnancy',
    timing: 'Każdy trymestr',
    safety: 'recommended'
  },
  {
    id: 6,
    vaccine: 'Błonica, tężec, krztuścowi (Tdap)',
    scheme: '1 dawka w każdej ciąży, może być podana między 27. a 36 tc. (optymalnie między 28 a 32 tc.)',
    description: 'Ochrona matki i noworodka przed krztuścem',
    section: 'pregnancy',
    timing: '27-36 tc (optymalnie 28-32 tc)',
    safety: 'recommended'
  },
  {
    id: 7,
    vaccine: 'Covid-19',
    scheme: '1 dawka (zgodnie z aktualnymi zaleceniami)',
    description: 'Bezpieczne szczepienie w ciąży - ochrona matki i dziecka',
    section: 'pregnancy',
    timing: 'Każdy trymestr',
    safety: 'recommended'
  },
  {
    id: 8,
    vaccine: 'Syncytalnemu wirusowi oddechowemu (RSV)',
    scheme: '1 dawka, może być podana między 24. a 36 tc., zapewnia ochronę dziecka w pierwszych 6 miesiącach życia',
    description: 'Nowe szczepienie - ochrona noworodka przez przeciwciała matczyńskie',
    section: 'pregnancy',
    timing: '24-36 tc',
    safety: 'recommended'
  }
];


const PregnancyVaccinationCalendar: React.FC = () => {

  const [showFootnotes, setShowFootnotes] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('all');

  const filteredSchedules = pregnancyVaccinationSchedules.filter(schedule =>
    activeSection === 'all' || schedule.section === activeSection
  );

  const planningSchedules = pregnancyVaccinationSchedules.filter(s => s.section === 'planning');
  const pregnancySchedules = pregnancyVaccinationSchedules.filter(s => s.section === 'pregnancy');

  const getSafetyColor = (safety: string) => {
    switch (safety) {
      case 'safe': return 'bg-green-100 text-green-800 border-green-200';
      case 'recommended': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'contraindicated': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSafetyLabel = (safety: string) => {
    switch (safety) {
      case 'safe': return 'BEZPIECZNE';
      case 'recommended': return 'ZALECANE';
      case 'contraindicated': return 'PRZECIWWSKAZANE W CIĄŻY';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#8B5CF6] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Baby className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold uppercase leading-tight">
                KALENDARZ SZCZEPIEŃ DOROSŁYCH
              </h1>
              <h2 className="text-xl md:text-2xl font-bold uppercase text-purple-200 leading-tight">
                KOBIET PLANUJĄCYCH CIĄŻĘ ORAZ KOBIET W CIĄŻY
              </h2>
              <p className="text-purple-200 mt-2 text-sm md:text-base">
                Bezpieczne szczepienia dla zdrowia matki i dziecka
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-purple-200">
            <Heart className="w-4 h-4" />
            <span className="text-sm">Zgodne z zaleceniami Polskiego Towarzystwa Ginekologów i Położników</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Important Safety Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-amber-600 text-sm font-bold">!</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-amber-800">WAŻNE INFORMACJE</h3>
              <p className="text-sm text-amber-700 mt-1">
                Szczepionki żywe (MMR, ospa wietrzna) są przeciwwskazane w ciąży.
                Należy je podać minimum 1 miesiąc przed planowaną ciążą.
              </p>
            </div>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveSection('all')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeSection === 'all'
                    ? 'border-[#8B5CF6] text-[#8B5CF6]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Wszystkie szczepienia
              </button>
              <button
                onClick={() => setActiveSection('planning')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeSection === 'planning'
                    ? 'border-[#8B5CF6] text-[#8B5CF6]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Planujące ciążę ({planningSchedules.length})
              </button>
              <button
                onClick={() => setActiveSection('pregnancy')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeSection === 'pregnancy'
                    ? 'border-[#8B5CF6] text-[#8B5CF6]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                W ciąży ({pregnancySchedules.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Sections Display */}
        {(activeSection === 'all' || activeSection === 'planning') && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <Baby className="w-5 h-5 mr-2 text-[#8B5CF6]" />
                SEKCJA A: KALENDARZ SZCZEPIEŃ KOBIET PLANUJĄCYCH CIĄŻĘ
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Szczepienia przed planowaną ciążą - ochrona matki i przyszłego dziecka
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-[#8B5CF6] text-white">
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      Szczepienia przeciw
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      Schemat szczepienia
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {planningSchedules.map((schedule) => (
                    <tr key={schedule.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          <div className="w-1 h-16 mr-4 rounded bg-purple-500 flex-shrink-0"></div>
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-gray-900">
                              {schedule.vaccine}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 mb-2">
                              {schedule.description}
                            </div>
                            {schedule.timing && (
                              <div className="text-xs text-gray-600 mb-2 bg-gray-50 p-2 rounded">
                                <strong>Timing:</strong> {schedule.timing}
                              </div>
                            )}
                            <div>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded border ${getSafetyColor(schedule.safety)}`}>
                                {getSafetyLabel(schedule.safety)}
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
        )}

        {(activeSection === 'all' || activeSection === 'pregnancy') && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-[#8B5CF6]" />
                SEKCJA B: KALENDARZ SZCZEPIEŃ KOBIET W CIĄŻY
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Szczepienia bezpieczne i zalecane podczas ciąży
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-[#8B5CF6] text-white">
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      Szczepienia przeciw
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      Schemat szczepienia
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pregnancySchedules.map((schedule) => (
                    <tr key={schedule.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          <div className="w-1 h-16 mr-4 rounded bg-purple-500 flex-shrink-0"></div>
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-gray-900">
                              {schedule.vaccine}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 mb-2">
                              {schedule.description}
                            </div>
                            {schedule.timing && (
                              <div className="text-xs text-gray-600 mb-2 bg-gray-50 p-2 rounded">
                                <strong>Timing:</strong> {schedule.timing}
                              </div>
                            )}
                            <div>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded border ${getSafetyColor(schedule.safety)}`}>
                                {getSafetyLabel(schedule.safety)}
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
        )}

        {/* Footnotes Section */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="p-6 border-b border-gray-200">
            <button
              onClick={() => setShowFootnotes(!showFootnotes)}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Info className="w-5 h-5 mr-2 text-[#8B5CF6]" />
                Szczegółowe informacje i zalecenia
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
                  <h4 className="font-semibold text-gray-900 mb-3">Szczepienia PRZED ciążą:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• <strong>MMR</strong> - ochrona przed różyczką wrodzoną</li>
                    <li>• <strong>VZV</strong> - ochrona przed ospą wietrzną</li>
                    <li>• <strong>HBV</strong> - ochrona przed zakażeniem w ciąży</li>
                    <li>• <strong>Grypa</strong> - kontynuacja w ciąży możliwa</li>
                    <li>• Szczepionki żywe: minimum 1 miesiąc przed poczęciem</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Szczepienia W ciąży:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• <strong>Grypa</strong> - w każdym trymestrze</li>
                    <li>• <strong>Tdap</strong> - 27-36 tc (optymalnie 28-32 tc)</li>
                    <li>• <strong>COVID-19</strong> - w każdym trymestrze</li>
                    <li>• <strong>RSV</strong> - 24-36 tc (nowość!)</li>
                    <li>• Tylko szczepionki inaktywowane</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Szczepienia BEZPIECZNE w ciąży:</h4>
                  <p className="text-sm text-green-700">
                    <strong>Grypa (IIV), COVID-19, Tdap, RSV</strong> - szczepionki inaktywowane,
                    bezpieczne i zalecane w ciąży. Chronią matkę i dziecko.
                  </p>
                </div>

                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2">Szczepienia PRZECIWWSKAZANE w ciąży:</h4>
                  <p className="text-sm text-red-700">
                    <strong>MMR, VZV</strong> - szczepionki żywe przeciwwskazane w ciąży.
                    Podać minimum 1 miesiąc przed planowaną ciążą.
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2">Nowe szczepienie RSV:</h4>
                  <p className="text-sm text-purple-700">
                    Szczepienie przeciwko RSV w 24-36 tc zapewnia ochronę noworodka
                    w pierwszych 6 miesiącach życia poprzez przeciwciała matczyńskie.
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Skróty i objaśnienia:</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
                  <div>
                    <ul className="space-y-1">
                      <li>• <strong>tc</strong> - tydzień ciąży</li>
                      <li>• <strong>IIV</strong> - szczepionka inaktywowana przeciwko grypie</li>
                      <li>• <strong>Tdap</strong> - tężec, błonica, krztusiec</li>
                    </ul>
                  </div>
                  <div>
                    <ul className="space-y-1">
                      <li>• <strong>MMR</strong> - odra, świnka, różyczka</li>
                      <li>• <strong>VZV</strong> - wirus ospy wietrznej</li>
                      <li>• <strong>RSV</strong> - syncytalny wirus oddechowy</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>



        {/* Important Information */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-amber-800 mb-4">Ważne informacje dla pacjentek</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-amber-800 mb-2">Planowanie ciąży:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-amber-700">
                <li>Sprawdź status szczepień przed poczęciem</li>
                <li>Szczepionki żywe minimum 1 miesiąc przed</li>
                <li>Kontrola tytru przeciwciał (różyczka, ospa)</li>
                <li>Konsultacja z ginekologiem</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-amber-800 mb-2">Podczas ciąży:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-amber-700">
                <li>Tylko szczepionki inaktywowane</li>
                <li>Tdap w każdej ciąży (27-36 tc)</li>
                <li>Grypa w każdym trymestrze</li>
                <li>RSV dla ochrony noworodka (24-36 tc)</li>
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
                <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-xs">PTG</span>
                </div>
                <span>Polskie Towarzystwo Ginekologów i Położników</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 text-center">
            <p className="text-sm text-gray-500 mb-1">
              <strong>Źródło:</strong> Program Szczepień Ochronnych | PTGiP | Ministerstwo Zdrowia
            </p>
            <p className="text-sm text-gray-500 mb-1">
              <strong>Aktualizacja:</strong> 2024 | <strong>Wersja:</strong> 5.1
            </p>
            <p className="text-xs text-gray-400">
              Konsultacje ginekologiczne zalecane | Informacje: gov.pl/szczepienia
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PregnancyVaccinationCalendar;