import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings as SettingsIcon, RefreshCw, Trash2, Mail, Clock } from 'lucide-react'
import { useEmailContext } from '../contexts/EmailContext'
import toast from 'react-hot-toast'

function Settings() {
  const { 
    tempMailAddress, 
    autoRefresh, 
    refreshInterval, 
    setAutoRefresh, 
    setRefreshInterval, 
    setEmailUser, 
    forgetSession 
  } = useEmailContext()
  
  const [customEmail, setCustomEmail] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleSetCustomEmail = async () => {
    if (!customEmail.trim()) {
      toast.error('Please enter a custom email')
      return
    }

    setIsGenerating(true)
    try {
      await setEmailUser(customEmail.trim())
      setCustomEmail('')
    } catch (error) {
      toast.error('Failed to set custom email')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleForgetSession = async () => {
    if (window.confirm('Are you sure you want to clear your session? This will delete all emails and reset your temporary address.')) {
      await forgetSession()
    }
  }

  const refreshIntervals = [
    { value: 10, label: '10 seconds' },
    { value: 30, label: '30 seconds' },
    { value: 60, label: '1 minute' },
    { value: 300, label: '5 minutes' }
  ]

  return (
    <div className="space-y-6">
      {/* Settings Panel */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <SettingsIcon className="w-6 h-6 text-primary-500" />
          <h3 className="text-xl font-semibold text-white">Settings</h3>
        </div>

        <div className="space-y-6">
          {/* Auto Refresh */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-white font-medium flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Auto Refresh
              </label>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  autoRefresh ? 'bg-primary-600' : 'bg-dark-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    autoRefresh ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            {autoRefresh && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <label className="text-dark-400 text-sm">Refresh Interval</label>
                <select
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
                  className="input-field w-full"
                >
                  {refreshIntervals.map(interval => (
                    <option key={interval.value} value={interval.value}>
                      {interval.label}
                    </option>
                  ))}
                </select>
              </motion.div>
            )}
          </div>

          {/* Custom Email */}
          <div className="space-y-3">
            <label className="text-white font-medium flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Custom Email Address
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter custom username"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="input-field flex-1"
              />
              <button
                onClick={handleSetCustomEmail}
                disabled={isGenerating}
                className="btn-primary flex items-center gap-2"
              >
                {isGenerating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Mail className="w-4 h-4" />
                )}
                Set
              </button>
            </div>
            <p className="text-dark-400 text-xs">
              Choose a custom username for your temporary email
            </p>
          </div>

          {/* Current Email Display */}
          {tempMailAddress && (
            <div className="glass-dark rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-primary-500" />
                <span className="text-white font-medium">Current Address</span>
              </div>
              <p className="text-dark-400 text-sm font-mono break-all">
                {tempMailAddress}
              </p>
            </div>
          )}

          {/* Danger Zone */}
          <div className="border-t border-dark-700 pt-6">
            <h4 className="text-red-400 font-medium mb-3">Danger Zone</h4>
            <button
              onClick={handleForgetSession}
              className="btn-secondary text-red-400 hover:bg-red-600/20 hover:border-red-600 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear Session
            </button>
            <p className="text-dark-500 text-xs mt-2">
              This will delete all emails and reset your temporary address
            </p>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="glass rounded-2xl p-6">
        <h4 className="text-white font-medium mb-4">About Guerrilla Mail</h4>
        <div className="space-y-3 text-sm text-dark-400">
          <p>
            Guerrilla Mail provides secure, temporary email addresses that automatically expire.
          </p>
          <p>
            Your emails are stored temporarily and will be deleted after a period of inactivity.
          </p>
          <p>
            This service is perfect for protecting your privacy and avoiding spam.
          </p>
        </div>
        
        <div className="mt-6 pt-4 border-t border-dark-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <div>
              <p className="text-white font-medium">Made by Neo</p>
              <p className="text-dark-400 text-xs">@neogotchicks</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings

