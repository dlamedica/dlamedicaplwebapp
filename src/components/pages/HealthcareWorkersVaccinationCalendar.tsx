import React, { useState } from 'react';
import { Stethoscope, FileText, Info, ExternalLink, UserCheck } from 'lucide-react';

interface VaccinationSchedule {
  id: number;
  vaccine: string;
  scheme: string;
  description: string;
  priority: 'mandatory' | 'recommended' | 'conditional';
  occupationalRisk: string;
}

const healthcareVaccinationSchedules: VaccinationSchedule[] = [
  {
    id: 1,
    vaccine: 'Wirusowemu zapaleniu wątroby typu B (HBV)',
    scheme: '3 dawki (osoby, które nie były wcześniej szczepione)',
    description: 'Obowiązkowe szczepienie dla wszystkich pracowników ochrony zdrowia',
    priority: 'mandatory',
    occupationalRisk: 'Wysokie ryzyko ekspozycji na krew i płyny ustrojowe'
  },
  {
    id: 2,
    vaccine: 'Grypa (IIV)',
    scheme: '1 dawka co roku, w czasie sezonu infekcyjnego (najlepiej na początku sezonu)',
    description: 'Ochrona personelu i pacjentów przed zakażeniami grypowymi',
    priority: 'mandatory',
    occupationalRisk: 'Ochrona własna i pacjentów'
  },
  {
    id: 3,
    vaccine: 'Covid-19',
    scheme: 'Liczba dawek zależy od historii szczepień i aktualnych zaleceń',
    description: 'Szczepienie przeciwko SARS-CoV-2 - priorytet dla personelu medycznego',
    priority: 'mandatory',
    occupationalRisk: 'Wysokie ryzyko zakażenia i transmisji'
  },
  {
    id: 4,
    vaccine: 'Odra, świnka, różyczka (MMR)',
    scheme: '2 dawki (osoby, które nie chorowały na odrę lub różyczkę i nie były szczepione)',
    description: 'Ochrona przed chorobami wysokozakaźnymi',
    priority: 'recommended',
    occupationalRisk: 'Ryzyko zakażenia w środowisku szpitalnym'
  },
  {
    id: 5,
    vaccine: 'Ospa wietrzna (VZV)',
    scheme: '2 dawki (osoby, które nie chorowały na ospę wietrzną i nie były szczepione)',
    description: 'Szczególnie ważne dla personelu oddziałów pediatrycznych',
    priority: 'recommended',
    occupationalRisk: 'Ryzyko zakażenia i transmisji na pacjentów'
  },
  {
    id: 6,
    vaccine: 'Błonica, tężec, krztuścowi (Tdap)',
    scheme: '1 dawka co 10 lat',
    description: 'Szczepienie podstawowe - przypomnienia regularne',
    priority: 'recommended',
    occupationalRisk: 'Ryzyko zakażenia krztuścem i transmisji'
  },
  {
    id: 7,
    vaccine: 'Meningokoki (MenB, MenACWY)',
    scheme: '1 lub 2 dawki',
    description: 'Zalecane dla personelu laboratoriów i oddziałów zakaźnych',
    priority: 'conditional',
    occupationalRisk: 'Specyficzne ekspozycje zawodowe'
  }
];


const HealthcareWorkersVaccinationCalendar: React.FC = () => {

  const [showFootnotes, setShowFootnotes] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const filteredSchedules = healthcareVaccinationSchedules.filter(schedule =>
    filterPriority === 'all' || schedule.priority === filterPriority
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'mandatory': return 'bg-red-100 text-red-800 border-red-200';
      case 'recommended': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'conditional': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'mandatory': return 'OBOWIĄZKOWE';
      case 'recommended': return 'ZALECANE';
      case 'conditional': return 'WARUNKOWE';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#3B82F6] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold uppercase leading-tight">
                KALENDARZ SZCZEPIEŃ DOROSŁYCH
              </h1>
              <h2 className="text-xl md:text-2xl font-bold uppercase text-blue-200 leading-tight">
                PRACOWNICY OCHRONY ZDROWIA
              </h2>
              <p className="text-blue-200 mt-2 text-sm md:text-base">
                Szczepienia obowiązkowe i zalecane dla personelu medycznego i pracowników służby zdrowia
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-blue-200">
            <UserCheck className="w-4 h-4" />
            <span className="text-sm">Zgodne z Rozporządzeniem w sprawie szczepień ochronnych</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Legal requirement notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <UserCheck className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-blue-800">OBOWIĄZEK PRAWNY</h3>
              <p className="text-sm text-blue-700 mt-1">
                Zgodnie z Rozporządzeniem Ministra Zdrowia, pracodawcy w ochronie zdrowia są zobowiązani
                zapewnić pracownikom szczepienia ochronne zgodnie z narażeniem zawodowym.
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <label className="text-sm font-medium text-gray-700">Filtruj według kategorii:</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
            >
              <option value="all">Wszystkie szczepienia</option>
              <option value="mandatory">Obowiązkowe</option>
              <option value="recommended">Zalecane</option>
              <option value="conditional">Warunkowe</option>
            </select>
          </div>
        </div>

        {/* Main Vaccination Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <Stethoscope className="w-5 h-5 mr-2 text-[#3B82F6]" />
              Harmonogram szczepień ({filteredSchedules.length} pozycji)
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Szczepienia dla pracowników ochrony zdrowia zgodnie z narażeniem zawodowym
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-[#3B82F6] text-white">
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
                        <div className="w-1 h-16 mr-4 rounded bg-blue-500 flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-900">
                            {schedule.vaccine}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 mb-2">
                            {schedule.description}
                          </div>
                          <div className="text-xs text-gray-600 mb-2 bg-gray-50 p-2 rounded">
                            <strong>Ryzyko zawodowe:</strong> {schedule.occupationalRisk}
                          </div>
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
                <Info className="w-5 h-5 mr-2 text-[#3B82F6]" />
                Szczegółowe informacje i regulacje prawne
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
                  <h4 className="font-semibold text-gray-900 mb-3">Grupy zawodowe objęte kalendarzem:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Lekarze wszystkich specjalności</li>
                    <li>• Pielęgniarki i położne</li>
                    <li>• Ratownicy medyczni</li>
                    <li>• Laboranci medyczni</li>
                    <li>• Fizjoterapeuci</li>
                    <li>• Farmaceuci szpitalni</li>
                    <li>• Personel pomocniczy (sanitariusze, salowe)</li>
                    <li>• Pracownicy administracyjni w kontakcie z pacjentami</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Podstawy prawne:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Rozporządzenie MZ w sprawie szczepień ochronnych</li>
                    <li>• Ustawa o zapobieganiu oraz zwalczaniu zakażeń</li>
                    <li>• Kodeks pracy - BHP</li>
                    <li>• Rozporządzenie w sprawie służby medycyny pracy</li>
                    <li>• Wytyczne sanitarne GIS</li>
                    <li>• Zalecenia towarzystw naukowych</li>
                  </ul>
                </div>
              </div>

              <div class="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2">Szczepienia OBOWIĄZKOWE:</h4>
                  <p className="text-sm text-red-700">
                    <strong>HBV, Grypa, COVID-19</strong> - pracodawca ma obowiązek zapewnić i sfinansować.
                    Pracownik może odmówić, ale pracodawca ma prawo nie dopuścić do pracy przy narażeniu.
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Szczepienia ZALECANE:</h4>
                  <p className="text-sm text-blue-700">
                    <strong>MMR, VZV, Tdap</strong> - silnie zalecane, szczególnie dla personelu oddziałów
                    pediatrycznych, ginekologiczno-położniczych i zakaźnych.
                  </p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">Szczepienia WARUNKOWE:</h4>
                  <p className="text-sm text-yellow-700">
                    <strong>Meningokoki</strong> - zalecane dla pracowników laboratoriów mikrobiologicznych,
                    oddziałów zakaźnych, intensywnej terapii.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Dokumentacja szczepień:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  <li>Prowadzenie indywidualnych kart szczepień</li>
                  <li>Rejestr szczepień w dokumentacji medycyny pracy</li>
                  <li>Kontrola tytru przeciwciał (HBV, MMR, VZV)</li>
                  <li>Raportowanie do organów nadzoru</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Important Information */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-amber-800 mb-4">Ważne informacje dla pracodawców i pracowników</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-amber-800 mb-2">Obowiązki pracodawcy:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-amber-700">
                <li>Zapewnienie szczepień obowiązkowych</li>
                <li>Sfinansowanie szczepień i badań</li>
                <li>Prowadzenie dokumentacji szczepień</li>
                <li>Organizacja badań medycyny pracy</li>
                <li>Zapewnienie czasu na szczepienia</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-amber-800 mb-2">Prawa i obowiązki pracownika:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-amber-700">
                <li>Prawo do bezpłatnych szczepień obowiązkowych</li>
                <li>Obowiązek poddania się badaniom medycyny pracy</li>
                <li>Prawo odmowy szczepienia (z konsekwencjami)</li>
                <li>Obowiązek zgłaszania ekspozycji zawodowej</li>
                <li>Prawo do urlopu na szczepienia</li>
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
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-xs">PIP</span>
                </div>
                <span>Państwowa Inspekcja Pracy</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 text-center">
            <p className="text-sm text-gray-500 mb-1">
              <strong>Źródło:</strong> Rozporządzenie MZ w sprawie szczepień ochronnych | Program Szczepień Ochronnych
            </p>
            <p className="text-sm text-gray-500 mb-1">
              <strong>Aktualizacja:</strong> 2024 | <strong>Wersja:</strong> 4.2
            </p>
            <p className="text-xs text-gray-400">
              Informacje prawne: gov.pl/szczepienia | Medycyna pracy: imp.lodz.pl
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthcareWorkersVaccinationCalendar;