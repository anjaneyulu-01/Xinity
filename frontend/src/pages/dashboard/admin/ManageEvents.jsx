import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, Eye, X, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react'
import { MOCK_EVENTS } from '../../../store/eventStore'
import { eventsApi } from '../../../api/events'
import toast from 'react-hot-toast'

const STATUS_ORDER = ['Draft', 'Published', 'Live', 'Closed', 'Results']
const STATUS_COLOR = {
  Draft:     { color: '#94a3b8', bg: '#94a3b815' },
  Published: { color: '#0066ff', bg: '#0066ff15' },
  Live:      { color: '#00e676', bg: '#00e67615' },
  Closed:    { color: '#ffd600', bg: '#ffd60015' },
  Results:   { color: '#7c4dff', bg: '#7c4dff15' },
}

const EVENTS_WITH_STATUS = MOCK_EVENTS.map((e, i) => ({ ...e, adminStatus: ['Live', 'Published', 'Upcoming', 'Draft'][i % 4] || 'Draft', submissions: [18, 22, 80, 120][i] || 0 }))

function CreateEventModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ name: '', type: 'Hackathon', date: '', venue: '', prize: '', maxTeams: '', description: '' })
  const [creating, setCreating] = useState(false)
  
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      const eventData = {
        name: form.name,
        type: form.type,
        startDate: form.date,
        venue: form.venue,
        prize: form.prize,
        maxTeams: parseInt(form.maxTeams) || 50,
        description: form.description,
        status: 'Draft'
      }
      const newEvent = await eventsApi.create(eventData)
      toast.success('Event created successfully!')
      onCreated?.(newEvent)
      onClose()
    } catch (err) {
      // Create locally for demo
      const newEvent = {
        id: `e${Date.now()}`,
        ...form,
        date: form.date,
        registered: 0,
        submissions: 0,
        adminStatus: 'Draft'
      }
      toast.success('Event created successfully!')
      onCreated?.(newEvent)
      onClose()
    } finally {
      setCreating(false)
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
        className="glass-card border border-[#1e3a5f] p-6 w-full max-w-xl max-h-[85vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading font-bold text-xl text-white">Create Event</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#94a3b8] hover:text-white"><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">Event Name</label>
            <input name="name" value={form.name} onChange={handleChange} required placeholder="WebX Challenge 2027" className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">Type</label>
              <select name="type" value={form.type} onChange={handleChange} className="input-field appearance-none">
                {['Hackathon', 'Workshop', 'Talk', 'Contest'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">Venue</label>
              <input name="venue" value={form.venue} onChange={handleChange} placeholder="MU Auditorium" className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">Start Date</label>
              <input name="date" type="datetime-local" value={form.date} onChange={handleChange} required className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">Prize Pool</label>
              <input name="prize" value={form.prize} onChange={handleChange} placeholder="₹10,000" className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">Max Teams</label>
            <input name="maxTeams" type="number" value={form.maxTeams} onChange={handleChange} placeholder="50" className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="input-field resize-none" placeholder="Describe the event..." />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1 justify-center py-2.5">Cancel</button>
            <button type="submit" disabled={creating} className="btn-primary flex-1 justify-center py-2.5 disabled:opacity-50">
              {creating ? <><Loader2 size={14} className="animate-spin" /> Creating...</> : 'Create Event'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default function ManageEvents() {
  const [showCreate, setShowCreate] = useState(false)
  const [events, setEvents] = useState(EVENTS_WITH_STATUS)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [deleting, setDeleting] = useState(null)

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventsApi.getAll()
        if (data && data.length > 0) {
          setEvents(data.map((e, i) => ({ 
            ...e, 
            adminStatus: e.status || ['Live', 'Published', 'Upcoming', 'Draft'][i % 4] || 'Draft',
            submissions: e.submissions || 0
          })))
        }
      } catch (err) {
        console.log('Using mock events:', err.message)
      }
    }
    fetchEvents()
  }, [])

  const handleEventCreated = (newEvent) => {
    setEvents(prev => [...prev, { ...newEvent, adminStatus: 'Draft', submissions: 0 }])
  }

  const cycleStatus = async (id) => {
    const event = events.find(e => e.id === id || e._id === id)
    if (!event) return
    
    const idx = STATUS_ORDER.indexOf(event.adminStatus)
    const newStatus = STATUS_ORDER[(idx + 1) % STATUS_ORDER.length]
    
    try {
      await eventsApi.updateStatus(id, newStatus)
    } catch (err) {
      // Continue anyway for demo
    }
    
    setEvents(evs => evs.map(e => {
      if (e.id !== id && e._id !== id) return e
      return { ...e, adminStatus: newStatus }
    }))
  }

  const handleViewEvent = (event) => {
    setSelectedEvent(event)
    toast.success(`Viewing ${event.name}`)
  }

  const handleEditEvent = (event) => {
    // In production, open edit modal
    toast.success('Opening edit mode...')
    setSelectedEvent(event)
  }

  const handleDeleteEvent = async (event) => {
    const id = event.id || event._id
    setDeleting(id)
    try {
      await eventsApi.delete(id)
      setEvents(evs => evs.filter(e => e.id !== id && e._id !== id))
      toast.error('Event deleted')
    } catch (err) {
      // Delete locally for demo
      setEvents(evs => evs.filter(e => e.id !== id && e._id !== id))
      toast.error('Event deleted')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-white">Manage Events</h1>
          <p className="text-[#94a3b8] text-sm mt-1">{events.length} events total</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary text-sm py-2.5 px-5">
          <Plus size={16} /> Create Event
        </button>
      </div>

      {/* Events table */}
      <div className="glass-card border border-[#1e3a5f] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e3a5f]">
                {['Event Name', 'Type', 'Date', 'Registered', 'Submissions', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#94a3b8] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.map((ev, i) => {
                const ss = STATUS_COLOR[ev.adminStatus] || STATUS_COLOR.Draft
                return (
                  <motion.tr
                    key={ev.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.06 }}
                    className="border-b border-[#1e3a5f]/50 hover:bg-white/2 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold text-white text-sm">{ev.name}</p>
                        <p className="text-[#94a3b8] text-xs">{ev.venue}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-code text-[#94a3b8] bg-white/5 border border-white/10 px-2 py-0.5 rounded">{ev.type}</span>
                    </td>
                    <td className="px-4 py-3 text-[#94a3b8] text-xs whitespace-nowrap">
                      {new Date(ev.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 text-white text-sm font-medium">{ev.registered || 0}</td>
                    <td className="px-4 py-3 text-white text-sm font-medium">{ev.submissions}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => cycleStatus(ev.id || ev._id)}
                        className="px-3 py-1 rounded-full text-xs font-bold border cursor-pointer hover:opacity-80 transition-opacity"
                        style={{ color: ss.color, background: ss.bg, borderColor: ss.color + '40' }}
                        title="Click to advance status"
                      >
                        {ev.adminStatus}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => handleViewEvent(ev)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#94a3b8] hover:text-[#00e5ff] hover:bg-[#00e5ff]/10 transition-all"><Eye size={13} /></button>
                        <button onClick={() => handleEditEvent(ev)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#94a3b8] hover:text-[#ffd600] hover:bg-[#ffd600]/10 transition-all"><Edit2 size={13} /></button>
                        <button 
                          onClick={() => handleDeleteEvent(ev)} 
                          disabled={deleting === (ev.id || ev._id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-[#94a3b8] hover:text-[#ff4081] hover:bg-[#ff4081]/10 transition-all disabled:opacity-50"
                        >
                          {deleting === (ev.id || ev._id) ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showCreate && <CreateEventModal onClose={() => setShowCreate(false)} onCreated={handleEventCreated} />}
      </AnimatePresence>
    </div>
  )
}
