import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { Calendar, MapPin, Clock, ArrowRight, Flame } from 'lucide-react'

const TARGET_DATE = new Date('2025-04-04T09:00:00')

const EVENTS = [
  {
    id: 1, title: 'WebX Challenge — Round 1',
    date: 'Apr 2–3, 2025', type: 'Hackathon', location: 'Online',
    description: 'Build an impressive website for Xinity in 24 hours. Best design + code wins.',
    upcoming: true, prize: '₹10,000',
  },
  {
    id: 2, title: 'WebX Challenge — Round 2',
    date: 'Apr 4, 2025', type: 'Hackathon', location: 'Marwadi University',
    description: 'Present your project live to judges at the offline finale.',
    upcoming: true, prize: '₹10,000',
  },
  {
    id: 3, title: 'DSA Sprint Workshop',
    date: 'Feb 15, 2025', type: 'Workshop', location: 'MU Lab 3',
    description: 'Intensive DSA problem-solving session with industry mentors.',
    upcoming: false, prize: null,
  },
  {
    id: 4, title: 'Open Source Talk',
    date: 'Jan 20, 2025', type: 'Talk', location: 'Seminar Hall',
    description: 'Contributing to open source — from zero to merged PR.',
    upcoming: false, prize: null,
  },
]

const TYPE_STYLES = {
  Hackathon: {
    badge:  'bg-brand-50  dark:bg-brand-500/15  text-brand-600  dark:text-brand-400  border-brand-300  dark:border-brand-500/40',
    accent: 'border-brand-400 dark:border-brand-500',
    dot:    'bg-brand-500',
  },
  Workshop: {
    badge:  'bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-300 dark:border-purple-500/40',
    accent: 'border-purple-400 dark:border-purple-500',
    dot:    'bg-purple-500',
  },
  Talk: {
    badge:  'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/40',
    accent: 'border-emerald-400 dark:border-emerald-500',
    dot:    'bg-emerald-500',
  },
}

function CountdownBlock({ value, label }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex flex-col items-center bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-2xl px-5 py-4 min-w-[72px] shadow-sm"
    >
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0,   opacity: 1 }}
          exit={{   y:  16, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="text-3xl sm:text-4xl font-black text-brand-600 dark:text-brand-400 font-mono tabular-nums"
        >
          {value}
        </motion.span>
      </AnimatePresence>
      <span className="text-[10px] text-slate-400 dark:text-gray-500 tracking-widest mt-1 uppercase">{label}</span>
    </motion.div>
  )
}

function Countdown() {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 })
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    const tick = () => {
      const diff = TARGET_DATE - Date.now()
      if (diff <= 0) { setExpired(true); return }
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  if (expired) return (
    <p className="text-brand-600 dark:text-brand-400 font-bold font-mono">🎉 The event has started!</p>
  )

  const pad = (n) => String(n).padStart(2, '0')
  return (
    <div className="flex gap-3 justify-center flex-wrap">
      <CountdownBlock value={pad(t.d)} label="Days" />
      <CountdownBlock value={pad(t.h)} label="Hrs"  />
      <CountdownBlock value={pad(t.m)} label="Min"  />
      <CountdownBlock value={pad(t.s)} label="Sec"  />
    </div>
  )
}

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }
const fadeUp  = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

export default function Events() {
  const { ref, isInView } = useScrollReveal()
  const [filter, setFilter] = useState('All')

  const filters  = ['All', 'Hackathon', 'Workshop', 'Talk']
  const filtered = EVENTS.filter((e) => filter === 'All' || e.type === filter)

  return (
    <section id="events" className="section-b py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div ref={ref} variants={stagger} initial="hidden" animate={isInView ? 'show' : 'hidden'} className="text-center mb-12">
          <motion.p variants={fadeUp} className="text-brand-600 dark:text-brand-400 font-mono text-xs sm:text-sm tracking-widest mb-2 uppercase">
            Schedule
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-8">
            Upcoming <span className="gradient-text">Events</span>
          </motion.h2>

          {/* Countdown */}
          <motion.div variants={fadeUp} className="mb-10">
            <p className="text-slate-500 dark:text-gray-400 mb-5 flex items-center justify-center gap-2 text-sm font-mono">
              <Clock size={15} className="text-brand-500 dark:text-brand-400" />
              WebX Challenge Round 2 kicks off in
            </p>
            <Countdown />
          </motion.div>

          {/* Filter tabs */}
          <motion.div variants={fadeUp} className="flex gap-2 justify-center flex-wrap">
            {filters.map((f) => (
              <motion.button
                key={f}
                onClick={() => setFilter(f)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                  filter === f
                    ? 'bg-brand-500 text-white border-brand-500 shadow-md'
                    : 'border-slate-300 dark:border-gray-700 text-slate-600 dark:text-gray-400 hover:border-brand-400 hover:text-brand-600 dark:hover:border-brand-500 dark:hover:text-brand-400 bg-white dark:bg-gray-900'
                }`}
              >
                {f}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* Event cards grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((event) => {
              const style = TYPE_STYLES[event.type]
              return (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1,    y: 0  }}
                  exit={{    opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -4 }}
                  className={`card p-6 group border-l-4 ${event.upcoming ? style.accent : 'border-slate-200 dark:border-gray-700'}`}
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-4 gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${style.badge}`}>
                      {event.type}
                    </span>
                    {event.upcoming ? (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full">
                        <span className={`w-1.5 h-1.5 rounded-full ${style.dot} animate-pulse`} />
                        Upcoming
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 dark:text-gray-600 bg-slate-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">Past</span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-slate-500 dark:text-gray-400 text-sm mb-5 leading-relaxed">{event.description}</p>

                  {/* Footer */}
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-brand-500 dark:text-brand-400" />
                        {event.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin size={13} className="text-brand-500 dark:text-brand-400" />
                        {event.location}
                      </span>
                    </div>
                    {event.prize && (
                      <span className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-full">
                        <Flame size={12} />
                        {event.prize}
                      </span>
                    )}
                  </div>

                  {/* Learn more link */}
                  {event.upcoming && (
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-gray-800">
                      <a
                        href="#challenges"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:gap-2.5 transition-all duration-200"
                      >
                        Register now <ArrowRight size={15} />
                      </a>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-slate-400 dark:text-gray-500 py-16">
            No events in this category yet.
          </motion.p>
        )}
      </div>
    </section>
  )
}
