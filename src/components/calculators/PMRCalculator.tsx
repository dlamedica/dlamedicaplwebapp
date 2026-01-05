import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaSyringe } from 'react-icons/fa';

interface PMRCalculatorProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  onResultsChange: (results: any) => void;
}

interface PMRFormData {
  morningStiffness: number;
  hipPain: number;
  rfAcpa: number;
  otherJointPain: number;
  ultrasoundOne: boolean | null;
  ultrasoundBoth: boolean | null;
}

interface VaccinationSchedule {
  age: string;
  vaccine: string;
  description: string;
  mandatory: boolean;
  category: 'adult' | 'elderly';
  rheumaticNote: string;
}

const rheumaticVaccinationSchedules: VaccinationSchedule[] = [
  // Szczepienia dla pacjentów z chorobami reumatycznymi
  { 
    age: 'Dorośli (18+ lat)', 
    vaccine: 'Influenza', 
    description: 'Szczepionka przeciwko grypie (corocznie)', 
    mandatory: true, 
    category: 'adult',
    rheumaticNote: 'Szczególnie zalecana u pacjentów z PMR ze względu na zwiększone ryzyko powikłań grypowych podczas leczenia steroidami.'
  },
  { 
    age: 'Dorośli (18+ lat)', 
    vaccine: 'COVID-19', 
    description: 'Szczepionka przeciwko COVID-19', 
    mandatory: true, 
    category: 'adult',
    rheumaticNote: 'Kluczowe znaczenie u pacjentów immunosupresyjnych. Możliwość obniżonej odpowiedzi immunologicznej.'
  },
  { 
    age: 'Dorośli (18+ lat)', 
    vaccine: 'Pneumococcal (PCV13/PPSV23)', 
    description: 'Przeciwko pneumokokom', 
    mandatory: true, 
    category: 'adult',
    rheumaticNote: 'Zalecane przed rozpoczęciem terapii immunosupresyjnej. Chronią przed zapaleniem płuc i sepsa.'
  },
  { 
    age: 'Dorośli (18+ lat)', 
    vaccine: 'Hepatitis B', 
    description: 'Przeciwko wirusowemu zapaleniu wątroby typu B', 
    mandatory: true, 
    category: 'adult',
    rheumaticNote: 'Obowiązkowe przed terapią biologiczną. Sprawdź HBsAg, anti-HBc, anti-HBs przed szczepieniem.'
  },
  { 
    age: 'Dorośli (18+ lat)', 
    vaccine: 'Varicella-Zoster', 
    description: 'Przeciwko ospie wietrznej i półpaścowi', 
    mandatory: false, 
    category: 'adult',
    rheumaticNote: 'Szczepionka żywa - przeciwwskazana podczas terapii immunosupresyjnej. Rozważ przed rozpoczęciem leczenia.'
  },
  { 
    age: '65+ lat', 
    vaccine: 'Zoster (Shingrix)', 
    description: 'Przeciwko półpaścowi (szczepionka inaktywowana)', 
    mandatory: true, 
    category: 'elderly',
    rheumaticNote: 'Bezpieczna dla pacjentów na leczeniu immunosupresyjnym. Zwiększone ryzyko półpaśca u pacjentów z PMR.'
  },
  { 
    age: 'Dorośli (18+ lat)', 
    vaccine: 'Tetanus-Diphtheria (Td)', 
    description: 'Przeciwko tężcowi i błonicy (co 10 lat)', 
    mandatory: true, 
    category: 'adult',
    rheumaticNote: 'Standardowe szczepienie, bezpieczne podczas terapii immunosupresyjnej.'
  }
];

const PMRCalculator: React.FC<PMRCalculatorProps> = ({ darkMode, fontSize, onResultsChange }) => {
  const [formData, setFormData] = useState<PMRFormData>({
    morningStiffness: 0,
    hipPain: 0,
    rfAcpa: 0,
    otherJointPain: 0,
    ultrasoundOne: null,
    ultrasoundBoth: null
  });

  const [results, setResults] = useState<{
    score: number;
    interpretation: string;
    meetsEularAcr: boolean;
    color: string;
  } | null>(null);

  const [showVaccinationCalendar, setShowVaccinationCalendar] = useState(false);

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          cardTitle: 'text-lg',
          cardText: 'text-sm',
          buttonText: 'text-sm',
          resultTitle: 'text-xl',
          resultText: 'text-base'
        };
      case 'large':
        return {
          cardTitle: 'text-xl md:text-2xl',
          cardText: 'text-lg',
          buttonText: 'text-lg',
          resultTitle: 'text-3xl',
          resultText: 'text-xl'
        };
      default:
        return {
          cardTitle: 'text-xl',
          cardText: 'text-base',
          buttonText: 'text-base',
          resultTitle: 'text-2xl',
          resultText: 'text-lg'
        };
    }
  };

  const fontSizes = getFontSizeClasses();

  const calculateScore = () => {
    let totalScore = 0;
    
    // Basic criteria
    totalScore += formData.morningStiffness;
    totalScore += formData.hipPain;
    totalScore += formData.rfAcpa;
    totalScore += formData.otherJointPain;
    
    // Ultrasound criteria (if available)
    if (formData.ultrasoundOne === true) totalScore += 1;
    if (formData.ultrasoundBoth === true) totalScore += 1;
    
    return totalScore;
  };

  const getInterpretation = (score: number) => {
    if (score >= 4) {
      return {
        interpretation: 'Meets EULAR/ACR criteria for PMR',
        meetsEularAcr: true,
        color: 'green'
      };
    } else {
      return {
        interpretation: 'Does not meet EULAR/ACR criteria for PMR',
        meetsEularAcr: false,
        color: 'red'
      };
    }
  };

  useEffect(() => {
    const score = calculateScore();
    const interpretation = getInterpretation(score);
    
    const newResults = {
      score,
      ...interpretation
    };
    
    setResults(newResults);
    onResultsChange(newResults);
  }, [formData, onResultsChange]);

  const handleInputChange = (field: keyof PMRFormData, value: number | boolean | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      morningStiffness: 0,
      hipPain: 0,
      rfAcpa: 0,
      otherJointPain: 0,
      ultrasoundOne: null,
      ultrasoundBoth: null
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`${fontSizes.cardTitle} font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
          Kryteria EULAR/ACR dla PMR
        </h2>
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

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Morning Stiffness */}
        <div className={`p-4 rounded-lg ${
          darkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <h3 className={`${fontSizes.cardText} font-semibold ${darkMode ? 'text-white' : 'text-black'} mb-3`}>
            Czas trwania sztywności porannej
          </h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="morningStiffness"
                checked={formData.morningStiffness === 2}
                onChange={() => handleInputChange('morningStiffness', 2)}
                className="w-4 h-4 text-[#38b6ff] focus:ring-[#38b6ff]"
              />
              <span className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                ≥45 minut (+2 punkty)
              </span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="morningStiffness"
                checked={formData.morningStiffness === 0}
                onChange={() => handleInputChange('morningStiffness', 0)}
                className="w-4 h-4 text-[#38b6ff] focus:ring-[#38b6ff]"
              />
              <span className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                &lt;45 minut (0 punktów)
              </span>
            </label>
          </div>
        </div>

        {/* Hip Pain */}
        <div className={`p-4 rounded-lg ${
          darkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <h3 className={`${fontSizes.cardText} font-semibold ${darkMode ? 'text-white' : 'text-black'} mb-3`}>
            Ból biodrowy lub ograniczenie zakresu ruchu
          </h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="hipPain"
                checked={formData.hipPain === 1}
                onChange={() => handleInputChange('hipPain', 1)}
                className="w-4 h-4 text-[#38b6ff] focus:ring-[#38b6ff]"
              />
              <span className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Obecny (+1 punkt)
              </span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="hipPain"
                checked={formData.hipPain === 0}
                onChange={() => handleInputChange('hipPain', 0)}
                className="w-4 h-4 text-[#38b6ff] focus:ring-[#38b6ff]"
              />
              <span className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Nieobecny (0 punktów)
              </span>
            </label>
          </div>
        </div>

        {/* RF or ACPA */}
        <div className={`p-4 rounded-lg ${
          darkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <h3 className={`${fontSizes.cardText} font-semibold ${darkMode ? 'text-white' : 'text-black'} mb-3`}>
            Czynnik reumatoidalny (RF) lub przeciwciała ACPA
          </h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="rfAcpa"
                checked={formData.rfAcpa === -2}
                onChange={() => handleInputChange('rfAcpa', -2)}
                className="w-4 h-4 text-[#38b6ff] focus:ring-[#38b6ff]"
              />
              <span className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Obecne (-2 punkty)
              </span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="rfAcpa"
                checked={formData.rfAcpa === 0}
                onChange={() => handleInputChange('rfAcpa', 0)}
                className="w-4 h-4 text-[#38b6ff] focus:ring-[#38b6ff]"
              />
              <span className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Nieobecne (0 punktów)
              </span>
            </label>
          </div>
        </div>

        {/* Other Joint Pain */}
        <div className={`p-4 rounded-lg ${
          darkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <h3 className={`${fontSizes.cardText} font-semibold ${darkMode ? 'text-white' : 'text-black'} mb-3`}>
            Ból innych stawów
          </h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="otherJointPain"
                checked={formData.otherJointPain === -1}
                onChange={() => handleInputChange('otherJointPain', -1)}
                className="w-4 h-4 text-[#38b6ff] focus:ring-[#38b6ff]"
              />
              <span className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Obecny (-1 punkt)
              </span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="otherJointPain"
                checked={formData.otherJointPain === 0}
                onChange={() => handleInputChange('otherJointPain', 0)}
                className="w-4 h-4 text-[#38b6ff] focus:ring-[#38b6ff]"
              />
              <span className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Nieobecny (0 punktów)
              </span>
            </label>
          </div>
        </div>

        {/* Ultrasound Criteria */}
        <div className={`p-4 rounded-lg border-2 border-dashed ${
          darkMode ? 'bg-gray-800 border-gray-600' : 'bg-blue-50 border-blue-300'
        }`}>
          <h3 className={`${fontSizes.cardText} font-semibold ${darkMode ? 'text-white' : 'text-black'} mb-2`}>
            Kryteria ultrasonograficzne (opcjonalne)
          </h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
            Te kryteria mogą zostać wykorzystane, gdy dostępne jest badanie USG
          </p>
          
          <div className="space-y-4">
            <div>
              <h4 className={`${fontSizes.cardText} font-medium ${darkMode ? 'text-white' : 'text-black'} mb-2`}>
                Przynajmniej jeden bark z zapaleniem kaletki poddeltoidalnej i/lub tenosynovitis biceps i/lub synovitis stawu ramienno-łopatkowego
              </h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="ultrasoundOne"
                    checked={formData.ultrasoundOne === true}
                    onChange={() => handleInputChange('ultrasoundOne', true)}
                    className="w-4 h-4 text-[#38b6ff] focus:ring-[#38b6ff]"
                  />
                  <span className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Tak (+1 punkt)
                  </span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="ultrasoundOne"
                    checked={formData.ultrasoundOne === false}
                    onChange={() => handleInputChange('ultrasoundOne', false)}
                    className="w-4 h-4 text-[#38b6ff] focus:ring-[#38b6ff]"
                  />
                  <span className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Nie (0 punktów)
                  </span>
                </label>
              </div>
            </div>

            <div>
              <h4 className={`${fontSizes.cardText} font-medium ${darkMode ? 'text-white' : 'text-black'} mb-2`}>
                Oba barki z zapaleniem kaletki poddeltoidalnej, tenosynovitis biceps lub synovitis stawu ramienno-łopatkowego
              </h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="ultrasoundBoth"
                    checked={formData.ultrasoundBoth === true}
                    onChange={() => handleInputChange('ultrasoundBoth', true)}
                    className="w-4 h-4 text-[#38b6ff] focus:ring-[#38b6ff]"
                  />
                  <span className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Tak (+1 punkt)
                  </span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="ultrasoundBoth"
                    checked={formData.ultrasoundBoth === false}
                    onChange={() => handleInputChange('ultrasoundBoth', false)}
                    className="w-4 h-4 text-[#38b6ff] focus:ring-[#38b6ff]"
                  />
                  <span className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Nie (0 punktów)
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className={`p-6 rounded-xl border-2 ${
          results.meetsEularAcr
            ? 'bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-700'
            : 'bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-700'
        }`}>
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              results.meetsEularAcr ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {results.meetsEularAcr ? (
                <FaCheckCircle className="text-white text-xl" />
              ) : (
                <FaTimesCircle className="text-white text-xl" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-2">
                <span className={`${fontSizes.resultTitle} font-bold ${
                  results.meetsEularAcr ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                }`}>
                  {results.score} punktów
                </span>
              </div>
              <p className={`${fontSizes.resultText} font-semibold ${
                results.meetsEularAcr ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
              }`}>
                {results.interpretation}
              </p>
            </div>
          </div>
          
          <div className={`mt-4 p-3 rounded-lg ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-black'} mb-2`}>
              Interpretacja wyników:
            </h4>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {results.meetsEularAcr
                ? 'Pacjent spełnia kryteria klasyfikacyjne EULAR/ACR dla polymyalgia rheumatica. Rozważ diagnostykę PMR w odpowiednim kontekście klinicznym.'
                : 'Pacjent nie spełnia kryteriów klasyfikacyjnych EULAR/ACR dla polymyalgia rheumatica. Rozważ inne diagnozy różnicowe.'
              }
            </p>
          </div>
        </div>
      )}

      {/* Vaccination Calendar Section */}
      <div className={`mt-8 p-6 rounded-xl border-2 ${
        darkMode ? 'bg-gray-800 border-gray-600' : 'bg-blue-50 border-blue-300'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <FaSyringe className={`text-xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h3 className={`${fontSizes.cardTitle} font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
              Kalendarz szczepień dla pacjentów z PMR
            </h3>
          </div>
          <button
            onClick={() => setShowVaccinationCalendar(!showVaccinationCalendar)}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
              darkMode
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {showVaccinationCalendar ? 'Ukryj kalendarz' : 'Pokaż kalendarz'}
          </button>
        </div>

        {showVaccinationCalendar && (
          <div className="space-y-4">
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
              Specjalne zalecenia dotyczące szczepień dla pacjentów z polymyalgia rheumatica, szczególnie podczas terapii immunosupresyjnej.
            </p>

            {/* Vaccination Schedule Table */}
            <div className={`rounded-lg overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className={darkMode ? 'bg-gray-600' : 'bg-gray-50'}>
                    <tr>
                      <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        darkMode ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        Grupa wiekowa
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        darkMode ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        Szczepionka
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        darkMode ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        Zalecenia dla PMR
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? 'divide-gray-600 bg-gray-700' : 'divide-gray-200 bg-white'}`}>
                    {rheumaticVaccinationSchedules.map((vaccination, index) => (
                      <tr key={index} className={darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-50'}>
                        <td className={`px-4 py-3 text-sm font-medium ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {vaccination.age}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className={`text-sm font-semibold ${
                              darkMode ? 'text-blue-400' : 'text-blue-600'
                            }`}>
                              {vaccination.vaccine}
                            </span>
                            <span className={`text-xs ${
                              darkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {vaccination.description}
                            </span>
                          </div>
                        </td>
                        <td className={`px-4 py-3 text-sm ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          <div className="flex flex-col space-y-1">
                            <span 
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full w-fit ${
                                vaccination.mandatory 
                                  ? 'bg-red-100 text-red-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {vaccination.mandatory ? 'Zalecana' : 'Rozważ'}
                            </span>
                            <p className="text-xs">
                              {vaccination.rheumaticNote}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Important Notes */}
            <div className={`p-4 rounded-lg ${
              darkMode ? 'bg-yellow-900/20 border border-yellow-700' : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <h4 className={`font-semibold mb-2 ${
                darkMode ? 'text-yellow-400' : 'text-yellow-800'
              }`}>
                Ważne zasady szczepień w PMR:
              </h4>
              <ul className={`list-disc list-inside space-y-1 text-sm ${
                darkMode ? 'text-yellow-300' : 'text-yellow-700'
              }`}>
                <li>Szczepionki żywe są przeciwwskazane podczas terapii immunosupresyjnej</li>
                <li>Szczepienia należy wykonać przed rozpoczęciem leczenia biologicznego</li>
                <li>Odpowiedź immunologiczna może być osłabiona podczas terapii steroidowej</li>
                <li>Sprawdź status serologiczny przed szczepieniami</li>
                <li>Skonsultuj się z reumatologiem przed szczepieniami</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PMRCalculator;