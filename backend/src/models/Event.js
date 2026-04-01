import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  type:        { type: String, enum: ['Hackathon', 'Workshop', 'Talk', 'Contest'], default: 'Hackathon' },
  description: String,
  venue:       String,
  prize:       String,
  maxTeams:    Number,
  registered:  { type: Number, default: 0 },
  status:      { type: String, enum: ['draft', 'upcoming', 'live', 'closed', 'results'], default: 'upcoming' },
  startDate:   Date,
  endDate:     Date,
  featured:    { type: Boolean, default: false },
}, { timestamps: true })

export default mongoose.model('Event', eventSchema)
