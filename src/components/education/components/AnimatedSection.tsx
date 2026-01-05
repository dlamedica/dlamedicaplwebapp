import React, { ReactNode } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import '../styles/educationStyles.css';

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scaleIn' | 'slideDown';
  delay?: number;
  threshold?: number;
  triggerOnce?: boolean;
  className?: string;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  animation = 'fadeIn',
  delay = 0,
  threshold = 0.1,
  triggerOnce = true,
  className = ''
}) => {
  const { elementRef, isVisible } = useScrollAnimation({
    threshold,
    triggerOnce
  });

  const getAnimationClass = () => {
    if (!isVisible) return 'scroll-hidden';

    const baseClass = `scroll-${animation}`;
    return `${baseClass} scroll-visible`;
  };

  return (
    <div
      ref={elementRef}
      className={`${getAnimationClass()} ${className}`}
      style={{
        animationDelay: `${delay}ms`,
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;

