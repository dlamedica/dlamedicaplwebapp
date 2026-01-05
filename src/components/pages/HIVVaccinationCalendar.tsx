import React, { useState } from 'react';
import { FileText, Info, ExternalLink, AlertTriangle, Shield } from 'lucide-react';

interface VaccinationSchedule {
  id: number;
  vaccine: string;
  scheme: string;
  description: string;
  hivSpecific: string;
  priority: 'critical' | 'high' | 'medium';
  contraindication?: string;
  cdCount?: string;
}

const hivVaccinationSchedules: VaccinationSchedule[] = [
  {
    id: 1,
    vaccine: 'Grypa (IIV)',
    scheme: '1 dawka co roku, w czasie sezonu infekcyjnego (najlepiej na początku sezonu)*',
    description: 'Najważniejsze szczepienie sezonowe dla pacjentów z HIV',
    hivSpecific: 'Tylko szczepionki inaktywowane - unikać LAIV',
    priority: 'critical',
    cdCount: 'Bezpieczne przy każdym poziomie CD4+'
  },
  {
    id: 2,
    vaccine: 'Covid-19',
    scheme: 'Liczba dawek zależy od historii szczepień i aktualnych zaleceń',
    description: 'Szczególnie ważne - dodatkowe dawki dla immunokompromitowanych',
    hivSpecific: 'Dodatkowe dawki rappipominające zalecane częściej',
    priority: 'critical',
    cdCount: 'Zalecane niezależnie od poziomu CD4+'
  },
  {
    id: 3,
    vaccine: 'Błonica, tężec, krztuścowi (Tdap)',
    scheme: '1 dawka co 10 lat (osoba zaszczepiona w przeszłości w schemacie podstawowym)',
    description: 'Szczepienie podstawowe - bezpieczne w HIV',
    hivSpecific: 'Standardowy schemat, może być potrzebna kontrola tytru',
    priority: 'medium',
    cdCount: 'Bezpieczne przy każdym poziomie CD4+'
  },
  {
    id: 4,
    vaccine: 'Pneumokokom (PCV, PPSV)',
    scheme: '1 dawka PCV-15 + 1 dawka PPSV-23 (w odstępie ≥8 tygodni) lub 1 dawka PCV-20',
    description: 'Kluczowe szczepienie - pneumokoki to częsta przyczyna zakażeń w HIV',
    hivSpecific: 'Może być potrzebna powtórna dawka PPSV-23 po 5 latach',
    priority: 'critical',
    cdCount: 'Najlepsze efekty gdy CD4+ >200'
  },
  {
    id: 5,
    vaccine: 'Meningokokom (MenB, MenACWY)',
    scheme: '2 dawki w odstępie 1 miesiąca (Bexsero), 2 dawki w odstępie 6 miesięcy lub 3 dawki w schemacie 0, 1, 6 miesiąca (Trumenba), MenACWY: co 5 lat dawka przypominająca',
    description: 'Ochrona przed inwazyjnymi zakażeniami meningokokowymi',
    hivSpecific: 'Dawki przypominające co 5 lat ze względu na obniżoną odporność',
    priority: 'high',
    cdCount: 'Zalecane przy CD4+ >200'
  },
  {
    id: 6,
    vaccine: 'HPV (HPV-2, HPV-9)',
    scheme: '3 dawki w schemacie 0, 1, 6 (HPV-2) 0, 2, 6 miesiąca (HPV-9)',
    description: 'Szczególnie ważne - zwiększone ryzyko nowotworów związanych z HPV w HIV',
    hivSpecific: 'Zalecane do 45 roku życia (rozszerzone wskazania)',
    priority: 'high',
    cdCount: 'Najlepsze efekty gdy CD4+ >200'
  },
  {
    id: 7,
    vaccine: 'Wirusowemu zapaleniu wątroby typu B',
    scheme: '3 dawki w schemacie 0, 1, 6 miesiący',
    description: 'Obowiązkowe szczepienie - współinfekcja HBV/HIV jest częsta',
    hivSpecific: 'Może być potrzebne zwiększenie dawek lub dodatkowe dawki',
    priority: 'critical',
    cdCount: 'Najlepsze efekty gdy CD4+ >350, ale szczepić niezależnie'
  },
  {
    id: 8,
    vaccine: 'Wirusowemu zapaleniu wątroby typu A',
    scheme: '2 dawki w odstępie 6-12 miesięcy',
    description: 'Ważne szczepienie - HAV może mieć cięższy przebieg w HIV',
    hivSpecific: 'Kontrola tytru przeciwciał po szczepieniu zalecana',
    priority: 'high',
    cdCount: 'Najlepsze efekty gdy CD4+ >200'
  },
  {
    id: 9,
    vaccine: 'Odra, świnka, różyczka (MMR)',
    scheme: '2 dawki w odstępie ≥4 tygodni (u osób, które nie chorowały na odrę lub różyczkę i nie były szczepione)',
    description: 'UWAGA: Szczepionka żywa - tylko przy wysokim CD4+',
    hivSpecific: 'Tylko gdy CD4+ >200 i niereplikujący się HIV',
    priority: 'medium',
    contraindication: 'Przeciwwskazana gdy CD4+ <200',
    cdCount: 'TYLKO gdy CD4+ >200'
  },
  {
    id: 10,
    vaccine: 'Ospa wietrzna',
    scheme: '2 dawki w odstępie ≥6 tygodni (u osób, które nie chorowały na ospę wietrzną)',
    description: 'UWAGA: Szczepionka żywa - tylko przy wysokim CD4+',
    hivSpecific: 'Tylko gdy CD4+ >200 i niereplikujący się HIV',
    priority: 'medium',
    contraindication: 'Przeciwwskazana gdy CD4+ <200',
    cdCount: 'TYLKO gdy CD4+ >200'
  },
  {
    id: 11,
    vaccine: 'Półpaścowi (RZV)',
    scheme: '2 dawki w odstępie 2-6 miesięcy',
    description: 'Szczepionka inaktywowana - bezpieczna w HIV',
    hivSpecific: 'Zwiększone ryzyko półpaśca w HIV - szczepienie szczególnie zalecane',
    priority: 'high',
    cdCount: 'Bezpieczne przy każdym poziomie CD4+'
  },
  {
    id: 12,
    vaccine: 'Syncytalnemu wirusowi oddechowemu (RSV)',
    scheme: '1 dawka u osób w wieku ≥ 60 lat',
    description: 'Dla starszych pacjentów z HIV',
    hivSpecific: 'RSV może mieć cięższy przebieg u pacjentów z HIV',
    priority: 'medium',
    cdCount: 'Zalecane przy CD4+ >200'
  }
];


const HIVVaccinationCalendar: React.FC = () => {

  const [showFootnotes, setShowFootnotes] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const filteredSchedules = hivVaccinationSchedules.filter(schedule =>
    filterPriority === 'all' || schedule.priority === filterPriority
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'critical': return 'KRYTYCZNE';
      case 'high': return 'WYSOKI PRIORYTET';
      case 'medium': return 'ŚREDNI PRIORYTET';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#14B8A6] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold uppercase leading-tight">
                KALENDARZ SZCZEPIEŃ DOROSŁYCH
              </h1>
              <h2 className="text-xl md:text-2xl font-bold uppercase text-teal-200 leading-tight">
                PACJENCI ZAKAŻENI HIV
              </h2>
              <p className="text-teal-200 mt-2 text-sm md:text-base">
                Szczepienia dla osób żyjących z HIV - dostosowane do stanu immunologicznego
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-teal-200">
            <Shield className="w-4 h-4" />
            <span className="text-sm">Zgodne z zaleceniami PTNAIDS i wytycznymi międzynarodowymi</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* HIV-specific Alert */}
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Shield className="w-4 h-4 text-teal-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-teal-800">WAŻNE INFORMACJE DLA PACJENTÓW Z HIV</h3>
              <p className="text-sm text-teal-700 mt-1">
                Szczepienia są szczególnie ważne u osób z HIV, ale ich skuteczność zależy od stanu immunologicznego (CD4+).
                Szczepionki żywe są przeciwwskazane przy CD4+ &lt;200.
              </p>
            </div>
          </div>
        </div>

        {/* CD4+ Guide */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-[#14B8A6]" />
            Przewodnik szczepień według poziomu CD4+
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">CD4+ &gt;350</h4>
              <p className="text-sm text-green-700">
                <strong>Optymalne warunki</strong><br />
                Wszystkie szczepienia (inaktywowane i żywe), najlepsza odpowiedź immunologiczna
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">CD4+ 200-350</h4>
              <p className="text-sm text-yellow-700">
                <strong>Ostrożnie z żywymi</strong><br />
                Szczepionki żywe tylko przy niereplikującym się HIV i stabilnym stanie
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-800 mb-2">CD4+ &lt;200</h4>
              <p className="text-sm text-red-700">
                <strong>Tylko inaktywowane</strong><br />
                Szczepionki żywe przeciwwskazane, słabsza odpowiedź na wszystkie szczepienia
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
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent"
            >
              <option value="all">Wszystkie szczepienia</option>
              <option value="critical">Krytyczne</option>
              <option value="high">Wysoki priorytet</option>
              <option value="medium">Średni priorytet</option>
            </select>
          </div>
        </div>

        {/* Main Vaccination Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-[#14B8A6]" />
              Harmonogram szczepień ({filteredSchedules.length} pozycji)
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Szczepienia dostosowane do stanu immunologicznego pacjentów z HIV
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-[#14B8A6] text-white">
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
                        <div className="w-1 h-16 mr-4 rounded bg-teal-500 flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-900">
                            {schedule.vaccine}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 mb-2">
                            {schedule.description}
                          </div>
                          <div className="text-xs text-gray-600 mb-2 bg-teal-50 p-2 rounded">
                            <strong>Specyfika HIV:</strong> {schedule.hivSpecific}
                          </div>
                          {schedule.cdCount && (
                            <div className="text-xs text-blue-600 mb-2 bg-blue-50 p-2 rounded">
                              <strong>CD4+:</strong> {schedule.cdCount}
                            </div>
                          )}
                          {schedule.contraindication && (
                            <div className="text-xs text-red-600 mb-2 bg-red-50 p-2 rounded">
                              ⚠️ {schedule.contraindication}
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
                <Info className="w-5 h-5 mr-2 text-[#14B8A6]" />
                Szczegółowe informacje o szczepieniach w HIV
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
                  <h4 className="font-semibold text-gray-900 mb-3">Szczególne zagrożenia w HIV:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• <strong>Zakażenia oportunistyczne</strong></li>
                    <li>• Cięższy przebieg infekcji wirusowych</li>
                    <li>• Zwiększone ryzyko nowotworów związanych z HPV</li>
                    <li>• Częstsze zakażenia pneumokokowe</li>
                    <li>• Reaktywacja półpaśca</li>
                    <li>• Współinfekcje HBV/HCV</li>
                    <li>• Słabsza odpowiedź na szczepienia</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Zasady szczepień w HIV:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Szczepionki inaktywowane są bezpieczne</li>
                    <li>• Szczepionki żywe tylko przy CD4+ &gt;200</li>
                    <li>• Kontrola tytru przeciwciał po szczepieniu</li>
                    <li>• Dodatkowe dawki przy słabej odpowiedzi</li>
                    <li>• Najlepsza skuteczność przy niereplikującym HIV</li>
                    <li>• Kontynuacja terapii antyretrowirusowej</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2">*Szczepienia KRYTYCZNE w HIV:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                    <li><strong>Grypa</strong> - tylko szczepionki inaktywowane (IIV), unikać LAIV</li>
                    <li><strong>COVID-19</strong> - dodatkowe dawki dla immunokompromitowanych</li>
                    <li><strong>Pneumokoki</strong> - zwiększone dawki, kontrola po 5 latach</li>
                    <li><strong>Hepatitis B</strong> - może być potrzebne zwiększenie dawek</li>
                  </ul>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-800 mb-2">Szczepienia o wysokim priorytecie:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-orange-700">
                    <li><strong>HPV</strong> - rozszerzone wskazania do 45 roku życia</li>
                    <li><strong>Hepatitis A</strong> - kontrola tytru po szczepieniu</li>
                    <li><strong>Półpasiec (RZV)</strong> - inaktywowana, bezpieczna</li>
                    <li><strong>Meningokoki</strong> - dawki przypominające co 5 lat</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">Szczepionki żywe - UWAGA:</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-yellow-700">
                    <div>
                      <p className="font-medium mb-2">Przeciwwskazane gdy:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>CD4+ &lt;200</li>
                        <li>Replikujący się HIV</li>
                        <li>Objawy kliniczne AIDS</li>
                        <li>Ciężka immunosupresja</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium mb-2">Można rozważyć gdy:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>CD4+ &gt;200 i stabilne</li>
                        <li>Niereplikujący się HIV</li>
                        <li>Dobry stan kliniczny</li>
                        <li>Skuteczna terapia ART</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Monitorowanie skuteczności:</h4>
                  <div className="text-sm text-blue-700">
                    <p className="mb-2">Kontrola tytru przeciwciał po szczepieniu jest szczególnie ważna u pacjentów z HIV:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>HBsAb po szczepieniu przeciwko HBV</li>
                      <li>Anti-HAV po szczepieniu przeciwko HAV</li>
                      <li>Tytr przeciwko pneumokokom</li>
                      <li>W przypadku braku odpowiedzi - rozważ dodatkowe dawki</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Interakcje z terapią antyretrowirusową:</h4>
                <p className="text-sm text-gray-700">
                  Nie ma przeciwwskazań do szczepień podczas terapii antyretrowirusowej.
                  Nie przerywaj ART przed szczepieniami. Najlepsza odpowiedź na szczepienia występuje
                  przy niereplikującym się HIV i wysokim CD4+.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Important Information */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-amber-800 mb-4">Ważne informacje dla osób żyjących z HIV</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-amber-800 mb-2">Przed szczepieniem:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-amber-700">
                <li>Sprawdź aktualny poziom CD4+</li>
                <li>Potwierdź niereplikujący się HIV</li>
                <li>Poinformuj o terapii antyretrowirusowej</li>
                <li>Skonsultuj się z lekarzem HIV/AIDS</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-amber-800 mb-2">Po szczepieniu:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-amber-700">
                <li>Kontynuuj terapię antyretrowirusową</li>
                <li>Monitoruj odpowiedź immunologiczną</li>
                <li>Zgłaszaj nietypowe objawy</li>
                <li>Regularne kontrole poziomu CD4+</li>
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
                <div className="w-8 h-8 bg-teal-100 rounded flex items-center justify-center">
                  <span className="text-teal-600 font-bold text-xs">PTNAIDS</span>
                </div>
                <span>Polskie Towarzystwo Naukowe AIDS</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 text-center">
            <p className="text-sm text-gray-500 mb-1">
              <strong>Źródło:</strong> Program Szczepień Ochronnych | PTNAIDS | WHO/CDC Guidelines
            </p>
            <p className="text-sm text-gray-500 mb-1">
              <strong>Aktualizacja:</strong> 2024 | <strong>Wersja:</strong> 6.2
            </p>
            <p className="text-xs text-gray-400">
              Konsultacje HIV/AIDS obowiązkowe | Informacje: ptnaids.pl | gov.pl/szczepienia
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HIVVaccinationCalendar;