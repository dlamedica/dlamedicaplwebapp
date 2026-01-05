/**
 * Definicje regionów ciała dla mapy interaktywnej
 */

import { 
  BodyRegion, 
  HeartAuscultationPoint, 
  LungAuscultationPoint,
  ExamScenarioResult,
  PhysicalExamResult,
  ExamLimits
} from '../types/physicalExam';

// ============ DOMYŚLNE LIMITY ============

export const defaultExamLimits: ExamLimits = {
  auscultation: 12,
  palpation: 10,
  percussion: 8,
  inspection: 6,
  total: 30
};

// ============ PUNKTY OSŁUCHIWANIA SERCA ============

export const heartAuscultationPoints: HeartAuscultationPoint[] = [
  {
    id: 'HEART_AORTIC',
    name: 'A',
    fullName: 'Punkt aortalny',
    position: { x: 42, y: 28 },
    description: '2. przestrzeń międzyżebrowa, przy prawym brzegu mostka'
  },
  {
    id: 'HEART_PULMONIC',
    name: 'P',
    fullName: 'Punkt płucny',
    position: { x: 58, y: 28 },
    description: '2. przestrzeń międzyżebrowa, przy lewym brzegu mostka'
  },
  {
    id: 'HEART_ERB',
    name: 'E',
    fullName: 'Punkt Erba',
    position: { x: 55, y: 34 },
    description: '3. przestrzeń międzyżebrowa, przy lewym brzegu mostka'
  },
  {
    id: 'HEART_TRICUSPID',
    name: 'T',
    fullName: 'Punkt trójdzielny',
    position: { x: 48, y: 40 },
    description: '4-5. przestrzeń międzyżebrowa, przy lewym brzegu mostka'
  },
  {
    id: 'HEART_MITRAL',
    name: 'M',
    fullName: 'Punkt mitralny (koniuszek)',
    position: { x: 62, y: 42 },
    description: '5. przestrzeń międzyżebrowa, w linii środkowo-obojczykowej lewej'
  }
];

// ============ PUNKTY OSŁUCHIWANIA PŁUC ============

export const lungAuscultationPoints: LungAuscultationPoint[] = [
  // Przód - prawe płuco
  { id: 'LUNG_R_UPPER_FRONT', name: 'Prawe górne przód', side: 'right', level: 'upper', position: 'front', coords: { x: 38, y: 26 } },
  { id: 'LUNG_R_MIDDLE_FRONT', name: 'Prawe środkowe przód', side: 'right', level: 'middle', position: 'front', coords: { x: 36, y: 35 } },
  { id: 'LUNG_R_LOWER_FRONT', name: 'Prawe dolne przód', side: 'right', level: 'lower', position: 'front', coords: { x: 34, y: 44 } },
  
  // Przód - lewe płuco
  { id: 'LUNG_L_UPPER_FRONT', name: 'Lewe górne przód', side: 'left', level: 'upper', position: 'front', coords: { x: 62, y: 26 } },
  { id: 'LUNG_L_MIDDLE_FRONT', name: 'Lewe środkowe przód', side: 'left', level: 'middle', position: 'front', coords: { x: 64, y: 35 } },
  { id: 'LUNG_L_LOWER_FRONT', name: 'Lewe dolne przód', side: 'left', level: 'lower', position: 'front', coords: { x: 66, y: 44 } },
  
  // Tył - prawe płuco
  { id: 'LUNG_R_UPPER_BACK', name: 'Prawe górne tył', side: 'right', level: 'upper', position: 'back', coords: { x: 62, y: 22 } },
  { id: 'LUNG_R_MIDDLE_BACK', name: 'Prawe środkowe tył', side: 'right', level: 'middle', position: 'back', coords: { x: 64, y: 32 } },
  { id: 'LUNG_R_LOWER_BACK', name: 'Prawe dolne tył', side: 'right', level: 'lower', position: 'back', coords: { x: 66, y: 42 } },
  
  // Tył - lewe płuco
  { id: 'LUNG_L_UPPER_BACK', name: 'Lewe górne tył', side: 'left', level: 'upper', position: 'back', coords: { x: 38, y: 22 } },
  { id: 'LUNG_L_MIDDLE_BACK', name: 'Lewe środkowe tył', side: 'left', level: 'middle', position: 'back', coords: { x: 36, y: 32 } },
  { id: 'LUNG_L_LOWER_BACK', name: 'Lewe dolne tył', side: 'left', level: 'lower', position: 'back', coords: { x: 34, y: 42 } }
];

// ============ REGIONY CIAŁA ============

export const bodyRegions: BodyRegion[] = [
  // === GŁOWA I SZYJA ===
  {
    id: 'HEAD',
    name: 'Head',
    namePL: 'Głowa',
    type: 'head',
    position: 'front',
    x: 42, y: 2, width: 16, height: 12,
    availableExams: ['inspection', 'palpation']
  },
  {
    id: 'NECK_FRONT',
    name: 'Neck (front)',
    namePL: 'Szyja (przód)',
    type: 'neck',
    position: 'front',
    x: 44, y: 14, width: 12, height: 6,
    availableExams: ['inspection', 'palpation'],
    isKeyPoint: true
  },
  {
    id: 'NECK_BACK',
    name: 'Neck (back)',
    namePL: 'Kark',
    type: 'neck',
    position: 'back',
    x: 44, y: 14, width: 12, height: 6,
    availableExams: ['inspection', 'palpation']
  },
  
  // === KLATKA PIERSIOWA PRZÓD ===
  {
    id: 'CHEST_RIGHT_UPPER',
    name: 'Right upper chest',
    namePL: 'Prawa górna część klatki',
    type: 'lung',
    position: 'front',
    x: 30, y: 20, width: 18, height: 14,
    availableExams: ['inspection', 'palpation', 'percussion', 'auscultation'],
    isKeyPoint: true
  },
  {
    id: 'CHEST_LEFT_UPPER',
    name: 'Left upper chest',
    namePL: 'Lewa górna część klatki',
    type: 'lung',
    position: 'front',
    x: 52, y: 20, width: 18, height: 14,
    availableExams: ['inspection', 'palpation', 'percussion', 'auscultation'],
    isKeyPoint: true
  },
  {
    id: 'CHEST_RIGHT_LOWER',
    name: 'Right lower chest',
    namePL: 'Prawa dolna część klatki',
    type: 'lung',
    position: 'front',
    x: 28, y: 34, width: 16, height: 12,
    availableExams: ['inspection', 'palpation', 'percussion', 'auscultation']
  },
  {
    id: 'CHEST_LEFT_LOWER',
    name: 'Left lower chest',
    namePL: 'Lewa dolna część klatki',
    type: 'lung',
    position: 'front',
    x: 56, y: 34, width: 16, height: 12,
    availableExams: ['inspection', 'palpation', 'percussion', 'auscultation']
  },
  {
    id: 'HEART_AREA',
    name: 'Heart area',
    namePL: 'Okolica serca',
    type: 'heart',
    position: 'front',
    x: 48, y: 28, width: 14, height: 16,
    availableExams: ['inspection', 'palpation', 'auscultation'],
    isKeyPoint: true
  },
  
  // === PLECY ===
  {
    id: 'BACK_RIGHT_UPPER',
    name: 'Right upper back',
    namePL: 'Prawe górne plecy',
    type: 'lung',
    position: 'back',
    x: 52, y: 20, width: 18, height: 14,
    availableExams: ['inspection', 'palpation', 'percussion', 'auscultation'],
    isKeyPoint: true
  },
  {
    id: 'BACK_LEFT_UPPER',
    name: 'Left upper back',
    namePL: 'Lewe górne plecy',
    type: 'lung',
    position: 'back',
    x: 30, y: 20, width: 18, height: 14,
    availableExams: ['inspection', 'palpation', 'percussion', 'auscultation'],
    isKeyPoint: true
  },
  {
    id: 'BACK_RIGHT_LOWER',
    name: 'Right lower back',
    namePL: 'Prawe dolne plecy',
    type: 'lung',
    position: 'back',
    x: 54, y: 34, width: 16, height: 14,
    availableExams: ['inspection', 'palpation', 'percussion', 'auscultation']
  },
  {
    id: 'BACK_LEFT_LOWER',
    name: 'Left lower back',
    namePL: 'Lewe dolne plecy',
    type: 'lung',
    position: 'back',
    x: 30, y: 34, width: 16, height: 14,
    availableExams: ['inspection', 'palpation', 'percussion', 'auscultation']
  },
  {
    id: 'SPINE',
    name: 'Spine',
    namePL: 'Kręgosłup',
    type: 'spine',
    position: 'back',
    x: 46, y: 18, width: 8, height: 34,
    availableExams: ['inspection', 'palpation', 'percussion']
  },
  
  // === BRZUCH ===
  {
    id: 'ABDOMEN_RUQ',
    name: 'Right upper quadrant',
    namePL: 'Prawy górny kwadrant',
    type: 'abdomen',
    position: 'front',
    x: 30, y: 46, width: 16, height: 12,
    availableExams: ['inspection', 'palpation', 'percussion', 'auscultation'],
    isKeyPoint: true
  },
  {
    id: 'ABDOMEN_LUQ',
    name: 'Left upper quadrant',
    namePL: 'Lewy górny kwadrant',
    type: 'abdomen',
    position: 'front',
    x: 54, y: 46, width: 16, height: 12,
    availableExams: ['inspection', 'palpation', 'percussion', 'auscultation']
  },
  {
    id: 'ABDOMEN_EPIGASTRIC',
    name: 'Epigastric region',
    namePL: 'Nadbrzusze',
    type: 'abdomen',
    position: 'front',
    x: 42, y: 46, width: 16, height: 10,
    availableExams: ['inspection', 'palpation', 'percussion', 'auscultation'],
    isKeyPoint: true
  },
  {
    id: 'ABDOMEN_UMBILICAL',
    name: 'Umbilical region',
    namePL: 'Okolica pępka',
    type: 'abdomen',
    position: 'front',
    x: 42, y: 56, width: 16, height: 10,
    availableExams: ['inspection', 'palpation', 'percussion', 'auscultation']
  },
  {
    id: 'ABDOMEN_RLQ',
    name: 'Right lower quadrant',
    namePL: 'Prawy dolny kwadrant',
    type: 'abdomen',
    position: 'front',
    x: 30, y: 58, width: 16, height: 12,
    availableExams: ['inspection', 'palpation', 'percussion', 'auscultation'],
    isKeyPoint: true
  },
  {
    id: 'ABDOMEN_LLQ',
    name: 'Left lower quadrant',
    namePL: 'Lewy dolny kwadrant',
    type: 'abdomen',
    position: 'front',
    x: 54, y: 58, width: 16, height: 12,
    availableExams: ['inspection', 'palpation', 'percussion', 'auscultation']
  },
  {
    id: 'ABDOMEN_SUPRAPUBIC',
    name: 'Suprapubic region',
    namePL: 'Okolica nadłonowa',
    type: 'abdomen',
    position: 'front',
    x: 42, y: 66, width: 16, height: 8,
    availableExams: ['inspection', 'palpation', 'percussion']
  },
  
  // === KOŃCZYNY ===
  {
    id: 'ARM_RIGHT',
    name: 'Right arm',
    namePL: 'Prawa ręka',
    type: 'extremity',
    position: 'front',
    x: 14, y: 22, width: 12, height: 36,
    availableExams: ['inspection', 'palpation']
  },
  {
    id: 'ARM_LEFT',
    name: 'Left arm',
    namePL: 'Lewa ręka',
    type: 'extremity',
    position: 'front',
    x: 74, y: 22, width: 12, height: 36,
    availableExams: ['inspection', 'palpation']
  },
  {
    id: 'LEG_RIGHT',
    name: 'Right leg',
    namePL: 'Prawa noga',
    type: 'extremity',
    position: 'front',
    x: 34, y: 74, width: 14, height: 24,
    availableExams: ['inspection', 'palpation']
  },
  {
    id: 'LEG_LEFT',
    name: 'Left leg',
    namePL: 'Lewa noga',
    type: 'extremity',
    position: 'front',
    x: 52, y: 74, width: 14, height: 24,
    availableExams: ['inspection', 'palpation']
  }
];

// ============ NORMALNE WYNIKI BADAŃ ============

export const normalExamResults: { [key: string]: { [examType: string]: PhysicalExamResult } } = {
  // Serce
  'HEART_AREA': {
    'auscultation': {
      id: 'norm-heart-ausc',
      description: 'Regular heart sounds, S1 and S2 present, no murmurs',
      descriptionPL: 'Tony serca czyste, miarowe. S1 i S2 prawidłowe, bez szmerów.',
      severity: 'normal',
      isAbnormal: false
    },
    'palpation': {
      id: 'norm-heart-palp',
      description: 'Apex beat palpable in 5th intercostal space, midclavicular line',
      descriptionPL: 'Uderzenie koniuszkowe wyczuwalne w 5. międzyżebrzu, w linii środkowo-obojczykowej.',
      severity: 'normal',
      isAbnormal: false
    },
    'inspection': {
      id: 'norm-heart-insp',
      description: 'No visible pulsations or chest deformities',
      descriptionPL: 'Bez widocznych pulsacji ani deformacji klatki piersiowej.',
      severity: 'normal',
      isAbnormal: false
    }
  },
  
  // Płuca przód
  'CHEST_RIGHT_UPPER': {
    'auscultation': {
      id: 'norm-lung-ru-ausc',
      description: 'Vesicular breath sounds, no adventitious sounds',
      descriptionPL: 'Szmer pęcherzykowy prawidłowy, bez szmerów dodatkowych.',
      severity: 'normal',
      isAbnormal: false
    },
    'percussion': {
      id: 'norm-lung-ru-perc',
      description: 'Resonant percussion note',
      descriptionPL: 'Odgłos opukowy jawny.',
      severity: 'normal',
      isAbnormal: false
    },
    'palpation': {
      id: 'norm-lung-ru-palp',
      description: 'Normal chest expansion, no tenderness',
      descriptionPL: 'Prawidłowa ruchomość klatki piersiowej, bez bolesności.',
      severity: 'normal',
      isAbnormal: false
    },
    'inspection': {
      id: 'norm-lung-ru-insp',
      description: 'Symmetrical chest movement, no retractions',
      descriptionPL: 'Symetryczne ruchy klatki piersiowej, bez wcięgań.',
      severity: 'normal',
      isAbnormal: false
    }
  },
  
  // Brzuch
  'ABDOMEN_EPIGASTRIC': {
    'auscultation': {
      id: 'norm-abd-epi-ausc',
      description: 'Normal bowel sounds present',
      descriptionPL: 'Prawidłowa perystaltyka jelit.',
      severity: 'normal',
      isAbnormal: false
    },
    'percussion': {
      id: 'norm-abd-epi-perc',
      description: 'Tympanic percussion note',
      descriptionPL: 'Odgłos bębenkowy.',
      severity: 'normal',
      isAbnormal: false
    },
    'palpation': {
      id: 'norm-abd-epi-palp',
      description: 'Soft, non-tender, no masses',
      descriptionPL: 'Brzuch miękki, niebolesny, bez oporów patologicznych.',
      severity: 'normal',
      isAbnormal: false
    },
    'inspection': {
      id: 'norm-abd-epi-insp',
      description: 'Abdomen flat, no distension or visible masses',
      descriptionPL: 'Brzuch płaski, bez wzdęcia, bez widocznych mas.',
      severity: 'normal',
      isAbnormal: false
    }
  },
  
  'ABDOMEN_RLQ': {
    'palpation': {
      id: 'norm-abd-rlq-palp',
      description: 'Soft, non-tender, McBurney\'s point negative',
      descriptionPL: 'Miękki, niebolesny, punkt McBurneya ujemny.',
      severity: 'normal',
      isAbnormal: false
    },
    'auscultation': {
      id: 'norm-abd-rlq-ausc',
      description: 'Normal bowel sounds',
      descriptionPL: 'Prawidłowa perystaltyka.',
      severity: 'normal',
      isAbnormal: false
    },
    'percussion': {
      id: 'norm-abd-rlq-perc',
      description: 'Tympanic note',
      descriptionPL: 'Odgłos bębenkowy.',
      severity: 'normal',
      isAbnormal: false
    },
    'inspection': {
      id: 'norm-abd-rlq-insp',
      description: 'No visible abnormalities',
      descriptionPL: 'Bez widocznych nieprawidłowości.',
      severity: 'normal',
      isAbnormal: false
    }
  },
  
  // Szyja
  'NECK_FRONT': {
    'palpation': {
      id: 'norm-neck-palp',
      description: 'Thyroid not enlarged, no lymphadenopathy, carotid pulses normal',
      descriptionPL: 'Tarczyca niepowiększona, węzły chłonne niewyczuwalne, tętno na tętnicach szyjnych zachowane.',
      severity: 'normal',
      isAbnormal: false
    },
    'inspection': {
      id: 'norm-neck-insp',
      description: 'No visible masses, JVP not elevated',
      descriptionPL: 'Bez widocznych mas, wypełnienie żył szyjnych prawidłowe.',
      severity: 'normal',
      isAbnormal: false
    }
  }
};

// ============ WYNIKI DLA SCENARIUSZA NADCIŚNIENIA ============

export const hypertensionScenarioResults: { [key: string]: { [examType: string]: PhysicalExamResult } } = {
  'HEART_AREA': {
    'auscultation': {
      id: 'htn-heart-ausc',
      description: 'S2 accentuated over aortic area (S2>S1), no murmurs',
      descriptionPL: 'Akcent II tonu nad zastawką aortalną (S2>S1), bez szmerów.',
      severity: 'mild',
      isAbnormal: true,
      clinicalSignificance: 'Może świadczyć o nadciśnieniu tętniczym'
    },
    'palpation': {
      id: 'htn-heart-palp',
      description: 'Apex beat slightly displaced laterally, forceful',
      descriptionPL: 'Uderzenie koniuszkowe nieznacznie przesunięte bocznie, wzmożone.',
      severity: 'mild',
      isAbnormal: true,
      clinicalSignificance: 'Może wskazywać na przerost lewej komory'
    }
  },
  'CHEST_RIGHT_UPPER': {
    'auscultation': normalExamResults['CHEST_RIGHT_UPPER']['auscultation']
  }
};

// ============ WYNIKI DLA SCENARIUSZA ZAPALENIA PŁUC ============

export const pneumoniaScenarioResults: { [key: string]: { [examType: string]: PhysicalExamResult } } = {
  'CHEST_RIGHT_LOWER': {
    'auscultation': {
      id: 'pneu-lung-ausc',
      description: 'Decreased breath sounds with fine crackles/rales',
      descriptionPL: 'Ściszony szmer pęcherzykowy z drobnobańkowymi rzężeniami.',
      severity: 'moderate',
      isAbnormal: true,
      clinicalSignificance: 'Typowe dla zapalenia płuc'
    },
    'percussion': {
      id: 'pneu-lung-perc',
      description: 'Dull percussion note over affected area',
      descriptionPL: 'Stłumiony odgłos opukowy nad zmianą.',
      severity: 'moderate',
      isAbnormal: true,
      clinicalSignificance: 'Wskazuje na zagęszczenie lub wysięk'
    },
    'palpation': {
      id: 'pneu-lung-palp',
      description: 'Increased tactile fremitus',
      descriptionPL: 'Wzmożone drżenie głosowe.',
      severity: 'mild',
      isAbnormal: true,
      clinicalSignificance: 'Typowe dla zagęszczenia płucnego'
    }
  }
};

// Helper do pobierania wyników
export const getExamResult = (
  regionId: string, 
  examType: string, 
  scenarioId?: string
): PhysicalExamResult => {
  // Sprawdź scenariusz specyficzny
  if (scenarioId === 'scenario-hypertension-1' && hypertensionScenarioResults[regionId]?.[examType]) {
    return hypertensionScenarioResults[regionId][examType];
  }
  
  if (scenarioId === 'scenario-pneumonia-1' && pneumoniaScenarioResults[regionId]?.[examType]) {
    return pneumoniaScenarioResults[regionId][examType];
  }
  
  // Zwróć normalny wynik jeśli dostępny
  if (normalExamResults[regionId]?.[examType]) {
    return normalExamResults[regionId][examType];
  }
  
  // Domyślny wynik
  return {
    id: `default-${regionId}-${examType}`,
    description: 'Examination performed, no abnormalities detected',
    descriptionPL: 'Badanie wykonane, bez odchyleń od normy.',
    severity: 'normal',
    isAbnormal: false
  };
};

// Lista kluczowych punktów do zbadania
export const getKeyPointsForScenario = (scenarioId: string): string[] => {
  const baseKeyPoints = [
    'HEART_AREA',
    'CHEST_RIGHT_UPPER',
    'CHEST_LEFT_UPPER',
    'ABDOMEN_EPIGASTRIC'
  ];
  
  if (scenarioId === 'scenario-hypertension-1') {
    return [...baseKeyPoints, 'NECK_FRONT'];
  }
  
  if (scenarioId === 'scenario-pneumonia-1') {
    return [...baseKeyPoints, 'CHEST_RIGHT_LOWER', 'CHEST_LEFT_LOWER', 'BACK_RIGHT_LOWER'];
  }
  
  return baseKeyPoints;
};

