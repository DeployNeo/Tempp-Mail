# Guerrilla Mail - Development Setup

## Quick Start (Windows)

1. **Install Dependencies**
   ```bash
   # Run the install script
   install.bat
   
   # Or manually:
   npm install
   cd client
   npm install
   cd ..
   ```

2. **Start Redis**
   ```bash
   # Option 1: Using Docker
   docker run -d -p 6379:6379 redis:7-alpine
   
   # Option 2: Install Redis locally
   # Download from: https://github.com/microsoftarchive/redis/releases
   # Or use: choco install redis-64
   ```

3. **Start the Application**
   ```bash
   # Option 1: Use the start script
   start.bat
   
   # Option 2: Manual start
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

## Manual Setup

### Prerequisites
- Node.js 20+
- Redis 7+
- Git

### Installation Steps

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd guerrilla-fullstack
   npm install
   cd client
   npm install
   cd ..
   ```

2. **Environment Setup**
   ```bash
   # Copy environment file
   copy env.local .env
   
   # Edit .env with your settings
   ```

3. **Start Services**
   ```bash
   # Terminal 1: Start Redis
   redis-server
   
   # Terminal 2: Start the app
   npm run dev
   ```

## Docker Setup

```bash
# Start with Docker Compose
docker-compose up --build

# Access at http://localhost:3000
```

## Troubleshooting

### Redis Connection Issues
- Make sure Redis is running on port 6379
- Check if Redis is accessible: `redis-cli ping`

### Port Conflicts
- Change ports in env.local file
- Update CLIENT_URL and PORT variables

### PowerShell Execution Policy
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Development Commands

```bash
# Install all dependencies
npm run install:all

# Start development servers
npm run dev

# Start server only
npm run server:dev

# Start client only
npm run client:dev

# Build for production
npm run build

# Start production server
npm start
```
