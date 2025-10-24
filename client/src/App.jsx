import React, { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header'
import Inbox from './components/Inbox'
import MessageView from './components/MessageView'
import Settings from './components/Settings'
import StatusIndicator from './components/StatusIndicator'
import { EmailProvider, useEmailContext } from './contexts/EmailContext'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'

function AppContent() {
  const { status, isMock } = useEmailContext()
  const { isDark } = useTheme()

  useEffect(() => {
    // Apply theme to document
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'bg-dark-800 text-white border border-dark-600',
          duration: 4000,
        }}
      />
      
      <div className="container mx-auto px-4 py-6">
        <Header />
        
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Inbox />
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <StatusIndicator status={status} isMock={isMock} />
            <Settings />
          </div>
        </div>
        
        {/* Message View Modal */}
        <MessageView />
      </div>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <EmailProvider>
        <AppContent />
      </EmailProvider>
    </ThemeProvider>
  )
}

export default App
