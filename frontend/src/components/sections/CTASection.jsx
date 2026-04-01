import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Rocket, Sparkles } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

export default function CTASection() {
  const { dark } = useTheme()

  return (
    <section className={`py-24 relative overflow-hidden ${dark ? 'bg-[#04040f]' : 'bg-white'}`}>
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`blob blob-cyan w-[400px] h-[400px] top-1/2 left-1/4 -translate-y-1/2 ${dark ? 'opacity-30' : 'opacity-15'}`} />
        <div className={`blob blob-purple w-[350px] h-[350px] top-1/3 right-1/4 ${dark ? 'opacity-25' : 'opacity-12'}`} />
        <div className={`blob blob-blue w-[300px] h-[300px] bottom-0 left-1/2 -translate-x-1/2 ${dark ? 'opacity-20' : 'opacity-10'}`} />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid opacity-30" />

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className={`text-center p-10 sm:p-14 rounded-3xl border backdrop-blur-xl relative overflow-hidden ${
            dark 
              ? 'bg-gradient-to-br from-[#0d1b2e]/80 to-[#0a1628]/80 border-[#1e3a5f]' 
              : 'bg-gradient-to-br from-white/90 to-gray-50/90 border-gray-200 shadow-2xl'
          }`}
        >
          {/* Decorative gradient border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00e5ff] via-[#7c4dff] to-[#ff4081] rounded-t-3xl" />
          
          {/* Floating icons */}
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-8 left-8 opacity-20"
          >
            <Sparkles size={40} className={dark ? 'text-[#00e5ff]' : 'text-[#0066ff]'} />
          </motion.div>
          <motion.div
            animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute bottom-8 right-8 opacity-20"
          >
            <Rocket size={36} className={dark ? 'text-[#7c4dff]' : 'text-[#7c4dff]'} />
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 ${
              dark 
                ? 'border-[#ffd600]/30 bg-[#ffd600]/10 text-[#ffd600]'
                : 'border-[#d97706]/30 bg-[#fef3c7] text-[#d97706]'
            }`}
          >
            <span className="animate-pulse">🔥</span>
            <span className="text-sm font-medium">Limited Spots Available</span>
          </motion.div>

          {/* Main heading */}
          <h2 className={`font-heading font-bold text-3xl sm:text-4xl md:text-5xl mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
            Turn Bold Ideas into <br />
            <span className="gradient-text-animated">Real Impact</span>
          </h2>

          <p className={`text-base sm:text-lg mb-8 max-w-xl mx-auto ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>
            Build innovative projects, collaborate with top talent, and grow through India's hackathon-driven tech ecosystem.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="btn-primary text-base px-8 py-4 btn-glow btn-gradient-animated"
            >
              Join Now — It's Free <ArrowRight size={18} />
            </Link>
            <a 
              href="#events" 
              className="btn-ghost text-base px-8 py-4"
            >
              View Events
            </a>
          </div>

          {/* Trust badges */}
          <div className={`mt-10 pt-8 border-t flex flex-wrap items-center justify-center gap-6 ${
            dark ? 'border-white/10' : 'border-gray-200'
          }`}>
            {[
              { emoji: '🎓', text: '500+ Members' },
              { emoji: '🏆', text: '₹5L+ Prizes' },
              { emoji: '💼', text: '100+ Job Offers' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2">
                <span className="text-xl">{item.emoji}</span>
                <span className={`text-sm font-medium ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
