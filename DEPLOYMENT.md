# Deployment Guide - posprzataj.se

Ten dokument zawiera instrukcje dotyczące wdrożenia aplikacji posprzataj.se na produkcję.

## 🚀 Opcje Deploymentu

### Opcja 1: Docker Compose (Rekomendowane)

Najprostszy sposób na uruchomienie całej aplikacji.

#### Wymagania
- Docker
- Docker Compose

#### Kroki

1. **Sklonuj repozytorium**
```bash
git clone <repository-url>
cd project
```

2. **Skonfiguruj zmienne środowiskowe**

Utwórz plik `.env` w głównym katalogu:
```env
POSTGRES_USER=posprzataj
POSTGRES_PASSWORD=twoje-silne-haslo
POSTGRES_DB=posprzataj_se
JWT_SECRET=twoj-super-sekretny-klucz-jwt-minimum-32-znaki
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://posprzataj.se
VITE_API_URL=/api
MAX_FILE_SIZE=10485760
```

3. **Uruchom aplikację**
```bash
docker-compose up -d
```

4. **Sprawdź logi**
```bash
docker-compose logs -f
```

Aplikacja będzie dostępna pod adresem:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- PostgreSQL: localhost:5432

### Opcja 2: VPS/Serwer Dedykowany

#### Wymagania
- Node.js 20+
- PostgreSQL 16+
- Nginx (opcjonalnie, dla reverse proxy)
- PM2 (dla zarządzania procesami Node.js)

#### Kroki

1. **Zainstaluj zależności systemowe**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y nodejs npm postgresql nginx

# CentOS/RHEL
sudo yum install -y nodejs npm postgresql nginx
```

2. **Skonfiguruj PostgreSQL**
```bash
sudo -u postgres createdb posprzataj_se
sudo -u postgres createuser posprzataj
sudo -u postgres psql -c "ALTER USER posprzataj WITH PASSWORD 'twoje-haslo';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE posprzataj_se TO posprzataj;"
```

3. **Skonfiguruj aplikację**
```bash
# Sklonuj repozytorium
git clone <repository-url>
cd project

# Zainstaluj zależności
npm install

# Skonfiguruj zmienne środowiskowe
cp server/.env.example server/.env
# Edytuj server/.env z właściwymi wartościami
```

4. **Uruchom migracje bazy danych**
```bash
npm run db:migrate
```

5. **Zbuduj aplikację**
```bash
npm run build
```

6. **Zainstaluj PM2**
```bash
npm install -g pm2
```

7. **Uruchom aplikację z PM2**
```bash
pm2 start npm --name "posprzataj-backend" -- start:prod
pm2 save
pm2 startup
```

8. **Skonfiguruj Nginx (opcjonalnie)**

Utwórz plik `/etc/nginx/sites-available/posprzataj.se`:
```nginx
server {
    listen 80;
    server_name posprzataj.se www.posprzataj.se;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name posprzataj.se www.posprzataj.se;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    # Frontend
    location / {
        root /path/to/project/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Uploads
    location /uploads {
        alias /path/to/project/server/uploads;
    }
}
```

Aktywuj konfigurację:
```bash
sudo ln -s /etc/nginx/sites-available/posprzataj.se /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Opcja 3: Platformy Cloud (Vercel, Railway, Render)

#### Railway

1. Połącz repozytorium GitHub z Railway
2. Dodaj PostgreSQL addon
3. Skonfiguruj zmienne środowiskowe
4. Railway automatycznie zbuduje i wdroży aplikację

#### Render

1. Utwórz nowy Web Service
2. Połącz repozytorium GitHub
3. Skonfiguruj:
   - Build Command: `npm run build`
   - Start Command: `npm start:prod`
4. Dodaj PostgreSQL database
5. Skonfiguruj zmienne środowiskowe

## 🔒 Bezpieczeństwo

### Wymagane zmiany w produkcji:

1. **Zmień JWT_SECRET** - użyj silnego, losowego klucza (minimum 32 znaki)
2. **Zmień hasło administratora** - domyślne hasło to `admin123`
3. **Włącz HTTPS** - użyj Let's Encrypt lub innego certyfikatu SSL
4. **Skonfiguruj firewall** - otwórz tylko niezbędne porty
5. **Regularne backupy** - skonfiguruj automatyczne backup bazy danych
6. **Rate limiting** - rozważ dodanie rate limiting dla API
7. **Monitoring** - skonfiguruj monitoring i alerty

## 📊 Backup

### Backup bazy danych

```bash
# Backup
pg_dump -U posprzataj posprzataj_se > backup_$(date +%Y%m%d).sql

# Restore
psql -U posprzataj posprzataj_se < backup_20240101.sql
```

### Automatyczny backup (cron)

Dodaj do crontab:
```bash
0 2 * * * pg_dump -U posprzataj posprzataj_se > /backups/posprzataj_$(date +\%Y\%m\%d).sql
```

## 🔄 Aktualizacje

### Aktualizacja aplikacji

```bash
# Pull najnowsze zmiany
git pull origin main

# Zainstaluj nowe zależności
npm install

# Uruchom migracje
npm run db:migrate

# Zbuduj aplikację
npm run build

# Restart aplikacji
pm2 restart posprzataj-backend
```

## 📝 Monitoring

### PM2 Monitoring

```bash
# Status
pm2 status

# Logi
pm2 logs posprzataj-backend

# Monitorowanie
pm2 monit
```

### Health Check

Aplikacja udostępnia endpoint health check:
```
GET /api/health
```

## 🐛 Troubleshooting

### Problem: Baza danych nie łączy się
- Sprawdź czy PostgreSQL jest uruchomiony
- Sprawdź zmienną DATABASE_URL
- Sprawdź uprawnienia użytkownika bazy danych

### Problem: Aplikacja nie startuje
- Sprawdź logi: `pm2 logs` lub `docker-compose logs`
- Sprawdź czy wszystkie zmienne środowiskowe są ustawione
- Sprawdź czy porty nie są zajęte

### Problem: Upload plików nie działa
- Sprawdź uprawnienia do katalogu `server/uploads`
- Sprawdź MAX_FILE_SIZE w zmiennych środowiskowych
- Sprawdź czy katalog istnieje

## 📞 Wsparcie

W razie problemów:
1. Sprawdź logi aplikacji
2. Sprawdź logi bazy danych
3. Sprawdź logi Nginx (jeśli używany)
4. Sprawdź dokumentację w README.md
