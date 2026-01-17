# DlaMedica - System automatyzacji pozyskiwania klientów

System n8n workflows do automatycznego pozyskiwania pracodawców medycznych dla publikacji ofert pracy.

## Przegląd systemu

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PIPELINE POZYSKIWANIA LEADÓW                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐           │
│  │   SCRAPING   │───▶│  COLD EMAIL  │───▶│  FOLLOW-UP   │           │
│  │  Google/LI   │    │   Campaign   │    │   Sequence   │           │
│  └──────────────┘    └──────────────┘    └──────────────┘           │
│         │                   │                   │                    │
│         ▼                   ▼                   ▼                    │
│  ┌─────────────────────────────────────────────────────┐            │
│  │                   BAZA DANYCH                        │            │
│  │              (PostgreSQL - leads)                    │            │
│  └─────────────────────────────────────────────────────┘            │
│         │                   │                   │                    │
│         ▼                   ▼                   ▼                    │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐           │
│  │   TRACKING   │    │  CONVERSION  │    │   WEEKLY     │           │
│  │  Responses   │    │   Webhook    │    │   REPORTS    │           │
│  └──────────────┘    └──────────────┘    └──────────────┘           │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Struktura plików

```
n8n-workflows/
├── 1-lead-scraping-workflow.json      # Scrapowanie leadów z Google
├── 2-cold-email-campaign-workflow.json # Kampania cold email
├── 3-followup-sequence-workflow.json   # Sekwencja follow-up
├── 4-linkedin-scraper-workflow.json    # Scraper LinkedIn
├── 5-response-tracking-workflow.json   # Śledzenie odpowiedzi
├── 6-weekly-report-workflow.json       # Raporty tygodniowe
├── 7-leads-newsletter-integration.json # Integracja leadów z newsletterem
├── database-schema.sql                 # Schemat bazy danych
└── README.md                           # Ta dokumentacja
```

## JAK ZAIMPORTOWAĆ DO n8n

**WAŻNE:** Te pliki to JSON workflows - musisz je ręcznie zaimportować do swojego n8n.

### Krok po kroku:

1. **Zaloguj się do n8n**: https://dlamedica.app.n8n.cloud

2. **Importuj każdy workflow:**
   - Kliknij przycisk **"+ Add workflow"** lub **"Create Workflow"**
   - W nowym workflow kliknij **trzy kropki (...)** w prawym górnym rogu
   - Wybierz **"Import from File"** lub **"Import from URL"**
   - Wklej zawartość pliku JSON (otwórz plik, kopiuj całość, wklej)
   - Lub użyj **"Import from URL"** jeśli pliki są dostępne online

3. **Skonfiguruj credentials** (po imporcie):
   - PostgreSQL - dane dostępowe do bazy
   - SMTP - do wysyłki emaili
   - HTTP Header Auth - API key dla newslettera

4. **Aktywuj workflow:**
   - Przełącz toggle "Active" na ON
   - Workflow zacznie działać według harmonogramu

### Szybki import przez CLI (jeśli masz n8n CLI):
```bash
# Importuj wszystkie workflows
n8n import:workflow --input=1-lead-scraping-workflow.json
n8n import:workflow --input=2-cold-email-campaign-workflow.json
n8n import:workflow --input=3-followup-sequence-workflow.json
n8n import:workflow --input=4-linkedin-scraper-workflow.json
n8n import:workflow --input=5-response-tracking-workflow.json
n8n import:workflow --input=6-weekly-report-workflow.json
n8n import:workflow --input=7-leads-newsletter-integration.json
```

## Wymagane usługi

| Usługa | Opis | Koszt |
|--------|------|-------|
| **n8n** | Platforma automatyzacji | Self-hosted: Free / Cloud: od $20/mies |
| **PostgreSQL** | Baza danych leadów | Free (używasz istniejącej) |
| **SMTP** | Wysyłka emaili | SendGrid/Mailgun: Free tier dostępny |
| **Phantombuster** (opcjonalnie) | LinkedIn scraping | od $59/mies |
| **Hunter.io** (opcjonalnie) | Weryfikacja emaili | 25 free/mies |

## Instalacja

### 1. Uruchom bazę danych

```bash
# Połącz się z PostgreSQL i wykonaj schemat
psql -U your_user -d your_database -f database-schema.sql
```

### 2. Zaimportuj workflow do n8n

1. Otwórz n8n panel
2. Kliknij "Import" w menu
3. Wklej zawartość każdego pliku JSON
4. Skonfiguruj credentials

### 3. Skonfiguruj credentials w n8n

#### PostgreSQL
```
Name: DlaMedica PostgreSQL
Host: localhost
Port: 5432
Database: dlamedica
User: your_user
Password: your_password
```

#### SMTP (SendGrid)
```
Name: DlaMedica SMTP
Host: smtp.sendgrid.net
Port: 587
User: apikey
Password: your_sendgrid_api_key
```

#### HTTP Header Auth (Newsletter API)
```
Name: DlaMedica API Key
Header Name: X-API-Key
Header Value: your_api_key
```

## Opis workflow

### 1. Lead Scraping (Codziennie)

**Cel:** Automatyczne znajdowanie firm medycznych szukających pracowników

**Jak działa:**
- Uruchamia się codziennie
- Wykonuje 5 losowych zapytań do Google
- Parsuje wyniki w poszukiwaniu emaili firmowych
- Zapisuje nowe leady do bazy
- Wysyła powiadomienie na Slack

**Zapytania wyszukiwania:**
- "szpital rekrutacja kontakt email"
- "klinika medyczna praca dla lekarzy"
- "przychodnia zatrudnimy lekarza"
- I wiele więcej...

### 2. Cold Email Campaign (Co 4 godziny)

**Cel:** Automatyczna wysyłka spersonalizowanych emaili

**Jak działa:**
- Pobiera max 10 nowych leadów
- Personalizuje email (typ placówki, temat)
- Wysyła z 30s opóźnieniem między emailami
- Aktualizuje status w bazie
- Loguje wysyłki

**Personalizacja:**
- Automatyczne wykrywanie typu placówki (szpital/klinika/apteka)
- Losowy wybór tematu emaila
- Spersonalizowana treść HTML

### 3. Follow-up Sequence (Codziennie)

**Cel:** Automatyczne follow-upy do osób, które nie odpowiedziały

**Sekwencja:**
1. **Follow-up 1 (po 3 dniach):** Przypomnienie
2. **Follow-up 2 (po 6 dniach):** Wartość dodana (raport)
3. **Follow-up 3 (po 9 dniach):** Ostatnia szansa

**Jak działa:**
- Wybiera leady bez odpowiedzi po 3+ dniach
- Generuje odpowiednią wersję follow-up
- Wysyła i aktualizuje licznik

### 4. LinkedIn Scraper (Co tydzień)

**Cel:** Znajdowanie osób HR w firmach medycznych

**Jak działa:**
- Używa Phantombuster API (wymaga konta)
- Wyszukuje profile HR w branży medycznej
- Próbuje znaleźć emaile firmowe
- Zapisuje do oddzielnej tabeli

### 5. Response Tracking (Webhook)

**Cel:** Śledzenie odpowiedzi i konwersji

**Funkcje:**
- Webhook dla odpowiedzi email (z SendGrid/Mailgun)
- Analiza sentymentu odpowiedzi
- Automatyczne oznaczanie wypisanych
- Alert dla pozytywnych odpowiedzi (hot leads)
- Webhook dla nowych rejestracji pracodawców

### 6. Weekly Report (Poniedziałek 9:00)

**Cel:** Tygodniowe podsumowanie wyników

**Zawiera:**
- Statystyki tygodnia (leady, emaile, odpowiedzi, konwersje)
- Reply rate i conversion rate
- Top źródła leadów
- Lista hot leadów do kontaktu
- Wysyłka email (raporty)

### 7. Newsletter Integration (Codziennie 10:00 + Webhook)

**Cel:** Automatyczna synchronizacja leadów z newsletterem

**Funkcje:**
- Codzienne dodawanie nowych leadów do newslettera
- Webhook do ręcznego dodawania leadów
- Segmentacja według typu placówki (szpitale, kliniki, apteki, itp.)
- Tagowanie leadów dla lepszego targetowania
- Śledzenie statusu subskrypcji w bazie

**Segmenty newslettera:**
- `hospitals` - szpitale
- `clinics` - kliniki
- `outpatient` - przychodnie
- `pharmacy` - apteki i farmacja
- `diagnostics` - laboratoria
- `dental` - stomatologia
- `rehabilitation` - rehabilitacja
- `private_practice` - gabinety prywatne
- `medical_centers` - centra medyczne
- `long_term_care` - opieka długoterminowa

**Webhook endpoints:**
```
POST /webhook/add-lead-to-newsletter
Body: {
  "email": "rekrutacja@szpital.pl",
  "company_name": "Szpital Miejski",
  "facility_type": "szpital",
  "add_to_newsletter": true
}

GET /webhook/newsletter-leads-stats
Response: statystyki leadów i subskrypcji
```

## Webhook endpoints

### Odpowiedzi email
```
POST /webhook/email-reply-webhook
```
Konfiguracja w SendGrid/Mailgun:
- Forward incoming emails to this webhook

### Nowa rejestracja pracodawcy
```
POST /webhook/new-employer-registration
```
Wywołaj z aplikacji przy rejestracji:
```javascript
// W RegisterForm.tsx dla typu 'employer'
fetch('YOUR_N8N_URL/webhook/new-employer-registration', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: formData.email,
    companyName: formData.companyName,
    ref: searchParams.get('ref') || 'direct'
  })
});
```

## Konfiguracja emaili

### Struktura cold email

Email zawiera:
- Profesjonalny nagłówek z logiem DlaMedica
- Statystyki platformy (15 000+ użytkowników)
- Lista korzyści (6 punktów)
- CTA button z UTM tracking
- Link do wypisania

### Unikanie spamu

1. **Limity wysyłki:**
   - Max 10 emaili/4h
   - 30s opóźnienie między emailami
   - Max 3 follow-upy

2. **Reputacja:**
   - Używaj dedykowanej domeny
   - Skonfiguruj SPF, DKIM, DMARC
   - Monitoruj bounce rate

3. **Treść:**
   - Personalizacja
   - Jasny link wypisania
   - Wartość dla odbiorcy

## Statystyki i KPIs

### Widoki w bazie danych

```sql
-- Statystyki dzienne
SELECT * FROM lead_statistics;

-- Leady do kontaktu
SELECT * FROM leads_to_contact;

-- Do follow-up
SELECT * FROM leads_for_followup;
```

### Oczekiwane wyniki

| Metryka | Oczekiwana wartość |
|---------|-------------------|
| Reply rate | 5-15% |
| Positive reply rate | 2-5% |
| Conversion rate | 1-3% |
| Unsubscribe rate | < 1% |

## Rozbudowa systemu

### Dodatkowe źródła leadów

1. **Baza NFZ** - lista szpitali i przychodni
2. **Rejestry lekarzy** - dane kontaktowe gabinetów
3. **Portale medyczne** - ogłoszenia o pracę (konkurencja)
4. **Social media** - monitoring hashtagów

### Integracje

1. **CRM** (HubSpot/Pipedrive) - automatyczny import leadów
2. **Calendly** - umawianie spotkań
3. **Stripe** - śledzenie płatności premium
4. **Google Sheets** - export danych

### A/B Testing

Testuj różne warianty:
- Tematy emaili
- Treści emaili
- Czas wysyłki
- Sekwencja follow-up

## Troubleshooting

### Email nie dociera

1. Sprawdź konfigurację SMTP
2. Zweryfikuj SPF/DKIM
3. Sprawdź czy email nie jest na blackliście
4. Sprawdź logi w n8n

### Brak nowych leadów

1. Sprawdź czy scraping działa (logi)
2. Zweryfikuj zapytania wyszukiwania
3. Może być rate limiting od Google

### Wysokie unsubscribe rate

1. Przejrzyj treść emaili
2. Zmniejsz częstotliwość
3. Lepiej targetuj odbiorców

## Licencja

Wewnętrzne użycie DlaMedica.pl
