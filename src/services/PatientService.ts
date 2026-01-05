import {
    PatientState,
    PatientVitals,
    DiseaseScenario,
    LabResult,
    Order,
    Medication,
    DiseasePhaseName
} from '../types/patient';
import { SCENARIOS } from '../data/scenarios';

type PatientListener = (state: PatientState | null) => void;

class PatientService {
    private currentState: PatientState | null = null;
    private listeners: PatientListener[] = [];
    private simulationInterval: number | null = null;
    private currentScenario: DiseaseScenario | null = null;

    constructor() {
        // Load from local storage if available
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('current_patient_simulation_state');
            if (saved) {
                try {
                    this.currentState = JSON.parse(saved);
                    // Re-attach scenario definition based on ID if possible
                    if (this.currentState) {
                        this.currentScenario = SCENARIOS.find(s => s.id === this.currentState?.activeScenarioId) || null;
                    }
                } catch (e) {
                    console.error("Failed to parse saved patient state", e);
                    this.currentState = null;
                }
            }
        }
    }

    // --- Observer Pattern ---
    public subscribe(listener: PatientListener): () => void {
        this.listeners.push(listener);
        listener(this.currentState);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notifyListeners(): void {
        this.listeners.forEach(listener => listener(this.currentState));
        this.saveState();
    }

    // --- Simulation Control ---
    public startSimulation(): void {
        if (this.simulationInterval) return;

        console.log("Starting advanced patient simulation...");
        // Tick every 1 second
        this.simulationInterval = window.setInterval(() => {
            this.processGameLoop();
        }, 1000);
    }

    public stopSimulation(): void {
        if (this.simulationInterval) {
            console.log("Stopping patient simulation...");
            window.clearInterval(this.simulationInterval);
            this.simulationInterval = null;
        }
    }

    private processGameLoop(): void {
        if (!this.currentState || !this.currentScenario) return;

        const now = Date.now();
        const currentPhaseDef = this.currentScenario.phases.find(p => p.name === this.currentState?.currentPhase);

        if (!currentPhaseDef) return;

        // 1. Check Phase Progression
        const timeInPhase = now - this.currentState.phaseStartTime;
        // Simple max duration check for auto-progression (if not handled by specific triggers)
        // Taking the max duration from range
        const maxDuration = currentPhaseDef.durationRange[1];

        // If phase exceeded max duration, simple logic to move to next or stay (for now just stay unless intervention or trigger)
        // In a real game, triggers would drive this. For MVP, we might auto-progress if it's the 'prodromal' or 'incubation' phase.
        if (maxDuration > 0 && timeInPhase > maxDuration) {
            // Find next phase index
            const currentIndex = this.currentScenario.phases.findIndex(p => p.name === this.currentState?.currentPhase);
            if (currentIndex >= 0 && currentIndex < this.currentScenario.phases.length - 1) {
                const nextPhase = this.currentScenario.phases[currentIndex + 1];
                if (nextPhase) {
                    this.transitionToPhase(nextPhase.name);
                }
            }
        }

        // 2. Trend Vitals towards Target
        this.trendVitals(currentPhaseDef.vitalsTarget);

        // 3. Process Lab Results (Simulate delay)
        this.currentState.labs.forEach(lab => {
            if (lab.status === 'ordered' && lab.resultAt && now >= lab.resultAt) {
                lab.status = 'completed';
                this.addAlert(`Wyniki badań laboratoryjnych dostępne: ${lab.testName}`);
                // In a real app, we might trigger a popup or notification here
            }
        });

        // 4. Check for Complications / Triggers (Basic implementation)
        // Example: If untreated hypotension persists... (would need history tracking)

        this.notifyListeners();
    }

    private trendVitals(target: Partial<PatientVitals>): void {
        if (!this.currentState) return;

        const current = this.currentState.vitals;
        const alpha = 0.05; // Smoothing factor (0.0 - 1.0), lower is slower trending

        // Helper noise function
        const noise = (amount: number) => (Math.random() - 0.5) * amount;

        const updateParam = (key: keyof PatientVitals, noiseAmount: number) => {
            if (target[key] !== undefined) {
                // @ts-ignore
                const currentVal = current[key] as number;
                // @ts-ignore
                const targetVal = target[key] as number;
                // Trend
                const newValue = currentVal + (targetVal - currentVal) * alpha + noise(noiseAmount);
                // @ts-ignore
                current[key] = Math.round(newValue * 10) / 10; // Round to 1 decimal
            } else {
                // Just add noise if no specific target (maintain stability with slight fluctuation)
                // @ts-ignore
                const val = current[key] as number;
                // @ts-ignore
                // Very slight noise to keep it "alive"
                if (typeof val === 'number') current[key] = Math.round((val + noise(noiseAmount * 0.5)) * 10) / 10;
            }
        };

        updateParam('heartRate', 2);
        updateParam('bloodPressureSys', 2);
        updateParam('bloodPressureDia', 1.5);
        updateParam('oxygenSaturation', 0.5);
        updateParam('temperature', 0.1);
        updateParam('respiratoryRate', 1);

        if (current.glucoseLevel) updateParam('glucoseLevel', 2);

        this.currentState.vitals.lastUpdated = Date.now();
    }

    private transitionToPhase(phaseName: DiseasePhaseName): void {
        if (!this.currentState || !this.currentScenario) return;

        console.log(`Transitioning to phase: ${phaseName}`);
        this.currentState.currentPhase = phaseName;
        this.currentState.phaseStartTime = Date.now();

        const phaseDef = this.currentScenario.phases.find(p => p.name === phaseName);
        if (phaseDef) {
            // Unmask findings
            if (phaseDef.symptoms.length > 0) {
                this.addAlert(`Nowe objawy: ${phaseDef.symptoms.join(', ')}`);
                this.currentState.symptoms.push(...phaseDef.symptoms);
            }

            // Add history entry about deterioration/change
            this.currentState.timeline.push({
                id: crypto.randomUUID(),
                timestamp: Date.now(),
                type: 'observation',
                description: `Zmiana stanu pacjenta: ${phaseName}`,
                performer: 'system'
            });
        }
    }

    private addAlert(message: string): void {
        if (this.currentState) {
            this.currentState.alerts.push(message);
            // Limit alerts history
            if (this.currentState.alerts.length > 5) this.currentState.alerts.shift();
        }
    }

    // --- Public API ---

    public generateNewCase(scenarioId?: string): PatientState {
        const scenario = scenarioId
            ? SCENARIOS.find(s => s.id === scenarioId)
            : SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)]; // Random if not specified

        if (!scenario) throw new Error("Scenario not found");

        this.currentScenario = scenario;
        const now = Date.now();

        const newState: PatientState = {
            patient: {
                id: crypto.randomUUID(),
                firstName: this.generateRandomName(),
                lastName: this.generateRandomSurname(),
                age: 45 + Math.floor(Math.random() * 30),
                gender: Math.random() > 0.6 ? 'male' : 'female',
                avatarUrl: undefined
            },
            condition: 'stable', // Starts stable usually
            vitals: { ...scenario.startingVitals }, // Clone
            lifestyle: {
                smoking: 'former',
                alcohol: 'occasional',
                activityLevel: 'sedentary',
                diet: 'standard'
            },
            riskFactors: {
                hypertension: true,
                diabetes: false,
                obesity: true,
                smoking: true,
                familyHistory: ['Heart Disease']
            },
            history: [...scenario.initialHistory],
            symptoms: [...scenario.phases[0].symptoms],
            examFindings: [], // Initially empty, found by exam
            labs: [],
            activeOrders: [],
            medications: [],
            activeScenarioId: scenario.id,
            currentPhase: scenario.phases[0].name,
            phaseStartTime: now,
            timeSinceLastVisit: 0,
            alerts: ['Pacjent przyjęty na SOR.'],
            score: 0,
            timeline: [{
                id: crypto.randomUUID(),
                timestamp: now,
                type: 'observation',
                description: 'Przyjęcie pacjenta',
                performer: 'system'
            }]
        };

        this.currentState = newState;
        this.notifyListeners();
        this.startSimulation();
        return newState;
    }

    public getCurrentState(): PatientState | null {
        return this.currentState;
    }

    public orderLab(testName: string): void {
        if (!this.currentState || !this.currentScenario) return;

        const now = Date.now();
        const duration = 5000; // 5 seconds default delay for demo

        // Check if this lab has specific abnormalities in current or active phases
        // Simplified: check current phase definition
        const phaseDef = this.currentScenario.phases.find(p => p.name === this.currentState?.currentPhase);
        const abnormality = phaseDef?.labAbnormalities.find(l => l.testName === testName);

        const newLab: LabResult = {
            id: crypto.randomUUID(),
            testName,
            category: 'biochemistry', // Default, should refine
            value: abnormality ? (abnormality.value !== undefined ? abnormality.value : 'Norma') : 'Norma',
            unit: abnormality ? (abnormality.unit || '') : '',
            referenceRange: abnormality ? 'N/A' : 'N/A', // Mock
            isAbnormal: !!abnormality,
            orderedAt: now,
            resultAt: now + duration,
            status: 'ordered',
            cost: 50
        };

        this.currentState.labs.push(newLab);
        this.currentState.timeline.push({
            id: crypto.randomUUID(),
            timestamp: now,
            type: 'order',
            description: `Zlecono badania: ${testName}`,
            performer: 'user'
        });

        this.notifyListeners();
    }

    public prescribeMedication(med: { name: string, dosage: string, route: string }): void {
        if (!this.currentState) return;

        // Basic intervention logic
        // Check triggers for next phase?
        if (med.name.toLowerCase().includes('aspirin') || med.name.toLowerCase().includes('heparyna')) {
            // If in AMI scenario, this might trigger recovery or at least stabilization
            // For now, check scenario triggers manually
            const recoveryTrigger = this.currentScenario?.possibleComplications.find(c => c.triggerCondition === 'treatment_started');
            if (recoveryTrigger && this.currentState.currentPhase !== 'recovery') {
                // 80% chance to work immediately for demo
                if (Math.random() < 0.8) {
                    this.transitionToPhase(recoveryTrigger.nextPhase);
                }
            }
        }

        const newMed: Medication = {
            id: crypto.randomUUID(),
            name: med.name,
            dosage: med.dosage,
            route: med.route as any,
            frequency: 'stat',
            startDate: Date.now(),
            status: 'active'
        };

        this.currentState.medications.push(newMed);
        this.currentState.timeline.push({
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            type: 'medication',
            description: `Podano lek: ${med.name} ${med.dosage}`,
            performer: 'user'
        });

        this.notifyListeners();
    }

    public performExamination(system: string): void {
        if (system) { /* Use system to filter */ }
        // Reveal findings for this system
        // ...
    }

    public clearState(): void {
        this.stopSimulation();
        this.currentState = null;
        this.notifyListeners();
        localStorage.removeItem('current_patient_simulation_state');
    }

    private saveState(): void {
        if (this.currentState) {
            localStorage.setItem('current_patient_simulation_state', JSON.stringify(this.currentState));
        }
    }

    private generateRandomName() { return ['Jan', 'Anna', 'Marek', 'Ewa'][Math.floor(Math.random() * 4)]; }
    private generateRandomSurname() { return ['Kowalski', 'Nowak', 'Wiśniewski', 'Wójcik'][Math.floor(Math.random() * 4)]; }
}

export const patientService = new PatientService();
