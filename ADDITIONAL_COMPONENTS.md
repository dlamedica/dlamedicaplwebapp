# 🧩 Additional Components & Utilities - Senior Specialist

## ✅ Nowe Komponenty

### 1. **Select** (`src/components/common/Select.tsx`) ✅
- ✅ Label support
- ✅ Error handling
- ✅ Help text
- ✅ Multiple sizes (sm, md, lg)
- ✅ Dark mode support
- ✅ forwardRef support
- ✅ React.memo optimized

**Usage:**
```typescript
import Select from '../components/common/Select';

<Select
  label="Country"
  options={[
    { value: 'pl', label: 'Poland' },
    { value: 'us', label: 'United States' },
  ]}
  value={selectedCountry}
  onChange={(e) => setSelectedCountry(e.target.value)}
  error={errors.country}
  touched={touched.country}
/>
```

---

### 2. **Textarea** (`src/components/common/Textarea.tsx`) ✅
- ✅ Label support
- ✅ Error handling
- ✅ Help text
- ✅ Multiple sizes
- ✅ Dark mode support
- ✅ Custom rows
- ✅ forwardRef support
- ✅ React.memo optimized

**Usage:**
```typescript
import Textarea from '../components/common/Textarea';

<Textarea
  label="Description"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  rows={6}
  error={errors.description}
  touched={touched.description}
/>
```

---

### 3. **Modal** (`src/components/common/Modal.tsx`) ✅
- ✅ Portal rendering
- ✅ Overlay click to close
- ✅ Escape key to close
- ✅ Multiple sizes (sm, md, lg, xl, full)
- ✅ Header with title
- ✅ Footer support
- ✅ Dark mode support
- ✅ Body scroll lock
- ✅ React.memo optimized

**Usage:**
```typescript
import Modal from '../components/common/Modal';

const [isOpen, setIsOpen] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  size="md"
  footer={
    <>
      <Button onClick={() => setIsOpen(false)}>Cancel</Button>
      <Button variant="primary" onClick={handleConfirm}>Confirm</Button>
    </>
  }
>
  <p>Are you sure you want to proceed?</p>
</Modal>
```

---

### 4. **Toast** (`src/components/common/Toast.tsx`) ✅
- ✅ Multiple types (success, error, warning, info)
- ✅ Auto-dismiss
- ✅ Manual close
- ✅ Multiple positions
- ✅ Dark mode support
- ✅ Animations
- ✅ React.memo optimized

**Usage:**
```typescript
import { useToast } from '../hooks/useToast';

const { showToast, ToastContainer } = useToast();

// In component
showToast('Operation successful!', 'success');
showToast('Error occurred', 'error');

// In render
<ToastContainer />
```

---

### 5. **Checkbox** (`src/components/common/Checkbox.tsx`) ✅
- ✅ Label support
- ✅ Error handling
- ✅ Help text
- ✅ Dark mode support
- ✅ forwardRef support
- ✅ React.memo optimized

**Usage:**
```typescript
import Checkbox from '../components/common/Checkbox';

<Checkbox
  label="I agree to terms and conditions"
  checked={agreed}
  onChange={(e) => setAgreed(e.target.checked)}
  error={errors.agreed}
  touched={touched.agreed}
  required
/>
```

---

## 🛠️ Utility Functions

### 1. **Formatting Utilities** (`src/utils/formatting.ts`) ✅

#### Functions:
- ✅ `formatNumber()` - Format numbers with separators
- ✅ `formatCurrency()` - Format currency
- ✅ `formatDate()` - Format dates
- ✅ `formatRelativeTime()` - Relative time (e.g., "2 hours ago")
- ✅ `formatFileSize()` - Format file sizes
- ✅ `formatPhoneNumber()` - Format phone numbers
- ✅ `truncateText()` - Truncate with ellipsis
- ✅ `capitalize()` - Capitalize first letter
- ✅ `slugify()` - Create URL-friendly slugs
- ✅ `getInitials()` - Get initials from name
- ✅ `formatPercentage()` - Format percentages

**Usage:**
```typescript
import {
  formatNumber,
  formatCurrency,
  formatDate,
  formatRelativeTime,
  formatFileSize,
} from '../utils/formatting';

formatNumber(1234567.89, 2); // "1 234 567,89"
formatCurrency(1234.56); // "1 234,56 zł"
formatDate(new Date()); // "15 stycznia 2024"
formatRelativeTime(new Date(Date.now() - 3600000)); // "1 godzinę temu"
formatFileSize(1024000); // "1000 KB"
```

---

### 2. **Constants** (`src/utils/constants.ts`) ✅

Centralized constants for:
- ✅ API configuration
- ✅ Pagination
- ✅ Debounce/throttle delays
- ✅ Toast durations
- ✅ Cache keys
- ✅ Validation rules
- ✅ File upload limits
- ✅ Date formats
- ✅ Breakpoints
- ✅ Z-index layers
- ✅ Animation durations
- ✅ Error messages
- ✅ Success messages

**Usage:**
```typescript
import { API_CONFIG, DELAYS, VALIDATION, ERROR_MESSAGES } from '../utils/constants';

const apiClient = createApiClient({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
});

const debouncedSearch = useDebounce(searchTerm, DELAYS.SEARCH_DEBOUNCE);

if (password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
  setError(ERROR_MESSAGES.PASSWORD_TOO_SHORT);
}
```

---

## 📊 Kompletny Przykład

### Formularz z Wszystkimi Komponentami

```typescript
import { useState } from 'react';
import { useFormValidation } from '../hooks/useFormValidation';
import { useToast } from '../hooks/useToast';
import { registerSchema } from '../utils/validation';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Textarea from '../components/common/Textarea';
import Checkbox from '../components/common/Checkbox';
import Modal from '../components/common/Modal';

const RegistrationForm = () => {
  const { showToast, ToastContainer } = useToast();
  const [showModal, setShowModal] = useState(false);

  const { values, errors, setValue, handleSubmit, isSubmitting, getFieldError, isFieldTouched } = useFormValidation({
    schema: registerSchema,
    onSubmit: async (data) => {
      // Handle submission
      showToast('Registration successful!', 'success');
    },
  });

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          value={values.email || ''}
          onChange={(e) => setValue('email', e.target.value)}
          error={getFieldError('email')}
          touched={isFieldTouched('email')}
          required
        />

        <Input
          label="Password"
          type="password"
          value={values.password || ''}
          onChange={(e) => setValue('password', e.target.value)}
          error={getFieldError('password')}
          touched={isFieldTouched('password')}
          required
        />

        <Select
          label="Country"
          options={[
            { value: 'pl', label: 'Poland' },
            { value: 'us', label: 'United States' },
          ]}
          value={values.country || ''}
          onChange={(e) => setValue('country', e.target.value)}
          error={getFieldError('country')}
          touched={isFieldTouched('country')}
        />

        <Textarea
          label="Bio"
          value={values.bio || ''}
          onChange={(e) => setValue('bio', e.target.value)}
          rows={4}
          error={getFieldError('bio')}
          touched={isFieldTouched('bio')}
        />

        <Checkbox
          label="I agree to terms and conditions"
          checked={values.agreeToTerms || false}
          onChange={(e) => setValue('agreeToTerms', e.target.checked)}
          error={getFieldError('agreeToTerms')}
          touched={isFieldTouched('agreeToTerms')}
          required
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isSubmitting}
        >
          Register
        </Button>
      </form>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Terms and Conditions"
        size="lg"
      >
        <p>Terms content...</p>
      </Modal>

      <ToastContainer />
    </>
  );
};
```

---

## ✅ Checklist

- [x] Select component
- [x] Textarea component
- [x] Modal component
- [x] Toast component (updated)
- [x] Checkbox component
- [x] Formatting utilities
- [x] Constants file
- [x] Documentation

---

## 🎯 Korzyści

### Komponenty:
- ✅ **Spójny design** - Wszystkie używają tych samych stylów
- ✅ **Accessible** - Proper ARIA attributes
- ✅ **Wydajne** - React.memo optimization
- ✅ **Type-safe** - Full TypeScript support

### Utilities:
- ✅ **Centralized** - Wszystkie constants w jednym miejscu
- ✅ **Reusable** - Można używać wszędzie
- ✅ **Localized** - Polish formatting
- ✅ **Consistent** - Spójne formatowanie

---

*Senior Specialist - Additional Components Implementation*

