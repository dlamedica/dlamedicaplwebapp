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
├── database-schema.sql                 # Schemat bazy danych
└── README.md                           # Ta dokumentacja
```

## Wymagane usługi

| Usługa | Opis | Koszt |
|--------|------|-------|
| **n8n** | Platforma automatyzacji | Self-hosted: Free / Cloud: od $20/mies |
| **PostgreSQL** | Baza danych leadów | Free (używasz istniejącej) |
| **SMTP** | Wysyłka emaili | SendGrid/Mailgun: Free tier dostępny |
| **Slack** | Powiadomienia | Free |
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

#### Slack
```
Name: DlaMedica Slack
Bot Token: xoxb-your-token
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
- Wysyłka na Slack i email

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
