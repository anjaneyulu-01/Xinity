import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Star, Github, ExternalLink, Search, Filter, MessageSquare } from 'lucide-react'
import { useTheme } from '../../../context/ThemeContext'

const COMPLETED = [
  {
    id: 'r1', project: 'AgroSense AI', team: 'GreenBytes', event: 'WebX Challenge 2026',
    score: 88, maxScore: 100, submittedAt: '2026-03-28 10:12',
    criteria: { Innovation: 18, Technical: 20, Design: 16, Functionality: 18, Presentation: 16 },
    comment: 'Excellent use of ML for crop monitoring. Dashboard UX is polished. Minor API latency issues noted.',
    tags: ['React', 'Python', 'TensorFlow'],
    github: '#', demo: '#',
  },
  {
    id: 'r2', project: 'PayFlow', team: 'Team Nexus', event: 'WebX Challenge 2026',
    score: 74, maxScore: 100, submittedAt: '2026-03-28 11:45',
    criteria: { Innovation: 14, Technical: 16, Design: 15, Functionality: 16, Presentation: 13 },
    comment: 'Good concept. The payment flow is smooth but the fraud detection model needs more training data.',
    tags: ['Node.js', 'React', 'MongoDB'],
    github: '#', demo: '#',
  },
  {
    id: 'r3', project: 'MediChain', team: 'ByteForce', event: 'WebX Challenge 2026',
    score: 92, maxScore: 100, submittedAt: '2026-03-28 14:20',
    criteria: { Innovation: 19, Technical: 20, Design: 17, Functionality: 19, Presentation: 17 },
    comment: 'Outstanding blockchain integration for medical records. Highly scalable solution. Strong contender for top 3.',
    tags: ['Solidity', 'React', 'IPFS'],
    github: '#', demo: '#',
  },
  {
    id: 'r4', project: 'EduBot', team: 'CipherX', event: 'AI Hack Sprint 2025',
    score: 66, maxScore: 100, submittedAt: '2026-03-27 16:05',
    criteria: { Innovation: 13, Technical: 14, Design: 12, Functionality: 15, Presentation: 12 },
    comment: 'Interesting conversational AI for tutoring. Needs better context retention across sessions.',
    tags: ['Python', 'LangChain', 'FastAPI'],
    github: '#', demo: '#',
  },
  {
    id: 'r5', project: 'SmartGrid', team: 'VoltWave', event: 'AI Hack Sprint 2025',
    score: 81, maxScore: 100, submittedAt: '2026-03-27 17:30',
    criteria: { Innovation: 16, Technical: 18, Design: 15, Functionality: 17, Presentation: 15 },
    comment: 'Energy optimization algorithm is well-implemented. Could benefit from real-time simulation UI.',
    tags: ['Python', 'Next.js', 'D3.js'],
    github: '#', demo: '#',
  },
]

const CRITERIA_KEYS = ['Innovation', 'Technical', 'Design', 'Functionality', 'Presentation']

function ScoreBar({ label, score, max = 20, dark }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`text-xs w-24 flex-shrink-0 ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>{label}</span>
      <div className={`flex-1 h-1.5 rounded-full ${dark ? 'bg-white/10' : 'bg-gray-200'}`}>
        <div className="h-full rounded-full bg-gradient-to-r from-[#00e5ff] to-[#7c4dff]" style={{ width: `${(score / max) * 100}%` }} />
      </div>
      <span className={`text-xs font-code w-8 text-right ${dark ? 'text-white' : 'text-gray-900'}`}>{score}/{max}</span>
    </div>
  )
}

export default function CompletedReviews() {
  const { dark } = useTheme()
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(null)
  const border = dark ? 'border-[#1e3a5f]' : 'border-gray-200'
  const text   = dark ? 'text-white'        : 'text-gray-900'
  const sub    = dark ? 'text-[#94a3b8]'    : 'text-gray-500'

  const filtered = COMPLETED.filter(r =>
    r.project.toLowerCase().includes(search.toLowerCase()) ||
    r.team.toLowerCase().includes(search.toLowerCase())
  )

  const scoreColor = (s) => s >= 85 ? '#00e676' : s >= 70 ? '#ffd600' : '#ff4081'

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className={`font-heading font-bold text-2xl ${text}`}>Completed Reviews</h1>
          <p className={`text-sm mt-1 ${sub}`}>{COMPLETED.length} submissions reviewed</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${dark ? 'bg-white/5 border-[#1e3a5f]' : 'bg-white border-gray-200'}`}>
          <Search size={14} className={sub} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search project or team…"
            className={`bg-transparent outline-none text-sm w-48 ${text} placeholder:${sub}`} />
        </div>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Reviewed', value: COMPLETED.length,                                    color: '#00e5ff' },
          { label: 'Avg Score',      value: `${Math.round(COMPLETED.reduce((a, r) => a + r.score, 0) / COMPLETED.length)}%`, color: '#7c4dff' },
          { label: 'Top Score',      value: `${Math.max(...COMPLETED.map(r => r.score))}%`,       color: '#00e676' },
          { label: 'Events',         value: [...new Set(COMPLETED.map(r => r.event))].length,     color: '#ffd600' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`glass-card border ${border} p-4`}>
            <p className="text-2xl font-heading font-bold" style={{ color }}>{value}</p>
            <p className={`text-xs mt-1 ${sub}`}>{label}</p>
          </div>
        ))}
      </div>

      {/* Review cards */}
      <div className="flex flex-col gap-4">
        {filtered.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={`glass-card border ${border} overflow-hidden`}>
            <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer"
              onClick={() => setExpanded(expanded === r.id ? null : r.id)}>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <CheckCircle size={15} className="text-[#00e676]" />
                  <span className={`font-heading font-semibold ${text}`}>{r.project}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${dark ? 'bg-white/5 text-[#94a3b8]' : 'bg-gray-100 text-gray-500'}`}>{r.team}</span>
                </div>
                <p className={`text-xs ${sub}`}>{r.event} · Reviewed {r.submittedAt}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {r.tags.map(t => (
                    <span key={t} className={`text-[10px] px-2 py-0.5 rounded-full border ${dark ? 'border-white/10 text-[#94a3b8]' : 'border-gray-200 text-gray-500'}`}>{t}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <a href={r.github} onClick={e => e.stopPropagation()} className={`${sub} hover:text-[#00e5ff] transition-colors`}><Github size={16} /></a>
                <a href={r.demo}   onClick={e => e.stopPropagation()} className={`${sub} hover:text-[#00e5ff] transition-colors`}><ExternalLink size={16} /></a>
                <div className="text-center">
                  <div className="text-2xl font-heading font-bold" style={{ color: scoreColor(r.score) }}>{r.score}</div>
                  <div className={`text-[10px] ${sub}`}>/ {r.maxScore}</div>
                </div>
              </div>
            </div>

            {expanded === r.id && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                className={`px-5 pb-5 border-t ${border}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                  <div>
                    <p className={`text-xs font-semibold mb-3 ${sub}`}>SCORE BREAKDOWN</p>
                    <div className="flex flex-col gap-2">
                      {CRITERIA_KEYS.map(k => <ScoreBar key={k} label={k} score={r.criteria[k]} dark={dark} />)}
                    </div>
                  </div>
                  <div>
                    <p className={`text-xs font-semibold mb-3 ${sub}`}>FEEDBACK TO TEAM</p>
                    <div className={`flex gap-2 p-3 rounded-xl border ${dark ? 'bg-white/3 border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                      <MessageSquare size={14} className={`mt-0.5 flex-shrink-0 ${dark ? 'text-[#00e5ff]' : 'text-[#0066ff]'}`} />
                      <p className={`text-sm leading-relaxed ${text}`}>{r.comment}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className={`glass-card border ${border} p-16 text-center`}>
            <Filter size={40} className={`mx-auto mb-3 ${sub}`} />
            <p className={`font-semibold ${text}`}>No reviews match your search</p>
          </div>
        )}
      </div>
    </div>
  )
}
