import React, { useState } from 'react';
import { ShareIcon, CopyIcon, EmailIcon, CheckIcon } from '../icons/CustomIcons';

interface EventShareButtonProps {
  event: {
    id: number | string;
    name: string;
    slug: string;
    date: string;
    description: string;
  };
  darkMode: boolean;
  compact?: boolean;
}

const EventShareButton: React.FC<EventShareButtonProps> = ({ event, darkMode, compact = false }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const eventUrl = `${window.location.origin}/wydarzenia/${event.slug}`;
  const shareText = `Sprawdź to wydarzenie: ${event.name} - ${eventUrl}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setShowMenu(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Nie udało się skopiować linku');
    }
  };

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(eventUrl);
    const text = encodeURIComponent(shareText);

    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(event.name)}&body=${text}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    setShowMenu(false);
  };

  // Native Web Share API (jeśli dostępny)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.name,
          text: event.description,
          url: eventUrl
        });
        setShowMenu(false);
      } catch (err) {
        // Użytkownik anulował udostępnianie
      }
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={`${compact ? 'p-2' : 'px-4 py-2'} rounded-lg transition-colors duration-200 flex items-center gap-2 ${
          darkMode
            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        title="Udostępnij wydarzenie"
      >
        <ShareIcon size={compact ? 18 : 20} color="currentColor" />
        {!compact && <span>Udostępnij</span>}
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div
            className={`absolute right-0 mt-2 w-56 rounded-lg shadow-xl border z-50 ${
              darkMode
                ? 'bg-gray-900 border-gray-700'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="p-2">
              {navigator.share && (
                <button
                  onClick={handleNativeShare}
                  className={`w-full px-4 py-2 rounded-lg text-left flex items-center gap-3 transition-colors ${
                    darkMode
                      ? 'hover:bg-gray-800 text-gray-300'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <ShareIcon size={18} color="currentColor" />
                  <span>Udostępnij...</span>
                </button>
              )}
              
              <button
                onClick={handleCopyLink}
                className={`w-full px-4 py-2 rounded-lg text-left flex items-center gap-3 transition-colors ${
                  darkMode
                    ? 'hover:bg-gray-800 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {copied ? (
                  <CheckIcon size={18} color="#10b981" />
                ) : (
                  <CopyIcon size={18} color="currentColor" />
                )}
                <span>{copied ? 'Skopiowano!' : 'Kopiuj link'}</span>
              </button>

              <div className={`border-t my-1 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />

              <button
                onClick={() => handleShare('facebook')}
                className={`w-full px-4 py-2 rounded-lg text-left flex items-center gap-3 transition-colors ${
                  darkMode
                    ? 'hover:bg-gray-800 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">f</span>
                </div>
                <span>Facebook</span>
              </button>

              <button
                onClick={() => handleShare('twitter')}
                className={`w-full px-4 py-2 rounded-lg text-left flex items-center gap-3 transition-colors ${
                  darkMode
                    ? 'hover:bg-gray-800 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-blue-400 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">𝕏</span>
                </div>
                <span>Twitter</span>
              </button>

              <button
                onClick={() => handleShare('linkedin')}
                className={`w-full px-4 py-2 rounded-lg text-left flex items-center gap-3 transition-colors ${
                  darkMode
                    ? 'hover:bg-gray-800 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="w-5 h-5 rounded bg-blue-700 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">in</span>
                </div>
                <span>LinkedIn</span>
              </button>

              <button
                onClick={() => handleShare('email')}
                className={`w-full px-4 py-2 rounded-lg text-left flex items-center gap-3 transition-colors ${
                  darkMode
                    ? 'hover:bg-gray-800 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <EmailIcon size={18} color="currentColor" />
                <span>E-mail</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EventShareButton;

