# 🚀 Quick Start Guide - Guerrilla Fullstack

Get your temporary email service up and running in minutes!

## ⚡ Super Quick Start (5 minutes)

### 1. Clone and Install
```bash
git clone https://github.com/YOUR_USERNAME/guerrilla-fullstack.git
cd guerrilla-fullstack
npm run install:all
```

### 2. Start the Application
```bash
# Option 1: Development mode (recommended)
npm run dev

# Option 2: Production mode
npm run build
npm start
```

### 3. Open Your Browser
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

That's it! 🎉

## 🐳 Docker Quick Start

```bash
# Start with Docker Compose
docker-compose up --build

# Access at http://localhost:3000
```

## 📱 What You'll See

1. **Beautiful Dark Mode Interface** - Modern glassmorphic design
2. **Temporary Email Address** - Automatically generated
3. **Real-time Inbox** - Live email updates
4. **Sample Emails** - Demo emails to test functionality
5. **Settings Panel** - Customize your experience

## 🔧 Configuration

### Environment Variables
Create a `.env` file (optional):
```env
PORT=3000
NODE_ENV=development
REDIS_URL=redis://localhost:6379
CLIENT_URL=http://localhost:5173
```

### Redis (Optional)
The app works without Redis, but for production:
```bash
# Using Docker
docker run -d -p 6379:6379 redis:7-alpine

# Or install locally
# Windows: choco install redis-64
# macOS: brew install redis
# Ubuntu: sudo apt install redis-server
```

## 🚀 Deployment Options

### Heroku (Easiest)
```bash
# Install Heroku CLI
# Create app
heroku create your-app-name

# Add Redis
heroku addons:create heroku-redis:hobby-dev

# Deploy
git push heroku main
```

### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
railway login
railway init
railway up
```

## 🎯 Features

### ✅ What Works Out of the Box
- **Temporary Email Generation** - Real GuerrillaMail API integration
- **Demo Mode** - Sample emails when API is unavailable
- **Real-time Updates** - WebSocket notifications
- **Responsive Design** - Works on all devices
- **Dark/Light Mode** - Theme switching
- **Email Management** - View, delete, search emails
- **Session Persistence** - Remembers your email address

### 🔄 Fallback System
- **Real Mode**: Uses GuerrillaMail API for actual temporary emails
- **Demo Mode**: Shows sample emails when API is unavailable
- **Automatic Detection**: Switches between modes seamlessly

## 📊 Project Structure

```
guerrilla-fullstack/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── contexts/       # React contexts
│   │   └── services/       # API services
├── server/                 # Node.js backend
│   ├── services/           # Business logic
│   └── index.js           # Express server
├── .github/               # GitHub Actions
├── docker-compose.yml     # Docker setup
└── README.md              # Full documentation
```

## 🛠️ Development

### Available Scripts
```bash
npm run dev              # Start both client and server
npm run server:dev       # Start server only
npm run client:dev       # Start client only
npm run build            # Build for production
npm start               # Start production server
npm run install:all     # Install all dependencies
```

### Development Tools
- **Hot Reload**: Changes reflect immediately
- **Error Overlay**: Clear error messages
- **Console Logging**: Detailed debugging info
- **Status Indicators**: Real-time connection status

## 🔍 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 npm start
```

**Redis Connection Issues**
- The app works without Redis
- Check Redis is running: `redis-cli ping`
- Or use Docker: `docker run -d -p 6379:6379 redis:7-alpine`

**Build Errors**
```bash
# Clear cache and reinstall
rm -rf node_modules client/node_modules
npm run install:all
```

**API Errors**
- Check internet connection
- GuerrillaMail API might be temporarily unavailable
- App automatically falls back to demo mode

## 📚 Documentation

- **README.md** - Complete project documentation
- **GITHUB_SETUP.md** - GitHub repository setup
- **CONTRIBUTING.md** - Contribution guidelines
- **SECURITY.md** - Security policies
- **dev-setup.md** - Development setup guide

## 🎨 Customization

### Themes
- Edit `client/src/index.css` for custom styles
- Modify `client/tailwind.config.cjs` for Tailwind customization

### API Configuration
- Update `server/services/guerrillaAPI.js` for API settings
- Modify domains in `CONFIG.DOMAINS`

### UI Components
- All components in `client/src/components/`
- Use Framer Motion for animations
- Tailwind CSS for styling

## 🚀 Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure Redis (optional)
- [ ] Set up SSL certificate
- [ ] Configure reverse proxy
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Set up logging

## 📞 Support

- **GitHub Issues**: Report bugs and request features
- **GitHub Discussions**: Ask questions and get help
- **Documentation**: Check README.md for detailed info

## 🎉 You're Ready!

Your Guerrilla Fullstack temporary email service is now running! 

**Next Steps:**
1. Test the functionality
2. Customize the UI
3. Deploy to production
4. Share with others
5. Contribute to the project

Happy coding! 🚀
