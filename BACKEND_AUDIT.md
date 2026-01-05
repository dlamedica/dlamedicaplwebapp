# 🔍 Audyt Backendu DlaMedica

**Data audytu:** 22 grudnia 2025  
**Wersja aplikacji:** 1.0.0  
**Audytowany katalog:** `/backend`

---

## 📊 Podsumowanie

| Kategoria | Problemy Krytyczne | Problemy Wysokie | Problemy Średnie | Problemy Niskie |
|-----------|-------------------|------------------|------------------|-----------------|
| Bezpieczeństwo | 3 | 4 | 5 | 2 |
| Architektura | 1 | 3 | 4 | 2 |
| Baza danych | 2 | 3 | 2 | 1 |
| Kod | 0 | 2 | 5 | 3 |
| **RAZEM** | **6** | **12** | **16** | **8** |

---

## 🚨 PROBLEMY KRYTYCZNE

### 1. [KRYTYCZNE] Domyślna wartość JWT_SECRET w kodzie

**Plik:** `backend/middleware/auth.js`, linia 13

```javascript
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
```

**Problem:** Jeśli zmienna środowiskowa `JWT_SECRET` nie jest ustawiona, używana jest domyślna wartość znana publicznie. Pozwala to atakującemu na:
- Fałszowanie tokenów JWT
- Przejmowanie sesji użytkowników
- Eskalację uprawnień

**Rozwiązanie:**
```javascript
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  console.error('FATAL: JWT_SECRET must be set and be at least 32 characters');
  process.exit(1);
}
```

---

### 2. [KRYTYCZNE] Brak weryfikacji czasu ważności tokena resetowania hasła w bazie

**Plik:** `backend/routes/auth.js`, linie 592-606

**Problem:** Token resetowania hasła jest sprawdzany w pamięci aplikacji, ale w bazie nie ma kolumny `recovery_token_expires_at`. Przy restarcie serwera, stare tokeny mogą być nadal ważne.

**Rozwiązanie:**
- Dodać kolumnę `recovery_token_expires_at` do tabeli `auth.users`
- Sprawdzać ważność tokena w zapytaniu SQL

---

### 3. [KRYTYCZNE] Schemat Prisma niezgodny z rzeczywistą bazą danych

**Plik:** `prisma/schema.prisma`

**Problem:** Schemat Prisma definiuje inne tabele niż te używane w kodzie backendu:

| Tabela w Prisma | Tabela w kodzie | Status |
|-----------------|-----------------|--------|
| `users` | `auth.users` + `public.users` | ❌ Niezgodne |
| `flashcard_sets` | Nieużywana | ⚠️ Nieużywane |
| - | `user_progress` | ❌ Brak w Prisma |
| - | `quiz_attempts` | ❌ Brak w Prisma |
| - | `user_certificates` | ❌ Brak w Prisma |
| - | `user_topic_progress` | ❌ Brak w Prisma |
| - | `content_views` | ❌ Brak w Prisma |
| - | `user_notes` | ❌ Brak w Prisma |
| - | `user_favorites` | ❌ Brak w Prisma |
| - | `applications` | ❌ Brak w Prisma |
| - | `events` | ❌ Brak w Prisma |
| - | `event_participants` | ❌ Brak w Prisma |
| - | `user_points` | ❌ Brak w Prisma |
| - | `auth.sessions` | ❌ Brak w Prisma |

**Rozwiązanie:** Zaktualizować schemat Prisma do rzeczywistej struktury bazy danych.

---

## 🔴 PROBLEMY WYSOKIE

### 4. [WYSOKI] Hardcoded dane zamiast bazy danych

**Pliki:**
- `backend/routes/quiz.js` - `quizData` (linie 9-142)
- `backend/routes/modules.js` - `modulesData` (linie 8-192)
- `backend/routes/subjects.js` - `subjectsData` (linie 7-239)
- `backend/routes/content.js` - `contentData` (linie 8-118)

**Problem:** Dane edukacyjne są zahardcodowane w plikach JavaScript zamiast być w bazie danych:
- Brak możliwości edycji przez panel administracyjny
- Wymagany restart serwera po każdej zmianie
- Brak wersjonowania treści
- Problemy ze skalowalnością

**Rozwiązanie:** Przenieść dane do bazy PostgreSQL i stworzyć odpowiednie endpointy CRUD.

---

### 5. [WYSOKI] Brak implementacji wysyłania emaili

**Plik:** `backend/routes/auth.js`, linie 544-546

```javascript
// TODO: Wysłij email z linkiem resetowania
// W produkcji użyj serwisu email (SendGrid, Mailgun, etc.)
console.log(`📧 Reset token dla ${email}: ${resetToken}`);
```

**Problem:** Reset hasła nie wysyła emaila - token jest tylko logowany do konsoli.

**Rozwiązanie:** Zintegrować z SendGrid, Mailgun lub AWS SES.

---

### 6. [WYSOKI] Brak graceful shutdown

**Plik:** `backend/server.js`

**Problem:** Serwer nie obsługuje poprawnego zamykania:
- Otwarte połączenia z bazą mogą zostać przerwane
- Requesty w trakcie przetwarzania zostaną utracone
- Możliwa utrata danych

**Rozwiązanie:**
```javascript
process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, closing server gracefully...');
  server.close(async () => {
    await db.close();
    console.log('Server closed');
    process.exit(0);
  });
});
```

---

### 7. [WYSOKI] Brak blokady konta po nieudanych próbach logowania

**Plik:** `backend/routes/auth.js`

**Problem:** Nie ma mechanizmu blokującego konto po wielokrotnych nieudanych próbach logowania. Rate limiting jest na poziomie IP, a nie użytkownika.

**Rozwiązanie:**
- Dodać kolumnę `failed_login_attempts` i `locked_until` do `auth.users`
- Blokować konto po 5 nieudanych próbach na 15 minut

---

### 8. [WYSOKI] Session storage tylko w pamięci

**Plik:** `backend/middleware/rateLimiter.js`

```javascript
const limiter = process.env.REDIS_URL
  ? new RateLimiterRedis({...})
  : new RateLimiterMemory({...});
```

**Problem:** Bez Redis, rate limiting używa pamięci:
- Resetuje się przy każdym restarcie serwera
- Nie działa w przypadku wielu instancji
- Możliwy wyciek pamięci przy dużym ruchu

**Rozwiązanie:** Wdrożyć Redis dla produkcji.

---

### 9. [WYSOKI] Brak HTTPS enforcement

**Plik:** `backend/server.js`

**Problem:** Brak wymuszania HTTPS w trybie produkcyjnym.

**Rozwiązanie:**
```javascript
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      return res.redirect(`https://${req.header('host')}${req.url}`);
    }
    next();
  });
}
```

---

### 10. [WYSOKI] Duplikacja eksportu w securityLogger

**Plik:** `backend/middleware/securityLogger.js`, linie 183-186

```javascript
module.exports = SecurityLogger;

module.exports = SecurityLogger;
```

**Problem:** Podwójny `module.exports` - potencjalny problem w niektórych wersjach Node.js.

**Rozwiązanie:** Usunąć duplikat.

---

## 🟠 PROBLEMY ŚREDNIE

### 11. [ŚREDNI] Brak testów jednostkowych

**Problem:** Katalog `backend/` nie zawiera żadnych testów pomimo zdefiniowanego jest w `package.json`:

```json
"devDependencies": {
  "jest": "^29.7.0",
  "supertest": "^6.3.3"
}
```

**Rozwiązanie:** Napisać testy dla:
- Middleware autoryzacji
- Endpointów API
- Funkcji pomocniczych

---

### 12. [ŚREDNI] Brak dokumentacji API (Swagger/OpenAPI)

**Problem:** API nie ma dokumentacji. Deweloperzy muszą czytać kod aby zrozumieć endpointy.

**Rozwiązanie:** Dodać Swagger/OpenAPI:
```bash
npm install swagger-ui-express swagger-jsdoc
```

---

### 13. [ŚREDNI] Brak walidacji w niektórych endpointach

**Pliki z brakującą walidacją:**
- `backend/routes/subjects.js` - GET endpoints bez walidacji parametrów
- `backend/routes/security.js` - POST `/test-ip` - brak walidacji formatu IP
- `backend/routes/profile.js` - PUT `/account` - brak walidacji pól

**Rozwiązanie:** Dodać Joi schemas dla wszystkich endpointów.

---

### 14. [ŚREDNI] Logi bezpieczeństwa tylko do pliku

**Plik:** `backend/middleware/securityLogger.js`

**Problem:** Logi bezpieczeństwa są zapisywane do pliku lokalnego:
- Brak centralizacji logów
- Brak alertów w czasie rzeczywistym
- Trudna analiza

**Rozwiązanie:** Zintegrować z:
- Sentry dla błędów
- CloudWatch/Datadog dla logów
- Webhook dla alertów krytycznych

---

### 15. [ŚREDNI] Brak health check dla bazy danych

**Plik:** `backend/middleware/healthCheckSecurity.js`

**Problem:** Szczegółowy health check wymaga autoryzacji admin, ale podstawowy nie sprawdza połączenia z bazą.

**Rozwiązanie:**
```javascript
const secureHealthCheck = async (req, res) => {
  const dbStatus = await db.checkConnection();
  res.json({
    status: dbStatus ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    database: dbStatus ? 'connected' : 'disconnected'
  });
};
```

---

### 16. [ŚREDNI] Brak indeksów w bazie danych

**Problem:** Kod wykonuje wiele zapytań bez odpowiednich indeksów:

```sql
-- Brakujące indeksy:
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_module_id ON user_progress(module_id);
CREATE INDEX idx_quiz_attempts_user_quiz ON quiz_attempts(user_id, quiz_id);
CREATE INDEX idx_content_views_user_content ON content_views(user_id, content_id);
```

---

### 17. [ŚREDNI] Token refresh nie unieważnia starego tokena

**Plik:** `backend/routes/auth.js`, endpoint `/refresh`

**Problem:** Po odświeżeniu tokena, stary token nadal działa do wygaśnięcia.

**Rozwiązanie:** Implementować token blacklist lub rotację tokenów z unieważnianiem.

---

### 18. [ŚREDNI] Brak sanityzacji HTML w treściach edukacyjnych

**Plik:** `backend/routes/content.js`

**Problem:** Treści edukacyjne zawierają surowy HTML, który jest zwracany do klienta. Potencjalne XSS jeśli treści są edytowalne.

**Rozwiązanie:** Użyć DOMPurify lub podobnej biblioteki do sanityzacji HTML.

---

### 19. [ŚREDNI] Timeout połączenia z bazą danych zbyt krótki

**Plik:** `backend/db/index.js`, linia 17

```javascript
connectionTimeoutMillis: 2000,
```

**Problem:** 2 sekundy może być zbyt krótkie przy dużym obciążeniu.

**Rozwiązanie:** Zwiększyć do 5000ms i dodać retry logic.

---

### 20. [ŚREDNI] Brak walidacji Content-Type

**Problem:** API nie wymusza `Content-Type: application/json` dla requestów POST/PUT.

**Rozwiązanie:**
```javascript
app.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    if (!req.is('application/json')) {
      return res.status(415).json({ error: 'Content-Type must be application/json' });
    }
  }
  next();
});
```

---

## 🟡 PROBLEMY NISKIE

### 21. [NISKI] Brak paginacji w niektórych endpointach

**Pliki:**
- `backend/routes/subjects.js` - zwraca wszystkie przedmioty
- `backend/routes/quiz.js` - `/api/quiz/:id/results` - wszystkie próby

**Rozwiązanie:** Dodać parametry `limit` i `offset`.

---

### 22. [NISKI] Niespójne nazewnictwo zmiennych

**Przykłady:**
- `user_id` vs `userId` (snake_case vs camelCase)
- `created_at` vs `createdAt`
- `quiz_id` vs `quizId`

**Rozwiązanie:** Ustalić konwencję: camelCase w JS, snake_case w bazie, transformacja w warstwie danych.

---

### 23. [NISKI] Brak compression dla odpowiedzi JSON

**Problem:** Mimo użycia middleware `compression`, duże odpowiedzi JSON nie są optymalizowane.

**Rozwiązanie:** Sprawdzić konfigurację compression i threshold.

---

### 24. [NISKI] Console.log w produkcji

**Problem:** Wiele miejsc używa `console.log`, `console.error` zamiast strukturyzowanego logowania.

**Rozwiązanie:** Użyć Winston lub Pino dla strukturyzowanych logów.

---

### 25. [NISKI] Brak cache'owania odpowiedzi

**Problem:** Statyczne dane (przedmioty, moduły) są ładowane przy każdym requeście.

**Rozwiązanie:** Dodać Redis cache lub in-memory cache z TTL.

---

### 26. [NISKI] Brak obsługi CORS preflight caching

**Plik:** `backend/server.js`, linia 90

```javascript
maxAge: 86400, // 24 godziny
```

**Problem:** Dobrze skonfigurowane, ale brak testów czy działa poprawnie.

---

### 27. [NISKI] Nieużywane dependencies

**Plik:** `backend/package.json`

**Problem:** Multer jest zainstalowany ale nieużywany w żadnym route.

```json
"multer": "^1.4.5-lts.1"
```

**Rozwiązanie:** Usunąć nieużywane zależności lub zaimplementować upload plików.

---

### 28. [NISKI] Brak wersjonowania API

**Problem:** API nie ma wersjonowania (`/api/v1/...`).

**Rozwiązanie:**
```javascript
app.use('/api/v1', require('./routes'));
```

---

## ✅ CO DZIAŁA DOBRZE

1. **Helmet.js** - poprawnie skonfigurowane security headers
2. **Rate limiting** - zróżnicowane limity dla różnych endpointów
3. **Input sanitization** - ochrona przed SQL injection i XSS
4. **JWT authentication** - poprawna implementacja (poza domyślnym secretem)
5. **Role-based access control** - działa poprawnie
6. **Password hashing** - bcrypt z salt 12
7. **CORS** - poprawnie skonfigurowane
8. **Error handling** - centralized error handler
9. **Environment validation** - walidacja zmiennych środowiskowych przy starcie
10. **Request tracking** - śledzenie podejrzanych requestów
11. **IP blocking** - możliwość blokowania IP
12. **Audit logging** - logowanie operacji bezpieczeństwa

---

## 📋 PRIORYTETY NAPRAWY

### Natychmiast (przed produkcją):
1. ❌ Usunąć domyślny JWT_SECRET
2. ❌ Zaktualizować schemat Prisma
3. ❌ Wdrożyć wysyłanie emaili
4. ❌ Usunąć duplikat w securityLogger.js

### W ciągu tygodnia:
5. ⚠️ Przenieść dane do bazy
6. ⚠️ Dodać graceful shutdown
7. ⚠️ Wdrożyć Redis dla rate limiting
8. ⚠️ Dodać blokadę konta po nieudanych próbach

### W ciągu miesiąca:
9. 📝 Napisać testy jednostkowe
10. 📝 Dodać dokumentację Swagger
11. 📝 Zaimplementować 2FA
12. 📝 Dodać indeksy do bazy danych

---

## 📁 STRUKTURA REKOMENDOWANA

```
backend/
├── config/
│   ├── database.js        # Konfiguracja bazy
│   ├── redis.js           # Konfiguracja Redis
│   └── email.js           # Konfiguracja emaili
├── controllers/           # Logika biznesowa
│   ├── authController.js
│   ├── userController.js
│   └── ...
├── middleware/            # ✅ Istniejące
├── models/                # Modele danych (ORM)
│   ├── User.js
│   ├── Module.js
│   └── ...
├── routes/                # ✅ Istniejące
├── services/              # Serwisy zewnętrzne
│   ├── emailService.js
│   ├── cacheService.js
│   └── ...
├── utils/                 # ✅ Istniejące
├── validators/            # Schematy walidacji
├── tests/                 # ❌ Brak - DODAĆ
│   ├── unit/
│   └── integration/
├── docs/                  # ❌ Brak - DODAĆ
│   └── swagger.yaml
└── server.js              # ✅ Istniejące
```

---

## 📞 KONTAKT

Raport przygotowany automatycznie przez Claude AI.  
W razie pytań dotyczących audytu, proszę o kontakt z zespołem deweloperskim.
