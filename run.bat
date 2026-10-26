@echo off
echo ========================================================
echo         AI Career Roadmap - Full Stack Application
echo ========================================================
echo.

set PROJECT_DIR=%~dp0
cd /d "%PROJECT_DIR%"

echo [1/3] Checking prerequisites...
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Python was not found in PATH. Please install Python 3.10+ or add it to PATH.
)

where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Node.js / npm was not found in PATH. Please install Node.js 18+ from https://nodejs.org
)

echo.
echo [2/3] Starting Backend Server (FastAPI on http://127.0.0.1:8001)...
start "AI Career Roadmap - Backend" cmd /k "cd /d %PROJECT_DIR%backend && pip install -r requirements.txt && python -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload"

echo [3/3] Starting Frontend Server (Vite on http://localhost:5173)...
start "AI Career Roadmap - Frontend" cmd /k "cd /d %PROJECT_DIR%frontend && npm install && npm run dev"

echo.
echo ========================================================
echo Application is launching!
echo Backend:  http://127.0.0.1:8001/docs
echo Frontend: http://localhost:5173
echo ========================================================
echo Keep the launched terminal windows open while testing.
pause
