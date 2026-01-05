import React, { useState, useEffect } from 'react';
import { FaCalculator, FaArrowLeft, FaCopy, FaCheck, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';
import PMRCalculator from '../calculators/PMRCalculator';
import RCCCalculator from '../calculators/RCCCalculator';

interface CalculatorDetailPageProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  slug: string | null;
}

interface Calculator {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  instructions: string;
  component: React.ComponentType<any>;
  evidence?: string[];
  nextSteps?: string[];
  relatedCalculators?: { title: string; slug: string }[];
}

const CalculatorDetailPage: React.FC<CalculatorDetailPageProps> = ({
  darkMode,
  fontSize,
  slug,
}) => {
  const [calculator, setCalculator] = useState<Calculator | null>(null);
  const [results, setResults] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const calculators: Calculator[] = [
    {
      id: '1',
      slug: 'pmr-eular-acr-2012',
      title: '2012 EULAR/ACR Classification Criteria for Polymyalgia Rheumatica',
      description: 'Classifies polymyalgia rheumatica by expert consensus recommendations.',
      category: 'Reumatologia',
      instructions: 'This tool should only be used in patients who: are ≥50 years of age, present with bilateral shoulder pain, and who have an abnormal ESR and/or CRP.',
      component: PMRCalculator,
      evidence: [
        'Dasgupta B, Cimmino MA, Kremers HM, et al. 2012 Provisional classification criteria for polymyalgia rheumatica: a European League Against Rheumatism/American College of Rheumatology collaborative initiative. Arthritis Rheum. 2012;64(4):943-54.',
        'The classification criteria were developed through expert consensus and validation studies.',
        'Sensitivity: 68.3%, Specificity: 78.1% for the classification criteria.'
      ],
      nextSteps: [
        'If criteria are met, consider PMR diagnosis in appropriate clinical context',
        'Start corticosteroid treatment (prednisolone 15-20mg daily)',
        'Monitor for treatment response (significant improvement within 72 hours)',
        'Rule out giant cell arteritis and malignancy',
        'Consider rheumatology referral for complex cases'
      ],
      relatedCalculators: [
        { title: 'Giant Cell Arteritis Classification', slug: 'gca-classification' },
        { title: 'ESR Calculator', slug: 'esr-calculator' }
      ]
    },
    {
      id: '2',
      slug: 'rcc-leibovich-2018',
      title: '2018 Leibovich Model for Renal Cell Carcinoma (RCC)',
      description: 'Predicts progression-free and cancer-specific survival in patients with renal cell carcinoma (RCC).',
      category: 'Onkologia',
      instructions: 'For use in patients with clear cell renal cell carcinoma who have undergone nephrectomy.',
      component: RCCCalculator,
      evidence: [
        'Leibovich BC, Blute ML, Cheville JC, et al. Prediction of progression after radical nephrectomy for patients with clear cell renal cell carcinoma: a stratification tool for prospective clinical trials. Cancer. 2003;97(7):1663-71.',
        'Updated model validated in multiple cohorts with good discrimination.',
        'C-index: 0.82 for cancer-specific survival prediction.'
      ],
      nextSteps: [
        'Low risk: Consider active surveillance protocols',
        'Intermediate risk: Regular imaging surveillance every 6 months',
        'High risk: Consider adjuvant therapy trials and close monitoring',
        'All patients: Annual comprehensive metabolic panel and chest imaging',
        'Consider oncology referral for high-risk patients'
      ],
      relatedCalculators: [
        { title: 'SSIGN Score for RCC', slug: 'ssign-rcc' },
        { title: 'UISS Score for RCC', slug: 'uiss-rcc' }
      ]
    }
  ];

  useEffect(() => {
    if (slug) {
      const foundCalculator = calculators.find(calc => calc.slug === slug);
      setCalculator(foundCalculator || null);
      
      if (foundCalculator) {
        document.title = `${foundCalculator.title} | Kalkulatory Medyczne | DlaMedica.pl`;
        
        let descriptionMeta = document.querySelector('meta[name="description"]');
        if (descriptionMeta) {
          descriptionMeta.setAttribute('content', foundCalculator.description);
        }
      }
    }
  }, [slug]);

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          title: 'text-xl md:text-2xl',
          subtitle: 'text-base md:text-lg',
          cardTitle: 'text-lg',
          cardText: 'text-sm',
          buttonText: 'text-sm'
        };
      case 'large':
        return {
          title: 'text-3xl md:text-4xl',
          subtitle: 'text-xl md:text-2xl',
          cardTitle: 'text-xl md:text-2xl',
          cardText: 'text-lg',
          buttonText: 'text-lg'
        };
      default:
        return {
          title: 'text-2xl md:text-3xl',
          subtitle: 'text-lg md:text-xl',
          cardTitle: 'text-xl',
          cardText: 'text-base',
          buttonText: 'text-base'
        };
    }
  };

  const fontSizes = getFontSizeClasses();

  const navigateToCalculators = () => {
    window.history.pushState({}, '', '/kalkulatory');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const navigateToCalculator = (calcSlug: string) => {
    window.history.pushState({}, '', `/kalkulatory/${calcSlug}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const copyResults = async () => {
    if (!results) return;
    
    try {
      const resultsText = `${calculator?.title}\n\nWynik: ${results.interpretation}\nPunkty: ${results.score}\n\nDlaMedica.pl - Kalkulatory Medyczne`;
      await navigator.clipboard.writeText(resultsText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Nie udało się skopiować wyników:', err);
    }
  };

  if (!calculator) {
    return (
      <div className={`min-h-screen py-12 ${darkMode ? 'bg-black' : 'bg-white'} transition-colors duration-300`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className={`${fontSizes.title} font-bold ${darkMode ? 'text-white' : 'text-black'} mb-4`}>
              Kalkulator nie został znaleziony
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

  const CalculatorComponent = calculator.component;

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
            <span className={darkMode ? 'text-white' : 'text-black'}>{calculator.category}</span>
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
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {calculator.category}
                    </span>
                  </div>
                  <h1 className={`${fontSizes.title} font-bold ${darkMode ? 'text-white' : 'text-black'} mb-3`}>
                    {calculator.title}
                  </h1>
                  <p className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                    {calculator.description}
                  </p>
                  
                  {/* Instructions */}
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
                </div>
              </div>
            </div>

            {/* Calculator Component */}
            <div className={`rounded-xl shadow-lg p-6 mb-6 ${
              darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <CalculatorComponent 
                darkMode={darkMode} 
                fontSize={fontSize}
                onResultsChange={setResults}
              />
            </div>

            {/* Copy Results */}
            {results && (
              <div className="mb-6">
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
              </div>
            )}

            {/* Next Steps */}
            {calculator.nextSteps && (
              <div className={`rounded-xl shadow-lg p-6 mb-6 ${
                darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
                <h3 className={`${fontSizes.cardTitle} font-bold ${darkMode ? 'text-white' : 'text-black'} mb-4`}>
                  Następne kroki
                </h3>
                <ul className="space-y-3">
                  {calculator.nextSteps.map((step, index) => (
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
            {calculator.evidence && (
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
            {/* Related Calculators */}
            {calculator.relatedCalculators && (
              <div className={`rounded-xl shadow-lg p-6 mb-6 ${
                darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
                <h3 className={`${fontSizes.cardTitle} font-bold ${darkMode ? 'text-white' : 'text-black'} mb-4`}>
                  Powiązane kalkulatory
                </h3>
                <div className="space-y-3">
                  {calculator.relatedCalculators.map((related, index) => (
                    <button
                      key={index}
                      onClick={() => navigateToCalculator(related.slug)}
                      className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                        darkMode
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className={`font-medium ${fontSizes.cardText}`}>
                        {related.title}
                      </div>
                    </button>
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