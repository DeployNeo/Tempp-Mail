import React from 'react'
import { motion } from 'framer-motion'
import { Wifi, WifiOff, Loader } from 'lucide-react'

function StatusIndicator({ status, isMock = false }) {
  const getStatusConfig = () => {
    if (isMock) {
      return {
        icon: Wifi,
        text: 'Demo Mode',
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/20',
        borderColor: 'border-blue-500/30',
        pulse: 'animate-pulse-slow'
      }
    }
    
    switch (status) {
      case 'online':
        return {
          icon: Wifi,
          text: 'Online',
          color: 'text-green-500',
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-500/30',
          pulse: 'animate-pulse-slow'
        }
      case 'loading':
        return {
          icon: Loader,
          text: 'Loading',
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-500/20',
          borderColor: 'border-yellow-500/30',
          pulse: 'animate-spin'
        }
      case 'offline':
      default:
        return {
          icon: WifiOff,
          text: 'Offline',
          color: 'text-red-500',
          bgColor: 'bg-red-500/20',
          borderColor: 'border-red-500/30',
          pulse: ''
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-2xl p-4"
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${config.bgColor} ${config.borderColor} border`}>
          <Icon className={`w-5 h-5 ${config.color} ${config.pulse}`} />
        </div>
        <div>
          <p className="text-white font-medium">Connection Status</p>
          <p className={`text-sm ${config.color}`}>{config.text}</p>
        </div>
      </div>
      
      {isMock && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-xs text-dark-400"
        >
          <p>📧 Demo mode with sample emails</p>
          <p>GuerrillaMail API not available</p>
        </motion.div>
      )}
      
      {!isMock && status === 'online' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-xs text-dark-400"
        >
          <p>✓ Connected to Guerrilla Mail API</p>
          <p>✓ Real-time updates enabled</p>
        </motion.div>
      )}
      
      {!isMock && status === 'loading' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-xs text-dark-400"
        >
          <p>Connecting to Guerrilla Mail API...</p>
        </motion.div>
      )}
      
      {!isMock && status === 'offline' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-xs text-dark-400"
        >
          <p>✗ Unable to connect to Guerrilla Mail API</p>
          <p>Check your internet connection</p>
        </motion.div>
      )}
    </motion.div>
  )
}

export default StatusIndicator

