import { motion } from 'framer-motion'
import { Trophy, Users, Upload, TrendingUp, ArrowRight, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../../store/authStore'
import { MOCK_EVENTS, MOCK_SUBMISSIONS } from '../../../store/eventStore'
import AnimatedCounter from '../../../components/ui/AnimatedCounter'
import CountdownTimer from '../../../components/ui/CountdownTimer'
import { useTheme } from '../../../context/ThemeContext'

const STAT_CARDS = [
  { icon: Trophy,    label: 'Active Challenges', value: 2,    color: '#00e5ff', trend: '+1 this week' },
  { icon: Users,     label: 'Team Members',      value: 4,    color: '#7c4dff', trend: 'Full team' },
  { icon: Upload,    label: 'Submissions Made',  value: 2,    color: '#00e676', trend: 'All submitted' },
  { icon: TrendingUp,label: 'Current Rank',      value: 3,    color: '#ffd600', trend: '↑ 2 places' },
]

const ACTIVITY = [
  { action: 'Submitted project to WebX Challenge 2026', time: '2h ago',   color: '#00e5ff' },
  { action: 'Team Nexus ranked #3 on leaderboard',      time: '5h ago',   color: '#ffd600' },
  { action: 'Joined team "Team Nexus"',                  time: '1d ago',   color: '#7c4dff' },
  { action: 'Registered for WebX Challenge 2026',        time: '3d ago',   color: '#00e676' },
  { action: 'Account created',                           time: '5d ago',   color: '#94a3b8' },
]

const card = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

export default function Overview() {
  const user = useAuthStore(s => s.user)
  const { dark } = useTheme()
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`glass-card p-6 border relative overflow-hidden ${dark ? 'border-[#1e3a5f]' : 'border-gray-200'}`}
      >
        <div className="absolute right-0 top-0 bottom-0 w-1/3 pointer-events-none opacity-20"
          style={{ background: 'linear-gradient(270deg, #00e5ff, transparent)' }} />
        <p className={`text-sm mb-1 ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>{today}</p>
        <h1 className={`font-heading font-bold text-2xl sm:text-3xl ${dark ? 'text-white' : 'text-gray-900'}`}>
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className={`text-sm mt-1 ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>You're ranked <span className="text-[#ffd600] font-bold">#3</span> on the leaderboard. Keep pushing!</p>
        <div className="flex gap-3 mt-4 flex-wrap">
          <Link to="/dashboard/user/submissions" className="btn-primary text-sm py-2 px-5">New Submission</Link>
          <Link to="/dashboard/user/team" className="btn-ghost text-sm py-2 px-5">Find Team</Link>
        </div>
      </motion.div>

      {/* Stat cards */}
      <motion.div
        initial="hidden" animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {STAT_CARDS.map(({ icon: Icon, label, value, color, trend }) => (
          <motion.div key={label} variants={card} className="kpi-card">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: color + '15', border: `1px solid ${color}30` }}>
                <Icon size={18} style={{ color }} />
              </div>
              <span className="text-xs text-[#00e676] bg-[#00e676]/10 border border-[#00e676]/20 rounded-full px-2 py-0.5">{trend}</span>
            </div>
            <div className={`text-2xl font-heading font-bold ${dark ? 'text-white' : 'text-gray-900'}`}><AnimatedCounter target={value} /></div>
            <p className={`text-xs mt-1 ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>{label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming events */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={`glass-card p-5 border ${dark ? 'border-[#1e3a5f]' : 'border-gray-200'}`}>
          <h3 className={`font-heading font-bold mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>Your Upcoming Events</h3>
          <div className="flex flex-col gap-4">
            {MOCK_EVENTS.slice(0, 3).map(ev => (
              <div key={ev.id} className={`p-3 rounded-xl border ${dark ? 'bg-white/3 border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-semibold text-sm ${dark ? 'text-white' : 'text-gray-900'}`}>{ev.name}</span>
                  <span className="text-xs font-code px-2 py-0.5 rounded-full bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/20">{ev.type}</span>
                </div>
                <CountdownTimer targetDate={ev.date} className="scale-75 -ml-2 origin-left" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Activity feed */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className={`glass-card p-5 border ${dark ? 'border-[#1e3a5f]' : 'border-gray-200'}`}>
          <h3 className={`font-heading font-bold mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>Recent Activity</h3>
          <div className="flex flex-col gap-3">
            {ACTIVITY.map((a, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: a.color }} />
                <div className="flex-1">
                  <p className={`text-sm ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>{a.action}</p>
                  <p className={`text-xs flex items-center gap-1 mt-0.5 ${dark ? 'text-[#94a3b8]/60' : 'text-gray-400'}`}>
                    <Clock size={10} /> {a.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className={`glass-card p-5 border ${dark ? 'border-[#1e3a5f]' : 'border-gray-200'}`}>
        <h3 className={`font-heading font-bold mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'Find Team', to: '/dashboard/user/team', color: '#7c4dff' },
            { label: 'Browse Events', to: '/#events', color: '#00e5ff' },
            { label: 'Submit Project', to: '/dashboard/user/submissions', color: '#00e676' },
          ].map(({ label, to, color }) => (
            <Link key={label} to={to}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all group ${dark ? 'border-white/5 hover:border-current/30 bg-white/2 hover:bg-white/5' : 'border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
              style={{ '--tw-border-opacity': 1 }}
            >
              <span className={`text-sm font-medium transition-colors ${dark ? 'text-[#94a3b8] group-hover:text-white' : 'text-gray-600 group-hover:text-gray-900'}`}>{label}</span>
              <ArrowRight size={14} style={{ color }} />
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
