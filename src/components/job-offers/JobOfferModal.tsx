import React, { useEffect, useRef } from 'react';
import {
  FaTimes,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaBriefcase,
  FaBuilding,
  FaClock,
  FaEnvelope,
  FaPhone,
  FaExternalLinkAlt,
  FaBookmark,
  FaRegBookmark,
  FaShare,
} from 'react-icons/fa';

interface JobOffer {
  id: string;
  company: string;
  position: string;
  contractType: string;
  location: string;
  category: string;
  description: string;
  postedDate: string;
  salary?: string;
  salaryType?: string;
  facilityType?: string;
  logo?: string;
  timeAgo?: string;
  zamow_medyczny?: boolean;
}

interface JobOfferModalProps {
  jobOffer: JobOffer;
  isOpen: boolean;
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  isBookmarked?: boolean;
  onClose: () => void;
  onApply?: () => void;
  onBookmark?: () => void;
  onShare?: () => void;
}

const JobOfferModal: React.FC<JobOfferModalProps> = ({
  jobOffer,
  isOpen,
  darkMode,
  fontSize,
  isBookmarked = false,
  onClose,
  onApply,
  onBookmark,
  onShare,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          title: 'text-xl md:text-2xl',
          subtitle: 'text-lg',
          text: 'text-sm md:text-base',
          small: 'text-xs md:text-sm',
          button: 'text-sm',
        };
      case 'large':
        return {
          title: 'text-3xl md:text-4xl',
          subtitle: 'text-2xl',
          text: 'text-lg md:text-xl',
          small: 'text-base md:text-lg',
          button: 'text-lg',
        };
      default:
        return {
          title: 'text-2xl md:text-3xl',
          subtitle: 'text-xl',
          text: 'text-base md:text-lg',
          small: 'text-sm md:text-base',
          button: 'text-base',
        };
    }
  };

  const fontSizes = getFontSizeClasses();

  // Handle escape key and click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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

  const formatDescription = (description: string) => {
    // Simple formatting: split by newlines and render as paragraphs
    return description.split('\n').filter(line => line.trim()).map((paragraph, index) => (
      <p key={index} className="mb-3 last:mb-0">
        {paragraph}
      </p>
    ));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className={`
          rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col
          ${darkMode
            ? 'bg-black border border-gray-700'
            : 'bg-white border border-gray-200'
          }
        `}
      >
        {/* Header */}
        <div
          className={`
            p-6 border-b flex-shrink-0
            ${darkMode ? 'border-gray-700' : 'border-gray-200'}
          `}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1">
              {/* Logo */}
              <div
                className={`
                  w-16 h-16 rounded-lg flex items-center justify-center text-2xl shrink-0
                  ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}
                `}
              >
                {jobOffer.logo ? (
                  <img
                    src={jobOffer.logo}
                    alt={`Logo ${jobOffer.company}`}
                    className="w-14 h-14 object-contain"
                  />
                ) : (
                  <span>{getCategoryIcon(jobOffer.category)}</span>
                )}
              </div>

              {/* Title and Company */}
              <div className="flex-1 min-w-0">
                <h1
                  className={`
                    ${fontSizes.title} font-bold mb-2
                    ${darkMode ? 'text-white' : 'text-gray-900'}
                  `}
                >
                  {jobOffer.position}
                </h1>
                <div className="flex items-center flex-wrap gap-3 mb-3">
                  <span
                    className={`
                      ${fontSizes.subtitle} font-medium
                      ${darkMode ? 'text-gray-300' : 'text-gray-600'}
                    `}
                  >
                    {jobOffer.company}
                  </span>
                  {jobOffer.facilityType && (
                    <span
                      className={`
                        ${fontSizes.small} px-3 py-1 rounded-full font-medium
                        ${getFacilityTypeColor(jobOffer.facilityType)}
                      `}
                    >
                      {jobOffer.facilityType}
                    </span>
                  )}
                  {jobOffer.zamow_medyczny && (
                    <span
                      className={`
                        ${fontSizes.small} px-3 py-1 rounded-full font-medium
                        ${darkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800'}
                      `}
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
                  {jobOffer.timeAgo && (
                    <div className="flex items-center space-x-1">
                      <FaClock className="text-[#38b6ff]" />
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                        {jobOffer.timeAgo}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 ml-4">
              {onBookmark && (
                <button
                  onClick={onBookmark}
                  className={`
                    p-2 rounded-lg transition-colors duration-200
                    ${darkMode
                      ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                      : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                    }
                  `}
                  aria-label={isBookmarked ? 'Usuń z zapisanych' : 'Zapisz ofertę'}
                >
                  {isBookmarked ? <FaBookmark className="text-[#38b6ff]" /> : <FaRegBookmark />}
                </button>
              )}

              {onShare && (
                <button
                  onClick={onShare}
                  className={`
                    p-2 rounded-lg transition-colors duration-200
                    ${darkMode
                      ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                      : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                    }
                  `}
                  aria-label="Udostępnij ofertę"
                >
                  <FaShare />
                </button>
              )}

              <button
                onClick={onClose}
                className={`
                  p-2 rounded-lg transition-colors duration-200
                  ${darkMode
                    ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                  }
                `}
                aria-label="Zamknij modal"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Job Description */}
                <section className="mb-8">
                  <h2
                    className={`
                      ${fontSizes.subtitle} font-bold mb-4
                      ${darkMode ? 'text-white' : 'text-gray-900'}
                    `}
                  >
                    Opis stanowiska
                  </h2>
                  <div
                    className={`
                      ${fontSizes.text} leading-relaxed
                      ${darkMode ? 'text-gray-300' : 'text-gray-700'}
                    `}
                  >
                    {formatDescription(jobOffer.description)}
                  </div>
                </section>

                {/* Requirements */}
                <section className="mb-8">
                  <h2
                    className={`
                      ${fontSizes.subtitle} font-bold mb-4
                      ${darkMode ? 'text-white' : 'text-gray-900'}
                    `}
                  >
                    Wymagania
                  </h2>
                  <div
                    className={`
                      ${fontSizes.text}
                      ${darkMode ? 'text-gray-300' : 'text-gray-700'}
                    `}
                  >
                    <ul className="list-disc list-inside space-y-2">
                      <li>Wykształcenie medyczne zgodne ze stanowiskiem</li>
                      <li>Aktualne uprawnienia do wykonywania zawodu</li>
                      <li>Doświadczenie w pracy na podobnym stanowisku</li>
                      <li>Umiejętność pracy w zespole</li>
                      <li>Komunikatywność i empatia</li>
                    </ul>
                  </div>
                </section>

                {/* Benefits */}
                <section className="mb-8">
                  <h2
                    className={`
                      ${fontSizes.subtitle} font-bold mb-4
                      ${darkMode ? 'text-white' : 'text-gray-900'}
                    `}
                  >
                    Co oferujemy
                  </h2>
                  <div
                    className={`
                      ${fontSizes.text}
                      ${darkMode ? 'text-gray-300' : 'text-gray-700'}
                    `}
                  >
                    <ul className="list-disc list-inside space-y-2">
                      <li>Atrakcyjne wynagrodzenie</li>
                      <li>Stabilne zatrudnienie</li>
                      <li>Możliwości rozwoju zawodowego</li>
                      <li>Nowoczesne wyposażenie</li>
                      <li>Przyjazna atmosfera pracy</li>
                    </ul>
                  </div>
                </section>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                {/* Salary Info */}
                <div
                  className={`
                    rounded-lg p-4 mb-6
                    ${darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50 border border-gray-200'}
                  `}
                >
                  <h3
                    className={`
                      ${fontSizes.text} font-bold mb-3
                      ${darkMode ? 'text-white' : 'text-gray-900'}
                    `}
                  >
                    <FaMoneyBillWave className="inline mr-2 text-[#38b6ff]" />
                    Wynagrodzenie
                  </h3>
                  {jobOffer.salary && jobOffer.salary !== 'Nie podano' ? (
                    <>
                      <div
                        className={`
                          ${fontSizes.subtitle} font-bold text-[#38b6ff] mb-1
                        `}
                      >
                        {jobOffer.salary}
                      </div>
                      {jobOffer.salaryType && jobOffer.salaryType !== 'Nie podano' && (
                        <div
                          className={`
                            ${fontSizes.small}
                            ${darkMode ? 'text-gray-400' : 'text-gray-600'}
                          `}
                        >
                          {jobOffer.salaryType}
                        </div>
                      )}
                    </>
                  ) : (
                    <div
                      className={`
                        ${fontSizes.text}
                        ${darkMode ? 'text-gray-400' : 'text-gray-600'}
                      `}
                    >
                      Do uzgodnienia
                    </div>
                  )}
                </div>

                {/* Job Details */}
                <div
                  className={`
                    rounded-lg p-4 mb-6
                    ${darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50 border border-gray-200'}
                  `}
                >
                  <h3
                    className={`
                      ${fontSizes.text} font-bold mb-3
                      ${darkMode ? 'text-white' : 'text-gray-900'}
                    `}
                  >
                    Szczegóły oferty
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span
                        className={`
                          ${fontSizes.small}
                          ${darkMode ? 'text-gray-400' : 'text-gray-600'}
                        `}
                      >
                        Kategoria:
                      </span>
                      <span
                        className={`
                          ${fontSizes.small} font-medium
                          ${darkMode ? 'text-white' : 'text-gray-900'}
                        `}
                      >
                        {jobOffer.category}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span
                        className={`
                          ${fontSizes.small}
                          ${darkMode ? 'text-gray-400' : 'text-gray-600'}
                        `}
                      >
                        Typ umowy:
                      </span>
                      <span
                        className={`
                          ${fontSizes.small} font-medium
                          ${darkMode ? 'text-white' : 'text-gray-900'}
                        `}
                      >
                        {jobOffer.contractType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span
                        className={`
                          ${fontSizes.small}
                          ${darkMode ? 'text-gray-400' : 'text-gray-600'}
                        `}
                      >
                        Data publikacji:
                      </span>
                      <span
                        className={`
                          ${fontSizes.small} font-medium
                          ${darkMode ? 'text-white' : 'text-gray-900'}
                        `}
                      >
                        {new Date(jobOffer.postedDate).toLocaleDateString('pl-PL')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Apply Button */}
                {onApply && (
                  <button
                    onClick={onApply}
                    className={`
                      w-full py-3 px-6 ${fontSizes.button} font-semibold rounded-lg
                      transition-all duration-200 mb-4
                      bg-[#38b6ff] text-black hover:bg-[#2a9fe5] 
                      shadow-md hover:shadow-lg
                    `}
                  >
                    <FaEnvelope className="inline mr-2" />
                    Aplikuj na to stanowisko
                  </button>
                )}

                {/* Contact Info */}
                <div
                  className={`
                    rounded-lg p-4
                    ${darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50 border border-gray-200'}
                  `}
                >
                  <h3
                    className={`
                      ${fontSizes.text} font-bold mb-3
                      ${darkMode ? 'text-white' : 'text-gray-900'}
                    `}
                  >
                    Kontakt
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <FaBuilding className="text-[#38b6ff]" />
                      <span
                        className={`
                          ${fontSizes.small}
                          ${darkMode ? 'text-gray-300' : 'text-gray-700'}
                        `}
                      >
                        {jobOffer.company}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaMapMarkerAlt className="text-[#38b6ff]" />
                      <span
                        className={`
                          ${fontSizes.small}
                          ${darkMode ? 'text-gray-300' : 'text-gray-700'}
                        `}
                      >
                        {jobOffer.location}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobOfferModal;