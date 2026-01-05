import { DiseaseScenario } from '../types/patient';

const currentTimestamp = Date.now();

export const SCENARIO_AMI: DiseaseScenario = {
    id: 'ami_inferior_wall',
    name: 'Zawał ściany dolnej mięśnia sercowego (STEMI)',
    difficulty: 'medium',
    description: 'Pacjent zgłasza ból w nadbrzuszu i nudności. EKG wskazuje uniesienie ST w II, III, aVF.',
    startingVitals: {
        heartRate: 88,
        bloodPressureSys: 110,
        bloodPressureDia: 70,
        oxygenSaturation: 96,
        temperature: 36.8,
        respiratoryRate: 18,
        glucoseLevel: 140,
        consciousness: 'alert',
        lastUpdated: currentTimestamp
    },
    initialHistory: [
        {
            id: 'h1',
            category: 'symptoms',
            description: 'Silny ból w nadbrzuszu promieniujący do pleców, nudności od 2 godzin.',
            dateAdded: new Date(currentTimestamp).toISOString()
        },
        {
            id: 'h2',
            category: 'past_medical',
            description: 'Nadciśnienie tętnicze (leczone nieregularnie), palacz (20 paczkolat).',
            dateAdded: new Date(currentTimestamp).toISOString()
        }
    ],
    phases: [
        {
            name: 'prodromal', // Initial presentation
            durationRange: [1000 * 60 * 5, 1000 * 60 * 15], // 5-15 mins real time (simulated)
            vitalsTarget: {
                heartRate: 95,
                bloodPressureSys: 105,
                bloodPressureDia: 65,
                oxygenSaturation: 95
            },
            symptoms: ['Ból brzucha', 'Nudności', 'Osłabienie'],
            examFindings: [
                { system: 'general', finding: 'Bladość powłok, poty', isAbnormal: true },
                { system: 'cardiovascular', finding: 'Tony serca czyste, miarowe 90/min', isAbnormal: false },
                { system: 'gastrointestinal', finding: 'Bolesność uciskowa w nadbrzuszu', isAbnormal: true }
            ],
            labAbnormalities: []
        },
        {
            name: 'acute', // Full blown STEMI logic
            durationRange: [1000 * 60 * 10, 1000 * 60 * 30],
            vitalsTarget: {
                heartRate: 110, // Tachycardia compensation
                bloodPressureSys: 90, // Hypotension developing
                bloodPressureDia: 60,
                oxygenSaturation: 92
            },
            symptoms: ['Silny ból zamostkowy', 'duszność'],
            examFindings: [
                { system: 'cardiovascular', finding: 'Cichy szmer skurczowy nad koniuszkiem', isAbnormal: true }
            ],
            labAbnormalities: [
                { testName: 'Troponina T', value: 450, isAbnormal: true, unit: 'ng/L' },
                { testName: 'CK-MB', value: 60, isAbnormal: true, unit: 'IU/L' }
            ]
        },
        {
            name: 'complication', // Cardiogenic Shock or Arrhythmia
            durationRange: [1000 * 60 * 5, 1000 * 60 * 20],
            vitalsTarget: {
                heartRate: 130,
                bloodPressureSys: 75,
                bloodPressureDia: 40,
                oxygenSaturation: 85,
                consciousness: 'verbal'
            },
            symptoms: ['Zaburzenia świadomości'],
            examFindings: [
                { system: 'general', finding: 'Marmurkowatość skóry, chłodne kończyny', isAbnormal: true }
            ],
            labAbnormalities: [
                { testName: 'Mleczany', value: 4.5, isAbnormal: true, unit: 'mmol/L' }
            ]
        },
        {
            name: 'recovery', // Post-treatment
            durationRange: [1000 * 60 * 30, 1000 * 60 * 60],
            vitalsTarget: {
                heartRate: 75,
                bloodPressureSys: 115,
                bloodPressureDia: 75,
                oxygenSaturation: 98,
                consciousness: 'alert'
            },
            symptoms: ['Ustąpienie bólu'],
            examFindings: [],
            labAbnormalities: []
        },
        {
            name: 'terminal', // Death
            durationRange: [0, 0],
            vitalsTarget: {
                heartRate: 0,
                bloodPressureSys: 0,
                bloodPressureDia: 0,
                oxygenSaturation: 0,
                respiratoryRate: 0,
                consciousness: 'unresponsive'
            },
            symptoms: [],
            examFindings: [],
            labAbnormalities: []
        }
    ],
    possibleComplications: [
        {
            triggerCondition: 'untreated_hypotension_10m',
            nextPhase: 'complication',
            probability: 0.8
        },
        {
            triggerCondition: 'treatment_started',
            nextPhase: 'recovery',
            probability: 0.95
        }
    ]
};

export const SCENARIOS = [SCENARIO_AMI];
