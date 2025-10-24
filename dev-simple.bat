@echo off
echo Starting Guerrilla Mail Development (Simple Mode)
echo.

echo Starting development servers...
start "Client Dev Server" cmd /c "cd client && npm run dev"
timeout /t 3 /nobreak > nul
start "Server Dev" cmd /c "node server/index.js"

echo.
echo Development servers started!
echo Frontend: http://localhost:5173
echo Backend: http://localhost:3000
echo.
pause
