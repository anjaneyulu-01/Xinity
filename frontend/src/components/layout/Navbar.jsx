import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useTheme } from '../../context/ThemeContext'
import logo from '../../assets/logo.jpeg'

const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'Events', href: '#events' },
  { label: 'Challenges', href: '#features' },
  { label: 'Leaderboard', href: '#leaderboard' },
  { label: 'Team', href: '#team' },
  { label: 'About', href: '#about' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const user = useAuthStore(s => s.user)
  const navigate = useNavigate()
  const { dark, toggle } = useTheme()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const dashMap = { admin: '/dashboard/admin', judge: '/dashboard/judge', participant: '/dashboard/user' }

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? dark 
            ? 'backdrop-blur-xl bg-black/60 border-b border-[#1e3a5f] shadow-[0_4px_30px_rgba(0,229,255,0.05)]'
            : 'backdrop-blur-xl bg-white/80 border-b border-gray-200 shadow-lg'
          : 'backdrop-blur-sm bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <img src={logo} alt="Xinity Logo" className="w-10 h-10 object-contain" />
          <span className={`font-heading font-bold text-xl ${dark ? 'text-white' : 'text-gray-900'} group-hover:text-[#00e5ff] transition-colors`}>
            X<span className="text-[#00e5ff]">inity</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                dark 
                  ? 'text-[#94a3b8] hover:text-[#00e5ff] hover:bg-white/5' 
                  : 'text-gray-600 hover:text-[#0066ff] hover:bg-gray-100'
              }`}
            >
              {label}
            </a>
          ))}
        </div>

        {/* CTA + Theme Toggle */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggle}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
              dark 
                ? 'bg-white/5 border border-[#1e3a5f] text-[#94a3b8] hover:text-[#ffd600] hover:border-[#ffd600]/40'
                : 'bg-gray-100 border border-gray-200 text-gray-600 hover:text-[#0066ff] hover:border-[#0066ff]/40'
            }`}
            title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <motion.div
              key={dark ? 'moon' : 'sun'}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </motion.div>
          </button>
          
          {user ? (
            <button
              onClick={() => navigate(dashMap[user.role] || '/')}
              className="btn-primary text-sm py-2 px-5"
            >
              Dashboard
            </button>
          ) : (
            <>
              <Link to="/login" className="btn-ghost text-sm py-2 px-5">Sign In</Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-5">Join Now</Link>
            </>
          )}
        </div>

        {/* Mobile buttons */}
        <div className="md:hidden flex items-center gap-2">
          {/* Theme Toggle Mobile */}
          <button
            onClick={toggle}
            className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-all ${
              dark 
                ? 'border-[#1e3a5f] text-[#94a3b8] hover:text-[#ffd600] hover:border-[#ffd600]'
                : 'border-gray-200 text-gray-600 hover:text-[#0066ff] hover:border-[#0066ff]'
            }`}
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          
          {/* Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-all ${
              dark
                ? 'border-[#1e3a5f] text-[#94a3b8] hover:text-[#00e5ff] hover:border-[#00e5ff]'
                : 'border-gray-200 text-gray-600 hover:text-[#0066ff] hover:border-[#0066ff]'
            }`}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={`md:hidden overflow-hidden border-t ${
              dark 
                ? 'bg-[#080818] border-[#1e3a5f]' 
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex flex-col gap-1 p-4">
              {NAV_LINKS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    dark 
                      ? 'text-[#94a3b8] hover:text-[#00e5ff] hover:bg-white/5' 
                      : 'text-gray-600 hover:text-[#0066ff] hover:bg-gray-50'
                  }`}
                >
                  {label}
                </a>
              ))}
              <div className={`flex flex-col gap-2 mt-3 pt-3 border-t ${dark ? 'border-[#1e3a5f]' : 'border-gray-200'}`}>
                {user ? (
                  <button onClick={() => { navigate(dashMap[user.role]); setOpen(false) }} className="btn-primary w-full justify-center text-sm">
                    Dashboard
                  </button>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setOpen(false)} className="btn-ghost w-full justify-center text-sm">Sign In</Link>
                    <Link to="/register" onClick={() => setOpen(false)} className="btn-primary w-full justify-center text-sm">Join Now</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
