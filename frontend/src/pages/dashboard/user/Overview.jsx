import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Users, Upload, TrendingUp, ArrowRight, Clock, Zap, Target, Award, Star, Bell, Calendar, GitBranch, MessageSquare, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../../store/authStore'
import { MOCK_EVENTS, MOCK_SUBMISSIONS } from '../../../store/eventStore'
import { useRealtimeStore } from '../../../store/realtimeStore'
import AnimatedCounter from '../../../components/ui/AnimatedCounter'
import CountdownTimer from '../../../components/ui/CountdownTimer'
import { LiveActivityFeed, LiveLeaderboard, LiveStatsBar } from '../../../components/ui/LiveActivityFeed'
import { MetricCard, ProgressRing, SkillRadar } from '../../../components/charts/AdvancedCharts'
import { useTheme } from '../../../context/ThemeContext'

const STAT_CARDS = [
  { icon: Trophy,    label: 'Active Challenges', value: 2,    color: '#00e5ff', trend: '+1 this week', change: 50 },
  { icon: Users,     label: 'Team Members',      value: 4,    color: '#7c4dff', trend: 'Full team', change: 0 },
  { icon: Upload,    label: 'Submissions Made',  value: 2,    color: '#00e676', trend: 'All submitted', change: 100 },
  { icon: TrendingUp,label: 'Current Rank',      value: 3,    color: '#ffd600', trend: '↑ 2 places', change: 15 },
]

// Skills for radar chart
const USER_SKILLS = [
  { name: 'Frontend', value: 8.5, max: 10 },
  { name: 'Backend', value: 7, max: 10 },
  { name: 'Design', value: 6, max: 10 },
  { name: 'DevOps', value: 5, max: 10 },
  { name: 'Mobile', value: 4, max: 10 },
  { name: 'AI/ML', value: 6.5, max: 10 },
]

// Active goals
const GOALS = [
  { id: 1, title: 'Complete 5 hackathons', current: 3, target: 5, color: '#00e5ff' },
  { id: 2, title: 'Win a category prize', current: 0, target: 1, color: '#ffd600' },
  { id: 3, title: 'Score 80+ average', current: 76, target: 80, color: '#00e676' },
]

// Achievements/badges
const BADGES = [
  { id: 1, name: 'First Submission', icon: '🚀', earned: true, date: '2026-03-15' },
  { id: 2, name: 'Team Player', icon: '👥', earned: true, date: '2026-03-18' },
  { id: 3, name: 'Early Bird', icon: '🌅', earned: true, date: '2026-03-20' },
  { id: 4, name: 'High Scorer', icon: '⭐', earned: false },
  { id: 5, name: 'Winner', icon: '🏆', earned: false },
]

const card = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

export default function Overview() {
  const user = useAuthStore(s => s.user)
  const { dark } = useTheme()
  const { liveStats, connected } = useRealtimeStore()
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  // Calculate overall progress
  const overallProgress = Math.round((GOALS.reduce((sum, g) => sum + (g.current / g.target), 0) / GOALS.length) * 100)

  return (
    <div className="flex flex-col gap-6">
      {/* Live Stats Bar */}
      <LiveStatsBar dark={dark} />

      {/* Welcome banner with gamification */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`glass-card p-6 border relative overflow-hidden ${dark ? 'border-[#1e3a5f]' : 'border-gray-200'}`}
      >
        <div className="absolute right-0 top-0 bottom-0 w-1/3 pointer-events-none opacity-20"
          style={{ background: 'linear-gradient(270deg, #00e5ff, transparent)' }} />
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <p className={`text-sm mb-1 ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>{today}</p>
            <h1 className={`font-heading font-bold text-2xl sm:text-3xl ${dark ? 'text-white' : 'text-gray-900'}`}>
              Welcome back, {user?.name?.split(' ')[0]} 👋
            </h1>
            <div className="flex items-center gap-4 mt-2 flex-wrap">
              <span className={`flex items-center gap-2 text-sm ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>
                <Trophy size={16} className="text-[#ffd600]" />
                Ranked <span className="text-[#ffd600] font-bold">#3</span> on leaderboard
              </span>
              <span className={`flex items-center gap-2 text-sm ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>
                <Star size={16} className="text-[#7c4dff]" />
                <span className="text-[#7c4dff] font-bold">2,450</span> XP
              </span>
              <span className={`flex items-center gap-2 text-sm ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>
                <Award size={16} className="text-[#00e676]" />
                <span className="text-[#00e676] font-bold">3</span> badges earned
              </span>
            </div>
            <div className="flex gap-3 mt-4 flex-wrap">
              <Link to="/dashboard/user/submissions" className="btn-primary text-sm py-2 px-5">
                <Upload size={14} className="mr-1" /> New Submission
              </Link>
              <Link to="/dashboard/user/team" className="btn-ghost text-sm py-2 px-5">
                <Users size={14} className="mr-1" /> Find Team
              </Link>
            </div>
          </div>
          
          {/* Overall progress ring */}
          <div className="flex items-center gap-4">
            <ProgressRing value={overallProgress} max={100} size={100} color="auto" dark={dark} label="Goals" />
          </div>
        </div>
      </motion.div>

      {/* Stat cards with trends */}
      <motion.div
        initial="hidden" animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {STAT_CARDS.map(({ icon: Icon, label, value, color, trend, change }) => (
          <motion.div key={label} variants={card}>
            <MetricCard
              title={label}
              value={value}
              change={change}
              changeLabel={trend}
              icon={Icon}
              color={color}
              dark={dark}
              size="compact"
              trend={[40, 45, 42, 48, 52, 54, 60, 58, 65, value * 10]}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Goals & Badges section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Goals */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className={`glass-card p-5 border ${dark ? 'border-[#1e3a5f]' : 'border-gray-200'}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-heading font-bold flex items-center gap-2 ${dark ? 'text-white' : 'text-gray-900'}`}>
              <Target size={18} className="text-[#00e5ff]" /> Your Goals
            </h3>
            <span className={`text-xs px-2 py-1 rounded-full ${dark ? 'bg-white/5 text-[#94a3b8]' : 'bg-gray-100 text-gray-500'}`}>
              {GOALS.filter(g => g.current >= g.target).length}/{GOALS.length} complete
            </span>
          </div>
          <div className="flex flex-col gap-4">
            {GOALS.map(goal => {
              const percentage = Math.min((goal.current / goal.target) * 100, 100)
              return (
                <div key={goal.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm ${dark ? 'text-[#cbd5e1]' : 'text-gray-700'}`}>{goal.title}</span>
                    <span className="text-xs font-mono" style={{ color: goal.color }}>
                      {goal.current}/{goal.target}
                    </span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${dark ? 'bg-white/5' : 'bg-gray-100'}`}>
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      style={{ background: goal.color }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Badges */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.25 }}
          className={`glass-card p-5 border ${dark ? 'border-[#1e3a5f]' : 'border-gray-200'}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-heading font-bold flex items-center gap-2 ${dark ? 'text-white' : 'text-gray-900'}`}>
              <Award size={18} className="text-[#ffd600]" /> Badges
            </h3>
            <Link to="/dashboard/user/progress" className="text-xs text-[#00e5ff] hover:underline">View all</Link>
          </div>
          <div className="flex flex-wrap gap-3">
            {BADGES.map(badge => (
              <motion.div
                key={badge.id}
                whileHover={{ scale: 1.1, y: -2 }}
                className={`relative w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-all ${
                  badge.earned 
                    ? dark 
                      ? 'bg-[#ffd600]/10 border border-[#ffd600]/30' 
                      : 'bg-amber-50 border border-amber-200'
                    : dark
                      ? 'bg-white/5 border border-white/10 opacity-40 grayscale'
                      : 'bg-gray-100 border border-gray-200 opacity-40 grayscale'
                }`}
                title={badge.name}
              >
                {badge.icon}
                {badge.earned && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#00e676] flex items-center justify-center"
                  >
                    <span className="text-[8px]">✓</span>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Skills Radar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
          className={`glass-card p-5 border ${dark ? 'border-[#1e3a5f]' : 'border-gray-200'}`}
        >
          <h3 className={`font-heading font-bold flex items-center gap-2 mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
            <Zap size={18} className="text-[#7c4dff]" /> Skill Profile
          </h3>
          <div className="flex items-center justify-center">
            <SkillRadar skills={USER_SKILLS} size={180} color="#00e5ff" dark={dark} />
          </div>
        </motion.div>
      </div>

      {/* Three-column layout: Events, Leaderboard, Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming events */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.35 }} 
          className={`glass-card p-5 border ${dark ? 'border-[#1e3a5f]' : 'border-gray-200'}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-heading font-bold flex items-center gap-2 ${dark ? 'text-white' : 'text-gray-900'}`}>
              <Calendar size={18} className="text-[#00e5ff]" /> Upcoming Events
            </h3>
          </div>
          <div className="flex flex-col gap-3">
            {MOCK_EVENTS.slice(0, 3).map(ev => (
              <motion.div 
                key={ev.id} 
                whileHover={{ x: 4 }}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  dark ? 'bg-white/3 border-white/5 hover:border-[#00e5ff]/30' : 'bg-gray-50 border-gray-200 hover:border-blue-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-semibold text-sm ${dark ? 'text-white' : 'text-gray-900'}`}>{ev.name}</span>
                  <span className="text-xs font-code px-2 py-0.5 rounded-full bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/20">{ev.type}</span>
                </div>
                <CountdownTimer targetDate={ev.date} className="scale-75 -ml-2 origin-left" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Live Leaderboard */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.4 }}
        >
          <LiveLeaderboard dark={dark} limit={5} />
        </motion.div>

        {/* Live Activity Feed */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.45 }}
        >
          <LiveActivityFeed dark={dark} limit={5} />
        </motion.div>
      </div>

      {/* Quick actions - enhanced */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.5 }} 
        className={`glass-card p-5 border ${dark ? 'border-[#1e3a5f]' : 'border-gray-200'}`}
      >
        <h3 className={`font-heading font-bold mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Find Team', to: '/dashboard/user/team', color: '#7c4dff', icon: Users },
            { label: 'Browse Events', to: '/#events', color: '#00e5ff', icon: Calendar },
            { label: 'Submit Project', to: '/dashboard/user/submissions', color: '#00e676', icon: Upload },
            { label: 'View Progress', to: '/dashboard/user/progress', color: '#ffd600', icon: TrendingUp },
          ].map(({ label, to, color, icon: Icon }) => (
            <Link key={label} to={to}>
              <motion.div
                whileHover={{ y: -2, boxShadow: `0 8px 25px ${color}20` }}
                whileTap={{ scale: 0.98 }}
                className={`flex flex-col items-center gap-3 p-4 rounded-xl border transition-all ${
                  dark ? 'border-white/5 hover:border-current/30 bg-white/2' : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                }`}
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                >
                  <Icon size={22} style={{ color }} />
                </div>
                <span className={`text-sm font-medium ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>{label}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
