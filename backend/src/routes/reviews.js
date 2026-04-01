import { Router } from 'express'
import Review from '../models/Review.js'
import Submission from '../models/Submission.js'

const router = Router()

// GET /api/reviews?judgeId=j1  — all reviews by a judge
router.get('/', async (req, res) => {
  try {
    const { judgeId } = req.query
    const filter = judgeId ? { judgeId } : {}
    const reviews = await Review.find(filter).sort({ submittedAt: -1 })
    res.json({ success: true, data: reviews })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/reviews/stats?judgeId=j1  — aggregate stats
router.get('/stats', async (req, res) => {
  try {
    const { judgeId } = req.query
    if (!judgeId) return res.status(400).json({ success: false, error: 'judgeId required' })

    const reviews = await Review.find({ judgeId })
    const pending = await Submission.countDocuments({
      assignedJudgeId: judgeId,
      status: { $in: ['Pending', 'In Review'] },
    })
    const avgScore = reviews.length
      ? Math.round(reviews.reduce((a, r) => a + r.normalised, 0) / reviews.length)
      : 0

    res.json({
      success: true,
      data: {
        done:     reviews.length,
        pending,
        avgScore,
      },
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/reviews/:id
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
    if (!review) return res.status(404).json({ success: false, error: 'Not found' })
    res.json({ success: true, data: review })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/reviews  — submit a review
router.post('/', async (req, res) => {
  try {
    const { submissionId, judgeId, judgeName, judgeEmail, scores, comment, privateNote } = req.body

    if (!submissionId || !judgeId || !scores)
      return res.status(400).json({ success: false, error: 'submissionId, judgeId, scores required' })

    // Check submission exists
    const submission = await Submission.findById(submissionId)
    if (!submission) return res.status(404).json({ success: false, error: 'Submission not found' })

    // Prevent duplicate reviews
    const existing = await Review.findOne({ submissionId, judgeId })
    if (existing) return res.status(409).json({ success: false, error: 'Already reviewed this submission' })

    // Calculate scores
    const totalScore = Object.values(scores).reduce((a, b) => a + Number(b), 0)
    const normalised = Math.round((totalScore / 50) * 100)

    const review = await Review.create({
      submissionId,
      projectName:  submission.projectName,
      teamName:     submission.teamName,
      eventName:    submission.eventName,
      judgeId,
      judgeName:    judgeName || 'Judge',
      judgeEmail:   judgeEmail || '',
      scores,
      totalScore,
      normalised,
      comment:      comment      || '',
      privateNote:  privateNote  || '',
    })

    // Update submission status + score
    await Submission.findByIdAndUpdate(submissionId, {
      status:   'Reviewed',
      score:    normalised,
      feedback: comment || '',
    })

    res.status(201).json({ success: true, data: review })
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ success: false, error: 'Already reviewed this submission' })
    res.status(400).json({ success: false, error: err.message })
  }
})

// PATCH /api/reviews/:id  — update a review (before deadline)
router.patch('/:id', async (req, res) => {
  try {
    const { scores, comment, privateNote } = req.body

    const totalScore = scores ? Object.values(scores).reduce((a, b) => a + Number(b), 0) : undefined
    const normalised = totalScore !== undefined ? Math.round((totalScore / 50) * 100) : undefined

    const update = {}
    if (scores)       update.scores      = scores
    if (totalScore)   update.totalScore  = totalScore
    if (normalised)   update.normalised  = normalised
    if (comment !== undefined)     update.comment     = comment
    if (privateNote !== undefined) update.privateNote = privateNote

    const review = await Review.findByIdAndUpdate(req.params.id, update, { new: true })
    if (!review) return res.status(404).json({ success: false, error: 'Not found' })

    // Sync score on submission
    if (normalised !== undefined) {
      await Submission.findByIdAndUpdate(review.submissionId, {
        score: normalised, feedback: comment || review.comment,
      })
    }

    res.json({ success: true, data: review })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

export default router
