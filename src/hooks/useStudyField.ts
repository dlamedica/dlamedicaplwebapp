import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MEDICAL_STUDY_FIELDS } from '../constants/studyFields';
import { db } from '../lib/apiClient';

const STORAGE_KEY = 'selectedStudyField';
const STORAGE_NAME_KEY = 'selectedStudyFieldName';
const STORAGE_TIMESTAMP_KEY = 'selectedStudyFieldTimestamp';

export const useStudyField = () => {
  const { user, profile, updateProfile } = useAuth();
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load study field on mount and when profile changes
  useEffect(() => {
    const loadStudyField = async () => {
      setLoading(true);
      setError(null);

      try {
        // Priority 1: Get from database profile
        if (profile?.study_field) {
          console.log('📚 Loading study field from profile:', profile.study_field);
          setSelectedField(profile.study_field);
          // Sync to localStorage
          localStorage.setItem(STORAGE_KEY, profile.study_field);
          const fieldData = MEDICAL_STUDY_FIELDS.find(f => f.value === profile.study_field);
          if (fieldData) {
            localStorage.setItem(STORAGE_NAME_KEY, fieldData.label);
          }
          localStorage.setItem(STORAGE_TIMESTAMP_KEY, new Date().toISOString());
        } 
        // Priority 2: Get from localStorage if user is logged in
        else if (user) {
          const storedField = localStorage.getItem(STORAGE_KEY);
          const storedTimestamp = localStorage.getItem(STORAGE_TIMESTAMP_KEY);
          
          if (storedField) {
            console.log('📚 Loading study field from localStorage:', storedField);
            setSelectedField(storedField);
            
            // If timestamp is old (>1 hour), try to sync with database
            if (storedTimestamp) {
              const timestamp = new Date(storedTimestamp);
              const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
              
              if (timestamp < hourAgo) {
                console.log('🔄 Syncing old localStorage data with database');
                await saveStudyField(storedField, false);
              }
            }
          }
        }
        // Priority 3: No field selected
        else {
          console.log('⚠️ No study field found');
          setSelectedField(null);
        }
      } catch (err) {
        console.error('❌ Error loading study field:', err);
        setError('Błąd podczas ładowania kierunku studiów');
      } finally {
        setLoading(false);
      }
    };

    loadStudyField();
  }, [profile, user]);

  // Save study field to both database and localStorage
  const saveStudyField = useCallback(async (fieldValue: string, showConfirmation = true) => {
    if (!fieldValue || !user) {
      setError('Musisz być zalogowany aby zapisać kierunek');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const fieldData = MEDICAL_STUDY_FIELDS.find(f => f.value === fieldValue);
      if (!fieldData) {
        throw new Error('Nieprawidłowy kierunek studiów');
      }

      // Show confirmation if changing field
      if (showConfirmation && selectedField && selectedField !== fieldValue) {
        const currentFieldName = MEDICAL_STUDY_FIELDS.find(f => f.value === selectedField)?.label || 'Nieokreślony';
        const newFieldName = fieldData.label;
        
        const confirmed = window.confirm(
          `Czy na pewno chcesz zmienić kierunek studiów z "${currentFieldName}" na "${newFieldName}"?\n\nTo wpłynie na wyświetlane treści edukacyjne.`
        );
        
        if (!confirmed) {
          setLoading(false);
          return false;
        }
      }

      console.log('💾 Saving study field:', fieldValue);

      // Save to localStorage immediately for instant UI update
      localStorage.setItem(STORAGE_KEY, fieldValue);
      localStorage.setItem(STORAGE_NAME_KEY, fieldData.label);
      localStorage.setItem(STORAGE_TIMESTAMP_KEY, new Date().toISOString());
      setSelectedField(fieldValue);

      // Save to database
      const updateData = {
        study_field: fieldValue,
        zawod: fieldValue, // For backward compatibility
        study_field_updated_at: new Date().toISOString()
      };

      const result = await updateProfile(updateData);
      
      if (result?.error) {
        console.error('❌ Error saving to database:', result.error);
        setError('Błąd podczas zapisywania do bazy danych');
        // Keep localStorage version even if database fails
        return false;
      }

      console.log('✅ Study field saved successfully');
      return true;
    } catch (err) {
      console.error('❌ Error saving study field:', err);
      setError('Wystąpił błąd podczas zapisywania kierunku');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, selectedField, updateProfile]);

  // Clear study field (for logout or reset)
  const clearStudyField = useCallback(() => {
    setSelectedField(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_NAME_KEY);
    localStorage.removeItem(STORAGE_TIMESTAMP_KEY);
  }, []);

  // Get field data
  const getFieldData = useCallback(() => {
    if (!selectedField) return null;
    return MEDICAL_STUDY_FIELDS.find(f => f.value === selectedField) || null;
  }, [selectedField]);

  // Check if user has selected a field
  const hasSelectedField = useCallback(() => {
    return !!selectedField;
  }, [selectedField]);

  return {
    selectedField,
    fieldData: getFieldData(),
    loading,
    error,
    saveStudyField,
    clearStudyField,
    hasSelectedField: hasSelectedField(),
    isAuthenticated: !!user
  };
};