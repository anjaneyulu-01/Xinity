import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Search, Github, ExternalLink, Filter, CheckCircle, Clock, Star, AlertCircle, X } from 'lucide-react'
import { useTheme } from '../../../context/ThemeContext'
import toast from 'react-hot-toast'

const STATUSES = ['All', 'Pending', 'Under Review', 'Scored', 'Winner']
const EVENTS   = ['All Events', 'WebX Challenge 2026', 'AI Hack Sprint 2025']

const SUBMISSIONS = [
  { id: 's1', project: 'AgroSense AI',  team: 'GreenBytes',   event: 'WebX Challenge 2026', status: 'Scored',       score: 88,  judge: 'Dr. Priya Mehta',   submittedAt: '2026-03-28', tags: ['React', 'TensorFlow'], github: '#', demo: '#' },
  { id: 's2', project: 'PayFlow',        team: 'Team Nexus',   event: 'WebX Challenge 2026', status: 'Scored',       score: 74,  judge: 'Prof. Amit Verma',  submittedAt: '2026-03-28', tags: ['Node.js', 'React'], github: '#', demo: '#' },
  { id: 's3', project: 'MediChain',      team: 'ByteForce',    event: 'WebX Challenge 2026', status: 'Winner',       score: 92,  judge: 'Dr. Priya Mehta',   submittedAt: '2026-03-28', tags: ['Solidity', 'React'], github: '#', demo: '#' },
  { id: 's4', project: 'EduBot',         team: 'CipherX',      event: 'AI Hack Sprint 2025', status: 'Scored',       score: 66,  judge: 'Dr. Sunita Rao',    submittedAt: '2026-03-27', tags: ['Python', 'LangChain'], github: '#', demo: '#' },
  { id: 's5', project: 'SmartGrid',      team: 'VoltWave',     event: 'AI Hack Sprint 2025', status: 'Scored',       score: 81,  judge: 'Prof. Amit Verma',  submittedAt: '2026-03-27', tags: ['Python', 'D3.js'], github: '#', demo: '#' },
  { id: 's6', project: 'SafeRoute',      team: 'DataNinjas',   event: 'WebX Challenge 2026', status: 'Under Review', score: null, judge: 'Dr. Neha Gupta',   submittedAt: '2026-03-29', tags: ['React Native', 'Firebase'], github: '#', demo: '#' },
  { id: 's7', project: 'CarbonTrack',    team: 'EcoDevs',      event: 'WebX Challenge 2026', status: 'Pending',      score: null, judge: '—',                submittedAt: '2026-03-30', tags: ['Vue', 'Python'], github: '#', demo: '#' },
  { id: 's8', project: 'HealthPulse',    team: 'MedCode',      event: 'AI Hack Sprint 2025', status: 'Pending',      score: null, judge: '—',                submittedAt: '2026-03-29', tags: ['React', 'FastAPI'], github: '#', demo: '#' },
]

const statusMeta = {
  'Pending':      { color: '#94a3b8', icon: Clock       },
  'Under Review': { color: '#ffd600', icon: AlertCircle },
  'Scored':       { color: '#00e5ff', icon: Star        },
  'Winner':       { color: '#00e676', icon: CheckCircle },
}

export default function AllSubmissions() {
  const { dark } = useTheme()
  const [search, setSearch]       = useState('')
  const [filterStatus, setFilter] = useState('All')
  const [filterEvent, setEvent]   = useState('All Events')
  const [selected, setSelected]   = useState(null)

  const border = dark ? 'border-[#1e3a5f]' : 'border-gray-200'
  const text   = dark ? 'text-white'        : 'text-gray-900'
  const sub    = dark ? 'text-[#94a3b8]'    : 'text-gray-500'

  const filtered = SUBMISSIONS.filter(s =>
    (filterStatus === 'All' || s.status === filterStatus) &&
    (filterEvent  === 'All Events' || s.event === filterEvent) &&
    (s.project.toLowerCase().includes(search.toLowerCase()) ||
     s.team.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Detail panel */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className={`glass-card border ${border} p-6 w-full max-w-lg`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`font-heading font-bold text-lg ${text}`}>{selected.project}</h2>
              <button onClick={() => setSelected(null)} className={`${sub} hover:text-red-400`}><X size={18} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { l: 'Team',    v: selected.team },
                { l: 'Event',   v: selected.event.split(' ').slice(0, 2).join(' ') },
                { l: 'Status',  v: selected.status },
                { l: 'Score',   v: selected.score ? `${selected.score}/100` : '—' },
                { l: 'Judge',   v: selected.judge },
                { l: 'Date',    v: selected.submittedAt },
              ].map(({ l, v }) => (
                <div key={l} className={`p-3 rounded-xl border ${dark ? 'border-white/5 bg-white/3' : 'border-gray-200 bg-gray-50'}`}>
                  <p className={`text-xs ${sub}`}>{l}</p>
                  <p className={`text-sm font-semibold mt-0.5 ${text}`}>{v}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {selected.tags.map(t => (
                <span key={t} className={`text-xs px-3 py-1 rounded-full border ${dark ? 'border-[#00e5ff]/20 text-[#00e5ff]' : 'border-[#0066ff]/20 text-[#0066ff]'}`}>{t}</span>
              ))}
            </div>
            <div className="flex gap-2">
              <a href={selected.github} className="btn-ghost text-xs py-2 px-3"><Github size={13} /> GitHub</a>
              <a href={selected.demo}   className="btn-ghost text-xs py-2 px-3"><ExternalLink size={13} /> Live Demo</a>
              <button onClick={() => { toast.success('Assigned to judge'); setSelected(null) }}
                className="btn-primary text-xs py-2 px-3 ml-auto">Assign Judge</button>
            </div>
          </motion.div>
        </div>
      )}

      <div>
        <h1 className={`font-heading font-bold text-2xl ${text}`}>All Submissions</h1>
        <p className={`text-sm mt-1 ${sub}`}>{SUBMISSIONS.length} submissions across all events</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STATUSES.slice(1).map(s => {
          const { color, icon: Icon } = statusMeta[s]
          return (
            <div key={s} className={`glass-card border ${border} p-4 flex items-center gap-3`}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: color + '15', border: `1px solid ${color}30` }}>
                <Icon size={16} style={{ color }} />
              </div>
              <div>
                <p className="font-heading font-bold text-lg" style={{ color }}>{SUBMISSIONS.filter(s2 => s2.status === s).length}</p>
                <p className={`text-xs ${sub}`}>{s}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border flex-1 min-w-40 ${dark ? 'bg-white/5 border-[#1e3a5f]' : 'bg-white border-gray-200'}`}>
          <Search size={14} className={sub} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search project or team…"
            className={`bg-transparent outline-none text-sm flex-1 ${text}`} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`text-xs font-medium px-3 py-2 rounded-xl border transition-all ${
                filterStatus === s
                  ? (dark ? 'border-[#00e5ff]/40 bg-[#00e5ff]/10 text-[#00e5ff]' : 'border-[#0066ff]/40 bg-[#0066ff]/10 text-[#0066ff]')
                  : (dark ? 'border-[#1e3a5f] text-[#94a3b8]' : 'border-gray-200 text-gray-500')
              }`}>{s}</button>
          ))}
        </div>
        <select value={filterEvent} onChange={e => setEvent(e.target.value)}
          className={`text-xs px-3 py-2 rounded-xl border outline-none ${dark ? 'bg-white/5 border-[#1e3a5f] text-[#94a3b8]' : 'bg-white border-gray-200 text-gray-600'}`}>
          {EVENTS.map(e => <option key={e}>{e}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className={`glass-card border ${border} overflow-hidden`}>
        <div className={`hidden sm:grid grid-cols-[2fr_1fr_1.5fr_100px_80px_1fr_80px] gap-3 px-4 py-3 text-xs font-semibold border-b ${border} ${sub}`}>
          <span>PROJECT</span><span>TEAM</span><span>EVENT</span><span>STATUS</span><span>SCORE</span><span>JUDGE</span><span>ACTIONS</span>
        </div>

        {filtered.map((s, i) => {
          const { color, icon: Icon } = statusMeta[s.status]
          return (
            <motion.div key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
              className={`grid grid-cols-1 sm:grid-cols-[2fr_1fr_1.5fr_100px_80px_1fr_80px] gap-3 items-center px-4 py-3 border-b ${border} last:border-b-0 hover:bg-white/2 cursor-pointer transition-colors`}
              onClick={() => setSelected(s)}>
              <div>
                <p className={`font-semibold text-sm ${text}`}>{s.project}</p>
                <div className="flex gap-1 flex-wrap mt-1">
                  {s.tags.slice(0, 2).map(t => (
                    <span key={t} className={`text-[10px] px-1.5 py-0.5 rounded border ${dark ? 'border-white/10 text-[#94a3b8]' : 'border-gray-200 text-gray-500'}`}>{t}</span>
                  ))}
                </div>
              </div>
              <p className={`text-sm ${text}`}>{s.team}</p>
              <p className={`text-xs ${sub}`}>{s.event.split(' ').slice(0, 2).join(' ')}</p>
              <span className="flex items-center gap-1 text-xs font-medium" style={{ color }}>
                <Icon size={12} /> {s.status}
              </span>
              <p className="text-sm font-code font-bold text-center" style={{ color: s.score ? (s.score >= 85 ? '#00e676' : s.score >= 70 ? '#ffd600' : '#ff4081') : '#94a3b8' }}>
                {s.score ? `${s.score}%` : '—'}
              </p>
              <p className={`text-xs ${sub}`}>{s.judge}</p>
              <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                <a href={s.github} className={`${sub} hover:text-[#00e5ff] p-1 transition-colors`}><Github size={13} /></a>
                <a href={s.demo}   className={`${sub} hover:text-[#00e5ff] p-1 transition-colors`}><ExternalLink size={13} /></a>
              </div>
            </motion.div>
          )
        })}

        {filtered.length === 0 && (
          <div className={`p-16 text-center ${sub}`}>
            <Upload size={36} className="mx-auto mb-3 opacity-30" />
            <p>No submissions match your filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
