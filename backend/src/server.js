import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import contactRouter from './routes/contact.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())

// Routes
app.use('/api/contact', contactRouter)

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => {
  console.log(`Xinity backend running on http://localhost:${PORT}`)
})
