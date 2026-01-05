import React, { useState } from 'react';
import { FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import { MEDICAL_PROFESSIONS_10 } from '../../constants/professions';
import { useAuth } from '../../contexts/AuthContext';

interface ProfessionDisplayProps {
  profession: string;
  darkMode?: boolean;
}

const ProfessionDisplay: React.FC<ProfessionDisplayProps> = ({ 
  profession, 
  darkMode = false 
}) => {
  const { updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProfession, setSelectedProfession] = useState(profession);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!selectedProfession) {
      setError('Wybierz zawód');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await updateProfile({ zawod: selectedProfession });
      setIsEditing(false);
      // Reload page to update profession everywhere
      window.location.reload();
    } catch (err: any) {
      setError('Błąd podczas zapisywania zawodu');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedProfession(profession);
    setIsEditing(false);
    setError(null);
  };

  if (isEditing) {
    return (
      <div className={`px-6 py-4 border-b ${
        darkMode 
          ? 'border-gray-700 bg-gray-800' 
          : 'border-gray-200 bg-gray-50'
      }`}>
        <div className={`text-sm font-medium uppercase tracking-wider ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Wybierz zawód
        </div>
        
        <select
          value={selectedProfession}
          onChange={(e) => setSelectedProfession(e.target.value)}
          disabled={loading}
          className={`w-full mt-2 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' 
              : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
          }`}
        >
          <option value="">Wybierz zawód medyczny</option>
          {MEDICAL_PROFESSIONS_10.map((prof) => (
            <option key={prof.value} value={prof.value}>
              {prof.label}
            </option>
          ))}
        </select>

        {error && (
          <div className="mt-2 text-xs text-red-500">{error}</div>
        )}

        <div className="flex gap-1 mt-3">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            <FaCheck className="w-3 h-3" />
            {loading ? 'Zapisywanie...' : 'Zapisz'}
          </button>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
          >
            <FaTimes className="w-3 h-3" />
            Anuluj
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`px-6 py-4 border-b ${
      darkMode 
        ? 'border-gray-700 bg-gray-800' 
        : 'border-gray-200 bg-gray-50'
    }`}>
      <div className={`text-sm font-medium uppercase tracking-wider ${
        darkMode ? 'text-gray-300' : 'text-gray-600'
      }`}>
        Wybrany zawód
      </div>
      <div className="flex items-center justify-between mt-1">
        <div className={`text-lg font-bold ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {MEDICAL_PROFESSIONS_10.find(p => p.value === profession)?.label || profession || 'Nie wybrano'}
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="ml-2 p-1 text-gray-500 hover:text-blue-600 transition-colors"
          title="Zmień zawód"
        >
          <FaEdit className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default ProfessionDisplay;