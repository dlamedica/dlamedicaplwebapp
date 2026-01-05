import { useState, useCallback, useEffect } from 'react';
import { rateLimiter, RateLimitOptions } from '../utils/rateLimiter';

/**
 * Custom hook for rate limiting
 * 
 * @example
 * const { isAllowed, getRemaining, reset } = useRateLimit('api-call', {
 *   maxRequests: 10,
 *   windowMs: 60000,
 * });
 * 
 * const handleClick = () => {
 *   if (isAllowed()) {
 *     // Make API call
 *   } else {
 *     // Show rate limit message
 *   }
 * };
 */
export function useRateLimit(key: string, options?: Partial<RateLimitOptions>) {
  const [remaining, setRemaining] = useState(() =>
    rateLimiter.getRemaining(key, options)
  );
  const [resetTime, setResetTime] = useState(() =>
    rateLimiter.getResetTime(key)
  );

  const check = useCallback(() => {
    const isAllowed = rateLimiter.isAllowed(key, options);
    setRemaining(rateLimiter.getRemaining(key, options));
    setResetTime(rateLimiter.getResetTime(key));
    return isAllowed;
  }, [key, options]);

  const reset = useCallback(() => {
    rateLimiter.reset(key);
    setRemaining(rateLimiter.getRemaining(key, options));
    setResetTime(rateLimiter.getResetTime(key));
  }, [key, options]);

  // Update remaining count periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(rateLimiter.getRemaining(key, options));
      setResetTime(rateLimiter.getResetTime(key));
    }, 1000);

    return () => clearInterval(interval);
  }, [key, options]);

  return {
    isAllowed: check,
    getRemaining: () => rateLimiter.getRemaining(key, options),
    getResetTime: () => rateLimiter.getResetTime(key),
    reset,
    remaining,
    resetTime,
  };
}

