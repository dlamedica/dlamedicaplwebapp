import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PopularArticlesService } from '../../services/popularArticlesService';
import { getJobOffers } from '../../services/mockJobService';
import { useAuth } from '../../contexts/AuthContext';
import Banner from '../Banner';
import CategoryBar from '../CategoryBar';
import NewsTicker from '../NewsTicker';
import PlatformInfoModal from '../PlatformInfoModal';
import PlatformAccessSection from '../PlatformAccessSection';
import { useUserLocation } from '../../hooks/useUserLocation';

import { WordPressService, WooCommerceProduct } from '../../services/wordpressService';
import { CalculatorService } from '../../services/calculatorService';
import { getUpcomingEvents } from '../../services/mockEventsService';

interface HomeProps {
  darkMode: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

// Przykładowe artykuły - definicja poza komponentem
const sampleArticles = [
  {
    id: 1,
    title: "Przełom w terapii genowej - nowe możliwości leczenia chorób rzadkich",
    excerpt: "Najnowsze badania pokazują, że terapia genowa może być skuteczna w leczeniu chorób genetycznych, które dotychczas były nieuleczalne. Naukowcy z Harvard Medical School opracowali innowacyjną metodę.",
    category: "Nauka",
    publishedAt: "2024-01-28",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&h=500&fit=crop",
    author: "Dr Anna Kowalska",
    readTime: "8 min"
  },
  {
    id: 2,
    title: "Sztuczna inteligencja w diagnostyce obrazowej - rewolucja w medycynie",
    excerpt: "Systemy AI osiągają już 95% dokładności w wykrywaniu nowotworów na podstawie zdjęć RTG i tomografii komputerowej. To przełom w diagnostyce medycznej.",
    category: "Technologie",
    publishedAt: "2024-01-27",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=500&fit=crop",
    author: "Prof. Marek Nowak",
    readTime: "6 min"
  },
  {
    id: 3,
    title: "Nowe standardy leczenia COVID-19 - aktualizacja protokołów klinicznych",
    excerpt: "Ministerstwo Zdrowia wydało nowe wytyczne dotyczące leczenia COVID-19 uwzględniające najnowsze odkrycia naukowe i warianty wirusa.",
    category: "Aktualności",
    publishedAt: "2024-01-26",
    image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800&h=500&fit=crop",
    author: "Dr Piotr Wiśniewski",
    readTime: "5 min"
  },
  {
    id: 4,
    title: "Europejska Agencja Leków zatwierdza pierwszy lek genowy",
    excerpt: "Europejska Agencja Leków zatwierdziła pierwszy lek oparty na terapii genowej do leczenia rzadkich chorób metabolicznych u dzieci.",
    category: "Leczenie",
    publishedAt: "2024-01-25",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&h=500&fit=crop",
    author: "Dr Katarzyna Zielińska",
    readTime: "7 min"
  },
  {
    id: 5,
    title: "Wpływ zanieczyszczenia powietrza na zdrowie układu oddechowego",
    excerpt: "Długoterminowe badanie kohortowe potwierdza związek między jakością powietrza a częstością występowania astmy u dzieci. Wyniki są alarmujące.",
    category: "Zdrowie publiczne",
    publishedAt: "2024-01-24",
    image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=500&fit=crop",
    author: "Prof. Jan Kowalczyk",
    readTime: "10 min"
  },
  {
    id: 6,
    title: "Telemedycyna - przyszłość opieki zdrowotnej w Polsce",
    excerpt: "Raport NFZ pokazuje, że liczba konsultacji telemedycznych wzrosła o 300% w ostatnim roku. Pacjenci doceniają wygodę i dostępność.",
    category: "Technologie",
    publishedAt: "2024-01-23",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=500&fit=crop",
    author: "Dr Maria Lewandowska",
    readTime: "4 min"
  }
];

const Home: React.FC<HomeProps> = ({ darkMode, highContrast, fontSize }) => {
  const { user, isAuthenticated } = useAuth();
  const { country, isForeign, isLoading: locationLoading } = useUserLocation();
  const [latestJobOffers, setLatestJobOffers] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<WooCommerceProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [featuredCalculators, setFeaturedCalculators] = useState<any[]>([]);
  const [loadingCalculators, setLoadingCalculators] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const recentArticlesRef = useRef<HTMLDivElement>(null);
  
  // Stan dla modala z informacjami o platformie
  const [showPlatformModal, setShowPlatformModal] = useState(false);
  const [showAccessSection, setShowAccessSection] = useState(false);
  const [hasShownModal, setHasShownModal] = useState(false);

  const loadLatestJobOffers = useCallback(async () => {
    try {
      setLoadingJobs(true);
      const offers = await getJobOffers();
      const sorted = offers
        .sort((a: any, b: any) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())
        .slice(0, 3);
      setLatestJobOffers(sorted);
    } catch (error) {
      console.error('Błąd ładowania ofert pracy:', error);
    } finally {
      setLoadingJobs(false);
    }
  }, []);

  const loadFeaturedProducts = useCallback(async () => {
    try {
      setLoadingProducts(true);
      const response = await WordPressService.getProducts(1, 4, undefined, undefined, true);
      setFeaturedProducts(response.products.slice(0, 4));
    } catch (error) {
      console.error('Błąd ładowania produktów:', error);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  const loadFeaturedCalculators = useCallback(async () => {
    try {
      setLoadingCalculators(true);
      const result = await CalculatorService.getFeaturedCalculators(4);
      if (result.data) {
        setFeaturedCalculators(result.data.slice(0, 4));
      }
    } catch (error) {
      console.error('Błąd ładowania kalkulatorów:', error);
    } finally {
      setLoadingCalculators(false);
    }
  }, []);

  const loadUpcomingEvents = useCallback(async () => {
    try {
      setLoadingEvents(true);
      const { data, error } = await getUpcomingEvents(4);
      if (error) throw error;
      if (data) {
        setUpcomingEvents(data.slice(0, 4));
      }
    } catch (error) {
      console.error('Błąd ładowania wydarzeń:', error);
    } finally {
      setLoadingEvents(false);
    }
  }, []);

  useEffect(() => {
    PopularArticlesService.initialize();
    PopularArticlesService.generateSampleData(sampleArticles.map(a => a.id));
    loadLatestJobOffers();
    loadFeaturedProducts();
    loadFeaturedCalculators();
    loadUpcomingEvents();
  }, [loadLatestJobOffers, loadFeaturedProducts, loadFeaturedCalculators, loadUpcomingEvents]);

  // Logika wyświetlania modala dla użytkowników zagranicznych
  useEffect(() => {
    // Sprawdź czy użytkownik jest zalogowany i z zagranicy
    if (!locationLoading && isAuthenticated && isForeign && !hasShownModal) {
      // Sprawdź czy użytkownik już widział modal (w localStorage)
      const hasSeenModal = localStorage.getItem('platformInfoModalShown');
      if (!hasSeenModal) {
        // Pokaż modal po krótkim opóźnieniu (gdy użytkownik chce coś zrobić)
        const timer = setTimeout(() => {
          setShowPlatformModal(true);
          setHasShownModal(true);
          localStorage.setItem('platformInfoModalShown', 'true');
        }, 2000); // 2 sekundy opóźnienia

        return () => clearTimeout(timer);
      }
    }
  }, [locationLoading, isAuthenticated, isForeign, hasShownModal]);

  // Obsługa kliknięcia w interaktywny element (np. przycisk, link) - pokazuje modal
  useEffect(() => {
    const handleUserInteraction = () => {
      if (!locationLoading && isAuthenticated && isForeign && !hasShownModal) {
        const hasSeenModal = localStorage.getItem('platformInfoModalShown');
        if (!hasSeenModal) {
          setShowPlatformModal(true);
          setHasShownModal(true);
          localStorage.setItem('platformInfoModalShown', 'true');
        }
      }
    };

    // Nasłuchuj na pierwsze kliknięcie użytkownika
    document.addEventListener('click', handleUserInteraction, { once: true });
    return () => document.removeEventListener('click', handleUserInteraction);
  }, [locationLoading, isAuthenticated, isForeign, hasShownModal]);

  const handleCategoryChange = (category: string) => {
    // Obsługa zmiany kategorii - można dodać logikę jeśli potrzeba
    console.log('Category changed:', category);
  };

  const handleShowAccess = () => {
    setShowAccessSection(true);
    // Przewiń do sekcji dostępu
    setTimeout(() => {
      const accessSection = document.getElementById('platform-access-section');
      if (accessSection) {
        accessSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleNavigation = (path: string) => {
    window.location.href = path;
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'small': return 'text-sm';
      case 'large': return 'text-lg';
      default: return 'text-base';
    }
  };

  const scrollRecentArticles = (direction: 'left' | 'right') => {
    if (recentArticlesRef.current) {
      const scrollAmount = 320;
      recentArticlesRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Sortuj artykuły po popularności i dacie
  const topArticle = sampleArticles[0];
  const sideArticles = sampleArticles.slice(1, 4);
  const recentArticles = [...sampleArticles].sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${highContrast ? 'bg-white' : darkMode ? 'bg-gray-950' : 'bg-gray-50'
      }`}>
      {/* News Ticker */}
      <NewsTicker darkMode={darkMode} highContrast={highContrast} />

      {/* Hero Banner - kompaktowy */}
      <Banner darkMode={darkMode} fontSize={fontSize} />

      {/* Category Bar - kafelki */}
      <CategoryBar darkMode={darkMode} onCategoryChange={handleCategoryChange} />

      {/* ============================================ */}
      {/* SEKCJA: TOP NEWS (Najważniejsze teraz)     */}
      {/* ============================================ */}
      <section className={`py-10 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Nagłówek sekcji */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-1 h-8 rounded-full ${darkMode ? 'bg-[#38b6ff]' : 'bg-[#38b6ff]'}`}></div>
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Najważniejsze teraz
              </h2>
            </div>
            <a
              href="/aktualnosci"
              className={`text-sm font-medium flex items-center gap-1 transition-colors ${darkMode ? 'text-[#38b6ff] hover:text-white' : 'text-[#0284c7] hover:text-gray-900'
                }`}
            >
              Zobacz wszystkie
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Layout: 2 kolumny */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Główny artykuł - lewa kolumna (3/5) */}
            <article
              onClick={() => handleNavigation(`/artykul/${topArticle.id}`)}
              className={`lg:col-span-3 group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:shadow-xl border border-gray-100'
                }`}
            >
              <div className="relative h-64 sm:h-80 overflow-hidden">
                <img
                  src={topArticle.image}
                  alt={topArticle.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                {/* Badge kategorii */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#38b6ff] text-white">
                    {topArticle.category}
                  </span>
                </div>
                {/* Treść na obrazku */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 line-clamp-2 group-hover:text-[#38b6ff] transition-colors">
                    {topArticle.title}
                  </h3>
                  <p className="text-gray-200 text-sm line-clamp-2 mb-3">
                    {topArticle.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-300">
                    <span>{topArticle.author}</span>
                    <span>•</span>
                    <span>{new Date(topArticle.publishedAt).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' })}</span>
                    <span>•</span>
                    <span>{topArticle.readTime}</span>
                  </div>
                </div>
              </div>
            </article>

            {/* Boczne artykuły - prawa kolumna (2/5) */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {sideArticles.map((article, index) => (
                <article
                  key={article.id}
                  onClick={() => handleNavigation(`/artykul/${article.id}`)}
                  className={`group cursor-pointer flex gap-4 p-3 rounded-xl transition-all duration-300 ${darkMode
                    ? 'bg-gray-800 hover:bg-gray-750'
                    : 'bg-white hover:shadow-lg border border-gray-100'
                    }`}
                >
                  {/* Miniatura */}
                  <div className="flex-shrink-0 w-24 h-20 sm:w-28 sm:h-24 rounded-lg overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  {/* Treść */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <span className={`text-xs font-medium mb-1 ${darkMode ? 'text-[#38b6ff]' : 'text-[#0284c7]'
                      }`}>
                      {article.category}
                    </span>
                    <h4 className={`font-semibold text-sm line-clamp-2 mb-1 group-hover:text-[#38b6ff] transition-colors ${darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                      {article.title}
                    </h4>
                    <div className={`flex items-center gap-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                      <span>{new Date(article.publishedAt).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' })}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </article>
              ))}

              {/* Przycisk więcej newsów */}
              <a
                href="/aktualnosci"
                className={`flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${darkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-[#38b6ff] hover:text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-[#38b6ff] hover:text-white'
                  }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                Więcej aktualności
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Mała reklama AdSense - w osobnej sekcji */}
      <div className={`py-4 ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`h-20 rounded-lg flex items-center justify-center border transition-colors ${darkMode
            ? 'border-gray-800 bg-gray-900/50 text-gray-600'
            : 'border-gray-200 bg-white text-gray-400'
            }`}>
            <span className="text-xs">Reklama</span>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* SEKCJA: Najpopularniejsze artykuły         */}
      {/* ============================================ */}
      <section className={`py-12 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Nagłówek */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <svg className={`w-6 h-6 ${darkMode ? 'text-[#38b6ff]' : 'text-[#0284c7]'}`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Najpopularniejsze artykuły
                </h2>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Najczęściej czytane i polecane przez naszych użytkowników
              </p>
            </div>
          </div>

          {/* Grid kart artykułów */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PopularArticlesService.getMostPopular(sampleArticles, 6).map((article: any) => {
              const metrics = PopularArticlesService.getArticleMetrics(article.id);
              return (
                <article
                  key={article.id}
                  onClick={() => handleNavigation(`/artykul/${article.id}`)}
                  className={`group cursor-pointer rounded-xl overflow-hidden transition-all duration-300 ${darkMode
                    ? 'bg-gray-800 hover:shadow-2xl hover:shadow-[#38b6ff]/10'
                    : 'bg-white border border-gray-100 hover:shadow-xl hover:border-[#38b6ff]/30'
                    }`}
                >
                  {/* Obrazek 16:9 */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {/* Tag kategorii */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${darkMode
                        ? 'bg-[#38b6ff]/90 text-white'
                        : 'bg-[#38b6ff] text-white'
                        }`}>
                        {article.category}
                      </span>
                    </div>
                  </div>

                  {/* Treść */}
                  <div className="p-5">
                    <h3 className={`font-bold mb-2 line-clamp-2 group-hover:text-[#38b6ff] transition-colors ${darkMode ? 'text-white' : 'text-gray-900'
                      } ${fontSize === 'large' ? 'text-lg' : 'text-base'}`}>
                      {article.title}
                    </h3>
                    <p className={`text-sm mb-4 line-clamp-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                      {article.excerpt}
                    </p>
                    {/* Meta info */}
                    <div className={`flex items-center justify-between text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{article.author}</span>
                        <span>•</span>
                        <span>{new Date(article.publishedAt).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' })}</span>
                      </div>
                      <span className={`font-medium ${darkMode ? 'text-[#38b6ff]' : 'text-[#0284c7]'}`}>
                        Czytaj więcej →
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SEKCJA: Ostatnio dodane (slider)           */}
      {/* ============================================ */}
      <section className={`py-12 ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Nagłówek z przyciskami przewijania */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <svg className={`w-6 h-6 ${darkMode ? 'text-emerald-400' : 'text-emerald-500'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Ostatnio dodane
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollRecentArticles('left')}
                className={`p-2 rounded-lg transition-colors ${darkMode
                  ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                  : 'bg-white text-gray-500 hover:bg-gray-100 shadow-sm'
                  }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => scrollRecentArticles('right')}
                className={`p-2 rounded-lg transition-colors ${darkMode
                  ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                  : 'bg-white text-gray-500 hover:bg-gray-100 shadow-sm'
                  }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Slider */}
          <div
            ref={recentArticlesRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {recentArticles.map((article) => (
              <article
                key={`recent-${article.id}`}
                onClick={() => handleNavigation(`/artykul/${article.id}`)}
                className={`flex-shrink-0 w-72 sm:w-80 snap-start cursor-pointer rounded-xl overflow-hidden transition-all duration-300 ${darkMode
                  ? 'bg-gray-800 hover:shadow-xl'
                  : 'bg-white border border-gray-100 hover:shadow-lg'
                  }`}
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-500 text-white">
                      Nowe
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <span className={`text-xs font-medium ${darkMode ? 'text-[#38b6ff]' : 'text-[#0284c7]'}`}>
                    {article.category}
                  </span>
                  <h4 className={`font-semibold mt-1 line-clamp-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {article.title}
                  </h4>
                  <div className={`flex items-center gap-2 mt-2 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    <span>{new Date(article.publishedAt).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </section>

      {/* ============================================ */}
      {/* SEKCJA: Wydarzenia medyczne (mini kalendarz)*/}
      {/* ============================================ */}
      {upcomingEvents.length > 0 && (
        <section className={`py-12 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <svg className={`w-6 h-6 ${darkMode ? 'text-purple-400' : 'text-purple-500'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Nadchodzące wydarzenia
                </h2>
              </div>
              <a
                href="/wydarzenia"
                className={`text-sm font-medium flex items-center gap-1 transition-colors ${darkMode ? 'text-purple-400 hover:text-white' : 'text-purple-600 hover:text-gray-900'
                  }`}
              >
                Zobacz kalendarz
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {upcomingEvents.map((event: any) => (
                <article
                  key={event.id}
                  onClick={() => handleNavigation(`/wydarzenia/${event.id}`)}
                  className={`group cursor-pointer p-4 rounded-xl transition-all duration-300 ${darkMode
                    ? 'bg-gray-800 hover:bg-gray-750 border border-gray-700'
                    : 'bg-gray-50 hover:bg-white hover:shadow-lg border border-gray-100'
                    }`}
                >
                  {/* Data */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex flex-col items-center justify-center ${darkMode ? 'bg-purple-900/50' : 'bg-purple-100'
                      }`}>
                      <span className={`text-xs font-medium ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>
                        {new Date(event.start_date || event.date).toLocaleDateString('pl-PL', { month: 'short' }).toUpperCase()}
                      </span>
                      <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {new Date(event.start_date || event.date).getDate()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded ${event.event_type === 'webinar'
                        ? darkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-600'
                        : darkMode ? 'bg-amber-900/50 text-amber-300' : 'bg-amber-100 text-amber-600'
                        }`}>
                        {event.event_type === 'webinar' ? (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        )}
                        {event.event_type === 'webinar' ? 'Webinar' : 'Konferencja'}
                      </span>
                    </div>
                  </div>

                  <h4 className={`font-semibold text-sm line-clamp-2 mb-2 group-hover:text-purple-500 transition-colors ${darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                    {event.title || event.name}
                  </h4>

                  {event.location && (
                    <p className={`text-xs flex items-center gap-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {event.is_online ? 'Online' : event.location}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================ */}
      {/* SEKCJA: Oferty pracy                        */}
      {/* ============================================ */}
      {latestJobOffers.length > 0 && (
        <section className={`py-12 ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <svg className={`w-6 h-6 ${darkMode ? 'text-rose-400' : 'text-rose-500'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="7" width="18" height="13" rx="2" />
                  <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Najnowsze oferty pracy
                </h2>
              </div>
              <a
                href="/praca"
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${darkMode
                  ? 'bg-[#38b6ff] text-gray-900 hover:bg-[#2da7ef]'
                  : 'bg-[#38b6ff] text-white hover:bg-[#2da7ef]'
                  }`}
              >
                Wszystkie oferty
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {latestJobOffers.map((offer: any) => (
                <article
                  key={offer.id}
                  onClick={() => handleNavigation(`/praca/${offer.id}`)}
                  className={`group cursor-pointer p-5 rounded-xl transition-all duration-300 ${darkMode
                    ? 'bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-[#38b6ff]/50'
                    : 'bg-white hover:shadow-lg border border-gray-100 hover:border-[#38b6ff]/50'
                    }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className={`font-bold mb-1 group-hover:text-[#38b6ff] transition-colors ${darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                        {offer.position}
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {offer.company}
                      </p>
                    </div>
                    <svg className={`w-8 h-8 ${darkMode ? 'text-gray-700' : 'text-gray-300'}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <rect x="3" y="7" width="18" height="13" rx="2" />
                      <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M12 12v4" />
                      <path d="M9 14h6" />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <p className={`text-sm flex items-center gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {offer.location}
                    </p>
                    {offer.salary && (
                      <p className={`text-sm font-semibold flex items-center gap-2 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {offer.salary}
                      </p>
                    )}
                  </div>
                  <div className={`mt-4 pt-3 border-t flex items-center justify-between ${darkMode ? 'border-gray-700' : 'border-gray-100'
                    }`}>
                    <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {new Date(offer.postedDate).toLocaleDateString('pl-PL')}
                    </span>
                    <span className={`text-sm font-medium ${darkMode ? 'text-[#38b6ff]' : 'text-[#0284c7]'}`}>
                      Aplikuj →
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================ */}
      {/* SEKCJA: Polecane kalkulatory                */}
      {/* ============================================ */}
      {featuredCalculators.length > 0 && (
        <section className={`py-12 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <svg className={`w-6 h-6 ${darkMode ? 'text-cyan-400' : 'text-cyan-500'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="4" y="2" width="16" height="20" rx="2" />
                  <path d="M8 6h8M8 10h8M8 14h4" />
                </svg>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Popularne kalkulatory
                </h2>
              </div>
              <a
                href="/kalkulatory"
                className={`text-sm font-medium flex items-center gap-1 transition-colors ${darkMode ? 'text-cyan-400 hover:text-white' : 'text-cyan-600 hover:text-gray-900'
                  }`}
              >
                Wszystkie kalkulatory
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredCalculators.map((calculator) => (
                <article
                  key={calculator.id}
                  onClick={() => handleNavigation(`/kalkulatory/${calculator.slug}`)}
                  className={`group cursor-pointer p-5 rounded-xl transition-all duration-300 text-center ${darkMode
                    ? 'bg-gray-800 hover:bg-gradient-to-br hover:from-cyan-900/30 hover:to-gray-800 border border-gray-700'
                    : 'bg-gray-50 hover:bg-white hover:shadow-lg border border-gray-100'
                    }`}
                >
                  <div className={`w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center transition-all duration-300 ${darkMode
                    ? 'bg-cyan-900/50 group-hover:bg-cyan-500'
                    : 'bg-cyan-100 group-hover:bg-cyan-500'
                    }`}>
                    <svg className={`w-7 h-7 transition-colors ${darkMode
                      ? 'text-cyan-400 group-hover:text-white'
                      : 'text-cyan-600 group-hover:text-white'
                      }`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="4" y="2" width="16" height="20" rx="2" />
                      <path d="M8 6h8M8 10h8M8 14h4" />
                    </svg>
                  </div>
                  <h3 className={`font-semibold text-sm mb-2 line-clamp-2 group-hover:text-cyan-500 transition-colors ${darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                    {calculator.name}
                  </h3>
                  {calculator.description && (
                    <p className={`text-xs line-clamp-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {calculator.description}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sekcja z informacjami o dostępie do platformy */}
      {showAccessSection && (
        <div id="platform-access-section">
          <PlatformAccessSection 
            darkMode={darkMode} 
            userCountry={country}
          />
        </div>
      )}

      {/* Modal z informacjami o platformie */}
      <PlatformInfoModal
        isOpen={showPlatformModal}
        onClose={() => setShowPlatformModal(false)}
        onShowAccess={handleShowAccess}
        darkMode={darkMode}
      />

    </div>
  );
};

export default Home;
