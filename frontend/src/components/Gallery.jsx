import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react'

const PHOTOS = [
  { id: 1, event: 'HackMU 2024',      date: 'Oct 2024', from: 'from-brand-500',   to: 'to-blue-600',    h: 'h-52' },
  { id: 2, event: 'DSA Sprint',       date: 'Feb 2025', from: 'from-purple-500',  to: 'to-pink-600',    h: 'h-36' },
  { id: 3, event: 'Open Source Talk', date: 'Jan 2025', from: 'from-emerald-500', to: 'to-teal-600',    h: 'h-44' },
  { id: 4, event: 'InnoFest 2023',    date: 'Nov 2023', from: 'from-orange-500',  to: 'to-red-600',     h: 'h-40' },
  { id: 5, event: 'WebX Round 1',     date: 'Apr 2025', from: 'from-brand-400',   to: 'to-violet-600',  h: 'h-56' },
  { id: 6, event: 'UI/UX Sprint',     date: 'Mar 2024', from: 'from-yellow-400',  to: 'to-orange-500',  h: 'h-36' },
  { id: 7, event: 'Code Night',       date: 'Dec 2023', from: 'from-sky-500',     to: 'to-brand-600',   h: 'h-44' },
  { id: 8, event: 'Team Meetup',      date: 'Sep 2023', from: 'from-rose-500',    to: 'to-pink-600',    h: 'h-48' },
]

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
const scaleIn = { hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1, transition: { duration: 0.4 } } }

export default function Gallery() {
  const { ref, isInView } = useScrollReveal()
  const [selected, setSelected] = useState(null)

  const navigate = (dir) => {
    const idx = PHOTOS.findIndex((p) => p.id === selected.id)
    const next = PHOTOS[(idx + dir + PHOTOS.length) % PHOTOS.length]
    setSelected(next)
  }

  return (
    <section id="gallery" className="section-b py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="text-center mb-12"
        >
          <p className="text-brand-600 dark:text-brand-400 font-mono text-xs sm:text-sm tracking-widest mb-2 uppercase">Memories</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
            Event <span className="gradient-text">Gallery</span>
          </h2>
          <p className="text-slate-500 dark:text-gray-400">Moments that define our community. Click to enlarge.</p>
        </motion.div>

        {/* Masonry grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4"
        >
          {PHOTOS.map((photo) => (
            <motion.div
              key={photo.id}
              variants={scaleIn}
              whileHover={{ scale: 1.02 }}
              className={`break-inside-avoid relative group cursor-pointer rounded-2xl overflow-hidden ${photo.h} shadow-sm hover:shadow-xl transition-shadow duration-300`}
              onClick={() => setSelected(photo)}
            >
              <div className={`w-full h-full bg-gradient-to-br ${photo.from} ${photo.to}`} />
              {/* Overlay */}
              <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/55 transition-all duration-300 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                >
                  <ZoomIn size={20} className="text-white" />
                </motion.div>
                <p className="text-white font-bold text-sm text-center px-2">{photo.event}</p>
                <p className="text-white/70 text-xs">{photo.date}</p>
              </div>

              {/* Always-visible label at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-slate-900/60 to-transparent">
                <p className="text-white text-xs font-semibold">{photo.event}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/90 dark:bg-gray-950/92 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1,    y: 0  }}
              exit={{   scale: 0.85,  y: 20 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="relative max-w-2xl w-full rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`w-full h-64 sm:h-80 bg-gradient-to-br ${selected.from} ${selected.to}`} />
              <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 p-5">
                <p className="font-black text-slate-900 dark:text-white text-lg">{selected.event}</p>
                <p className="text-slate-500 dark:text-gray-400 text-sm">{selected.date}</p>
              </div>

              {/* Close */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-slate-900/50 hover:bg-brand-500 text-white flex items-center justify-center transition-colors"
              >
                <X size={17} />
              </motion.button>

              {/* Prev / Next */}
              {[[-1, ChevronLeft, 'left-3'], [1, ChevronRight, 'right-3']].map(([dir, Icon, pos]) => (
                <motion.button
                  key={dir}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); navigate(dir) }}
                  className={`absolute top-1/2 -translate-y-1/2 ${pos} w-9 h-9 rounded-full bg-slate-900/50 hover:bg-brand-500 text-white flex items-center justify-center transition-colors`}
                >
                  <Icon size={18} />
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
