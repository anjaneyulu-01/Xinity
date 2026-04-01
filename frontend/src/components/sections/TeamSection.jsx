import { useState } from 'react'
import { motion } from 'framer-motion'
import { GitBranch, Linkedin, Instagram } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const MEMBERS = [
  { name: 'Raj Patel',    role: 'President',      dept: 'Core',     bio: 'Full-stack dev. Loves building things people actually use.',   github: '#', linkedin: '#', insta: '#', color: '#00e5ff' },
  { name: 'Ananya Roy',   role: 'Tech Lead',      dept: 'Tech',     bio: 'DSA wizard. Open source contributor. React enthusiast.',       github: '#', linkedin: '#', insta: '#', color: '#7c4dff' },
  { name: 'Vikram Nair',  role: 'Design Lead',    dept: 'Design',   bio: 'UI/UX designer. Makes pixels dance. Figma power user.',       github: '#', linkedin: '#', insta: '#', color: '#ff4081' },
  { name: 'Priya Mehta',  role: 'Outreach Head',  dept: 'Outreach', bio: 'Community builder. Connects people. Events maestro.',          github: '#', linkedin: '#', insta: '#', color: '#00e676' },
  { name: 'Arjun Sharma', role: 'Backend Dev',    dept: 'Tech',     bio: 'Node.js & Python. Databases are my playground.',               github: '#', linkedin: '#', insta: '#', color: '#0066ff' },
  { name: 'Sneha Shah',   role: 'Content Lead',   dept: 'Outreach', bio: 'Writer. Storyteller. Makes technical stuff sound exciting.',   github: '#', linkedin: '#', insta: '#', color: '#ffd600' },
]

const DEPTS = ['All', 'Core', 'Tech', 'Design', 'Outreach']

function FlipCard({ member, dark }) {
  return (
    <div className="group h-64 [perspective:1000px] cursor-pointer">
      <div className="relative w-full h-full transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        {/* Front */}
        <div className={`absolute inset-0 [backface-visibility:hidden] glass-card flex flex-col items-center justify-center gap-3 p-6 ${
          dark 
            ? 'border border-white/5 hover:border-[#00e5ff]/20' 
            : 'border border-gray-200/60 hover:border-[#0066ff]/20'
        }`}>
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-heading font-bold text-[#04040f] shadow-lg animate-glow-pulse"
            style={{ background: `linear-gradient(135deg, ${member.color}, ${member.color}88)` }}
          >
            {member.name.split(' ').map(w => w[0]).join('')}
          </div>
          <div className="text-center">
            <h3 className={`font-heading font-bold text-lg ${dark ? 'text-white' : 'text-gray-900'}`}>{member.name}</h3>
            <p className="text-sm font-medium" style={{ color: member.color }}>{member.role}</p>
            <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${
              dark 
                ? 'bg-white/5 text-[#94a3b8] border border-white/10' 
                : 'bg-gray-100 text-gray-600 border border-gray-200'
            }`}>{member.dept}</span>
          </div>
        </div>
        {/* Back */}
        <div className={`absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] glass-card flex flex-col items-center justify-center gap-4 p-6`}
          style={{ background: `linear-gradient(135deg, ${member.color}15, transparent)`, borderColor: member.color + '30' }}>
          <p className={`text-sm text-center leading-relaxed ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>{member.bio}</p>
          <div className="flex gap-3">
            {[{ Icon: GitBranch, href: member.github }, { Icon: Linkedin, href: member.linkedin }, { Icon: Instagram, href: member.insta }].map(({ Icon, href }, i) => (
              <a key={i} href={href} className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                dark 
                  ? 'bg-white/5 border border-white/10 text-[#94a3b8] hover:text-[#00e5ff] hover:border-[#00e5ff]/40' 
                  : 'bg-gray-50 border border-gray-200 text-gray-500 hover:text-[#0066ff] hover:border-[#0066ff]/40'
              }`}>
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TeamSection() {
  const [dept, setDept] = useState('All')
  const { dark } = useTheme()
  const filtered = dept === 'All' ? MEMBERS : MEMBERS.filter(m => m.dept === dept)

  return (
    <section id="team" className={`section-pad transition-colors duration-300 ${dark ? 'bg-[#080818]' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className={`font-code text-sm tracking-widest uppercase mb-3 ${dark ? 'text-[#00e5ff]' : 'text-[#0066ff]'}`}>Our Team</p>
          <h2 className={`font-heading font-bold text-4xl sm:text-5xl mb-6 ${dark ? 'text-white' : 'text-gray-900'}`}>
            Meet the <span className="gradient-cyan">Xinity Core Team</span>
          </h2>
          {/* Filter tabs */}
          <div className="flex gap-2 justify-center flex-wrap">
            {DEPTS.map(d => (
              <button
                key={d}
                onClick={() => setDept(d)}
                className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                  dept === d
                    ? dark 
                      ? 'bg-[#00e5ff] text-[#04040f] border-[#00e5ff]' 
                      : 'bg-[#0066ff] text-white border-[#0066ff]'
                    : dark 
                      ? 'border-[#1e3a5f] text-[#94a3b8] hover:border-[#00e5ff]/40 hover:text-[#00e5ff]' 
                      : 'border-gray-300 text-gray-600 hover:border-[#0066ff]/40 hover:text-[#0066ff]'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filtered.map((member, i) => (
            <motion.div
              key={member.name}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <FlipCard member={member} dark={dark} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
