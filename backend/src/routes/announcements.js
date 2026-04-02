import { Router } from 'express'
import Announcement from '../models/Announcement.js'

const router = Router()

// GET /api/announcements - Get all announcements
router.get('/', async (req, res) => {
  try {
    const { status, targetAudience } = req.query
    const filter = {}
    if (status) filter.status = status
    if (targetAudience) filter.targetAudience = { $in: [targetAudience, 'all'] }
    
    const announcements = await Announcement.find(filter).sort({ createdAt: -1 })
    res.json({ success: true, data: announcements })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/announcements/:id - Get announcement by ID
router.get('/:id', async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
    if (!announcement) return res.status(404).json({ success: false, error: 'Announcement not found' })
    res.json({ success: true, data: announcement })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/announcements - Create announcement
router.post('/', async (req, res) => {
  try {
    const userId = req.headers['x-user-id']
    const announcement = await Announcement.create({ ...req.body, createdBy: userId })
    res.status(201).json({ success: true, data: announcement })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

// PATCH /api/announcements/:id - Update announcement
router.patch('/:id', async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!announcement) return res.status(404).json({ success: false, error: 'Announcement not found' })
    res.json({ success: true, data: announcement })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

// PATCH /api/announcements/:id/publish - Publish announcement
router.patch('/:id/publish', async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { status: 'published', publishedAt: new Date() },
      { new: true }
    )
    if (!announcement) return res.status(404).json({ success: false, error: 'Announcement not found' })
    
    // Emit real-time notification
    const io = req.app.get('io')
    io?.emit('announcement:new', {
      id: announcement._id,
      title: announcement.title,
      type: announcement.type,
      priority: announcement.priority
    })
    
    res.json({ success: true, data: announcement })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

// DELETE /api/announcements/:id - Delete announcement
router.delete('/:id', async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id)
    if (!announcement) return res.status(404).json({ success: false, error: 'Announcement not found' })
    res.json({ success: true, message: 'Announcement deleted' })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
