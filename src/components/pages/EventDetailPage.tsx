import React, { useState, useEffect, useMemo } from 'react';
import { 
  CalendarIcon, 
  LocationIcon, 
  UsersIcon, 
  VideoIcon, 
  BuildingIcon, 
  ArrowLeftIcon, 
  EmailIcon, 
  PhoneIcon, 
  GlobeIcon, 
  CheckIcon,
  CloseIcon
} from '../icons/CustomIcons';
import EventFavoriteButton from '../events/EventFavoriteButton';
import EventShareButton from '../events/EventShareButton';
import EventCalendarExport from '../events/EventCalendarExport';

interface Event {
  id: number;
  name: string;
  slug: string;
  date: string;
  time: string;
  location: string;
  type: 'online' | 'stacjonarny';
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
  phone?: string;
  organization?: string;
  agreeToTerms: boolean;
  agreeToMarketing: boolean;
  registrationDate: string;
}

interface EventDetailPageProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  slug: string | null;
}

const EventDetailPage: React.FC<EventDetailPageProps> = ({ darkMode, fontSize, slug }) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [registrationForm, setRegistrationForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    agreeToTerms: false,
    agreeToMarketing: false
  });

  useEffect(() => {
    // Wczytaj rejestracje z localStorage
    const savedRegistrations = localStorage.getItem('eventRegistrations');
    if (savedRegistrations) {
      setRegistrations(JSON.parse(savedRegistrations));
    }

    // Znajdź wydarzenie na podstawie slug
    const foundEvent = events.find(evt => evt.slug === slug);
    if (foundEvent) {
      setEvent(foundEvent);
      document.title = `${foundEvent.name} | DlaMedica.pl`;
    }
  }, [slug]);

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

  // Mockowane dane wydarzeń (te same co w EventsPage)
  const events: Event[] = [
    {
      id: 1,
      name: 'Konferencja Kardiologii Interwencyjnej 2024',
      slug: 'konferencja-kardiologii-interwencyjnej-2024',
      date: '2024-03-15',
      time: '09:00',
      location: 'Warszawa',
      type: 'stacjonarny',
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
      name: 'Szkolenie z Resuscytacji Krążeniowo-Oddechowej',
      slug: 'szkolenie-resuscytacji-krazeniowo-oddechowej',
      date: '2024-03-02',
      time: '10:00',
      location: 'Kraków',
      type: 'stacjonarny',
      description: 'Praktyczne szkolenie z najnowszych wytycznych ERC. Certyfikat ważny 2 lata.',
      fullDescription: 'Intensywne szkolenie praktyczne z resuscytacji krążeniowo-oddechowej zgodnie z najnowszymi wytycznymi ERC 2021. Program obejmuje BLS, ALS, algorytmy postępowania oraz praktykę na fantomach. Po ukończeniu uczestnicy otrzymują certyfikat ważny przez 2 lata.',
      price: 'Bilet od 149 zł',
      isFree: false,
      category: 'Szkolenie',
      maxParticipants: 20,
      currentParticipants: 18,
      organizer: {
        name: 'Centrum Symulacji Medycznej UJ',
        email: 'szkolenia@csm.uj.edu.pl',
        phone: '+48 12 421 39 40'
      },
      address: 'Centrum Symulacji Medycznej, ul. Św. Łazarza 16, 31-530 Kraków',
      mapUrl: 'https://maps.google.com/embed?pb=!1m18!1m12!1m3!1d2560.8!2d19.9!3d50.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1'
    },
    {
      id: 4,
      name: 'Sympozjum Onkologii Klinicznej',
      slug: 'sympozjum-onkologii-klinicznej',
      date: '2024-04-10',
      time: '08:30',
      location: 'Gdańsk',
      type: 'stacjonarny',
      description: 'Nowe terapie w onkologii. Prezentacja wyników najnowszych badań klinicznych.',
      fullDescription: 'Międzynarodowe sympozjum onkologii klinicznej z udziałem ekspertów z Europy i USA. Program obejmuje najnowsze terapie celowane, immunoterapię, precyzyjną onkologię oraz przypadki kliniczne. Prezentacja wyników przełomowych badań klinicznych III fazy.',
      price: 'Bilet od 199 zł',
      isFree: false,
      category: 'Sympozjum',
      maxParticipants: 150,
      currentParticipants: 89,
      organizer: {
        name: 'Polskie Towarzystwo Onkologii Klinicznej',
        email: 'sympozjum@ptok.pl',
        phone: '+48 58 349 12 34'
      },
      address: 'Centrum Konferencyjne Olivia, ul. Olivia Business Centre 1, 80-299 Gdańsk',
      mapUrl: 'https://maps.google.com/embed?pb=!1m18!1m12!1m3!1d2324.1!2d18.6!3d54.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1'
    },
    {
      id: 5,
      name: 'Bezpłatne Szkolenie: Pierwsza Pomoc w Praktyce',
      slug: 'bezplatne-szkolenie-pierwsza-pomoc',
      date: '2024-02-25',
      time: '14:00',
      location: 'Online',
      type: 'online',
      description: 'Podstawy pierwszej pomocy dla personelu medycznego. Aktualizacja wiedzy zgodnie z najnowszymi standardami.',
      fullDescription: 'Bezpłatne szkolenie online z pierwszej pomocy dla pracowników służby zdrowia. Program obejmuje aktualne standardy ERC, algorytmy postępowania w stanach nagłych oraz praktyczne wskazówki. Szkolenie prowadzone przez certyfikowanych instruktorów.',
      price: 'Bezpłatne',
      isFree: true,
      category: 'Szkolenie',
      maxParticipants: 100,
      currentParticipants: 67,
      organizer: {
        name: 'Fundacja Ratownictwa Medycznego',
        email: 'szkolenia@frm.org.pl',
        phone: '+48 22 567 89 01'
      }
    },
    {
      id: 6,
      name: 'Forum Farmakologii Klinicznej',
      slug: 'forum-farmakologii-klinicznej',
      date: '2024-01-15',
      time: '09:00',
      location: 'Wrocław',
      type: 'stacjonarny',
      description: 'Interakcje leków i bezpieczeństwo farmakoterapii. Przypadki kliniczne i dyskusja panelowa.',
      fullDescription: 'Forum farmakologii klinicznej poświęcone bezpieczeństwu farmakoterapii. Program obejmuje interakcje lekowe, działania niepożądane, farmakogenetykę oraz optymalizację terapii u pacjentów wielochorobowych. Sesje przypadków klinicznych i dyskusje panelowe.',
      price: 'Bilet od 249 zł',
      isFree: false,
      category: 'Forum',
      maxParticipants: 80,
      currentParticipants: 80,
      organizer: {
        name: 'Polskie Towarzystwo Farmakologii',
        email: 'forum@ptf.med.pl',
        phone: '+48 71 328 45 67'
      },
      address: 'Uniwersytet Medyczny, ul. Chałubińskiego 6a, 50-368 Wrocław',
      mapUrl: 'https://maps.google.com/embed?pb=!1m18!1m12!1m3!1d2504.7!2d17.0!3d51.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1'
    }
  ];

  const handleRegistration = () => {
    if (!event) return;
    
    if (event.isFree) {
      setIsRegistrationModalOpen(true);
    } else {
      setIsPaymentModalOpen(true);
    }
  };

  const closeModals = () => {
    setIsRegistrationModalOpen(false);
    setIsPaymentModalOpen(false);
    setRegistrationForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      organization: '',
      agreeToTerms: false,
      agreeToMarketing: false
    });
  };

  const handleSubmitRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!event || !registrationForm.firstName.trim() || !registrationForm.lastName.trim() || 
        !registrationForm.email.trim() || !registrationForm.agreeToTerms) {
      return;
    }

    const registration: Registration = {
      id: Date.now(),
      eventId: event.id,
      firstName: registrationForm.firstName.trim(),
      lastName: registrationForm.lastName.trim(),
      email: registrationForm.email.trim(),
      phone: registrationForm.phone.trim(),
      organization: registrationForm.organization.trim(),
      agreeToTerms: registrationForm.agreeToTerms,
      agreeToMarketing: registrationForm.agreeToMarketing,
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

  const getEventIcon = (type: string) => {
    return type === 'online' ? (
      <VideoIcon size={24} color="#38b6ff" />
    ) : (
      <BuildingIcon size={24} color="#38b6ff" />
    );
  };

  // Funkcja do znajdowania podobnych wydarzeń
  const getSimilarEvents = (): Event[] => {
    if (!event) return [];
    
    return events
      .filter(e => 
        e.id !== event.id && 
        !isEventPast(e.date) &&
        (e.eventType === event.eventType || e.category === event.category)
      )
      .sort((a, b) => {
        // Sortuj po podobieństwie (najpierw ten sam typ, potem najbliższa data)
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateA - dateB;
      })
      .slice(0, 6);
  };

  const handleBackToList = () => {
    window.history.pushState({}, '', '/wydarzenia');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  if (!event) {
    return (
      <div className={`min-h-screen py-12 ${darkMode ? 'bg-black' : 'bg-white'} transition-colors duration-300`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className={`text-6xl mb-6 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
              📅
            </div>
            <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Wydarzenie nie zostało znalezione
            </h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
              Sprawdź poprawność adresu URL
            </p>
            <button
              onClick={handleBackToList}
              className="py-2 px-4 font-semibold rounded-lg transition-all duration-200 bg-[#38b6ff] text-black hover:bg-[#2a9fe5] shadow-md hover:shadow-lg"
            >
              <FaArrowLeft className="inline mr-2" />
              Powrót do listy wydarzeń
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isPast = isEventPast(event.date);
  const isFullyBooked = event.currentParticipants === event.maxParticipants;

  return (
    <div className={`min-h-screen py-12 ${darkMode ? 'bg-black' : 'bg-white'} transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
            <button
              onClick={handleBackToList}
              className={`flex items-center py-2 px-4 rounded-lg transition-colors duration-200 ${
                darkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <ArrowLeftIcon size={18} color="currentColor" className="mr-2" />
              Powrót do listy wydarzeń
            </button>
        </div>

        {/* Event Header */}
        <div className={`rounded-lg p-8 mb-8 shadow-lg ${
          darkMode ? 'bg-black border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          {/* Event Type & Status */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              {getEventIcon(event.type)}
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                event.type === 'online' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {event.type === 'online' ? 'Online' : 'Stacjonarny'}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-[#38b6ff] text-black">
                {event.category}
              </span>
            </div>
            {isPast && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                Zakończone
              </span>
            )}
            {isFullyBooked && !isPast && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                Wyprzedane
              </span>
            )}
          </div>

          {/* Event Name */}
          <h1 className={`${fontSizes.title} font-bold mb-6 ${
            darkMode ? 'text-white' : 'text-gray-900'
          } leading-tight`}>
            {event.name}
          </h1>

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Date & Time */}
            <div className="flex items-center">
              <CalendarIcon size={24} color="#38b6ff" className="mr-3" />
              <div>
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formatDate(event.date)}
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {event.time}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center">
              <LocationIcon size={24} color="#38b6ff" className="mr-3" />
              <div>
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {event.location}
                </p>
                {event.address && (
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {event.address}
                  </p>
                )}
              </div>
            </div>

            {/* Participants */}
            {event.maxParticipants && (
              <div className="flex items-center">
                <UsersIcon size={24} color="#38b6ff" className="mr-3" />
                <div>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {event.currentParticipants}/{event.maxParticipants}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    uczestników
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="mb-6">
            <span className={`text-2xl font-bold ${
              event.isFree 
                ? 'text-green-600' 
                : darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {event.price}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={handleRegistration}
              disabled={isPast || isFullyBooked}
              className={`py-3 px-8 ${fontSizes.buttonText} font-semibold rounded-lg transition-all duration-200 ${
                isPast || isFullyBooked
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : event.isFree
                    ? 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
                    : 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5] shadow-md hover:shadow-lg'
              }`}
            >
              {isPast 
                ? 'Wydarzenie zakończone' 
                : isFullyBooked 
                  ? 'Brak miejsc' 
                  : event.isFree 
                    ? 'Zapisz się' 
                    : 'Kup bilet'
              }
            </button>

            {/* Favorite Button */}
            <EventFavoriteButton
              eventId={event.id}
              darkMode={darkMode}
              size="medium"
            />

            {/* Share Button */}
            <EventShareButton
              event={{
                id: event.id,
                name: event.name,
                slug: event.slug,
                date: event.date,
                description: event.description
              }}
              darkMode={darkMode}
            />
          </div>

          {/* Calendar Export */}
          <div className="mt-4">
            <EventCalendarExport
              event={{
                id: event.id,
                name: event.name,
                date: event.date,
                time: event.time,
                location: event.location,
                description: event.fullDescription,
                address: event.address
              }}
              darkMode={darkMode}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Description */}
          <div className="lg:col-span-2 space-y-8">
            {/* Full Description */}
            <div className={`rounded-lg p-6 shadow-lg ${
              darkMode ? 'bg-black border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <h2 className={`${fontSizes.cardTitle} font-bold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Opis wydarzenia
              </h2>
              <p className={`${fontSizes.cardText} ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              } leading-relaxed`}>
                {event.fullDescription}
              </p>
            </div>

            {/* Program */}
            {event.program && (
              <div className={`rounded-lg p-6 shadow-lg ${
                darkMode ? 'bg-black border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
                <h2 className={`${fontSizes.cardTitle} font-bold mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Program wydarzenia
                </h2>
                <div className={`${fontSizes.cardText} ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                } leading-relaxed whitespace-pre-line`}>
                  {event.program}
                </div>
              </div>
            )}

            {/* Speakers */}
            {event.speakers && (
              <div className={`rounded-lg p-6 shadow-lg ${
                darkMode ? 'bg-black border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
                <h2 className={`${fontSizes.cardTitle} font-bold mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Prelegenci
                </h2>
                <div className={`${fontSizes.cardText} ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                } leading-relaxed whitespace-pre-line`}>
                  {event.speakers}
                </div>
              </div>
            )}

            {/* Certificates & CME Points */}
            {(event.certificatesAvailable || event.cmePoints) && (
              <div className={`rounded-lg p-6 shadow-lg ${
                darkMode ? 'bg-black border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
                <h2 className={`${fontSizes.cardTitle} font-bold mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Certyfikaty i punkty edukacyjne
                </h2>
                <div className="space-y-3">
                  {event.certificatesAvailable && (
                    <div className="flex items-center gap-2">
                      <CheckIcon size={20} color="#10b981" />
                      <span className={`${fontSizes.cardText} ${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        Certyfikat uczestnictwa dostępny
                      </span>
                    </div>
                  )}
                  {event.cmePoints && (
                    <div className="flex items-center gap-2">
                      <UsersIcon size={20} color="#38b6ff" />
                      <span className={`${fontSizes.cardText} ${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        Punkty edukacyjne: <strong className="text-[#38b6ff]">{event.cmePoints}</strong>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Map (for stationary events) */}
            {event.type === 'stacjonarny' && event.mapUrl && (
              <div className={`rounded-lg p-6 shadow-lg ${
                darkMode ? 'bg-black border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
                <h2 className={`${fontSizes.cardTitle} font-bold mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Lokalizacja
                </h2>
                <div className="w-full h-64 rounded-lg overflow-hidden">
                  <iframe
                    src={event.mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Mapa lokalizacji wydarzenia"
                  ></iframe>
                </div>
                {event.address && (
                  <p className={`mt-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {event.address}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Organizer Info */}
          <div className="space-y-6">
            {event.organizer && (
              <div className={`rounded-lg p-6 shadow-lg ${
                darkMode ? 'bg-black border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
                <h2 className={`${fontSizes.cardTitle} font-bold mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Organizator
                </h2>
                <div className="space-y-3">
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {event.organizer.name}
                  </h3>
                  
                  <div className="flex items-center">
                    <EmailIcon size={18} color="#38b6ff" className="mr-3" />
                    <a 
                      href={`mailto:${event.organizer.email}`}
                      className={`text-sm hover:text-[#38b6ff] transition-colors ${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      {event.organizer.email}
                    </a>
                  </div>
                  
                  <div className="flex items-center">
                    <PhoneIcon size={18} color="#38b6ff" className="mr-3" />
                    <a 
                      href={`tel:${event.organizer.phone}`}
                      className={`text-sm hover:text-[#38b6ff] transition-colors ${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      {event.organizer.phone}
                    </a>
                  </div>
                  
                  {event.organizer.website && (
                    <div className="flex items-center">
                      <GlobeIcon size={18} color="#38b6ff" className="mr-3" />
                      <a 
                        href={event.organizer.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-sm hover:text-[#38b6ff] transition-colors ${
                          darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        Strona internetowa
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Similar Events */}
        {getSimilarEvents().length > 0 && (
          <div className="mt-12">
            <h2 className={`${fontSizes.title} font-bold mb-6 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Podobne wydarzenia
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getSimilarEvents().slice(0, 3).map((similarEvent) => (
                <div
                  key={similarEvent.id}
                  onClick={() => {
                    window.history.pushState({}, '', `/wydarzenia/${similarEvent.slug}`);
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }}
                  className={`rounded-lg p-6 shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 cursor-pointer ${
                    darkMode ? 'bg-black border border-gray-700' : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getEventIcon(similarEvent.type)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        similarEvent.eventType === 'conference' 
                          ? 'bg-[#38b6ff] text-black'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {similarEvent.eventType === 'conference' ? 'Konferencja' : 'Webinar'}
                      </span>
                    </div>
                  </div>

                  <h3 className={`${fontSizes.cardTitle} font-bold mb-2 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {similarEvent.name}
                  </h3>

                  <div className="flex items-center mb-2">
                    <CalendarIcon size={16} color="#38b6ff" className="mr-2" />
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {formatDate(similarEvent.date)} • {similarEvent.time}
                    </span>
                  </div>

                  <div className="flex items-center mb-3">
                    <LocationIcon size={16} color="#38b6ff" className="mr-2" />
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {similarEvent.location}
                    </span>
                  </div>

                  <p className={`${fontSizes.cardText} line-clamp-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  } mb-4`}>
                    {similarEvent.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className={`font-semibold ${
                      similarEvent.isFree 
                        ? 'text-green-600' 
                        : darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {similarEvent.price}
                    </span>
                    <button
                      className={`px-4 py-2 ${fontSizes.buttonText} font-semibold rounded-lg transition-all duration-200 bg-[#38b6ff] text-black hover:bg-[#2a9fe5]`}
                    >
                      Zobacz szczegóły
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Registration Modal */}
      {isRegistrationModalOpen && event && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden ${
            darkMode ? 'bg-black border border-gray-700' : 'bg-white'
          }`}>
            {/* Modal Header */}
            <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Zapisz się na wydarzenie
                </h2>
                <button
                  onClick={closeModals}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <CloseIcon size={20} color="currentColor" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="mb-4">
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {event.name}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {formatDate(event.date)} • {event.time}
                </p>
              </div>

              <form onSubmit={handleSubmitRegistration} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Imię *
                    </label>
                    <input
                      type="text"
                      value={registrationForm.firstName}
                      onChange={(e) => setRegistrationForm({...registrationForm, firstName: e.target.value})}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] focus:border-[#38b6ff] ${
                        darkMode
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
                      onChange={(e) => setRegistrationForm({...registrationForm, lastName: e.target.value})}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] focus:border-[#38b6ff] ${
                        darkMode
                          ? 'bg-black border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="Twoje nazwisko"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    E-mail *
                  </label>
                  <input
                    type="email"
                    value={registrationForm.email}
                    onChange={(e) => setRegistrationForm({...registrationForm, email: e.target.value})}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] focus:border-[#38b6ff] ${
                      darkMode
                        ? 'bg-black border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="twoj.email@example.com"
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={registrationForm.phone}
                    onChange={(e) => setRegistrationForm({...registrationForm, phone: e.target.value})}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] focus:border-[#38b6ff] ${
                      darkMode
                        ? 'bg-black border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="+48 123 456 789"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Organizacja/Placówka
                  </label>
                  <input
                    type="text"
                    value={registrationForm.organization}
                    onChange={(e) => setRegistrationForm({...registrationForm, organization: e.target.value})}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] focus:border-[#38b6ff] ${
                      darkMode
                        ? 'bg-black border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Nazwa organizacji"
                  />
                </div>

                {/* RODO Checkboxes */}
                <div className="space-y-3 pt-4 border-t border-gray-300">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      checked={registrationForm.agreeToTerms}
                      onChange={(e) => setRegistrationForm({...registrationForm, agreeToTerms: e.target.checked})}
                      className="mt-1 w-4 h-4 text-[#38b6ff] border-gray-300 rounded focus:ring-[#38b6ff]"
                      required
                    />
                    <label htmlFor="agreeToTerms" className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Wyrażam zgodę na przetwarzanie moich danych osobowych w celu realizacji rejestracji na wydarzenie zgodnie z RODO. *
                    </label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="agreeToMarketing"
                      checked={registrationForm.agreeToMarketing}
                      onChange={(e) => setRegistrationForm({...registrationForm, agreeToMarketing: e.target.checked})}
                      className="mt-1 w-4 h-4 text-[#38b6ff] border-gray-300 rounded focus:ring-[#38b6ff]"
                    />
                    <label htmlFor="agreeToMarketing" className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Wyrażam zgodę na otrzymywanie informacji o podobnych wydarzeniach (opcjonalnie).
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-6 font-semibold rounded-lg transition-all duration-200 bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg flex items-center justify-center"
                >
                  <CheckIcon size={18} color="currentColor" className="mr-2" />
                  Zapisz się na wydarzenie
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {isPaymentModalOpen && event && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg shadow-xl max-w-md w-full ${
            darkMode ? 'bg-black border border-gray-700' : 'bg-white'
          }`}>
            {/* Modal Header */}
            <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Zakup biletu
                </h2>
                <button
                  onClick={closeModals}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <CloseIcon size={20} color="currentColor" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-[#38b6ff] rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CalendarIcon size={32} color="white" />
                </div>
                <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {event.name}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                  {formatDate(event.date)} • {event.time}
                </p>
                <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {event.price}
                </p>
              </div>

              <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <p className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Funkcja płatności dostępna wkrótce
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Pracujemy nad integracją z systemem płatności. 
                  W międzyczasie skontaktuj się z organizatorem wydarzenia.
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

export default EventDetailPage;