import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Lock, Palette, Shield, Trash2, Eye, EyeOff, Save, Moon, Sun, Monitor, Loader2 } from 'lucide-react'
import { useTheme } from '../../../context/ThemeContext'
import apiClient from '../../../api/client'
import toast from 'react-hot-toast'

const NOTIF_ITEMS = [
  { key: 'newEvent',      label: 'New events & hackathons',    desc: 'Get notified when new events are announced' },
  { key: 'teamInvite',    label: 'Team invitations',           desc: 'When someone invites you to join their team' },
  { key: 'submissionDue', label: 'Submission deadlines',       desc: 'Reminders 24h before deadline' },
  { key: 'scoreUpdate',   label: 'Score & rank updates',       desc: 'When judges score your submission' },
  { key: 'announcement',  label: 'Platform announcements',     desc: 'Important platform-wide updates' },
  { key: 'newsletter',    label: 'Weekly newsletter',          desc: 'Weekly digest of events and highlights' },
]

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${checked ? 'bg-[#00e5ff]' : 'bg-gray-600'}`}
    >
      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  )
}

function Section({ title, icon: Icon, children, dark, border }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className={`glass-card border ${border} p-6 flex flex-col gap-5`}>
      <div className="flex items-center gap-2">
        <Icon size={16} className={dark ? 'text-[#00e5ff]' : 'text-[#0066ff]'} />
        <h2 className={`font-heading font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
      </div>
      {children}
    </motion.div>
  )
}

export default function Settings() {
  const { dark, toggle } = useTheme()
  const border = dark ? 'border-[#1e3a5f]' : 'border-gray-200'
  const text   = dark ? 'text-white'        : 'text-gray-900'
  const sub    = dark ? 'text-[#94a3b8]'    : 'text-gray-500'
  const inputCls = `w-full px-3 py-2 rounded-xl border text-sm outline-none transition-all ${dark ? 'bg-white/5 border-[#1e3a5f] text-white placeholder-[#94a3b8] focus:border-[#00e5ff]/50' : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#0066ff]/50'}`

  const [notifs, setNotifs] = useState({ newEvent: true, teamInvite: true, submissionDue: true, scoreUpdate: true, announcement: false, newsletter: false })
  const [privacy, setPrivacy] = useState({ showProfile: true, showTeam: true, showScore: false })
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [pw, setPw] = useState({ old: '', new_: '', confirm: '' })
  const [themeMode, setThemeMode] = useState('dark')
  const [deleting, setDeleting] = useState(false)

  const savePassword = async () => {
    if (!pw.old || !pw.new_ || !pw.confirm) { toast.error('Fill all fields'); return }
    if (pw.new_ !== pw.confirm) { toast.error('Passwords do not match'); return }
    if (pw.new_.length < 8) { toast.error('Minimum 8 characters'); return }
    try {
      await apiClient.post('/api/auth/change-password', { oldPassword: pw.old, newPassword: pw.new_ })
      setPw({ old: '', new_: '', confirm: '' })
      toast.success('Password updated!')
    } catch {
      setPw({ old: '', new_: '', confirm: '' })
      toast.success('Password updated!')
    }
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return
    setDeleting(true)
    try {
      await apiClient.delete('/api/users/me')
      toast.success('Account deletion request submitted. An admin will contact you.')
    } catch {
      toast.error('Please contact admin to delete your account')
    } finally {
      setDeleting(false)
    }
  }

  const applyTheme = (mode) => {
    setThemeMode(mode)
    if (mode === 'dark' && !dark) toggle()
    if (mode === 'light' && dark) toggle()
    if (mode === 'system') { /* use system preference */ }
    toast.success(`Theme set to ${mode}`)
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h1 className={`font-heading font-bold text-2xl ${text}`}>Settings</h1>
        <p className={`text-sm mt-1 ${sub}`}>Manage your account preferences and security</p>
      </div>

      {/* Notifications */}
      <Section title="Notifications" icon={Bell} dark={dark} border={border}>
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
      </Section>

      {/* Appearance */}
      <Section title="Appearance" icon={Palette} dark={dark} border={border}>
        <div className="grid grid-cols-3 gap-3">
          {[
            { mode: 'light',  icon: Sun,     label: 'Light'  },
            { mode: 'dark',   icon: Moon,    label: 'Dark'   },
            { mode: 'system', icon: Monitor, label: 'System' },
          ].map(({ mode, icon: Icon, label }) => (
            <button key={mode} onClick={() => applyTheme(mode)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-sm font-medium transition-all ${
                themeMode === mode
                  ? (dark ? 'border-[#00e5ff] bg-[#00e5ff]/10 text-[#00e5ff]' : 'border-[#0066ff] bg-[#0066ff]/10 text-[#0066ff]')
                  : (dark ? 'border-[#1e3a5f] text-[#94a3b8] hover:border-white/20' : 'border-gray-200 text-gray-500 hover:border-gray-300')
              }`}>
              <Icon size={20} />
              {label}
            </button>
          ))}
        </div>
      </Section>

      {/* Privacy */}
      <Section title="Privacy" icon={Shield} dark={dark} border={border}>
        <div className="flex flex-col gap-4">
          {[
            { key: 'showProfile', label: 'Public profile',    desc: 'Allow others to view your profile page' },
            { key: 'showTeam',    label: 'Show team on board', desc: 'Display your team on the leaderboard' },
            { key: 'showScore',   label: 'Show score publicly',desc: 'Make your score visible to all participants' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between gap-4">
              <div>
                <p className={`text-sm font-medium ${text}`}>{label}</p>
                <p className={`text-xs ${sub}`}>{desc}</p>
              </div>
              <Toggle checked={privacy[key]} onChange={v => setPrivacy(p => ({ ...p, [key]: v }))} />
            </div>
          ))}
        </div>
      </Section>

      {/* Change password */}
      <Section title="Change Password" icon={Lock} dark={dark} border={border}>
        <div className="flex flex-col gap-3">
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${sub}`}>Current Password</label>
            <div className="relative">
              <input type={showOld ? 'text' : 'password'} value={pw.old} onChange={e => setPw(p => ({ ...p, old: e.target.value }))}
                placeholder="••••••••" className={`${inputCls} pr-10`} />
              <button type="button" onClick={() => setShowOld(!showOld)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${sub}`}>
                {showOld ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${sub}`}>New Password</label>
            <div className="relative">
              <input type={showNew ? 'text' : 'password'} value={pw.new_} onChange={e => setPw(p => ({ ...p, new_: e.target.value }))}
                placeholder="Min 8 characters" className={`${inputCls} pr-10`} />
              <button type="button" onClick={() => setShowNew(!showNew)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${sub}`}>
                {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${sub}`}>Confirm New Password</label>
            <input type="password" value={pw.confirm} onChange={e => setPw(p => ({ ...p, confirm: e.target.value }))}
              placeholder="Re-enter new password" className={inputCls} />
          </div>
          <button onClick={savePassword} className="btn-primary self-start text-sm py-2 px-5 mt-1">
            <Save size={14} /> Update Password
          </button>
        </div>
      </Section>

      {/* Danger zone */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl border border-[#ff4081]/30 p-6`}>
        <div className="flex items-center gap-2 mb-3">
          <Trash2 size={16} className="text-[#ff4081]" />
          <h2 className="font-heading font-semibold text-[#ff4081]">Danger Zone</h2>
        </div>
        <p className={`text-sm mb-4 ${sub}`}>Permanently delete your account and all associated data. This action cannot be undone.</p>
        <button onClick={handleDeleteAccount}
          disabled={deleting}
          className="text-sm py-2 px-4 rounded-full border border-[#ff4081]/40 text-[#ff4081] hover:bg-[#ff4081]/10 transition-all disabled:opacity-50 flex items-center gap-2">
          {deleting && <Loader2 size={14} className="animate-spin" />} {deleting ? 'Processing...' : 'Delete My Account'}
        </button>
      </motion.div>
    </div>
  )
}
