import React, { useState, useEffect } from 'react';
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaGraduationCap,
  FaArrowLeft,
  FaBuilding,
  FaHandshake,
  FaBriefcase,
  FaClock,
  FaEnvelope,
  FaShare,
  FaBookmark,
  FaRegBookmark,
  FaTimes,
} from 'react-icons/fa';
import { getJobOfferBySlug, generateSlug, JobOffer } from '../../lib/api/job-offers';
import { updateSEO } from '../../utils/seo';

interface JobOfferDetailPageProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  slug: string | null;
}

const JobOfferDetailPage: React.FC<JobOfferDetailPageProps> = ({
  darkMode,
  fontSize,
  slug,
}) => {
  const [jobOffer, setJobOffer] = useState<JobOffer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const navigateToJobOffers = () => {
    window.history.pushState({}, '', '/praca');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const fetchJobOffer = async () => {
    if (!slug) {
      setError('Brak parametru slug');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await getJobOfferBySlug(slug);

    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    if (data) {
      setJobOffer(data);
      
      // Update SEO
      const seoData = generateJobOfferSEO(data);
      updateMetaTags(seoData);
      
      // Check if bookmarked (from localStorage)
      const bookmarkedJobs = JSON.parse(localStorage.getItem('bookmarkedJobs') || '[]');
      setIsBookmarked(bookmarkedJobs.includes(data.id));
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchJobOffer();
  }, [slug]);

  const calculateTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

    if (diffHours < 1) return 'Mniej niż godzina temu';
    if (diffHours < 24)
      return `${diffHours} ${diffHours === 1 ? 'godzina' : diffHours < 5 ? 'godziny' : 'godzin'} temu`;
    if (diffDays < 7)
      return `${diffDays} ${diffDays === 1 ? 'dzień' : 'dni'} temu`;
    if (diffDays < 30)
      return `${Math.floor(diffDays / 7)} ${Math.floor(diffDays / 7) === 1 ? 'tydzień' : 'tygodnie'} temu`;
    return `${Math.floor(diffDays / 30)} ${Math.floor(diffDays / 30) === 1 ? 'miesiąc' : 'miesiące'} temu`;
  };

  const handleBookmark = () => {
    if (!jobOffer) return;

    const bookmarkedJobs = JSON.parse(localStorage.getItem('bookmarkedJobs') || '[]');
    
    if (isBookmarked) {
      const updatedBookmarks = bookmarkedJobs.filter((id: string) => id !== jobOffer.id);
      localStorage.setItem('bookmarkedJobs', JSON.stringify(updatedBookmarks));
      setIsBookmarked(false);
    } else {
      bookmarkedJobs.push(jobOffer.id);
      localStorage.setItem('bookmarkedJobs', JSON.stringify(bookmarkedJobs));
      setIsBookmarked(true);
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Link skopiowany do schowka!');
    } catch (err) {
      console.error('Nie udało się skopiować linku:', err);
    }
  };

  const shareViaEmail = () => {
    if (!jobOffer) return;
    
    const subject = `Oferta pracy: ${jobOffer.position} - ${jobOffer.company}`;
    const body = `Sprawdź tę ofertę pracy:\n\n${jobOffer.position} w ${jobOffer.company}\nLokalizacja: ${jobOffer.location}\n\nLink: ${window.location.href}`;
    
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          title: 'text-2xl md:text-3xl',
          subtitle: 'text-base md:text-lg',
          cardTitle: 'text-lg md:text-xl',
          cardText: 'text-sm md:text-base',
          buttonText: 'text-sm',
        };
      case 'large':
        return {
          title: 'text-4xl md:text-5xl',
          subtitle: 'text-xl md:text-2xl',
          cardTitle: 'text-2xl md:text-3xl',
          cardText: 'text-lg md:text-xl',
          buttonText: 'text-lg',
        };
      default:
        return {
          title: 'text-3xl md:text-4xl',
          subtitle: 'text-lg md:text-xl',
          cardTitle: 'text-xl md:text-2xl',
          cardText: 'text-base md:text-lg',
          buttonText: 'text-base',
        };
    }
  };

  const fontSizes = getFontSizeClasses();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Lekarze':
        return '👨‍⚕️';
      case 'Pielęgniarki':
        return '👩‍⚕️';
      case 'Fizjoterapeuci':
        return '💪';
      case 'Farmaceuci':
        return '💊';
      case 'Technicy':
        return '🔬';
      case 'Ratownicy':
        return '🚑';
      default:
        return '🏥';
    }
  };

  const getFacilityTypeColor = (type?: string) => {
    if (!type) return '';
    
    switch (type) {
      case 'Prywatna placówka':
        return darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800';
      case 'AOS':
        return darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800';
      default:
        return darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen py-12 ${darkMode ? 'bg-black' : 'bg-white'} transition-colors duration-300`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#38b6ff] mx-auto"></div>
            <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Ładowanie oferty pracy...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !jobOffer) {
    return (
      <div
        className={`min-h-screen py-12 ${darkMode ? 'bg-black' : 'bg-white'} transition-colors duration-300`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className={`text-6xl mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
              🔍
            </div>
            <h1
              className={`${fontSizes.title} font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}
            >
              {error ? 'Wystąpił błąd' : 'Oferta nie została znaleziona'}
            </h1>
            <p
              className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}
            >
              {error || 'Przepraszamy, nie można znaleźć oferty o podanym adresie.'}
            </p>
            <button
              onClick={navigateToJobOffers}
              className={`inline-flex items-center px-6 py-3 ${fontSizes.buttonText} font-semibold rounded-lg transition-colors duration-200 bg-[#38b6ff] text-black hover:bg-[#2a9fe5] shadow-md hover:shadow-lg`}
            >
              <FaArrowLeft className="mr-2" />
              Powrót do listy ofert
            </button>
          </div>
        </div>
      </div>
    );
  }

  const timeAgo = calculateTimeAgo(jobOffer.postedDate);

  return (
    <div
      className={`min-h-screen py-12 ${darkMode ? 'bg-black' : 'bg-white'} transition-colors duration-300`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={navigateToJobOffers}
            className={`inline-flex items-center px-4 py-2 ${fontSizes.buttonText} font-medium rounded-lg transition-colors duration-200 ${
              darkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
            }`}
          >
            <FaArrowLeft className="mr-2" />
            Powrót do listy ofert
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header Card */}
            <div
              className={`rounded-lg shadow-lg overflow-hidden mb-8 ${
                darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Logo */}
                    <div
                      className={`w-16 h-16 rounded-lg flex items-center justify-center text-2xl shrink-0 ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-100'
                      }`}
                    >
                      {jobOffer.logo ? (
                        <img
                          src={jobOffer.logo}
                          alt={`Logo ${jobOffer.company}`}
                          className="w-12 h-12 object-contain"
                        />
                      ) : (
                        <span>{getCategoryIcon(jobOffer.category)}</span>
                      )}
                    </div>

                    <div className="flex-1">
                      <h1
                        className={`${fontSizes.title} font-bold ${darkMode ? 'text-white' : 'text-black'} mb-2`}
                      >
                        {jobOffer.position}
                      </h1>
                      <div className="flex items-center flex-wrap gap-3 mb-4">
                        <span
                          className={`${fontSizes.subtitle} font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                        >
                          {jobOffer.company}
                        </span>
                        {jobOffer.facilityType && (
                          <span
                            className={`text-sm px-3 py-1 rounded-full font-medium ${getFacilityTypeColor(
                              jobOffer.facilityType
                            )}`}
                          >
                            {jobOffer.facilityType}
                          </span>
                        )}
                        {jobOffer.zamow_medyczny && (
                          <span
                            className={`text-sm px-3 py-1 rounded-full font-medium ${
                              darkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            ⚕️ Zawód medyczny
                          </span>
                        )}
                      </div>

                      {/* Quick Info */}
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <FaMapMarkerAlt className="text-[#38b6ff]" />
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                            {jobOffer.location}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FaBriefcase className="text-[#38b6ff]" />
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                            {jobOffer.contractType}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FaClock className="text-[#38b6ff]" />
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{timeAgo}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={handleBookmark}
                      className={`p-2 rounded-lg transition-colors duration-200 ${
                        darkMode
                          ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                          : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                      }`}
                      aria-label={isBookmarked ? 'Usuń z zapisanych' : 'Zapisz ofertę'}
                    >
                      {isBookmarked ? (
                        <FaBookmark className="text-[#38b6ff]" />
                      ) : (
                        <FaRegBookmark />
                      )}
                    </button>

                    <button
                      onClick={handleShare}
                      className={`p-2 rounded-lg transition-colors duration-200 ${
                        darkMode
                          ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                          : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                      }`}
                      aria-label="Udostępnij ofertę"
                    >
                      <FaShare />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div
              className={`rounded-lg shadow-lg p-6 mb-8 ${
                darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}
            >
              <h2
                className={`${fontSizes.cardTitle} font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}
              >
                Opis stanowiska
              </h2>
              <div
                className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}
              >
                {jobOffer.description.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-3 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Requirements & Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className={`rounded-lg shadow-lg p-6 ${
                  darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}
              >
                <h3
                  className={`${fontSizes.cardTitle} font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}
                >
                  Wymagania
                </h3>
                <ul
                  className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'} space-y-2`}
                >
                  <li className="flex items-start space-x-2">
                    <span className="text-[#38b6ff] mt-1">•</span>
                    <span>Wykształcenie medyczne zgodne ze stanowiskiem</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#38b6ff] mt-1">•</span>
                    <span>Aktualne uprawnienia do wykonywania zawodu</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#38b6ff] mt-1">•</span>
                    <span>Doświadczenie w pracy na podobnym stanowisku</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#38b6ff] mt-1">•</span>
                    <span>Umiejętność pracy w zespole</span>
                  </li>
                </ul>
              </div>

              <div
                className={`rounded-lg shadow-lg p-6 ${
                  darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}
              >
                <h3
                  className={`${fontSizes.cardTitle} font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}
                >
                  Co oferujemy
                </h3>
                <ul
                  className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'} space-y-2`}
                >
                  <li className="flex items-start space-x-2">
                    <span className="text-[#38b6ff] mt-1">•</span>
                    <span>Atrakcyjne wynagrodzenie</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#38b6ff] mt-1">•</span>
                    <span>Stabilne zatrudnienie</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#38b6ff] mt-1">•</span>
                    <span>Możliwości rozwoju zawodowego</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#38b6ff] mt-1">•</span>
                    <span>Nowoczesne wyposażenie</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Salary Info */}
            <div
              className={`rounded-lg shadow-lg p-6 mb-6 ${
                darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}
            >
              <h3
                className={`${fontSizes.cardText} font-bold mb-3 ${darkMode ? 'text-white' : 'text-black'}`}
              >
                <FaMoneyBillWave className="inline mr-2 text-[#38b6ff]" />
                Wynagrodzenie
              </h3>
              {jobOffer.salary && jobOffer.salary !== 'Nie podano' ? (
                <>
                  <div className={`${fontSizes.subtitle} font-bold text-[#38b6ff] mb-1`}>
                    {jobOffer.salary}
                  </div>
                  {jobOffer.salaryType && jobOffer.salaryType !== 'Nie podano' && (
                    <div
                      className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                    >
                      {jobOffer.salaryType}
                    </div>
                  )}
                </>
              ) : (
                <div
                  className={`${fontSizes.cardText} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  Do uzgodnienia
                </div>
              )}
            </div>

            {/* Job Details */}
            <div
              className={`rounded-lg shadow-lg p-6 mb-6 ${
                darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}
            >
              <h3
                className={`${fontSizes.cardText} font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}
              >
                Szczegóły oferty
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FaBuilding className="text-[#38b6ff]" />
                  <div>
                    <p
                      className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                    >
                      Kategoria
                    </p>
                    <p
                      className={`font-medium ${darkMode ? 'text-white' : 'text-black'}`}
                    >
                      {jobOffer.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <FaHandshake className="text-[#38b6ff]" />
                  <div>
                    <p
                      className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                    >
                      Typ umowy
                    </p>
                    <p
                      className={`font-medium ${darkMode ? 'text-white' : 'text-black'}`}
                    >
                      {jobOffer.contractType}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <FaCalendarAlt className="text-[#38b6ff]" />
                  <div>
                    <p
                      className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                    >
                      Data publikacji
                    </p>
                    <p
                      className={`font-medium ${darkMode ? 'text-white' : 'text-black'}`}
                    >
                      {new Date(jobOffer.postedDate).toLocaleDateString('pl-PL')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <button
              className={`w-full py-3 px-6 ${fontSizes.buttonText} font-semibold rounded-lg transition-all duration-200 mb-4 bg-[#38b6ff] text-black hover:bg-[#2a9fe5] shadow-md hover:shadow-lg`}
              onClick={() => alert('Funkcja aplikowania będzie dostępna wkrótce!')}
            >
              <FaEnvelope className="inline mr-2" />
              Aplikuj na to stanowisko
            </button>

            {/* Contact Info */}
            <div
              className={`rounded-lg shadow-lg p-6 ${
                darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}
            >
              <h3
                className={`${fontSizes.cardText} font-bold mb-3 ${darkMode ? 'text-white' : 'text-black'}`}
              >
                Kontakt
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <FaBuilding className="text-[#38b6ff]" />
                  <span
                    className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    {jobOffer.company}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaMapMarkerAlt className="text-[#38b6ff]" />
                  <span
                    className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    {jobOffer.location}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`rounded-lg shadow-xl max-w-md w-full ${
              darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3
                  className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-black'}`}
                >
                  Udostępnij ofertę
                </h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className={`p-1 rounded transition-colors ${
                    darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => copyToClipboard(window.location.href)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    darkMode
                      ? 'hover:bg-gray-700 text-gray-300'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  📋 Skopiuj link
                </button>

                <button
                  onClick={shareViaEmail}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    darkMode
                      ? 'hover:bg-gray-700 text-gray-300'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  📧 Udostępnij przez email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobOfferDetailPage;