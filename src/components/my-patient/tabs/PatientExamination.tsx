/**
 * Zakładka Badanie przedmiotowe
 */

import React, { useState } from 'react';
import { Patient, PhysicalExamination, ExaminationOption } from '../types';
import { examinationOptions } from '../data/samplePatients';
import { ExaminationIcon, CostIcon, ClockIcon, StethoscopeIcon } from '../icons/PatientIcons';
import { RippleButton, AnimatedSection } from '../../education/components';

interface PatientExaminationProps {
  patient: Patient;
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  onUpdatePatient: (patient: Patient) => void;
}

const PatientExamination: React.FC<PatientExaminationProps> = ({
  patient,
  darkMode,
  fontSize,
  onUpdatePatient
}) => {
  const [performedExams, setPerformedExams] = useState<PhysicalExamination[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('wszystkie');

  const fontSizes = {
    small: { title: 'text-lg', subtitle: 'text-base', text: 'text-sm', small: 'text-xs' },
    medium: { title: 'text-xl', subtitle: 'text-lg', text: 'text-base', small: 'text-sm' },
    large: { title: 'text-2xl', subtitle: 'text-xl', text: 'text-lg', small: 'text-base' }
  }[fontSize];

  // Regiony ciała
  const bodyRegions = ['wszystkie', 'ogólne', 'głowa', 'szyja', 'klatka piersiowa', 'płuca', 'serce', 'brzuch', 'kończyny', 'układ nerwowy'];

  // Filtruj badania
  const filteredExams = selectedRegion === 'wszystkie'
    ? examinationOptions
    : examinationOptions.filter(e => e.bodyRegion === selectedRegion);

  // Sprawdź czy badanie zostało wykonane
  const isExamPerformed = (examId: string) => {
    return performedExams.some(e => e.id === examId);
  };

  // Generuj wynik badania
  const generateExamResult = (exam: ExaminationOption): { findings: string; isNormal: boolean } => {
    // Wyniki na podstawie scenariusza
    const abnormalResults: { [key: string]: { findings: string; isNormal: boolean } } = {
      // Dla nadciśnienia
      'heart-auscultation': {
        findings: patient.currentVitalSigns.bloodPressureSystolic > 140
          ? 'Tony serca głośne, miarowe. Akcent II tonu nad aortą.'
          : 'Tony serca czyste, miarowe. Bez szmerów.',
        isNormal: patient.currentVitalSigns.bloodPressureSystolic <= 140
      },
      'lung-auscultation': {
        findings: 'Szmer pęcherzykowy prawidłowy, symetryczny. Bez szmerów dodatkowych.',
        isNormal: true
      },
      'general-appearance': {
        findings: 'Pacjent w stanie ogólnym dobrym. Przytomny, zorientowany. Bez cech ostrej choroby.',
        isNormal: true
      },
      'skin-inspection': {
        findings: 'Skóra ciepła, wilgotna, prawidłowego koloru. Bez zmian patologicznych.',
        isNormal: true
      },
      'neck-palpation': {
        findings: 'Tarczyca niepowiększona. Węzły chłonne niewyczuwalne. Tętno na tętnicach szyjnych zachowane.',
        isNormal: true
      },
      'abdomen-palpation': {
        findings: 'Brzuch miękki, niebolesny. Bez oporów patologicznych. Wątroba i śledziona niepowiększone.',
        isNormal: true
      },
      'extremities-inspection': {
        findings: 'Kończyny bez obrzęków. Bez żylaków. Skóra ciepła, bez zmian troficznych.',
        isNormal: true
      },
      'peripheral-pulses': {
        findings: 'Tętno obwodowe zachowane, symetryczne na wszystkich tętnicach.',
        isNormal: true
      },
      'neuro-basic': {
        findings: patient.currentSymptoms.some(s => s.bodySystem === 'neurologiczny')
          ? 'Pacjent zorientowany. Nerwy czaszkowe bez cech uszkodzenia. Objawy ogniskowe nieobecne. Objawy oponowe ujemne.'
          : 'Badanie neurologiczne bez odchyleń.',
        isNormal: true
      }
    };

    return abnormalResults[exam.id] || {
      findings: 'Badanie w granicach normy. Bez odchyleń od stanu prawidłowego.',
      isNormal: true
    };
  };

  // Wykonaj badanie
  const performExam = (exam: ExaminationOption) => {
    if (isExamPerformed(exam.id)) return;

    const result = generateExamResult(exam);

    const newExam: PhysicalExamination = {
      id: exam.id,
      timestamp: new Date(),
      examType: exam.examType,
      bodyRegion: exam.bodyRegion,
      findings: result.findings,
      isNormal: result.isNormal,
      performedBy: 'current-user',
      cost: exam.cost
    };

    setPerformedExams([...performedExams, newExam]);
  };

  // Pobierz wynik badania
  const getExamResult = (examId: string): PhysicalExamination | undefined => {
    return performedExams.find(e => e.id === examId);
  };

  // Oblicz całkowity koszt
  const totalCost = performedExams.reduce((sum, e) => sum + e.cost, 0);
  const totalTime = performedExams.reduce((sum, e) => {
    const option = examinationOptions.find(o => o.id === e.id);
    return sum + (option?.timeMinutes || 0);
  }, 0);

  // Typy badań ikony
  const examTypeIcons = {
    inspection: '👁️',
    palpation: '✋',
    percussion: '🔨',
    auscultation: '🩺'
  };

  return (
    <div className="space-y-6">
      {/* Nagłówek z kosztami */}
      <AnimatedSection animation="fadeIn">
        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
          <div className="flex items-center gap-3">
            <div className="patient-section-icon" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1))' }}>
              <StethoscopeIcon size={24} className="text-green-500" />
            </div>
            <div>
              <h3 className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Badanie przedmiotowe
              </h3>
              <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Wybierz badania, które chcesz wykonać
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-600/50' : 'bg-white'}`}>
              <ClockIcon size={16} className="text-blue-500" />
              <span className={`${fontSizes.small} font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Czas: {totalTime} min
              </span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-600/50' : 'bg-white'}`}>
              <CostIcon size={16} className="text-yellow-500" />
              <span className={`${fontSizes.small} font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Koszt: {totalCost} pkt
              </span>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Regiony ciała */}
      <AnimatedSection animation="slideUp" delay={100}>
        <div className="flex flex-wrap gap-2">
          {bodyRegions.map(region => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-4 py-2 rounded-lg ${fontSizes.small} font-medium transition-all ${
                selectedRegion === region
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                  : darkMode
                    ? 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
            >
              {region.charAt(0).toUpperCase() + region.slice(1)}
            </button>
          ))}
        </div>
      </AnimatedSection>

      {/* Lista badań */}
      <AnimatedSection animation="slideUp" delay={200}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredExams.map((exam, index) => {
            const result = getExamResult(exam.id);
            const isPerformed = !!result;

            return (
              <div
                key={exam.id}
                className={`lab-test-card ${isPerformed ? 'selected' : ''} ${darkMode ? 'bg-gray-700/30 hover:bg-gray-700/50' : 'bg-gray-50 hover:bg-gray-100'}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{examTypeIcons[exam.examType]}</span>
                    <h4 className={`${fontSizes.text} font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {exam.name}
                    </h4>
                  </div>
                  <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                    {exam.description}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-xs ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                      {exam.bodyRegion}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-yellow-500">
                      <CostIcon size={10} /> {exam.cost} pkt
                    </span>
                    <span className="flex items-center gap-1 text-xs text-blue-500">
                      <ClockIcon size={10} /> {exam.timeMinutes} min
                    </span>
                  </div>

                  {/* Wynik badania */}
                  {isPerformed && result && (
                    <div className={`mt-3 p-3 rounded-lg ${
                      result.isNormal
                        ? darkMode ? 'bg-green-500/10 border border-green-500/30' : 'bg-green-50 border border-green-200'
                        : darkMode ? 'bg-red-500/10 border border-red-500/30' : 'bg-red-50 border border-red-200'
                    }`}>
                      <p className={`${fontSizes.small} ${result.isNormal ? 'text-green-500' : 'text-red-500'} font-medium mb-1`}>
                        {result.isNormal ? '✓ Wynik prawidłowy' : '⚠️ Wynik nieprawidłowy'}
                      </p>
                      <p className={`${fontSizes.small} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {result.findings}
                      </p>
                    </div>
                  )}
                </div>

                {!isPerformed && (
                  <RippleButton
                    onClick={() => performExam(exam)}
                    variant="outline"
                    darkMode={darkMode}
                    className={`px-4 py-2 rounded-lg ${fontSizes.small} ml-4`}
                  >
                    Wykonaj
                  </RippleButton>
                )}
              </div>
            );
          })}
        </div>
      </AnimatedSection>

      {/* Podsumowanie wykonanych badań */}
      {performedExams.length > 0 && (
        <AnimatedSection animation="slideUp" delay={300}>
          <div className={`p-4 rounded-xl ${darkMode ? 'bg-green-500/10 border border-green-500/30' : 'bg-green-50 border border-green-200'}`}>
            <h4 className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-green-400' : 'text-green-700'} mb-3`}>
              📋 Wykonane badania ({performedExams.length})
            </h4>
            <div className="space-y-2">
              {performedExams.map(exam => (
                <div key={exam.id} className="flex items-center justify-between">
                  <span className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {examTypeIcons[exam.examType]} {examinationOptions.find(e => e.id === exam.id)?.name}
                  </span>
                  <span className={`${fontSizes.small} ${exam.isNormal ? 'text-green-500' : 'text-red-500'}`}>
                    {exam.isNormal ? 'Norma' : 'Odchylenia'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}
    </div>
  );
};

export default PatientExamination;

