/**
 * Array utility functions
 * Senior specialist implementation
 */

/**
 * Remove duplicates from array
 */
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

/**
 * Remove duplicates by key
 */
export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set();
  return array.filter((item) => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}

/**
 * Group array by key
 */
export function groupBy<T>(
  array: T[],
  key: keyof T | ((item: T) => string | number)
): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey =
      typeof key === 'function' ? String(key(item)) : String(item[key]);
    
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * Sort array by key
 */
export function sortBy<T>(
  array: T[],
  key: keyof T | ((item: T) => number | string),
  order: 'asc' | 'desc' = 'asc'
): T[] {
  const sorted = [...array].sort((a, b) => {
    const aValue = typeof key === 'function' ? key(a) : a[key];
    const bValue = typeof key === 'function' ? key(b) : b[key];

    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted;
}

/**
 * Chunk array into smaller arrays
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Shuffle array (Fisher-Yates algorithm)
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get random item from array
 */
export function randomItem<T>(array: T[]): T | undefined {
  if (array.length === 0) return undefined;
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Get random items from array
 */
export function randomItems<T>(array: T[], count: number): T[] {
  const shuffled = shuffle(array);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Flatten nested array
 */
export function flatten<T>(array: (T | T[])[]): T[] {
  return array.reduce<T[]>((acc, item) => {
    return acc.concat(Array.isArray(item) ? flatten(item) : item);
  }, []);
}

/**
 * Difference between two arrays
 */
export function difference<T>(array1: T[], array2: T[]): T[] {
  return array1.filter((item) => !array2.includes(item));
}

/**
 * Intersection of two arrays
 */
export function intersection<T>(array1: T[], array2: T[]): T[] {
  return array1.filter((item) => array2.includes(item));
}

/**
 * Union of two arrays
 */
export function union<T>(array1: T[], array2: T[]): T[] {
  return unique([...array1, ...array2]);
}

/**
 * Move item in array
 */
export function moveItem<T>(array: T[], fromIndex: number, toIndex: number): T[] {
  const newArray = [...array];
  const [removed] = newArray.splice(fromIndex, 1);
  newArray.splice(toIndex, 0, removed);
  return newArray;
}

/**
 * Remove item from array
 */
export function removeItem<T>(array: T[], item: T): T[] {
  return array.filter((i) => i !== item);
}

/**
 * Replace item in array
 */
export function replaceItem<T>(array: T[], index: number, newItem: T): T[] {
  const newArray = [...array];
  newArray[index] = newItem;
  return newArray;
}

