import React, { useState, useEffect } from 'react';
import MainLayout from '../layout/MainLayout';
import SubjectCard from '../subjects/SubjectCard';
import { useAuth } from '../../contexts/AuthContext';
import { 
  doctorSpecializedSubjects, 
  nurseSpecializedSubjects, 
  physiotherapistSpecializedSubjects, 
  pharmacistSpecializedSubjects,
  dietitianSpecializedSubjects,
  psychologistSpecializedSubjects,
  paramedicSpecializedSubjects,
  dentistSpecializedSubjects,
  remainingSpecializedSubjects,
  allSpecializedSubjects,
  getSpecializedSubjectsForProfession
} from '../../data/specializedSubjects';
import { FaChevronDown, FaChevronUp, FaFilter, FaCertificate } from 'react-icons/fa';

interface SpecializedSubjectsPageProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const SpecializedSubjectsPage: React.FC<SpecializedSubjectsPageProps> = ({ darkMode, fontSize }) => {
  const [showAll, setShowAll] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('wszystkie');
  const [selectedLevel, setSelectedLevel] = useState<string>('wszystkie');
  const [showOnlyCertified, setShowOnlyCertified] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    favorites: true,
    professional: true,
    remaining: false
  });
  const { profile } = useAuth();
  const userProfession = profile?.zawod || 'lekarz';

  useEffect(() => {
    document.title = 'Przedmioty Specjalistyczne – DlaMedica.pl';
    
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('favoriteSpecializedSubjects');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const handleFavoriteToggle = (subjectId: number) => {
    const newFavorites = favorites.includes(subjectId)
      ? favorites.filter(id => id !== subjectId)
      : [...favorites, subjectId];
    
    setFavorites(newFavorites);
    localStorage.setItem('favoriteSpecializedSubjects', JSON.stringify(newFavorites));
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSubjectClick = (subjectId: number) => {
    // Navigate to subject detail page
    const targetPath = `/edukacja/przedmiot/${subjectId}`;
    window.history.pushState({}, '', targetPath);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          title: 'text-2xl',
          subtitle: 'text-base',
          sectionTitle: 'text-lg',
          buttonText: 'text-sm'
        };
      case 'large':
        return {
          title: 'text-4xl',
          subtitle: 'text-xl',
          sectionTitle: 'text-2xl',
          buttonText: 'text-lg'
        };
      default:
        return {
          title: 'text-3xl',
          subtitle: 'text-lg',
          sectionTitle: 'text-xl',
          buttonText: 'text-base'
        };
    }
  };

  const fontSizes = getFontSizeClasses();

  // Filter subjects based on selected filters
  const filterSubjects = (subjects: any[]) => {
    return subjects.filter(subject => {
      const categoryMatch = selectedCategory === 'wszystkie' || subject.category === selectedCategory;
      const levelMatch = selectedLevel === 'wszystkie' || subject.level === selectedLevel;
      const certificationMatch = !showOnlyCertified || subject.hasCertification;
      
      return categoryMatch && levelMatch && certificationMatch;
    });
  };

  // Get subjects for user's profession
  const professionalSubjects = getSpecializedSubjectsForProfession(userProfession);
  
  // Get favorite subjects
  const favoriteSubjects = allSpecializedSubjects.filter(s => favorites.includes(s.id));
  
  // Get remaining subjects (not in professional list)
  const otherSubjects = remainingSpecializedSubjects.filter(
    s => !professionalSubjects.find(p => p.name === s.name)
  );

  // Categories for filtering
  const categories = ['wszystkie', 'Procedury', 'Diagnostyka', 'Technologie', 'Specjalistyczne'];
  const levels = ['wszystkie', 'Podstawowy', 'Średniozaawansowany', 'Ekspert'];

  return (
    <MainLayout darkMode={darkMode} showSidebar={true} currentPage="specialized-subjects">
      <div className={`p-8 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className={`${fontSizes.title} font-bold mb-4`}>
              ⭐ Przedmioty Specjalistyczne
            </h1>
            <p className={`${fontSizes.subtitle} ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
              Zaawansowane specjalizacje medyczne, certyfikacje i nowoczesne technologie
            </p>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2">
                <FaFilter className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`px-3 py-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'wszystkie' ? 'Wszystkie kategorie' : category}
                    </option>
                  ))}
                </select>
              </div>
              
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className={`px-3 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                {levels.map(level => (
                  <option key={level} value={level}>
                    {level === 'wszystkie' ? 'Wszystkie poziomy' : level}
                  </option>
                ))}
              </select>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnlyCertified}
                  onChange={(e) => setShowOnlyCertified(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <FaCertificate className="text-yellow-500" />
                <span className={fontSizes.buttonText}>Tylko z certyfikacją</span>
              </label>
            </div>
            
          </div>

          {/* Zawsze pokazuj tylko sugerowane przedmioty dla zawodu */}
          <>
              {/* Favorite Subjects Section */}
              <div className="mb-8">
                <button
                  onClick={() => toggleSection('favorites')}
                  className={`w-full flex items-center justify-between p-4 rounded-lg mb-4 ${
                    darkMode ? 'bg-yellow-900/20 border border-yellow-700/50' : 'bg-yellow-50 border border-yellow-200'
                  }`}
                >
                  <h2 className={`${fontSizes.sectionTitle} font-bold ${darkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
                    ⭐ Ulubione przedmioty ({favoriteSubjects.length})
                  </h2>
                  {expandedSections.favorites ? <FaChevronUp /> : <FaChevronDown />}
                </button>
                
                {expandedSections.favorites && (
                  <div className="mb-6">
                    {favoriteSubjects.length === 0 ? (
                      <div className={`p-8 rounded-lg text-center ${
                        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
                      }`}>
                        <p className={`${fontSizes.subtitle} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Dodaj przedmioty do ulubionych klikając gwiazdkę
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filterSubjects(favoriteSubjects).map(subject => (
                          <SubjectCard
                            key={subject.id}
                            subject={{
                              ...subject,
                              isFavorite: true
                            }}
                            onFavoriteToggle={handleFavoriteToggle}
                            darkMode={darkMode}
                            onClick={() => handleSubjectClick(subject.id)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Professional Subjects Section */}
              <div className="mb-8">
                <button
                  onClick={() => toggleSection('professional')}
                  className={`w-full flex items-center justify-between p-4 rounded-lg mb-4 ${
                    darkMode ? 'bg-blue-900/20 border border-blue-700/50' : 'bg-blue-50 border border-blue-200'
                  }`}
                >
                  <h2 className={`${fontSizes.sectionTitle} font-bold ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                    🎯 Wybrane dla Twojego zawodu: {userProfession.toUpperCase()} ({professionalSubjects.length})
                  </h2>
                  {expandedSections.professional ? <FaChevronUp /> : <FaChevronDown />}
                </button>
                
                {expandedSections.professional && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {filterSubjects(professionalSubjects).map(subject => (
                      <SubjectCard
                        key={subject.id}
                        subject={{
                          ...subject,
                          isFavorite: favorites.includes(subject.id)
                        }}
                        onFavoriteToggle={handleFavoriteToggle}
                        darkMode={darkMode}
                        onClick={() => handleSubjectClick(subject.id)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Sekcja "Pozostałe przedmioty" została wyłączona - każda grupa zawodowa ma swoje przypisane przedmioty */}
            </>
        </div>
      </div>
    </MainLayout>
  );
};

export default SpecializedSubjectsPage;