import { useEffect, useCallback } from 'react';

interface KeyboardNavigationOptions {
  onEnter?: () => void;
  onEscape?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  enabled?: boolean;
}

export const useKeyboardNavigation = (options: KeyboardNavigationOptions) => {
  const {
    onEnter,
    onEscape,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    enabled = true,
  } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      switch (event.key) {
        case 'Enter':
          if (onEnter && !event.shiftKey && !event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            onEnter();
          }
          break;
        case 'Escape':
          if (onEscape) {
            event.preventDefault();
            onEscape();
          }
          break;
        case 'ArrowUp':
          if (onArrowUp && !event.shiftKey && !event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            onArrowUp();
          }
          break;
        case 'ArrowDown':
          if (onArrowDown && !event.shiftKey && !event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            onArrowDown();
          }
          break;
        case 'ArrowLeft':
          if (onArrowLeft && !event.shiftKey && !event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            onArrowLeft();
          }
          break;
        case 'ArrowRight':
          if (onArrowRight && !event.shiftKey && !event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            onArrowRight();
          }
          break;
      }
    },
    [enabled, onEnter, onEscape, onArrowUp, onArrowDown, onArrowLeft, onArrowRight]
  );

  useEffect(() => {
    if (enabled) {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [enabled, handleKeyDown]);
};

