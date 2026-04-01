import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Github, ExternalLink, Clock, CheckCircle, AlertCircle,
  Loader2, RefreshCw, ChevronRight, Star, Zap, FileText,
  BarChart2, TrendingUp
} from 'lucide-react'
import { useAuthStore }   from '../../../store/authStore'
import { useReviewStore } from '../../../store/reviewStore'
import { useTheme }       from '../../../context/ThemeContext'
import toast from 'react-hot-toast'

// ── Constants ──────────────────────────────────────────────────────────────
const CRITERIA = [
  { key: 'innovation',    label: 'Innovation & Creativity',  color: '#00e5ff' },
  { key: 'technical',     label: 'Technical Implementation', color: '#7c4dff' },
  { key: 'design',        label: 'Design & UI/UX',           color: '#00e676' },
  { key: 'functionality', label: 'Functionality',            color: '#ffd600' },
  { key: 'presentation',  label: 'Presentation Quality',     color: '#ff4081' },
]

const STATUS_META = {
  Pending:    { color: '#ffd600', bg: 'bg-[#ffd600]/10', border: 'border-[#ffd600]/30', icon: Clock },
  'In Review':{ color: '#00e5ff', bg: 'bg-[#00e5ff]/10', border: 'border-[#00e5ff]/30', icon: AlertCircle },
  Reviewed:   { color: '#00e676', bg: 'bg-[#00e676]/10', border: 'border-[#00e676]/30', icon: CheckCircle },
}

// ── Score ring ─────────────────────────────────────────────────────────────
function ScoreRing({ score, max = 50, size = 96 }) {
  const r    = size / 2 - 8
  const circ = 2 * Math.PI * r
  const pct  = Math.min(score / max, 1)
  const color = pct >= 0.8 ? '#00e676' : pct >= 0.6 ? '#00e5ff' : pct >= 0.4 ? '#ffd600' : '#ff4081'
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="absolute inset-0 -rotate-90" width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
        <motion.circle
          cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="7"
          strokeLinecap="round" strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ * (1 - pct) }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="z-10 text-center">
        <div className="text-2xl font-heading font-black" style={{ color }}>{score}</div>
        <div className="text-[10px] font-code text-[#94a3b8]">/{max} pts</div>
      </div>
    </div>
  )
}

// ── Interactive Score Selector ─────────────────────────────────────────────
function ScoreSlider({ criterion, value, onChange, dark }) {
  const [hoveredScore, setHoveredScore] = useState(null)
  const displayScore = hoveredScore !== null ? hoveredScore : value

  return (
    <div className={`flex flex-col gap-3 p-4 rounded-2xl transition-all ${
      dark 
        ? 'bg-white/[0.03] border border-white/10 hover:border-white/20' 
        : 'bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-sm'
    }`}>
      {/* Header with label and current score */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: criterion.color, boxShadow: `0 0 10px ${criterion.color}60` }} />
          <span className={`text-sm font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>{criterion.label}</span>
        </div>
        <motion.div
          key={displayScore}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg"
          style={{ background: `${criterion.color}15`, border: `1px solid ${criterion.color}30` }}
        >
          <span className="text-xl font-heading font-black" style={{ color: criterion.color }}>{displayScore}</span>
          <span className={`text-xs ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>/10</span>
        </motion.div>
      </div>

      {/* Interactive score buttons */}
      <div className="flex items-center gap-1.5">
        {Array.from({ length: 10 }).map((_, i) => {
          const scoreVal = i + 1
          const isSelected = scoreVal <= value
          const isHovered = hoveredScore !== null && scoreVal <= hoveredScore
          const showActive = hoveredScore !== null ? isHovered : isSelected

          return (
            <motion.button
              key={i}
              onClick={() => onChange(scoreVal)}
              onMouseEnter={() => setHoveredScore(scoreVal)}
              onMouseLeave={() => setHoveredScore(null)}
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex-1 h-10 rounded-lg font-heading font-bold text-xs transition-all duration-200 border"
              style={{
                background: showActive
                  ? `linear-gradient(135deg, ${criterion.color}90, ${criterion.color})`
                  : dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                borderColor: showActive ? criterion.color : dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                color: showActive ? '#04040f' : dark ? '#64748b' : '#9ca3af',
                boxShadow: showActive ? `0 4px 15px ${criterion.color}40` : 'none',
              }}
            >
              {scoreVal}
              {scoreVal === value && (
                <motion.div
                  layoutId={`selected-${criterion.key}`}
                  className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-white flex items-center justify-center"
                  style={{ boxShadow: `0 2px 8px ${criterion.color}60` }}
                >
                  <CheckCircle size={8} style={{ color: criterion.color }} />
                </motion.div>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Progress bar */}
      <div className={`h-2 rounded-full overflow-hidden ${dark ? 'bg-white/5' : 'bg-gray-200'}`}>
        <motion.div
          className="h-full rounded-full relative"
          animate={{ width: `${displayScore * 10}%` }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          style={{ background: `linear-gradient(90deg, ${criterion.color}60, ${criterion.color})` }}
        >
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ background: `linear-gradient(90deg, transparent, ${criterion.color}40, transparent)` }}
          />
        </motion.div>
      </div>

      {/* Score description */}
      <div className={`flex justify-between text-[10px] px-1 ${dark ? 'text-[#94a3b8]/60' : 'text-gray-400'}`}>
        <span>Poor</span>
        <span>Average</span>
        <span>Excellent</span>
      </div>
    </div>
  )
}

// ── Review Modal ────────────────────────────────────────────────────────────
function ReviewModal({ sub, judgeId, judgeName, onClose, dark }) {
  const { submitReview, submitting } = useReviewStore()
  const [scores, setScores]     = useState({ innovation: 7, technical: 7, design: 6, functionality: 7, presentation: 6 })
  const [comment, setComment]   = useState('')
  const [note, setNote]         = useState('')
  const [tab, setTab]           = useState('info')  // 'info' | 'score'

  const total     = Object.values(scores).reduce((a, b) => a + b, 0)
  const normalised = Math.round((total / 50) * 100)

  const handleSubmit = async () => {
    if (!comment.trim()) { toast.error('Please add feedback for the team'); return }
    const result = await submitReview({
      submissionId: sub._id,
      judgeId,
      judgeName,
      scores,
      comment:     comment.trim(),
      privateNote: note.trim(),
    })
    if (result.success) {
      toast.success(`✅ Review submitted — ${normalised}/100`)
      onClose()
    } else {
      toast.error(result.error || 'Failed to submit review')
    }
  }

  const techBg = dark ? 'bg-white/5 border border-white/10 text-[#94a3b8]' : 'bg-gray-100 border border-gray-200 text-gray-600'

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full sm:max-w-5xl max-h-[95vh] rounded-t-3xl sm:rounded-2xl overflow-hidden flex flex-col"
        style={{ background: dark ? '#0c1628' : '#ffffff', border: dark ? '1px solid #1e3a5f' : '1px solid #e5e7eb' }}
      >
        {/* ── Modal Header ── */}
        <div className="flex items-start justify-between px-6 py-4 border-b" style={{ borderColor: dark ? '#1e3a5f' : '#f0f0f0' }}>
          <div className="flex-1 min-w-0">
            <h2 className={`font-heading font-bold text-xl truncate ${dark ? 'text-white' : 'text-gray-900'}`}>{sub.projectName}</h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={`text-sm ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>{sub.teamName}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${dark ? 'bg-white/5 text-[#94a3b8]' : 'bg-gray-100 text-gray-500'}`}>{sub.eventName}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/20`}>
                {sub.status}
              </span>
            </div>
          </div>
          <button onClick={onClose}
            className={`ml-4 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${dark ? 'bg-white/5 text-[#94a3b8] hover:bg-white/10 hover:text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'}`}>
            <X size={15} />
          </button>
        </div>

        {/* ── Mobile tabs ── */}
        <div className="flex lg:hidden border-b" style={{ borderColor: dark ? '#1e3a5f' : '#f0f0f0' }}>
          {['info', 'score'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${
                tab === t
                  ? (dark ? 'text-[#00e5ff] border-b-2 border-[#00e5ff]' : 'text-[#0066ff] border-b-2 border-[#0066ff]')
                  : (dark ? 'text-[#94a3b8]' : 'text-gray-500')
              }`}>{t === 'info' ? '📋 Submission' : '⭐ Scoring'}</button>
          ))}
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-hidden flex">
          {/* Left: submission details */}
          <div className={`flex-1 overflow-y-auto p-6 flex-col gap-5 ${tab === 'info' || window.innerWidth >= 1024 ? 'flex' : 'hidden'} lg:flex lg:border-r`}
            style={{ borderColor: dark ? '#1e3a5f' : '#f0f0f0' }}>

            {/* Description */}
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${dark ? 'text-[#94a3b8]' : 'text-gray-400'}`}>Project Description</p>
              <p className={`text-sm leading-relaxed ${dark ? 'text-[#cbd5e1]' : 'text-gray-600'}`}>{sub.description || 'No description provided.'}</p>
            </div>

            {/* Tech stack */}
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${dark ? 'text-[#94a3b8]' : 'text-gray-400'}`}>Tech Stack</p>
              <div className="flex flex-wrap gap-2">
                {(sub.techStack || []).map(t => (
                  <span key={t} className={`px-3 py-1 rounded-lg text-xs font-code font-medium ${techBg}`}>{t}</span>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="flex gap-3">
              <a href={sub.githubUrl || '#'} target="_blank" rel="noopener noreferrer"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border transition-all ${dark ? 'border-white/10 text-[#94a3b8] hover:border-[#00e5ff]/40 hover:text-[#00e5ff] hover:bg-[#00e5ff]/5' : 'border-gray-200 text-gray-600 hover:border-[#0066ff]/40 hover:text-[#0066ff]'}`}>
                <Github size={13} /> View on GitHub
              </a>
              <a href={sub.demoUrl || '#'} target="_blank" rel="noopener noreferrer"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border transition-all ${dark ? 'border-white/10 text-[#94a3b8] hover:border-[#7c4dff]/40 hover:text-[#7c4dff] hover:bg-[#7c4dff]/5' : 'border-gray-200 text-gray-600 hover:border-[#7c4dff]/40 hover:text-[#7c4dff]'}`}>
                <ExternalLink size={13} /> Live Demo
              </a>
            </div>

            {/* Demo iframe placeholder */}
            <div className={`rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-8 gap-3 ${dark ? 'border-[#1e3a5f] bg-white/2' : 'border-gray-200 bg-gray-50'}`}
              style={{ minHeight: 160 }}>
              <ExternalLink size={28} className={dark ? 'text-[#1e3a5f]' : 'text-gray-300'} />
              <p className={`text-sm font-medium ${dark ? 'text-[#94a3b8]' : 'text-gray-400'}`}>Demo Preview</p>
              <a href={sub.demoUrl || '#'} target="_blank" rel="noopener noreferrer"
                className={`text-xs font-medium ${dark ? 'text-[#00e5ff] hover:underline' : 'text-[#0066ff] hover:underline'}`}>
                Open demo in new tab →
              </a>
            </div>
          </div>

          {/* Right: scoring */}
          <div className={`w-full lg:w-[440px] flex-shrink-0 overflow-y-auto p-6 flex flex-col gap-4 ${tab === 'score' || window.innerWidth >= 1024 ? 'flex' : 'hidden'} lg:flex`}
            style={{ background: dark ? 'linear-gradient(180deg, #0a1020 0%, #0c1628 100%)' : '#fafbfc' }}>

            {/* Score header with prominent ring */}
            <div className="flex items-center justify-between p-4 rounded-2xl" style={{ background: dark ? 'rgba(0,229,255,0.05)' : 'rgba(0,102,255,0.05)', border: dark ? '1px solid rgba(0,229,255,0.2)' : '1px solid rgba(0,102,255,0.2)' }}>
              <div>
                <p className={`text-sm font-bold uppercase tracking-wider ${dark ? 'text-[#00e5ff]' : 'text-[#0066ff]'}`}>Total Score</p>
                <p className={`text-xs mt-1 ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>Normalized: <span className="font-bold">{normalised}/100</span></p>
              </div>
              <ScoreRing score={total} max={50} size={100} />
            </div>

            {/* Section header */}
            <div className="flex items-center gap-2 mt-2">
              <Star size={14} className={dark ? 'text-[#ffd600]' : 'text-amber-500'} />
              <span className={`text-xs font-bold uppercase tracking-wider ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>Rate Each Criterion</span>
            </div>

            {/* Criteria sliders */}
            <div className="flex flex-col gap-3">
              {CRITERIA.map(c => (
                <ScoreSlider key={c.key} criterion={c} value={scores[c.key]} dark={dark}
                  onChange={v => setScores(s => ({ ...s, [c.key]: v }))} />
              ))}
            </div>

            {/* Comment for team */}
            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${dark ? 'text-[#94a3b8]' : 'text-gray-400'}`}>
                Feedback <span className={`normal-case font-normal ${dark ? 'text-[#94a3b8]/70' : 'text-gray-400'}`}>(visible to team)</span>
              </label>
              <textarea
                rows={3} value={comment}
                onChange={e => setComment(e.target.value.slice(0, 500))}
                placeholder="Provide constructive feedback to help the team improve…"
                className={`w-full px-3 py-2.5 rounded-xl border text-sm resize-none outline-none transition-all ${dark ? 'bg-white/5 border-[#1e3a5f] text-white placeholder-[#94a3b8]/60 focus:border-[#00e5ff]/50' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#0066ff]/50'}`}
              />
              <p className={`text-right text-[10px] mt-1 ${dark ? 'text-[#94a3b8]/60' : 'text-gray-400'}`}>{comment.length}/500</p>
            </div>

            {/* Private note */}
            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${dark ? 'text-[#94a3b8]' : 'text-gray-400'}`}>
                Private Note <span className={`normal-case font-normal ${dark ? 'text-[#94a3b8]/70' : 'text-gray-400'}`}>(only you)</span>
              </label>
              <textarea
                rows={2} value={note} onChange={e => setNote(e.target.value)}
                placeholder="Internal notes for your reference…"
                className={`w-full px-3 py-2.5 rounded-xl border text-sm resize-none outline-none transition-all ${dark ? 'bg-white/5 border-[#1e3a5f] text-white placeholder-[#94a3b8]/60 focus:border-[#7c4dff]/50' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#7c4dff]/50'}`}
              />
            </div>

            {/* Submit */}
            <motion.button
              onClick={handleSubmit} disabled={submitting}
              whileHover={{ scale: submitting ? 1 : 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 rounded-xl font-heading font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #00e5ff, #0066ff)', color: '#04040f' }}
            >
              {submitting ? (
                <><Loader2 size={16} className="animate-spin" /> Submitting…</>
              ) : (
                <><CheckCircle size={16} /> Submit Review — {total}/50 pts</>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Submission Card ─────────────────────────────────────────────────────────
function SubCard({ sub, idx, onOpen, dark }) {
  const meta   = STATUS_META[sub.status] || STATUS_META['Pending']
  const Icon   = meta.icon
  const border = dark ? 'border-[#1e3a5f]' : 'border-gray-200'

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.07 }}
      whileHover={{ y: -3, boxShadow: `0 8px 30px ${meta.color}20` }}
      onClick={onOpen}
      className={`cursor-pointer rounded-2xl border p-4 transition-all group ${dark ? 'bg-[#080d1a] border-[#1e3a5f] hover:border-[#00e5ff]/40' : 'bg-white border-gray-200 hover:border-[#0066ff]/40 shadow-sm'}`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h4 className={`font-heading font-bold text-sm leading-snug flex-1 ${dark ? 'text-white' : 'text-gray-900'}`}>
          {sub.projectName}
        </h4>
        <ChevronRight size={14} className={`flex-shrink-0 mt-0.5 transition-transform group-hover:translate-x-1 ${dark ? 'text-[#00e5ff]' : 'text-[#0066ff]'}`} />
      </div>

      {/* Team name */}
      <div className="flex items-center gap-1.5 mb-3">
        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#00e5ff] to-[#7c4dff] flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0">
          {sub.teamName?.[0]}
        </div>
        <span className={`text-xs font-medium ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>{sub.teamName}</span>
      </div>

      {/* Event */}
      <p className={`text-[10px] mb-3 truncate ${dark ? 'text-[#94a3b8]/70' : 'text-gray-400'}`}>{sub.eventName}</p>

      {/* Tech stack */}
      <div className="flex flex-wrap gap-1 mb-3">
        {(sub.techStack || []).slice(0, 3).map(t => (
          <span key={t} className={`px-1.5 py-0.5 rounded text-[10px] font-code ${dark ? 'bg-white/5 border border-white/10 text-[#94a3b8]' : 'bg-gray-100 border border-gray-200 text-gray-500'}`}>{t}</span>
        ))}
        {(sub.techStack || []).length > 3 && (
          <span className={`text-[10px] ${dark ? 'text-[#94a3b8]/60' : 'text-gray-400'}`}>+{sub.techStack.length - 3}</span>
        )}
      </div>

      {/* Footer */}
      <div className={`flex items-center justify-between pt-3 border-t ${dark ? 'border-white/5' : 'border-gray-100'}`}>
        <span className={`flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${meta.bg} border ${meta.border}`} style={{ color: meta.color }}>
          <Icon size={10} /> {sub.status}
        </span>
        <span className={`text-[10px] ${dark ? 'text-[#94a3b8]/60' : 'text-gray-400'}`}>
          {new Date(sub.submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
        </span>
      </div>
    </motion.div>
  )
}

// ── Main Component ──────────────────────────────────────────────────────────
export default function ReviewQueue() {
  const user = useAuthStore(s => s.user)
  const { dark } = useTheme()
  const { queue, stats, loading, error, fetchQueue, openSubmission } = useReviewStore()
  const [selected, setSelected] = useState(null)

  const judgeId   = user?.uid   || 'j1'
  const judgeName = user?.name  || 'Judge'

  useEffect(() => { fetchQueue(judgeId) }, [judgeId])

  const handleOpen = async (sub) => {
    if (sub.status === 'Pending') await openSubmission(sub._id)
    setSelected(sub)
  }

  const pending   = queue.filter(s => s.status === 'Pending')
  const inReview  = queue.filter(s => s.status === 'In Review')
  const border    = dark ? 'border-[#1e3a5f]' : 'border-gray-200'
  const text      = dark ? 'text-white'        : 'text-gray-900'
  const sub_      = dark ? 'text-[#94a3b8]'    : 'text-gray-500'
  const cardBg    = dark ? 'bg-[#080d1a]'      : 'bg-white'

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6 h-full">
      {/* ── Header ── */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className={`font-heading font-bold text-2xl ${text}`}>Review Queue</h1>
            {pending.length > 0 && (
              <motion.span
                animate={{ scale: [1, 1.06, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                className="text-xs px-2.5 py-1 rounded-full bg-[#ffd600]/15 text-[#ffd600] border border-[#ffd600]/30 font-semibold">
                {pending.length} pending
              </motion.span>
            )}
          </div>
          <p className={`text-sm mt-1 ${sub_}`}>Click a card to open the full review panel</p>
        </div>
        <button onClick={() => fetchQueue(judgeId)} disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${dark ? 'border-[#1e3a5f] text-[#94a3b8] hover:border-[#00e5ff]/40 hover:text-[#00e5ff]' : 'border-gray-200 text-gray-500 hover:border-[#0066ff]/40 hover:text-[#0066ff]'}`}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* ── Stats bar ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'In Queue',       value: queue.length,     icon: FileText,   color: '#00e5ff' },
          { label: 'Pending',        value: pending.length,   icon: Clock,      color: '#ffd600' },
          { label: 'In Review',      value: inReview.length,  icon: AlertCircle,color: '#7c4dff' },
          { label: 'Reviews Done',   value: stats.done,       icon: CheckCircle,color: '#00e676' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`rounded-2xl border p-4 flex items-center gap-3 ${cardBg} ${border}`}>
            <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center"
              style={{ background: color + '15', border: `1px solid ${color}30` }}>
              <Icon size={16} style={{ color }} />
            </div>
            <div>
              <p className={`font-heading font-bold text-xl ${text}`}>{loading ? '…' : value}</p>
              <p className={`text-[10px] ${sub_}`}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Error banner ── */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-[#ff4081]/30 bg-[#ff4081]/10">
          <AlertCircle size={16} className="text-[#ff4081] flex-shrink-0" />
          <div>
            <p className="text-[#ff4081] text-sm font-semibold">Could not load review queue</p>
            <p className="text-[#ff4081]/70 text-xs">{error}</p>
          </div>
          <button onClick={() => fetchQueue(judgeId)} className="ml-auto text-xs text-[#ff4081] hover:underline">Retry</button>
        </div>
      )}

      {/* ── Loading skeleton ── */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`rounded-2xl border p-4 animate-pulse ${cardBg} ${border}`}>
              <div className={`h-5 rounded-lg w-3/4 mb-3 ${dark ? 'bg-white/5' : 'bg-gray-200'}`} />
              <div className={`h-3 rounded w-1/2 mb-2 ${dark ? 'bg-white/5' : 'bg-gray-200'}`} />
              <div className={`h-3 rounded w-2/3 mb-4 ${dark ? 'bg-white/5' : 'bg-gray-200'}`} />
              <div className="flex gap-1">
                {[1,2,3].map(j => <div key={j} className={`h-5 w-14 rounded ${dark ? 'bg-white/5' : 'bg-gray-200'}`} />)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && !error && queue.length === 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl border p-16 flex flex-col items-center gap-4 text-center ${cardBg} ${border}`}>
          <div className="w-16 h-16 rounded-2xl bg-[#00e676]/10 border border-[#00e676]/20 flex items-center justify-center">
            <CheckCircle size={28} className="text-[#00e676]" />
          </div>
          <div>
            <h3 className={`font-heading font-bold text-xl ${text}`}>All caught up!</h3>
            <p className={`text-sm mt-1 max-w-xs ${sub_}`}>
              You've reviewed all assigned submissions. Check back later for new assignments.
            </p>
          </div>
          {stats.done > 0 && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${dark ? 'border-[#00e676]/20 bg-[#00e676]/5' : 'border-green-200 bg-green-50'}`}>
              <Star size={14} className="text-[#00e676]" />
              <span className="text-sm text-[#00e676] font-medium">{stats.done} reviews completed · Avg {stats.avgScore}%</span>
            </div>
          )}
        </motion.div>
      )}

      {/* ── Kanban grid ── */}
      {!loading && queue.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending column */}
          <div>
            <div className={`flex items-center gap-2 mb-4 pb-3 border-b ${border}`}>
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffd600]" />
              <span className={`font-heading font-semibold text-sm ${text}`}>Pending Review</span>
              <span className={`ml-auto text-xs px-2.5 py-1 rounded-full font-medium bg-[#ffd600]/10 text-[#ffd600] border border-[#ffd600]/20`}>{pending.length}</span>
            </div>
            <div className="flex flex-col gap-3">
              {pending.length === 0 ? (
                <div className={`rounded-xl border-2 border-dashed p-6 text-center ${dark ? 'border-white/5' : 'border-gray-200'}`}>
                  <p className={`text-sm ${sub_}`}>No pending submissions</p>
                </div>
              ) : (
                pending.map((s, i) => (
                  <SubCard key={s._id} sub={s} idx={i} onOpen={() => handleOpen(s)} dark={dark} />
                ))
              )}
            </div>
          </div>

          {/* In Review column */}
          <div>
            <div className={`flex items-center gap-2 mb-4 pb-3 border-b ${border}`}>
              <div className="w-2.5 h-2.5 rounded-full bg-[#00e5ff]" />
              <span className={`font-heading font-semibold text-sm ${text}`}>In Review</span>
              <span className={`ml-auto text-xs px-2.5 py-1 rounded-full font-medium bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/20`}>{inReview.length}</span>
            </div>
            <div className="flex flex-col gap-3">
              {inReview.length === 0 ? (
                <div className={`rounded-xl border-2 border-dashed p-6 text-center ${dark ? 'border-white/5' : 'border-gray-200'}`}>
                  <p className={`text-sm ${sub_}`}>Open a pending card to start reviewing</p>
                </div>
              ) : (
                inReview.map((s, i) => (
                  <SubCard key={s._id} sub={s} idx={i} onOpen={() => handleOpen(s)} dark={dark} />
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Review modal ── */}
      <AnimatePresence>
        {selected && (
          <ReviewModal
            sub={selected}
            judgeId={judgeId}
            judgeName={judgeName}
            dark={dark}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
