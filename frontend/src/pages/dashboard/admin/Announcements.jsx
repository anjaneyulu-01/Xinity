import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Plus, Send, Trash2, Edit2, X, Pin, Clock, Users, Globe, Save } from 'lucide-react'
import { useTheme } from '../../../context/ThemeContext'
import toast from 'react-hot-toast'

const INIT_ANNOUNCEMENTS = [
  { id: 'a1', title: 'WebX Challenge 2026 — Submission Deadline Extended', body: 'Due to popular demand, we have extended the submission deadline by 24 hours. New deadline: April 2, 2026 at 11:59 PM IST. Make sure your projects are submitted on time!', target: 'All', pinned: true,  createdAt: '2026-03-30', type: 'info'    },
  { id: 'a2', title: 'Judging Begins Tomorrow',                             body: 'Judges will start reviewing all submissions from April 3. Results will be announced on April 7, 2026. Stay tuned!', target: 'Participants', pinned: false, createdAt: '2026-04-01', type: 'update'  },
  { id: 'a3', title: 'Platform Maintenance — April 5, 2:00–4:00 AM',      body: 'The platform will be offline for scheduled maintenance. Please plan your submissions accordingly and submit before the maintenance window.', target: 'All', pinned: false, createdAt: '2026-04-01', type: 'warning' },
  { id: 'a4', title: 'New Judge Onboarded: Prof. Amit Verma',               body: 'We welcome Prof. Amit Verma (IIT Bombay) as a judge for WebX Challenge 2026. His expertise in Web Architecture brings great value to our evaluation process.', target: 'Judges', pinned: false, createdAt: '2026-03-29', type: 'info' },
]

const TYPE_META = {
  info:    { color: '#00e5ff', bg: 'bg-[#00e5ff]/10', border: 'border-[#00e5ff]/20', label: 'Info'    },
  update:  { color: '#7c4dff', bg: 'bg-[#7c4dff]/10', border: 'border-[#7c4dff]/20', label: 'Update'  },
  warning: { color: '#ffd600', bg: 'bg-[#ffd600]/10', border: 'border-[#ffd600]/20', label: 'Warning' },
  urgent:  { color: '#ff4081', bg: 'bg-[#ff4081]/10', border: 'border-[#ff4081]/20', label: 'Urgent'  },
}

const TARGETS = ['All', 'Participants', 'Judges', 'Admins']
const TYPES   = Object.keys(TYPE_META)

function AnnouncementForm({ initial, onSave, onCancel, dark, border, text, sub }) {
  const [form, setForm] = useState(initial || { title: '', body: '', target: 'All', type: 'info', pinned: false })
  const inputCls = `w-full px-3 py-2 rounded-xl border text-sm outline-none transition-all ${dark ? 'bg-white/5 border-[#1e3a5f] text-white placeholder-[#94a3b8]' : 'bg-gray-50 border-gray-200 text-gray-900'}`
  const submit = () => {
    if (!form.title || !form.body) { toast.error('Title and body required'); return }
    onSave({ ...form, id: initial?.id || `a${Date.now()}`, createdAt: new Date().toISOString().split('T')[0] })
  }
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
      className={`glass-card border ${border} p-5 flex flex-col gap-4`}>
      <div className="flex items-center justify-between">
        <h3 className={`font-heading font-semibold ${text}`}>{initial ? 'Edit Announcement' : 'New Announcement'}</h3>
        <button onClick={onCancel} className={`${sub} hover:text-red-400`}><X size={16} /></button>
      </div>
      <div>
        <label className={`block text-xs font-medium mb-1.5 ${sub}`}>Title</label>
        <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          placeholder="Announcement title…" className={inputCls} />
      </div>
      <div>
        <label className={`block text-xs font-medium mb-1.5 ${sub}`}>Body</label>
        <textarea rows={4} value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
          placeholder="Full announcement text…" className={`${inputCls} resize-none`} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={`block text-xs font-medium mb-1.5 ${sub}`}>Target Audience</label>
          <select value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))}
            className={`${inputCls} appearance-none`}>
            {TARGETS.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className={`block text-xs font-medium mb-1.5 ${sub}`}>Type</label>
          <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
            className={`${inputCls} appearance-none`}>
            {TYPES.map(t => <option key={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </div>
      </div>
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input type="checkbox" checked={form.pinned} onChange={e => setForm(f => ({ ...f, pinned: e.target.checked }))} className="accent-[#00e5ff] w-4 h-4" />
        <span className={`text-sm ${text}`}>Pin this announcement to top</span>
      </label>
      <div className="flex gap-2">
        <button onClick={onCancel} className={`flex-1 py-2 rounded-full border text-sm ${dark ? 'border-[#1e3a5f] text-[#94a3b8]' : 'border-gray-200 text-gray-500'}`}>Cancel</button>
        <button onClick={submit} className="flex-1 btn-primary justify-center text-sm py-2">
          <Send size={14} /> {initial ? 'Update' : 'Publish'}
        </button>
      </div>
    </motion.div>
  )
}

export default function Announcements() {
  const { dark } = useTheme()
  const [items, setItems]   = useState(INIT_ANNOUNCEMENTS)
  const [showForm, setForm] = useState(false)
  const [editItem, setEdit] = useState(null)
  const border = dark ? 'border-[#1e3a5f]' : 'border-gray-200'
  const text   = dark ? 'text-white'        : 'text-gray-900'
  const sub    = dark ? 'text-[#94a3b8]'    : 'text-gray-500'

  const save = (item) => {
    if (editItem) {
      setItems(is => is.map(i => i.id === item.id ? item : i))
      toast.success('Announcement updated')
    } else {
      setItems(is => [item, ...is])
      toast.success('Announcement published!')
    }
    setForm(false); setEdit(null)
  }
  const remove = (id) => { setItems(is => is.filter(i => i.id !== id)); toast.success('Deleted') }
  const togglePin = (id) => setItems(is => is.map(i => i.id === id ? { ...i, pinned: !i.pinned } : i))

  const sorted = [...items].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className={`font-heading font-bold text-2xl ${text}`}>Announcements</h1>
          <p className={`text-sm mt-1 ${sub}`}>Broadcast messages to participants, judges, or everyone</p>
        </div>
        {!showForm && !editItem && (
          <button onClick={() => setForm(true)} className="btn-primary text-sm py-2 px-4">
            <Plus size={14} /> New Announcement
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total',   value: items.length,                          color: '#00e5ff' },
          { label: 'Pinned',  value: items.filter(i => i.pinned).length,    color: '#ffd600' },
          { label: 'For All', value: items.filter(i => i.target === 'All').length, color: '#7c4dff' },
          { label: 'Urgent',  value: items.filter(i => i.type === 'urgent').length, color: '#ff4081' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`glass-card border ${border} p-4`}>
            <p className="text-2xl font-heading font-bold" style={{ color }}>{value}</p>
            <p className={`text-xs mt-1 ${sub}`}>{label}</p>
          </div>
        ))}
      </div>

      {(showForm || editItem) && (
        <AnnouncementForm
          initial={editItem}
          onSave={save}
          onCancel={() => { setForm(false); setEdit(null) }}
          dark={dark} border={border} text={text} sub={sub}
        />
      )}

      {/* List */}
      <div className="flex flex-col gap-3">
        {sorted.map((item, i) => {
          const meta = TYPE_META[item.type]
          return (
            <motion.div key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`glass-card border ${border} p-5 ${item.pinned ? `border-l-2` : ''}`}
              style={item.pinned ? { borderLeftColor: meta.color } : {}}>
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {item.pinned && <Pin size={12} style={{ color: meta.color }} />}
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${meta.bg} ${meta.border}`} style={{ color: meta.color }}>{meta.label}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border flex items-center gap-1 ${dark ? 'border-white/10 text-[#94a3b8]' : 'border-gray-200 text-gray-500'}`}>
                      {item.target === 'All' ? <Globe size={10} /> : <Users size={10} />} {item.target}
                    </span>
                    <span className={`text-xs flex items-center gap-1 ${sub}`}><Clock size={10} /> {item.createdAt}</span>
                  </div>
                  <h3 className={`font-semibold text-sm mb-1 ${text}`}>{item.title}</h3>
                  <p className={`text-xs leading-relaxed ${sub}`}>{item.body}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => togglePin(item.id)} className={`p-1.5 rounded-lg transition-colors ${item.pinned ? 'text-[#ffd600]' : sub} hover:bg-white/5`} title="Toggle pin">
                    <Pin size={13} />
                  </button>
                  <button onClick={() => { setEdit(item); setForm(false) }} className={`${sub} hover:text-[#00e5ff] p-1.5 rounded-lg hover:bg-white/5 transition-colors`}>
                    <Edit2 size={13} />
                  </button>
                  <button onClick={() => remove(item.id)} className={`${sub} hover:text-[#ff4081] p-1.5 rounded-lg hover:bg-white/5 transition-colors`}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
