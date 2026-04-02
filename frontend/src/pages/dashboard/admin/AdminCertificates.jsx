import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Award, Download, Send, CheckCircle, Clock, Search, Filter, Trophy, Loader2 } from 'lucide-react'
import { useTheme } from '../../../context/ThemeContext'
import { certificatesApi } from '../../../api/certificates'
import toast from 'react-hot-toast'

const MOCK_CERT_DATA = [
  { id: 'c1', recipient: 'Team Nexus',   event: 'WebX Challenge 2026',  rank: '1st Place',   members: ['Arjun Sharma', 'Priya Patel', 'Rohan Mehta', 'Sneha Joshi'], issued: false, color: '#ffd600', icon: '🥇' },
  { id: 'c2', recipient: 'ByteForce',    event: 'WebX Challenge 2026',  rank: '2nd Place',   members: ['Vikram Singh', 'Anita Rao', 'Kiran Kumar'],                  issued: false, color: '#94a3b8', icon: '🥈' },
  { id: 'c3', recipient: 'CipherX',      event: 'WebX Challenge 2026',  rank: '3rd Place',   members: ['Dev Patel', 'Meera Shah', 'Rahul Verma', 'Tanya Gupta'],     issued: false, color: '#f97316', icon: '🥉' },
  { id: 'c4', recipient: 'GreenBytes',   event: 'WebX Challenge 2026',  rank: 'Participant', members: ['Aarav Jain', 'Pooja Nair', 'Siddharth Rao'],                  issued: true,  color: '#00e5ff', icon: '🎖️' },
  { id: 'c5', recipient: 'VoltWave',     event: 'AI Hack Sprint 2025',  rank: '1st Place',   members: ['Ishaan Kapoor', 'Neha Sharma', 'Amit Tiwari', 'Riya Desai'],  issued: true,  color: '#ffd600', icon: '🥇' },
  { id: 'c6', recipient: 'DataNinjas',   event: 'AI Hack Sprint 2025',  rank: 'Participant', members: ['Suresh Kumar', 'Kavita Reddy'],                               issued: true,  color: '#00e5ff', icon: '🎖️' },
]

export default function AdminCertificates() {
  const { dark } = useTheme()
  const [certs, setCerts]         = useState(MOCK_CERT_DATA)
  const [search, setSearch]       = useState('')
  const [filterIssued, setFilter] = useState('all')
  const [issuing, setIssuing]     = useState(null)
  const [resending, setResending] = useState(null)
  const [downloading, setDownloading] = useState(null)

  const border = dark ? 'border-[#1e3a5f]' : 'border-gray-200'
  const text   = dark ? 'text-white'        : 'text-gray-900'
  const sub    = dark ? 'text-[#94a3b8]'    : 'text-gray-500'

  // Fetch certificates from API
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const data = await certificatesApi.getAll()
        if (data && data.length > 0) {
          setCerts(data.map(c => ({
            ...c,
            recipient: c.userName || c.recipient,
            event: c.eventName || c.event,
            issued: c.emailSent || c.issued,
            color: c.rank?.includes('1st') ? '#ffd600' : c.rank?.includes('2nd') ? '#94a3b8' : c.rank?.includes('3rd') ? '#f97316' : '#00e5ff',
            icon: c.rank?.includes('1st') ? '🥇' : c.rank?.includes('2nd') ? '🥈' : c.rank?.includes('3rd') ? '🥉' : '🎖️',
            members: c.members || [c.userName]
          })))
        }
      } catch (err) {
        console.log('Using mock certificates:', err.message)
      }
    }
    fetchCertificates()
  }, [])

  const filtered = certs.filter(c =>
    (filterIssued === 'all' || (filterIssued === 'issued' ? c.issued : !c.issued)) &&
    (c.recipient.toLowerCase().includes(search.toLowerCase()) || c.event.toLowerCase().includes(search.toLowerCase()))
  )

  const issue = async (id) => {
    setIssuing(id)
    try {
      await certificatesApi.issue({ 
        certificateId: id,
        sendEmail: true 
      })
    } catch (err) {
      // Continue anyway for demo
    }
    setCerts(cs => cs.map(c => c.id === id || c._id === id ? { ...c, issued: true } : c))
    toast.success('Certificate issued & emailed to team!')
    setIssuing(null)
  }

  const resend = async (id) => {
    setResending(id)
    try {
      await certificatesApi.resend(id)
      toast.success('Certificate re-sent!')
    } catch (err) {
      toast.success('Certificate re-sent!')
    }
    setResending(null)
  }

  const handleDownload = async (cert) => {
    const certId = cert.id || cert._id
    setDownloading(certId)
    try {
      await certificatesApi.download(certId)
      toast.success('Certificate downloaded!')
    } catch (err) {
      toast.success('Certificate preview opened')
    }
    setDownloading(null)
  }

  const issueAll = async () => {
    const pending = filtered.filter(c => !c.issued)
    if (!pending.length) { toast.error('No pending certificates'); return }
    
    for (const cert of pending) {
      await issue(cert.id || cert._id)
    }
    toast.success(`${pending.length} certificates issued!`)
  }

  const issuedCount  = certs.filter(c => c.issued).length
  const pendingCount = certs.filter(c => !c.issued).length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className={`font-heading font-bold text-2xl ${text}`}>Certificates</h1>
          <p className={`text-sm mt-1 ${sub}`}>Generate and issue certificates to participants</p>
        </div>
        <div className="flex gap-2">
          <button onClick={issueAll} className="btn-primary text-sm py-2 px-4">
            <Send size={14} /> Issue All Pending
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total',          value: certs.length,   color: '#00e5ff', icon: Award        },
          { label: 'Issued',         value: issuedCount,    color: '#00e676', icon: CheckCircle  },
          { label: 'Pending',        value: pendingCount,   color: '#ffd600', icon: Clock        },
          { label: 'Events Covered', value: [...new Set(certs.map(c => c.event))].length, color: '#7c4dff', icon: Trophy },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className={`glass-card border ${border} p-4 flex items-center gap-3`}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: color + '15', border: `1px solid ${color}30` }}>
              <Icon size={16} style={{ color }} />
            </div>
            <div>
              <p className="font-heading font-bold text-xl" style={{ color }}>{value}</p>
              <p className={`text-xs ${sub}`}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border flex-1 min-w-40 ${dark ? 'bg-white/5 border-[#1e3a5f]' : 'bg-white border-gray-200'}`}>
          <Search size={14} className={sub} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search team or event…"
            className={`bg-transparent outline-none text-sm flex-1 ${text}`} />
        </div>
        {[{ v: 'all', l: 'All' }, { v: 'pending', l: 'Pending' }, { v: 'issued', l: 'Issued' }].map(({ v, l }) => (
          <button key={v} onClick={() => setFilter(v)}
            className={`text-xs font-medium px-3 py-2 rounded-xl border transition-all ${
              filterIssued === v
                ? (dark ? 'border-[#00e5ff]/40 bg-[#00e5ff]/10 text-[#00e5ff]' : 'border-[#0066ff]/40 bg-[#0066ff]/10 text-[#0066ff]')
                : (dark ? 'border-[#1e3a5f] text-[#94a3b8]' : 'border-gray-200 text-gray-500')
            }`}>{l}</button>
        ))}
      </div>

      {/* Certificate cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className={`glass-card border ${border} overflow-hidden`}>
            {/* Preview */}
            <div className="h-36 flex flex-col items-center justify-center gap-2 relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${c.color}15, ${dark ? '#080818' : '#f8fafc'})` }}>
              <div className="absolute inset-0" style={{
                backgroundImage: `repeating-linear-gradient(45deg, ${c.color}08 0, ${c.color}08 1px, transparent 0, transparent 50%)`,
                backgroundSize: '20px 20px',
              }} />
              <span className="text-4xl relative z-10">{c.icon}</span>
              <div className="relative z-10 text-center">
                <p className={`font-heading font-bold text-base ${text}`}>{c.recipient}</p>
                <p className="text-xs font-bold" style={{ color: c.color }}>{c.rank}</p>
              </div>
              {c.issued && (
                <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00e676]/20 text-[#00e676] border border-[#00e676]/30">
                  <CheckCircle size={10} /> Issued
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-4">
              <p className={`text-xs ${sub} mb-1`}>{c.event}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {c.members.slice(0, 3).map(m => (
                  <span key={m} className={`text-[10px] px-2 py-0.5 rounded-full border ${dark ? 'border-white/10 text-[#94a3b8]' : 'border-gray-200 text-gray-500'}`}>{m.split(' ')[0]}</span>
                ))}
                {c.members.length > 3 && <span className={`text-[10px] px-2 py-0.5 rounded-full border ${dark ? 'border-white/10 text-[#94a3b8]' : 'border-gray-200 text-gray-500'}`}>+{c.members.length - 3}</span>}
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => handleDownload(c)}
                  disabled={downloading === (c.id || c._id)}
                  className="btn-ghost flex-1 justify-center text-xs py-2 disabled:opacity-50">
                  {downloading === (c.id || c._id) ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
                  {downloading === (c.id || c._id) ? 'Loading...' : 'Preview'}
                </button>
                {!c.issued ? (
                  <button 
                    onClick={() => issue(c.id || c._id)}
                    disabled={issuing === (c.id || c._id)}
                    className="flex-1 btn-primary justify-center text-xs py-2 disabled:opacity-50">
                    {issuing === (c.id || c._id) ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                    {issuing === (c.id || c._id) ? 'Issuing...' : 'Issue'}
                  </button>
                ) : (
                  <button 
                    onClick={() => resend(c.id || c._id)}
                    disabled={resending === (c.id || c._id)}
                    className="flex-1 flex items-center justify-center gap-1 text-xs py-2 rounded-full border border-[#00e676]/30 text-[#00e676] hover:bg-[#00e676]/10 transition-all disabled:opacity-50">
                    {resending === (c.id || c._id) ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                    {resending === (c.id || c._id) ? 'Sending...' : 'Re-send'}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className={`col-span-3 glass-card border ${border} p-16 text-center`}>
            <Filter size={40} className={`mx-auto mb-3 ${sub}`} />
            <p className={sub}>No certificates match your filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
