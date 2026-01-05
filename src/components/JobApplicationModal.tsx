import React, { useState } from 'react';
import { 
  FaTimes, FaFileAlt, FaUpload, FaCheck, FaExclamationTriangle,
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBriefcase,
  FaGraduationCap, FaPaperPlane, FaSpinner, FaEye
} from 'react-icons/fa';
import { exampleDataService, JobOffer } from '../services/exampleDataService';
import { useNotifications } from '../hooks/useNotifications';

interface JobApplicationModalProps {
  jobOffer: JobOffer;
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  onClose: () => void;
  onSuccess?: () => void;
}

const JobApplicationModal: React.FC<JobApplicationModalProps> = ({
  jobOffer,
  darkMode,
  fontSize,
  onClose,
  onSuccess
}) => {
  const [step, setStep] = useState<'form' | 'confirmation' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'Jan',
    lastName: 'Kowalski',
    email: 'jan.kowalski@example.com',
    phone: '+48 123 456 789',
    coverLetter: '',
    experience: '',
    motivation: '',
    availabilityDate: '',
    salaryExpectations: '',
    additionalInfo: ''
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToDataProcessing, setAgreedToDataProcessing] = useState(false);

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

  const handleCvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Plik CV jest za duży. Maksymalny rozmiar to 5MB.');
        return;
      }
      setCvFile(file);
    }
  };

  const handleAdditionalFilesUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`Plik ${file.name} jest za duży. Maksymalny rozmiar to 5MB.`);
        return false;
      }
      return true;
    });
    setAdditionalFiles(prev => [...prev, ...validFiles]);
  };

  const removeAdditionalFile = (index: number) => {
    setAdditionalFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      alert('Proszę podać imię');
      return false;
    }
    if (!formData.lastName.trim()) {
      alert('Proszę podać nazwisko');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      alert('Proszę podać prawidłowy adres email');
      return false;
    }
    if (!formData.phone.trim()) {
      alert('Proszę podać numer telefonu');
      return false;
    }
    if (!cvFile) {
      alert('Proszę wgrać CV');
      return false;
    }
    if (!agreedToTerms) {
      alert('Proszę zaakceptować regulamin');
      return false;
    }
    if (!agreedToDataProcessing) {
      alert('Proszę zaakceptować przetwarzanie danych osobowych');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add application to the service
      exampleDataService.addUserApplication({
        user_id: 'user1',
        job_offer_id: jobOffer.id,
        candidate_name: `${formData.firstName} ${formData.lastName}`,
        candidate_email: formData.email,
        candidate_phone: formData.phone,
        cv_url: `/cv/${cvFile?.name}`,
        cover_letter: formData.coverLetter,
        status: 'pending'
      });

      setStep('success');
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      alert('Wystąpił błąd podczas wysyłania aplikacji. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => (
    <div className="space-y-6">
      {/* Personal Information */}
      <div>
        <h3 className={`${fontSizes.subtitle} font-semibold mb-4 flex items-center`}>
          <FaUser className="mr-2 text-[#38b6ff]" />
          Dane osobowe
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block ${fontSizes.text} font-medium mb-1`}>
              Imię <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
              required
            />
          </div>
          <div>
            <label className={`block ${fontSizes.text} font-medium mb-1`}>
              Nazwisko <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
              required
            />
          </div>
          <div>
            <label className={`block ${fontSizes.text} font-medium mb-1`}>
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
              required
            />
          </div>
          <div>
            <label className={`block ${fontSizes.text} font-medium mb-1`}>
              Telefon <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
              required
            />
          </div>
        </div>
      </div>

      {/* CV Upload */}
      <div>
        <h3 className={`${fontSizes.subtitle} font-semibold mb-4 flex items-center`}>
          <FaFileAlt className="mr-2 text-[#38b6ff]" />
          CV <span className="text-red-500">*</span>
        </h3>
        <div className="space-y-4">
          {cvFile ? (
            <div className="flex items-center justify-between p-4 border border-gray-300 rounded-lg bg-green-50">
              <div className="flex items-center">
                <FaCheck className="text-green-500 mr-3" />
                <div>
                  <p className={`${fontSizes.text} font-medium`}>{cvFile.name}</p>
                  <p className={`${fontSizes.label} text-gray-500`}>
                    {(cvFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCvFile(null)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTimes />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <FaUpload className="mx-auto text-2xl text-gray-400 mb-2" />
              <p className={`${fontSizes.text} text-gray-600 mb-2`}>
                Przeciągnij plik CV tutaj lub kliknij aby wybrać
              </p>
              <label className="inline-flex items-center px-4 py-2 bg-[#38b6ff] text-black rounded-lg hover:bg-[#2a9fe5] transition-colors cursor-pointer">
                <FaUpload className="mr-2" />
                Wybierz plik CV
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleCvUpload}
                  className="hidden"
                />
              </label>
              <p className={`${fontSizes.label} text-gray-500 mt-2`}>
                Obsługiwane formaty: PDF, DOC, DOCX (max 5MB)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Cover Letter */}
      <div>
        <h3 className={`${fontSizes.subtitle} font-semibold mb-4 flex items-center`}>
          <FaPaperPlane className="mr-2 text-[#38b6ff]" />
          List motywacyjny
        </h3>
        <textarea
          value={formData.coverLetter}
          onChange={(e) => setFormData({...formData, coverLetter: e.target.value})}
          rows={6}
          placeholder="Opisz dlaczego jesteś idealnym kandydatem na to stanowisko..."
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300'
          }`}
        />
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={`block ${fontSizes.text} font-medium mb-2`}>
            Doświadczenie zawodowe
          </label>
          <textarea
            value={formData.experience}
            onChange={(e) => setFormData({...formData, experience: e.target.value})}
            rows={3}
            placeholder="Krótko opisz swoje doświadczenie..."
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300'
            }`}
          />
        </div>
        <div>
          <label className={`block ${fontSizes.text} font-medium mb-2`}>
            Data dostępności
          </label>
          <input
            type="date"
            value={formData.availabilityDate}
            onChange={(e) => setFormData({...formData, availabilityDate: e.target.value})}
            min={new Date().toISOString().split('T')[0]}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300'
            }`}
          />
        </div>
      </div>

      {/* Additional Files */}
      <div>
        <h3 className={`${fontSizes.subtitle} font-semibold mb-4 flex items-center`}>
          <FaGraduationCap className="mr-2 text-[#38b6ff]" />
          Dodatkowe dokumenty
        </h3>
        <div className="space-y-3">
          {additionalFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <FaFileAlt className="text-blue-500 mr-2" />
                <span className={fontSizes.text}>{file.name}</span>
              </div>
              <button
                onClick={() => removeAdditionalFile(index)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTimes />
              </button>
            </div>
          ))}
          <label className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <FaUpload className="mr-2" />
            Dodaj dokumenty
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleAdditionalFilesUpload}
              className="hidden"
            />
          </label>
          <p className={`${fontSizes.label} text-gray-500`}>
            Certyfikaty, dyplomy, referencje (opcjonalne)
          </p>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="space-y-3">
        <label className="flex items-start">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-1 mr-3 text-[#38b6ff] focus:ring-[#38b6ff]"
          />
          <span className={`${fontSizes.text} leading-relaxed`}>
            Akceptuję <a href="/regulamin" className="text-[#38b6ff] hover:underline">regulamin serwisu</a> i potwierdzam, 
            że wszystkie podane przeze mnie informacje są prawdziwe. <span className="text-red-500">*</span>
          </span>
        </label>
        
        <label className="flex items-start">
          <input
            type="checkbox"
            checked={agreedToDataProcessing}
            onChange={(e) => setAgreedToDataProcessing(e.target.checked)}
            className="mt-1 mr-3 text-[#38b6ff] focus:ring-[#38b6ff]"
          />
          <span className={`${fontSizes.text} leading-relaxed`}>
            Wyrażam zgodę na przetwarzanie moich danych osobowych przez pracodawcę w celu procesu rekrutacji 
            zgodnie z <a href="/polityka-prywatnosci" className="text-[#38b6ff] hover:underline">polityką prywatności</a>. 
            <span className="text-red-500">*</span>
          </span>
        </label>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="space-y-6">
      <div className="text-center">
        <FaEye className="mx-auto text-4xl text-[#38b6ff] mb-4" />
        <h3 className={`${fontSizes.title} font-bold mb-2`}>Podsumowanie aplikacji</h3>
        <p className={`${fontSizes.text} text-gray-600`}>
          Sprawdź dane przed wysłaniem aplikacji
        </p>
      </div>

      <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-6 rounded-lg`}>
        <h4 className={`${fontSizes.subtitle} font-semibold mb-4`}>Stanowisko</h4>
        <div className="space-y-2">
          <p className={`${fontSizes.text} font-medium`}>{jobOffer.position}</p>
          <p className={`${fontSizes.text} text-gray-600`}>{jobOffer.company}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center">
              <FaMapMarkerAlt className="mr-1" />
              {jobOffer.location}
            </span>
            <span className="flex items-center">
              <FaBriefcase className="mr-1" />
              {jobOffer.employment_type}
            </span>
          </div>
        </div>
      </div>

      <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-6 rounded-lg`}>
        <h4 className={`${fontSizes.subtitle} font-semibold mb-4`}>Twoje dane</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className={`${fontSizes.text} font-medium`}>
              {formData.firstName} {formData.lastName}
            </p>
            <p className={`${fontSizes.text} text-gray-600 flex items-center`}>
              <FaEnvelope className="mr-1" />
              {formData.email}
            </p>
            <p className={`${fontSizes.text} text-gray-600 flex items-center`}>
              <FaPhone className="mr-1" />
              {formData.phone}
            </p>
          </div>
          <div>
            {cvFile && (
              <p className={`${fontSizes.text} text-gray-600 flex items-center`}>
                <FaFileAlt className="mr-1" />
                CV: {cvFile.name}
              </p>
            )}
            {additionalFiles.length > 0 && (
              <p className={`${fontSizes.text} text-gray-600`}>
                Dodatkowe pliki: {additionalFiles.length}
              </p>
            )}
          </div>
        </div>
        
        {formData.coverLetter && (
          <div className="mt-4">
            <p className={`${fontSizes.text} font-medium mb-2`}>List motywacyjny:</p>
            <p className={`${fontSizes.text} text-gray-600 italic`}>
              "{formData.coverLetter.substring(0, 150)}..."
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => setStep('form')}
          className="mr-4 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Wróć do edycji
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-2 bg-[#38b6ff] text-black rounded-lg hover:bg-[#2a9fe5] transition-colors disabled:opacity-50 flex items-center"
        >
          {loading ? (
            <>
              <FaSpinner className="mr-2 animate-spin" />
              Wysyłanie...
            </>
          ) : (
            <>
              <FaPaperPlane className="mr-2" />
              Wyślij aplikację
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <FaCheck className="text-3xl text-green-600" />
      </div>
      <div>
        <h3 className={`${fontSizes.title} font-bold mb-2`}>Aplikacja wysłana pomyślnie!</h3>
        <p className={`${fontSizes.text} text-gray-600 mb-4`}>
          Twoja aplikacja na stanowisko <strong>{jobOffer.position}</strong> została wysłana do firmy {jobOffer.company}.
        </p>
      </div>
      
      <div className={`${darkMode ? 'bg-blue-900' : 'bg-blue-50'} p-6 rounded-lg text-left`}>
        <h4 className={`${fontSizes.subtitle} font-semibold mb-3 text-blue-800`}>Co dalej?</h4>
        <ul className="space-y-2 text-sm text-blue-700">
          <li className="flex items-start">
            <FaCheck className="mr-2 mt-0.5 text-green-500 flex-shrink-0" />
            Otrzymasz potwierdzenie na email w ciągu kilku minut
          </li>
          <li className="flex items-start">
            <FaEye className="mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
            Pracodawca przejrzy Twoją aplikację w ciągu 2-3 dni roboczych
          </li>
          <li className="flex items-start">
            <FaEnvelope className="mr-2 mt-0.5 text-purple-500 flex-shrink-0" />
            Status aplikacji możesz śledzić w swoim profilu
          </li>
          <li className="flex items-start">
            <FaPhone className="mr-2 mt-0.5 text-orange-500 flex-shrink-0" />
            W przypadku zainteresowania, pracodawca skontaktuje się z Tobą bezpośrednio
          </li>
        </ul>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={onClose}
          className="px-6 py-2 bg-[#38b6ff] text-black rounded-lg hover:bg-[#2a9fe5] transition-colors"
        >
          Zamknij
        </button>
        <button
          onClick={() => {
            window.history.pushState({}, '', '/profil?tab=applications');
            window.dispatchEvent(new PopStateEvent('popstate'));
            onClose();
          }}
          className="px-6 py-2 border border-[#38b6ff] text-[#38b6ff] rounded-lg hover:bg-blue-50 transition-colors"
        >
          Zobacz moje aplikacje
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className={`${fontSizes.title} font-bold`}>
                {step === 'form' && 'Aplikuj na stanowisko'}
                {step === 'confirmation' && 'Potwierdzenie aplikacji'}
                {step === 'success' && 'Aplikacja wysłana'}
              </h2>
              {step === 'form' && (
                <p className={`${fontSizes.text} text-gray-600 mt-1`}>
                  {jobOffer.position} w {jobOffer.company}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-1"
              disabled={loading}
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Progress Bar */}
          {step !== 'success' && (
            <div className="mb-6">
              <div className="flex items-center">
                <div className={`flex items-center ${
                  step === 'form' ? 'text-[#38b6ff]' : 'text-green-500'
                }`}>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                    step === 'form' ? 'border-[#38b6ff] bg-[#38b6ff] text-white' : 'border-green-500 bg-green-500 text-white'
                  }`}>
                    {step === 'form' ? '1' : <FaCheck />}
                  </div>
                  <span className="ml-2 text-sm">Formularz</span>
                </div>
                <div className={`flex-1 h-1 mx-4 ${
                  step === 'confirmation' ? 'bg-[#38b6ff]' : 'bg-gray-200'
                }`}></div>
                <div className={`flex items-center ${
                  step === 'confirmation' ? 'text-[#38b6ff]' : 'text-gray-400'
                }`}>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                    step === 'confirmation' ? 'border-[#38b6ff] bg-[#38b6ff] text-white' : 'border-gray-300'
                  }`}>
                    2
                  </div>
                  <span className="ml-2 text-sm">Potwierdzenie</span>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          {step === 'form' && renderForm()}
          {step === 'confirmation' && renderConfirmation()}
          {step === 'success' && renderSuccess()}

          {/* Form Actions */}
          {step === 'form' && (
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Anuluj
              </button>
              <button
                onClick={() => {
                  if (validateForm()) {
                    setStep('confirmation');
                  }
                }}
                className="px-6 py-2 bg-[#38b6ff] text-black rounded-lg hover:bg-[#2a9fe5] transition-colors"
                disabled={loading}
              >
                Dalej
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobApplicationModal;