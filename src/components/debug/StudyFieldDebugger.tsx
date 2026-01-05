import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { MEDICAL_STUDY_FIELDS } from '../../constants/studyFields';

interface StudyFieldDebuggerProps {
  darkMode?: boolean;
}

const StudyFieldDebugger: React.FC<StudyFieldDebuggerProps> = ({ darkMode = false }) => {
  const { profile, user } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [showDebugger, setShowDebugger] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return;

    const updateDebugInfo = () => {
      const currentField = MEDICAL_STUDY_FIELDS.find(
        f => f.value === profile?.study_field || f.value === profile?.zawod
      );

      setDebugInfo({
        timestamp: new Date().toISOString(),
        profile_study_field: profile?.study_field,
        profile_zawod: profile?.zawod,
        current_field_match: currentField,
        localStorage_backup: localStorage.getItem('userProfile_backup'),
        localStorage_study_field: localStorage.getItem('selectedStudyField'),
        localStorage_last_valid: localStorage.getItem('lastValidStudyField'),
        user_id: user?.id,
        available_fields: MEDICAL_STUDY_FIELDS.map(f => ({ value: f.value, label: f.label }))
      });
    };

    updateDebugInfo();
    
    // Update every 2 seconds
    const interval = setInterval(updateDebugInfo, 2000);
    
    return () => clearInterval(interval);
  }, [profile, user]);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShowDebugger(!showDebugger)}
        className={`px-3 py-2 text-xs font-mono rounded transition-colors ${
          darkMode 
            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        🐛 Study Field Debug
      </button>
      
      {showDebugger && (
        <div className={`mt-2 p-4 rounded-lg shadow-lg max-w-md max-h-80 overflow-auto text-xs font-mono ${
          darkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-700'
        }`}>
          <div className="mb-2 font-bold">Study Field Debug Info:</div>
          <pre className="whitespace-pre-wrap break-words">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
          
          {debugInfo.profile_study_field !== debugInfo.profile_zawod && (
            <div className="mt-2 p-2 bg-yellow-100 text-yellow-800 rounded text-xs">
              ⚠️ Mismatch: study_field ≠ zawod
            </div>
          )}
          
          {!debugInfo.current_field_match && (
            <div className="mt-2 p-2 bg-red-100 text-red-800 rounded text-xs">
              ❌ No field match found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudyFieldDebugger;