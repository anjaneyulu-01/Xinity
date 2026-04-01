import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, GitBranch, ExternalLink, Star, CheckCircle2, Clock, AlertCircle, X, Upload } from 'lucide-react'
import { MOCK_SUBMISSIONS } from '../../../store/eventStore'
import toast from 'react-hot-toast'

const STATUS_STYLE = {
  'Pending':       { color: '#94a3b8', bg: '#94a3b815', icon: Clock },
  'Under Review':  { color: '#ffd600', bg: '#ffd60015', icon: AlertCircle },
  'Scored':        { color: '#00e676', bg: '#00e67615', icon: CheckCircle2 },
  'Winner':        { color: '#00e5ff', bg: '#00e5ff15', icon: Star },
}

function SubmitModal({ onClose }) {
  const [dragging, setDragging] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ project: '', desc: '', github: '', demo: '', tech: '' })
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => { onClose(); toast.success('Project submitted successfully!') }, 1200)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-card border border-[#1e3a5f] p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading font-bold text-white text-xl">New Submission</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#94a3b8] hover:text-white"><X size={16} /></button>
        </div>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-[#00e676]/10 border-2 border-[#00e676] flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={28} className="text-[#00e676]" />
            </div>
            <p className="text-white font-bold">Submitting...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">Project Name</label>
              <input name="project" value={form.project} onChange={handleChange} required placeholder="My Awesome Project" className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">Description</label>
              <textarea name="desc" value={form.desc} onChange={handleChange} required placeholder="What does your project do?" rows={3} className="input-field resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">GitHub URL</label>
                <input name="github" value={form.github} onChange={handleChange} required placeholder="github.com/..." className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">Demo URL</label>
                <input name="demo" value={form.demo} onChange={handleChange} placeholder="vercel.app/..." className="input-field" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">Tech Stack (comma-separated)</label>
              <input name="tech" value={form.tech} onChange={handleChange} placeholder="React, Node.js, MongoDB" className="input-field" />
            </div>
            {/* Drag drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); toast.success('File attached!') }}
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${dragging ? 'border-[#00e5ff] bg-[#00e5ff]/5' : 'border-[#1e3a5f] hover:border-[#00e5ff]/40'}`}
            >
              <Upload size={24} className="text-[#94a3b8] mx-auto mb-2" />
              <p className="text-[#94a3b8] text-sm">Drop PPT/PDF here or <span className="text-[#00e5ff]">browse</span></p>
            </div>
            <button type="submit" className="btn-primary w-full justify-center py-3">Submit Project →</button>
          </form>
        )}
      </motion.div>
    </motion.div>
  )
}

export default function Submissions() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-white">Submissions</h1>
          <p className="text-[#94a3b8] text-sm mt-1">All your project submissions</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary text-sm py-2.5 px-5">
          <Plus size={16} /> New Submission
        </button>
      </div>

      {/* Submissions timeline */}
      <div className="flex flex-col gap-4">
        {MOCK_SUBMISSIONS.map((sub, i) => {
          const ss = STATUS_STYLE[sub.status] || STATUS_STYLE['Pending']
          const StatusIcon = ss.icon
          return (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 border border-white/5 hover:border-[#00e5ff]/20 transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                <div>
                  <h3 className="font-heading font-bold text-white text-lg">{sub.projectName}</h3>
                  <p className="text-[#94a3b8] text-sm">{sub.eventName} · {sub.teamName}</p>
                </div>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{ color: ss.color, background: ss.bg }}>
                  <StatusIcon size={12} /> {sub.status}
                </span>
              </div>

              {/* Tech tags */}
              <div className="flex gap-2 flex-wrap mb-4">
                {sub.techStack.map(t => (
                  <span key={t} className="px-2 py-0.5 rounded-md text-xs font-code bg-white/5 border border-white/10 text-[#94a3b8]">{t}</span>
                ))}
              </div>

              {/* Score/Feedback */}
              {sub.score && (
                <div className="p-3 rounded-xl bg-white/3 border border-[#00e676]/20 mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} className={i < Math.floor(sub.score/20) ? 'text-[#ffd600] fill-[#ffd600]' : 'text-[#1e3a5f]'} />
                    ))}</div>
                    <span className="text-[#00e676] font-bold text-sm">{sub.score}/100</span>
                  </div>
                  <p className="text-[#94a3b8] text-xs">{sub.feedback}</p>
                </div>
              )}

              <div className="flex gap-3">
                <a href={sub.githubUrl} className="btn-ghost text-xs py-2 px-4 flex items-center gap-1.5">
                  <GitBranch size={12} /> GitHub
                </a>
                {sub.demoUrl && (
                  <a href={sub.demoUrl} className="btn-ghost text-xs py-2 px-4 flex items-center gap-1.5">
                    <ExternalLink size={12} /> Demo
                  </a>
                )}
                <span className="ml-auto text-xs text-[#94a3b8] self-center">
                  {new Date(sub.submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>

      <AnimatePresence>
        {showModal && <SubmitModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </div>
  )
}
