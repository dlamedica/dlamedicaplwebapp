/**
 * Zakładka Timeline - historia i monitorowanie pacjenta
 */

import React from 'react';
import { Patient, TimelineEvent } from '../types';
import { TimelineIcon, AlertIcon, ClockIcon, HeartbeatIcon } from '../icons/PatientIcons';
import { AnimatedSection, CountUp } from '../../education/components';

interface PatientTimelineProps {
  patient: Patient;
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const PatientTimeline: React.FC<PatientTimelineProps> = ({
  patient,
  darkMode,
  fontSize
}) => {
  const fontSizes = {
    small: { title: 'text-lg', subtitle: 'text-base', text: 'text-sm', small: 'text-xs' },
    medium: { title: 'text-xl', subtitle: 'text-lg', text: 'text-base', small: 'text-sm' },
    large: { title: 'text-2xl', subtitle: 'text-xl', text: 'text-lg', small: 'text-base' }
  }[fontSize];

  // Ikony dla typów wydarzeń
  const eventTypeIcons: { [key: string]: string } = {
    symptom: '🩺',
    examination: '👁️',
    lab_order: '🧪',
    lab_result: '📊',
    diagnosis: '📋',
    treatment: '💊',
    alert: '⚠️',
    note: '📝'
  };

  // Kolory dla severity
  const severityColors = {
    info: { bg: 'bg-blue-500/20', border: 'border-blue-500/30', text: 'text-blue-500' },
    warning: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', text: 'text-yellow-500' },
    danger: { bg: 'bg-red-500/20', border: 'border-red-500/30', text: 'text-red-500' },
    success: { bg: 'bg-green-500/20', border: 'border-green-500/30', text: 'text-green-500' }
  };

  // Sortuj timeline
  const sortedTimeline = [...patient.timeline].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Formatuj datę
  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('pl-PL', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Oblicz czas od ostatniej interakcji
  const timeSinceLastInteraction = () => {
    const diff = new Date().getTime() - new Date(patient.lastInteraction).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} dni ${hours}h`;
    return `${hours}h`;
  };

  return (
    <div className="space-y-6">
      {/* Nagłówek */}
      <AnimatedSection animation="fadeIn">
        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
          <div className="flex items-center gap-3">
            <div className="patient-section-icon" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.1))' }}>
              <TimelineIcon size={24} className="text-blue-500" />
            </div>
            <div>
              <h3 className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Historia i monitorowanie
              </h3>
              <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Oś czasu wydarzeń i zmian stanu pacjenta
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-600/50' : 'bg-white'}`}>
              <ClockIcon size={16} className="text-blue-500" />
              <span className={`${fontSizes.small} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Ostatnia interakcja: {timeSinceLastInteraction()} temu
              </span>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Statystyki wizyt */}
      <AnimatedSection animation="slideUp" delay={100}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-white'} border ${darkMode ? 'border-gray-600/50' : 'border-gray-200'}`}>
            <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Wizyty</p>
            <p className={`${fontSizes.title} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <CountUp end={patient.encounters.length} duration={800} />
            </p>
          </div>

          <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-white'} border ${darkMode ? 'border-gray-600/50' : 'border-gray-200'}`}>
            <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Aktywne alerty</p>
            <p className={`${fontSizes.title} font-bold text-red-500`}>
              <CountUp end={patient.alerts.filter(a => !a.isRead).length} duration={600} />
            </p>
          </div>

          <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-white'} border ${darkMode ? 'border-gray-600/50' : 'border-gray-200'}`}>
            <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Wyniki badań</p>
            <p className={`${fontSizes.title} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <CountUp end={patient.labResults.length} duration={700} />
            </p>
          </div>

          <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-white'} border ${darkMode ? 'border-gray-600/50' : 'border-gray-200'}`}>
            <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Dni obserwacji</p>
            <p className={`${fontSizes.title} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <CountUp end={Math.floor((new Date().getTime() - new Date(patient.createdAt).getTime()) / (1000 * 60 * 60 * 24))} duration={900} />
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* Trend parametrów */}
      <AnimatedSection animation="slideUp" delay={200}>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/30 border border-gray-600/50' : 'bg-white border border-gray-200'}`}>
          <h4 className={`${fontSizes.text} font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            📈 Aktualne parametry
          </h4>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className={`p-3 rounded-lg ${patient.currentVitalSigns.bloodPressureSystolic > 140 ? 'bg-red-500/10 border border-red-500/30' : darkMode ? 'bg-gray-600/30' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2 mb-1">
                <HeartbeatIcon size={14} className={patient.currentVitalSigns.bloodPressureSystolic > 140 ? 'text-red-500' : 'text-green-500'} />
                <span className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>RR</span>
              </div>
              <p className={`${fontSizes.subtitle} font-bold ${patient.currentVitalSigns.bloodPressureSystolic > 140 ? 'text-red-500' : darkMode ? 'text-white' : 'text-gray-900'}`}>
                {patient.currentVitalSigns.bloodPressureSystolic}/{patient.currentVitalSigns.bloodPressureDiastolic}
              </p>
              <p className={`${fontSizes.small} ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>mmHg</p>
            </div>

            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-600/30' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">❤️</span>
                <span className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>HR</span>
              </div>
              <p className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {patient.currentVitalSigns.heartRate}
              </p>
              <p className={`${fontSizes.small} ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>/min</p>
            </div>

            <div className={`p-3 rounded-lg ${patient.currentVitalSigns.oxygenSaturation < 95 ? 'bg-red-500/10 border border-red-500/30' : darkMode ? 'bg-gray-600/30' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">💨</span>
                <span className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>SpO₂</span>
              </div>
              <p className={`${fontSizes.subtitle} font-bold ${patient.currentVitalSigns.oxygenSaturation < 95 ? 'text-red-500' : darkMode ? 'text-white' : 'text-gray-900'}`}>
                {patient.currentVitalSigns.oxygenSaturation}%
              </p>
            </div>

            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-600/30' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">🌡️</span>
                <span className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Temp</span>
              </div>
              <p className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {patient.currentVitalSigns.temperature}°C
              </p>
            </div>

            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-600/30' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">💨</span>
                <span className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>RR</span>
              </div>
              <p className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {patient.currentVitalSigns.respiratoryRate}
              </p>
              <p className={`${fontSizes.small} ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>/min</p>
            </div>

            {patient.currentVitalSigns.bloodGlucose && (
              <div className={`p-3 rounded-lg ${patient.currentVitalSigns.bloodGlucose > 126 ? 'bg-red-500/10 border border-red-500/30' : darkMode ? 'bg-gray-600/30' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">🩸</span>
                  <span className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Glu</span>
                </div>
                <p className={`${fontSizes.subtitle} font-bold ${patient.currentVitalSigns.bloodGlucose > 126 ? 'text-red-500' : darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {patient.currentVitalSigns.bloodGlucose}
                </p>
                <p className={`${fontSizes.small} ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>mg/dL</p>
              </div>
            )}
          </div>
        </div>
      </AnimatedSection>

      {/* Alerty */}
      {patient.alerts.filter(a => !a.isRead).length > 0 && (
        <AnimatedSection animation="slideUp" delay={250}>
          <div className={`p-4 rounded-xl ${darkMode ? 'bg-red-500/10 border border-red-500/30' : 'bg-red-50 border border-red-200'}`}>
            <h4 className={`${fontSizes.text} font-semibold text-red-500 mb-4 flex items-center gap-2`}>
              <AlertIcon size={18} /> Aktywne alerty ({patient.alerts.filter(a => !a.isRead).length})
            </h4>

            <div className="space-y-2">
              {patient.alerts.filter(a => !a.isRead).map(alert => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-white'} border-l-4 ${
                    alert.type === 'danger' ? 'border-l-red-500' :
                    alert.type === 'warning' ? 'border-l-yellow-500' : 'border-l-blue-500'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={`${fontSizes.text} font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {alert.title}
                      </p>
                      <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {alert.message}
                      </p>
                    </div>
                    <span className={`${fontSizes.small} ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {formatDate(alert.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Timeline */}
      <AnimatedSection animation="slideUp" delay={300}>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/30 border border-gray-600/50' : 'bg-white border border-gray-200'}`}>
          <h4 className={`${fontSizes.text} font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
            📜 Oś czasu
          </h4>

          {sortedTimeline.length > 0 ? (
            <div className="timeline">
              {sortedTimeline.map((event, index) => {
                const colors = severityColors[event.severity || 'info'];
                return (
                  <div
                    key={event.id}
                    className={`timeline-item ${event.severity || 'info'}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`timeline-content ${darkMode ? 'bg-gray-600/30' : 'bg-gray-50'}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{eventTypeIcons[event.type] || '📌'}</span>
                          <h5 className={`${fontSizes.text} font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {event.title}
                          </h5>
                        </div>
                        <span className={`${fontSizes.small} ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          {formatDate(event.timestamp)}
                        </span>
                      </div>
                      <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {event.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className={`${fontSizes.text} ${darkMode ? 'text-gray-500' : 'text-gray-500'} text-center py-8`}>
              Brak wydarzeń w historii pacjenta
            </p>
          )}
        </div>
      </AnimatedSection>

      {/* Plan leczenia (jeśli istnieje) */}
      {patient.activeTreatmentPlan && (
        <AnimatedSection animation="slideUp" delay={400}>
          <div className={`p-4 rounded-xl ${darkMode ? 'bg-green-500/10 border border-green-500/30' : 'bg-green-50 border border-green-200'}`}>
            <h4 className={`${fontSizes.text} font-semibold text-green-500 mb-4`}>
              💊 Aktywny plan leczenia
            </h4>

            {patient.activeTreatmentPlan.medications.length > 0 && (
              <div className="mb-4">
                <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Leki:</p>
                <div className="flex flex-wrap gap-2">
                  {patient.activeTreatmentPlan.medications.map(med => (
                    <span
                      key={med.id}
                      className={`px-3 py-1.5 rounded-lg ${fontSizes.text} ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-700'}`}
                    >
                      {med.name} {med.dose} - {med.frequency}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {patient.activeTreatmentPlan.followUp && (
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-white'}`}>
                <p className={`${fontSizes.text} font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  📅 Następna wizyta: {formatDate(patient.activeTreatmentPlan.followUp.nextVisitDate)}
                </p>
                <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                  Parametry do monitorowania: {patient.activeTreatmentPlan.followUp.parametersToMonitor.join(', ')}
                </p>
              </div>
            )}
          </div>
        </AnimatedSection>
      )}
    </div>
  );
};

export default PatientTimeline;

