# 🚀 Deployment na Render - Szybki Start

## Opcja 1: Automatyczna konfiguracja (Blueprint)

1. **Przygotuj repozytorium:**
   ```bash
   git add .
   git commit -m "Ready for Render"
   git push origin main
   ```

2. **W Render Dashboard:**
   - Kliknij **"New +"** → **"Blueprint"**
   - Połącz repozytorium GitHub/GitLab
   - Render automatycznie wykryje `render.yaml`

3. **Skonfiguruj zmienne:**
   - Wygeneruj `JWT_SECRET`: `openssl rand -base64 32`
   - Dodaj do backend service w Environment Variables

4. **Gotowe!** Render utworzy wszystkie serwisy automatycznie.

## Opcja 2: Ręczna konfiguracja

Zobacz szczegółowy przewodnik w `RENDER.md` lub szybki start w `RENDER_QUICK_START.md`.

## ⚡ Najważniejsze kroki:

1. ✅ Utwórz PostgreSQL Database
2. ✅ Utwórz Web Service (backend)
3. ✅ Utwórz Static Site (frontend)
4. ✅ Ustaw zmienne środowiskowe
5. ✅ Zaktualizuj CORS_ORIGIN

## 📝 Wymagane zmienne środowiskowe:

### Backend:
- `DATABASE_URL` - z bazy danych (Internal URL)
- `JWT_SECRET` - wygeneruj silny klucz
- `CORS_ORIGIN` - URL frontendu
- `PORT` - Render ustawia automatycznie

### Frontend:
- `VITE_API_URL` - URL backendu + `/api`

## 🔗 Linki:

- [Pełny przewodnik](RENDER.md)
- [Quick Start](RENDER_QUICK_START.md)
