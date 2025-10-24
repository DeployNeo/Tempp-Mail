const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const redis = require('redis');
const path = require('path');
require('dotenv').config({ path: '../env.local' });

const guerrillaAPI = require('./services/guerrillaAPI');
const sessionManager = require('./services/sessionManager');
const memorySessionManager = require('./services/memorySessionManager');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Redis client with fallback to memory storage
let redisClient;
let useRedis = false;

try {
  redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  });
  
  redisClient.on('error', (err) => {
    console.warn('Redis not available, using memory storage:', err.message);
    useRedis = false;
  });
  
  redisClient.connect().then(() => {
    console.log('Connected to Redis');
    useRedis = true;
  }).catch((err) => {
    console.warn('Redis connection failed, using memory storage:', err.message);
    useRedis = false;
  });
} catch (error) {
  console.warn('Redis not available, using memory storage:', error.message);
  useRedis = false;
}

// Middleware
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../client/dist')));

// Helper function to get session manager
const getSessionManager = () => useRedis ? sessionManager : memorySessionManager;

// API Routes
app.post('/api/session', async (req, res) => {
  try {
    const { serverSid } = req.body;
    const session = useRedis 
      ? await sessionManager.createOrRestoreSession(serverSid, redisClient)
      : await memorySessionManager.createOrRestoreSession(serverSid);
    res.json({ 
      success: true, 
      serverSid: session.serverSid,
      tempMailAddress: session.tempMailAddress,
      isMock: session.isMock || false
    });
  } catch (error) {
    console.error('Session creation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/inbox', async (req, res) => {
  try {
    const { serverSid } = req.query;
    const session = useRedis 
      ? await sessionManager.getSession(serverSid, redisClient)
      : await memorySessionManager.getSession(serverSid);
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }
    
    let emails = [];
    
    // Check if this is a mock session
    if (session.isMock && session.mockEmails) {
      emails = session.mockEmails;
      console.log('📧 Serving mock emails:', emails.length);
    } else {
      // Try to get emails from GuerrillaMail API
      try {
        console.log('🔍 Fetching real emails from GuerrillaMail API...');
        emails = await guerrillaAPI.getEmailList(session.cookieJar);
        console.log('✅ Real emails fetched:', emails.length);
      } catch (error) {
        console.error('❌ Failed to fetch emails from GuerrillaMail API:', error.message);
        // Return empty array if API fails
        emails = [];
      }
    }
    
    res.json({ success: true, emails });
  } catch (error) {
    console.error('Inbox fetch error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/message/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { serverSid } = req.query;
    const session = useRedis 
      ? await sessionManager.getSession(serverSid, redisClient)
      : await memorySessionManager.getSession(serverSid);
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }
    
    let message = null;
    
    // Check if this is a mock session
    if (session.isMock && session.mockEmails) {
      const mockEmail = session.mockEmails.find(email => email.mail_id === id);
      if (mockEmail) {
        message = {
          ...mockEmail,
          mail_body: `<h2>${mockEmail.mail_subject}</h2><p>This is a sample email body for demonstration purposes.</p><p>From: ${mockEmail.mail_from}</p><p>Received: ${new Date(mockEmail.mail_timestamp * 1000).toLocaleString()}</p>`
        };
        console.log('📧 Serving mock email:', mockEmail.mail_subject);
      }
    } else {
      // Try to get message from GuerrillaMail API
      try {
        console.log('🔍 Fetching real email from GuerrillaMail API:', id);
        const result = await guerrillaAPI.fetchEmail(id, session.cookieJar);
        message = result.message;
        console.log('✅ Real email fetched successfully');
      } catch (error) {
        console.error('❌ Failed to fetch message from GuerrillaMail API:', error.message);
        // Don't return null, let the client handle the error
        return res.status(500).json({ success: false, error: 'Failed to fetch message from GuerrillaMail API' });
      }
    }
    
    if (!message) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }
    
    res.json({ success: true, message });
  } catch (error) {
    console.error('Message fetch error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/message/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { serverSid } = req.query;
    const session = useRedis 
      ? await sessionManager.getSession(serverSid, redisClient)
      : await memorySessionManager.getSession(serverSid);
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }
    
    // Check if this is a mock session
    if (session.isMock && session.mockEmails) {
      // Remove from mock emails
      session.mockEmails = session.mockEmails.filter(email => email.mail_id !== id);
      if (useRedis) {
        await sessionManager.updateSession(session, redisClient);
      } else {
        await memorySessionManager.updateSession(session);
      }
    } else {
      // Try to delete from GuerrillaMail API
      try {
        await guerrillaAPI.deleteEmail(id, session.cookieJar);
      } catch (error) {
        console.error('Failed to delete message from GuerrillaMail API:', error);
        // Still return success for mock sessions
      }
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Message delete error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/forget', async (req, res) => {
  try {
    const { serverSid } = req.body;
    if (useRedis) {
      await sessionManager.deleteSession(serverSid, redisClient);
    } else {
      await memorySessionManager.deleteSession(serverSid);
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Forget session error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/set-user', async (req, res) => {
  try {
    const { serverSid, emailUser } = req.body;
    const session = useRedis 
      ? await sessionManager.getSession(serverSid, redisClient)
      : await memorySessionManager.getSession(serverSid);
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }
    
    const result = await guerrillaAPI.setEmailUser(emailUser, session.cookieJar);
    if (result.success) {
      session.tempMailAddress = result.email_addr;
      if (useRedis) {
        await sessionManager.updateSession(session, redisClient);
      } else {
        await memorySessionManager.updateSession(session);
      }
    }
    
    res.json(result);
  } catch (error) {
    console.error('Set user error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('subscribe', (serverSid) => {
    socket.join(serverSid);
    console.log(`Client ${socket.id} subscribed to session ${serverSid}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Mail polling service
const startMailPolling = () => {
  setInterval(async () => {
    try {
      const sessions = useRedis 
        ? await sessionManager.getAllSessions(redisClient)
        : await memorySessionManager.getAllSessions();
        
      for (const session of sessions) {
        try {
          const emails = await guerrillaAPI.getEmailList(session.cookieJar);
          const newEmails = emails.filter(email => 
            new Date(email.received) > new Date(session.lastChecked || 0)
          );
          
          if (newEmails.length > 0) {
            session.lastChecked = new Date().toISOString();
            if (useRedis) {
              await sessionManager.updateSession(session, redisClient);
            } else {
              await memorySessionManager.updateSession(session);
            }
            io.to(session.serverSid).emit('mail:update', { emails: newEmails });
          }
        } catch (error) {
          console.error(`Polling error for session ${session.serverSid}:`, error);
        }
      }
    } catch (error) {
      console.error('Mail polling error:', error);
    }
  }, 30000); // Poll every 30 seconds
};

// Start mail polling
startMailPolling();

// Serve React app for all non-API routes
app.use((req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return next();
  }
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
