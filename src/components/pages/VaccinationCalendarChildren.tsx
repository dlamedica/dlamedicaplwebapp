import React, { useState, useRef } from 'react';
import { Info, X } from 'lucide-react';

interface VaccineInfo {
  name: string;
  fullName: string;
  description: string;
  sideEffects?: string;
  contraindications?: string;
}

interface VaccinationData {
  vaccine: string;
  fullName: string;
  schedule: {
    [key: string]: boolean | 'primary' | 'booster' | 'recommended' | 'special';
  };
  color: 'orange' | 'blue' | 'pink';
  info: VaccineInfo;
}

const VaccinationCalendarChildren: React.FC = () => {
  const [selectedVaccine, setSelectedVaccine] = useState<VaccineInfo | null>(null);
  const [showModal, setShowModal] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  const ageColumns = [
    '24h',
    '2 mies.',
    '3-4 mies.',
    '5-6 mies.',
    '7 mies.',
    '13-15 mies.',
    '16-18 mies.',
    '6 lat',
    '9 lat',
    '14 lat',
    '19 lat'
  ];

  const vaccinations: VaccinationData[] = [
    {
      vaccine: 'BCG*',
      fullName: 'Gruźlica',
      schedule: {
        '24h': 'primary'
      },
      color: 'orange',
      info: {
        name: 'BCG',
        fullName: 'Szczepionka przeciw gruźlicy',
        description: 'Szczepionka BCG chroni przed ciężkimi postaciami gruźlicy u dzieci. *Szczepienie powinno być przeprowadzone przed wypisaniem dziecka z oddziału noworodkowego.',
        sideEffects: 'Zaczerwienienie, obrzęk w miejscu wstrzyknięcia, powiększenie węzłów chłonnych',
        contraindications: 'Niedobory odporności, ciąża, zakażenie HIV'
      }
    },
    {
      vaccine: 'HBV*',
      fullName: 'WZW B',
      schedule: {
        '24h': 'primary',
        '2 mies.': 'primary',
        '7 mies.': 'primary'
      },
      color: 'orange',
      info: {
        name: 'HBV',
        fullName: 'Szczepionka przeciw wirusowemu zapaleniu wątroby typu B',
        description: 'Chroni przed zakażeniem wirusem zapalenia wątroby typu B, które może prowadzić do marskości wątroby. *Pierwsza dawka powinna być podana przed wypisaniem z oddziału noworodkowego.',
        sideEffects: 'Ból w miejscu wstrzyknięcia, zmęczenie, ból głowy',
        contraindications: 'Ciężka reakcja alergiczna na poprzednią dawkę'
      }
    },
    {
      vaccine: 'RV**',
      fullName: 'Rotawirusy',
      schedule: {
        '2 mies.': 'primary',
        '3-4 mies.': 'primary',
        '5-6 mies.': 'primary'
      },
      color: 'orange',
      info: {
        name: 'RV',
        fullName: 'Szczepionka przeciw rotawirusom',
        description: 'Chroni przed biegunką rotawirusową - najczęstszą przyczyną ciężkich biegunek u niemowląt. **Szczepienia można rozpocząć po ukończeniu przez dziecko 6 tygodni.',
        sideEffects: 'Rozdrażnienie, biegunka, wymioty',
        contraindications: 'Ciężkie złożone niedobory odporności, wgłobienie jelita'
      }
    },
    {
      vaccine: 'DTP/Td***',
      fullName: 'Błonica, tężec, krztusiec',
      schedule: {
        '2 mies.': 'primary',
        '3-4 mies.': 'primary',
        '5-6 mies.': 'primary',
        '16-18 mies.': 'booster',
        '6 lat': 'booster',
        '14 lat': 'booster',
        '19 lat': 'booster'
      },
      color: 'orange',
      info: {
        name: 'DTP/Td',
        fullName: 'Szczepionka przeciw błonicy, tężcowi i krztuścowi',
        description: 'Chroni przed trzema groźnymi chorobami bakteryjnymi. ***W wieku 14 i 19 lat: Td bezpłatne lub Tdap odpłatne.',
        sideEffects: 'Zaczerwienienie, obrzęk, gorączka',
        contraindications: 'Postępująca encefalopatia, ciężka reakcja na poprzednią dawkę'
      }
    },
    {
      vaccine: 'IPV',
      fullName: 'Poliomyelitis',
      schedule: {
        '2 mies.': 'primary',
        '3-4 mies.': 'primary',
        '5-6 mies.': 'primary',
        '16-18 mies.': 'booster'
      },
      color: 'orange',
      info: {
        name: 'IPV',
        fullName: 'Szczepionka przeciw poliomyelitis (polio)',
        description: 'Chroni przed paraliżem dziecięcym - chorobą Heinego-Medina.',
        sideEffects: 'Ból w miejscu wstrzyknięcia, gorączka',
        contraindications: 'Ciężka reakcja alergiczna na składniki szczepionki'
      }
    },
    {
      vaccine: 'Hib',
      fullName: 'Haemophilus influenzae typu b',
      schedule: {
        '2 mies.': 'primary',
        '3-4 mies.': 'primary',
        '5-6 mies.': 'primary',
        '16-18 mies.': 'booster'
      },
      color: 'orange',
      info: {
        name: 'Hib',
        fullName: 'Szczepionka przeciw Haemophilus influenzae typu b',
        description: 'Chroni przed zakażeniami bakterią Hib, która może powodować zapalenie opon mózgowych.',
        sideEffects: 'Zaczerwienienie, obrzęk, gorączka',
        contraindications: 'Ciężka reakcja alergiczna na poprzednią dawkę'
      }
    },
    {
      vaccine: 'PCV',
      fullName: 'Pneumokoki',
      schedule: {
        '2 mies.': 'primary',
        '3-4 mies.': 'primary',
        '13-15 mies.': 'booster'
      },
      color: 'orange',
      info: {
        name: 'PCV',
        fullName: 'Szczepionka przeciw pneumokokom',
        description: 'Chroni przed zakażeniami pneumokokowymi - zapaleniem płuc, opon mózgowych, sepsą.',
        sideEffects: 'Ból w miejscu wstrzyknięcia, gorączka, rozdrażnienie',
        contraindications: 'Ciężka reakcja alergiczna na poprzednią dawkę'
      }
    },
    {
      vaccine: 'MMR',
      fullName: 'Odra, świnka, różyczka',
      schedule: {
        '13-15 mies.': 'primary',
        '6 lat': 'booster'
      },
      color: 'orange',
      info: {
        name: 'MMR',
        fullName: 'Szczepionka przeciw odrze, śwince i różyczce',
        description: 'Chroni przed trzema chorobami wirusowymi.',
        sideEffects: 'Gorączka, wysypka, obrzęk ślinianek',
        contraindications: 'Ciąża, niedobory odporności, alergia na białko jaja'
      }
    },
    {
      vaccine: 'HPV****',
      fullName: 'Wirus brodawczaka ludzkiego',
      schedule: {
        '9 lat': 'special'
      },
      color: 'pink',
      info: {
        name: 'HPV',
        fullName: 'Szczepionka przeciw wirusowi brodawczaka ludzkiego',
        description: 'Chroni przed rakiem szyjki macicy i innymi nowotworami związanymi z HPV. ****Szczepienia bezpłatne po ukończeniu 9 lat do 14 lat oraz refundacja dla jednej szczepionki w grupie po ukończeniu 9 lat do 18 lat.',
        sideEffects: 'Ból w miejscu wstrzyknięcia, ból głowy',
        contraindications: 'Ciąża, ciężka reakcja alergiczna'
      }
    },
    {
      vaccine: 'MenB/MenACWY',
      fullName: 'Meningokoki',
      schedule: {
        '13-15 mies.': 'recommended'
      },
      color: 'blue',
      info: {
        name: 'MenB/MenACWY',
        fullName: 'Szczepionka przeciw meningokokom',
        description: 'Chroni przed zakażeniami meningokokowymi - sepsą i zapaleniem opon mózgowych.',
        sideEffects: 'Gorączka, ból w miejscu wstrzyknięcia',
        contraindications: 'Ciężka reakcja alergiczna na poprzednią dawkę'
      }
    },
    {
      vaccine: 'IV/LAV',
      fullName: 'Grypa',
      schedule: {
        '16-18 mies.': 'recommended'
      },
      color: 'blue',
      info: {
        name: 'IV/LAV',
        fullName: 'Szczepionka przeciw grypie',
        description: 'Chroni przed grypą sezonową. Zalecana corocznie.',
        sideEffects: 'Ból w miejscu wstrzyknięcia, niewielka gorączka',
        contraindications: 'Alergia na białko jaja (dla niektórych szczepionek)'
      }
    },
    {
      vaccine: 'VZV',
      fullName: 'Ospa wietrzna',
      schedule: {
        '13-15 mies.': 'recommended'
      },
      color: 'blue',
      info: {
        name: 'VZV',
        fullName: 'Szczepionka przeciw ospie wietrznej',
        description: 'Chroni przed ospą wietrzną i jej powikłaniami.',
        sideEffects: 'Ból w miejscu wstrzyknięcia, wysypka',
        contraindications: 'Ciąża, niedobory odporności'
      }
    },
    {
      vaccine: 'COVID-19',
      fullName: 'COVID-19',
      schedule: {
        '6 lat': 'special',
        '14 lat': 'special'
      },
      color: 'pink',
      info: {
        name: 'COVID-19',
        fullName: 'Szczepionka przeciw COVID-19',
        description: 'Chroni przed ciężkim przebiegiem COVID-19.',
        sideEffects: 'Ból w miejscu wstrzyknięcia, zmęczenie, ból głowy',
        contraindications: 'Ciężka reakcja alergiczna na składniki szczepionki'
      }
    },
    {
      vaccine: 'TBE',
      fullName: 'KZM',
      schedule: {
        '6 lat': 'recommended',
        '14 lat': 'recommended'
      },
      color: 'blue',
      info: {
        name: 'TBE',
        fullName: 'Szczepionka przeciw kleszczowemu zapaleniu mózgu',
        description: 'Chroni przed kleszczowym zapaleniem mózgu.',
        sideEffects: 'Ból w miejscu wstrzyknięcia, ból głowy',
        contraindications: 'Ciężka reakcja alergiczna na białko jaja'
      }
    },
    {
      vaccine: 'HAV',
      fullName: 'WZW A',
      schedule: {
        '13-15 mies.': 'recommended'
      },
      color: 'blue',
      info: {
        name: 'HAV',
        fullName: 'Szczepionka przeciw wirusowemu zapaleniu wątroby typu A',
        description: 'Chroni przed wirusowym zapaleniem wątroby typu A.',
        sideEffects: 'Ból w miejscu wstrzyknięcia, zmęczenie',
        contraindications: 'Ciężka reakcja alergiczna na poprzednią dawkę'
      }
    }
  ];

  const getCellColor = (type: boolean | string) => {
    if (type === 'primary' || type === 'booster') return 'bg-orange-500';
    if (type === 'recommended') return 'bg-[#38b6ff]';
    if (type === 'special') return 'bg-pink-500';
    return '';
  };

  const getCellContent = (type: boolean | string) => {
    if (type === 'primary') return '●';
    if (type === 'booster') return '○';
    if (type === 'recommended') return '◆';
    if (type === 'special') return '★';
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
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Kalendarz szczepień dzieci i młodzieży
            </h1>
            <p className="text-gray-600">
              Program Szczepień Ochronnych (PSO) - szczepienia obowiązkowe i zalecane
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div ref={tableRef} className="w-full">
            <table className="w-full border-collapse table-fixed">
              <thead>
                <tr className="bg-gray-100">
                  <th className="sticky left-0 z-10 bg-gray-100 border border-gray-300 px-2 py-2 text-left font-semibold text-gray-900 text-xs w-[180px]">
                    Szczepienie
                  </th>
                  {ageColumns.map((age) => (
                    <th
                      key={age}
                      className="border border-gray-300 px-1 py-2 text-center font-semibold text-gray-900 text-xs"
                    >
                      {age}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vaccinations.map((vaccination, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="sticky left-0 z-10 bg-white border border-gray-300 px-2 py-2 w-[180px]">
                      <div className="flex items-center space-x-1">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 text-xs">{vaccination.vaccine}</div>
                          <div className="text-xs text-gray-600">{vaccination.fullName}</div>
                        </div>
                        <button
                          onClick={() => handleVaccineClick(vaccination.info)}
                          className="text-gray-400 hover:text-[#38b6ff] transition-colors flex-shrink-0"
                        >
                          <Info className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    {ageColumns.map((age) => {
                      const scheduleData = vaccination.schedule[age];
                      return (
                        <td
                          key={age}
                          className="border border-gray-300 px-1 py-2 text-center"
                        >
                          {scheduleData && (
                            <div
                              className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:scale-110 transition-transform ${getCellColor(scheduleData)}`}
                              onClick={() => handleVaccineClick(vaccination.info)}
                              title={`${vaccination.fullName} - ${age}`}
                            >
                              {getCellContent(scheduleData)}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white">
                ●
              </div>
              <div>
                <div className="font-semibold text-gray-900">Szczepienia obowiązkowe</div>
                <div className="text-sm text-gray-600">Podstawowe dawki</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white">
                ○
              </div>
              <div>
                <div className="font-semibold text-gray-900">Dawki przypominające</div>
                <div className="text-sm text-gray-600">Szczepienia obowiązkowe</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#38b6ff] rounded-full flex items-center justify-center text-white">
                ◆
              </div>
              <div>
                <div className="font-semibold text-gray-900">Szczepienia zalecane</div>
                <div className="text-sm text-gray-600">Dodatkowa ochrona</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white">
                ★
              </div>
              <div>
                <div className="font-semibold text-gray-900">Szczepienia specjalne</div>
                <div className="text-sm text-gray-600">Specjalne zasady finansowania</div>
              </div>
            </div>
          </div>
        </div>

        {/* Vaccine Abbreviations */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">Objaśnienia skrótów szczepień</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-semibold text-blue-900">BCG</span>
              <span className="text-blue-700"> - Szczepionka przeciw gruźlicy</span>
            </div>
            <div>
              <span className="font-semibold text-blue-900">HBV</span>
              <span className="text-blue-700"> - Wirusowe zapalenie wątroby typu B</span>
            </div>
            <div>
              <span className="font-semibold text-blue-900">RV</span>
              <span className="text-blue-700"> - Szczepionka przeciw rotawirusom</span>
            </div>
            <div>
              <span className="font-semibold text-blue-900">DTP/Td</span>
              <span className="text-blue-700"> - Błonica, tężec, krztusiec</span>
            </div>
            <div>
              <span className="font-semibold text-blue-900">IPV</span>
              <span className="text-blue-700"> - Szczepionka przeciw poliomyelitis</span>
            </div>
            <div>
              <span className="font-semibold text-blue-900">Hib</span>
              <span className="text-blue-700"> - Haemophilus influenzae typu b</span>
            </div>
            <div>
              <span className="font-semibold text-blue-900">PCV</span>
              <span className="text-blue-700"> - Szczepionka przeciw pneumokokom</span>
            </div>
            <div>
              <span className="font-semibold text-blue-900">MMR</span>
              <span className="text-blue-700"> - Odra, świnka, różyczka</span>
            </div>
            <div>
              <span className="font-semibold text-blue-900">HPV</span>
              <span className="text-blue-700"> - Wirus brodawczaka ludzkiego</span>
            </div>
            <div>
              <span className="font-semibold text-blue-900">MenB/MenACWY</span>
              <span className="text-blue-700"> - Meningokoki</span>
            </div>
            <div>
              <span className="font-semibold text-blue-900">IV/LAV</span>
              <span className="text-blue-700"> - Szczepionka przeciw grypie</span>
            </div>
            <div>
              <span className="font-semibold text-blue-900">VZV</span>
              <span className="text-blue-700"> - Ospa wietrzna</span>
            </div>
            <div>
              <span className="font-semibold text-blue-900">COVID-19</span>
              <span className="text-blue-700"> - Szczepionka przeciw COVID-19</span>
            </div>
            <div>
              <span className="font-semibold text-blue-900">TBE</span>
              <span className="text-blue-700"> - Kleszczowe zapalenie mózgu</span>
            </div>
            <div>
              <span className="font-semibold text-blue-900">HAV</span>
              <span className="text-blue-700"> - Wirusowe zapalenie wątroby typu A</span>
            </div>
          </div>
        </div>

        {/* Age Groups Explanation */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-green-800 mb-4">Harmonogram szczepień według wieku</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-green-900 mb-2">Noworodki i niemowlęta</h4>
              <ul className="space-y-1 text-green-700">
                <li><strong>24h:</strong> BCG, HBV (przed wypisem ze szpitala)</li>
                <li><strong>2 mies.:</strong> HBV, RV, DTP, IPV, Hib, PCV</li>
                <li><strong>3-4 mies.:</strong> RV, DTP, IPV, Hib</li>
                <li><strong>5-6 mies.:</strong> RV, DTP, IPV, Hib</li>
                <li><strong>7 mies.:</strong> HBV (trzecia dawka)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-900 mb-2">Małe dzieci</h4>
              <ul className="space-y-1 text-green-700">
                <li><strong>13-15 mies.:</strong> PCV, MMR, MenB/MenACWY, VZV, HAV</li>
                <li><strong>16-18 mies.:</strong> DTP, IPV, Hib, IV/LAV</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-900 mb-2">Dzieci szkolne</h4>
              <ul className="space-y-1 text-green-700">
                <li><strong>6 lat:</strong> DTP, MMR, COVID-19, TBE</li>
                <li><strong>9 lat:</strong> HPV (dziewczęta i chłopcy)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-900 mb-2">Młodzież</h4>
              <ul className="space-y-1 text-green-700">
                <li><strong>14 lat:</strong> DTP/Td, COVID-19, TBE</li>
                <li><strong>19 lat:</strong> DTP/Td (przypomnienie)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">Ważne informacje</h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-yellow-700">
            <li>Kalendarz zgodny z aktualnym Programem Szczepień Ochronnych (PSO)</li>
            <li>Szczepienia obowiązkowe (●, ○) są bezpłatne dla wszystkich dzieci</li>
            <li>Szczepienia zalecane (◆) są odpłatne, ale często refundowane</li>
            <li>Szczepienia specjalne (★) mają różne zasady finansowania</li>
            <li>W przypadku opóźnień w szczepieniach skonsultuj się z lekarzem</li>
            <li>Zachowaj dokumentację wszystkich wykonanych szczepień</li>
          </ul>
          
          <h4 className="text-base font-semibold text-yellow-800 mt-4 mb-2">Przypisy specjalne</h4>
          <div className="space-y-1 text-xs text-yellow-700">
            <p><strong>*</strong> Szczepienie powinno być przeprowadzone przed wypisaniem dziecka z oddziału noworodkowego (BCG, HBV)</p>
            <p><strong>**</strong> Szczepienia można rozpocząć po ukończeniu przez dziecko 6 tygodni (RV)</p>
            <p><strong>***</strong> W wieku 14 i 19 lat: Td bezpłatne lub Tdap odpłatne</p>
            <p><strong>****</strong> HPV: szczepienia bezpłatne po ukończeniu 9 lat do 14 lat oraz refundacja dla jednej szczepionki w grupie po ukończeniu 9 lat do 18 lat</p>
          </div>
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

export default VaccinationCalendarChildren;