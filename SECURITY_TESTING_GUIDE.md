# 🧪 PRZEWODNIK TESTOWANIA BEZPIECZEŃSTWA - DlaMedica.pl

**Data:** $(date)  
**Status:** ✅ Przewodnik testowania

---

## 📋 SPIS TREŚCI

1. [Testy Manualne](#testy-manualne)
2. [Testy Automatyczne](#testy-automatyczne)
3. [Testy Penetracyjne](#testy-penetracyjne)
4. [Checklist Bezpieczeństwa](#checklist-bezpieczeństwa)

---

## 🧪 TESTY MANUALNE

### 1. Test Rate Limiting

```bash
# Test przekroczenia rate limitu dla auth
for i in {1..10}; do
  curl -X POST http://localhost:3001/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"test"}'
done

# Oczekiwany wynik: 429 Too Many Requests po 5 próbach
```

### 2. Test CSRF Protection

```bash
# Test requestu bez CSRF tokena
curl -X POST http://localhost:3001/api/progress/update \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"moduleId":"test","progress":50}'

# Oczekiwany wynik: 403 Forbidden - CSRF token missing
```

### 3. Test Input Validation

```bash
# Test SQL injection w query parameters
curl "http://localhost:3001/api/content/search?q=test' OR '1'='1" \
  -H "Authorization: Bearer <token>"

# Oczekiwany wynik: 400 Bad Request - Invalid query parameters
```

### 4. Test XSS Protection

```bash
# Test XSS w body requestu
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"name":"<script>alert(1)</script>"}'

# Oczekiwany wynik: Sanityzacja - usunięcie tagów script
```

### 5. Test File Upload Security

```bash
# Test uploadu niebezpiecznego pliku
curl -X POST http://localhost:3001/api/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@malicious.exe"

# Oczekiwany wynik: 400 Bad Request - Invalid file type
```

### 6. Test IP Blocking

```bash
# Wykonaj wiele nieudanych prób autoryzacji z tego samego IP
# Oczekiwany wynik: IP zostanie zablokowane po 5 próbach
```

### 7. Test CORS

```bash
# Test requestu z nieautoryzowanej domeny
curl -X GET http://localhost:3001/api/users \
  -H "Origin: https://evil.com" \
  -H "Authorization: Bearer <token>"

# Oczekiwany wynik: CORS error
```

---

## 🤖 TESTY AUTOMATYCZNE

### 1. Testy Unit (Jest)

```javascript
// backend/__tests__/security/rateLimiter.test.js
describe('Rate Limiter', () => {
  it('should block requests after limit exceeded', async () => {
    // Test implementation
  });
});

// backend/__tests__/security/inputValidation.test.js
describe('Input Validation', () => {
  it('should sanitize SQL injection attempts', () => {
    // Test implementation
  });
  
  it('should sanitize XSS attempts', () => {
    // Test implementation
  });
});
```

### 2. Testy Integracyjne

```javascript
// backend/__tests__/security/integration.test.js
describe('Security Integration', () => {
  it('should protect against SQL injection', async () => {
    // Test implementation
  });
  
  it('should protect against XSS', async () => {
    // Test implementation
  });
});
```

### 3. Testy E2E

```javascript
// e2e/security.test.js
describe('Security E2E', () => {
  it('should block brute force attacks', async () => {
    // Test implementation
  });
});
```

---

## 🔍 TESTY PENETRACYJNE

### 1. SQL Injection

**Testowane endpointy:**
- `/api/content/search?q=...`
- `/api/users/:userId/progress`
- Wszystkie endpointy z parametrami

**Narzędzia:**
- SQLMap
- Manual testing

### 2. XSS

**Testowane obszary:**
- Formularze (rejestracja, logowanie, kontakt)
- Komentarze
- Profile użytkowników
- Wyszukiwanie

**Narzędzia:**
- Burp Suite
- OWASP ZAP

### 3. CSRF

**Testowane endpointy:**
- Wszystkie POST/PUT/DELETE endpoints

**Narzędzia:**
- Burp Suite
- OWASP ZAP

### 4. Authentication Bypass

**Testowane:**
- JWT token manipulation
- Session hijacking
- Token replay attacks

**Narzędzia:**
- Burp Suite
- JWT.io

---

## ✅ CHECKLIST BEZPIECZEŃSTWA

### Authentication & Authorization
- [ ] Rate limiting działa poprawnie
- [ ] CSRF protection działa
- [ ] JWT tokens są walidowane
- [ ] Role-based access control działa
- [ ] IP blocking działa

### Input Validation
- [ ] SQL injection jest blokowane
- [ ] XSS jest blokowane
- [ ] Command injection jest blokowane
- [ ] Path traversal jest blokowane
- [ ] Query parameters są sanityzowane

### Data Protection
- [ ] Wrażliwe dane są filtrowane z odpowiedzi
- [ ] Logi nie zawierają wrażliwych danych
- [ ] localStorage jest zabezpieczony
- [ ] SessionStorage jest używany dla wrażliwych danych

### File Upload
- [ ] Niebezpieczne pliki są blokowane
- [ ] Rozmiar plików jest ograniczony
- [ ] Typy MIME są walidowane
- [ ] Nazwy plików są sanityzowane

### Security Headers
- [ ] CSP headers są ustawione
- [ ] HSTS jest włączony
- [ ] X-Frame-Options jest ustawiony
- [ ] CORS jest skonfigurowany poprawnie

### Monitoring
- [ ] Security logs są zapisywane
- [ ] Audit logs działają
- [ ] Request tracking działa
- [ ] Security endpoints działają

---

## 🛠️ NARZĘDZIA

### Security Scanning
- **OWASP ZAP** - automatyczne skanowanie luk
- **Burp Suite** - testy penetracyjne
- **SQLMap** - testy SQL injection
- **Nmap** - skanowanie portów

### Code Analysis
- **ESLint Security Plugin** - analiza kodu
- **Snyk** - skanowanie zależności
- **npm audit** - sprawdzanie podatności

### Monitoring
- **Sentry** - monitoring błędów
- **DataDog** - monitoring aplikacji
- **CloudWatch** - logi AWS

---

## 📊 RAPORTOWANIE

### Po każdym teście:
1. **Zapisz wyniki** - co zostało przetestowane
2. **Zidentyfikuj luki** - jeśli jakieś zostały znalezione
3. **Priorytetyzuj** - krytyczne, wysokie, średnie, niskie
4. **Napraw** - wszystkie znalezione luki
5. **Przetestuj ponownie** - weryfikacja napraw

### Regularne testy:
- **Co tydzień:** Testy automatyczne
- **Co miesiąc:** Testy manualne
- **Co kwartał:** Testy penetracyjne
- **Co rok:** Pełny security audit

---

**Status:** ✅ Przewodnik gotowy do użycia

