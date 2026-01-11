# Deployment na Render - Instrukcja

Ten przewodnik przeprowadzi Cię przez proces wdrożenia aplikacji posprzataj.se na platformie Render.

## 📋 Wymagania

- Konto na Render.com (darmowe konto wystarczy)
- Repozytorium GitHub/GitLab/Bitbucket z kodem

## 🚀 Krok po kroku

### 1. Przygotowanie repozytorium

Upewnij się, że wszystkie zmiany są w repozytorium:
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Utworzenie bazy danych PostgreSQL

1. Zaloguj się do [Render Dashboard](https://dashboard.render.com)
2. Kliknij **"New +"** → **"PostgreSQL"**
3. Skonfiguruj:
   - **Name:** `posprzataj-db`
   - **Database:** `posprzataj_se`
   - **User:** `posprzataj`
   - **Region:** `Frankfurt` (lub najbliższy)
   - **Plan:** `Starter` (darmowy)
4. Kliknij **"Create Database"**
5. **Zapisz Connection String** - będzie potrzebny później

### 3. Utworzenie Web Service (Backend)

1. W Render Dashboard kliknij **"New +"** → **"Web Service"**
2. Połącz swoje repozytorium GitHub/GitLab
3. Wybierz repozytorium z projektem
4. Skonfiguruj:
   - **Name:** `posprzataj-backend`
   - **Region:** `Frankfurt` (ten sam co baza danych)
   - **Branch:** `main`
   - **Root Directory:** (zostaw puste)
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build:backend && npx prisma generate`
   - **Start Command:** `npm run start:prod`

5. **Zmienne środowiskowe:**
   Kliknij **"Advanced"** → **"Add Environment Variable"** i dodaj:
   ```
   NODE_ENV=production
   DATABASE_URL=<connection-string-z-bazy-danych>
   JWT_SECRET=<wygeneruj-silny-klucz-minimum-32-znaki>
   JWT_EXPIRES_IN=7d
   PORT=10000
   CORS_ORIGIN=https://posprzataj-frontend.onrender.com
   MAX_FILE_SIZE=10485760
   UPLOAD_DIR=./uploads
   PUBLIC_UPLOAD_URL=/uploads
   ```

   **Ważne:**
   - `DATABASE_URL` - skopiuj z bazy danych (Internal Database URL)
   - `JWT_SECRET` - wygeneruj silny klucz (np. użyj: `openssl rand -base64 32`)
   - `CORS_ORIGIN` - zaktualizuj po utworzeniu frontendu

6. Kliknij **"Create Web Service"**

### 4. Uruchomienie migracji bazy danych

Po pierwszym deploy backendu:

1. Przejdź do **"Shell"** w Render Dashboard dla backendu
2. Uruchom:
```bash
npx prisma migrate deploy
```

Lub dodaj to do build command:
```bash
npm install && npm run build:backend && npx prisma generate && npx prisma migrate deploy
```

### 5. Utworzenie Static Site (Frontend)

1. W Render Dashboard kliknij **"New +"** → **"Static Site"**
2. Połącz repozytorium
3. Skonfiguruj:
   - **Name:** `posprzataj-frontend`
   - **Branch:** `main`
   - **Root Directory:** (zostaw puste)
   - **Build Command:** `npm install && npm run build:frontend`
   - **Publish Directory:** `dist`

4. **Zmienne środowiskowe:**
   ```
   VITE_API_URL=https://posprzataj-backend.onrender.com/api
   ```

   **Ważne:** Zaktualizuj URL backendu na rzeczywisty URL z Render

5. Kliknij **"Create Static Site"**

### 6. Aktualizacja CORS w backendzie

Po utworzeniu frontendu, zaktualizuj `CORS_ORIGIN` w backendzie:
1. Przejdź do **Environment** w backend service
2. Zaktualizuj `CORS_ORIGIN` na URL frontendu:
   ```
   CORS_ORIGIN=https://posprzataj-frontend.onrender.com
   ```
3. Kliknij **"Save Changes"** - backend się zrestartuje

### 7. Konfiguracja domeny (opcjonalnie)

Jeśli masz domenę `posprzataj.se`:

1. **Backend:**
   - Przejdź do backend service
   - Kliknij **"Settings"** → **"Custom Domain"**
   - Dodaj: `api.posprzataj.se`
   - Skonfiguruj DNS zgodnie z instrukcjami

2. **Frontend:**
   - Przejdź do frontend service
   - Kliknij **"Settings"** → **"Custom Domain"**
   - Dodaj: `posprzataj.se` i `www.posprzataj.se`
   - Skonfiguruj DNS

3. **Zaktualizuj zmienne środowiskowe:**
   - Backend: `CORS_ORIGIN=https://posprzataj.se`
   - Frontend: `VITE_API_URL=https://api.posprzataj.se/api`

## 🔧 Alternatywa: Użycie render.yaml

Jeśli wolisz automatyczną konfigurację:

1. Plik `render.yaml` jest już w repozytorium
2. W Render Dashboard kliknij **"New +"** → **"Blueprint"**
3. Połącz repozytorium
4. Render automatycznie wykryje `render.yaml` i utworzy wszystkie serwisy

**Uwaga:** Musisz ręcznie wygenerować `JWT_SECRET` i dodać go do zmiennych środowiskowych.

## 📝 Ważne uwagi

### Port
Render automatycznie ustawia zmienną `PORT`. Upewnij się, że backend używa:
```typescript
const PORT = process.env.PORT || 5000;
```

### Upload plików
Render ma ograniczenia dotyczące systemu plików. Rozważ:
- Użycie zewnętrznego storage (AWS S3, Cloudinary)
- Lub użycie Render Disk (płatne)

### Health Check
Backend ma endpoint `/api/health` - Render użyje go do monitorowania.

### Logi
Sprawdzaj logi w Render Dashboard:
- **Backend:** "Logs" w web service
- **Frontend:** "Logs" w static site

## 🐛 Troubleshooting

### Problem: Baza danych nie łączy się
- Sprawdź czy używasz **Internal Database URL** (nie publicznego)
- Sprawdź czy baza danych jest w tym samym regionie co backend

### Problem: CORS errors
- Sprawdź czy `CORS_ORIGIN` w backendzie ma poprawny URL frontendu
- Upewnij się, że URL ma `https://` (nie `http://`)

### Problem: Build fails
- Sprawdź logi build w Render Dashboard
- Upewnij się, że wszystkie zależności są w `package.json`
- Sprawdź czy `prisma generate` jest w build command

### Problem: Migracje nie działają
- Uruchom ręcznie w Shell: `npx prisma migrate deploy`
- Sprawdź czy `DATABASE_URL` jest poprawny

## 🔒 Bezpieczeństwo

1. **Zmień hasło administratora:**
   - Zaloguj się do aplikacji
   - Użyj domyślnego konta: `ADMIN` / `admin123`
   - Zmień hasło w panelu zarządzania

2. **JWT_SECRET:**
   - Użyj silnego, losowego klucza
   - Nie commituj go do repozytorium
   - Możesz wygenerować: `openssl rand -base64 32`

3. **Database:**
   - Render automatycznie tworzy bezpieczne hasła
   - Nie udostępniaj Internal Database URL publicznie

## 📊 Monitoring

Render automatycznie monitoruje:
- Health checks (endpoint `/api/health`)
- Uptime
- Logi aplikacji

Możesz ustawić alerty w ustawieniach serwisu.

## 💰 Koszty

**Darmowy plan Render:**
- ✅ Web Service (backend) - darmowy (z ograniczeniami)
- ✅ Static Site (frontend) - darmowy
- ✅ PostgreSQL - darmowy (do 90 dni, potem płatne)

**Ograniczenia darmowego planu:**
- Backend śpi po 15 minutach bezczynności
- Pierwsze uruchomienie może trwać ~30 sekund
- Ograniczona ilość zasobów

**Dla produkcji rozważ:**
- Starter plan ($7/miesiąc) - backend nie śpi
- Większa baza danych jeśli potrzebujesz

## ✅ Checklist przed wdrożeniem

- [ ] Kod jest w repozytorium Git
- [ ] Utworzona baza danych PostgreSQL
- [ ] Backend service utworzony z poprawnymi zmiennymi
- [ ] Migracje bazy danych uruchomione
- [ ] Frontend service utworzony
- [ ] CORS_ORIGIN zaktualizowany
- [ ] JWT_SECRET wygenerowany i ustawiony
- [ ] Domyślne hasło administratora zmienione
- [ ] Test aplikacji na Render

## 🎉 Gotowe!

Po wykonaniu wszystkich kroków, aplikacja powinna być dostępna pod adresem:
- Frontend: `https://posprzataj-frontend.onrender.com`
- Backend: `https://posprzataj-backend.onrender.com`

Lub pod własną domeną jeśli skonfigurowałeś custom domain.
