# Integracja n8n z DlaMedica Newsletter

## Krok 1: Utwórz Credential w n8n

1. Otwórz n8n: https://dlamedica.app.n8n.cloud
2. Przejdź do **Settings** → **Credentials**
3. Kliknij **Add Credential**
4. Wybierz typ: **Header Auth**
5. Wypełnij:
   - **Name**: `DlaMedica API Key`
   - **Name** (header name): `X-API-Key`
   - **Value**: `dlamedica-n8n-key-2025`
6. Zapisz credential

## Krok 2: Dodaj HTTP Request Nodes

### Node 1: Pobierz Subskrybentów

1. W workflow "📧 DlaMedica Newsletter" dodaj nowy node **HTTP Request**
2. Konfiguracja:
   - **Name**: `📋 Pobierz Subskrybentów`
   - **Method**: GET
   - **URL**: `https://dlamedica.pl/api/newsletter/subscribers`
   - **Authentication**: Generic Credential Type → Header Auth
   - **Credential**: wybierz "DlaMedica API Key"
   - **Query Parameters**:
     - Name: `limit`, Value: `1000`

### Node 2: Pobierz Treści

1. Dodaj kolejny node **HTTP Request**
2. Konfiguracja:
   - **Name**: `📰 Pobierz Treści`
   - **Method**: GET
   - **URL**: `https://dlamedica.pl/api/newsletter/content`
   - **Authentication**: Generic Credential Type → Header Auth
   - **Credential**: wybierz "DlaMedica API Key"
   - **Query Parameters**:
     - Name: `limit`, Value: `10`

### Node 3: Merge (Połącz Dane)

1. Dodaj node **Merge**
2. Połącz wyjście "Pobierz Subskrybentów" do Input 1
3. Połącz wyjście "Pobierz Treści" do Input 2
4. Mode: **Combine** → **Combine All**

### Node 4: Webhook (Raportowanie)

1. Dodaj node **HTTP Request**
2. Konfiguracja:
   - **Name**: `📤 Wyślij Webhook`
   - **Method**: POST
   - **URL**: `https://dlamedica.pl/api/newsletter/webhook`
   - **Authentication**: Generic Credential Type → Header Auth
   - **Credential**: wybierz "DlaMedica API Key"
   - **Body Content Type**: JSON
   - **Body Parameters**:
     - `event`: `email_sent`
     - `email`: `{{ $json.email }}`
     - `campaign_id`: `newsletter-{{ $now.format('yyyy-MM-dd') }}`
     - `timestamp`: `{{ $now.toISO() }}`

## Krok 3: Połączenie z istniejącym workflow

Połącz nowe nody z istniejącym flow:

```
[Schedule Trigger]
        ↓
    [Router]
        ↓
    [send_check]
        ↓
┌───────────────────────┐
│ 📋 Pobierz Subskrybentów │──┐
└───────────────────────┘   │
                            ├──→ [🔗 Merge] → [Qwen Email Generator] → [📤 Wyślij Webhook]
┌───────────────────────┐   │
│ 📰 Pobierz Treści       │──┘
└───────────────────────┘
```

## Krok 4: Dostosuj Qwen Email Generator

Zaktualizuj prompt w Email Generator, aby używał danych z DlaMedica:

```
Dostępne dane:
- Subskrybenci: {{ $json.subscribers }}
- Artykuły: {{ $json.articles }}
- Typ kampanii: {{ $json.campaignType }}

Wygeneruj email używając rzeczywistych artykułów z dlamedica.pl
```

## API Endpoints Reference

| Endpoint | Method | Opis |
|----------|--------|------|
| `/api/newsletter/subscribers` | GET | Lista aktywnych subskrybentów |
| `/api/newsletter/content` | GET | Najnowsze artykuły |
| `/api/newsletter/webhook` | POST | Raportowanie wysłanych emaili |

## Testowanie

1. Dodaj testowego subskrybenta: POST `/api/newsletter/subscribe` z body `{"email":"test@example.com"}`
2. Uruchom workflow manualnie
3. Sprawdź logi w n8n czy dane są poprawnie pobierane

## Troubleshooting

- **401 Unauthorized**: Sprawdź czy header `X-API-Key` jest poprawny
- **404 Not Found**: Upewnij się, że backend działa na dlamedica.pl
- **Brak danych**: Dodaj dane testowe przez MCP lub bezpośrednio do bazy
