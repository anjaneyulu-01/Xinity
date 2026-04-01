import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Users, Flame, ArrowRight, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import CountdownTimer from '../ui/CountdownTimer'
import { useEventStore, MOCK_EVENTS } from '../../store/eventStore'
import { useAuthStore } from '../../store/authStore'
import { useTheme } from '../../context/ThemeContext'
import EventRegistrationModal from '../EventRegistrationModal'
import toast from 'react-hot-toast'

const TYPE_COLOR = {
  Hackathon: 'text-[#00e5ff] border-[#00e5ff]/30 bg-[#00e5ff]/10',
  Workshop:  'text-[#7c4dff] border-[#7c4dff]/30 bg-[#7c4dff]/10',
  Talk:      'text-[#00e676] border-[#00e676]/30 bg-[#00e676]/10',
}

function EventCard({ event, large, dark, onRegister, isRegistered }) {
  const pct = event.maxTeams ? Math.round((event.registered / event.maxTeams) * 100) : null

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className={`glass-card p-6 flex flex-col gap-4 relative overflow-hidden transition-all duration-300 ${
        dark 
          ? 'border border-white/5 hover:border-[#00e5ff]/30 hover:shadow-[0_0_30px_rgba(0,229,255,0.1)]' 
          : 'border border-gray-200/60 hover:border-[#0066ff]/30 hover:shadow-lg'
      } ${large ? 'md:col-span-2 md:row-span-2' : ''}`}
    >
      {/* Gradient top bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${event.gradient}`} />

      {/* Badges row */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className={`px-3 py-1 rounded-full text-xs font-bold border font-code ${TYPE_COLOR[event.type] || TYPE_COLOR.Hackathon}`}>
          {event.type}
        </span>
        {event.featured && (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#ffd600]/10 text-[#ffd600] border border-[#ffd600]/30 animate-pulse">
            ★ FEATURED
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className={`font-heading font-bold ${dark ? 'text-white' : 'text-gray-900'} ${large ? 'text-2xl' : 'text-lg'}`}>{event.name}</h3>
      <p className={`text-sm leading-relaxed ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>{event.description}</p>

      {/* Meta */}
      <div className={`flex flex-wrap gap-3 text-xs ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>
        <span className="flex items-center gap-1.5"><Calendar size={12} className={dark ? 'text-[#00e5ff]' : 'text-[#0066ff]'} />{new Date(event.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
        <span className="flex items-center gap-1.5"><MapPin size={12} className={dark ? 'text-[#00e5ff]' : 'text-[#0066ff]'} />{event.venue}</span>
        {event.registered != null && <span className="flex items-center gap-1.5"><Users size={12} className={dark ? 'text-[#00e5ff]' : 'text-[#0066ff]'} />{event.registered} registered</span>}
        {event.prize && <span className="flex items-center gap-1 text-[#ffd600] font-bold"><Flame size={12} />{event.prize}</span>}
      </div>

      {/* Countdown */}
      <CountdownTimer targetDate={event.date} />

      {/* Progress bar */}
      {pct !== null && (
        <div>
          <div className={`flex justify-between text-xs mb-1 ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>
            <span>Spots filling up</span>
            <span className={`font-bold ${dark ? 'text-[#00e5ff]' : 'text-[#0066ff]'}`}>{pct}% registered</span>
          </div>
          <div className={`h-1.5 rounded-full overflow-hidden ${dark ? 'bg-white/10' : 'bg-gray-200'}`}>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${pct}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              viewport={{ once: true }}
              className="h-full rounded-full bg-gradient-to-r from-[#00e5ff] to-[#0066ff]"
            />
          </div>
        </div>
      )}

      {/* CTA */}
      {isRegistered ? (
        <button
          disabled
          className={`text-sm py-2.5 mt-auto self-start px-5 rounded-xl font-medium flex items-center gap-2 ${
            dark 
              ? 'bg-[#00e676]/20 text-[#00e676] border border-[#00e676]/30' 
              : 'bg-green-100 text-green-700 border border-green-300'
          }`}
        >
          <CheckCircle size={14} /> Registered
        </button>
      ) : (
        <button 
          onClick={() => onRegister(event)}
          className="btn-primary text-sm py-2.5 mt-auto self-start"
        >
          Register Now <ArrowRight size={14} />
        </button>
      )}
    </motion.div>
  )
}

export default function EventsSection() {
  const { dark } = useTheme()
  const navigate = useNavigate()
  const user = useAuthStore(s => s.user)
  const { isRegistered } = useEventStore()
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  
  const handleRegister = (event) => {
    if (!user) {
      toast('Please login to register for events', { icon: '🔐' })
      navigate('/login', { state: { returnTo: '/', eventId: event.id } })
      return
    }
    setSelectedEvent(event)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedEvent(null)
  }
  
  return (
    <>
      <section id="events" className={`section-pad transition-colors duration-300 ${dark ? 'bg-[#080818]' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p className={`font-code text-sm tracking-widest uppercase mb-3 ${dark ? 'text-[#00e5ff]' : 'text-[#0066ff]'}`}>Schedule</p>
            <h2 className={`font-heading font-bold text-4xl sm:text-5xl mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
              Upcoming <span className="gradient-cyan">Challenges</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#00e5ff] to-[#0066ff] mx-auto rounded-full" />
          </motion.div>

          {/* Event grid */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {MOCK_EVENTS.map((event, i) => (
              <motion.div
                key={event.id}
                variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
              >
                <EventCard 
                  event={event} 
                  large={event.featured} 
                  dark={dark} 
                  onRegister={handleRegister}
                  isRegistered={user ? isRegistered(event.id, user.uid) : false}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Registration Modal */}
      <EventRegistrationModal 
        event={selectedEvent} 
        isOpen={modalOpen} 
        onClose={closeModal}
      />
    </>
  )
}
