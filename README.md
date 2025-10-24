# 🚀 Guerrilla Fullstack - Modern Temporary Email Service

A modern, full-stack temporary email web application built with React, Node.js, and Redis. Features real-time email updates, beautiful dark mode UI, and secure session management using the GuerrillaMail API.

![Guerrilla Mail](https://img.shields.io/badge/Guerrilla-Mail-blue)
![React](https://img.shields.io/badge/React-18+-61dafb)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933)
![Redis](https://img.shields.io/badge/Redis-7+-dc382d)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ed)

## ✨ Features

### 🎯 Core Functionality
- **Instant Email Generation**: Create disposable email addresses with a single click
- **Real-time Updates**: WebSocket-powered live email notifications
- **Session Persistence**: Secure session management with Redis
- **Custom Email Addresses**: Set your own username for temporary emails
- **Auto-refresh**: Configurable automatic inbox updates
- **Email Management**: View, delete, and manage received emails

### 🎨 Modern UI/UX
- **Dark Mode Default**: Beautiful dark theme with smooth transitions
- **Responsive Design**: Perfect on desktop, tablet, and mobile
- **Glass Morphism**: Modern glassmorphic design elements
- **Smooth Animations**: Framer Motion powered interactions
- **Status Indicators**: Real-time connection status display
- **Toast Notifications**: User-friendly feedback system

### 🔧 Technical Features
- **React 18+**: Modern React with hooks and context
- **Vite**: Lightning-fast development and build
- **TailwindCSS**: Utility-first CSS framework
- **Socket.io**: Real-time bidirectional communication
- **Redis**: Fast session and data persistence
- **Docker**: Containerized deployment ready
- **TypeScript Ready**: Easy to migrate to TypeScript

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │    │  Node.js API    │    │  GuerrillaMail  │
│                 │    │                 │    │      API        │
│  • Vite Dev     │◄──►│  • Express      │◄──►│                 │
│  • TailwindCSS  │    │  • Socket.io    │    │  • Email API    │
│  • Framer Motion│    │  • Redis       │    │  • Session Mgmt  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd guerrilla-fullstack

# Start with Docker Compose
docker-compose up --build

# Access the application
open http://localhost:3000
```

### Option 2: Manual Setup

```bash
# Install dependencies
npm run install:all

# Start Redis (if not using Docker)
redis-server

# Start development servers
npm run dev

# Or start production build
npm run build
npm start
```

## 📦 Installation

### Prerequisites

- **Node.js 20+**
- **Redis 7+**
- **Docker & Docker Compose** (optional)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd guerrilla-fullstack
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Configure environment**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start Redis**
   ```bash
   # Using Docker
   docker run -d -p 6379:6379 redis:7-alpine
   
   # Or install Redis locally
   # macOS: brew install redis
   # Ubuntu: sudo apt install redis-server
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

### Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

3. **Or use Docker**
   ```bash
   docker-compose up --build -d
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Client Configuration
CLIENT_URL=http://localhost:3000

# GuerrillaMail API Configuration
GUERRILLA_API_BASE=https://api.guerrillamail.com/ajax.php
```

### Available Domains

The application supports multiple GuerrillaMail domains:

- `guerrillamail.com`
- `guerrillamail.net`
- `guerrillamail.org`
- `guerrillamailblock.com`
- `grr.la`
- `pokemail.net`
- `spam4.me`

## 📱 Usage Guide

### Creating a Temporary Email

1. **Automatic Generation**: A random email is created when you first load the app
2. **Custom Email**: Use the settings panel to set a custom username
3. **Copy Address**: Click the copy button to copy your email address

### Managing Your Inbox

1. **View Emails**: Click on any email to view its contents
2. **Search**: Use the search bar to filter emails
3. **Delete**: Click the trash icon to delete unwanted emails
4. **Auto-refresh**: Enable automatic updates in settings

### Settings & Customization

1. **Auto-refresh**: Toggle automatic inbox updates
2. **Refresh Interval**: Set update frequency (10s, 30s, 1m, 5m)
3. **Custom Email**: Set your own username
4. **Session Management**: Clear session and start fresh

## 🛠️ Development

### Project Structure

```
guerrilla-fullstack/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   └── App.jsx         # Main app component
│   ├── package.json
│   └── vite.config.js
├── server/               # Node.js backend
│   ├── services/           # Business logic
│   └── index.js           # Express server
├── docker-compose.yml     # Docker configuration
├── Dockerfile            # Multi-stage build
└── package.json          # Root package.json
```

### Available Scripts

```bash
# Development
npm run dev              # Start both client and server
npm run server:dev       # Start server only
npm run client:dev       # Start client only

# Production
npm run build            # Build React app
npm start               # Start production server

# Installation
npm run install:all     # Install all dependencies
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/session` | Create or restore session |
| GET | `/api/inbox` | Get email list |
| GET | `/api/message/:id` | Fetch specific email |
| DELETE | `/api/message/:id` | Delete email |
| POST | `/api/set-user` | Set custom email user |
| POST | `/api/forget` | Clear session |

### WebSocket Events

| Event | Description |
|-------|-------------|
| `subscribe` | Subscribe to session updates |
| `mail:update` | New email notification |

## 🐳 Docker Deployment

### Using Docker Compose

```bash
# Start all services
docker-compose up --build

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Using Docker

```bash
# Build image
docker build -t guerrilla-mail .

# Run container
docker run -p 3000:3000 -e REDIS_URL=redis://host.docker.internal:6379 guerrilla-mail
```

## 🔒 Security Features

- **Rate Limiting**: API endpoints are rate-limited
- **CORS Protection**: Configured CORS for security
- **Helmet**: Security headers middleware
- **Session Management**: Secure session handling
- **Input Validation**: Server-side validation
- **Error Handling**: Comprehensive error management

## 🚀 Performance Features

- **Redis Caching**: Fast session and data storage
- **WebSocket**: Real-time updates without polling
- **Code Splitting**: Optimized bundle sizes
- **Image Optimization**: Efficient asset loading
- **Lazy Loading**: Components loaded on demand

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e
```

## 📊 Monitoring

### Health Checks

- **Application**: `GET /api/session`
- **Redis**: Built-in Redis health check
- **Docker**: Container health checks

### Logging

- **Console Logging**: Development logging
- **Error Tracking**: Comprehensive error handling
- **Performance**: Request timing and metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **GuerrillaMail**: For providing the excellent temporary email API
- **React Team**: For the amazing React framework
- **Vite Team**: For the lightning-fast build tool
- **TailwindCSS**: For the utility-first CSS framework
- **Socket.io**: For real-time communication
- **Redis**: For fast data storage

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Email**: your-email@example.com

## 🔗 Links

- **Live Demo**: [https://your-demo-url.com](https://your-demo-url.com)
- **Documentation**: [https://your-docs-url.com](https://your-docs-url.com)
- **API Reference**: [https://your-api-docs-url.com](https://your-api-docs-url.com)

---

## 👤 Author

**Neo** - @neogotchicks

A modern temporary email service built with React, Node.js, and Redis.

---

**⚠️ Disclaimer**: This project is for educational and legitimate use only. Please use temporary email services responsibly and in accordance with applicable laws and terms of service.

