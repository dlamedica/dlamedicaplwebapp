import React from 'react';
import { FaTag } from 'react-icons/fa';
import { Ebook } from '../../types/ebook';

interface ProductTagsProps {
  ebook: Ebook;
  darkMode: boolean;
  onTagClick?: (tag: string) => void;
  maxTags?: number;
}

const ProductTags: React.FC<ProductTagsProps> = ({
  ebook,
  darkMode,
  onTagClick,
  maxTags = 5,
}) => {
  const tagsToShow = ebook.tags.slice(0, maxTags);

  if (tagsToShow.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tagsToShow.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagClick?.(tag)}
          className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors duration-200 ${
            onTagClick
              ? darkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 cursor-pointer'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer'
              : darkMode
              ? 'bg-gray-700 text-gray-300'
              : 'bg-gray-100 text-gray-700'
          }`}
          title={onTagClick ? `Filtruj po tagu: ${tag}` : tag}
        >
          <TagIcon size={10} color="currentColor" />
          <span>{tag}</span>
        </button>
      ))}
      {ebook.tags.length > maxTags && (
        <span className={`text-xs px-2 py-1 ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          +{ebook.tags.length - maxTags} więcej
        </span>
      )}
    </div>
  );
};

export default ProductTags;

