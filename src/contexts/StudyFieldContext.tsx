import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useStudyField } from '../hooks/useStudyField';
import { MEDICAL_STUDY_FIELDS } from '../constants/studyFields';

interface StudyFieldContextType {
  selectedField: string | null;
  fieldData: typeof MEDICAL_STUDY_FIELDS[number] | null;
  loading: boolean;
  error: string | null;
  saveStudyField: (fieldValue: string) => Promise<boolean>;
  clearStudyField: () => void;
  hasSelectedField: boolean;
  isAuthenticated: boolean;
}

const StudyFieldContext = createContext<StudyFieldContextType | undefined>(undefined);

export const useStudyFieldContext = () => {
  const context = useContext(StudyFieldContext);
  if (!context) {
    throw new Error('useStudyFieldContext must be used within StudyFieldProvider');
  }
  return context;
};

interface StudyFieldProviderProps {
  children: ReactNode;
}

export const StudyFieldProvider: React.FC<StudyFieldProviderProps> = ({ children }) => {
  const studyField = useStudyField();
  
  // Log changes for debugging
  useEffect(() => {
    if (studyField.selectedField) {
      console.log('📚 StudyFieldContext: Field changed to:', studyField.selectedField);
    }
  }, [studyField.selectedField]);

  return (
    <StudyFieldContext.Provider value={studyField}>
      {children}
    </StudyFieldContext.Provider>
  );
};