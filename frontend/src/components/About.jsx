import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { Users, Trophy, Calendar, Lightbulb, Rocket, Heart } from 'lucide-react'

const STATS = [
  { icon: Users,   label: 'Members',  target: 500, color: 'text-brand-500 dark:text-brand-400',  ring: 'ring-brand-200  dark:ring-brand-500/20' },
  { icon: Trophy,  label: 'Winners',  target: 120, color: 'text-yellow-500 dark:text-yellow-400', ring: 'ring-yellow-200 dark:ring-yellow-500/20' },
  { icon: Calendar,label: 'Events',   target: 30,  color: 'text-purple-500 dark:text-purple-400', ring: 'ring-purple-200 dark:ring-purple-500/20' },
]

const VALUES = [
  { icon: Lightbulb, title: 'Innovation',   desc: 'We push boundaries and challenge the status quo.',   color: 'bg-amber-50 dark:bg-amber-500/10   text-amber-600 dark:text-amber-400' },
  { icon: Rocket,    title: 'Excellence',   desc: 'Every project shipped is our best work yet.',         color: 'bg-brand-50 dark:bg-brand-500/10   text-brand-600 dark:text-brand-400' },
  { icon: Heart,     title: 'Community',    desc: 'We grow together — every coder belongs here.',        color: 'bg-rose-50  dark:bg-rose-500/10    text-rose-600  dark:text-rose-400'  },
]

function Counter({ target, isInView }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!isInView) return
    let val = 0
    const step = target / 60
    const id = setInterval(() => {
      val += step
      if (val >= target) { setCount(target); clearInterval(id) }
      else setCount(Math.floor(val))
    }, 16)
    return () => clearInterval(id)
  }, [isInView, target])
  return <>{count}+</>
}

const stagger  = { hidden: {}, show: { transition: { staggerChildren: 0.13 } } }
const fadeUp   = { hidden: { opacity: 0, y: 36 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } } }
const fadeLeft = { hidden: { opacity: 0, x: -30 }, show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: 'easeOut' } } }

export default function About() {
  const { ref, isInView } = useScrollReveal()

  return (
    <section id="about" className="section-a py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div ref={ref} variants={stagger} initial="hidden" animate={isInView ? 'show' : 'hidden'} className="text-center mb-16">
          <motion.p variants={fadeUp} className="text-brand-600 dark:text-brand-400 font-mono text-xs sm:text-sm tracking-widest mb-2 uppercase">
            Who We Are
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
            About <span className="gradient-text">Xinity</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-slate-500 dark:text-gray-400 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Xinity is the premier tech community at Marwadi University — a hub where passionate
            coders, designers, and innovators come together to build, compete, and grow.
          </motion.p>
        </motion.div>

        {/* Stat cards */}
        <motion.div variants={stagger} initial="hidden" animate={isInView ? 'show' : 'hidden'} className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-16">
          {STATS.map(({ icon: Icon, label, target, color, ring }) => (
            <motion.div
              key={label}
              variants={fadeUp}
              whileHover={{ y: -6, scale: 1.02 }}
              className="card p-8 text-center group cursor-default"
            >
              <div className={`w-14 h-14 rounded-2xl ring-4 ${ring} mx-auto mb-4 flex items-center justify-center bg-white dark:bg-gray-800 shadow-sm`}>
                <Icon className={`w-7 h-7 ${color}`} />
              </div>
              <div className={`text-5xl font-black mb-1 ${color}`}>
                <Counter target={target} isInView={isInView} />
              </div>
              <p className="text-slate-500 dark:text-gray-400 font-mono text-sm tracking-wide">{label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Values */}
        <motion.div variants={stagger} initial="hidden" animate={isInView ? 'show' : 'hidden'} className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {VALUES.map(({ icon: Icon, title, desc, color }) => (
            <motion.div
              key={title}
              variants={fadeLeft}
              whileHover={{ y: -4 }}
              className="card p-6 flex gap-4 items-start"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                <Icon size={22} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">{title}</h3>
                <p className="text-slate-500 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mission banner */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="relative overflow-hidden rounded-3xl p-8 sm:p-12 text-center bg-gradient-to-br from-brand-500 to-cyan-600 dark:from-brand-600 dark:to-cyan-700 shadow-xl"
        >
          {/* Decoration circles */}
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-white/10" />

          <h3 className="text-xl sm:text-2xl font-black text-white mb-3 relative z-10">Our Mission</h3>
          <p className="text-brand-50 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed relative z-10">
            To cultivate a culture of innovation by empowering students with real-world challenges,
            collaborative events, and an unstoppable community — one hackathon at a time.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
