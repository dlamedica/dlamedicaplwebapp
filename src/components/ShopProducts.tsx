import React, { useState, useEffect } from 'react';
import { FaShoppingBag, FaTag, FaStar, FaExternalLinkAlt, FaSpinner, FaFilter } from 'react-icons/fa';
import { WordPressService, WooCommerceProduct } from '../services/wordpressService';
import { sanitizeHTML } from '../utils/sanitize';

interface ShopProductsProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  maxProducts?: number;
  showFilters?: boolean;
  showLoadMore?: boolean;
}

const ShopProducts: React.FC<ShopProductsProps> = ({ 
  darkMode, 
  fontSize, 
  maxProducts = 8,
  showFilters = true,
  showLoadMore = true 
}) => {
  const [products, setProducts] = useState<WooCommerceProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          title: 'text-2xl md:text-3xl',
          subtitle: 'text-lg md:text-xl',
          cardTitle: 'text-lg',
          text: 'text-sm',
          smallText: 'text-xs',
          price: 'text-lg'
        };
      case 'large':
        return {
          title: 'text-4xl md:text-5xl',
          subtitle: 'text-xl md:text-2xl',
          cardTitle: 'text-xl',
          text: 'text-lg',
          smallText: 'text-base',
          price: 'text-2xl'
        };
      default:
        return {
          title: 'text-3xl md:text-4xl',
          subtitle: 'text-lg md:text-xl',
          cardTitle: 'text-xl',
          text: 'text-base',
          smallText: 'text-sm',
          price: 'text-xl'
        };
    }
  };

  const fontSizes = getFontSizeClasses();

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, featuredOnly, onSaleOnly]);

  const loadProducts = async (page: number = 1) => {
    try {
      if (page === 1) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const response = await WordPressService.getProducts(
        page, 
        maxProducts,
        selectedCategory || undefined,
        undefined, // search
        featuredOnly || undefined,
        onSaleOnly || undefined
      );
      
      if (page === 1) {
        setProducts(response.products);
      } else {
        setProducts(prev => [...prev, ...response.products]);
      }
      
      setHasMore(response.hasMore);
      setCurrentPage(page);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Nie udało się załadować produktów. Sprawdź połączenie internetowe.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreProducts = () => {
    if (!loadingMore && hasMore) {
      loadProducts(currentPage + 1);
    }
  };

  const resetFilters = () => {
    setSelectedCategory('');
    setFeaturedOnly(false);
    setOnSaleOnly(false);
    setCurrentPage(1);
  };

  const formatPrice = (price: string, regularPrice?: string, salePrice?: string) => {
    const numPrice = parseFloat(price);
    const formattedPrice = `${numPrice.toFixed(2)} zł`;
    
    if (salePrice && regularPrice && salePrice !== regularPrice) {
      const formattedRegular = `${parseFloat(regularPrice).toFixed(2)} zł`;
      return (
        <div className="flex items-center space-x-2">
          <span className={`${fontSizes.price} font-bold text-red-600`}>
            {formattedPrice}
          </span>
          <span className={`${fontSizes.text} line-through ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {formattedRegular}
          </span>
        </div>
      );
    }
    
    return (
      <span className={`${fontSizes.price} font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
        {formattedPrice}
      </span>
    );
  };

  const getProductImage = (product: WooCommerceProduct) => {
    if (product.images && product.images.length > 0) {
      return product.images[0].src;
    }
    return null;
  };

  const openProduct = (product: WooCommerceProduct) => {
    window.open(product.permalink, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className={`py-12 ${darkMode ? 'bg-black' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-[#38b6ff] mx-auto mb-4" />
            <h2 className={`${fontSizes.title} font-bold ${darkMode ? 'text-white' : 'text-black'} mb-4`}>
              Ładowanie sklepu...
            </h2>
            <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Pobieranie produktów medycznych
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`py-12 ${darkMode ? 'bg-black' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-6">⚠️</div>
            <h2 className={`${fontSizes.title} font-bold ${darkMode ? 'text-white' : 'text-black'} mb-4`}>
              Błąd ładowania sklepu
            </h2>
            <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              {error}
            </p>
            <button
              onClick={() => loadProducts(1)}
              className="px-6 py-3 bg-[#38b6ff] text-black rounded-lg hover:bg-[#2a9fe5] transition-colors duration-200"
            >
              Spróbuj ponownie
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`py-12 ${darkMode ? 'bg-black' : 'bg-white'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <FaShoppingBag className={`text-4xl text-[#38b6ff] mx-auto mb-4`} />
          <h2 className={`${fontSizes.title} font-bold ${darkMode ? 'text-white' : 'text-black'} mb-4`}>
            Sklep medyczny
          </h2>
          <p className={`${fontSizes.subtitle} ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Planery, notatniki i akcesoria dla profesjonalistów medycznych
          </p>
          <div className="flex justify-center mt-6">
            <div className="w-24 h-1 bg-[#38b6ff] rounded-full"></div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className={`rounded-lg border p-6 mb-8 ${
            darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`${fontSizes.cardTitle} font-semibold ${darkMode ? 'text-white' : 'text-black'} flex items-center`}>
                <FaFilter className="mr-2 text-[#38b6ff]" />
                Filtry
              </h3>
              <button
                onClick={resetFilters}
                className="text-[#38b6ff] hover:text-[#2a9fe5] text-sm transition-colors duration-200"
              >
                Wyczyść filtry
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Kategoria
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                    darkMode
                      ? 'bg-gray-800 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">Wszystkie kategorie</option>
                  <option value="planners">Planery</option>
                  <option value="notebooks">Notatniki</option>
                  <option value="accessories">Akcesoria</option>
                </select>
              </div>

              {/* Featured Filter */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={featuredOnly}
                  onChange={(e) => setFeaturedOnly(e.target.checked)}
                  className="w-4 h-4 text-[#38b6ff] rounded border-gray-300 focus:ring-[#38b6ff]"
                />
                <label htmlFor="featured" className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Tylko polecane
                </label>
              </div>

              {/* On Sale Filter */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="onSale"
                  checked={onSaleOnly}
                  onChange={(e) => setOnSaleOnly(e.target.checked)}
                  className="w-4 h-4 text-[#38b6ff] rounded border-gray-300 focus:ring-[#38b6ff]"
                />
                <label htmlFor="onSale" className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Tylko promocje
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid or Placeholder */}
        {(!products || products.length === 0) ? (
          <div className="text-center py-12">
            <div className={`text-6xl mb-6 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>🏪</div>
            <h3 className={`${fontSizes.cardTitle} font-bold ${darkMode ? 'text-white' : 'text-black'} mb-4`}>
              Sklep w przygotowaniu
            </h3>
            <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              Pracujemy nad uruchomieniem sklepu z produktami medycznymi.
            </p>
            
            {/* Example products placeholder */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { name: 'Planer Medyczny 2025', price: '49.99 zł', description: 'Profesjonalny planer dla lekarzy' },
                { name: 'Notatnik Anatomiczny', price: '29.99 zł', description: 'Specjalistyczny notatnik z diagramami' },
                { name: 'Planer Pielęgniarski', price: '39.99 zł', description: 'Dedykowany planer dla pielęgniarek' }
              ].map((product, index) => (
                <div
                  key={index}
                  className={`rounded-lg border p-6 ${
                    darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className={`w-full h-48 rounded-lg mb-4 flex items-center justify-center ${
                    darkMode ? 'bg-gray-800' : 'bg-gray-100'
                  }`}>
                    <FaShoppingBag className={`text-3xl ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                  </div>
                  <h4 className={`${fontSizes.cardTitle} font-bold ${darkMode ? 'text-white' : 'text-black'} mb-2`}>
                    {product.name}
                  </h4>
                  <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`${fontSizes.price} font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
                      {product.price}
                    </span>
                    <button
                      disabled
                      className="px-4 py-2 bg-gray-400 text-gray-200 rounded-lg cursor-not-allowed"
                    >
                      Wkrótce
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className={`rounded-lg border transition-all duration-200 hover:shadow-lg cursor-pointer ${
                  darkMode 
                    ? 'bg-gray-900 border-gray-700 hover:border-gray-600' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => openProduct(product)}
              >
                {/* Product Image */}
                <div className={`w-full h-48 rounded-t-lg flex items-center justify-center overflow-hidden ${
                  darkMode ? 'bg-gray-800' : 'bg-gray-100'
                }`}>
                  {getProductImage(product) ? (
                    <img 
                      src={getProductImage(product)!}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = `
                          <div class="flex items-center justify-center w-full h-full">
                            <div class="text-3xl ${darkMode ? 'text-gray-600' : 'text-gray-400'}">🛍️</div>
                          </div>
                        `;
                      }}
                    />
                  ) : (
                    <FaShoppingBag className={`text-3xl ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                  )}
                </div>

                <div className="p-4">
                  {/* Product Title */}
                  <h3 className={`${fontSizes.cardTitle} font-bold ${darkMode ? 'text-white' : 'text-black'} mb-2 line-clamp-2 hover:text-[#38b6ff] transition-colors duration-200`}>
                    {product.name}
                  </h3>

                  {/* Short Description */}
                  <div 
                    className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4 line-clamp-2`}
                    dangerouslySetInnerHTML={{ __html: sanitizeHTML(product.short_description) }}
                  />

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      {formatPrice(product.price, product.regular_price, product.sale_price)}
                      {product.on_sale && (
                        <div className="flex items-center mt-1">
                          <FaTag className="text-red-500 text-xs mr-1" />
                          <span className={`${fontSizes.smallText} text-red-500 font-medium`}>
                            PROMOCJA
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-1 text-[#38b6ff] hover:text-[#2a9fe5] transition-colors duration-200">
                      <span className={`${fontSizes.smallText}`}>Kup</span>
                      <FaExternalLinkAlt className="text-xs" />
                    </div>
                  </div>

                  {/* Rating */}
                  {parseFloat(product.average_rating) > 0 && (
                    <div className="flex items-center mt-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`text-xs ${
                              i < Math.floor(parseFloat(product.average_rating))
                                ? 'text-yellow-400'
                                : darkMode ? 'text-gray-600' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className={`ml-2 ${fontSizes.smallText} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        ({product.rating_count})
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {showLoadMore && hasMore && products.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={loadMoreProducts}
              disabled={loadingMore}
              className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center mx-auto space-x-2 ${
                loadingMore
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
              }`}
            >
              {loadingMore ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Ładowanie...</span>
                </>
              ) : (
                <>
                  <span>Pokaż więcej produktów</span>
                  <FaShoppingBag />
                </>
              )}
            </button>
          </div>
        )}

        {/* External Link Notice */}
        {products.length > 0 && (
          <div className="text-center mt-8">
            <p className={`${fontSizes.smallText} ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Produkty są dostępne na sklep.dlamedica.pl
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopProducts;