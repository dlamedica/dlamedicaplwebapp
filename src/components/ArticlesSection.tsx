import React, { useState, useEffect } from 'react';
import articlesData from '../data/articles.json';
import { formatPublishedDate, useAutoRefreshTime } from '../utils/dateFormatter';
import { ArticleLifecycleService } from '../services/articleLifecycleService';
import { PopularArticlesService } from '../services/popularArticlesService';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  image: string;
}

interface ArticlesSectionProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const ArticlesSection: React.FC<ArticlesSectionProps> = ({ darkMode, fontSize }) => {
  useAutoRefreshTime();
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('Aktualności');

  const categories = [
    'Aktualności',
    'Najnowsze',
    'Technologie',
    'Zdrowie publiczne',
    'Badania',
    'Prawo medyczne'
  ];

  useEffect(() => {
    // Inicjalizuj serwisy
    ArticleLifecycleService.initialize();
    PopularArticlesService.initialize();

    // Filtruj tylko aktywne artykuły (nie przeterminowane)
    const activeArticles = ArticleLifecycleService.filterActiveArticles(articlesData as any);

    // Wygeneruj przykładowe dane popularności dla demonstracji
    if (activeArticles.length > 0) {
      PopularArticlesService.generateSampleData(activeArticles.map(a => a.id));
    }

    setArticles(activeArticles);
  }, []);

  const filteredArticles = activeCategory === 'Najnowsze'
    ? articles
    : activeCategory === 'Aktualności'
      ? PopularArticlesService.getMostPopular(articles, 12) // Najchętniej czytane
      : articles.filter(article => article.category === activeCategory);

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          title: 'text-xl md:text-2xl',
          sectionTitle: 'text-2xl md:text-3xl',
          excerpt: 'text-sm',
          meta: 'text-xs'
        };
      case 'large':
        return {
          title: 'text-2xl md:text-3xl',
          sectionTitle: 'text-4xl md:text-5xl',
          excerpt: 'text-lg',
          meta: 'text-sm'
        };
      default:
        return {
          title: 'text-xl md:text-2xl',
          sectionTitle: 'text-3xl md:text-4xl',
          excerpt: 'text-base',
          meta: 'text-sm'
        };
    }
  };

  const fontSizes = getFontSizeClasses();

  return (
    <section className={`py-12 ${darkMode ? 'bg-black' : 'bg-white'} transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <h2 className={`${fontSizes.sectionTitle} font-bold text-center mb-8 ${darkMode ? 'text-white' : 'text-black'}`}>
          {activeCategory === 'Najnowsze' ? 'Najnowsze artykuły' : activeCategory === 'Aktualności' ? 'Najchętniej czytane' : `Artykuły - ${activeCategory}`}
        </h2>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeCategory === category
                ? 'bg-[#38b6ff] text-black shadow-lg'
                : darkMode
                  ? 'bg-gray-800 text-white hover:bg-gray-700'
                  : 'bg-gray-100 text-black hover:bg-gray-200'
                }`}
              aria-label={`Filtruj artykuły według kategorii: ${category}`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              className={`rounded-lg shadow-md overflow-hidden transition-colors duration-300 hover:shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'
                }`}
            >
              {/* Article Image */}
              <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
                <div className={`text-center ${darkMode ? 'text-gray-600' : 'text-gray-500'}`}>
                  <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                  </svg>
                  <p className="text-sm">400 x 200</p>
                </div>
              </div>

              {/* Article Content */}
              <div className="p-6">
                {/* Category Badge */}
                <div className="mb-3">
                  <span className="inline-block bg-[#38b6ff] text-black text-xs font-medium px-2 py-1 rounded-full">
                    {article.category}
                  </span>
                </div>

                {/* Article Title */}
                <h3 className={`${fontSizes.title} font-bold mb-2 ${darkMode ? 'text-white' : 'text-black'} leading-tight`}>
                  {article.title}
                </h3>

                {/* Publication Time & Popularity */}
                <div className={`${fontSizes.meta} ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-3 flex items-center justify-between`}>
                  <time dateTime={article.date}>
                    {formatPublishedDate(article.date)}
                  </time>
                </div>

                {/* Article Excerpt */}
                <p className={`${fontSizes.excerpt} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4 line-clamp-3`}>
                  {article.excerpt}
                </p>

                {/* Article Meta */}
                <div className={`flex items-center justify-between ${fontSizes.meta} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <div className="flex items-center space-x-2">
                    <span>{article.author}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>
                  <span>{formatPublishedDate(article.date)}</span>
                </div>

                {/* Read More Button */}
                <button
                  className={`mt-4 w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${darkMode
                    ? 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
                    : 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
                    }`}
                  aria-label={`Czytaj więcej artykułu: ${article.title}`}
                >
                  Czytaj więcej
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Load More Button */}
        {filteredArticles.length > 0 && (
          <div className="text-center mt-12">
            <button
              className={`px-8 py-3 rounded-lg font-medium transition-colors duration-200 ${darkMode
                ? 'bg-gray-800 text-white border border-gray-600 hover:bg-gray-700'
                : 'bg-white text-black border border-gray-300 hover:bg-gray-50'
                }`}
              aria-label="Wczytaj więcej artykułów medycznych"
            >
              Wczytaj więcej artykułów
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ArticlesSection;