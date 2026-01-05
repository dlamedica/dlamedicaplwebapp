# 🏥 DlaMedica.pl - Aplikacja Webowa

Platforma edukacyjna i narzędziowa dla profesjonalistów medycznych w Polsce.

## 📋 Spis Treści

- [O Projekcie](#o-projekcie)
- [Funkcjonalności](#funkcjonalności)
- [Wymagania](#wymagania)
- [Instalacja](#instalacja)
- [Konfiguracja](#konfiguracja)
- [Uruchomienie](#uruchomienie)
- [Struktura Projektu](#struktura-projektu)
- [Skrypty](#skrypty)
- [Technologie](#technologie)
- [Rozwój](#rozwój)
- [Licencja](#licencja)

## 🎯 O Projekcie

DlaMedica.pl to kompleksowa platforma dla profesjonalistów medycznych oferująca:

- 📚 **Platformę edukacyjną** - materiały dydaktyczne, przedmioty przedkliniczne i kliniczne
- 🧮 **Kalkulatory medyczne** - narzędzia do obliczeń medycznych (ASA, Bristol, GDS, Killip, i wiele innych)
- 💊 **Bazę leków** - wyszukiwarka leków z informacjami o refundacji
- 📖 **ICD-11** - wyszukiwarka kodów klasyfikacji medycznej
- 🛒 **Sklep** - ebooki medyczne i materiały edukacyjne
- 💼 **Oferty pracy** - tablica ogłoszeń dla profesjonalistów medycznych
- 🎓 **Uczelnie** - baza uczelni medycznych w Polsce
- 📅 **Wydarzenia** - konferencje, webinary i szkolenia
- 🎮 **Gamifikacja** - system osiągnięć i punktów

## ✨ Funkcjonalności

### Dla Użytkowników
- Rejestracja i logowanie (JWT Auth)
- Profil użytkownika z możliwością edycji
- System ulubionych i zakładek
- Historia zamówień i zakupów
- Panel edukacyjny z postępem nauki
- System powiadomień

### Dla Administratorów
- Panel administracyjny z pełnym dostępem
- Zarządzanie użytkownikami
- Moderacja ofert pracy i wydarzeń
- Import danych (leki, kalkulatory, etc.)
- Statystyki i raporty

### Dla Firm/Pracodawców
- Panel pracodawcy
- Publikowanie ofert pracy
- Zarządzanie ogłoszeniami
- Statystyki aplikacji

## 🔧 Wymagania

- **Node.js** >= 18.x
- **npm** >= 9.x lub **yarn** >= 1.22.x
- **PostgreSQL** >= 14.x (lokalna baza danych)
- **Konto Google Cloud** (opcjonalnie, dla Google Translate API)

## 📦 Instalacja

1. **Sklonuj repozytorium**
```bash
git clone https://github.com/your-username/dlamedica-webapp.git
cd dlamedica-webapp
```

2. **Zainstaluj zależności**
```bash
npm install
```

3. **Skonfiguruj zmienne środowiskowe**
```bash
cp .env.example .env.local
```

4. **Edytuj `.env.local`** i uzupełnij wymagane zmienne (patrz [Konfiguracja](#konfiguracja))

## ⚙️ Konfiguracja

### Wymagane zmienne środowiskowe

Utwórz plik `.env.local` w głównym katalogu projektu (frontend):

```env
# API URL (WYMAGANE)
VITE_API_URL=http://localhost:3001/api
```

Utwórz plik `.env` w katalogu `backend/`:

```env
# PostgreSQL Database (WYMAGANE)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dlamedica_db
DB_USER=dlamedica
DB_PASSWORD=your_password

# JWT Secret (WYMAGANE, min. 32 znaki)
JWT_SECRET=your_jwt_secret_key_minimum_32_characters

# Server
PORT=3001
NODE_ENV=development
```

### Opcjonalne zmienne środowiskowe

```env
# Google Translate API (dla tłumaczeń ICD-11)
VITE_GOOGLE_TRANSLATE_PROJECT_ID=your-project-id
VITE_GOOGLE_TRANSLATE_API_KEY=your-api-key

# Google Drive API (dla materiałów edukacyjnych)
VITE_GOOGLE_DRIVE_API_KEY=your-api-key
VITE_EDU_MATERIALS_FOLDER_ID=your-folder-id

# IconScout API (dla ikon)
VITE_ICONSCOUT_CLIENT_ID=your-client-id
VITE_ICONSCOUT_API_KEY=your-api-key

# WordPress CMS (opcjonalnie)
VITE_CMS_BASE_URL=https://cms.dlamedica.pl/wp-json/wp/v2
VITE_SHOP_BASE_URL=https://sklep.dlamedica.pl/wp-json/wc/v3
VITE_ENABLE_CMS=false

# reCAPTCHA (dla formularzy)
VITE_RECAPTCHA_SITE_KEY=your-site-key

# Tryb demo (opcjonalnie)
VITE_DEMO_MODE=false
VITE_USE_MOCK_DATA=false
```

### Jak uzyskać klucze API?

#### PostgreSQL
1. Zainstaluj PostgreSQL na serwerze
2. Utwórz bazę danych: `CREATE DATABASE dlamedica_db;`
3. Utwórz użytkownika: `CREATE USER dlamedica WITH PASSWORD 'your_password';`
4. Nadaj uprawnienia: `GRANT ALL PRIVILEGES ON DATABASE dlamedica_db TO dlamedica;`
5. Uruchom migracje: `cd backend && npx prisma migrate deploy`

#### Google Cloud
1. Utwórz projekt w [Google Cloud Console](https://console.cloud.google.com)
2. Włącz **Google Translate API** i/lub **Google Drive API**
3. Utwórz klucz API w **Credentials**
4. Skopiuj klucz do odpowiedniej zmiennej

## 🚀 Uruchomienie

### Tryb deweloperski
```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem: `http://localhost:5173`

### Build produkcyjny
```bash
npm run build
```

Zbudowane pliki znajdziesz w katalogu `dist/`

### Podgląd builda
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## 📁 Struktura Projektu

```
dlamedica-webapp/
├── src/
│   ├── components/          # Komponenty React
│   │   ├── auth/            # Komponenty autoryzacji
│   │   ├── education/       # Komponenty edukacyjne
│   │   ├── pages/           # Strony aplikacji
│   │   ├── shop/            # Komponenty sklepu
│   │   └── ...
│   ├── contexts/            # React Contexts
│   ├── hooks/                # Custom hooks
│   ├── lib/                  # Biblioteki i utilities
│   ├── services/            # Serwisy API
│   ├── types/               # Definicje TypeScript
│   ├── utils/               # Funkcje pomocnicze
│   ├── App.tsx              # Główny komponent
│   └── main.tsx             # Entry point
├── public/                   # Pliki statyczne
├── scripts/                  # Skrypty pomocnicze
├── backend/                  # Backend API (Node.js)
├── .env.local               # Zmienne środowiskowe (nie commituj!)
├── .env.example             # Przykładowe zmienne
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 📜 Skrypty

### Podstawowe
- `npm run dev` - Uruchom serwer deweloperski
- `npm run build` - Zbuduj aplikację produkcyjną
- `npm run preview` - Podgląd builda produkcyjnego
- `npm run lint` - Uruchom ESLint

### Seedowanie danych
- `npm run seed:all` - Zasiej wszystkie dane (oferty pracy, kalkulatory, etc.)
- `npm run seed:jobs` - Zasiej tylko oferty pracy
- `npm run seed:accounts` - Utwórz konta testowe
- `npm run seed:calculators` - Zasiej kalkulatory medyczne
- `npm run seed:master` - Master script do seedowania wszystkiego

## 🛠️ Technologie

### Frontend
- **React 18** - Biblioteka UI
- **TypeScript** - Typowanie statyczne
- **Vite** - Build tool i dev server
- **Tailwind CSS** - Framework CSS
- **React Router DOM** - Routing (zainstalowany, ale nieużywany - własny system)
- **Lucide React** - Ikony
- **React Icons** - Dodatkowe ikony

### Backend & Baza Danych
- **Node.js + Express** - Backend API
- **PostgreSQL** - Baza danych
- **Prisma ORM** - Zarządzanie schematem
- **JWT** - Autoryzacja

### Narzędzia
- **ESLint** - Linter
- **PostCSS** - Przetwarzanie CSS
- **Autoprefixer** - Automatyczne prefiksy CSS

### Integracje
- **Google Translate API** - Tłumaczenia
- **Google Drive API** - Materiały edukacyjne
- **WordPress REST API** - CMS i sklep
- **WHO ICD API** - Kody klasyfikacji medycznej

## 🔐 Bezpieczeństwo

⚠️ **WAŻNE**: Nigdy nie commituj pliku `.env.local` do repozytorium!

- Wszystkie klucze API powinny być przechowywane w zmiennych środowiskowych
- Używaj `.env.local` dla lokalnego developmentu
- W produkcji ustaw zmienne środowiskowe w panelu hostingowym
- `JWT_SECRET` powinien mieć minimum 32 znaki

## 🧪 Testowanie

### Konta testowe

Po uruchomieniu `npm run seed:accounts`, dostępne są następujące konta:

- **Administrator**: `admin@dlamedica.pl` / `Admin123!`
- **Lekarz**: `lekarz@dlamedica.pl` / `Lekarz123!`
- **Student**: `student@dlamedica.pl` / `Student123!`
- **Firma**: `firma@dlamedica.pl` / `Firma123!`

## 🐛 Rozwiązywanie Problemów

### Problem: "Cannot connect to database"
- Sprawdź czy PostgreSQL jest uruchomiony
- Sprawdź zmienne DB_* w pliku `.env` backendu
- Upewnij się, że użytkownik ma uprawnienia do bazy

### Problem: "Module not found"
- Uruchom `npm install` ponownie
- Sprawdź czy wszystkie zależności są zainstalowane

### Problem: Błędy TypeScript
- Sprawdź `tsconfig.json`
- Uruchom `npm run lint` aby zobaczyć szczegóły błędów

## 📚 Dokumentacja Dodatkowa

- [Panel administracyjny](./docs/PANEL_ADMIN.md)
- [Schemat bazy danych](./prisma/schema.prisma)

## 🤝 Wsparcie

W razie problemów:
1. Sprawdź dokumentację w folderze projektu
2. Przejrzyj istniejące issues na GitHubie
3. Utwórz nowy issue z opisem problemu

## 📝 Licencja

[Określ licencję projektu]

## 👥 Autorzy

- [Lista autorów/kontrybutorów]

---

**Wersja**: 1.0.0  
**Ostatnia aktualizacja**: 2024

