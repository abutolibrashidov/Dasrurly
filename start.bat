@echo off
REM OSHXONA - Restoran Zakaz Tizimi
REM Backend va Frontend ishga tushurish scripti

echo.
echo =========================================
echo   OSHXONA - Restoran Zakaz Tizimi
echo =========================================
echo.

REM Backend papkasini tekshirish
if not exist "backend" (
    echo ERROR: Backend papkasi topilmadi!
    pause
    exit /b 1
)

REM Frontend papkasini tekshirish
if not exist "frontend" (
    echo ERROR: Frontend papkasi topilmadi!
    pause
    exit /b 1
)

echo [1/4] Backend qaytilmoqda...
cd backend
if not exist "node_modules" (
    echo [2/4] Backend dependencies o'rnatilmoqda...
    call npm install
) else (
    echo [2/4] Backend dependencies allaqachon o'rnatilgan.
)

echo [3/4] Backend ishga tushirilmoqda (localhost:3000)...
start npm start

cd ..

echo [4/4] Frontend ishga tushirilmoqda (localhost:5173)...
cd frontend
if not exist "node_modules" (
    echo Frontend dependencies o'rnatilmoqda...
    call npm install
)
start npm run dev

echo.
echo =========================================
echo   ✅ Barcha tizimlar ishga tushdi!
echo =========================================
echo.
echo Taraychi oching:
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:3000
echo.
echo 2 ta tab oching:
echo   1. Ofitsiant Paneli
echo   2. Oshxona Paneli
echo.
echo Txn boshlash uchun Ctrl+C bosinglar
echo.
pause
