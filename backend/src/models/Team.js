import mongoose from 'mongoose'

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  eventName: { type: String },
  leaderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  leaderName: { type: String },
  members: [{
    uid: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    email: String,
    role: { type: String, enum: ['leader', 'member'], default: 'member' },
    joinedAt: { type: Date, default: Date.now },
    online: { type: Boolean, default: false }
  }],
  maxSize: { type: Number, default: 4 },
  openForJoin: { type: Boolean, default: true },
  skills: [String],
  inviteCode: { type: String, unique: true, sparse: true },
  score: { type: Number, default: 0 },
  rank: { type: Number },
  joinRequests: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: String,
    userEmail: String,
    requestedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

teamSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  if (!this.inviteCode) {
    this.inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase()
  }
  next()
})

export default mongoose.model('Team', teamSchema)
