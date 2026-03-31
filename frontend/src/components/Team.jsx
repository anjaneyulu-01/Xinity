import { motion } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { Github, Linkedin, Twitter } from 'lucide-react'

const TEAM = [
  { name: 'Arjun Patel',   role: 'President',      dept: 'Core',     avatar: 'AP', grad: 'from-brand-400 to-cyan-600'   },
  { name: 'Sneha Mehta',   role: 'Vice President',  dept: 'Core',     avatar: 'SM', grad: 'from-cyan-400  to-blue-500'   },
  { name: 'Rohan Shah',    role: 'Tech Lead',       dept: 'Tech',     avatar: 'RS', grad: 'from-purple-400 to-violet-600' },
  { name: 'Priya Joshi',   role: 'UI/UX Lead',      dept: 'Design',   avatar: 'PJ', grad: 'from-pink-400   to-rose-600'   },
  { name: 'Dev Rathod',    role: 'Backend Dev',     dept: 'Tech',     avatar: 'DR', grad: 'from-violet-400 to-purple-600' },
  { name: 'Ananya Verma',  role: 'Outreach Head',   dept: 'Outreach', avatar: 'AV', grad: 'from-emerald-400 to-teal-600'  },
]

const DEPT = {
  Core:     { text: 'text-brand-600   dark:text-brand-400',   bg: 'bg-brand-50   dark:bg-brand-500/10'   },
  Tech:     { text: 'text-purple-600  dark:text-purple-400',  bg: 'bg-purple-50  dark:bg-purple-500/10'  },
  Design:   { text: 'text-pink-600    dark:text-pink-400',    bg: 'bg-pink-50    dark:bg-pink-500/10'    },
  Outreach: { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
}

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }
const fadeUp  = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

export default function Team() {
  const { ref, isInView } = useScrollReveal()

  return (
    <section id="team" className="section-a py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div ref={ref} variants={stagger} initial="hidden" animate={isInView ? 'show' : 'hidden'} className="text-center mb-12">
          <motion.p variants={fadeUp} className="text-brand-600 dark:text-brand-400 font-mono text-xs sm:text-sm tracking-widest mb-2 uppercase">
            People
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
            Meet the <span className="gradient-text">Team</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-slate-500 dark:text-gray-400 max-w-xl mx-auto">
            The minds powering Xinity forward — hover a card to connect.
          </motion.p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {TEAM.map((member) => {
            const dept = DEPT[member.dept]
            return (
              <motion.div key={member.name} variants={fadeUp} className="perspective h-64">
                {/* Flip container */}
                <div className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group">
                  {/* Front */}
                  <div className="absolute inset-0 rounded-2xl overflow-hidden [backface-visibility:hidden]
                    bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800
                    hover:border-brand-300 dark:hover:border-brand-600 shadow-sm hover:shadow-md
                    transition-all duration-300 flex flex-col items-center justify-center p-6 gap-3"
                  >
                    {/* Avatar */}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${member.grad} flex items-center justify-center text-white font-black text-xl shadow-md`}>
                      {member.avatar}
                    </div>
                    <div className="text-center">
                      <h3 className="font-black text-slate-900 dark:text-white text-lg">{member.name}</h3>
                      <p className="text-slate-500 dark:text-gray-400 text-sm">{member.role}</p>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${dept.text} ${dept.bg}`}>
                      {member.dept}
                    </span>
                    <p className="text-[11px] text-slate-400 dark:text-gray-600 mt-1">Hover to connect →</p>
                  </div>

                  {/* Back */}
                  <div className={`absolute inset-0 rounded-2xl overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)]
                    bg-gradient-to-br ${member.grad} flex flex-col items-center justify-center p-6 gap-4 shadow-lg`}
                  >
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-black text-xl">
                      {member.avatar}
                    </div>
                    <div className="text-center text-white">
                      <h3 className="font-black text-xl">{member.name}</h3>
                      <p className="text-white/80 text-sm">{member.role} · {member.dept}</p>
                    </div>
                    <div className="flex gap-3">
                      {[Github, Linkedin, Twitter].map((Icon, i) => (
                        <motion.a
                          key={i}
                          href="#"
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-colors"
                        >
                          <Icon size={17} />
                        </motion.a>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
