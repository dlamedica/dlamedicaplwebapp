import React, { useState, useEffect } from 'react';
import { FaQuestionCircle, FaCheckCircle, FaThumbsUp } from 'react-icons/fa';
import { getEbookQuestions, createQuestion, markAnswerHelpful, Question } from '../../services/qaService';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';

interface ProductQASectionProps {
  ebookId: string;
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const ProductQASection: React.FC<ProductQASectionProps> = ({ ebookId, darkMode, fontSize }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const fontSizes = {
    small: { title: 'text-xl', text: 'text-sm', button: 'text-sm' },
    medium: { title: 'text-2xl', text: 'text-base', button: 'text-base' },
    large: { title: 'text-3xl', text: 'text-lg', button: 'text-lg' },
  }[fontSize];

  useEffect(() => {
    loadQuestions();
  }, [ebookId]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const data = await getEbookQuestions(ebookId);
      setQuestions(data);
    } catch (error: any) {
      console.error('Error loading questions:', error);
      showError('Nie udało się załadować pytań');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showError('Musisz być zalogowany, aby zadać pytanie');
      return;
    }

    if (!questionText.trim()) {
      showError('Wprowadź pytanie');
      return;
    }

    try {
      await createQuestion({
        ebook_id: ebookId,
        question: questionText,
      });
      setQuestionText('');
      setShowForm(false);
      showSuccess('Pytanie zostało wysłane. Odpowiedź pojawi się wkrótce.');
      loadQuestions();
    } catch (error: any) {
      showError(error.message || 'Nie udało się wysłać pytania');
    }
  };

  const handleMarkHelpful = async (questionId: string) => {
    if (!user) {
      showError('Musisz być zalogowany');
      return;
    }

    try {
      await markAnswerHelpful(questionId);
      showSuccess('Dziękujemy za opinię!');
      loadQuestions();
    } catch (error: any) {
      showError(error.message || 'Nie udało się oznaczyć odpowiedzi');
    }
  };

  return (
    <div className={`mt-8 p-6 rounded-lg shadow-lg ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`${fontSizes.title} font-bold flex items-center gap-2 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          <FaQuestionCircle />
          Pytania i odpowiedzi
        </h2>
        {user && (
          <button
            onClick={() => setShowForm(!showForm)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              darkMode
                ? 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
                : 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
            } ${fontSizes.button}`}
          >
            Zadaj pytanie
          </button>
        )}
      </div>

      {/* Formularz pytania */}
      {showForm && user && (
        <form onSubmit={handleSubmitQuestion} className="mb-6">
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Zadaj pytanie o ten produkt..."
            rows={4}
            className={`w-full px-4 py-2 rounded-lg border transition-colors duration-200 ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${fontSizes.text}`}
          />
          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                darkMode
                  ? 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
                  : 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
              } ${fontSizes.button}`}
            >
              Wyślij pytanie
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setQuestionText('');
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                darkMode
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              } ${fontSizes.button}`}
            >
              Anuluj
            </button>
          </div>
        </form>
      )}

      {/* Lista pytań */}
      {loading ? (
        <div className={`text-center py-8 ${fontSizes.text} ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Ładowanie pytań...
        </div>
      ) : questions.length === 0 ? (
        <div className={`text-center py-8 ${fontSizes.text} ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Brak pytań. Bądź pierwszy, który zada pytanie!
        </div>
      ) : (
        <div className="space-y-6">
          {questions.map((question) => (
            <div
              key={question.id}
              className={`p-4 rounded-lg ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}
            >
              <div className="mb-3">
                <p className={`${fontSizes.text} font-semibold mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <FaQuestionCircle className="inline mr-2" />
                  {question.question}
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {question.user_name} • {new Date(question.created_at).toLocaleDateString('pl-PL')}
                </p>
              </div>

              {question.answer && (
                <div className={`mt-4 pl-4 border-l-2 ${
                  darkMode ? 'border-[#38b6ff]' : 'border-[#38b6ff]'
                }`}>
                  <div className="flex items-start gap-2 mb-2">
                    <FaCheckCircle className={`mt-1 ${darkMode ? 'text-[#38b6ff]' : 'text-[#38b6ff]'}`} />
                    <div className="flex-1">
                      <p className={`${fontSizes.text} ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {question.answer}
                      </p>
                      <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Odpowiedź od {question.answered_by_name} • {question.answered_at && new Date(question.answered_at).toLocaleDateString('pl-PL')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleMarkHelpful(question.id)}
                    className={`mt-2 flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition-colors duration-200 ${
                      darkMode
                        ? 'bg-gray-600 text-white hover:bg-gray-500'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <FaThumbsUp />
                    Pomocne ({question.helpful_count})
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductQASection;

