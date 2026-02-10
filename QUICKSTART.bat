@echo off
REM Quick Start Script for Contact Management System (Windows)

echo.
echo 🚀 Contact Management System - Quick Start
echo ===========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js found: 
node --version
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

echo.
echo ✅ Installation complete!
echo.
echo 🎯 Next steps:
echo 1. Open two terminal windows/PowerShell
echo.
echo Terminal 1 ^(Backend^):
echo   npm run server
echo.
echo Terminal 2 ^(Frontend^):
echo   npm run dev
echo.
echo Then open http://localhost:5173 in your browser
echo.
echo For detailed documentation, see SETUP_GUIDE.md
echo.
pause
