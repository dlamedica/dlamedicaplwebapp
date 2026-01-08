# MCP Server dla DlaMedica

Serwer MCP dający Claude dostęp do bazy danych i systemu.

## Instalacja na VPS

```bash
cd /home/ubuntu/dlamedicawebapp/mcp-server
npm install
```

## Uruchomienie z PM2

```bash
pm2 start index.js --name mcp-server
pm2 save
```

## Konfiguracja

Serwer używa tego samego `.env` co backend. Opcjonalnie możesz dodać:

```env
MCP_PORT=9001
MCP_SECRET=twoj-tajny-klucz-mcp
```

## Endpointy

- `GET /health` - sprawdzenie statusu
- `GET /tools` - lista dostępnych narzędzi
- `POST /execute` - wykonanie narzędzia

## Autoryzacja

Wszystkie requesty (oprócz /health) wymagają headera:
```
X-MCP-Token: dlamedica-mcp-secret-2025
```

## Dostępne narzędzia

| Narzędzie | Opis |
|-----------|------|
| `query_database` | Wykonaj zapytanie SQL |
| `list_tables` | Lista tabel w bazie |
| `describe_table` | Struktura tabeli |
| `pm2_status` | Status procesów |
| `pm2_logs` | Logi procesu |
| `pm2_restart` | Restart procesu |
| `run_command` | Komenda bash (ograniczone) |

## Bezpieczeństwo

- Wymaga tokena autoryzacji
- Blokuje destrukcyjne SQL bez WHERE
- Ograniczona lista dozwolonych komend bash
- Timeout na wykonanie komend (30s)
