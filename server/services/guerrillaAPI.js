const axios = require('axios');
const { CookieJar } = require('tough-cookie');

const CONFIG = {
  API_BASE: 'https://api.guerrillamail.com/ajax.php',
  MAX_RETRIES: 3,
  RETRY_DELAY: 2000,
  REQUEST_TIMEOUT: 10000,
  DOMAINS: [
    'guerrillamail.com',
    'guerrillamail.net', 
    'guerrillamail.org',
    'guerrillamailblock.com',
    'grr.la',
    'pokemail.net',
    'spam4.me'
  ]
};

class GuerrillaAPI {
  constructor() {
    this.axios = axios.create({
      timeout: CONFIG.REQUEST_TIMEOUT,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
  }

  async makeRequest(params, cookieJar) {
    const options = {
      method: 'GET',
      url: CONFIG.API_BASE,
      params: params,
      timeout: CONFIG.REQUEST_TIMEOUT,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };

    if (cookieJar) {
      // Set cookies from jar
      const cookieString = cookieJar.getCookieStringSync(CONFIG.API_BASE);
      if (cookieString) {
        options.headers.Cookie = cookieString;
      }
    }

    let lastError;
    for (let attempt = 1; attempt <= CONFIG.MAX_RETRIES; attempt++) {
      try {
        const response = await this.axios(options);
        const data = response.data;
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        // Update cookie jar with response cookies
        if (cookieJar && response.headers['set-cookie']) {
          response.headers['set-cookie'].forEach(cookie => {
            cookieJar.setCookieSync(cookie, CONFIG.API_BASE);
          });
        }
        
        return data;
      } catch (error) {
        lastError = error;
        if (attempt < CONFIG.MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY * attempt));
        }
      }
    }
    
    throw lastError;
  }

  async getEmailAddress(cookieJar) {
    const params = {
      f: 'get_email_address'
    };
    
    try {
      const response = await this.makeRequest(params, cookieJar);
      console.log('GuerrillaMail API response:', response);
      
      if (!response.email_addr) {
        throw new Error('No email address received from GuerrillaMail API');
      }
      
      return {
        success: true,
        email_addr: response.email_addr,
        email_timestamp: response.email_timestamp,
        alias: response.alias,
        sid_token: response.sid_token
      };
    } catch (error) {
      console.error('GuerrillaMail API error:', error);
      throw error;
    }
  }

  async setEmailUser(emailUser, cookieJar) {
    const params = {
      f: 'set_email_user',
      email_user: emailUser
    };
    
    const response = await this.makeRequest(params, cookieJar);
    return {
      success: true,
      email_addr: response.email_addr,
      email_timestamp: response.email_timestamp,
      alias: response.alias,
      sid_token: response.sid_token
    };
  }

  async getEmailList(cookieJar) {
    const params = {
      f: 'get_email_list',
      offset: 0
    };
    
    try {
      const response = await this.makeRequest(params, cookieJar);
      console.log('Email list response:', response);
      return response.list || [];
    } catch (error) {
      console.error('Failed to get email list from GuerrillaMail API:', error);
      // Return empty list for mock sessions
      return [];
    }
  }

  async fetchEmail(emailId, cookieJar) {
    const params = {
      f: 'fetch_email',
      email_id: emailId
    };
    
    try {
      const response = await this.makeRequest(params, cookieJar);
      console.log('GuerrillaMail fetch email response:', response);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      return {
        success: true,
        message: response
      };
    } catch (error) {
      console.error('GuerrillaMail fetch email error:', error);
      throw error;
    }
  }

  async deleteEmail(emailId, cookieJar) {
    const params = {
      f: 'del_email',
      email_id: emailId
    };
    
    const response = await this.makeRequest(params, cookieJar);
    return {
      success: true,
      result: response
    };
  }

  async forgetMe(cookieJar) {
    const params = {
      f: 'forget_me'
    };
    
    const response = await this.makeRequest(params, cookieJar);
    return {
      success: true,
      result: response
    };
  }

  getRandomDomain() {
    return CONFIG.DOMAINS[Math.floor(Math.random() * CONFIG.DOMAINS.length)];
  }

  generateRandomEmail() {
    const randomStr = Math.random().toString(36).substring(2, 8);
    const domain = this.getRandomDomain();
    return `${randomStr}@${domain}`;
  }
}

module.exports = new GuerrillaAPI();

