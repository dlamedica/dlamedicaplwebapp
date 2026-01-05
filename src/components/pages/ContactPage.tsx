import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaUser, FaPaperPlane } from 'react-icons/fa';

interface ContactPageProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const ContactPage: React.FC<ContactPageProps> = ({ darkMode, fontSize }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    document.title = 'Kontakt | DlaMedica.pl';
    
    let descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      descriptionMeta.setAttribute('content', 'Skontaktuj się z nami. Formularz kontaktowy DlaMedica.pl - portal dla medyków.');
    }

    let ogTitleMeta = document.querySelector('meta[property="og:title"]');
    if (ogTitleMeta) {
      ogTitleMeta.setAttribute('content', 'Kontakt | DlaMedica.pl');
    }

    let ogDescriptionMeta = document.querySelector('meta[property="og:description"]');
    if (ogDescriptionMeta) {
      ogDescriptionMeta.setAttribute('content', 'Skontaktuj się z nami. Formularz kontaktowy DlaMedica.pl - portal dla medyków.');
    }
  }, []);

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          title: 'text-2xl md:text-3xl',
          subtitle: 'text-base md:text-lg',
          cardTitle: 'text-lg md:text-xl',
          cardText: 'text-sm md:text-base',
          buttonText: 'text-sm'
        };
      case 'large':
        return {
          title: 'text-4xl md:text-5xl',
          subtitle: 'text-xl md:text-2xl',
          cardTitle: 'text-2xl md:text-3xl',
          cardText: 'text-lg md:text-xl',
          buttonText: 'text-lg'
        };
      default:
        return {
          title: 'text-3xl md:text-4xl',
          subtitle: 'text-lg md:text-xl',
          cardTitle: 'text-xl md:text-2xl',
          cardText: 'text-base md:text-lg',
          buttonText: 'text-base'
        };
    }
  };

  const fontSizes = getFontSizeClasses();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Implement backend integration for contact form
    // For now, simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    }, 1000);
  };

  return (
    <div className={`min-h-screen py-12 ${darkMode ? 'bg-black' : 'bg-white'} transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className={`font-bold mb-6 ${fontSizes.title} ${darkMode ? 'text-white' : 'text-black'}`}>
            Skontaktuj się z nami
          </h1>
          <p className={`${fontSizes.subtitle} ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto leading-relaxed`}>
            Masz pytania? Potrzebujesz pomocy? Skontaktuj się z zespołem DlaMedica.pl. 
            Odpowiemy na wszystkie Twoje zapytania.
          </p>
          
          {/* Decorative element */}
          <div className="flex justify-center mt-8">
            <div className="w-24 h-1 bg-[#38b6ff] rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className={`rounded-lg p-8 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
            <h2 className={`${fontSizes.cardTitle} font-bold mb-6 ${darkMode ? 'text-white' : 'text-black'}`}>
              Informacje kontaktowe
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                  <FaEnvelope className="text-[#38b6ff] text-lg" />
                </div>
                <div>
                  <h3 className={`${fontSizes.cardText} font-semibold mb-1 ${darkMode ? 'text-white' : 'text-black'}`}>
                    Email
                  </h3>
                  <p className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    kontakt@dlamedica.pl
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                  <FaPhone className="text-[#38b6ff] text-lg" />
                </div>
                <div>
                  <h3 className={`${fontSizes.cardText} font-semibold mb-1 ${darkMode ? 'text-white' : 'text-black'}`}>
                    Telefon
                  </h3>
                  <p className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    +48 123 456 789
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                  <FaMapMarkerAlt className="text-[#38b6ff] text-lg" />
                </div>
                <div>
                  <h3 className={`${fontSizes.cardText} font-semibold mb-1 ${darkMode ? 'text-white' : 'text-black'}`}>
                    Adres
                  </h3>
                  <p className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    ul. Medyczna 10<br />
                    00-001 Warszawa
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className={`${fontSizes.cardText} font-semibold mb-3 ${darkMode ? 'text-white' : 'text-black'}`}>
                Godziny pracy
              </h3>
              <div className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-600'} space-y-1`}>
                <p>Poniedziałek - Piątek: 8:00 - 18:00</p>
                <p>Sobota: 9:00 - 14:00</p>
                <p>Niedziela: Zamknięte</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className={`rounded-lg p-8 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <h2 className={`${fontSizes.cardTitle} font-bold mb-6 ${darkMode ? 'text-white' : 'text-black'}`}>
              Wyślij wiadomość
            </h2>

            {/* Success Message */}
            {showSuccess && (
              <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg">
                <div className="flex items-center">
                  <div className="text-green-600 mr-3">✓</div>
                  <div>
                    <p className="text-green-800 font-medium">Wiadomość wysłana!</p>
                    <p className="text-green-700 text-sm">Dziękujemy za kontakt. Odpowiemy najszybciej jak to możliwe.</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <FaUser className="inline mr-2 text-[#38b6ff]" />
                  Imię i nazwisko *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] focus:border-[#38b6ff] ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Wpisz swoje imię i nazwisko"
                />
              </div>

              <div>
                <label htmlFor="email" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <FaEnvelope className="inline mr-2 text-[#38b6ff]" />
                  Adres email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] focus:border-[#38b6ff] ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="twoj.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Temat *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] focus:border-[#38b6ff] ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Temat wiadomości"
                />
              </div>

              <div>
                <label htmlFor="message" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Wiadomość *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] focus:border-[#38b6ff] resize-vertical ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Napisz swoją wiadomość..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-6 ${fontSizes.buttonText} font-semibold rounded-lg transition-all duration-200 ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#38b6ff] hover:bg-[#2a9fe5] shadow-md hover:shadow-lg'
                } text-black`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                    Wysyłanie...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <FaPaperPlane className="mr-2" />
                    Wyślij wiadomość
                  </div>
                )}
              </button>
            </form>

            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-4`}>
              * Pola wymagane
            </p>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className={`mt-12 rounded-lg p-8 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
          <h2 className={`${fontSizes.cardTitle} font-bold mb-6 ${darkMode ? 'text-white' : 'text-black'}`}>
            Często zadawane pytania
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className={`${fontSizes.cardText} font-semibold mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>
                Jak długo trwa odpowiedź?
              </h3>
              <p className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Odpowiadamy na wszystkie zapytania w ciągu 24 godzin w dni robocze.
              </p>
            </div>
            
            <div>
              <h3 className={`${fontSizes.cardText} font-semibold mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>
                Czy mogę zgłosić błąd?
              </h3>
              <p className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Tak! Zgłaszanie błędów pomaga nam ulepszać platformę. Opisz problem jak najdokładniej.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;