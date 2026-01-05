import React from 'react';
import { FacebookIcon, TwitterIcon, LinkIcon, WhatsAppIcon } from '../icons/CustomIcons';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  darkMode: boolean;
  variant?: 'horizontal' | 'vertical' | 'compact';
}

const ShareButtons: React.FC<ShareButtonsProps> = ({
  url,
  title,
  description = '',
  darkMode,
  variant = 'horizontal',
}) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      // W rzeczywistości pokaż toast notification
      alert('Link skopiowany do schowka!');
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const buttonClass = `p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
    darkMode
      ? 'bg-gray-700 text-white hover:bg-gray-600'
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
  }`;

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-1">
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass}
          aria-label="Udostępnij na Facebooku"
        >
          <FacebookIcon size={14} />
        </a>
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass}
          aria-label="Udostępnij na Twitterze"
        >
          <TwitterIcon size={14} />
        </a>
        <button
          onClick={handleCopyLink}
          className={buttonClass}
          aria-label="Kopiuj link"
        >
          <LinkIcon size={14} />
        </button>
      </div>
    );
  }

  if (variant === 'vertical') {
    return (
      <div className="flex flex-col gap-2">
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className={`${buttonClass} flex items-center gap-2`}
          aria-label="Udostępnij na Facebooku"
        >
          <FacebookIcon />
          <span>Facebook</span>
        </a>
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className={`${buttonClass} flex items-center gap-2`}
          aria-label="Udostępnij na Twitterze"
        >
          <TwitterIcon />
          <span>Twitter</span>
        </a>
        <a
          href={shareLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className={`${buttonClass} flex items-center gap-2`}
          aria-label="Udostępnij przez WhatsApp"
        >
          <WhatsAppIcon />
          <span>WhatsApp</span>
        </a>
        <button
          onClick={handleCopyLink}
          className={`${buttonClass} flex items-center gap-2`}
          aria-label="Kopiuj link"
        >
          <LinkIcon />
          <span>Kopiuj link</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Udostępnij:
      </span>
      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        aria-label="Udostępnij na Facebooku"
        title="Facebook"
      >
        <FacebookIcon />
      </a>
      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        aria-label="Udostępnij na Twitterze"
        title="Twitter"
      >
        <TwitterIcon />
      </a>
      <a
        href={shareLinks.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        aria-label="Udostępnij przez WhatsApp"
        title="WhatsApp"
      >
        <WhatsAppIcon />
      </a>
      <button
        onClick={handleCopyLink}
        className={buttonClass}
        aria-label="Kopiuj link"
        title="Kopiuj link"
      >
        <LinkIcon />
      </button>
    </div>
  );
};

export default ShareButtons;

