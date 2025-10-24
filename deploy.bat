@echo off
echo 🚀 Guerrilla Fullstack Deployment Script
echo ========================================

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 20+ first.
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version

REM Install dependencies
echo 📦 Installing dependencies...
npm install
cd client
npm install
cd ..

REM Build the application
echo 🔨 Building application...
cd client
npm run build
cd ..

echo ✅ Build completed successfully!

REM Deployment options
echo.
echo 🌐 Choose deployment option:
echo 1. Heroku
echo 2. Vercel
echo 3. Railway
echo 4. DigitalOcean App Platform
echo 5. Docker
echo 6. Manual deployment

set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" (
    echo 🚀 Deploying to Heroku...
    heroku --version >nul 2>&1
    if errorlevel 1 (
        echo ❌ Heroku CLI not found. Please install it first.
        echo Visit: https://devcenter.heroku.com/articles/heroku-cli
        pause
        exit /b 1
    )
    
    echo Please follow these steps:
    echo 1. Login to Heroku: heroku login
    echo 2. Create app: heroku create your-app-name
    echo 3. Add Redis: heroku addons:create heroku-redis:hobby-dev
    echo 4. Set config: heroku config:set NODE_ENV=production
    echo 5. Deploy: git push heroku main
    echo 6. Open: heroku open
    pause
) else if "%choice%"=="2" (
    echo 🚀 Deploying to Vercel...
    vercel --version >nul 2>&1
    if errorlevel 1 (
        echo ❌ Vercel CLI not found. Installing...
        npm install -g vercel
    )
    
    vercel --prod
    echo ✅ Deployed to Vercel!
) else if "%choice%"=="3" (
    echo 🚀 Deploying to Railway...
    railway --version >nul 2>&1
    if errorlevel 1 (
        echo ❌ Railway CLI not found. Installing...
        npm install -g @railway/cli
    )
    
    railway login
    railway init
    railway up
    echo ✅ Deployed to Railway!
) else if "%choice%"=="4" (
    echo 🚀 Deploying to DigitalOcean App Platform...
    echo Please follow these steps:
    echo 1. Go to https://cloud.digitalocean.com/apps
    echo 2. Click 'Create App'
    echo 3. Connect your GitHub repository
    echo 4. Configure build settings:
    echo    - Build command: npm run build
    echo    - Run command: npm start
    echo    - Source directory: /
    echo 5. Add environment variables:
    echo    - NODE_ENV=production
    echo    - PORT=3000
    echo 6. Deploy!
    pause
) else if "%choice%"=="5" (
    echo 🐳 Building Docker image...
    docker --version >nul 2>&1
    if errorlevel 1 (
        echo ❌ Docker not found. Please install Docker first.
        pause
        exit /b 1
    )
    
    docker build -t guerrilla-mail .
    echo ✅ Docker image built!
    echo To run: docker run -p 3000:3000 guerrilla-mail
) else if "%choice%"=="6" (
    echo 📋 Manual deployment instructions:
    echo.
    echo 1. Upload files to your server
    echo 2. Install dependencies: npm install
    echo 3. Build client: cd client ^&^& npm run build
    echo 4. Start server: npm start
    echo 5. Configure reverse proxy (nginx/apache)
    echo 6. Set up SSL certificate
    echo 7. Configure environment variables
    echo.
    echo Environment variables needed:
    echo - NODE_ENV=production
    echo - PORT=3000
    echo - REDIS_URL=redis://localhost:6379 (optional)
    pause
) else (
    echo ❌ Invalid choice. Please run the script again.
    pause
    exit /b 1
)

echo.
echo 🎉 Deployment process completed!
echo Your Guerrilla Fullstack app should now be running.
echo.
echo 📚 For more information, check:
echo - README.md for documentation
echo - GITHUB_SETUP.md for GitHub setup
echo - CONTRIBUTING.md for contribution guidelines
pause
