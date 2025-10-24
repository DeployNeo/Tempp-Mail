@echo off
echo Installing server dependencies...
npm install

echo Installing client dependencies...
cd client
npm install
cd ..

echo Installation complete!
pause
