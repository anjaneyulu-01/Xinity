import { Router } from 'express'
import Submission from '../models/Submission.js'

const router = Router()

// GET /api/submissions?judgeId=j1  — all submissions for a judge
router.get('/', async (req, res) => {
  try {
    const { judgeId, status, eventName } = req.query
    const filter = {}
    if (judgeId)   filter.assignedJudgeId = judgeId
    if (status)    filter.status          = status
    if (eventName) filter.eventName       = eventName

    const submissions = await Submission.find(filter).sort({ submittedAt: -1 })
    res.json({ success: true, data: submissions })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/submissions/queue?judgeId=j1  — only non-reviewed submissions
router.get('/queue', async (req, res) => {
  try {
    const { judgeId } = req.query
    if (!judgeId) return res.status(400).json({ success: false, error: 'judgeId required' })

    const queue = await Submission.find({
      assignedJudgeId: judgeId,
      status: { $in: ['Pending', 'In Review'] },
    }).sort({ submittedAt: 1 })

    res.json({ success: true, data: queue })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/submissions/:id
router.get('/:id', async (req, res) => {
  try {
    const sub = await Submission.findById(req.params.id)
    if (!sub) return res.status(404).json({ success: false, error: 'Not found' })
    res.json({ success: true, data: sub })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/submissions  — create a new submission
router.post('/', async (req, res) => {
  try {
    const sub = await Submission.create(req.body)
    res.status(201).json({ success: true, data: sub })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

// PATCH /api/submissions/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    const sub = await Submission.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
    if (!sub) return res.status(404).json({ success: false, error: 'Not found' })
    res.json({ success: true, data: sub })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

// PATCH /api/submissions/:id/assign  — assign a judge
router.patch('/:id/assign', async (req, res) => {
  try {
    const { judgeId, judgeName } = req.body
    const sub = await Submission.findByIdAndUpdate(
      req.params.id,
      { assignedJudgeId: judgeId, assignedJudgeName: judgeName },
      { new: true }
    )
    if (!sub) return res.status(404).json({ success: false, error: 'Not found' })
    res.json({ success: true, data: sub })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

export default router
