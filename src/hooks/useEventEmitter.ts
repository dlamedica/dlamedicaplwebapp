import { useEffect, useCallback } from 'react';
import { eventEmitter } from '../utils/eventEmitter';

type EventCallback = (...args: any[]) => void;

/**
 * Custom hook for event emitter
 * 
 * @example
 * const MyComponent = () => {
 *   useEventEmitter('user-updated', (user) => {
 *     console.log('User updated:', user);
 *   });
 * 
 *   const handleUpdate = () => {
 *     eventEmitter.emit('user-updated', { id: 1, name: 'John' });
 *   };
 * 
 *   return <button onClick={handleUpdate}>Update</button>;
 * };
 */
export function useEventEmitter(event: string, callback: EventCallback): void {
  useEffect(() => {
    const unsubscribe = eventEmitter.on(event, callback);

    return () => {
      unsubscribe();
    };
  }, [event, callback]);
}

/**
 * Hook for emitting events
 */
export function useEmitEvent() {
  const emit = useCallback((event: string, ...args: any[]) => {
    eventEmitter.emit(event, ...args);
  }, []);

  return emit;
}

