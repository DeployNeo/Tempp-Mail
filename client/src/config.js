export const CONFIG = {
  API_BASE: '/api',
  EMAIL_KEY: 'temp_mail_address',
  SESSION_KEY: 'guerrilla_session_id',
  AUTO_REFRESH_KEY: 'temp_mail_auto_refresh',
  REFRESH_INTERVAL_KEY: 'temp_mail_refresh_interval',
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
  ],
  STATUS: {
    ONLINE: { text: 'Online', class: 'online' },
    OFFLINE: { text: 'Offline', class: 'offline' },
    LOADING: { text: 'Loading', class: 'loading' }
  }
}

