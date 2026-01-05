/**
 * Przykładowe dane pacjentów dla modułu "Mój pacjent"
 */

import { 
  Patient, 
  DiseaseScenario, 
  Symptom, 
  VitalSigns,
  LabTest,
  InterviewQuestion,
  ExaminationOption,
  Medication
} from '../types';

// ============ PRZYKŁADOWE SCENARIUSZE CHORÓB ============

export const diseaseScenarios: DiseaseScenario[] = [
  {
    id: 'scenario-hypertension-1',
    name: 'Nadciśnienie tętnicze - nowo rozpoznane',
    icdCode: 'I10',
    description: 'Pacjent z nowo rozpoznanym nadciśnieniem tętniczym, bez powikłań narządowych.',
    difficulty: 1,
    category: 'Kardiologia',
    targetProfessions: ['doctor', 'nurse', 'student'],
    phases: [
      {
        id: 'phase-1-initial',
        name: 'Rozpoznanie',
        order: 1,
        duration: { min: 1, max: 3 },
        symptoms: [
          {
            id: 'sym-1',
            name: 'Bóle głowy',
            bodySystem: 'neurologiczny',
            severity: 'mild',
            duration: '2 tygodnie',
            character: 'tępy, rozpierający',
            location: 'potylica',
            timing: 'głównie rano',
            isNew: true,
            reportedAt: new Date()
          },
          {
            id: 'sym-2',
            name: 'Zawroty głowy',
            bodySystem: 'neurologiczny',
            severity: 'mild',
            duration: '1 tydzień',
            character: 'lekkie',
            timing: 'przy zmianie pozycji',
            isNew: true,
            reportedAt: new Date()
          }
        ],
        vitalSignsChanges: {
          bloodPressureSystolic: 158,
          bloodPressureDiastolic: 98
        },
        labResultsChanges: [],
        progressionConditions: [
          {
            type: 'treatment',
            description: 'Wdrożono leczenie hipotensyjne',
            nextPhaseId: 'phase-2-treatment',
            probability: 0.9
          },
          {
            type: 'no_treatment',
            description: 'Brak interwencji przez 7 dni',
            nextPhaseId: 'phase-3-worsening',
            probability: 0.7
          }
        ],
        complications: []
      },
      {
        id: 'phase-2-treatment',
        name: 'Leczenie',
        order: 2,
        duration: { min: 7, max: 14 },
        symptoms: [
          {
            id: 'sym-3',
            name: 'Bóle głowy ustępują',
            bodySystem: 'neurologiczny',
            severity: 'mild',
            duration: 'sporadycznie',
            character: 'łagodniejszy',
            isNew: false,
            reportedAt: new Date()
          }
        ],
        vitalSignsChanges: {
          bloodPressureSystolic: 138,
          bloodPressureDiastolic: 88
        },
        labResultsChanges: [],
        progressionConditions: [
          {
            type: 'treatment',
            description: 'Kontynuacja leczenia i kontrola',
            nextPhaseId: 'phase-4-stable',
            probability: 0.85
          }
        ],
        complications: []
      },
      {
        id: 'phase-3-worsening',
        name: 'Pogorszenie',
        order: 3,
        duration: { min: 3, max: 7 },
        symptoms: [
          {
            id: 'sym-4',
            name: 'Nasilone bóle głowy',
            bodySystem: 'neurologiczny',
            severity: 'moderate',
            duration: 'codziennie',
            character: 'pulsujący',
            isNew: false,
            reportedAt: new Date()
          },
          {
            id: 'sym-5',
            name: 'Zaburzenia widzenia',
            bodySystem: 'okulistyczny',
            severity: 'moderate',
            duration: '2 dni',
            character: 'mroczki przed oczami',
            isNew: true,
            reportedAt: new Date()
          }
        ],
        vitalSignsChanges: {
          bloodPressureSystolic: 175,
          bloodPressureDiastolic: 108
        },
        labResultsChanges: [],
        progressionConditions: [],
        complications: [
          {
            id: 'comp-1',
            name: 'Przełom nadciśnieniowy',
            description: 'Gwałtowny wzrost ciśnienia tętniczego z objawami narządowymi',
            triggerConditions: ['brak leczenia przez > 10 dni', 'RR > 180/110'],
            probability: 0.3,
            severity: 'severe',
            symptoms: []
          }
        ]
      },
      {
        id: 'phase-4-stable',
        name: 'Stabilizacja',
        order: 4,
        duration: { min: 14, max: 30 },
        symptoms: [],
        vitalSignsChanges: {
          bloodPressureSystolic: 128,
          bloodPressureDiastolic: 82
        },
        labResultsChanges: [],
        progressionConditions: [],
        complications: []
      }
    ],
    expectedDiagnosis: 'Nadciśnienie tętnicze pierwotne (I10)',
    expectedTreatment: [
      'Modyfikacja stylu życia',
      'Dieta DASH',
      'Ograniczenie soli',
      'Aktywność fizyczna',
      'Farmakoterapia I rzutu (ACE-I lub sartan lub antagonista wapnia)'
    ],
    commonMistakes: [
      'Pomiar ciśnienia tylko jednorazowy',
      'Brak oceny powikłań narządowych',
      'Pominięcie badań laboratoryjnych (kreatynina, potas)',
      'Zbyt agresywne obniżanie ciśnienia na początku'
    ],
    educationalPoints: [
      'Diagnostyka nadciśnienia wymaga co najmniej 2-3 pomiarów w różnych dniach',
      'Zawsze należy wykluczyć nadciśnienie wtórne u młodych pacjentów',
      'Cele terapeutyczne: < 140/90 mmHg (< 130/80 u pacjentów wysokiego ryzyka)',
      'Modyfikacja stylu życia jest podstawą leczenia'
    ],
    estimatedDuration: 30,
    tags: ['kardiologia', 'nadciśnienie', 'podstawowy', 'prewencja']
  },
  {
    id: 'scenario-dm2-1',
    name: 'Cukrzyca typu 2 - świeżo rozpoznana',
    icdCode: 'E11',
    description: 'Pacjent z nowo rozpoznaną cukrzycą typu 2, otyłość, zaburzenia lipidowe.',
    difficulty: 2,
    category: 'Diabetologia',
    targetProfessions: ['doctor', 'nurse', 'student'],
    phases: [
      {
        id: 'phase-1-diagnosis',
        name: 'Rozpoznanie',
        order: 1,
        duration: { min: 1, max: 7 },
        symptoms: [
          {
            id: 'sym-dm-1',
            name: 'Wzmożone pragnienie',
            bodySystem: 'metaboliczny',
            severity: 'moderate',
            duration: '3 tygodnie',
            character: 'ciągłe',
            isNew: true,
            reportedAt: new Date()
          },
          {
            id: 'sym-dm-2',
            name: 'Częste oddawanie moczu',
            bodySystem: 'urologiczny',
            severity: 'moderate',
            duration: '3 tygodnie',
            character: 'wielokrotnie w ciągu dnia i nocy',
            frequency: '8-10 razy dziennie',
            isNew: true,
            reportedAt: new Date()
          },
          {
            id: 'sym-dm-3',
            name: 'Zmęczenie',
            bodySystem: 'ogólny',
            severity: 'mild',
            duration: '2 miesiące',
            character: 'przewlekłe',
            isNew: false,
            reportedAt: new Date()
          }
        ],
        vitalSignsChanges: {
          bloodPressureSystolic: 145,
          bloodPressureDiastolic: 92,
          bloodGlucose: 245
        },
        labResultsChanges: [
          { testId: 'hba1c', abnormalValue: '8.2%' },
          { testId: 'glucose-fasting', abnormalValue: '156 mg/dL' }
        ],
        progressionConditions: [],
        complications: []
      }
    ],
    expectedDiagnosis: 'Cukrzyca typu 2 (E11)',
    expectedTreatment: [
      'Edukacja diabetologiczna',
      'Dieta cukrzycowa',
      'Metformina jako lek pierwszego rzutu',
      'Samokontrola glikemii',
      'Badanie dna oka',
      'Ocena stóp'
    ],
    commonMistakes: [
      'Brak oceny HbA1c',
      'Pominięcie badania dna oka',
      'Brak edukacji pacjenta',
      'Zbyt późne włączenie farmakoterapii'
    ],
    educationalPoints: [
      'Rozpoznanie: glikemia na czczo ≥ 126 mg/dL lub HbA1c ≥ 6.5%',
      'Cel leczenia: HbA1c < 7% (indywidualizacja)',
      'Metformina jest lekiem pierwszego wyboru',
      'Regularna kontrola powikłań mikronaczyniowych'
    ],
    estimatedDuration: 60,
    tags: ['diabetologia', 'cukrzyca', 'metaboliczny', 'przewlekły']
  }
];

// ============ PRZYKŁADOWI PACJENCI ============

export const samplePatients: Patient[] = [
  {
    id: 'patient-001',
    name: 'Jan Kowalski',
    initials: 'JK',
    demographics: {
      age: 55,
      gender: 'male',
      height: 178,
      weight: 92,
      bmi: 29.0,
      occupation: 'Kierowca zawodowy',
      lifestyle: {
        smoking: 'former',
        smokingPackYears: 15,
        alcohol: 'moderate',
        physicalActivity: 'sedentary',
        diet: 'poor',
        stress: 'high',
        sleepQuality: 'poor'
      },
      familyHistory: [
        'Ojciec - zawał serca w wieku 60 lat',
        'Matka - nadciśnienie tętnicze',
        'Brat - cukrzyca typu 2'
      ],
      allergies: ['Penicylina'],
      bloodType: 'A Rh+'
    },
    chronicConditions: [],
    currentMedications: [],
    riskFactors: [
      {
        id: 'rf-1',
        name: 'Otyłość',
        category: 'metaboliczny',
        severity: 'medium',
        description: 'BMI 29.0 - nadwaga'
      },
      {
        id: 'rf-2',
        name: 'Wywiad rodzinny',
        category: 'genetyczny',
        severity: 'medium',
        description: 'Obciążenie rodzinne chorobami sercowo-naczyniowymi'
      },
      {
        id: 'rf-3',
        name: 'Siedzący tryb życia',
        category: 'behawioralny',
        severity: 'medium',
        description: 'Praca siedząca, brak regularnej aktywności fizycznej'
      }
    ],
    status: 'urgent',
    currentScenario: diseaseScenarios[0],
    currentPhase: 'phase-1-initial',
    currentSymptoms: diseaseScenarios[0].phases[0].symptoms,
    currentVitalSigns: {
      id: 'vs-001',
      timestamp: new Date(),
      bloodPressureSystolic: 158,
      bloodPressureDiastolic: 98,
      heartRate: 82,
      respiratoryRate: 16,
      temperature: 36.6,
      oxygenSaturation: 97,
      painLevel: 3
    },
    encounters: [],
    timeline: [
      {
        id: 'tl-001',
        patientId: 'patient-001',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        type: 'symptom',
        title: 'Nowe objawy',
        description: 'Pacjent zgłasza bóle głowy i zawroty głowy od 2 tygodni',
        severity: 'warning'
      }
    ],
    alerts: [
      {
        id: 'alert-001',
        patientId: 'patient-001',
        type: 'warning',
        title: 'Podwyższone ciśnienie',
        message: 'Ostatni pomiar: 158/98 mmHg - wymaga oceny i ewentualnego leczenia',
        createdAt: new Date(),
        isRead: false,
        actionRequired: true
      }
    ],
    labResults: [],
    assignedTo: 'current-user',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    lastInteraction: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    difficultyLevel: 1,
    isCompleted: false
  },
  {
    id: 'patient-002',
    name: 'Maria Nowak',
    initials: 'MN',
    demographics: {
      age: 62,
      gender: 'female',
      height: 165,
      weight: 78,
      bmi: 28.7,
      occupation: 'Emerytka (była księgowa)',
      lifestyle: {
        smoking: 'never',
        alcohol: 'occasional',
        physicalActivity: 'light',
        diet: 'average',
        stress: 'moderate',
        sleepQuality: 'average'
      },
      familyHistory: [
        'Matka - cukrzyca typu 2',
        'Ojciec - udar mózgu w wieku 70 lat'
      ],
      allergies: [],
      bloodType: 'O Rh+'
    },
    chronicConditions: ['Nadciśnienie tętnicze (kontrolowane)'],
    currentMedications: [
      {
        id: 'med-001',
        name: 'Amlodypina',
        dose: '5 mg',
        frequency: '1x dziennie',
        route: 'oral',
        duration: 'przewlekle'
      }
    ],
    riskFactors: [
      {
        id: 'rf-4',
        name: 'Nadwaga',
        category: 'metaboliczny',
        severity: 'medium',
        description: 'BMI 28.7'
      }
    ],
    status: 'stable',
    currentScenario: diseaseScenarios[1],
    currentPhase: 'phase-1-diagnosis',
    currentSymptoms: diseaseScenarios[1].phases[0].symptoms,
    currentVitalSigns: {
      id: 'vs-002',
      timestamp: new Date(),
      bloodPressureSystolic: 145,
      bloodPressureDiastolic: 92,
      heartRate: 76,
      respiratoryRate: 14,
      temperature: 36.4,
      oxygenSaturation: 98,
      bloodGlucose: 245
    },
    encounters: [],
    timeline: [
      {
        id: 'tl-002',
        patientId: 'patient-002',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        type: 'symptom',
        title: 'Objawy polidypsji',
        description: 'Pacjentka zgłasza wzmożone pragnienie i częste oddawanie moczu od 3 tygodni',
        severity: 'info'
      }
    ],
    alerts: [
      {
        id: 'alert-002',
        patientId: 'patient-002',
        type: 'info',
        title: 'Podejrzenie cukrzycy',
        message: 'Objawy sugerują hiperglikemię - zalecana diagnostyka',
        createdAt: new Date(),
        isRead: false,
        actionRequired: true
      }
    ],
    labResults: [],
    assignedTo: 'current-user',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    lastInteraction: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    difficultyLevel: 2,
    isCompleted: false
  },
  {
    id: 'patient-003',
    name: 'Tomasz Wiśniewski',
    initials: 'TW',
    demographics: {
      age: 45,
      gender: 'male',
      height: 182,
      weight: 85,
      bmi: 25.7,
      occupation: 'Programista',
      lifestyle: {
        smoking: 'never',
        alcohol: 'occasional',
        physicalActivity: 'moderate',
        diet: 'healthy',
        stress: 'moderate',
        sleepQuality: 'good'
      },
      familyHistory: [],
      allergies: ['Sulfonamidy'],
      bloodType: 'B Rh+'
    },
    chronicConditions: [],
    currentMedications: [],
    riskFactors: [],
    status: 'improving',
    currentScenario: diseaseScenarios[0],
    currentPhase: 'phase-2-treatment',
    currentSymptoms: [],
    currentVitalSigns: {
      id: 'vs-003',
      timestamp: new Date(),
      bloodPressureSystolic: 132,
      bloodPressureDiastolic: 84,
      heartRate: 70,
      respiratoryRate: 14,
      temperature: 36.5,
      oxygenSaturation: 99
    },
    encounters: [
      {
        id: 'enc-001',
        patientId: 'patient-003',
        type: 'initial',
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        duration: 30,
        chiefComplaints: [],
        vitalSigns: {
          id: 'vs-old',
          timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          bloodPressureSystolic: 155,
          bloodPressureDiastolic: 95,
          heartRate: 78,
          respiratoryRate: 15,
          temperature: 36.6,
          oxygenSaturation: 98
        },
        examinations: [],
        labOrders: [],
        diagnoses: [
          {
            id: 'diag-001',
            icdCode: 'I10',
            name: 'Nadciśnienie tętnicze pierwotne',
            isPrimary: true,
            confidence: 'confirmed',
            diagnosedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
            diagnosedBy: 'current-user'
          }
        ],
        notes: 'Pacjent przyjęty z powodu bólów głowy. Stwierdzono nadciśnienie tętnicze.',
        performedBy: 'current-user'
      }
    ],
    timeline: [],
    alerts: [],
    labResults: [],
    activeTreatmentPlan: {
      id: 'tp-001',
      patientId: 'patient-003',
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      medications: [
        {
          id: 'med-002',
          name: 'Perindopril',
          dose: '5 mg',
          frequency: '1x dziennie rano',
          route: 'oral',
          duration: 'przewlekle',
          instructions: 'Przyjmować rano, przed posiłkiem'
        }
      ],
      nonPharmacological: [
        {
          id: 'npt-001',
          category: 'diet',
          description: 'Dieta DASH',
          instructions: ['Ograniczenie soli do < 5g/dzień', 'Zwiększenie spożycia warzyw i owoców', 'Ograniczenie tłuszczów nasyconych']
        },
        {
          id: 'npt-002',
          category: 'exercise',
          description: 'Aktywność fizyczna',
          frequency: '3-4 razy w tygodniu',
          duration: '30-45 minut',
          instructions: ['Spacery', 'Jazda na rowerze', 'Pływanie']
        }
      ],
      followUp: {
        nextVisitDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        visitType: 'routine',
        parametersToMonitor: ['Ciśnienie tętnicze', 'Tętno'],
        testsToRepeat: ['Kreatynina', 'Potas'],
        warningSignsToWatch: ['Ból głowy', 'Zawroty głowy', 'Zaburzenia widzenia', 'Ból w klatce piersiowej']
      },
      goals: [
        {
          id: 'goal-001',
          description: 'Normalizacja ciśnienia tętniczego',
          targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          status: 'in_progress',
          metric: 'Ciśnienie tętnicze',
          targetValue: '< 140/90 mmHg'
        }
      ],
      educationPoints: [
        'Regularne pomiary ciśnienia w domu',
        'Prowadzenie dzienniczka ciśnień',
        'Unikanie stresu',
        'Regularny sen'
      ],
      createdBy: 'current-user'
    },
    assignedTo: 'current-user',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    lastInteraction: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    nextScheduledVisit: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    difficultyLevel: 1,
    isCompleted: false
  }
];

// ============ DOSTĘPNE BADANIA LABORATORYJNE ============

export const availableLabTests: LabTest[] = [
  // Badania krwi
  {
    id: 'cbc',
    name: 'Morfologia krwi (CBC)',
    category: 'blood',
    description: 'Pełna morfologia krwi z rozmazem',
    normalRange: 'Różne dla poszczególnych parametrów',
    unit: '',
    cost: 10,
    timeHours: 2,
    availableFor: ['doctor', 'nurse', 'student']
  },
  {
    id: 'crp',
    name: 'CRP (białko C-reaktywne)',
    category: 'blood',
    description: 'Marker stanu zapalnego',
    normalRange: '< 5',
    unit: 'mg/L',
    cost: 8,
    timeHours: 2,
    availableFor: ['doctor', 'nurse', 'student']
  },
  {
    id: 'glucose-fasting',
    name: 'Glukoza na czczo',
    category: 'blood',
    description: 'Stężenie glukozy we krwi na czczo',
    normalRange: '70-99',
    unit: 'mg/dL',
    cost: 5,
    timeHours: 1,
    availableFor: ['doctor', 'nurse', 'student']
  },
  {
    id: 'hba1c',
    name: 'Hemoglobina glikowana (HbA1c)',
    category: 'blood',
    description: 'Średnia glikemia z ostatnich 2-3 miesięcy',
    normalRange: '< 5.7%',
    unit: '%',
    cost: 20,
    timeHours: 24,
    availableFor: ['doctor', 'nurse', 'student']
  },
  {
    id: 'creatinine',
    name: 'Kreatynina',
    category: 'blood',
    description: 'Marker funkcji nerek',
    normalRange: '0.7-1.3 (M), 0.6-1.1 (K)',
    unit: 'mg/dL',
    cost: 6,
    timeHours: 2,
    availableFor: ['doctor', 'nurse', 'student']
  },
  {
    id: 'potassium',
    name: 'Potas (K+)',
    category: 'blood',
    description: 'Stężenie potasu w surowicy',
    normalRange: '3.5-5.0',
    unit: 'mEq/L',
    cost: 5,
    timeHours: 2,
    availableFor: ['doctor', 'nurse', 'student']
  },
  {
    id: 'sodium',
    name: 'Sód (Na+)',
    category: 'blood',
    description: 'Stężenie sodu w surowicy',
    normalRange: '136-145',
    unit: 'mEq/L',
    cost: 5,
    timeHours: 2,
    availableFor: ['doctor', 'nurse', 'student']
  },
  {
    id: 'lipid-panel',
    name: 'Profil lipidowy',
    category: 'blood',
    description: 'Cholesterol całkowity, LDL, HDL, trójglicerydy',
    normalRange: 'TC < 200, LDL < 100, HDL > 40/50, TG < 150',
    unit: 'mg/dL',
    cost: 25,
    timeHours: 4,
    availableFor: ['doctor', 'nurse', 'student']
  },
  {
    id: 'tsh',
    name: 'TSH',
    category: 'blood',
    description: 'Hormon tyreotropowy - ocena funkcji tarczycy',
    normalRange: '0.4-4.0',
    unit: 'mIU/L',
    cost: 15,
    timeHours: 24,
    availableFor: ['doctor', 'nurse', 'student']
  },
  // Badania moczu
  {
    id: 'urinalysis',
    name: 'Badanie ogólne moczu',
    category: 'urine',
    description: 'Analiza fizykochemiczna i mikroskopowa moczu',
    normalRange: 'Różne parametry',
    unit: '',
    cost: 8,
    timeHours: 2,
    availableFor: ['doctor', 'nurse', 'student']
  },
  {
    id: 'urine-albumin',
    name: 'Albumina w moczu',
    category: 'urine',
    description: 'Wykrywanie mikroalbuminurii',
    normalRange: '< 30',
    unit: 'mg/g kreatyniny',
    cost: 12,
    timeHours: 4,
    availableFor: ['doctor', 'nurse', 'student']
  },
  // Badania obrazowe
  {
    id: 'chest-xray',
    name: 'RTG klatki piersiowej',
    category: 'imaging',
    description: 'Zdjęcie rentgenowskie klatki piersiowej PA i boczne',
    normalRange: 'N/A',
    unit: '',
    cost: 30,
    timeHours: 1,
    availableFor: ['doctor', 'student']
  },
  {
    id: 'echo',
    name: 'Echokardiografia',
    category: 'imaging',
    description: 'USG serca z oceną frakcji wyrzutowej',
    normalRange: 'EF > 55%',
    unit: '',
    cost: 80,
    timeHours: 48,
    availableFor: ['doctor', 'student']
  },
  {
    id: 'abdominal-usg',
    name: 'USG jamy brzusznej',
    category: 'imaging',
    description: 'Ultrasonografia jamy brzusznej',
    normalRange: 'N/A',
    unit: '',
    cost: 50,
    timeHours: 24,
    availableFor: ['doctor', 'student']
  },
  // Badania czynnościowe
  {
    id: 'ecg',
    name: 'EKG spoczynkowe',
    category: 'functional',
    description: 'Elektrokardiogram 12-odprowadzeniowy',
    normalRange: 'Rytm zatokowy miarowy',
    unit: '',
    cost: 15,
    timeHours: 0.5,
    availableFor: ['doctor', 'nurse', 'paramedic', 'student']
  },
  {
    id: 'spirometry',
    name: 'Spirometria',
    category: 'functional',
    description: 'Badanie czynnościowe płuc',
    normalRange: 'FEV1/FVC > 70%',
    unit: '',
    cost: 25,
    timeHours: 1,
    availableFor: ['doctor', 'student']
  }
];

// ============ OPCJE BADANIA PRZEDMIOTOWEGO ============

export const examinationOptions: ExaminationOption[] = [
  // Ogólne
  {
    id: 'general-appearance',
    name: 'Ocena ogólna',
    bodyRegion: 'ogólne',
    examType: 'inspection',
    description: 'Ocena stanu ogólnego, świadomości, postawy',
    cost: 1,
    timeMinutes: 2,
    availableFor: ['doctor', 'nurse', 'paramedic', 'student']
  },
  {
    id: 'skin-inspection',
    name: 'Ocena skóry',
    bodyRegion: 'skóra',
    examType: 'inspection',
    description: 'Kolor, wilgotność, turgur, zmiany skórne',
    cost: 2,
    timeMinutes: 3,
    availableFor: ['doctor', 'nurse', 'student']
  },
  // Głowa i szyja
  {
    id: 'head-inspection',
    name: 'Badanie głowy',
    bodyRegion: 'głowa',
    examType: 'inspection',
    description: 'Symetria, zmiany skórne, owłosienie',
    cost: 2,
    timeMinutes: 2,
    availableFor: ['doctor', 'nurse', 'student']
  },
  {
    id: 'neck-palpation',
    name: 'Badanie szyi - palpacja',
    bodyRegion: 'szyja',
    examType: 'palpation',
    description: 'Tarczyca, węzły chłonne, tętno na tętnicach szyjnych',
    cost: 3,
    timeMinutes: 3,
    availableFor: ['doctor', 'nurse', 'student']
  },
  // Klatka piersiowa
  {
    id: 'chest-inspection',
    name: 'Oglądanie klatki piersiowej',
    bodyRegion: 'klatka piersiowa',
    examType: 'inspection',
    description: 'Kształt, symetria, tor oddechowy',
    cost: 2,
    timeMinutes: 2,
    availableFor: ['doctor', 'nurse', 'paramedic', 'student']
  },
  {
    id: 'lung-percussion',
    name: 'Opukiwanie płuc',
    bodyRegion: 'płuca',
    examType: 'percussion',
    description: 'Odgłos opukowy nad polami płucnymi',
    cost: 3,
    timeMinutes: 3,
    availableFor: ['doctor', 'student']
  },
  {
    id: 'lung-auscultation',
    name: 'Osłuchiwanie płuc',
    bodyRegion: 'płuca',
    examType: 'auscultation',
    description: 'Szmer pęcherzykowy, szmery dodatkowe',
    cost: 4,
    timeMinutes: 4,
    availableFor: ['doctor', 'nurse', 'paramedic', 'student']
  },
  {
    id: 'heart-auscultation',
    name: 'Osłuchiwanie serca',
    bodyRegion: 'serce',
    examType: 'auscultation',
    description: 'Tony serca, szmery, zaburzenia rytmu',
    cost: 4,
    timeMinutes: 4,
    availableFor: ['doctor', 'nurse', 'paramedic', 'student']
  },
  // Brzuch
  {
    id: 'abdomen-inspection',
    name: 'Oglądanie brzucha',
    bodyRegion: 'brzuch',
    examType: 'inspection',
    description: 'Kształt, symetria, ruchy oddechowe, blizny',
    cost: 2,
    timeMinutes: 2,
    availableFor: ['doctor', 'nurse', 'student']
  },
  {
    id: 'abdomen-auscultation',
    name: 'Osłuchiwanie brzucha',
    bodyRegion: 'brzuch',
    examType: 'auscultation',
    description: 'Perystaltyka jelit',
    cost: 2,
    timeMinutes: 2,
    availableFor: ['doctor', 'nurse', 'student']
  },
  {
    id: 'abdomen-palpation',
    name: 'Badanie palpacyjne brzucha',
    bodyRegion: 'brzuch',
    examType: 'palpation',
    description: 'Bolesność, opór mięśniowy, powiększenie narządów',
    cost: 4,
    timeMinutes: 5,
    availableFor: ['doctor', 'student']
  },
  // Kończyny
  {
    id: 'extremities-inspection',
    name: 'Ocena kończyn',
    bodyRegion: 'kończyny',
    examType: 'inspection',
    description: 'Obrzęki, żylaki, zmiany troficzne',
    cost: 3,
    timeMinutes: 3,
    availableFor: ['doctor', 'nurse', 'student']
  },
  {
    id: 'peripheral-pulses',
    name: 'Tętno obwodowe',
    bodyRegion: 'kończyny',
    examType: 'palpation',
    description: 'Ocena tętna na tętnicach obwodowych',
    cost: 3,
    timeMinutes: 3,
    availableFor: ['doctor', 'nurse', 'paramedic', 'student']
  },
  // Neurologiczne
  {
    id: 'neuro-basic',
    name: 'Badanie neurologiczne podstawowe',
    bodyRegion: 'układ nerwowy',
    examType: 'inspection',
    description: 'Orientacja, mowa, nerwy czaszkowe podstawowe',
    cost: 5,
    timeMinutes: 5,
    availableFor: ['doctor', 'student']
  }
];

// ============ PYTANIA WYWIADU ============

export const interviewQuestions: InterviewQuestion[] = [
  // Pytania ogólne
  {
    id: 'q-chief-complaint',
    category: 'główny',
    question: 'Co Pana/Panią do mnie sprowadza?',
    questionType: 'open',
    cost: 1,
    relatedSymptoms: []
  },
  {
    id: 'q-symptom-onset',
    category: 'objawy',
    question: 'Kiedy zaczęły się dolegliwości?',
    questionType: 'open',
    cost: 1,
    relatedSymptoms: []
  },
  {
    id: 'q-symptom-character',
    category: 'objawy',
    question: 'Jak Pan/Pani opisałby charakter dolegliwości?',
    questionType: 'open',
    cost: 1,
    relatedSymptoms: []
  },
  {
    id: 'q-symptom-severity',
    category: 'objawy',
    question: 'W skali od 1 do 10, jak silne są dolegliwości?',
    questionType: 'scale',
    options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    cost: 1,
    relatedSymptoms: []
  },
  {
    id: 'q-aggravating',
    category: 'objawy',
    question: 'Co nasila dolegliwości?',
    questionType: 'open',
    cost: 1,
    relatedSymptoms: []
  },
  {
    id: 'q-relieving',
    category: 'objawy',
    question: 'Co łagodzi dolegliwości?',
    questionType: 'open',
    cost: 1,
    relatedSymptoms: []
  },
  // Wywiad przeszły
  {
    id: 'q-past-medical',
    category: 'przeszłość',
    question: 'Czy choruje Pan/Pani na jakieś choroby przewlekłe?',
    questionType: 'open',
    cost: 2,
    relatedSymptoms: []
  },
  {
    id: 'q-medications',
    category: 'przeszłość',
    question: 'Jakie leki Pan/Pani przyjmuje na stałe?',
    questionType: 'open',
    cost: 2,
    relatedSymptoms: []
  },
  {
    id: 'q-allergies',
    category: 'przeszłość',
    question: 'Czy jest Pan/Pani uczulony/a na jakieś leki lub substancje?',
    questionType: 'open',
    cost: 1,
    relatedSymptoms: []
  },
  {
    id: 'q-surgeries',
    category: 'przeszłość',
    question: 'Czy przebył/a Pan/Pani jakieś operacje?',
    questionType: 'open',
    cost: 1,
    relatedSymptoms: []
  },
  // Wywiad rodzinny
  {
    id: 'q-family-history',
    category: 'rodzina',
    question: 'Czy w rodzinie występują choroby serca, cukrzyca, nowotwory?',
    questionType: 'open',
    cost: 2,
    relatedSymptoms: []
  },
  // Wywiad społeczny
  {
    id: 'q-smoking',
    category: 'społeczny',
    question: 'Czy pali Pan/Pani papierosy?',
    questionType: 'multiple_choice',
    options: ['Nie, nigdy', 'Paliłem/am w przeszłości', 'Tak, palę obecnie'],
    cost: 1,
    relatedSymptoms: []
  },
  {
    id: 'q-alcohol',
    category: 'społeczny',
    question: 'Czy pije Pan/Pani alkohol?',
    questionType: 'multiple_choice',
    options: ['Nie', 'Okazjonalnie', 'Regularnie'],
    cost: 1,
    relatedSymptoms: []
  },
  {
    id: 'q-physical-activity',
    category: 'społeczny',
    question: 'Jak często uprawia Pan/Pani aktywność fizyczną?',
    questionType: 'multiple_choice',
    options: ['Prawie wcale', 'Rzadko', 'Regularnie'],
    cost: 1,
    relatedSymptoms: []
  },
  // Pytania specyficzne - kardiologia
  {
    id: 'q-chest-pain',
    category: 'serce',
    question: 'Czy odczuwa Pan/Pani ból w klatce piersiowej?',
    questionType: 'yes_no',
    cost: 1,
    relatedSymptoms: ['ból w klatce piersiowej'],
    followUpQuestions: ['q-chest-pain-character', 'q-chest-pain-radiation']
  },
  {
    id: 'q-chest-pain-character',
    category: 'serce',
    question: 'Jaki jest charakter bólu w klatce piersiowej?',
    questionType: 'multiple_choice',
    options: ['Uciskający', 'Kłujący', 'Piekący', 'Rozpierający'],
    cost: 1,
    relatedSymptoms: ['ból w klatce piersiowej']
  },
  {
    id: 'q-dyspnea',
    category: 'serce',
    question: 'Czy odczuwa Pan/Pani duszność?',
    questionType: 'yes_no',
    cost: 1,
    relatedSymptoms: ['duszność'],
    followUpQuestions: ['q-dyspnea-timing']
  },
  {
    id: 'q-dyspnea-timing',
    category: 'serce',
    question: 'Kiedy pojawia się duszność?',
    questionType: 'multiple_choice',
    options: ['Podczas wysiłku', 'W spoczynku', 'W nocy', 'W pozycji leżącej'],
    cost: 1,
    relatedSymptoms: ['duszność']
  },
  {
    id: 'q-palpitations',
    category: 'serce',
    question: 'Czy odczuwa Pan/Pani kołatanie serca?',
    questionType: 'yes_no',
    cost: 1,
    relatedSymptoms: ['kołatanie serca']
  },
  {
    id: 'q-edema',
    category: 'serce',
    question: 'Czy ma Pan/Pani obrzęki kończyn dolnych?',
    questionType: 'yes_no',
    cost: 1,
    relatedSymptoms: ['obrzęki']
  },
  // Pytania specyficzne - endokrynologia/metabolizm
  {
    id: 'q-polyuria',
    category: 'metabolizm',
    question: 'Czy oddaje Pan/Pani częściej mocz niż zwykle?',
    questionType: 'yes_no',
    cost: 1,
    relatedSymptoms: ['wielomocz']
  },
  {
    id: 'q-polydipsia',
    category: 'metabolizm',
    question: 'Czy odczuwa Pan/Pani wzmożone pragnienie?',
    questionType: 'yes_no',
    cost: 1,
    relatedSymptoms: ['wzmożone pragnienie']
  },
  {
    id: 'q-weight-change',
    category: 'metabolizm',
    question: 'Czy zauważył/a Pan/Pani zmianę masy ciała?',
    questionType: 'yes_no',
    cost: 1,
    relatedSymptoms: ['zmiana masy ciała']
  },
  // Pytania specyficzne - neurologia
  {
    id: 'q-headache',
    category: 'neurologia',
    question: 'Czy ma Pan/Pani bóle głowy?',
    questionType: 'yes_no',
    cost: 1,
    relatedSymptoms: ['ból głowy'],
    followUpQuestions: ['q-headache-location', 'q-headache-character']
  },
  {
    id: 'q-headache-location',
    category: 'neurologia',
    question: 'Gdzie zlokalizowany jest ból głowy?',
    questionType: 'multiple_choice',
    options: ['Cała głowa', 'Czoło', 'Skronie', 'Potylica', 'Jednostronny'],
    cost: 1,
    relatedSymptoms: ['ból głowy']
  },
  {
    id: 'q-dizziness',
    category: 'neurologia',
    question: 'Czy odczuwa Pan/Pani zawroty głowy?',
    questionType: 'yes_no',
    cost: 1,
    relatedSymptoms: ['zawroty głowy']
  },
  {
    id: 'q-vision',
    category: 'neurologia',
    question: 'Czy ma Pan/Pani zaburzenia widzenia?',
    questionType: 'yes_no',
    cost: 1,
    relatedSymptoms: ['zaburzenia widzenia']
  }
];

// ============ POZIOMY UŻYTKOWNIKA ============

export const userLevels = [
  { level: 1, name: 'Student początkujący', minXP: 0, maxXP: 100 },
  { level: 2, name: 'Student zaawansowany', minXP: 100, maxXP: 300 },
  { level: 3, name: 'Stażysta', minXP: 300, maxXP: 600 },
  { level: 4, name: 'Młodszy lekarz', minXP: 600, maxXP: 1000 },
  { level: 5, name: 'Lekarz rezydent', minXP: 1000, maxXP: 1500 },
  { level: 6, name: 'Specjalista', minXP: 1500, maxXP: 2200 },
  { level: 7, name: 'Starszy specjalista', minXP: 2200, maxXP: 3000 },
  { level: 8, name: 'Ekspert', minXP: 3000, maxXP: 4000 },
  { level: 9, name: 'Mistrz', minXP: 4000, maxXP: 5500 },
  { level: 10, name: 'Legenda medycyny', minXP: 5500, maxXP: Infinity }
];

// ============ OSIĄGNIĘCIA ============

export const achievements = [
  {
    id: 'ach-first-patient',
    name: 'Pierwszy pacjent',
    description: 'Ukończ pierwszy przypadek kliniczny',
    icon: '🏆',
    isUnlocked: false
  },
  {
    id: 'ach-perfect-diagnosis',
    name: 'Trafna diagnoza',
    description: 'Postaw prawidłową diagnozę za pierwszym razem',
    icon: '🎯',
    isUnlocked: false
  },
  {
    id: 'ach-efficient-diagnostics',
    name: 'Efektywna diagnostyka',
    description: 'Zdiagnozuj przypadek zlecając minimum badań',
    icon: '💡',
    isUnlocked: false
  },
  {
    id: 'ach-lifesaver',
    name: 'Ratownik życia',
    description: 'Uratuj pacjenta przed stanem krytycznym',
    icon: '💓',
    isUnlocked: false
  },
  {
    id: 'ach-educator',
    name: 'Edukator',
    description: 'Przeprowadź kompleksową edukację pacjenta',
    icon: '📚',
    isUnlocked: false
  },
  {
    id: 'ach-specialist',
    name: 'Specjalista',
    description: 'Ukończ 10 przypadków z jednej specjalizacji',
    icon: '👨‍⚕️',
    isUnlocked: false
  },
  {
    id: 'ach-no-mistakes',
    name: 'Bezbłędny',
    description: 'Ukończ przypadek bez żadnych błędów krytycznych',
    icon: '✨',
    isUnlocked: false
  },
  {
    id: 'ach-speed-demon',
    name: 'Błyskawica',
    description: 'Ukończ przypadek w rekordowym czasie',
    icon: '⚡',
    isUnlocked: false
  }
];

