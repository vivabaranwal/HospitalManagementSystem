@echo off
title HMS - Hospital Management System
echo.
echo  ============================================
echo    HMS Hospital Management System
echo  ============================================
echo.
echo  Starting Backend API  (Flask  ^| port 5000)...
echo  Starting Frontend App (Vite   ^| port 8080)...
echo.
echo  Backend  ^>  http://localhost:5000
echo  Frontend ^>  http://localhost:8080
echo.
echo  Close this window to stop both servers.
echo  ============================================
echo.

:: Launch Flask backend in a new window
start "HMS Backend" cmd /k "cd /d "%~dp0backend" && python app.py"

:: Wait 2 seconds then launch Vite frontend in a new window
timeout /t 2 /nobreak > nul
start "HMS Frontend" cmd /k "cd /d "%~dp0" && npm run dev"

echo  Both servers are starting in separate windows.
echo  Open http://localhost:8080 in your browser.
echo.
pause
