/**
 * Zakładka Plan leczenia / opieki
 */

import React, { useState } from 'react';
import { Patient, Medication, NonPharmacologicalTreatment, TreatmentGoal } from '../types';
import { TreatmentIcon, PlusIcon, ClockIcon } from '../icons/PatientIcons';
import { RippleButton, AnimatedSection } from '../../education/components';

interface PatientTreatmentProps {
  patient: Patient;
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  onUpdatePatient: (patient: Patient) => void;
}

// Lista popularnych leków
const commonMedications = [
  { name: 'Amlodypina', doses: ['2.5 mg', '5 mg', '10 mg'], category: 'Kardiologia' },
  { name: 'Perindopril', doses: ['2.5 mg', '5 mg', '10 mg'], category: 'Kardiologia' },
  { name: 'Bisoprolol', doses: ['2.5 mg', '5 mg', '10 mg'], category: 'Kardiologia' },
  { name: 'Ramipril', doses: ['2.5 mg', '5 mg', '10 mg'], category: 'Kardiologia' },
  { name: 'Metformina', doses: ['500 mg', '850 mg', '1000 mg'], category: 'Diabetologia' },
  { name: 'Gliclazid MR', doses: ['30 mg', '60 mg', '90 mg'], category: 'Diabetologia' },
  { name: 'Empagliflozyna', doses: ['10 mg', '25 mg'], category: 'Diabetologia' },
  { name: 'Atorwastatyna', doses: ['10 mg', '20 mg', '40 mg', '80 mg'], category: 'Lipidologia' },
  { name: 'Rosuwastatyna', doses: ['5 mg', '10 mg', '20 mg', '40 mg'], category: 'Lipidologia' },
  { name: 'ASA', doses: ['75 mg', '100 mg', '150 mg'], category: 'Kardiologia' },
  { name: 'Pantoprazol', doses: ['20 mg', '40 mg'], category: 'Gastroenterologia' },
  { name: 'Paracetamol', doses: ['500 mg', '1000 mg'], category: 'Przeciwbólowe' },
  { name: 'Ibuprofen', doses: ['200 mg', '400 mg', '600 mg'], category: 'Przeciwbólowe' }
];

const nonPharmCategories = [
  { id: 'diet', name: 'Dieta', icon: '🥗', examples: ['Dieta DASH', 'Ograniczenie soli', 'Dieta cukrzycowa'] },
  { id: 'exercise', name: 'Aktywność fizyczna', icon: '🏃', examples: ['Spacery 30 min/dzień', 'Pływanie', 'Jazda na rowerze'] },
  { id: 'lifestyle', name: 'Styl życia', icon: '🌙', examples: ['Rzucenie palenia', 'Ograniczenie alkoholu', 'Regularny sen'] },
  { id: 'rehabilitation', name: 'Rehabilitacja', icon: '💪', examples: ['Fizjoterapia', 'Ćwiczenia oddechowe', 'Trening wytrzymałościowy'] },
  { id: 'psychological', name: 'Wsparcie psychologiczne', icon: '🧠', examples: ['Terapia poznawczo-behawioralna', 'Techniki relaksacyjne', 'Wsparcie grupowe'] },
  { id: 'education', name: 'Edukacja', icon: '📚', examples: ['Samokontrola glikemii', 'Pomiary ciśnienia w domu', 'Rozpoznawanie objawów alarmowych'] }
];

const PatientTreatment: React.FC<PatientTreatmentProps> = ({
  patient,
  darkMode,
  fontSize,
  onUpdatePatient
}) => {
  const [medications, setMedications] = useState<Medication[]>(patient.currentMedications || []);
  const [nonPharmTreatments, setNonPharmTreatments] = useState<NonPharmacologicalTreatment[]>([]);
  const [goals, setGoals] = useState<TreatmentGoal[]>([]);
  const [educationPoints, setEducationPoints] = useState<string[]>([]);
  
  // Form states
  const [showMedForm, setShowMedForm] = useState(false);
  const [selectedMed, setSelectedMed] = useState('');
  const [selectedDose, setSelectedDose] = useState('');
  const [medFrequency, setMedFrequency] = useState('1x dziennie');
  const [medInstructions, setMedInstructions] = useState('');
  
  const [showNonPharmForm, setShowNonPharmForm] = useState(false);
  const [selectedNonPharmCategory, setSelectedNonPharmCategory] = useState('');
  const [nonPharmDescription, setNonPharmDescription] = useState('');
  
  const [newGoal, setNewGoal] = useState('');
  const [newEducation, setNewEducation] = useState('');

  // Follow-up
  const [nextVisitDays, setNextVisitDays] = useState(14);
  const [parametersToMonitor, setParametersToMonitor] = useState<string[]>(['Ciśnienie tętnicze']);

  const fontSizes = {
    small: { title: 'text-lg', subtitle: 'text-base', text: 'text-sm', small: 'text-xs' },
    medium: { title: 'text-xl', subtitle: 'text-lg', text: 'text-base', small: 'text-sm' },
    large: { title: 'text-2xl', subtitle: 'text-xl', text: 'text-lg', small: 'text-base' }
  }[fontSize];

  // Dodaj lek
  const addMedication = () => {
    if (!selectedMed || !selectedDose) return;

    const newMed: Medication = {
      id: `med-${Date.now()}`,
      name: selectedMed,
      dose: selectedDose,
      frequency: medFrequency,
      route: 'oral',
      duration: 'przewlekle',
      instructions: medInstructions || undefined
    };

    setMedications([...medications, newMed]);
    setSelectedMed('');
    setSelectedDose('');
    setMedInstructions('');
    setShowMedForm(false);
  };

  // Usuń lek
  const removeMedication = (id: string) => {
    setMedications(medications.filter(m => m.id !== id));
  };

  // Dodaj leczenie niefarmakologiczne
  const addNonPharmTreatment = () => {
    if (!selectedNonPharmCategory || !nonPharmDescription) return;

    const newTreatment: NonPharmacologicalTreatment = {
      id: `npt-${Date.now()}`,
      category: selectedNonPharmCategory as any,
      description: nonPharmDescription,
      instructions: [nonPharmDescription]
    };

    setNonPharmTreatments([...nonPharmTreatments, newTreatment]);
    setSelectedNonPharmCategory('');
    setNonPharmDescription('');
    setShowNonPharmForm(false);
  };

  // Dodaj cel leczenia
  const addGoal = () => {
    if (!newGoal) return;

    const goal: TreatmentGoal = {
      id: `goal-${Date.now()}`,
      description: newGoal,
      status: 'pending'
    };

    setGoals([...goals, goal]);
    setNewGoal('');
  };

  // Dodaj punkt edukacyjny
  const addEducationPoint = () => {
    if (!newEducation) return;
    setEducationPoints([...educationPoints, newEducation]);
    setNewEducation('');
  };

  return (
    <div className="space-y-6">
      {/* Nagłówek */}
      <AnimatedSection animation="fadeIn">
        <div className={`flex items-center gap-3 p-4 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
          <div className="patient-section-icon" style={{ background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1))' }}>
            <TreatmentIcon size={24} className="text-green-500" />
          </div>
          <div>
            <h3 className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Plan postępowania
            </h3>
            <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Ustal plan leczenia i opieki dla pacjenta
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* Leczenie farmakologiczne */}
      <AnimatedSection animation="slideUp" delay={100}>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/30 border border-gray-600/50' : 'bg-white border border-gray-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <h4 className={`${fontSizes.text} font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              💊 Leczenie farmakologiczne
            </h4>
            <RippleButton
              onClick={() => setShowMedForm(!showMedForm)}
              variant="outline"
              darkMode={darkMode}
              className={`px-3 py-1.5 rounded-lg ${fontSizes.small}`}
            >
              <PlusIcon size={16} /> Dodaj lek
            </RippleButton>
          </div>

          {/* Formularz dodawania leku */}
          {showMedForm && (
            <div className={`p-4 rounded-lg mb-4 ${darkMode ? 'bg-gray-600/30' : 'bg-gray-50'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <select
                  value={selectedMed}
                  onChange={(e) => {
                    setSelectedMed(e.target.value);
                    setSelectedDose('');
                  }}
                  className={`px-3 py-2 rounded-lg ${fontSizes.text} ${
                    darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-200'
                  } border focus:outline-none focus:ring-2 focus:ring-green-500/20`}
                >
                  <option value="">Wybierz lek...</option>
                  {commonMedications.map(med => (
                    <option key={med.name} value={med.name}>{med.name} ({med.category})</option>
                  ))}
                </select>

                <select
                  value={selectedDose}
                  onChange={(e) => setSelectedDose(e.target.value)}
                  disabled={!selectedMed}
                  className={`px-3 py-2 rounded-lg ${fontSizes.text} ${
                    darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-200'
                  } border focus:outline-none focus:ring-2 focus:ring-green-500/20 disabled:opacity-50`}
                >
                  <option value="">Wybierz dawkę...</option>
                  {commonMedications.find(m => m.name === selectedMed)?.doses.map(dose => (
                    <option key={dose} value={dose}>{dose}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <select
                  value={medFrequency}
                  onChange={(e) => setMedFrequency(e.target.value)}
                  className={`px-3 py-2 rounded-lg ${fontSizes.text} ${
                    darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-200'
                  } border focus:outline-none focus:ring-2 focus:ring-green-500/20`}
                >
                  <option value="1x dziennie">1x dziennie</option>
                  <option value="2x dziennie">2x dziennie</option>
                  <option value="3x dziennie">3x dziennie</option>
                  <option value="co 8 godzin">Co 8 godzin</option>
                  <option value="przed snem">Przed snem</option>
                  <option value="rano">Rano</option>
                </select>

                <input
                  type="text"
                  placeholder="Dodatkowe instrukcje..."
                  value={medInstructions}
                  onChange={(e) => setMedInstructions(e.target.value)}
                  className={`px-3 py-2 rounded-lg ${fontSizes.text} ${
                    darkMode ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' : 'bg-white text-gray-900 border-gray-200 placeholder-gray-500'
                  } border focus:outline-none focus:ring-2 focus:ring-green-500/20`}
                />
              </div>

              <RippleButton
                onClick={addMedication}
                variant="primary"
                darkMode={darkMode}
                disabled={!selectedMed || !selectedDose}
                className={`w-full py-2 rounded-lg ${fontSizes.text}`}
              >
                Dodaj lek
              </RippleButton>
            </div>
          )}

          {/* Lista leków */}
          {medications.length > 0 ? (
            <div className="space-y-2">
              {medications.map(med => (
                <div
                  key={med.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-600/30' : 'bg-gray-50'}`}
                >
                  <div>
                    <p className={`${fontSizes.text} font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {med.name} {med.dose}
                    </p>
                    <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {med.frequency} {med.instructions && `• ${med.instructions}`}
                    </p>
                  </div>
                  <button
                    onClick={() => removeMedication(med.id)}
                    className="text-red-500 hover:bg-red-500/20 px-2 py-1 rounded"
                  >
                    Usuń
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className={`${fontSizes.text} ${darkMode ? 'text-gray-500' : 'text-gray-500'} text-center py-4`}>
              Nie dodano jeszcze leków
            </p>
          )}
        </div>
      </AnimatedSection>

      {/* Leczenie niefarmakologiczne */}
      <AnimatedSection animation="slideUp" delay={200}>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/30 border border-gray-600/50' : 'bg-white border border-gray-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <h4 className={`${fontSizes.text} font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              🌿 Leczenie niefarmakologiczne
            </h4>
            <RippleButton
              onClick={() => setShowNonPharmForm(!showNonPharmForm)}
              variant="outline"
              darkMode={darkMode}
              className={`px-3 py-1.5 rounded-lg ${fontSizes.small}`}
            >
              <PlusIcon size={16} /> Dodaj
            </RippleButton>
          </div>

          {/* Formularz */}
          {showNonPharmForm && (
            <div className={`p-4 rounded-lg mb-4 ${darkMode ? 'bg-gray-600/30' : 'bg-gray-50'}`}>
              <div className="flex flex-wrap gap-2 mb-3">
                {nonPharmCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedNonPharmCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg ${fontSizes.small} ${
                      selectedNonPharmCategory === cat.id
                        ? 'bg-green-500 text-white'
                        : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>

              {selectedNonPharmCategory && (
                <>
                  <div className="mb-3">
                    <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                      Przykłady: {nonPharmCategories.find(c => c.id === selectedNonPharmCategory)?.examples.join(', ')}
                    </p>
                    <input
                      type="text"
                      placeholder="Opis zalecenia..."
                      value={nonPharmDescription}
                      onChange={(e) => setNonPharmDescription(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg ${fontSizes.text} ${
                        darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-200'
                      } border focus:outline-none focus:ring-2 focus:ring-green-500/20`}
                    />
                  </div>
                  <RippleButton
                    onClick={addNonPharmTreatment}
                    variant="primary"
                    darkMode={darkMode}
                    disabled={!nonPharmDescription}
                    className={`w-full py-2 rounded-lg ${fontSizes.text}`}
                  >
                    Dodaj zalecenie
                  </RippleButton>
                </>
              )}
            </div>
          )}

          {/* Lista */}
          {nonPharmTreatments.length > 0 ? (
            <div className="space-y-2">
              {nonPharmTreatments.map(treatment => (
                <div
                  key={treatment.id}
                  className={`flex items-center gap-3 p-3 rounded-lg ${darkMode ? 'bg-gray-600/30' : 'bg-gray-50'}`}
                >
                  <span className="text-xl">{nonPharmCategories.find(c => c.id === treatment.category)?.icon}</span>
                  <div className="flex-1">
                    <p className={`${fontSizes.text} font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {treatment.description}
                    </p>
                    <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {nonPharmCategories.find(c => c.id === treatment.category)?.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={`${fontSizes.text} ${darkMode ? 'text-gray-500' : 'text-gray-500'} text-center py-4`}>
              Nie dodano zaleceń niefarmakologicznych
            </p>
          )}
        </div>
      </AnimatedSection>

      {/* Cele leczenia */}
      <AnimatedSection animation="slideUp" delay={300}>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/30 border border-gray-600/50' : 'bg-white border border-gray-200'}`}>
          <h4 className={`${fontSizes.text} font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            🎯 Cele leczenia
          </h4>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Np. Ciśnienie < 140/90 mmHg, HbA1c < 7%..."
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              className={`flex-1 px-3 py-2 rounded-lg ${fontSizes.text} ${
                darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-200'
              } border focus:outline-none focus:ring-2 focus:ring-green-500/20`}
            />
            <RippleButton
              onClick={addGoal}
              variant="primary"
              darkMode={darkMode}
              disabled={!newGoal}
              className="px-4 py-2 rounded-lg"
            >
              Dodaj
            </RippleButton>
          </div>

          {goals.length > 0 && (
            <div className="space-y-2">
              {goals.map(goal => (
                <div
                  key={goal.id}
                  className={`flex items-center gap-3 p-2 rounded-lg ${darkMode ? 'bg-gray-600/30' : 'bg-gray-50'}`}
                >
                  <span className="text-green-500">🎯</span>
                  <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{goal.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </AnimatedSection>

      {/* Kontrola */}
      <AnimatedSection animation="slideUp" delay={400}>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/30 border border-gray-600/50' : 'bg-white border border-gray-200'}`}>
          <h4 className={`${fontSizes.text} font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            📅 Plan kontroli
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                Następna wizyta za:
              </p>
              <div className="flex gap-2">
                {[7, 14, 30, 60, 90].map(days => (
                  <button
                    key={days}
                    onClick={() => setNextVisitDays(days)}
                    className={`px-3 py-1.5 rounded-lg ${fontSizes.small} ${
                      nextVisitDays === days
                        ? 'bg-blue-500 text-white'
                        : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {days}d
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                Parametry do monitorowania:
              </p>
              <div className="flex flex-wrap gap-2">
                {['Ciśnienie tętnicze', 'Tętno', 'Glikemia', 'Masa ciała', 'Samopoczucie'].map(param => (
                  <button
                    key={param}
                    onClick={() => setParametersToMonitor(prev => 
                      prev.includes(param) ? prev.filter(p => p !== param) : [...prev, param]
                    )}
                    className={`px-3 py-1.5 rounded-lg ${fontSizes.small} ${
                      parametersToMonitor.includes(param)
                        ? 'bg-green-500 text-white'
                        : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {param}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default PatientTreatment;

