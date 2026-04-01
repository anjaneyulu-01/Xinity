import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts'

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

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card border border-[#1e3a5f] px-3 py-2 text-xs">
      <p className="text-[#94a3b8]">Score range</p>
      <p className="text-[#00e5ff] font-bold">{payload[0].value} projects</p>
    </div>
  )
}

const KPIS = [
  { label: 'Reviews Done',  value: 14, color: '#00e676' },
  { label: 'Pending',       value: 6,  color: '#ffd600' },
  { label: 'Avg Score',     value: '78', color: '#00e5ff', suffix: '/100' },
  { label: 'Avg Time',      value: '18', color: '#7c4dff', suffix: 'min' },
]

export default function JudgeAnalytics() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading font-bold text-2xl text-white">Scoring Analytics</h1>
        <p className="text-[#94a3b8] text-sm mt-1">Your review performance and score distribution</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPIS.map(({ label, value, color, suffix }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="kpi-card">
            <div className="text-3xl font-heading font-bold" style={{ color }}>{value}{suffix}</div>
            <p className="text-[#94a3b8] text-sm mt-1">{label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score distribution bar chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5 border border-[#1e3a5f]">
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5 border border-[#1e3a5f]">
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
    </div>
  )
}
