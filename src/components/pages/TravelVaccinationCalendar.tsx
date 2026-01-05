import React, { useState } from 'react';
import { Plane, Globe, MapPin } from 'lucide-react';

interface VaccinationSchedule {
  id: number;
  vaccine: string;
  description: string;
  category: 'routine' | 'travel';
  ageGroups: {
    '19-49': string;
    '50-65': string;
    '65+': string;
  };
}

const travelVaccinationSchedules: VaccinationSchedule[] = [
  // RUTYNOWE (jasnozielone paski)
  {
    id: 1,
    vaccine: 'Grypa (IIV)',
    description: '1 dawka co roku',
    category: 'routine',
    ageGroups: {
      '19-49': '1 dawka co roku',
      '50-65': '1 dawka co roku',
      '65+': '1 dawka co roku'
    }
  },
  {
    id: 2,
    vaccine: 'Błonica, tężec, krztuścowi (Tdap)',
    description: '1 dawka co 10 lat / 3 dawki w schemacie 0,1,6 miesiący (osoby nieszczepione)',
    category: 'routine',
    ageGroups: {
      '19-49': '1 dawka co 10 lat / 3 dawki w schemacie 0,1,6 miesiący',
      '50-65': '1 dawka co 10 lat / 3 dawki w schemacie 0,1,6 miesiący',
      '65+': '1 dawka co 10 lat / 3 dawki w schemacie 0,1,6 miesiący'
    }
  },
  {
    id: 3,
    vaccine: 'Odra (MMR)',
    description: '2 dawki w odstępie ≥4 tygodni (osoby, które nie chorowały na odrę i nie były szczepione)',
    category: 'routine',
    ageGroups: {
      '19-49': '2 dawki w odstępie ≥4 tygodni',
      '50-65': '2 dawki w odstępie ≥4 tygodni',
      '65+': '2 dawki w odstępie ≥4 tygodni'
    }
  },
  {
    id: 4,
    vaccine: 'Covid-19',
    description: 'Liczba dawek zależy od historii szczepień i aktualnych zaleceń',
    category: 'routine',
    ageGroups: {
      '19-49': 'Według aktualnych zaleceń',
      '50-65': 'Według aktualnych zaleceń',
      '65+': 'Według aktualnych zaleceń'
    }
  },
  {
    id: 5,
    vaccine: 'Wirusowemu zapaleniu wątroby typu B',
    description: '3 dawki (osoby wcześniej nieszczepione)',
    category: 'routine',
    ageGroups: {
      '19-49': '3 dawki (osoby nieszczepione)',
      '50-65': '3 dawki (osoby nieszczepione)',
      '65+': '3 dawki (osoby nieszczepione)'
    }
  },
  // SPECJALNE DLA PODRÓŻY (ciemnozielone paski)
  {
    id: 6,
    vaccine: 'Pneumokokom (PCV, PPSV)',
    description: '1 dawka PCV-15 lub PCV-20 / 1 dawka PCV-15 + 1 dawka PPSV-23',
    category: 'travel',
    ageGroups: {
      '19-49': '1 dawka PCV-15 lub PCV-20',
      '50-65': '1 dawka PCV-15 + 1 dawka PPSV-23',
      '65+': '1 dawka PCV-15 + 1 dawka PPSV-23'
    }
  },
  {
    id: 7,
    vaccine: 'Kleszowemu zapaleniu mózgu',
    description: '3 dawki + dawki przypominające co 3-5 lat (podróże do obszarów endemicznych)',
    category: 'travel',
    ageGroups: {
      '19-49': '3 dawki + dawki przypominające co 3-5 lat',
      '50-65': '3 dawki + dawki przypominające co 3-5 lat',
      '65+': '3 dawki + dawki przypominające co 3-5 lat'
    }
  },
  {
    id: 8,
    vaccine: 'Wirusowemu zapaleniu wątroby typu A',
    description: '2 dawki (osoby, które nie chorowały i nie były szczepione)',
    category: 'travel',
    ageGroups: {
      '19-49': '2 dawki (osoby nieszczepione)',
      '50-65': '2 dawki (osoby nieszczepione)',
      '65+': '2 dawki (osoby nieszczepione)'
    }
  },
  {
    id: 9,
    vaccine: 'Meningokokom (MenACWY)',
    description: '1 dawka',
    category: 'travel',
    ageGroups: {
      '19-49': '1 dawka',
      '50-65': '1 dawka',
      '65+': '1 dawka'
    }
  },
  {
    id: 10,
    vaccine: 'Żółtej gorączce',
    description: '1 dawka',
    category: 'travel',
    ageGroups: {
      '19-49': '1 dawka',
      '50-65': '1 dawka',
      '65+': '1 dawka'
    }
  },
  {
    id: 11,
    vaccine: 'Durowi brzusznemu',
    description: '1 dawka (szczepionka inaktywowana) lub 3 dawki (szczepionka żywa)',
    category: 'travel',
    ageGroups: {
      '19-49': '1 dawka (inaktyw.) lub 3 dawki (żywa)',
      '50-65': '1 dawka (inaktyw.) lub 3 dawki (żywa)',
      '65+': '1 dawka (inaktyw.) lub 3 dawki (żywa)'
    }
  },
  {
    id: 12,
    vaccine: 'Cholera',
    description: '2 dawki (szczepionka inaktywowana) lub 1 dawka (szczepionka żywa)',
    category: 'travel',
    ageGroups: {
      '19-49': '2 dawki (inaktyw.) lub 1 dawka (żywa)',
      '50-65': '2 dawki (inaktyw.) lub 1 dawka (żywa)',
      '65+': '2 dawki (inaktyw.) lub 1 dawka (żywa)'
    }
  },
  {
    id: 13,
    vaccine: 'Japońskiemu zapaleniu mózgu',
    description: '2 dawki',
    category: 'travel',
    ageGroups: {
      '19-49': '2 dawki',
      '50-65': '2 dawki',
      '65+': '2 dawki'
    }
  },
  {
    id: 14,
    vaccine: 'Wścieklizna',
    description: '2 lub 3 dawki',
    category: 'travel',
    ageGroups: {
      '19-49': '2 lub 3 dawki',
      '50-65': '2 lub 3 dawki',
      '65+': '2 lub 3 dawki'
    }
  }
];

const TravelVaccinationCalendar: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredSchedules = travelVaccinationSchedules.filter(schedule => 
    selectedCategory === 'all' || schedule.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#22C55E] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Plane className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Kalendarz szczepień w medycynie podróży</h1>
              <p className="text-green-100 mt-2">
                Szczepienia obowiązkowe i zalecane przed podróżami zagranicznymi - zgodne z PSO
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-green-100">
            <Globe className="w-4 h-4" />
            <span className="text-sm">Aktualizacja zgodna z Programem Szczepień Ochronnych</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <label className="text-sm font-medium text-gray-700">Filtruj według kategorii:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
            >
              <option value="all">Wszystkie szczepienia</option>
              <option value="routine">Rutynowe</option>
              <option value="travel">Specjalne dla podróży</option>
            </select>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Legenda</h3>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-300 rounded mr-3"></div>
              <span className="text-sm text-gray-700">Szczepienia rutynowe</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#22C55E] rounded mr-3"></div>
              <span className="text-sm text-gray-700">Szczepienia specjalne dla podróży</span>
            </div>
          </div>
        </div>

        {/* Vaccination Schedule Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-[#22C55E]" />
              Harmonogram szczepień ({filteredSchedules.length} pozycji)
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-[#22C55E] text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Szczepienia przeciw
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
                    19-49 lat
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
                    50-65 lat
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
                    ≥65 lat
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSchedules.map((schedule, index) => (
                  <tr key={schedule.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div 
                          className={`w-1 h-12 mr-4 rounded ${
                            schedule.category === 'routine' ? 'bg-green-300' : 'bg-[#22C55E]'
                          }`}
                        ></div>
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
                      {schedule.ageGroups['19-49']}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-700">
                      {schedule.ageGroups['50-65']}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-700">
                      {schedule.ageGroups['65+']}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-yellow-800 mb-4">Ważne informacje</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-yellow-800 mb-2">Przed podróżą:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700">
                <li>Skonsultuj się z lekarzem medycyny podróży 4-6 tygodni przed wyjazdem</li>
                <li>Sprawdź aktualne zalecenia dla kraju docelowego</li>
                <li>Uwzględnij trasę podróży i planowane aktywności</li>
                <li>Zweryfikuj ważność posiadanych szczepień</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-yellow-800 mb-2">Szczepienia obowiązkowe:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700">
                <li>Żółta gorączka - wymagana w niektórych krajach</li>
                <li>Meningokoki - dla pielgrzymki do Mekki</li>
                <li>Polio - dla podróży do krajów endemicznych</li>
                <li>Sprawdź aktualne wymagania na stronie WHO/CDC</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Źródło: Program Szczepień Ochronnych | Ostatnia aktualizacja: 2024</p>
        </div>
      </div>
    </div>
  );
};

export default TravelVaccinationCalendar;