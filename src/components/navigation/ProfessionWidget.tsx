import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { MEDICAL_PROFESSIONS_10 } from '../../constants/professions';
import { FaEdit, FaTimes, FaCheck, FaUserMd } from 'react-icons/fa';

interface ProfessionWidgetProps {
  darkMode?: boolean;
}

const ProfessionWidget: React.FC<ProfessionWidgetProps> = ({ darkMode = false }) => {
  const { profile, updateProfile } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfession, setSelectedProfession] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const currentProfession = MEDICAL_PROFESSIONS_10.find(
    p => p.value === profile?.zawod
  ) || MEDICAL_PROFESSIONS_10[3]; // Default to Lekarz

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      // Focus management
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  const openModal = () => {
    setIsModalOpen(true);
    setSelectedProfession('');
    setError(null);
    setSuccess(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProfession('');
    setError(null);
    setSuccess(null);
  };

  const selectProfession = (professionValue: string) => {
    setSelectedProfession(professionValue);
  };

  const saveProfession = async () => {
    if (!selectedProfession || loading) return;

    setLoading(true);
    setError(null);

    try {
      const result = await updateProfile({ zawod: selectedProfession });
      
      if (result.error) {
        setError('Wystąpił błąd podczas zapisywania zawodu');
      } else {
        setSuccess('Zawód został pomyślnie zaktualizowany!');
        setTimeout(() => {
          closeModal();
          window.location.reload();
        }, 1500);
      }
    } catch (err) {
      setError('Wystąpił błąd podczas zapisywania zawodu');
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: string } = {
      'microscope': '🔬',
      'pills': '💊',
      'dumbbell': '🏋️‍♀️',
      'stethoscope': '🩺',
      'tooth': '🦷',
      'paw': '🐾',
      'nurse': '👩‍⚕️',
      'baby': '👶',
      'brain': '🧠',
      'ambulance': '🚑'
    };
    return iconMap[iconName] || '⚕️';
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    const toast = document.createElement('div');
    toast.className = `fixed top-6 right-6 px-6 py-4 rounded-lg font-medium z-50 transform translate-x-full transition-transform duration-300 shadow-lg`;
    toast.style.backgroundColor = type === 'success' ? '#10b981' : '#ef4444';
    toast.style.color = 'white';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  useEffect(() => {
    if (success) {
      showToast(success, 'success');
    }
    if (error) {
      showToast(error, 'error');
    }
  }, [success, error]);

  return (
    <>
      {/* Widget */}
      <div className="relative" title="Zmień zawód medyczny">
        <div 
          onClick={openModal}
          className={`flex items-center gap-2 lg:gap-3 px-2 lg:px-4 py-2 rounded-xl cursor-pointer transition-all duration-300 border ${
            darkMode 
              ? 'bg-slate-800 border-slate-700 hover:border-slate-600 hover:shadow-lg' 
              : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg'
          } hover:-translate-y-0.5`}
        >
          {/* Avatar */}
          <div 
            className="w-8 lg:w-10 h-8 lg:h-10 rounded-full flex items-center justify-center text-base lg:text-lg"
            style={{ 
              backgroundColor: `${currentProfession.color}15`,
              color: currentProfession.color 
            }}
          >
            {getIconComponent(currentProfession.icon)}
          </div>

          {/* Details - ukryj na mobile */}
          <div className="hidden lg:flex flex-col">
            <span className={`font-semibold text-sm ${
              darkMode ? 'text-white' : 'text-slate-800'
            }`}>
              {currentProfession.label}
            </span>
            <span className={`text-xs ${
              darkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Specjalizacja medyczna
            </span>
          </div>

          {/* Edit Icon - tylko na desktop */}
          <button className={`hidden lg:block p-1 rounded transition-colors ${
            darkMode 
              ? 'text-slate-400 hover:text-slate-300 hover:bg-slate-700' 
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
          }`}>
            <FaEdit className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          style={{
            animation: 'fadeIn 0.3s ease forwards'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div 
            ref={modalRef}
            className={`w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl ${
              darkMode ? 'bg-slate-800' : 'bg-white'
            }`}
            style={{
              animation: 'modalSlideIn 0.3s ease forwards'
            }}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-4 lg:p-6 border-b ${
              darkMode ? 'border-slate-700' : 'border-gray-200'
            }`}>
              <div>
                <h2 className={`text-2xl font-bold ${
                  darkMode ? 'text-white' : 'text-slate-800'
                }`}>
                  Zmień swój zawód medyczny
                </h2>
                <p className={`text-sm mt-1 ${
                  darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Wybierz zawód, aby dostosować treści do Twojej specjalizacji
                </p>
              </div>
              <button
                ref={closeButtonRef}
                onClick={closeModal}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  darkMode 
                    ? 'text-slate-400 hover:text-slate-300 hover:bg-slate-700' 
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FaTimes />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 lg:p-6 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {MEDICAL_PROFESSIONS_10.map((profession) => (
                  <div
                    key={profession.value}
                    onClick={() => selectProfession(profession.value)}
                    className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                      selectedProfession === profession.value
                        ? `border-2 shadow-lg`
                        : darkMode
                        ? 'border-slate-700 hover:border-slate-600 hover:bg-slate-700/50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    style={{
                      borderColor: selectedProfession === profession.value ? profession.color : undefined,
                      backgroundColor: selectedProfession === profession.value ? `${profession.color}08` : undefined
                    }}
                  >
                    {/* Icon */}
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ 
                        backgroundColor: `${profession.color}15`,
                        color: profession.color 
                      }}
                    >
                      {getIconComponent(profession.icon)}
                    </div>

                    {/* Text */}
                    <div className="flex-1">
                      <h4 className={`font-semibold ${
                        darkMode ? 'text-white' : 'text-slate-800'
                      }`}>
                        {profession.label}
                      </h4>
                      <p className={`text-sm ${
                        darkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        {profession.description}
                      </p>
                    </div>

                    {/* Check */}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                      selectedProfession === profession.value
                        ? 'bg-green-500 text-white scale-100 opacity-100'
                        : 'scale-50 opacity-0'
                    }`}>
                      <FaCheck className="w-3 h-3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className={`flex items-center justify-end gap-3 p-4 lg:p-6 border-t ${
              darkMode ? 'border-slate-700' : 'border-gray-200'
            }`}>
              <button
                onClick={closeModal}
                disabled={loading}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  darkMode
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-50'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50'
                }`}
              >
                Anuluj
              </button>
              <button
                onClick={saveProfession}
                disabled={!selectedProfession || loading}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                  !selectedProfession || loading
                    ? darkMode 
                      ? 'bg-slate-600 text-slate-400' 
                      : 'bg-gray-300 text-gray-500'
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-0.5 shadow-lg'
                }`}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Zapisywanie...
                  </div>
                ) : (
                  'Zapisz zmiany'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes modalSlideIn {
          from { 
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
          to { 
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default ProfessionWidget;