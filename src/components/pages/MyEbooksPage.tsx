import React, { useState, useEffect } from 'react';
import { FaSpinner, FaBook, FaBookOpen } from 'react-icons/fa';
import EbookReader from '../ebooks/EbookReader';
import { useAuth } from '../../contexts/AuthContext';
import { getUserPurchases } from '../../services/orderService';
import { mockEbooks } from '../../data/mockEbooks';
import { Ebook } from '../../types/ebook';

interface MyEbooksPageProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const MyEbooksPage: React.FC<MyEbooksPageProps> = ({ darkMode, fontSize }) => {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEbook, setSelectedEbook] = useState<Ebook | null>(null);

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

  useEffect(() => {
    if (!user) {
      window.history.pushState({}, '', '/logowanie?redirect=/sklep/moje-ebooki');
      window.dispatchEvent(new PopStateEvent('popstate'));
      return;
    }

    loadPurchases();
  }, [user]);

  const loadPurchases = async () => {
    setLoading(true);
    setError(null);
    try {
      const userPurchases = await getUserPurchases();
      setPurchases(userPurchases);
    } catch (err: any) {
      console.error('Błąd podczas pobierania zakupów:', err);
      // Fallback: użyj mockEbooks jako zakupione (dla testów)
      const mockPurchases = mockEbooks.slice(0, 3).map((ebook, index) => ({
        id: `purchase-${index}`,
        ebook_id: ebook.id,
        ebook_title: ebook.title,
        ebook_author: ebook.author,
        download_url: ebook.downloadUrl || `https://example.com/download/${ebook.id}.pdf`,
        purchased_at: new Date().toISOString(),
      }));
      setPurchases(mockPurchases);
    } finally {
      setLoading(false);
    }
  };

  const handleRead = (purchase: any) => {
    const ebook = mockEbooks.find(e => e.id === purchase.ebook_id);
    if (ebook) {
      setSelectedEbook(ebook);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-[#38b6ff] mx-auto mb-4" />
          <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Ładowanie ebooków...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* User Stats */}
        <div className="mb-8">
          <UserStats darkMode={darkMode} />
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className={`${fontSizes.title} font-bold mb-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Moje ebooki
          </h1>
          <p className={`${fontSizes.subtitle} ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Wszystkie Twoje zakupione publikacje medyczne
          </p>
        </div>

        {error && (
          <div className={`mb-6 p-4 rounded-lg ${
            darkMode ? 'bg-red-900 bg-opacity-30 border border-red-700' : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`${fontSizes.text} ${
              darkMode ? 'text-red-400' : 'text-red-600'
            }`}>
              {error}
            </p>
          </div>
        )}

        {purchases.length === 0 ? (
          <div className={`text-center py-16 rounded-lg ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}>
            <div className="flex justify-center mb-6">
              <FaBook 
                className={darkMode ? 'text-gray-600' : 'text-gray-400'}
                size={80}
              />
            </div>
            <h2 className={`${fontSizes.title} font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Brak zakupionych ebooków
            </h2>
            <p className={`${fontSizes.text} mb-8 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Nie masz jeszcze żadnych zakupionych ebooków. Rozpocznij zakupy w naszym sklepie!
            </p>
            <button
              onClick={() => {
                window.history.pushState({}, '', '/sklep');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                darkMode
                  ? 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
                  : 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
              } ${fontSizes.button}`}
            >
              Przejdź do sklepu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchases.map((purchase) => {
              const ebook = mockEbooks.find(e => e.id === purchase.ebook_id);
              return (
                <div
                  key={purchase.id}
                  className={`p-6 rounded-lg shadow-md ${
                    darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                  }`}
                >
                  {/* Cover Image */}
                  <div className="mb-4">
                    <img
                      src={ebook?.coverImage || 'https://via.placeholder.com/300x400?text=Ebook'}
                      alt={purchase.ebook_title}
                      className="w-full h-64 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x400?text=Ebook';
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div>
                    <h3 className={`${fontSizes.subtitle} font-bold mb-2 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {purchase.ebook_title}
                    </h3>
                    <p className={`${fontSizes.text} mb-4 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {purchase.ebook_author}
                    </p>
                    <p className={`text-xs mb-4 ${
                      darkMode ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      Zakupiono: {new Date(purchase.purchased_at).toLocaleDateString('pl-PL')}
                    </p>

                    {/* Read Button */}
                    <button
                      onClick={() => handleRead(purchase)}
                      className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-[#38b6ff] to-[#2a9fe5] text-white hover:from-[#2a9fe5] hover:to-[#1a8fd5] ${fontSizes.button}`}
                    >
                      <FaBookOpen />
                      Czytaj online
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Ebook Reader Modal */}
      {selectedEbook && (
        <EbookReader
          ebook={selectedEbook}
          darkMode={darkMode}
          fontSize={fontSize}
          onClose={() => setSelectedEbook(null)}
        />
      )}
    </div>
  );
};

export default MyEbooksPage;

