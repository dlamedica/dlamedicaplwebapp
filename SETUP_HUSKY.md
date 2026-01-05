# 🐕 Setup Husky - Pre-commit Hooks

## Instalacja

### 1. Zainstaluj zależności
```bash
npm install --save-dev husky lint-staged prettier
```

### 2. Zainicjalizuj Husky
```bash
npm run prepare
```

To automatycznie:
- Utworzy folder `.husky/`
- Skonfiguruje Git hooks
- Ustawi uprawnienia dla skryptów

### 3. Sprawdź czy działa
```bash
# Utwórz test commit
git add .
git commit -m "test: verify husky setup"

# Powinieneś zobaczyć:
# 🔍 Running pre-commit checks...
# 📝 Running ESLint...
# 🔷 Running TypeScript type check...
# 🧪 Running tests...
# ✅ Pre-commit checks passed!
```

## Co się dzieje przy commit?

### Automatycznie przed każdym commit:
1. **ESLint** - sprawdza kod pod kątem błędów
2. **TypeScript** - sprawdza typy
3. **Tests** - uruchamia testy
4. **Prettier** (przez lint-staged) - formatuje staged pliki

### Jeśli któryś check się nie powiedzie:
- Commit zostanie **zablokowany**
- Zobaczysz szczegóły błędu
- Napraw błędy i spróbuj ponownie

## Konfiguracja

### `.husky/pre-commit`
Skrypt uruchamiany przed commit. Możesz go edytować aby:
- Dodać więcej checks
- Zmienić kolejność
- Dodać custom walidacje

### `.lintstagedrc.js`
Konfiguracja lint-staged - które pliki i jakie komendy:
- `*.{ts,tsx,js,jsx}` → ESLint + Prettier
- `*.{json,css,scss,md}` → Prettier
- `*.{ts,tsx}` → TypeScript check

### `.prettierrc.json`
Konfiguracja Prettier - formatowanie kodu.

## Wyłączenie (tymczasowo)

Jeśli musisz zrobić commit bez checks (nie zalecane):

```bash
git commit --no-verify -m "your message"
```

⚠️ **Uwaga**: Używaj tylko w wyjątkowych sytuacjach!

## Troubleshooting

### Problem: "husky: command not found"
```bash
npm run prepare
```

### Problem: "Permission denied"
```bash
chmod +x .husky/pre-commit
```

### Problem: "Husky is not installed"
```bash
npm install --save-dev husky
npm run prepare
```

### Problem: Checks są zbyt wolne
Edytuj `.husky/pre-commit` i usuń niepotrzebne checks lub użyj `--no-verify` dla szybkich fixów.

## Best Practices

1. **Zawsze commituj z checks** - zapewnia jakość kodu
2. **Napraw błędy przed commit** - nie używaj `--no-verify`
3. **Aktualizuj checks** - dodawaj nowe gdy potrzebne
4. **Szybkie fixy** - używaj `lint-staged` dla staged files tylko

---

*Setup completed by Senior Specialist*

