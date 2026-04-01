import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Lock, User, Eye, EyeOff, Save, Moon, Sun, Monitor, Palette } from 'lucide-react'
import { useAuthStore } from '../../../store/authStore'
import { useTheme } from '../../../context/ThemeContext'
import toast from 'react-hot-toast'

const NOTIF_ITEMS = [
  { key: 'newAssignment', label: 'New review assignments',   desc: 'When submissions are assigned to you for review' },
  { key: 'deadline',      label: 'Review deadline reminders', desc: 'Reminders 24h and 2h before review closes' },
  { key: 'scoreUpdate',   label: 'Score override alerts',     desc: 'When an admin adjusts your given score' },
  { key: 'announcement',  label: 'Event announcements',       desc: 'Updates from event organizers' },
]

function Toggle({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-[#7c4dff]' : 'bg-gray-600'}`}>
      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  )
}

export default function JudgeSettings() {
  const { user } = useAuthStore()
  const { dark, toggle } = useTheme()
  const border = dark ? 'border-[#1e3a5f]' : 'border-gray-200'
  const text   = dark ? 'text-white'        : 'text-gray-900'
  const sub    = dark ? 'text-[#94a3b8]'    : 'text-gray-500'
  const inputCls = `w-full px-3 py-2 rounded-xl border text-sm outline-none transition-all ${dark ? 'bg-white/5 border-[#1e3a5f] text-white placeholder-[#94a3b8] focus:border-[#7c4dff]/50' : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#7c4dff]/50'}`

  const [notifs, setNotifs] = useState({ newAssignment: true, deadline: true, scoreUpdate: true, announcement: false })
  const [profile, setProfile] = useState({ name: user?.name || '', university: user?.university || '', expertise: 'Full Stack, AI/ML' })
  const [pw, setPw] = useState({ old: '', new_: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [themeMode, setThemeMode] = useState('dark')

  const applyTheme = (mode) => {
    setThemeMode(mode)
    if (mode === 'dark' && !dark) toggle()
    if (mode === 'light' && dark) toggle()
    toast.success(`Theme set to ${mode}`)
  }

  const saveProfile = () => toast.success('Profile saved!')
  const savePassword = () => {
    if (pw.new_ !== pw.confirm) { toast.error('Passwords do not match'); return }
    if (pw.new_.length < 8) { toast.error('Minimum 8 characters'); return }
    setPw({ old: '', new_: '', confirm: '' })
    toast.success('Password updated!')
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h1 className={`font-heading font-bold text-2xl ${text}`}>Settings</h1>
        <p className={`text-sm mt-1 ${sub}`}>Manage your judge profile and preferences</p>
      </div>

      {/* Profile info */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className={`glass-card border ${border} p-6`}>
        <div className="flex items-center gap-2 mb-5">
          <User size={16} className="text-[#7c4dff]" />
          <h2 className={`font-heading font-semibold ${text}`}>Judge Profile</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Full Name',   field: 'name',       placeholder: 'Your name' },
            { label: 'Institution', field: 'university', placeholder: 'Your university/org' },
            { label: 'Areas of Expertise', field: 'expertise', placeholder: 'e.g. AI/ML, Web Dev' },
          ].map(({ label, field, placeholder }) => (
            <div key={field} className={field === 'expertise' ? 'sm:col-span-2' : ''}>
              <label className={`block text-xs font-medium mb-1.5 ${sub}`}>{label}</label>
              <input value={profile[field]} onChange={e => setProfile(p => ({ ...p, [field]: e.target.value }))}
                placeholder={placeholder} className={inputCls} />
            </div>
          ))}
        </div>
        <button onClick={saveProfile} className="btn-primary text-sm py-2 px-5 mt-4" style={{ background: 'linear-gradient(135deg,#7c4dff,#5c35cc)' }}>
          <Save size={14} /> Save Profile
        </button>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className={`glass-card border ${border} p-6`}>
        <div className="flex items-center gap-2 mb-5">
          <Bell size={16} className="text-[#7c4dff]" />
          <h2 className={`font-heading font-semibold ${text}`}>Notifications</h2>
        </div>
        <div className="flex flex-col gap-4">
          {NOTIF_ITEMS.map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between gap-4">
              <div>
                <p className={`text-sm font-medium ${text}`}>{label}</p>
                <p className={`text-xs ${sub}`}>{desc}</p>
              </div>
              <Toggle checked={notifs[key]} onChange={v => setNotifs(n => ({ ...n, [key]: v }))} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Appearance */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={`glass-card border ${border} p-6`}>
        <div className="flex items-center gap-2 mb-5">
          <Palette size={16} className="text-[#7c4dff]" />
          <h2 className={`font-heading font-semibold ${text}`}>Appearance</h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[{ mode: 'light', icon: Sun, label: 'Light' }, { mode: 'dark', icon: Moon, label: 'Dark' }, { mode: 'system', icon: Monitor, label: 'System' }].map(({ mode, icon: Icon, label }) => (
            <button key={mode} onClick={() => applyTheme(mode)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-sm font-medium transition-all ${
                themeMode === mode
                  ? 'border-[#7c4dff] bg-[#7c4dff]/10 text-[#7c4dff]'
                  : (dark ? 'border-[#1e3a5f] text-[#94a3b8]' : 'border-gray-200 text-gray-500')
              }`}>
              <Icon size={20} />{label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Change password */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className={`glass-card border ${border} p-6`}>
        <div className="flex items-center gap-2 mb-5">
          <Lock size={16} className="text-[#7c4dff]" />
          <h2 className={`font-heading font-semibold ${text}`}>Change Password</h2>
        </div>
        <div className="flex flex-col gap-3 max-w-sm">
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${sub}`}>Current Password</label>
            <input type="password" value={pw.old} onChange={e => setPw(p => ({ ...p, old: e.target.value }))} placeholder="••••••••" className={inputCls} />
          </div>
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${sub}`}>New Password</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} value={pw.new_} onChange={e => setPw(p => ({ ...p, new_: e.target.value }))} placeholder="Min 8 characters" className={`${inputCls} pr-10`} />
              <button type="button" onClick={() => setShowPw(!showPw)} className={`absolute right-3 top-1/2 -translate-y-1/2 ${sub}`}>
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${sub}`}>Confirm New Password</label>
            <input type="password" value={pw.confirm} onChange={e => setPw(p => ({ ...p, confirm: e.target.value }))} placeholder="Re-enter new password" className={inputCls} />
          </div>
          <button onClick={savePassword} className="self-start text-sm py-2 px-5 rounded-full font-semibold transition-all" style={{ background: 'linear-gradient(135deg,#7c4dff,#5c35cc)', color: 'white' }}>
            <Save size={14} className="inline mr-1.5" /> Update Password
          </button>
        </div>
      </motion.div>
    </div>
  )
}
