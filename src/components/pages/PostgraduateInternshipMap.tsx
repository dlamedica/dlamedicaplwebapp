import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, ScaleControl } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Icon, DivIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Hospital, Shield, Building2, Heart, Star, Users, Phone, Mail, MapPinIcon, GraduationCap, Plus, Minus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  medicalFacilities, 
  medicalChambers, 
  voivodeships, 
  MedicalFacility 
} from '../../data/postgraduateInternships';

// Professional custom marker icons for internship facilities
const createCustomIcon = (type: 'clinical' | 'non-clinical' | 'military', isHighlighted = false) => {
  const configs = {
    clinical: { 
      color: '#0284C7', 
      bgColor: '#E0F2FE',
      name: 'Szpital kliniczny'
    },
    'non-clinical': { 
      color: '#9333EA', 
      bgColor: '#F3E8FF',
      name: 'Szpital niekliniczny'
    },
    military: { 
      color: '#E11D48', 
      bgColor: '#FFE4E6',
      name: 'Szpital wojskowy'
    }
  };
  
  const config = configs[type];
  const size = isHighlighted ? 36 : 30;
  
  return new Icon({
    iconUrl: `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 35" width="${size}" height="${size * 1.45}">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.25"/>
          </filter>
        </defs>
        
        <!-- Map pin shape -->
        <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 23 12 23s12-14 12-23c0-6.6-5.4-12-12-12z" 
              fill="${config.color}" 
              filter="url(#shadow)"/>
        
        <!-- White inner circle -->
        <circle cx="12" cy="12" r="9" fill="white" opacity="0.95"/>
        
        <!-- Medical cross icon -->
        <rect x="10" y="6" width="4" height="12" fill="${config.color}"/>
        <rect x="6" y="10" width="12" height="4" fill="${config.color}"/>
        
        ${isHighlighted ? `
        <!-- Highlight ring -->
        <circle cx="12" cy="12" r="11" fill="none" stroke="${config.color}" stroke-width="2" opacity="0.5">
          <animate attributeName="r" values="11;14;11" dur="1.5s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.5;0;0.5" dur="1.5s" repeatCount="indefinite"/>
        </circle>
        ` : ''}
      </svg>
    `)}`,
    iconSize: [size, size * 1.45],
    iconAnchor: [size/2, size * 1.45],
    popupAnchor: [0, -size * 1.2],
    className: 'internship-marker-icon'
  });
};

// Create standard icons
const clinicalIcon = createCustomIcon('clinical');
const nonClinicalIcon = createCustomIcon('non-clinical');
const militaryIcon = createCustomIcon('military');

// Create highlighted versions
const clinicalIconHighlight = createCustomIcon('clinical', true);
const nonClinicalIconHighlight = createCustomIcon('non-clinical', true);
const militaryIconHighlight = createCustomIcon('military', true);

type SortOption = 'default' | 'alphabetical' | 'rating-desc' | 'rating-asc' | 'internships-desc' | 'internships-asc';

interface PostgraduateInternshipMapProps {
  darkMode?: boolean;
  fontSize?: 'small' | 'medium' | 'large';
}

const PostgraduateInternshipMap: React.FC<PostgraduateInternshipMapProps> = ({ darkMode, fontSize }) => {
  const { profile, loading, user } = useAuth();
  const mapRef = useRef<any>(null);
  const [selectedChamber, setSelectedChamber] = useState<string>('');
  const [selectedVoivodeships, setSelectedVoivodeships] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [savedFacilities, setSavedFacilities] = useState<number[]>([]);
  const [hoveredFacility, setHoveredFacility] = useState<number | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<number | null>(null);
  const [mapStyle, setMapStyle] = useState<'default' | 'satellite'>('default');

  // Check user access - only doctors can access this page
  const isDoctor = profile?.zawod === 'Lekarz' || 
                   profile?.profession === 'Lekarz' || 
                   profile?.zawod?.toLowerCase() === 'lekarz' || 
                   profile?.profession?.toLowerCase() === 'lekarz' ||
                   profile?.user_type === 'lekarz' ||
                   user?.email === 'lekarz@dlamedica.pl';

  useEffect(() => {
    if (!loading && !isDoctor) {
      console.warn('Access denied: Only doctors can access the internship map');
    }
  }, [profile, loading, isDoctor]);

  // Filter facilities based on selected filters
  const filteredFacilities = useMemo(() => {
    let filtered = medicalFacilities;

    // Filter by chamber
    if (selectedChamber) {
      filtered = filtered.filter(facility => facility.oil === selectedChamber);
    }

    // Filter by voivodeships
    if (selectedVoivodeships.length > 0) {
      filtered = filtered.filter(facility => 
        selectedVoivodeships.includes(facility.voivodeship)
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(facility => 
        facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        facility.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [selectedChamber, selectedVoivodeships, searchQuery]);

  // Sort facilities
  const sortedFacilities = useMemo(() => {
    const sorted = [...filteredFacilities];
    
    switch (sortBy) {
      case 'alphabetical':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'rating-desc':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'rating-asc':
        return sorted.sort((a, b) => a.rating - b.rating);
      case 'internships-desc':
        return sorted.sort((a, b) => b.internshipsAvailable - a.internshipsAvailable);
      case 'internships-asc':
        return sorted.sort((a, b) => a.internshipsAvailable - b.internshipsAvailable);
      default:
        return sorted;
    }
  }, [filteredFacilities, sortBy]);

  const handleVoivodeshipChange = (voivodeship: string) => {
    setSelectedVoivodeships(prev => 
      prev.includes(voivodeship)
        ? prev.filter(v => v !== voivodeship)
        : [...prev, voivodeship]
    );
  };

  const toggleSavedFacility = (facilityId: number) => {
    setSavedFacilities(prev => 
      prev.includes(facilityId)
        ? prev.filter(id => id !== facilityId)
        : [...prev, facilityId]
    );
  };

  const renderStarRating = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'text-yellow-400' : 'text-gray-300'}>
          ⭐
        </span>
      );
    }
    return stars;
  };

  const getMarkerIcon = (type: 'clinical' | 'non-clinical' | 'military', facilityId: number, isHighlighted = false) => {
    const shouldHighlight = isHighlighted || hoveredFacility === facilityId || selectedFacility === facilityId;
    
    switch (type) {
      case 'clinical': return shouldHighlight ? clinicalIconHighlight : clinicalIcon;
      case 'non-clinical': return shouldHighlight ? nonClinicalIconHighlight : nonClinicalIcon;
      case 'military': return shouldHighlight ? militaryIconHighlight : militaryIcon;
    }
  };
  
  // Get tile layer URL based on map style
  const getTileLayerConfig = () => {
    const configs = {
      default: {
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      },
      satellite: {
        url: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
        attribution: '&copy; <a href="https://www.google.com/maps">Google Maps</a>'
      },
    };
    return configs[mapStyle];
  };

  // Show access denied if we know user is not a doctor (after loading or if profile exists)
  if (!loading && profile && !isDoctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Brak dostępu</h2>
          <p className="text-gray-600">
            Ta funkcjonalność jest dostępna tylko dla lekarzy.
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
              <h1 className="text-3xl font-bold text-gray-900">Mapa staży podyplomowych</h1>
              <p className="mt-2 text-gray-600 max-w-4xl">
                W tym miejscu znajdziesz mapę wszystkich jednostek akredytowanych do prowadzenia staży podyplomowych. 
                Po wybraniu konkretnego szpitala dowiesz się, jakie staże możesz w nim realizować, które należy odbyć w 
                placówkach zewnętrznych i jakie są opinie na temat danego miejsca.
              </p>
            </div>
            <button 
              className="text-white px-4 py-2 rounded-lg transition-colors"
              style={{backgroundColor: '#38b6ff'}}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a9fe5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#38b6ff'}
            >
              Zapisane
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Filters Panel */}
          <div className="lg:col-span-1 space-y-4">
            {/* Chamber Filter */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-xl shadow-md border border-indigo-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wybierz izbę
              </label>
              <select
                value={selectedChamber}
                onChange={(e) => setSelectedChamber(e.target.value)}
                className="w-full p-2.5 bg-white border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200"
                style={{borderColor: '#38b6ff'}}
                onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 2px rgba(56, 182, 255, 0.3)'}
                onBlur={(e) => e.currentTarget.style.boxShadow = ''}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#2a9fe5'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#38b6ff'}
              >
                <option value="">Wszystkie izby</option>
                {medicalChambers.map(chamber => (
                  <option key={chamber} value={chamber}>{chamber}</option>
                ))}
              </select>
            </div>

            {/* Voivodeship Filter */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl shadow-md border border-purple-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wybierz województwo
              </label>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {voivodeships.map(voivodeship => (
                  <label key={voivodeship.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedVoivodeships.includes(voivodeship.value)}
                      onChange={() => handleVoivodeshipChange(voivodeship.value)}
                      className="mr-2 h-4 w-4 border-gray-300 rounded"
                      style={{color: '#38b6ff'}}
                      onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 2px rgba(56, 182, 255, 0.3)'}
                      onBlur={(e) => e.currentTarget.style.boxShadow = ''}
                    />
                    <span className="text-sm text-gray-700">{voivodeship.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Search Filter */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl shadow-md border border-green-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Placówka medyczna
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Wyszukaj placówkę..."
                className="w-full p-2.5 bg-white border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200"
                style={{borderColor: '#38b6ff'}}
                onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 2px rgba(56, 182, 255, 0.3)'}
                onBlur={(e) => e.currentTarget.style.boxShadow = ''}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#2a9fe5'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#38b6ff'}
              />
            </div>

            {/* Sort Options */}
            <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-4 rounded-xl shadow-md border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sortowanie
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full p-2.5 bg-white border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200"
                style={{borderColor: '#38b6ff'}}
                onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 2px rgba(56, 182, 255, 0.3)'}
                onBlur={(e) => e.currentTarget.style.boxShadow = ''}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#2a9fe5'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#38b6ff'}
              >
                <option value="default">Domyślnie</option>
                <option value="alphabetical">Alfabetycznie (A-Z)</option>
                <option value="rating-desc">Ocena: najwyższa</option>
                <option value="rating-asc">Ocena: najniższa</option>
                <option value="internships-desc">Miejsca: rosnąco</option>
                <option value="internships-asc">Miejsca: malejąco</option>
              </select>
            </div>

            {/* Facilities List */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Placówki medyczne ({sortedFacilities.length})
                </h3>
              </div>
              <div className="max-h-80 overflow-y-auto custom-scrollbar">
                {sortedFacilities.map((facility, index) => (
                  <div 
                    key={facility.id} 
                    className={`p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 ${
                      hoveredFacility === facility.id || selectedFacility === facility.id
                        ? 'shadow-sm' 
                        : 'hover:bg-gray-50'
                    }`}
                    style={{
                        backgroundColor: hoveredFacility === facility.id || selectedFacility === facility.id 
                          ? 'rgba(56, 182, 255, 0.05)'
                          : '',
                        borderColor: hoveredFacility === facility.id || selectedFacility === facility.id 
                          ? 'rgba(56, 182, 255, 0.2)'
                          : ''
                      }}
                    onMouseEnter={() => setHoveredFacility(facility.id)}
                    onMouseLeave={() => setHoveredFacility(null)}
                    onClick={() => setSelectedFacility(facility.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span 
                            className="text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center" 
                            style={{color: '#38b6ff', backgroundColor: 'rgba(56, 182, 255, 0.1)'}}
                          >
                            {index + 1}
                          </span>
                          <h4 
                            className="text-sm font-semibold line-clamp-2 transition-colors"
                            style={{
                              color: hoveredFacility === facility.id || selectedFacility === facility.id 
                                ? '#38b6ff' 
                                : '#1f2937'
                            }}
                          >
                            {facility.name}
                          </h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSavedFacility(facility.id);
                            }}
                            className={`p-1 rounded-full transition-colors ${
                              savedFacilities.includes(facility.id)
                                ? 'bg-red-100 text-red-600'
                                : 'bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-500'
                            }`}
                          >
                            <Heart className={`w-3 h-3 ${savedFacilities.includes(facility.id) ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                        
                        {facility.rating > 0 && (
                          <div className="flex items-center gap-1 mb-2 p-2 bg-amber-50 rounded-lg">
                            <Star className="w-3 h-3 text-amber-500 fill-current" />
                            <span className="text-xs font-medium text-amber-700">{facility.rating}</span>
                            <div className="flex text-xs">{renderStarRating(facility.rating)}</div>
                            <span className="text-xs text-amber-600">({facility.reviewsCount})</span>
                          </div>
                        )}

                        <div className="space-y-2">
                          <div 
                            className="flex items-center gap-2 text-xs p-2 rounded-lg"
                            style={{color: '#38b6ff', backgroundColor: 'rgba(56, 182, 255, 0.1)'}}
                          >
                            <GraduationCap className="w-3 h-3" />
                            <span className="font-medium">{facility.oil}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <MapPin className="w-3 h-3 text-gray-500" />
                            <span>{facility.city}</span>
                          </div>
                          
                          <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Users className="w-3 h-3 text-green-600" />
                              <span className="text-xs text-green-700 font-medium">{facility.doctorsCount} lekarzy</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Hospital className="w-3 h-3 text-green-600" />
                              <span className="text-xs text-green-700 font-medium">
                                {facility.internshipsAvailable === 0 ? 'Brak miejsc' : `${facility.internshipsAvailable}/${facility.internshipsTotal} staży`}
                              </span>
                            </div>
                          </div>
                          
                          {facility.specializations.length > 0 && (
                            <div className="mt-2">
                              <div className="text-xs text-gray-500 mb-1">Specjalizacje:</div>
                              <div className="flex flex-wrap gap-1">
                                {facility.specializations.slice(0, 3).map((spec, idx) => (
                                  <span key={idx} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                    {spec}
                                  </span>
                                ))}
                                {facility.specializations.length > 3 && (
                                  <span className="text-xs" style={{color: '#38b6ff'}}>+{facility.specializations.length - 3}</span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden relative border border-gray-200" style={{ height: '500px' }}>
              {/* Map Style Controls */}
              <div className="absolute top-4 right-2 z-10 flex flex-col gap-2">
                {/* Map Type Switcher */}
                <div className="bg-white rounded-lg shadow-md p-2 flex gap-1">
                  <button
                    onClick={() => setMapStyle('default')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      mapStyle === 'default' 
                        ? 'text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    style={mapStyle === 'default' ? {backgroundColor: '#38b6ff'} : {}}
                  >
                    Mapa
                  </button>
                  <button
                    onClick={() => setMapStyle('satellite')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      mapStyle === 'satellite' 
                        ? 'text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    style={mapStyle === 'satellite' ? {backgroundColor: '#38b6ff'} : {}}
                  >
                    Satelita
                  </button>
                </div>
              </div>
              
              {/* Zoom Controls - at right edge */}
              <div className="absolute top-20 right-1 z-10 flex flex-col gap-1">
                <button
                  onClick={() => {
                    if (mapRef.current) {
                      mapRef.current.zoomIn();
                    }
                  }}
                  className="w-8 h-8 bg-white rounded-md shadow-md flex items-center justify-center hover:bg-gray-50 transition-all hover:shadow-lg"
                  title="Przybliż"
                >
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => {
                    if (mapRef.current) {
                      mapRef.current.zoomOut();
                    }
                  }}
                  className="w-8 h-8 bg-white rounded-md shadow-md flex items-center justify-center hover:bg-gray-50 transition-all hover:shadow-lg"
                  title="Oddal"
                >
                  <Minus className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              
              {/* Legend */}
              <div className="absolute bottom-4 left-4 z-10 bg-white rounded-lg shadow-md p-3 max-w-xs">
                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" style={{color: '#38b6ff'}} />
                  Staże podyplomowe
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                    <span>Szpitale kliniczne</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                    <span>Szpitale niekliniczne</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-500"></div>
                    <span>Szpitale wojskowe</span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <div className="text-xs text-gray-600">
                    Placówek: <span className="font-semibold" style={{color: '#38b6ff'}}>{sortedFacilities.length}</span>
                  </div>
                </div>
              </div>

              <MapContainer
                ref={mapRef}
                center={[52.2297, 19.0122]} // Center of Poland
                zoom={6}
                style={{ height: '100%', width: '100%', zIndex: 1 }}
                zoomControl={false}
              >
                <TileLayer
                  {...getTileLayerConfig()}
                />
                
                {/* Scale control only */}
                <ScaleControl position="bottomright" />
                
                <MarkerClusterGroup
                  chunkedLoading
                  maxClusterRadius={60}
                  spiderfyOnMaxZoom={true}
                  showCoverageOnHover={false}
                  zoomToBoundsOnClick={true}
                  removeOutsideVisibleBounds={true}
                >
                  {sortedFacilities.map((facility) => (
                    <Marker
                      key={facility.id}
                      position={[facility.coordinates.lat, facility.coordinates.lng]}
                      icon={getMarkerIcon(facility.type, facility.id)}
                      eventHandlers={{
                        mouseover: () => setHoveredFacility(facility.id),
                        mouseout: () => setHoveredFacility(null),
                        click: () => setSelectedFacility(facility.id)
                      }}
                    >
                      <Popup maxWidth={400} className="custom-internship-popup">
                        <div className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-bold text-lg text-gray-900 mb-1 leading-tight">{facility.name}</h3>
                              <div className="flex items-center gap-2 text-sm text-blue-600">
                                <GraduationCap className="w-4 h-4" />
                                <span className="font-medium">{facility.oil}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => toggleSavedFacility(facility.id)}
                              className={`p-2 rounded-full transition-colors ${
                                savedFacilities.includes(facility.id)
                                  ? 'bg-red-100 text-red-600'
                                  : 'bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-500'
                              }`}
                            >
                              <Heart className={`w-4 h-4 ${savedFacilities.includes(facility.id) ? 'fill-current' : ''}`} />
                            </button>
                          </div>

                          {/* Rating */}
                          {facility.rating > 0 && (
                            <div className="flex items-center gap-2 mb-3 p-2 bg-amber-50 rounded-lg">
                              <Star className="w-4 h-4 text-amber-500 fill-current" />
                              <span className="font-semibold text-amber-700">{facility.rating}</span>
                              <div className="flex">{renderStarRating(facility.rating)}</div>
                              <span className="text-sm text-amber-600">({facility.reviewsCount} ocen)</span>
                            </div>
                          )}

                          {/* Address */}
                          <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <MapPin className="w-4 h-4 text-gray-500" />
                              <div>
                                <div className="font-medium">{facility.city}</div>
                                <div className="text-xs text-gray-600">{facility.address}</div>
                              </div>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="grid grid-cols-2 gap-2 mb-3">
                            <div className="p-2 bg-green-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-green-600" />
                                <div>
                                  <div className="text-sm font-semibold text-green-700">{facility.doctorsCount}</div>
                                  <div className="text-xs text-green-600">Lekarzy</div>
                                </div>
                              </div>
                            </div>
                            <div className="p-2 bg-blue-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <Hospital className="w-4 h-4 text-blue-600" />
                                <div>
                                  <div className="text-sm font-semibold text-blue-700">
                                    {facility.internshipsAvailable === 0 ? '0' : `${facility.internshipsAvailable}/${facility.internshipsTotal}`}
                                  </div>
                                  <div className="text-xs text-blue-600">Staże</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Specializations */}
                          {facility.specializations.length > 0 && (
                            <div>
                              <div className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-purple-600" />
                                <span>Specjalizacje</span>
                              </div>
                              <div className="max-h-24 overflow-y-auto">
                                <div className="flex flex-wrap gap-1">
                                  {facility.specializations.map((spec, idx) => (
                                    <span key={idx} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                      {spec}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MarkerClusterGroup>
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom CSS for internship map enhancements */}
      <style jsx global>{`
        .internship-marker-icon {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .internship-marker-icon:hover {
          transform: scale(1.15) translateY(-2px);
        }
        
        .custom-internship-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          border: 1px solid #e5e7eb;
          background: white;
        }
        
        .custom-internship-popup .leaflet-popup-tip {
          background: white;
          border: 1px solid #e5e7eb;
        }
        
        .marker-cluster-small {
          background: #0284C7;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        
        .marker-cluster-small div {
          background: #0284C7;
          color: white;
          font-weight: 600;
          font-size: 14px;
        }
        
        .marker-cluster-medium {
          background: #9333EA;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        
        .marker-cluster-medium div {
          background: #9333EA;
          color: white;
          font-weight: 600;
          font-size: 14px;
        }
        
        .marker-cluster-large {
          background: #E11D48;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        
        .marker-cluster-large div {
          background: #E11D48;
          color: white;
          font-weight: 600;
          font-size: 14px;
        }
        
        .marker-cluster {
          background: #0284C7;
          border-radius: 50%;
          text-align: center;
          transition: all 0.2s ease;
        }
        
        .marker-cluster:hover {
          transform: scale(1.05);
        }
        
        .marker-cluster div {
          width: 40px;
          height: 40px;
          margin-left: 5px;
          margin-top: 5px;
          text-align: center;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default PostgraduateInternshipMap;