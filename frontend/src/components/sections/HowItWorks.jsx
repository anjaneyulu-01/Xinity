import { motion } from 'framer-motion'
import { UserPlus, Users, Code2, Trophy } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const STEPS = [
  { icon: UserPlus, num: '01', title: 'Register',    desc: 'Create your Xinity account and pick your first challenge.',     color: '#00e5ff' },
  { icon: Users,    num: '02', title: 'Form Team',   desc: 'Invite teammates or join an open team looking for your skills.', color: '#0066ff' },
  { icon: Code2,    num: '03', title: 'Build & Submit', desc: 'Code your solution and submit via our live portal.',           color: '#7c4dff' },
  { icon: Trophy,   num: '04', title: 'Win',          desc: 'Get scored by judges, claim your prize, and earn your badge.',   color: '#ffd600' },
]

export default function HowItWorks() {
  const { dark } = useTheme()
  
  return (
    <section id="how-it-works" className={`section-pad transition-colors duration-300 ${dark ? 'bg-[#080818]' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className={`font-code text-sm tracking-widest uppercase mb-3 ${dark ? 'text-[#00e5ff]' : 'text-[#0066ff]'}`}>Process</p>
          <h2 className={`font-heading font-bold text-4xl sm:text-5xl mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
            From Zero to <span className="gradient-cyan">Champion</span> in 4 Steps
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className={`hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px ${dark ? 'bg-[#1e3a5f]' : 'bg-gray-200'}`}>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
              className="h-full bg-gradient-to-r from-[#00e5ff] via-[#0066ff] to-[#7c4dff] origin-left"
            />
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.2 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative"
          >
            {STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.num}
                  variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
                  className="flex flex-col items-center text-center"
                >
                  {/* Icon circle */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`w-24 h-24 rounded-full border-2 flex items-center justify-center mb-6 relative z-10 transition-all ${dark ? '' : 'bg-white'}`}
                    style={{
                      borderColor: step.color + '60',
                      background: dark ? step.color + '10' : 'white',
                      boxShadow: `0 0 30px ${step.color}20`,
                    }}
                  >
                    <Icon size={32} style={{ color: step.color }} />
                    <span
                      className="absolute -top-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-code text-[#04040f]"
                      style={{ background: step.color }}
                    >
                      {step.num}
                    </span>
                  </motion.div>
                  <h3 className={`font-heading font-bold text-xl mb-2 ${dark ? 'text-white' : 'text-gray-900'}`}>{step.title}</h3>
                  <p className={`text-sm leading-relaxed ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>{step.desc}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
