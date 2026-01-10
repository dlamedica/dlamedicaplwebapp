/**
 * LottieAnimation Component
 * Komponent do wyświetlania animacji Lottie
 * Używany w systemie gamifikacji (confetti, badges, streak fire, etc.)
 */

import React, { useEffect, useRef, useState } from 'react';

// Predefiniowane animacje dla platformy edukacyjnej
export const LOTTIE_ANIMATIONS = {
  // Celebracje
  confetti: 'https://assets5.lottiefiles.com/packages/lf20_u4yrau.json',
  success: 'https://assets4.lottiefiles.com/packages/lf20_jbrw3hcz.json',
  celebration: 'https://assets2.lottiefiles.com/packages/lf20_aZTdD5.json',
  fireworks: 'https://assets9.lottiefiles.com/packages/lf20_xlmz9xwm.json',

  // Streak i ogień
  fire: 'https://assets3.lottiefiles.com/packages/lf20_5tl1xxnz.json',
  streak_flame: 'https://assets1.lottiefiles.com/packages/lf20_fj8rlma5.json',

  // Odznaki i nagrody
  badge_unlock: 'https://assets8.lottiefiles.com/packages/lf20_touohxv0.json',
  trophy: 'https://assets6.lottiefiles.com/packages/lf20_3nvenw25.json',
  medal: 'https://assets7.lottiefiles.com/packages/lf20_7ypkno5r.json',
  star_burst: 'https://assets10.lottiefiles.com/packages/lf20_obhph3sh.json',
  crown: 'https://assets5.lottiefiles.com/packages/lf20_hf0z6fsk.json',

  // Level up
  level_up: 'https://assets2.lottiefiles.com/packages/lf20_4kx2q32n.json',
  xp_gain: 'https://assets9.lottiefiles.com/packages/lf20_n0bhqekr.json',

  // Quiz i odpowiedzi
  correct_answer: 'https://assets1.lottiefiles.com/packages/lf20_y2hxpvue.json',
  wrong_answer: 'https://assets4.lottiefiles.com/packages/lf20_qpwbiyxf.json',
  checkmark: 'https://assets7.lottiefiles.com/packages/lf20_uu0x8lqv.json',

  // Loading
  loading_dots: 'https://assets8.lottiefiles.com/packages/lf20_p8bfn5to.json',
  loading_medical: 'https://assets3.lottiefiles.com/packages/lf20_ghknmdgm.json',

  // Medyczne
  heartbeat: 'https://assets6.lottiefiles.com/packages/lf20_msdmfngy.json',
  stethoscope: 'https://assets4.lottiefiles.com/packages/lf20_j1klcaex.json',
  dna: 'https://assets2.lottiefiles.com/packages/lf20_j3gumpgp.json',

  // Weterynaryjne
  paw_print: 'https://assets1.lottiefiles.com/packages/lf20_syqnfe7c.json',
  cat: 'https://assets9.lottiefiles.com/packages/lf20_h9rxcyet.json',
  dog: 'https://assets5.lottiefiles.com/packages/lf20_xbf1be8x.json',

  // Inne
  empty_state: 'https://assets3.lottiefiles.com/packages/lf20_hl5n0bwb.json',
  rocket: 'https://assets8.lottiefiles.com/packages/lf20_l4xxtfd3.json',
};

export type LottieAnimationType = keyof typeof LOTTIE_ANIMATIONS;

interface LottieAnimationProps {
  animation: LottieAnimationType | string;
  width?: number | string;
  height?: number | string;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  onComplete?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Komponent LottieAnimation
 * Renderuje animacje Lottie z lottiefiles.com
 */
export const LottieAnimation: React.FC<LottieAnimationProps> = ({
  animation,
  width = 200,
  height = 200,
  loop = true,
  autoplay = true,
  speed = 1,
  onComplete,
  className = '',
  style = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Określ URL animacji
  const animationUrl =
    animation in LOTTIE_ANIMATIONS
      ? LOTTIE_ANIMATIONS[animation as LottieAnimationType]
      : animation;

  useEffect(() => {
    let lottieInstance: any = null;

    const loadAnimation = async () => {
      try {
        // Dynamiczny import lottie-web
        const lottie = await import('lottie-web');

        if (!containerRef.current) return;

        // Załaduj animację
        lottieInstance = lottie.default.loadAnimation({
          container: containerRef.current,
          renderer: 'svg',
          loop,
          autoplay,
          path: animationUrl,
        });

        // Ustaw prędkość
        lottieInstance.setSpeed(speed);

        // Event handlers
        lottieInstance.addEventListener('DOMLoaded', () => {
          setIsLoaded(true);
        });

        lottieInstance.addEventListener('complete', () => {
          onComplete?.();
        });

        lottieInstance.addEventListener('error', () => {
          setError('Nie udało się załadować animacji');
        });

        animationRef.current = lottieInstance;
      } catch (err) {
        console.error('Błąd ładowania Lottie:', err);
        setError('Lottie nie jest dostępne');
      }
    };

    loadAnimation();

    return () => {
      if (lottieInstance) {
        lottieInstance.destroy();
      }
    };
  }, [animationUrl, loop, autoplay, speed, onComplete]);

  // Metody kontroli animacji
  const play = () => animationRef.current?.play();
  const pause = () => animationRef.current?.pause();
  const stop = () => animationRef.current?.stop();
  const setDirection = (direction: 1 | -1) =>
    animationRef.current?.setDirection(direction);

  if (error) {
    return (
      <div
        className={`lottie-error ${className}`}
        style={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.05)',
          borderRadius: '8px',
          ...style,
        }}
      >
        <span style={{ fontSize: '2rem' }}>✨</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`lottie-animation ${className}`}
      style={{
        width,
        height,
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease',
        ...style,
      }}
    />
  );
};

/**
 * Hook do używania animacji Lottie programowo
 */
export const useLottie = () => {
  const [showAnimation, setShowAnimation] = useState<{
    type: LottieAnimationType;
    position?: { x: number; y: number };
  } | null>(null);

  const playAnimation = (
    type: LottieAnimationType,
    position?: { x: number; y: number },
    duration: number = 2000
  ) => {
    setShowAnimation({ type, position });
    setTimeout(() => setShowAnimation(null), duration);
  };

  return { showAnimation, playAnimation };
};

/**
 * Komponent do wyświetlania animacji w overlay
 */
export const LottieOverlay: React.FC<{
  animation: LottieAnimationType;
  show: boolean;
  onComplete?: () => void;
  position?: 'center' | 'top' | 'bottom';
}> = ({ animation, show, onComplete, position = 'center' }) => {
  if (!show) return null;

  const positionStyles: Record<string, React.CSSProperties> = {
    center: {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    },
    top: {
      top: '20%',
      left: '50%',
      transform: 'translateX(-50%)',
    },
    bottom: {
      bottom: '20%',
      left: '50%',
      transform: 'translateX(-50%)',
    },
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          position: 'absolute',
          ...positionStyles[position],
        }}
      >
        <LottieAnimation
          animation={animation}
          width={300}
          height={300}
          loop={false}
          onComplete={onComplete}
        />
      </div>
    </div>
  );
};

/**
 * Komponent mini animacji (dla inline, np. ikony streak)
 */
export const LottieMini: React.FC<{
  animation: LottieAnimationType;
  size?: number;
}> = ({ animation, size = 24 }) => {
  return (
    <LottieAnimation
      animation={animation}
      width={size}
      height={size}
      loop={true}
      autoplay={true}
    />
  );
};

export default LottieAnimation;
