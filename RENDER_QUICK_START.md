# 🚀 Quick Start - Render Deployment

Szybki przewodnik wdrożenia na Render w 5 krokach.

## Krok 1: Przygotuj repozytorium

```bash
git add .
git commit -m "Ready for Render"
git push origin main
```

## Krok 2: Utwórz PostgreSQL Database

1. Render Dashboard → **New +** → **PostgreSQL**
2. Name: `posprzataj-db`
3. Plan: **Starter** (darmowy)
4. Kliknij **Create**
5. **Zapisz Internal Database URL**

## Krok 3: Utwórz Backend (Web Service)

1. Render Dashboard → **New +** → **Web Service**
2. Połącz repozytorium
3. Ustawienia:
   - **Name:** `posprzataj-backend`
   - **Build Command:** `npm install && npm run build:backend && npx prisma generate && npx prisma migrate deploy`
   - **Start Command:** `npm run start:prod`

4. **Environment Variables:**
   ```
   NODE_ENV=production
   DATABASE_URL=<internal-database-url>
   JWT_SECRET=<wygeneruj-klucz-32-znaki>
   JWT_EXPIRES_IN=7d
   PORT=10000
   CORS_ORIGIN=https://posprzataj-frontend.onrender.com
   MAX_FILE_SIZE=10485760
   UPLOAD_DIR=./uploads
   PUBLIC_UPLOAD_URL=/uploads
   ```

5. Kliknij **Create Web Service**

## Krok 4: Utwórz Frontend (Static Site)

1. Render Dashboard → **New +** → **Static Site**
2. Połącz repozytorium
3. Ustawienia:
   - **Name:** `posprzataj-frontend`
   - **Build Command:** `npm install && npm run build:frontend`
   - **Publish Directory:** `dist`

4. **Environment Variable:**
   ```
   VITE_API_URL=https://posprzataj-backend.onrender.com/api
   ```

5. Kliknij **Create Static Site**

## Krok 5: Zaktualizuj CORS

1. W backend service → **Environment**
2. Zaktualizuj `CORS_ORIGIN` na URL frontendu
3. **Save Changes**

## ✅ Gotowe!

- Frontend: `https://posprzataj-frontend.onrender.com`
- Backend: `https://posprzataj-backend.onrender.com`

**Domyślne konto:**
- Lokal: `ADMIN`
- Hasło: `admin123`

⚠️ **Zmień hasło po pierwszym logowaniu!**

## 🔧 Generowanie JWT_SECRET

```bash
# Linux/Mac
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

## 📝 Ważne

- Render automatycznie ustawia `PORT` - nie musisz go zmieniać
- Używaj **Internal Database URL** (nie publicznego)
- Backend może "zasnąć" po 15 min bezczynności (darmowy plan)
- Pierwsze uruchomienie może trwać ~30 sekund

## 🐛 Problemy?

Zobacz pełny przewodnik w `RENDER.md`
