#!/bin/bash

# Script pomocniczy do konfiguracji na Render
# Uruchom ten skrypt po pierwszym deploy, aby zainicjalizować bazę danych

echo "🚀 Konfiguracja Render - posprzataj.se"
echo ""

# Sprawdź czy DATABASE_URL jest ustawiony
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Błąd: DATABASE_URL nie jest ustawiony"
    echo "Ustaw zmienną środowiskową DATABASE_URL w Render Dashboard"
    exit 1
fi

echo "📦 Generowanie Prisma Client..."
npx prisma generate

echo "🗄️  Uruchamianie migracji bazy danych..."
npx prisma migrate deploy

echo "✅ Konfiguracja zakończona pomyślnie!"
echo ""
echo "Następne kroki:"
echo "1. Sprawdź logi w Render Dashboard"
echo "2. Przetestuj endpoint /api/health"
echo "3. Zaloguj się do aplikacji (ADMIN / admin123)"
echo "4. Zmień hasło administratora!"
