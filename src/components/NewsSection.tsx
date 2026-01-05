import React, { useState, useEffect } from 'react';
import { FaNewspaper, FaCalendarAlt, FaUser, FaChevronRight, FaSpinner, FaExternalLinkAlt } from 'react-icons/fa';
import { WordPressService, WordPressPost } from '../services/wordpressService';
import { formatPublishedDate, useAutoRefreshTime } from '../utils/dateFormatter';
import { sanitizeHTML } from '../utils/sanitize';

interface NewsSectionProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  maxPosts?: number;
  showLoadMore?: boolean;
}

const NewsSection: React.FC<NewsSectionProps> = ({ 
  darkMode, 
  fontSize, 
  maxPosts = 6,
  showLoadMore = true 
}) => {
  useAutoRefreshTime();
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          title: 'text-2xl md:text-3xl',
          subtitle: 'text-lg md:text-xl',
          cardTitle: 'text-lg',
          text: 'text-sm',
          smallText: 'text-xs'
        };
      case 'large':
        return {
          title: 'text-4xl md:text-5xl',
          subtitle: 'text-xl md:text-2xl',
          cardTitle: 'text-xl',
          text: 'text-lg',
          smallText: 'text-base'
        };
      default:
        return {
          title: 'text-3xl md:text-4xl',
          subtitle: 'text-lg md:text-xl',
          cardTitle: 'text-xl',
          text: 'text-base',
          smallText: 'text-sm'
        };
    }
  };

  const fontSizes = getFontSizeClasses();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async (page: number = 1) => {
    try {
      if (page === 1) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const response = await WordPressService.getPosts(page, maxPosts);
      
      if (page === 1) {
        setPosts(response.posts);
      } else {
        setPosts(prev => [...prev, ...response.posts]);
      }
      
      setHasMore(response.hasMore);
      setCurrentPage(page);
    } catch (err) {
      console.error('Error loading posts:', err);
      setError('Nie udało się załadować aktualności. Sprawdź połączenie internetowe.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMorePosts = () => {
    if (!loadingMore && hasMore) {
      loadPosts(currentPage + 1);
    }
  };

  const formatDate = (dateString: string) => {
    return formatPublishedDate(dateString);
  };

  const getExcerpt = (post: WordPressPost) => {
    return WordPressService.getExcerpt(post, 150);
  };

  const openPost = (post: WordPressPost) => {
    window.open(post.link, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className={`py-12 ${darkMode ? 'bg-black' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-[#38b6ff] mx-auto mb-4" />
            <h2 className={`${fontSizes.title} font-bold ${darkMode ? 'text-white' : 'text-black'} mb-4`}>
              Ładowanie aktualności...
            </h2>
            <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Pobieranie najnowszych informacji medycznych
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
              Błąd ładowania
            </h2>
            <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              {error}
            </p>
            <button
              onClick={() => loadPosts(1)}
              className="px-6 py-3 bg-[#38b6ff] text-black rounded-lg hover:bg-[#2a9fe5] transition-colors duration-200"
            >
              Spróbuj ponownie
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show placeholder if no posts available
  if (!posts || posts.length === 0) {
    return (
      <div className={`py-12 ${darkMode ? 'bg-black' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <FaNewspaper className={`text-4xl text-[#38b6ff] mx-auto mb-4`} />
            <h2 className={`${fontSizes.title} font-bold ${darkMode ? 'text-white' : 'text-black'} mb-4`}>
              Aktualności medyczne
            </h2>
            <p className={`${fontSizes.subtitle} ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
              Najnowsze wiadomości ze świata medycyny, badań i opieki zdrowotnej
            </p>
          </div>

          {/* Placeholder cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className={`rounded-lg border p-6 ${
                  darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className={`w-full h-48 rounded-lg mb-4 animate-pulse ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-300'
                }`}></div>
                <div className={`h-6 rounded mb-2 animate-pulse ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-300'
                }`}></div>
                <div className={`h-4 rounded mb-2 animate-pulse ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-300'
                }`}></div>
                <div className={`h-4 rounded w-3/4 animate-pulse ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-300'
                }`}></div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Aktualności są ładowane z cms.dlamedica.pl
            </p>
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
          <FaNewspaper className={`text-4xl text-[#38b6ff] mx-auto mb-4`} />
          <h2 className={`${fontSizes.title} font-bold ${darkMode ? 'text-white' : 'text-black'} mb-4`}>
            Aktualności medyczne
          </h2>
          <p className={`${fontSizes.subtitle} ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Najnowsze wiadomości ze świata medycyny, badań i opieki zdrowotnej
          </p>
          <div className="flex justify-center mt-6">
            <div className="w-24 h-1 bg-[#38b6ff] rounded-full"></div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className={`rounded-lg border transition-all duration-200 hover:shadow-lg cursor-pointer ${
                darkMode 
                  ? 'bg-gray-900 border-gray-700 hover:border-gray-600' 
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => openPost(post)}
            >
              {/* Featured Image Placeholder */}
              <div className={`w-full h-48 rounded-t-lg flex items-center justify-center ${
                darkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <FaNewspaper className={`text-3xl ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              </div>

              <div className="p-6">
                {/* Title */}
                <h3 
                  className={`${fontSizes.cardTitle} font-bold ${darkMode ? 'text-white' : 'text-black'} mb-2 line-clamp-2 hover:text-[#38b6ff] transition-colors duration-200`}
                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.title.rendered) }}
                />

                {/* Excerpt */}
                <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4 line-clamp-3`}>
                  {getExcerpt(post)}
                </p>

                {/* Metadata */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center ${fontSizes.smallText} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <FaCalendarAlt className="mr-1" />
                      {formatDate(post.date)}
                    </div>
                    <div className={`flex items-center ${fontSizes.smallText} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <FaUser className="mr-1" />
                      Redakcja
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-[#38b6ff] hover:text-[#2a9fe5] transition-colors duration-200">
                    <span className={`${fontSizes.smallText}`}>Czytaj</span>
                    <FaExternalLinkAlt className="text-xs" />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load More Button */}
        {showLoadMore && hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={loadMorePosts}
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
                  <span>Pokaż więcej</span>
                  <FaChevronRight />
                </>
              )}
            </button>
          </div>
        )}

        {/* External Link Notice */}
        <div className="text-center mt-8">
          <p className={`${fontSizes.smallText} ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Artykuły są otwierane na stronie cms.dlamedica.pl
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsSection;