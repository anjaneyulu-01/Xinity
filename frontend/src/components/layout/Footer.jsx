import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { GitBranch, Linkedin, Instagram, Share2, Mail, ArrowRight } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import logo from '../../assets/logo.png'

const LINKS = {
  About:       [['About Xinity','#about'],['Our Mission','#'],['Core Team','#team'],['Contact','#']],
  'Quick Links':[['Events','#events'],['Leaderboard','#leaderboard'],['Register','#'],['Dashboard','#']],
  Events:      [['WebX Challenge','#'],['AI Hack Sprint','#'],['DSA Bootcamp','#'],['Open Source Summit','#']],
}

const SOCIALS = [
  { Icon: GitBranch,  href: '#', label: 'GitHub',    color: '#94a3b8' },
  { Icon: Linkedin,   href: '#', label: 'LinkedIn',   color: '#0066ff' },
  { Icon: Instagram,  href: '#', label: 'Instagram',  color: '#ff4081' },
  { Icon: Share2,     href: '#', label: 'Twitter',    color: '#00e5ff' },
  { Icon: Mail,       href: '#', label: 'Email',      color: '#00e676' },
]

export default function Footer() {
  const { dark } = useTheme()
  
  return (
    <footer id="about" className={`relative overflow-hidden border-t transition-colors duration-300 ${
      dark ? 'bg-[#080818] border-[#1e3a5f]' : 'bg-white border-gray-200'
    }`}>
      {/* Animated gradient line at very top */}
      <div className="h-px w-full" style={{
        background: 'linear-gradient(90deg, transparent, #00e5ff, #7c4dff, #0066ff, transparent)',
        animation: 'gradientX 4s ease infinite',
        backgroundSize: '300% 300%',
      }} />

      {/* Glow */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full blur-[80px] pointer-events-none ${
        dark ? 'bg-[#00e5ff]/3' : 'bg-[#0066ff]/5'
      }`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 w-fit group">
              <img src={logo} alt="Xinity Logo" className="w-9 h-9 object-cover rounded-2xl" />
              <span className={`font-heading font-bold text-2xl transition-colors ${dark ? 'text-white group-hover:text-[#00e5ff]' : 'text-gray-900 group-hover:text-[#0066ff]'}`}>
                X<span className={dark ? 'text-[#00e5ff]' : 'text-[#0066ff]'}>inity</span>
              </span>
            </Link>
            <p className={`text-sm leading-relaxed mb-6 max-w-xs ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>
              Xinity Hackathon Community — Building the next generation of developers at Marwadi University.
            </p>
            <div className="flex gap-3">
              {SOCIALS.map(({ Icon, href, label, color }) => (
                <motion.a
                  key={label}
                  href={href}
                  whileHover={{ y: -3, boxShadow: `0 0 20px ${color}60` }}
                  className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all duration-200 ${
                    dark 
                      ? 'border-[#1e3a5f] text-[#94a3b8]' 
                      : 'border-gray-200 text-gray-500'
                  }`}
                  style={{ '--hover-color': color }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = color + '60'; e.currentTarget.style.color = color }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = dark ? '#1e3a5f' : '#e5e7eb'; e.currentTarget.style.color = dark ? '#94a3b8' : '#6b7280' }}
                  title={label}
                >
                  <Icon size={15} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([heading, items]) => (
            <div key={heading}>
              <h4 className={`font-heading font-bold mb-4 text-sm ${dark ? 'text-white' : 'text-gray-900'}`}>{heading}</h4>
              <ul className="flex flex-col gap-2.5">
                {items.map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className={`text-sm transition-colors duration-200 flex items-center gap-1 group ${
                      dark 
                        ? 'text-[#94a3b8] hover:text-[#00e5ff]' 
                        : 'text-gray-600 hover:text-[#0066ff]'
                    }`}>
                      <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-3 group-hover:ml-0" />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className={`glass-card p-6 mb-10 flex flex-col sm:flex-row items-center gap-4 justify-between ${
          dark ? '' : 'border border-gray-200'
        }`}>
          <div>
            <h4 className={`font-heading font-bold mb-1 ${dark ? 'text-white' : 'text-gray-900'}`}>Stay in the loop</h4>
            <p className={`text-sm ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>Get notified about hackathons, workshops & results.</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="input-field flex-1 sm:w-64 py-2.5"
            />
            <button className="btn-primary py-2.5 px-5 text-sm whitespace-nowrap">Subscribe</button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t ${
          dark ? 'border-[#1e3a5f]' : 'border-gray-200'
        }`}>
          <p className={`text-xs ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>© 2026 Xinity Hackathon Community. All rights reserved.</p>
          <p className={`text-xs ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>Made with <span className="text-[#ff4081]">❤️</span> at Marwadi University</p>
        </div>
      </div>
    </footer>
  )
}
