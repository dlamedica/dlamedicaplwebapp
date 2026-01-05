import React, { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  end: number;
  duration?: number;
  start?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  separator?: string;
  className?: string;
  onComplete?: () => void;
}

const CountUp: React.FC<CountUpProps> = ({
  end,
  duration = 2000,
  start = 0,
  decimals = 0,
  suffix = '',
  prefix = '',
  separator = '',
  className = '',
  onComplete
}) => {
  const [count, setCount] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);
  const countRef = useRef(start);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (countRef.current === end) return;

    setIsAnimating(true);
    const startTime = Date.now();
    const startValue = countRef.current;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (end - startValue) * easeOut;

      countRef.current = currentValue;
      setCount(currentValue);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end);
        countRef.current = end;
        setIsAnimating(false);
        if (onComplete) {
          onComplete();
        }
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [end, duration, onComplete]);

  const formatNumber = (num: number): string => {
    let formatted = num.toFixed(decimals);

    // Add separator for thousands
    if (separator && decimals === 0) {
      const parts = formatted.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
      formatted = parts.join('.');
    }

    return `${prefix}${formatted}${suffix}`;
  };

  return (
    <span className={className}>
      {formatNumber(count)}
    </span>
  );
};

export default CountUp;

