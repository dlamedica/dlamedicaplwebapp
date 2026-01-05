import React, { useState } from 'react';
import { FaCalendarAlt, FaClock, FaUsers, FaTimes, FaVideo } from 'react-icons/fa';

interface AddWebinarFormProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  onClose: () => void;
  onSubmit: (webinarData: any) => void;
}

const AddWebinarForm: React.FC<AddWebinarFormProps> = ({
  darkMode,
  fontSize,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    fullDescription: '',
    date: '',
    time: '',
    location: 'Online',
    type: 'online' as 'online',
    price: 'Bezpłatne',
    isFree: true,
    maxParticipants: '',
    category: 'Webinar',
    organizerName: '',
    organizerEmail: '',
    organizerPhone: '',
    webinarUrl: '',
    platformInfo: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          title: 'text-lg',
          text: 'text-sm',
          input: 'text-sm'
        };
      case 'large':
        return {
          title: 'text-2xl',
          text: 'text-lg',
          input: 'text-lg'
        };
      default:
        return {
          title: 'text-xl',
          text: 'text-base',
          input: 'text-base'
        };
    }
  };

  const fontSizes = getFontSizeClasses();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Nazwa webinaru jest wymagana');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Krótki opis jest wymagany');
      return false;
    }
    if (!formData.date) {
      setError('Data webinaru jest wymagana');
      return false;
    }
    if (!formData.time) {
      setError('Godzina rozpoczęcia jest wymagana');
      return false;
    }
    if (!formData.organizerName.trim()) {
      setError('Nazwa organizatora jest wymagana');
      return false;
    }
    if (!formData.organizerEmail.trim()) {
      setError('Email organizatora jest wymagany');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const webinarData = {
        ...formData,
        eventType: 'webinar',
        companyOnly: false,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        currentParticipants: 0,
        maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
        organizer: {
          name: formData.organizerName,
          email: formData.organizerEmail,
          phone: formData.organizerPhone
        }
      };

      await onSubmit(webinarData);
      onClose();
    } catch (error) {
      setError('Wystąpił błąd podczas dodawania webinaru');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto ${
        darkMode ? 'bg-black border border-gray-700' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <FaVideo className="text-white text-lg" />
              </div>
              <h2 className={`${fontSizes.title} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Dodaj nowy webinar
              </h2>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
          <p className={`mt-2 ${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Wszyscy użytkownicy mogą dodawać webinary. Wszystkie pola oznaczone gwiazdką (*) są wymagane.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className={`block ${fontSizes.text} font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Nazwa webinaru *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${fontSizes.input} ${
                    darkMode
                      ? 'bg-black border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Webinar: AI w Diagnostyce Medycznej"
                  disabled={loading}
                />
              </div>

              <div>
                <label className={`block ${fontSizes.text} font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Krótki opis *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${fontSizes.input} ${
                    darkMode
                      ? 'bg-black border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Krótki opis webinaru..."
                  disabled={loading}
                />
              </div>

              <div>
                <label className={`block ${fontSizes.text} font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Pełny opis
                </label>
                <textarea
                  value={formData.fullDescription}
                  onChange={(e) => handleInputChange('fullDescription', e.target.value)}
                  rows={5}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${fontSizes.input} ${
                    darkMode
                      ? 'bg-black border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Szczegółowy opis webinaru, agenda, prelegenci..."
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block ${fontSizes.text} font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <FaCalendarAlt className="inline mr-2 text-purple-500" />
                    Data *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${fontSizes.input} ${
                      darkMode
                        ? 'bg-black border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className={`block ${fontSizes.text} font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <FaClock className="inline mr-2 text-purple-500" />
                    Godzina *
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${fontSizes.input} ${
                      darkMode
                        ? 'bg-black border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className={`block ${fontSizes.text} font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <FaUsers className="inline mr-2 text-purple-500" />
                  Maksymalna liczba uczestników
                </label>
                <input
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => handleInputChange('maxParticipants', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${fontSizes.input} ${
                    darkMode
                      ? 'bg-black border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="500"
                  min="1"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className={`block ${fontSizes.text} font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Link do webinaru
                </label>
                <input
                  type="url"
                  value={formData.webinarUrl}
                  onChange={(e) => handleInputChange('webinarUrl', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${fontSizes.input} ${
                    darkMode
                      ? 'bg-black border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="https://zoom.us/j/123456789"
                  disabled={loading}
                />
              </div>

              <div>
                <label className={`block ${fontSizes.text} font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Platforma / Dodatkowe informacje
                </label>
                <textarea
                  value={formData.platformInfo}
                  onChange={(e) => handleInputChange('platformInfo', e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${fontSizes.input} ${
                    darkMode
                      ? 'bg-black border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Zoom, Teams, Czy potrzebna rejestracja? Dodatkowe wymagania techniczne..."
                  disabled={loading}
                />
              </div>

              {/* Organizer Information */}
              <div className="space-y-4">
                <h3 className={`${fontSizes.text} font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-4`}>
                  Informacje o organizatorze
                </h3>

                <div>
                  <label className={`block ${fontSizes.text} font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Nazwa organizatora *
                  </label>
                  <input
                    type="text"
                    value={formData.organizerName}
                    onChange={(e) => handleInputChange('organizerName', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${fontSizes.input} ${
                      darkMode
                        ? 'bg-black border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Dr Jan Kowalski / Instytut Informatyki Medycznej"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className={`block ${fontSizes.text} font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email kontaktowy *
                  </label>
                  <input
                    type="email"
                    value={formData.organizerEmail}
                    onChange={(e) => handleInputChange('organizerEmail', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${fontSizes.input} ${
                      darkMode
                        ? 'bg-black border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="webinar@example.com"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className={`block ${fontSizes.text} font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={formData.organizerPhone}
                    onChange={(e) => handleInputChange('organizerPhone', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${fontSizes.input} ${
                      darkMode
                        ? 'bg-black border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="+48 12 345 67 89"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Info Box */}
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-purple-900 bg-opacity-20 border border-purple-700' : 'bg-purple-50 border border-purple-200'}`}>
                <div className="flex items-start space-x-3">
                  <FaVideo className="text-purple-500 mt-1" />
                  <div>
                    <h4 className={`${fontSizes.text} font-medium ${darkMode ? 'text-purple-300' : 'text-purple-800'} mb-1`}>
                      Informacja o webinarach
                    </h4>
                    <p className={`text-sm ${darkMode ? 'text-purple-200' : 'text-purple-700'}`}>
                      Webinary są domyślnie bezpłatne i dostępne dla wszystkich użytkowników. 
                      Po utworzeniu webinaru otrzymasz możliwość zarządzania uczestnikami i wysyłania zaproszeń.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className={`px-6 py-3 ${fontSizes.text} font-medium rounded-lg transition-colors duration-200 ${
                darkMode
                  ? 'bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
              }`}
              disabled={loading}
            >
              Anuluj
            </button>
            <button
              type="submit"
              className={`px-6 py-3 ${fontSizes.text} font-semibold rounded-lg transition-all duration-200 bg-purple-500 text-white hover:bg-purple-600 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
              disabled={loading}
            >
              {loading ? 'Dodawanie...' : 'Dodaj webinar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWebinarForm;