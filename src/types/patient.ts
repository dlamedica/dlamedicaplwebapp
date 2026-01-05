export type Gender = 'male' | 'female' | 'other';
export type PatientStatus = 'stable' | 'critical' | 'deteriorating' | 'improving' | 'deceased' | 'discharged';
export type UrgencyLevel = 'routine' | 'urgent' | 'emergency';

// --- Vitals & Physical Params ---

export interface PatientVitals {
    heartRate: number;
    bloodPressureSys: number;
    bloodPressureDia: number;
    oxygenSaturation: number;
    temperature: number;
    respiratoryRate: number;
    glucoseLevel?: number; // mg/dL
    consciousness?: 'alert' | 'verbal' | 'pain' | 'unresponsive'; // AVPU scale
    lastUpdated: number; // timestamp
}

export interface PatientDemographics {
    id: string;
    firstName: string;
    lastName: string;
    age: number;
    gender: Gender;
    occupation?: string;
    avatarUrl?: string; // For UI
}

export interface Lifestyle {
    smoking: 'never' | 'former' | 'active';
    alcohol: 'none' | 'occasional' | 'frequent' | 'abuse';
    activityLevel: 'sedentary' | 'moderate' | 'active';
    diet: string;
}

export interface RiskFactors {
    hypertension: boolean;
    diabetes: boolean;
    obesity: boolean;
    smoking: boolean;
    familyHistory: string[];
}

// --- History & Medical Data ---

export interface PatientHistoryItem {
    id: string;
    category: 'symptoms' | 'medications' | 'family' | 'social' | 'past_medical' | 'allergies';
    description: string;
    dateAdded: string;
    isSecret?: boolean; // Some history might be hidden until specific interview questions asked
}

export interface PhysicalExamFinding {
    id: string;
    system: 'general' | 'respiratory' | 'cardiovascular' | 'gastrointestinal' | 'neurological' | 'skin' | 'heent';
    finding: string;
    isAbnormal: boolean;
    discoveredAt?: number; // When the user found this
}

// --- Diagnostics & Orders ---

export interface LabResult {
    id: string;
    testName: string;
    category: 'hematology' | 'biochemistry' | 'imaging' | 'microbiology' | 'other';
    value: number | string;
    unit: string;
    referenceRange: string;
    isAbnormal: boolean;
    orderedAt: number;
    resultAt?: number; // When the result becomes available
    status: 'ordered' | 'processing' | 'completed';
    cost: number; // for gamification
}

export interface Order {
    id: string;
    type: 'lab' | 'imaging' | 'procedure' | 'consultation';
    name: string;
    orderedAt: number;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    resultId?: string;
}

// --- Treatment ---

export interface Medication {
    id: string;
    name: string;
    dosage: string;
    route: 'oral' | 'iv' | 'im' | 'sc' | 'inhaled' | 'topical';
    frequency: string; // e.g., "q24h", "bid"
    startDate: number;
    endDate?: number;
    status: 'active' | 'discontinued' | 'completed';
}

export interface MedicalAction {
    id: string;
    timestamp: number;
    type: 'medication' | 'exam' | 'order' | 'diagnosis' | 'observation';
    description: string;
    performer: 'user' | 'system';
}

// --- Simulation Model ---

export type DiseasePhaseName = 'incubation' | 'prodromal' | 'acute' | 'complication' | 'recovery' | 'terminal';

export interface DiseasePhase {
    name: DiseasePhaseName;
    durationRange: [number, number]; // min, max duration in simulation ticks/hours
    vitalsTarget: Partial<PatientVitals>; // The vitals toward which the patient trends in this phase
    symptoms: string[];
    examFindings: Partial<PhysicalExamFinding>[];
    labAbnormalities: Partial<LabResult>[];
}

export interface DiseaseScenario {
    id: string;
    name: string;
    difficulty: 'easy' | 'medium' | 'hard';
    description: string; // Internal description for admin/dev
    phases: DiseasePhase[];
    initialHistory: PatientHistoryItem[];
    startingVitals: PatientVitals;
    possibleComplications: {
        triggerCondition: string; // Description logic, e.g. "untreated_htn_24h"
        nextPhase: DiseasePhaseName;
        probability: number;
    }[];
}

// --- Main Patient Interface ---

export interface PatientState {
    patient: PatientDemographics;
    condition: PatientStatus;
    vitals: PatientVitals;
    lifestyle: Lifestyle;
    riskFactors: RiskFactors;

    // Clinical Data
    history: PatientHistoryItem[];
    symptoms: string[]; // Current complaints
    examFindings: PhysicalExamFinding[];
    labs: LabResult[];
    activeOrders: Order[];
    medications: Medication[];

    // Gamification / Simulation State
    activeScenarioId: string;
    currentPhase: DiseasePhaseName;
    phaseStartTime: number; // timestamp
    timeSinceLastVisit: number;
    alerts: string[]; // "New chest pain reported!"
    score: number;

    // Timeline
    timeline: MedicalAction[];
}
