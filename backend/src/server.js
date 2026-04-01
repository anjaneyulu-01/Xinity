import express from 'express'
import cors from 'cors'
import http from 'http'
import { Server as SocketIOServer } from 'socket.io'
import 'dotenv/config'
import { connectDB } from './db.js'
import { seedSubmissions } from './seed.js'

import contactRouter     from './routes/contact.js'
import registerRouter    from './routes/register.js'
import submissionsRouter from './routes/submissions.js'
import reviewsRouter     from './routes/reviews.js'
import eventsRouter      from './routes/events.js'

const app  = express()
const PORT = process.env.PORT || 5001

// Create HTTP server and Socket.io
const server = http.createServer(app)
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
})

// Make io accessible to routes
app.set('io', io)

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())

// ── Socket.io Connection Handling ───────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`)
  
  // Track online users
  socket.on('user:online', (userData) => {
    socket.userData = userData
    io.emit('presence:update', { userId: userData?.id, status: 'online' })
  })
  
  // Join specific rooms (e.g., event room, team room)
  socket.on('join:event', (eventId) => {
    socket.join(`event:${eventId}`)
    console.log(`${socket.id} joined event:${eventId}`)
  })
  
  socket.on('join:team', (teamId) => {
    socket.join(`team:${teamId}`)
    console.log(`${socket.id} joined team:${teamId}`)
  })
  
  // Leave rooms
  socket.on('leave:event', (eventId) => socket.leave(`event:${eventId}`))
  socket.on('leave:team', (teamId) => socket.leave(`team:${teamId}`))
  
  // Real-time typing indicators
  socket.on('typing:start', ({ room, user }) => {
    socket.to(room).emit('typing:update', { user, isTyping: true })
  })
  
  socket.on('typing:stop', ({ room, user }) => {
    socket.to(room).emit('typing:update', { user, isTyping: false })
  })
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`🔌 User disconnected: ${socket.id}`)
    if (socket.userData?.id) {
      io.emit('presence:update', { userId: socket.userData.id, status: 'offline' })
    }
  })
})

// ── Helper function to emit events ──────────────────────────────────────────
export function emitEvent(eventName, data, room = null) {
  if (room) {
    io.to(room).emit(eventName, data)
  } else {
    io.emit(eventName, data)
  }
}

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/contact',     contactRouter)
app.use('/api/register',    registerRouter)
app.use('/api/submissions', submissionsRouter)
app.use('/api/reviews',     reviewsRouter)
app.use('/api/events',      eventsRouter)

// Health check with real-time stats
app.get('/api/health', (_req, res) => {
  const connectedClients = io.engine.clientsCount
  res.json({ 
    status: 'ok', 
    db: 'connected', 
    ts: new Date().toISOString(),
    realtime: {
      enabled: true,
      connections: connectedClients,
    }
  })
})

// Real-time stats endpoint
app.get('/api/realtime/stats', (_req, res) => {
  const sockets = io.sockets.sockets
  const rooms = io.sockets.adapter.rooms
  
  res.json({
    connections: io.engine.clientsCount,
    rooms: Array.from(rooms.keys()).filter(r => r.startsWith('event:') || r.startsWith('team:')),
  })
})

// ── Boot ─────────────────────────────────────────────────────────────────────
async function boot() {
  await connectDB()
  await seedSubmissions()

  server.listen(PORT, () =>
    console.log(`🚀 Xinity backend → http://localhost:${PORT}`)
  )

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is in use. Set a different PORT in .env`)
      process.exit(1)
    }
  })
}

boot()

export { io }
