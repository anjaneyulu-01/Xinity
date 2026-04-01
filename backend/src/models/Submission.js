import mongoose from 'mongoose'

const submissionSchema = new mongoose.Schema({
  projectName:     { type: String, required: true },
  description:     { type: String, default: '' },
  teamName:        { type: String, required: true },
  teamId:          String,
  eventId:         { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  eventName:       { type: String, required: true },
  githubUrl:       { type: String, default: '' },
  demoUrl:         { type: String, default: '' },
  techStack:       [String],
  fileUrl:         String,

  // Assigned judge
  assignedJudgeId: String,   // judge uid
  assignedJudgeName: String,

  // Status lifecycle
  status: {
    type: String,
    enum: ['Pending', 'In Review', 'Reviewed', 'Scored', 'Winner'],
    default: 'Pending',
  },

  // Final score (set after review)
  score:    { type: Number, default: null },
  feedback: { type: String, default: null },

  submittedAt: { type: Date, default: Date.now },
}, { timestamps: true })

// Indexes for fast lookups
submissionSchema.index({ status: 1 })
submissionSchema.index({ assignedJudgeId: 1 })
submissionSchema.index({ eventName: 1 })

export default mongoose.model('Submission', submissionSchema)
