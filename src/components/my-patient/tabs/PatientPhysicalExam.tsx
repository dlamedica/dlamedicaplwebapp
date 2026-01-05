/**
 * Zakładka Badanie Fizykalne - rozbudowana wersja z mapą ciała
 */

import React, { useState, useCallback } from 'react';
import { Patient } from '../types';
import { 
  BodyView, 
  ExamType, 
  PhysicalExamAction, 
  ExamProgress,
  BodyRegion
} from '../types/physicalExam';
import { defaultExamLimits, getExamResult, getKeyPointsForScenario, bodyRegions } from '../data/bodyRegions';
import BodyMap from '../components/BodyMap';
import ExamToolsPanel from '../components/ExamToolsPanel';
import ExamResultsPanel from '../components/ExamResultsPanel';
import { RippleButton, AnimatedSection } from '../../education/components';
import { StethoscopeIcon } from '../icons/PatientIcons';

interface PatientPhysicalExamProps {
  patient: Patient;
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  onUpdatePatient: (patient: Patient) => void;
}

const PatientPhysicalExam: React.FC<PatientPhysicalExamProps> = ({
  patient,
  darkMode,
  fontSize,
  onUpdatePatient
}) => {
  // Stan
  const [currentView, setCurrentView] = useState<BodyView>('front');
  const [selectedExamType, setSelectedExamType] = useState<ExamType>('auscultation');
  const [examActions, setExamActions] = useState<PhysicalExamAction[]>([]);
  const [highlightedRegion, setHighlightedRegion] = useState<string | undefined>();
  const [hoveredRegionInfo, setHoveredRegionInfo] = useState<BodyRegion | null>(null);

  const fontSizes = {
    small: { title: 'text-lg', subtitle: 'text-base', text: 'text-sm', small: 'text-xs' },
    medium: { title: 'text-xl', subtitle: 'text-lg', text: 'text-base', small: 'text-sm' },
    large: { title: 'text-2xl', subtitle: 'text-xl', text: 'text-lg', small: 'text-base' }
  }[fontSize];

  // Kluczowe punkty dla scenariusza
  const keyPoints = getKeyPointsForScenario(patient.currentScenario?.id || '');

  // Postęp badania
  const examProgress: ExamProgress = {
    auscultationCount: examActions.filter(a => a.type === 'auscultation').length,
    palpationCount: examActions.filter(a => a.type === 'palpation').length,
    percussionCount: examActions.filter(a => a.type === 'percussion').length,
    inspectionCount: examActions.filter(a => a.type === 'inspection').length,
    keyPointsExamined: [...new Set(examActions.map(a => a.regionId).filter(id => keyPoints.includes(id)))],
    totalKeyPoints: keyPoints.length,
    score: 0,
    alerts: []
  };

  // Zbadane regiony
  const examinedRegions = examActions.map(a => a.regionId);

  // Sprawdź czy limit osiągnięty
  const isLimitReached = (): boolean => {
    const total = examProgress.auscultationCount + examProgress.palpationCount + 
                  examProgress.percussionCount + examProgress.inspectionCount;
    return total >= defaultExamLimits.total;
  };

  // Obsługa kliknięcia na region
  const handleRegionClick = useCallback((region: BodyRegion) => {
    if (isLimitReached()) return;

    // Sprawdź limit dla konkretnego typu
    const currentCount = selectedExamType === 'auscultation' ? examProgress.auscultationCount :
                         selectedExamType === 'palpation' ? examProgress.palpationCount :
                         selectedExamType === 'percussion' ? examProgress.percussionCount :
                         examProgress.inspectionCount;
    const limit = defaultExamLimits[selectedExamType];

    if (currentCount >= limit) return;

    // Pobierz wynik badania
    const result = getExamResult(region.id, selectedExamType, patient.currentScenario?.id);

    // Stwórz nową akcję
    const newAction: PhysicalExamAction = {
      id: `exam-${Date.now()}`,
      patientId: patient.id,
      scenarioId: patient.currentScenario?.id || '',
      visitId: `visit-${Date.now()}`,
      type: selectedExamType,
      regionId: region.id,
      regionName: region.namePL,
      createdAt: new Date(),
      resultId: result.id,
      result
    };

    setExamActions(prev => [...prev, newAction]);
    
    // Podświetl region przez chwilę
    setHighlightedRegion(region.id);
    setTimeout(() => setHighlightedRegion(undefined), 1000);
  }, [selectedExamType, examProgress, patient.currentScenario?.id, patient.id]);

  // Obsługa hover
  const handleRegionHover = useCallback((region: BodyRegion | null) => {
    setHoveredRegionInfo(region);
  }, []);

  // Odtwórz audio (placeholder)
  const handlePlayAudio = (audioUrl: string) => {
    console.log('Playing audio:', audioUrl);
    // TODO: Implementacja odtwarzania audio
  };

  return (
    <div className="space-y-6">
      {/* Nagłówek */}
      <AnimatedSection animation="fadeIn">
        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
          <div className="flex items-center gap-3">
            <div className="patient-section-icon" style={{ background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(236, 72, 153, 0.1))' }}>
              <StethoscopeIcon size={24} className="text-pink-500" />
            </div>
            <div>
              <h3 className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Badanie fizykalne
              </h3>
              <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Kliknij na mapie ciała, aby wykonać badanie
              </p>
            </div>
          </div>

          {/* Przełącznik widoku */}
          <div className="flex items-center gap-2">
            <RippleButton
              onClick={() => setCurrentView('front')}
              variant={currentView === 'front' ? 'primary' : 'outline'}
              darkMode={darkMode}
              className={`px-4 py-2 rounded-lg ${fontSizes.small}`}
            >
              Przód
            </RippleButton>
            <RippleButton
              onClick={() => setCurrentView('back')}
              variant={currentView === 'back' ? 'primary' : 'outline'}
              darkMode={darkMode}
              className={`px-4 py-2 rounded-lg ${fontSizes.small}`}
            >
              Tył
            </RippleButton>
          </div>
        </div>
      </AnimatedSection>

      {/* Główna zawartość - 3 kolumny */}
      <AnimatedSection animation="slideUp" delay={100}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lewa kolumna - Mapa ciała */}
          <div className={`lg:col-span-1 p-4 rounded-xl ${darkMode ? 'bg-gray-700/30 border border-gray-600/50' : 'bg-white border border-gray-200'}`}>
            <BodyMap
              view={currentView}
              zoom="full"
              selectedExamType={selectedExamType}
              highlightedRegion={highlightedRegion}
              examinedRegions={examinedRegions}
              onRegionClick={handleRegionClick}
              onRegionHover={handleRegionHover}
              darkMode={darkMode}
              disabled={isLimitReached()}
            />

            {/* Info o hover */}
            {hoveredRegionInfo && (
              <div className={`mt-4 p-3 rounded-lg ${darkMode ? 'bg-gray-600/50' : 'bg-gray-50'}`}>
                <p className={`${fontSizes.text} font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {hoveredRegionInfo.namePL}
                </p>
                <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Dostępne: {hoveredRegionInfo.availableExams.map(e => 
                    e === 'auscultation' ? 'osłuchiwanie' :
                    e === 'palpation' ? 'palpacja' :
                    e === 'percussion' ? 'perkusja' : 'inspekcja'
                  ).join(', ')}
                </p>
                {hoveredRegionInfo.isKeyPoint && (
                  <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs font-bold ${darkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'}`}>
                    ⭐ Kluczowy punkt
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Środkowa kolumna - Panel narzędzi */}
          <div className="lg:col-span-1">
            <ExamToolsPanel
              selectedExamType={selectedExamType}
              onSelectExamType={setSelectedExamType}
              examProgress={examProgress}
              examLimits={defaultExamLimits}
              darkMode={darkMode}
              disabled={isLimitReached()}
            />

            {/* Legenda punktów serca (dla osłuchiwania) */}
            {selectedExamType === 'auscultation' && currentView === 'front' && (
              <div className={`mt-4 p-4 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
                <h5 className={`${fontSizes.text} font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                  ❤️ Punkty osłuchiwania serca
                </h5>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'A', name: 'Aortalny', desc: '2. międzyżebrze, prawy brzeg mostka' },
                    { id: 'P', name: 'Płucny', desc: '2. międzyżebrze, lewy brzeg mostka' },
                    { id: 'E', name: 'Erba', desc: '3. międzyżebrze, lewy brzeg mostka' },
                    { id: 'T', name: 'Trójdzielny', desc: '4-5. międzyżebrze, lewy brzeg mostka' },
                    { id: 'M', name: 'Mitralny', desc: '5. międzyżebrze, linia środkowo-obojczykowa' }
                  ].map(point => (
                    <div key={point.id} className={`p-2 rounded-lg ${darkMode ? 'bg-gray-600/30' : 'bg-white'}`}>
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          examinedRegions.includes(`HEART_${point.id === 'A' ? 'AORTIC' : point.id === 'P' ? 'PULMONIC' : point.id === 'E' ? 'ERB' : point.id === 'T' ? 'TRICUSPID' : 'MITRAL'}`)
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                        }`}>
                          {point.id}
                        </span>
                        <span className={`${fontSizes.small} font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {point.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Prawa kolumna - Wyniki */}
          <div className="lg:col-span-1">
            <ExamResultsPanel
              actions={examActions}
              onPlayAudio={handlePlayAudio}
              darkMode={darkMode}
            />
          </div>
        </div>
      </AnimatedSection>

      {/* Alerty i wskazówki */}
      {examProgress.keyPointsExamined.length < examProgress.totalKeyPoints && examActions.length > 3 && (
        <AnimatedSection animation="fadeIn" delay={200}>
          <div className={`p-4 rounded-xl ${darkMode ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-yellow-50 border border-yellow-200'}`}>
            <p className={`${fontSizes.text} font-medium ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
              ⚠️ Nie zbadałeś wszystkich kluczowych punktów!
            </p>
            <p className={`${fontSizes.small} ${darkMode ? 'text-yellow-400/80' : 'text-yellow-600'} mt-1`}>
              Pozostało do zbadania: {keyPoints.filter(kp => !examProgress.keyPointsExamined.includes(kp)).map(kp => 
                bodyRegions.find(r => r.id === kp)?.namePL || kp
              ).join(', ')}
            </p>
          </div>
        </AnimatedSection>
      )}

      {/* Podsumowanie - gdy wszystkie kluczowe punkty zbadane */}
      {examProgress.keyPointsExamined.length >= examProgress.totalKeyPoints && (
        <AnimatedSection animation="fadeIn" delay={200}>
          <div className={`p-4 rounded-xl ${darkMode ? 'bg-green-500/10 border border-green-500/30' : 'bg-green-50 border border-green-200'}`}>
            <p className={`${fontSizes.text} font-medium ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
              ✅ Zbadano wszystkie kluczowe punkty!
            </p>
            <p className={`${fontSizes.small} ${darkMode ? 'text-green-400/80' : 'text-green-600'} mt-1`}>
              Możesz przejść do formułowania diagnozy lub kontynuować badanie.
            </p>
          </div>
        </AnimatedSection>
      )}
    </div>
  );
};

export default PatientPhysicalExam;

