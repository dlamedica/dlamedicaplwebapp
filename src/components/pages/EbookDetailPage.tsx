import React, { useState, useEffect } from 'react';
import { FaStar, FaShoppingCart, FaDownload, FaArrowLeft, FaCheck, FaFilePdf } from 'react-icons/fa';
import { Ebook } from '../../types/ebook';
import { mockEbooks } from '../../data/mockEbooks';
import { EBOOK_CATEGORIES } from '../../types/ebook';
import { EbookIcon } from '../icons/ShopIcons';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useToast } from '../../hooks/useToast';
import { ToastContainer } from '../Toast';
import { FaHeart } from 'react-icons/fa';
import { getCategoryIcon } from '../icons/CategoryIcons';
import ProductQASection from '../shop/ProductQASection';
import Breadcrumbs from '../common/Breadcrumbs';
import LazyImage from '../shop/LazyImage';
import ShareButtons from '../shop/ShareButtons';
import PriceTracker from '../shop/PriceTracker';
import CrossSellProducts from '../shop/CrossSellProducts';
import UpsellBanner from '../shop/UpsellBanner';
import CrossSelling from '../shop/CrossSelling';
import PriceDropAlert from '../shop/PriceDropAlert';
import { updateSEO, generateProductStructuredData, addStructuredData } from '../../utils/seo';

interface EbookDetailPageProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  ebookId: string;
}

const EbookDetailPage: React.FC<EbookDetailPageProps> = ({ darkMode, fontSize, ebookId }) => {
  const [ebook, setEbook] = useState<Ebook | null>(null);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toasts, showSuccess, removeToast } = useToast();
  const inWishlist = ebook ? isInWishlist(ebook.id) : false;

  useEffect(() => {
    const foundEbook = mockEbooks.find((e) => e.id === ebookId);
    setEbook(foundEbook || null);
    
    if (foundEbook) {
      // Update SEO
      updateSEO({
        title: foundEbook.title,
        description: foundEbook.shortDescription || foundEbook.description.substring(0, 160),
        keywords: foundEbook.tags,
        image: foundEbook.coverImage,
        url: `${window.location.origin}/sklep/ebook/${foundEbook.id}`,
        type: 'product',
      });

      // Add structured data
      const structuredData = generateProductStructuredData({
        id: foundEbook.id,
        title: foundEbook.title,
        description: foundEbook.description,
        price: foundEbook.price,
        image: foundEbook.coverImage,
        author: foundEbook.author,
        rating: foundEbook.rating,
        reviewCount: foundEbook.reviewCount,
      });
      addStructuredData(structuredData);
    }
  }, [ebookId]);

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          title: 'text-2xl',
          subtitle: 'text-lg',
          text: 'text-sm',
          button: 'text-sm',
        };
      case 'large':
        return {
          title: 'text-4xl',
          subtitle: 'text-2xl',
          text: 'text-lg',
          button: 'text-lg',
        };
      default:
        return {
          title: 'text-3xl',
          subtitle: 'text-xl',
          text: 'text-base',
          button: 'text-base',
        };
    }
  };

  const fontSizes = getFontSizeClasses();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
    }).format(price);
  };

  useEffect(() => {
    if (ebook && isInCart(ebook.id)) {
      setIsAddedToCart(true);
    }
  }, [ebook, isInCart]);

  const handleAddToCart = () => {
    if (ebook) {
      addToCart(ebook);
      setIsAddedToCart(true);
      showSuccess(`${ebook.title} został dodany do koszyka`);
      setTimeout(() => setIsAddedToCart(false), 2000);
      // Aktualizuj preferencje personalizacji
      PersonalizationService.updatePreferences('view', ebook.id);
    }
  };

  const handleBack = () => {
    window.history.pushState({}, '', '/sklep');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  if (!ebook) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <EbookIcon 
              className={darkMode ? 'text-gray-600' : 'text-gray-400'}
              size={64}
            />
          </div>
          <h2 className={`${fontSizes.title} font-bold mb-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Ebook nie znaleziony
          </h2>
          <button
            onClick={handleBack}
            className={`mt-4 px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
              darkMode
                ? 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
                : 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
            }`}
          >
            <FaArrowLeft className="inline mr-2" />
            Powrót do sklepu
          </button>
        </div>
      </div>
    );
  }

  const categoryInfo = EBOOK_CATEGORIES[ebook.category];
  const discountPercentage = ebook.originalPrice
    ? Math.round(((ebook.originalPrice - ebook.price) / ebook.originalPrice) * 100)
    : 0;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className={`mb-6 flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
            darkMode
              ? 'bg-gray-800 text-white hover:bg-gray-700'
              : 'bg-white text-gray-900 hover:bg-gray-100'
          }`}
        >
          <FaArrowLeft />
          Powrót do sklepu
        </button>

        <div className={`grid md:grid-cols-2 gap-8 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-lg shadow-lg p-8`}>
          {/* Left Column - Cover Image */}
          <div>
            <div className="relative">
              <img
                src={ebook.coverImage}
                alt={ebook.title}
                className="w-full rounded-lg shadow-xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x600?text=Ebook';
                }}
              />
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {ebook.isNew && (
                  <span className="px-3 py-1 text-sm font-bold text-white bg-green-500 rounded">
                    NOWOŚĆ
                  </span>
                )}
                {ebook.isBestseller && (
                  <span className="px-3 py-1 text-sm font-bold text-white bg-orange-500 rounded">
                    BESTSELLER
                  </span>
                )}
                {ebook.isOnSale && ebook.originalPrice && (
                  <span className="px-3 py-1 text-sm font-bold text-white bg-red-500 rounded">
                    -{discountPercentage}%
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div>
            {/* Category */}
            <div className="flex items-center gap-2 mb-4">
              {React.createElement(getCategoryIcon(categoryInfo.iconKey), { 
                className: darkMode ? 'text-gray-400' : 'text-gray-600',
                size: 24 
              })}
              <span className={`${fontSizes.text} font-medium ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {categoryInfo.name}
              </span>
            </div>

            {/* Title */}
            <h1 className={`${fontSizes.title} font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {ebook.title}
            </h1>

            {/* Author */}
            <p className={`${fontSizes.subtitle} mb-4 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Autor: <span className="font-semibold">{ebook.author}</span>
            </p>

            {/* Rating */}
            {ebook.rating && (
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`${
                        i < Math.floor(ebook.rating || 0)
                          ? 'text-yellow-400'
                          : darkMode
                          ? 'text-gray-600'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className={`${fontSizes.text} font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {ebook.rating.toFixed(1)}
                </span>
                {ebook.reviewCount && (
                  <span className={`${fontSizes.text} ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    ({ebook.reviewCount} opinii)
                  </span>
                )}
              </div>
            )}

            {/* Price */}
            <div className="mb-6">
              {/* Price Drop Alert */}
              {ebook.originalPrice && ebook.originalPrice > ebook.price && (
                <PriceDropAlert
                  originalPrice={ebook.originalPrice}
                  currentPrice={ebook.price}
                  darkMode={darkMode}
                />
              )}
              
              {ebook.originalPrice && (
                <p className={`${fontSizes.text} line-through mb-2 ${
                  darkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  {formatPrice(ebook.originalPrice)}
                </p>
              )}
              <p className={`text-4xl font-bold mb-3 ${
                darkMode ? 'text-[#38b6ff]' : 'text-[#38b6ff]'
              }`}>
                {formatPrice(ebook.price)}
              </p>
              
              {/* Price Tracker */}
              <PriceTracker
                currentPrice={ebook.price}
                originalPrice={ebook.originalPrice}
                darkMode={darkMode}
                showHistory={true}
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                  isAddedToCart
                    ? 'bg-green-500 text-white'
                    : darkMode
                    ? 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
                    : 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
                } ${fontSizes.button}`}
              >
                {isAddedToCart ? (
                  <>
                    <FaCheck />
                    Dodano do koszyka
                  </>
                ) : (
                  <>
                    <FaShoppingCart />
                    Dodaj do koszyka
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  handleAddToCart();
                  window.history.pushState({}, '', '/sklep/checkout');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                  darkMode
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                } ${fontSizes.button}`}
                aria-label={`Kup teraz: ${ebook.title}`}
              >
                <FaShoppingCart />
                Kup teraz
              </button>
            </div>

            {/* Share Buttons */}
            <div className="mb-8">
              <ShareButtons
                url={`${window.location.origin}/sklep/ebook/${ebook.id}`}
                title={ebook.title}
                description={ebook.shortDescription || ebook.description.substring(0, 100)}
                darkMode={darkMode}
                variant="horizontal"
              />
            </div>

            {/* Details */}
            <div className={`space-y-4 ${fontSizes.text}`}>
              <div className="flex items-start gap-4">
                <span className={`font-semibold w-32 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Format:
                </span>
                <span className={`flex items-center gap-2 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <FaFilePdf className="text-red-500" />
                  {ebook.format}
                </span>
              </div>
              <div className="flex items-start gap-4">
                <span className={`font-semibold w-32 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Liczba stron:
                </span>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {ebook.pages}
                </span>
              </div>
              <div className="flex items-start gap-4">
                <span className={`font-semibold w-32 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Rozmiar pliku:
                </span>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {ebook.fileSize}
                </span>
              </div>
              <div className="flex items-start gap-4">
                <span className={`font-semibold w-32 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Język:
                </span>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {ebook.language}
                </span>
              </div>
              {ebook.isbn && (
                <div className="flex items-start gap-4">
                  <span className={`font-semibold w-32 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    ISBN:
                  </span>
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {ebook.isbn}
                  </span>
                </div>
              )}
              <div className="flex items-start gap-4">
                <span className={`font-semibold w-32 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Data wydania:
                </span>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {new Date(ebook.publicationDate).toLocaleDateString('pl-PL')}
                </span>
              </div>
            </div>

            {/* Tags */}
            {ebook.tags.length > 0 && (
              <div className="mt-6">
                <p className={`${fontSizes.text} font-semibold mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Tagi:
                </p>
                <div className="flex flex-wrap gap-2">
                  {ebook.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-3 py-1 rounded-full text-sm ${
                        darkMode
                          ? 'bg-gray-700 text-gray-300'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className={`mt-8 p-8 rounded-lg shadow-lg ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h2 className={`${fontSizes.subtitle} font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Opis
          </h2>
          <p className={`${fontSizes.text} leading-relaxed whitespace-pre-line ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {ebook.description}
          </p>
        </div>

        {/* Q&A Section */}
        <ProductQASection
          ebookId={ebook.id}
          darkMode={darkMode}
          fontSize={fontSize}
        />

        {/* Upsell Banner */}
        {(() => {
          const upsellProduct = mockEbooks
            .filter(e => e.id !== ebook.id && e.category === ebook.category)
            .sort(() => Math.random() - 0.5)[0];
          
          if (!upsellProduct) return null;
          
          return (
            <UpsellBanner
              product={upsellProduct}
              darkMode={darkMode}
              discount={upsellProduct.originalPrice ? Math.round(((upsellProduct.originalPrice - upsellProduct.price) / upsellProduct.originalPrice) * 100) : 20}
              onAddToCart={handleAddToCart}
              onViewDetails={(id) => {
                window.history.pushState({}, '', `/sklep/ebook/${id}`);
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
            />
          );
        })()}

        {/* Cross-sell Products - Często kupowane razem */}
        {(() => {
          const crossSellProducts = mockEbooks
            .filter(e => e.id !== ebook.id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 4);
          
          if (crossSellProducts.length === 0) return null;
          
          return (
            <>
              <CrossSelling
                currentProduct={ebook}
                products={mockEbooks}
                darkMode={darkMode}
                onViewDetails={(id) => {
                  window.history.pushState({}, '', `/sklep/ebook/${id}`);
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                onAddToCart={handleAddToCart}
              />
              <div className="mt-8">
                <CrossSellProducts
                  products={crossSellProducts}
                  darkMode={darkMode}
                  title="Klienci kupowali również"
                  onViewDetails={(id) => {
                    window.history.pushState({}, '', `/sklep/ebook/${id}`);
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }}
                  onAddToCart={handleAddToCart}
                />
              </div>
            </>
          );
        })()}

        {/* Toast Notifications */}
        <ToastContainer toasts={toasts} onClose={removeToast} darkMode={darkMode} />
      </div>
    </div>
  );
};

export default EbookDetailPage;

