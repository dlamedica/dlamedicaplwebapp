# 🔧 PLAN NAPRAWCZY - DlaMedica.pl

## Status na: 2026-01-10

---

## 📊 PODSUMOWANIE AUDYTU

| Metryka | Wartość |
|---------|---------|
| Pliki frontend | 586 |
| Endpointy API | ~80 |
| Modele Prisma | 8 |
| Tabele SQL (niezsynch.) | 50+ |
| Mock data instancji | 114 |
| TODOs w kodzie | 18 |

---

## 🔴 FAZA 1: KRYTYCZNE (Tydzień 1-2)

### 1.1 Tokeny - bezpieczeństwo XSS
**Problem:** Tokeny JWT przechowywane w localStorage są podatne na XSS.

**Plik:** `src/contexts/AuthContext.tsx`

**Rozwiązanie:**
- [ ] Przenieść tokeny do httpOnly cookies
- [ ] Dodać CSRF protection dla cookie-based auth
- [ ] Usunąć tokeny z localStorage

### 1.2 Reset hasła - brak emaila
**Problem:** Endpoint istnieje, ale email nie jest wysyłany.

**Plik:** `backend/routes/auth.js:659`

**Rozwiązanie:**
- [ ] Skonfigurować nodemailer/SendGrid
- [ ] Dodać template emaila reset hasła
- [ ] Implementacja tokena resetowania (1h ważność)

### 1.3 Synchronizacja bazy danych
**Problem:** 50+ tabel w SQL, tylko 8 w Prisma schema.

**Pliki:** `prisma/schema.prisma`, `CREATE_*.sql`

**Rozwiązanie:**
- [ ] Zmigrować wszystkie tabele do Prisma
- [ ] Utworzyć migracje Prisma
- [ ] Usunąć pliki .sql po migracji

### 1.4 Dashboard Admin - prawdziwe dane
**Problem:** Statystyki hardcoded na 0.

**Pliki:**
- `AdminDashboardEnhanced.tsx:100-103`
- `CompanyDashboardEnhanced.tsx:120-132`

**Rozwiązanie:**
- [ ] Utworzyć API endpoint `/api/admin/stats`
- [ ] Zapytania COUNT dla użytkowników, artykułów, wydarzeń
- [ ] Podłączyć frontend do API

---

## 🟠 FAZA 2: WYSOKIE (Tydzień 3-4)

### 2.1 Usunięcie Mock Data (114 instancji)
**Serwisy do zastąpienia:**
- [ ] `mockJobService.ts` → prawdziwe oferty z DB
- [ ] `mockEducationService.ts` → prawdziwe kursy z DB
- [ ] `mockEventsService.ts` → prawdziwe wydarzenia z DB
- [ ] `mockShopService.ts` → prawdziwe produkty z DB
- [ ] `mockProfileService.ts` → prawdziwe dane profilu z DB

### 2.2 Fiszki - persystencja
**Problem:** Fiszki nie zapisują się do bazy.

**Pliki:**
- `CreateFlashcardSet.tsx:67,76`
- `FlashcardEditor.tsx:99`

**Rozwiązanie:**
- [ ] Backend API: POST/GET/PUT/DELETE flashcards
- [ ] Połączyć z istniejącym modelem Prisma `FlashcardSet`

### 2.3 System Premium
**Problem:** Brak logiki sprawdzania subskrypcji.

**Plik:** `Calculators.tsx:23`

**Rozwiązanie:**
- [ ] Tabela `subscriptions` w DB
- [ ] Middleware `requirePremium`
- [ ] UI dla upgrade do premium

### 2.4 Grywalizacja
**Problem:** Wszystko na mock data.

**Pliki:** Serwisy grywalizacji

**Rozwiązanie:**
- [ ] Tabele: user_points, badges, achievements
- [ ] API endpoints dla punktów i odznak
- [ ] Leaderboard prawdziwy

---

## 🟡 FAZA 3: ŚREDNIE (Tydzień 5-6)

### 3.1 Czyszczenie kodu
- [ ] Usunąć `JobOffersPage.tsx.backup`
- [ ] Usunąć `JobOffersPage.tsx.problematic`
- [ ] Usunąć `App_Simple.tsx`
- [ ] Usunąć console.log z produkcji

### 3.2 Konfiguracja
- [ ] CORS do zmiennych środowiskowych
- [ ] Usunąć hardcoded IP z `server.js:81-82`

### 3.3 Logging
- [ ] Zastąpić console.log Winston/Pino
- [ ] Dodać request ID do logów
- [ ] Rotacja logów

### 3.4 Testy
- [ ] Unit testy dla auth middleware
- [ ] Integration testy dla API
- [ ] E2E testy dla krytycznych ścieżek

---

## 🟢 FAZA 4: PRZYSZŁOŚĆ

### 4.1 Features
- [ ] Multi-language (Google Translate API jest)
- [ ] Mobile app / PWA
- [ ] AI-powered search
- [ ] Video content

### 4.2 Infrastruktura
- [ ] CDN dla statycznych plików
- [ ] Redis cache
- [ ] Service worker (offline)
- [ ] Monitoring (Sentry/Datadog)

---

## ✅ CO JUŻ DZIAŁA

| Feature | Status |
|---------|--------|
| Autentykacja | ✅ |
| Sesje multi-device | ✅ |
| Baza leków | ✅ |
| Wydarzenia | ✅ |
| Oferty pracy | ✅ |
| Newsletter | ✅ |
| Feedback system | ✅ |
| Miesięczny raport AI | ✅ |
| n8n integracja | ✅ |
| Bezpieczeństwo (helmet, CSRF, rate limit) | ✅ |

---

## 📧 AUTOMATYZACJE N8N

### Utworzone workflow:

1. **📧 DlaMedica Newsletter** (ID: 2zgIg0YUtXhL9DsY)
   - Zintegrowany z API DlaMedica
   - Pobiera subskrybentów i artykuły
   - Qwen generuje content

2. **💬 Feedback Handler** (ID: gZYzTrUyYoJGU41k)
   - Webhook: /webhook/feedback
   - Kategoryzuje: error/suggestion/contact
   - Zapisuje do DB

3. **📊 Monthly Feedback Report** (ID: 4tNrGHfmn6trx7dv)
   - 1-go każdego miesiąca o 9:00
   - DeepSeek AI analizuje feedback
   - Wysyła raport HTML na email

### Do skonfigurowania w n8n:
- [ ] DeepSeek API Key (Credentials → HTTP Header Auth)
- [ ] Gmail/SMTP dla wysyłki raportów
- [ ] Twój adres email w "Wyślij Email" node

---

## 🎯 PRIORYTETY NA NAJBLIŻSZY TYDZIEŃ

1. ✅ ~~Skonfiguruj DeepSeek API w n8n~~ - DONE
2. ⬜ Skonfiguruj Telegram Bot dla raportów (Chat ID)
3. ⬜ Skonfiguruj SMTP w n8n dla password reset
4. ✅ ~~Napraw reset hasła~~ - DONE (webhook n8n)
5. ⬜ Przenieś tokeny do httpOnly cookies (większa zmiana)

---

## ✅ WYKONANE (2026-01-10)

- [x] Reset hasła - webhook n8n + piękny email HTML
- [x] API Admin stats - `/api/admin/stats`, `/api/admin/users`, `/api/admin/activity`
- [x] Usunięto pliki backup/problematic (3 pliki, -2528 linii)
- [x] Workflow password reset w n8n
- [x] Workflow monthly report → Telegram
- [x] Feedback system (tabela + API + n8n)

---

*Ostatnia aktualizacja: 2026-01-10 10:00*
