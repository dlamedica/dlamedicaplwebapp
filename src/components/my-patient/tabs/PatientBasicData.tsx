/**
 * Zakładka Dane podstawowe pacjenta
 */

import React from 'react';
import { Patient } from '../types';
import {
  PatientIcon,
  HeartbeatIcon,
  AlertIcon
} from '../icons/PatientIcons';
import { CountUp, AnimatedSection } from '../../education/components';

interface PatientBasicDataProps {
  patient: Patient;
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const PatientBasicData: React.FC<PatientBasicDataProps> = ({
  patient,
  darkMode,
  fontSize
}) => {
  const fontSizes = {
    small: { title: 'text-lg', subtitle: 'text-base', text: 'text-sm', small: 'text-xs' },
    medium: { title: 'text-xl', subtitle: 'text-lg', text: 'text-base', small: 'text-sm' },
    large: { title: 'text-2xl', subtitle: 'text-xl', text: 'text-lg', small: 'text-base' }
  }[fontSize];

  const lifestyleLabels = {
    smoking: {
      never: 'Nigdy nie palił/a',
      former: 'Były palacz',
      current: 'Aktualnie pali'
    },
    alcohol: {
      none: 'Nie pije',
      occasional: 'Okazjonalnie',
      moderate: 'Umiarkowanie',
      heavy: 'Dużo'
    },
    physicalActivity: {
      sedentary: 'Siedzący',
      light: 'Lekka aktywność',
      moderate: 'Umiarkowana',
      active: 'Aktywny'
    },
    diet: {
      poor: 'Niezdrowa',
      average: 'Przeciętna',
      healthy: 'Zdrowa'
    },
    stress: {
      low: 'Niski',
      moderate: 'Umiarkowany',
      high: 'Wysoki'
    },
    sleepQuality: {
      poor: 'Zła',
      average: 'Przeciętna',
      good: 'Dobra'
    }
  };

  return (
    <div className="space-y-6">
      {/* Dane demograficzne */}
      <AnimatedSection animation="fadeIn">
        <div className={`patient-section ${darkMode ? 'bg-gray-700/30 border-gray-600/50' : 'bg-gray-50 border-gray-200'} border`}>
          <div className={`patient-section-header ${darkMode ? 'border-gray-600/50' : 'border-gray-200'}`}>
            <div className="patient-section-icon">
              <PatientIcon size={20} className="text-blue-500" />
            </div>
            <h3 className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Dane demograficzne
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Wiek</p>
              <p className={`${fontSizes.text} font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <CountUp end={patient.demographics.age} duration={800} /> lat
              </p>
            </div>
            <div>
              <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Płeć</p>
              <p className={`${fontSizes.text} font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {patient.demographics.gender === 'male' ? 'Mężczyzna' : 'Kobieta'}
              </p>
            </div>
            <div>
              <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Wzrost</p>
              <p className={`${fontSizes.text} font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <CountUp end={patient.demographics.height} duration={600} /> cm
              </p>
            </div>
            <div>
              <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Masa ciała</p>
              <p className={`${fontSizes.text} font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <CountUp end={patient.demographics.weight} duration={600} /> kg
              </p>
            </div>
            <div>
              <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>BMI</p>
              <p className={`${fontSizes.text} font-semibold ${
                patient.demographics.bmi >= 30 ? 'text-red-500' :
                patient.demographics.bmi >= 25 ? 'text-yellow-500' :
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {patient.demographics.bmi.toFixed(1)}
                {patient.demographics.bmi >= 30 && <span className="text-xs ml-1">(otyłość)</span>}
                {patient.demographics.bmi >= 25 && patient.demographics.bmi < 30 && <span className="text-xs ml-1">(nadwaga)</span>}
              </p>
            </div>
            <div>
              <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Grupa krwi</p>
              <p className={`${fontSizes.text} font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {patient.demographics.bloodType || 'Nieznana'}
              </p>
            </div>
            <div className="col-span-2">
              <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Zawód</p>
              <p className={`${fontSizes.text} font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {patient.demographics.occupation}
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Parametry życiowe */}
      <AnimatedSection animation="slideUp" delay={100}>
        <div className={`patient-section ${darkMode ? 'bg-gray-700/30 border-gray-600/50' : 'bg-gray-50 border-gray-200'} border`}>
          <div className={`patient-section-header ${darkMode ? 'border-gray-600/50' : 'border-gray-200'}`}>
            <div className="patient-section-icon" style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1))' }}>
              <HeartbeatIcon size={20} className="text-red-500" />
            </div>
            <h3 className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Parametry życiowe
            </h3>
          </div>

          <div className="vital-signs-grid">
            <div className={`vital-sign-card ${darkMode ? 'bg-gray-700/50' : 'bg-white'}`} style={{ '--vital-color': '#ef4444' } as React.CSSProperties}>
              <div className="vital-sign-icon">
                <HeartbeatIcon size={24} className="text-red-500" />
              </div>
              <div className={`vital-sign-value ${patient.currentVitalSigns.bloodPressureSystolic > 140 ? 'abnormal' : darkMode ? 'text-white' : 'text-gray-900'}`}>
                {patient.currentVitalSigns.bloodPressureSystolic}/{patient.currentVitalSigns.bloodPressureDiastolic}
              </div>
              <div className={`vital-sign-label ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Ciśnienie tętnicze</div>
              <div className={`vital-sign-unit ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>mmHg</div>
            </div>

            <div className={`vital-sign-card ${darkMode ? 'bg-gray-700/50' : 'bg-white'}`} style={{ '--vital-color': '#f59e0b' } as React.CSSProperties}>
              <div className="vital-sign-icon" style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.1))' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-yellow-500">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div className={`vital-sign-value ${patient.currentVitalSigns.heartRate > 100 || patient.currentVitalSigns.heartRate < 60 ? 'abnormal' : darkMode ? 'text-white' : 'text-gray-900'}`}>
                {patient.currentVitalSigns.heartRate}
              </div>
              <div className={`vital-sign-label ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tętno</div>
              <div className={`vital-sign-unit ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>uderzeń/min</div>
            </div>

            <div className={`vital-sign-card ${darkMode ? 'bg-gray-700/50' : 'bg-white'}`} style={{ '--vital-color': '#3b82f6' } as React.CSSProperties}>
              <div className="vital-sign-icon" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.1))' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-blue-500">
                  <path d="M12 4c-2.5 5-7 7.5-7 12a7 7 0 0014 0c0-4.5-4.5-7-7-12z" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div className={`vital-sign-value ${patient.currentVitalSigns.oxygenSaturation < 95 ? 'abnormal' : darkMode ? 'text-white' : 'text-gray-900'}`}>
                {patient.currentVitalSigns.oxygenSaturation}
              </div>
              <div className={`vital-sign-label ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Saturacja</div>
              <div className={`vital-sign-unit ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>%</div>
            </div>

            <div className={`vital-sign-card ${darkMode ? 'bg-gray-700/50' : 'bg-white'}`} style={{ '--vital-color': '#10b981' } as React.CSSProperties}>
              <div className="vital-sign-icon" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1))' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-green-500">
                  <path d="M14 4v6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M12 2v8.5a2.5 2.5 0 005 0V2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="18" r="4" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div className={`vital-sign-value ${patient.currentVitalSigns.temperature > 37.5 || patient.currentVitalSigns.temperature < 36 ? 'abnormal' : darkMode ? 'text-white' : 'text-gray-900'}`}>
                {patient.currentVitalSigns.temperature.toFixed(1)}
              </div>
              <div className={`vital-sign-label ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Temperatura</div>
              <div className={`vital-sign-unit ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>°C</div>
            </div>

            <div className={`vital-sign-card ${darkMode ? 'bg-gray-700/50' : 'bg-white'}`} style={{ '--vital-color': '#8b5cf6' } as React.CSSProperties}>
              <div className="vital-sign-icon" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.1))' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-purple-500">
                  <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div className={`vital-sign-value ${patient.currentVitalSigns.respiratoryRate > 20 || patient.currentVitalSigns.respiratoryRate < 12 ? 'abnormal' : darkMode ? 'text-white' : 'text-gray-900'}`}>
                {patient.currentVitalSigns.respiratoryRate}
              </div>
              <div className={`vital-sign-label ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Oddech</div>
              <div className={`vital-sign-unit ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>oddechów/min</div>
            </div>

            {patient.currentVitalSigns.painLevel !== undefined && (
              <div className={`vital-sign-card ${darkMode ? 'bg-gray-700/50' : 'bg-white'}`} style={{ '--vital-color': '#ec4899' } as React.CSSProperties}>
                <div className="vital-sign-icon" style={{ background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(236, 72, 153, 0.1))' }}>
                  <AlertIcon size={24} className="text-pink-500" />
                </div>
                <div className={`vital-sign-value ${patient.currentVitalSigns.painLevel > 5 ? 'abnormal' : darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {patient.currentVitalSigns.painLevel}/10
                </div>
                <div className={`vital-sign-label ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Ból</div>
                <div className={`vital-sign-unit ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>skala VAS</div>
              </div>
            )}
          </div>
        </div>
      </AnimatedSection>

      {/* Styl życia */}
      <AnimatedSection animation="slideUp" delay={200}>
        <div className={`patient-section ${darkMode ? 'bg-gray-700/30 border-gray-600/50' : 'bg-gray-50 border-gray-200'} border`}>
          <div className={`patient-section-header ${darkMode ? 'border-gray-600/50' : 'border-gray-200'}`}>
            <div className="patient-section-icon" style={{ background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1))' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-green-500">
                <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 1v3M10 1v3M14 1v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Styl życia
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-white'}`}>
              <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Palenie</p>
              <p className={`${fontSizes.text} font-semibold ${
                patient.demographics.lifestyle.smoking === 'current' ? 'text-red-500' :
                patient.demographics.lifestyle.smoking === 'former' ? 'text-yellow-500' :
                'text-green-500'
              }`}>
                {lifestyleLabels.smoking[patient.demographics.lifestyle.smoking]}
              </p>
              {patient.demographics.lifestyle.smokingPackYears && (
                <p className={`${fontSizes.small} ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  {patient.demographics.lifestyle.smokingPackYears} paczkolat
                </p>
              )}
            </div>

            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-white'}`}>
              <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Alkohol</p>
              <p className={`${fontSizes.text} font-semibold ${
                patient.demographics.lifestyle.alcohol === 'heavy' ? 'text-red-500' :
                patient.demographics.lifestyle.alcohol === 'moderate' ? 'text-yellow-500' :
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {lifestyleLabels.alcohol[patient.demographics.lifestyle.alcohol]}
              </p>
            </div>

            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-white'}`}>
              <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Aktywność fizyczna</p>
              <p className={`${fontSizes.text} font-semibold ${
                patient.demographics.lifestyle.physicalActivity === 'sedentary' ? 'text-red-500' :
                patient.demographics.lifestyle.physicalActivity === 'active' ? 'text-green-500' :
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {lifestyleLabels.physicalActivity[patient.demographics.lifestyle.physicalActivity]}
              </p>
            </div>

            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-white'}`}>
              <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Dieta</p>
              <p className={`${fontSizes.text} font-semibold ${
                patient.demographics.lifestyle.diet === 'poor' ? 'text-red-500' :
                patient.demographics.lifestyle.diet === 'healthy' ? 'text-green-500' :
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {lifestyleLabels.diet[patient.demographics.lifestyle.diet]}
              </p>
            </div>

            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-white'}`}>
              <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Poziom stresu</p>
              <p className={`${fontSizes.text} font-semibold ${
                patient.demographics.lifestyle.stress === 'high' ? 'text-red-500' :
                patient.demographics.lifestyle.stress === 'low' ? 'text-green-500' :
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {lifestyleLabels.stress[patient.demographics.lifestyle.stress]}
              </p>
            </div>

            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-white'}`}>
              <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Jakość snu</p>
              <p className={`${fontSizes.text} font-semibold ${
                patient.demographics.lifestyle.sleepQuality === 'poor' ? 'text-red-500' :
                patient.demographics.lifestyle.sleepQuality === 'good' ? 'text-green-500' :
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {lifestyleLabels.sleepQuality[patient.demographics.lifestyle.sleepQuality]}
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Wywiad rodzinny i alergie */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatedSection animation="slideUp" delay={300}>
          <div className={`patient-section ${darkMode ? 'bg-gray-700/30 border-gray-600/50' : 'bg-gray-50 border-gray-200'} border h-full`}>
            <div className={`patient-section-header ${darkMode ? 'border-gray-600/50' : 'border-gray-200'}`}>
              <div className="patient-section-icon" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.1))' }}>
                <PatientIcon size={20} className="text-purple-500" />
              </div>
              <h3 className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Wywiad rodzinny
              </h3>
            </div>

            {patient.demographics.familyHistory.length > 0 ? (
              <ul className="space-y-2">
                {patient.demographics.familyHistory.map((item, index) => (
                  <li key={index} className={`flex items-center gap-2 ${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className={`${fontSizes.text} ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Brak obciążeń rodzinnych
              </p>
            )}
          </div>
        </AnimatedSection>

        <AnimatedSection animation="slideUp" delay={400}>
          <div className={`patient-section ${darkMode ? 'bg-gray-700/30 border-gray-600/50' : 'bg-gray-50 border-gray-200'} border h-full`}>
            <div className={`patient-section-header ${darkMode ? 'border-gray-600/50' : 'border-gray-200'}`}>
              <div className="patient-section-icon" style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1))' }}>
                <AlertIcon size={20} className="text-red-500" />
              </div>
              <h3 className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Alergie
              </h3>
            </div>

            {patient.demographics.allergies.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {patient.demographics.allergies.map((allergy, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-lg ${fontSizes.text} font-medium bg-red-500/20 text-red-500 border border-red-500/30`}
                  >
                    ⚠️ {allergy}
                  </span>
                ))}
              </div>
            ) : (
              <p className={`${fontSizes.text} ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Brak znanych alergii
              </p>
            )}
          </div>
        </AnimatedSection>
      </div>

      {/* Czynniki ryzyka */}
      {patient.riskFactors.length > 0 && (
        <AnimatedSection animation="slideUp" delay={500}>
          <div className={`patient-section ${darkMode ? 'bg-gray-700/30 border-gray-600/50' : 'bg-gray-50 border-gray-200'} border`}>
            <div className={`patient-section-header ${darkMode ? 'border-gray-600/50' : 'border-gray-200'}`}>
              <div className="patient-section-icon" style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.1))' }}>
                <AlertIcon size={20} className="text-yellow-500" />
              </div>
              <h3 className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Czynniki ryzyka
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {patient.riskFactors.map(risk => (
                <div
                  key={risk.id}
                  className={`p-4 rounded-lg border ${
                    risk.severity === 'high'
                      ? 'bg-red-500/10 border-red-500/30'
                      : risk.severity === 'medium'
                        ? 'bg-yellow-500/10 border-yellow-500/30'
                        : 'bg-green-500/10 border-green-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`${fontSizes.text} font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {risk.name}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      risk.severity === 'high'
                        ? 'bg-red-500/20 text-red-500'
                        : risk.severity === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-500'
                          : 'bg-green-500/20 text-green-500'
                    }`}>
                      {risk.severity === 'high' ? 'Wysokie' : risk.severity === 'medium' ? 'Średnie' : 'Niskie'}
                    </span>
                  </div>
                  <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {risk.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}
    </div>
  );
};

export default PatientBasicData;

