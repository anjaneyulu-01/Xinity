import { motion } from 'framer-motion'
import { Users, Calendar, Upload, Scale, Star, DollarSign, TrendingUp } from 'lucide-react'
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const KPIS = [
  { icon: Users,    label: 'Total Users',      value: '512',  change: '+24 this week',  color: '#00e5ff' },
  { icon: Calendar, label: 'Active Events',    value: '4',    change: '2 live now',      color: '#7c4dff' },
  { icon: Upload,   label: 'Submissions Today',value: '18',   change: '+6 since 9am',    color: '#00e676' },
  { icon: Scale,    label: 'Judges Online',    value: '3',    change: '2 reviewing',     color: '#ffd600' },
  { icon: Star,     label: 'Avg Score',        value: '78.4', change: 'Across all events',color: '#ff4081' },
  { icon: DollarSign,label:'Sponsorship',      value: '₹2L',  change: 'Prize pool total', color: '#0066ff' },
]

const REG_DATA = [
  { month: 'Oct', users: 80  },
  { month: 'Nov', users: 140 },
  { month: 'Dec', users: 200 },
  { month: 'Jan', users: 320 },
  { month: 'Feb', users: 420 },
  { month: 'Mar', users: 480 },
  { month: 'Apr', users: 512 },
]

const PIE_DATA = [
  { name: 'Hackathon', value: 45, color: '#00e5ff' },
  { name: 'Workshop',  value: 30, color: '#7c4dff' },
  { name: 'Talk',      value: 25, color: '#00e676' },
]

const RECENT_ACTIVITY = [
  { text: 'Team "ByteForce" submitted to WebX Challenge',   time: '2m ago',  color: '#00e5ff' },
  { text: 'Judge Dr. Mehta completed 3 reviews',            time: '15m ago', color: '#00e676' },
  { text: 'New user registered: karan@mu.ac.in',            time: '32m ago', color: '#7c4dff' },
  { text: 'WebX Challenge 2026 is now LIVE',                 time: '1h ago',  color: '#ffd600' },
  { text: 'Certificate bulk-sent to AI Hack Sprint winners', time: '3h ago',  color: '#00e676' },
]

const TOP_TEAMS = [
  { rank: 1, name: 'Team Nexus',  score: 2450, event: 'WebX 2026' },
  { rank: 2, name: 'ByteForce',   score: 2100, event: 'WebX 2026' },
  { rank: 3, name: 'CipherX',     score: 1980, event: 'WebX 2026' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card border border-[#1e3a5f] px-3 py-2 text-xs">
      <p className="text-[#94a3b8]">{label}</p>
      <p className="text-[#00e5ff] font-bold">{payload[0].value} users</p>
    </div>
  )
}

export default function AdminAnalytics() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading font-bold text-2xl text-white">Analytics Overview</h1>
        <p className="text-[#94a3b8] text-sm mt-1">Platform-wide performance metrics</p>
      </div>

      {/* KPI cards */}
      <motion.div
        initial="hidden" animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        {KPIS.map(({ icon: Icon, label, value, change, color }, i) => (
          <motion.div
            key={label}
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
            className="kpi-card col-span-1"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: color + '15' }}>
                <Icon size={14} style={{ color }} />
              </div>
            </div>
            <div className="text-2xl font-heading font-bold text-white">{value}</div>
            <p className="text-[#94a3b8] text-xs mt-0.5 leading-tight">{label}</p>
            <p className="text-xs mt-1.5 font-medium" style={{ color }}>{change}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5 border border-[#1e3a5f] lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-white">Registrations Over Time</h3>
            <span className="flex items-center gap-1 text-xs text-[#00e676]"><TrendingUp size={12} /> +24% this month</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={REG_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="regFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#00e5ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00e5ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
              <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="users" stroke="#00e5ff" strokeWidth={2} fill="url(#regFill)" dot={{ fill: '#00e5ff', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5 border border-[#1e3a5f]">
          <h3 className="font-heading font-bold text-white mb-4">Submissions by Category</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={4} dataKey="value">
                {PIE_DATA.map((d, i) => (
                  <Cell key={i} fill={d.color} opacity={0.85} />
                ))}
              </Pie>
              <Tooltip formatter={(v, n) => [v + '%', n]} contentStyle={{ background: '#0d1b2e', border: '1px solid #1e3a5f', borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2 mt-2">
            {PIE_DATA.map(d => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                <span className="text-[#94a3b8] flex-1">{d.name}</span>
                <span className="font-bold" style={{ color: d.color }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent activity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5 border border-[#1e3a5f]">
          <h3 className="font-heading font-bold text-white mb-4">Recent Activity</h3>
          <div className="flex flex-col gap-3">
            {RECENT_ACTIVITY.map((a, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: a.color }} />
                <div className="flex-1">
                  <p className="text-[#94a3b8] text-sm">{a.text}</p>
                  <p className="text-xs text-[#94a3b8]/50 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top teams */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-5 border border-[#1e3a5f]">
          <h3 className="font-heading font-bold text-white mb-4">Top Performing Teams</h3>
          <div className="flex flex-col gap-3">
            {TOP_TEAMS.map((t, i) => (
              <div key={t.rank} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-code flex-shrink-0 ${i === 0 ? 'bg-[#ffd600]/20 text-[#ffd600]' : i === 1 ? 'bg-[#94a3b8]/20 text-[#94a3b8]' : 'bg-[#f97316]/20 text-orange-400'}`}>
                  #{t.rank}
                </span>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-[#94a3b8] text-xs">{t.event}</p>
                </div>
                <span className="text-[#00e5ff] font-bold text-sm">{t.score.toLocaleString()} pts</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
