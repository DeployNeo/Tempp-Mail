#!/bin/bash

# Guerrilla Fullstack Deployment Script
# This script helps deploy the application to various platforms

echo "🚀 Guerrilla Fullstack Deployment Script"
echo "========================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install
cd client && npm install && cd ..

# Build the application
echo "🔨 Building application..."
cd client && npm run build && cd ..

echo "✅ Build completed successfully!"

# Deployment options
echo ""
echo "🌐 Choose deployment option:"
echo "1. Heroku"
echo "2. Vercel"
echo "3. Railway"
echo "4. DigitalOcean App Platform"
echo "5. Docker"
echo "6. Manual deployment"

read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        echo "🚀 Deploying to Heroku..."
        if ! command -v heroku &> /dev/null; then
            echo "❌ Heroku CLI not found. Please install it first."
            echo "Visit: https://devcenter.heroku.com/articles/heroku-cli"
            exit 1
        fi
        
        # Check if already logged in
        if ! heroku auth:whoami &> /dev/null; then
            echo "Please login to Heroku:"
            heroku login
        fi
        
        # Create app if it doesn't exist
        if [ -z "$HEROKU_APP_NAME" ]; then
            read -p "Enter Heroku app name (or press Enter for auto-generated): " app_name
            if [ -z "$app_name" ]; then
                heroku create
            else
                heroku create "$app_name"
            fi
        fi
        
        # Add Redis addon
        heroku addons:create heroku-redis:hobby-dev
        
        # Set environment variables
        heroku config:set NODE_ENV=production
        heroku config:set PORT=3000
        
        # Deploy
        git add .
        git commit -m "Deploy to Heroku"
        git push heroku main
        
        echo "✅ Deployed to Heroku!"
        heroku open
        ;;
        
    2)
        echo "🚀 Deploying to Vercel..."
        if ! command -v vercel &> /dev/null; then
            echo "❌ Vercel CLI not found. Installing..."
            npm install -g vercel
        fi
        
        vercel --prod
        echo "✅ Deployed to Vercel!"
        ;;
        
    3)
        echo "🚀 Deploying to Railway..."
        if ! command -v railway &> /dev/null; then
            echo "❌ Railway CLI not found. Installing..."
            npm install -g @railway/cli
        fi
        
        railway login
        railway init
        railway up
        echo "✅ Deployed to Railway!"
        ;;
        
    4)
        echo "🚀 Deploying to DigitalOcean App Platform..."
        echo "Please follow these steps:"
        echo "1. Go to https://cloud.digitalocean.com/apps"
        echo "2. Click 'Create App'"
        echo "3. Connect your GitHub repository"
        echo "4. Configure build settings:"
        echo "   - Build command: npm run build"
        echo "   - Run command: npm start"
        echo "   - Source directory: /"
        echo "5. Add environment variables:"
        echo "   - NODE_ENV=production"
        echo "   - PORT=3000"
        echo "6. Deploy!"
        ;;
        
    5)
        echo "🐳 Building Docker image..."
        if ! command -v docker &> /dev/null; then
            echo "❌ Docker not found. Please install Docker first."
            exit 1
        fi
        
        docker build -t guerrilla-mail .
        echo "✅ Docker image built!"
        echo "To run: docker run -p 3000:3000 guerrilla-mail"
        ;;
        
    6)
        echo "📋 Manual deployment instructions:"
        echo ""
        echo "1. Upload files to your server"
        echo "2. Install dependencies: npm install"
        echo "3. Build client: cd client && npm run build"
        echo "4. Start server: npm start"
        echo "5. Configure reverse proxy (nginx/apache)"
        echo "6. Set up SSL certificate"
        echo "7. Configure environment variables"
        echo ""
        echo "Environment variables needed:"
        echo "- NODE_ENV=production"
        echo "- PORT=3000"
        echo "- REDIS_URL=redis://localhost:6379 (optional)"
        ;;
        
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment process completed!"
echo "Your Guerrilla Fullstack app should now be running."
echo ""
echo "📚 For more information, check:"
echo "- README.md for documentation"
echo "- GITHUB_SETUP.md for GitHub setup"
echo "- CONTRIBUTING.md for contribution guidelines"
