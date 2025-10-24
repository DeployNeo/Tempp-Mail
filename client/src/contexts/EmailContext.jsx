import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { io } from 'socket.io-client'
import { emailAPI } from '../services/api'
import toast from 'react-hot-toast'

const EmailContext = createContext()

const initialState = {
  status: 'offline', // 'online', 'offline', 'loading'
  serverSid: null,
  tempMailAddress: '',
  emails: [],
  selectedMessage: null,
  isLoading: false,
  autoRefresh: false,
  refreshInterval: 30,
  socket: null,
  isMock: false // Track if using mock emails
}

function emailReducer(state, action) {
  switch (action.type) {
    case 'SET_STATUS':
      return { ...state, status: action.payload }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_SESSION':
      return { 
        ...state, 
        serverSid: action.payload.serverSid,
        tempMailAddress: action.payload.tempMailAddress,
        isMock: action.payload.isMock || false
      }
    case 'SET_EMAILS':
      return { ...state, emails: action.payload }
    case 'ADD_EMAILS':
      return { ...state, emails: [...action.payload, ...state.emails] }
    case 'SET_SELECTED_MESSAGE':
      return { ...state, selectedMessage: action.payload }
    case 'REMOVE_EMAIL':
      return { 
        ...state, 
        emails: state.emails.filter(email => email.mail_id !== action.payload),
        selectedMessage: state.selectedMessage?.mail_id === action.payload ? null : state.selectedMessage
      }
    case 'SET_AUTO_REFRESH':
      return { ...state, autoRefresh: action.payload }
    case 'SET_REFRESH_INTERVAL':
      return { ...state, refreshInterval: action.payload }
    case 'SET_SOCKET':
      return { ...state, socket: action.payload }
    default:
      return state
  }
}

export function EmailProvider({ children }) {
  const [state, dispatch] = useReducer(emailReducer, initialState)

  // Initialize session on mount
  useEffect(() => {
    initializeSession()
  }, [])

  // Socket.io connection
  useEffect(() => {
    if (state.serverSid) {
      const socket = io()
      socket.emit('subscribe', state.serverSid)
      
      socket.on('mail:update', (data) => {
        dispatch({ type: 'ADD_EMAILS', payload: data.emails })
        toast.success(`New email received!`)
      })
      
      dispatch({ type: 'SET_SOCKET', payload: socket })
      
      return () => {
        socket.disconnect()
      }
    }
  }, [state.serverSid])

  // Auto-refresh functionality
  useEffect(() => {
    if (state.autoRefresh && state.serverSid) {
      const interval = setInterval(() => {
        loadEmails()
      }, state.refreshInterval * 1000)
      
      return () => clearInterval(interval)
    }
  }, [state.autoRefresh, state.refreshInterval, state.serverSid])

  const initializeSession = async () => {
    try {
      dispatch({ type: 'SET_STATUS', payload: 'loading' })
      
      // Try to restore session from localStorage
      const savedSession = localStorage.getItem('guerrilla_session')
      let sessionData
      
      if (savedSession) {
        const parsed = JSON.parse(savedSession)
        sessionData = await emailAPI.createSession(parsed.serverSid)
      } else {
        sessionData = await emailAPI.createSession()
      }
      
      if (sessionData.success) {
        dispatch({ 
          type: 'SET_SESSION', 
          payload: {
            serverSid: sessionData.serverSid,
            tempMailAddress: sessionData.tempMailAddress,
            isMock: sessionData.isMock || false
          }
        })
        
        // Save session to localStorage
        localStorage.setItem('guerrilla_session', JSON.stringify({
          serverSid: sessionData.serverSid,
          tempMailAddress: sessionData.tempMailAddress
        }))
        
        dispatch({ type: 'SET_STATUS', payload: 'online' })
        await loadEmails()
      }
    } catch (error) {
      console.error('Session initialization error:', error)
      dispatch({ type: 'SET_STATUS', payload: 'offline' })
      toast.error('Failed to initialize session')
    }
  }

  const loadEmails = async () => {
    if (!state.serverSid) return
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await emailAPI.getInbox(state.serverSid)
      
      if (response.success) {
        dispatch({ type: 'SET_EMAILS', payload: response.emails })
      }
    } catch (error) {
      console.error('Load emails error:', error)
      toast.error('Failed to load emails')
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const fetchMessage = async (messageId) => {
    if (!state.serverSid) return
    
    try {
      const response = await emailAPI.getMessage(messageId, state.serverSid)
      if (response.success) {
        dispatch({ type: 'SET_SELECTED_MESSAGE', payload: response.message })
      }
    } catch (error) {
      console.error('Fetch message error:', error)
      toast.error('Failed to fetch message')
    }
  }

  const closeMessage = () => {
    dispatch({ type: 'SET_SELECTED_MESSAGE', payload: null })
  }

  const deleteMessage = async (messageId) => {
    if (!state.serverSid) return
    
    try {
      const response = await emailAPI.deleteMessage(messageId, state.serverSid)
      if (response.success) {
        dispatch({ type: 'REMOVE_EMAIL', payload: messageId })
        toast.success('Email deleted')
      }
    } catch (error) {
      console.error('Delete message error:', error)
      toast.error('Failed to delete email')
    }
  }

  const setEmailUser = async (emailUser) => {
    if (!state.serverSid) return
    
    try {
      const response = await emailAPI.setEmailUser(emailUser, state.serverSid)
      if (response.success) {
        dispatch({ 
          type: 'SET_SESSION', 
          payload: {
            serverSid: state.serverSid,
            tempMailAddress: response.email_addr
          }
        })
        
        // Update localStorage
        localStorage.setItem('guerrilla_session', JSON.stringify({
          serverSid: state.serverSid,
          tempMailAddress: response.email_addr
        }))
        
        toast.success('Email address updated')
      }
    } catch (error) {
      console.error('Set email user error:', error)
      toast.error('Failed to update email address')
    }
  }

  const forgetSession = async () => {
    if (!state.serverSid) return
    
    try {
      await emailAPI.forgetSession(state.serverSid)
      localStorage.removeItem('guerrilla_session')
      dispatch({ type: 'SET_SESSION', payload: { serverSid: null, tempMailAddress: '' } })
      dispatch({ type: 'SET_EMAILS', payload: [] })
      dispatch({ type: 'SET_SELECTED_MESSAGE', payload: null })
      toast.success('Session cleared')
    } catch (error) {
      console.error('Forget session error:', error)
      toast.error('Failed to clear session')
    }
  }

  const value = {
    ...state,
    loadEmails,
    fetchMessage,
    closeMessage,
    deleteMessage,
    setEmailUser,
    forgetSession,
    setAutoRefresh: (enabled) => dispatch({ type: 'SET_AUTO_REFRESH', payload: enabled }),
    setRefreshInterval: (interval) => dispatch({ type: 'SET_REFRESH_INTERVAL', payload: interval })
  }

  return (
    <EmailContext.Provider value={value}>
      {children}
    </EmailContext.Provider>
  )
}

export function useEmailContext() {
  const context = useContext(EmailContext)
  if (!context) {
    throw new Error('useEmailContext must be used within an EmailProvider')
  }
  return context
}

