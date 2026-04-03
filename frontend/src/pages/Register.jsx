import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useTheme } from '../context/ThemeContext'
import logo from '../assets/logo.png'
import toast from 'react-hot-toast'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', university: 'Marwadi University', role: 'participant' })
  const [showPw, setShowPw] = useState(false)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useAuthStore()
  const { dark } = useTheme()
  const navigate = useNavigate()

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) { toast.error('Password too short'); return }
    setLoading(true)
    
    const result = await register(form)
    setLoading(false)
    
    if (result.success) {
      setDone(true)
      setTimeout(() => {
        navigate(result.role === 'participant' ? '/dashboard/user' : result.role === 'judge' ? '/dashboard/judge' : '/dashboard/admin')
      }, 1800)
    } else {
      toast.error(result.error || 'Registration failed')
    }
  }

  if (done) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${dark ? 'bg-[#04040f]' : 'bg-gray-50'}`}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 rounded-full bg-[#00e676]/10 border-2 border-[#00e676] flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 size={40} className="text-[#00e676]" />
          </motion.div>
          <h2 className={`font-heading font-bold text-3xl mb-2 ${dark ? 'text-white' : 'text-gray-900'}`}>Account Created!</h2>
          <p className={dark ? 'text-[#94a3b8]' : 'text-gray-600'}>Redirecting to your dashboard...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${dark ? 'bg-[#04040f]' : 'bg-gray-50'}`}>
      <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none ${dark ? 'bg-[#7c4dff]/5' : 'bg-[#7c4dff]/8'}`} />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex items-center justify-center gap-2 mb-8">
          <img src={logo} alt="Xinity Logo" className="w-9 h-9 object-contain" />
          <span className={`font-heading font-bold text-2xl ${dark ? 'text-white' : 'text-gray-900'}`}>X<span className={dark ? 'text-[#00e5ff]' : 'text-[#0066ff]'}>inity</span></span>
        </div>

        <div className={`glass-card p-8 border ${dark ? 'border-[#1e3a5f]' : 'border-gray-200 shadow-lg'}`}>
          <h1 className={`font-heading font-bold text-2xl mb-1 ${dark ? 'text-white' : 'text-gray-900'}`}>Create your account</h1>
          <p className={`text-sm mb-6 ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>Join 500+ developers in the Xinity community.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} required placeholder="Arjun Sharma" className="input-field" />
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@email.com" className="input-field" />
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>University</label>
              <input name="university" value={form.university} onChange={handleChange} required placeholder="Your University" className="input-field" />
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>Role</label>
              <select name="role" value={form.role} onChange={handleChange} className="input-field appearance-none">
                <option value="participant">Participant</option>
                <option value="judge">Judge</option>
              </select>
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>Password</label>
              <div className="relative">
                <input name="password" type={showPw ? 'text' : 'password'} value={form.password} onChange={handleChange}
                  required placeholder="••••••••" className="input-field pr-10" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${dark ? 'text-[#94a3b8] hover:text-[#00e5ff]' : 'text-gray-400 hover:text-[#0066ff]'}`}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit" disabled={loading}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="btn-primary w-full justify-center py-3 text-sm mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#04040f]/30 border-t-[#04040f] rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create Account →'}
            </motion.button>
          </form>

          <p className={`text-center text-sm mt-5 ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>
            Already have an account?{' '}
            <Link to="/login" className={`font-semibold hover:underline ${dark ? 'text-[#00e5ff]' : 'text-[#0066ff]'}`}>Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
