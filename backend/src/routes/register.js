import { Router } from 'express'

const router = Router()

router.post('/', (req, res) => {
  const { teamName, challenge, leader, members } = req.body

  if (!teamName || !leader?.name || !leader?.email) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  // In production: save to DB. For now, log and confirm.
  console.log('New registration:', teamName, leader.email)

  res.json({ success: true, message: `Team "${teamName}" registered!` })
})

export default router
