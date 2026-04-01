import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, Check, CheckCheck, Trash2, ExternalLink, Clock, Loader2 } from 'lucide-react'
import { useNotificationStore, NOTIFICATION_TYPES } from '../../store/notificationStore'
import { useNavigate } from 'react-router-dom'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NOTIFICATION CENTER — Real-time notifications panel
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function formatTimeAgo(timestamp) {
  const now = new Date()
  const date = new Date(timestamp)
  const diff = Math.floor((now - date) / 1000)

  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function NotificationItem({ notification, onRead, onDelete, onAction, dark }) {
  const meta = NOTIFICATION_TYPES[notification.type] || { icon: '📌', color: '#94a3b8' }
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      whileHover={{ x: 4 }}
      className={`relative p-4 rounded-xl border transition-all cursor-pointer group ${
        notification.read
          ? dark 
            ? 'bg-white/[0.02] border-white/5 hover:border-white/10' 
            : 'bg-gray-50 border-gray-100 hover:border-gray-200'
          : dark
            ? 'bg-white/[0.05] border-white/10 hover:border-white/20'
            : 'bg-blue-50/50 border-blue-100 hover:border-blue-200'
      }`}
      onClick={() => {
        if (!notification.read) onRead(notification.id)
        if (notification.actionUrl) onAction(notification.actionUrl)
      }}
    >
      {/* Unread indicator */}
      {!notification.read && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full"
          style={{ background: meta.color, boxShadow: `0 0 10px ${meta.color}` }}
        />
      )}
      
      <div className="flex gap-3">
        {/* Icon */}
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
          style={{ 
            background: `${meta.color}15`, 
            border: `1px solid ${meta.color}30`,
          }}
        >
          {meta.icon}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-semibold truncate pr-6 ${
            dark ? 'text-white' : 'text-gray-900'
          }`}>
            {notification.title}
          </h4>
          <p className={`text-xs mt-0.5 line-clamp-2 ${
            dark ? 'text-[#94a3b8]' : 'text-gray-500'
          }`}>
            {notification.message}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Clock size={10} className={dark ? 'text-[#94a3b8]/50' : 'text-gray-400'} />
            <span className={`text-[10px] ${dark ? 'text-[#94a3b8]/50' : 'text-gray-400'}`}>
              {formatTimeAgo(notification.timestamp)}
            </span>
            {notification.actionUrl && (
              <span className="flex items-center gap-1 text-[10px] ml-auto" style={{ color: meta.color }}>
                View <ExternalLink size={8} />
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Delete button */}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(notification.id) }}
        className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${
          dark ? 'hover:bg-white/10 text-[#94a3b8]' : 'hover:bg-gray-200 text-gray-400'
        }`}
      >
        <X size={12} />
      </button>
    </motion.div>
  )
}

export default function NotificationCenter({ dark = true }) {
  const navigate = useNavigate()
  const panelRef = useRef(null)
  const {
    notifications,
    unreadCount,
    isOpen,
    loading,
    setOpen,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationStore()
  
  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [setOpen])
  
  // Close on escape
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [setOpen])
  
  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!isOpen)}
        className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
          dark 
            ? 'bg-white/5 hover:bg-white/10 text-[#94a3b8] hover:text-white border border-white/10'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 border border-gray-200'
        }`}
      >
        <Bell size={18} />
        
        {/* Badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#ff4081] text-white text-[10px] font-bold flex items-center justify-center"
              style={{ boxShadow: '0 2px 8px rgba(255,64,129,0.5)' }}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Pulse animation when unread */}
        {unreadCount > 0 && (
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-xl border-2 border-[#ff4081]"
          />
        )}
      </motion.button>
      
      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`absolute right-0 top-14 w-[380px] max-h-[520px] rounded-2xl overflow-hidden shadow-2xl border z-50 ${
              dark 
                ? 'bg-[#0c1628] border-[#1e3a5f]' 
                : 'bg-white border-gray-200'
            }`}
            style={{ 
              boxShadow: dark 
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' 
                : '0 25px 50px -12px rgba(0, 0, 0, 0.15)' 
            }}
          >
            {/* Header */}
            <div className={`flex items-center justify-between px-5 py-4 border-b ${
              dark ? 'border-white/10' : 'border-gray-100'
            }`}>
              <div className="flex items-center gap-3">
                <h3 className={`font-heading font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ff4081]/10 text-[#ff4081] border border-[#ff4081]/20">
                    {unreadCount} new
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      dark 
                        ? 'text-[#00e5ff] hover:bg-[#00e5ff]/10' 
                        : 'text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <CheckCheck size={12} /> Mark all read
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    dark ? 'hover:bg-white/10 text-[#94a3b8]' : 'hover:bg-gray-100 text-gray-400'
                  }`}
                >
                  <X size={14} />
                </button>
              </div>
            </div>
            
            {/* Notifications list */}
            <div className="max-h-[400px] overflow-y-auto p-3 space-y-2">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-[#00e5ff]" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                    dark ? 'bg-white/5' : 'bg-gray-100'
                  }`}>
                    <Bell size={28} className={dark ? 'text-[#94a3b8]/30' : 'text-gray-300'} />
                  </div>
                  <p className={`text-sm font-medium ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>
                    No notifications yet
                  </p>
                  <p className={`text-xs ${dark ? 'text-[#94a3b8]/60' : 'text-gray-400'}`}>
                    We'll notify you when something happens
                  </p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {notifications.map(notification => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      dark={dark}
                      onRead={markAsRead}
                      onDelete={deleteNotification}
                      onAction={(url) => {
                        navigate(url)
                        setOpen(false)
                      }}
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>
            
            {/* Footer */}
            {notifications.length > 0 && (
              <div className={`px-5 py-3 border-t ${dark ? 'border-white/10' : 'border-gray-100'}`}>
                <button
                  onClick={() => {
                    navigate('/dashboard/notifications')
                    setOpen(false)
                  }}
                  className={`w-full py-2 rounded-lg text-xs font-medium transition-colors ${
                    dark 
                      ? 'text-[#00e5ff] hover:bg-[#00e5ff]/10' 
                      : 'text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  View all notifications
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
