const { v4: uuidv4 } = require('uuid');
const { CookieJar } = require('tough-cookie');
const guerrillaAPI = require('./guerrillaAPI');

class SessionManager {
  async createOrRestoreSession(serverSid, redisClient) {
    let session;
    
    if (serverSid) {
      // Try to restore existing session
      session = await this.getSession(serverSid, redisClient);
    }
    
    if (!session) {
      // Create new session
      session = await this.createNewSession(redisClient);
    }
    
    return session;
  }

  async createNewSession(redisClient) {
    const serverSid = uuidv4();
    const cookieJar = new CookieJar();
    
    // Get initial email address
    const emailData = await guerrillaAPI.getEmailAddress(cookieJar);
    
    const session = {
      serverSid,
      tempMailAddress: emailData.email_addr,
      cookieJar: cookieJar.serializeSync(),
      createdAt: new Date().toISOString(),
      lastChecked: new Date().toISOString()
    };
    
    await redisClient.setEx(
      `session:${serverSid}`, 
      3600, // 1 hour TTL
      JSON.stringify(session)
    );
    
    return session;
  }

  async getSession(serverSid, redisClient) {
    if (!serverSid) return null;
    
    const sessionData = await redisClient.get(`session:${serverSid}`);
    if (!sessionData) return null;
    
    const session = JSON.parse(sessionData);
    
    // Restore cookie jar
    if (session.cookieJar) {
      const cookieJar = new CookieJar();
      cookieJar.deserializeSync(session.cookieJar);
      session.cookieJar = cookieJar;
    }
    
    return session;
  }

  async updateSession(session, redisClient) {
    // Serialize cookie jar before storing
    const sessionToStore = { ...session };
    if (session.cookieJar && typeof session.cookieJar.serializeSync === 'function') {
      sessionToStore.cookieJar = session.cookieJar.serializeSync();
    }
    
    await redisClient.setEx(
      `session:${session.serverSid}`,
      3600, // 1 hour TTL
      JSON.stringify(sessionToStore)
    );
  }

  async deleteSession(serverSid, redisClient) {
    await redisClient.del(`session:${serverSid}`);
  }

  async getAllSessions(redisClient) {
    const keys = await redisClient.keys('session:*');
    const sessions = [];
    
    for (const key of keys) {
      const sessionData = await redisClient.get(key);
      if (sessionData) {
        const session = JSON.parse(sessionData);
        
        // Restore cookie jar
        if (session.cookieJar) {
          const cookieJar = new CookieJar();
          cookieJar.deserializeSync(session.cookieJar);
          session.cookieJar = cookieJar;
        }
        
        sessions.push(session);
      }
    }
    
    return sessions;
  }
}

module.exports = new SessionManager();

