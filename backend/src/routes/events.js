import { Router } from 'express'
import Event from '../models/Event.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ startDate: 1 })
    res.json({ success: true, data: events })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const event = await Event.create(req.body)
    res.status(201).json({ success: true, data: event })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

router.patch('/:id/status', async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id, { status: req.body.status }, { new: true }
    )
    res.json({ success: true, data: event })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

export default router
