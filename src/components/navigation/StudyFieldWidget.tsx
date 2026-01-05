import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useStudyField } from '../../hooks/useStudyField';
import { MEDICAL_STUDY_FIELDS } from '../../constants/studyFields';
import { FaTimes, FaCheck, FaGraduationCap, FaUser, FaLock } from 'react-icons/fa';

interface StudyFieldWidgetProps {
  darkMode?: boolean;
  hideForUnauthenticated?: boolean; // Nowy prop do ukrycia dla niezalogowanych
}

const StudyFieldWidget: React.FC<StudyFieldWidgetProps> = ({ darkMode = false, hideForUnauthenticated = false }) => {
  const { isAuthenticated, user } = useAuth();
  const { 
    fieldData: currentField, 
    saveStudyField: saveFieldToHook,
    loading: fieldLoading,
    error: fieldError 
  } = useStudyField();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

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
    setSelectedField('');
    setError(null);
    setSuccess(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedField('');
    setError(null);
    setSuccess(null);
  };

  const selectField = (fieldValue: string) => {
    setSelectedField(fieldValue);
  };

  const saveField = async () => {
    if (!selectedField || loading) return;

    const selectedFieldData = MEDICAL_STUDY_FIELDS.find(f => f.value === selectedField);
    
    console.log('🎯 StudyFieldWidget: Saving field:', selectedField);
    console.log('🎯 StudyFieldWidget: Field data:', selectedFieldData);

    setLoading(true);
    setError(null);

    try {
      const newFieldName = selectedFieldData?.label || selectedField;
      
      // Use the hook to save the field (it handles confirmation and persistence)
      const success = await saveFieldToHook(selectedField);
      
      if (success) {
        console.log('✅ StudyFieldWidget: Update successful');
        setSuccess('Kierunek studiów został pomyślnie zaktualizowany!');
        
        setTimeout(() => {
          closeModal();
          // Don't reload - state is automatically updated by the hook
        }, 1500);
      } else {
        // User cancelled or error occurred (handled by hook)
        setLoading(false);
      }
    } catch (err) {
      console.error('❌ StudyFieldWidget: Exception during save:', err);
      setError('Wystąpił błąd podczas zapisywania kierunku studiów');
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    // Icons removed - returning empty string
    return '';
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

  // Handle login navigation
  const handleLoginClick = () => {
    window.location.href = '/login';
  };

  // Debug logging
  console.log('StudyFieldWidget - isAuthenticated:', isAuthenticated);
  console.log('StudyFieldWidget - user:', user);
  console.log('StudyFieldWidget - currentField:', currentField);
  
  // Show errors from hook
  useEffect(() => {
    if (fieldError) {
      setError(fieldError);
    }
  }, [fieldError]);

  // If hideForUnauthenticated is true and user is not authenticated, return null (completely hidden)
  if (hideForUnauthenticated && (!isAuthenticated || !user)) {
    return null;
  }

  // Show login prompt for unauthenticated users (only if not hidden)
  if (!isAuthenticated || !user) {
    return (
      <div className="mb-6">
        <div className={`rounded-xl border-2 border-dashed transition-all duration-300 ${
          darkMode 
            ? 'border-slate-600 bg-slate-800/50 hover:border-slate-500' 
            : 'border-gray-300 bg-gray-50/50 hover:border-gray-400'
        }`}>
          <div className="p-4">
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-lg ${
                darkMode ? 'bg-slate-700' : 'bg-gray-200'
              }`}>
                <FaLock className="w-6 h-6" />
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className={`font-bold text-lg mb-1 ${
                  darkMode ? 'text-white' : 'text-slate-800'
                }`}>
                  Wybierz kierunek studiów
                </h3>
                <p className={`text-sm mb-3 ${
                  darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Musisz być zalogowany aby korzystać z platformy edukacyjnej
                </p>
                <button
                  onClick={handleLoginClick}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#38b6ff] text-white text-sm font-medium rounded-lg hover:bg-[#2a9fe5] transition-colors"
                >
                  <FaUser className="w-3 h-3" />
                  Zaloguj się
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Widget */}
      <div className="mb-6">
        <div className={`rounded-xl border-2 transition-all duration-300 ${
          currentField
            ? `border-solid ${darkMode ? 'border-slate-500 bg-slate-800/70' : 'border-gray-400 bg-white'}`
            : `border-dashed ${darkMode ? 'border-orange-600 bg-orange-900/20' : 'border-orange-400 bg-orange-50'}`
        } ${fieldLoading ? 'animate-pulse' : ''}`}>
          <div 
            onClick={openModal}
            className="p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
            title="Zmień kierunek studiów"
          >
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-lg"
                style={{ 
                  backgroundColor: currentField ? `${currentField.color}15` : '#f3f4f615',
                  color: currentField ? currentField.color : '#6b7280'
                }}
              >
                {/* Icon removed */}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`font-bold text-lg ${
                    currentField
                      ? (darkMode ? 'text-white' : 'text-slate-800')
                      : (darkMode ? 'text-orange-400' : 'text-orange-600')
                  }`}>
                    {fieldLoading ? 'Ładowanie...' : (currentField ? currentField.label : 'Wybierz kierunek studiów')}
                  </h3>
                  {currentField && (
                    <FaCheck className="w-4 h-4 text-green-500" />
                  )}
                </div>
                <p className={`text-sm ${
                  darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {currentField ? currentField.description : 'Nie masz wybranego kierunku studiów. Kliknij aby wybrać.'}
                </p>
                <div className="mt-2">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                    currentField 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 animate-pulse'
                  }`}>
                    <FaGraduationCap className="w-3 h-3" />
                    {currentField ? 'Aktywny kierunek' : 'Wymagany wybór'}
                  </span>
                </div>
              </div>

              {/* Arrow or Alert */}
              <div className={`text-2xl ${
                currentField
                  ? (darkMode ? 'text-slate-400' : 'text-slate-400')
                  : 'text-orange-500 animate-bounce'
              }`}>
                {currentField ? '→' : '!'}
              </div>
            </div>
          </div>
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
            className={`w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl ${
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
                  Wybierz swój kierunek studiów
                </h2>
                <p className={`text-sm mt-1 ${
                  darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Dostosuj treści platformy edukacyjnej do swojego kierunku
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


            {/* Body - Lista kierunków */}
            <div className="px-4 lg:px-6 pb-4">
              <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                {(() => {
                  return (
                    <div className="grid grid-cols-2 gap-2">
                      {MEDICAL_STUDY_FIELDS.map((field) => (
                        <div
                          key={field.value}
                          onClick={() => selectField(field.value)}
                          className={`cursor-pointer transition-all duration-200 rounded-lg border-2 p-3 ${
                            selectedField === field.value
                              ? 'border-[#38b6ff] bg-[#38b6ff]/10'
                              : darkMode
                                ? 'border-slate-600 hover:border-slate-500 bg-slate-800'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`font-medium text-sm ${
                              selectedField === field.value
                                ? 'text-[#38b6ff]'
                                : darkMode ? 'text-white' : 'text-slate-800'
                            }`}>
                              {field.label}
                            </span>
                            {selectedField === field.value && (
                              <FaCheck className="w-4 h-4 text-[#38b6ff] flex-shrink-0 ml-2" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
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
                onClick={saveField}
                disabled={!selectedField || loading}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                  !selectedField || loading
                    ? darkMode 
                      ? 'bg-slate-600 text-slate-400' 
                      : 'bg-gray-300 text-gray-500'
                    : 'bg-[#38b6ff] text-white hover:bg-[#2a9fe5] hover:-translate-y-0.5 shadow-lg'
                }`}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Zapisywanie...
                  </div>
                ) : (
                  'Zapisz kierunek'
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

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${darkMode ? '#1e293b' : '#f1f5f9'};
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${darkMode ? '#475569' : '#cbd5e1'};
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${darkMode ? '#64748b' : '#94a3b8'};
        }

        /* Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: ${darkMode ? '#475569 #1e293b' : '#cbd5e1 #f1f5f9'};
        }

        /* Line clamp for descriptions */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default StudyFieldWidget;