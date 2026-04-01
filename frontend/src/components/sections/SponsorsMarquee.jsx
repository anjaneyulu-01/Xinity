import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

// Sponsor/Partner logos - these would typically be actual logos
const SPONSORS = [
  { name: 'Google', logo: '🔵', tier: 'platinum' },
  { name: 'Microsoft', logo: '🟦', tier: 'platinum' },
  { name: 'GitHub', logo: '⚫', tier: 'gold' },
  { name: 'Vercel', logo: '▲', tier: 'gold' },
  { name: 'MongoDB', logo: '🍃', tier: 'gold' },
  { name: 'AWS', logo: '☁️', tier: 'silver' },
  { name: 'DigitalOcean', logo: '🌊', tier: 'silver' },
  { name: 'Notion', logo: '📝', tier: 'silver' },
  { name: 'Figma', logo: '🎨', tier: 'bronze' },
  { name: 'Discord', logo: '💬', tier: 'bronze' },
  { name: 'Replit', logo: '💻', tier: 'bronze' },
  { name: 'Cloudflare', logo: '🔶', tier: 'bronze' },
]

const TIER_STYLES = {
  platinum: { bg: 'from-[#e5e4e2] to-[#b4b4b4]', border: '#e5e4e2', size: 'w-24 h-24' },
  gold: { bg: 'from-[#ffd700] to-[#ffb700]', border: '#ffd700', size: 'w-20 h-20' },
  silver: { bg: 'from-[#c0c0c0] to-[#a0a0a0]', border: '#c0c0c0', size: 'w-18 h-18' },
  bronze: { bg: 'from-[#cd7f32] to-[#a0522d]', border: '#cd7f32', size: 'w-16 h-16' },
}

function SponsorCard({ sponsor, dark }) {
  const style = TIER_STYLES[sponsor.tier]
  
  return (
    <motion.div
      whileHover={{ scale: 1.08, y: -4 }}
      className={`flex flex-col items-center justify-center px-8 py-4 rounded-2xl border backdrop-blur-sm transition-all duration-300 cursor-pointer group ${
        dark 
          ? 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10' 
          : 'bg-white border-gray-200 shadow-sm hover:shadow-lg hover:border-gray-300'
      }`}
    >
      <div className={`${style.size || 'w-16 h-16'} rounded-xl flex items-center justify-center text-3xl mb-2 transition-transform group-hover:scale-110`}>
        {sponsor.logo}
      </div>
      <span className={`text-sm font-medium ${dark ? 'text-white/80' : 'text-gray-700'}`}>{sponsor.name}</span>
      <span className={`text-xs mt-0.5 capitalize ${
        sponsor.tier === 'platinum' ? 'text-gray-400' :
        sponsor.tier === 'gold' ? 'text-yellow-500' :
        sponsor.tier === 'silver' ? 'text-gray-400' :
        'text-orange-400'
      }`}>
        {sponsor.tier}
      </span>
    </motion.div>
  )
}

export default function SponsorsMarquee() {
  const { dark } = useTheme()
  const doubled = [...SPONSORS, ...SPONSORS]

  return (
    <section className={`py-20 overflow-hidden transition-colors duration-300 ${dark ? 'bg-[#080818]' : 'bg-gray-50'}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 px-4"
      >
        <p className={`font-code text-sm tracking-widest uppercase mb-3 ${dark ? 'text-[#00e5ff]' : 'text-[#0066ff]'}`}>
          Trusted By
        </p>
        <h2 className={`font-heading font-bold text-3xl sm:text-4xl mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
          Our Amazing <span className="gradient-cyan">Sponsors</span> & Partners
        </h2>
        <p className={`text-sm max-w-xl mx-auto ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>
          Backed by industry leaders who believe in nurturing the next generation of developers.
        </p>
      </motion.div>

      {/* Marquee container */}
      <div className="marquee-container">
        <div className="marquee-track">
          {doubled.map((sponsor, i) => (
            <SponsorCard key={`${sponsor.name}-${i}`} sponsor={sponsor} dark={dark} />
          ))}
        </div>
      </div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="max-w-4xl mx-auto mt-16 px-4"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { value: '₹5L+', label: 'Prize Pool' },
            { value: '20+', label: 'Partner Companies' },
            { value: '100+', label: 'Internships Offered' },
            { value: '50+', label: 'Goodies & Swags' },
          ].map(({ value, label }) => (
            <div key={label} className={`text-center p-4 rounded-xl ${
              dark ? 'bg-white/5' : 'bg-white shadow-sm'
            }`}>
              <div className="stat-number text-2xl sm:text-3xl">{value}</div>
              <p className={`text-xs mt-1 font-medium uppercase tracking-wider ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>
                {label}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
