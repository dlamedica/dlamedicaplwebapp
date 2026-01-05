import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaCalendarAlt, FaVideo, FaBuilding, FaFilter, FaTimes, FaMoneyBillWave, FaGlobe, FaMapMarkerAlt } from 'react-icons/fa';
import { db } from '../lib/apiClient';

interface Event {
  id: string;
  title: string;
  date: string;
  type: 'conference' | 'webinar';
  is_online: boolean;
  is_free: boolean;
  location?: string;
  online_url?: string;
  max_participants?: number;
  organizer_name?: string;
  category?: string;
  description: string;
  contact_email: string;
  contact_phone?: string;
  registration_url?: string;
  ticket_price?: number;
}

interface EventCalendarWithFiltersProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  onEventClick?: (event: Event) => void;
}

interface Filters {
  eventType: string[];  // ['conference', 'webinar']
  location: string[];   // ['online', 'offline']
  pricing: string[];    // ['free', 'paid']
  category: string[];   // medical categories
}

const EventCalendarWithFilters: React.FC<EventCalendarWithFiltersProps> = ({ 
  darkMode, 
  fontSize, 
  onEventClick 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    eventType: [],
    location: [],
    pricing: [],
    category: []
  });

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          title: 'text-lg',
          text: 'text-sm',
          small: 'text-xs'
        };
      case 'large':
        return {
          title: 'text-2xl',
          text: 'text-lg',
          small: 'text-base'
        };
      default:
        return {
          title: 'text-xl',
          text: 'text-base',
          small: 'text-sm'
        };
    }
  };

  const fontSizes = getFontSizeClasses();

  const categories = [
    { value: 'cardiology', label: 'Kardiologia' },
    { value: 'neurology', label: 'Neurologia' },
    { value: 'oncology', label: 'Onkologia' },
    { value: 'pediatrics', label: 'Pediatria' },
    { value: 'surgery', label: 'Chirurgia' },
    { value: 'internal-medicine', label: 'Medycyna wewnętrzna' },
    { value: 'emergency-medicine', label: 'Medycyna ratunkowa' },
    { value: 'nursing', label: 'Pielęgniarstwo' },
    { value: 'pharmacy', label: 'Farmacja' },
    { value: 'rehabilitation', label: 'Rehabilitacja' },
    { value: 'public-health', label: 'Zdrowie publiczne' },
    { value: 'medical-technology', label: 'Technologie medyczne' },
    { value: 'research', label: 'Badania naukowe' },
    { value: 'management', label: 'Zarządzanie w ochronie zdrowia' },
    { value: 'other', label: 'Inne' }
  ];

  // Load events from local DB
  useEffect(() => {
    loadEvents();
  }, []);

  // Apply filters when filters or events change
  useEffect(() => {
    applyFilters();
  }, [events, filters]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      
      // Get approved events from the database
      const { data, error } = await db
        .from('events')
        .select('*')
        .eq('status', 'approved')
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true });

      if (error) {
        console.error('Error loading events:', error);
        // Fallback to mock data if database fails
        setEvents(getMockEvents());
      } else {
        setEvents(data || []);
      }
    } catch (error) {
      console.error('Error loading events:', error);
      // Fallback to mock data
      setEvents(getMockEvents());
    } finally {
      setLoading(false);
    }
  };

  const getMockEvents = (): Event[] => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    return [
      {
        id: '1',
        title: 'Konferencja Kardiologiczna 2024',
        date: nextWeek.toISOString().split('T')[0] + 'T09:00:00',
        type: 'conference',
        is_online: false,
        is_free: false,
        location: 'Hotel Marriott, Warszawa',
        max_participants: 200,
        organizer_name: 'Polskie Towarzystwo Kardiologiczne',
        category: 'cardiology',
        description: 'Najnowsze trendy w kardiologii, nowoczesne metody leczenia',
        contact_email: 'konferencja@kardiologia.pl',
        ticket_price: 299.99
      },
      {
        id: '2',
        title: 'Webinar: Telemedycyna w praktyce',
        date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T18:00:00',
        type: 'webinar',
        is_online: true,
        is_free: true,
        online_url: 'https://zoom.us/j/123456789',
        max_participants: 100,
        organizer_name: 'Dr Jan Kowalski',
        category: 'medical-technology',
        description: 'Praktyczne aspekty telemedycyny w codziennej praktyce lekarskiej',
        contact_email: 'webinar@telemedycyna.pl'
      },
      {
        id: '3',
        title: 'Szkolenie z resuscytacji',
        date: nextMonth.toISOString().split('T')[0] + 'T10:00:00',
        type: 'conference',
        is_online: false,
        is_free: false,
        location: 'Centrum Szkoleniowe, Kraków',
        max_participants: 50,
        organizer_name: 'Centrum Medyczne ABC',
        category: 'emergency-medicine',
        description: 'Praktyczne szkolenie z zaawansowanych technik resuscytacji',
        contact_email: 'szkolenie@centrum-abc.pl',
        ticket_price: 150.00
      }
    ];
  };

  const applyFilters = () => {
    let filtered = [...events];

    // Filter by event type
    if (filters.eventType.length > 0) {
      filtered = filtered.filter(event => filters.eventType.includes(event.type));
    }

    // Filter by location (online/offline)
    if (filters.location.length > 0) {
      filtered = filtered.filter(event => {
        if (filters.location.includes('online') && event.is_online) return true;
        if (filters.location.includes('offline') && !event.is_online) return true;
        return false;
      });
    }

    // Filter by pricing
    if (filters.pricing.length > 0) {
      filtered = filtered.filter(event => {
        if (filters.pricing.includes('free') && event.is_free) return true;
        if (filters.pricing.includes('paid') && !event.is_free) return true;
        return false;
      });
    }

    // Filter by category
    if (filters.category.length > 0) {
      filtered = filtered.filter(event => 
        event.category && filters.category.includes(event.category)
      );
    }

    setFilteredEvents(filtered);
  };

  const toggleFilter = (filterType: keyof Filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      eventType: [],
      location: [],
      pricing: [],
      category: []
    });
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).reduce((count, arr) => count + arr.length, 0);
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return filteredEvents.filter(event => event.date.startsWith(dateStr));
  };

  const monthNames = [
    'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
    'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
  ];

  const dayNames = ['Pon', 'Wto', 'Śro', 'Czw', 'Pią', 'Sob', 'Nie'];

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-24"></div>);
  }

  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayEvents = getEventsForDate(day);
    const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

    calendarDays.push(
      <div
        key={day}
        className={`h-24 border ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        } p-1 overflow-hidden ${isToday ? 'bg-[#38b6ff] bg-opacity-20' : ''}`}
      >
        <div className={`font-medium mb-1 ${fontSizes.small} ${
          isToday 
            ? 'text-[#38b6ff] font-bold' 
            : darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {day}
        </div>
        <div className="space-y-1">
          {dayEvents.slice(0, 2).map((event) => (
            <div
              key={event.id}
              onClick={() => onEventClick?.(event)}
              className={`p-1 rounded text-xs cursor-pointer transition-colors duration-200 ${
                event.type === 'conference'
                  ? 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
                  : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
              }`}
              title={`${event.title} - ${new Date(event.date).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}`}
            >
              <div className="flex items-center space-x-1">
                {event.is_online ? (
                  <FaVideo className="w-2 h-2" />
                ) : (
                  <FaBuilding className="w-2 h-2" />
                )}
                {!event.is_free && <FaMoneyBillWave className="w-2 h-2" />}
                <span className="truncate">{event.title.substring(0, 12)}...</span>
              </div>
            </div>
          ))}
          {dayEvents.length > 2 && (
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              +{dayEvents.length - 2} więcej
            </div>
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`rounded-lg shadow-lg p-8 text-center ${
        darkMode ? 'bg-black border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#38b6ff] mx-auto mb-4"></div>
        <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Ładowanie wydarzeń...</p>
      </div>
    );
  }

  return (
    <div className={`rounded-lg shadow-lg ${
      darkMode ? 'bg-black border border-gray-700' : 'bg-white border border-gray-200'
    }`}>
      {/* Calendar Header */}
      <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`${fontSizes.title} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <FaCalendarAlt className="inline mr-2 text-[#38b6ff]" />
            Kalendarz wydarzeń
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`relative p-2 rounded-lg transition-colors duration-200 ${
                darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
              } ${getActiveFiltersCount() > 0 ? 'text-[#38b6ff]' : ''}`}
            >
              <FaFilter />
              {getActiveFiltersCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#38b6ff] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getActiveFiltersCount()}
                </span>
              )}
            </button>
            <button
              onClick={() => navigateMonth('prev')}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <FaChevronLeft />
            </button>
            <span className={`${fontSizes.text} font-medium ${darkMode ? 'text-white' : 'text-gray-900'} min-w-[120px] text-center`}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button
              onClick={() => navigateMonth('next')}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className={`p-4 rounded-lg mb-4 ${
            darkMode ? 'bg-gray-800' : 'bg-gray-50'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h4 className={`font-semibold ${fontSizes.text} ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Filtry
              </h4>
              <div className="flex space-x-2">
                <button
                  onClick={clearAllFilters}
                  className={`text-sm px-3 py-1 rounded ${
                    darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Wyczyść wszystkie
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className={`p-1 rounded ${
                    darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FaTimes />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Event Type Filter */}
              <div>
                <h5 className={`font-medium mb-2 ${fontSizes.small} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Typ wydarzenia
                </h5>
                <div className="space-y-2">
                  {[
                    { value: 'conference', label: 'Konferencje' },
                    { value: 'webinar', label: 'Webinary' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.eventType.includes(option.value)}
                        onChange={() => toggleFilter('eventType', option.value)}
                        className="rounded border-gray-300 text-[#38b6ff] focus:ring-[#38b6ff] mr-2"
                      />
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <h5 className={`font-medium mb-2 ${fontSizes.small} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Lokalizacja
                </h5>
                <div className="space-y-2">
                  {[
                    { value: 'online', label: 'Online' },
                    { value: 'offline', label: 'Stacjonarne' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.location.includes(option.value)}
                        onChange={() => toggleFilter('location', option.value)}
                        className="rounded border-gray-300 text-[#38b6ff] focus:ring-[#38b6ff] mr-2"
                      />
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Pricing Filter */}
              <div>
                <h5 className={`font-medium mb-2 ${fontSizes.small} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Płatność
                </h5>
                <div className="space-y-2">
                  {[
                    { value: 'free', label: 'Bezpłatne' },
                    { value: 'paid', label: 'Płatne' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.pricing.includes(option.value)}
                        onChange={() => toggleFilter('pricing', option.value)}
                        className="rounded border-gray-300 text-[#38b6ff] focus:ring-[#38b6ff] mr-2"
                      />
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <h5 className={`font-medium mb-2 ${fontSizes.small} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Kategoria
                </h5>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {categories.map((category) => (
                    <label key={category.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.category.includes(category.value)}
                        onChange={() => toggleFilter('category', category.value)}
                        className="rounded border-gray-300 text-[#38b6ff] focus:ring-[#38b6ff] mr-2"
                      />
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {category.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center justify-center space-x-4 text-xs flex-wrap">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-[#38b6ff] rounded"></div>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Konferencje</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-purple-100 rounded border border-purple-200"></div>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Webinary</span>
          </div>
          <div className="flex items-center space-x-1">
            <FaVideo className="w-3 h-3 text-gray-500" />
            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Online</span>
          </div>
          <div className="flex items-center space-x-1">
            <FaBuilding className="w-3 h-3 text-gray-500" />
            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Stacjonarne</span>
          </div>
          <div className="flex items-center space-x-1">
            <FaMoneyBillWave className="w-3 h-3 text-gray-500" />
            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Płatne</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((dayName) => (
            <div
              key={dayName}
              className={`text-center py-2 ${fontSizes.small} font-medium ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {dayName}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays}
        </div>
      </div>

      {/* Events Summary */}
      <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <p className={`text-center ${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Wyświetlane wydarzenia: {filteredEvents.length} z {events.length}
          {getActiveFiltersCount() > 0 && ` (zastosowane filtry: ${getActiveFiltersCount()})`}
        </p>
      </div>
    </div>
  );
};

export default EventCalendarWithFilters;