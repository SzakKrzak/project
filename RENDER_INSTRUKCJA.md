# 🚀 Instrukcja wdrożenia na Render - Krok po kroku

## ⚠️ WAŻNE: Najpierw utwórz bazę danych ręcznie!

Render nie obsługuje automatycznego tworzenia bazy danych przez Blueprint, więc musisz utworzyć ją ręcznie.

## Krok 1: Utwórz PostgreSQL Database

1. W Render Dashboard kliknij **"New +"** → **"PostgreSQL"**
2. Ustawienia:
   - **Name:** `posprzataj-db`
   - **Database:** `posprzataj_se`
   - **User:** `posprzataj`
   - **Region:** `Frankfurt` (lub najbliższy)
   - **Plan:** `Starter` (darmowy)
3. Kliknij **"Create Database"**
4. **Zapisz Internal Database URL** - będzie potrzebny w następnym kroku

## Krok 2: Utwórz serwisy przez Blueprint

1. **Wypchnij kod:**
   ```bash
   git add render.yaml
   git commit -m "Update render.yaml - remove database definition"
   git push origin main
   ```

2. **W Render Dashboard:**
   - Kliknij **"New +"** → **"Blueprint"**
   - Wybierz repozytorium
   - Kliknij **"Apply"**
   - Render utworzy Backend i Frontend

## Krok 3: Połącz bazę danych z backendem

1. Otwórz serwis **`posprzataj-backend`** w Dashboard
2. Przejdź do **"Environment"**
3. Znajdź zmienną **`DATABASE_URL`**
4. Kliknij **"Link Database"** i wybierz **`posprzataj-db`**
   
   **LUB** wklej ręcznie Internal Database URL z Kroku 1

5. Kliknij **"Save Changes"**

## Krok 4: Wygeneruj i dodaj JWT_SECRET

1. Wygeneruj klucz:
   ```bash
   # Linux/Mac
   openssl rand -base64 32
   
   # Windows PowerShell
   [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
   ```

2. W serwisie **`posprzataj-backend`** → **"Environment"**
3. Znajdź **`JWT_SECRET`** (może być już wygenerowany przez Render)
4. Jeśli nie ma, kliknij **"Add Environment Variable"**:
   - Key: `JWT_SECRET`
   - Value: (wklej wygenerowany klucz)
5. Kliknij **"Save Changes"**

## Krok 5: Zaktualizuj CORS_ORIGIN

1. W serwisie **`posprzataj-backend`** → **"Environment"**
2. Znajdź **`CORS_ORIGIN`**
3. Zaktualizuj na URL frontendu (po deploy):
   ```
   https://posprzataj-frontend.onrender.com
   ```
4. Kliknij **"Save Changes"**

## Krok 6: Sprawdź działanie

Po deploy (5-10 minut):

- **Frontend:** `https://posprzataj-frontend.onrender.com`
- **Backend:** `https://posprzataj-backend.onrender.com`
- **Health Check:** `https://posprzataj-backend.onrender.com/api/health`

**Domyślne konto:**
- Lokal: `ADMIN`
- Hasło: `admin123`

⚠️ **Zmień hasło po pierwszym logowaniu!**

## 🔧 Troubleshooting

### Problem: Backend nie łączy się z bazą danych
- Sprawdź czy `DATABASE_URL` jest ustawiony (Internal URL)
- Sprawdź czy baza danych jest w tym samym regionie co backend

### Problem: CORS errors
- Sprawdź czy `CORS_ORIGIN` ma poprawny URL frontendu
- Upewnij się, że URL ma `https://` (nie `http://`)

### Problem: Build fails
- Sprawdź logi w Render Dashboard
- Upewnij się, że wszystkie zależności są w `package.json`

## ✅ Checklist

- [ ] PostgreSQL Database utworzona ręcznie
- [ ] Internal Database URL zapisany
- [ ] Blueprint utworzony (Backend + Frontend)
- [ ] DATABASE_URL połączony z bazą danych
- [ ] JWT_SECRET wygenerowany i dodany
- [ ] CORS_ORIGIN zaktualizowany
- [ ] Aplikacja działa i można się zalogować
