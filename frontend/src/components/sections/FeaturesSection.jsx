import { motion } from 'framer-motion'
import { Trophy, Upload, Award, Star, Users, FileText } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const FEATURES = [
  {
    icon: Trophy, title: 'Real-time Leaderboard', large: true,
    desc: 'Watch rankings update live as judges score submissions. Every point counts.',
    gradient: 'from-[#00e5ff] to-[#0066ff]', glow: '#00e5ff',
    extra: (dark) => (
      <div className="flex flex-col gap-2 mt-4">
        {[['Team Nexus', 2450], ['ByteForce', 2100], ['CipherX', 1980]].map(([name, pts], i) => (
          <div key={name} className={`flex items-center gap-3 rounded-lg px-3 py-2 ${dark ? 'bg-white/5' : 'bg-gray-100'}`}>
            <span className={`font-bold font-code text-sm w-5 ${dark ? 'text-[#00e5ff]' : 'text-[#0066ff]'}`}>#{i+1}</span>
            <span className={`text-sm flex-1 ${dark ? 'text-white' : 'text-gray-900'}`}>{name}</span>
            <span className="text-[#ffd600] font-bold text-sm">{pts.toLocaleString()} pts</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Upload, title: 'Live Submission Portal', large: true,
    desc: 'Submit your project with GitHub link, demo URL, and pitch deck in seconds.',
    gradient: 'from-[#7c4dff] to-[#ff4081]', glow: '#7c4dff',
    extra: (dark) => (
      <div className={`mt-4 border border-dashed rounded-xl p-4 text-center ${dark ? 'border-[#7c4dff]/40 bg-[#7c4dff]/5' : 'border-[#7c4dff]/30 bg-[#7c4dff]/5'}`}>
        <Upload size={24} className="text-[#7c4dff] mx-auto mb-2" />
        <p className={`text-xs ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>Drag & drop your project files</p>
        <div className={`mt-2 h-1.5 rounded-full overflow-hidden ${dark ? 'bg-white/10' : 'bg-gray-200'}`}>
          <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-[#7c4dff] to-[#ff4081]" />
        </div>
        <p className="text-[#7c4dff] text-xs mt-1 font-code">67% uploaded...</p>
      </div>
    ),
  },
  { icon: Award,    title: 'Instant Certificates', desc: 'Auto-generated PDF certificates for all winners.', gradient: 'from-[#ffd600] to-[#ff9100]', glow: '#ffd600' },
  { icon: Star,     title: 'Judge Feedback',       desc: 'Get detailed scoring breakdown from industry judges.', gradient: 'from-[#00e676] to-[#00b0ff]', glow: '#00e676' },
  { icon: Users,    title: 'Team Formation',       desc: 'Find teammates by skills, interests, and availability.', gradient: 'from-[#ff4081] to-[#7c4dff]', glow: '#ff4081' },
  { icon: FileText, title: 'Resume Builder',       desc: 'Auto-fill your resume with hackathon achievements.', gradient: 'from-[#0066ff] to-[#00e5ff]', glow: '#0066ff' },
]

export default function FeaturesSection() {
  const { dark } = useTheme()
  
  return (
    <section id="features" className={`section-pad transition-colors duration-300 ${dark ? 'bg-[#04040f]' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className={`font-code text-sm tracking-widest uppercase mb-3 ${dark ? 'text-[#00e5ff]' : 'text-[#0066ff]'}`}>Why Xinity</p>
          <h2 className={`font-heading font-bold text-4xl sm:text-5xl mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
            Why <span className="gradient-cyan">500+ developers</span> choose Xinity
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#00e5ff] to-[#7c4dff] mx-auto rounded-full" />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {FEATURES.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.div
                key={f.title}
                variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                whileHover={{ y: -6, boxShadow: `0 0 40px ${f.glow}20` }}
                className={`glass-card p-6 relative overflow-hidden transition-all duration-300 ${
                  dark 
                    ? 'border border-white/5 hover:border-[' + f.glow + ']/30' 
                    : 'border border-gray-200/60 hover:border-[' + f.glow + ']/30'
                } ${f.large ? 'row-span-2' : ''}`}
              >
                <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${f.gradient}`} />
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon size={20} className="text-white" />
                </div>
                <h3 className={`font-heading font-bold text-lg mb-2 ${dark ? 'text-white' : 'text-gray-900'}`}>{f.title}</h3>
                <p className={`text-sm leading-relaxed ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>{f.desc}</p>
                {f.extra && f.extra(dark)}
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
