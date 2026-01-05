import React, { useState } from 'react';
import { 
  FaClock, FaCalendarAlt, FaExclamationTriangle, FaCheck, 
  FaTimes, FaInfoCircle, FaPlus
} from 'react-icons/fa';
import { exampleDataService, JobOffer } from '../services/exampleDataService';

interface ExpiryManagementModalProps {
  jobOffer: JobOffer;
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  onClose: () => void;
  onExtended?: () => void;
}

const ExpiryManagementModal: React.FC<ExpiryManagementModalProps> = ({
  jobOffer,
  darkMode,
  fontSize,
  onClose,
  onExtended
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fontSizeClasses = {
    small: {
      title: 'text-lg',
      subtitle: 'text-base',
      text: 'text-sm',
      label: 'text-xs',
      button: 'text-sm px-3 py-1'
    },
    medium: {
      title: 'text-xl',
      subtitle: 'text-lg',
      text: 'text-base',
      label: 'text-sm',
      button: 'text-base px-4 py-2'
    },
    large: {
      title: 'text-2xl',
      subtitle: 'text-xl',
      text: 'text-lg',
      label: 'text-base',
      button: 'text-lg px-5 py-3'
    }
  };

  const fontSizes = fontSizeClasses[fontSize];

  const handleExtend = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const extended = exampleDataService.extendJobOffer(jobOffer.id, 100);
      
      if (extended) {
        setSuccess(true);
        setTimeout(() => {
          if (onExtended) onExtended();
          onClose();
        }, 1500);
      } else {
        setError('Nie można przedłużyć tej oferty');
      }
    } catch (err) {
      setError('Wystąpił błąd podczas przedłużania oferty');
    } finally {
      setLoading(false);
    }
  };

  const isExpired = new Date() > jobOffer.expires_at;
  const daysUntilExpiry = Math.ceil((jobOffer.expires_at.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const extensionCount = jobOffer.extension_count || 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-w-2xl w-full`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className={`${fontSizes.title} font-bold flex items-center`}>
                <FaClock className="mr-2 text-orange-500" />
                Zarządzanie wygaśnięciem
              </h2>
              <p className={`${fontSizes.text} text-gray-600 mt-1`}>
                {jobOffer.position}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-1"
              disabled={loading}
            >
              <FaTimes size={20} />
            </button>
          </div>

          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheck className="text-2xl text-green-600" />
              </div>
              <h3 className={`${fontSizes.subtitle} font-bold mb-2`}>Oferta została przedłużona!</h3>
              <p className={`${fontSizes.text} text-gray-600`}>
                Oferta jest teraz ważna przez kolejne 100 dni.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Current Status */}
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg`}>
                <h3 className={`${fontSizes.subtitle} font-semibold mb-3`}>Aktualny status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`${fontSizes.text} text-gray-600`}>Data utworzenia:</span>
                    <span className={fontSizes.text}>{jobOffer.created_at.toLocaleDateString('pl-PL')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`${fontSizes.text} text-gray-600`}>Data wygaśnięcia:</span>
                    <span className={`${fontSizes.text} ${isExpired ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                      {jobOffer.expires_at.toLocaleDateString('pl-PL')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`${fontSizes.text} text-gray-600`}>Status:</span>
                    <span className={`${fontSizes.text} ${
                      isExpired ? 'text-red-600' : daysUntilExpiry <= 7 ? 'text-orange-600' : 'text-green-600'
                    }`}>
                      {isExpired 
                        ? 'Wygasła' 
                        : daysUntilExpiry <= 7 
                          ? `Wygasa za ${daysUntilExpiry} dni` 
                          : `Aktywna (${daysUntilExpiry} dni do wygaśnięcia)`
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`${fontSizes.text} text-gray-600`}>Liczba przedłużeń:</span>
                    <span className={fontSizes.text}>{extensionCount}</span>
                  </div>
                </div>
              </div>

              {/* Extension Info */}
              <div className={`${darkMode ? 'bg-blue-900' : 'bg-blue-50'} p-4 rounded-lg border border-blue-200`}>
                <div className="flex items-start">
                  <FaInfoCircle className="text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className={`${fontSizes.text} font-medium text-blue-800 mb-2`}>
                      Zasady przedłużania ofert pracy
                    </h4>
                    <ul className={`${fontSizes.label} text-blue-700 space-y-1`}>
                      <li>• Oferty można przedłużać na kolejne 100 dni</li>
                      <li>• Przedłużenie jest możliwe tylko dla zaakceptowanych ofert</li>
                      <li>• Można przedłużyć ofertę wielokrotnie</li>
                      <li>• Przedłużenie jest możliwe zarówno przed, jak i po wygaśnięciu</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
                  <FaExclamationTriangle className="mr-2" />
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className={`${fontSizes.button} border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors`}
                  disabled={loading}
                >
                  Anuluj
                </button>
                <button
                  onClick={handleExtend}
                  disabled={loading || !jobOffer.can_extend}
                  className={`${fontSizes.button} bg-[#38b6ff] text-black rounded-lg hover:bg-[#2a9fe5] transition-colors disabled:opacity-50 flex items-center gap-2`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                      Przedłużanie...
                    </>
                  ) : (
                    <>
                      <FaPlus />
                      Przedłuż o 100 dni
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpiryManagementModal;