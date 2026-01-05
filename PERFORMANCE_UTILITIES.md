# ⚡ Performance Utilities - Senior Specialist

## 📋 Overview

Zestaw utility functions i hooks do optymalizacji wydajności aplikacji.

---

## 🎯 Utils & Hooks

### 1. **Performance Utilities** (`src/utils/performance.ts`)

#### Debounce & Throttle
```typescript
import { debounce, throttle } from '../utils/performance';

// Debounce - opóźnia wykonanie
const debouncedSearch = debounce((query: string) => {
  performSearch(query);
}, 500);

// Throttle - ogranicza częstotliwość wykonania
const throttledScroll = throttle(() => {
  handleScroll();
}, 100);
```

#### Performance Monitoring
```typescript
import { measurePerformance, measureAsyncPerformance } from '../utils/performance';

// Synchronous
const result = measurePerformance('Expensive calculation', () => {
  return expensiveCalculation();
});

// Async
const data = await measureAsyncPerformance('API call', async () => {
  return await fetchData();
});
```

---

### 2. **useDebounce Hook** (`src/hooks/useDebounce.ts`)

```typescript
import { useDebounce } from '../hooks/useDebounce';

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      performSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
};
```

**Korzyści:**
- Redukuje liczbę API calls
- Lepsze UX (mniej "lag" podczas pisania)
- Oszczędność zasobów

---

### 3. **useThrottle Hook** (`src/hooks/useThrottle.ts`)

```typescript
import { useThrottle } from '../hooks/useThrottle';

const ScrollComponent = () => {
  const handleScroll = useThrottle(() => {
    console.log('Scrolled!');
    updateScrollPosition();
  }, 100);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
};
```

**Korzyści:**
- Kontrola częstotliwości wykonania
- Idealne dla scroll events, resize events
- Zapobiega przeciążeniu

---

### 4. **useIntersectionObserver Hook** (`src/hooks/useIntersectionObserver.ts`)

```typescript
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const LazyImage = ({ src, alt }) => {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <div ref={ref}>
      {isIntersecting ? (
        <img src={src} alt={alt} />
      ) : (
        <div className="placeholder">Loading...</div>
      )}
    </div>
  );
};
```

**Korzyści:**
- Lazy loading obrazów
- Infinite scroll
- Animacje na scroll
- Lepsze performance

---

### 5. **Type Guards** (`src/utils/typeGuards.ts`)

```typescript
import { isNotNull, isValidEmail, safeJsonParse } from '../utils/typeGuards';

// Type narrowing
const value: string | null = getValue();
if (isNotNull(value)) {
  // TypeScript wie że value jest string
  console.log(value.toUpperCase());
}

// Validation
if (isValidEmail(email)) {
  // Email is valid
}

// Safe parsing
const result = safeJsonParse<User>('{"name":"John"}');
if (result.success) {
  // result.data is User type
  console.log(result.data.name);
}
```

---

### 6. **Error Handling** (`src/utils/errorHandling.ts`)

```typescript
import { withErrorHandling, retryWithBackoff, safeAsync } from '../utils/errorHandling';

// Error handling wrapper
const result = await withErrorHandling(
  async () => {
    return await fetchData();
  },
  (error) => {
    // Custom error handler
    console.error('Failed:', error);
  }
);

if (result.success) {
  // Use result.data
} else {
  // Handle result.error
}

// Retry with exponential backoff
const data = await retryWithBackoff(
  () => fetchData(),
  3, // max retries
  1000 // initial delay
);

// Safe async (never throws)
const result = await safeAsync(() => fetchData());
if (result.success) {
  // Use result.data
}
```

---

### 7. **Caching** (`src/utils/cache.ts`)

#### Memory Cache
```typescript
import { MemoryCache } from '../utils/cache';

const cache = new MemoryCache<string>(5 * 60 * 1000); // 5 min TTL

// Set
cache.set('key', 'value');

// Get
const value = cache.get('key');

// Clean expired
cache.cleanExpired();
```

#### LocalStorage Cache
```typescript
import { LocalStorageCache } from '../utils/cache';

const cache = new LocalStorageCache<User>('user_');

cache.set('123', userData, 10 * 60 * 1000); // 10 min TTL
const user = cache.get('123');
```

#### useCachedAsync Hook
```typescript
import { useCachedAsync } from '../utils/cache';

const UserProfile = ({ userId }) => {
  const { data, loading, error, refetch } = useCachedAsync(
    `user_${userId}`,
    () => fetchUser(userId),
    5 * 60 * 1000 // 5 min cache
  );

  if (loading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  return <Profile data={data} />;
};
```

---

## 📊 Performance Best Practices

### 1. **Debounce Search Inputs**
```typescript
const debouncedSearch = useDebounce(searchTerm, 500);
```

### 2. **Throttle Scroll Events**
```typescript
const handleScroll = useThrottle(() => {
  // Handle scroll
}, 100);
```

### 3. **Lazy Load Images**
```typescript
const { ref, isIntersecting } = useIntersectionObserver();
```

### 4. **Cache API Responses**
```typescript
const { data } = useCachedAsync('key', fetcher, ttl);
```

### 5. **Measure Performance**
```typescript
const result = measurePerformance('Operation', () => {
  // Expensive operation
});
```

---

## 🎯 Use Cases

### Search Component
```typescript
const SearchPage = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  
  const { data, loading } = useCachedAsync(
    `search_${debouncedQuery}`,
    () => searchAPI(debouncedQuery),
    2 * 60 * 1000
  );

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
};
```

### Infinite Scroll
```typescript
const InfiniteList = () => {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
  });

  useEffect(() => {
    if (isIntersecting) {
      loadMore();
    }
  }, [isIntersecting]);

  return <div ref={ref}>Load more trigger</div>;
};
```

### Error Handling
```typescript
const DataComponent = () => {
  const fetchData = async () => {
    const result = await withErrorHandling(
      () => api.getData(),
      (error) => showToast(error.message)
    );

    if (result.success) {
      setData(result.data);
    }
  };
};
```

---

## ✅ Checklist

- [x] Performance utilities
- [x] Debounce & throttle hooks
- [x] Intersection Observer hook
- [x] Type guards
- [x] Error handling utilities
- [x] Caching system
- [x] Documentation

---

*Senior Specialist Implementation*

