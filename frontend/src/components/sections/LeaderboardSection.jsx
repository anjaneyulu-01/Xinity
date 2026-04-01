import { motion } from 'framer-motion'
import { Crown, Medal, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { MOCK_LEADERBOARD } from '../../store/eventStore'
import { useTheme } from '../../context/ThemeContext'

const RANK_STYLE = {
  1: { color: '#ffd600', bg: 'rgba(255,214,0,0.08)', bgLight: 'rgba(255,214,0,0.1)', border: 'rgba(255,214,0,0.3)', glow: '#ffd600', icon: <Crown size={16} className="text-[#ffd600]" /> },
  2: { color: '#94a3b8', bg: 'rgba(148,163,184,0.06)', bgLight: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.2)', glow: '#94a3b8', icon: <Medal size={14} className="text-[#94a3b8]" /> },
  3: { color: '#f97316', bg: 'rgba(249,115,22,0.06)', bgLight: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.2)', glow: '#f97316', icon: <Medal size={14} className="text-orange-400" /> },
}

function Avatar({ name }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2)
  const colors = ['#00e5ff', '#7c4dff', '#0066ff', '#00e676', '#ff4081']
  const color = colors[name.charCodeAt(0) % colors.length]
  return (
    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-[#04040f] flex-shrink-0"
      style={{ background: `linear-gradient(135deg, ${color}, ${color}88)` }}>
      {initials}
    </div>
  )
}

export default function LeaderboardSection() {
  const { dark } = useTheme()
  
  return (
    <section id="leaderboard" className={`section-pad transition-colors duration-300 ${dark ? 'bg-[#04040f]' : 'bg-white'}`}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className={`font-code text-sm tracking-widest uppercase mb-3 ${dark ? 'text-[#00e5ff]' : 'text-[#0066ff]'}`}>Rankings</p>
          <h2 className={`font-heading font-bold text-4xl sm:text-5xl mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
            Community <span className="gradient-cyan">Leaderboard</span>
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          className="flex flex-col gap-3"
        >
          {MOCK_LEADERBOARD.map((entry) => {
            const rs = RANK_STYLE[entry.rank] || { color: '#94a3b8', bg: 'rgba(255,255,255,0.02)', bgLight: 'rgba(0,0,0,0.02)', border: 'rgba(255,255,255,0.06)', glow: '#94a3b8', icon: null }
            return (
              <motion.div
                key={entry.rank}
                variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0, transition: { duration: 0.4 } } }}
                whileHover={{ x: 4, boxShadow: `0 0 20px ${rs.glow}15` }}
                className="flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300"
                style={{ background: dark ? rs.bg : rs.bgLight, borderColor: rs.border }}
              >
                {/* Rank */}
                <div className="w-8 flex items-center justify-center flex-shrink-0">
                  {rs.icon || <span className={`font-bold font-code text-sm ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>#{entry.rank}</span>}
                </div>
                <Avatar name={entry.name} />
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold truncate ${dark ? 'text-white' : 'text-gray-900'}`}>{entry.name}</p>
                  <p className={`text-xs ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>{entry.university}</p>
                </div>
                {/* Badges */}
                <div className="hidden sm:flex gap-1">
                  {Array.from({ length: entry.badges }).slice(0, 4).map((_, i) => (
                    <span key={i} className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      dark 
                        ? 'bg-[#00e5ff]/10 border border-[#00e5ff]/20 text-[#00e5ff]' 
                        : 'bg-[#0066ff]/10 border border-[#0066ff]/20 text-[#0066ff]'
                    }`}>★</span>
                  ))}
                </div>
                {/* Points */}
                <div className="text-right flex-shrink-0">
                  <div className="font-heading font-bold text-lg" style={{ color: rs.color }}>{entry.points.toLocaleString()}</div>
                  <div className={`text-[10px] uppercase tracking-wider font-code ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>pts</div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8"
        >
          <Link to="/login" className="btn-ghost inline-flex items-center gap-2">
            View Full Leaderboard <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
