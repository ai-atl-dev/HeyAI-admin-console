# Quick seed script for BigQuery sample data (PowerShell)
# Usage: .\scripts\quick-seed.ps1

Write-Host "🌱 HeyAI BigQuery Quick Seed" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
if (-not (Test-Path .env.local)) {
    Write-Host "❌ Error: .env.local file not found" -ForegroundColor Red
    Write-Host "Please create .env.local with your BigQuery credentials"
    exit 1
}

# Check if node_modules exists
if (-not (Test-Path node_modules)) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Check if dotenv is installed
$dotenvInstalled = npm list dotenv 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "📦 Installing dotenv..." -ForegroundColor Yellow
    npm install dotenv
}

Write-Host "🚀 Running seed script..." -ForegroundColor Green
Write-Host ""

node scripts/seed-bigquery.js

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Seeding completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Start your dev server: npm run dev"
    Write-Host "2. Visit: http://localhost:3000/admin/dashboard"
    Write-Host "3. View your sample data!"
} else {
    Write-Host ""
    Write-Host "❌ Seeding failed. Check the error messages above." -ForegroundColor Red
    exit 1
}
