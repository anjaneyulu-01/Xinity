import mongoose from 'mongoose'

const certificateSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  eventName: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: { type: String, required: true },
  userEmail: { type: String },
  type: { type: String, enum: ['participation', 'winner', 'runner-up', 'special'], default: 'participation' },
  rank: { type: String }, // e.g., "1st Place", "3rd Place", "Participant"
  title: { type: String }, // e.g., "Winner - WebX Challenge 2026"
  verificationId: { type: String, unique: true },
  issuedAt: { type: Date, default: Date.now },
  downloadCount: { type: Number, default: 0 },
  lastDownloadedAt: Date,
  emailSent: { type: Boolean, default: false },
  emailSentAt: Date
})

certificateSchema.pre('save', function(next) {
  if (!this.verificationId) {
    this.verificationId = `XINITY-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
  }
  next()
})

export default mongoose.model('Certificate', certificateSchema)
