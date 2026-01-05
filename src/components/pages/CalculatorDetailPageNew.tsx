import React, { useState, useEffect } from 'react';
import { FaCalculator, FaArrowLeft, FaCopy, FaCheck, FaInfoCircle, FaExclamationTriangle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { ArrowLeft } from 'lucide-react';
import PolymyalgiaRheumaticaCalculator from '../calculators/PolymyalgiaRheumaticaCalculator';
import { CalculatorService, MedicalCalculator, FormField, ResultInterpretation } from '../../services/calculatorService';
import { useUser } from '../../hooks/useUser';

interface CalculatorDetailPageProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  slug: string | null;
}

interface FormData {
  [key: string]: string | number | boolean;
}

interface CalculationResults {
  score: number;
  interpretation: ResultInterpretation | null;
  rawResults: Record<string, any>;
}

const CalculatorDetailPage: React.FC<CalculatorDetailPageProps> = ({
  darkMode,
  fontSize,
  slug,
}) => {
  const { isAuthenticated } = useUser();
  const [calculator, setCalculator] = useState<MedicalCalculator | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [copied, setCopied] = useState(false);
  const [savingResult, setSavingResult] = useState(false);

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          title: 'text-xl md:text-2xl',
          subtitle: 'text-base md:text-lg',
          cardTitle: 'text-lg',
          cardText: 'text-sm',
          buttonText: 'text-sm',
          resultTitle: 'text-xl',
          resultText: 'text-base'
        };
      case 'large':
        return {
          title: 'text-3xl md:text-4xl',
          subtitle: 'text-xl md:text-2xl',
          cardTitle: 'text-xl md:text-2xl',
          cardText: 'text-lg',
          buttonText: 'text-lg',
          resultTitle: 'text-3xl',
          resultText: 'text-xl'
        };
      default:
        return {
          title: 'text-2xl md:text-3xl',
          subtitle: 'text-lg md:text-xl',
          cardTitle: 'text-xl',
          cardText: 'text-base',
          buttonText: 'text-base',
          resultTitle: 'text-2xl',
          resultText: 'text-lg'
        };
    }
  };

  const fontSizes = getFontSizeClasses();

  useEffect(() => {
    if (slug) {
      loadCalculator(slug);
    }
  }, [slug]);

  useEffect(() => {
    if (calculator) {
      calculateResults();
    }
  }, [formData, calculator]);

  const loadCalculator = async (calculatorSlug: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await CalculatorService.getCalculatorBySlug(calculatorSlug);
      
      if (error) {
        setError('Błąd podczas ładowania kalkulatora');
        return;
      }

      if (!data) {
        setError('Kalkulator nie został znaleziony');
        return;
      }

      setCalculator(data);
      
      // Initialize form data with default values
      const initialFormData: FormData = {};
      data.form_fields.forEach(field => {
        if (field.type === 'number') {
          initialFormData[field.id] = field.min || 0;
        } else {
          initialFormData[field.id] = '';
        }
      });
      setFormData(initialFormData);

      // Update page title
      document.title = `${data.title} | Kalkulatory Medyczne | DlaMedica.pl`;
      
      let descriptionMeta = document.querySelector('meta[name="description"]');
      if (descriptionMeta) {
        descriptionMeta.setAttribute('content', data.description);
      }
      
    } catch (err) {
      console.error('Error loading calculator:', err);
      setError('Wystąpił błąd podczas ładowania kalkulatora');
    } finally {
      setLoading(false);
    }
  };

  const calculateResults = () => {
    if (!calculator) return;

    // Check if all required fields are filled
    const requiredFields = calculator.form_fields.filter(field => field.required);
    const hasAllRequiredValues = requiredFields.every(field => {
      const value = formData[field.id];
      return value !== '' && value !== null && value !== undefined;
    });

    if (!hasAllRequiredValues) {
      setResults(null);
      return;
    }

    const calculatedResults = CalculatorService.calculateResults(calculator, formData);
    setResults(calculatedResults);
  };

  const handleInputChange = (fieldId: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const navigateToCalculators = () => {
    window.history.pushState({}, '', '/kalkulatory');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const copyResults = async () => {
    if (!results || !calculator) return;
    
    try {
      const resultsText = `${calculator.title}\n\nWynik: ${results.interpretation?.result}\nPunkty: ${results.score}\n\nDlaMedica.pl - Kalkulatory Medyczne`;
      await navigator.clipboard.writeText(resultsText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Nie udało się skopiować wyników:', err);
    }
  };

  const saveResults = async () => {
    if (!results || !calculator || !isAuthenticated) return;

    try {
      setSavingResult(true);
      await CalculatorService.saveCalculatorResult(
        calculator.id,
        formData,
        results.rawResults
      );
      // Could show a success message here
    } catch (err) {
      console.error('Error saving results:', err);
    } finally {
      setSavingResult(false);
    }
  };

  const resetForm = () => {
    if (!calculator) return;
    
    const initialFormData: FormData = {};
    calculator.form_fields.forEach(field => {
      if (field.type === 'number') {
        initialFormData[field.id] = field.min || 0;
      } else {
        initialFormData[field.id] = '';
      }
    });
    setFormData(initialFormData);
  };

  const renderFormField = (field: FormField) => {
    const value = formData[field.id];

    const fieldWrapper = (content: React.ReactNode) => (
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <h3 className={`${fontSizes.cardText} font-semibold ${darkMode ? 'text-white' : 'text-black'} mb-3`}>
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </h3>
        {field.description && (
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
            {field.description}
          </p>
        )}
        {content}
      </div>
    );

    switch (field.type) {
      case 'radio':
        return fieldWrapper(
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={field.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="w-4 h-4 text-[#38b6ff] focus:ring-[#38b6ff]"
                />
                <span className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {option.label}
                  {option.points !== 0 && (
                    <span className={`ml-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      ({option.points > 0 ? '+' : ''}{option.points} pkt)
                    </span>
                  )}
                </span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return fieldWrapper(
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Array.isArray(value) ? value.includes(option.value) : false}
                  onChange={(e) => {
                    const currentArray = Array.isArray(value) ? value : [];
                    if (e.target.checked) {
                      handleInputChange(field.id, [...currentArray, option.value]);
                    } else {
                      handleInputChange(field.id, currentArray.filter(v => v !== option.value));
                    }
                  }}
                  className="w-4 h-4 text-[#38b6ff] focus:ring-[#38b6ff]"
                />
                <span className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {option.label}
                  {option.points !== 0 && (
                    <span className={`ml-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      ({option.points > 0 ? '+' : ''}{option.points} pkt)
                    </span>
                  )}
                </span>
              </label>
            ))}
          </div>
        );

      case 'number':
        return fieldWrapper(
          <input
            type="number"
            value={value}
            min={field.min}
            max={field.max}
            placeholder={field.placeholder}
            onChange={(e) => handleInputChange(field.id, parseFloat(e.target.value) || 0)}
            className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] focus:border-[#38b6ff] ${fontSizes.cardText} ${
              darkMode
                ? 'bg-gray-800 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
        );

      case 'select':
        return fieldWrapper(
          <select
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] focus:border-[#38b6ff] ${fontSizes.cardText} ${
              darkMode
                ? 'bg-gray-800 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="">{field.placeholder || 'Wybierz opcję'}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
                {option.points !== 0 && ` (${option.points > 0 ? '+' : ''}${option.points} pkt)`}
              </option>
            ))}
          </select>
        );

      case 'text':
        return fieldWrapper(
          <input
            type="text"
            value={value}
            placeholder={field.placeholder}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] focus:border-[#38b6ff] ${fontSizes.cardText} ${
              darkMode
                ? 'bg-gray-800 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
        );

      default:
        return null;
    }
  };

  const renderResults = () => {
    if (!results || !results.interpretation) return null;

    const interpretation = results.interpretation;
    const colorClasses = {
      green: 'bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-700',
      yellow: 'bg-yellow-50 border-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-700',
      red: 'bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-700',
      blue: 'bg-blue-50 border-blue-300 dark:bg-blue-900/20 dark:border-blue-700'
    };

    const iconColorClasses = {
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      red: 'bg-red-500',
      blue: 'bg-blue-500'
    };

    const textColorClasses = {
      green: 'text-green-700 dark:text-green-300',
      yellow: 'text-yellow-700 dark:text-yellow-300',
      red: 'text-red-700 dark:text-red-300',
      blue: 'text-blue-700 dark:text-blue-300'
    };

    return (
      <div className={`p-6 rounded-xl border-2 ${colorClasses[interpretation.color]}`}>
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconColorClasses[interpretation.color]}`}>
            {interpretation.severity === 'positive' || interpretation.color === 'green' ? (
              <FaCheckCircle className="text-white text-xl" />
            ) : interpretation.severity === 'negative' || interpretation.color === 'red' ? (
              <FaTimesCircle className="text-white text-xl" />
            ) : (
              <FaExclamationTriangle className="text-white text-xl" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-2">
              <span className={`${fontSizes.resultTitle} font-bold ${textColorClasses[interpretation.color]}`}>
                {results.score} punktów
              </span>
            </div>
            <p className={`${fontSizes.resultText} font-semibold ${textColorClasses[interpretation.color]} mb-2`}>
              {interpretation.result}
            </p>
            {interpretation.description && (
              <p className={`${fontSizes.cardText} ${textColorClasses[interpretation.color]}`}>
                {interpretation.description}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`min-h-screen py-12 ${darkMode ? 'bg-black' : 'bg-white'} transition-colors duration-300`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#38b6ff] mx-auto mb-4"></div>
            <p className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Ładowanie kalkulatora...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !calculator) {
    return (
      <div className={`min-h-screen py-12 ${darkMode ? 'bg-black' : 'bg-white'} transition-colors duration-300`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className={`${fontSizes.title} font-bold ${darkMode ? 'text-white' : 'text-black'} mb-4`}>
              {error || 'Kalkulator nie został znaleziony'}
            </h1>
            <p className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              Przepraszamy, nie można znaleźć kalkulatora o podanym adresie.
            </p>
            <button
              onClick={navigateToCalculators}
              className={`px-6 py-3 ${fontSizes.buttonText} font-semibold rounded-lg transition-colors duration-200 bg-[#38b6ff] text-black hover:bg-[#2a9fe5]`}
            >
              <FaArrowLeft className="inline mr-2" />
              Powrót do kalkulatorów
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle special calculators
  if (slug === 'polymyalgia-rheumatica-criteria') {
    return (
      <div className={`min-h-screen py-8 ${darkMode ? 'bg-black' : 'bg-white'} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => {
                window.history.pushState({}, '', '/kalkulatory');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className={`inline-flex items-center px-4 py-2 ${fontSizes.buttonText} font-medium rounded-lg transition-colors duration-200 ${
                darkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
              }`}
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Powrót do kalkulatorów
            </button>
          </div>
          <PolymyalgiaRheumaticaCalculator darkMode={darkMode} fontSize={fontSize} />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 ${darkMode ? 'bg-black' : 'bg-white'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm">
            <button
              onClick={navigateToCalculators}
              className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors duration-200`}
            >
              Kalkulatory
            </button>
            <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>→</span>
            <span className={darkMode ? 'text-white' : 'text-black'}>{calculator.category?.display_name}</span>
            <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>→</span>
            <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} truncate max-w-xs`}>
              {calculator.title}
            </span>
          </div>
        </nav>

        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={navigateToCalculators}
            className={`inline-flex items-center px-4 py-2 ${fontSizes.buttonText} font-medium rounded-lg transition-colors duration-200 ${
              darkMode
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
            }`}
          >
            <FaArrowLeft className="mr-2" />
            Powrót do kalkulatorów
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className={`rounded-xl shadow-lg p-6 mb-6 ${
              darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#38b6ff] rounded-lg flex items-center justify-center shrink-0">
                  <FaCalculator className="text-white text-xl" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                        darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {calculator.specialty || calculator.category?.display_name}
                      </span>
                      {calculator.is_featured && (
                        <span className="bg-[#38b6ff] text-black text-xs font-bold px-2 py-1 rounded-full">
                          POPULARNE
                        </span>
                      )}
                    </div>
                    <button
                      onClick={resetForm}
                      className={`px-3 py-1 text-sm rounded-lg transition-colors duration-200 ${
                        darkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Wyczyść
                    </button>
                  </div>
                  <h1 className={`${fontSizes.title} font-bold ${darkMode ? 'text-white' : 'text-black'} mb-3`}>
                    {calculator.title}
                  </h1>
                  <p className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                    {calculator.description}
                  </p>
                  
                  {/* Instructions */}
                  {calculator.instructions && (
                    <div className={`p-4 rounded-lg ${
                      darkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'
                    }`}>
                      <div className="flex items-start space-x-3">
                        <FaInfoCircle className="text-blue-500 mt-0.5 shrink-0" />
                        <div>
                          <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-black'} mb-1`}>
                            Instrukcje użycia
                          </h3>
                          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {calculator.instructions}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className={`rounded-xl shadow-lg p-6 mb-6 ${
              darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <div className="space-y-6">
                {calculator.form_fields.map((field) => (
                  <div key={field.id}>
                    {renderFormField(field)}
                  </div>
                ))}
              </div>
            </div>

            {/* Results */}
            {results && (
              <div className="mb-6">
                {renderResults()}
              </div>
            )}

            {/* Action Buttons */}
            {results && (
              <div className="flex flex-wrap gap-3 mb-6">
                <button
                  onClick={copyResults}
                  className={`inline-flex items-center px-4 py-2 ${fontSizes.buttonText} font-medium rounded-lg transition-all duration-200 ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
                  }`}
                >
                  {copied ? <FaCheck className="mr-2" /> : <FaCopy className="mr-2" />}
                  {copied ? 'Skopiowane!' : 'Kopiuj wyniki'}
                </button>

                {isAuthenticated && (
                  <button
                    onClick={saveResults}
                    disabled={savingResult}
                    className={`inline-flex items-center px-4 py-2 ${fontSizes.buttonText} font-medium rounded-lg transition-all duration-200 ${
                      darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } disabled:opacity-50`}
                  >
                    {savingResult ? 'Zapisywanie...' : 'Zapisz wyniki'}
                  </button>
                )}
              </div>
            )}

            {/* Next Steps */}
            {calculator.next_steps && calculator.next_steps.length > 0 && (
              <div className={`rounded-xl shadow-lg p-6 mb-6 ${
                darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
                <h3 className={`${fontSizes.cardTitle} font-bold ${darkMode ? 'text-white' : 'text-black'} mb-4`}>
                  Następne kroki
                </h3>
                <ul className="space-y-3">
                  {calculator.next_steps.map((step, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-[#38b6ff] text-black rounded-full flex items-center justify-center text-sm font-bold mt-0.5 shrink-0">
                        {index + 1}
                      </div>
                      <span className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {step}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Evidence */}
            {calculator.evidence && calculator.evidence.length > 0 && (
              <div className={`rounded-xl shadow-lg p-6 ${
                darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
                <h3 className={`${fontSizes.cardTitle} font-bold ${darkMode ? 'text-white' : 'text-black'} mb-4`}>
                  Podstawa naukowa
                </h3>
                <ul className="space-y-3">
                  {calculator.evidence.map((evidence, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-[#38b6ff] rounded-full mt-2 shrink-0"></div>
                      <span className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {evidence}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Usage Stats */}
            <div className={`rounded-xl shadow-lg p-6 mb-6 ${
              darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <h3 className={`${fontSizes.cardTitle} font-bold ${darkMode ? 'text-white' : 'text-black'} mb-4`}>
                Statystyki
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Użyć
                  </span>
                  <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
                    {calculator.usage_count.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Kategoria
                  </span>
                  <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
                    {calculator.category?.display_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Poziom
                  </span>
                  <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
                    {calculator.difficulty_level === 'intermediate' ? 'Średni' : 
                     calculator.difficulty_level === 'advanced' ? 'Zaawansowany' : 'Podstawowy'}
                  </span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {calculator.tags && calculator.tags.length > 0 && (
              <div className={`rounded-xl shadow-lg p-6 mb-6 ${
                darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
                <h3 className={`${fontSizes.cardTitle} font-bold ${darkMode ? 'text-white' : 'text-black'} mb-4`}>
                  Tagi
                </h3>
                <div className="flex flex-wrap gap-2">
                  {calculator.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 text-sm rounded-full ${
                        darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className={`rounded-xl shadow-lg p-6 ${
              darkMode ? 'bg-amber-900/20 border border-amber-800' : 'bg-amber-50 border border-amber-200'
            }`}>
              <div className="flex items-start space-x-3">
                <FaExclamationTriangle className="text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-black'} mb-2`}>
                    Ważne informacje
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                    Ten kalkulator służy wyłącznie celom edukacyjnym i wspomagającym. 
                    Nie zastępuje profesjonalnej oceny medycznej. Zawsze skonsultuj się z lekarzem.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorDetailPage;