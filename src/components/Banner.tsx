import React from 'react';

interface BannerProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const Banner: React.FC<BannerProps> = ({ darkMode, fontSize }) => {
  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          title: 'text-2xl sm:text-3xl md:text-4xl',
          subtitle: 'text-sm sm:text-base'
        };
      case 'large':
        return {
          title: 'text-4xl sm:text-5xl md:text-6xl',
          subtitle: 'text-lg sm:text-xl'
        };
      default:
        return {
          title: 'text-3xl sm:text-4xl md:text-5xl',
          subtitle: 'text-base sm:text-lg'
        };
    }
  };

  const fontSizes = getFontSizeClasses();

  return (
    <section className={`relative py-8 md:py-10 overflow-hidden ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900/20' : 'bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/40'} transition-colors duration-300`}>
      {/* Dekoracyjne elementy w tle */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orb - lewy */}
        <div className={`absolute -left-20 -top-20 w-64 h-64 rounded-full blur-3xl ${darkMode ? 'bg-[#38b6ff]/10' : 'bg-[#38b6ff]/15'}`}></div>
        {/* Gradient orb - prawy */}
        <div className={`absolute -right-20 -bottom-20 w-80 h-80 rounded-full blur-3xl ${darkMode ? 'bg-purple-600/10' : 'bg-purple-400/10'}`}></div>
        {/* Subtelna siatka */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(${darkMode ? '#38b6ff' : '#0ea5e9'} 1px, transparent 1px), linear-gradient(90deg, ${darkMode ? '#38b6ff' : '#0ea5e9'} 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        ></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          {/* Mały badge */}
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-[#38b6ff]/10 border border-[#38b6ff]/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#38b6ff] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#38b6ff]"></span>
            </span>
            <span className={`text-sm font-medium ${darkMode ? 'text-[#38b6ff]' : 'text-[#0284c7]'}`}>
              Portal dla profesjonalistów medycznych
            </span>
          </div>

          {/* Główny nagłówek */}
          <h1 className={`font-extrabold mb-3 tracking-tight ${fontSizes.title} ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Twoje źródło{' '}
            <span className="bg-gradient-to-r from-[#38b6ff] via-[#0ea5e9] to-[#0284c7] bg-clip-text text-transparent">
              wiedzy medycznej
            </span>
          </h1>

          {/* Podtytuł - w jednej linii */}
          <p className={`${fontSizes.subtitle} ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto mb-6`}>
            Aktualności medyczne, edukacja, kalendarz wydarzeń i oferty pracy – wszystko w jednym miejscu
          </p>

          {/* Szybkie linki usunięte na prośbę – hero zostaje czysty */}
        </div>
      </div>
    </section>
  );
};

export default Banner;
