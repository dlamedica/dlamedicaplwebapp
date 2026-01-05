import React from 'react';
import { FaTag } from 'react-icons/fa';

interface Tag {
  id: number;
  name: string;
  slug: string;
  count: number;
}

interface ArticleTagsProps {
  tags: Tag[];
  darkMode: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const ArticleTags: React.FC<ArticleTagsProps> = ({ tags, darkMode, highContrast, fontSize }) => {
  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return 'text-xs';
      case 'large':
        return 'text-base';
      default:
        return 'text-sm';
    }
  };

  const handleTagClick = (slug: string) => {
    // Navigate to tag page
    window.history.pushState({}, '', `/tag/${slug}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  if (!tags || tags.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center mb-3">
        <FaTag className={`mr-2 ${
          highContrast ? 'text-black' : 'text-[#38b6ff]'
        }`} />
        <span className={`font-medium ${
          highContrast ? 'text-black' : darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Tagi:
        </span>
      </div>
      
      <ul className="flex flex-wrap gap-2" role="list">
        {tags.map((tag) => (
          <li key={tag.id}>
            <button
              onClick={() => handleTagClick(tag.slug)}
              className={`inline-flex items-center px-3 py-1 rounded-full transition-all duration-200 ${getFontSizeClasses()} ${
                highContrast
                  ? 'bg-white text-black border-2 border-black hover:bg-black hover:text-white'
                  : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-[#38b6ff] hover:text-black'
              }`}
              aria-label={`Zobacz artykuły z tagiem ${tag.name}`}
            >
              #{tag.name}
              <span className={`ml-1 ${getFontSizeClasses()} opacity-70`}>
                ({tag.count})
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArticleTags;