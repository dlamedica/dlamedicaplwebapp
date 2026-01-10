# Instrukcja podłączenia Claude Code do VPS przez MCP

## Wprowadzenie

MCP (Model Context Protocol) pozwala Claude Code na bezpośredni dostęp do:
- Bazy danych PostgreSQL na VPS
- Zarządzania procesami PM2
- Wykonywania komend na serwerze
- Integracji z n8n (workflow automation)

## Architektura

```
┌─────────────────┐         ┌─────────────────────────────────┐
│   Claude Code   │  HTTP   │         VPS (OVH)               │
│   (lokalnie)    │ ──────► │  IP: 57.128.242.148             │
│                 │         │                                 │
│  MCP Client     │         │  ┌─────────────────────────┐   │
│                 │         │  │  MCP Server (port 9001) │   │
└─────────────────┘         │  │  - Express.js           │   │
                            │  │  - Token auth           │   │
                            │  └──────────┬──────────────┘   │
                            │             │                   │
                            │  ┌──────────▼──────────────┐   │
                            │  │  PostgreSQL (port 5432) │   │
                            │  │  PM2 Process Manager    │   │
                            │  │  n8n API                │   │
                            │  └─────────────────────────┘   │
                            └─────────────────────────────────┘
```

---

## Część 1: Konfiguracja VPS

### 1.1 Struktura plików MCP Server

```
~/dlamedicawebapp/mcp-server/
├── index.js          # Główny serwer MCP
├── package.json      # Zależności Node.js
├── .env              # Konfiguracja (hasła, klucze)
├── nginx-mcp.conf    # Opcjonalna konfiguracja nginx
└── README.md         # Dokumentacja
```

### 1.2 Instalacja MCP Server

```bash
# SSH do VPS
ssh ubuntu@57.128.242.148

# Przejdź do folderu MCP
cd ~/dlamedicawebapp/mcp-server

# Zainstaluj zależności
npm install
```

### 1.3 Konfiguracja .env

Utwórz plik `.env` w folderze `mcp-server`:

```bash
nano ~/dlamedicawebapp/mcp-server/.env
```

Zawartość:

```env
# ================================
# BAZA DANYCH POSTGRESQL
# ================================
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dlamedica_db
DB_USER=dlamedica
DB_PASSWORD=TWOJE_HASLO_DO_BAZY

# ================================
# MCP SERVER
# ================================
MCP_PORT=9001
MCP_SECRET=TWOJ_TAJNY_KLUCZ_MCP

# ================================
# n8n INTEGRATION (opcjonalne)
# ================================
N8N_URL=https://dlamedica.app.n8n.cloud
N8N_API_KEY=twoj_n8n_api_key
```

**WAŻNE:** Zmień `MCP_SECRET` na własny silny klucz (min. 32 znaki)!

### 1.4 Uruchomienie z PM2

```bash
# Uruchom MCP server
pm2 start index.js --name mcp-server

# Zapisz konfigurację PM2
pm2 save

# Włącz autostart przy restarcie VPS
pm2 startup
```

### 1.5 Otwórz port w firewall

```bash
sudo ufw allow 9001
sudo ufw reload
```

### 1.6 Weryfikacja

```bash
# Sprawdź czy serwer działa
curl http://localhost:9001/health

# Oczekiwany output:
# {"status":"ok","timestamp":"2025-01-10T..."}

# Sprawdź status PM2
pm2 status
```

---

## Część 2: Konfiguracja Claude Code (klient)

### 2.1 Lokalizacja pliku konfiguracyjnego

| System | Ścieżka |
|--------|---------|
| Linux | `~/.claude/claude_desktop_config.json` |
| macOS | `~/.claude/claude_desktop_config.json` |
| Windows | `%APPDATA%\Claude\claude_desktop_config.json` |

### 2.2 Plik konfiguracyjny

Utwórz/edytuj plik `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "dlamedica-vps": {
      "transport": {
        "type": "http",
        "url": "http://57.128.242.148:9001",
        "headers": {
          "X-MCP-Token": "TWOJ_TAJNY_KLUCZ_MCP"
        }
      }
    }
  }
}
```

### 2.3 Konfiguracja z wieloma serwerami

Jeśli masz wiele projektów/serwerów:

```json
{
  "mcpServers": {
    "dlamedica-vps": {
      "transport": {
        "type": "http",
        "url": "http://57.128.242.148:9001",
        "headers": {
          "X-MCP-Token": "klucz-dlamedica"
        }
      }
    },
    "inny-projekt": {
      "transport": {
        "type": "http",
        "url": "http://INNY_IP:9001",
        "headers": {
          "X-MCP-Token": "klucz-inny-projekt"
        }
      }
    }
  }
}
```

---

## Część 3: Dostępne narzędzia MCP

### 3.1 Narzędzia bazodanowe

| Narzędzie | Opis | Parametry |
|-----------|------|-----------|
| `query_database` | Wykonaj zapytanie SQL | `sql`, `params` (opcjonalne) |
| `list_tables` | Lista wszystkich tabel | - |
| `describe_table` | Struktura tabeli | `table_name` |

**Przykład użycia w Claude:**
```
Claude, użyj MCP aby wylistować wszystkie tabele w bazie danych.
Claude, wykonaj SQL: SELECT * FROM users LIMIT 10
```

### 3.2 Narzędzia PM2

| Narzędzie | Opis | Parametry |
|-----------|------|-----------|
| `pm2_status` | Status wszystkich procesów | - |
| `pm2_logs` | Logi procesu | `process_name`, `lines` |
| `pm2_restart` | Restart procesu | `process_name` |

**Przykład:**
```
Claude, pokaż status procesów PM2 na serwerze.
Claude, zrestartuj proces dlamedica-backend.
```

### 3.3 Narzędzia n8n

| Narzędzie | Opis | Parametry |
|-----------|------|-----------|
| `n8n_list_workflows` | Lista workflow | - |
| `n8n_get_workflow` | Szczegóły workflow | `workflow_id` |
| `n8n_activate_workflow` | Aktywuj/deaktywuj | `workflow_id`, `active` |
| `n8n_execute_workflow` | Uruchom workflow | `workflow_id`, `data` |

### 3.4 Narzędzia systemowe

| Narzędzie | Opis | Parametry |
|-----------|------|-----------|
| `run_command` | Wykonaj komendę bash | `command` |

**Dozwolone prefiksy komend:**
- `pm2 `, `ls `, `cat `, `head `, `tail `, `grep `
- `df `, `free `, `uptime`, `whoami`, `pwd`, `date`
- `npm `, `node `, `curl `

---

## Część 4: Bezpieczeństwo

### 4.1 Zabezpieczenia wbudowane

1. **Token autoryzacji** - każdy request wymaga `X-MCP-Token`
2. **Blokada destrukcyjnych SQL** - `DROP DATABASE`, `TRUNCATE`, `DELETE` bez `WHERE` są blokowane
3. **Whitelist komend** - tylko dozwolone komendy bash
4. **Timeout** - max 30 sekund na wykonanie komendy

### 4.2 Zalecenia

1. **Zmień domyślny secret** - nigdy nie używaj domyślnego klucza
2. **Użyj HTTPS** - skonfiguruj nginx z SSL (certbot)
3. **Ogranicz IP** - w UFW możesz ograniczyć dostęp do konkretnych IP:
   ```bash
   sudo ufw allow from TWOJE_IP to any port 9001
   ```

### 4.3 Konfiguracja HTTPS (opcjonalne, zalecane)

```bash
# Skopiuj konfigurację nginx
sudo cp ~/dlamedicawebapp/mcp-server/nginx-mcp.conf /etc/nginx/sites-available/mcp
sudo ln -s /etc/nginx/sites-available/mcp /etc/nginx/sites-enabled/

# Dodaj rekord DNS: mcp.dlamedica.pl → 57.128.242.148

# Wygeneruj certyfikat SSL
sudo certbot --nginx -d mcp.dlamedica.pl

# Zrestartuj nginx
sudo nginx -t && sudo systemctl reload nginx
```

Po konfiguracji zmień URL w Claude Code na:
```json
"url": "https://mcp.dlamedica.pl"
```

---

## Część 5: Rozwiązywanie problemów

### 5.1 MCP server nie startuje

```bash
# Sprawdź logi
pm2 logs mcp-server --lines 50

# Sprawdź czy port jest wolny
sudo lsof -i :9001

# Sprawdź zmienne środowiskowe
cat ~/dlamedicawebapp/mcp-server/.env
```

### 5.2 Błąd połączenia z bazą

```bash
# Sprawdź czy PostgreSQL działa
sudo systemctl status postgresql

# Przetestuj połączenie
psql -h localhost -U dlamedica -d dlamedica_db
```

### 5.3 Błąd 403 Unauthorized

- Sprawdź czy `X-MCP-Token` w Claude Code zgadza się z `MCP_SECRET` w `.env`
- Zrestartuj MCP server po zmianie `.env`: `pm2 restart mcp-server`

### 5.4 Connection refused

```bash
# Sprawdź czy firewall przepuszcza port
sudo ufw status

# Sprawdź czy serwer nasłuchuje
netstat -tlnp | grep 9001
```

---

## Część 6: Testowanie API

### 6.1 Testy z curl

```bash
# Health check (bez tokena)
curl http://57.128.242.148:9001/health

# Lista narzędzi
curl -H "X-MCP-Token: TWOJ_KLUCZ" \
     http://57.128.242.148:9001/tools

# Wykonaj narzędzie
curl -X POST \
     -H "X-MCP-Token: TWOJ_KLUCZ" \
     -H "Content-Type: application/json" \
     -d '{"tool": "list_tables"}' \
     http://57.128.242.148:9001/execute

# Zapytanie SQL
curl -X POST \
     -H "X-MCP-Token: TWOJ_KLUCZ" \
     -H "Content-Type: application/json" \
     -d '{"tool": "query_database", "parameters": {"sql": "SELECT COUNT(*) FROM users"}}' \
     http://57.128.242.148:9001/execute
```

### 6.2 Endpoint publiczny (dla WebFetch)

```
GET http://57.128.242.148:9001/public/execute?token=KLUCZ&tool=list_tables
GET http://57.128.242.148:9001/public/execute?token=KLUCZ&tool=pm2_status
```

---

## Część 7: Nowy projekt - szybki start

Aby podłączyć nowy projekt do Claude Code przez MCP:

### Krok 1: Skopiuj MCP server

```bash
# Na VPS
cp -r ~/dlamedicawebapp/mcp-server ~/nowy-projekt/mcp-server
cd ~/nowy-projekt/mcp-server

# Edytuj .env z nowymi danymi bazy
nano .env

# Zmień port jeśli potrzebujesz wielu serwerów MCP
# MCP_PORT=9002
```

### Krok 2: Uruchom z PM2

```bash
pm2 start index.js --name nowy-projekt-mcp
pm2 save
```

### Krok 3: Otwórz port

```bash
sudo ufw allow 9002  # jeśli używasz innego portu
```

### Krok 4: Dodaj do Claude Code

Dodaj nowy serwer do `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "dlamedica-vps": { ... },
    "nowy-projekt": {
      "transport": {
        "type": "http",
        "url": "http://57.128.242.148:9002",
        "headers": {
          "X-MCP-Token": "nowy-klucz"
        }
      }
    }
  }
}
```

---

## Podsumowanie

| Element | Wartość |
|---------|---------|
| IP VPS | `57.128.242.148` |
| Port MCP | `9001` |
| URL MCP | `http://57.128.242.148:9001` |
| Plik konfiguracyjny | `~/.claude/claude_desktop_config.json` |
| Token header | `X-MCP-Token` |

---

*Ostatnia aktualizacja: Styczeń 2025*
*Autor: Konfiguracja dla projektu DlaMedica*
