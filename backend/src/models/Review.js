import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  submissionId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Submission', required: true },
  projectName:    String,
  teamName:       String,
  eventName:      String,

  judgeId:        { type: String, required: true },
  judgeName:      { type: String, required: true },
  judgeEmail:     String,

  scores: {
    innovation:    { type: Number, min: 0, max: 10, required: true },
    technical:     { type: Number, min: 0, max: 10, required: true },
    design:        { type: Number, min: 0, max: 10, required: true },
    functionality: { type: Number, min: 0, max: 10, required: true },
    presentation:  { type: Number, min: 0, max: 10, required: true },
  },

  // Calculated: sum of scores (max 50), normalised to 100 for display
  totalScore:    { type: Number, required: true },  // out of 50
  normalised:    { type: Number, required: true },  // (totalScore/50)*100

  comment:       { type: String, default: '' },     // visible to team
  privateNote:   { type: String, default: '' },     // judge only

  submittedAt:   { type: Date, default: Date.now },
}, { timestamps: true })

// One review per (submission, judge)
reviewSchema.index({ submissionId: 1, judgeId: 1 }, { unique: true })

export default mongoose.model('Review', reviewSchema)
