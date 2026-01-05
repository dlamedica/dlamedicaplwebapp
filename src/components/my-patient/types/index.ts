/**
 * Typy i interfejsy dla modułu "Mój pacjent"
 * Symulator przypadków klinicznych
 */

// ============ ENUMS ============

export type PatientGender = 'male' | 'female';
export type PatientStatus = 'stable' | 'urgent' | 'critical' | 'improving' | 'worsening';
export type DifficultyLevel = 1 | 2 | 3;
export type SymptomSeverity = 'mild' | 'moderate' | 'severe';
export type ExamType = 'inspection' | 'palpation' | 'percussion' | 'auscultation';
export type LabCategory = 'blood' | 'urine' | 'imaging' | 'functional' | 'other';
export type AlertType = 'info' | 'warning' | 'danger' | 'success';
export type ProfessionType = 'doctor' | 'nurse' | 'paramedic' | 'physiotherapist' | 'student';

// ============ PODSTAWOWE DANE PACJENTA ============

export interface PatientDemographics {
  age: number;
  gender: PatientGender;
  height: number; // cm
  weight: number; // kg
  bmi: number;
  occupation: string;
  lifestyle: LifestyleFactors;
  familyHistory: string[];
  allergies: string[];
  bloodType?: string;
}

export interface LifestyleFactors {
  smoking: 'never' | 'former' | 'current';
  smokingPackYears?: number;
  alcohol: 'none' | 'occasional' | 'moderate' | 'heavy';
  physicalActivity: 'sedentary' | 'light' | 'moderate' | 'active';
  diet: 'poor' | 'average' | 'healthy';
  stress: 'low' | 'moderate' | 'high';
  sleepQuality: 'poor' | 'average' | 'good';
}

export interface RiskFactors {
  id: string;
  name: string;
  category: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

// ============ OBJAWY I DOLEGLIWOŚCI ============

export interface Symptom {
  id: string;
  name: string;
  bodySystem: string;
  severity: SymptomSeverity;
  duration: string; // np. "2 dni", "3 tygodnie"
  character: string; // np. "ostry", "tępy", "piekący"
  location?: string;
  radiation?: string; // promieniowanie bólu
  aggravatingFactors?: string[];
  relievingFactors?: string[];
  associatedSymptoms?: string[];
  frequency?: string;
  timing?: string;
  isNew?: boolean;
  reportedAt: Date;
}

export interface ChiefComplaint {
  symptomId: string;
  description: string;
  onset: Date;
  progression: 'improving' | 'stable' | 'worsening';
}

// ============ PARAMETRY ŻYCIOWE ============

export interface VitalSigns {
  id: string;
  timestamp: Date;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  heartRate: number;
  respiratoryRate: number;
  temperature: number;
  oxygenSaturation: number;
  painLevel?: number; // 0-10
  bloodGlucose?: number;
  weight?: number;
}

// ============ BADANIE PRZEDMIOTOWE ============

export interface PhysicalExamination {
  id: string;
  timestamp: Date;
  examType: ExamType;
  bodyRegion: string;
  findings: string;
  isNormal: boolean;
  performedBy: string;
  cost: number; // koszt w punktach/czasie
}

export interface ExaminationOption {
  id: string;
  name: string;
  bodyRegion: string;
  examType: ExamType;
  description: string;
  cost: number;
  timeMinutes: number;
  availableFor: ProfessionType[];
}

// ============ BADANIA DODATKOWE ============

export interface LabTest {
  id: string;
  name: string;
  category: LabCategory;
  description: string;
  normalRange: string;
  unit: string;
  cost: number; // punkty
  timeHours: number; // czas oczekiwania na wynik
  availableFor: ProfessionType[];
}

export interface LabOrder {
  id: string;
  testId: string;
  orderedAt: Date;
  orderedBy: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  result?: LabResult;
  cost: number;
}

export interface LabResult {
  id: string;
  testId: string;
  value: string | number;
  unit: string;
  isAbnormal: boolean;
  interpretation?: string;
  resultAt: Date;
  referenceRange: string;
}

// ============ DIAGNOZA ============

export interface Diagnosis {
  id: string;
  icdCode: string;
  name: string;
  isPrimary: boolean;
  confidence: 'suspected' | 'probable' | 'confirmed';
  diagnosedAt: Date;
  diagnosedBy: string;
  notes?: string;
}

export interface DifferentialDiagnosis {
  id: string;
  diagnoses: Diagnosis[];
  reasoning: string;
  createdAt: Date;
}

// ============ PLAN LECZENIA ============

export interface Medication {
  id: string;
  name: string;
  dose: string;
  frequency: string;
  route: 'oral' | 'iv' | 'im' | 'sc' | 'topical' | 'inhalation';
  duration: string;
  instructions?: string;
  contraindications?: string[];
  sideEffects?: string[];
}

export interface TreatmentPlan {
  id: string;
  patientId: string;
  createdAt: Date;
  updatedAt: Date;
  medications: Medication[];
  nonPharmacological: NonPharmacologicalTreatment[];
  followUp: FollowUpPlan;
  goals: TreatmentGoal[];
  educationPoints: string[];
  createdBy: string;
}

export interface NonPharmacologicalTreatment {
  id: string;
  category: 'diet' | 'exercise' | 'lifestyle' | 'rehabilitation' | 'psychological' | 'education';
  description: string;
  frequency?: string;
  duration?: string;
  instructions: string[];
}

export interface TreatmentGoal {
  id: string;
  description: string;
  targetDate?: Date;
  status: 'pending' | 'in_progress' | 'achieved' | 'failed';
  metric?: string;
  targetValue?: string;
}

export interface FollowUpPlan {
  nextVisitDate: Date;
  visitType: 'routine' | 'urgent' | 'monitoring';
  parametersToMonitor: string[];
  testsToRepeat: string[];
  warningSignsToWatch: string[];
}

// ============ PLAN OPIEKI PIELĘGNIARSKIEJ ============

export interface NursingCarePlan {
  id: string;
  patientId: string;
  diagnoses: NursingDiagnosis[];
  interventions: NursingIntervention[];
  evaluations: NursingEvaluation[];
  createdAt: Date;
  updatedAt: Date;
}

export interface NursingDiagnosis {
  id: string;
  nandaCode?: string;
  name: string;
  relatedFactors: string[];
  definingCharacteristics: string[];
  priority: 'high' | 'medium' | 'low';
}

export interface NursingIntervention {
  id: string;
  nicCode?: string;
  name: string;
  activities: string[];
  frequency: string;
  responsible: string;
}

export interface NursingEvaluation {
  id: string;
  nocCode?: string;
  outcome: string;
  indicators: string[];
  targetScore: number;
  currentScore: number;
  evaluatedAt: Date;
}

// ============ HISTORIA I TIMELINE ============

export interface Encounter {
  id: string;
  patientId: string;
  type: 'initial' | 'follow_up' | 'emergency' | 'routine';
  date: Date;
  duration: number; // minuty
  chiefComplaints: ChiefComplaint[];
  vitalSigns: VitalSigns;
  examinations: PhysicalExamination[];
  labOrders: LabOrder[];
  diagnoses: Diagnosis[];
  treatmentPlan?: TreatmentPlan;
  notes: string;
  performedBy: string;
  score?: EncounterScore;
}

export interface TimelineEvent {
  id: string;
  patientId: string;
  timestamp: Date;
  type: 'symptom' | 'examination' | 'lab_order' | 'lab_result' | 'diagnosis' | 'treatment' | 'alert' | 'note';
  title: string;
  description: string;
  icon?: string;
  severity?: AlertType;
  data?: any;
}

// ============ ALERTY ============

export interface PatientAlert {
  id: string;
  patientId: string;
  type: AlertType;
  title: string;
  message: string;
  createdAt: Date;
  readAt?: Date;
  isRead: boolean;
  actionRequired: boolean;
  actionTaken?: string;
  expiresAt?: Date;
  triggerCondition?: string;
}

// ============ SCENARIUSZE CHORÓB ============

export interface DiseaseScenario {
  id: string;
  name: string;
  icdCode: string;
  description: string;
  difficulty: DifficultyLevel;
  category: string;
  targetProfessions: ProfessionType[];
  phases: DiseasePhase[];
  expectedDiagnosis: string;
  expectedTreatment: string[];
  commonMistakes: string[];
  educationalPoints: string[];
  estimatedDuration: number; // dni
  tags: string[];
}

export interface DiseasePhase {
  id: string;
  name: string;
  order: number;
  duration: { min: number; max: number }; // dni
  symptoms: Symptom[];
  vitalSignsChanges: Partial<VitalSigns>;
  labResultsChanges: { testId: string; abnormalValue: string }[];
  progressionConditions: ProgressionCondition[];
  complications: Complication[];
}

export interface ProgressionCondition {
  type: 'time' | 'treatment' | 'no_treatment' | 'wrong_treatment';
  description: string;
  nextPhaseId: string;
  probability: number; // 0-1
}

export interface Complication {
  id: string;
  name: string;
  description: string;
  triggerConditions: string[];
  probability: number;
  severity: 'mild' | 'moderate' | 'severe' | 'critical';
  symptoms: Symptom[];
}

// ============ PACJENT (GŁÓWNY MODEL) ============

export interface Patient {
  id: string;
  name: string;
  initials: string;
  avatar?: string;
  demographics: PatientDemographics;
  chronicConditions: string[];
  currentMedications: Medication[];
  riskFactors: RiskFactors[];
  
  // Stan aktualny
  status: PatientStatus;
  currentScenario: DiseaseScenario;
  currentPhase: string; // phaseId
  currentSymptoms: Symptom[];
  currentVitalSigns: VitalSigns;
  
  // Historia
  encounters: Encounter[];
  timeline: TimelineEvent[];
  alerts: PatientAlert[];
  labResults: LabResult[];
  
  // Plany
  activeTreatmentPlan?: TreatmentPlan;
  nursingCarePlan?: NursingCarePlan;
  
  // Meta
  assignedTo: string; // userId
  createdAt: Date;
  lastInteraction: Date;
  nextScheduledVisit?: Date;
  
  // Grywalizacja
  difficultyLevel: DifficultyLevel;
  isCompleted: boolean;
  finalScore?: number;
}

// ============ PUNKTACJA ============

export interface EncounterScore {
  total: number;
  breakdown: {
    historyTaking: number;
    examination: number;
    diagnosticEfficiency: number;
    diagnosisAccuracy: number;
    treatmentAppropriateness: number;
    patientEducation: number;
    followUpPlanning: number;
  };
  penalties: ScorePenalty[];
  bonuses: ScoreBonus[];
  feedback: string[];
}

export interface ScorePenalty {
  reason: string;
  points: number;
  category: string;
}

export interface ScoreBonus {
  reason: string;
  points: number;
  category: string;
}

export interface UserProgress {
  id: string;
  userId: string;
  totalScore: number;
  level: number;
  levelName: string;
  experiencePoints: number;
  experienceToNextLevel: number;
  patientsCompleted: number;
  averageScore: number;
  strongAreas: string[];
  weakAreas: string[];
  achievements: Achievement[];
  unlockedDifficulties: DifficultyLevel[];
  statistics: UserStatistics;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  isUnlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

export interface UserStatistics {
  totalEncounters: number;
  totalDiagnoses: number;
  correctDiagnoses: number;
  averageResponseTime: number;
  averageLabCost: number;
  patientsImproved: number;
  patientsWorsened: number;
  criticalMistakes: number;
  perfectScores: number;
}

// ============ PYTANIA WYWIADU ============

export interface InterviewQuestion {
  id: string;
  category: string;
  question: string;
  questionType: 'yes_no' | 'multiple_choice' | 'open' | 'scale';
  options?: string[];
  relatedSymptoms?: string[];
  followUpQuestions?: string[];
  cost: number; // czas/punkty
}

export interface InterviewResponse {
  questionId: string;
  response: string | number | boolean;
  generatedAnswer: string; // odpowiedź "pacjenta"
  askedAt: Date;
  wasRelevant: boolean;
}

// ============ FORMULARZE UI ============

export interface PatientCardTab {
  id: string;
  name: string;
  icon: string;
  component: string;
  isActive: boolean;
  hasAlerts?: boolean;
  alertCount?: number;
}

export interface QuickAction {
  id: string;
  name: string;
  icon: string;
  action: string;
  isAvailable: boolean;
  cost?: number;
}

