import React, { useState } from 'react';
import { Heart, FileText, Info, ExternalLink, Activity } from 'lucide-react';

interface VaccinationSchedule {
  id: number;
  vaccine: string;
  scheme: string;
  description: string;
  cardiacRisk: string;
  priority: 'high' | 'medium' | 'standard';
}

const cardiologyVaccinationSchedules: VaccinationSchedule[] = [
  {
    id: 1,
    vaccine: 'Grypa (IIV)',
    scheme: '1 dawka co roku, w czasie sezonu infekcyjnego (najlepiej na początku sezonu)*',
    description: 'Szczepienie priorytetowe - zmniejsza ryzyko zawału serca i udaru',
    cardiacRisk: 'Grypa zwiększa ryzyko zawału o 600% w pierwszym tygodniu choroby',
    priority: 'high'
  },
  {
    id: 2,
    vaccine: 'Pneumokokom (PCV, PPSV)',
    scheme: '1 dawka PCV-15 + PPSV-23 (z zachowaniem odstępu ≥8 tygodni) lub 1 dawka PCV-20',
    description: 'Ochrona przed zakażeniami pneumokokowymi - ważna u pacjentów kardiologicznych',
    cardiacRisk: 'Zakażenia pneumokokowe mogą prowadzić do zapalenia mięśnia sercowego',
    priority: 'high'
  },
  {
    id: 3,
    vaccine: 'Błonica, tężec, krztuścowi (Tdap)',
    scheme: '1 dawka co 10 lat',
    description: 'Szczepienie podstawowe - bezpieczne u pacjentów z chorobami serca',
    cardiacRisk: 'Rutynowe szczepienie bez dodatkowych przeciwwskazań kardiologicznych',
    priority: 'medium'
  },
  {
    id: 4,
    vaccine: 'Covid-19',
    scheme: 'Liczba dawek zależy od historii szczepień i aktualnych zaleceń',
    description: 'Szczególnie ważne - COVID-19 znacznie zwiększa ryzyko sercowo-naczyniowe',
    cardiacRisk: 'COVID-19 zwiększa ryzyko zawału, udaru i zapalenia mięśnia sercowego',
    priority: 'high'
  },
  {
    id: 5,
    vaccine: 'Syncytalnemu wirusowi oddechowemu (RSV)',
    scheme: '1 dawka u osób w wieku ≥60 lat',
    description: 'Ochrona przed RSV u starszych pacjentów z chorobami serca',
    cardiacRisk: 'RSV może prowadzić do zaostrzenia niewydolności serca',
    priority: 'standard'
  },
  {
    id: 6,
    vaccine: 'Półpaścowi (RZV)',
    scheme: '2 dawki w odstępie 2-6 miesięcy',
    description: 'Szczepienie przeciwko półpaścowi dla pacjentów ≥50 lat',
    cardiacRisk: 'Półpasiec może być czynnikiem ryzyka udaru mózgu',
    priority: 'standard'
  }
];


const CardiologyVaccinationCalendar: React.FC = () => {

  const [showFootnotes, setShowFootnotes] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const filteredSchedules = cardiologyVaccinationSchedules.filter(schedule =>
    filterPriority === 'all' || schedule.priority === filterPriority
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'standard': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'WYSOKI PRIORYTET';
      case 'medium': return 'ŚREDNI PRIORYTET';
      case 'standard': return 'STANDARDOWY';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#DC2626] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold uppercase leading-tight">
                KALENDARZ SZCZEPIEŃ DOROSŁYCH
              </h1>
              <h2 className="text-xl md:text-2xl font-bold uppercase text-red-200 leading-tight">
                PACJENCI Z CHOROBAMI UKŁADU SERCOWO-NACZYNIOWEGO
              </h2>
              <p className="text-red-200 mt-2 text-sm md:text-base">
                Szczepienia dla pacjentów z chorobą niedokrwienną serca, niewydolnością serca, nadciśnieniem
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-red-200">
            <Activity className="w-4 h-4" />
            <span className="text-sm">Zgodne z zaleceniami Polskiego Towarzystwa Kardiologicznego</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Cardiac Risk Alert */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Heart className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-red-800">WAŻNE INFORMACJE KARDIOLOGICZNE</h3>
              <p className="text-sm text-red-700 mt-1">
                Szczepienia przeciwko grypie i COVID-19 znacząco zmniejszają ryzyko zawału serca,
                udaru mózgu i hospitalizacji u pacjentów z chorobami sercowo-naczyniowymi.
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
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DC2626] focus:border-transparent"
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
              <Heart className="w-5 h-5 mr-2 text-[#DC2626]" />
              Harmonogram szczepień ({filteredSchedules.length} pozycji)
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Szczepienia zalecane dla pacjentów z chorobami układu sercowo-naczyniowego
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-[#DC2626] text-white">
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
                        <div className="w-1 h-16 mr-4 rounded bg-red-600 flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-900">
                            {schedule.vaccine}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 mb-2">
                            {schedule.description}
                          </div>
                          <div className="text-xs text-gray-600 mb-2 bg-red-50 p-2 rounded">
                            <strong>Ryzyko kardiologiczne:</strong> {schedule.cardiacRisk}
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
                <Info className="w-5 h-5 mr-2 text-[#DC2626]" />
                Szczegółowe informacje kardiologiczne
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
                  <h4 className="font-semibold text-gray-900 mb-3">Choroby sercowo-naczyniowe objęte:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Choroba niedokrwienna serca (ChNS)</li>
                    <li>• Niewydolność serca</li>
                    <li>• Nadciśnienie tętnicze</li>
                    <li>• Zaburzenia rytmu serca</li>
                    <li>• Choroba naczyń obwodowych</li>
                    <li>• Przebyty zawał serca</li>
                    <li>• Przebyty udar mózgu</li>
                    <li>• Kardiomiopatia</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Korzyści szczepień w kardiologii:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Zmniejszenie ryzyka zawału serca o 36%</li>
                    <li>• Zmniejszenie ryzyka udaru mózgu o 23%</li>
                    <li>• Redukcja hospitalizacji z powodu niewydolności serca</li>
                    <li>• Mniejsze ryzyko zapalenia mięśnia sercowego</li>
                    <li>• Stabilizacja stanu kardiologicznego</li>
                    <li>• Zmniejszenie śmiertelności ogólnej</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2">*Szczepienia przeciwko grypie - dowody naukowe:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                    <li>Zmniejszają ryzyko zawału serca o 36% w ciągu roku po szczepieniu</li>
                    <li>Redukcja ryzyka udaru mózgu o 23%</li>
                    <li>50% mniejsze ryzyko hospitalizacji z powodu niewydolności serca</li>
                    <li>Grypa zwiększa ryzyko zawału o 600% w pierwszym tygodniu choroby</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Szczepienia przeciwko COVID-19:</h4>
                  <p className="text-sm text-blue-700">
                    COVID-19 może powodować zapalenie mięśnia sercowego, zawał serca, zaburzenia rytmu i zakrzepicę.
                    Szczepienie znacząco zmniejsza te ryzyka u pacjentów kardiologicznych.
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Szczepienia przeciwko pneumokokom:</h4>
                  <p className="text-sm text-green-700">
                    Zakażenia pneumokokowe mogą prowadzić do zapalenia osierdzia i mięśnia sercowego.
                    U pacjentów z niewydolnością serca zwiększają ryzyko dekompensacji.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Przeciwwskazania w kardiologii:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  <li>Ostra faza zawału serca (odłożyć do stabilizacji)</li>
                  <li>Niestabilna choroba niedokrwienna serca</li>
                  <li>Ostry epizod niewydolności serca</li>
                  <li>Gorączka powyżej 38°C</li>
                  <li>Nie ma przeciwwskazań związanych z przyjmowanymi lekami kardiologicznymi</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Important Information */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-amber-800 mb-4">Ważne informacje dla pacjentów kardiologicznych</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-amber-800 mb-2">Przed szczepieniem:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-amber-700">
                <li>Poinformuj o chorobie serca i przyjmowanych lekach</li>
                <li>Sprawdź stabilność stanu kardiologicznego</li>
                <li>Szczep się po ustąpieniu ostrej fazy choroby</li>
                <li>Skonsultuj z kardiologiem jeśli masz wątpliwości</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-amber-800 mb-2">Szczególne zalecenia:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-amber-700">
                <li>Grypa i COVID-19 to szczepienia najważniejsze</li>
                <li>Kontynuuj przyjmowanie leków kardiologicznych</li>
                <li>Nie przerywaj terapii przeciwpłytkowej</li>
                <li>Monitoruj parametry życiowe po szczepieniu</li>
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
                  <span className="text-red-600 font-bold text-xs">PTK</span>
                </div>
                <span>Polskie Towarzystwo Kardiologiczne</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 text-center">
            <p className="text-sm text-gray-500 mb-1">
              <strong>Źródło:</strong> Program Szczepień Ochronnych | PTK | Ministerstwo Zdrowia
            </p>
            <p className="text-sm text-gray-500 mb-1">
              <strong>Aktualizacja:</strong> 2024 | <strong>Wersja:</strong> 4.3
            </p>
            <p className="text-xs text-gray-400">
              Konsultacje kardiologiczne zalecane | Informacje: ptk.viamedica.pl
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardiologyVaccinationCalendar;