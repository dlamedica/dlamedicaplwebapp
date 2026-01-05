import React, { useMemo } from 'react';
import { Ebook } from '../../types/ebook';
import { mockEbooks } from '../../data/mockEbooks';
import EbookCard from './EbookCard';

interface RelatedProductsProps {
  currentEbook: Ebook;
  darkMode: boolean;
  onViewDetails: (ebookId: string) => void;
  onAddToCart: (ebook: Ebook) => void;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  currentEbook,
  darkMode,
  onViewDetails,
  onAddToCart,
}) => {
  const relatedProducts = useMemo(() => {
    // Znajdź produkty z tej samej kategorii, wykluczając aktualny produkt
    const sameCategory = mockEbooks.filter(
      (ebook) => ebook.category === currentEbook.category && ebook.id !== currentEbook.id
    );

    // Znajdź produkty z podobnymi tagami
    const similarTags = mockEbooks.filter(
      (ebook) =>
        ebook.id !== currentEbook.id &&
        ebook.category !== currentEbook.category &&
        ebook.tags.some((tag) => currentEbook.tags.includes(tag))
    );

    // Połącz i usuń duplikaty, priorytet dla tej samej kategorii
    const combined = [...sameCategory, ...similarTags];
    const unique = combined.filter(
      (ebook, index, self) => index === self.findIndex((e) => e.id === ebook.id)
    );

    // Zwróć maksymalnie 4 produkty
    return unique.slice(0, 4);
  }, [currentEbook]);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className={`mt-8 p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h3 className={`text-2xl font-bold mb-6 ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>
        Podobne produkty
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((ebook) => (
          <EbookCard
            key={ebook.id}
            ebook={ebook}
            darkMode={darkMode}
            onViewDetails={onViewDetails}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;

