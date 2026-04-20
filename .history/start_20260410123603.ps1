# OSHXONA - Restoran Zakaz Tizimi
# Backend va Frontend ishga tushurish PowerShell scripti

Write-Host "`n=========================================" -ForegroundColor Cyan
Write-Host "   OSHXONA - Restoran Zakaz Tizimi" -ForegroundColor Cyan
Write-Host "=========================================`n" -ForegroundColor Cyan

# Backend papkasini tekshirish
if (-not (Test-Path "backend")) {
    Write-Host "ERROR: Backend papkasi topilmadi!" -ForegroundColor Red
    Read-Host "Chiqish uchun istalgan tugmani bosing"
    exit 1
}

# Frontend papkasini tekshirish
if (-not (Test-Path "frontend")) {
    Write-Host "ERROR: Frontend papkasi topilmadi!" -ForegroundColor Red
    Read-Host "Chiqish uchun istalgan tugmani bosing"
    exit 1
}

Write-Host "[1/4] Backend qaytilmoqda..." -ForegroundColor Yellow
Set-Location backend

if (-not (Test-Path "node_modules")) {
    Write-Host "[2/4] Backend dependencies o'rnatilmoqda..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "[2/4] Backend dependencies allaqachon o'rnatilgan." -ForegroundColor Green
}

Write-Host "[3/4] Backend ishga tushirilmoqda (localhost:3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start"

Set-Location ..

Write-Host "[4/4] Frontend ishga tushirilmoqda (localhost:5173)..." -ForegroundColor Yellow
Set-Location frontend

if (-not (Test-Path "node_modules")) {
    Write-Host "Frontend dependencies o'rnatilmoqda..." -ForegroundColor Yellow
    npm install
}

Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

Set-Location ..

Write-Host "`n=========================================" -ForegroundColor Green
Write-Host "   ✅ Barcha tizimlar ishga tushdi!" -ForegroundColor Green
Write-Host "=========================================`n" -ForegroundColor Green

Write-Host "Taraychi oching:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "   Backend:  http://localhost:3000" -ForegroundColor White

Write-Host "`n2 ta tab oching:" -ForegroundColor Cyan
Write-Host "   1. Ofitsiant Paneli" -ForegroundColor White
Write-Host "   2. Oshxona Paneli" -ForegroundColor White

Write-Host "`nOmad! 🍽️" -ForegroundColor Green
