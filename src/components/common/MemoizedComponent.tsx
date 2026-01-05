import React, { memo, ReactNode } from 'react';

/**
 * Utility type dla props komponentów które mogą być memoized
 */
export type MemoizedComponentProps = {
  children?: ReactNode;
  [key: string]: unknown;
};

/**
 * HOC do łatwego tworzenia memoized komponentów
 * 
 * @example
 * const MyComponent = memoizedComponent(({ name }: { name: string }) => {
 *   return <div>{name}</div>;
 * });
 */
export function memoizedComponent<P extends MemoizedComponentProps>(
  Component: React.ComponentType<P>,
  areEqual?: (prevProps: P, nextProps: P) => boolean
): React.MemoExoticComponent<React.ComponentType<P>> {
  if (areEqual) {
    return memo(Component, areEqual);
  }
  return memo(Component);
}

/**
 * Custom comparison function dla komponentów z obiektami
 * Porównuje tylko wybrane pola
 */
export function createPropsComparator<T extends Record<string, unknown>>(
  keys: (keyof T)[]
) {
  return (prevProps: T, nextProps: T): boolean => {
    return keys.every((key) => {
      const prevValue = prevProps[key];
      const nextValue = nextProps[key];
      
      // Deep comparison dla obiektów
      if (typeof prevValue === 'object' && typeof nextValue === 'object') {
        return JSON.stringify(prevValue) === JSON.stringify(nextValue);
      }
      
      return prevValue === nextValue;
    });
  };
}

