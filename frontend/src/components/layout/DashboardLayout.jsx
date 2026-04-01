import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Search, ChevronDown, LogOut, Zap, Menu, X } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useTheme } from '../../context/ThemeContext'
import toast from 'react-hot-toast'

function Avatar({ name, size = 8 }) {
  const initials = name ? name.split(' ').map(w => w[0]).join('').slice(0, 2) : '??'
  return (
    <div className={`w-${size} h-${size} rounded-full bg-gradient-to-br from-[#00e5ff] to-[#0066ff] flex items-center justify-center text-[#04040f] font-bold text-xs flex-shrink-0`}>
      {initials}
    </div>
  )
}

export default function DashboardLayout({ sidebar, children }) {
  const [expanded, setExpanded] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const user = useAuthStore(s => s.user)
  const logout = useAuthStore(s => s.logout)
  const { dark } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Signed out')
    navigate('/login')
  }

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${dark ? 'bg-[#04040f]' : 'bg-gray-100'}`}>
      {/* Sidebar — desktop */}
      <motion.aside
        animate={{ width: expanded ? 240 : 64 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className={`hidden lg:flex flex-col fixed top-0 left-0 h-full z-40 border-r overflow-hidden transition-colors duration-300 ${dark ? 'bg-[#080818] border-[#1e3a5f]' : 'bg-white border-gray-200'}`}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 px-4 h-16 border-b flex-shrink-0 ${dark ? 'border-[#1e3a5f]' : 'border-gray-200'}`}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00e5ff] to-[#0066ff] flex items-center justify-center flex-shrink-0 animate-glow-pulse">
            <Zap size={14} className={dark ? 'text-[#04040f]' : 'text-white'} />
          </div>
          <AnimatePresence>
            {expanded && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className={`font-heading font-bold text-lg whitespace-nowrap overflow-hidden ${dark ? 'text-white' : 'text-gray-900'}`}
              >
                X<span className={dark ? 'text-[#00e5ff]' : 'text-[#0066ff]'}>inity</span>
              </motion.span>
            )}
          </AnimatePresence>
          <button
            onClick={() => setExpanded(!expanded)}
            className={`ml-auto w-7 h-7 rounded-lg flex items-center justify-center transition-all flex-shrink-0 ${dark ? 'text-[#94a3b8] hover:text-[#00e5ff] hover:bg-white/5' : 'text-gray-500 hover:text-[#0066ff] hover:bg-gray-100'}`}
          >
            <Menu size={14} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 flex flex-col gap-1">
          {sidebar.map(({ icon: Icon, label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to.endsWith('/user') || to.endsWith('/judge') || to.endsWith('/admin')}
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
              title={!expanded ? label : undefined}
            >
              <Icon size={18} className="flex-shrink-0" />
              <AnimatePresence>
                {expanded && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="truncate"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </nav>

        {/* User info bottom */}
        <div className={`p-3 border-t ${dark ? 'border-[#1e3a5f]' : 'border-gray-200'}`}>
          <button
            onClick={handleLogout}
            className="sidebar-item w-full text-[#ff4081] hover:bg-[#ff4081]/10 hover:text-[#ff4081]"
            title={!expanded ? 'Logout' : undefined}
          >
            <LogOut size={16} className="flex-shrink-0" />
            {expanded && <span className="truncate">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`lg:hidden fixed top-0 left-0 h-full w-60 z-50 border-r flex flex-col transition-colors duration-300 ${dark ? 'bg-[#080818] border-[#1e3a5f]' : 'bg-white border-gray-200'}`}
            >
              <div className={`flex items-center gap-3 px-4 h-16 border-b ${dark ? 'border-[#1e3a5f]' : 'border-gray-200'}`}>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00e5ff] to-[#0066ff] flex items-center justify-center"><Zap size={14} className={dark ? 'text-[#04040f]' : 'text-white'} /></div>
                <span className={`font-heading font-bold text-lg ${dark ? 'text-white' : 'text-gray-900'}`}>X<span className={dark ? 'text-[#00e5ff]' : 'text-[#0066ff]'}>inity</span></span>
                <button onClick={() => setMobileOpen(false)} className={dark ? 'ml-auto text-[#94a3b8]' : 'ml-auto text-gray-500'}><X size={18} /></button>
              </div>
              <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
                {sidebar.map(({ icon: Icon, label, to }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={18} />
                    <span>{label}</span>
                  </NavLink>
                ))}
              </nav>
              <div className={`p-3 border-t ${dark ? 'border-[#1e3a5f]' : 'border-gray-200'}`}>
                <button onClick={handleLogout} className="sidebar-item w-full text-[#ff4081] hover:bg-[#ff4081]/10">
                  <LogOut size={16} /><span>Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen" style={{ marginLeft: expanded ? '240px' : '64px' }} id="dash-main">
        {/* Topbar */}
        <header className={`h-16 flex items-center gap-4 px-4 sm:px-6 border-b backdrop-blur-xl sticky top-0 z-30 transition-colors duration-300 ${dark ? 'border-[#1e3a5f] bg-[#080818]/80' : 'border-gray-200 bg-white/80'}`}>
          <button onClick={() => setMobileOpen(true)} className={`lg:hidden transition-colors ${dark ? 'text-[#94a3b8] hover:text-[#00e5ff]' : 'text-gray-500 hover:text-[#0066ff]'}`}>
            <Menu size={20} />
          </button>
          {/* Search */}
          <div className="relative flex-1 max-w-sm hidden sm:block">
            <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${dark ? 'text-[#94a3b8]' : 'text-gray-400'}`} />
            <input placeholder="Search..." className="input-field py-2 pl-9 text-sm" />
          </div>
          <div className="ml-auto flex items-center gap-3">
            {/* Bell */}
            <button className={`relative w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${dark ? 'border-[#1e3a5f] text-[#94a3b8] hover:text-[#00e5ff] hover:border-[#00e5ff]/30' : 'border-gray-200 text-gray-500 hover:text-[#0066ff] hover:border-[#0066ff]/30'}`}>
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ff4081]" />
            </button>
            {/* User dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropOpen(!dropOpen)}
                className={`flex items-center gap-2 py-1.5 px-3 rounded-xl border transition-all ${dark ? 'border-[#1e3a5f] hover:border-[#00e5ff]/30' : 'border-gray-200 hover:border-[#0066ff]/30'}`}
              >
                <Avatar name={user?.name} size={7} />
                <span className={`text-sm font-medium hidden sm:block ${dark ? 'text-white' : 'text-gray-900'}`}>{user?.name?.split(' ')[0]}</span>
                <ChevronDown size={14} className={dark ? 'text-[#94a3b8]' : 'text-gray-400'} />
              </button>
              <AnimatePresence>
                {dropOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className={`absolute right-0 top-full mt-2 w-52 glass-card border p-2 z-50 ${dark ? 'border-[#1e3a5f]' : 'border-gray-200 shadow-lg'}`}
                  >
                    <div className={`px-3 py-2 mb-1 border-b ${dark ? 'border-[#1e3a5f]' : 'border-gray-200'}`}>
                      <p className={`text-sm font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>{user?.name}</p>
                      <p className={`text-xs ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>{user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-code capitalize" style={{ background: '#00e5ff15', color: '#00e5ff' }}>{user?.role}</span>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#ff4081] hover:bg-[#ff4081]/10 transition-all">
                      <LogOut size={14} /> Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
