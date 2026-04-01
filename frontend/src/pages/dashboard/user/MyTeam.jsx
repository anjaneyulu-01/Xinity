import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, UserPlus, Link as LinkIcon, Crown, Wifi, WifiOff, Search } from 'lucide-react'
import { MOCK_TEAMS } from '../../../store/eventStore'
import toast from 'react-hot-toast'

const OPEN_TEAMS = [
  { name: 'CodeStorm',  event: 'WebX Challenge 2026', spots: 2, skills: ['React', 'Node.js'] },
  { name: 'BitWizards', event: 'AI Hack Sprint',      spots: 1, skills: ['Python', 'ML'] },
  { name: 'NeonBuilds', event: 'WebX Challenge 2026', spots: 3, skills: ['Flutter', 'Firebase'] },
]

function Avatar({ name, online, size = 10 }) {
  const initials = name.split(' ').map(w => w[0]).join('')
  const colors = ['#00e5ff', '#7c4dff', '#0066ff', '#00e676', '#ff4081']
  const color = colors[name.charCodeAt(0) % colors.length]
  return (
    <div className="relative">
      <div className={`w-${size} h-${size} rounded-full flex items-center justify-center font-bold text-[#04040f] text-sm`}
        style={{ background: `linear-gradient(135deg, ${color}, ${color}88)` }}>
        {initials}
      </div>
      <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#080818] ${online ? 'bg-[#00e676]' : 'bg-[#94a3b8]'}`} />
    </div>
  )
}

export default function MyTeam() {
  const [copied, setCopied] = useState(false)
  const team = MOCK_TEAMS[0]

  const copyLink = () => {
    navigator.clipboard.writeText('https://xinity.in/join/team-nexus-2026').catch(() => {})
    setCopied(true)
    toast.success('Invite link copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading font-bold text-2xl text-white">My Team</h1>
        <p className="text-[#94a3b8] text-sm mt-1">Manage your team and find new members</p>
      </div>

      {/* Current team card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 border border-[#00e5ff]/20">
        <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Crown size={18} className="text-[#ffd600]" />
              <h2 className="font-heading font-bold text-xl text-white">{team.name}</h2>
            </div>
            <p className="text-[#94a3b8] text-sm">WebX Challenge 2026</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-heading font-bold text-[#00e5ff]">{team.score.toLocaleString()}</div>
            <div className="text-xs text-[#94a3b8]">pts · Rank #{team.rank}</div>
          </div>
        </div>

        {/* Members */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {team.members.map(m => (
            <div key={m.uid} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
              <Avatar name={m.name} online={m.online} />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{m.name}</p>
                <p className="text-xs text-[#94a3b8] flex items-center gap-1">
                  {m.online ? <Wifi size={10} className="text-[#00e676]" /> : <WifiOff size={10} />}
                  {m.online ? 'Online' : 'Offline'}
                  {m.role === 'leader' && <Crown size={10} className="text-[#ffd600] ml-1" />}
                </p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full capitalize border" style={{
                color: m.role === 'leader' ? '#ffd600' : '#94a3b8',
                borderColor: m.role === 'leader' ? '#ffd60030' : '#1e3a5f',
                background: m.role === 'leader' ? '#ffd60010' : 'transparent',
              }}>{m.role}</span>
            </div>
          ))}
        </div>

        {/* Invite */}
        <button onClick={copyLink} className="btn-ghost w-full justify-center py-2.5 text-sm">
          <LinkIcon size={14} />
          {copied ? 'Link Copied!' : 'Copy Invite Link'}
        </button>
      </motion.div>

      {/* Find team section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 border border-[#1e3a5f]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-bold text-white">Teams Looking for Members</h3>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
            <input placeholder="Filter by skill..." className="input-field py-2 pl-8 text-sm w-48" />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {OPEN_TEAMS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between p-4 rounded-xl bg-white/3 border border-white/5 hover:border-[#00e5ff]/20 transition-all"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Users size={14} className="text-[#7c4dff]" />
                  <span className="font-semibold text-white">{t.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/20">{t.spots} spot{t.spots > 1 ? 's' : ''} open</span>
                </div>
                <p className="text-[#94a3b8] text-xs ml-5">{t.event}</p>
                <div className="flex gap-1.5 mt-2 ml-5 flex-wrap">
                  {t.skills.map(s => <span key={s} className="text-xs px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[#94a3b8] font-code">{s}</span>)}
                </div>
              </div>
              <button onClick={() => toast.success(`Join request sent to ${t.name}!`)} className="btn-primary text-xs py-2 px-4 flex-shrink-0 ml-3">
                <UserPlus size={12} /> Join
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
