Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "       AI Career Roadmap - Full Stack Application       " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

$ProjectDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 1. Check Python
$pythonCmd = Get-Command python, py -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $pythonCmd) {
    Write-Warning "Python not detected in PATH. Please ensure Python 3.10+ is installed."
}

# 2. Check npm
$npmCmd = Get-Command npm, pnpm -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $npmCmd) {
    Write-Warning "Node/npm not detected in PATH. Please install Node.js 18+ from https://nodejs.org"
}

# Start Backend
Write-Host "[1/2] Launching Backend on http://127.0.0.1:8001..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ProjectDir\backend'; pip install -r requirements.txt; python -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload"

# Start Frontend
Write-Host "[2/2] Launching Frontend on http://localhost:5173..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ProjectDir\frontend'; npm install; npm run dev"

Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Application is launching in separate background windows!" -ForegroundColor Green
Write-Host "Backend API docs: http://127.0.0.1:8001/docs" -ForegroundColor Yellow
Write-Host "Frontend App:     http://localhost:5173" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan
