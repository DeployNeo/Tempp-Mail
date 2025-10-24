@echo off
echo Starting Guerrilla Mail (Simple Mode - No Redis Required)
echo.

echo Building React app...
cd client
call npm run build
cd ..

echo Starting server...
node server/index.js

pause
