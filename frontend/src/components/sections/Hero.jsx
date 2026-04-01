import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Particles from '@tsparticles/react'
import { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import { Link } from 'react-router-dom'
import { ArrowRight, Play, ChevronDown, Trophy, Zap, Users, Star } from 'lucide-react'
import AnimatedCounter from '../ui/AnimatedCounter'
import { useTheme } from '../../context/ThemeContext'

const STATS = [
  { icon: Users,  label: 'Members',    value: 500,  suffix: '+' },
  { icon: Zap,    label: 'Hackathons', value: 12,   suffix: '' },
  { icon: Trophy, label: 'Prize Pool', value: 2,    suffix: 'L+', prefix: '₹' },
  { icon: Star,   label: 'Winners',    value: 48,   suffix: '' },
]

const WORDS = ['Innovators', 'Champions', 'Builders', 'Creators']

export default function Hero() {
  const [engineReady, setEngineReady] = useState(false)
  const [wordIdx, setWordIdx] = useState(0)
  const { dark } = useTheme()

  useEffect(() => {
    initParticlesEngine(async e => { await loadSlim(e) }).then(() => setEngineReady(true))
  }, [])

  useEffect(() => {
    const id = setInterval(() => setWordIdx(i => (i + 1) % WORDS.length), 2500)
    return () => clearInterval(id)
  }, [])

  const particlesInit = useCallback(() => {}, [])

  return (
    <section id="hero" className={`relative min-h-screen flex flex-col items-center justify-center overflow-hidden transition-colors duration-300 ${dark ? 'bg-[#04040f]' : 'bg-gradient-to-b from-gray-50 to-white'}`}>
      {/* Particles */}
      {engineReady && (
        <Particles
          id="hero-particles"
          options={{
            background: { color: { value: 'transparent' } },
            fpsLimit: 60,
            particles: {
              color: { value: dark ? '#00e5ff' : '#0066ff' },
              links: { color: dark ? '#00e5ff' : '#0066ff', distance: 150, enable: true, opacity: dark ? 0.15 : 0.1, width: 1 },
              move: { enable: true, speed: 0.6, random: true },
              number: { density: { enable: true }, value: 80 },
              opacity: { value: { min: 0.1, max: dark ? 0.4 : 0.25 } },
              size: { value: { min: 1, max: 2.5 } },
            },
            detectRetina: true,
          }}
          className="absolute inset-0 z-0"
        />
      )}

      {/* Radial glow behind content */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] ${dark ? 'bg-[#00e5ff]/5' : 'bg-[#0066ff]/8'}`} />
        <div className={`absolute top-1/2 left-1/4 w-[300px] h-[300px] rounded-full blur-[100px] ${dark ? 'bg-[#7c4dff]/5' : 'bg-[#7c4dff]/6'}`} />
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto pt-20">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className={`inline-flex items-center gap-2 px-5 py-2.5 mb-10 rounded-full border backdrop-blur-sm ${
            dark 
              ? 'border-[#00e5ff]/30 bg-[#00e5ff]/5' 
              : 'border-[#0066ff]/30 bg-[#0066ff]/5'
          }`}
        >
          <span className={`w-2 h-2 rounded-full animate-ping-slow ${dark ? 'bg-[#00e5ff]' : 'bg-[#0066ff]'}`} />
          <span className={`text-sm font-code font-medium ${dark ? 'text-[#00e5ff]' : 'text-[#0066ff]'}`}>
            🏆 Applications Open — WebX Challenge 2026
          </span>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.7, ease: 'easeOut' }}
        >
          <h1 className={`font-heading text-6xl sm:text-7xl md:text-8xl font-black leading-none mb-4 ${dark ? 'glitch' : ''}`} data-text="Build. Compete.">
            <span className={dark ? 'text-white' : 'text-gray-900'}>Build. Compete.</span>
          </h1>
          <h1 className="font-heading text-6xl sm:text-7xl md:text-8xl font-black leading-none mb-6">
            <span className="gradient-text-animated">Conquer.</span>
          </h1>
        </motion.div>

        {/* Subheading with typewriter word */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}
        >
          Xinity Hackathon Community — Where developers become{' '}
          <motion.span
            key={wordIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`font-semibold ${dark ? 'text-[#00e5ff]' : 'text-[#0066ff]'}`}
          >
            {WORDS[wordIdx]}
          </motion.span>
          .
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-14"
        >
          <Link to="/register" className="btn-primary text-base px-8 py-4">
            Start Competing <ArrowRight size={18} />
          </Link>
          <a href="#features" className="btn-ghost text-base px-8 py-4">
            <Play size={16} /> Watch Highlights
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {STATS.map(({ icon: Icon, label, value, suffix, prefix }) => (
            <div key={label} className="stat-card text-center">
              <div className="flex items-center justify-center mb-2">
                <Icon size={20} className={dark ? 'text-[#00e5ff]' : 'text-[#0066ff]'} />
              </div>
              <div className={`text-2xl sm:text-3xl font-heading font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                {prefix}<AnimatedCounter target={value} suffix={suffix} />
              </div>
              <div className={`text-xs mt-1 font-medium uppercase tracking-wider ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-slow"
      >
        <a href="#events" className={`flex flex-col items-center gap-1 transition-colors ${dark ? 'text-[#94a3b8] hover:text-[#00e5ff]' : 'text-gray-500 hover:text-[#0066ff]'}`}>
          <span className="text-xs font-code">scroll</span>
          <ChevronDown size={18} />
        </a>
      </motion.div>
    </section>
  )
}
