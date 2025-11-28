# Space Impact - Quick Start Script for Windows
# This script starts a local web server and opens the game in your browser

Write-Host "================================" -ForegroundColor Cyan
Write-Host "  SPACE IMPACT - Quick Start" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
$pythonExists = Get-Command python -ErrorAction SilentlyContinue

if ($pythonExists) {
    Write-Host "✓ Python detected" -ForegroundColor Green
    Write-Host ""
    Write-Host "Starting web server on http://localhost:8000..." -ForegroundColor Yellow
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
    Write-Host ""
    
    # Wait a moment then open browser
    Start-Sleep -Seconds 2
    Start-Process "http://localhost:8000"
    
    # Start Python server
    python -m http.server 8000
} else {
    Write-Host "✗ Python not found" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Python 3 or use one of these alternatives:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Option 1 - Install Python:" -ForegroundColor Cyan
    Write-Host "  Download from: https://www.python.org/downloads/" -ForegroundColor Gray
    Write-Host "  Then run this script again" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Option 2 - Use Node.js:" -ForegroundColor Cyan
    Write-Host "  npm install -g http-server" -ForegroundColor Gray
    Write-Host "  http-server -p 8000" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Option 3 - Use PHP:" -ForegroundColor Cyan
    Write-Host "  php -S localhost:8000" -ForegroundColor Gray
    Write-Host ""
    
    Read-Host "Press Enter to exit"
}
