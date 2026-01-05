import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

interface ScrollToTopProps {
  darkMode: boolean;
  highContrast: boolean;
}

const ScrollToTop: React.FC<ScrollToTopProps> = ({ darkMode, highContrast }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-6 right-6 z-50 p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl ${
            highContrast
              ? 'bg-white border-2 border-black text-black hover:bg-black hover:text-white'
              : darkMode
                ? 'bg-gray-800 text-white hover:bg-gray-700'
                : 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            highContrast 
              ? 'focus:ring-black' 
              : 'focus:ring-[#38b6ff]'
          }`}
          aria-label="Przewiń do góry strony"
        >
          <FaArrowUp className="w-5 h-5" />
        </button>
      )}
    </>
  );
};

export default ScrollToTop;