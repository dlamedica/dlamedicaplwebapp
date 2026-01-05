import { useEffect, useRef, useState, RefObject } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Custom hook for Intersection Observer API
 * Useful for lazy loading, infinite scroll, animations on scroll
 * 
 * @example
 * const { ref, isIntersecting } = useIntersectionObserver({
 *   threshold: 0.1,
 *   triggerOnce: true
 * });
 * 
 * return <div ref={ref}>{isIntersecting ? 'Visible!' : 'Not visible'}</div>;
 */
export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): {
  ref: RefObject<HTMLElement>;
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
} {
  const {
    threshold = 0,
    root = null,
    rootMargin = '0px',
    triggerOnce = false,
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [firstEntry] = entries;
        setEntry(firstEntry);
        setIsIntersecting(firstEntry.isIntersecting);

        if (triggerOnce && firstEntry.isIntersecting) {
          observer.disconnect();
        }
      },
      {
        threshold,
        root,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, triggerOnce]);

  return {
    ref: elementRef,
    isIntersecting,
    entry,
  };
}

