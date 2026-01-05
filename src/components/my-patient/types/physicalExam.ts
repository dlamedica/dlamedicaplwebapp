/**
 * Typy dla rozbudowanego badania fizykalnego
 */

// ============ REGIONY CIAŁA ============

export type BodyView = 'front' | 'back';
export type BodyZoom = 'full' | 'chest' | 'abdomen' | 'head';
export type RegionType = 'heart' | 'lung' | 'abdomen' | 'head' | 'neck' | 'spine' | 'extremity' | 'other';
export type ExamType = 'auscultation' | 'palpation' | 'percussion' | 'inspection';
export type ResultSeverity = 'normal' | 'mild' | 'moderate' | 'severe';

export interface BodyRegion {
  id: string;
  name: string;
  namePL: string;
  type: RegionType;
  position: BodyView;
  x: number; // pozycja X w SVG (0-100%)
  y: number; // pozycja Y w SVG (0-100%)
  width: number;
  height: number;
  availableExams: ExamType[];
  parentRegion?: string;
  isKeyPoint?: boolean; // czy jest to kluczowy punkt do zbadania
}

// Punkty osłuchiwania serca
export interface HeartAuscultationPoint {
  id: string;
  name: string; // A, P, T, M, Erb
  fullName: string;
  position: { x: number; y: number };
  description: string;
}

// Punkty osłuchiwania płuc
export interface LungAuscultationPoint {
  id: string;
  name: string;
  side: 'left' | 'right';
  level: 'upper' | 'middle' | 'lower';
  position: BodyView;
  coords: { x: number; y: number };
}

// ============ AKCJE BADANIA ============

export interface PhysicalExamAction {
  id: string;
  patientId: string;
  scenarioId: string;
  visitId: string;
  type: ExamType;
  regionId: string;
  regionName: string;
  createdAt: Date;
  resultId: string;
  result: PhysicalExamResult;
}

export interface PhysicalExamResult {
  id: string;
  description: string;
  descriptionPL: string;
  audioUrl?: string;
  severity: ResultSeverity;
  isAbnormal: boolean;
  clinicalSignificance?: string;
  additionalNotes?: string;
}

// ============ LIMITY I SCORING ============

export interface ExamLimits {
  auscultation: number;
  palpation: number;
  percussion: number;
  inspection: number;
  total: number;
}

export interface ExamProgress {
  auscultationCount: number;
  palpationCount: number;
  percussionCount: number;
  inspectionCount: number;
  keyPointsExamined: string[];
  totalKeyPoints: number;
  score: number;
  alerts: ExamAlert[];
}

export interface ExamAlert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  message: string;
  regionId?: string;
  createdAt: Date;
}

// ============ SCENARIUSZE WYNIKÓW ============

export interface ExamScenarioResult {
  regionId: string;
  examType: ExamType;
  normalResult: PhysicalExamResult;
  abnormalResult?: PhysicalExamResult;
  isAbnormalInScenario: boolean;
}

// ============ AWATAR PACJENTA ============

export type AvatarGender = 'male' | 'female';
export type AvatarAgeGroup = 'young' | 'middle' | 'senior';
export type AvatarStatus = 'stable' | 'warning' | 'critical';

export interface PatientAvatarProps {
  gender: AvatarGender;
  ageGroup: AvatarAgeGroup;
  status: AvatarStatus;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showStatusRing?: boolean;
  className?: string;
}

// ============ BODY MAP PROPS ============

export interface BodyMapProps {
  view: BodyView;
  zoom: BodyZoom;
  selectedExamType: ExamType;
  highlightedRegion?: string;
  examinedRegions: string[];
  onRegionClick: (region: BodyRegion) => void;
  onRegionHover: (region: BodyRegion | null) => void;
  darkMode: boolean;
  disabled?: boolean;
}

// ============ PANEL NARZĘDZI ============

export interface ExamToolsPanelProps {
  selectedExamType: ExamType;
  onSelectExamType: (type: ExamType) => void;
  examProgress: ExamProgress;
  examLimits: ExamLimits;
  darkMode: boolean;
  disabled?: boolean;
}

// ============ PANEL WYNIKÓW ============

export interface ExamResultsPanelProps {
  actions: PhysicalExamAction[];
  onPlayAudio?: (audioUrl: string) => void;
  darkMode: boolean;
}

