/**
 * Prosta strona profilu z edycją
 */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface ProfileSimpleProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const ProfileSimple: React.FC<ProfileSimpleProps> = ({ darkMode }) => {
  const { user, profile, signOut, updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Formularz
  const [formData, setFormData] = useState({
    full_name: '',
    profession: '',
    city: '',
    phone: '',
  });

  // Załaduj dane profilu do formularza
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        profession: profile.profession || '',
        city: profile.city || '',
        phone: profile.phone || '',
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log('Wysyłam dane:', formData);
      const { error: updateError } = await updateProfile(formData);

      if (updateError) {
        setError(updateError.message || 'Błąd podczas zapisywania');
      } else {
        setSuccess(true);
        setIsEditing(false);
      }
    } catch (err: any) {
      setError(err.message || 'Nieoczekiwany błąd');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    // Przywróć oryginalne wartości
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        profession: profile.profession || '',
        city: profile.city || '',
        phone: profile.phone || '',
      });
    }
  };

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };

  const bgColor = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-500';
  const inputBg = darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300';

  if (!user) {
    return (
      <div className={`min-h-screen ${bgColor} flex items-center justify-center`}>
        <div className={`${cardBg} p-8 rounded-lg shadow-lg text-center`}>
          <p className={textColor}>Musisz być zalogowany aby zobaczyć profil</p>
          <a href="/login" className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Zaloguj się
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgColor} py-8 px-4`}>
      <div className="max-w-2xl mx-auto">
        {/* Nagłówek */}
        <div className={`${cardBg} rounded-lg shadow-lg p-6 mb-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {profile?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${textColor}`}>
                  {profile?.full_name || 'Użytkownik'}
                </h1>
                <p className={textMuted}>{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Wyloguj się
            </button>
          </div>
        </div>

        {/* Komunikaty */}
        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            Profil został zaktualizowany pomyślnie!
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Karta profilu */}
        <div className={`${cardBg} rounded-lg shadow-lg p-6`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-semibold ${textColor}`}>Dane profilu</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Edytuj profil
              </button>
            )}
          </div>

          {isEditing ? (
            /* TRYB EDYCJI */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${textColor}`}>
                  Imię i nazwisko
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${inputBg} ${textColor}`}
                  placeholder="Jan Kowalski"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${textColor}`}>
                  Zawód
                </label>
                <select
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${inputBg} ${textColor}`}
                >
                  <option value="">Wybierz zawód</option>
                  <option value="lekarz">Lekarz</option>
                  <option value="pielęgniarka">Pielęgniarka/Pielęgniarz</option>
                  <option value="fizjoterapeuta">Fizjoterapeuta</option>
                  <option value="farmaceuta">Farmaceuta</option>
                  <option value="ratownik_medyczny">Ratownik medyczny</option>
                  <option value="diagnosta">Diagnosta laboratoryjny</option>
                  <option value="student">Student medycyny</option>
                  <option value="inne">Inne</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${textColor}`}>
                  Miasto
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${inputBg} ${textColor}`}
                  placeholder="Warszawa"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${textColor}`}>
                  Telefon
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${inputBg} ${textColor}`}
                  placeholder="+48 123 456 789"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Zapisywanie...' : 'Zapisz zmiany'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Anuluj
                </button>
              </div>
            </form>
          ) : (
            /* TRYB PODGLĄDU */
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm ${textMuted}`}>Email</p>
                  <p className={`font-medium ${textColor}`}>{user.email}</p>
                </div>
                <div>
                  <p className={`text-sm ${textMuted}`}>Imię i nazwisko</p>
                  <p className={`font-medium ${textColor}`}>{profile?.full_name || '—'}</p>
                </div>
                <div>
                  <p className={`text-sm ${textMuted}`}>Zawód</p>
                  <p className={`font-medium ${textColor}`}>{profile?.profession || '—'}</p>
                </div>
                <div>
                  <p className={`text-sm ${textMuted}`}>Miasto</p>
                  <p className={`font-medium ${textColor}`}>{profile?.city || '—'}</p>
                </div>
                <div>
                  <p className={`text-sm ${textMuted}`}>Telefon</p>
                  <p className={`font-medium ${textColor}`}>{profile?.phone || '—'}</p>
                </div>
                <div>
                  <p className={`text-sm ${textMuted}`}>Typ konta</p>
                  <p className={`font-medium ${textColor}`}>{profile?.is_company ? 'Firma' : 'Indywidualny'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSimple;
