import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, GitBranch, ExternalLink, Star, ChevronRight } from 'lucide-react'
import { useEventStore } from '../../../store/eventStore'
import toast from 'react-hot-toast'

const COLS = ['Pending', 'In Review', 'Reviewed']

const COL_COLOR = {
  'Pending':   '#ffd600',
  'In Review': '#00e5ff',
  'Reviewed':  '#00e676',
}

const CRITERIA = [
  { key: 'innovation',    label: 'Innovation & Creativity' },
  { key: 'technical',     label: 'Technical Implementation' },
  { key: 'design',        label: 'Design & UI/UX' },
  { key: 'functionality', label: 'Functionality' },
  { key: 'presentation',  label: 'Presentation Quality' },
]

function ScoreRing({ score, max = 50 }) {
  const pct = score / max
  const r = 36, circ = 2 * Math.PI * r
  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="96" height="96">
        <circle cx="48" cy="48" r={r} fill="none" stroke="#1e3a5f" strokeWidth="6" />
        <motion.circle
          cx="48" cy="48" r={r} fill="none" stroke="#00e5ff" strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ * (1 - pct) }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </svg>
      <div className="text-center z-10">
        <div className="text-xl font-heading font-bold text-white">{score}</div>
        <div className="text-xs text-[#94a3b8]">/{max}</div>
      </div>
    </div>
  )
}

function ReviewModal({ sub, onClose }) {
  const [scores, setScores] = useState({ innovation: 7, technical: 6, design: 5, functionality: 7, presentation: 6 })
  const [comment, setComment] = useState('')
  const [privateNote, setPrivateNote] = useState('')
  const { updateSubmissionStatus } = useEventStore()

  const total = Object.values(scores).reduce((a, b) => a + b, 0)

  const handleSubmit = () => {
    updateSubmissionStatus(sub.id, 'Reviewed')
    toast.success('Review submitted!')
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="glass-card border border-[#1e3a5f] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1e3a5f]">
          <div>
            <h2 className="font-heading font-bold text-xl text-white">{sub.projectName}</h2>
            <p className="text-[#94a3b8] text-sm">{sub.teamName} · {sub.eventName}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#94a3b8] hover:text-white"><X size={16} /></button>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#1e3a5f]">
          {/* Left: submission info */}
          <div className="p-5 flex flex-col gap-4">
            <div>
              <h4 className="text-xs font-medium text-[#94a3b8] uppercase tracking-wider mb-2">Description</h4>
              <p className="text-[#94a3b8] text-sm leading-relaxed">{sub.description}</p>
            </div>
            <div>
              <h4 className="text-xs font-medium text-[#94a3b8] uppercase tracking-wider mb-2">Tech Stack</h4>
              <div className="flex gap-2 flex-wrap">
                {sub.techStack.map(t => (
                  <span key={t} className="px-2.5 py-1 rounded-lg text-xs font-code bg-white/5 border border-white/10 text-[#94a3b8]">{t}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <a href={sub.githubUrl} className="btn-ghost text-xs py-2 px-4 flex items-center gap-1.5">
                <GitBranch size={12} /> GitHub
              </a>
              <a href={sub.demoUrl} className="btn-ghost text-xs py-2 px-4 flex items-center gap-1.5">
                <ExternalLink size={12} /> Demo
              </a>
            </div>
            {/* Demo embed placeholder */}
            <div className="flex-1 min-h-32 rounded-xl border border-dashed border-[#1e3a5f] flex items-center justify-center bg-white/2">
              <div className="text-center">
                <ExternalLink size={24} className="text-[#1e3a5f] mx-auto mb-2" />
                <p className="text-[#94a3b8] text-sm">Demo Preview</p>
                <a href={sub.demoUrl} target="_blank" className="text-[#00e5ff] text-xs hover:underline mt-1 block">Open in new tab →</a>
              </div>
            </div>
          </div>

          {/* Right: scoring */}
          <div className="p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-medium text-[#94a3b8] uppercase tracking-wider">Scoring</h4>
              <ScoreRing score={total} max={50} />
            </div>
            <div className="flex flex-col gap-4">
              {CRITERIA.map(({ key, label }) => (
                <div key={key}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm text-[#94a3b8]">{label}</span>
                    <span className="text-sm font-bold text-[#00e5ff]">{scores[key]}/10</span>
                  </div>
                  <input
                    type="range" min={0} max={10} value={scores[key]}
                    onChange={e => setScores(s => ({ ...s, [key]: +e.target.value }))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{ background: `linear-gradient(90deg, #00e5ff ${scores[key]*10}%, #1e3a5f ${scores[key]*10}%)` }}
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">Judge Comment <span className="text-[#94a3b8]/50">(visible to team)</span></label>
              <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} placeholder="Provide constructive feedback..." className="input-field resize-none text-sm" />
              <p className="text-right text-xs text-[#94a3b8] mt-1">{comment.length}/500</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">Private Note <span className="text-[#94a3b8]/50">(only you see this)</span></label>
              <textarea value={privateNote} onChange={e => setPrivateNote(e.target.value)} rows={2} placeholder="Internal notes..." className="input-field resize-none text-sm" />
            </div>
            <button onClick={handleSubmit} className="btn-primary w-full justify-center py-3 mt-auto">
              Submit Review — {total}/50 pts
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function ReviewQueue() {
  const { reviewQueue, updateSubmissionStatus } = useEventStore()
  const [selected, setSelected] = useState(null)

  const cols = COLS.reduce((acc, col) => {
    acc[col] = reviewQueue.filter(r => r.status === col)
    return acc
  }, {})

  const pending = reviewQueue.filter(r => r.status === 'Pending').length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-heading font-bold text-2xl text-white">
            Review Queue
            {pending > 0 && (
              <span className="ml-3 text-sm px-3 py-1 rounded-full bg-[#ffd600]/10 text-[#ffd600] border border-[#ffd600]/30 font-normal animate-pulse">
                {pending} pending
              </span>
            )}
          </h1>
          <p className="text-[#94a3b8] text-sm mt-1">Click a card to open full review panel</p>
        </div>
      </div>

      {/* Kanban board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {COLS.map(col => (
          <div key={col}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full" style={{ background: COL_COLOR[col] }} />
              <span className="font-semibold text-white text-sm">{col}</span>
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-white/5 text-[#94a3b8]">{cols[col].length}</span>
            </div>
            <div className="flex flex-col gap-3 min-h-24">
              {cols[col].map((sub, i) => (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -2, boxShadow: `0 0 20px ${COL_COLOR[col]}20` }}
                  onClick={() => setSelected(sub)}
                  className="glass-card p-4 border border-white/5 cursor-pointer transition-all hover:border-current/30"
                  style={{ '--tw-border-opacity': 1 }}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-semibold text-white text-sm leading-tight">{sub.projectName}</h4>
                    <ChevronRight size={14} className="text-[#94a3b8] flex-shrink-0 mt-0.5" />
                  </div>
                  <p className="text-[#94a3b8] text-xs mb-3">{sub.teamName}</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {sub.techStack.slice(0, 3).map(t => (
                      <span key={t} className="px-1.5 py-0.5 rounded text-xs font-code bg-white/5 border border-white/10 text-[#94a3b8]">{t}</span>
                    ))}
                  </div>
                  {sub.score && (
                    <div className="mt-2 flex items-center gap-1.5">
                      <Star size={12} className="text-[#ffd600] fill-[#ffd600]" />
                      <span className="text-xs text-[#ffd600] font-bold">{sub.score}/100</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selected && <ReviewModal sub={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  )
}
