import React, { useState } from 'react';
import { FaEnvelope, FaCheckCircle } from 'react-icons/fa';
import { subscribeToNewsletter } from '../../services/newsletterService';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';

interface NewsletterSubscriptionProps {
  darkMode: boolean;
}

const NewsletterSubscription: React.FC<NewsletterSubscriptionProps> = ({ darkMode }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  React.useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      showError('Wprowadź adres email');
      return;
    }

    try {
      setLoading(true);
      await subscribeToNewsletter(email);
      setSubscribed(true);
      showSuccess('Zapisano do newslettera!');
    } catch (error: any) {
      showError(error.message || 'Nie udało się zapisać do newslettera');
    } finally {
      setLoading(false);
    }
  };

  if (subscribed) {
    return (
      <div className={`p-6 rounded-lg ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-lg`}>
        <div className="flex items-center gap-3 text-green-500">
          <FaCheckCircle size={24} />
          <p className={`text-lg font-semibold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Zapisano do newslettera!
          </p>
        </div>
        <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Dziękujemy za subskrypcję. Otrzymasz najnowsze informacje o promocjach i nowościach.
        </p>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-lg ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    } shadow-lg`}>
      <div className="flex items-center gap-3 mb-4">
        <FaEnvelope className={darkMode ? 'text-[#38b6ff]' : 'text-[#38b6ff]'} size={24} />
        <h3 className={`text-xl font-bold ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Zapisz się do newslettera
        </h3>
      </div>
      <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Otrzymuj najnowsze informacje o promocjach, nowościach i specjalnych ofertach.
      </p>
      <form onSubmit={handleSubscribe} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Twój adres email"
          className={`flex-1 px-4 py-2 rounded-lg border transition-colors duration-200 ${
            darkMode
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          } focus:outline-none focus:ring-2 focus:ring-[#38b6ff]`}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 ${
            loading
              ? 'opacity-50 cursor-not-allowed'
              : ''
          } ${
            darkMode
              ? 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
              : 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
          }`}
        >
          {loading ? 'Zapisywanie...' : 'Zapisz się'}
        </button>
      </form>
    </div>
  );
};

export default NewsletterSubscription;

