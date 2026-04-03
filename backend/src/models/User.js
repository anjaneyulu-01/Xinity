import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  uid:        { type: String, unique: true, sparse: true },   // client-side UID
  name:       { type: String, required: true },
  email:      { type: String, required: true, unique: true, lowercase: true },
  password:   { type: String, required: true },
  role:       { type: String, enum: ['participant', 'judge', 'admin'], default: 'participant' },
  university: { type: String, default: '' },
  avatar:     String,
  points:     { type: Number, default: 0 },
  rank:       Number,
  active:     { type: Boolean, default: true },
}, { timestamps: true })

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 12)
})

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password)
}

export default mongoose.model('User', userSchema)
