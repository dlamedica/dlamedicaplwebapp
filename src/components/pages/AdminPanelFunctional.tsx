import React, { useState, useEffect } from 'react';
import { 
  FaUsers, FaBriefcase, FaCalendarAlt, FaCheck, FaTimes, FaEdit, 
  FaEye, FaClock, FaFilter, FaSearch, FaChartBar, FaExclamationTriangle,
  FaFileAlt, FaMapMarkerAlt, FaBuilding, FaStar, FaHistory, FaUpload,
  FaDatabase, FaUsersCog, FaPlus, FaPills, FaInfoCircle, FaCloudUploadAlt,
  FaChevronDown, FaListUl, FaCity, FaBan, FaUserCheck, FaTrash
} from 'react-icons/fa';
import { exampleDataService, JobOffer, Event, User, RecentActivity } from '../../services/exampleDataService';
import { drugDatabaseService } from '../../services/drugDatabaseService';
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
  const [selectedRejectReason, setSelectedRejectReason] = useState('');
  const [customRejectReason, setCustomRejectReason] = useState('');
  const [adminComment, setAdminComment] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetailModal, setShowDetailModal] = useState<{ id: string; type: 'job' | 'event' } | null>(null);
  const [showArchive, setShowArchive] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [drugStats, setDrugStats] = useState<any>(null);
  
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
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    // Load pending items by default, or archived if archive view is active
    if (showArchive) {
      setJobOffers(exampleDataService.getApprovedJobOffers());
      setEvents(exampleDataService.getApprovedEvents());
    } else {
      setJobOffers(exampleDataService.getPendingJobOffers());
      setEvents(exampleDataService.getPendingEvents());
    }
    setUsers(exampleDataService.getUsers());
    setRecentActivities(exampleDataService.getRecentActivities());
    setStatistics(exampleDataService.getStatistics());
    setDrugStats(drugDatabaseService.getStatistics());
  };

  const handleApprove = (id: string, type: 'job' | 'event', comment?: string) => {
    if (type === 'job') {
      const jobOffer = exampleDataService.getJobOfferById(id);
      exampleDataService.approveJobOffer(id, comment);
      loadData();
      
      if (jobOffer) {
        notifyJobOfferApproved('company1', {
          job_title: jobOffer.position,
          company_name: jobOffer.company
        });
        
        triggerCustomNotification('admin1', 'admin', 'success', 
          'Oferta zaakceptowana', 
          `Oferta "${jobOffer.position}" została zaakceptowana i opublikowana.`
        );
      }
    } else {
      const event = exampleDataService.getEventById(id);
      exampleDataService.approveEvent(id, comment);
      loadData();
      
      if (event) {
        notifyEventApproved('company1', {
          event_title: event.title,
          organizer: event.organizer
        });
        
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
      exampleDataService.rejectJobOffer(selectedItem.id, finalReason, adminComment.trim() || undefined);
      loadData();
      
      if (jobOffer) {
        notifyJobOfferRejected('company1', {
          job_title: jobOffer.position,
          rejection_reason: finalReason
        });
        
        triggerCustomNotification('admin1', 'admin', 'info', 
          'Oferta odrzucona', 
          `Oferta "${jobOffer.position}" została odrzucona. Firma została powiadomiona.`
        );
      }
    } else {
      const event = exampleDataService.getEventById(selectedItem.id);
      exampleDataService.rejectEvent(selectedItem.id, finalReason, adminComment.trim() || undefined);
      loadData();
      
      if (event) {
        notifyEventRejected('company1', {
          event_title: event.title,
          rejection_reason: finalReason
        });
        
        triggerCustomNotification('admin1', 'admin', 'info', 
          'Wydarzenie odrzucone', 
          `Wydarzenie "${event.title}" zostało odrzucone. Organizator został powiadomiony.`
        );
      }
    }
    
    setStatistics(exampleDataService.getStatistics());
    setShowRejectModal(false);
    setSelectedItem(null);
    setSelectedRejectReason('');
    setCustomRejectReason('');
    setAdminComment('');
  };

  const handleShowDetails = (id: string, type: 'job' | 'event') => {
    setShowDetailModal({ id, type });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 🔒 BEZPIECZEŃSTWO: Walidacja pliku CSV
    const { validateFile, ALLOWED_FILE_TYPES, MAX_FILE_SIZES, isCSVFile } = await import('../../utils/fileSecurity');
    
    if (!isCSVFile(file)) {
      setUploadMessage('❌ Proszę wybrać plik CSV');
      return;
    }

    const validation = validateFile(
      file,
      ALLOWED_FILE_TYPES.csv,
      MAX_FILE_SIZES.csv,
      'csv'
    );

    if (!validation.valid) {
      setUploadMessage(`❌ ${validation.error || 'Nieprawidłowy plik'}`);
      return;
    }

    setCsvFile(file);
    setUploading(true);
    setUploadMessage('');

    try {
      const stats = await drugDatabaseService.importFromCSV(file, false);
      
      const successMessage = `✅ Import zakończony pomyślnie!\n• Przetworzono: ${stats.total_rows} wierszy\n• Zaimportowano: ${stats.successful_imports} leków\n• Błędy: ${stats.failed_imports}\n• Pominięto (duplikaty): ${stats.skipped_duplicates}`;
      
      setUploadMessage(successMessage);
      setDrugStats(drugDatabaseService.getStatistics());
      
      triggerCustomNotification('admin1', 'admin', 'success', 
        'Baza leków zaktualizowana', 
        `Pomyślnie zaimportowano ${stats.successful_imports} leków z pliku ${file.name}`
      );
      
      if (stats.errors.length > 0) {
        console.warn('Import errors:', stats.errors);
      }
    } catch (error) {
      setUploadMessage(`❌ Błąd podczas importu: ${error}`);
      triggerCustomNotification('admin1', 'admin', 'error', 
        'Błąd importu', 
        `Nie udało się zaimportować pliku ${file.name}: ${error}`
      );
    } finally {
      setUploading(false);
      setCsvFile(null);
      // Reset file input
      event.target.value = '';
    }
  };

  const downloadCSVTemplate = () => {
    const template = drugDatabaseService.getCSVTemplate();
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'szablon_bazy_lekow.csv';
    link.click();
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
    
    return matchesStatus && matchesSearch;
  });

  const filteredEvents = events.filter(event => {
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h1 className={`${fontSizes.title} font-bold mb-2`}>Panel Administratora</h1>
              <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Zarządzaj ofertami pracy i wydarzeniami utworzonymi przez firmy.
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

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
                <h2 className={`${fontSizes.subtitle} font-bold mb-4 flex items-center`}>
                  <FaStar className="mr-2 text-yellow-500" />
                  Szybkie akcje
                </h2>
                <div className="space-y-3">
                  <button 
                    onClick={() => {
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
                  
                </div>
              </div>
            </div>
          </div>
        );

      case 'jobs':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className={`${fontSizes.title} font-bold`}>Zarządzanie Ofertami Pracy</h1>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => { setShowArchive(!showArchive); loadData(); }}
                  className={`${fontSizes.button} px-4 py-2 rounded-lg border transition-colors ${
                    showArchive
                      ? 'bg-[#38b6ff] text-white border-[#38b6ff]'
                      : darkMode
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {showArchive ? 'Pokaż oczekujące' : 'Pokaż archiwum'}
                </button>
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Szukaj po stanowisku lub firmie..."
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
                        onClick={() => handleShowDetails(job.id, 'job')}
                        className={`${fontSizes.button} bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2`}
                      >
                        <FaEye /> Szczegóły
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
                      {showArchive && job.status === 'approved' && (
                        <button
                          onClick={() => {
                            exampleDataService.archiveJobOffer(job.id);
                            loadData();
                          }}
                          className={`${fontSizes.button} bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2`}
                        >
                          <FaDatabase /> Archiwizuj
                        </button>
                      )}
                      {showArchive && job.status === 'archived' && (
                        <button
                          onClick={() => {
                            exampleDataService.restoreJobOffer(job.id);
                            loadData();
                          }}
                          className={`${fontSizes.button} bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2`}
                        >
                          <FaCheck /> Przywróć
                        </button>
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

      case 'events':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className={`${fontSizes.title} font-bold`}>Zarządzanie Wydarzeniami</h1>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => { setShowArchive(!showArchive); loadData(); }}
                  className={`${fontSizes.button} px-4 py-2 rounded-lg border transition-colors ${
                    showArchive
                      ? 'bg-[#38b6ff] text-white border-[#38b6ff]'
                      : darkMode
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {showArchive ? 'Pokaż oczekujące' : 'Pokaż archiwum'}
                </button>
              </div>
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
                        onClick={() => handleShowDetails(event.id, 'event')}
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
                      {showArchive && event.status === 'approved' && (
                        <button
                          onClick={() => {
                            exampleDataService.archiveEvent(event.id);
                            loadData();
                          }}
                          className={`${fontSizes.button} bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2`}
                        >
                          <FaDatabase /> Archiwizuj
                        </button>
                      )}
                      {showArchive && event.status === 'archived' && (
                        <button
                          onClick={() => {
                            exampleDataService.restoreEvent(event.id);
                            loadData();
                          }}
                          className={`${fontSizes.button} bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2`}
                        >
                          <FaCheck /> Przywróć
                        </button>
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

      case 'users':
        return (
          <div className="space-y-6">
            <h1 className={`${fontSizes.title} font-bold`}>Zarządzanie Użytkownikami</h1>
            
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

            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-8 rounded-lg shadow text-center`}>
              <FaUsersCog className="mx-auto text-4xl text-gray-400 mb-4" />
              <h2 className={`${fontSizes.subtitle} font-bold mb-2`}>Szczegółowe zarządzanie użytkownikami</h2>
              <p className={`${fontSizes.text} text-gray-500 mb-4`}>
                Pełna funkcjonalność zarządzania użytkownikami będzie dostępna wkrótce
              </p>
              <div className="space-y-2 text-left max-w-md mx-auto">
                <p className={`${fontSizes.text} text-gray-600`}>Planowane funkcje:</p>
                <ul className={`${fontSizes.text} text-gray-600 space-y-1`}>
                  <li>• Przeglądanie listy użytkowników z paginacją</li>
                  <li>• Zawieszanie i odbanowywanie kont</li>
                  <li>• Weryfikacja kont firmowych</li>
                  <li>• Zarządzanie uprawnieniami</li>
                  <li>• Historia aktywności użytkowników</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'drugs':
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h1 className={`${fontSizes.title} font-bold mb-2`}>Zarządzanie Bazą Leków</h1>
              <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Import i zarządzanie bazą danych leków z plików CSV
              </p>
            </div>

            {/* Status bazy */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaPills className="text-pink-500 text-2xl mr-3" />
                  <div>
                    <h2 className={`${fontSizes.subtitle} font-bold`}>Status bazy danych</h2>
                    <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Ostatnia aktualizacja: {drugStats?.last_update ? new Date(drugStats.last_update).toLocaleDateString('pl-PL', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'Brak danych'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`${fontSizes.title} font-bold text-green-600`}>{drugStats?.total_drugs || 0}</p>
                  <p className={`${fontSizes.text} text-gray-500`}>leków w bazie</p>
                </div>
              </div>
            </div>

            {/* Import CSV */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
              <h2 className={`${fontSizes.subtitle} font-bold mb-4`}>Import z pliku CSV</h2>
              
              <div className="space-y-4">
                {/* File Upload */}
                <div>
                  <label className={`block ${fontSizes.text} font-medium mb-2`}>
                    Wybierz plik CSV z bazą leków
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className={`cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm ${fontSizes.text} font-medium ${
                      darkMode 
                        ? 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    } focus-within:ring-2 focus-within:ring-[#38b6ff] focus-within:ring-offset-2 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <FaCloudUploadAlt className="mr-2" />
                      Wybierz plik CSV
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                        className="sr-only"
                        disabled={uploading}
                      />
                    </label>
                    
                    <button
                      onClick={downloadCSVTemplate}
                      className={`${fontSizes.button} px-4 py-2 border rounded-lg transition-colors ${
                        darkMode
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <FaFileAlt className="mr-2" />
                      Pobierz szablon
                    </button>
                    
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
                  <div className={`p-3 rounded-lg whitespace-pre-line ${
                    uploadMessage.includes('✅') 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    <p className={fontSizes.text}>{uploadMessage}</p>
                  </div>
                )}

                {/* Format Requirements */}
                <div className={`p-4 rounded-lg ${
                  darkMode 
                    ? 'bg-blue-900 border border-blue-700' 
                    : 'bg-blue-50 border border-blue-200'
                }`}>
                  <h3 className={`${fontSizes.text} font-bold mb-2 text-blue-800`}>Wymagania formatu CSV:</h3>
                  <ul className={`${fontSizes.text} text-blue-700 space-y-1`}>
                    <li>• Kodowanie: UTF-8</li>
                    <li>• Separator: przecinek (,)</li>
                    <li>• Kolumny: nazwa, substancja_czynna, kod_atc, dawkowanie, producent, cena, dostepnosc</li>
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
                  <FaPills className="text-blue-500 text-2xl mr-3" />
                  <div>
                    <p className={`${fontSizes.text} font-medium`}>Z importu CSV</p>
                    <p className={`${fontSizes.title} font-bold`}>{drugStats?.by_source?.import_csv || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
                <div className="flex items-center">
                  <FaBuilding className="text-green-500 text-2xl mr-3" />
                  <div>
                    <p className={`${fontSizes.text} font-medium`}>Producenci</p>
                    <p className={`${fontSizes.title} font-bold`}>{drugStats?.manufacturers_count || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
                <div className="flex items-center">
                  <FaExclamationTriangle className="text-orange-500 text-2xl mr-3" />
                  <div>
                    <p className={`${fontSizes.text} font-medium`}>Brak w magazynie</p>
                    <p className={`${fontSizes.title} font-bold`}>{drugStats?.by_availability?.brak || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );


      default:
        return <div>Nieznana sekcja</div>;
    }
  };

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
              { id: 'users', label: 'Użytkownicy', icon: FaUsersCog }
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
        {renderContent()}

        {/* Detail Modal */}
        {showDetailModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto`}>
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className={`${fontSizes.subtitle} font-bold`}>
                    Szczegóły {showDetailModal.type === 'job' ? 'oferty pracy' : 'wydarzenia'}
                  </h2>
                  <button 
                    onClick={() => setShowDetailModal(null)} 
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
                
                {showDetailModal.type === 'job' ? (
                  () => {
                    const job = exampleDataService.getJobOfferById(showDetailModal.id);
                    if (!job) return <p>Nie znaleziono oferty</p>;
                    
                    return (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <h3 className={`${fontSizes.text} font-semibold mb-2`}>Podstawowe informacje</h3>
                            <div className="space-y-2">
                              <p><strong>Stanowisko:</strong> {job.position}</p>
                              <p><strong>Firma:</strong> {job.company}</p>
                              <p><strong>Lokalizacja:</strong> {job.location}</p>
                              <p><strong>Typ zatrudnienia:</strong> {job.employment_type}</p>
                              <p><strong>Poziom doświadczenia:</strong> {job.experience_level}</p>
                              <p><strong>Wynagrodzenie:</strong> {job.salary_range}</p>
                              <p><strong>Status:</strong> {getStatusBadge(job.status, job.rejection_reason)}</p>
                              <p><strong>Data utworzenia:</strong> {job.created_at.toLocaleDateString('pl-PL')}</p>
                              <p><strong>Data ważności:</strong> {job.expires_at.toLocaleDateString('pl-PL')}</p>
                              {job.admin_comment && (
                                <p><strong>Komentarz administratora:</strong> {job.admin_comment}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <h3 className={`${fontSizes.text} font-semibold mb-2`}>Opis stanowiska</h3>
                            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                              <p className={fontSizes.text}>{job.description}</p>
                            </div>
                          </div>
                          
                          {typeof job.requirements === 'string' && (
                            <div>
                              <h3 className={`${fontSizes.text} font-semibold mb-2`}>Wymagania</h3>
                              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                <p className={fontSizes.text}>{job.requirements}</p>
                              </div>
                            </div>
                          )}
                          
                          {typeof job.benefits === 'string' && (
                            <div>
                              <h3 className={`${fontSizes.text} font-semibold mb-2`}>Benefity</h3>
                              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                <p className={fontSizes.text}>{job.benefits}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                )() : (
                  () => {
                    const event = exampleDataService.getEventById(showDetailModal.id);
                    if (!event) return <p>Nie znaleziono wydarzenia</p>;
                    
                    return (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <h3 className={`${fontSizes.text} font-semibold mb-2`}>Podstawowe informacje</h3>
                            <div className="space-y-2">
                              <p><strong>Tytuł:</strong> {event.title}</p>
                              <p><strong>Typ:</strong> {event.type === 'webinar' ? 'Webinar' : 'Konferencja'}</p>
                              <p><strong>Organizator:</strong> {event.organizer}</p>
                              <p><strong>Data:</strong> {event.date.toLocaleDateString('pl-PL')}</p>
                              {event.location && <p><strong>Lokalizacja:</strong> {event.location}</p>}
                              {event.online_url && <p><strong>URL online:</strong> {event.online_url}</p>}
                              <p><strong>Uczestnicy:</strong> {event.current_participants}/{event.max_participants}</p>
                              <p><strong>Status:</strong> {getStatusBadge(event.status, event.rejection_reason)}</p>
                              <p><strong>Data utworzenia:</strong> {event.created_at.toLocaleDateString('pl-PL')}</p>
                              {event.admin_comment && (
                                <p><strong>Komentarz administratora:</strong> {event.admin_comment}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <h3 className={`${fontSizes.text} font-semibold mb-2`}>Opis wydarzenia</h3>
                            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                              <p className={fontSizes.text}>{event.description}</p>
                            </div>
                          </div>
                          
                          {event.program && (
                            <div>
                              <h3 className={`${fontSizes.text} font-semibold mb-2`}>Program</h3>
                              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                <p className={fontSizes.text}>{event.program}</p>
                              </div>
                            </div>
                          )}
                          
                          {event.speakers && (
                            <div>
                              <h3 className={`${fontSizes.text} font-semibold mb-2`}>Prelegenci</h3>
                              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                <p className={fontSizes.text}>{event.speakers}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                )()}
                
                {/* Action buttons in detail modal */}
                {(() => {
                  const item = showDetailModal.type === 'job' 
                    ? exampleDataService.getJobOfferById(showDetailModal.id)
                    : exampleDataService.getEventById(showDetailModal.id);
                  
                  return item?.status === 'pending' && (
                    <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                      <button
                        onClick={() => {
                          handleApprove(showDetailModal.id, showDetailModal.type);
                          setShowDetailModal(null);
                        }}
                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                      >
                        <FaCheck /> Zaakceptuj
                      </button>
                      <button
                        onClick={() => {
                          handleReject(showDetailModal.id, showDetailModal.type);
                          setShowDetailModal(null);
                        }}
                        className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                      >
                        <FaTimes /> Odrzuć
                      </button>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-xl max-w-lg w-full mx-4`}>
              <h3 className={`${fontSizes.subtitle} font-bold mb-4`}>
                <FaExclamationTriangle className="inline mr-2 text-red-500" />
                Odrzuć {selectedItem?.type === 'job' ? 'ofertę pracy' : 'wydarzenie'}
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
                
                {/* Optional admin comment */}
                <div>
                  <label className={`block ${fontSizes.text} font-medium mb-2`}>
                    Dodatkowy komentarz (opcjonalnie):
                  </label>
                  <textarea
                    value={adminComment}
                    onChange={(e) => setAdminComment(e.target.value)}
                    placeholder="Dodatkowe uwagi dla firmy/organizatora..."
                    className={`w-full p-3 border rounded-lg ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300'
                    } focus:ring-2 focus:ring-[#38b6ff] focus:border-transparent`}
                    rows={2}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setSelectedItem(null);
                    setSelectedRejectReason('');
                    setCustomRejectReason('');
                    setAdminComment('');
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
      </div>
    </div>
  );
};

export default AdminPanel;