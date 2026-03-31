import { useCallback, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Particles from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import { ChevronDown, Zap, Code2, Cpu } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const WORDS = ['Innovators', 'Challengers', 'Builders', 'Hackers', 'Creators']

function TypewriterWord() {
  const [index, setIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = WORDS[index % WORDS.length]
    let timeout

    if (!deleting && displayed === word) {
      timeout = setTimeout(() => setDeleting(true), 1800)
    } else if (deleting && displayed === '') {
      setDeleting(false)
      setIndex((i) => i + 1)
    } else {
      timeout = setTimeout(() => {
        setDisplayed(deleting ? word.slice(0, displayed.length - 1) : word.slice(0, displayed.length + 1))
      }, deleting ? 60 : 100)
    }
    return () => clearTimeout(timeout)
  }, [displayed, deleting, index])

  return (
    <span className="inline-block min-w-[180px] text-brand-500 dark:text-brand-400">
      {displayed}
      <span className="animate-pulse">|</span>
    </span>
  )
}

export default function Hero() {
  const { dark } = useTheme()

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine)
  }, [])

  const particleColor = dark ? '#22d3ee' : '#0891b2'
  const particleBg    = dark ? '#030712'  : '#f0f9ff'

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient">
      {/* Particles */}
      <Particles
        key={dark ? 'dark' : 'light'}
        id="tsparticles"
        init={particlesInit}
        className="absolute inset-0 z-0"
        options={{
          background: { color: { value: particleBg } },
          fpsLimit: 60,
          interactivity: {
            events: { onHover: { enable: true, mode: 'grab' }, onClick: { enable: true, mode: 'push' } },
            modes:  { grab: { distance: 160, links: { opacity: 0.6 } }, push: { quantity: 3 } },
          },
          particles: {
            color: { value: particleColor },
            links: { color: particleColor, distance: 140, enable: true, opacity: dark ? 0.3 : 0.2, width: 1 },
            move:  { enable: true, speed: 1.2, outModes: { default: 'bounce' } },
            number:{ value: 70, density: { enable: true } },
            opacity:{ value: dark ? 0.5 : 0.35 },
            size:  { value: { min: 1, max: 3 } },
          },
          detectRetina: true,
        }}
      />

      {/* Floating decorative icons */}
      <motion.div
        animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
        className="absolute top-1/4 left-[8%] text-brand-400/30 dark:text-brand-400/20 hidden md:block"
      >
        <Code2 size={56} />
      </motion.div>
      <motion.div
        animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
        className="absolute bottom-1/3 right-[8%] text-purple-400/30 dark:text-purple-400/20 hidden md:block"
      >
        <Cpu size={56} />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto pt-24">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-brand-400/40 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 text-sm font-mono shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-brand-500 dark:bg-brand-400 animate-ping-slow" />
          WebX Challenge — April 2–4, 2025 · Marwadi University
        </motion.div>

        {/* Glitch Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, type: 'spring', stiffness: 100, damping: 15 }}
          className="text-6xl sm:text-7xl md:text-9xl font-black mb-4 tracking-tight select-none glitch"
          data-text="XINITY"
        >
          <span className="text-slate-900 dark:text-white">X</span>
          <span className="text-brand-500 dark:text-brand-400">inity</span>
        </motion.h1>

        {/* Tagline with typewriter */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-gray-300 mb-10 font-mono"
        >
          Where <span className="text-brand-600 dark:text-brand-300 font-bold">Coders</span> Meet{' '}
          <TypewriterWord />
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex items-center justify-center gap-6 sm:gap-10 mb-10 text-center"
        >
          {[['500+', 'Members'], ['30+', 'Events'], ['₹10K', 'Prize Pool']].map(([val, lbl]) => (
            <div key={lbl}>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{val}</div>
              <div className="text-xs text-slate-500 dark:text-gray-500 font-mono tracking-wider">{lbl}</div>
            </div>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.a
            href="#challenges"
            whileHover={{ scale: 1.06, boxShadow: '0 0 24px #06b6d480' }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-brand-500 text-white font-bold text-base sm:text-lg shadow-lg hover:bg-brand-600 dark:hover:bg-brand-400 dark:hover:text-gray-950 transition-colors duration-200"
          >
            <Zap size={18} />
            Join Community
          </motion.a>
          <motion.a
            href="#events"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border-2 border-brand-500 dark:border-brand-400 text-brand-600 dark:text-brand-400 font-bold text-base sm:text-lg hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-all duration-200"
          >
            See Events
          </motion.a>
        </motion.div>
      </div>

      {/* Scroll arrow */}
      <motion.a
        href="#about"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-brand-500 dark:text-brand-400 z-10 opacity-80 hover:opacity-100 transition-opacity"
      >
        <ChevronDown size={30} strokeWidth={2.5} />
      </motion.a>
    </section>
  )
}
