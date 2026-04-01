import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Calendar, Upload, Scale, Star, DollarSign, TrendingUp, TrendingDown, Activity, Clock, Zap, Target, BarChart2, PieChart as PieChartIcon, RefreshCw, Download, Filter, AlertTriangle, CheckCircle, XCircle, Eye } from 'lucide-react'
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, LineChart, Line, ComposedChart } from 'recharts'
import { useTheme } from '../../../context/ThemeContext'
import { useRealtimeStore } from '../../../store/realtimeStore'
import { LiveStatsBar, LiveActivityFeed } from '../../../components/ui/LiveActivityFeed'
import { MetricCard, DonutChart, ProgressRing } from '../../../components/charts/AdvancedCharts'

const KPIS = [
  { icon: Users,    label: 'Total Users',      value: 512,  prevValue: 488, change: 4.9, color: '#00e5ff', trend: [380, 400, 420, 450, 470, 488, 512] },
  { icon: Calendar, label: 'Active Events',    value: 4,    prevValue: 3,   change: 33,  color: '#7c4dff', trend: [2, 2, 3, 3, 3, 3, 4] },
  { icon: Upload,   label: 'Total Submissions',value: 247,  prevValue: 210, change: 17.6, color: '#00e676', trend: [150, 170, 185, 200, 210, 225, 247] },
  { icon: Scale,    label: 'Active Judges',    value: 12,   prevValue: 10,  change: 20,  color: '#ffd600', trend: [8, 8, 9, 10, 10, 11, 12] },
  { icon: Star,     label: 'Avg Score',        value: 78.4, prevValue: 75.2, change: 4.2, color: '#ff4081', trend: [72, 73, 74, 75, 76, 77, 78.4] },
  { icon: DollarSign,label:'Prize Pool',       value: '₹2L', prevValue: '₹1.5L', change: 33, color: '#0066ff', trend: [100000, 120000, 140000, 150000, 180000, 190000, 200000] },
]

const REG_DATA = [
  { month: 'Oct', users: 80, submissions: 20, reviews: 15 },
  { month: 'Nov', users: 140, submissions: 45, reviews: 38 },
  { month: 'Dec', users: 200, submissions: 72, reviews: 65 },
  { month: 'Jan', users: 320, submissions: 120, reviews: 102 },
  { month: 'Feb', users: 420, submissions: 185, reviews: 160 },
  { month: 'Mar', users: 480, submissions: 220, reviews: 195 },
  { month: 'Apr', users: 512, submissions: 247, reviews: 210 },
]

const SUBMISSION_STATUS = [
  { name: 'Pending', value: 34, color: '#ffd600' },
  { name: 'In Review', value: 18, color: '#00e5ff' },
  { name: 'Reviewed', value: 195, color: '#00e676' },
]

const EVENT_PERFORMANCE = [
  { name: 'WebX 2026', registrations: 156, submissions: 89, avgScore: 82, status: 'live' },
  { name: 'AI Hack Sprint', registrations: 124, submissions: 78, avgScore: 75, status: 'completed' },
  { name: 'Green Tech Hack', registrations: 98, submissions: 45, avgScore: 79, status: 'upcoming' },
  { name: 'Mobile Mania', registrations: 134, submissions: 35, avgScore: 0, status: 'live' },
]

const JUDGE_PERFORMANCE = [
  { name: 'Dr. Mehta', reviews: 45, avgTime: '8 min', avgScore: 76, variance: 'low' },
  { name: 'Prof. Sharma', reviews: 38, avgTime: '12 min', avgScore: 72, variance: 'medium' },
  { name: 'Ms. Patel', reviews: 52, avgTime: '6 min', avgScore: 81, variance: 'low' },
  { name: 'Mr. Kumar', reviews: 28, avgTime: '15 min', avgScore: 68, variance: 'high' },
]

const CONVERSION_FUNNEL = [
  { stage: 'Visitors', value: 2450, percentage: 100 },
  { stage: 'Registered', value: 512, percentage: 20.9 },
  { stage: 'Team Joined', value: 312, percentage: 12.7 },
  { stage: 'Submitted', value: 247, percentage: 10.1 },
  { stage: 'Reviewed', value: 210, percentage: 8.6 },
]

const SYSTEM_HEALTH = [
  { metric: 'API Response Time', value: '45ms', status: 'good', icon: Zap },
  { metric: 'Database Load', value: '23%', status: 'good', icon: Activity },
  { metric: 'Active Sessions', value: '156', status: 'warning', icon: Users },
  { metric: 'Error Rate', value: '0.02%', status: 'good', icon: AlertTriangle },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card border border-[#1e3a5f] px-3 py-2 text-xs">
      <p className="text-[#94a3b8] mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="font-bold" style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  )
}

export default function AdminAnalytics() {
  const { dark } = useTheme()
  const [timeRange, setTimeRange] = useState('7d')
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(r => setTimeout(r, 1000))
    setIsRefreshing(false)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`font-heading font-bold text-2xl ${dark ? 'text-white' : 'text-gray-900'}`}>Analytics Overview</h1>
          <p className={`text-sm mt-1 ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>Platform-wide performance metrics & insights</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Time range selector */}
          <div className={`flex rounded-xl overflow-hidden border ${dark ? 'border-[#1e3a5f] bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
            {['24h', '7d', '30d', '90d'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-xs font-medium transition-all ${
                  timeRange === range
                    ? 'bg-[#00e5ff] text-[#04040f]'
                    : dark ? 'text-[#94a3b8] hover:text-white' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <button
            onClick={handleRefresh}
            className={`p-2 rounded-xl border transition-all ${
              dark ? 'border-[#1e3a5f] text-[#94a3b8] hover:text-white hover:border-white/20' : 'border-gray-200 text-gray-500 hover:text-gray-900'
            }`}
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
          <button className={`p-2 rounded-xl border transition-all ${dark ? 'border-[#1e3a5f] text-[#94a3b8] hover:text-white' : 'border-gray-200 text-gray-500'}`}>
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* Live Stats Bar */}
      <LiveStatsBar dark={dark} />

      {/* KPI cards with sparklines */}
      <motion.div
        initial="hidden" animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        {KPIS.map(({ icon: Icon, label, value, change, color, trend }, i) => (
          <motion.div
            key={label}
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
          >
            <MetricCard
              title={label}
              value={value}
              change={change}
              changeLabel="vs last period"
              icon={Icon}
              color={color}
              dark={dark}
              size="compact"
              trend={trend}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* System Health Strip */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center gap-6 p-4 rounded-2xl border overflow-x-auto ${
          dark ? 'bg-[#080d1a] border-[#1e3a5f]' : 'bg-gray-50 border-gray-200'
        }`}
      >
        <span className={`text-xs font-semibold uppercase tracking-wider flex-shrink-0 ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>
          System Health
        </span>
        <div className={`w-px h-6 ${dark ? 'bg-white/10' : 'bg-gray-200'}`} />
        {SYSTEM_HEALTH.map(({ metric, value, status, icon: Icon }) => (
          <div key={metric} className="flex items-center gap-3 flex-shrink-0">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              status === 'good' ? 'bg-[#00e676]/10' : status === 'warning' ? 'bg-[#ffd600]/10' : 'bg-[#ff4081]/10'
            }`}>
              <Icon size={14} className={
                status === 'good' ? 'text-[#00e676]' : status === 'warning' ? 'text-[#ffd600]' : 'text-[#ff4081]'
              } />
            </div>
            <div>
              <div className={`text-sm font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{value}</div>
              <div className={`text-[10px] ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>{metric}</div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Multi-line chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }} 
          className={`glass-card p-5 border lg:col-span-2 ${dark ? 'border-[#1e3a5f]' : 'border-gray-200'}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-heading font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>Growth Metrics</h3>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-xs"><span className="w-2 h-2 rounded-full bg-[#00e5ff]" /> Users</span>
              <span className="flex items-center gap-1.5 text-xs"><span className="w-2 h-2 rounded-full bg-[#00e676]" /> Submissions</span>
              <span className="flex items-center gap-1.5 text-xs"><span className="w-2 h-2 rounded-full bg-[#7c4dff]" /> Reviews</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={REG_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="usersFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00e5ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#1e3a5f' : '#e5e7eb'} />
              <XAxis dataKey="month" tick={{ fill: dark ? '#94a3b8' : '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: dark ? '#94a3b8' : '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="users" stroke="#00e5ff" strokeWidth={2} fill="url(#usersFill)" name="Users" />
              <Line type="monotone" dataKey="submissions" stroke="#00e676" strokeWidth={2} dot={{ fill: '#00e676', r: 3 }} name="Submissions" />
              <Line type="monotone" dataKey="reviews" stroke="#7c4dff" strokeWidth={2} dot={{ fill: '#7c4dff', r: 3 }} name="Reviews" />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Submission status donut */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }} 
          className={`glass-card p-5 border ${dark ? 'border-[#1e3a5f]' : 'border-gray-200'}`}
        >
          <h3 className={`font-heading font-bold mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>Submission Status</h3>
          <DonutChart 
            data={SUBMISSION_STATUS} 
            size={140} 
            strokeWidth={18} 
            dark={dark}
            centerValue={SUBMISSION_STATUS.reduce((s, d) => s + d.value, 0)}
            centerLabel="Total"
          />
        </motion.div>
      </div>

      {/* Conversion Funnel & Judge Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.25 }}
          className={`glass-card p-5 border ${dark ? 'border-[#1e3a5f]' : 'border-gray-200'}`}
        >
          <h3 className={`font-heading font-bold mb-4 flex items-center gap-2 ${dark ? 'text-white' : 'text-gray-900'}`}>
            <Target size={18} className="text-[#00e5ff]" /> Conversion Funnel
          </h3>
          <div className="space-y-3">
            {CONVERSION_FUNNEL.map((stage, i) => (
              <div key={stage.stage}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>{stage.stage}</span>
                  <span className={`text-sm font-mono ${dark ? 'text-white' : 'text-gray-900'}`}>
                    {stage.value.toLocaleString()} <span className="text-[#00e5ff]">({stage.percentage}%)</span>
                  </span>
                </div>
                <div className={`h-3 rounded-full overflow-hidden ${dark ? 'bg-white/5' : 'bg-gray-100'}`}>
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${stage.percentage}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    style={{ 
                      background: `linear-gradient(90deg, #00e5ff, ${i === CONVERSION_FUNNEL.length - 1 ? '#00e676' : '#7c4dff'})` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Judge Performance */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
          className={`glass-card p-5 border ${dark ? 'border-[#1e3a5f]' : 'border-gray-200'}`}
        >
          <h3 className={`font-heading font-bold mb-4 flex items-center gap-2 ${dark ? 'text-white' : 'text-gray-900'}`}>
            <Scale size={18} className="text-[#ffd600]" /> Judge Performance
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={dark ? 'text-[#94a3b8]' : 'text-gray-500'}>
                  <th className="text-left font-medium pb-3">Judge</th>
                  <th className="text-center font-medium pb-3">Reviews</th>
                  <th className="text-center font-medium pb-3">Avg Time</th>
                  <th className="text-center font-medium pb-3">Avg Score</th>
                  <th className="text-center font-medium pb-3">Variance</th>
                </tr>
              </thead>
              <tbody>
                {JUDGE_PERFORMANCE.map(judge => (
                  <tr key={judge.name} className={`border-t ${dark ? 'border-white/5' : 'border-gray-100'}`}>
                    <td className={`py-3 font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>{judge.name}</td>
                    <td className="py-3 text-center text-[#00e5ff] font-bold">{judge.reviews}</td>
                    <td className="py-3 text-center">{judge.avgTime}</td>
                    <td className="py-3 text-center">{judge.avgScore}</td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        judge.variance === 'low' ? 'bg-[#00e676]/10 text-[#00e676]' :
                        judge.variance === 'medium' ? 'bg-[#ffd600]/10 text-[#ffd600]' :
                        'bg-[#ff4081]/10 text-[#ff4081]'
                      }`}>
                        {judge.variance}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Event Performance & Live Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Performance */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.35 }}
          className={`glass-card p-5 border ${dark ? 'border-[#1e3a5f]' : 'border-gray-200'}`}
        >
          <h3 className={`font-heading font-bold mb-4 flex items-center gap-2 ${dark ? 'text-white' : 'text-gray-900'}`}>
            <Calendar size={18} className="text-[#7c4dff]" /> Event Performance
          </h3>
          <div className="space-y-3">
            {EVENT_PERFORMANCE.map(event => (
              <motion.div 
                key={event.name}
                whileHover={{ x: 4 }}
                className={`p-3 rounded-xl border transition-all ${
                  dark ? 'bg-white/[0.02] border-white/5 hover:border-white/10' : 'bg-gray-50 border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>{event.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    event.status === 'live' ? 'bg-[#00e676]/10 text-[#00e676] animate-pulse' :
                    event.status === 'completed' ? 'bg-[#94a3b8]/10 text-[#94a3b8]' :
                    'bg-[#00e5ff]/10 text-[#00e5ff]'
                  }`}>
                    {event.status}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{event.registrations}</div>
                    <div className={`text-[10px] ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>Registrations</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-[#00e5ff]">{event.submissions}</div>
                    <div className={`text-[10px] ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>Submissions</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-[#ffd600]">{event.avgScore || '—'}</div>
                    <div className={`text-[10px] ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>Avg Score</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Live Activity Feed */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.4 }}
        >
          <LiveActivityFeed dark={dark} limit={6} />
        </motion.div>
      </div>
    </div>
  )
}
