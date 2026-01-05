import React, { useState, useEffect } from 'react';
import MainLayout from '../layout/MainLayout';
import { FaArrowLeft, FaSave, FaPlus } from 'react-icons/fa';

interface CreateFlashcardSetProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const CreateFlashcardSet: React.FC<CreateFlashcardSetProps> = ({ darkMode, fontSize }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Anatomia',
    subcategory: '',
    difficulty: 'Średni',
    tags: '',
    language: 'Polski',
    visibility: 'private'
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    document.title = 'Utwórz nowy zestaw fiszek – DlaMedica.pl';
  }, []);

  const handleGoBack = () => {
    window.history.pushState({}, '', '/fiszki');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Nazwa zestawu jest wymagana';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Nazwa nie może być dłuższa niż 100 znaków';
    }

    if (formData.description.length > 500) {
      newErrors.description = 'Opis nie może być dłuższy niż 500 znaków';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveAndExit = () => {
    if (validateForm()) {
      // TODO: Save flashcard set to database
      console.log('Saving flashcard set:', formData);
      window.history.pushState({}, '', '/fiszki');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const handleSaveAndAddCards = () => {
    if (validateForm()) {
      // TODO: Save flashcard set to database and get ID
      const mockSetId = Date.now(); // Mock ID for now
      console.log('Saving flashcard set and redirecting to editor:', formData);
      window.history.pushState({}, '', `/fiszki/edit/${mockSetId}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          title: 'text-2xl',
          subtitle: 'text-base',
          label: 'text-sm',
          input: 'text-sm',
          button: 'text-sm'
        };
      case 'large':
        return {
          title: 'text-4xl',
          subtitle: 'text-xl',
          label: 'text-lg',
          input: 'text-lg',
          button: 'text-lg'
        };
      default:
        return {
          title: 'text-3xl',
          subtitle: 'text-lg',
          label: 'text-base',
          input: 'text-base',
          button: 'text-base'
        };
    }
  };

  const fontSizes = getFontSizeClasses();

  const categories = [
    'Anatomia', 'Fizjologia', 'Biochemia', 'Farmakologia',
    'Kardiologia', 'Neurologia', 'Pediatria', 'Chirurgia',
    'Pielęgniarstwo', 'Fizjoterapia', 'Psychologia', 'Inne'
  ];

  const subcategoriesByCategory: { [key: string]: string[] } = {
    'Anatomia': ['Układ krążenia', 'Układ nerwowy', 'Układ oddechowy', 'Układ pokarmowy', 'Układ moczowy'],
    'Fizjologia': ['Fizjologia serca', 'Fizjologia oddychania', 'Fizjologia nerek', 'Endokrynologia'],
    'Biochemia': ['Metabolizm', 'Enzymy', 'Białka', 'Kwasy nukleowe'],
    'Farmakologia': ['Farmakodynamika', 'Farmakokinetyka', 'Leki sercowo-naczyniowe', 'Antybiotyki'],
    'Kardiologia': ['Zaburzenia rytmu', 'Niewydolność serca', 'Choroba wieńcowa'],
    'Neurologia': ['Udar mózgu', 'Padaczka', 'Choroby neurodegeneracyjne'],
    'Pediatria': ['Noworodkologia', 'Szczepienia', 'Rozwój dziecka'],
    'Chirurgia': ['Chirurgia ogólna', 'Chirurgia naczyniowa', 'Neurochirurgia'],
    'Pielęgniarstwo': ['Opieka nad pacjentem', 'Procedury pielęgniarskie', 'Edukacja zdrowotna'],
    'Fizjoterapia': ['Rehabilitacja', 'Kinezyterapia', 'Fizykoterapia'],
    'Psychologia': ['Psychologia kliniczna', 'Psychoterapia', 'Zaburzenia psychiczne'],
    'Inne': ['Medycyna ratunkowa', 'Medycyna pracy', 'Epidemiologia']
  };

  return (
    <MainLayout darkMode={darkMode} showSidebar={true} currentPage="flashcards">
      <div className={`p-8 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb and Back Button */}
          <div className="mb-6">
            <button
              onClick={handleGoBack}
              className={`flex items-center gap-2 ${fontSizes.button} ${
                darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              } transition-colors mb-4`}
            >
              <FaArrowLeft />
              Powrót do biblioteki fiszek
            </button>
            
            <nav className={`${fontSizes.label} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Fiszki → Utwórz nowy zestaw
            </nav>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className={`${fontSizes.title} font-bold mb-4`}>
              📇 Utwórz nowy zestaw fiszek
            </h1>
            <p className={`${fontSizes.subtitle} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Wypełnij podstawowe informacje o swoim zestawie fiszek
            </p>
          </div>

          {/* Form */}
          <div className={`rounded-xl p-8 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          } shadow-lg`}>
            
            {/* Basic Information */}
            <div className="mb-8">
              <h2 className={`${fontSizes.subtitle} font-semibold mb-6 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Podstawowe informacje
              </h2>
              
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className={`block ${fontSizes.label} font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Nazwa zestawu *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="np. Anatomia układu krążenia"
                    maxLength={100}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.title 
                        ? 'border-red-500 focus:border-red-500' 
                        : darkMode 
                          ? 'border-gray-600 focus:border-blue-500' 
                          : 'border-gray-300 focus:border-blue-500'
                    } ${
                      darkMode 
                        ? 'bg-gray-700 text-white placeholder-gray-400' 
                        : 'bg-white text-gray-900 placeholder-gray-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${fontSizes.input}`}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {formData.title.length}/100 znaków
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className={`block ${fontSizes.label} font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Opis zestawu (opcjonalny)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Krótki opis czego dotyczy zestaw..."
                    maxLength={500}
                    rows={4}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.description 
                        ? 'border-red-500 focus:border-red-500' 
                        : darkMode 
                          ? 'border-gray-600 focus:border-blue-500' 
                          : 'border-gray-300 focus:border-blue-500'
                    } ${
                      darkMode 
                        ? 'bg-gray-700 text-white placeholder-gray-400' 
                        : 'bg-white text-gray-900 placeholder-gray-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none ${fontSizes.input}`}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                  )}
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {formData.description.length}/500 znaków
                  </p>
                </div>
              </div>
            </div>

            {/* Categorization */}
            <div className="mb-8">
              <h2 className={`${fontSizes.subtitle} font-semibold mb-6 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Kategoryzacja
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category */}
                <div>
                  <label className={`block ${fontSizes.label} font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Kategoria
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${fontSizes.input}`}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subcategory */}
                <div>
                  <label className={`block ${fontSizes.label} font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Podkategoria
                  </label>
                  <select
                    value={formData.subcategory}
                    onChange={(e) => handleInputChange('subcategory', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${fontSizes.input}`}
                  >
                    <option value="">Wybierz podkategorię (opcjonalnie)</option>
                    {subcategoriesByCategory[formData.category]?.map(subcategory => (
                      <option key={subcategory} value={subcategory}>
                        {subcategory}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty */}
                <div>
                  <label className={`block ${fontSizes.label} font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Poziom trudności
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => handleInputChange('difficulty', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${fontSizes.input}`}
                  >
                    <option value="Łatwy">Łatwy</option>
                    <option value="Średni">Średni</option>
                    <option value="Trudny">Trudny</option>
                  </select>
                </div>

                {/* Tags */}
                <div>
                  <label className={`block ${fontSizes.label} font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Tagi
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    placeholder="anatomia, serce, układ krążenia..."
                    className={`w-full px-4 py-3 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${fontSizes.input}`}
                  />
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Słowa kluczowe oddzielone przecinkami
                  </p>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="mb-8">
              <h2 className={`${fontSizes.subtitle} font-semibold mb-6 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Ustawienia
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Language */}
                <div>
                  <label className={`block ${fontSizes.label} font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Język główny
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => handleInputChange('language', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${fontSizes.input}`}
                  >
                    <option value="Polski">Polski</option>
                    <option value="Angielski">Angielski</option>
                    <option value="Łacina medyczna">Łacina medyczna</option>
                    <option value="Mieszany">Mieszany</option>
                  </select>
                </div>

                {/* Visibility */}
                <div>
                  <label className={`block ${fontSizes.label} font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Widoczność
                  </label>
                  <select
                    value={formData.visibility}
                    onChange={(e) => handleInputChange('visibility', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${fontSizes.input}`}
                  >
                    <option value="private">🔒 Prywatny (tylko ja)</option>
                    <option value="public">🌍 Publiczny (wszyscy mogą zobaczyć)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-300 dark:border-gray-600">
              <button
                onClick={handleSaveAndAddCards}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors bg-[#38b6ff] hover:bg-[#2a9fe5] text-black ${fontSizes.button}`}
              >
                <FaPlus />
                Zapisz i dodaj fiszki
              </button>
              
              <button
                onClick={handleSaveAndExit}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600' 
                    : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300'
                } ${fontSizes.button}`}
              >
                <FaSave />
                Zapisz i wróć do biblioteki
              </button>
              
              <button
                onClick={handleGoBack}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  darkMode 
                    ? 'text-gray-400 hover:text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                } ${fontSizes.button}`}
              >
                Anuluj
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateFlashcardSet;