import React, { useState } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaUsers, FaEuroSign, FaTimes, FaBuilding } from 'react-icons/fa';

interface AddConferenceFormProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  onClose: () => void;
  onSubmit: (conferenceData: any) => void;
}

const AddConferenceForm: React.FC<AddConferenceFormProps> = ({
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
    location: '',
    address: '',
    type: 'stacjonarny' as 'online' | 'stacjonarny',
    price: '',
    isFree: false,
    maxParticipants: '',
    category: 'Konferencja',
    organizerName: '',
    organizerEmail: '',
    organizerPhone: '',
    organizerWebsite: '',
    mapUrl: ''
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
      setError('Nazwa konferencji jest wymagana');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Krótki opis jest wymagany');
      return false;
    }
    if (!formData.date) {
      setError('Data konferencji jest wymagana');
      return false;
    }
    if (!formData.time) {
      setError('Godzina rozpoczęcia jest wymagana');
      return false;
    }
    if (!formData.location.trim()) {
      setError('Lokalizacja jest wymagana');
      return false;
    }
    if (formData.type === 'stacjonarny' && !formData.address.trim()) {
      setError('Adres jest wymagany dla wydarzeń stacjonarnych');
      return false;
    }
    if (!formData.isFree && !formData.price.trim()) {
      setError('Cena jest wymagana dla płatnych wydarzeń');
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
      const conferenceData = {
        ...formData,
        eventType: 'conference',
        companyOnly: true,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        currentParticipants: 0,
        maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
        organizer: {
          name: formData.organizerName,
          email: formData.organizerEmail,
          phone: formData.organizerPhone,
          website: formData.organizerWebsite
        }
      };

      await onSubmit(conferenceData);
      onClose();
    } catch (error) {
      setError('Wystąpił błąd podczas dodawania konferencji');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto ${
        darkMode ? 'bg-black border border-gray-700' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#38b6ff] rounded-lg flex items-center justify-center">
                <FaBuilding className="text-white text-lg" />
              </div>
              <h2 className={`${fontSizes.title} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Dodaj nową konferencję
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
            Tylko konta firmowe mogą dodawać konferencje. Wszystkie pola oznaczone gwiazdką (*) są wymagane.
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
                  Nazwa konferencji *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] focus:border-[#38b6ff] ${fontSizes.input} ${
                    darkMode
                      ? 'bg-black border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Konferencja Kardiologii Interwencyjnej 2024"
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
                  className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] focus:border-[#38b6ff] ${fontSizes.input} ${
                    darkMode
                      ? 'bg-black border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Krótki opis konferencji..."
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
                  className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] focus:border-[#38b6ff] ${fontSizes.input} ${
                    darkMode
                      ? 'bg-black border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Szczegółowy opis konferencji, program, prelegenci..."
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block ${fontSizes.text} font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <FaCalendarAlt className="inline mr-2 text-[#38b6ff]" />
                    Data *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] focus:border-[#38b6ff] ${fontSizes.input} ${
                      darkMode
                        ? 'bg-black border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className={`block ${fontSizes.text} font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <FaClock className="inline mr-2 text-[#38b6ff]" />
                    Godzina *
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] focus:border-[#38b6ff] ${fontSizes.input} ${
                      darkMode
                        ? 'bg-black border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className={`block ${fontSizes.text} font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Typ wydarzenia
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="stacjonarny"
                      checked={formData.type === 'stacjonarny'}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="mr-2"
                      disabled={loading}
                    />
                    Stacjonarne
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="online"
                      checked={formData.type === 'online'}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="mr-2"
                      disabled={loading}
                    />
                    Online
                  </label>
                </div>
              </div>

              <div>
                <label className={`block ${fontSizes.text} font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <FaMapMarkerAlt className="inline mr-2 text-[#38b6ff]" />
                  Lokalizacja *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] focus:border-[#38b6ff] ${fontSizes.input} ${
                    darkMode
                      ? 'bg-black border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder={formData.type === 'online' ? 'Online' : 'Warszawa'}
                  disabled={loading}
                />
              </div>

              {formData.type === 'stacjonarny' && (
                <div>
                  <label className={`block ${fontSizes.text} font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Adres *
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] focus:border-[#38b6ff] ${fontSizes.input} ${
                      darkMode
                        ? 'bg-black border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Hotel Marriott, ul. Chałubińskiego 7, 00-613 Warszawa"
                    disabled={loading}
                  />
                </div>
              )}

              <div>
                <label className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    checked={formData.isFree}
                    onChange={(e) => handleInputChange('isFree', e.target.checked)}
                    className="mr-2"
                    disabled={loading}
                  />
                  <span className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Bezpłatne wydarzenie
                  </span>
                </label>

                {!formData.isFree && (
                  <div>
                    <label className={`block ${fontSizes.text} font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <FaEuroSign className="inline mr-2 text-[#38b6ff]" />
                      Cena *
                    </label>
                    <input
                      type="text"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] focus:border-[#38b6ff] ${fontSizes.input} ${
                        darkMode
                          ? 'bg-black border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="Bilet od 299 zł"
                      disabled={loading}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className={`block ${fontSizes.text} font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <FaUsers className="inline mr-2 text-[#38b6ff]" />
                  Maksymalna liczba uczestników
                </label>
                <input
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => handleInputChange('maxParticipants', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] focus:border-[#38b6ff] ${fontSizes.input} ${
                    darkMode
                      ? 'bg-black border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="200"
                  min="1"
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
                    className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] focus:border-[#38b6ff] ${fontSizes.input} ${
                      darkMode
                        ? 'bg-black border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Polskie Towarzystwo Kardiologiczne"
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
                    className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] focus:border-[#38b6ff] ${fontSizes.input} ${
                      darkMode
                        ? 'bg-black border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="konferencja@ptk.org.pl"
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block ${fontSizes.text} font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Telefon
                    </label>
                    <input
                      type="tel"
                      value={formData.organizerPhone}
                      onChange={(e) => handleInputChange('organizerPhone', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] focus:border-[#38b6ff] ${fontSizes.input} ${
                        darkMode
                          ? 'bg-black border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="+48 22 123 45 67"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className={`block ${fontSizes.text} font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Strona internetowa
                    </label>
                    <input
                      type="url"
                      value={formData.organizerWebsite}
                      onChange={(e) => handleInputChange('organizerWebsite', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] focus:border-[#38b6ff] ${fontSizes.input} ${
                        darkMode
                          ? 'bg-black border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="https://www.ptk.org.pl"
                      disabled={loading}
                    />
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
              className={`px-6 py-3 ${fontSizes.text} font-semibold rounded-lg transition-all duration-200 bg-[#38b6ff] text-black hover:bg-[#2a9fe5] shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
              disabled={loading}
            >
              {loading ? 'Dodawanie...' : 'Dodaj konferencję'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddConferenceForm;