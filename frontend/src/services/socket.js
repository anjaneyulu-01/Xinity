import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001'

class SocketService {
  constructor() {
    this.socket = null
    this.listeners = new Map()
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
  }

  connect(userData = null) {
    if (this.socket?.connected) return this.socket

    this.socket = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      transports: ['websocket', 'polling'],
    })

    this.socket.on('connect', () => {
      console.log('🔌 Socket connected:', this.socket.id)
      this.reconnectAttempts = 0
      if (userData) {
        this.socket.emit('user:online', userData)
      }
    })

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason)
    })

    this.socket.on('connect_error', (error) => {
      console.warn('🔌 Socket connection error:', error.message)
      this.reconnectAttempts++
    })

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  // ── Room Management ───────────────────────────────────────────────────────
  joinEvent(eventId) {
    this.socket?.emit('join:event', eventId)
  }

  leaveEvent(eventId) {
    this.socket?.emit('leave:event', eventId)
  }

  joinTeam(teamId) {
    this.socket?.emit('join:team', teamId)
  }

  leaveTeam(teamId) {
    this.socket?.emit('leave:team', teamId)
  }

  // ── Typing Indicators ─────────────────────────────────────────────────────
  startTyping(room, user) {
    this.socket?.emit('typing:start', { room, user })
  }

  stopTyping(room, user) {
    this.socket?.emit('typing:stop', { room, user })
  }

  // ── Event Listeners ───────────────────────────────────────────────────────
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event).add(callback)
    this.socket?.on(event, callback)
    return () => this.off(event, callback)
  }

  off(event, callback) {
    this.listeners.get(event)?.delete(callback)
    this.socket?.off(event, callback)
  }

  once(event, callback) {
    this.socket?.once(event, callback)
  }

  // ── Emit Events ───────────────────────────────────────────────────────────
  emit(event, data) {
    this.socket?.emit(event, data)
  }

  // ── Status ────────────────────────────────────────────────────────────────
  get isConnected() {
    return this.socket?.connected || false
  }

  get socketId() {
    return this.socket?.id || null
  }
}

// Singleton instance
export const socketService = new SocketService()
export default socketService
