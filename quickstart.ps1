# BREWLUXE Quick Start Script for Windows PowerShell
# This script sets up and runs the entire BREWLUXE application

Write-Host "`n===============================================" -ForegroundColor Cyan
Write-Host "   BREWLUXE Backend + Frontend Setup" -ForegroundColor Cyan
Write-Host "===============================================`n" -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "[✓] Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "`n[ERROR] Node.js is not installed!`n" -ForegroundColor Red
    Write-Host "Please download and install from: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "(LTS version recommended)`n" -ForegroundColor Yellow
    Write-Host "After installation, restart PowerShell and run this script again.`n" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Python is installed
try {
    $pythonVersion = python --version 2>&1
    Write-Host "[✓] Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Python is not installed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "`n[*] Installing Node.js dependencies..." -ForegroundColor Yellow

# Navigate to server directory
Set-Location "d:\zoomy project\brewluxe--web\server"

# Install dependencies
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n[ERROR] Failed to install dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "`n[✓] Dependencies installed successfully`n" -ForegroundColor Green

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "`n   SETUP COMPLETE! Follow these steps:`n" -ForegroundColor Green
Write-Host "   1. Open TERMINAL 1 (new PowerShell) and run:" -ForegroundColor White
Write-Host '      cd "d:\zoomy project\brewluxe--web\server"' -ForegroundColor Cyan
Write-Host "      npm start" -ForegroundColor Cyan
Write-Host "`n   2. Wait for 'BREWLUXE API Server running...'" -ForegroundColor White
Write-Host "`n   3. Open TERMINAL 2 and run:" -ForegroundColor White
Write-Host "      curl -X POST http://localhost:3000/api/admin/seed" -ForegroundColor Cyan
Write-Host "`n   4. Open TERMINAL 3 and run:" -ForegroundColor White
Write-Host '      cd "d:\zoomy project\brewluxe--web"' -ForegroundColor Cyan
Write-Host "      python -m http.server 5520" -ForegroundColor Cyan
Write-Host "`n   5. Open browser to:" -ForegroundColor White
Write-Host "      http://localhost:5520/coffee.html" -ForegroundColor Cyan
Write-Host "`n===============================================`n" -ForegroundColor Cyan

Write-Host "Setup complete! You can now run the application." -ForegroundColor Green
Read-Host "Press Enter to exit"
