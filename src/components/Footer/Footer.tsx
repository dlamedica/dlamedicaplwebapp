import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaFacebook, FaYoutube, FaTiktok, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { ArrowRightIcon, ChevronDownIcon } from '../icons/CustomIcons';

interface FooterProps {
  darkMode: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const Footer: React.FC<FooterProps> = ({ darkMode, highContrast, fontSize }) => {
  const { t } = useTranslation();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isToolsExpanded, setIsToolsExpanded] = useState(false);

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          title: 'text-lg md:text-xl',
          text: 'text-sm md:text-base',
          smallText: 'text-xs md:text-sm'
        };
      case 'large':
        return {
          title: 'text-2xl md:text-3xl',
          text: 'text-lg md:text-xl',
          smallText: 'text-base md:text-lg'
        };
      default:
        return {
          title: 'text-xl md:text-2xl',
          text: 'text-base md:text-lg',
          smallText: 'text-sm md:text-base'
        };
    }
  };

  const fontSizes = getFontSizeClasses();

  // Navigation structure
  const navigationLinks = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.education'), href: '/edukacja' },
    { name: t('nav.shop'), href: '/sklep' },
    { name: t('nav.events'), href: '/wydarzenia' },
    { name: t('nav.jobs'), href: '/praca' },
    { name: t('nav.universities'), href: '/uczelnie' }
  ];

  const toolsMenuItems = [
    { name: t('nav.icd11'), href: '/icd-11' },
    { name: t('nav.drugDatabase'), href: '/baza-lekow' },
    { name: t('nav.calculators'), href: '/kalkulatory' }
  ];

  const toggleToolsMenu = () => {
    setIsToolsExpanded(!isToolsExpanded);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);

    // TODO: Implement newsletter subscription backend
    // For now, simulate newsletter subscription
    setTimeout(() => {
      setIsSubscribing(false);
      setShowSuccess(true);
      setNewsletterEmail('');

      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  const handleNavigation = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={`${highContrast
        ? 'bg-white border-black border-t-2'
        : darkMode
          ? 'bg-gray-900 border-gray-700'
          : 'bg-gray-50 border-gray-200'
      } border-t transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Logo and Description */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img
                src="/logo.png"
                alt="Logo DlaMedica.pl"
                width={32}
                height={32}
                className="object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/logo.svg";
                }}
              />
              <h3 className={`${fontSizes.title} font-bold ${highContrast ? 'text-black' : darkMode ? 'text-white' : 'text-black'
                }`}>
                DlaMedica.pl
              </h3>
            </div>
            <p className={`${fontSizes.text} ${highContrast ? 'text-black' : darkMode ? 'text-gray-300' : 'text-gray-600'
              } mb-4`}>
              {t('footer.description')}
            </p>

            {/* Social Media */}
            <div className="flex gap-2 mt-4">
              <a
                href="https://www.facebook.com/profile.php?id=61570490863347"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg transition-all duration-300 transform hover:scale-110 hover:bg-[#38b6ff]/10"
                aria-label="Facebook"
              >
                <FaFacebook size={18} className="text-[#38b6ff]" />
              </a>
              <a
                href="https://www.instagram.com/dlamedica.pl/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg transition-all duration-300 transform hover:scale-110 hover:bg-[#38b6ff]/10"
                aria-label="Instagram"
              >
                <FaInstagram size={18} className="text-[#38b6ff]" />
              </a>
              <a
                href="https://www.tiktok.com/@dlamedicapl?lang=de-DE"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg transition-all duration-300 transform hover:scale-110 hover:bg-[#38b6ff]/10"
                aria-label="TikTok"
              >
                <FaTiktok size={18} className="text-[#38b6ff]" />
              </a>
              <a
                href="https://www.youtube.com/channel/UC6Bfr93-ilUb1ghiB6G5qJw"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg transition-all duration-300 transform hover:scale-110 hover:bg-[#38b6ff]/10"
                aria-label="YouTube"
              >
                <FaYoutube size={18} className="text-[#38b6ff]" />
              </a>
              <a
                href="https://x.com/dlamedicapl"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg transition-all duration-300 transform hover:scale-110 hover:bg-[#38b6ff]/10"
                aria-label="X (Twitter)"
              >
                <FaXTwitter size={18} className="text-[#38b6ff]" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className={`${fontSizes.title} font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
              {t('footer.navigation')}
            </h4>
            <ul className="space-y-2">
              {/* Main navigation links */}
              {navigationLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => handleNavigation(link.href)}
                    className={`${fontSizes.text} ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors duration-200`}
                  >
                    {link.name}
                  </button>
                </li>
              ))}

              {/* Tools dropdown */}
              <li>
                <button
                  onClick={toggleToolsMenu}
                  className={`${fontSizes.text} ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors duration-200 flex items-center w-full`}
                >
                  {t('nav.tools')}
                  <ChevronDownIcon size={14} color={darkMode ? '#D1D5DB' : '#6B7280'} className={`ml-2 transition-transform duration-200 ${isToolsExpanded ? 'rotate-180' : ''
                    }`} />
                </button>

                {/* Tools submenu */}
                {isToolsExpanded && (
                  <ul className="mt-2 ml-4 space-y-1 animate-slideIn">
                    {toolsMenuItems.map((tool) => (
                      <li key={tool.name}>
                        <button
                          onClick={() => handleNavigation(tool.href)}
                          className={`${fontSizes.text} ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'} transition-colors duration-200 block`}
                        >
                          • {tool.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className={`${fontSizes.title} font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
              {t('footer.information')}
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNavigation('/kontakt')}
                  className={`${fontSizes.text} ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors duration-200`}
                >
                  {t('footer.contact')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/regulamin')}
                  className={`${fontSizes.text} ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors duration-200`}
                >
                  {t('footer.terms')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/polityka-prywatnosci')}
                  className={`${fontSizes.text} ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors duration-200`}
                >
                  {t('footer.privacy')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/faq')}
                  className={`${fontSizes.text} ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors duration-200`}
                >
                  {t('footer.faq')}
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className={`${fontSizes.title} font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
              {t('footer.subscribeNewsletter')}
            </h4>
            <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
              {t('footer.newsletterDescription')}
            </p>

            {/* Success Message */}
            {showSuccess && (
              <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg">
                <div className="flex items-center">
                  <div className="text-green-600 mr-2">✓</div>
                  <p className="text-green-800 text-sm font-medium">
                    {t('footer.thankYouSubscription')}
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleNewsletterSubmit} className="flex flex-col space-y-3">
              <div className="flex">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder={t('footer.emailPlaceholder')}
                  required
                  className={`flex-1 px-4 py-2 rounded-l-lg border-r-0 border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${darkMode
                      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                />
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className={`px-4 py-2 rounded-r-lg transition-all duration-200 ${isSubscribing
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-[#38b6ff] hover:bg-[#2a9fe5] shadow-md hover:shadow-lg'
                    } text-black`}
                >
                  {isSubscribing ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                  ) : (
                    <ArrowRightIcon size={16} color="currentColor" />
                  )}
                </button>
              </div>
              <p className={`${fontSizes.smallText} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('footer.unsubscribeAnytime')}
              </p>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={`mt-12 pt-8 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-col md:flex-row justify-between items-center`}>
          <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4 md:mb-0`}>
            © 2025 DlaMedica.pl. {t('footer.copyright')}
          </p>

          <div className="flex items-center">
            <p className={`${fontSizes.smallText} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {t('footer.version')} 1.0.0
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;