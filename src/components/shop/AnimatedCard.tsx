import React from 'react';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  className = '', 
  delay = 0 
}) => {
  return (
    <div
      className={`animate-fade-in-up ${className}`}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: 'both',
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedCard;

