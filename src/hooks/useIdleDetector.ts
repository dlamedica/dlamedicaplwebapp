import { useState, useEffect } from 'react';
import { idleDetector } from '../utils/idleDetector';
import { useEventEmitter } from './useEventEmitter';

/**
 * Custom hook for idle detection
 * 
 * @example
 * const { isIdle, timeSinceLastActivity } = useIdleDetector({
 *   threshold: 60000, // 1 minute
 * });
 * 
 * if (isIdle) {
 *   return <IdleMessage />;
 * }
 */
export function useIdleDetector(options?: { threshold?: number }) {
  const [isIdle, setIsIdle] = useState(() => idleDetector.isUserIdle());
  const [timeSinceLastActivity, setTimeSinceLastActivity] = useState(() =>
    idleDetector.getTimeSinceLastActivity()
  );

  // Subscribe to idle/active events
  useEventEmitter('user-idle', () => {
    setIsIdle(true);
  });

  useEventEmitter('user-active', () => {
    setIsIdle(false);
    setTimeSinceLastActivity(0);
  });

  // Update time since last activity
  useEffect(() => {
    if (options?.threshold) {
      idleDetector.setThreshold(options.threshold);
    }

    const interval = setInterval(() => {
      setTimeSinceLastActivity(idleDetector.getTimeSinceLastActivity());
    }, 1000);

    return () => clearInterval(interval);
  }, [options?.threshold]);

  return {
    isIdle,
    timeSinceLastActivity,
    reset: () => idleDetector.reset(),
  };
}

