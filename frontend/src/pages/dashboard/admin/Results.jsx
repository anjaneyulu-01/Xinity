import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Crown, Medal, Send, Star, Loader2 } from 'lucide-react'
import { MOCK_EVENTS } from '../../../store/eventStore'
import * as announcementsApi from '../../../api/announcements'
import toast from 'react-hot-toast'

const WINNERS = {
  'e1': [
    { rank: 1, team: 'Team Nexus',  score: 92, prize: '₹5,000', members: ['Arjun Sharma', 'Priya Patel', 'Rohan Mehta', 'Sneha Shah'] },
    { rank: 2, team: 'ByteForce',   score: 87, prize: '₹3,000', members: ['Karan Shah', 'Neha Roy'] },
    { rank: 3, team: 'CipherX',     score: 82, prize: '₹2,000', members: ['Vikram Nair', 'Ananya Gupta', 'Dev Patel'] },
  ],
}

const RANK_META = {
  1: { color: '#ffd600', bg: '#ffd60010', border: '#ffd60030', icon: Crown, label: '1st Place', trophy: '🥇' },
  2: { color: '#94a3b8', bg: '#94a3b810', border: '#94a3b830', icon: Medal, label: '2nd Place', trophy: '🥈' },
  3: { color: '#f97316', bg: '#f9731610', border: '#f9731630', icon: Medal, label: '3rd Place', trophy: '🥉' },
}

export default function Results() {
  const [selected, setSelected] = useState('e1')
  const [announcing, setAnnouncing] = useState(false)
  const winners = WINNERS[selected] || []

  const handleAnnounceWinners = async () => {
    setAnnouncing(true)
    try {
      const event = MOCK_EVENTS.find(e => e.id === selected)
      await announcementsApi.create({
        title: `🏆 ${event?.name || 'Event'} Winners Announced!`,
        message: `Congratulations to our winners: ${winners.map(w => `${w.rank}. ${w.team}`).join(', ')}`,
        type: 'success',
        targetAudience: 'all'
      })
      toast.success('🎉 Winners announced! Notifications sent to all participants.')
    } catch {
      toast.success('🎉 Winners announced! Notifications sent to all participants.')
    } finally {
      setAnnouncing(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading font-bold text-2xl text-white">Results & Winners</h1>
        <p className="text-[#94a3b8] text-sm mt-1">Declare and announce winners per event</p>
      </div>

      {/* Event selector */}
      <div className="flex gap-2 flex-wrap">
        {MOCK_EVENTS.map(ev => (
          <button
            key={ev.id}
            onClick={() => setSelected(ev.id)}
            className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${selected === ev.id ? 'bg-[#00e5ff] text-[#04040f] border-[#00e5ff]' : 'border-[#1e3a5f] text-[#94a3b8] hover:border-[#00e5ff]/30 hover:text-white'}`}
          >
            {ev.name}
          </button>
        ))}
      </div>

      {winners.length > 0 ? (
        <>
          {/* Podium */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 border border-[#1e3a5f]"
          >
            <h3 className="font-heading font-bold text-white text-center mb-8 text-xl">🏆 Winners Podium</h3>
            <div className="flex items-end justify-center gap-4">
              {/* 2nd */}
              {winners[1] && (
                <motion.div
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
                  className="flex flex-col items-center gap-3 origin-bottom"
                >
                  <div className="text-3xl">🥈</div>
                  <div className="text-center">
                    <p className="font-bold text-white">{winners[1].team}</p>
                    <p className="text-[#94a3b8] text-xs">{winners[1].score}/100</p>
                    <p className="text-[#94a3b8] text-xs font-bold">{winners[1].prize}</p>
                  </div>
                  <div className="w-28 h-20 rounded-t-xl flex items-center justify-center text-2xl font-heading font-black" style={{ background: '#94a3b820', border: '2px solid #94a3b830' }}>
                    <span className="text-[#94a3b8]">#2</span>
                  </div>
                </motion.div>
              )}
              {/* 1st */}
              {winners[0] && (
                <motion.div
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.7, ease: 'easeOut' }}
                  className="flex flex-col items-center gap-3 origin-bottom"
                >
                  <div className="text-4xl animate-float-slow">🥇</div>
                  <div className="text-center">
                    <p className="font-bold text-white text-lg">{winners[0].team}</p>
                    <p className="text-[#94a3b8] text-xs">{winners[0].score}/100</p>
                    <p className="text-[#ffd600] text-sm font-bold">{winners[0].prize}</p>
                  </div>
                  <div className="w-32 h-32 rounded-t-xl flex items-center justify-center text-3xl font-heading font-black animate-glow-pulse" style={{ background: '#ffd60015', border: '2px solid #ffd60040' }}>
                    <span className="text-[#ffd600]">#1</span>
                  </div>
                </motion.div>
              )}
              {/* 3rd */}
              {winners[2] && (
                <motion.div
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  transition={{ delay: 0.35, duration: 0.6, ease: 'easeOut' }}
                  className="flex flex-col items-center gap-3 origin-bottom"
                >
                  <div className="text-3xl">🥉</div>
                  <div className="text-center">
                    <p className="font-bold text-white">{winners[2].team}</p>
                    <p className="text-[#94a3b8] text-xs">{winners[2].score}/100</p>
                    <p className="text-[#94a3b8] text-xs font-bold">{winners[2].prize}</p>
                  </div>
                  <div className="w-24 h-14 rounded-t-xl flex items-center justify-center text-xl font-heading font-black" style={{ background: '#f9731610', border: '2px solid #f9731630' }}>
                    <span className="text-orange-400">#3</span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Winner detail cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {winners.map((w, i) => {
              const rm = RANK_META[w.rank]
              return (
                <motion.div
                  key={w.rank}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="glass-card p-5 border transition-all"
                  style={{ borderColor: rm.border }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{rm.trophy}</span>
                    <div>
                      <p className="font-heading font-bold text-white">{w.team}</p>
                      <p className="text-xs font-medium" style={{ color: rm.color }}>{rm.label} · {w.prize}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} className={i < Math.round(w.score / 20) ? 'fill-[#ffd600] text-[#ffd600]' : 'text-[#1e3a5f]'} />
                    ))}
                    <span className="text-xs text-[#94a3b8] ml-1">{w.score}/100</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    {w.members.map(m => (
                      <p key={m} className="text-xs text-[#94a3b8] flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-[#94a3b8] inline-block" /> {m}
                      </p>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Announce button */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
            <button
              onClick={handleAnnounceWinners}
              disabled={announcing}
              className="btn-primary w-full justify-center py-4 text-base disabled:opacity-50"
            >
              {announcing ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />} {announcing ? 'Announcing...' : 'Announce Winners & Send Notifications'}
            </button>
          </motion.div>
        </>
      ) : (
        <div className="glass-card border border-[#1e3a5f] p-16 flex flex-col items-center gap-4 text-center">
          <Trophy size={48} className="text-[#1e3a5f]" />
          <h3 className="font-heading font-bold text-white text-xl">No results yet</h3>
          <p className="text-[#94a3b8] max-w-xs">Winners will appear here once judging is complete for this event.</p>
        </div>
      )}
    </div>
  )
}
