import React, { useState } from 'react';
import { Info, X, Users } from 'lucide-react';

interface VaccineInfo {
  name: string;
  fullName: string;
  description: string;
  dosage: string;
  sideEffects?: string;
  contraindications?: string;
}

interface VaccinationData {
  vaccine: string;
  fullName: string;
  schedule: {
    [key: string]: boolean | 'recommended' | 'special' | 'partial';
  };
  color: 'orange' | 'gray';
  info: VaccineInfo;
}

const VaccinationCalendarAdults: React.FC = () => {
  const [selectedVaccine, setSelectedVaccine] = useState<VaccineInfo | null>(null);
  const [showModal, setShowModal] = useState(false);

  const ageGroups = [
    '19-26 lat',
    '27-49 lat',
    '50-59 lat',
    '60-64 lata',
    '≥65 lat'
  ];

  const vaccinations: VaccinationData[] = [
    {
      vaccine: 'IIV',
      fullName: 'Grypa',
      schedule: {
        '19-26 lat': 'recommended',
        '27-49 lat': 'recommended',
        '50-59 lat': 'recommended',
        '60-64 lata': 'recommended',
        '≥65 lat': 'recommended'
      },
      color: 'orange',
      info: {
        name: 'IIV',
        fullName: 'Szczepionka przeciw grypie',
        description: 'Szczepionka przeciw grypie zalecana corocznie dla wszystkich dorosłych.',
        dosage: 'Co roku, najlepiej przed sezonem grypowym (wrzesień-listopad)',
        sideEffects: 'Ból w miejscu wstrzyknięcia, niewielka gorączka, ból mięśni',
        contraindications: 'Ciężka reakcja alergiczna na poprzednią dawkę, alergia na białko jaja (dla niektórych szczepionek)'
      }
    },
    {
      vaccine: 'Tdap/Td',
      fullName: 'Błonica, tężec, krztusiec',
      schedule: {
        '19-26 lat': 'recommended',
        '27-49 lat': 'recommended',
        '50-59 lat': 'recommended',
        '60-64 lata': 'recommended',
        '≥65 lat': 'recommended'
      },
      color: 'orange',
      info: {
        name: 'Tdap/Td',
        fullName: 'Szczepionka przeciw błonicy, tężcowi i krztuścowi',
        description: 'Szczepienie przypominające co 10 lat dla wszystkich dorosłych.',
        dosage: '1 dawka Tdap, potem Td co 10 lat',
        sideEffects: 'Ból i obrzęk w miejscu wstrzyknięcia, gorączka, ból głowy',
        contraindications: 'Ciężka reakcja alergiczna na poprzednią dawkę, encefalopatia w ciągu 7 dni po poprzedniej dawce'
      }
    },
    {
      vaccine: 'VZV',
      fullName: 'Ospa wietrzna',
      schedule: {
        '19-26 lat': 'recommended',
        '27-49 lat': 'recommended',
        '50-59 lat': 'recommended',
        '60-64 lata': 'recommended',
        '≥65 lat': 'recommended'
      },
      color: 'orange',
      info: {
        name: 'VZV',
        fullName: 'Szczepionka przeciw ospie wietrznej',
        description: 'Dla osób, które nie chorowały na ospę wietrzną i nie były szczepione.',
        dosage: '2 dawki w odstępie 4-8 tygodni',
        sideEffects: 'Ból w miejscu wstrzyknięcia, gorączka, wysypka',
        contraindications: 'Ciąża, niedobory odporności, stosowanie leków immunosupresyjnych'
      }
    },
    {
      vaccine: 'MMR',
      fullName: 'Odra, świnka, różyczka',
      schedule: {
        '19-26 lat': 'recommended',
        '27-49 lat': 'recommended',
        '50-59 lat': 'recommended',
        '60-64 lata': 'recommended',
        '≥65 lat': 'recommended'
      },
      color: 'orange',
      info: {
        name: 'MMR',
        fullName: 'Szczepionka przeciw odrze, śwince i różyczce',
        description: 'Dla osób urodzonych po 1957 roku, które nie były szczepione lub nie chorowały.',
        dosage: '1 lub 2 dawki w zależności od wskazań',
        sideEffects: 'Gorączka, wysypka, obrzęk ślinianek',
        contraindications: 'Ciąża, niedobory odporności, alergia na neomycynę'
      }
    },
    {
      vaccine: 'HPV',
      fullName: 'Wirus brodawczaka ludzkiego',
      schedule: {
        '19-26 lat': 'recommended'
      },
      color: 'orange',
      info: {
        name: 'HPV',
        fullName: 'Szczepionka przeciw wirusowi brodawczaka ludzkiego',
        description: 'Zalecana do 26. roku życia dla kobiet i mężczyzn.',
        dosage: '3 dawki (0, 1-2, 6 miesięcy)',
        sideEffects: 'Ból w miejscu wstrzyknięcia, ból głowy, zmęczenie',
        contraindications: 'Ciąża, ciężka reakcja alergiczna na poprzednią dawkę'
      }
    },
    {
      vaccine: 'COVID-19',
      fullName: 'COVID-19',
      schedule: {
        '19-26 lat': 'recommended',
        '27-49 lat': 'recommended',
        '50-59 lat': 'recommended',
        '60-64 lata': 'recommended',
        '≥65 lat': 'recommended'
      },
      color: 'orange',
      info: {
        name: 'COVID-19',
        fullName: 'Szczepionka przeciw COVID-19',
        description: 'Szczepienie podstawowe i dawki przypominające przeciwko COVID-19.',
        dosage: 'Schemat podstawowy + dawki przypominające według aktualnych zaleceń',
        sideEffects: 'Ból w miejscu wstrzyknięcia, zmęczenie, ból głowy, gorączka',
        contraindications: 'Ciężka reakcja alergiczna na składniki szczepionki'
      }
    },
    {
      vaccine: 'HBV',
      fullName: 'Wirusowe zapalenie wątroby typu B',
      schedule: {
        '19-26 lat': 'recommended',
        '27-49 lat': 'recommended',
        '50-59 lat': 'recommended',
        '60-64 lata': 'recommended',
        '≥65 lat': 'recommended'
      },
      color: 'orange',
      info: {
        name: 'HBV',
        fullName: 'Szczepionka przeciw WZW typu B',
        description: 'Dla osób z grup ryzyka, pracowników medycznych, osób z przewlekłymi chorobami.',
        dosage: '3 dawki (0, 1, 6 miesięcy)',
        sideEffects: 'Ból w miejscu wstrzyknięcia, zmęczenie',
        contraindications: 'Ciężka reakcja alergiczna na drożdże lub poprzednią dawkę'
      }
    },
    {
      vaccine: 'Wścieklizna',
      fullName: 'Wścieklizna',
      schedule: {
        '19-26 lat': 'partial',
        '27-49 lat': 'partial',
        '50-59 lat': 'partial',
        '60-64 lata': 'partial',
        '≥65 lat': 'partial'
      },
      color: 'orange',
      info: {
        name: 'Wścieklizna',
        fullName: 'Szczepionka przeciw wściekliźnie',
        description: 'Szczepienie przed- lub poekspozycyjne.',
        dosage: '4 dawki w przypadku ekspozycji, 3 dawki przed ekspozycją',
        sideEffects: 'Ból w miejscu wstrzyknięcia, ból głowy, nudności',
        contraindications: 'Brak przeciwwskazań bezwzględnych przy ekspozycji'
      }
    },
    {
      vaccine: 'PCV13/PCV15/PCV20',
      fullName: 'Pneumokoki (skoniugowana)',
      schedule: {
        '60-64 lata': 'recommended',
        '≥65 lat': 'recommended'
      },
      color: 'orange',
      info: {
        name: 'PCV',
        fullName: 'Szczepionka przeciw pneumokokom (skoniugowana)',
        description: 'Zalecana dla osób ≥60 lat oraz młodszych z grup ryzyka.',
        dosage: '1 dawka',
        sideEffects: 'Ból w miejscu wstrzyknięcia, zmęczenie, ból głowy',
        contraindications: 'Ciężka reakcja alergiczna na poprzednią dawkę'
      }
    },
    {
      vaccine: 'RZV',
      fullName: 'Półpasiec',
      schedule: {
        '50-59 lat': 'recommended',
        '60-64 lata': 'recommended',
        '≥65 lat': 'recommended'
      },
      color: 'orange',
      info: {
        name: 'RZV',
        fullName: 'Szczepionka przeciw półpaścowi',
        description: 'Zalecana dla osób ≥50 lat.',
        dosage: '2 dawki w odstępie 2-6 miesięcy',
        sideEffects: 'Ból w miejscu wstrzyknięcia, zmęczenie, ból mięśni, ból głowy',
        contraindications: 'Ciężka reakcja alergiczna na poprzednią dawkę'
      }
    },
    {
      vaccine: 'RSV',
      fullName: 'Wirus RS',
      schedule: {
        '≥65 lat': 'recommended'
      },
      color: 'orange',
      info: {
        name: 'RSV',
        fullName: 'Szczepionka przeciw wirusowi RS',
        description: 'Zalecana dla osób ≥60 lat oraz kobiet w ciąży.',
        dosage: '1 dawka',
        sideEffects: 'Ból w miejscu wstrzyknięcia, zmęczenie',
        contraindications: 'Ciężka reakcja alergiczna na składniki szczepionki'
      }
    },
    {
      vaccine: 'KZM',
      fullName: 'Kleszczowe zapalenie mózgu',
      schedule: {
        '19-26 lat': 'recommended',
        '27-49 lat': 'recommended',
        '50-59 lat': 'recommended',
        '60-64 lata': 'recommended',
        '≥65 lat': 'recommended'
      },
      color: 'orange',
      info: {
        name: 'KZM',
        fullName: 'Szczepionka przeciw kleszczowemu zapaleniu mózgu',
        description: 'Zalecana dla osób przebywających na terenach endemicznych.',
        dosage: '3 dawki + dawki przypominające co 3-5 lat',
        sideEffects: 'Ból w miejscu wstrzyknięcia, ból głowy, zmęczenie',
        contraindications: 'Ciężka reakcja alergiczna na białko jaja'
      }
    },
    {
      vaccine: 'PPSV23',
      fullName: 'Pneumokoki (polisacharydowa)',
      schedule: {
        '≥65 lat': 'special'
      },
      color: 'gray',
      info: {
        name: 'PPSV23',
        fullName: 'Szczepionka przeciw pneumokokom (polisacharydowa)',
        description: 'Dla osób z grup wysokiego ryzyka.',
        dosage: '1 dawka, ewentualnie druga po 5 latach',
        sideEffects: 'Ból w miejscu wstrzyknięcia, gorączka',
        contraindications: 'Ciężka reakcja alergiczna na poprzednią dawkę'
      }
    },
    {
      vaccine: 'HAV',
      fullName: 'Wirusowe zapalenie wątroby typu A',
      schedule: {
        '19-26 lat': 'special',
        '27-49 lat': 'special',
        '50-59 lat': 'special',
        '60-64 lata': 'special',
        '≥65 lat': 'special'
      },
      color: 'gray',
      info: {
        name: 'HAV',
        fullName: 'Szczepionka przeciw WZW typu A',
        description: 'Dla osób podróżujących, z przewlekłymi chorobami wątroby.',
        dosage: '2 dawki w odstępie 6-12 miesięcy',
        sideEffects: 'Ból w miejscu wstrzyknięcia, zmęczenie, ból głowy',
        contraindications: 'Ciężka reakcja alergiczna na poprzednią dawkę'
      }
    },
    {
      vaccine: 'MenB/MenACWY',
      fullName: 'Meningokoki',
      schedule: {
        '19-26 lat': 'special',
        '27-49 lat': 'special'
      },
      color: 'gray',
      info: {
        name: 'MenB/MenACWY',
        fullName: 'Szczepionka przeciw meningokokom',
        description: 'Dla osób z grup ryzyka, studentów mieszkających w akademikach.',
        dosage: '1 lub 2 dawki w zależności od typu szczepionki',
        sideEffects: 'Ból w miejscu wstrzyknięcia, gorączka, ból głowy',
        contraindications: 'Ciężka reakcja alergiczna na poprzednią dawkę'
      }
    }
  ];

  const getCellContent = (type: boolean | string) => {
    if (type === 'recommended') return '●';
    if (type === 'special') return '○';
    if (type === 'partial') return '◐';
    return '';
  };

  const handleVaccineClick = (vaccine: VaccineInfo) => {
    setSelectedVaccine(vaccine);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-[#C53030] rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <Users className="w-10 h-10 text-white" />
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Kalendarz szczepień dorosłych
              </h1>
              <p className="text-white/90">
                Program Szczepień Ochronnych - zalecenia dla osób dorosłych
              </p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#C53030]">
                  <th className="sticky left-0 z-10 bg-[#C53030] border border-white/20 px-4 py-3 text-left font-semibold text-white min-w-[200px]">
                    Szczepienie przeciw
                  </th>
                  {ageGroups.map((age) => (
                    <th
                      key={age}
                      className="border border-white/20 px-4 py-3 text-center font-semibold text-white min-w-[120px]"
                    >
                      {age}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vaccinations.map((vaccination, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="sticky left-0 z-10 bg-white border border-gray-300 px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{vaccination.vaccine}</div>
                          <div className="text-sm text-gray-600">{vaccination.fullName}</div>
                        </div>
                        <button
                          onClick={() => handleVaccineClick(vaccination.info)}
                          className="text-gray-400 hover:text-[#38b6ff] transition-colors flex-shrink-0"
                        >
                          <Info className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    {ageGroups.map((age) => {
                      const scheduleData = vaccination.schedule[age];
                      return (
                        <td
                          key={age}
                          className="border border-gray-300 px-4 py-3 text-center"
                        >
                          {scheduleData && (
                            <div
                              className={`w-full h-8 flex items-center justify-center ${
                                vaccination.color === 'orange' ? 'bg-[#FF8A50]' : 'bg-[#9CA3AF]'
                              } rounded cursor-pointer hover:opacity-80 transition-opacity`}
                              onClick={() => handleVaccineClick(vaccination.info)}
                              title={`${vaccination.fullName} - ${age}`}
                            >
                              <span className="text-white font-bold">
                                {getCellContent(scheduleData)}
                              </span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Legenda</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-8 bg-[#FF8A50] rounded flex items-center justify-center">
                <span className="text-white font-bold">●</span>
              </div>
              <div>
                <div className="font-semibold text-gray-900">Szczepienia zalecane</div>
                <div className="text-sm text-gray-600">Rutynowo zalecane dla wszystkich</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-8 bg-[#9CA3AF] rounded flex items-center justify-center">
                <span className="text-white font-bold">○</span>
              </div>
              <div>
                <div className="font-semibold text-gray-900">Szczepienia w specjalnych sytuacjach</div>
                <div className="text-sm text-gray-600">Dla grup ryzyka lub w określonych warunkach</div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">Ważne informacje</h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-yellow-700">
            <li>Kalendarz zgodny z aktualnym Programem Szczepień Ochronnych</li>
            <li>Szczepienia przeciw grypie zalecane corocznie przed sezonem grypowym</li>
            <li>Szczepienie przeciw Tdap/Td powtarzać co 10 lat</li>
            <li>Osoby z grup ryzyka mogą wymagać dodatkowych szczepień</li>
            <li>Przed szczepieniem skonsultuj się z lekarzem</li>
            <li>Kobiety w ciąży - szczególne zalecenia dotyczące Tdap, grypy i RSV</li>
          </ul>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedVaccine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedVaccine.name}
                  </h2>
                  <p className="text-gray-600 mt-1">{selectedVaccine.fullName}</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Opis</h3>
                <p className="text-gray-600">{selectedVaccine.description}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Dawkowanie</h3>
                <p className="text-gray-600">{selectedVaccine.dosage}</p>
              </div>
              {selectedVaccine.sideEffects && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Możliwe działania niepożądane</h3>
                  <p className="text-gray-600">{selectedVaccine.sideEffects}</p>
                </div>
              )}
              {selectedVaccine.contraindications && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Przeciwwskazania</h3>
                  <p className="text-gray-600">{selectedVaccine.contraindications}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaccinationCalendarAdults;