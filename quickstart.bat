@echo off
REM BREWLUXE Quick Start Script for Windows PowerShell
REM This script sets up and runs the entire BREWLUXE application

REM Color codes
setlocal enabledelayedexpansion

echo.
echo ===============================================
echo.   BREWLUXE Backend + Frontend Setup
echo.===============================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo [ERROR] Node.js is not installed!
    echo.
    echo Please download and install from: https://nodejs.org/
    echo (LTS version recommended)
    echo.
    echo After installation, restart this script.
    echo.
    pause
    exit /b 1
)

echo [✓] Node.js found
node --version

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed!
    echo.
    exit /b 1
)

echo [✓] Python found
python --version
echo.

REM Navigate to server directory
cd /d "d:\zoomy project\brewluxe--web\server"
echo.
echo [*] Installing Node.js dependencies...
call npm install

if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [✓] Dependencies installed successfully
echo.
echo ===============================================
echo.
echo   SETUP COMPLETE! Follow these steps:
echo.
echo   1. Open TERMINAL 1 and run:
echo      cd "d:\zoomy project\brewluxe--web\server"
echo      npm start
echo.
echo   2. Wait for "BREWLUXE API Server running..."
echo.
echo   3. Open TERMINAL 2 and run:
echo      curl -X POST http://localhost:3000/api/admin/seed
echo.
echo   4. Open TERMINAL 3 and run:
echo      cd "d:\zoomy project\brewluxe--web"
echo      python -m http.server 5520
echo.
echo   5. Open browser to:
echo      http://localhost:5520/coffee.html
echo.
echo ===============================================
echo.
pause
