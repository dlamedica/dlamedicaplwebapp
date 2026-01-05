/**
 * Karta pacjenta z zakładkami
 * Główny widok szczegółów pacjenta w module "Mój pacjent"
 */

import React, { useState } from 'react';
import { Patient, PatientCardTab } from './types';
import {
  PatientIcon,
  HeartbeatIcon,
  StethoscopeIcon,
  LabTestIcon,
  DiagnosisIcon,
  TreatmentIcon,
  InterviewIcon,
  TimelineIcon,
  AlertIcon,
  StableIcon,
  UrgentIcon,
  CriticalIcon,
  ImprovingIcon,
  WorseningIcon,
  ProfileDataIcon,
  ExaminationIcon,
  ClockIcon
} from './icons/PatientIcons';
import { RippleButton, AnimatedSection } from '../education/components';
import PatientBasicData from './tabs/PatientBasicData';
import PatientInterview from './tabs/PatientInterview';
import PatientExamination from './tabs/PatientExamination';
import PatientPhysicalExam from './tabs/PatientPhysicalExam';
import PatientLabTests from './tabs/PatientLabTests';
import PatientDiagnosis from './tabs/PatientDiagnosis';
import PatientTreatment from './tabs/PatientTreatment';
import PatientTimeline from './tabs/PatientTimeline';
import PatientAvatar from './components/PatientAvatar';
import { BodyMapIcon } from './icons/PatientIcons';
import './styles/myPatientStyles.css';

interface PatientCardProps {
  patient: Patient;
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  onBack: () => void;
  onUpdatePatient: (patient: Patient) => void;
}

const PatientCard: React.FC<PatientCardProps> = ({
  patient,
  darkMode,
  fontSize,
  onBack,
  onUpdatePatient
}) => {
  const [activeTab, setActiveTab] = useState<string>('basic');

  const fontSizes = {
    small: {
      title: 'text-xl',
      subtitle: 'text-base',
      text: 'text-sm',
      small: 'text-xs'
    },
    medium: {
      title: 'text-2xl',
      subtitle: 'text-lg',
      text: 'text-base',
      small: 'text-sm'
    },
    large: {
      title: 'text-3xl',
      subtitle: 'text-xl',
      text: 'text-lg',
      small: 'text-base'
    }
  }[fontSize];

  // Definicja zakładek
  const tabs: PatientCardTab[] = [
    {
      id: 'basic',
      name: 'Przegląd',
      icon: 'ProfileDataIcon',
      component: 'PatientBasicData',
      isActive: activeTab === 'basic'
    },
    {
      id: 'interview',
      name: 'Wywiad',
      icon: 'InterviewIcon',
      component: 'PatientInterview',
      isActive: activeTab === 'interview'
    },
    {
      id: 'physicalExam',
      name: 'Badanie fizykalne',
      icon: 'BodyMapIcon',
      component: 'PatientPhysicalExam',
      isActive: activeTab === 'physicalExam'
    },
    {
      id: 'examination',
      name: 'Badania pomocnicze',
      icon: 'ExaminationIcon',
      component: 'PatientExamination',
      isActive: activeTab === 'examination'
    },
    {
      id: 'labs',
      name: 'Badania laboratoryjne',
      icon: 'LabTestIcon',
      component: 'PatientLabTests',
      isActive: activeTab === 'labs'
    },
    {
      id: 'diagnosis',
      name: 'Diagnoza',
      icon: 'DiagnosisIcon',
      component: 'PatientDiagnosis',
      isActive: activeTab === 'diagnosis'
    },
    {
      id: 'treatment',
      name: 'Plan leczenia',
      icon: 'TreatmentIcon',
      component: 'PatientTreatment',
      isActive: activeTab === 'treatment'
    },
    {
      id: 'timeline',
      name: 'Historia',
      icon: 'TimelineIcon',
      component: 'PatientTimeline',
      isActive: activeTab === 'timeline',
      hasAlerts: patient.alerts.filter(a => !a.isRead).length > 0,
      alertCount: patient.alerts.filter(a => !a.isRead).length
    }
  ];

  // Ikony dla zakładek
  const tabIcons: { [key: string]: React.FC<{ size?: number; className?: string }> } = {
    ProfileDataIcon,
    InterviewIcon,
    BodyMapIcon,
    ExaminationIcon,
    LabTestIcon,
    DiagnosisIcon,
    TreatmentIcon,
    TimelineIcon
  };

  // Status badge
  const renderStatusBadge = () => {
    const statusConfig = {
      stable: { icon: StableIcon, label: 'Stabilny', color: '#10b981' },
      urgent: { icon: UrgentIcon, label: 'Pilny', color: '#f59e0b' },
      critical: { icon: CriticalIcon, label: 'Krytyczny', color: '#ef4444' },
      improving: { icon: ImprovingIcon, label: 'Poprawa', color: '#22c55e' },
      worsening: { icon: WorseningIcon, label: 'Pogorszenie', color: '#f87171' }
    };

    const config = statusConfig[patient.status];
    const StatusIcon = config.icon;

    return (
      <span className={`status-badge ${patient.status}`}>
        <StatusIcon size={14} color={config.color} />
        {config.label}
      </span>
    );
  };

  // Określ status dla awatara
  const getAvatarStatus = (): 'stable' | 'warning' | 'critical' => {
    if (patient.status === 'critical') return 'critical';
    if (patient.status === 'urgent' || patient.status === 'worsening') return 'warning';
    return 'stable';
  };

  // Renderuj aktywną zakładkę
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'basic':
        return <PatientBasicData patient={patient} darkMode={darkMode} fontSize={fontSize} />;
      case 'interview':
        return <PatientInterview patient={patient} darkMode={darkMode} fontSize={fontSize} onUpdatePatient={onUpdatePatient} />;
      case 'physicalExam':
        return <PatientPhysicalExam patient={patient} darkMode={darkMode} fontSize={fontSize} onUpdatePatient={onUpdatePatient} />;
      case 'examination':
        return <PatientExamination patient={patient} darkMode={darkMode} fontSize={fontSize} onUpdatePatient={onUpdatePatient} />;
      case 'labs':
        return <PatientLabTests patient={patient} darkMode={darkMode} fontSize={fontSize} onUpdatePatient={onUpdatePatient} />;
      case 'diagnosis':
        return <PatientDiagnosis patient={patient} darkMode={darkMode} fontSize={fontSize} onUpdatePatient={onUpdatePatient} />;
      case 'treatment':
        return <PatientTreatment patient={patient} darkMode={darkMode} fontSize={fontSize} onUpdatePatient={onUpdatePatient} />;
      case 'timeline':
        return <PatientTimeline patient={patient} darkMode={darkMode} fontSize={fontSize} />;
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'}`}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Nagłówek */}
        <AnimatedSection animation="fadeIn">
          <div className="mb-6">
            <RippleButton
              onClick={onBack}
              variant="outline"
              darkMode={darkMode}
              className="mb-4 px-4 py-2 rounded-lg"
            >
              ← Powrót do listy
            </RippleButton>

            <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-white/80 border border-gray-200/50'} shadow-xl glass-effect`}>
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Avatar pacjenta z sylwetką */}
                <PatientAvatar
                  gender={patient.demographics.gender}
                  ageGroup={patient.demographics.age > 65 ? 'senior' : patient.demographics.age > 40 ? 'middle' : 'young'}
                  status={getAvatarStatus()}
                  size="lg"
                  showStatusRing={true}
                />

                {/* Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h1 className={`${fontSizes.title} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {patient.name}
                    </h1>
                    {renderStatusBadge()}
                    <span className={`difficulty-badge level-${patient.difficultyLevel}`}>
                      Poziom {patient.difficultyLevel}
                    </span>
                  </div>

                  <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                    {patient.demographics.age} lat, {patient.demographics.gender === 'male' ? 'mężczyzna' : 'kobieta'} • {patient.demographics.occupation}
                  </p>

                  <p className={`${fontSizes.small} ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    <strong>Scenariusz:</strong> {patient.currentScenario?.name} ({patient.currentScenario?.category})
                  </p>
                </div>

                {/* Parametry życiowe - skrót */}
                <div className={`flex flex-wrap gap-4 p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                  <div className="text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <HeartbeatIcon size={16} className={patient.currentVitalSigns.bloodPressureSystolic > 140 ? 'text-red-500' : 'text-green-500'} />
                      <span className={`${fontSizes.text} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {patient.currentVitalSigns.bloodPressureSystolic}/{patient.currentVitalSigns.bloodPressureDiastolic}
                      </span>
                    </div>
                    <span className={`${fontSizes.small} ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>RR</span>
                  </div>

                  <div className="text-center">
                    <span className={`${fontSizes.text} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {patient.currentVitalSigns.heartRate}
                    </span>
                    <span className={`${fontSizes.small} ${darkMode ? 'text-gray-500' : 'text-gray-500'} block`}>HR</span>
                  </div>

                  <div className="text-center">
                    <span className={`${fontSizes.text} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {patient.currentVitalSigns.oxygenSaturation}%
                    </span>
                    <span className={`${fontSizes.small} ${darkMode ? 'text-gray-500' : 'text-gray-500'} block`}>SpO₂</span>
                  </div>

                  <div className="text-center">
                    <span className={`${fontSizes.text} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {patient.currentVitalSigns.temperature}°C
                    </span>
                    <span className={`${fontSizes.small} ${darkMode ? 'text-gray-500' : 'text-gray-500'} block`}>Temp</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Zakładki */}
        <AnimatedSection animation="slideUp" delay={100}>
          <div className={`rounded-2xl ${darkMode ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-white/80 border border-gray-200/50'} shadow-xl glass-effect overflow-hidden`}>
            {/* Nawigacja zakładek */}
            <div className={`p-4 border-b ${darkMode ? 'border-gray-700/50' : 'border-gray-200'}`}>
              <div className="patient-tabs">
                {tabs.map(tab => {
                  const TabIcon = tabIcons[tab.icon];
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`patient-tab ${tab.isActive ? 'active' : ''} ${
                        darkMode 
                          ? tab.isActive ? 'bg-blue-600/20 text-blue-400' : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
                          : tab.isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                      }`}
                    >
                      {TabIcon && <TabIcon size={18} className={tab.isActive ? 'text-blue-500' : ''} />}
                      <span className={fontSizes.small}>{tab.name}</span>
                      {tab.hasAlerts && tab.alertCount && tab.alertCount > 0 && (
                        <span className="patient-tab-badge">{tab.alertCount}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Zawartość zakładki */}
            <div className="p-6">
              {renderActiveTab()}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default PatientCard;

