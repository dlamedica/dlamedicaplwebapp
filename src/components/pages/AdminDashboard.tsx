import React, { useState, useEffect } from 'react';
import { useUser } from '../../hooks/useUser';
import { FaCheck, FaTimes, FaEye, FaTrash, FaSearch, FaFilter, FaBriefcase, FaCalendar, FaUsers, FaExclamationTriangle, FaChartBar } from 'react-icons/fa';
import { db } from '../../lib/apiClient';

interface JobOffer {
  id: string;
  title: string;
  company_name: string;
  location: string;
  employment_type: string;
  salary_min?: number;
  salary_max?: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  contact_email: string;
  description: string;
}

interface Event {
  id: string;
  title: string;
  type: 'conference' | 'webinar';
  date: string;
  organizer_name: string;
  is_online: boolean;
  location?: string;
  online_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  contact_email: string;
  description: string;
}

interface AdminDashboardProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ darkMode, fontSize }) => {
  const { user, profile } = useUser();
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'events' | 'users'>('overview');
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  const fontSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  useEffect(() => {
    document.title = 'Panel Administratora – DlaMedica.pl';
    
    // Check if user is admin
    if (user && !isAdmin()) {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
      return;
    }

    if (user && isAdmin()) {
      loadData();
    }
  }, [user, profile]);

  const isAdmin = () => {
    // Check if user is admin based on email or user metadata
    return user?.email === 'admin@dlamedica.pl' || user?.user_metadata?.role === 'admin' || profile?.role === 'admin';
  };

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadJobOffers(), loadEvents()]);
    } catch (error) {
      console.error('Error loading admin data:', error);
      // Load mock data as fallback
      loadMockData();
    } finally {
      setLoading(false);
    }
  };

  const loadJobOffers = async () => {
    try {
      const { data, error } = await db
        .from('job_offers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobOffers(data || []);
    } catch (error) {
      console.error('Error loading job offers:', error);
      setJobOffers(getMockJobOffers());
    }
  };

  const loadEvents = async () => {
    try {
      const { data, error } = await db
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error loading events:', error);
      setEvents(getMockEvents());
    }
  };

  const loadMockData = () => {
    setJobOffers(getMockJobOffers());
    setEvents(getMockEvents());
  };

  const getMockJobOffers = (): JobOffer[] => {
    return [
      {
        id: '1',
        title: 'Lekarz Internista',
        company_name: 'Szpital Wojewódzki',
        location: 'Warszawa',
        employment_type: 'full-time',
        salary_min: 8000,
        salary_max: 12000,
        status: 'pending',
        created_at: new Date().toISOString(),
        contact_email: 'hr@szpital.pl',
        description: 'Poszukujemy doświadczonego lekarza internisty...'
      },
      {
        id: '2',
        title: 'Pielęgniarka Oddziałowa',
        company_name: 'Klinika Prywatna ABC',
        location: 'Kraków',
        employment_type: 'full-time',
        salary_min: 5000,
        salary_max: 7000,
        status: 'approved',
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        contact_email: 'rekrutacja@abc.pl',
        description: 'Zatrudnimy doświadczoną pielęgniarkę...'
      }
    ];
  };

  const getMockEvents = (): Event[] => {
    return [
      {
        id: '1',
        title: 'Konferencja Kardiologiczna 2024',
        type: 'conference',
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        organizer_name: 'Polskie Towarzystwo Kardiologiczne',
        is_online: false,
        location: 'Hotel Marriott, Warszawa',
        status: 'pending',
        created_at: new Date().toISOString(),
        contact_email: 'konferencja@kardiologia.pl',
        description: 'Najnowsze trendy w kardiologii...'
      },
      {
        id: '2',
        title: 'Webinar: Telemedycyna w praktyce',
        type: 'webinar',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        organizer_name: 'Dr Jan Kowalski',
        is_online: true,
        online_url: 'https://zoom.us/j/123456789',
        status: 'approved',
        created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        contact_email: 'webinar@telemedycyna.pl',
        description: 'Praktyczne aspekty telemedycyny...'
      }
    ];
  };

  const handleJobOfferAction = async (jobId: string, action: 'approve' | 'reject') => {
    setActionLoading(jobId);
    try {
      const { error } = await db
        .from('job_offers')
        .update({ 
          status: action === 'approve' ? 'approved' : 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId);

      if (error) throw error;

      // Update local state
      setJobOffers(prev => prev.map(job => 
        job.id === jobId 
          ? { ...job, status: action === 'approve' ? 'approved' : 'rejected' }
          : job
      ));

      // Here you could also send email notification to the job poster
      console.log(`Job offer ${jobId} ${action}d successfully`);
    } catch (error) {
      console.error(`Error ${action}ing job offer:`, error);
      alert(`Błąd podczas ${action === 'approve' ? 'zatwierdzania' : 'odrzucania'} oferty`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleEventAction = async (eventId: string, action: 'approve' | 'reject') => {
    setActionLoading(eventId);
    try {
      const { error } = await db
        .from('events')
        .update({ 
          status: action === 'approve' ? 'approved' : 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', eventId);

      if (error) throw error;

      // Update local state
      setEvents(prev => prev.map(event => 
        event.id === eventId 
          ? { ...event, status: action === 'approve' ? 'approved' : 'rejected' }
          : event
      ));

      console.log(`Event ${eventId} ${action}d successfully`);
    } catch (error) {
      console.error(`Error ${action}ing event:`, error);
      alert(`Błąd podczas ${action === 'approve' ? 'zatwierdzania' : 'odrzucania'} wydarzenia`);
    } finally {
      setActionLoading(null);
    }
  };

  const getFilteredJobOffers = () => {
    let filtered = jobOffers;
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(job => job.status === statusFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const getFilteredEvents = () => {
    let filtered = events;
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(event => event.status === statusFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizer_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const getStatusBadge = (status: 'pending' | 'approved' | 'rejected') => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };
    
    const labels = {
      pending: 'Oczekuje',
      approved: 'Zatwierdzone',
      rejected: 'Odrzucone'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colors[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getStats = () => {
    const pendingJobs = jobOffers.filter(job => job.status === 'pending').length;
    const pendingEvents = events.filter(event => event.status === 'pending').length;
    const totalPending = pendingJobs + pendingEvents;
    
    return {
      totalJobs: jobOffers.length,
      totalEvents: events.length,
      pendingJobs,
      pendingEvents,
      totalPending
    };
  };

  if (!user || !isAdmin()) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <FaExclamationTriangle className="mx-auto text-4xl text-red-500 mb-4" />
          <h2 className={`text-xl font-semibold mb-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Brak dostępu
          </h2>
          <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Nie masz uprawnień administratora
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#38b6ff] mx-auto mb-4"></div>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Ładowanie panelu...</p>
        </div>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className={`min-h-screen py-8 px-4 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`rounded-lg shadow-lg p-6 mb-6 ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }`}>
          <h1 className={`${
            fontSize === 'large' ? 'text-3xl' : fontSize === 'medium' ? 'text-2xl' : 'text-xl'
          } font-bold flex items-center mb-4`}>
            <FaChartBar className="mr-3 text-[#38b6ff]" />
            Panel Administratora
          </h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className={`p-4 rounded-lg ${
              darkMode ? 'bg-gray-700' : 'bg-blue-50'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Oferty pracy
                  </p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stats.totalJobs}
                  </p>
                </div>
                <FaBriefcase className="text-[#38b6ff] text-2xl" />
              </div>
            </div>

            <div className={`p-4 rounded-lg ${
              darkMode ? 'bg-gray-700' : 'bg-purple-50'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Wydarzenia
                  </p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stats.totalEvents}
                  </p>
                </div>
                <FaCalendar className="text-purple-500 text-2xl" />
              </div>
            </div>

            <div className={`p-4 rounded-lg ${
              darkMode ? 'bg-gray-700' : 'bg-yellow-50'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Oczekuje - Oferty
                  </p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stats.pendingJobs}
                  </p>
                </div>
                <FaExclamationTriangle className="text-yellow-500 text-2xl" />
              </div>
            </div>

            <div className={`p-4 rounded-lg ${
              darkMode ? 'bg-gray-700' : 'bg-orange-50'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Oczekuje - Wydarzenia
                  </p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stats.pendingEvents}
                  </p>
                </div>
                <FaExclamationTriangle className="text-orange-500 text-2xl" />
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8">
              {[
                { key: 'overview', label: 'Przegląd', icon: FaChartBar },
                { key: 'jobs', label: `Oferty pracy (${stats.pendingJobs})`, icon: FaBriefcase },
                { key: 'events', label: `Wydarzenia (${stats.pendingEvents})`, icon: FaCalendar },
                { key: 'users', label: 'Użytkownicy', icon: FaUsers }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center ${
                      activeTab === tab.key
                        ? 'border-[#38b6ff] text-[#38b6ff]'
                        : 'border-transparent hover:text-[#38b6ff]'
                    } ${darkMode ? 'text-gray-300 hover:text-[#38b6ff]' : 'text-gray-500 hover:text-[#38b6ff]'}`}
                  >
                    <Icon className="mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className={`rounded-lg shadow-lg p-6 ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}>
            <h2 className="text-xl font-semibold mb-4">Przegląd systemu</h2>
            <div className="text-center py-8">
              <FaChartBar className="mx-auto text-4xl text-[#38b6ff] mb-4" />
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Witaj w panelu administratora DlaMedica.pl
              </p>
              <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Użyj zakładek powyżej, aby zarządzać ofertami pracy i wydarzeniami
              </p>
              {stats.totalPending > 0 && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800">
                    <FaExclamationTriangle className="inline mr-2" />
                    Masz {stats.totalPending} elementów oczekujących na moderację
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {(activeTab === 'jobs' || activeTab === 'events') && (
          <div className={`rounded-lg shadow-lg ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}>
            {/* Search and Filter Bar */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder={`Szukaj ${activeTab === 'jobs' ? 'ofert pracy' : 'wydarzeń'}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <FaFilter className="text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="all">Wszystkie</option>
                    <option value="pending">Oczekujące</option>
                    <option value="approved">Zatwierdzone</option>
                    <option value="rejected">Odrzucone</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {activeTab === 'jobs' && (
                <div className="space-y-4">
                  {getFilteredJobOffers().map((job) => (
                    <div key={job.id} className={`p-4 border rounded-lg ${
                      darkMode ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{job.title}</h3>
                          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {job.company_name} • {job.location} • {job.employment_type}
                          </p>
                          {job.salary_min && job.salary_max && (
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              Wynagrodzenie: {job.salary_min} - {job.salary_max} PLN
                            </p>
                          )}
                          <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Dodano: {new Date(job.created_at).toLocaleDateString('pl-PL')}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {getStatusBadge(job.status)}
                          {job.status === 'pending' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleJobOfferAction(job.id, 'approve')}
                                disabled={actionLoading === job.id}
                                className="p-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                                title="Zatwierdź"
                              >
                                <FaCheck />
                              </button>
                              <button
                                onClick={() => handleJobOfferAction(job.id, 'reject')}
                                disabled={actionLoading === job.id}
                                className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                                title="Odrzuć"
                              >
                                <FaTimes />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {job.description.substring(0, 200)}...
                      </p>
                      <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Kontakt: {job.contact_email}
                      </p>
                    </div>
                  ))}
                  {getFilteredJobOffers().length === 0 && (
                    <div className="text-center py-8">
                      <FaBriefcase className="mx-auto text-4xl text-gray-400 mb-4" />
                      <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                        Brak ofert pracy spełniających kryteria
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'events' && (
                <div className="space-y-4">
                  {getFilteredEvents().map((event) => (
                    <div key={event.id} className={`p-4 border rounded-lg ${
                      darkMode ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{event.title}</h3>
                          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {event.organizer_name} • {event.type === 'conference' ? 'Konferencja' : 'Webinar'}
                            {event.is_online ? ' • Online' : ` • ${event.location}`}
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Data: {new Date(event.date).toLocaleDateString('pl-PL')}
                          </p>
                          <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Dodano: {new Date(event.created_at).toLocaleDateString('pl-PL')}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {getStatusBadge(event.status)}
                          {event.status === 'pending' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEventAction(event.id, 'approve')}
                                disabled={actionLoading === event.id}
                                className="p-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                                title="Zatwierdź"
                              >
                                <FaCheck />
                              </button>
                              <button
                                onClick={() => handleEventAction(event.id, 'reject')}
                                disabled={actionLoading === event.id}
                                className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                                title="Odrzuć"
                              >
                                <FaTimes />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {event.description.substring(0, 200)}...
                      </p>
                      <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Kontakt: {event.contact_email}
                      </p>
                    </div>
                  ))}
                  {getFilteredEvents().length === 0 && (
                    <div className="text-center py-8">
                      <FaCalendar className="mx-auto text-4xl text-gray-400 mb-4" />
                      <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                        Brak wydarzeń spełniających kryteria
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className={`rounded-lg shadow-lg p-6 ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}>
            <h2 className="text-xl font-semibold mb-4">Zarządzanie użytkownikami</h2>
            <div className="text-center py-8">
              <FaUsers className="mx-auto text-4xl text-gray-400 mb-4" />
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Panel zarządzania użytkownikami będzie dostępny w przyszłych wersjach
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;