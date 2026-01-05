/**
 * Zakładka Wywiad - zbieranie wywiadu od pacjenta
 */

import React, { useState } from 'react';
import { Patient, InterviewQuestion, InterviewResponse } from '../types';
import { interviewQuestions } from '../data/samplePatients';
import { InterviewIcon, CostIcon, ClockIcon } from '../icons/PatientIcons';
import { RippleButton, AnimatedSection } from '../../education/components';

interface PatientInterviewProps {
  patient: Patient;
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  onUpdatePatient: (patient: Patient) => void;
}

const PatientInterview: React.FC<PatientInterviewProps> = ({
  patient,
  darkMode,
  fontSize,
  onUpdatePatient
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('wszystkie');
  const [askedQuestions, setAskedQuestions] = useState<InterviewResponse[]>([]);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const fontSizes = {
    small: { title: 'text-lg', subtitle: 'text-base', text: 'text-sm', small: 'text-xs' },
    medium: { title: 'text-xl', subtitle: 'text-lg', text: 'text-base', small: 'text-sm' },
    large: { title: 'text-2xl', subtitle: 'text-xl', text: 'text-lg', small: 'text-base' }
  }[fontSize];

  // Kategorie pytań
  const categories = ['wszystkie', 'główny', 'objawy', 'przeszłość', 'rodzina', 'społeczny', 'serce', 'metabolizm', 'neurologia'];

  // Filtruj pytania
  const filteredQuestions = selectedCategory === 'wszystkie'
    ? interviewQuestions
    : interviewQuestions.filter(q => q.category === selectedCategory);

  // Sprawdź czy pytanie było zadane
  const isQuestionAsked = (questionId: string) => {
    return askedQuestions.some(q => q.questionId === questionId);
  };

  // Generuj odpowiedź pacjenta
  const generatePatientResponse = (question: InterviewQuestion): string => {
    // Przykładowe odpowiedzi na podstawie scenariusza i stanu pacjenta
    const responses: { [key: string]: string } = {
      'q-chief-complaint': `Przyszedłem/am, bo od jakiegoś czasu mam ${patient.currentSymptoms[0]?.name || 'różne dolegliwości'}. To mnie niepokoi.`,
      'q-symptom-onset': `To zaczęło się ${patient.currentSymptoms[0]?.duration || 'niedawno'}.`,
      'q-symptom-character': patient.currentSymptoms[0]?.character || 'Trudno to opisać...',
      'q-symptom-severity': patient.currentSymptoms[0]?.severity === 'severe' ? '8' : patient.currentSymptoms[0]?.severity === 'moderate' ? '5' : '3',
      'q-aggravating': patient.currentSymptoms[0]?.aggravatingFactors?.join(', ') || 'Wysiłek fizyczny, stres',
      'q-relieving': patient.currentSymptoms[0]?.relievingFactors?.join(', ') || 'Odpoczynek, leki przeciwbólowe',
      'q-past-medical': patient.chronicConditions.length > 0 ? patient.chronicConditions.join(', ') : 'Dotychczas byłem/am zdrowy/a.',
      'q-medications': patient.currentMedications.length > 0 
        ? patient.currentMedications.map(m => `${m.name} ${m.dose}`).join(', ')
        : 'Nie biorę żadnych leków na stałe.',
      'q-allergies': patient.demographics.allergies.length > 0
        ? `Tak, jestem uczulony/a na ${patient.demographics.allergies.join(', ')}.`
        : 'Nie, o żadnych alergiach nie wiem.',
      'q-surgeries': 'Nie, nie miałem/am żadnych operacji.',
      'q-family-history': patient.demographics.familyHistory.length > 0
        ? patient.demographics.familyHistory.join('. ')
        : 'W rodzinie nikt poważnie nie chorował.',
      'q-smoking': patient.demographics.lifestyle.smoking === 'current' 
        ? `Tak, palę od lat. Około ${patient.demographics.lifestyle.smokingPackYears || 10} paczkolat.`
        : patient.demographics.lifestyle.smoking === 'former'
          ? 'Paliłem/am kiedyś, ale rzuciłem/am.'
          : 'Nie, nigdy nie paliłem/am.',
      'q-alcohol': patient.demographics.lifestyle.alcohol === 'heavy'
        ? 'Piję regularnie, może za dużo.'
        : patient.demographics.lifestyle.alcohol === 'moderate'
          ? 'Piję umiarkowanie, głównie w weekendy.'
          : patient.demographics.lifestyle.alcohol === 'occasional'
            ? 'Tylko okazjonalnie, przy świętach.'
            : 'Nie piję alkoholu.',
      'q-physical-activity': patient.demographics.lifestyle.physicalActivity === 'active'
        ? 'Regularnie ćwiczę, 3-4 razy w tygodniu.'
        : patient.demographics.lifestyle.physicalActivity === 'moderate'
          ? 'Staram się spacerować, czasem pływam.'
          : patient.demographics.lifestyle.physicalActivity === 'light'
            ? 'Mało się ruszam, głównie spacery.'
            : 'Prawie się nie ruszam, siedzący tryb życia.',
      'q-headache': patient.currentSymptoms.some(s => s.name.toLowerCase().includes('głow'))
        ? 'Tak, mam bóle głowy.'
        : 'Nie, głowa mnie nie boli.',
      'q-headache-location': patient.currentSymptoms.find(s => s.name.toLowerCase().includes('głow'))?.location || 'W okolicy potylicy.',
      'q-dizziness': patient.currentSymptoms.some(s => s.name.toLowerCase().includes('zawrot'))
        ? 'Tak, miewam zawroty głowy.'
        : 'Nie, zawrotów głowy nie mam.',
      'q-chest-pain': 'Nie, bólu w klatce piersiowej nie mam.',
      'q-dyspnea': 'Czasem przy wysiłku mam problem z oddechem.',
      'q-polyuria': patient.currentSymptoms.some(s => s.name.toLowerCase().includes('mocz'))
        ? 'Tak, oddaję mocz częściej niż zwykle.'
        : 'Nie zauważyłem/am zmian.',
      'q-polydipsia': patient.currentSymptoms.some(s => s.name.toLowerCase().includes('pragn'))
        ? 'Tak, ostatnio bardzo dużo piję.'
        : 'Nie, pragnienie mam normalne.'
    };

    return responses[question.id] || 'Hmm, muszę się zastanowić... Nie jestem pewien/pewna.';
  };

  // Zadaj pytanie
  const askQuestion = (question: InterviewQuestion) => {
    if (isQuestionAsked(question.id)) return;

    const response: InterviewResponse = {
      questionId: question.id,
      response: '',
      generatedAnswer: generatePatientResponse(question),
      askedAt: new Date(),
      wasRelevant: question.relatedSymptoms?.some(s => 
        patient.currentSymptoms.some(ps => ps.name.toLowerCase().includes(s.toLowerCase()))
      ) || false
    };

    setAskedQuestions([...askedQuestions, response]);
    setExpandedQuestion(question.id);
  };

  // Pobierz odpowiedź na pytanie
  const getQuestionResponse = (questionId: string): InterviewResponse | undefined => {
    return askedQuestions.find(q => q.questionId === questionId);
  };

  // Oblicz całkowity koszt
  const totalCost = askedQuestions.reduce((sum, q) => {
    const question = interviewQuestions.find(iq => iq.id === q.questionId);
    return sum + (question?.cost || 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Nagłówek z kosztami */}
      <AnimatedSection animation="fadeIn">
        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
          <div className="flex items-center gap-3">
            <div className="patient-section-icon">
              <InterviewIcon size={24} className="text-blue-500" />
            </div>
            <div>
              <h3 className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Wywiad z pacjentem
              </h3>
              <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Zadawaj pytania, aby zebrać informacje o dolegliwościach
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-600/50' : 'bg-white'}`}>
              <ClockIcon size={16} className="text-blue-500" />
              <span className={`${fontSizes.small} font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Zadano: {askedQuestions.length} pytań
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

      {/* Kategorie */}
      <AnimatedSection animation="slideUp" delay={100}>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg ${fontSizes.small} font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-[#38b6ff] to-[#2a9fe5] text-white shadow-lg'
                  : darkMode
                    ? 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </AnimatedSection>

      {/* Lista pytań */}
      <AnimatedSection animation="slideUp" delay={200}>
        <div className="space-y-3">
          {filteredQuestions.map((question, index) => {
            const response = getQuestionResponse(question.id);
            const isAsked = !!response;
            const isExpanded = expandedQuestion === question.id;

            return (
              <div
                key={question.id}
                className={`interview-question ${darkMode ? 'bg-gray-700/30 hover:bg-gray-700/50' : 'bg-gray-50 hover:bg-gray-100'} ${
                  isAsked ? 'border-l-4 border-l-green-500' : ''
                } rounded-lg`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => isAsked ? setExpandedQuestion(isExpanded ? null : question.id) : askQuestion(question)}
                >
                  <div className="flex-1">
                    <p className={`${fontSizes.text} ${darkMode ? 'text-white' : 'text-gray-900'} ${isAsked ? 'text-green-600' : ''}`}>
                      {question.question}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded text-xs ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                        {question.category}
                      </span>
                      <span className="interview-question-cost bg-yellow-500/20 text-yellow-600">
                        <CostIcon size={10} /> {question.cost} pkt
                      </span>
                    </div>
                  </div>

                  {isAsked ? (
                    <span className={`px-3 py-1 rounded-lg ${fontSizes.small} bg-green-500/20 text-green-500`}>
                      ✓ Zadano
                    </span>
                  ) : (
                    <RippleButton
                      onClick={(e) => {
                        e.stopPropagation();
                        askQuestion(question);
                      }}
                      variant="primary"
                      darkMode={darkMode}
                      className={`px-4 py-2 rounded-lg ${fontSizes.small}`}
                    >
                      Zapytaj
                    </RippleButton>
                  )}
                </div>

                {/* Odpowiedź pacjenta */}
                {isAsked && isExpanded && (
                  <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-gray-600/30' : 'bg-white'} border-l-4 border-l-blue-500`}>
                    <p className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                      Odpowiedź pacjenta:
                    </p>
                    <p className={`${fontSizes.text} ${darkMode ? 'text-gray-200' : 'text-gray-800'} italic`}>
                      "{response?.generatedAnswer}"
                    </p>
                    {response?.wasRelevant && (
                      <p className={`mt-2 ${fontSizes.small} text-green-500`}>
                        ✓ Pytanie związane z objawami pacjenta
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </AnimatedSection>

      {/* Aktualne objawy pacjenta */}
      {patient.currentSymptoms.length > 0 && (
        <AnimatedSection animation="slideUp" delay={300}>
          <div className={`p-4 rounded-xl ${darkMode ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-yellow-50 border border-yellow-200'}`}>
            <h4 className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-yellow-400' : 'text-yellow-700'} mb-3`}>
              💡 Zgłaszane objawy
            </h4>
            <div className="flex flex-wrap gap-2">
              {patient.currentSymptoms.map(symptom => (
                <span
                  key={symptom.id}
                  className={`px-3 py-1.5 rounded-lg ${fontSizes.text} ${
                    symptom.isNew
                      ? 'bg-red-500/20 text-red-500 border border-red-500/30'
                      : darkMode
                        ? 'bg-gray-700 text-gray-300'
                        : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {symptom.isNew && '⚡ '}
                  {symptom.name} - {symptom.severity === 'mild' ? 'łagodny' : symptom.severity === 'moderate' ? 'umiarkowany' : 'ciężki'}
                </span>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}
    </div>
  );
};

export default PatientInterview;

