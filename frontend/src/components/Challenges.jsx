import { motion } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { Flame, Star, Zap, Lock, CheckCircle2 } from 'lucide-react'

const CHALLENGES = [
  {
    title: 'WebX Challenge 2025',
    badge: 'LIVE NOW',
    difficulty: 'Intermediate',
    prize: '₹10,000',
    description: 'Design and build a stunning, responsive website for Xinity. Best animation, UX, and code quality wins.',
    tags: ['React', 'Tailwind', 'Framer Motion'],
    perks: ['Certificates', 'Cash Prize', 'Internship Opportunity'],
    current: true,
  },
  {
    title: 'Algo Arena #3',
    badge: 'Completed',
    difficulty: 'Advanced',
    prize: '₹5,000',
    description: 'Competitive programming challenge — 5 problems in 3 hours.',
    tags: ['C++', 'Python', 'DSA'],
    perks: ['Cash Prize', 'Certificates'],
    current: false,
  },
  {
    title: 'UI/UX Sprint',
    badge: 'Completed',
    difficulty: 'Beginner',
    prize: '₹3,000',
    description: 'Design the best mobile app UI in Figma within 4 hours.',
    tags: ['Figma', 'Design', 'UX'],
    perks: ['Cash Prize', 'Certificates'],
    current: false,
  },
]

const DIFF = {
  Beginner:     { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', stars: 1 },
  Intermediate: { color: 'text-amber-600   dark:text-amber-400',   bg: 'bg-amber-50   dark:bg-amber-500/10',   stars: 2 },
  Advanced:     { color: 'text-red-600     dark:text-red-400',     bg: 'bg-red-50     dark:bg-red-500/10',     stars: 3 },
}

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.14 } } }
const fadeUp  = { hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

export default function Challenges() {
  const { ref, isInView } = useScrollReveal()

  return (
    <section id="challenges" className="section-a py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div ref={ref} variants={stagger} initial="hidden" animate={isInView ? 'show' : 'hidden'} className="text-center mb-12">
          <motion.p variants={fadeUp} className="text-brand-600 dark:text-brand-400 font-mono text-xs sm:text-sm tracking-widest mb-2 uppercase">
            Compete
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
            Challenges &amp; <span className="gradient-text">Hackathons</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-slate-500 dark:text-gray-400 max-w-xl mx-auto">
            Test your limits. Compete with the best. Win real prizes.
          </motion.p>
        </motion.div>

        {/* Cards */}
        <motion.div variants={stagger} initial="hidden" animate={isInView ? 'show' : 'hidden'} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CHALLENGES.map((c) => {
            const diff = DIFF[c.difficulty]
            return (
              <motion.div
                key={c.title}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                className={`relative flex flex-col card p-6 overflow-hidden ${
                  c.current
                    ? 'ring-2 ring-brand-400 dark:ring-brand-500 shadow-[0_8px_32px_theme("colors.brand.400/25")] dark:shadow-[0_0_32px_theme("colors.brand.400/20")]'
                    : ''
                }`}
              >
                {/* Live ribbon */}
                {c.current && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-brand-500 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      LIVE
                    </div>
                  </div>
                )}

                {/* Top badges */}
                <div className="flex items-center justify-between mb-5">
                  <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${
                    c.current
                      ? 'bg-brand-500 text-white'
                      : 'bg-slate-100 dark:bg-gray-800 text-slate-500 dark:text-gray-400'
                  }`}>
                    {c.current ? <Zap size={11} /> : <Lock size={11} />}
                    {c.badge}
                  </span>
                  <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-full ${diff.color} ${diff.bg}`}>
                    {[...Array(diff.stars)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                    {c.difficulty}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">{c.title}</h3>
                <p className="text-slate-500 dark:text-gray-400 text-sm mb-4 leading-relaxed flex-1">{c.description}</p>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {c.tags.map((t) => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400 font-mono">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Perks */}
                <ul className="space-y-1 mb-5">
                  {c.perks.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-xs text-slate-600 dark:text-gray-400">
                      <CheckCircle2 size={13} className="text-brand-500 dark:text-brand-400 shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-gray-800">
                  <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-black text-sm">
                    <Flame size={15} />
                    {c.prize}
                  </span>
                  {c.current ? (
                    <motion.a
                      href="#contact"
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.96 }}
                      className="px-5 py-2 rounded-full bg-brand-500 text-white text-sm font-bold shadow-md hover:bg-brand-600 dark:hover:bg-brand-400 dark:hover:text-gray-950 transition-all"
                    >
                      Register →
                    </motion.a>
                  ) : (
                    <span className="text-xs text-slate-400 dark:text-gray-600">Ended</span>
                  )}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
