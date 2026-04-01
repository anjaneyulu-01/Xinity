import { motion } from 'framer-motion'
import { Download, Linkedin, Award, Trophy } from 'lucide-react'
import toast from 'react-hot-toast'

const CERTS = [
  { id: 'c1', event: 'WebX Challenge 2025', rank: '3rd Place', date: '2025-04-12', color: '#f97316', icon: '🥉' },
  { id: 'c2', event: 'AI Hack Sprint 2025', rank: 'Participant', date: '2025-03-22', color: '#00e5ff', icon: '🎖️' },
]

function CertCard({ cert }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="glass-card border border-[#1e3a5f] hover:border-[#00e5ff]/30 transition-all overflow-hidden"
    >
      {/* Certificate preview */}
      <div className="h-44 flex flex-col items-center justify-center gap-3 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${cert.color}15, #080818)` }}>
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, ${cert.color}08 0, ${cert.color}08 1px, transparent 0, transparent 50%)`,
          backgroundSize: '20px 20px',
        }} />
        <div className="text-5xl relative z-10">{cert.icon}</div>
        <div className="relative z-10 text-center">
          <p className="font-heading font-bold text-white text-lg leading-tight">{cert.event}</p>
          <p className="font-code text-sm font-bold mt-1" style={{ color: cert.color }}>{cert.rank}</p>
        </div>
        <div className="absolute bottom-3 left-0 right-0 flex justify-center">
          <div className="flex gap-2 opacity-50">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-6 h-0.5 rounded-full" style={{ background: cert.color }} />
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4">
        <p className="text-[#94a3b8] text-xs mb-3 flex items-center gap-1">
          <Award size={11} /> Issued {new Date(cert.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => toast.success('Certificate downloaded!')}
            className="btn-ghost flex-1 justify-center text-xs py-2"
          >
            <Download size={12} /> Download PDF
          </button>
          <button
            onClick={() => toast.success('Opening LinkedIn...')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-[#0066ff]/40 text-[#0066ff] text-xs hover:bg-[#0066ff]/10 transition-all"
          >
            <Linkedin size={12} /> Share
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function Certificates() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading font-bold text-2xl text-white">Certificates</h1>
        <p className="text-[#94a3b8] text-sm mt-1">Your earned certificates and achievements</p>
      </div>

      {CERTS.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CERTS.map(c => <CertCard key={c.id} cert={c} />)}
        </div>
      ) : (
        <div className="glass-card border border-[#1e3a5f] p-16 flex flex-col items-center gap-4 text-center">
          <Trophy size={48} className="text-[#1e3a5f]" />
          <h3 className="font-heading font-bold text-white text-xl">No certificates yet</h3>
          <p className="text-[#94a3b8] max-w-xs">Participate in hackathons and win to earn your first certificate!</p>
        </div>
      )}
    </div>
  )
}
