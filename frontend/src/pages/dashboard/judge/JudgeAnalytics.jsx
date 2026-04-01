import { motion } from 'framer-motion'
import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis, LineChart, Line, AreaChart, Area, ComposedChart, Legend } from 'recharts'
import { TrendingUp, TrendingDown, Target, Clock, CheckCircle2, BarChart3, Activity, Award, AlertTriangle, RefreshCw, Zap } from 'lucide-react'
import { useTheme } from '../../../context/ThemeContext'

// ── Mock Data ──────────────────────────────────────────────────────────────
const BAR_DATA = [
  { range: '0-20',  count: 0  },
  { range: '21-40', count: 1  },
  { range: '41-60', count: 2  },
  { range: '61-80', count: 8  },
  { range: '81-100',count: 3  },
]

const SCATTER_DATA = [
  { innovation: 8, technical: 7, name: 'ByteForce' },
  { innovation: 6, technical: 8, name: 'CipherX' },
  { innovation: 9, technical: 6, name: 'DataDrive' },
  { innovation: 7, technical: 9, name: 'NeonBuilds' },
  { innovation: 5, technical: 7, name: 'Pixelwave' },
]

const TREND_DATA = [
  { day: 'Mon', reviews: 3, avgScore: 72, avgTime: 15 },
  { day: 'Tue', reviews: 5, avgScore: 78, avgTime: 18 },
  { day: 'Wed', reviews: 2, avgScore: 75, avgTime: 12 },
  { day: 'Thu', reviews: 4, avgScore: 82, avgTime: 16 },
  { day: 'Fri', reviews: 0, avgScore: 0, avgTime: 0 },
  { day: 'Sat', reviews: 0, avgScore: 0, avgTime: 0 },
  { day: 'Sun', reviews: 0, avgScore: 0, avgTime: 0 },
]

const CALIBRATION_DATA = [
  { category: 'Innovation', yourAvg: 7.8, globalAvg: 7.2, variance: 0.6 },
  { category: 'Technical', yourAvg: 8.1, globalAvg: 7.9, variance: 0.2 },
  { category: 'Presentation', yourAvg: 7.5, globalAvg: 7.8, variance: -0.3 },
  { category: 'Impact', yourAvg: 8.4, globalAvg: 7.6, variance: 0.8 },
  { category: 'Creativity', yourAvg: 7.2, globalAvg: 7.4, variance: -0.2 },
]

const REVIEW_TIMELINE = [
  { id: 1, project: 'ByteForce', score: 85, time: '18min', timeAgo: '2h ago', status: 'completed', changeFromAvg: 7 },
  { id: 2, project: 'CipherX', score: 72, time: '15min', timeAgo: '3h ago', status: 'completed', changeFromAvg: -6 },
  { id: 3, project: 'DataDrive', score: 91, time: '22min', timeAgo: '5h ago', status: 'completed', changeFromAvg: 13 },
  { id: 4, project: 'NeonBuilds', score: 78, time: '14min', timeAgo: '6h ago', status: 'completed', changeFromAvg: 0 },
  { id: 5, project: 'Pixelwave', score: 68, time: '12min', timeAgo: '1d ago', status: 'completed', changeFromAvg: -10 },
]

// ── Helper Components ──────────────────────────────────────────────────────
const MetricCard = ({ icon: Icon, label, value, suffix = '', trend, trendValue, color, delay = 0 }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ delay }}
    className="glass-card p-4 border border-[#1e3a5f] hover:border-[#00e5ff]/40 transition-colors group"
  >
    <div className="flex items-start justify-between">
      <div className="p-2 rounded-lg bg-gradient-to-br from-[#0a192f]/80 to-[#0a192f]/40 border border-[#1e3a5f]">
        <Icon size={18} style={{ color }} />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
          trend === 'up' ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'
        }`}>
          {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span>{trendValue}</span>
        </div>
      )}
    </div>
    <div className="mt-3">
      <div className="text-2xl font-heading font-bold text-white flex items-baseline gap-1">
        <span style={{ color }}>{value}</span>
        {suffix && <span className="text-sm text-[#94a3b8]">{suffix}</span>}
      </div>
      <p className="text-[#94a3b8] text-xs mt-0.5">{label}</p>
    </div>
  </motion.div>
)

const ConsistencyMeter = ({ score }) => {
  const getColor = (s) => s >= 90 ? '#00e676' : s >= 70 ? '#ffd600' : '#ff5252'
  const getLabel = (s) => s >= 90 ? 'Excellent' : s >= 70 ? 'Good' : 'Needs Work'
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90">
          <circle cx="48" cy="48" r="40" stroke="#1e3a5f" strokeWidth="8" fill="none" />
          <motion.circle
            cx="48" cy="48" r="40"
            stroke={getColor(score)}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={251.2}
            initial={{ strokeDashoffset: 251.2 }}
            animate={{ strokeDashoffset: 251.2 - (score / 100) * 251.2 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-white">{score}%</span>
        </div>
      </div>
      <span className="text-xs font-medium" style={{ color: getColor(score) }}>{getLabel(score)}</span>
    </div>
  )
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card border border-[#1e3a5f] px-3 py-2 text-xs">
      <p className="text-[#94a3b8]">Score range</p>
      <p className="text-[#00e5ff] font-bold">{payload[0].value} projects</p>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function JudgeAnalytics() {
  const [timeRange, setTimeRange] = useState('7d')
  const { dark } = useTheme()

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-white">Scoring Analytics</h1>
          <p className="text-[#94a3b8] text-sm mt-1">Your review performance, consistency, and calibration metrics</p>
        </div>
        
        {/* Time range selector */}
        <div className="flex items-center gap-2 p-1 bg-[#0a192f]/60 border border-[#1e3a5f] rounded-lg">
          {['24h', '7d', '30d', 'All'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                timeRange === range 
                  ? 'bg-gradient-to-r from-[#00e5ff]/20 to-[#7c4dff]/20 text-[#00e5ff] border border-[#00e5ff]/30'
                  : 'text-[#94a3b8] hover:text-white hover:bg-white/5'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard icon={CheckCircle2} label="Reviews Completed" value={14} color="#00e676" trend="up" trendValue="+3" delay={0} />
        <MetricCard icon={Clock} label="Pending Reviews" value={6} color="#ffd600" delay={0.05} />
        <MetricCard icon={Target} label="Average Score" value="78" suffix="/100" color="#00e5ff" trend="up" trendValue="+2.3" delay={0.1} />
        <MetricCard icon={Zap} label="Avg Review Time" value="18" suffix="min" color="#7c4dff" trend="down" trendValue="-2min" delay={0.15} />
        <MetricCard icon={Award} label="Consistency Score" value="87" suffix="%" color="#00e676" delay={0.2} />
      </div>

      {/* Consistency & Calibration Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Consistency Meter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="glass-card p-5 border border-[#1e3a5f] flex flex-col items-center justify-center"
        >
          <h3 className="font-heading font-bold text-white mb-4">Scoring Consistency</h3>
          <ConsistencyMeter score={87} />
          <p className="text-[#94a3b8] text-xs mt-4 text-center max-w-[200px]">
            Your scores are consistent with your past evaluations
          </p>
        </motion.div>

        {/* Calibration Chart - Your scores vs Global */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.25 }}
          className="glass-card p-5 border border-[#1e3a5f] lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-white">Calibration vs Global Average</h3>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#00e5ff]"></span> You</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#94a3b8]"></span> Global</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={CALIBRATION_DATA} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" horizontal={false} />
              <XAxis type="number" domain={[0, 10]} tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="category" width={80} tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  const d = payload[0]?.payload
                  return (
                    <div className="glass-card border border-[#1e3a5f] px-3 py-2 text-xs">
                      <p className="text-white font-bold mb-1">{d?.category}</p>
                      <p className="text-[#00e5ff]">Your avg: {d?.yourAvg}</p>
                      <p className="text-[#94a3b8]">Global avg: {d?.globalAvg}</p>
                      <p className={d?.variance >= 0 ? 'text-emerald-400' : 'text-amber-400'}>
                        Variance: {d?.variance >= 0 ? '+' : ''}{d?.variance}
                      </p>
                    </div>
                  )
                }}
              />
              <Bar dataKey="globalAvg" fill="#94a3b8" opacity={0.4} radius={[0, 4, 4, 0]} barSize={12} />
              <Bar dataKey="yourAvg" fill="#00e5ff" opacity={0.9} radius={[0, 4, 4, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score distribution bar chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5 border border-[#1e3a5f]">
          <h3 className="font-heading font-bold text-white mb-4">Score Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={BAR_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
              <XAxis dataKey="range" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#00e5ff" radius={[6, 6, 0, 0]} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Innovation vs Technical scatter */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card p-5 border border-[#1e3a5f]">
          <h3 className="font-heading font-bold text-white mb-4">Innovation vs Technical</h3>
          <ResponsiveContainer width="100%" height={220}>
            <ScatterChart margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
              <XAxis type="number" dataKey="innovation" name="Innovation" domain={[0, 10]} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} label={{ value: 'Innovation', position: 'insideBottom', offset: -2, fill: '#94a3b8', fontSize: 10 }} />
              <YAxis type="number" dataKey="technical"  name="Technical"  domain={[0, 10]} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} label={{ value: 'Technical', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }} />
              <ZAxis range={[80, 80]} />
              <Tooltip cursor={{ strokeDasharray: '3 3', stroke: '#1e3a5f' }} content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const d = payload[0]?.payload
                return <div className="glass-card border border-[#1e3a5f] px-3 py-2 text-xs"><p className="text-white font-bold">{d?.name}</p><p className="text-[#00e5ff]">Innovation: {d?.innovation}</p><p className="text-[#7c4dff]">Technical: {d?.technical}</p></div>
              }} />
              <Scatter data={SCATTER_DATA} fill="#7c4dff" opacity={0.8} />
            </ScatterChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Review Activity & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Review Activity Trend */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.4 }}
          className="glass-card p-5 border border-[#1e3a5f] lg:col-span-2"
        >
          <h3 className="font-heading font-bold text-white mb-4">Review Activity This Week</h3>
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
              <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null
                  return (
                    <div className="glass-card border border-[#1e3a5f] px-3 py-2 text-xs">
                      <p className="text-white font-bold mb-1">{label}</p>
                      <p className="text-[#00e5ff]">Reviews: {payload[0]?.value}</p>
                      <p className="text-[#7c4dff]">Avg Score: {payload[1]?.value}</p>
                    </div>
                  )
                }}
              />
              <Bar yAxisId="left" dataKey="reviews" fill="#00e5ff" opacity={0.7} radius={[4, 4, 0, 0]} barSize={24} />
              <Line yAxisId="right" type="monotone" dataKey="avgScore" stroke="#7c4dff" strokeWidth={2} dot={{ fill: '#7c4dff', strokeWidth: 0, r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Review Timeline */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.45 }}
          className="glass-card p-5 border border-[#1e3a5f]"
        >
          <h3 className="font-heading font-bold text-white mb-4">Recent Reviews</h3>
          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2 scrollbar-thin">
            {REVIEW_TIMELINE.map((review, i) => (
              <motion.div 
                key={review.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg bg-[#0a192f]/60 border border-[#1e3a5f] hover:border-[#00e5ff]/30 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{review.project}</p>
                  <p className="text-[#94a3b8] text-xs">{review.timeAgo} • {review.time}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${review.score >= 80 ? 'text-emerald-400' : review.score >= 60 ? 'text-[#00e5ff]' : 'text-amber-400'}`}>
                    {review.score}
                  </span>
                  {review.changeFromAvg !== 0 && (
                    <span className={`text-xs flex items-center ${review.changeFromAvg > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {review.changeFromAvg > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Insights & Tips */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.5 }}
        className="glass-card p-5 border border-[#1e3a5f] bg-gradient-to-r from-[#7c4dff]/5 to-[#00e5ff]/5"
      >
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-[#7c4dff]/20 border border-[#7c4dff]/30 shrink-0">
            <AlertTriangle size={20} className="text-[#7c4dff]" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-white mb-1">Performance Insights</h3>
            <ul className="text-sm text-[#94a3b8] space-y-1">
              <li>• Your <span className="text-[#00e5ff]">Impact</span> scores are 0.8 points higher than the global average — you may be more generous in this category.</li>
              <li>• Consider reviewing the <span className="text-amber-400">Presentation</span> criteria — your scores are slightly below average.</li>
              <li>• Great consistency! Your score variance is within the acceptable range.</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
