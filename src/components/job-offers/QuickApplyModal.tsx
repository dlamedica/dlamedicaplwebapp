import React, { useState, useRef } from 'react';
import { FaTimes, FaUpload, FaFile, FaTrash, FaSpinner, FaPaperPlane } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { submitApplication, uploadCV, deleteCV, hasUserApplied } from '../../services/mockApplicationService';
import { JobApplicationInput } from '../../types';
import { useNotifications } from '../../hooks/useNotifications';

interface QuickApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobOffer: {
    id: string;
    company: string;
    position: string;
    location: string;
  };
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const QuickApplyModal: React.FC<QuickApplyModalProps> = ({
  isOpen,
  onClose,
  jobOffer,
  darkMode,
  fontSize
}) => {
  const { user, profile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { notifyApplicationSubmitted } = useNotifications();

  const [formData, setFormData] = useState({
    candidate_name: profile?.full_name || '',
    candidate_email: user?.email || '',
    candidate_phone: '',
    cover_letter: ''
  });

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvUrl, setCvUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [error, setError] = useState<string>('');
  const [hasApplied, setHasApplied] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(false);

  const fontSizeClasses = {
    small: {
      title: 'text-lg',
      text: 'text-sm',
      label: 'text-xs',
      button: 'text-sm'
    },
    medium: {
      title: 'text-xl',
      text: 'text-base',
      label: 'text-sm',
      button: 'text-base'
    },
    large: {
      title: 'text-2xl',
      text: 'text-lg',
      label: 'text-base',
      button: 'text-lg'
    }
  };

  const fontSizes = fontSizeClasses[fontSize];

  // Check if user has already applied when modal opens
  React.useEffect(() => {
    if (isOpen && user) {
      checkExistingApplication();
    }
  }, [isOpen, user, jobOffer.id]);

  const checkExistingApplication = async () => {
    setCheckingApplication(true);
    if (!user) return;
    const { hasApplied: applied, error } = await hasUserApplied(jobOffer.id, user.id);

    if (error) {
      console.error('Error checking application:', error);
    }

    setHasApplied(applied);
    setCheckingApplication(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = async (file: File) => {
    if (!user) return;

    // 🔒 BEZPIECZEŃSTWO: Użyj funkcji walidacji plików
    const { validateFile, ALLOWED_FILE_TYPES, MAX_FILE_SIZES } = await import('../../utils/fileSecurity');

    const validation = validateFile(
      file,
      ALLOWED_FILE_TYPES.documents,
      MAX_FILE_SIZES.document,
      'documents'
    );

    if (!validation.valid) {
      setError(validation.error || 'Nieprawidłowy plik');
      return;
    }

    setUploadingCV(true);
    setError('');

    try {
      const { data, error: uploadError } = await uploadCV(file, user.id);

      if (uploadError || !data) {
        setError('Błąd podczas przesyłania CV');
        console.error('CV upload error:', uploadError);
      } else {
        setCvFile(file);
        setCvUrl(data.path);
      }
    } catch (error: any) {
      setError(error.message || 'Błąd podczas przesyłania CV');
      console.error('CV upload error:', error);
    } finally {
      setUploadingCV(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleRemoveCV = async () => {
    if (cvUrl) {
      await deleteCV(cvUrl);
    }
    setCvFile(null);
    setCvUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('Musisz być zalogowany, aby aplikować');
      return;
    }

    // Validate required fields
    if (!formData.candidate_name.trim()) {
      setError('Imię i nazwisko są wymagane');
      return;
    }

    if (!formData.candidate_email.trim()) {
      setError('Email jest wymagany');
      return;
    }

    if (!formData.candidate_phone.trim()) {
      setError('Numer telefonu jest wymagany');
      return;
    }

    setLoading(true);
    setError('');

    const applicationData: JobApplicationInput = {
      job_offer_id: jobOffer.id,
      candidate_name: formData.candidate_name,
      candidate_email: formData.candidate_email,
      candidate_phone: formData.candidate_phone,
      cover_letter: formData.cover_letter || undefined,
      cv_url: cvUrl || undefined
    };

    const { data, error: submitError } = await submitApplication(applicationData);

    if (submitError || !data) {
      setError('Błąd podczas wysyłania aplikacji. Spróbuj ponownie.');
      console.error('Application submit error:', submitError);
    } else {
      // Success - send notifications
      setHasApplied(true);

      // Notify user about successful application
      if (user?.id) {
        notifyApplicationSubmitted(user.id, {
          job_title: jobOffer.position,
          company_name: jobOffer.company,
          company_user_id: 'company1', // In real app, this would come from job offer data
          candidate_name: formData.candidate_name
        });
      }

      setTimeout(() => {
        onClose();
      }, 2000);
    }

    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      candidate_name: profile?.full_name || '',
      candidate_email: user?.email || '',
      candidate_phone: '',
      cover_letter: ''
    });
    setCvFile(null);
    setCvUrl('');
    setError('');
    setHasApplied(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
          }`}
      >
        {/* Header */}
        <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`${fontSizes.title} font-bold mb-2`}>
                Szybka aplikacja
              </h2>
              <div className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <div className="font-semibold">{jobOffer.position}</div>
                <div>{jobOffer.company} • {jobOffer.location}</div>
              </div>
            </div>
            <button
              onClick={handleClose}
              className={`p-2 rounded-lg transition-colors ${darkMode
                ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                }`}
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {checkingApplication ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#38b6ff] mx-auto mb-4"></div>
              <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Sprawdzanie statusu aplikacji...
              </p>
            </div>
          ) : hasApplied ? (
            <div className="text-center py-8">
              <div className="text-green-500 text-4xl mb-4">✓</div>
              <h3 className={`${fontSizes.title} font-semibold mb-2 text-green-600`}>
                Aplikacja wysłana!
              </h3>
              <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Twoja aplikacja została pomyślnie wysłana. Pracodawca skontaktuje się z Tobą wkrótce.
              </p>
            </div>
          ) : !user ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className={`${fontSizes.title} font-semibold mb-4`}>
                Zaloguj się, aby aplikować
              </h3>
              <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                Musisz być zalogowany, aby wysłać aplikację na tę pozycję.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    handleClose();
                    history.pushState({}, '', '/login');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }}
                  className={`px-6 py-3 ${fontSizes.button} font-semibold rounded-lg transition-colors duration-200 bg-[#38b6ff] text-black hover:bg-[#2a9fe5]`}
                >
                  Zaloguj się
                </button>
                <button
                  onClick={() => {
                    handleClose();
                    history.pushState({}, '', '/register');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }}
                  className={`px-6 py-3 ${fontSizes.button} font-semibold rounded-lg transition-colors duration-200 border-2 ${darkMode
                    ? 'border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900'
                    }`}
                >
                  Zarejestruj się
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-red-900/20 border border-red-600' : 'bg-red-50 border border-red-200'}`}>
                  <p className={`${fontSizes.text} ${darkMode ? 'text-red-200' : 'text-red-800'}`}>
                    {error}
                  </p>
                </div>
              )}

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block ${fontSizes.label} font-medium mb-2`}>
                    Imię i nazwisko *
                  </label>
                  <input
                    type="text"
                    name="candidate_name"
                    value={formData.candidate_name}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2 border rounded-lg ${fontSizes.text} ${darkMode
                      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } focus:ring-2 focus:ring-[#38b6ff] focus:border-transparent`}
                    placeholder="Jan Kowalski"
                  />
                </div>

                <div>
                  <label className={`block ${fontSizes.label} font-medium mb-2`}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="candidate_email"
                    value={formData.candidate_email}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2 border rounded-lg ${fontSizes.text} ${darkMode
                      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } focus:ring-2 focus:ring-[#38b6ff] focus:border-transparent`}
                    placeholder="jan.kowalski@email.com"
                  />
                </div>
              </div>

              <div>
                <label className={`block ${fontSizes.label} font-medium mb-2`}>
                  Numer telefonu *
                </label>
                <input
                  type="tel"
                  name="candidate_phone"
                  value={formData.candidate_phone}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg ${fontSizes.text} ${darkMode
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:ring-2 focus:ring-[#38b6ff] focus:border-transparent`}
                  placeholder="+48 123 456 789"
                />
              </div>

              {/* CV Upload */}
              <div>
                <label className={`block ${fontSizes.label} font-medium mb-2`}>
                  CV (opcjonalne)
                </label>
                <div className={`border-2 border-dashed rounded-lg p-4 ${darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-50'
                  }`}>
                  {cvFile ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FaFile className="text-[#38b6ff]" />
                        <div>
                          <div className={`${fontSizes.text} font-medium`}>
                            {cvFile.name}
                          </div>
                          <div className={`${fontSizes.label} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {(cvFile.size / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCV}
                        className={`p-2 rounded-lg transition-colors ${darkMode
                          ? 'text-red-400 hover:bg-red-900/20'
                          : 'text-red-500 hover:bg-red-50'
                          }`}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <FaUpload className={`mx-auto text-2xl mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      <div className={`${fontSizes.text} mb-2`}>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-[#38b6ff] hover:text-[#2a9fe5] font-medium"
                          disabled={uploadingCV}
                        >
                          {uploadingCV ? 'Przesyłanie...' : 'Prześlij CV'}
                        </button>
                      </div>
                      <div className={`${fontSizes.label} ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Formaty: PDF, DOC, DOCX (max 5MB)
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <label className={`block ${fontSizes.label} font-medium mb-2`}>
                  List motywacyjny (opcjonalny)
                </label>
                <textarea
                  name="cover_letter"
                  value={formData.cover_letter}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg ${fontSizes.text} ${darkMode
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:ring-2 focus:ring-[#38b6ff] focus:border-transparent resize-vertical`}
                  placeholder="Opisz dlaczego jesteś idealnym kandydatem na tę pozycję..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className={`px-6 py-3 ${fontSizes.button} font-semibold rounded-lg transition-colors border-2 ${darkMode
                    ? 'border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900'
                    }`}
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  disabled={loading || uploadingCV}
                  className={`px-6 py-3 ${fontSizes.button} font-semibold rounded-lg transition-colors duration-200 bg-[#38b6ff] text-black hover:bg-[#2a9fe5] disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2`}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Wysyłanie...</span>
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      <span>Wyślij aplikację</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickApplyModal;