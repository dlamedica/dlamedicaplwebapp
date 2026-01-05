/**
 * Zakładka Badania dodatkowe (laboratoryjne i obrazowe)
 */

import React, { useState } from 'react';
import { Patient, LabOrder, LabResult, LabTest } from '../types';
import { availableLabTests } from '../data/samplePatients';
import { LabTestIcon, CostIcon, ClockIcon } from '../icons/PatientIcons';
import { RippleButton, AnimatedSection, CountUp } from '../../education/components';

interface PatientLabTestsProps {
  patient: Patient;
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  onUpdatePatient: (patient: Patient) => void;
}

const PatientLabTests: React.FC<PatientLabTestsProps> = ({
  patient,
  darkMode,
  fontSize,
  onUpdatePatient
}) => {
  const [orderedTests, setOrderedTests] = useState<LabOrder[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('wszystkie');
  const [selectedTests, setSelectedTests] = useState<string[]>([]);

  const fontSizes = {
    small: { title: 'text-lg', subtitle: 'text-base', text: 'text-sm', small: 'text-xs' },
    medium: { title: 'text-xl', subtitle: 'text-lg', text: 'text-base', small: 'text-sm' },
    large: { title: 'text-2xl', subtitle: 'text-xl', text: 'text-lg', small: 'text-base' }
  }[fontSize];

  // Kategorie badań
  const categories = [
    { id: 'wszystkie', name: 'Wszystkie', icon: '📋' },
    { id: 'blood', name: 'Krew', icon: '🩸' },
    { id: 'urine', name: 'Mocz', icon: '🧪' },
    { id: 'imaging', name: 'Obrazowe', icon: '📷' },
    { id: 'functional', name: 'Czynnościowe', icon: '📊' }
  ];

  // Filtruj badania
  const filteredTests = selectedCategory === 'wszystkie'
    ? availableLabTests
    : availableLabTests.filter(t => t.category === selectedCategory);

  // Toggle wyboru badania
  const toggleTestSelection = (testId: string) => {
    if (isTestOrdered(testId)) return;
    
    setSelectedTests(prev => 
      prev.includes(testId)
        ? prev.filter(id => id !== testId)
        : [...prev, testId]
    );
  };

  // Sprawdź czy badanie zamówione
  const isTestOrdered = (testId: string) => {
    return orderedTests.some(o => o.testId === testId);
  };

  // Generuj wynik badania
  const generateLabResult = (test: LabTest): LabResult => {
    // Wyniki na podstawie scenariusza pacjenta
    const abnormalResults: { [key: string]: { value: string | number; isAbnormal: boolean; interpretation?: string } } = {
      'glucose-fasting': patient.currentVitalSigns.bloodGlucose 
        ? { value: patient.currentVitalSigns.bloodGlucose > 200 ? 245 : patient.currentVitalSigns.bloodGlucose, isAbnormal: patient.currentVitalSigns.bloodGlucose > 126, interpretation: patient.currentVitalSigns.bloodGlucose > 126 ? 'Hiperglikemia - sugeruje cukrzycę' : undefined }
        : { value: 92, isAbnormal: false },
      'hba1c': patient.currentVitalSigns.bloodGlucose && patient.currentVitalSigns.bloodGlucose > 126
        ? { value: '8.2%', isAbnormal: true, interpretation: 'Wartość powyżej normy - sugeruje cukrzycę' }
        : { value: '5.4%', isAbnormal: false },
      'creatinine': { value: '0.9', isAbnormal: false },
      'potassium': { value: '4.2', isAbnormal: false },
      'sodium': { value: '140', isAbnormal: false },
      'cbc': { value: 'Bez odchyleń od normy', isAbnormal: false },
      'crp': { value: '2.3', isAbnormal: false },
      'lipid-panel': patient.demographics.bmi > 25 
        ? { value: 'TC: 235, LDL: 155, HDL: 42, TG: 180', isAbnormal: true, interpretation: 'Dyslipidemia - podwyższone LDL i trójglicerydy' }
        : { value: 'TC: 185, LDL: 95, HDL: 55, TG: 120', isAbnormal: false },
      'tsh': { value: '2.1', isAbnormal: false },
      'urinalysis': patient.currentVitalSigns.bloodGlucose && patient.currentVitalSigns.bloodGlucose > 180
        ? { value: 'Glukozuria (+), białko (-)', isAbnormal: true, interpretation: 'Obecność glukozy w moczu' }
        : { value: 'Badanie prawidłowe', isAbnormal: false },
      'urine-albumin': { value: '15', isAbnormal: false },
      'chest-xray': { value: 'Serce niepowiększone. Płuca bez zmian ogniskowych.', isAbnormal: false },
      'echo': patient.currentVitalSigns.bloodPressureSystolic > 160
        ? { value: 'EF 55%. Przerost lewej komory. Zaburzenia relaksacji.', isAbnormal: true, interpretation: 'Cechy przerostu serca w przebiegu nadciśnienia' }
        : { value: 'EF 60%. Bez odchyleń.', isAbnormal: false },
      'abdominal-usg': { value: 'Narządy jamy brzusznej bez zmian patologicznych.', isAbnormal: false },
      'ecg': patient.currentVitalSigns.bloodPressureSystolic > 160
        ? { value: 'Rytm zatokowy 78/min. Cechy przerostu lewej komory (indeks Sokołowa-Lyona 38mm).', isAbnormal: true, interpretation: 'Zmiany EKG typowe dla nadciśnienia tętniczego' }
        : { value: 'Rytm zatokowy miarowy. Bez cech niedokrwienia.', isAbnormal: false },
      'spirometry': { value: 'FEV1/FVC 82%. Wydolność oddechowa prawidłowa.', isAbnormal: false }
    };

    const resultData = abnormalResults[test.id] || { value: 'W normie', isAbnormal: false };

    return {
      id: `result-${test.id}-${Date.now()}`,
      testId: test.id,
      value: resultData.value,
      unit: test.unit,
      isAbnormal: resultData.isAbnormal,
      interpretation: resultData.interpretation,
      resultAt: new Date(),
      referenceRange: test.normalRange
    };
  };

  // Zamów wybrane badania
  const orderSelectedTests = () => {
    if (selectedTests.length === 0) return;

    const newOrders: LabOrder[] = selectedTests.map(testId => {
      const test = availableLabTests.find(t => t.id === testId)!;
      return {
        id: `order-${testId}-${Date.now()}`,
        testId,
        orderedAt: new Date(),
        orderedBy: 'current-user',
        status: 'completed',
        result: generateLabResult(test),
        cost: test.cost
      };
    });

    setOrderedTests([...orderedTests, ...newOrders]);
    setSelectedTests([]);
  };

  // Oblicz koszty
  const selectedCost = selectedTests.reduce((sum, id) => {
    const test = availableLabTests.find(t => t.id === id);
    return sum + (test?.cost || 0);
  }, 0);

  const totalCost = orderedTests.reduce((sum, o) => sum + o.cost, 0);

  // Pobierz wynik dla badania
  const getTestResult = (testId: string): LabOrder | undefined => {
    return orderedTests.find(o => o.testId === testId);
  };

  return (
    <div className="space-y-6">
      {/* Nagłówek */}
      <AnimatedSection animation="fadeIn">
        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
          <div className="flex items-center gap-3">
            <div className="patient-section-icon" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.1))' }}>
              <LabTestIcon size={24} className="text-purple-500" />
            </div>
            <div>
              <h3 className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Badania dodatkowe
              </h3>
              <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Wybierz badania laboratoryjne i obrazowe
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-600/50' : 'bg-white'}`}>
              <CostIcon size={16} className="text-yellow-500" />
              <span className={`${fontSizes.small} font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Wydano: <CountUp end={totalCost} duration={500} /> pkt
              </span>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Kategorie */}
      <AnimatedSection animation="slideUp" delay={100}>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg ${fontSizes.small} font-medium transition-all flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : darkMode
                    ? 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </AnimatedSection>

      {/* Wybór badań i koszyk */}
      {selectedTests.length > 0 && (
        <AnimatedSection animation="fadeIn">
          <div className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? 'bg-purple-500/10 border border-purple-500/30' : 'bg-purple-50 border border-purple-200'}`}>
            <div>
              <p className={`${fontSizes.text} font-medium ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                Wybrano {selectedTests.length} badań
              </p>
              <p className={`${fontSizes.small} ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                Łączny koszt: {selectedCost} punktów
              </p>
            </div>
            <div className="flex gap-2">
              <RippleButton
                onClick={() => setSelectedTests([])}
                variant="outline"
                darkMode={darkMode}
                className={`px-4 py-2 rounded-lg ${fontSizes.small}`}
              >
                Wyczyść
              </RippleButton>
              <RippleButton
                onClick={orderSelectedTests}
                variant="primary"
                darkMode={darkMode}
                className={`px-4 py-2 rounded-lg ${fontSizes.small}`}
              >
                Zamów badania
              </RippleButton>
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Lista badań */}
      <AnimatedSection animation="slideUp" delay={200}>
        <div className="space-y-3">
          {filteredTests.map((test, index) => {
            const order = getTestResult(test.id);
            const isOrdered = !!order;
            const isSelected = selectedTests.includes(test.id);

            return (
              <div
                key={test.id}
                onClick={() => toggleTestSelection(test.id)}
                className={`lab-test-card ${isSelected ? 'selected' : ''} ${isOrdered ? 'opacity-75' : 'cursor-pointer'} ${darkMode ? 'bg-gray-700/30 hover:bg-gray-700/50' : 'bg-gray-50 hover:bg-gray-100'}`}
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <input
                      type="checkbox"
                      checked={isSelected || isOrdered}
                      disabled={isOrdered}
                      onChange={() => {}}
                      className="w-5 h-5 rounded border-gray-300 text-purple-500 focus:ring-purple-500"
                    />
                    <h4 className={`${fontSizes.text} font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {test.name}
                    </h4>
                  </div>
                  <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2 ml-8`}>
                    {test.description}
                  </p>
                  <div className="flex items-center gap-3 ml-8">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      test.category === 'blood' ? 'bg-red-500/20 text-red-500' :
                      test.category === 'urine' ? 'bg-yellow-500/20 text-yellow-500' :
                      test.category === 'imaging' ? 'bg-blue-500/20 text-blue-500' :
                      'bg-green-500/20 text-green-500'
                    }`}>
                      {categories.find(c => c.id === test.category)?.name}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-yellow-500">
                      <CostIcon size={10} /> {test.cost} pkt
                    </span>
                    <span className="flex items-center gap-1 text-xs text-blue-500">
                      <ClockIcon size={10} /> {test.timeHours < 1 ? `${test.timeHours * 60} min` : `${test.timeHours}h`}
                    </span>
                    <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      Norma: {test.normalRange} {test.unit}
                    </span>
                  </div>

                  {/* Wynik badania */}
                  {isOrdered && order?.result && (
                    <div className={`mt-3 p-3 rounded-lg ml-8 ${
                      order.result.isAbnormal
                        ? darkMode ? 'bg-red-500/10 border border-red-500/30' : 'bg-red-50 border border-red-200'
                        : darkMode ? 'bg-green-500/10 border border-green-500/30' : 'bg-green-50 border border-green-200'
                    }`}>
                      <div className="flex items-center justify-between mb-1">
                        <p className={`${fontSizes.text} font-bold ${order.result.isAbnormal ? 'text-red-500' : 'text-green-500'}`}>
                          {order.result.isAbnormal ? '⚠️ Nieprawidłowy' : '✓ Prawidłowy'}
                        </p>
                        <span className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Norma: {order.result.referenceRange}
                        </span>
                      </div>
                      <p className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {order.result.value} {order.result.unit}
                      </p>
                      {order.result.interpretation && (
                        <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                          {order.result.interpretation}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </AnimatedSection>

      {/* Podsumowanie wyników */}
      {orderedTests.length > 0 && (
        <AnimatedSection animation="slideUp" delay={300}>
          <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/30 border border-gray-600/50' : 'bg-white border border-gray-200'}`}>
            <h4 className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              📊 Podsumowanie wyników ({orderedTests.length} badań)
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-green-500/10' : 'bg-green-50'}`}>
                <p className={`${fontSizes.subtitle} font-bold text-green-500`}>
                  {orderedTests.filter(o => o.result && !o.result.isAbnormal).length}
                </p>
                <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Prawidłowe
                </p>
              </div>
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-red-500/10' : 'bg-red-50'}`}>
                <p className={`${fontSizes.subtitle} font-bold text-red-500`}>
                  {orderedTests.filter(o => o.result && o.result.isAbnormal).length}
                </p>
                <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Nieprawidłowe
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      )}
    </div>
  );
};

export default PatientLabTests;

