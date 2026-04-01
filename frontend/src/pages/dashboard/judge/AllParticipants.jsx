import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Users, Trophy, Upload, Star, ChevronDown, ChevronUp } from 'lucide-react'
import { useTheme } from '../../../context/ThemeContext'

const TEAMS = [
  {
    id: 't1', name: 'Team Nexus', rank: 1, score: 2450, members: 4,
    submissions: 2, event: 'WebX Challenge 2026',
    members_list: ['Arjun Sharma', 'Priya Patel', 'Rohan Mehta', 'Sneha Joshi'],
    tags: ['React', 'Node.js', 'MongoDB'],
  },
  {
    id: 't2', name: 'ByteForce', rank: 2, score: 2100, members: 3,
    submissions: 2, event: 'WebX Challenge 2026',
    members_list: ['Vikram Singh', 'Anita Rao', 'Kiran Kumar'],
    tags: ['Solidity', 'React', 'IPFS'],
  },
  {
    id: 't3', name: 'CipherX', rank: 3, score: 1980, members: 4,
    submissions: 1, event: 'WebX Challenge 2026',
    members_list: ['Dev Patel', 'Meera Shah', 'Rahul Verma', 'Tanya Gupta'],
    tags: ['Python', 'LangChain', 'FastAPI'],
  },
  {
    id: 't4', name: 'GreenBytes', rank: 4, score: 1750, members: 3,
    submissions: 2, event: 'WebX Challenge 2026',
    members_list: ['Aarav Jain', 'Pooja Nair', 'Siddharth Rao'],
    tags: ['React', 'Python', 'TensorFlow'],
  },
  {
    id: 't5', name: 'VoltWave', rank: 5, score: 1620, members: 4,
    submissions: 1, event: 'AI Hack Sprint 2025',
    members_list: ['Ishaan Kapoor', 'Neha Sharma', 'Amit Tiwari', 'Riya Desai'],
    tags: ['Python', 'Next.js', 'D3.js'],
  },
  {
    id: 't6', name: 'DataNinjas', rank: 6, score: 1440, members: 2,
    submissions: 1, event: 'AI Hack Sprint 2025',
    members_list: ['Suresh Kumar', 'Kavita Reddy'],
    tags: ['Python', 'Sklearn', 'Streamlit'],
  },
]

const rankBadge = (r) => r === 1 ? '🥇' : r === 2 ? '🥈' : r === 3 ? '🥉' : `#${r}`

export default function AllParticipants() {
  const { dark } = useTheme()
  const [search, setSearch]   = useState('')
  const [expanded, setExpanded] = useState(null)
  const [sortBy, setSortBy]   = useState('rank')

  const border = dark ? 'border-[#1e3a5f]' : 'border-gray-200'
  const text   = dark ? 'text-white'        : 'text-gray-900'
  const sub    = dark ? 'text-[#94a3b8]'    : 'text-gray-500'

  const filtered = TEAMS
    .filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.event.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === 'rank' ? a.rank - b.rank : b.score - a.score)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className={`font-heading font-bold text-2xl ${text}`}>All Participants</h1>
        <p className={`text-sm mt-1 ${sub}`}>{TEAMS.length} teams across all assigned events</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Teams',   value: TEAMS.length,                                         icon: Users,  color: '#00e5ff' },
          { label: 'Participants',  value: TEAMS.reduce((a, t) => a + t.members, 0),             icon: Users,  color: '#7c4dff' },
          { label: 'Submissions',   value: TEAMS.reduce((a, t) => a + t.submissions, 0),         icon: Upload, color: '#00e676' },
          { label: 'Avg Score',     value: Math.round(TEAMS.reduce((a, t) => a + t.score, 0) / TEAMS.length), icon: Star, color: '#ffd600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`glass-card border ${border} p-4 flex items-center gap-3`}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: color + '15', border: `1px solid ${color}30` }}>
              <Icon size={16} style={{ color }} />
            </div>
            <div>
              <p className={`font-heading font-bold text-lg ${text}`}>{value}</p>
              <p className={`text-xs ${sub}`}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter row */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border flex-1 min-w-48 ${dark ? 'bg-white/5 border-[#1e3a5f]' : 'bg-white border-gray-200'}`}>
          <Search size={14} className={sub} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search teams or events…"
            className={`bg-transparent outline-none text-sm flex-1 ${text}`} />
        </div>
        <div className="flex gap-2">
          {[{ v: 'rank', l: 'By Rank' }, { v: 'score', l: 'By Score' }].map(({ v, l }) => (
            <button key={v} onClick={() => setSortBy(v)}
              className={`text-xs font-medium px-3 py-2 rounded-xl border transition-all ${
                sortBy === v
                  ? (dark ? 'border-[#00e5ff]/40 bg-[#00e5ff]/10 text-[#00e5ff]' : 'border-[#0066ff]/40 bg-[#0066ff]/10 text-[#0066ff]')
                  : (dark ? 'border-[#1e3a5f] text-[#94a3b8]' : 'border-gray-200 text-gray-500')
              }`}>{l}
            </button>
          ))}
        </div>
      </div>

      {/* Team list */}
      <div className="flex flex-col gap-3">
        {filtered.map((t, i) => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className={`glass-card border ${border} overflow-hidden`}>
            <div className="p-4 flex items-center gap-4 cursor-pointer"
              onClick={() => setExpanded(expanded === t.id ? null : t.id)}>
              <div className="text-xl w-10 text-center flex-shrink-0">{rankBadge(t.rank)}</div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold ${text}`}>{t.name}</p>
                <p className={`text-xs ${sub}`}>{t.event}</p>
              </div>
              <div className="hidden sm:flex gap-6 text-center">
                {[
                  { l: 'Members',     v: t.members,     color: '#7c4dff' },
                  { l: 'Submissions', v: t.submissions, color: '#00e676' },
                  { l: 'Score',       v: t.score,       color: '#ffd600' },
                ].map(({ l, v, color }) => (
                  <div key={l}>
                    <p className="font-heading font-bold text-sm" style={{ color }}>{v}</p>
                    <p className={`text-[10px] ${sub}`}>{l}</p>
                  </div>
                ))}
              </div>
              <div className={sub}>{expanded === t.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</div>
            </div>

            {expanded === t.id && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                className={`px-4 pb-4 border-t ${border}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className={`text-xs font-semibold mb-2 ${sub}`}>TEAM MEMBERS</p>
                    <div className="flex flex-col gap-1.5">
                      {t.members_list.map((m, idx) => (
                        <div key={m} className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00e5ff] to-[#7c4dff] flex items-center justify-center text-xs font-bold text-white">
                            {m[0]}
                          </div>
                          <span className={`text-sm ${text}`}>{m}</span>
                          {idx === 0 && <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#ffd600]/20 text-[#ffd600]">Leader</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className={`text-xs font-semibold mb-2 ${sub}`}>TECH STACK</p>
                    <div className="flex flex-wrap gap-2">
                      {t.tags.map(tag => (
                        <span key={tag} className={`text-xs px-3 py-1 rounded-full border ${dark ? 'border-[#00e5ff]/20 text-[#00e5ff] bg-[#00e5ff]/5' : 'border-[#0066ff]/20 text-[#0066ff] bg-[#0066ff]/5'}`}>{tag}</span>
                      ))}
                    </div>
                    <div className="mt-4">
                      <p className={`text-xs font-semibold mb-2 ${sub}`}>LEADERBOARD SCORE</p>
                      <div className={`h-2 rounded-full ${dark ? 'bg-white/10' : 'bg-gray-200'}`}>
                        <div className="h-full rounded-full bg-gradient-to-r from-[#00e5ff] to-[#7c4dff]"
                          style={{ width: `${(t.score / 2500) * 100}%` }} />
                      </div>
                      <p className={`text-xs mt-1 ${sub}`}>{t.score} / 2500 pts</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
