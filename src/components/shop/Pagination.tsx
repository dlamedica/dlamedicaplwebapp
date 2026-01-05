import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '../icons/CustomIcons';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
  darkMode: boolean;
}

const ITEMS_PER_PAGE_OPTIONS = [8, 12, 24, 48];

/**
 * Komponent paginacji z wyborem liczby wyników na stronę
 */
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  darkMode,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generowanie numerów stron do wyświetlenia
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 'ellipsis', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t ${
      darkMode ? 'border-gray-800' : 'border-gray-200'
    }`}>
      {/* Info o wynikach */}
      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Wyświetlanie <span className="font-semibold">{startItem}-{endItem}</span> z{' '}
        <span className="font-semibold">{totalItems}</span> wyników
      </div>

      {/* Nawigacja stron */}
      <div className="flex items-center gap-2">
        {/* Poprzednia strona */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg transition-all ${
            currentPage === 1
              ? darkMode
                ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : darkMode
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <ChevronLeftIcon size={18} />
        </button>

        {/* Numery stron */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
            page === 'ellipsis' ? (
              <span
                key={`ellipsis-${index}`}
                className={`px-2 py-1 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition-all ${
                  currentPage === page
                    ? 'bg-blue-600 text-white shadow-md'
                    : darkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {page}
              </button>
            )
          ))}
        </div>

        {/* Następna strona */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg transition-all ${
            currentPage === totalPages
              ? darkMode
                ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : darkMode
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <ChevronRightIcon size={18} />
        </button>
      </div>

      {/* Wybór liczby na stronę */}
      <div className="flex items-center gap-2">
        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Na stronę:
        </span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
            darkMode
              ? 'bg-gray-800 border-gray-700 text-gray-300'
              : 'bg-white border-gray-200 text-gray-700'
          }`}
        >
          {ITEMS_PER_PAGE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Pagination;
