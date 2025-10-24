import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Search, Trash2, Eye, Clock, User } from 'lucide-react'
import { useEmailContext } from '../contexts/EmailContext'
import toast from 'react-hot-toast'

function Inbox() {
  const { emails, isLoading, fetchMessage, deleteMessage } = useEmailContext()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEmail, setSelectedEmail] = useState(null)

  const filteredEmails = emails.filter(email => {
    const searchLower = searchTerm.toLowerCase()
    return (
      email.mail_from?.toLowerCase().includes(searchLower) ||
      email.mail_subject?.toLowerCase().includes(searchLower) ||
      email.mail_excerpt?.toLowerCase().includes(searchLower)
    )
  })

  const handleViewEmail = async (email) => {
    setSelectedEmail(email)
    await fetchMessage(email.mail_id)
  }

  const handleDeleteEmail = async (emailId, e) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this email?')) {
      await deleteMessage(emailId)
    }
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000)
    const now = new Date()
    const diff = now - date
    
    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Mail className="w-6 h-6 text-primary-500" />
          <h2 className="text-xl font-semibold text-white">Inbox</h2>
          <span className="bg-primary-600 text-white text-sm px-2 py-1 rounded-full">
            {filteredEmails.length}
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search emails..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field w-full pl-10"
        />
      </div>

      {/* Email List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : filteredEmails.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="w-16 h-16 text-dark-600 mx-auto mb-4" />
            <p className="text-dark-400 text-lg">
              {searchTerm ? 'No emails match your search' : 'No emails yet'}
            </p>
            <p className="text-dark-500 text-sm mt-2">
              {searchTerm ? 'Try a different search term' : 'Your temporary email is ready to receive messages'}
            </p>
          </div>
        ) : (
          filteredEmails.map((email, index) => (
            <motion.div
              key={email.mail_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-dark rounded-xl p-4 hover:bg-dark-700/50 transition-all duration-200 cursor-pointer group"
              onClick={() => handleViewEmail(email)}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-white font-medium truncate">
                      {email.mail_from || 'Unknown Sender'}
                    </p>
                    <span className="text-dark-400 text-sm flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(email.mail_timestamp)}
                    </span>
                  </div>
                  
                  <p className="text-white font-medium mb-1 truncate">
                    {email.mail_subject || 'No Subject'}
                  </p>
                  
                  {email.mail_excerpt && (
                    <p className="text-dark-400 text-sm line-clamp-2">
                      {email.mail_excerpt}
                    </p>
                  )}
                </div>
                
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={(e) => handleViewEmail(email)}
                    className="p-2 hover:bg-dark-600 rounded-lg transition-colors duration-200"
                    title="View email"
                  >
                    <Eye className="w-4 h-4 text-dark-400" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteEmail(email.mail_id, e)}
                    className="p-2 hover:bg-red-600/20 rounded-lg transition-colors duration-200"
                    title="Delete email"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

export default Inbox

