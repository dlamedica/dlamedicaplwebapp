/**
 * Universal ShareButton component
 * Udostepnianie na Facebook, Twitter/X, LinkedIn, WhatsApp, Email
 */

import React, { useState } from 'react';
import {
  FaShare,
  FaCopy,
  FaCheck,
  FaFacebookF,
  FaLinkedinIn,
  FaEnvelope,
  FaWhatsapp
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

interface ShareButtonProps {
  url?: string;
  title: string;
  description?: string;
  hashtags?: string[];
  darkMode: boolean;
  compact?: boolean;
  className?: string;
}

type Platform = 'facebook' | 'twitter' | 'linkedin' | 'whatsapp' | 'email';

const ShareButton: React.FC<ShareButtonProps> = ({
  url,
  title,
  description = '',
  hashtags = [],
  darkMode,
  compact = false,
  className = ''
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  // Use current URL if not provided
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareText = description || title;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setShowMenu(false);
      }, 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = (platform: Platform) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);
    const encodedTitle = encodeURIComponent(title);
    const hashtagsStr = hashtags.length > 0 ? hashtags.map(h => h.replace('#', '')).join(',') : '';

    const shareUrls: Record<Platform, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}${hashtagsStr ? `&hashtags=${hashtagsStr}` : ''}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      email: `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`
    };

    const targetUrl = shareUrls[platform];
    if (platform === 'email') {
      window.location.href = targetUrl;
    } else {
      window.open(targetUrl, '_blank', 'width=600,height=500,noopener,noreferrer');
    }
    setShowMenu(false);
  };

  // Native Web Share API
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl
        });
        setShowMenu(false);
      } catch {
        // User cancelled
      }
    }
  };

  const platforms = [
    { id: 'facebook' as Platform, name: 'Facebook', icon: FaFacebookF, bg: 'bg-[#1877F2]' },
    { id: 'twitter' as Platform, name: 'X (Twitter)', icon: FaXTwitter, bg: 'bg-black' },
    { id: 'linkedin' as Platform, name: 'LinkedIn', icon: FaLinkedinIn, bg: 'bg-[#0A66C2]' },
    { id: 'whatsapp' as Platform, name: 'WhatsApp', icon: FaWhatsapp, bg: 'bg-[#25D366]' },
    { id: 'email' as Platform, name: 'E-mail', icon: FaEnvelope, bg: 'bg-gray-600' },
  ];

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={`${compact ? 'p-2' : 'px-4 py-2'} rounded-lg transition-colors duration-200 flex items-center gap-2 ${
          darkMode
            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        title="Udostepnij"
        aria-label="Udostepnij"
      >
        <FaShare size={compact ? 16 : 18} />
        {!compact && <span>Udostepnij</span>}
      </button>

      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />

          {/* Menu */}
          <div
            className={`absolute right-0 mt-2 w-56 rounded-xl shadow-xl border z-50 overflow-hidden ${
              darkMode
                ? 'bg-gray-900 border-gray-700'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="p-2 space-y-1">
              {/* Native Share (mobile) */}
              {typeof navigator !== 'undefined' && navigator.share && (
                <button
                  onClick={handleNativeShare}
                  className={`w-full px-3 py-2.5 rounded-lg text-left flex items-center gap-3 transition-colors ${
                    darkMode
                      ? 'hover:bg-gray-800 text-gray-300'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <FaShare className="text-white" size={14} />
                  </div>
                  <span className="font-medium">Udostepnij...</span>
                </button>
              )}

              {/* Copy link */}
              <button
                onClick={handleCopyLink}
                className={`w-full px-3 py-2.5 rounded-lg text-left flex items-center gap-3 transition-colors ${
                  darkMode
                    ? 'hover:bg-gray-800 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  copied ? 'bg-green-500' : darkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  {copied ? (
                    <FaCheck className="text-white" size={14} />
                  ) : (
                    <FaCopy className={darkMode ? 'text-gray-300' : 'text-gray-600'} size={14} />
                  )}
                </div>
                <span className="font-medium">{copied ? 'Skopiowano!' : 'Kopiuj link'}</span>
              </button>

              <div className={`border-t my-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />

              {/* Social platforms */}
              {platforms.map(({ id, name, icon: Icon, bg }) => (
                <button
                  key={id}
                  onClick={() => handleShare(id)}
                  className={`w-full px-3 py-2.5 rounded-lg text-left flex items-center gap-3 transition-colors ${
                    darkMode
                      ? 'hover:bg-gray-800 text-gray-300'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
                    <Icon className="text-white" size={14} />
                  </div>
                  <span className="font-medium">{name}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ShareButton;
