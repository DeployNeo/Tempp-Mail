import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Clock, Paperclip, Download } from 'lucide-react'
import { useEmailContext } from '../contexts/EmailContext'

function MessageView() {
  const { selectedMessage, fetchMessage, closeMessage } = useEmailContext()

  if (!selectedMessage) return null

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleString()
  }

  const handleDownloadAttachment = (attachment) => {
    // Create a blob and download the attachment
    const blob = new Blob([attachment.data], { type: attachment.content_type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = attachment.file_name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={closeMessage}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Email Details</h3>
            <button
              onClick={closeMessage}
              className="p-2 hover:bg-dark-700 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5 text-dark-400" />
            </button>
          </div>

          {/* Email Content */}
          <div className="space-y-6">
            {/* Sender Info */}
            <div className="glass-dark rounded-xl p-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium text-lg">
                    {selectedMessage.mail_from || 'Unknown Sender'}
                  </p>
                  <p className="text-dark-400 text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {formatDate(selectedMessage.mail_timestamp)}
                  </p>
                </div>
              </div>
              
              <h2 className="text-white font-semibold text-xl mb-4">
                {selectedMessage.mail_subject || 'No Subject'}
              </h2>
            </div>

            {/* Attachments */}
            {selectedMessage.mail_attachments && selectedMessage.mail_attachments.length > 0 && (
              <div className="glass-dark rounded-xl p-4">
                <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                  <Paperclip className="w-4 h-4" />
                  Attachments ({selectedMessage.mail_attachments.length})
                </h4>
                <div className="space-y-2">
                  {selectedMessage.mail_attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-dark-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Paperclip className="w-4 h-4 text-primary-500" />
                        <span className="text-white text-sm">
                          {attachment.file_name}
                        </span>
                        <span className="text-dark-400 text-xs">
                          ({attachment.content_type})
                        </span>
                      </div>
                      <button
                        onClick={() => handleDownloadAttachment(attachment)}
                        className="btn-primary flex items-center gap-2 text-sm"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Email Body */}
            <div className="glass-dark rounded-xl p-4">
              <h4 className="text-white font-medium mb-3">Message Content</h4>
              <div className="prose prose-invert max-w-none">
                {selectedMessage.mail_body ? (
                  <div 
                    className="text-white"
                    dangerouslySetInnerHTML={{ 
                      __html: selectedMessage.mail_body.replace(/\n/g, '<br>') 
                    }}
                  />
                ) : (
                  <p className="text-dark-400 italic">No content available</p>
                )}
              </div>
            </div>

            {/* Raw Email (for debugging) */}
            {process.env.NODE_ENV === 'development' && (
              <details className="glass-dark rounded-xl p-4">
                <summary className="text-white font-medium cursor-pointer">
                  Raw Email Data (Debug)
                </summary>
                <pre className="text-xs text-dark-400 mt-3 overflow-x-auto">
                  {JSON.stringify(selectedMessage, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default MessageView

