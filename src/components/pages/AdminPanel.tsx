import React, { useState, useEffect } from 'react';
import { 
  FaUsers, FaBriefcase, FaCalendarAlt, FaCheck, FaTimes, FaEdit, 
  FaEye, FaClock, FaFilter, FaSearch, FaChartBar, FaExclamationTriangle,
  FaFileAlt, FaMapMarkerAlt, FaBuilding, FaStar, FaHistory, FaUpload,
  FaDatabase, FaUsersCog, FaPlus, FaPills, FaInfoCircle, FaCloudUploadAlt,
  FaChevronDown, FaListUl, FaCity, FaBan, FaUserCheck, FaTrash
} from 'react-icons/fa';
import { exampleDataService, JobOffer, Event, User, RecentActivity } from '../../services/exampleDataService';
import { useNotifications } from '../../hooks/useNotifications';

interface AdminPanelProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const AdminPanel: React.FC<AdminPanelProps> = ({ darkMode, fontSize }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'jobs' | 'events' | 'drugs' | 'users' | 'analytics'>('dashboard');
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ id: string; type: 'job' | 'event' } | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedRejectReason, setSelectedRejectReason] = useState('');
  const [customRejectReason, setCustomRejectReason] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterCity, setFilterCity] = useState<string>('all');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showStatusHistory, setShowStatusHistory] = useState<string | null>(null);
  const [showJobDetailModal, setShowJobDetailModal] = useState<string | null>(null);
  const [showEventDetailModal, setShowEventDetailModal] = useState<string | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string>('');
  const [drugDbLastUpdate, setDrugDbLastUpdate] = useState<Date>(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userFilterType, setUserFilterType] = useState<'all' | 'individual' | 'company'>('all');
  const [userFilterStatus, setUserFilterStatus] = useState<'all' | 'active' | 'suspended' | 'banned'>('all');
  
  const {
    notifyJobOfferApproved,
    notifyJobOfferRejected,
    notifyEventApproved,
    notifyEventRejected,
    triggerCustomNotification
  } = useNotifications();

  const fontSizeClasses = {
    small: {
      title: 'text-lg',
      subtitle: 'text-base',
      text: 'text-sm',
      label: 'text-xs',
      button: 'text-sm px-3 py-1',
      card: 'text-sm'
    },
    medium: {
      title: 'text-xl',
      subtitle: 'text-lg',
      text: 'text-base',
      label: 'text-sm',
      button: 'text-base px-4 py-2',
      card: 'text-base'
    },
    large: {
      title: 'text-2xl',
      subtitle: 'text-xl',
      text: 'text-lg',
      label: 'text-base',
      button: 'text-lg px-5 py-3',
      card: 'text-lg'
    }
  };

  const fontSizes = fontSizeClasses[fontSize];

  useEffect(() => {
    // Load data from the service
    loadData();
    // Refresh data every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    setJobOffers(exampleDataService.getJobOffers());
    setEvents(exampleDataService.getEvents());
    setUsers(exampleDataService.getUsers());
    setRecentActivities(exampleDataService.getRecentActivities());
    setStatistics(exampleDataService.getStatistics());
  };

  const handleApprove = (id: string, type: 'job' | 'event') => {
    if (type === 'job') {
      const jobOffer = exampleDataService.getJobOfferById(id);
      exampleDataService.approveJobOffer(id);
      setJobOffers(exampleDataService.getJobOffers());
      
      // Send notification to company
      if (jobOffer) {
        notifyJobOfferApproved('company1', {
          job_title: jobOffer.position,
          company_name: jobOffer.company
        });
        
        // Show admin confirmation
        triggerCustomNotification('admin1', 'admin', 'success', 
          'Oferta zaakceptowana', 
          `Oferta "${jobOffer.position}" została zaakceptowana i opublikowana.`
        );
      }
    } else {
      const event = exampleDataService.getEventById(id);
      exampleDataService.approveEvent(id);
      setEvents(exampleDataService.getEvents());
      
      // Send notification to company
      if (event) {
        notifyEventApproved('company1', {
          event_title: event.title,
          organizer: event.organizer
        });
        
        // Show admin confirmation
        triggerCustomNotification('admin1', 'admin', 'success', 
          'Wydarzenie zaakceptowane', 
          `Wydarzenie "${event.title}" zostało zaakceptowane i opublikowane.`
        );
      }
    }
    setStatistics(exampleDataService.getStatistics());
  };

  const handleReject = (id: string, type: 'job' | 'event') => {
    setSelectedItem({ id, type });
    setShowRejectModal(true);
  };

  const confirmReject = () => {
    const finalReason = selectedRejectReason === 'other' ? customRejectReason : selectedRejectReason;
    if (!selectedItem || !finalReason.trim()) return;

    if (selectedItem.type === 'job') {
      const jobOffer = exampleDataService.getJobOfferById(selectedItem.id);
      exampleDataService.rejectJobOffer(selectedItem.id, finalReason);
      setJobOffers(exampleDataService.getJobOffers());
      
      // Send notification to company
      if (jobOffer) {
        notifyJobOfferRejected('company1', {
          job_title: jobOffer.position,
          rejection_reason: finalReason
        });
        
        // Show admin confirmation
        triggerCustomNotification('admin1', 'admin', 'info', 
          'Oferta odrzucona', 
          `Oferta "${jobOffer.position}" została odrzucona. Firma została powiadomiona.`
        );
      }
    } else {
      const event = exampleDataService.getEventById(selectedItem.id);
      exampleDataService.rejectEvent(selectedItem.id, finalReason);
      setEvents(exampleDataService.getEvents());
      
      // Send notification to company
      if (event) {
        notifyEventRejected('company1', {
          event_title: event.title,
          rejection_reason: finalReason
        });
        
        // Show admin confirmation
        triggerCustomNotification('admin1', 'admin', 'info', 
          'Wydarzenie odrzucone', 
          `Wydarzenie "${event.title}" zostało odrzucone. Organizator został powiadomiony.`
        );
      }
    }
    
    setStatistics(exampleDataService.getStatistics());
    setShowRejectModal(false);
    setSelectedItem(null);
    setRejectReason('');
    setSelectedRejectReason('');
    setCustomRejectReason('');
  };

  const getStatusBadge = (status: string, rejectionReason?: string) => {
    const baseClasses = `px-2 py-1 rounded-full text-xs font-medium`;
    switch (status) {
      case 'pending':
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Oczekuje</span>;
      case 'approved':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Zaakceptowane</span>;
      case 'rejected':
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`} title={rejectionReason}>
            Odrzucone
          </span>
        );
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  };

  const filteredJobOffers = jobOffers.filter(job => {
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      job.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = filterCity === 'all' || job.location.toLowerCase().includes(filterCity.toLowerCase());
    const matchesCategory = filterCategory === 'all' || job.employment_type === filterCategory;
    
    let matchesDate = true;
    if (filterDateFrom) {
      matchesDate = matchesDate && job.created_at >= new Date(filterDateFrom);
    }
    if (filterDateTo) {
      matchesDate = matchesDate && job.created_at <= new Date(filterDateTo);
    }
    
    return matchesStatus && matchesSearch && matchesCity && matchesCategory && matchesDate;
  });

  const filteredEvents = events.filter(event => {
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className={`${fontSizes.title} font-bold mb-2`}>Panel Administratora</h1>
        <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Zarządzaj ofertami pracy i wydarzeniami utworzonymi przez firmy. Zaakceptowane treści będą opublikowane na stronie.
        </p>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow ${(statistics?.jobOffers.pending || 0) > 10 ? 'border-l-4 border-red-500' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaBriefcase className="text-blue-500 text-2xl mr-3" />
              <div>
                <p className={`${fontSizes.text} font-medium`}>Oferty oczekujące</p>
                <p className={`${fontSizes.title} font-bold ${(statistics?.jobOffers.pending || 0) > 10 ? 'text-red-600' : ''}`}>{statistics?.jobOffers.pending || 0}</p>
              </div>
            </div>
            {(statistics?.jobOffers.pending || 0) > 10 && <FaExclamationTriangle className="text-red-500" />}
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow ${(statistics?.events.pending || 0) > 5 ? 'border-l-4 border-red-500' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaCalendarAlt className="text-green-500 text-2xl mr-3" />
              <div>
                <p className={`${fontSizes.text} font-medium`}>Wydarzenia oczekujące</p>
                <p className={`${fontSizes.title} font-bold ${(statistics?.events.pending || 0) > 5 ? 'text-red-600' : ''}`}>{statistics?.events.pending || 0}</p>
              </div>
            </div>
            {(statistics?.events.pending || 0) > 5 && <FaExclamationTriangle className="text-red-500" />}
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
          <div className="flex items-center">
            <FaUsers className="text-purple-500 text-2xl mr-3" />
            <div>
              <p className={`${fontSizes.text} font-medium`}>Nowi użytkownicy (dziś)</p>
              <p className={`${fontSizes.title} font-bold`}>{statistics?.users?.todayRegistrations || 0}</p>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
          <div className="flex items-center">
            <FaExclamationTriangle className="text-orange-500 text-2xl mr-3" />
            <div>
              <p className={`${fontSizes.text} font-medium`}>Zgłoszenia do rozpatrzenia</p>
              <p className={`${fontSizes.title} font-bold`}>0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className={`lg:col-span-2 ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
          <h2 className={`${fontSizes.subtitle} font-bold mb-4 flex items-center`}>
            <FaHistory className="mr-2 text-[#38b6ff]" />
            Ostatnie aktywności
          </h2>
          <div className="space-y-3">
            {recentActivities.slice(0, 6).map((activity) => {
              const timeAgo = Math.floor((Date.now() - activity.timestamp.getTime()) / (1000 * 60 * 60));
              const icon = activity.type === 'job_added' ? FaBriefcase :
                          activity.type === 'event_added' ? FaCalendarAlt :
                          activity.type === 'user_registered' ? FaUsers :
                          activity.type === 'application_submitted' ? FaFileAlt :
                          activity.type === 'job_approved' ? FaCheck :
                          FaCalendarAlt;
              const color = activity.type.includes('approved') ? 'text-green-500' :
                           activity.type.includes('added') ? 'text-blue-500' :
                           activity.type.includes('registered') ? 'text-purple-500' :
                           'text-orange-500';
              
              return (
                <div key={activity.id} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                  <div className="flex items-center">
                    {React.createElement(icon, { className: `${color} mr-3` })}
                    <span className={fontSizes.text}>{activity.description}</span>
                  </div>
                  <span className={`${fontSizes.label} text-gray-500`}>
                    {timeAgo === 0 ? 'teraz' : `${timeAgo}h temu`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
          <h2 className={`${fontSizes.subtitle} font-bold mb-4 flex items-center`}>
            <FaStar className="mr-2 text-yellow-500" />
            Szybkie akcje
          </h2>
          <div className="space-y-3">
            <button 
              onClick={() => {
                // Simulate approving all pending jobs
                jobOffers.filter(job => job.status === 'pending').forEach(job => {
                  exampleDataService.approveJobOffer(job.id);
                });
                loadData();
                triggerCustomNotification('admin1', 'admin', 'success', 
                  'Wszystkie oferty zaakceptowane', 
                  'Pomyślnie zaakceptowano wszystkie oczekujące oferty pracy.'
                );
              }}
              className={`w-full ${fontSizes.button} bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2`}
              disabled={(statistics?.jobOffers.pending || 0) === 0}
            >
              <FaCheck />
              Akceptuj wszystkie oferty ({statistics?.jobOffers.pending || 0})
            </button>
            
            <button 
              onClick={() => {
                // Export report functionality
                triggerCustomNotification('admin1', 'admin', 'info', 
                  'Raport w przygotowaniu', 
                  'Raport zostanie wysłany na Twój adres email.'
                );
              }}
              className={`w-full ${fontSizes.button} bg-[#38b6ff] text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2`}
            >
              <FaFileAlt />
              Eksportuj raport
            </button>
            
            <button className={`w-full ${fontSizes.button} bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2`}>
              <FaDatabase />
              Ustawienia systemu
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderJobOffers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={`${fontSizes.title} font-bold`}>Zarządzanie Ofertami Pracy</h1>
      </div>

      {/* Advanced Filters */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow mb-6`}>
        <div className="flex items-center mb-4">
          <FaFilter className="mr-2 text-[#38b6ff]" />
          <h3 className={`${fontSizes.subtitle} font-semibold`}>Zaawansowane filtry</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div>
            <label className={`block ${fontSizes.text} font-medium mb-1`}>Szukaj</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Stanowisko, firma..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300'
                } focus:ring-2 focus:ring-[#38b6ff] focus:border-transparent`}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className={`block ${fontSizes.text} font-medium mb-1`}>Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              } focus:ring-2 focus:ring-[#38b6ff] focus:border-transparent`}
            >
              <option value="all">Wszystkie statusy</option>
              <option value="pending">Oczekuje</option>
              <option value="approved">Zaakceptowane</option>
              <option value="rejected">Odrzucone</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className={`block ${fontSizes.text} font-medium mb-1`}>Typ zatrudnienia</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              } focus:ring-2 focus:ring-[#38b6ff] focus:border-transparent`}
            >
              <option value="all">Wszystkie typy</option>
              <option value="Pełny etat">Pełny etat</option>
              <option value="Kontrakt B2B">Kontrakt B2B</option>
              <option value="Umowa zlecenie">Umowa zlecenie</option>
              <option value="Praktyki/Staż">Praktyki/Staż</option>
            </select>
          </div>

          {/* City Filter */}
          <div>
            <label className={`block ${fontSizes.text} font-medium mb-1`}>Miasto</label>
            <div className="relative">
              <FaCity className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Warszawa, Kraków..."
                value={filterCity === 'all' ? '' : filterCity}
                onChange={(e) => setFilterCity(e.target.value || 'all')}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300'
                } focus:ring-2 focus:ring-[#38b6ff] focus:border-transparent`}
              />
            </div>
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block ${fontSizes.text} font-medium mb-1`}>Data od</label>
            <input
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              } focus:ring-2 focus:ring-[#38b6ff] focus:border-transparent`}
            />
          </div>
          <div>
            <label className={`block ${fontSizes.text} font-medium mb-1`}>Data do</label>
            <input
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              } focus:ring-2 focus:ring-[#38b6ff] focus:border-transparent`}
            />
          </div>
        </div>

        {/* Clear Filters */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterStatus('all');
              setFilterCategory('all');
              setFilterCity('all');
              setFilterDateFrom('');
              setFilterDateTo('');
            }}
            className={`px-4 py-2 text-[#38b6ff] hover:bg-blue-50 rounded-lg transition-colors ${fontSizes.text}`}
          >
            Wyczyść filtry
          </button>
        </div>
      </div>

      {/* Job Offers List */}
      <div className="grid gap-4">
        {filteredJobOffers.map((job) => (
          <div key={job.id} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className={`${fontSizes.subtitle} font-bold`}>{job.position}</h3>
                  {getStatusBadge(job.status, job.rejection_reason)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FaBuilding className="text-gray-400" />
                    <span className={fontSizes.text}>{job.company}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-gray-400" />
                    <span className={fontSizes.text}>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`${fontSizes.text} text-green-600 font-medium`}>{job.salary_range}</span>
                  </div>
                </div>
                <p className={`${fontSizes.text} text-gray-600 mt-2 line-clamp-2`}>
                  {job.description}
                </p>
                <div className={`${fontSizes.label} text-gray-500 mt-2`}>
                  Utworzono: {job.created_at.toLocaleDateString('pl-PL')}
                </div>
              </div>
              
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => setShowJobDetailModal(job.id)}
                  className={`${fontSizes.button} bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2`}
                >
                  <FaEye /> Szczegóły
                </button>
                <button
                  onClick={() => setShowStatusHistory(job.id)}
                  className={`${fontSizes.button} bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2`}
                >
                  <FaHistory /> Historia
                </button>
                {job.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(job.id, 'job')}
                      className={`${fontSizes.button} bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2`}
                    >
                      <FaCheck /> Akceptuj
                    </button>
                    <button
                      onClick={() => handleReject(job.id, 'job')}
                      className={`${fontSizes.button} bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2`}
                    >
                      <FaTimes /> Odrzuć
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {filteredJobOffers.length === 0 && (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-8 rounded-lg shadow text-center`}>
            <FaBriefcase className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className={`${fontSizes.text} text-gray-500`}>Brak ofert pracy do wyświetlenia</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderEvents = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={`${fontSizes.title} font-bold`}>Zarządzanie Wydarzeniami</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Szukaj po tytule lub organizatorze..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-800 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              } focus:ring-2 focus:ring-[#38b6ff] focus:border-transparent`}
            />
          </div>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={`px-4 py-2 rounded-lg border ${
            darkMode 
              ? 'bg-gray-800 border-gray-600 text-white' 
              : 'bg-white border-gray-300'
          } focus:ring-2 focus:ring-[#38b6ff] focus:border-transparent`}
        >
          <option value="all">Wszystkie statusy</option>
          <option value="pending">Oczekuje</option>
          <option value="approved">Zaakceptowane</option>
          <option value="rejected">Odrzucone</option>
        </select>
      </div>

      {/* Events List */}
      <div className="grid gap-4">
        {filteredEvents.map((event) => (
          <div key={event.id} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className={`${fontSizes.subtitle} font-bold`}>{event.title}</h3>
                  {getStatusBadge(event.status, event.rejection_reason)}
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    event.type === 'webinar' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {event.type === 'webinar' ? 'Webinar' : 'Konferencja'}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FaBuilding className="text-gray-400" />
                    <span className={fontSizes.text}>{event.organizer}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-gray-400" />
                    <span className={fontSizes.text}>{event.date.toLocaleDateString('pl-PL')}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-gray-400" />
                      <span className={fontSizes.text}>{event.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <FaUsers className="text-gray-400" />
                    <span className={fontSizes.text}>
                      {event.current_participants}/{event.max_participants} uczestników
                    </span>
                  </div>
                </div>
                <p className={`${fontSizes.text} text-gray-600 mt-2 line-clamp-2`}>
                  {event.description}
                </p>
                <div className={`${fontSizes.label} text-gray-500 mt-2`}>
                  Utworzono: {event.created_at.toLocaleDateString('pl-PL')}
                </div>
              </div>
              
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => setShowEventDetailModal(event.id)}
                  className={`${fontSizes.button} bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2`}
                >
                  <FaEye /> Szczegóły
                </button>
                {event.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(event.id, 'event')}
                      className={`${fontSizes.button} bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2`}
                    >
                      <FaCheck /> Akceptuj
                    </button>
                    <button
                      onClick={() => handleReject(event.id, 'event')}
                      className={`${fontSizes.button} bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2`}
                    >
                      <FaTimes /> Odrzuć
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {filteredEvents.length === 0 && (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-8 rounded-lg shadow text-center`}>
            <FaCalendarAlt className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className={`${fontSizes.text} text-gray-500`}>Brak wydarzeń do wyświetlenia</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-1">
            {[
              { id: 'dashboard', label: 'Panel główny', icon: FaChartBar },
              { id: 'jobs', label: 'Oferty pracy', icon: FaBriefcase },
              { id: 'events', label: 'Wydarzenia', icon: FaCalendarAlt },
              { id: 'drugs', label: 'Baza leków', icon: FaPills },
              { id: 'users', label: 'Użytkownicy', icon: FaUsersCog },
              { id: 'analytics', label: 'Analityka', icon: FaChartBar }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === id
                    ? 'bg-[#38b6ff] text-white'
                    : darkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }`}
              >
                <Icon className="mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'jobs' && renderJobOffers()}
        {activeTab === 'events' && renderEvents()}
        {activeTab === 'drugs' && renderDrugDatabase()}
        {activeTab === 'users' && renderUserManagement()}
        {activeTab === 'analytics' && renderAnalytics()}

        {/* Job Detail Modal */}
        {showJobDetailModal && (
          <JobDetailModal
            jobId={showJobDetailModal}
            darkMode={darkMode}
            fontSize={fontSizes}
            onClose={() => setShowJobDetailModal(null)}
            onApprove={(id) => {
              handleApprove(id, 'job');
              setShowJobDetailModal(null);
            }}
            onReject={(id) => {
              handleReject(id, 'job');
              setShowJobDetailModal(null);
            }}
          />
        )}

        {/* Event Detail Modal */}
        {showEventDetailModal && (
          <EventDetailModal
            eventId={showEventDetailModal}
            darkMode={darkMode}
            fontSize={fontSizes}
            onClose={() => setShowEventDetailModal(null)}
            onApprove={(id) => {
              handleApprove(id, 'event');
              setShowEventDetailModal(null);
            }}
            onReject={(id) => {
              handleReject(id, 'event');
              setShowEventDetailModal(null);
            }}
          />
        )}

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-xl max-w-lg w-full mx-4`}>
              <h3 className={`${fontSizes.subtitle} font-bold mb-4`}>
                <FaExclamationTriangle className="inline mr-2 text-red-500" />
                Odrzuć {selectedItem && selectedItem.type === 'job' ? 'ofertę pracy' : 'wydarzenie'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className={`${fontSizes.text} mb-3 font-medium`}>Wybierz powód odrzucenia:</p>
                  <div className="space-y-2">
                    {selectedItem?.type === 'job' ? (
                      // Job rejection reasons
                      <>
                        {[
                          'Niepełne dane',
                          'Nieodpowiedni opis stanowiska',
                          'Podejrzana oferta',
                          'Naruszenie regulaminu',
                          'Nieodpowiednia lokalizacja',
                          'Brak wymaganych informacji'
                        ].map((reason) => (
                          <label key={reason} className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="rejectReason"
                              value={reason}
                              checked={selectedRejectReason === reason}
                              onChange={(e) => setSelectedRejectReason(e.target.value)}
                              className="mr-3 text-[#38b6ff] focus:ring-[#38b6ff]"
                            />
                            <span className={fontSizes.text}>{reason}</span>
                          </label>
                        ))}
                      </>
                    ) : (
                      // Event rejection reasons
                      <>
                        {[
                          'Niepełne dane',
                          'Nieodpowiedni opis',
                          'Nieodpowiednia tematyka',
                          'Brak akredytacji',
                          'Konflikt terminów',
                          'Naruszenie regulaminu'
                        ].map((reason) => (
                          <label key={reason} className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="rejectReason"
                              value={reason}
                              checked={selectedRejectReason === reason}
                              onChange={(e) => setSelectedRejectReason(e.target.value)}
                              className="mr-3 text-[#38b6ff] focus:ring-[#38b6ff]"
                            />
                            <span className={fontSizes.text}>{reason}</span>
                          </label>
                        ))}
                      </>
                    )}
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="rejectReason"
                        value="other"
                        checked={selectedRejectReason === 'other'}
                        onChange={(e) => setSelectedRejectReason(e.target.value)}
                        className="mr-3 text-[#38b6ff] focus:ring-[#38b6ff]"
                      />
                      <span className={fontSizes.text}>Inne</span>
                    </label>
                  </div>
                </div>

                {/* Custom reason textarea */}
                {selectedRejectReason === 'other' && (
                  <div>
                    <label className={`block ${fontSizes.text} font-medium mb-2`}>
                      Podaj szczegółowy powód:
                    </label>
                    <textarea
                      value={customRejectReason}
                      onChange={(e) => setCustomRejectReason(e.target.value)}
                      placeholder="Wpisz powód odrzucenia..."
                      className={`w-full p-3 border rounded-lg ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300'
                      } focus:ring-2 focus:ring-[#38b6ff] focus:border-transparent`}
                      rows={3}
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setSelectedItem(null);
                    setRejectReason('');
                    setSelectedRejectReason('');
                    setCustomRejectReason('');
                  }}
                  className={`${fontSizes.button} px-4 py-2 border rounded-lg ${
                    darkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  } transition-colors`}
                >
                  Anuluj
                </button>
                <button
                  onClick={confirmReject}
                  disabled={!selectedRejectReason || (selectedRejectReason === 'other' && !customRejectReason.trim())}
                  className={`${fontSizes.button} px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2`}
                >
                  <FaTimes />
                  Odrzuć definitywnie
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status History Modal */}
        {showStatusHistory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4`}>
              <div className="flex justify-between items-start mb-6">
                <h3 className={`${fontSizes.subtitle} font-bold flex items-center`}>
                  <FaHistory className="mr-2 text-purple-500" />
                  Historia zmian statusu
                </h3>
                <button 
                  onClick={() => setShowStatusHistory(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                {exampleDataService.getStatusHistory(showStatusHistory).map((entry, index) => (
                  <div key={index} className={`p-4 rounded-lg border-l-4 ${
                    entry.status === 'approved' ? 'border-green-500 bg-green-50' :
                    entry.status === 'rejected' ? 'border-red-500 bg-red-50' :
                    'border-yellow-500 bg-yellow-50'
                  } ${darkMode ? 'bg-opacity-20' : ''}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {entry.status === 'approved' && <FaCheck className="text-green-600" />}
                          {entry.status === 'rejected' && <FaTimes className="text-red-600" />}
                          {entry.status === 'pending' && <FaClock className="text-yellow-600" />}
                          <span className={`font-semibold ${fontSizes.text} ${
                            entry.status === 'approved' ? 'text-green-800' :
                            entry.status === 'rejected' ? 'text-red-800' :
                            'text-yellow-800'
                          }`}>
                            {entry.status === 'approved' ? 'Zaakceptowane' :
                             entry.status === 'rejected' ? 'Odrzucone' :
                             'Utworzone'}
                          </span>
                        </div>
                        <p className={`${fontSizes.text} text-gray-600 mb-1`}>
                          {entry.admin ? `Przez: ${entry.admin}` : 'Przez: System'}
                        </p>
                        {entry.reason && (
                          <p className={`${fontSizes.text} text-gray-700`}>
                            <strong>Powód:</strong> {entry.reason}
                          </p>
                        )}
                        {entry.notes && (
                          <p className={`${fontSizes.text} text-gray-700 mt-1`}>
                            <strong>Notatki:</strong> {entry.notes}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className={`${fontSizes.label} text-gray-500`}>
                          {entry.timestamp.toLocaleDateString('pl-PL', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {exampleDataService.getStatusHistory(showStatusHistory).length === 0 && (
                  <div className="text-center py-8">
                    <FaHistory className="mx-auto text-4xl text-gray-400 mb-4" />
                    <p className={`${fontSizes.text} text-gray-500`}>Brak historii zmian dla tego elementu</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowStatusHistory(null)}
                  className={`${fontSizes.button} px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors`}
                >
                  Zamknij
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderDrugDatabase = () => {
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setCsvFile(file);
      setUploading(true);
      setUploadMessage('');

      try {
        // Simulate CSV processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setDrugDbLastUpdate(new Date());
        setUploadMessage(`✅ Pomyślnie zaimportowano ${Math.floor(Math.random() * 500 + 1000)} leków z pliku ${file.name}`);
        
        // Notify success
        triggerCustomNotification('admin1', 'admin', 'success', 
          'Baza leków zaktualizowana', 
          `Import z pliku ${file.name} zakończony pomyślnie.`
        );
      } catch (error) {
        setUploadMessage('❌ Błąd podczas importu pliku CSV');
      } finally {
        setUploading(false);
        setCsvFile(null);
        // Reset file input
        event.target.value = '';
      }
    };

    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className={`${fontSizes.title} font-bold mb-2`}>Zarządzanie bazą leków</h1>
          <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Aktualizuj bazę danych leków poprzez import pliku CSV
          </p>
        </div>

        {/* Last Update Info */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaPills className="text-pink-500 text-2xl mr-3" />
              <div>
                <h2 className={`${fontSizes.subtitle} font-bold`}>Status bazy danych</h2>
                <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Ostatnia aktualizacja: {drugDbLastUpdate.toLocaleDateString('pl-PL', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`${fontSizes.title} font-bold text-green-600`}>12,547</p>
              <p className={`${fontSizes.text} text-gray-500`}>leków w bazie</p>
            </div>
          </div>
        </div>

        {/* CSV Upload Section */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
          <h2 className={`${fontSizes.subtitle} font-bold mb-4`}>Import z pliku CSV</h2>
          
          <div className="space-y-4">
            {/* File Upload */}
            <div>
              <label className={`block ${fontSizes.text} font-medium mb-2`}>
                Wybierz plik CSV
              </label>
              <div className="flex items-center space-x-4">
                <label className={`cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm ${fontSizes.text} font-medium ${
                  darkMode 
                    ? 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } focus-within:ring-2 focus-within:ring-[#38b6ff] focus-within:ring-offset-2`}>
                  <FaCloudUploadAlt className="mr-2" />
                  Wybierz plik
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="sr-only"
                    disabled={uploading}
                  />
                </label>
                {csvFile && (
                  <span className={`${fontSizes.text} text-gray-600`}>
                    {csvFile.name}
                  </span>
                )}
              </div>
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#38b6ff]"></div>
                <span className={fontSizes.text}>Importowanie danych...</span>
              </div>
            )}

            {/* Upload Message */}
            {uploadMessage && (
              <div className={`p-3 rounded-lg ${uploadMessage.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <p className={fontSizes.text}>{uploadMessage}</p>
              </div>
            )}

            {/* Format Requirements */}
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900 border border-blue-700' : 'bg-blue-50 border border-blue-200'}`}>
              <h3 className={`${fontSizes.text} font-bold mb-2 text-blue-800`}>Wymagania formatu CSV:</h3>
              <ul className={`${fontSizes.text} text-blue-700 space-y-1`}>
                <li>• Kodowanie: UTF-8</li>
                <li>• Separator: przecinek (,)</li>
                <li>• Kolumny: nazwa, substancja_czynna, kod_atc, dawkowanie, producent, cena</li>
                <li>• Pierwszy wiersz powinien zawierać nagłówki</li>
                <li>• Maksymalny rozmiar pliku: 10 MB</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
            <div className="flex items-center">
              <FaPills className="text-pink-500 text-2xl mr-3" />
              <div>
                <p className={`${fontSizes.text} font-medium`}>Leki generyczne</p>
                <p className={`${fontSizes.title} font-bold`}>8,234</p>
              </div>
            </div>
          </div>
          
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
            <div className="flex items-center">
              <FaPills className="text-blue-500 text-2xl mr-3" />
              <div>
                <p className={`${fontSizes.text} font-medium`}>Leki oryginalne</p>
                <p className={`${fontSizes.title} font-bold`}>4,313</p>
              </div>
            </div>
          </div>
          
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
            <div className="flex items-center">
              <FaExclamationTriangle className="text-orange-500 text-2xl mr-3" />
              <div>
                <p className={`${fontSizes.text} font-medium`}>Braki magazynowe</p>
                <p className={`${fontSizes.title} font-bold`}>127</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleUserAction = (userId: string, action: 'suspend' | 'activate' | 'ban' | 'verify' | 'delete') => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    switch (action) {
      case 'suspend':
        exampleDataService.suspendUser(userId);
        triggerCustomNotification('admin1', 'admin', 'warning', 
          'Użytkownik zawieszony', 
          `Konto ${user.email} zostało zawieszone.`
        );
        break;
      case 'activate':
        exampleDataService.activateUser(userId);
        triggerCustomNotification('admin1', 'admin', 'success', 
          'Użytkownik aktywowany', 
          `Konto ${user.email} zostało przywrócone.`
        );
        break;
      case 'ban':
        exampleDataService.banUser(userId);
        triggerCustomNotification('admin1', 'admin', 'error', 
          'Użytkownik zbanowany', 
          `Konto ${user.email} zostało trwale zbanowane.`
        );
        break;
      case 'verify':
        exampleDataService.verifyUser(userId);
        triggerCustomNotification('admin1', 'admin', 'success', 
          'Konto zweryfikowane', 
          `Konto ${user.email} zostało zweryfikowane.`
        );
        break;
      case 'delete':
        if (window.confirm(`Czy na pewno chcesz usunąć konto ${user.email}? Ta akcja jest nieodwracalna.`)) {
          triggerCustomNotification('admin1', 'admin', 'info', 
            'Konto usunięte', 
            `Konto ${user.email} zostało usunięte.`
          );
        }
        break;
    }
    
    loadData();
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = userSearchTerm === '' || 
      user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      (user.company_name && user.company_name.toLowerCase().includes(userSearchTerm.toLowerCase()));
    const matchesType = userFilterType === 'all' || user.type === userFilterType;
    const matchesStatus = userFilterStatus === 'all' || user.status === userFilterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Pagination for users
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const getUserStatusBadge = (status: string, verified: boolean) => {
    const baseClasses = `px-2 py-1 rounded-full text-xs font-medium mr-2`;
    let statusBadge;
    
    switch (status) {
      case 'active':
        statusBadge = <span className={`${baseClasses} bg-green-100 text-green-800`}>Aktywny</span>;
        break;
      case 'suspended':
        statusBadge = <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Zawieszony</span>;
        break;
      case 'banned':
        statusBadge = <span className={`${baseClasses} bg-red-100 text-red-800`}>Zbanowany</span>;
        break;
      default:
        statusBadge = <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
    }
    
    return (
      <div className="flex items-center">
        {statusBadge}
        {verified ? 
          <FaUserCheck className="text-green-500" title="Zweryfikowane" /> : 
          <span className="text-gray-400 text-xs">Niezweryfikowane</span>
        }
      </div>
    );
  };

  const renderUserManagement = () => (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className={`${fontSizes.title} font-bold mb-2`}>Zarządzanie użytkownikami</h1>
        <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Przeglądaj i zarządzaj kontami użytkowników i firm
        </p>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
          <div className="flex items-center">
            <FaUsers className="text-blue-500 text-2xl mr-3" />
            <div>
              <p className={`${fontSizes.text} font-medium`}>Użytkownicy</p>
              <p className={`${fontSizes.title} font-bold`}>{statistics?.users?.individuals || 0}</p>
            </div>
          </div>
        </div>
        
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
          <div className="flex items-center">
            <FaBuilding className="text-green-500 text-2xl mr-3" />
            <div>
              <p className={`${fontSizes.text} font-medium`}>Firmy</p>
              <p className={`${fontSizes.title} font-bold`}>{statistics?.users?.companies || 0}</p>
            </div>
          </div>
        </div>
        
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
          <div className="flex items-center">
            <FaCheck className="text-orange-500 text-2xl mr-3" />
            <div>
              <p className={`${fontSizes.text} font-medium`}>Aktywni</p>
              <p className={`${fontSizes.title} font-bold`}>{statistics?.users?.active || 0}</p>
            </div>
          </div>
        </div>
        
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
          <div className="flex items-center">
            <FaUserCheck className="text-purple-500 text-2xl mr-3" />
            <div>
              <p className={`${fontSizes.text} font-medium`}>Zweryfikowani</p>
              <p className={`${fontSizes.title} font-bold`}>{statistics?.users?.verified || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
        <div className="flex items-center mb-4">
          <FaFilter className="mr-2 text-[#38b6ff]" />
          <h3 className={`${fontSizes.subtitle} font-semibold`}>Filtry</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className={`block ${fontSizes.text} font-medium mb-1`}>Szukaj</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Email, nazwa..."
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300'
                } focus:ring-2 focus:ring-[#38b6ff] focus:border-transparent`}
              />
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <label className={`block ${fontSizes.text} font-medium mb-1`}>Typ konta</label>
            <select
              value={userFilterType}
              onChange={(e) => setUserFilterType(e.target.value as any)}
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              } focus:ring-2 focus:ring-[#38b6ff] focus:border-transparent`}
            >
              <option value="all">Wszystkie typy</option>
              <option value="individual">Użytkownik zwykły</option>
              <option value="company">Konto firmowe</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className={`block ${fontSizes.text} font-medium mb-1`}>Status</label>
            <select
              value={userFilterStatus}
              onChange={(e) => setUserFilterStatus(e.target.value as any)}
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              } focus:ring-2 focus:ring-[#38b6ff] focus:border-transparent`}
            >
              <option value="all">Wszystkie statusy</option>
              <option value="active">Aktywny</option>
              <option value="suspended">Zawieszony</option>
              <option value="banned">Zbanowany</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <tr>
                <th className={`px-6 py-3 text-left ${fontSizes.text} font-medium text-gray-500 uppercase tracking-wider`}>Użytkownik</th>
                <th className={`px-6 py-3 text-left ${fontSizes.text} font-medium text-gray-500 uppercase tracking-wider`}>Typ</th>
                <th className={`px-6 py-3 text-left ${fontSizes.text} font-medium text-gray-500 uppercase tracking-wider`}>Data rejestracji</th>
                <th className={`px-6 py-3 text-left ${fontSizes.text} font-medium text-gray-500 uppercase tracking-wider`}>Status</th>
                <th className={`px-6 py-3 text-left ${fontSizes.text} font-medium text-gray-500 uppercase tracking-wider`}>Akcje</th>
              </tr>
            </thead>
            <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {paginatedUsers.map((user) => (
                <tr key={user.id} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className={`h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold`}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className={`${fontSizes.text} font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {user.type === 'company' ? (user.company_name || user.name) : user.name}
                        </div>
                        <div className={`${fontSizes.label} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.type === 'company' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.type === 'company' ? 'Firma' : 'Użytkownik'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {user.registration_date.toLocaleDateString('pl-PL')}
                    </div>
                    {user.last_login && (
                      <div className={`${fontSizes.label} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Ostatnie logowanie: {user.last_login.toLocaleDateString('pl-PL')}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getUserStatusBadge(user.status, user.verified)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center gap-2">
                      <button
                        className={`${fontSizes.button} bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1`}
                        title="Podgląd profilu"
                      >
                        <FaEye />
                      </button>
                      
                      {!user.verified && (
                        <button
                          onClick={() => handleUserAction(user.id, 'verify')}
                          className={`${fontSizes.button} bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1`}
                          title="Zweryfikuj konto"
                        >
                          <FaUserCheck />
                        </button>
                      )}
                      
                      {user.status === 'active' ? (
                        <button
                          onClick={() => handleUserAction(user.id, 'suspend')}
                          className={`${fontSizes.button} bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-1`}
                          title="Zawieś konto"
                        >
                          <FaBan />
                        </button>
                      ) : user.status === 'suspended' ? (
                        <button
                          onClick={() => handleUserAction(user.id, 'activate')}
                          className={`${fontSizes.button} bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1`}
                          title="Przywróć konto"
                        >
                          <FaCheck />
                        </button>
                      ) : null}
                      
                      {user.status !== 'banned' && (
                        <button
                          onClick={() => handleUserAction(user.id, 'ban')}
                          className={`${fontSizes.button} bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1`}
                          title="Zbanuj konto"
                        >
                          <FaTimes />
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleUserAction(user.id, 'delete')}
                        className={`${fontSizes.button} bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-1`}
                        title="Usuń konto"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} px-6 py-3 flex items-center justify-between border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Poprzednia
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Następna
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Wyświetlanie <span className="font-medium">{startIndex + 1}</span> do <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredUsers.length)}</span> z <span className="font-medium">{filteredUsers.length}</span> wyników
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <FaChevronDown className="h-5 w-5 rotate-90" aria-hidden="true" />
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + Math.max(1, currentPage - 2);
                    if (pageNum > totalPages) return null;
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNum
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <FaChevronDown className="h-5 w-5 -rotate-90" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {filteredUsers.length === 0 && (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-8 rounded-lg shadow text-center`}>
          <FaUsers className="mx-auto text-4xl text-gray-400 mb-4" />
          <p className={`${fontSizes.text} text-gray-500`}>Brak użytkowników do wyświetlenia</p>
        </div>
      )}
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className={`${fontSizes.title} font-bold mb-2`}>Analityka i raporty</h1>
        <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Szczegółowe dane o aktywności na platformie
        </p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`${fontSizes.text} font-semibold`}>Wyświetlenia ofert</h3>
            <FaEye className="text-blue-500" />
          </div>
          <p className={`${fontSizes.title} font-bold text-blue-600`}>15,847</p>
          <p className={`${fontSizes.label} text-green-600`}>+12% w tym miesiącu</p>
        </div>
        
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`${fontSizes.text} font-semibold`}>Aplikacje wysłane</h3>
            <FaFileAlt className="text-green-500" />
          </div>
          <p className={`${fontSizes.title} font-bold text-green-600`}>3,421</p>
          <p className={`${fontSizes.label} text-green-600`}>+8% w tym miesiącu</p>
        </div>
        
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`${fontSizes.text} font-semibold`}>Czas na stronie</h3>
            <FaClock className="text-orange-500" />
          </div>
          <p className={`${fontSizes.title} font-bold text-orange-600`}>4:23</p>
          <p className={`${fontSizes.label} text-green-600`}>+15% w tym miesiącu</p>
        </div>
      </div>

      {/* Coming Soon */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-8 rounded-lg shadow text-center`}>
        <FaChartBar className="mx-auto text-4xl text-gray-400 mb-4" />
        <h2 className={`${fontSizes.subtitle} font-bold mb-2`}>Zaawansowana analityka</h2>
        <p className={`${fontSizes.text} text-gray-500 mb-4`}>
          Szczegółowe raporty i wykresy są w trakcie rozwoju
        </p>
        <div className="space-y-2 text-left max-w-md mx-auto">
          <p className={`${fontSizes.text} text-gray-600`}>Planowane funkcje:</p>
          <ul className={`${fontSizes.text} text-gray-600 space-y-1`}>
            <li>• Wykresy wzrostu użytkowników</li>
            <li>• Analiza skuteczności ofert pracy</li>
            <li>• Statystyki wykorzystania bazy leków</li>
            <li>• Raporty aktywności firm</li>
            <li>• Export danych do CSV/PDF</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Job Detail Modal Component
const JobDetailModal: React.FC<{
  jobId: string;
  darkMode: boolean;
  fontSize: typeof fontSizeClasses[keyof typeof fontSizeClasses];
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}> = ({ jobId, darkMode, fontSize, onClose, onApprove, onReject }) => {
  const job = exampleDataService.getJobOfferById(jobId);
  
  if (!job) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto`}>
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className={`${fontSize.subtitle} font-bold`}>Szczegóły oferty pracy</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FaTimes size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className={`${fontSize.text} font-semibold mb-2`}>Podstawowe informacje</h3>
                <div className="space-y-2">
                  <p><strong>Stanowisko:</strong> {job.position}</p>
                  <p><strong>Firma:</strong> {job.company}</p>
                  <p><strong>Lokalizacja:</strong> {job.location}</p>
                  <p><strong>Typ zatrudnienia:</strong> {job.employment_type}</p>
                  <p><strong>Poziom doświadczenia:</strong> {job.experience_level}</p>
                  <p><strong>Wynagrodzenie:</strong> {job.salary_range}</p>
                  <p><strong>Status:</strong> {job.status}</p>
                  <p><strong>Data utworzenia:</strong> {job.created_at.toLocaleDateString('pl-PL')}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className={`${fontSize.text} font-semibold mb-2`}>Opis stanowiska</h3>
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <p className={fontSize.text}>{job.description}</p>
                </div>
              </div>
              
              {job.requirements && (
                <div>
                  <h3 className={`${fontSize.text} font-semibold mb-2`}>Wymagania</h3>
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <p className={fontSize.text}>{job.requirements}</p>
                  </div>
                </div>
              )}
              
              {job.benefits && (
                <div>
                  <h3 className={`${fontSize.text} font-semibold mb-2`}>Benefity</h3>
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <p className={fontSize.text}>{job.benefits}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {job.status === 'pending' && (
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
              <button
                onClick={() => onApprove(job.id)}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <FaCheck /> Zaakceptuj
              </button>
              <button
                onClick={() => onReject(job.id)}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <FaTimes /> Odrzuć
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Event Detail Modal Component
const EventDetailModal: React.FC<{
  eventId: string;
  darkMode: boolean;
  fontSize: typeof fontSizeClasses[keyof typeof fontSizeClasses];
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}> = ({ eventId, darkMode, fontSize, onClose, onApprove, onReject }) => {
  const event = exampleDataService.getEventById(eventId);
  
  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto`}>
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className={`${fontSize.subtitle} font-bold`}>Szczegóły wydarzenia</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FaTimes size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className={`${fontSize.text} font-semibold mb-2`}>Podstawowe informacje</h3>
                <div className="space-y-2">
                  <p><strong>Tytuł:</strong> {event.title}</p>
                  <p><strong>Typ:</strong> {event.type === 'webinar' ? 'Webinar' : 'Konferencja'}</p>
                  <p><strong>Organizator:</strong> {event.organizer}</p>
                  <p><strong>Data:</strong> {event.date.toLocaleDateString('pl-PL')}</p>
                  {event.location && <p><strong>Lokalizacja:</strong> {event.location}</p>}
                  <p><strong>Uczestnicy:</strong> {event.current_participants}/{event.max_participants}</p>
                  <p><strong>Status:</strong> {event.status}</p>
                  <p><strong>Data utworzenia:</strong> {event.created_at.toLocaleDateString('pl-PL')}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className={`${fontSize.text} font-semibold mb-2`}>Opis wydarzenia</h3>
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <p className={fontSize.text}>{event.description}</p>
                </div>
              </div>
              
              {event.program && (
                <div>
                  <h3 className={`${fontSize.text} font-semibold mb-2`}>Program</h3>
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <p className={fontSize.text}>{event.program}</p>
                  </div>
                </div>
              )}
              
              {event.speakers && (
                <div>
                  <h3 className={`${fontSize.text} font-semibold mb-2`}>Prelegenci</h3>
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <p className={fontSize.text}>{event.speakers}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {event.status === 'pending' && (
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
              <button
                onClick={() => onApprove(event.id)}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <FaCheck /> Zaakceptuj
              </button>
              <button
                onClick={() => onReject(event.id)}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <FaTimes /> Odrzuć
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;