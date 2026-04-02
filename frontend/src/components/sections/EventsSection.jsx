import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, ArrowRight, CheckCircle, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEventStore, MOCK_EVENTS } from '../../store/eventStore'
import { useAuthStore } from '../../store/authStore'
import { useTheme } from '../../context/ThemeContext'
import EventRegistrationModal from '../EventRegistrationModal'
import toast from 'react-hot-toast'

// Hackathon poster images
const HACKATHON_POSTERS = [
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80',
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&q=80',
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=80',
]

// Extended hackathon data
const HACKATHONS = MOCK_EVENTS.map((event, i) => ({
  ...event,
  poster: event.poster || HACKATHON_POSTERS[i % HACKATHON_POSTERS.length],
  endDate: event.endDate || event.date,
  participants: event.registered || Math.floor(Math.random() * 2000) + 100,
  status: new Date(event.date) > new Date() ? 'OPEN' : 'CLOSED',
}))

function HackathonSlide({ hackathon, dark, onRegister, isRegistered }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  return (
    <div className="w-full flex-shrink-0 px-4 sm:px-8 lg:px-16">
      <div
        className={`flex flex-col lg:flex-row gap-6 lg:gap-10 items-stretch ${dark ? '' : ''}`}
      >
        {/* LEFT: Poster Image */}
        <div className="lg:w-1/2 flex-shrink-0">
          <div className="relative aspect-[4/3] lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl group">
            <img 
              src={hackathon.poster} 
              alt={hackathon.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Decorative overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#00e5ff]/10 via-transparent to-[#7c4dff]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </div>

        {/* RIGHT: Event Details */}
        <div className={`lg:w-1/2 flex flex-col justify-center py-4 lg:py-8`}>
          {/* Title */}
          <h3 className={`font-heading font-bold text-2xl sm:text-3xl lg:text-4xl mb-4 leading-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
            {hackathon.name}
          </h3>
          
          {/* Description */}
          <p className={`text-base lg:text-lg mb-6 leading-relaxed ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>
            {hackathon.description} 🚀...
          </p>

          {/* Meta Info - Icon List Style */}
          <div className="flex flex-col gap-3 mb-8">
            {/* Date */}
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dark ? 'bg-[#00e5ff]/10' : 'bg-[#0066ff]/10'}`}>
                <Calendar size={20} className={dark ? 'text-[#00e5ff]' : 'text-[#0066ff]'} />
              </div>
              <span className={`font-medium ${dark ? 'text-white' : 'text-gray-800'}`}>
                {formatDate(hackathon.date)} - {formatDate(hackathon.endDate)}
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dark ? 'bg-[#00e5ff]/10' : 'bg-[#0066ff]/10'}`}>
                <MapPin size={20} className={dark ? 'text-[#00e5ff]' : 'text-[#0066ff]'} />
              </div>
              <span className={`font-medium ${dark ? 'text-white' : 'text-gray-800'}`}>
                {hackathon.venue}
              </span>
            </div>

            {/* Status */}
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                hackathon.status === 'OPEN' 
                  ? 'bg-[#00e676]/10' 
                  : 'bg-red-500/10'
              }`}>
                <Sparkles size={20} className={hackathon.status === 'OPEN' ? 'text-[#00e676]' : 'text-red-500'} />
              </div>
              <span className={`font-bold ${hackathon.status === 'OPEN' ? 'text-[#00e676]' : 'text-red-500'}`}>
                {hackathon.status}
              </span>
            </div>

            {/* Participants */}
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dark ? 'bg-[#00e5ff]/10' : 'bg-[#0066ff]/10'}`}>
                <CheckCircle size={20} className={dark ? 'text-[#00e5ff]' : 'text-[#0066ff]'} />
              </div>
              <span className={`font-medium ${dark ? 'text-white' : 'text-gray-800'}`}>
                {hackathon.participants} Participants
              </span>
            </div>
          </div>

          {/* CTA Button */}
          {isRegistered ? (
            <button
              disabled
              className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 ${
                dark 
                  ? 'bg-[#00e676]/20 text-[#00e676] border border-[#00e676]/30' 
                  : 'bg-green-100 text-green-700 border border-green-300'
              }`}
            >
              <CheckCircle size={18} /> Registered
            </button>
          ) : hackathon.status === 'OPEN' ? (
            <button 
              onClick={() => onRegister(hackathon)}
              className="group w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 bg-[#ffd600] text-[#04040f] hover:bg-[#ffeb3b] hover:shadow-[0_0_30px_rgba(255,214,0,0.4)] transition-all duration-300"
            >
              Apply Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <button 
              disabled 
              className="w-full py-4 rounded-xl font-bold text-base bg-gray-500/50 text-gray-400 cursor-not-allowed"
            >
              Registration Closed
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function EventsSection() {
  const { dark } = useTheme()
  const navigate = useNavigate()
  const user = useAuthStore(s => s.user)
  const { isRegistered } = useEventStore()
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(true)
  
  // Create infinite loop slides: [...original, first_clone]
  const infiniteSlides = [...HACKATHONS, HACKATHONS[0]]
  
  // Auto-slide every 2 seconds (always running)
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setCurrentIndex(prev => prev + 1)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // Handle infinite loop reset
  useEffect(() => {
    if (currentIndex === HACKATHONS.length) {
      // We're at the cloned slide, reset to 0 without animation
      const timeout = setTimeout(() => {
        setIsTransitioning(false)
        setCurrentIndex(0)
      }, 500) // Wait for transition to complete
      return () => clearTimeout(timeout)
    }
  }, [currentIndex])

  const goToSlide = useCallback((index) => {
    setIsTransitioning(true)
    setCurrentIndex(index)
  }, [])
  
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
      <section 
        id="events" 
        className={`relative py-16 sm:py-24 overflow-hidden transition-colors duration-300 ${dark ? 'bg-[#04040f]' : 'bg-white'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12">
            <p className={`font-code text-sm tracking-widest uppercase mb-3 ${dark ? 'text-[#00e5ff]' : 'text-[#0066ff]'}`}>
              Live Events
            </p>
            <h2 className={`font-heading font-bold text-4xl sm:text-5xl lg:text-6xl mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
              Upcoming <span className="gradient-cyan">Hackathons</span>
            </h2>
            <p className={`text-base sm:text-lg max-w-2xl mx-auto ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>
              Join India's most exciting hackathons. Build, learn, and compete with developers nationwide.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-[#00e5ff] to-[#7c4dff] mx-auto mt-6 rounded-full" />
          </div>

          {/* Slider Container */}
          <div className="relative overflow-hidden">
            <motion.div 
              className="flex"
              animate={{ x: `-${currentIndex * 100}%` }}
              transition={isTransitioning ? { type: 'tween', duration: 0.5, ease: 'easeInOut' } : { duration: 0 }}
            >
              {infiniteSlides.map((hackathon, idx) => (
                <HackathonSlide
                  key={`${hackathon.id}-${idx}`}
                  hackathon={hackathon}
                  dark={dark}
                  onRegister={handleRegister}
                  isRegistered={user ? isRegistered(hackathon.id, user.uid) : false}
                />
              ))}
            </motion.div>
          </div>

          {/* Dot Indicators - Centered below content */}
          <div className="flex items-center justify-center gap-2 mt-10">
            {HACKATHONS.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex || (currentIndex === HACKATHONS.length && index === 0)
                    ? `w-8 h-3 ${dark ? 'bg-[#1a1a2e]' : 'bg-gray-800'}`
                    : `w-3 h-3 ${dark ? 'bg-white/20 hover:bg-white/40' : 'bg-gray-300 hover:bg-gray-400'}`
                }`}
              />
            ))}
          </div>
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
