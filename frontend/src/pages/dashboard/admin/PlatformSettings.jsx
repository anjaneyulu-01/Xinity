import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, Globe, Mail, Shield, Bell, Palette, Save, ToggleLeft, ToggleRight, Info, Moon, Sun } from 'lucide-react'
import { useTheme } from '../../../context/ThemeContext'
import toast from 'react-hot-toast'

function Toggle({ checked, onChange, color = '#00e5ff' }) {
  return (
    <button onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0`}
      style={{ background: checked ? color : '#334155' }}>
      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  )
}

function Section({ title, icon: Icon, children, dark, border, iconColor = '#00e5ff' }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className={`glass-card border ${border} p-6`}>
      <div className="flex items-center gap-2 mb-5">
        <Icon size={16} style={{ color: iconColor }} />
        <h2 className={`font-heading font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
      </div>
      {children}
    </motion.div>
  )
}

export default function PlatformSettings() {
  const { dark, toggle } = useTheme()
  const border   = dark ? 'border-[#1e3a5f]' : 'border-gray-200'
  const text     = dark ? 'text-white'        : 'text-gray-900'
  const sub      = dark ? 'text-[#94a3b8]'    : 'text-gray-500'
  const inputCls = `w-full px-3 py-2 rounded-xl border text-sm outline-none transition-all ${dark ? 'bg-white/5 border-[#1e3a5f] text-white placeholder-[#94a3b8]' : 'bg-gray-50 border-gray-200 text-gray-900'}`

  const [general, setGeneral] = useState({
    platformName:  'Xinity',
    tagline:       'Where Coders Meet Challenges',
    supportEmail:  'support@xinity.in',
    maxTeamSize:   4,
    minTeamSize:   1,
    timezone:      'Asia/Kolkata',
  })
  const [features, setFeatures] = useState({
    registrationOpen:   true,
    teamFormation:      true,
    publicLeaderboard:  true,
    googleAuth:         true,
    certificateGen:     true,
    emailNotifications: true,
    maintenanceMode:    false,
    demoAccess:         true,
  })
  const [email, setEmail] = useState({
    fromName:    'Xinity Platform',
    fromAddress: 'noreply@xinity.in',
    smtpHost:    'smtp.xinity.in',
    smtpPort:    '587',
  })
  const [security, setSecurity] = useState({
    requireEmailVerification: true,
    allowMultipleAccounts:    false,
    maxLoginAttempts:         '5',
    sessionTimeout:           '24',
  })

  const save = (section) => toast.success(`${section} settings saved!`)

  const FEATURE_LABELS = {
    registrationOpen:   { label: 'Registration Open',        desc: 'Allow new participants to register',           color: '#00e676' },
    teamFormation:      { label: 'Team Formation',           desc: 'Allow participants to create & join teams',    color: '#00e5ff' },
    publicLeaderboard:  { label: 'Public Leaderboard',       desc: 'Show rankings to all visitors',                color: '#7c4dff' },
    googleAuth:         { label: 'Google Sign-In',           desc: 'Allow sign-in with Google accounts',           color: '#ff4081' },
    certificateGen:     { label: 'Certificate Generation',   desc: 'Enable automated certificate creation',        color: '#00e5ff' },
    emailNotifications: { label: 'Email Notifications',      desc: 'Send automated emails to users',               color: '#ffd600' },
    maintenanceMode:    { label: 'Maintenance Mode',         desc: 'Temporarily disable public access to platform',color: '#ff4081' },
    demoAccess:         { label: 'Demo Access Buttons',      desc: 'Show quick-fill demo credentials on login',    color: '#94a3b8' },
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h1 className={`font-heading font-bold text-2xl ${text}`}>Platform Settings</h1>
        <p className={`text-sm mt-1 ${sub}`}>Configure global platform behaviour and features</p>
      </div>

      {/* General */}
      <Section title="General" icon={Globe} dark={dark} border={border}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Platform Name',  field: 'platformName',  type: 'text' },
            { label: 'Tagline',        field: 'tagline',       type: 'text' },
            { label: 'Support Email',  field: 'supportEmail',  type: 'email' },
            { label: 'Timezone',       field: 'timezone',      type: 'text' },
            { label: 'Min Team Size',  field: 'minTeamSize',   type: 'number' },
            { label: 'Max Team Size',  field: 'maxTeamSize',   type: 'number' },
          ].map(({ label, field, type }) => (
            <div key={field}>
              <label className={`block text-xs font-medium mb-1.5 ${sub}`}>{label}</label>
              <input type={type} value={general[field]}
                onChange={e => setGeneral(g => ({ ...g, [field]: e.target.value }))}
                className={inputCls} />
            </div>
          ))}
        </div>
        <button onClick={() => save('General')} className="btn-primary text-sm py-2 px-5 mt-4">
          <Save size={14} /> Save General
        </button>
      </Section>

      {/* Feature toggles */}
      <Section title="Feature Flags" icon={ToggleRight} dark={dark} border={border} iconColor="#7c4dff">
        <div className="flex flex-col gap-4">
          {Object.entries(FEATURE_LABELS).map(([key, { label, desc, color }]) => (
            <div key={key} className={`flex items-center justify-between gap-4 pb-4 border-b last:border-b-0 last:pb-0 ${border}`}>
              <div>
                <p className={`text-sm font-medium ${text}`}>{label}</p>
                <p className={`text-xs ${sub}`}>{desc}</p>
              </div>
              <Toggle checked={features[key]} onChange={v => {
                setFeatures(f => ({ ...f, [key]: v }))
                toast.success(`${label} ${v ? 'enabled' : 'disabled'}`)
              }} color={color} />
            </div>
          ))}
        </div>
      </Section>

      {/* Email config */}
      <Section title="Email Configuration" icon={Mail} dark={dark} border={border} iconColor="#ffd600">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'From Name',    field: 'fromName',    type: 'text'   },
            { label: 'From Address', field: 'fromAddress', type: 'email'  },
            { label: 'SMTP Host',    field: 'smtpHost',    type: 'text'   },
            { label: 'SMTP Port',    field: 'smtpPort',    type: 'number' },
          ].map(({ label, field, type }) => (
            <div key={field}>
              <label className={`block text-xs font-medium mb-1.5 ${sub}`}>{label}</label>
              <input type={type} value={email[field]}
                onChange={e => setEmail(em => ({ ...em, [field]: e.target.value }))}
                className={inputCls} />
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={() => toast.success('Test email sent to support@xinity.in')} className="btn-ghost text-sm py-2 px-4">Send Test Email</button>
          <button onClick={() => save('Email')} className="btn-primary text-sm py-2 px-5"><Save size={14} /> Save Email</button>
        </div>
      </Section>

      {/* Security */}
      <Section title="Security" icon={Shield} dark={dark} border={border} iconColor="#ff4081">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Max Login Attempts', field: 'maxLoginAttempts', type: 'number' },
            { label: 'Session Timeout (h)', field: 'sessionTimeout',  type: 'number' },
          ].map(({ label, field, type }) => (
            <div key={field}>
              <label className={`block text-xs font-medium mb-1.5 ${sub}`}>{label}</label>
              <input type={type} value={security[field]}
                onChange={e => setSecurity(s => ({ ...s, [field]: e.target.value }))}
                className={inputCls} />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3 mt-4">
          {[
            { key: 'requireEmailVerification', label: 'Require Email Verification', desc: 'Users must verify email before accessing platform' },
            { key: 'allowMultipleAccounts',    label: 'Allow Multiple Accounts',    desc: 'Allow same email across multiple roles' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between gap-4">
              <div>
                <p className={`text-sm font-medium ${text}`}>{label}</p>
                <p className={`text-xs ${sub}`}>{desc}</p>
              </div>
              <Toggle checked={security[key]} onChange={v => setSecurity(s => ({ ...s, [key]: v }))} color="#ff4081" />
            </div>
          ))}
        </div>
        <button onClick={() => save('Security')} className="btn-primary text-sm py-2 px-5 mt-4" style={{ background: 'linear-gradient(135deg,#ff4081,#c62828)' }}>
          <Save size={14} /> Save Security
        </button>
      </Section>

      {/* Appearance */}
      <Section title="Appearance" icon={Palette} dark={dark} border={border} iconColor="#00e5ff">
        <p className={`text-sm mb-4 ${sub}`}>Toggle the platform-wide colour theme.</p>
        <div className="grid grid-cols-2 gap-3 max-w-xs">
          {[{ mode: 'dark', icon: Moon, label: 'Dark Mode' }, { mode: 'light', icon: Sun, label: 'Light Mode' }].map(({ mode, icon: Icon, label }) => (
            <button key={mode}
              onClick={() => { if ((mode === 'dark') !== dark) toggle(); toast.success(`Switched to ${label}`) }}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-sm font-medium transition-all ${
                (mode === 'dark') === dark
                  ? (dark ? 'border-[#00e5ff] bg-[#00e5ff]/10 text-[#00e5ff]' : 'border-[#0066ff] bg-[#0066ff]/10 text-[#0066ff]')
                  : (dark ? 'border-[#1e3a5f] text-[#94a3b8]' : 'border-gray-200 text-gray-500')
              }`}>
              <Icon size={20} />{label}
            </button>
          ))}
        </div>
      </Section>
    </div>
  )
}
