import axios from 'axios'

const API_BASE = '/api'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error)
    throw error
  }
)

export const emailAPI = {
  async createSession(serverSid = null) {
    try {
      const response = await api.post('/session', { serverSid })
      return response
    } catch (error) {
      throw new Error('Failed to create session')
    }
  },

  async getInbox(serverSid) {
    try {
      const response = await api.get(`/inbox?serverSid=${serverSid}`)
      return response
    } catch (error) {
      throw new Error('Failed to fetch inbox')
    }
  },

  async getMessage(messageId, serverSid) {
    try {
      const response = await api.get(`/message/${messageId}?serverSid=${serverSid}`)
      return response
    } catch (error) {
      throw new Error('Failed to fetch message')
    }
  },

  async deleteMessage(messageId, serverSid) {
    try {
      const response = await api.delete(`/message/${messageId}?serverSid=${serverSid}`)
      return response
    } catch (error) {
      throw new Error('Failed to delete message')
    }
  },

  async setEmailUser(emailUser, serverSid) {
    try {
      const response = await api.post('/set-user', { 
        serverSid, 
        emailUser 
      })
      return response
    } catch (error) {
      throw new Error('Failed to set email user')
    }
  },

  async forgetSession(serverSid) {
    try {
      const response = await api.post('/forget', { serverSid })
      return response
    } catch (error) {
      throw new Error('Failed to forget session')
    }
  }
}

export default emailAPI

