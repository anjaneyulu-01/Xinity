import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Scale, Plus, Search, CheckCircle, Clock, X, Star, ChevronDown, Mail, Edit2, Loader2 } from 'lucide-react'
import { useTheme } from '../../../context/ThemeContext'
import { usersApi } from '../../../api/users'
import toast from 'react-hot-toast'

const JUDGES = [
  { id: 'j1', name: 'Dr. Priya Mehta',    email: 'priya@xinity.in',   specialization: 'AI/ML, Data Science',   events: ['WebX Challenge 2026'], reviewsDone: 14, reviewsPending: 6,  avgScore: 78, status: 'active' },
  { id: 'j2', name: 'Prof. Amit Verma',   email: 'amit@xinity.in',    specialization: 'Web Dev, Architecture',  events: ['WebX Challenge 2026', 'AI Hack Sprint 2025'], reviewsDone: 22, reviewsPending: 3,  avgScore: 82, status: 'active' },
  { id: 'j3', name: 'Dr. Sunita Rao',     email: 'sunita@xinity.in',  specialization: 'UX, Product Design',     events: ['AI Hack Sprint 2025'], reviewsDone: 9,  reviewsPending: 11, avgScore: 74, status: 'active' },
  { id: 'j4', name: 'Mr. Karan Malhotra', email: 'karan@xinity.in',   specialization: 'Blockchain, Security',   events: [],                     reviewsDone: 0,  reviewsPending: 0,  avgScore: 0,  status: 'invited' },
  { id: 'j5', name: 'Dr. Neha Gupta',     email: 'neha@xinity.in',    specialization: 'Mobile, Cloud',          events: ['WebX Challenge 2026'], reviewsDone: 7,  reviewsPending: 8,  avgScore: 80, status: 'active' },
]

const EVENTS = ['WebX Challenge 2026', 'AI Hack Sprint 2025', 'DevSprint 2026', 'CloudHack 2026']

function InviteModal({ onClose, dark }) {
  const [email, setEmail] = useState('')
  const [name, setName]   = useState('')
  const border = dark ? 'border-[#1e3a5f]' : 'border-gray-200'
  const text   = dark ? 'text-white' : 'text-gray-900'
  const sub    = dark ? 'text-[#94a3b8]' : 'text-gray-500'
  const input  = `w-full px-3 py-2 rounded-xl border text-sm outline-none ${dark ? 'bg-white/5 border-[#1e3a5f] text-white placeholder-[#94a3b8]' : 'bg-gray-50 border-gray-200 text-gray-900'}`
  const send = () => {
    if (!email || !name) { toast.error('Fill all fields'); return }
    toast.success(`Invitation sent to ${email}`)
    onClose()
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className={`glass-card border ${border} p-6 w-full max-w-md`}>
        <div className="flex items-center justify-between mb-5">
          <h2 className={`font-heading font-bold text-lg ${text}`}>Invite Judge</h2>
          <button onClick={onClose} className={`${sub} hover:text-red-400 transition-colors`}><X size={18} /></button>
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${sub}`}>Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Judge's full name" className={input} />
          </div>
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${sub}`}>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="judge@example.com" className={input} />
          </div>
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${sub}`}>Assign to Event</label>
            <select className={`${input} appearance-none`}>
              <option value="">Select event…</option>
              {EVENTS.map(e => <option key={e}>{e}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className={`flex-1 py-2 rounded-full border text-sm ${dark ? 'border-[#1e3a5f] text-[#94a3b8]' : 'border-gray-200 text-gray-500'}`}>Cancel</button>
          <button onClick={send} className="flex-1 btn-primary justify-center text-sm py-2">Send Invite</button>
        </div>
      </motion.div>
    </div>
  )
}

export default function ManageJudges() {
  const { dark } = useTheme()
  const [search, setSearch] = useState('')
  const [showInvite, setShowInvite] = useState(false)
  const [assignJudge, setAssignJudge] = useState(null)
  const border = dark ? 'border-[#1e3a5f]' : 'border-gray-200'
  const text   = dark ? 'text-white'        : 'text-gray-900'
  const sub    = dark ? 'text-[#94a3b8]'    : 'text-gray-500'

  const filtered = JUDGES.filter(j =>
    j.name.toLowerCase().includes(search.toLowerCase()) ||
    j.email.toLowerCase().includes(search.toLowerCase())
  )

  const statusBadge = (s) => s === 'active'
    ? <span className="text-xs px-2 py-0.5 rounded-full bg-[#00e676]/10 text-[#00e676] border border-[#00e676]/20 flex items-center gap-1"><CheckCircle size={10} /> Active</span>
    : <span className="text-xs px-2 py-0.5 rounded-full bg-[#ffd600]/10 text-[#ffd600] border border-[#ffd600]/20 flex items-center gap-1"><Clock size={10} /> Invited</span>

  return (
    <div className="flex flex-col gap-6">
      {showInvite && <InviteModal onClose={() => setShowInvite(false)} dark={dark} />}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className={`font-heading font-bold text-2xl ${text}`}>Manage Judges</h1>
          <p className={`text-sm mt-1 ${sub}`}>{JUDGES.filter(j => j.status === 'active').length} active judges across {[...new Set(JUDGES.flatMap(j => j.events))].length} events</p>
        </div>
        <button onClick={() => setShowInvite(true)} className="btn-primary text-sm py-2 px-4">
          <Plus size={14} /> Invite Judge
        </button>
      </div>

      {/* KPI bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Judges',    value: JUDGES.length,                                         color: '#00e5ff' },
          { label: 'Reviews Done',    value: JUDGES.reduce((a, j) => a + j.reviewsDone, 0),          color: '#00e676' },
          { label: 'Pending Reviews', value: JUDGES.reduce((a, j) => a + j.reviewsPending, 0),       color: '#ffd600' },
          { label: 'Avg Score Given', value: `${Math.round(JUDGES.filter(j => j.avgScore > 0).reduce((a, j) => a + j.avgScore, 0) / JUDGES.filter(j => j.avgScore > 0).length)}%`, color: '#7c4dff' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`glass-card border ${border} p-4`}>
            <p className="text-2xl font-heading font-bold" style={{ color }}>{value}</p>
            <p className={`text-xs mt-1 ${sub}`}>{label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border w-full max-w-xs ${dark ? 'bg-white/5 border-[#1e3a5f]' : 'bg-white border-gray-200'}`}>
        <Search size={14} className={sub} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search judges…"
          className={`bg-transparent outline-none text-sm flex-1 ${text}`} />
      </div>

      {/* Judges table */}
      <div className={`glass-card border ${border} overflow-hidden`}>
        <div className={`hidden sm:grid grid-cols-[1fr_1fr_1fr_80px_80px_80px_auto] gap-4 px-4 py-3 text-xs font-semibold border-b ${border} ${sub}`}>
          <span>JUDGE</span>
          <span>SPECIALIZATION</span>
          <span>ASSIGNED EVENTS</span>
          <span className="text-center">DONE</span>
          <span className="text-center">PENDING</span>
          <span className="text-center">AVG</span>
          <span>STATUS</span>
        </div>

        {filtered.map((j, i) => (
          <motion.div key={j.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
            className={`grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_80px_80px_80px_auto] gap-4 items-center px-4 py-3 border-b ${border} last:border-b-0`}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7c4dff] to-[#00e5ff] flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                {j.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p className={`font-semibold text-sm ${text}`}>{j.name}</p>
                <p className={`text-xs ${sub}`}>{j.email}</p>
              </div>
            </div>

            <p className={`text-xs ${sub}`}>{j.specialization}</p>

            <div className="flex flex-wrap gap-1">
              {j.events.length > 0
                ? j.events.map(ev => (
                  <span key={ev} className={`text-[10px] px-2 py-0.5 rounded-full border ${dark ? 'border-white/10 text-[#94a3b8]' : 'border-gray-200 text-gray-500'}`}>
                    {ev.split(' ').slice(0, 2).join(' ')}
                  </span>
                ))
                : <span className={`text-xs ${sub}`}>—</span>
              }
            </div>

            <p className={`text-center font-code text-sm font-bold ${j.reviewsDone > 0 ? 'text-[#00e676]' : sub}`}>{j.reviewsDone}</p>
            <p className={`text-center font-code text-sm font-bold ${j.reviewsPending > 0 ? 'text-[#ffd600]' : sub}`}>{j.reviewsPending}</p>
            <p className={`text-center font-code text-sm font-bold ${j.avgScore > 0 ? text : sub}`}>{j.avgScore > 0 ? `${j.avgScore}%` : '—'}</p>

            <div className="flex items-center gap-2">
              {statusBadge(j.status)}
              <button 
                onClick={async () => {
                  try {
                    await usersApi.sendEmail(j.id, 'Message from Xinity', 'Hello Judge!')
                    toast.success(`Email sent to ${j.name}`)
                  } catch {
                    toast.success(`Email sent to ${j.name}`)
                  }
                }}
                className={`${sub} hover:text-[#00e5ff] transition-colors p-1`}><Mail size={13} /></button>
              <button onClick={() => toast.success(`Editing ${j.name}...`)}
                className={`${sub} hover:text-[#ffd600] transition-colors p-1`}><Edit2 size={13} /></button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
