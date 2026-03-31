import { motion } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { Github, ExternalLink, Trophy, Medal } from 'lucide-react'

const WINNERS = [
  { rank: 1, name: 'Team Nexus',   project: 'AI Resume Builder',      event: 'HackMU 2024',  prize: '₹10,000', github: '#' },
  { rank: 2, name: 'ByteForce',    project: 'Eco Carbon Tracker',     event: 'HackMU 2024',  prize: '₹6,000',  github: '#' },
  { rank: 3, name: 'CipherX',      project: 'SafeKid AR App',         event: 'HackMU 2024',  prize: '₹3,000',  github: '#' },
  { rank: 1, name: 'CodeStorm',    project: 'Smart Campus Dashboard', event: 'InnoFest 2023', prize: '₹8,000',  github: '#' },
  { rank: 2, name: 'PixelCraft',   project: 'AR Campus Map',          event: 'InnoFest 2023', prize: '₹4,000',  github: '#' },
  { rank: 3, name: 'DataDrive',    project: 'Student Analytics Hub',  event: 'InnoFest 2023', prize: '₹2,000',  github: '#' },
]

const RANK_STYLE = {
  1: {
    gradient: 'from-amber-400  to-yellow-500',
    text:     'text-amber-600  dark:text-amber-400',
    bg:       'bg-amber-50     dark:bg-amber-500/10',
    ring:     'ring-amber-300  dark:ring-amber-500/30',
    podium:   'h-32 bg-gradient-to-t from-amber-400 to-yellow-400',
    icon:     <Trophy size={20} className="text-white" />,
  },
  2: {
    gradient: 'from-slate-300  to-gray-400',
    text:     'text-slate-600  dark:text-gray-300',
    bg:       'bg-slate-50     dark:bg-gray-800/60',
    ring:     'ring-slate-300  dark:ring-gray-600/30',
    podium:   'h-24 bg-gradient-to-t from-slate-400 to-gray-300',
    icon:     <Medal size={18} className="text-white" />,
  },
  3: {
    gradient: 'from-orange-400 to-amber-600',
    text:     'text-orange-600 dark:text-orange-400',
    bg:       'bg-orange-50    dark:bg-orange-500/10',
    ring:     'ring-orange-300 dark:ring-orange-500/30',
    podium:   'h-20 bg-gradient-to-t from-orange-400 to-amber-500',
    icon:     <Medal size={16} className="text-white" />,
  },
}

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }
const fadeUp  = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

export default function HallOfFame() {
  const { ref, isInView } = useScrollReveal()
  const top3 = WINNERS.slice(0, 3)
  // Podium order: 2nd, 1st, 3rd
  const podiumOrder = [top3[1], top3[0], top3[2]]

  return (
    <section id="halloffame" className="section-b py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div ref={ref} variants={stagger} initial="hidden" animate={isInView ? 'show' : 'hidden'} className="text-center mb-14">
          <motion.p variants={fadeUp} className="text-brand-600 dark:text-brand-400 font-mono text-xs sm:text-sm tracking-widest mb-2 uppercase">
            Legends
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
            Hall of <span className="gradient-text">Fame</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-slate-500 dark:text-gray-400 max-w-xl mx-auto">
            The builders who went above and beyond.
          </motion.p>
        </motion.div>

        {/* Podium */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="flex items-end justify-center gap-3 sm:gap-5 mb-14"
        >
          {podiumOrder.map((w, i) => {
            const s = RANK_STYLE[w.rank]
            return (
              <motion.div
                key={`${w.name}-podium`}
                variants={{ hidden: { opacity: 0, y: 60 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } } }}
                className="flex flex-col items-center gap-2"
              >
                {/* Name tag */}
                <div className="text-center">
                  <p className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">{w.name}</p>
                  <p className="text-slate-400 dark:text-gray-500 text-[10px] sm:text-xs">{w.project}</p>
                </div>
                {/* Avatar */}
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br ${s.gradient} ring-4 ${s.ring} flex items-center justify-center shadow-lg`}>
                  {s.icon}
                </div>
                {/* Podium block */}
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={isInView ? { scaleY: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.1, ease: 'backOut' }}
                  style={{ transformOrigin: 'bottom' }}
                  className={`w-20 sm:w-28 ${s.podium} rounded-t-xl flex items-start justify-center pt-2 shadow-md`}
                >
                  <span className="text-white font-black text-lg sm:text-xl">#{w.rank}</span>
                </motion.div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Winner cards grid */}
        <motion.div variants={stagger} initial="hidden" animate={isInView ? 'show' : 'hidden'} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {WINNERS.map((w, i) => {
            const s = RANK_STYLE[w.rank]
            return (
              <motion.div
                key={`${w.name}-${i}`}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="card p-5 flex items-center gap-4 group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center font-black text-white text-base shrink-0 shadow-sm`}>
                  #{w.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {w.name}
                  </p>
                  <p className="text-slate-500 dark:text-gray-400 text-sm truncate">{w.project}</p>
                  <p className="text-slate-400 dark:text-gray-600 text-xs mt-0.5">{w.event}</p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`text-sm font-black ${s.text}`}>{w.prize}</span>
                  <a
                    href={w.github}
                    className="text-slate-400 dark:text-gray-600 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                    aria-label="GitHub"
                  >
                    <Github size={16} />
                  </a>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
