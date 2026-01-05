import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchIcon, CartIcon, ChevronDownIcon } from '../icons/CustomIcons';
import ProductCardEnhanced from '../shop/ProductCardEnhanced';
import ProductCardSkeleton from '../shop/ProductCardSkeleton';
import Pagination from '../shop/Pagination';
import { Ebook } from '../../types/ebook';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../hooks/useToast';
import { ToastContainer } from '../Toast';
import QuickViewModal from '../shop/QuickViewModal';
import { trackPageView } from '../../utils/analytics';
import { updateMetaTags } from '../../utils/seo';

interface ShopPageProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'bestseller';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Najnowsze' },
  // { value: 'bestseller', label: 'Bestsellery' },
  { value: 'rating', label: 'Najwyżej oceniane' },
  { value: 'price-asc', label: 'Cena: rosnąco' },
  { value: 'price-desc', label: 'Cena: malejąco' },
];

import { MockShopService } from '../../services/mockShopService';

const ShopPage: React.FC<ShopPageProps> = ({ darkMode, fontSize }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSort, setActiveSort] = useState<SortOption>('newest');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [quickViewEbook, setQuickViewEbook] = useState<Ebook | null>(null);
  const [ebooks, setEbooks] = useState<Ebook[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  const { getTotalPrice, getTotalItems } = useCart();
  const { toasts, removeToast } = useToast();

  // Extract unique specialties/categories
  const specialties = useMemo(() => {
    const cats = new Set(ebooks.map(e => e.category));
    return ['all', ...Array.from(cats)];
  }, [ebooks]);

  useEffect(() => {
    const loadEbooks = async () => {
      setIsLoading(true);
      try {
        const data = await MockShopService.getEbooks();
        setEbooks(data);
      } catch (error) {
        console.error("Failed to load ebooks", error);
      } finally {
        // Keep the visual delay a bit if needed or rely on service delay
        setIsLoading(false);
      }
    };
    loadEbooks();
  }, []); // Initial load only

  useEffect(() => {
    // Logic for URL params or other side effects if needed
  }, [selectedSpecialty, activeSort, searchQuery]);

  useEffect(() => {
    updateMetaTags({
      title: 'E-booki Medyczne | DlaMedica.pl',
      description: 'Profesjonalne e-booki medyczne dla lekarzy i studentów. Kardiologia, interna, chirurgia i więcej.',
      keywords: ['ebooks', 'medycyna', 'nauka', 'lekarz', 'książki medyczne'],
      url: `${window.location.origin}/sklep`,
      type: 'website',
    });
    trackPageView('/sklep', 'Sklep Ebooków');
  }, []);

  const filteredEbooks = useMemo(() => {
    let filtered = [...ebooks];

    // Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(e =>
        e.title.toLowerCase().includes(query) ||
        e.author.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query)
      );
    }

    // Category Filter
    if (selectedSpecialty !== 'all') {
      filtered = filtered.filter(e => e.category === selectedSpecialty);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (activeSort) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'rating': return (b.rating || 0) - (a.rating || 0);
        // case 'bestseller': return (b.salesCount || 0) - (a.salesCount || 0);
        case 'newest':
        default:
          return new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime();
      }
    });

    return filtered;
  }, [searchQuery, selectedSpecialty, activeSort]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredEbooks.length / itemsPerPage);
  const paginatedEbooks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEbooks.slice(start, start + itemsPerPage);
  }, [filteredEbooks, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedSpecialty, activeSort]);

  const handleNavigation = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'small': return 'text-sm';
      case 'large': return 'text-lg';
      default: return 'text-base';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-[#0a0b0d]' : 'bg-gray-50'}`}>

      {/* Hero Section */}
      <div className={`relative overflow-hidden ${darkMode ? 'bg-gradient-to-b from-blue-900/20 to-transparent' : 'bg-gradient-to-b from-blue-50 to-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Twoja Medyczna Biblioteka <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">Premium</span>
            </h1>
            <p className={`mb-8 leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'} ${getFontSizeClass() === 'text-sm' ? 'text-base' : getFontSizeClass() === 'text-lg' ? 'text-2xl' : 'text-xl'}`}>
              Najnowsze standardy, wytyczne i wiedza kliniczna w zasięgu ręki.
              Dostępne natychmiast na każdym urządzeniu.
            </p>

            {/* Search Bar - Hero */}
            <div className="relative max-w-xl mx-auto">
              <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <SearchIcon size={20} />
              </div>
              <input
                type="text"
                placeholder="Szukaj e-booka, autora lub specjalizacji..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-11 pr-4 py-4 rounded-2xl shadow-lg border outline-none transition-all ${darkMode
                  ? 'bg-gray-800/80 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  : 'bg-white border-gray-100 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  }`}
              />
            </div>
          </motion.div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 left-0 right-0 h-full overflow-hidden pointer-events-none z-0">
          <div className={`absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-20 ${darkMode ? 'bg-blue-600' : 'bg-blue-300'}`} />
          <div className={`absolute top-40 -left-20 w-72 h-72 rounded-full blur-3xl opacity-20 ${darkMode ? 'bg-teal-600' : 'bg-teal-300'}`} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Filters & Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 sticky top-0 z-30 py-4 backdrop-blur-md">

          {/* Categories Scroll */}
          <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <div className="flex gap-2">
              {specialties.map(spec => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialty(spec)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedSpecialty === spec
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : darkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                >
                  {spec === 'all' ? 'Wszystkie' : spec}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${darkMode
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
            >
              <span>{SORT_OPTIONS.find(o => o.value === activeSort)?.label}</span>
              <ChevronDownIcon size={16} className={`transition-transform duration-200 ${isSortDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isSortDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsSortDropdownOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`absolute right-0 mt-2 w-48 rounded-xl shadow-xl border z-40 overflow-hidden ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'
                      }`}
                  >
                    {SORT_OPTIONS.map(option => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setActiveSort(option.value);
                          setIsSortDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm transition-colors ${activeSort === option.value
                          ? darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'
                          : darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50'
                          }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} darkMode={darkMode} />
            ))}
          </div>
        ) : (
          <>
            {filteredEbooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                  {paginatedEbooks.map((ebook, index) => (
                    <motion.div
                      key={ebook.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <ProductCardEnhanced
                        ebook={ebook}
                        darkMode={darkMode}
                        onNavigate={handleNavigation}
                        onQuickView={setQuickViewEbook}
                        onAddToComparison={() => { }} // No comparison needed for just ebooks for now
                        onTagClick={() => { }}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-20">
                <div className={`text-6xl mb-4 ${darkMode ? 'opacity-20' : 'opacity-10'}`}>📚</div>
                <h3 className={`text-xl font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Brak e-booków spełniających kryteria</h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Spróbuj zmienić filtry lub wyszukiwanie.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSpecialty('all');
                  }}
                  className="mt-6 text-blue-500 hover:text-blue-400 font-medium"
                >
                  Wyczyść filtry
                </button>
              </div>
            )}

            {/* Pagination */}
            {filteredEbooks.length > 0 && (
              <div className="mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  darkMode={darkMode}
                  totalItems={filteredEbooks.length}
                  itemsPerPage={itemsPerPage}
                  onItemsPerPageChange={() => { }} // Fixed for now
                />
              </div>
            )}
          </>
        )}

        {/* New floating Cart Button */}
        <AnimatePresence>
          {getTotalItems() > 0 && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-8 right-8 z-50"
            >
              <button
                onClick={() => handleNavigation('/sklep/koszyk')}
                className="group flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white pl-5 pr-6 py-4 rounded-full shadow-2xl shadow-blue-600/40 transition-all hover:scale-105 active:scale-95"
              >
                <div className="relative">
                  <CartIcon size={24} color="white" />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-blue-600">
                    {getTotalItems()}
                  </span>
                </div>
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-xs font-medium text-blue-100"> Twój koszyk </span>
                  <span className="font-bold text-lg">{getTotalPrice().toFixed(2)} zł</span>
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Quick View Modal */}
      {quickViewEbook && (
        <QuickViewModal
          ebook={quickViewEbook}
          darkMode={darkMode}
          onClose={() => setQuickViewEbook(null)}
          onViewDetails={(id) => handleNavigation(`/sklep/ebook/${id}`)}
        />
      )}

      <ToastContainer toasts={toasts} onClose={removeToast} darkMode={darkMode} />
    </div>
  );
};

export default ShopPage;
