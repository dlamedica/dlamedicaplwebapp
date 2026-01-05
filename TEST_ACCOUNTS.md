# 🔐 Konta Testowe DlaMedica

## 📋 Dane Logowania

Oto konta testowe stworzone do testowania aplikacji z perspektywy zalogowanego użytkownika:

### 👨‍💼 **Administrator**
- **Email**: `admin@dlamedica.pl`
- **Hasło**: `Admin123!`
- **Rola**: Administrator systemu
- **Dostęp**: Pełny dostęp do wszystkich funkcji

### 🏥 **Lekarz**
- **Email**: `lekarz@dlamedica.pl`
- **Hasło**: `Lekarz123!`
- **Rola**: Dr Jan Kowalski - Kardiolog
- **Dostęp**: Rozszerzone funkcje medyczne

### 🎓 **Student Medycyny**
- **Email**: `student@dlamedica.pl`
- **Hasło**: `Student123!`
- **Rola**: Anna Wiśniewska - Student IV roku
- **Dostęp**: Podstawowe funkcje edukacyjne

### 🏢 **Firma/Pracodawca**
- **Email**: `firma@dlamedica.pl`
- **Hasło**: `Firma123!`
- **Rola**: MedTech Solutions
- **Dostęp**: Publikowanie ofert pracy

## 🚀 Jak używać

1. **Logowanie**: Idź na stronę `/login` i użyj jednego z powyższych kont
2. **Testowanie**: Sprawdź różne funkcje w zależności od roli użytkownika
3. **Porównanie**: Zaloguj się na różne konta, aby zobaczyć różnice w interfejsie

## 👀 Co sprawdzić po zalogowaniu

### Dla wszystkich kont:
- ✅ Menu użytkownika w headerze (avatar/nazwa)
- ✅ Dropdown z opcjami "Profil" i "Wyloguj się"
- ✅ Zmiana zawartości stron w zależności od uprawnień

### Dla Administratora:
- ✅ Dostęp do panelu administracyjnego
- ✅ Zarządzanie użytkownikami
- ✅ Pełny dostęp do wszystkich sekcji

### Dla Lekarza:
- ✅ Rozszerzone opcje w kalkulatorach medycznych
- ✅ Możliwość zapisywania wyników
- ✅ Dostęp do historii obliczeń

### Dla Studenta:
- ✅ Podstawowy dostęp do materiałów edukacyjnych
- ✅ Ograniczone funkcje premium
- ✅ Progres nauki i ulubione

### Dla Firmy:
- ✅ Panel pracodawcy
- ✅ Publikowanie ofert pracy
- ✅ Zarządzanie ogłoszeniami

## ⚠️ Ważne

- Te konta są **tylko do testowania** w trybie development
- **Nie używaj** ich w wersji produkcyjnej
- Profile użytkowników mogą nie być w pełni skonfigurowane (tabela users_profiles może nie istnieć)

## 🔄 Reset haseł

Jeśli potrzebujesz zresetować hasła, użyj funkcji "Zapomniałem hasła" na stronie logowania.

---
**Wygenerowane automatycznie przez skrypt `scripts/create-test-accounts.ts`**