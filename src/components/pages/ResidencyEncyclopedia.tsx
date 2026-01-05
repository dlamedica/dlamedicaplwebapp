import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  specializationsData, 
  topSpecializations, 
  voivodeships, 
  sessions,
  getSpecializationsByCategory,
  getPlacesColor,
  getThresholdColor,
  SpecializationData
} from '../../data/residencyEncyclopediaData';

type SortField = 'name' | 'places' | 'threshold' | 'duration' | 'salary';
type SortDirection = 'asc' | 'desc';

interface ResidencyEncyclopediaProps {
  darkMode?: boolean;
  fontSize?: 'small' | 'medium' | 'large';
}

const ResidencyEncyclopedia: React.FC<ResidencyEncyclopediaProps> = ({ darkMode, fontSize }) => {
  const { profile, loading, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVoivodeship, setSelectedVoivodeship] = useState('Cała Polska');
  const [selectedSession, setSelectedSession] = useState('2025 I');
  const [surgicalFilter, setSurgicalFilter] = useState('Wszystkie');
  const [deficitFilter, setDeficitFilter] = useState('Wszystkie');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Check user access - only doctors can access this page
  const isDoctor = profile?.zawod === 'Lekarz' || 
                   profile?.profession === 'Lekarz' || 
                   profile?.zawod?.toLowerCase() === 'lekarz' || 
                   profile?.profession?.toLowerCase() === 'lekarz' ||
                   profile?.user_type === 'lekarz' ||
                   user?.email === 'lekarz@dlamedica.pl';

  useEffect(() => {
    if (!loading && !isDoctor) {
      console.warn('Access denied: Only doctors can access the residency encyclopedia');
    }
  }, [profile, loading, isDoctor]);

  // Filter and search specializations
  const filteredSpecializations = useMemo(() => {
    let filtered = specializationsData;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(spec =>
        spec.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Surgical filter
    if (surgicalFilter === 'Zabiegowa') {
      filtered = filtered.filter(spec => spec.isSurgical);
    } else if (surgicalFilter === 'Niezabiegowa') {
      filtered = filtered.filter(spec => !spec.isSurgical);
    }

    // Deficit filter
    if (deficitFilter === 'Deficytowa') {
      filtered = filtered.filter(spec => spec.isDeficit);
    } else if (deficitFilter === 'Niedeficytowa') {
      filtered = filtered.filter(spec => !spec.isDeficit);
    }

    return filtered;
  }, [searchQuery, surgicalFilter, deficitFilter]);

  // Sort specializations
  const sortedSpecializations = useMemo(() => {
    const sorted = [...filteredSpecializations];
    
    sorted.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortField) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'places':
          aValue = a.places;
          bValue = b.places;
          break;
        case 'threshold':
          aValue = a.minThreshold ?? 0;
          bValue = b.minThreshold ?? 0;
          break;
        case 'duration':
          aValue = a.duration;
          bValue = b.duration;
          break;
        case 'salary':
          aValue = a.salary;
          bValue = b.salary;
          break;
        default:
          return 0;
      }
      
      if (typeof aValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? comparison : -comparison;
      } else {
        const comparison = aValue - bValue;
        return sortDirection === 'asc' ? comparison : -comparison;
      }
    });
    
    return sorted;
  }, [filteredSpecializations, sortField, sortDirection]);

  // Group sorted specializations by category
  const groupedSpecializations = useMemo(() => {
    const grouped: Record<string, SpecializationData[]> = {};
    
    sortedSpecializations.forEach(spec => {
      if (!grouped[spec.category]) {
        grouped[spec.category] = [];
      }
      grouped[spec.category].push(spec);
    });
    
    return grouped;
  }, [sortedSpecializations]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <span className="text-gray-400">↕</span>;
    }
    return sortDirection === 'asc' ? <span className="text-blue-600">↑</span> : <span className="text-blue-600">↓</span>;
  };

  // Show access denied if we know user is not a doctor (after loading or if profile exists)
  if (!loading && profile && !isDoctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Brak dostępu</h2>
          <p className="text-gray-600">
            Encyklopedia rezydentur dostępna tylko dla lekarzy.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-gray-500">
            <span>🏠</span>
            <span className="mx-2">&gt;</span>
            <span className="text-gray-900">Encyklopedia rezydentur</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="flex justify-center items-center mb-6">
              <div className="text-6xl mr-4">🎓</div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Encyklopedia rezydentur</h1>
                <p className="text-xl text-gray-600">Kompletna baza wiedzy na temat szkolenia specjalizacyjnego w Polsce.</p>
              </div>
              <button className="ml-auto bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                Pusto!
              </button>
            </div>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Wyszukaj w encyklopedii rezydentur"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Specializations Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Specjalizacje z największą liczbą wolnych miejsc w sesji wiosna 2025:
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
            {topSpecializations.map((spec, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <div className="text-3xl mb-2">{spec.icon}</div>
                  <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2">
                    {spec.name}
                  </h3>
                  <div className="text-lg font-bold text-purple-600 mb-1">
                    {spec.places} miejsc
                  </div>
                  <div className="text-xs text-gray-500">
                    {spec.voivodeship}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advertisement Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <h3 className="text-2xl font-bold mb-2">Podstawy astmy w POZ</h3>
              <p className="text-purple-100">Kompleksowy kurs dla lekarzy podstawowej opieki zdrowotnej</p>
            </div>
            <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
              KUP TERAZ!
            </button>
          </div>
        </div>
      </div>

      {/* Specializations Table */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Lista specjalizacji</h2>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            <select
              value={selectedVoivodeship}
              onChange={(e) => setSelectedVoivodeship(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              {voivodeships.map(voivodeship => (
                <option key={voivodeship} value={voivodeship}>{voivodeship}</option>
              ))}
            </select>

            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              {sessions.map(session => (
                <option key={session} value={session}>{session}</option>
              ))}
            </select>

            <select
              value={surgicalFilter}
              onChange={(e) => setSurgicalFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Wszystkie">Zabiegowa?</option>
              <option value="Wszystkie">Wszystkie</option>
              <option value="Zabiegowa">Zabiegowa</option>
              <option value="Niezabiegowa">Niezabiegowa</option>
            </select>

            <select
              value={deficitFilter}
              onChange={(e) => setDeficitFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Wszystkie">Deficytowa?</option>
              <option value="Wszystkie">Wszystkie</option>
              <option value="Deficytowa">Deficytowa</option>
              <option value="Niedeficytowa">Niedeficytowa</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Nazwa specjalizacji
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('places')}
                  >
                    <div className="flex items-center">
                      Liczba miejsc
                      {getSortIcon('places')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('threshold')}
                  >
                    <div className="flex items-center">
                      Min. próg [%]
                      {getSortIcon('threshold')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('duration')}
                  >
                    <div className="flex items-center">
                      Czas trwania [lata]
                      {getSortIcon('duration')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Typ spec.
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('salary')}
                  >
                    <div className="flex items-center">
                      Pensja [zł]
                      {getSortIcon('salary')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.keys(groupedSpecializations).sort().map(category => (
                  <React.Fragment key={category}>
                    {/* Category Header */}
                    <tr className="bg-gray-100">
                      <td colSpan={6} className="px-6 py-2 text-sm font-bold text-gray-900">
                        {category}
                      </td>
                    </tr>
                    
                    {/* Specializations in this category */}
                    {groupedSpecializations[category].map((spec) => (
                      <tr key={spec.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {spec.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getPlacesColor(spec.places)}`}>
                            {spec.places}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 rounded text-xs font-medium ${getThresholdColor(spec.minThreshold)}`}>
                            {spec.minThreshold ? spec.minThreshold.toFixed(2) : 'b.d.'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {spec.duration}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {spec.isDeficit && <span className="text-red-500">🔥</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {spec.salary.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          
          {Object.keys(groupedSpecializations).length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nie znaleziono specjalizacji spełniających kryteria wyszukiwania.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResidencyEncyclopedia;