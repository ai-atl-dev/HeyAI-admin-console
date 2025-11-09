#!/bin/bash

# Quick seed script for BigQuery sample data
# Usage: bash scripts/quick-seed.sh

echo "🌱 HeyAI BigQuery Quick Seed"
echo "=============================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local file not found"
    echo "Please create .env.local with your BigQuery credentials"
    exit 1
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if dotenv is installed
if ! npm list dotenv > /dev/null 2>&1; then
    echo "📦 Installing dotenv..."
    npm install dotenv
fi

echo "🚀 Running seed script..."
echo ""

node scripts/seed-bigquery.js

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Seeding completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Start your dev server: npm run dev"
    echo "2. Visit: http://localhost:3000/admin/dashboard"
    echo "3. View your sample data!"
else
    echo ""
    echo "❌ Seeding failed. Check the error messages above."
    exit 1
fi
