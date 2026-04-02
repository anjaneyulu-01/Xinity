import { Router } from 'express'
import Certificate from '../models/Certificate.js'

const router = Router()

// GET /api/certificates - Get all certificates (admin)
router.get('/', async (req, res) => {
  try {
    const { eventId, type } = req.query
    const filter = {}
    if (eventId) filter.eventId = eventId
    if (type) filter.type = type
    
    const certs = await Certificate.find(filter).sort({ issuedAt: -1 })
    res.json({ success: true, data: certs })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/certificates/my - Get current user's certificates
router.get('/my', async (req, res) => {
  try {
    const userId = req.headers['x-user-id']
    if (!userId) return res.status(401).json({ success: false, error: 'Not authenticated' })
    
    const certs = await Certificate.find({ userId }).sort({ issuedAt: -1 })
    res.json({ success: true, data: certs })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/certificates/verify/:id - Verify certificate
router.get('/verify/:id', async (req, res) => {
  try {
    const cert = await Certificate.findOne({ verificationId: req.params.id })
    if (!cert) return res.status(404).json({ success: false, error: 'Certificate not found' })
    res.json({ success: true, data: cert, verified: true })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/certificates/:id - Get certificate by ID
router.get('/:id', async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id)
    if (!cert) return res.status(404).json({ success: false, error: 'Certificate not found' })
    res.json({ success: true, data: cert })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/certificates/:id/download - Download certificate
router.get('/:id/download', async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id)
    if (!cert) return res.status(404).json({ success: false, error: 'Certificate not found' })
    
    // Update download stats
    cert.downloadCount += 1
    cert.lastDownloadedAt = new Date()
    await cert.save()
    
    // In production: generate PDF with puppeteer/pdfkit
    // For now, return a simple HTML that can be converted to PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Georgia', serif; text-align: center; padding: 60px; background: linear-gradient(135deg, #04040f, #0a1628); color: white; min-height: 100vh; }
          .certificate { border: 3px solid #00e5ff; padding: 60px; max-width: 800px; margin: 0 auto; background: rgba(0,0,0,0.5); }
          .logo { font-size: 48px; font-weight: bold; color: #00e5ff; margin-bottom: 20px; }
          .title { font-size: 36px; margin: 30px 0; }
          .name { font-size: 48px; color: #ffd600; margin: 30px 0; }
          .event { font-size: 24px; margin: 20px 0; }
          .rank { font-size: 28px; color: #00e676; margin: 20px 0; }
          .verify { font-size: 14px; color: #94a3b8; margin-top: 40px; }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="logo">XINITY</div>
          <div class="title">Certificate of ${cert.type === 'winner' ? 'Achievement' : 'Participation'}</div>
          <div class="name">${cert.userName}</div>
          <div class="event">${cert.eventName}</div>
          ${cert.rank ? `<div class="rank">${cert.rank}</div>` : ''}
          <div class="verify">Verification ID: ${cert.verificationId}</div>
          <div class="verify">Issued on: ${new Date(cert.issuedAt).toLocaleDateString()}</div>
        </div>
      </body>
      </html>
    `
    
    res.setHeader('Content-Type', 'text/html')
    res.setHeader('Content-Disposition', `attachment; filename=certificate-${cert.verificationId}.html`)
    res.send(htmlContent)
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/certificates - Issue certificate (admin)
router.post('/', async (req, res) => {
  try {
    const cert = await Certificate.create(req.body)
    
    const io = req.app.get('io')
    io?.emit('certificate:issued', { userId: cert.userId, certId: cert._id })
    
    res.status(201).json({ success: true, data: cert })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

// POST /api/certificates/:id/resend - Resend certificate email
router.post('/:id/resend', async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id)
    if (!cert) return res.status(404).json({ success: false, error: 'Certificate not found' })
    
    // In production: send actual email
    console.log(`📧 Resending certificate to ${cert.userEmail}`)
    
    cert.emailSent = true
    cert.emailSentAt = new Date()
    await cert.save()
    
    res.json({ success: true, message: `Certificate resent to ${cert.userEmail}` })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
