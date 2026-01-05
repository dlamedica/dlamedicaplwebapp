# 🧩 Reusable Components - Senior Specialist

## 📋 Overview

Zestaw reusable components zoptymalizowanych dla wydajności i łatwości użycia.

---

## 🎯 Components

### 1. **Button** (`src/components/common/Button.tsx`)

#### Features:
- ✅ Multiple variants (primary, secondary, danger, success, outline, ghost)
- ✅ Multiple sizes (sm, md, lg)
- ✅ Loading state
- ✅ Icons support (left/right)
- ✅ Full width option
- ✅ Dark mode support
- ✅ React.memo optimized

#### Usage:
```typescript
import Button from '../components/common/Button';

// Basic
<Button onClick={handleClick}>Click me</Button>

// With variant
<Button variant="danger" onClick={handleDelete}>Delete</Button>

// With loading
<Button isLoading={loading} onClick={handleSubmit}>Submit</Button>

// With icons
<Button 
  leftIcon={<FaSave />}
  rightIcon={<FaArrowRight />}
  onClick={handleSave}
>
  Save
</Button>

// Full width
<Button fullWidth onClick={handleSubmit}>Submit</Button>
```

---

### 2. **Input** (`src/components/common/Input.tsx`)

#### Features:
- ✅ Label support
- ✅ Error handling with FormField
- ✅ Help text
- ✅ Icons (left/right)
- ✅ Multiple sizes
- ✅ Dark mode support
- ✅ forwardRef support
- ✅ React.memo optimized

#### Usage:
```typescript
import Input from '../components/common/Input';
import { useFormValidation } from '../hooks/useFormValidation';
import { emailSchema } from '../utils/validation';

const MyForm = () => {
  const { values, errors, setValue, getFieldError, isFieldTouched } = useFormValidation({
    schema: z.object({ email: emailSchema }),
  });

  return (
    <Input
      label="Email"
      type="email"
      value={values.email || ''}
      onChange={(e) => setValue('email', e.target.value)}
      error={getFieldError('email')}
      touched={isFieldTouched('email')}
      helpText="Enter your email address"
      leftIcon={<FaEnvelope />}
      required
    />
  );
};
```

---

### 3. **Spinner** (`src/components/common/Spinner.tsx`)

#### Features:
- ✅ Multiple sizes (sm, md, lg, xl)
- ✅ Dark mode support
- ✅ React.memo optimized

#### Usage:
```typescript
import Spinner from '../components/common/Spinner';

// Basic
<Spinner />

// With size
<Spinner size="lg" />

// With dark mode
<Spinner size="md" darkMode={true} />
```

---

### 4. **FormField** (`src/components/common/FormField.tsx`)

#### Features:
- ✅ Label with required indicator
- ✅ Error display
- ✅ Help text
- ✅ Consistent styling

#### Usage:
```typescript
import { FormField } from '../components/common/FormField';

<FormField
  label="Username"
  name="username"
  error={errors.username}
  touched={touched.username}
  required
  helpText="Choose a unique username"
>
  <input
    type="text"
    name="username"
    value={values.username}
    onChange={handleChange}
  />
</FormField>
```

---

## 🔧 API Client & Hooks

### 1. **ApiClient** (`src/services/apiClient.ts`)

#### Features:
- ✅ Automatic retry with exponential backoff
- ✅ Request/response caching
- ✅ Timeout support
- ✅ Error handling
- ✅ Type-safe responses

#### Usage:
```typescript
import { apiClient } from '../services/apiClient';

// GET request
const response = await apiClient.get<User>('/users/1');
console.log(response.data);

// POST request
const newUser = await apiClient.post<User>('/users', {
  name: 'John',
  email: 'john@example.com',
});

// With cache disabled
const data = await apiClient.get('/data', { cache: false });

// With custom retry
const result = await apiClient.get('/data', { retry: false });
```

---

### 2. **useApi Hook** (`src/hooks/useApi.ts`)

#### Features:
- ✅ Loading state
- ✅ Error handling
- ✅ Automatic execution
- ✅ Manual trigger

#### Usage:
```typescript
import { useApi } from '../hooks/useApi';
import { apiClient } from '../services/apiClient';

const UserProfile = ({ userId }) => {
  const { data, loading, error, execute } = useApi(
    () => apiClient.get<User>(`/users/${userId}`),
    {
      immediate: true,
      onSuccess: (user) => console.log('Loaded:', user),
      onError: (err) => console.error('Error:', err),
    }
  );

  if (loading) return <Spinner />;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;

  return <div>{data.name}</div>;
};
```

---

### 3. **useMutation Hook** (`src/hooks/useApi.ts`)

#### Features:
- ✅ POST/PUT/PATCH support
- ✅ Loading state
- ✅ Error handling
- ✅ Success/error callbacks

#### Usage:
```typescript
import { useMutation } from '../hooks/useApi';
import { apiClient } from '../services/apiClient';

const CreateUser = () => {
  const { mutate, loading, error } = useMutation(
    (userData: CreateUserData) => apiClient.post<User>('/users', userData),
    {
      onSuccess: (user) => {
        console.log('User created:', user);
        navigate(`/users/${user.id}`);
      },
      onError: (err) => {
        showToast(err.message);
      },
    }
  );

  const handleSubmit = (data: CreateUserData) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <Button type="submit" isLoading={loading}>
        Create User
      </Button>
    </form>
  );
};
```

---

## 📊 Complete Example

### Form with Validation and API Call

```typescript
import { useState } from 'react';
import { useFormValidation } from '../hooks/useFormValidation';
import { useMutation } from '../hooks/useApi';
import { registerSchema } from '../utils/validation';
import { apiClient } from '../services/apiClient';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Spinner from '../components/common/Spinner';

const RegisterForm = () => {
  const { values, errors, setValue, handleSubmit, isSubmitting, getFieldError, isFieldTouched } = useFormValidation({
    schema: registerSchema,
  });

  const { mutate: register, loading: registering } = useMutation(
    (data) => apiClient.post('/auth/register', data),
    {
      onSuccess: () => {
        showToast('Registration successful!');
        navigate('/login');
      },
      onError: (error) => {
        showToast(error.message);
      },
    }
  );

  const onSubmit = async (data: unknown) => {
    await register(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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

      <Button
        type="submit"
        variant="primary"
        fullWidth
        isLoading={isSubmitting || registering}
      >
        Register
      </Button>
    </form>
  );
};
```

---

## ✅ Checklist

- [x] Button component
- [x] Input component
- [x] Spinner component
- [x] FormField component
- [x] ApiClient service
- [x] useApi hook
- [x] useMutation hook
- [x] Documentation
- [ ] Tests for components
- [ ] Storybook stories (optional)

---

*Senior Specialist Implementation*

