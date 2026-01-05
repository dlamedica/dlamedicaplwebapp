/**
 * Zakładka Diagnoza - rozpoznanie i diagnostyka różnicowa
 */

import React, { useState } from 'react';
import { Patient, Diagnosis } from '../types';
import { DiagnosisIcon } from '../icons/PatientIcons';
import { RippleButton, AnimatedSection } from '../../education/components';

interface PatientDiagnosisProps {
  patient: Patient;
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  onUpdatePatient: (patient: Patient) => void;
}

// Lista popularnych kodów ICD-10
const commonDiagnoses = [
  { icdCode: 'I10', name: 'Nadciśnienie tętnicze pierwotne' },
  { icdCode: 'I11', name: 'Choroba serca nadciśnieniowa' },
  { icdCode: 'I20', name: 'Dławica piersiowa' },
  { icdCode: 'I21', name: 'Ostry zawał mięśnia sercowego' },
  { icdCode: 'I25', name: 'Przewlekła choroba niedokrwienna serca' },
  { icdCode: 'I50', name: 'Niewydolność serca' },
  { icdCode: 'E10', name: 'Cukrzyca typu 1' },
  { icdCode: 'E11', name: 'Cukrzyca typu 2' },
  { icdCode: 'E78', name: 'Zaburzenia metabolizmu lipoprotein' },
  { icdCode: 'J06', name: 'Ostre zakażenie górnych dróg oddechowych' },
  { icdCode: 'J18', name: 'Zapalenie płuc' },
  { icdCode: 'J44', name: 'Przewlekła obturacyjna choroba płuc (POChP)' },
  { icdCode: 'J45', name: 'Astma oskrzelowa' },
  { icdCode: 'K29', name: 'Zapalenie żołądka i dwunastnicy' },
  { icdCode: 'K80', name: 'Kamica żółciowa' },
  { icdCode: 'N18', name: 'Przewlekła choroba nerek' },
  { icdCode: 'R51', name: 'Ból głowy' },
  { icdCode: 'R53', name: 'Złe samopoczucie i zmęczenie' },
  { icdCode: 'G43', name: 'Migrena' },
  { icdCode: 'M54', name: 'Bóle kręgosłupa' }
];

const PatientDiagnosis: React.FC<PatientDiagnosisProps> = ({
  patient,
  darkMode,
  fontSize,
  onUpdatePatient
}) => {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<{ icdCode: string; name: string } | null>(null);
  const [confidence, setConfidence] = useState<'suspected' | 'probable' | 'confirmed'>('suspected');
  const [notes, setNotes] = useState('');
  const [showDifferential, setShowDifferential] = useState(false);

  const fontSizes = {
    small: { title: 'text-lg', subtitle: 'text-base', text: 'text-sm', small: 'text-xs' },
    medium: { title: 'text-xl', subtitle: 'text-lg', text: 'text-base', small: 'text-sm' },
    large: { title: 'text-2xl', subtitle: 'text-xl', text: 'text-lg', small: 'text-base' }
  }[fontSize];

  // Filtruj diagnozy
  const filteredDiagnoses = searchTerm
    ? commonDiagnoses.filter(d => 
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.icdCode.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : commonDiagnoses;

  // Dodaj diagnozę
  const addDiagnosis = () => {
    if (!selectedDiagnosis) return;

    const newDiagnosis: Diagnosis = {
      id: `diag-${Date.now()}`,
      icdCode: selectedDiagnosis.icdCode,
      name: selectedDiagnosis.name,
      isPrimary: diagnoses.length === 0,
      confidence,
      diagnosedAt: new Date(),
      diagnosedBy: 'current-user',
      notes: notes || undefined
    };

    setDiagnoses([...diagnoses, newDiagnosis]);
    setSelectedDiagnosis(null);
    setNotes('');
    setConfidence('suspected');
    setSearchTerm('');
  };

  // Usuń diagnozę
  const removeDiagnosis = (id: string) => {
    const newDiagnoses = diagnoses.filter(d => d.id !== id);
    // Ustaw pierwszą jako primary jeśli usunięto primary
    if (newDiagnoses.length > 0 && !newDiagnoses.some(d => d.isPrimary)) {
      newDiagnoses[0].isPrimary = true;
    }
    setDiagnoses(newDiagnoses);
  };

  // Ustaw jako główną
  const setPrimaryDiagnosis = (id: string) => {
    setDiagnoses(diagnoses.map(d => ({
      ...d,
      isPrimary: d.id === id
    })));
  };

  // Sprawdź czy diagnoza jest poprawna (dla feedback)
  const isCorrectDiagnosis = (icdCode: string) => {
    return patient.currentScenario?.expectedDiagnosis.includes(icdCode);
  };

  const confidenceColors = {
    suspected: { bg: 'bg-yellow-500/20', text: 'text-yellow-500', border: 'border-yellow-500/30' },
    probable: { bg: 'bg-blue-500/20', text: 'text-blue-500', border: 'border-blue-500/30' },
    confirmed: { bg: 'bg-green-500/20', text: 'text-green-500', border: 'border-green-500/30' }
  };

  return (
    <div className="space-y-6">
      {/* Nagłówek */}
      <AnimatedSection animation="fadeIn">
        <div className={`flex items-center gap-3 p-4 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
          <div className="patient-section-icon" style={{ background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(236, 72, 153, 0.1))' }}>
            <DiagnosisIcon size={24} className="text-pink-500" />
          </div>
          <div>
            <h3 className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Rozpoznanie
            </h3>
            <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Postaw diagnozę na podstawie zebranych danych
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* Formularz dodawania diagnozy */}
      <AnimatedSection animation="slideUp" delay={100}>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/30 border border-gray-600/50' : 'bg-white border border-gray-200'}`}>
          <h4 className={`${fontSizes.text} font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Dodaj rozpoznanie
          </h4>

          {/* Wyszukiwanie */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Szukaj rozpoznania (ICD-10 lub nazwa)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg ${fontSizes.text} ${
                darkMode 
                  ? 'bg-gray-600/50 text-white placeholder-gray-400 border border-gray-500 focus:border-pink-500' 
                  : 'bg-gray-50 text-gray-900 placeholder-gray-500 border border-gray-200 focus:border-pink-500'
              } focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all`}
            />
          </div>

          {/* Lista sugestii */}
          {searchTerm && (
            <div className={`mb-4 max-h-48 overflow-y-auto rounded-lg ${darkMode ? 'bg-gray-600/30' : 'bg-gray-50'}`}>
              {filteredDiagnoses.map(diag => (
                <button
                  key={diag.icdCode}
                  onClick={() => {
                    setSelectedDiagnosis(diag);
                    setSearchTerm('');
                  }}
                  className={`w-full text-left px-4 py-2 ${fontSizes.text} ${
                    darkMode ? 'hover:bg-gray-600/50 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                  } transition-colors`}
                >
                  <span className="font-mono font-bold text-pink-500">{diag.icdCode}</span>
                  <span className="mx-2">-</span>
                  {diag.name}
                </button>
              ))}
              {filteredDiagnoses.length === 0 && (
                <p className={`px-4 py-2 ${fontSizes.text} ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Brak wyników
                </p>
              )}
            </div>
          )}

          {/* Wybrana diagnoza */}
          {selectedDiagnosis && (
            <div className={`p-4 rounded-lg mb-4 ${darkMode ? 'bg-pink-500/10 border border-pink-500/30' : 'bg-pink-50 border border-pink-200'}`}>
              <p className={`${fontSizes.text} font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <span className="font-mono text-pink-500">{selectedDiagnosis.icdCode}</span> - {selectedDiagnosis.name}
              </p>
            </div>
          )}

          {/* Pewność rozpoznania */}
          <div className="mb-4">
            <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
              Pewność rozpoznania:
            </p>
            <div className="flex gap-2">
              {(['suspected', 'probable', 'confirmed'] as const).map(conf => (
                <button
                  key={conf}
                  onClick={() => setConfidence(conf)}
                  className={`px-4 py-2 rounded-lg ${fontSizes.small} font-medium transition-all ${
                    confidence === conf
                      ? `${confidenceColors[conf].bg} ${confidenceColors[conf].text} border ${confidenceColors[conf].border}`
                      : darkMode
                        ? 'bg-gray-600/50 text-gray-400 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {conf === 'suspected' ? '🤔 Podejrzenie' : conf === 'probable' ? '📊 Prawdopodobne' : '✓ Potwierdzone'}
                </button>
              ))}
            </div>
          </div>

          {/* Notatki */}
          <div className="mb-4">
            <textarea
              placeholder="Dodatkowe uwagi (opcjonalne)..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className={`w-full px-4 py-3 rounded-lg ${fontSizes.text} ${
                darkMode 
                  ? 'bg-gray-600/50 text-white placeholder-gray-400 border border-gray-500 focus:border-pink-500' 
                  : 'bg-gray-50 text-gray-900 placeholder-gray-500 border border-gray-200 focus:border-pink-500'
              } focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all resize-none`}
            />
          </div>

          <RippleButton
            onClick={addDiagnosis}
            variant="primary"
            darkMode={darkMode}
            disabled={!selectedDiagnosis}
            className={`w-full py-3 rounded-lg ${fontSizes.text} font-semibold`}
          >
            Dodaj rozpoznanie
          </RippleButton>
        </div>
      </AnimatedSection>

      {/* Lista postawionych diagnoz */}
      {diagnoses.length > 0 && (
        <AnimatedSection animation="slideUp" delay={200}>
          <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/30 border border-gray-600/50' : 'bg-white border border-gray-200'}`}>
            <h4 className={`${fontSizes.text} font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              Postawione rozpoznania ({diagnoses.length})
            </h4>

            <div className="space-y-3">
              {diagnoses.map((diag, index) => (
                <div
                  key={diag.id}
                  className={`p-4 rounded-lg border ${
                    diag.isPrimary
                      ? darkMode ? 'bg-pink-500/10 border-pink-500/30' : 'bg-pink-50 border-pink-200'
                      : darkMode ? 'bg-gray-600/30 border-gray-600/50' : 'bg-gray-50 border-gray-200'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {diag.isPrimary && (
                          <span className="px-2 py-0.5 rounded text-xs font-bold bg-pink-500 text-white">
                            GŁÓWNE
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${confidenceColors[diag.confidence].bg} ${confidenceColors[diag.confidence].text}`}>
                          {diag.confidence === 'suspected' ? 'Podejrzenie' : diag.confidence === 'probable' ? 'Prawdopodobne' : 'Potwierdzone'}
                        </span>
                      </div>
                      <p className={`${fontSizes.text} font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        <span className="font-mono text-pink-500">{diag.icdCode}</span> - {diag.name}
                      </p>
                      {diag.notes && (
                        <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                          {diag.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {!diag.isPrimary && (
                        <button
                          onClick={() => setPrimaryDiagnosis(diag.id)}
                          className={`px-2 py-1 rounded ${fontSizes.small} ${
                            darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-600' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
                          }`}
                        >
                          Ustaw główne
                        </button>
                      )}
                      <button
                        onClick={() => removeDiagnosis(diag.id)}
                        className={`px-2 py-1 rounded ${fontSizes.small} text-red-500 hover:bg-red-500/20`}
                      >
                        Usuń
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Wskazówka */}
      <AnimatedSection animation="fadeIn" delay={300}>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
          <p className={`${fontSizes.text} font-medium ${darkMode ? 'text-blue-300' : 'text-blue-700'} mb-2`}>
            💡 Wskazówki
          </p>
          <ul className={`${fontSizes.small} ${darkMode ? 'text-blue-200' : 'text-blue-600'} space-y-1`}>
            <li>• Zawsze rozważ diagnostykę różnicową przed postawieniem ostatecznej diagnozy</li>
            <li>• Podstawą rozpoznania powinny być zebrane dane z wywiadu, badania i badań dodatkowych</li>
            <li>• Pierwsza diagnoza będzie traktowana jako główna - możesz to zmienić</li>
          </ul>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default PatientDiagnosis;

