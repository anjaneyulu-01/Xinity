import { motion } from 'framer-motion'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Area, AreaChart } from 'recharts'

const POINTS_DATA = [
  { month: 'Nov', pts: 0 },
  { month: 'Dec', pts: 320 },
  { month: 'Jan', pts: 750 },
  { month: 'Feb', pts: 1200 },
  { month: 'Mar', pts: 1800 },
  { month: 'Apr', pts: 2450 },
]

const SKILLS_DATA = [
  { skill: 'Frontend',   value: 85 },
  { skill: 'Backend',    value: 70 },
  { skill: 'Design',     value: 60 },
  { skill: 'DevOps',     value: 45 },
  { skill: 'AI/ML',      value: 50 },
  { skill: 'Mobile',     value: 35 },
]

const BADGES = [
  { icon: '🏆', name: 'First Win',       desc: 'Won your first hackathon',      earned: true  },
  { icon: '🚀', name: 'Early Bird',      desc: 'First 50 to register',          earned: true  },
  { icon: '👥', name: 'Team Player',     desc: 'Competed in a full team',       earned: true  },
  { icon: '📤', name: 'Submitter',       desc: 'Made your first submission',    earned: true  },
  { icon: '⚡', name: 'Speed Builder',   desc: 'Submit in first 12 hours',      earned: false },
  { icon: '🎯', name: 'Perfect Score',   desc: 'Score 95+ from judges',         earned: false },
  { icon: '🌟', name: 'Community Star',  desc: 'Help 10 teammates',             earned: false },
  { icon: '🔥', name: '3-Peat',          desc: 'Win 3 hackathons in a row',     earned: false },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card border border-[#1e3a5f] px-3 py-2 text-sm">
      <p className="text-[#94a3b8]">{label}</p>
      <p className="text-[#00e5ff] font-bold">{payload[0].value} pts</p>
    </div>
  )
}

export default function Progress() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading font-bold text-2xl text-white">My Progress</h1>
        <p className="text-[#94a3b8] text-sm mt-1">Track your growth as a developer</p>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Points over time */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 border border-[#1e3a5f]">
          <h3 className="font-heading font-bold text-white mb-4">Points Earned Over Time</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={POINTS_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="ptsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#00e5ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00e5ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
              <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="pts" stroke="#00e5ff" strokeWidth={2} fill="url(#ptsFill)" dot={{ fill: '#00e5ff', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Skills radar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5 border border-[#1e3a5f]">
          <h3 className="font-heading font-bold text-white mb-4">Skills Assessment</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={SKILLS_DATA}>
              <PolarGrid stroke="#1e3a5f" />
              <PolarAngleAxis dataKey="skill" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Radar name="skills" dataKey="value" stroke="#00e5ff" fill="#00e5ff" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Badges */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5 border border-[#1e3a5f]">
        <h3 className="font-heading font-bold text-white mb-4">Badges <span className="text-[#94a3b8] text-sm font-normal">({BADGES.filter(b => b.earned).length}/{BADGES.length} earned)</span></h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BADGES.map((b, i) => (
            <motion.div
              key={b.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: b.earned ? 1 : 0.4, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all ${b.earned ? 'border-[#00e5ff]/20 bg-[#00e5ff]/5 hover:border-[#00e5ff]/40' : 'border-[#1e3a5f] bg-white/2 grayscale'}`}
            >
              <div className="text-3xl">{b.icon}</div>
              <p className="font-semibold text-white text-sm">{b.name}</p>
              <p className="text-[#94a3b8] text-xs leading-tight">{b.desc}</p>
              {b.earned && <span className="text-xs text-[#00e676] font-code">✓ Earned</span>}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
