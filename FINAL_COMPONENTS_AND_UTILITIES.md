# 🎯 Final Components & Utilities - Senior Specialist

## ✅ Ostatnie Komponenty

### 1. **Card** (`src/components/common/Card.tsx`) ✅
- ✅ Multiple variants (default, outlined, elevated)
- ✅ Title, subtitle, header, footer support
- ✅ Hoverable option
- ✅ Click handler support
- ✅ Dark mode support
- ✅ React.memo optimized

**Usage:**
```typescript
import Card from '../components/common/Card';

<Card
  title="Card Title"
  subtitle="Card subtitle"
  variant="elevated"
  hoverable
  footer={<Button>Action</Button>}
>
  Card content
</Card>
```

---

### 2. **Badge** (`src/components/common/Badge.tsx`) ✅
- ✅ 6 variants (primary, secondary, success, danger, warning, info)
- ✅ 3 sizes (sm, md, lg)
- ✅ Rounded option
- ✅ Dark mode support
- ✅ React.memo optimized

**Usage:**
```typescript
import Badge from '../components/common/Badge';

<Badge variant="success" size="md">Active</Badge>
<Badge variant="danger" rounded>New</Badge>
```

---

### 3. **Alert** (`src/components/common/Alert.tsx`) ✅
- ✅ 4 types (success, error, warning, info)
- ✅ Title support
- ✅ Custom icon
- ✅ Close button
- ✅ Dark mode support
- ✅ React.memo optimized

**Usage:**
```typescript
import Alert from '../components/common/Alert';

<Alert
  type="success"
  title="Success!"
  onClose={() => setShowAlert(false)}
>
  Operation completed successfully.
</Alert>
```

---

## 🎣 Nowe Hooks

### 1. **useLocalStorage** (`src/hooks/useLocalStorage.ts`) ✅
- ✅ React state synchronization
- ✅ Cross-tab synchronization
- ✅ Remove function
- ✅ Type-safe

**Usage:**
```typescript
import { useLocalStorage } from '../hooks/useLocalStorage';

const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light');

setTheme('dark');
removeTheme(); // Reset to initial value
```

---

### 2. **useMediaQuery** (`src/hooks/useMediaQuery.ts`) ✅
- ✅ Media query detection
- ✅ Responsive breakpoints
- ✅ Predefined hooks (useIsMobile, useIsTablet, useIsDesktop, useIsDarkMode)

**Usage:**
```typescript
import { useMediaQuery, useIsMobile, useIsDesktop } from '../hooks/useMediaQuery';

const isMobile = useIsMobile();
const isDesktop = useIsDesktop();
const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
```

---

### 3. **useClickOutside** (`src/hooks/useClickOutside.ts`) ✅
- ✅ Detect clicks outside element
- ✅ Works with refs
- ✅ Mouse and touch events

**Usage:**
```typescript
import { useRef } from 'react';
import { useClickOutside } from '../hooks/useClickOutside';

const ref = useRef<HTMLDivElement>(null);
useClickOutside(ref, () => setIsOpen(false));
```

---

### 4. **usePrevious** (`src/hooks/usePrevious.ts`) ✅
- ✅ Get previous value
- ✅ Useful for comparisons

**Usage:**
```typescript
import { usePrevious } from '../hooks/usePrevious';

const [count, setCount] = useState(0);
const prevCount = usePrevious(count);

if (count !== prevCount) {
  console.log('Count changed from', prevCount, 'to', count);
}
```

---

## 🛠️ Utility Functions

### 1. **String Utils** (`src/utils/stringUtils.ts`) ✅
- ✅ `toCamelCase()` - Convert to camelCase
- ✅ `toPascalCase()` - Convert to PascalCase
- ✅ `toKebabCase()` - Convert to kebab-case
- ✅ `toSnakeCase()` - Convert to snake_case
- ✅ `stripHtml()` - Remove HTML tags
- ✅ `escapeHtml()` - Escape HTML
- ✅ `unescapeHtml()` - Unescape HTML
- ✅ `randomString()` - Generate random string
- ✅ `generateUUID()` - Generate UUID v4
- ✅ `isEmpty()` - Check if empty
- ✅ `padString()` - Pad string
- ✅ `removeDiacritics()` - Remove accents
- ✅ `highlightText()` - Highlight search terms

**Usage:**
```typescript
import {
  toCamelCase,
  generateUUID,
  highlightText,
  removeDiacritics,
} from '../utils/stringUtils';

toCamelCase('hello world'); // "helloWorld"
generateUUID(); // "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
highlightText('Hello world', 'world'); // "Hello <mark>world</mark>"
```

---

### 2. **Array Utils** (`src/utils/arrayUtils.ts`) ✅
- ✅ `unique()` - Remove duplicates
- ✅ `uniqueBy()` - Remove duplicates by key
- ✅ `groupBy()` - Group by key
- ✅ `sortBy()` - Sort by key
- ✅ `chunk()` - Chunk array
- ✅ `shuffle()` - Shuffle array
- ✅ `randomItem()` - Get random item
- ✅ `randomItems()` - Get random items
- ✅ `flatten()` - Flatten nested array
- ✅ `difference()` - Array difference
- ✅ `intersection()` - Array intersection
- ✅ `union()` - Array union
- ✅ `moveItem()` - Move item
- ✅ `removeItem()` - Remove item
- ✅ `replaceItem()` - Replace item

**Usage:**
```typescript
import {
  unique,
  groupBy,
  sortBy,
  chunk,
  shuffle,
} from '../utils/arrayUtils';

unique([1, 2, 2, 3]); // [1, 2, 3]
groupBy(users, 'role'); // { admin: [...], user: [...] }
sortBy(users, 'name', 'asc');
chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
```

---

## 📊 Kompletny Przykład

### Responsive Component z Wszystkimi Hookami

```typescript
import { useRef, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useIsMobile, useIsDesktop } from '../hooks/useMediaQuery';
import { useClickOutside } from '../hooks/useClickOutside';
import { usePrevious } from '../hooks/usePrevious';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Alert from '../components/common/Alert';
import Button from '../components/common/Button';

const ResponsiveComponent = () => {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const isMobile = useIsMobile();
  const isDesktop = useIsDesktop();
  const [isOpen, setIsOpen] = useState(false);
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  return (
    <Card
      title="Responsive Card"
      variant="elevated"
      footer={
        <div className="flex gap-2">
          <Badge variant="success">Active</Badge>
          <Badge variant="info">{isMobile ? 'Mobile' : 'Desktop'}</Badge>
        </div>
      }
    >
      {prevCount !== undefined && prevCount !== count && (
        <Alert type="info">
          Count changed from {prevCount} to {count}
        </Alert>
      )}

      <p>Current theme: {theme}</p>
      <p>Is mobile: {isMobile ? 'Yes' : 'No'}</p>
      <p>Count: {count}</p>

      <div className="mt-4 space-x-2">
        <Button onClick={() => setCount(count + 1)}>Increment</Button>
        <Button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          Toggle Theme
        </Button>
      </div>
    </Card>
  );
};
```

---

## ✅ Checklist

- [x] Card component
- [x] Badge component
- [x] Alert component
- [x] useLocalStorage hook
- [x] useMediaQuery hook
- [x] useClickOutside hook
- [x] usePrevious hook
- [x] String utilities
- [x] Array utilities
- [x] Documentation

---

## 🎯 Korzyści

### Komponenty:
- ✅ **Spójny design system** - Wszystkie komponenty używają tych samych stylów
- ✅ **Accessible** - Proper ARIA attributes
- ✅ **Wydajne** - React.memo optimization
- ✅ **Type-safe** - Full TypeScript support

### Hooks:
- ✅ **Reusable** - Można używać w wielu miejscach
- ✅ **Type-safe** - TypeScript type safety
- ✅ **Optimized** - useCallback, useMemo gdzie potrzebne

### Utilities:
- ✅ **Comprehensive** - Wszystkie potrzebne funkcje
- ✅ **Well-tested patterns** - Sprawdzone algorytmy
- ✅ **Performance** - Zoptymalizowane funkcje

---

*Senior Specialist - Final Components & Utilities Implementation*

