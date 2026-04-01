import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  X, Calendar, MapPin, Users, Flame, CheckCircle2, ArrowRight,
  Github, Linkedin, Globe, Code2, UserPlus, User, Loader2, Trophy
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useTheme } from '../context/ThemeContext'
import { useEventStore } from '../store/eventStore'
import toast from 'react-hot-toast'

const TECH_STACK_OPTIONS = [
  'React', 'Next.js', 'Vue', 'Angular', 'Node.js', 'Express',
  'Python', 'Django', 'Flask', 'FastAPI', 'Java', 'Spring Boot',
  'Go', 'Rust', 'TypeScript', 'MongoDB', 'PostgreSQL', 'MySQL',
  'Firebase', 'AWS', 'Docker', 'Kubernetes', 'TensorFlow', 'PyTorch',
  'OpenAI', 'LangChain', 'Tailwind CSS', 'Flutter', 'React Native', 'Swift'
]

export default function EventRegistrationModal({ event, isOpen, onClose }) {
  const { dark } = useTheme()
  const navigate = useNavigate()
  const user = useAuthStore(s => s.user)
  const { registerForEvent } = useEventStore()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    university: '',
    teamType: 'solo', // solo | team
    teamName: '',
    teamSize: 2,
    teammates: [''],
    techStack: [],
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
    experience: 'beginner', // beginner | intermediate | advanced
    tshirtSize: 'M',
    dietaryRestrictions: '',
    heardFrom: '',
    agreeTerms: false,
  })

  // Pre-fill form with user data
  useEffect(() => {
    if (user) {
      setForm(f => ({
        ...f,
        name: user.name || '',
        email: user.email || '',
        university: user.university || '',
        githubUrl: user.githubUrl || '',
        linkedinUrl: user.linkedinUrl || '',
      }))
    }
  }, [user])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isOpen && !user) {
      onClose()
      toast('Please login to register for events', { icon: '🔐' })
      navigate('/login', { state: { returnTo: '/', eventId: event?.id } })
    }
  }, [isOpen, user, navigate, onClose, event])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const toggleTech = (tech) => {
    setForm(f => ({
      ...f,
      techStack: f.techStack.includes(tech)
        ? f.techStack.filter(t => t !== tech)
        : [...f.techStack, tech]
    }))
  }

  const handleTeammateChange = (index, value) => {
    const newTeammates = [...form.teammates]
    newTeammates[index] = value
    setForm(f => ({ ...f, teammates: newTeammates }))
  }

  const addTeammate = () => {
    if (form.teammates.length < form.teamSize - 1) {
      setForm(f => ({ ...f, teammates: [...f.teammates, ''] }))
    }
  }

  const removeTeammate = (index) => {
    setForm(f => ({ ...f, teammates: f.teammates.filter((_, i) => i !== index) }))
  }

  const validateStep = (stepNum) => {
    if (stepNum === 1) {
      if (!form.name || !form.email || !form.university) {
        toast.error('Please fill all required fields')
        return false
      }
      if (!form.email.includes('@')) {
        toast.error('Please enter a valid email')
        return false
      }
    }
    if (stepNum === 2) {
      if (form.teamType === 'team' && !form.teamName) {
        toast.error('Please enter a team name')
        return false
      }
    }
    if (stepNum === 3) {
      if (form.techStack.length === 0) {
        toast.error('Please select at least one technology')
        return false
      }
    }
    return true
  }

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(s => Math.min(s + 1, 4))
    }
  }

  const prevStep = () => setStep(s => Math.max(s - 1, 1))

  const handleSubmit = async () => {
    if (!form.agreeTerms) {
      toast.error('Please agree to the terms and conditions')
      return
    }

    setLoading(true)
    
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500))
    
    // Register for event
    registerForEvent(event.id, {
      ...form,
      eventId: event.id,
      eventName: event.name,
      registeredAt: new Date().toISOString(),
      userId: user.uid,
    })

    setLoading(false)
    setSuccess(true)
    toast.success('Successfully registered!')

    // Close modal and redirect after animation
    setTimeout(() => {
      onClose()
      setSuccess(false)
      setStep(1)
      navigate('/dashboard/user/challenges')
    }, 2000)
  }

  if (!isOpen || !event) return null

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: 20 },
  }

  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={overlayVariants}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          variants={modalVariants}
          transition={{ type: 'spring', duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
          className={`w-full max-w-2xl max-h-[90vh] overflow-auto rounded-2xl border ${
            dark
              ? 'bg-[#0a0a1f] border-[#1e3a5f]'
              : 'bg-white border-gray-200 shadow-2xl'
          }`}
        >
          {/* Success State */}
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-24 h-24 rounded-full bg-[#00e676]/10 border-2 border-[#00e676] flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 size={48} className="text-[#00e676]" />
              </motion.div>
              <h2 className={`font-heading font-bold text-3xl mb-2 ${dark ? 'text-white' : 'text-gray-900'}`}>
                Registration Successful!
              </h2>
              <p className={`mb-4 ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>
                You're now registered for <span className="font-bold text-[#00e5ff]">{event.name}</span>
              </p>
              <p className={`text-sm ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>
                Redirecting to your dashboard...
              </p>
            </motion.div>
          ) : (
            <>
              {/* Header */}
              <div className={`sticky top-0 z-10 px-6 py-4 border-b ${
                dark ? 'bg-[#0a0a1f] border-[#1e3a5f]' : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className={`font-heading font-bold text-xl ${dark ? 'text-white' : 'text-gray-900'}`}>
                      Register for Event
                    </h2>
                    <p className={`text-sm mt-1 ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>
                      {event.name}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className={`p-2 rounded-lg transition-colors ${
                      dark ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                    }`}
                  >
                    <X size={20} className={dark ? 'text-[#94a3b8]' : 'text-gray-500'} />
                  </button>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center gap-2 mt-4">
                  {['Personal', 'Team', 'Skills', 'Confirm'].map((label, i) => (
                    <div key={label} className="flex-1">
                      <div className={`h-1.5 rounded-full transition-colors ${
                        i + 1 <= step
                          ? 'bg-gradient-to-r from-[#00e5ff] to-[#0066ff]'
                          : dark ? 'bg-white/10' : 'bg-gray-200'
                      }`} />
                      <p className={`text-xs mt-1 text-center ${
                        i + 1 === step
                          ? (dark ? 'text-[#00e5ff]' : 'text-[#0066ff]')
                          : (dark ? 'text-[#94a3b8]' : 'text-gray-500')
                      }`}>
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Event Info Banner */}
              <div className={`mx-6 mt-4 p-4 rounded-xl border ${
                dark
                  ? 'bg-white/5 border-white/10'
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className={`flex items-center gap-2 ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>
                    <Calendar size={14} className={dark ? 'text-[#00e5ff]' : 'text-[#0066ff]'} />
                    {new Date(event.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                  <span className={`flex items-center gap-2 ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>
                    <MapPin size={14} className={dark ? 'text-[#00e5ff]' : 'text-[#0066ff]'} />
                    {event.venue}
                  </span>
                  {event.prize && (
                    <span className="flex items-center gap-2 text-[#ffd600] font-bold">
                      <Trophy size={14} />
                      {event.prize}
                    </span>
                  )}
                  <span className={`flex items-center gap-2 ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>
                    <Users size={14} className={dark ? 'text-[#00e5ff]' : 'text-[#0066ff]'} />
                    {event.registered}/{event.maxTeams || '∞'} registered
                  </span>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {/* Step 1: Personal Info */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h3 className={`font-heading font-bold text-lg mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
                        Personal Information
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-xs font-medium mb-1.5 ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>
                            Full Name *
                          </label>
                          <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Arjun Sharma"
                            className="input-field"
                            required
                          />
                        </div>
                        <div>
                          <label className={`block text-xs font-medium mb-1.5 ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>
                            Email *
                          </label>
                          <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@email.com"
                            className="input-field"
                            required
                          />
                        </div>
                        <div>
                          <label className={`block text-xs font-medium mb-1.5 ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>
                            Phone Number
                          </label>
                          <input
                            name="phone"
                            type="tel"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="+91 98765 43210"
                            className="input-field"
                          />
                        </div>
                        <div>
                          <label className={`block text-xs font-medium mb-1.5 ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>
                            University/College *
                          </label>
                          <input
                            name="university"
                            value={form.university}
                            onChange={handleChange}
                            placeholder="Marwadi University"
                            className="input-field"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                        <div>
                          <label className={`block text-xs font-medium mb-1.5 ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>
                            <Github size={12} className="inline mr-1" /> GitHub Profile
                          </label>
                          <input
                            name="githubUrl"
                            value={form.githubUrl}
                            onChange={handleChange}
                            placeholder="github.com/username"
                            className="input-field"
                          />
                        </div>
                        <div>
                          <label className={`block text-xs font-medium mb-1.5 ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>
                            <Linkedin size={12} className="inline mr-1" /> LinkedIn
                          </label>
                          <input
                            name="linkedinUrl"
                            value={form.linkedinUrl}
                            onChange={handleChange}
                            placeholder="linkedin.com/in/username"
                            className="input-field"
                          />
                        </div>
                        <div>
                          <label className={`block text-xs font-medium mb-1.5 ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>
                            <Globe size={12} className="inline mr-1" /> Portfolio
                          </label>
                          <input
                            name="portfolioUrl"
                            value={form.portfolioUrl}
                            onChange={handleChange}
                            placeholder="yoursite.com"
                            className="input-field"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Team Info */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h3 className={`font-heading font-bold text-lg mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
                        Team Configuration
                      </h3>

                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setForm(f => ({ ...f, teamType: 'solo' }))}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            form.teamType === 'solo'
                              ? 'border-[#00e5ff] bg-[#00e5ff]/10'
                              : dark
                                ? 'border-white/10 hover:border-white/30'
                                : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <User size={32} className={`mx-auto mb-2 ${
                            form.teamType === 'solo' ? 'text-[#00e5ff]' : (dark ? 'text-[#94a3b8]' : 'text-gray-500')
                          }`} />
                          <p className={`font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>Solo</p>
                          <p className={`text-xs ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>
                            Participate individually
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setForm(f => ({ ...f, teamType: 'team' }))}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            form.teamType === 'team'
                              ? 'border-[#7c4dff] bg-[#7c4dff]/10'
                              : dark
                                ? 'border-white/10 hover:border-white/30'
                                : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Users size={32} className={`mx-auto mb-2 ${
                            form.teamType === 'team' ? 'text-[#7c4dff]' : (dark ? 'text-[#94a3b8]' : 'text-gray-500')
                          }`} />
                          <p className={`font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>Team</p>
                          <p className={`text-xs ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>
                            Up to 4 members
                          </p>
                        </button>
                      </div>

                      {form.teamType === 'team' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="space-y-4 pt-4"
                        >
                          <div>
                            <label className={`block text-xs font-medium mb-1.5 ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>
                              Team Name *
                            </label>
                            <input
                              name="teamName"
                              value={form.teamName}
                              onChange={handleChange}
                              placeholder="Team Nexus"
                              className="input-field"
                              required
                            />
                          </div>

                          <div>
                            <label className={`block text-xs font-medium mb-1.5 ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>
                              Team Size
                            </label>
                            <select
                              name="teamSize"
                              value={form.teamSize}
                              onChange={handleChange}
                              className="input-field"
                            >
                              <option value={2}>2 Members</option>
                              <option value={3}>3 Members</option>
                              <option value={4}>4 Members</option>
                            </select>
                          </div>

                          <div>
                            <label className={`block text-xs font-medium mb-1.5 ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>
                              Invite Teammates (Email)
                            </label>
                            {form.teammates.map((email, i) => (
                              <div key={i} className="flex gap-2 mb-2">
                                <input
                                  value={email}
                                  onChange={(e) => handleTeammateChange(i, e.target.value)}
                                  placeholder={`teammate${i + 1}@email.com`}
                                  className="input-field flex-1"
                                />
                                {form.teammates.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeTeammate(i)}
                                    className={`px-3 rounded-lg ${
                                      dark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'
                                    }`}
                                  >
                                    <X size={16} />
                                  </button>
                                )}
                              </div>
                            ))}
                            {form.teammates.length < form.teamSize - 1 && (
                              <button
                                type="button"
                                onClick={addTeammate}
                                className={`flex items-center gap-2 text-sm mt-2 ${
                                  dark ? 'text-[#00e5ff]' : 'text-[#0066ff]'
                                }`}
                              >
                                <UserPlus size={14} /> Add teammate
                              </button>
                            )}
                            <p className={`text-xs mt-2 ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>
                              Teammates will receive an invite to join your team
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {/* Step 3: Skills & Experience */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h3 className={`font-heading font-bold text-lg mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
                        Skills & Experience
                      </h3>

                      <div>
                        <label className={`block text-xs font-medium mb-2 ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>
                          Experience Level
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { value: 'beginner', label: 'Beginner', desc: '< 1 year' },
                            { value: 'intermediate', label: 'Intermediate', desc: '1-3 years' },
                            { value: 'advanced', label: 'Advanced', desc: '3+ years' },
                          ].map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setForm(f => ({ ...f, experience: opt.value }))}
                              className={`p-3 rounded-xl border-2 text-center transition-all ${
                                form.experience === opt.value
                                  ? 'border-[#00e5ff] bg-[#00e5ff]/10'
                                  : dark
                                    ? 'border-white/10 hover:border-white/30'
                                    : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <p className={`font-bold text-sm ${dark ? 'text-white' : 'text-gray-900'}`}>
                                {opt.label}
                              </p>
                              <p className={`text-xs ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>
                                {opt.desc}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className={`block text-xs font-medium mb-2 ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>
                          <Code2 size={12} className="inline mr-1" /> Tech Stack (Select all that apply) *
                        </label>
                        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
                          {TECH_STACK_OPTIONS.map((tech) => (
                            <button
                              key={tech}
                              type="button"
                              onClick={() => toggleTech(tech)}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                form.techStack.includes(tech)
                                  ? 'bg-gradient-to-r from-[#00e5ff] to-[#0066ff] text-white'
                                  : dark
                                    ? 'bg-white/10 text-[#94a3b8] hover:bg-white/20'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {tech}
                            </button>
                          ))}
                        </div>
                        {form.techStack.length > 0 && (
                          <p className={`text-xs mt-2 ${dark ? 'text-[#00e5ff]' : 'text-[#0066ff]'}`}>
                            Selected: {form.techStack.join(', ')}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Final Confirmation */}
                  {step === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h3 className={`font-heading font-bold text-lg mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
                        Review & Confirm
                      </h3>

                      <div className={`p-4 rounded-xl border space-y-3 ${
                        dark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex justify-between">
                          <span className={dark ? 'text-[#94a3b8]' : 'text-gray-600'}>Name</span>
                          <span className={`font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>{form.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={dark ? 'text-[#94a3b8]' : 'text-gray-600'}>Email</span>
                          <span className={`font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>{form.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={dark ? 'text-[#94a3b8]' : 'text-gray-600'}>University</span>
                          <span className={`font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>{form.university}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={dark ? 'text-[#94a3b8]' : 'text-gray-600'}>Participation</span>
                          <span className={`font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>
                            {form.teamType === 'solo' ? 'Solo' : `Team: ${form.teamName}`}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={dark ? 'text-[#94a3b8]' : 'text-gray-600'}>Experience</span>
                          <span className={`font-medium capitalize ${dark ? 'text-white' : 'text-gray-900'}`}>
                            {form.experience}
                          </span>
                        </div>
                        <div>
                          <span className={dark ? 'text-[#94a3b8]' : 'text-gray-600'}>Tech Stack</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {form.techStack.slice(0, 6).map((tech) => (
                              <span
                                key={tech}
                                className={`px-2 py-0.5 rounded text-xs ${
                                  dark ? 'bg-[#00e5ff]/20 text-[#00e5ff]' : 'bg-blue-100 text-blue-700'
                                }`}
                              >
                                {tech}
                              </span>
                            ))}
                            {form.techStack.length > 6 && (
                              <span className={`text-xs ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>
                                +{form.techStack.length - 6} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-xs font-medium mb-1.5 ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>
                            T-Shirt Size
                          </label>
                          <select
                            name="tshirtSize"
                            value={form.tshirtSize}
                            onChange={handleChange}
                            className="input-field"
                          >
                            <option value="XS">XS</option>
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                            <option value="XXL">XXL</option>
                          </select>
                        </div>
                        <div>
                          <label className={`block text-xs font-medium mb-1.5 ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>
                            Dietary Restrictions
                          </label>
                          <input
                            name="dietaryRestrictions"
                            value={form.dietaryRestrictions}
                            onChange={handleChange}
                            placeholder="None / Vegetarian / Vegan"
                            className="input-field"
                          />
                        </div>
                      </div>

                      <div>
                        <label className={`block text-xs font-medium mb-1.5 ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>
                          How did you hear about us?
                        </label>
                        <select
                          name="heardFrom"
                          value={form.heardFrom}
                          onChange={handleChange}
                          className="input-field"
                        >
                          <option value="">Select option</option>
                          <option value="social">Social Media</option>
                          <option value="friend">Friend/Referral</option>
                          <option value="college">College Notice</option>
                          <option value="search">Google Search</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                        form.agreeTerms
                          ? dark
                            ? 'border-[#00e5ff] bg-[#00e5ff]/5'
                            : 'border-[#0066ff] bg-blue-50'
                          : dark
                            ? 'border-white/10 hover:border-white/30'
                            : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <input
                          type="checkbox"
                          name="agreeTerms"
                          checked={form.agreeTerms}
                          onChange={handleChange}
                          className="mt-1 accent-[#00e5ff]"
                        />
                        <span className={`text-sm ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>
                          I agree to the{' '}
                          <a href="#" className={dark ? 'text-[#00e5ff]' : 'text-[#0066ff]'}>
                            Terms & Conditions
                          </a>
                          {' '}and{' '}
                          <a href="#" className={dark ? 'text-[#00e5ff]' : 'text-[#0066ff]'}>
                            Code of Conduct
                          </a>
                          . I understand that I must be present on event day.
                        </span>
                      </label>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer Actions */}
              <div className={`sticky bottom-0 px-6 py-4 border-t flex justify-between ${
                dark ? 'bg-[#0a0a1f] border-[#1e3a5f]' : 'bg-white border-gray-200'
              }`}>
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      dark
                        ? 'bg-white/10 text-white hover:bg-white/20'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="btn-primary"
                  >
                    Continue <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading || !form.agreeTerms}
                    className={`btn-primary ${loading ? 'opacity-70' : ''}`}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Registering...
                      </>
                    ) : (
                      <>
                        Complete Registration <CheckCircle2 size={16} />
                      </>
                    )}
                  </button>
                )}
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
