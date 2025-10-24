import React from 'react'
import { Mail, Copy, RefreshCw } from 'lucide-react'
import { useEmailContext } from '../contexts/EmailContext'
import { useTheme } from '../contexts/ThemeContext'
import toast from 'react-hot-toast'

function Header() {
  const { tempMailAddress, loadEmails, isLoading } = useEmailContext()
  const { isDark, toggleTheme } = useTheme()

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(tempMailAddress)
      toast.success('Email address copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy email address')
    }
  }

  return (
    <header className="glass rounded-2xl p-6 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary-600 rounded-xl">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Guerrilla Mail</h1>
            <p className="text-dark-400 text-sm">Secure temporary email service</p>
          </div>
        </div>

        {/* Email Address Display */}
        {tempMailAddress && (
          <div className="flex-1 max-w-2xl">
            <div className="glass-dark rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-dark-400 text-sm mb-1">Your temporary email:</p>
                  <p className="text-white font-mono text-lg break-all">
                    {tempMailAddress}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="btn-primary flex items-center gap-2"
                    title="Copy email address"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                  <button
                    onClick={loadEmails}
                    disabled={isLoading}
                    className="btn-secondary flex items-center gap-2"
                    title="Refresh inbox"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-3 glass-dark rounded-xl hover:bg-dark-700 transition-colors duration-200"
          title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
          {isDark ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  )
}

export default Header

