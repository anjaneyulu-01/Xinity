import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Building, Github, Linkedin, Globe, Edit2, Save, X, Trophy, Star, Upload } from 'lucide-react'
import { useAuthStore } from '../../../store/authStore'
import { useTheme } from '../../../context/ThemeContext'
import toast from 'react-hot-toast'

const SKILLS = ['React', 'Node.js', 'Python', 'UI/UX', 'Machine Learning', 'AWS']
const BADGES = [
  { id: 'early-bird',       icon: '🐦', label: 'Early Bird',      desc: 'Registered within first 24h',   earned: true  },
  { id: 'team-player',      icon: '🤝', label: 'Team Player',     desc: 'Joined a team in 3+ events',     earned: true  },
  { id: 'first-submission', icon: '🚀', label: 'First Launch',    desc: 'Made your first submission',      earned: true  },
  { id: 'first-win',        icon: '🏆', label: 'First Win',       desc: 'Placed in top 3',                 earned: false },
  { id: 'speed-builder',    icon: '⚡', label: 'Speed Builder',   desc: 'Submitted within 1h of deadline', earned: false },
  { id: 'perfect-score',    icon: '💯', label: 'Perfect Score',   desc: 'Scored 100/100 from judges',      earned: false },
]

export default function Profile() {
  const { user } = useAuthStore()
  const { dark } = useTheme()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name:       user?.name       || '',
    university: user?.university || 'Marwadi University',
    bio:        'Passionate full-stack developer & hackathon enthusiast. Love building products that solve real problems.',
    github:     'github.com/arjunsharma',
    linkedin:   'linkedin.com/in/arjunsharma',
    website:    'arjunsharma.dev',
    skills:     SKILLS,
  })

  const initials = form.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  const save = () => {
    setEditing(false)
    toast.success('Profile updated!')
  }

  const border = dark ? 'border-[#1e3a5f]' : 'border-gray-200'
  const cardBg = dark ? 'glass-card' : 'bg-white shadow-sm rounded-2xl'
  const text    = dark ? 'text-white'   : 'text-gray-900'
  const sub     = dark ? 'text-[#94a3b8]' : 'text-gray-500'
  const input   = `w-full px-3 py-2 rounded-xl border text-sm outline-none transition-all ${dark ? 'bg-white/5 border-[#1e3a5f] text-white placeholder-[#94a3b8] focus:border-[#00e5ff]/50' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#0066ff]/50'}`

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`font-heading font-bold text-2xl ${text}`}>My Profile</h1>
          <p className={`text-sm mt-1 ${sub}`}>Manage your personal information and public presence</p>
        </div>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="btn-ghost text-sm py-2 px-4">
            <Edit2 size={14} /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => setEditing(false)} className={`flex items-center gap-1.5 text-sm py-2 px-4 rounded-full border transition-all ${dark ? 'border-[#1e3a5f] text-[#94a3b8] hover:text-white' : 'border-gray-200 text-gray-500 hover:text-gray-900'}`}>
              <X size={14} /> Cancel
            </button>
            <button onClick={save} className="btn-primary text-sm py-2 px-4">
              <Save size={14} /> Save
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar & stats column */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`${cardBg} border ${border} p-6 flex flex-col items-center gap-4`}>
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#00e5ff] to-[#7c4dff] flex items-center justify-center text-3xl font-heading font-bold text-white shadow-lg">
              {initials}
            </div>
            {editing && (
              <button className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload size={18} className="text-white" />
              </button>
            )}
          </div>
          <div className="text-center">
            <p className={`font-heading font-bold text-lg ${text}`}>{form.name}</p>
            <p className={`text-sm ${sub}`}>{user?.email}</p>
            <span className="mt-2 inline-block text-xs font-bold px-3 py-1 rounded-full bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/20 capitalize">{user?.role}</span>
          </div>
          <div className={`w-full grid grid-cols-2 gap-3 pt-4 border-t ${border}`}>
            {[
              { label: 'Points', value: user?.points || 2450, icon: Star, color: '#ffd600' },
              { label: 'Rank', value: `#${user?.rank || 7}`, icon: Trophy, color: '#00e5ff' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className={`rounded-xl p-3 text-center border ${dark ? 'bg-white/3 border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                <Icon size={16} className="mx-auto mb-1" style={{ color }} />
                <p className={`font-bold text-sm ${text}`}>{value}</p>
                <p className={`text-xs ${sub}`}>{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Info column */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={`lg:col-span-2 ${cardBg} border ${border} p-6 flex flex-col gap-5`}>
          <h2 className={`font-heading font-semibold ${text}`}>Personal Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Full Name',   field: 'name',       icon: User,     type: 'text' },
              { label: 'University',  field: 'university', icon: Building, type: 'text' },
              { label: 'GitHub',      field: 'github',     icon: Github,   type: 'text' },
              { label: 'LinkedIn',    field: 'linkedin',   icon: Linkedin, type: 'text' },
              { label: 'Website',     field: 'website',    icon: Globe,    type: 'text' },
              { label: 'Email',       field: 'email',      icon: Mail,     type: 'text', value: user?.email, readOnly: true },
            ].map(({ label, field, icon: Icon, type, value, readOnly }) => (
              <div key={field}>
                <label className={`block text-xs font-medium mb-1.5 ${sub}`}>{label}</label>
                {editing && !readOnly ? (
                  <div className="relative">
                    <Icon size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${sub}`} />
                    <input type={type} value={form[field] || ''} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                      className={`${input} pl-8`} />
                  </div>
                ) : (
                  <div className={`flex items-center gap-2 text-sm ${text}`}>
                    <Icon size={14} style={{ color: '#00e5ff' }} />
                    <span className={readOnly ? sub : ''}>{value || form[field] || '—'}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div>
            <label className={`block text-xs font-medium mb-1.5 ${sub}`}>Bio</label>
            {editing ? (
              <textarea rows={3} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                className={`${input} resize-none`} />
            ) : (
              <p className={`text-sm leading-relaxed ${text}`}>{form.bio}</p>
            )}
          </div>

          <div>
            <label className={`block text-xs font-medium mb-2 ${sub}`}>Skills</label>
            <div className="flex flex-wrap gap-2">
              {form.skills.map(s => (
                <span key={s} className={`text-xs font-medium px-3 py-1 rounded-full border ${dark ? 'bg-[#00e5ff]/10 text-[#00e5ff] border-[#00e5ff]/20' : 'bg-[#0066ff]/10 text-[#0066ff] border-[#0066ff]/20'}`}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Badges */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={`${cardBg} border ${border} p-6`}>
        <h2 className={`font-heading font-semibold mb-4 ${text}`}>Badges & Achievements</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {BADGES.map(b => (
            <div key={b.id} className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all ${
              b.earned
                ? (dark ? 'border-[#00e5ff]/20 bg-[#00e5ff]/5' : 'border-[#0066ff]/20 bg-[#0066ff]/5')
                : (dark ? 'border-white/5 opacity-40' : 'border-gray-200 opacity-40')
            }`}>
              <span className={`text-2xl ${!b.earned && 'grayscale'}`}>{b.icon}</span>
              <p className={`text-xs font-semibold ${text}`}>{b.label}</p>
              <p className={`text-[10px] ${sub}`}>{b.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
