# posprzataj.se

System zarządzania zadaniami sprzątania - aplikacja webowa do organizacji i śledzenia zadań sprzątania w obiektach komercyjnych.

## 🚀 Funkcjonalności

- **Zarządzanie zadaniami sprzątania** - dodawanie, edycja, usuwanie zadań
- **Oznaczanie zadań jako wykonane** - z możliwością dodania zdjęcia
- **System powiadomień** - o terminach i wykonanych zadaniach
- **Historia wykonanych zadań** - śledzenie wszystkich ukończonych zadań
- **Panel zarządzania** - dla kierowników z pełnym dostępem
- **Filtrowanie i sortowanie** - według lokalizacji, częstotliwości, terminu
- **Oznaczanie zadań jako ważne** - priorytetyzacja zadań
- **Uwierzytelnianie użytkowników** - bezpieczny system logowania

## 🛠️ Technologie

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Lucide React (ikony)

### Backend
- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT (uwierzytelnianie)
- Multer (upload plików)
- bcryptjs (hashowanie haseł)

## 📋 Wymagania

- Node.js 20+
- PostgreSQL 16+
- npm lub yarn

## 🔧 Instalacja

### 1. Sklonuj repozytorium

```bash
git clone <repository-url>
cd project
```

### 2. Zainstaluj zależności

```bash
npm install
```

### 3. Skonfiguruj bazę danych

Utwórz plik `.env` w katalogu `server/` na podstawie `server/.env.example`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/posprzataj_se?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development
MAX_FILE_SIZE=10485760
UPLOAD_DIR="./uploads"
PUBLIC_UPLOAD_URL="/uploads"
CORS_ORIGIN="http://localhost:3000"
```

### 4. Utwórz bazę danych

```bash
# Utwórz bazę danych PostgreSQL
createdb posprzataj_se

# Uruchom migracje
npm run db:migrate
```

### 5. Uruchom aplikację

#### Development (frontend + backend)

```bash
npm run dev
```

#### Tylko frontend

```bash
npm run dev:frontend
```

#### Tylko backend

```bash
npm run dev:backend
```

Aplikacja będzie dostępna pod adresem:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🐳 Docker

### Uruchomienie z Docker Compose

```bash
docker-compose up -d
```

To uruchomi:
- PostgreSQL (port 5432)
- Backend API (port 5000)
- Frontend (port 3000)

### Build obrazów

```bash
# Backend
docker build -t posprzataj-backend .

# Frontend
docker build -f Dockerfile.frontend -t posprzataj-frontend .
```

## 📝 Domyślne konto administratora

Po pierwszym uruchomieniu zostanie utworzone domyślne konto administratora:
- **Numer lokalu:** ADMIN
- **Hasło:** admin123

⚠️ **WAŻNE:** Zmień hasło administratora w produkcji!

## 🔐 API Endpoints

### Autoryzacja
- `POST /api/auth/register` - Rejestracja użytkownika
- `POST /api/auth/login` - Logowanie
- `POST /api/auth/verify-manager` - Weryfikacja hasła kierownika
- `GET /api/auth/me` - Pobierz aktualnego użytkownika

### Zadania
- `GET /api/tasks` - Pobierz wszystkie zadania
- `GET /api/tasks/:id` - Pobierz pojedyncze zadanie
- `POST /api/tasks` - Utwórz zadanie (kierownik)
- `PUT /api/tasks/:id` - Aktualizuj zadanie (kierownik)
- `DELETE /api/tasks/:id` - Usuń zadanie (kierownik)
- `POST /api/tasks/:id/complete` - Oznacz zadanie jako wykonane
- `PATCH /api/tasks/:id/important` - Zmień status ważności (kierownik)

### Upload
- `POST /api/upload/image` - Prześlij zdjęcie

### Powiadomienia
- `GET /api/notifications` - Pobierz powiadomienia
- `PATCH /api/notifications/:id/read` - Oznacz jako przeczytane
- `PATCH /api/notifications/read-all` - Oznacz wszystkie jako przeczytane

## 🧪 Testy

```bash
npm test
```

## 📦 Build produkcyjny

```bash
# Build frontend i backend
npm run build

# Tylko frontend
npm run build:frontend

# Tylko backend
npm run build:backend
```

## 🚀 Deployment

### Opcja 1: Docker Compose (Rekomendowane)

1. Skonfiguruj zmienne środowiskowe w `docker-compose.yml`
2. Uruchom: `docker-compose up -d`

### Opcja 2: Manual

1. Zbuduj aplikację: `npm run build`
2. Uruchom migracje: `npm run db:migrate`
3. Uruchom serwer: `npm start:prod`

### Wymagane zmienne środowiskowe w produkcji

- `DATABASE_URL` - URL do bazy danych PostgreSQL
- `JWT_SECRET` - Sekretny klucz JWT (użyj silnego hasła)
- `NODE_ENV=production`
- `CORS_ORIGIN` - URL frontendu w produkcji

## 📁 Struktura projektu

```
project/
├── components/          # Komponenty React
├── server/              # Backend
│   ├── routes/          # Endpointy API
│   ├── middleware/      # Middleware (auth, error handling)
│   ├── utils/           # Narzędzia pomocnicze
│   └── prisma/          # Schema bazy danych
├── styles/              # Style CSS
├── types/               # Definicje TypeScript
├── utils/               # Narzędzia frontend
└── dist/                # Zbudowane pliki (generowane)
```

## 🤝 Wsparcie

W razie problemów, sprawdź:
1. Czy PostgreSQL jest uruchomiony
2. Czy zmienne środowiskowe są poprawnie ustawione
3. Czy migracje bazy danych zostały uruchomione
4. Logi serwera w konsoli

## 📄 Licencja

MIT

## 👥 Autorzy

Projekt stworzony dla posprzataj.se
