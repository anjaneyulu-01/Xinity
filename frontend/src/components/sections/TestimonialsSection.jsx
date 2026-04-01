import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

const QUOTES = [
  { name: 'Vikram Nair',    batch: 'B.Tech CSE 2024', quote: "Xinity didn't just make me a better coder — it made me a better engineer. The leaderboard kept me pushing.", avatar: 'VN', color: '#00e5ff' },
  { name: 'Ananya Roy',     batch: 'B.Tech IT 2025',  quote: "Winning WebX Challenge changed everything. Got two internship offers the week after. Xinity is the real deal.", avatar: 'AR', color: '#7c4dff' },
  { name: 'Rohan Mehta',    batch: 'MCA 2024',        quote: "The judge feedback feature is gold. Actual mentors telling you exactly what to improve. Nothing like it.", avatar: 'RM', color: '#00e676' },
  { name: 'Sneha Shah',     batch: 'B.Tech CSE 2025', quote: "Found my startup co-founder through the team formation feature. We're still building together.", avatar: 'SS', color: '#ff4081' },
  { name: 'Priya Patel',    batch: 'B.Tech ECE 2024', quote: "The certificate on my LinkedIn literally got me shortlisted. Recruiters actually know what Xinity is.", avatar: 'PP', color: '#ffd600' },
  { name: 'Arjun Sharma',   batch: 'B.Tech CSE 2026', quote: "First hackathon ever. Nervous as hell. Team Nexus finished 3rd. Xinity makes beginners feel welcome.", avatar: 'AS', color: '#0066ff' },
]

function QuoteCard({ q, dark }) {
  return (
    <div className={`glass-card p-6 min-w-[320px] max-w-[360px] flex flex-col gap-4 mx-3 flex-shrink-0 ${
      dark 
        ? 'border border-white/5' 
        : 'border border-gray-200/60'
    }`}>
      <p className={`text-sm leading-relaxed italic ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>"{q.quote}"</p>
      <div className="flex items-center gap-3 mt-auto">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-[#04040f] flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${q.color}, ${q.color}88)` }}>
          {q.avatar}
        </div>
        <div>
          <p className={`font-semibold text-sm ${dark ? 'text-white' : 'text-gray-900'}`}>{q.name}</p>
          <p className={`text-xs ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>{q.batch}</p>
        </div>
      </div>
    </div>
  )
}

export default function TestimonialsSection() {
  const { dark } = useTheme()
  const doubled = [...QUOTES, ...QUOTES]
  
  return (
    <section className={`py-24 overflow-hidden transition-colors duration-300 ${dark ? 'bg-[#04040f]' : 'bg-gray-50'}`}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14 px-4"
      >
        <p className={`font-code text-sm tracking-widest uppercase mb-3 ${dark ? 'text-[#00e5ff]' : 'text-[#0066ff]'}`}>Testimonials</p>
        <h2 className={`font-heading font-bold text-4xl sm:text-5xl ${dark ? 'text-white' : 'text-gray-900'}`}>
          What Our <span className="gradient-cyan">Champions</span> Say
        </h2>
      </motion.div>

      {/* Infinite marquee */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: `linear-gradient(90deg, ${dark ? '#04040f' : '#f9fafb'}, transparent)` }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: `linear-gradient(-90deg, ${dark ? '#04040f' : '#f9fafb'}, transparent)` }} />
        <div className="flex" style={{ animation: 'marquee 40s linear infinite' }}>
          {doubled.map((q, i) => <QuoteCard key={i} q={q} dark={dark} />)}
        </div>
      </div>
    </section>
  )
}
