#!/bin/bash

# Script to initialize the database

echo "🗄️  Initializing database..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL environment variable is not set"
    echo "Please create server/.env file with DATABASE_URL"
    exit 1
fi

# Run Prisma migrations
echo "📦 Running database migrations..."
npx prisma migrate deploy

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Seed database (optional)
if [ "$1" == "--seed" ]; then
    echo "🌱 Seeding database..."
    # Add seed script here if needed
fi

echo "✅ Database initialized successfully!"
