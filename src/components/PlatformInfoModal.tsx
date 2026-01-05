import React, { useState } from 'react';
import Modal from './common/Modal';
import { useAuth } from '../contexts/AuthContext';
import { X, Globe, BookOpen, Calculator, Pill, GraduationCap, ShoppingBag, Briefcase, Calendar, Trophy, ArrowRight } from 'lucide-react';

interface PlatformInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowAccess: () => void;
  darkMode: boolean;
}

/**
 * Modal z informacjami o platformie dla użytkowników zagranicznych
 * Pojawia się tylko dla zalogowanych użytkowników z zagranicy
 */
const PlatformInfoModal: React.FC<PlatformInfoModalProps> = ({
  isOpen,
  onClose,
  onShowAccess,
  darkMode,
}) => {
  const { user } = useAuth();
  const [showDetails, setShowDetails] = useState(false);

  const features = [
    {
      icon: BookOpen,
      title: 'Platforma edukacyjna',
      description: 'Materiały dydaktyczne, przedmioty przedkliniczne i kliniczne dla studentów medycyny',
    },
    {
      icon: Calculator,
      title: 'Kalkulatory medyczne',
      description: 'Narzędzia do obliczeń medycznych: ASA, Bristol, GDS, Killip i wiele innych',
    },
    {
      icon: Pill,
      title: 'Baza leków',
      description: 'Wyszukiwarka leków z informacjami o refundacji i interakcjach',
    },
    {
      icon: GraduationCap,
      title: 'ICD-11',
      description: 'Wyszukiwarka kodów klasyfikacji medycznej zgodna z najnowszymi standardami',
    },
    {
      icon: ShoppingBag,
      title: 'Sklep',
      description: 'Ebooki medyczne i materiały edukacyjne dla profesjonalistów',
    },
    {
      icon: Briefcase,
      title: 'Oferty pracy',
      description: 'Tablica ogłoszeń dla profesjonalistów medycznych',
    },
    {
      icon: Calendar,
      title: 'Wydarzenia',
      description: 'Konferencje, webinary i szkolenia medyczne',
    },
    {
      icon: Trophy,
      title: 'Gamifikacja',
      description: 'System osiągnięć i punktów za aktywność na platformie',
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Witaj na platformie DlaMedica!"
      size="xl"
      darkMode={darkMode}
      closeOnOverlayClick={false}
    >
      <div className={`space-y-6 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
        {/* Powitanie */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
            <Globe className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Platforma dla profesjonalistów medycznych
          </h3>
          <p className="text-lg">
            DlaMedica.pl to kompleksowa platforma edukacyjna i narzędziowa stworzona specjalnie dla profesjonalistów medycznych w Polsce.
          </p>
        </div>

        {/* Funkcjonalności */}
        {!showDetails ? (
          <>
            <div>
              <h4 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Co oferuje nasza platforma?
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.slice(0, 4).map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        darkMode
                          ? 'bg-gray-800 border-gray-700 hover:border-blue-500'
                          : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                      } transition-colors`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          darkMode ? 'bg-blue-900/30' : 'bg-blue-100'
                        }`}>
                          <Icon className={`w-5 h-5 ${
                            darkMode ? 'text-blue-400' : 'text-blue-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h5 className={`font-semibold mb-1 ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {feature.title}
                          </h5>
                          <p className="text-sm">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Przyciski akcji */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  setShowDetails(true);
                  onShowAccess();
                }}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Zobacz więcej
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold rounded-lg transition-colors"
              >
                Rozumiem
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Wszystkie funkcjonalności */}
            <div>
              <h4 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Pełna lista funkcjonalności
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        darkMode
                          ? 'bg-gray-800 border-gray-700 hover:border-blue-500'
                          : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                      } transition-colors`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          darkMode ? 'bg-blue-900/30' : 'bg-blue-100'
                        }`}>
                          <Icon className={`w-5 h-5 ${
                            darkMode ? 'text-blue-400' : 'text-blue-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h5 className={`font-semibold mb-1 ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {feature.title}
                          </h5>
                          <p className="text-sm">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Informacja o dostępie */}
            <div className={`p-4 rounded-lg ${
              darkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'
            }`}>
              <p className="text-sm">
                <strong className={darkMode ? 'text-blue-300' : 'text-blue-700'}>
                  Uwaga:
                </strong>{' '}
                Niektóre funkcjonalności mogą wymagać dodatkowej weryfikacji lub mogą być dostępne tylko dla użytkowników z Polski.
                Szczegóły dostępu znajdziesz poniżej na stronie głównej.
              </p>
            </div>

            {/* Przycisk zamknięcia */}
            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Zamknij
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default PlatformInfoModal;
