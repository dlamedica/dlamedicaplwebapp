import { useState } from 'react';
import { db } from '../../lib/apiClient';
import { FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import { MEDICAL_PROFESSIONS } from '../../constants/professions';

interface ProfessionEditorProps {
  currentZawod: string;
  userId: string;
  darkMode?: boolean;
  onUpdate?: (newZawod: string) => void;
}

const ProfessionEditor: React.FC<ProfessionEditorProps> = ({
  currentZawod,
  userId,
  darkMode = false,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [zawod, setZawod] = useState(currentZawod);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await db
        .from('users')
        .update({ zawod: zawod })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      setIsEditing(false);
      onUpdate?.(zawod);
    } catch (err: any) {
      setError(err.message || 'Wystąpił błąd podczas zapisywania');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setZawod(currentZawod);
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Zawód</h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm transition-colors ${
              darkMode
                ? 'text-white border border-white hover:bg-white hover:text-black'
                : 'text-black border border-black hover:bg-black hover:text-white'
            }`}
          >
            <FaEdit className="w-3 h-3" />
            <span>Edytuj</span>
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {isEditing ? (
        <div className="space-y-4">
          <select
            value={zawod}
            onChange={(e) => setZawod(e.target.value)}
            disabled={loading}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="">Wybierz zawód medyczny</option>
            {MEDICAL_PROFESSIONS.map((profession) => (
              <option key={profession.value} value={profession.value}>
                {profession.label}
              </option>
            ))}
          </select>

          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              <FaCheck className="w-3 h-3" />
              <span>{loading ? 'Zapisywanie...' : 'Zapisz'}</span>
            </button>

            <button
              onClick={handleCancel}
              disabled={loading}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                darkMode
                  ? 'bg-gray-600 hover:bg-gray-700 text-white'
                  : 'bg-gray-500 hover:bg-gray-600 text-white'
              }`}
            >
              <FaTimes className="w-3 h-3" />
              <span>Anuluj</span>
            </button>
          </div>
        </div>
      ) : (
        <div className={`p-4 rounded-md border ${
          darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
        }`}>
          <p className="text-lg">{currentZawod}</p>
        </div>
      )}
    </div>
  );
};

export default ProfessionEditor;