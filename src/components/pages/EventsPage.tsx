import React, { useState, useEffect, useMemo } from 'react';
import { CalendarIcon, SearchIcon, LocationIcon, FilterIcon, SortIcon, ArrowLeftIcon, ArrowRightIcon, StarIcon, TrophyIcon, ClockIcon } from '../icons/CustomIcons';
import EventCalendar from '../EventCalendar';
import { getEvents } from '../../services/mockEventsService';
import { Event as LocalEvent } from '../../types';
import EventFavoriteButton from '../events/EventFavoriteButton';
import EventShareButton from '../events/EventShareButton';
import EventCard from '../events/EventCard';
import EventStats from '../events/EventStats';
import EventRecommendations from '../events/EventRecommendations';
import UpcomingEventsBanner from '../events/UpcomingEventsBanner';
import EventSearchSuggestions from '../events/EventSearchSuggestions';
import QuickFilters from '../events/QuickFilters';
import SavedFilters from '../events/SavedFilters';
import PopularEvents from '../events/PopularEvents';
import EventHistory from '../events/EventHistory';
import EventListExport from '../events/EventListExport';
import EventNotifications from '../events/EventNotifications';

interface Event {
  id: number;
  name: string;
  slug: string;
  date: string;
  time: string;
  location: string;
  type: 'online' | 'stacjonarny';
  eventType: 'conference' | 'webinar';
  description: string;
  fullDescription: string;
  price: string;
  isFree: boolean;
  category: string;
  maxParticipants?: number;
  currentParticipants?: number;
  organizer?: {
    name: string;
    email: string;
    phone: string;
    website?: string;
  };
  address?: string;
  mapUrl?: string;
  speakers?: string;
  program?: string;
  certificatesAvailable?: boolean;
  cmePoints?: number;
}

interface Registration {
  id: number;
  eventId: number;
  firstName: string;
  lastName: string;
  email: string;
  registrationDate: string;
}

interface EventsPageProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

type SortOption = 'date-asc' | 'date-desc' | 'price-asc' | 'price-desc' | 'participants-asc' | 'participants-desc' | 'name-asc' | 'name-desc';

const EventsPage: React.FC<EventsPageProps> = ({ darkMode, fontSize }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedEventType, setSelectedEventType] = useState<'all' | 'conferences' | 'webinars'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [registrationForm, setRegistrationForm] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Nowe stany dla sortowania i paginacji
  const [sortBy, setSortBy] = useState<SortOption>('date-asc');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [dateRange, setDateRange] = useState<'all' | 'week' | 'month' | 'quarter'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [showFilters, setShowFilters] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [discoveryTab, setDiscoveryTab] = useState<'recommended' | 'popular' | 'history'>('recommended');

  useEffect(() => {
    document.title = 'Wydarzenia medyczne | DlaMedica.pl';

    let descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      descriptionMeta.setAttribute('content', 'Odkryj nadchodzące wydarzenia medyczne, konferencje, szkolenia i webinary. Zapisz się już dziś!');
    }

    let ogTitleMeta = document.querySelector('meta[property="og:title"]');
    if (ogTitleMeta) {
      ogTitleMeta.setAttribute('content', 'Wydarzenia medyczne | DlaMedica.pl');
    }

    let ogDescriptionMeta = document.querySelector('meta[property="og:description"]');
    if (ogDescriptionMeta) {
      ogDescriptionMeta.setAttribute('content', 'Przeglądaj nadchodzące wydarzenia medyczne, konferencje i szkolenia dla specjalistów ochrony zdrowia.');
    }

    // Wczytaj rejestracje z localStorage
    const savedRegistrations = localStorage.getItem('eventRegistrations');
    if (savedRegistrations) {
      try {
        setRegistrations(JSON.parse(savedRegistrations));
      } catch (e) {
        console.error('Error parsing event registrations:', e);
        localStorage.removeItem('eventRegistrations');
      }
    }

    // Załaduj wydarzenia z local DB
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiEvents = await getEvents();

      // Mapuj wydarzenia z API do lokalnego interfejsu
      const mappedEvents: Event[] = apiEvents.map((event: any) => {
        // Extract date and time from start_date (TIMESTAMPTZ)
        const dateObj = new Date(event.start_date);
        const dateStr = dateObj.toISOString().split('T')[0];
        const timeStr = dateObj.toTimeString().split(' ')[0].substring(0, 5);

        return {
          id: typeof event.id === 'string' ? parseInt(event.id.replace(/\D/g, '').substring(0, 8) || '0', 16) : event.id, // Generate pseudo-ID from UUID if needed
          name: event.title,
          slug: `${event.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')}-${event.id.substring(0, 8)}`,
          date: dateStr,
          time: timeStr,
          location: event.is_online ? 'Online' : (event.location || 'Nie podano'),
          type: event.is_online ? 'online' : 'stacjonarny',
          eventType: event.event_type || 'conference',
          description: event.description && event.description.length > 100 ? event.description.substring(0, 100) + '...' : (event.description || ''),
          fullDescription: event.description || '',
          price: event.price === 0 || !event.price ? 'Bezpłatne' : `${event.price} ${event.currency || 'PLN'}`,
          isFree: event.price === 0 || !event.price,
          category: event.event_type === 'conference' ? 'Konferencja' : 'Webinar',
          maxParticipants: event.max_participants || 100,
          currentParticipants: event.current_participants || 0,
          organizer: {
            name: event.organizer || 'Organizator',
            email: event.contact_email || 'kontakt@dlamedica.pl',
            phone: '',
            website: event.registration_url || undefined
          },
          address: event.location,
          mapUrl: undefined,
          speakers: '',
          program: '',
          certificatesAvailable: false,
          cmePoints: 0
        };
      });

      setEvents(mappedEvents);
    } catch (err) {
      console.error('Error loading events:', err);
      setError('Nie udało się załadować wydarzeń. Wyświetlane są przykładowe dane.');

      // Fallback to mock data if local DB fails
      setEvents(getMockEvents());
    } finally {
      setLoading(false);
    }
  };

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          title: 'text-2xl md:text-3xl',
          subtitle: 'text-base md:text-lg',
          cardTitle: 'text-lg md:text-xl',
          cardText: 'text-sm md:text-base',
          buttonText: 'text-sm'
        };
      case 'large':
        return {
          title: 'text-4xl md:text-5xl',
          subtitle: 'text-xl md:text-2xl',
          cardTitle: 'text-2xl md:text-3xl',
          cardText: 'text-lg md:text-xl',
          buttonText: 'text-lg'
        };
      default:
        return {
          title: 'text-3xl md:text-4xl',
          subtitle: 'text-lg md:text-xl',
          cardTitle: 'text-xl md:text-2xl',
          cardText: 'text-base md:text-lg',
          buttonText: 'text-base'
        };
    }
  };

  const fontSizes = getFontSizeClasses();

  // Funkcja zwracająca mockowane dane jako fallback
  const getMockEvents = (): Event[] => [
    {
      id: 1,
      name: 'Konferencja Kardiologii Interwencyjnej 2024',
      slug: 'konferencja-kardiologii-interwencyjnej-2024',
      date: '2024-03-15',
      time: '09:00',
      location: 'Warszawa',
      type: 'stacjonarny',
      eventType: 'conference',
      description: 'Najnowsze techniki w kardiologii interwencyjnej. Wykłady prowadzone przez uznanych specjalistów z całej Europy.',
      fullDescription: 'Prestiżowa konferencja kardiologii interwencyjnej z udziałem ekspertów z całej Europy. Program obejmuje najnowsze techniki PCI, nowoczesne stenty, zabiegi strukturalne serca oraz warsztaty praktyczne. Uczestnicy otrzymają certyfikat uczestnictwa oraz materiały konferencyjne.',
      price: 'Bilet od 299 zł',
      isFree: false,
      category: 'Konferencja',
      maxParticipants: 200,
      currentParticipants: 156,
      organizer: {
        name: 'Polskie Towarzystwo Kardiologiczne',
        email: 'konferencja@ptk.org.pl',
        phone: '+48 22 123 45 67',
        website: 'https://www.ptk.org.pl'
      },
      address: 'Hotel Marriott, ul. Chałubińskiego 7, 00-613 Warszawa',
      mapUrl: 'https://maps.google.com/embed?pb=!1m18!1m12!1m3!1d2443.2!2d21.0!3d52.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1'
    },
    {
      id: 2,
      name: 'Webinar: AI w Diagnostyce Medycznej',
      slug: 'webinar-ai-w-diagnostyce-medycznej',
      date: '2024-02-28',
      time: '18:00',
      location: 'Online',
      type: 'online',
      eventType: 'webinar',
      description: 'Jak sztuczna inteligencja rewolucjonizuje diagnostykę medyczną. Praktyczne zastosowania i przyszłość technologii.',
      fullDescription: 'Kompleksowy webinar o zastosowaniu sztucznej inteligencji w medycynie. Omówimy najnowsze rozwiązania AI w obrazowaniu medycznym, diagnostyce laboratoryjnej oraz wspomaganiu decyzji klinicznych. Wykład prowadzony przez specjalistów z zakresu informatyki medycznej.',
      price: 'Bezpłatne',
      isFree: true,
      category: 'Webinar',
      maxParticipants: 500,
      currentParticipants: 342,
      organizer: {
        name: 'Instytut Informatyki Medycznej',
        email: 'webinar@iim.pl',
        phone: '+48 12 345 67 89'
      }
    },
    {
      id: 3,
      name: 'Webinar: Resuscytacja Krążeniowo-Oddechowa',
      slug: 'webinar-resuscytacja-krazeniowo-oddechowa',
      date: '2024-03-02',
      time: '18:00',
      location: 'Online',
      type: 'online',
      eventType: 'webinar',
      description: 'Praktyczne wskazówki z najnowszych wytycznych ERC. Dostępne dla wszystkich specjalistów.',
      fullDescription: 'Webinar z resuscytacji krążeniowo-oddechowej zgodnie z najnowszymi wytycznymi ERC 2021. Program obejmuje BLS, ALS, algorytmy postępowania oraz przypadki kliniczne. Szkolenie dostępne dla wszystkich pracowników służby zdrowia.',
      price: 'Bezpłatne',
      isFree: true,
      category: 'Webinar',
      maxParticipants: 200,
      currentParticipants: 118,
      organizer: {
        name: 'Centrum Symulacji Medycznej UJ',
        email: 'webinary@csm.uj.edu.pl',
        phone: '+48 12 421 39 40'
      }
    },
    {
      id: 4,
      name: 'Konferencja Onkologii Klinicznej',
      slug: 'konferencja-onkologii-klinicznej',
      date: '2024-04-10',
      time: '08:30',
      location: 'Gdańsk',
      type: 'stacjonarny',
      eventType: 'conference',
      description: 'Nowe terapie w onkologii. Prezentacja wyników najnowszych badań klinicznych.',
      fullDescription: 'Międzynarodowa konferencja onkologii klinicznej z udziałem ekspertów z Europy i USA. Program obejmuje najnowsze terapie celowane, immunoterapię, precyzyjną onkologię oraz przypadki kliniczne. Prezentacja wyników przełomowych badań klinicznych III fazy.',
      price: 'Bilet od 199 zł',
      isFree: false,
      category: 'Konferencja',
      maxParticipants: 150,
      currentParticipants: 89,
      organizer: {
        name: 'Polskie Towarzystwo Onkologii Klinicznej',
        email: 'konferencja@ptok.pl',
        phone: '+48 58 349 12 34'
      },
      address: 'Centrum Konferencyjne Olivia, ul. Olivia Business Centre 1, 80-299 Gdańsk',
      mapUrl: 'https://maps.google.com/embed?pb=!1m18!1m12!1m3!1d2324.1!2d18.6!3d54.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1'
    },
    {
      id: 5,
      name: 'Webinar: Pierwsza Pomoc w Praktyce',
      slug: 'webinar-pierwsza-pomoc',
      date: '2024-02-25',
      time: '18:00',
      location: 'Online',
      type: 'online',
      eventType: 'webinar',
      description: 'Podstawy pierwszej pomocy dla personelu medycznego. Aktualizacja wiedzy zgodnie z najnowszymi standardami.',
      fullDescription: 'Webinar z pierwszej pomocy dla pracowników służby zdrowia. Program obejmuje aktualne standardy ERC, algorytmy postępowania w stanach nagłych oraz praktyczne wskazówki. Szkolenie prowadzone przez certyfikowanych instruktorów.',
      price: 'Bezpłatne',
      isFree: true,
      category: 'Webinar',
      maxParticipants: 300,
      currentParticipants: 167,
      organizer: {
        name: 'Fundacja Ratownictwa Medycznego',
        email: 'webinary@frm.org.pl',
        phone: '+48 22 567 89 01'
      }
    },
    {
      id: 6,
      name: 'Konferencja Farmakologii Klinicznej',
      slug: 'konferencja-farmakologii-klinicznej',
      date: '2024-01-15',
      time: '09:00',
      location: 'Wrocław',
      type: 'stacjonarny',
      eventType: 'conference',
      description: 'Interakcje leków i bezpieczeństwo farmakoterapii. Przypadki kliniczne i dyskusja panelowa.',
      fullDescription: 'Konferencja farmakologii klinicznej poświęcona bezpieczeństwu farmakoterapii. Program obejmuje interakcje lekowe, działania niepożądane, farmakogenetykę oraz optymalizację terapii u pacjentów wielochorobowych. Sesje przypadków klinicznych i dyskusje panelowe.',
      price: 'Bilet od 249 zł',
      isFree: false,
      category: 'Konferencja',
      maxParticipants: 80,
      currentParticipants: 80,
      organizer: {
        name: 'Polskie Towarzystwo Farmakologii',
        email: 'konferencja@ptf.med.pl',
        phone: '+48 71 328 45 67'
      },
      address: 'Uniwersytet Medyczny, ul. Chałubińskiego 6a, 50-368 Wrocław',
      mapUrl: 'https://maps.google.com/embed?pb=!1m18!1m12!1m3!1d2504.7!2d17.0!3d51.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1'
    }
  ];

  // Funkcja do ekstrakcji ceny z stringa
  const extractPrice = (priceStr: string): number => {
    if (priceStr.toLowerCase().includes('bezpłatne') || priceStr.toLowerCase().includes('darmowe')) {
      return 0;
    }
    const match = priceStr.match(/(\d+)/);
    return match ? parseInt(match[1]) : Infinity;
  };

  // Funkcja sprawdzająca czy wydarzenie mieści się w zakresie dat
  const isInDateRange = (dateString: string): boolean => {
    if (dateRange === 'all') return true;

    const eventDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const daysDiff = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    switch (dateRange) {
      case 'week':
        return daysDiff >= 0 && daysDiff <= 7;
      case 'month':
        return daysDiff >= 0 && daysDiff <= 30;
      case 'quarter':
        return daysDiff >= 0 && daysDiff <= 90;
      default:
        return true;
    }
  };

  // Filtrowanie wydarzeń
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Filtr wyszukiwania
      if (searchTerm && !event.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !event.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Filtr typu wydarzenia (online/stacjonarny)
      if (selectedType && event.type !== selectedType) {
        return false;
      }

      // Filtr rodzaju wydarzenia (konferencje/webinary)
      if (selectedEventType && selectedEventType !== 'all') {
        if (selectedEventType === 'conferences' && event.eventType !== 'conference') {
          return false;
        }
        if (selectedEventType === 'webinars' && event.eventType !== 'webinar') {
          return false;
        }
      }

      // Filtr ceny
      if (priceFilter !== 'all') {
        if (priceFilter === 'free' && !event.isFree) {
          return false;
        }
        if (priceFilter === 'paid' && event.isFree) {
          return false;
        }
      }

      // Filtr zakresu dat
      if (!isInDateRange(event.date)) {
        return false;
      }

      return true;
    });
  }, [events, searchTerm, selectedType, selectedEventType, priceFilter, dateRange]);

  // Sortowanie wydarzeń
  const sortedEvents = useMemo(() => {
    const sorted = [...filteredEvents];

    switch (sortBy) {
      case 'date-asc':
        return sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      case 'date-desc':
        return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case 'price-asc':
        return sorted.sort((a, b) => extractPrice(a.price) - extractPrice(b.price));
      case 'price-desc':
        return sorted.sort((a, b) => extractPrice(b.price) - extractPrice(a.price));
      case 'participants-asc':
        return sorted.sort((a, b) => (a.currentParticipants || 0) - (b.currentParticipants || 0));
      case 'participants-desc':
        return sorted.sort((a, b) => (b.currentParticipants || 0) - (a.currentParticipants || 0));
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name, 'pl'));
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name, 'pl'));
      default:
        return sorted;
    }
  }, [filteredEvents, sortBy]);

  // Paginacja
  const totalPages = Math.ceil(sortedEvents.length / itemsPerPage);
  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedEvents.slice(startIndex, endIndex);
  }, [sortedEvents, currentPage, itemsPerPage]);

  // Resetuj stronę przy zmianie filtrów
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType, selectedEventType, priceFilter, dateRange, sortBy]);

  const handleViewDetails = (event: Event) => {
    // Nawiguj do podstrony szczegółów wydarzenia
    window.history.pushState({}, '', `/wydarzenia/${event.slug}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const closeModals = () => {
    setIsRegistrationModalOpen(false);
    setIsPaymentModalOpen(false);
    setSelectedEvent(null);
    setRegistrationForm({ firstName: '', lastName: '', email: '' });
  };

  const handleSubmitRegistration = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEvent || !registrationForm.firstName.trim() || !registrationForm.lastName.trim() || !registrationForm.email.trim()) {
      return;
    }

    const registration: Registration = {
      id: Date.now(),
      eventId: selectedEvent.id,
      firstName: registrationForm.firstName.trim(),
      lastName: registrationForm.lastName.trim(),
      email: registrationForm.email.trim(),
      registrationDate: new Date().toISOString()
    };

    const updatedRegistrations = [...registrations, registration];
    setRegistrations(updatedRegistrations);
    localStorage.setItem('eventRegistrations', JSON.stringify(updatedRegistrations));

    alert('Rejestracja została pomyślnie zapisana!');
    closeModals();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isEventPast = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate < today;
  };


  return (
    <div className={`relative min-h-screen py-12 ${darkMode ? 'bg-black' : 'bg-white'} transition-colors duration-300 overflow-hidden`}>
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className={`absolute inset-0 ${darkMode
          ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900'
          : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
          }`}>
          <div className={`absolute inset-0 ${darkMode
            ? 'bg-[radial-gradient(circle_at_20%_30%,rgba(56,182,255,0.15),transparent_60%)]'
            : 'bg-[radial-gradient(circle_at_20%_30%,rgba(56,182,255,0.08),transparent_60%)]'
            }`} />
          <div className={`absolute inset-0 ${darkMode
            ? 'bg-[radial-gradient(circle_at_80%_70%,rgba(147,51,234,0.15),transparent_60%)]'
            : 'bg-[radial-gradient(circle_at_80%_70%,rgba(147,51,234,0.08),transparent_60%)]'
            }`} />
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#38b6ff] to-[#2a9fe5] rounded-2xl flex items-center justify-center shadow-lg">
              <CalendarIcon size={32} color="white" />
            </div>
          </div>
          <h1 className={`font-bold mb-4 ${fontSizes.title} ${darkMode ? 'text-white' : 'text-black'}`}>
            Wydarzenia medyczne
          </h1>
          <p className={`${fontSizes.subtitle} ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto leading-relaxed`}>
            Odkryj nadchodzące wydarzenia medyczne, konferencje, szkolenia i webinary.
            Poszerzaj swoją wiedzę i nawiązuj kontakty zawodowe.
          </p>

          {/* Decorative line */}
          <div className="flex justify-center mt-8">
            <div className="w-24 h-1 bg-[#38b6ff] rounded-full"></div>
          </div>
        </div>

        {/* Dashboard Grid */}
        {!loading && events.length > 0 && (
          <div className="space-y-8 mb-12">
            {/* Stats Row */}
            <EventStats
              totalEvents={events.length}
              upcomingEvents={events.filter(e => !isEventPast(e.date)).length}
              pastEvents={events.filter(e => isEventPast(e.date)).length}
              totalParticipants={events.reduce((sum, e) => sum + (e.currentParticipants || 0), 0)}
              darkMode={darkMode}
            />

            {/* Main Feature Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <UpcomingEventsBanner
                  events={sortedEvents
                    .filter(e => !isEventPast(e.date))
                    .slice(0, 1)
                    .map(e => ({
                      id: e.id,
                      name: e.name,
                      slug: e.slug,
                      date: e.date,
                      time: e.time,
                      location: e.location
                    }))}
                  darkMode={darkMode}
                  onEventClick={handleViewDetails}
                />
              </div>

              <div className="lg:col-span-1">
                <EventNotifications
                  notifications={[]} // TODO: Pobierz z localStorage lub API
                  darkMode={darkMode}
                  onNotificationClick={(slug) => {
                    const event = events.find(e => e.slug === slug);
                    if (event) handleViewDetails(event);
                  }}
                  onMarkAsRead={(id) => console.log('Mark as read:', id)}
                  onDismiss={(id) => console.log('Dismiss:', id)}
                />
              </div>
            </div>

            {/* Discovery Section with Tabs */}
            <div className="space-y-6">
              <div className="flex overflow-x-auto pb-2 gap-2 border-b border-gray-200 dark:border-gray-800 scrollbar-hide">
                <button
                  onClick={() => setDiscoveryTab('recommended')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition-colors whitespace-nowrap ${discoveryTab === 'recommended'
                    ? 'text-[#38b6ff] border-b-2 border-[#38b6ff]'
                    : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <StarIcon size={18} color="currentColor" />
                  Polecane dla Ciebie
                </button>
                <button
                  onClick={() => setDiscoveryTab('popular')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition-colors whitespace-nowrap ${discoveryTab === 'popular'
                    ? 'text-[#38b6ff] border-b-2 border-[#38b6ff]'
                    : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <TrophyIcon size={18} color="currentColor" />
                  Najpopularniejsze
                </button>
                <button
                  onClick={() => setDiscoveryTab('history')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition-colors whitespace-nowrap ${discoveryTab === 'history'
                    ? 'text-[#38b6ff] border-b-2 border-[#38b6ff]'
                    : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <ClockIcon size={18} color="currentColor" />
                  Historia
                </button>
              </div>

              <div className="min-h-[300px]">
                {discoveryTab === 'recommended' && (
                  <EventRecommendations
                    events={sortedEvents
                      .filter(e => !isEventPast(e.date))
                      .slice(0, 3)}
                    darkMode={darkMode}
                    fontSize={fontSize}
                    onViewDetails={handleViewDetails}
                  />
                )}
                {discoveryTab === 'popular' && (
                  <PopularEvents
                    events={sortedEvents.filter(e => !isEventPast(e.date))}
                    darkMode={darkMode}
                    fontSize={fontSize}
                    onViewDetails={handleViewDetails}
                  />
                )}
                {discoveryTab === 'history' && (
                  <EventHistory
                    history={[]} // TODO: Pobierz z localStorage lub API
                    darkMode={darkMode}
                    onEventClick={(slug) => {
                      const event = events.find(e => e.slug === slug);
                      if (event) handleViewDetails(event);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* View Mode Toggle & Filters Wrapper */}
        <div className={`sticky top-4 z-40 mb-8 p-4 rounded-2xl backdrop-blur-xl border shadow-xl transition-colors duration-300 ${darkMode
          ? 'bg-gray-900/80 border-gray-800'
          : 'bg-white/80 border-gray-200'
          }`}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* View Mode Toggle */}
              <div className={`flex rounded-lg border p-1 ${darkMode ? 'border-gray-700 bg-black/50' : 'border-gray-200 bg-gray-50'}`}>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${viewMode === 'grid'
                    ? 'bg-[#38b6ff] text-black shadow-md'
                    : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Lista
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${viewMode === 'calendar'
                    ? 'bg-[#38b6ff] text-black shadow-md'
                    : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Kalendarz
                </button>
              </div>

              {/* Saved Filters */}
              <div className="flex-1">
                <SavedFilters
                  darkMode={darkMode}
                  onApplyFilter={(filters) => {
                    if (filters.eventType) setSelectedEventType(filters.eventType as any);
                    if (filters.type) setSelectedType(filters.type);
                    if (filters.priceFilter) setPriceFilter(filters.priceFilter);
                    if (filters.dateRange) setDateRange(filters.dateRange);
                  }}
                />
              </div>
            </div>

            {/* Quick Filters */}
            <QuickFilters
              filters={[
                {
                  id: 'all',
                  label: 'Wszystkie',
                  count: events.length,
                  active: selectedEventType === 'all' && selectedType === '' && priceFilter === 'all'
                },
                {
                  id: 'conferences',
                  label: 'Konferencje',
                  count: events.filter(e => e.eventType === 'conference').length,
                  active: selectedEventType === 'conferences'
                },
                {
                  id: 'webinars',
                  label: 'Webinary',
                  count: events.filter(e => e.eventType === 'webinar').length,
                  active: selectedEventType === 'webinars'
                },
                {
                  id: 'free',
                  label: 'Bezpłatne',
                  count: events.filter(e => e.isFree).length,
                  active: priceFilter === 'free'
                },
                {
                  id: 'online',
                  label: 'Online',
                  count: events.filter(e => e.type === 'online').length,
                  active: selectedType === 'online'
                },
                {
                  id: 'this-month',
                  label: 'Ten miesiąc',
                  count: events.filter(e => {
                    const eventDate = new Date(e.date);
                    const today = new Date();
                    const daysDiff = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                    return daysDiff >= 0 && daysDiff <= 30;
                  }).length,
                  active: dateRange === 'month'
                }
              ]}
              onFilterClick={(filterId) => {
                switch (filterId) {
                  case 'all':
                    setSelectedEventType('all');
                    setSelectedType('');
                    setPriceFilter('all');
                    setDateRange('all');
                    break;
                  case 'conferences':
                    setSelectedEventType('conferences');
                    break;
                  case 'webinars':
                    setSelectedEventType('webinars');
                    break;
                  case 'free':
                    setPriceFilter('free');
                    break;
                  case 'online':
                    setSelectedType('online');
                    break;
                  case 'this-month':
                    setDateRange('month');
                    break;
                }
              }}
              darkMode={darkMode}
            />

            {/* Main Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <label className={`block text-sm font-medium mb-2 flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <SearchIcon size={18} color="#38b6ff" />
                  Wyszukaj wydarzenie
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSearchSuggestions(e.target.value.length > 0);
                  }}
                  onFocus={() => setShowSearchSuggestions(searchTerm.length > 0)}
                  onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                  placeholder="Nazwa wydarzenia..."
                  className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] focus:border-[#38b6ff] ${darkMode
                    ? 'bg-black border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                />
                <EventSearchSuggestions
                  suggestions={events
                    .filter(e =>
                      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      e.description.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .slice(0, 5)
                    .map(e => ({
                      id: e.id,
                      name: e.name,
                      slug: e.slug
                    }))}
                  onSuggestionClick={(event) => {
                    setSearchTerm(event.name);
                    setShowSearchSuggestions(false);
                    handleViewDetails(event as Event);
                  }}
                  darkMode={darkMode}
                  visible={showSearchSuggestions}
                />
              </div>

              {/* Location Type Filter */}
              <div>
                <label className={`block text-sm font-medium mb-2 flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <LocationIcon size={18} color="#38b6ff" />
                  Lokalizacja
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] focus:border-[#38b6ff] ${darkMode
                    ? 'bg-black border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                    }`}
                >
                  <option value="">Wszystkie</option>
                  <option value="online">Online</option>
                  <option value="stacjonarny">Stacjonarne</option>
                </select>
              </div>

              {/* Event Type Filter */}
              <div>
                <label className={`block text-sm font-medium mb-2 flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <CalendarIcon size={18} color="#38b6ff" />
                  Rodzaj wydarzenia
                </label>
                <select
                  value={selectedEventType}
                  onChange={(e) => setSelectedEventType(e.target.value as 'all' | 'conferences' | 'webinars')}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] focus:border-[#38b6ff] ${darkMode
                    ? 'bg-black border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                    }`}
                >
                  <option value="all">Wszystkie</option>
                  <option value="conferences">Konferencje</option>
                  <option value="webinars">Webinary</option>
                </select>
              </div>
            </div>

            {/* Advanced Filters and Sort Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                {/* Advanced Filters Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${showFilters
                    ? 'bg-[#38b6ff] text-black'
                    : darkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  <FilterIcon size={18} color="currentColor" />
                  <span className="ml-2">{showFilters ? 'Ukryj filtry' : 'Więcej filtrów'}</span>
                </button>

                {/* Sort */}
                <div className="flex items-center gap-2">
                  <SortIcon size={18} color={darkMode ? '#9ca3af' : '#4b5563'} />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className={`px-4 py-2 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] focus:border-[#38b6ff] ${darkMode
                      ? 'bg-black border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                      }`}
                  >
                    <option value="date-asc">Data: najbliższe</option>
                    <option value="date-desc">Data: najdalsze</option>
                    <option value="price-asc">Cena: od najniższej</option>
                    <option value="price-desc">Cena: od najwyższej</option>
                    <option value="participants-desc">Najpopularniejsze</option>
                    <option value="name-asc">Nazwa: A-Z</option>
                    <option value="name-desc">Nazwa: Z-A</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Results Count */}
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Znaleziono: <span className="font-semibold text-[#38b6ff]">{filteredEvents.length}</span> wydarzeń
                </div>

                {/* Export */}
                {sortedEvents.length > 0 && (
                  <EventListExport
                    events={sortedEvents.map(e => ({
                      id: e.id,
                      name: e.name,
                      date: e.date,
                      time: e.time,
                      location: e.location,
                      type: e.type,
                      eventType: e.eventType,
                      price: e.price
                    }))}
                    darkMode={darkMode}
                  />
                )}
              </div>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className={`mt-4 p-4 rounded-lg border transition-all duration-300 ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'
                }`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {/* Price Filter */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Cena
                    </label>
                    <select
                      value={priceFilter}
                      onChange={(e) => setPriceFilter(e.target.value as 'all' | 'free' | 'paid')}
                      className={`w-full px-4 py-2 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] focus:border-[#38b6ff] ${darkMode
                        ? 'bg-black border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                        }`}
                    >
                      <option value="all">Wszystkie</option>
                      <option value="free">Bezpłatne</option>
                      <option value="paid">Płatne</option>
                    </select>
                  </div>

                  {/* Date Range Filter */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Zakres dat
                    </label>
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value as 'all' | 'week' | 'month' | 'quarter')}
                      className={`w-full px-4 py-2 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] focus:border-[#38b6ff] ${darkMode
                        ? 'bg-black border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                        }`}
                    >
                      <option value="all">Wszystkie</option>
                      <option value="week">Następny tydzień</option>
                      <option value="month">Następny miesiąc</option>
                      <option value="quarter">Następne 3 miesiące</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#38b6ff] mb-4"></div>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Ładowanie wydarzeń...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className={`text-center py-8 px-4 rounded-lg mb-8 ${darkMode ? 'bg-red-900 bg-opacity-30 border border-red-700' : 'bg-red-50 border border-red-200'
            }`}>
            <p className={`${darkMode ? 'text-red-300' : 'text-red-700'}`}>
              {error}
            </p>
          </div>
        )}

        {/* Events Display */}
        {!loading && viewMode === 'calendar' ? (
          <EventCalendar
            events={sortedEvents}
            darkMode={darkMode}
            fontSize={fontSize}
            onEventClick={handleViewDetails}
          />
        ) : !loading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedEvents.map((event, index) => (
                <EventCard
                  key={event.id}
                  event={event}
                  darkMode={darkMode}
                  fontSize={fontSize}
                  onViewDetails={handleViewDetails}
                  index={index}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 ${currentPage === 1
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : darkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                >
                  <ArrowLeftIcon size={16} color="currentColor" />
                  Poprzednia
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-4 py-2 rounded-lg transition-colors duration-200 ${currentPage === pageNum
                          ? 'bg-[#38b6ff] text-black font-semibold'
                          : darkMode
                            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 ${currentPage === totalPages
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : darkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                >
                  Następna
                  <ArrowRightIcon size={16} color="currentColor" />
                </button>
              </div>
            )}

            {/* Page Info */}
            {totalPages > 1 && (
              <div className={`text-center mt-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Strona {currentPage} z {totalPages} •
                Wyświetlanie {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, sortedEvents.length)} z {sortedEvents.length} wydarzeń
              </div>
            )}
          </>
        )}

        {/* No Results */}
        {!loading && filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <div className={`text-6xl mb-6 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
              📅
            </div>
            <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Nie znaleziono wydarzeń
            </h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Spróbuj zmienić kryteria wyszukiwania
            </p>
          </div>
        )}
      </div>

      {/* Registration Modal */}
      {isRegistrationModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg shadow-xl max-w-md w-full ${darkMode ? 'bg-black border border-gray-700' : 'bg-white'
            }`}>
            {/* Modal Header */}
            <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Zapisz się na wydarzenie
                </h2>
                <button
                  onClick={closeModals}
                  className={`p-2 rounded-lg transition-colors duration-200 ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                    }`}
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="mb-4">
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedEvent.name}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {formatDate(selectedEvent.date)} • {selectedEvent.time}
                </p>
              </div>

              <form onSubmit={handleSubmitRegistration} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Imię *
                  </label>
                  <input
                    type="text"
                    value={registrationForm.firstName}
                    onChange={(e) => setRegistrationForm({ ...registrationForm, firstName: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] focus:border-[#38b6ff] ${darkMode
                      ? 'bg-black border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    placeholder="Twoje imię"
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Nazwisko *
                  </label>
                  <input
                    type="text"
                    value={registrationForm.lastName}
                    onChange={(e) => setRegistrationForm({ ...registrationForm, lastName: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] focus:border-[#38b6ff] ${darkMode
                      ? 'bg-black border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    placeholder="Twoje nazwisko"
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    E-mail *
                  </label>
                  <input
                    type="email"
                    value={registrationForm.email}
                    onChange={(e) => setRegistrationForm({ ...registrationForm, email: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] focus:border-[#38b6ff] ${darkMode
                      ? 'bg-black border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    placeholder="twoj.email@example.com"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 px-6 font-semibold rounded-lg transition-all duration-200 bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg"
                >
                  Zapisz się na wydarzenie
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {isPaymentModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg shadow-xl max-w-md w-full ${darkMode ? 'bg-black border border-gray-700' : 'bg-white'
            }`}>
            {/* Modal Header */}
            <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Zakup biletu
                </h2>
                <button
                  onClick={closeModals}
                  className={`p-2 rounded-lg transition-colors duration-200 ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                    }`}
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-[#38b6ff] rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FaCalendarAlt className="text-white text-2xl" />
                </div>
                <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedEvent.name}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                  {formatDate(selectedEvent.date)} • {selectedEvent.time}
                </p>
                <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedEvent.price}
                </p>
              </div>

              <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <p className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Funkcja płatności dostępna wkrótce
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Pracujemy nad integracją z systemem płatności.
                  W międzyczasie skontaktuj się z nami telefonicznie lub mailowo.
                </p>
              </div>

              <button
                onClick={closeModals}
                className="w-full py-3 px-6 font-semibold rounded-lg transition-all duration-200 bg-[#38b6ff] text-black hover:bg-[#2a9fe5] shadow-md hover:shadow-lg"
              >
                Zamknij
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;