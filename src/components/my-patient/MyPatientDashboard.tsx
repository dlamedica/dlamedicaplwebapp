/**
 * Dashboard modułu "Mój pacjent"
 * Główny widok z listą pacjentów, alertami i statystykami użytkownika
 */

import React, { useState, useEffect } from 'react';
import { Patient, PatientAlert, UserProgress, PatientStatus } from './types';
import { samplePatients, userLevels, achievements } from './data/samplePatients';
import {
  PatientIcon,
  HeartbeatIcon,
  AlertIcon,
  StableIcon,
  UrgentIcon,
  CriticalIcon,
  ImprovingIcon,
  WorseningIcon,
  ScoreIcon,
  LevelIcon,
  ClockIcon,
  PlusIcon,
  AchievementIcon
} from './icons/PatientIcons';
import { RippleButton, CountUp, AnimatedSection } from '../education/components';
import PatientAvatar from './components/PatientAvatar';
import './styles/myPatientStyles.css';

interface MyPatientDashboardProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  onSelectPatient: (patient: Patient) => void;
}

const MyPatientDashboard: React.FC<MyPatientDashboardProps> = ({
  darkMode,
  fontSize,
  onSelectPatient
}) => {
  const [patients, setPatients] = useState<Patient[]>(samplePatients);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    id: 'user-1',
    userId: 'current-user',
    totalScore: 450,
    level: 3,
    levelName: 'Stażysta',
    experiencePoints: 450,
    experienceToNextLevel: 600,
    patientsCompleted: 5,
    averageScore: 78,
    strongAreas: ['Wywiad', 'Badanie przedmiotowe'],
    weakAreas: ['Diagnostyka różnicowa'],
    achievements: achievements.map((a, i) => ({ ...a, isUnlocked: i < 3 })),
    unlockedDifficulties: [1, 2],
    statistics: {
      totalEncounters: 23,
      totalDiagnoses: 18,
      correctDiagnoses: 14,
      averageResponseTime: 15,
      averageLabCost: 45,
      patientsImproved: 4,
      patientsWorsened: 1,
      criticalMistakes: 2,
      perfectScores: 1
    }
  });
  const [selectedFilter, setSelectedFilter] = useState<'all' | PatientStatus>('all');
  const [showAlerts, setShowAlerts] = useState(true);

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

  // Oblicz statystyki
  const stats = {
    total: patients.length,
    stable: patients.filter(p => p.status === 'stable').length,
    urgent: patients.filter(p => p.status === 'urgent').length,
    critical: patients.filter(p => p.status === 'critical').length,
    improving: patients.filter(p => p.status === 'improving').length,
    worsening: patients.filter(p => p.status === 'worsening').length
  };

  // Zbierz wszystkie alerty
  const allAlerts = patients.flatMap(p => 
    p.alerts.filter(a => !a.isRead).map(a => ({ ...a, patientName: p.name }))
  );

  // Filtruj pacjentów
  const filteredPatients = selectedFilter === 'all' 
    ? patients 
    : patients.filter(p => p.status === selectedFilter);

  // Renderuj status badge
  const renderStatusBadge = (status: PatientStatus) => {
    const statusConfig = {
      stable: { icon: StableIcon, label: 'Stabilny', color: '#10b981' },
      urgent: { icon: UrgentIcon, label: 'Pilny', color: '#f59e0b' },
      critical: { icon: CriticalIcon, label: 'Krytyczny', color: '#ef4444' },
      improving: { icon: ImprovingIcon, label: 'Poprawa', color: '#22c55e' },
      worsening: { icon: WorseningIcon, label: 'Pogorszenie', color: '#f87171' }
    };

    const config = statusConfig[status];
    const StatusIcon = config.icon;

    return (
      <span className={`status-badge ${status}`}>
        <StatusIcon size={14} color={config.color} />
        {config.label}
      </span>
    );
  };

  // Oblicz postęp do następnego poziomu
  const currentLevel = userLevels.find(l => l.level === userProgress.level);
  const nextLevel = userLevels.find(l => l.level === userProgress.level + 1);
  const progressToNext = currentLevel && nextLevel 
    ? ((userProgress.experiencePoints - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP)) * 100
    : 0;

  return (
    <div className={`my-patient-dashboard ${darkMode ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'}`}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Nagłówek */}
        <AnimatedSection animation="fadeIn">
          <div className="my-patient-header mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className={`${fontSizes.title} font-bold mb-2 bg-gradient-to-r ${darkMode ? 'from-white via-blue-200 to-cyan-200' : 'from-gray-900 via-blue-600 to-cyan-600'} bg-clip-text text-transparent`}>
                  Mój Pacjent
                </h1>
                <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Symulator przypadków klinicznych - rozwijaj swoje umiejętności diagnostyczne
                </p>
              </div>
              
              <RippleButton
                onClick={() => console.log('Nowy pacjent')}
                variant="primary"
                darkMode={darkMode}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-lg"
              >
                <PlusIcon size={20} />
                Nowy pacjent
              </RippleButton>
            </div>
          </div>
        </AnimatedSection>

        {/* Statystyki użytkownika */}
        <AnimatedSection animation="slideUp" delay={100}>
          <div className={`rounded-2xl p-6 mb-8 ${darkMode ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-white/80 border border-gray-200/50'} shadow-xl glass-effect`}>
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              {/* Poziom i XP */}
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${darkMode ? 'bg-gradient-to-br from-blue-600/30 to-cyan-600/20' : 'bg-gradient-to-br from-blue-100 to-cyan-100'}`}>
                  <LevelIcon size={40} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
                </div>
                <div>
                  <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Poziom {userProgress.level}</p>
                  <p className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {userProgress.levelName}
                  </p>
                  <div className="mt-2 w-48">
                    <div className={`xp-progress ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <div className="xp-progress-fill" style={{ width: `${progressToNext}%` }} />
                    </div>
                    <p className={`${fontSizes.small} mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {userProgress.experiencePoints} / {nextLevel?.minXP || '∞'} XP
                    </p>
                  </div>
                </div>
              </div>

              {/* Statystyki */}
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <ScoreIcon size={16} className="text-yellow-500" />
                    <span className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Punkty</span>
                  </div>
                  <p className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <CountUp end={userProgress.totalScore} duration={1500} />
                  </p>
                </div>

                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <PatientIcon size={16} className="text-green-500" />
                    <span className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Ukończeni</span>
                  </div>
                  <p className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <CountUp end={userProgress.patientsCompleted} duration={1000} />
                  </p>
                </div>

                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <HeartbeatIcon size={16} className="text-red-500" />
                    <span className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Średnia</span>
                  </div>
                  <p className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <CountUp end={userProgress.averageScore} duration={1200} suffix="%" />
                  </p>
                </div>

                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <AchievementIcon size={16} className="text-purple-500" />
                    <span className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Osiągnięcia</span>
                  </div>
                  <p className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <CountUp end={userProgress.achievements.filter(a => a.isUnlocked).length} duration={800} />/{userProgress.achievements.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Główna zawartość */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista pacjentów */}
          <div className="lg:col-span-2">
            <AnimatedSection animation="slideUp" delay={200}>
              {/* Filtry */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className={`${fontSizes.text} font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Filtruj:
                </span>
                {[
                  { id: 'all', label: 'Wszyscy', count: stats.total },
                  { id: 'urgent', label: 'Pilni', count: stats.urgent },
                  { id: 'critical', label: 'Krytyczni', count: stats.critical },
                  { id: 'stable', label: 'Stabilni', count: stats.stable },
                  { id: 'improving', label: 'Poprawa', count: stats.improving },
                  { id: 'worsening', label: 'Pogorszenie', count: stats.worsening }
                ].map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id as any)}
                    className={`px-4 py-2 rounded-lg ${fontSizes.small} font-medium transition-all ${
                      selectedFilter === filter.id
                        ? 'bg-gradient-to-r from-[#38b6ff] to-[#2a9fe5] text-white shadow-lg'
                        : darkMode
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter.label}
                    {filter.count > 0 && (
                      <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                        selectedFilter === filter.id
                          ? 'bg-white/20'
                          : darkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`}>
                        {filter.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Lista pacjentów */}
              <div className="patient-list">
                {filteredPatients.length === 0 ? (
                  <div className={`text-center py-12 rounded-2xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
                    <PatientIcon size={48} className={`mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Brak pacjentów w tej kategorii
                    </p>
                  </div>
                ) : (
                  filteredPatients.map((patient, index) => (
                    <div
                      key={patient.id}
                      className={`patient-card status-${patient.status} ${darkMode ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-white/80 border border-gray-200/50'} glass-effect cursor-pointer`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                      onClick={() => onSelectPatient(patient)}
                    >
                      <div className="flex items-start gap-4">
                        {/* Avatar pacjenta z sylwetką */}
                        <PatientAvatar
                          gender={patient.demographics.gender}
                          ageGroup={patient.demographics.age > 65 ? 'senior' : patient.demographics.age > 40 ? 'middle' : 'young'}
                          status={patient.status === 'critical' ? 'critical' : 
                                 patient.status === 'urgent' || patient.status === 'worsening' ? 'warning' : 'stable'}
                          size="md"
                          showStatusRing={true}
                        />

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'} truncate`}>
                              {patient.name}
                            </h3>
                            {renderStatusBadge(patient.status)}
                            <span className={`difficulty-badge level-${patient.difficultyLevel}`}>
                              Poz. {patient.difficultyLevel}
                            </span>
                          </div>

                          <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                            {patient.demographics.age} lat, {patient.demographics.gender === 'male' ? 'mężczyzna' : 'kobieta'} • {patient.demographics.occupation}
                          </p>

                          <p className={`${fontSizes.small} ${darkMode ? 'text-gray-500' : 'text-gray-500'} mb-3`}>
                            <strong>Scenariusz:</strong> {patient.currentScenario?.name}
                          </p>

                          {/* Objawy i alerty */}
                          {patient.currentSymptoms.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {patient.currentSymptoms.slice(0, 3).map(symptom => (
                                <span
                                  key={symptom.id}
                                  className={`px-2 py-1 rounded-lg ${fontSizes.small} ${
                                    symptom.isNew
                                      ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'
                                      : darkMode
                                        ? 'bg-gray-700 text-gray-300'
                                        : 'bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  {symptom.isNew && '⚡ '}
                                  {symptom.name}
                                </span>
                              ))}
                              {patient.currentSymptoms.length > 3 && (
                                <span className={`px-2 py-1 rounded-lg ${fontSizes.small} ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                                  +{patient.currentSymptoms.length - 3}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Parametry życiowe */}
                          <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-1">
                              <HeartbeatIcon size={14} className={patient.currentVitalSigns.bloodPressureSystolic > 140 ? 'text-red-500' : 'text-green-500'} />
                              <span className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {patient.currentVitalSigns.bloodPressureSystolic}/{patient.currentVitalSigns.bloodPressureDiastolic}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className={`${fontSizes.small} ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>HR</span>
                              <span className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {patient.currentVitalSigns.heartRate}
                              </span>
                            </div>
                            {patient.currentVitalSigns.bloodGlucose && (
                              <div className="flex items-center gap-1">
                                <span className={`${fontSizes.small} ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Glu</span>
                                <span className={`${fontSizes.small} ${patient.currentVitalSigns.bloodGlucose > 126 ? 'text-red-500' : darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {patient.currentVitalSigns.bloodGlucose}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Alerty i czas */}
                        <div className="flex flex-col items-end gap-2">
                          {patient.alerts.filter(a => !a.isRead).length > 0 && (
                            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/20 text-red-500">
                              <AlertIcon size={14} />
                              <span className={fontSizes.small}>{patient.alerts.filter(a => !a.isRead).length}</span>
                            </div>
                          )}
                          <div className={`flex items-center gap-1 ${fontSizes.small} ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            <ClockIcon size={12} />
                            {formatTimeAgo(patient.lastInteraction)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </AnimatedSection>
          </div>

          {/* Panel boczny - Alerty i osiągnięcia */}
          <div className="space-y-6">
            {/* Alerty */}
            <AnimatedSection animation="slideLeft" delay={300}>
              <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-white/80 border border-gray-200/50'} shadow-xl glass-effect`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                    <AlertIcon size={20} className="text-red-500" />
                    Alerty
                    {allAlerts.length > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white">
                        {allAlerts.length}
                      </span>
                    )}
                  </h2>
                  <button
                    onClick={() => setShowAlerts(!showAlerts)}
                    className={`${fontSizes.small} ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    {showAlerts ? 'Zwiń' : 'Rozwiń'}
                  </button>
                </div>

                {showAlerts && (
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {allAlerts.length === 0 ? (
                      <p className={`${fontSizes.text} ${darkMode ? 'text-gray-500' : 'text-gray-500'} text-center py-4`}>
                        Brak nowych alertów
                      </p>
                    ) : (
                      allAlerts.map((alert: any) => (
                        <div key={alert.id} className={`alert-card ${alert.type}`}>
                          <div className="flex items-start gap-2">
                            <AlertIcon size={16} className={
                              alert.type === 'danger' ? 'text-red-500' :
                              alert.type === 'warning' ? 'text-yellow-500' :
                              alert.type === 'success' ? 'text-green-500' : 'text-blue-500'
                            } />
                            <div>
                              <p className={`${fontSizes.small} font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {alert.patientName}
                              </p>
                              <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {alert.title}
                              </p>
                              <p className={`${fontSizes.small} ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>
                                {alert.message}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </AnimatedSection>

            {/* Osiągnięcia */}
            <AnimatedSection animation="slideLeft" delay={400}>
              <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-white/80 border border-gray-200/50'} shadow-xl glass-effect`}>
                <h2 className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2 mb-4`}>
                  <AchievementIcon size={20} className="text-yellow-500" />
                  Ostatnie osiągnięcia
                </h2>

                <div className="space-y-3">
                  {userProgress.achievements.filter(a => a.isUnlocked).slice(0, 4).map(achievement => (
                    <div
                      key={achievement.id}
                      className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}
                    >
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <p className={`${fontSizes.small} font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {achievement.name}
                        </p>
                        <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <button className={`w-full mt-4 py-2 rounded-lg ${fontSizes.small} font-medium ${
                  darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors`}>
                  Zobacz wszystkie
                </button>
              </div>
            </AnimatedSection>

            {/* Szybkie statystyki */}
            <AnimatedSection animation="slideLeft" delay={500}>
              <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-white/80 border border-gray-200/50'} shadow-xl glass-effect`}>
                <h2 className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                  Twoje statystyki
                </h2>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Trafność diagnoz</span>
                      <span className={`${fontSizes.small} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {Math.round((userProgress.statistics.correctDiagnoses / userProgress.statistics.totalDiagnoses) * 100)}%
                      </span>
                    </div>
                    <div className={`h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                        style={{ width: `${(userProgress.statistics.correctDiagnoses / userProgress.statistics.totalDiagnoses) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Pacjenci z poprawą</span>
                      <span className={`${fontSizes.small} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {userProgress.statistics.patientsImproved}/{userProgress.patientsCompleted}
                      </span>
                    </div>
                    <div className={`h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                        style={{ width: `${(userProgress.statistics.patientsImproved / userProgress.patientsCompleted) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className={`p-3 rounded-xl text-center ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                      <p className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {userProgress.statistics.totalEncounters}
                      </p>
                      <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Wizyt</p>
                    </div>
                    <div className={`p-3 rounded-xl text-center ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                      <p className={`${fontSizes.subtitle} font-bold text-yellow-500`}>
                        {userProgress.statistics.perfectScores}
                      </p>
                      <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Idealne</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper: formatowanie czasu
const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}m temu`;
  if (hours < 24) return `${hours}h temu`;
  return `${days}d temu`;
};

export default MyPatientDashboard;

