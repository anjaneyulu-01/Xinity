import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import contactRouter from './routes/contact.js'
import registerRouter from './routes/register.js'

const app = express()
const PORT = process.env.PORT || 5001

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())

// Routes
app.use('/api/contact', contactRouter)
app.use('/api/register', registerRouter)

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

const server = app.listen(PORT, () => {
  console.log(`Xinity backend running on http://localhost:${PORT}`)
})

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is in use. Set a different PORT in .env`)
    process.exit(1)
  }
})
