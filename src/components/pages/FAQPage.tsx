import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronRight, FaSearch, FaQuestionCircle, FaUserMd, FaBriefcase, FaGraduationCap, FaPills, FaCalculator, FaBook } from 'react-icons/fa';

interface FAQPageProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

const FAQPage: React.FC<FAQPageProps> = ({ darkMode, fontSize }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('wszystkie');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    document.title = 'FAQ - Najczęściej zadawane pytania | DlaMedica.pl';
    
    let descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      descriptionMeta.setAttribute('content', 'Najczęściej zadawane pytania o portal DlaMedica.pl - oferty pracy, kalkulatory medyczne, baza leków, edukacja medyczna i więcej.');
    }

    let ogTitleMeta = document.querySelector('meta[property="og:title"]');
    if (ogTitleMeta) {
      ogTitleMeta.setAttribute('content', 'FAQ - Najczęściej zadawane pytania | DlaMedica.pl');
    }

    let ogDescriptionMeta = document.querySelector('meta[property="og:description"]');
    if (ogDescriptionMeta) {
      ogDescriptionMeta.setAttribute('content', 'Najczęściej zadawane pytania o portal DlaMedica.pl - oferty pracy, kalkulatory medyczne, baza leków, edukacja medyczna i więcej.');
    }
  }, []);

  const categories = [
    { id: 'wszystkie', name: 'Wszystkie', icon: FaQuestionCircle },
    { id: 'konto', name: 'Konto użytkownika', icon: FaUserMd },
    { id: 'praca', name: 'Oferty pracy', icon: FaBriefcase },
    { id: 'edukacja', name: 'Edukacja', icon: FaGraduationCap },
    { id: 'leki', name: 'Baza leków', icon: FaPills },
    { id: 'kalkulatory', name: 'Kalkulatory', icon: FaCalculator },
    { id: 'techniczne', name: 'Problemy techniczne', icon: FaBook }
  ];

  const faqData: FAQItem[] = [
    // KONTO UŻYTKOWNIKA
    {
      id: '1',
      question: 'Jak założyć konto na DlaMedica.pl?',
      answer: 'Kliknij przycisk "Zaloguj się" w prawym górnym rogu strony, następnie wybierz "Zarejestruj się". Wypełnij formularz podając swój adres e-mail, hasło oraz podstawowe informacje o profilu zawodowym. Po rejestracji otrzymasz e-mail z potwierdzeniem konta.',
      category: 'konto',
      tags: ['rejestracja', 'konto', 'email', 'profil']
    },
    {
      id: '2',
      question: 'Zapomniałem hasła. Jak mogę je odzyskać?',
      answer: 'Na stronie logowania kliknij "Zapomniałeś hasła?". Wpisz swój adres e-mail, a otrzymasz link do resetowania hasła. Kliknij w link w e-mailu i ustaw nowe hasło.',
      category: 'konto',
      tags: ['hasło', 'reset', 'email', 'logowanie']
    },
    {
      id: '3',
      question: 'Jak zmienić dane w profilu?',
      answer: 'Po zalogowaniu wejdź w sekcję "Profil" przez menu użytkownika. Tam możesz edytować swoje dane osobowe, zawód, specjalizację, miasto, numer telefonu oraz dodać zdjęcie profilowe.',
      category: 'konto',
      tags: ['profil', 'dane', 'edycja', 'zdjęcie']
    },
    {
      id: '4',
      question: 'Jaka jest różnica między kontem użytkownika a kontem firmowym?',
      answer: 'Konto użytkownika pozwala przeglądać oferty pracy, aplikować na stanowiska, korzystać z kalkulatorów i bazy leków. Konto firmowe dodatkowo umożliwia publikowanie ofert pracy, zarządzanie aplikacjami kandydatów i organizowanie wydarzeń medycznych.',
      category: 'konto',
      tags: ['konto', 'firma', 'użytkownik', 'różnice', 'uprawnienia']
    },

    // OFERTY PRACY
    {
      id: '5',
      question: 'Jak aplikować na oferty pracy?',
      answer: 'Znajdź interesującą Cię ofertę w sekcji "Praca", kliknij w nią aby zobaczyć szczegóły. Następnie kliknij przycisk "Aplikuj" i wypełnij formularz aplikacyjny. Możesz załączyć CV oraz list motywacyjny.',
      category: 'praca',
      tags: ['aplikacja', 'cv', 'praca', 'formularz']
    },
    {
      id: '6',
      question: 'Jak mogę śledzić status swoich aplikacji?',
      answer: 'W sekcji "Profil" znajdziesz zakładkę "Moje aplikacje", gdzie zobaczysz wszystkie swoje aplikacje wraz z ich statusem: oczekująca, rozpatrywana, zaakceptowana lub odrzucona.',
      category: 'praca',
      tags: ['aplikacje', 'status', 'śledzenie', 'profil']
    },
    {
      id: '7',
      question: 'Czy mogę zapisać oferty pracy na później?',
      answer: 'Tak! Kliknij ikonę serca przy ofercie pracy aby dodać ją do ulubionych. Swoje ulubione oferty znajdziesz w sekcji "Ulubione" w swoim profilu.',
      category: 'praca',
      tags: ['ulubione', 'zapisywanie', 'oferty', 'serce']
    },
    {
      id: '8',
      question: 'Jak publikować oferty pracy jako pracodawca?',
      answer: 'Potrzebujesz konta firmowego. Po zalogowaniu wejdź w sekcję "Profil" i kliknij "Dodaj ofertę pracy". Wypełnij wszystkie wymagane pola: stanowisko, opis, wymagania, benefity, lokalizację i wynagrodzenie.',
      category: 'praca',
      tags: ['pracodawca', 'publikowanie', 'oferty', 'firma']
    },

    // EDUKACJA
    {
      id: '9',
      question: 'Jakie materiały edukacyjne są dostępne?',
      answer: 'Portal oferuje artykuły medyczne, kursy online, webinary, konferencje oraz materiały do nauki przedmiotów przedklinicznych, klinicznych i specjalistycznych. Znajdziesz również flashcards i plany nauki.',
      category: 'edukacja',
      tags: ['materiały', 'kursy', 'artykuły', 'webinary', 'flashcards']
    },
    {
      id: '10',
      question: 'Jak korzystać z flashcards?',
      answer: 'W sekcji "Edukacja" wybierz "Flashcards". Możesz przeglądać gotowe zestawy fiszek lub tworzyć własne. Dostępne są różne tryby nauki: klasyczny, nauka, pisanie, test, dopasowywanie i gra w grawitację.',
      category: 'edukacja',
      tags: ['flashcards', 'fiszki', 'nauka', 'tryby', 'test']
    },
    {
      id: '11',
      question: 'Czy mogę tworzyć własne notatki?',
      answer: 'Tak! W sekcji "Edukacja" znajdziesz "Bibliotekę notatek", gdzie możesz tworzyć, edytować i organizować swoje notatki medyczne. Notatki obsługują formatowanie tekstu i obrazy.',
      category: 'edukacja',
      tags: ['notatki', 'tworzenie', 'edytor', 'organizacja']
    },

    // BAZA LEKÓW
    {
      id: '12',
      question: 'Jak wyszukiwać leki w bazie?',
      answer: 'W sekcji "Leki" wpisz nazwę leku, substancję czynną lub kod ATC w pole wyszukiwania. Możesz również filtrować wyniki po producencie, dostępności i cenie.',
      category: 'leki',
      tags: ['wyszukiwanie', 'leki', 'substancja', 'ATC', 'filtry']
    },
    {
      id: '13',
      question: 'Skąd pochodzą informacje o lekach?',
      answer: 'Baza leków jest aktualizowana na podstawie oficjalnych źródeł farmaceutycznych i rejestrów produktów leczniczych. Dane obejmują nazwy, substancje czynne, kody ATC, dawkowanie, producentów i dostępność.',
      category: 'leki',
      tags: ['źródła', 'dane', 'farmaceutyczne', 'aktualizacje']
    },
    {
      id: '14',
      question: 'Czy mogę sprawdzić substytucje leków?',
      answer: 'Tak, przy każdym leku znajdziesz informacje o możliwych substytutach o tej samej substancji czynnej. System automatycznie wyszukuje leki o podobnym składzie i działaniu.',
      category: 'leki',
      tags: ['substytuty', 'zamienniki', 'substancja czynna', 'podobne']
    },

    // KALKULATORY
    {
      id: '15',
      question: 'Jakie kalkulatory medyczne są dostępne?',
      answer: 'Portal oferuje ponad 50 kalkulatorów medycznych obejmujących kardiologię, nefrologię, pulmonologię, endokrynologię i inne dziedziny. Znajdziesz m.in. kalkulator BMI, GFR, dawek leków czy ryzyka sercowo-naczyniowego.',
      category: 'kalkulatory',
      tags: ['kalkulatory', 'medyczne', 'BMI', 'GFR', 'dawki', 'kardiologia']
    },
    {
      id: '16',
      question: 'Czy wyniki kalkulatorów są dokładne?',
      answer: 'Kalkulatory są oparte na uznanych wzorach i wytycznych medycznych. Jednak wyniki służą wyłącznie celom edukacyjnym i informacyjnym - nie zastępują profesjonalnej konsultacji medycznej.',
      category: 'kalkulatory',
      tags: ['dokładność', 'wytyczne', 'edukacyjne', 'konsultacja']
    },
    {
      id: '17',
      question: 'Jak korzystać z kalkulatorów?',
      answer: 'Wybierz kalkulator z listy, wprowadź wymagane parametry (np. wiek, wagę, wyniki badań) i kliknij "Oblicz". System automatycznie przeliczy wynik i wyświetli interpretację oraz wartości referencyjne.',
      category: 'kalkulatory',
      tags: ['instrukcja', 'parametry', 'obliczenia', 'interpretacja']
    },

    // TECHNICZNE
    {
      id: '18',
      question: 'Strona nie ładuje się poprawnie. Co robić?',
      answer: 'Spróbuj odświeżyć stronę (Ctrl+F5), wyczyścić pamięć podręczną przeglądarki lub spróbować innej przeglądarki. Jeśli problem nadal występuje, skontaktuj się z naszym zespołem technicznym.',
      category: 'techniczne',
      tags: ['błędy', 'ładowanie', 'przeglądarka', 'cache']
    },
    {
      id: '19',
      question: 'Czy portal jest responsywny na urządzeniach mobilnych?',
      answer: 'Tak! Portal DlaMedica.pl jest w pełni responsywny i optymalizowany dla smartfonów i tabletów. Wszystkie funkcjonalności są dostępne na urządzeniach mobilnych.',
      category: 'techniczne',
      tags: ['responsywny', 'mobile', 'smartfon', 'tablet']
    },
    {
      id: '20',
      question: 'Jak zmienić rozmiar czcionki na stronie?',
      answer: 'W prawym górnym rogu strony znajdziesz ikonę "Aa" - to ustawienia dostępności. Możesz tam wybrać rozmiar czcionki (mały/średni/duży) oraz włączyć tryb ciemny.',
      category: 'techniczne',
      tags: ['czcionka', 'dostępność', 'tryb ciemny', 'ustawienia']
    },
    {
      id: '21',
      question: 'Nie mogę zalogować się na swoje konto.',
      answer: 'Sprawdź czy wprowadzasz poprawny adres e-mail i hasło. Upewnij się, że klawiatura ma wyłączony Caps Lock. Jeśli nadal nie możesz się zalogować, użyj opcji "Zapomniałeś hasła?" lub skontaktuj się z nami.',
      category: 'techniczne',
      tags: ['logowanie', 'hasło', 'email', 'problemy']
    },

    // DODATKOWE PYTANIA
    {
      id: '22',
      question: 'Czy korzystanie z portalu jest bezpłatne?',
      answer: 'Podstawowe funkcjonalności portalu (przeglądanie ofert pracy, baza leków, kalkulatory, artykuły) są całkowicie bezpłatne. Niektóre zaawansowane funkcje mogą wymagać konta premium.',
      category: 'konto',
      tags: ['bezpłatne', 'premium', 'opłaty', 'funkcjonalności']
    },
    {
      id: '23',
      question: 'Jak mogę skontaktować się z zespołem DlaMedica.pl?',
      answer: 'Możesz skorzystać z formularza kontaktowego na stronie "Kontakt", wysłać e-mail lub skorzystać z czatu online dostępnego na stronie. Odpowiadamy na wszystkie zapytania w ciągu 24 godzin.',
      category: 'konto',
      tags: ['kontakt', 'formularz', 'email', 'czat', 'pomoc']
    },
    {
      id: '24',
      question: 'Czy moje dane osobowe są bezpieczne?',
      answer: 'Tak, wszystkie dane osobowe są szyfrowane i przechowywane zgodnie z RODO. Nie udostępniamy danych osobowych third party bez Twojej zgody. Szczegóły znajdziesz w Polityce Prywatności.',
      category: 'konto',
      tags: ['bezpieczeństwo', 'RODO', 'prywatność', 'dane', 'szyfrowanie']
    }
  ];

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          title: 'text-3xl md:text-4xl',
          subtitle: 'text-lg md:text-xl',
          categoryTitle: 'text-lg',
          questionTitle: 'text-base',
          answerText: 'text-sm',
          searchText: 'text-sm'
        };
      case 'large':
        return {
          title: 'text-5xl md:text-6xl',
          subtitle: 'text-xl md:text-2xl',
          categoryTitle: 'text-xl',
          questionTitle: 'text-lg',
          answerText: 'text-base',
          searchText: 'text-base'
        };
      default:
        return {
          title: 'text-4xl md:text-5xl',
          subtitle: 'text-xl md:text-2xl',
          categoryTitle: 'text-xl',
          questionTitle: 'text-lg',
          answerText: 'text-base',
          searchText: 'text-base'
        };
    }
  };

  const fontClasses = getFontSizeClasses();

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const filteredFAQ = faqData.filter(item => {
    const matchesCategory = selectedCategory === 'wszystkie' || item.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const expandAll = () => {
    setExpandedItems(new Set(filteredFAQ.map(item => item.id)));
  };

  const collapseAll = () => {
    setExpandedItems(new Set());
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Hero Section */}
      <div className={`${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-blue-500 to-blue-600'} text-white py-16`} style={{ background: darkMode ? 'linear-gradient(to right, #1f2937, #111827)' : 'linear-gradient(to right, #38b6ff, #2ea3e6)' }}>
        <div className="container mx-auto px-4 text-center">
          <h1 className={`font-bold mb-4 ${fontClasses.title}`}>
            Najczęściej zadawane pytania
          </h1>
          <p className={`max-w-2xl mx-auto ${fontClasses.subtitle}`}>
            Znajdź odpowiedzi na najczęstsze pytania dotyczące portalu DlaMedica.pl
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search and Controls */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Szukaj w FAQ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${fontClasses.searchText}`}
                style={{ 
                  '--focus-border-color': '#38b6ff',
                  '--focus-ring-color': 'rgba(56, 182, 255, 0.2)'
                } as React.CSSProperties}
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${fontClasses.searchText} ${
                    selectedCategory === category.id
                      ? 'text-white'
                      : darkMode
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border'
                  }`}
                  style={selectedCategory === category.id ? { backgroundColor: '#38b6ff' } : {}}
                >
                  <IconComponent className="w-4 h-4" />
                  {category.name}
                </button>
              );
            })}
          </div>

          {/* Expand/Collapse Controls */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={expandAll}
              className={`px-4 py-2 rounded-lg transition-colors ${fontClasses.searchText} ${
                darkMode 
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 border'
              }`}
            >
              Rozwiń wszystkie
            </button>
            <button
              onClick={collapseAll}
              className={`px-4 py-2 rounded-lg transition-colors ${fontClasses.searchText} ${
                darkMode 
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 border'
              }`}
            >
              Zwiń wszystkie
            </button>
          </div>
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto">
          {filteredFAQ.length === 0 ? (
            <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <FaQuestionCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className={fontClasses.subtitle}>Nie znaleziono pytań pasujących do Twojego wyszukiwania.</p>
              <p className={fontClasses.answerText}>Spróbuj zmienić kryteria wyszukiwania lub skontaktuj się z nami bezpośrednio.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFAQ.map((item) => {
                const isExpanded = expandedItems.has(item.id);
                return (
                  <div
                    key={item.id}
                    className={`rounded-lg border transition-all duration-200 ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <button
                      onClick={() => toggleExpanded(item.id)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-opacity-50 transition-colors"
                    >
                      <h3 className={`font-semibold pr-4 ${fontClasses.questionTitle}`}>
                        {item.question}
                      </h3>
                      {isExpanded ? (
                        <FaChevronDown className="w-5 h-5 flex-shrink-0" style={{ color: '#38b6ff' }} />
                      ) : (
                        <FaChevronRight className={`w-5 h-5 flex-shrink-0 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      )}
                    </button>
                    
                    {isExpanded && (
                      <div className={`px-6 pb-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                        <div className="pt-4">
                          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed ${fontClasses.answerText}`}>
                            {item.answer}
                          </p>
                          
                          {/* Tags */}
                          <div className="mt-4 flex flex-wrap gap-2">
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                className={`px-2 py-1 text-xs rounded-full ${
                                  darkMode 
                                    ? 'bg-gray-700 text-gray-300' 
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Contact CTA */}
        <div className={`mt-16 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-8 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`font-bold mb-4 ${fontClasses.categoryTitle}`}>
            Nie znalazłeś odpowiedzi na swoje pytanie?
          </h2>
          <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'} ${fontClasses.answerText}`}>
            Skontaktuj się z naszym zespołem - chętnie pomożemy!
          </p>
          <button
            onClick={() => window.location.href = '/contact'}
            className={`text-white px-6 py-3 rounded-lg font-semibold transition-colors ${fontClasses.searchText}`}
            style={{ 
              backgroundColor: '#38b6ff',
              ':hover': { backgroundColor: '#2ea3e6' }
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2ea3e6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#38b6ff'}
          >
            Skontaktuj się z nami
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;