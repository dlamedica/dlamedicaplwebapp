import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface VaccinationCalendarProps {
  darkMode?: boolean;
  fontSize?: 'small' | 'medium' | 'large';
}

interface VaccinationSchedule {
  age: string;
  vaccine: string;
  description: string;
  mandatory: boolean;
  category: 'infant' | 'child' | 'adolescent' | 'adult' | 'elderly';
}

const vaccinationSchedules: VaccinationSchedule[] = [
  // Niemowlęta i małe dzieci
  { age: 'Urodzenie', vaccine: 'HBV', description: 'Szczepionka przeciwko wirusowemu zapaleniu wątroby typu B', mandatory: true, category: 'infant' },
  { age: '2 miesiące', vaccine: 'DTaP + IPV + Hib + PCV13', description: 'Przeciwko błonicy, tężcowi, krztuścowi, polio, Haemophilus influenzae typu b, pneumokokom', mandatory: true, category: 'infant' },
  { age: '3-4 miesiące', vaccine: 'DTaP + IPV + Hib', description: 'Druga dawka szczepionek podstawowych', mandatory: true, category: 'infant' },
  { age: '5-6 miesięcy', vaccine: 'DTaP + IPV + Hib + PCV13', description: 'Trzecia dawka szczepionek podstawowych', mandatory: true, category: 'infant' },
  { age: '7 miesięcy', vaccine: 'HBV', description: 'Druga dawka przeciwko WZW B', mandatory: true, category: 'infant' },
  { age: '13-15 miesięcy', vaccine: 'MMR + PCV13', description: 'Przeciwko odrze, śwince, różyczce + pneumokoki', mandatory: true, category: 'infant' },
  { age: '16-18 miesięcy', vaccine: 'DTaP + IPV + Hib', description: 'Czwarta dawka szczepionek podstawowych', mandatory: true, category: 'infant' },
  
  // Dzieci przedszkolne i szkolne
  { age: '6 lat', vaccine: 'DTaP + IPV', description: 'Przypomnienie przed pójściem do szkoły', mandatory: true, category: 'child' },
  { age: '6 lat', vaccine: 'MMR', description: 'Druga dawka przeciwko odrze, śwince, różyczce', mandatory: true, category: 'child' },
  { age: '7 lat', vaccine: 'HBV', description: 'Trzecia dawka przeciwko WZW B', mandatory: true, category: 'child' },
  { age: '10 lat', vaccine: 'Td', description: 'Przypomnienie przeciwko tężcowi i błonicy', mandatory: true, category: 'child' },
  
  // Młodzież
  { age: '14 lat', vaccine: 'Td', description: 'Przypomnienie przeciwko tężcowi i błonicy', mandatory: true, category: 'adolescent' },
  { age: '9-14 lat', vaccine: 'HPV', description: 'Szczepionka przeciwko wirusowi brodawczaka ludzkiego (zalecana)', mandatory: false, category: 'adolescent' },
  { age: '11-12 lat', vaccine: 'MenACWY', description: 'Przeciwko meningokokom (zalecana)', mandatory: false, category: 'adolescent' },
  
  // Dorośli
  { age: '19+ lat', vaccine: 'Td/Tdap', description: 'Przypomnienie co 10 lat', mandatory: true, category: 'adult' },
  { age: '19-26 lat', vaccine: 'HPV', description: 'Dla osób niezaszczepionych wcześniej', mandatory: false, category: 'adult' },
  { age: 'Kobiety w ciąży', vaccine: 'Tdap', description: 'W każdej ciąży między 27-36 tygodniem', mandatory: false, category: 'adult' },
  { age: 'Dorośli', vaccine: 'MMR', description: 'Dla osób urodzonych po 1956 roku bez udokumentowanych szczepień', mandatory: false, category: 'adult' },
  { age: 'Dorośli', vaccine: 'Varicella', description: 'Przeciwko ospie wietrznej (dla osób bez przechorowania)', mandatory: false, category: 'adult' },
  
  // Seniorzy
  { age: '65+ lat', vaccine: 'PCV13/PPSV23', description: 'Przeciwko pneumokokom', mandatory: false, category: 'elderly' },
  { age: '60+ lat', vaccine: 'Zoster', description: 'Przeciwko półpaścowi', mandatory: false, category: 'elderly' },
  { age: '65+ lat', vaccine: 'Influenza', description: 'Szczepionka przeciwko grypie (corocznie)', mandatory: false, category: 'elderly' },
  { age: '65+ lat', vaccine: 'COVID-19', description: 'Szczepionka przeciwko COVID-19 (dawki przypominające)', mandatory: false, category: 'elderly' }
];

const VaccinationCalendar: React.FC<VaccinationCalendarProps> = ({ darkMode, fontSize }) => {
  const { profile, loading, user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Check user access - only doctors can access this page
  const isDoctor = profile?.zawod === 'Lekarz' || 
                   profile?.profession === 'Lekarz' || 
                   profile?.zawod?.toLowerCase() === 'lekarz' || 
                   profile?.profession?.toLowerCase() === 'lekarz' ||
                   profile?.user_type === 'lekarz' ||
                   user?.email === 'lekarz@dlamedica.pl';

  useEffect(() => {
    if (!loading && !isDoctor) {
      console.warn('Access denied: Only doctors can access the vaccination calendar');
    }
  }, [profile, loading, isDoctor]);

  // Filter vaccinations
  const filteredVaccinations = vaccinationSchedules.filter(vaccine => {
    const matchesCategory = selectedCategory === 'all' || vaccine.category === selectedCategory;
    const matchesSearch = vaccine.vaccine.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vaccine.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vaccine.age.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Show access denied if we know user is not a doctor (after loading or if profile exists)
  if (!loading && profile && !isDoctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Brak dostępu</h2>
          <p className="text-gray-600">
            Kalendarze szczepień dostępne tylko dla lekarzy.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Kalendarze szczepień</h1>
              <p className="mt-2 text-gray-600 max-w-4xl">
                Kompletny kalendarz szczepień obowiązkowych i zalecanych dla wszystkich grup wiekowych 
                zgodnie z Programem Szczepień Ochronnych w Polsce.
              </p>
            </div>
            <div className="text-6xl">💉</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              style={{borderColor: '#ccc'}}
              onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 2px rgba(56, 182, 255, 0.3)'}
              onBlur={(e) => e.currentTarget.style.boxShadow = ''}
            >
              <option value="all">Wszystkie grupy wiekowe</option>
              <option value="infant">Niemowlęta (0-2 lata)</option>
              <option value="child">Dzieci (2-12 lat)</option>
              <option value="adolescent">Młodzież (12-18 lat)</option>
              <option value="adult">Dorośli (18-65 lat)</option>
              <option value="elderly">Seniorzy (65+ lat)</option>
            </select>

            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Wyszukaj szczepionkę..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent"
                  onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 2px rgba(56, 182, 255, 0.3)'}
                  onBlur={(e) => e.currentTarget.style.boxShadow = ''}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Legenda</h3>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
              <span className="text-sm text-gray-700">Szczepienia obowiązkowe</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded mr-2" style={{backgroundColor: '#38b6ff'}}></div>
              <span className="text-sm text-gray-700">Szczepienia zalecane</span>
            </div>
          </div>
        </div>

        {/* Vaccination Schedule Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Harmonogram szczepień ({filteredVaccinations.length} pozycji)
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Wiek
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Szczepionka
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Opis
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Typ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVaccinations.map((vaccination, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {vaccination.age}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold" style={{color: '#38b6ff'}}>
                        {vaccination.vaccine}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {vaccination.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          vaccination.mandatory 
                            ? 'bg-red-100 text-red-800' 
                            : 'text-white'
                        }`}
                        style={!vaccination.mandatory ? {backgroundColor: '#38b6ff'} : {}}
                      >
                        {vaccination.mandatory ? 'Obowiązkowa' : 'Zalecana'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredVaccinations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nie znaleziono szczepionek spełniających kryteria wyszukiwania.</p>
            </div>
          )}
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">Ważne informacje</h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-yellow-700">
            <li>Harmonogram może ulec zmianie - zawsze sprawdź aktualne wytyczne sanitarne</li>
            <li>U pacjentów z niedoborami odporności harmonogram może być modyfikowany</li>
            <li>Niektóre szczepionki mogą być przeciwwskazane w określonych stanach chorobowych</li>
            <li>Przed szczepieniem zawsze przeprowadź wywiad medyczny i oceń stan zdrowia pacjenta</li>
            <li>Zachowaj odpowiednie odstępy między szczepieniami różnymi preparatami</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VaccinationCalendar;