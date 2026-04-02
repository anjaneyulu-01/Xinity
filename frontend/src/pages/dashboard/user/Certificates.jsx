import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, Linkedin, Award, Trophy, Loader2, ExternalLink } from 'lucide-react'
import { certificatesApi } from '../../../api/certificates'
import toast from 'react-hot-toast'

// Fallback mock certificates
const MOCK_CERTS = [
  { id: 'c1', event: 'WebX Challenge 2025', eventName: 'WebX Challenge 2025', rank: '3rd Place', date: '2025-04-12', color: '#f97316', icon: '🥉', type: 'winner' },
  { id: 'c2', event: 'AI Hack Sprint 2025', eventName: 'AI Hack Sprint 2025', rank: 'Participant', date: '2025-03-22', color: '#00e5ff', icon: '🎖️', type: 'participation' },
]

function CertCard({ cert, onDownload, onShare, downloading }) {
  const eventName = cert.eventName || cert.event
  const issuedDate = cert.issuedAt || cert.date

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
          <p className="font-heading font-bold text-white text-lg leading-tight">{eventName}</p>
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
          <Award size={11} /> Issued {new Date(issuedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => onDownload(cert)}
            disabled={downloading === cert.id}
            className="btn-ghost flex-1 justify-center text-xs py-2 disabled:opacity-50"
          >
            {downloading === cert.id ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
            {downloading === cert.id ? 'Downloading...' : 'Download PDF'}
          </button>
          <button
            onClick={() => onShare(cert)}
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
  const [certificates, setCertificates] = useState(MOCK_CERTS)
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(null)

  // Fetch certificates from API
  useEffect(() => {
    const fetchCertificates = async () => {
      setLoading(true)
      try {
        const data = await certificatesApi.getMyCertificates()
        if (data && data.length > 0) {
          setCertificates(data.map(c => ({
            ...c,
            color: c.type === 'winner' ? '#f97316' : c.type === 'runner-up' ? '#c0c0c0' : '#00e5ff',
            icon: c.type === 'winner' ? '🏆' : c.type === 'runner-up' ? '🥈' : '🎖️'
          })))
        }
      } catch (err) {
        console.log('Using mock certificates:', err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchCertificates()
  }, [])

  const handleDownload = async (cert) => {
    const certId = cert.id || cert._id
    setDownloading(certId)
    try {
      await certificatesApi.download(certId)
      toast.success('Certificate downloaded!')
    } catch (err) {
      // Create a simple downloadable certificate for demo
      const content = `
XINITY HACKATHON CERTIFICATE

This certifies that the participant has successfully
participated in ${cert.eventName || cert.event}

Achievement: ${cert.rank}
Date: ${new Date(cert.issuedAt || cert.date).toLocaleDateString()}

Verification ID: ${cert.verificationId || 'XINITY-' + certId}
      `.trim()
      
      const blob = new Blob([content], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `certificate-${certId}.txt`
      link.click()
      window.URL.revokeObjectURL(url)
      toast.success('Certificate downloaded!')
    } finally {
      setDownloading(null)
    }
  }

  const handleShare = (cert) => {
    const shareUrl = certificatesApi.getLinkedInShareUrl(
      cert.verificationId || cert.id,
      cert.rank,
      cert.eventName || cert.event
    )
    window.open(shareUrl, '_blank', 'width=600,height=600')
    toast.success('Opening LinkedIn...')
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading font-bold text-2xl text-white">Certificates</h1>
        <p className="text-[#94a3b8] text-sm mt-1">Your earned certificates and achievements</p>
      </div>

      {loading ? (
        <div className="glass-card border border-[#1e3a5f] p-16 flex flex-col items-center gap-4">
          <Loader2 size={36} className="text-[#00e5ff] animate-spin" />
          <p className="text-[#94a3b8]">Loading certificates...</p>
        </div>
      ) : certificates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certificates.map(c => (
            <CertCard 
              key={c.id || c._id} 
              cert={c} 
              onDownload={handleDownload}
              onShare={handleShare}
              downloading={downloading}
            />
          ))}
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
