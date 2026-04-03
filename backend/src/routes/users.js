import { Router } from 'express'
import User from '../models/User.js'

const router = Router()

// GET /api/users - Get all users (admin)
router.get('/', async (req, res) => {
  try {
    const { role, status, search } = req.query
    const filter = {}
    if (role) filter.role = role
    if (status) filter.status = status
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }
    const users = await User.find(filter).sort({ createdAt: -1 })
    res.json({ success: true, data: users })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/users/export - Export users to CSV
router.get('/export', async (req, res) => {
  try {
    const { role, status } = req.query
    const filter = {}
    if (role) filter.role = role
    if (status) filter.status = status
    
    const users = await User.find(filter).sort({ createdAt: -1 })
    
    const headers = ['ID', 'Name', 'Email', 'Role', 'Status', 'Events', 'Joined']
    const rows = users.map(u => [
      u._id.toString(),
      u.name,
      u.email,
      u.role,
      u.status,
      u.events?.length || 0,
      new Date(u.createdAt).toISOString()
    ])
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename=users.csv')
    res.send(csv)
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/users/register - Register new user (MUST be before /:id routes)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, university, role } = req.body
    
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email, and password are required' })
    }
    
    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' })
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Email already registered' })
    }
    
    // Create new user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      university: university || '',
      role: role === 'judge' ? 'judge' : 'participant' // Only allow participant or judge during registration
    })
    
    // Return user without password
    const userData = user.toObject()
    delete userData.password
    
    res.status(201).json({ success: true, data: userData })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

// POST /api/users/login - Login user (MUST be before /:id routes)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' })
    }
    
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' })
    }
    
    // Check if user is active
    if (!user.active) {
      return res.status(401).json({ success: false, error: 'Account is suspended' })
    }
    
    // Verify password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' })
    }
    
    // Return user without password
    const userData = user.toObject()
    delete userData.password
    
    res.json({ success: true, data: userData })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/users/:id - Get single user
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ success: false, error: 'User not found' })
    res.json({ success: true, data: user })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// PATCH /api/users/:id - Update user
router.patch('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!user) return res.status(404).json({ success: false, error: 'User not found' })
    res.json({ success: true, data: user })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

// PATCH /api/users/:id/suspend - Suspend user
router.patch('/:id/suspend', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'suspended', suspendedAt: new Date() },
      { new: true }
    )
    if (!user) return res.status(404).json({ success: false, error: 'User not found' })
    
    const io = req.app.get('io')
    io?.emit('user:suspended', { userId: user._id })
    
    res.json({ success: true, data: user, message: 'User suspended successfully' })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

// PATCH /api/users/:id/reactivate - Reactivate user
router.patch('/:id/reactivate', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'active', suspendedAt: null },
      { new: true }
    )
    if (!user) return res.status(404).json({ success: false, error: 'User not found' })
    res.json({ success: true, data: user, message: 'User reactivated successfully' })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

// PATCH /api/users/:id/role - Change user role
router.patch('/:id/role', async (req, res) => {
  try {
    const { role } = req.body
    if (!['participant', 'judge', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, error: 'Invalid role' })
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true })
    if (!user) return res.status(404).json({ success: false, error: 'User not found' })
    res.json({ success: true, data: user })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

// POST /api/users/:id/email - Send email to user
router.post('/:id/email', async (req, res) => {
  try {
    const { subject, message } = req.body
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ success: false, error: 'User not found' })
    
    // In production: integrate with email service (e.g., SendGrid, Nodemailer)
    console.log(`📧 Sending email to ${user.email}: ${subject}`)
    
    // Emit real-time notification
    const io = req.app.get('io')
    io?.emit('notification:new', {
      userId: user._id,
      type: 'email',
      title: subject,
      message: message.substring(0, 100),
    })
    
    res.json({ success: true, message: `Email sent to ${user.email}` })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
