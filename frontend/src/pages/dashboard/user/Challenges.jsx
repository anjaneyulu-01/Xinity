import { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Clock, Users, CheckCircle2, AlertCircle, Eye } from 'lucide-react'
import { MOCK_EVENTS } from '../../../store/eventStore'
import CountdownTimer from '../../../components/ui/CountdownTimer'

const STATUS_STYLE = {
  'Registered':     { color: '#00e5ff',  bg: '#00e5ff15', icon: Eye },
  'Submitted':      { color: '#00e676',  bg: '#00e67615', icon: CheckCircle2 },
  'Under Review':   { color: '#ffd600',  bg: '#ffd60015', icon: AlertCircle },
  'Results Out':    { color: '#7c4dff',  bg: '#7c4dff15', icon: CheckCircle2 },
}

const MY_CHALLENGES = [
  { ...MOCK_EVENTS[0], status: 'Registered', team: 'Team Nexus', members: 4, progress: 70 },
  { ...MOCK_EVENTS[1], status: 'Registered', team: 'Team Nexus', members: 4, progress: 20 },
]

const TABS = ['Active', 'Completed', 'Upcoming']

export default function Challenges() {
  const [tab, setTab] = useState('Active')

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-white">My Challenges</h1>
          <p className="text-[#94a3b8] text-sm mt-1">Track all your hackathon registrations</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 rounded-xl bg-white/5 border border-[#1e3a5f] w-fit">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${tab === t ? 'bg-[#00e5ff] text-[#04040f]' : 'text-[#94a3b8] hover:text-white'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Challenge cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {MY_CHALLENGES.map((ch, i) => {
          const ss = STATUS_STYLE[ch.status] || STATUS_STYLE['Registered']
          const StatusIcon = ss.icon
          return (
            <motion.div
              key={ch.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 border border-white/5 hover:border-[#00e5ff]/20 transition-all"
            >
              <div className={`absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl bg-gradient-to-r ${ch.gradient}`} />

              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-heading font-bold text-white text-lg">{ch.name}</h3>
                  <p className="text-[#94a3b8] text-sm mt-0.5">{ch.venue}</p>
                </div>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold flex-shrink-0"
                  style={{ color: ss.color, background: ss.bg }}>
                  <StatusIcon size={12} /> {ch.status}
                </span>
              </div>

              {/* Team */}
              <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-white/3 border border-white/5">
                <Users size={14} className="text-[#94a3b8]" />
                <span className="text-white text-sm font-medium">{ch.team}</span>
                <span className="text-[#94a3b8] text-xs ml-auto">{ch.members} members</span>
              </div>

              {/* Countdown */}
              <div className="mb-4">
                <p className="text-xs text-[#94a3b8] mb-2 flex items-center gap-1"><Clock size={10} /> Time remaining</p>
                <CountdownTimer targetDate={ch.date} />
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-[#94a3b8] mb-1">
                  <span>Submission progress</span>
                  <span className="text-[#00e5ff] font-bold">{ch.progress}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${ch.progress}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full rounded-full bg-gradient-to-r from-[#00e5ff] to-[#0066ff]"
                  />
                </div>
              </div>

              {/* CTA */}
              <button className="btn-primary w-full justify-center py-2.5 text-sm">
                Open Challenge <ExternalLink size={14} />
              </button>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
