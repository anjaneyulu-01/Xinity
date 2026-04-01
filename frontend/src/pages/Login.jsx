import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Zap, User, Scale, Shield, Chrome, ArrowLeft } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useTheme } from '../context/ThemeContext'
import toast from 'react-hot-toast'

const ROLES = [
  { key: 'participant', label: 'Participant', icon: User,  color: '#00e5ff' },
  { key: 'judge',       label: 'Judge',       icon: Scale, color: '#7c4dff' },
  { key: 'admin',       label: 'Admin',       icon: Shield,color: '#ffd600' },
]

const DEMO = {
  participant: { email: 'user@xinity.in',  password: 'User@123'  },
  judge:       { email: 'judge@xinity.in', password: 'Judge@123' },
  admin:       { email: 'admin@xinity.in', password: 'Admin@123' },
}

const FEATURES = [
  { title: '500+ Members', sub: 'Active community of developers' },
  { title: '12 Hackathons', sub: 'Run on this platform already' },
  { title: 'Real-time Scores', sub: 'Live judge scoring system' },
  { title: '₹2L+ Prizes', sub: 'Distributed to winners' },
]

export default function Login() {
  const [role, setRole] = useState('participant')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [featureIdx, setFeatureIdx] = useState(0)
  const { login, loginDemo, loading, error } = useAuthStore()
  const { dark } = useTheme()
  const navigate = useNavigate()

  const DASH = { admin: '/dashboard/admin', judge: '/dashboard/judge', participant: '/dashboard/user' }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await login(email, password)
    if (result.success) {
      toast.success('Welcome back!')
      navigate(DASH[result.role])
    } else {
      toast.error('Invalid credentials')
    }
  }

  const handleDemo = (r) => {
    loginDemo(r)
    toast.success(`Signed in as ${r}`)
    navigate(DASH[r])
  }

  const fillDemo = () => {
    setEmail(DEMO[role].email)
    setPassword(DEMO[role].password)
  }

  // Rotate feature highlight
  useState(() => {
    const id = setInterval(() => setFeatureIdx(i => (i + 1) % FEATURES.length), 3000)
    return () => clearInterval(id)
  })

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${dark ? 'bg-[#04040f]' : 'bg-gray-50'}`}>
      {/* Left panel — desktop only */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-center relative overflow-hidden p-12">
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-[100px] ${dark ? 'bg-[#00e5ff]/5' : 'bg-[#0066ff]/8'}`} />
        </div>
        <div className="relative z-10 max-w-md w-full">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00e5ff] to-[#0066ff] flex items-center justify-center animate-glow-pulse">
              <Zap size={22} className={dark ? 'text-[#04040f]' : 'text-white'} />
            </div>
            <span className={`font-heading font-bold text-3xl ${dark ? 'text-white' : 'text-gray-900'}`}>X<span className={dark ? 'text-[#00e5ff]' : 'text-[#0066ff]'}>inity</span></span>
          </div>
          <h2 className={`font-heading font-bold text-4xl mb-3 leading-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
            One platform.<br /><span className="gradient-text-animated">Every stage.</span>
          </h2>
          <p className={`mb-10 leading-relaxed ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>
            From registration to certificates — the complete hackathon experience.
          </p>
          {/* Rotating feature highlight */}
          <div className="flex flex-col gap-3">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                animate={{ opacity: i === featureIdx ? 1 : 0.4, x: i === featureIdx ? 4 : 0 }}
                transition={{ duration: 0.4 }}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  dark 
                    ? '' 
                    : i === featureIdx ? 'bg-white shadow-sm' : 'bg-transparent'
                }`}
                style={{ 
                  borderColor: i === featureIdx 
                    ? (dark ? '#00e5ff30' : '#0066ff30') 
                    : (dark ? '#1e3a5f' : '#e5e7eb'), 
                  background: i === featureIdx 
                    ? (dark ? '#00e5ff08' : 'white') 
                    : 'transparent' 
                }}
              >
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: i === featureIdx ? (dark ? '#00e5ff' : '#0066ff') : (dark ? '#1e3a5f' : '#d1d5db') }} />
                <div>
                  <p className={`font-bold text-sm ${dark ? 'text-white' : 'text-gray-900'}`}>{f.title}</p>
                  <p className={`text-xs ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>{f.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — login card */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Back to home */}
          <Link
            to="/"
            className={`inline-flex items-center gap-2 mb-6 text-sm font-medium transition-colors ${dark ? 'text-[#94a3b8] hover:text-[#00e5ff]' : 'text-gray-500 hover:text-[#0066ff]'}`}
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00e5ff] to-[#0066ff] flex items-center justify-center">
              <Zap size={14} className={dark ? 'text-[#04040f]' : 'text-white'} />
            </div>
            <span className={`font-heading font-bold text-xl ${dark ? 'text-white' : 'text-gray-900'}`}>X<span className={dark ? 'text-[#00e5ff]' : 'text-[#0066ff]'}>inity</span></span>
          </div>

          <div className={`glass-card p-8 border ${dark ? 'border-[#1e3a5f]' : 'border-gray-200 shadow-lg'}`}>
            <h1 className={`font-heading font-bold text-2xl mb-1 ${dark ? 'text-white' : 'text-gray-900'}`}>Sign in to Xinity</h1>
            <p className={`text-sm mb-6 ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>Welcome back! Choose your role to continue.</p>

            {/* Role tabs */}
            <div className={`grid grid-cols-3 gap-2 mb-6 p-1 rounded-xl border ${dark ? 'bg-white/5 border-[#1e3a5f]' : 'bg-gray-100 border-gray-200'}`}>
              {ROLES.map(({ key, label, icon: Icon, color }) => (
                <button
                  key={key}
                  onClick={() => setRole(key)}
                  className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    role === key ? 'text-[#04040f]' : dark ? 'text-[#94a3b8] hover:text-white' : 'text-gray-500 hover:text-gray-900'
                  }`}
                  style={role === key ? { background: color } : {}}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className={`block text-xs font-medium mb-1.5 ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>Email address</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@xinity.in" required className="input-field"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={`text-xs font-medium ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>Password</label>
                  <a href="#" className={`text-xs hover:underline ${dark ? 'text-[#00e5ff]' : 'text-[#0066ff]'}`}>Forgot password?</a>
                </div>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••" required className="input-field pr-10"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${dark ? 'text-[#94a3b8] hover:text-[#00e5ff]' : 'text-gray-400 hover:text-[#0066ff]'}`}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && <p className="text-[#ff4081] text-xs bg-[#ff4081]/10 border border-[#ff4081]/20 rounded-lg px-3 py-2">{error}</p>}

              <motion.button
                type="submit" disabled={loading}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="btn-primary w-full justify-center py-3 text-sm"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#04040f]/30 border-t-[#04040f] rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : 'Sign In'}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className={`flex-1 h-px ${dark ? 'bg-[#1e3a5f]' : 'bg-gray-200'}`} />
              <span className={`text-xs ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>or continue with</span>
              <div className={`flex-1 h-px ${dark ? 'bg-[#1e3a5f]' : 'bg-gray-200'}`} />
            </div>

            {/* Google */}
            <button className={`w-full flex items-center justify-center gap-3 py-3 rounded-xl border text-sm font-medium transition-all ${
              dark 
                ? 'border-[#1e3a5f] text-[#94a3b8] hover:border-[#00e5ff]/30 hover:text-white hover:bg-white/3' 
                : 'border-gray-200 text-gray-600 hover:border-[#0066ff]/30 hover:text-gray-900 hover:bg-gray-50'
            }`}>
              <Chrome size={16} />
              Continue with Google
            </button>

            {/* Demo quick-fill */}
            <div className={`mt-5 p-4 rounded-xl border ${dark ? 'border-[#1e3a5f] bg-white/2' : 'border-gray-200 bg-gray-50'}`}>
              <p className={`text-xs mb-3 font-medium ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>⚡ Demo Access — quick-fill credentials</p>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map(({ key, label, color }) => (
                  <button
                    key={key}
                    onClick={() => { setRole(key); setEmail(DEMO[key].email); setPassword(DEMO[key].password) }}
                    className="py-2 px-3 rounded-lg text-xs font-bold border transition-all hover:scale-105"
                    style={{ borderColor: color + '40', color, background: color + '10' }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <p className={`text-center text-sm mt-5 ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>
              Don't have an account?{' '}
              <Link to="/register" className={`font-semibold hover:underline ${dark ? 'text-[#00e5ff]' : 'text-[#0066ff]'}`}>Register</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
