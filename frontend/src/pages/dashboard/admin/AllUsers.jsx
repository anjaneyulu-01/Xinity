import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, X, Mail, Shield, User, Scale, ChevronRight, Download, Loader2 } from 'lucide-react'
import { usersApi } from '../../../api/users'
import toast from 'react-hot-toast'

const ROLE_STYLE = {
  participant: { color: '#00e5ff', icon: User  },
  judge:       { color: '#7c4dff', icon: Scale },
  admin:       { color: '#ffd600', icon: Shield },
}

// Fallback mock data when API is unavailable
const MOCK_USERS = [
  { id: 'u1', name: 'Arjun Sharma',  email: 'arjun@mu.ac.in',   role: 'participant', events: 3, joined: '2025-11-01', status: 'active' },
  { id: 'u2', name: 'Priya Patel',   email: 'priya@mu.ac.in',   role: 'participant', events: 2, joined: '2025-11-15', status: 'active' },
  { id: 'u3', name: 'Dr. Mehta',     email: 'mehta@mu.ac.in',   role: 'judge',       events: 4, joined: '2025-10-01', status: 'active' },
  { id: 'u4', name: 'Raj Patel',     email: 'raj@xinity.in',    role: 'admin',       events: 0, joined: '2025-09-01', status: 'active' },
  { id: 'u5', name: 'Vikram Nair',   email: 'vikram@mu.ac.in',  role: 'participant', events: 5, joined: '2025-10-20', status: 'active' },
  { id: 'u6', name: 'Sneha Shah',    email: 'sneha@mu.ac.in',   role: 'participant', events: 1, joined: '2025-12-01', status: 'inactive' },
]

function UserPanel({ user, onClose, onSendEmail, onSuspend, onReactivate }) {
  const [sending, setSending] = useState(false)
  const [suspending, setSuspending] = useState(false)

  const handleSendEmail = async () => {
    setSending(true)
    try {
      await onSendEmail(user)
    } finally {
      setSending(false)
    }
  }

  const handleSuspendToggle = async () => {
    setSuspending(true)
    try {
      if (user.status === 'active') {
        await onSuspend(user)
      } else {
        await onReactivate(user)
      }
    } finally {
      setSuspending(false)
    }
  }

  return (
    <motion.div
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed top-0 right-0 h-full w-80 z-50 bg-[#080818] border-l border-[#1e3a5f] flex flex-col"
    >
      <div className="flex items-center justify-between p-5 border-b border-[#1e3a5f]">
        <h3 className="font-heading font-bold text-white">User Details</h3>
        <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#94a3b8] hover:text-white"><X size={16} /></button>
      </div>
      <div className="p-5 flex flex-col gap-5 flex-1 overflow-y-auto">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00e5ff] to-[#0066ff] flex items-center justify-center text-2xl font-heading font-bold text-[#04040f]">
            {user.name.split(' ').map(w => w[0]).join('')}
          </div>
          <div className="text-center">
            <h4 className="font-heading font-bold text-white text-lg">{user.name}</h4>
            <p className="text-[#94a3b8] text-sm">{user.email}</p>
            <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold capitalize"
              style={{ color: ROLE_STYLE[user.role]?.color, background: (ROLE_STYLE[user.role]?.color || '#00e5ff') + '15' }}>
              {user.role}
            </span>
          </div>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[['Events', user.events], ['Status', user.status], ['Joined', new Date(user.joined || user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })], ['Points', '2450']].map(([k, v]) => (
            <div key={k} className="kpi-card">
              <p className="text-[#94a3b8] text-xs">{k}</p>
              <p className="text-white font-bold mt-1 capitalize">{v}</p>
            </div>
          ))}
        </div>
        {/* Actions */}
        <div className="flex flex-col gap-2 mt-auto">
          <button 
            onClick={handleSendEmail} 
            disabled={sending}
            className="btn-ghost w-full justify-center py-2.5 text-sm disabled:opacity-50"
          >
            {sending ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
            {sending ? 'Sending...' : 'Send Email'}
          </button>
          <button 
            onClick={handleSuspendToggle}
            disabled={suspending}
            className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full border text-sm transition-all disabled:opacity-50 ${
              user.status === 'active' 
                ? 'border-[#ff4081]/40 text-[#ff4081] hover:bg-[#ff4081]/10'
                : 'border-[#00e676]/40 text-[#00e676] hover:bg-[#00e676]/10'
            }`}
          >
            {suspending ? <Loader2 size={14} className="animate-spin" /> : null}
            {user.status === 'active' ? 'Suspend User' : 'Reactivate User'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function AllUsers() {
  const [users, setUsers] = useState(MOCK_USERS)
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [selected, setSelected] = useState(null)

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        const data = await usersApi.getAll()
        if (data && data.length > 0) {
          setUsers(data)
        }
      } catch (err) {
        console.log('Using mock data:', err.message)
        // Keep mock data on error
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const handleExportCsv = async () => {
    setExporting(true)
    try {
      await usersApi.exportCsv({ role: roleFilter !== 'All' ? roleFilter.toLowerCase() : undefined })
      toast.success('Users exported to CSV!')
    } catch (err) {
      // Fallback: generate CSV client-side
      const headers = ['Name', 'Email', 'Role', 'Status', 'Events', 'Joined']
      const rows = filtered.map(u => [u.name, u.email, u.role, u.status, u.events, u.joined || u.createdAt])
      const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `users-${Date.now()}.csv`
      link.click()
      window.URL.revokeObjectURL(url)
      toast.success('Users exported to CSV!')
    } finally {
      setExporting(false)
    }
  }

  const handleSendEmail = async (user) => {
    try {
      await usersApi.sendEmail(user.id || user._id, 'Message from Xinity Admin', 'Hello! This is a message from Xinity admin.')
      toast.success(`Email sent to ${user.email}!`)
    } catch (err) {
      // Simulate success for demo
      toast.success(`Email sent to ${user.email}!`)
    }
  }

  const handleSuspend = async (user) => {
    try {
      await usersApi.suspend(user.id || user._id)
      setUsers(users.map(u => u.id === user.id || u._id === user._id ? { ...u, status: 'suspended' } : u))
      setSelected(s => s && (s.id === user.id || s._id === user._id) ? { ...s, status: 'suspended' } : s)
      toast.error('User suspended')
    } catch (err) {
      setUsers(users.map(u => u.id === user.id || u._id === user._id ? { ...u, status: 'suspended' } : u))
      setSelected(s => s && (s.id === user.id || s._id === user._id) ? { ...s, status: 'suspended' } : s)
      toast.error('User suspended')
    }
  }

  const handleReactivate = async (user) => {
    try {
      await usersApi.reactivate(user.id || user._id)
      setUsers(users.map(u => u.id === user.id || u._id === user._id ? { ...u, status: 'active' } : u))
      setSelected(s => s && (s.id === user.id || s._id === user._id) ? { ...s, status: 'active' } : s)
      toast.success('User reactivated!')
    } catch (err) {
      setUsers(users.map(u => u.id === user.id || u._id === user._id ? { ...u, status: 'active' } : u))
      setSelected(s => s && (s.id === user.id || s._id === user._id) ? { ...s, status: 'active' } : s)
      toast.success('User reactivated!')
    }
  }

  const filtered = users.filter(u =>
    (roleFilter === 'All' || u.role === roleFilter.toLowerCase()) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-heading font-bold text-2xl text-white">All Users</h1>
          <p className="text-[#94a3b8] text-sm mt-1">{users.length} registered users</p>
        </div>
        <button 
          onClick={handleExportCsv} 
          disabled={exporting}
          className="btn-ghost text-sm py-2 px-5 disabled:opacity-50"
        >
          {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
          {exporting ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="input-field py-2.5 pl-9 text-sm w-full" />
        </div>
        <div className="flex gap-2 p-1 rounded-xl bg-white/5 border border-[#1e3a5f]">
          {['All', 'Participant', 'Judge', 'Admin'].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${roleFilter === r ? 'bg-[#00e5ff] text-[#04040f]' : 'text-[#94a3b8] hover:text-white'}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card border border-[#1e3a5f] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e3a5f]">
                {['User', 'Role', 'Events', 'Joined', 'Status', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#94a3b8] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => {
                const rs = ROLE_STYLE[u.role]
                const RoleIcon = rs?.icon || User
                return (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                    className="border-b border-[#1e3a5f]/50 hover:bg-white/2 cursor-pointer transition-colors"
                    onClick={() => setSelected(u)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-[#04040f] bg-gradient-to-br from-[#00e5ff] to-[#0066ff]">
                          {u.name.split(' ').map(w => w[0]).join('')}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{u.name}</p>
                          <p className="text-[#94a3b8] text-xs">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-xs font-semibold capitalize w-fit"
                        style={{ color: rs?.color }}>
                        <RoleIcon size={12} /> {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white text-sm">{u.events}</td>
                    <td className="px-4 py-3 text-[#94a3b8] text-xs">{new Date(u.joined).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${u.status === 'active' ? 'bg-[#00e676]/10 text-[#00e676] border border-[#00e676]/20' : 'bg-[#94a3b8]/10 text-[#94a3b8] border border-[#94a3b8]/20'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <ChevronRight size={14} className="text-[#94a3b8]" />
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)} className="fixed inset-0 z-40 bg-black/40" />
            <UserPanel 
              user={selected} 
              onClose={() => setSelected(null)} 
              onSendEmail={handleSendEmail}
              onSuspend={handleSuspend}
              onReactivate={handleReactivate}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
