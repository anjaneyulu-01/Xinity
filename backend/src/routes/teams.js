import { Router } from 'express'
import Team from '../models/Team.js'
import crypto from 'crypto'

const router = Router()

// GET /api/teams - Get all teams
router.get('/', async (req, res) => {
  try {
    const { eventId, openOnly } = req.query
    const filter = {}
    if (eventId) filter.eventId = eventId
    if (openOnly === 'true') filter.openForJoin = true
    
    const teams = await Team.find(filter).sort({ score: -1 })
    res.json({ success: true, data: teams })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/teams/my - Get current user's team
router.get('/my', async (req, res) => {
  try {
    const userId = req.headers['x-user-id']
    if (!userId) return res.status(401).json({ success: false, error: 'Not authenticated' })
    
    const team = await Team.findOne({ 'members.uid': userId })
    if (!team) return res.status(404).json({ success: false, error: 'No team found' })
    
    res.json({ success: true, data: team })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/teams/:id - Get team by ID
router.get('/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
    if (!team) return res.status(404).json({ success: false, error: 'Team not found' })
    res.json({ success: true, data: team })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/teams - Create team
router.post('/', async (req, res) => {
  try {
    const userId = req.headers['x-user-id']
    const { name, eventId, eventName, skills, maxSize } = req.body
    
    const team = await Team.create({
      name,
      eventId,
      eventName,
      leaderId: userId,
      members: [{
        uid: userId,
        name: req.body.leaderName,
        email: req.body.leaderEmail,
        role: 'leader'
      }],
      skills,
      maxSize: maxSize || 4
    })
    
    const io = req.app.get('io')
    io?.emit('team:created', team)
    
    res.status(201).json({ success: true, data: team })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

// PATCH /api/teams/:id - Update team
router.patch('/:id', async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!team) return res.status(404).json({ success: false, error: 'Team not found' })
    res.json({ success: true, data: team })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

// POST /api/teams/:id/join-request - Send join request
router.post('/:id/join-request', async (req, res) => {
  try {
    const userId = req.headers['x-user-id']
    const userName = req.body.userName || 'Anonymous'
    const userEmail = req.body.userEmail || ''
    
    const team = await Team.findById(req.params.id)
    if (!team) return res.status(404).json({ success: false, error: 'Team not found' })
    
    if (!team.openForJoin) {
      return res.status(400).json({ success: false, error: 'Team is not accepting new members' })
    }
    
    if (team.members.length >= team.maxSize) {
      return res.status(400).json({ success: false, error: 'Team is full' })
    }
    
    // Check if already requested or member
    const existingRequest = team.joinRequests.find(r => r.userId?.toString() === userId)
    const existingMember = team.members.find(m => m.uid?.toString() === userId)
    
    if (existingMember) {
      return res.status(400).json({ success: false, error: 'Already a member of this team' })
    }
    
    if (existingRequest && existingRequest.status === 'pending') {
      return res.status(400).json({ success: false, error: 'Join request already pending' })
    }
    
    team.joinRequests.push({ userId, userName, userEmail })
    await team.save()
    
    const io = req.app.get('io')
    io?.to(`team:${team._id}`).emit('team:joinRequest', { team: team.name, userName })
    
    res.json({ success: true, message: `Join request sent to ${team.name}` })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

// POST /api/teams/:id/accept - Accept join request
router.post('/:id/accept', async (req, res) => {
  try {
    const { userId } = req.body
    const team = await Team.findById(req.params.id)
    if (!team) return res.status(404).json({ success: false, error: 'Team not found' })
    
    const request = team.joinRequests.find(r => r.userId?.toString() === userId)
    if (!request) return res.status(404).json({ success: false, error: 'Request not found' })
    
    request.status = 'accepted'
    team.members.push({
      uid: userId,
      name: request.userName,
      email: request.userEmail,
      role: 'member'
    })
    
    await team.save()
    
    const io = req.app.get('io')
    io?.emit('team:memberJoined', { teamId: team._id, userId })
    
    res.json({ success: true, data: team })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

// POST /api/teams/:id/reject - Reject join request
router.post('/:id/reject', async (req, res) => {
  try {
    const { userId } = req.body
    const team = await Team.findById(req.params.id)
    if (!team) return res.status(404).json({ success: false, error: 'Team not found' })
    
    const request = team.joinRequests.find(r => r.userId?.toString() === userId)
    if (!request) return res.status(404).json({ success: false, error: 'Request not found' })
    
    request.status = 'rejected'
    await team.save()
    
    res.json({ success: true, message: 'Request rejected' })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

// POST /api/teams/:id/leave - Leave team
router.post('/:id/leave', async (req, res) => {
  try {
    const userId = req.headers['x-user-id']
    const team = await Team.findById(req.params.id)
    if (!team) return res.status(404).json({ success: false, error: 'Team not found' })
    
    const memberIndex = team.members.findIndex(m => m.uid?.toString() === userId)
    if (memberIndex === -1) {
      return res.status(400).json({ success: false, error: 'Not a member of this team' })
    }
    
    if (team.members[memberIndex].role === 'leader' && team.members.length > 1) {
      return res.status(400).json({ success: false, error: 'Leader cannot leave. Transfer leadership first.' })
    }
    
    team.members.splice(memberIndex, 1)
    
    if (team.members.length === 0) {
      await Team.findByIdAndDelete(req.params.id)
      return res.json({ success: true, message: 'Team disbanded' })
    }
    
    await team.save()
    res.json({ success: true, message: 'Left team successfully' })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

// GET /api/teams/:id/invite - Get invite link
router.get('/:id/invite', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
    if (!team) return res.status(404).json({ success: false, error: 'Team not found' })
    
    const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173'
    const inviteLink = `${baseUrl}/join/team/${team.inviteCode}`
    
    res.json({ success: true, inviteLink, inviteCode: team.inviteCode })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/teams/join/:code - Join via invite code
router.post('/join/:code', async (req, res) => {
  try {
    const userId = req.headers['x-user-id']
    const { code } = req.params
    
    const team = await Team.findOne({ inviteCode: code.toUpperCase() })
    if (!team) return res.status(404).json({ success: false, error: 'Invalid invite code' })
    
    if (team.members.length >= team.maxSize) {
      return res.status(400).json({ success: false, error: 'Team is full' })
    }
    
    const existingMember = team.members.find(m => m.uid?.toString() === userId)
    if (existingMember) {
      return res.status(400).json({ success: false, error: 'Already a member' })
    }
    
    team.members.push({
      uid: userId,
      name: req.body.userName,
      email: req.body.userEmail,
      role: 'member'
    })
    
    await team.save()
    
    const io = req.app.get('io')
    io?.to(`team:${team._id}`).emit('team:memberJoined', { teamId: team._id, userId })
    
    res.json({ success: true, data: team })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

// DELETE /api/teams/:id/members/:userId - Remove member
router.delete('/:id/members/:userId', async (req, res) => {
  try {
    const { id, userId } = req.params
    const team = await Team.findById(id)
    if (!team) return res.status(404).json({ success: false, error: 'Team not found' })
    
    const memberIndex = team.members.findIndex(m => m.uid?.toString() === userId)
    if (memberIndex === -1) {
      return res.status(404).json({ success: false, error: 'Member not found' })
    }
    
    if (team.members[memberIndex].role === 'leader') {
      return res.status(400).json({ success: false, error: 'Cannot remove team leader' })
    }
    
    team.members.splice(memberIndex, 1)
    await team.save()
    
    const io = req.app.get('io')
    io?.emit('team:memberRemoved', { teamId: id, userId })
    
    res.json({ success: true, message: 'Member removed' })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

export default router
