/**
 * Eksport komponentów modułu "Mój pacjent"
 * Symulator przypadków klinicznych
 */

// Główne komponenty
export { default as MyPatientDashboard } from './MyPatientDashboard';
export { default as PatientCard } from './PatientCard';

// Zakładki karty pacjenta
export { default as PatientBasicData } from './tabs/PatientBasicData';
export { default as PatientInterview } from './tabs/PatientInterview';
export { default as PatientExamination } from './tabs/PatientExamination';
export { default as PatientPhysicalExam } from './tabs/PatientPhysicalExam';
export { default as PatientLabTests } from './tabs/PatientLabTests';
export { default as PatientDiagnosis } from './tabs/PatientDiagnosis';
export { default as PatientTreatment } from './tabs/PatientTreatment';
export { default as PatientTimeline } from './tabs/PatientTimeline';

// Komponenty interaktywnej mapy ciała
export { default as BodyMap } from './components/BodyMap';
export { default as PatientAvatar } from './components/PatientAvatar';
export { default as ExamToolsPanel } from './components/ExamToolsPanel';
export { default as ExamResultsPanel } from './components/ExamResultsPanel';

// Ikony
export * from './icons/PatientIcons';

// Typy
export * from './types';

// Typy badania fizykalnego
export * from './types/physicalExam';

// Dane przykładowe
export * from './data/samplePatients';

// Dane badania fizykalnego
export * from './data/bodyRegions';

