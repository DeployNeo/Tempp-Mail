const { v4: uuidv4 } = require('uuid');
const { CookieJar } = require('tough-cookie');
const guerrillaAPI = require('./guerrillaAPI');

// In-memory storage for development
const sessions = new Map();

class MemorySessionManager {
  async createOrRestoreSession(serverSid) {
    let session;
    
    if (serverSid && sessions.has(serverSid)) {
      // Try to restore existing session
      session = sessions.get(serverSid);
    }
    
    if (!session) {
      // Create new session
      session = await this.createNewSession();
    }
    
    return session;
  }

  async createNewSession() {
    const serverSid = uuidv4();
    const cookieJar = new CookieJar();
    
    try {
      // Get initial email address from GuerrillaMail API
      const emailData = await guerrillaAPI.getEmailAddress(cookieJar);
      
      const session = {
        serverSid,
        tempMailAddress: emailData.email_addr,
        cookieJar: cookieJar,
        createdAt: new Date().toISOString(),
        lastChecked: new Date().toISOString(),
        isMock: false // This is a real session
      };
      
      sessions.set(serverSid, session);
      console.log('✅ Real GuerrillaMail session created:', emailData.email_addr);
      return session;
    } catch (error) {
      console.error('❌ Failed to create real session with GuerrillaMail API:', error.message);
      console.log('🔄 Falling back to mock email generation...');
      
      // Fallback: Generate a mock email address
      const mockEmail = `temp${Date.now()}@guerrillamail.com`;
      
      const session = {
        serverSid,
        tempMailAddress: mockEmail,
        cookieJar: cookieJar,
        createdAt: new Date().toISOString(),
        lastChecked: new Date().toISOString(),
        isMock: true, // Flag to indicate this is a mock session
        mockEmails: [
          {
            mail_id: 'mock-1',
            mail_from: 'welcome@example.com',
            mail_subject: 'Welcome to Guerrilla Mail!',
            mail_excerpt: 'This is a sample email to demonstrate the functionality.',
            mail_timestamp: Math.floor(Date.now() / 1000) - 3600,
            received: new Date(Date.now() - 3600000).toISOString()
          },
          {
            mail_id: 'mock-2',
            mail_from: 'notifications@github.com',
            mail_subject: 'GitHub Notification',
            mail_excerpt: 'You have a new notification on GitHub.',
            mail_timestamp: Math.floor(Date.now() / 1000) - 1800,
            received: new Date(Date.now() - 1800000).toISOString()
          }
        ]
      };
      
      sessions.set(serverSid, session);
      console.log('📧 Mock session created with sample emails');
      return session;
    }
  }

  async getSession(serverSid) {
    if (!serverSid) return null;
    return sessions.get(serverSid) || null;
  }

  async updateSession(session) {
    sessions.set(session.serverSid, session);
  }

  async deleteSession(serverSid) {
    sessions.delete(serverSid);
  }

  async getAllSessions() {
    return Array.from(sessions.values());
  }
}

module.exports = new MemorySessionManager();
