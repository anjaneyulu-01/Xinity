import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, GitBranch, ExternalLink, Star, CheckCircle2, Clock, AlertCircle, X, Upload, FileText, Loader2, ChevronDown } from 'lucide-react'
import { MOCK_SUBMISSIONS, MOCK_EVENTS } from '../../../store/eventStore'
import { uploadsApi } from '../../../api/uploads'
import { submissionsApi } from '../../../api/submissions'
import { eventsApi } from '../../../api/events'
import toast from 'react-hot-toast'

const STATUS_STYLE = {
  'Pending':       { color: '#94a3b8', bg: '#94a3b815', icon: Clock },
  'Under Review':  { color: '#ffd600', bg: '#ffd60015', icon: AlertCircle },
  'Scored':        { color: '#00e676', bg: '#00e67615', icon: CheckCircle2 },
  'Winner':        { color: '#00e5ff', bg: '#00e5ff15', icon: Star },
}

function SubmitModal({ onClose, onSuccess }) {
  const fileInputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState(null)
  const [fileUrl, setFileUrl] = useState('')
  const [events, setEvents] = useState([])
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState('')
  const [form, setForm] = useState({ project: '', desc: '', github: '', demo: '', tech: '' })
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventsApi.getAll()
        // Filter to show only upcoming/live events for submission
        const activeEvents = data.filter(e => e.status === 'upcoming' || e.status === 'live')
        if (activeEvents.length > 0) {
          setEvents(activeEvents)
        } else if (data.length > 0) {
          setEvents(data)
        } else {
          // Fallback to mock events if API returns empty
          setEvents(MOCK_EVENTS)
        }
      } catch (err) {
        // Fallback to mock events if API fails
        setEvents(MOCK_EVENTS)
      } finally {
        setLoadingEvents(false)
      }
    }
    fetchEvents()
  }, [])
  
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleFileSelect = async (selectedFile) => {
    const allowedTypes = ['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation']
    const allowedExtensions = ['.pdf', '.ppt', '.pptx']
    const ext = selectedFile.name.toLowerCase().substring(selectedFile.name.lastIndexOf('.'))
    
    if (!allowedTypes.includes(selectedFile.type) && !allowedExtensions.includes(ext)) {
      toast.error('Only PDF, PPT, and PPTX files are allowed')
      return
    }
    
    if (selectedFile.size > 25 * 1024 * 1024) {
      toast.error('File size must be less than 25MB')
      return
    }
    
    setFile(selectedFile)
    setUploading(true)
    
    try {
      const result = await uploadsApi.uploadFile(selectedFile)
      setFileUrl(result.url)
      toast.success('File uploaded successfully!')
    } catch (err) {
      toast.error(err.message || 'Failed to upload file')
      setFile(null)
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) handleFileSelect(droppedFile)
  }

  const handleBrowse = () => {
    fileInputRef.current?.click()
  }

  const handleFileInput = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) handleFileSelect(selectedFile)
  }

  const removeFile = () => {
    setFile(null)
    setFileUrl('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedEvent) {
      toast.error('Please select a hackathon')
      return
    }
    
    if (!form.project || !form.github) {
      toast.error('Project name and GitHub URL are required')
      return
    }
    
    setSubmitted(true)
    
    const selectedEventData = events.find(e => (e._id || e.id) === selectedEvent)
    
    try {
      await submissionsApi.create({
        projectName: form.project,
        description: form.desc,
        githubUrl: form.github,
        demoUrl: form.demo,
        techStack: form.tech.split(',').map(t => t.trim()).filter(Boolean),
        fileUrl: fileUrl,
        teamName: 'My Team', // TODO: Get from user context
        eventId: selectedEvent,
        eventName: selectedEventData?.name || selectedEventData?.title || 'Unknown Event'
      })
      
      setTimeout(() => {
        onClose()
        toast.success('Project submitted successfully!')
        onSuccess?.()
      }, 1200)
    } catch (err) {
      setSubmitted(false)
      toast.error(err.message || 'Failed to submit project')
    }
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
            {/* Hackathon Selector */}
            <div>
              <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">Select Hackathon *</label>
              {loadingEvents ? (
                <div className="input-field flex items-center justify-center">
                  <Loader2 size={16} className="animate-spin text-[#94a3b8]" />
                </div>
              ) : events.length === 0 ? (
                <div className="input-field text-[#94a3b8] text-sm">No active hackathons available</div>
              ) : (
                <div className="relative">
                  <select
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                    required
                    className="input-field w-full appearance-none cursor-pointer pr-10"
                  >
                    <option value="">Choose a hackathon...</option>
                    {events.map(event => (
                      <option key={event._id || event.id} value={event._id || event.id}>
                        {event.name || event.title}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none" />
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">Project Name *</label>
              <input name="project" value={form.project} onChange={handleChange} required placeholder="My Awesome Project" className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">Description</label>
              <textarea name="desc" value={form.desc} onChange={handleChange} placeholder="What does your project do?" rows={3} className="input-field resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">GitHub URL *</label>
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
            
            {/* File upload zone */}
            <div>
              <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">PPT/PDF Presentation</label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.ppt,.pptx"
                onChange={handleFileInput}
                className="hidden"
              />
              
              {file ? (
                <div className="border border-[#1e3a5f] rounded-xl p-4 bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#00e5ff]/10 flex items-center justify-center">
                      <FileText size={20} className="text-[#00e5ff]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{file.name}</p>
                      <p className="text-[#94a3b8] text-xs">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                        {uploading && ' • Uploading...'}
                        {fileUrl && ' • ✓ Uploaded'}
                      </p>
                    </div>
                    {uploading ? (
                      <Loader2 size={18} className="text-[#00e5ff] animate-spin" />
                    ) : (
                      <button
                        type="button"
                        onClick={removeFile}
                        className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#94a3b8] hover:text-[#ff4081] hover:bg-[#ff4081]/10"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  onDragOver={e => { e.preventDefault(); setDragging(true) }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={handleBrowse}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${dragging ? 'border-[#00e5ff] bg-[#00e5ff]/5' : 'border-[#1e3a5f] hover:border-[#00e5ff]/40'}`}
                >
                  <Upload size={24} className="text-[#94a3b8] mx-auto mb-2" />
                  <p className="text-[#94a3b8] text-sm">Drop PPT/PDF here or <span className="text-[#00e5ff]">browse</span></p>
                  <p className="text-[#94a3b8]/60 text-xs mt-1">Max 25MB • PDF, PPT, PPTX</p>
                </div>
              )}
            </div>
            
            <button 
              type="submit" 
              disabled={uploading}
              className="btn-primary w-full justify-center py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading file...' : 'Submit Project →'}
            </button>
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
