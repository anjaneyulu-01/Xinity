import { useEffect, useState, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Wifi, WifiOff, RefreshCw, Users, Clock, Zap, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { useRealtimeStore } from '../../store/realtimeStore'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LIVE ACTIVITY FEED — Real-time activity stream
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function formatTimeAgo(timestamp) {
  const diff = Math.floor((Date.now() - timestamp) / 1000)
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

const ACTION_COLORS = {
  submission: '#00e5ff',
  score: '#ffd600',
  team: '#00e676',
  badge: '#7c4dff',
  event: '#ff4081',
  system: '#94a3b8',
}

const ActivityItem = forwardRef(function ActivityItem({ activity, dark }, ref) {
  const color = ACTION_COLORS[activity.type] || '#94a3b8'
  
  const getActionText = () => {
    switch (activity.type) {
      case 'submission': return <><span style={{ color }}>{activity.user}</span> submitted <span className="font-semibold">{activity.target}</span></>
      case 'score': return <><span style={{ color }}>{activity.user}</span> scored <span className="font-semibold">{activity.target}</span> <span className="text-[#ffd600] font-bold">{activity.score}/50</span></>
      case 'team': return <><span style={{ color }}>{activity.user}</span> joined <span className="font-semibold">{activity.target}</span></>
      case 'badge': return <><span style={{ color }}>{activity.user}</span> earned <span className="font-semibold">{activity.target}</span> badge</>
      case 'event': return <><span className="font-semibold">{activity.target}</span> has {activity.action}</>
      default: return <>{activity.user} {activity.action} {activity.target}</>
    }
  }
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20, height: 0 }}
      animate={{ opacity: 1, x: 0, height: 'auto' }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={`flex items-center gap-3 py-3 px-4 rounded-xl border transition-all ${
        dark 
          ? 'bg-white/[0.02] border-white/5 hover:border-white/10' 
          : 'bg-white border-gray-100 hover:border-gray-200 shadow-sm'
      }`}
    >
      {/* Avatar/Icon */}
      <div 
        className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
        style={{ background: `${color}15`, border: `1px solid ${color}30` }}
      >
        {activity.avatar}
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${dark ? 'text-[#cbd5e1]' : 'text-gray-600'}`}>
          {getActionText()}
        </p>
      </div>
      
      {/* Time */}
      <div className={`flex items-center gap-1 text-[10px] flex-shrink-0 ${
        dark ? 'text-[#94a3b8]/60' : 'text-gray-400'
      }`}>
        <Clock size={10} />
        {formatTimeAgo(activity.time)}
      </div>
    </motion.div>
  )
})

export function LiveActivityFeed({ dark = true, limit = 5, showHeader = true }) {
  const { activities, connected, reconnecting, refresh, startUpdates, stopUpdates } = useRealtimeStore()
  const [isPaused, setIsPaused] = useState(false)
  
  useEffect(() => {
    if (!isPaused) startUpdates()
    return () => stopUpdates()
  }, [isPaused])
  
  const displayActivities = activities.slice(0, limit)
  
  return (
    <div className={`rounded-2xl overflow-hidden ${
      dark ? 'bg-[#080d1a] border border-[#1e3a5f]' : 'bg-gray-50 border border-gray-200'
    }`}>
      {showHeader && (
        <div className={`flex items-center justify-between px-5 py-4 border-b ${
          dark ? 'border-white/10' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Activity size={18} className={dark ? 'text-[#00e5ff]' : 'text-blue-500'} />
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#00e676]"
              />
            </div>
            <h3 className={`font-heading font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
              Live Activity
            </h3>
            {connected && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#00e676]/10 text-[#00e676] border border-[#00e676]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e676] animate-pulse" />
                Live
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                dark 
                  ? 'hover:bg-white/10 text-[#94a3b8]' 
                  : 'hover:bg-gray-200 text-gray-500'
              }`}
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button
              onClick={refresh}
              disabled={reconnecting}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                dark ? 'hover:bg-white/10 text-[#94a3b8]' : 'hover:bg-gray-200 text-gray-500'
              }`}
            >
              <RefreshCw size={14} className={reconnecting ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      )}
      
      <div className="p-3 space-y-2 max-h-[400px] overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {displayActivities.map(activity => (
            <ActivityItem key={activity.id} activity={activity} dark={dark} />
          ))}
        </AnimatePresence>
        
        {displayActivities.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <Activity size={32} className={dark ? 'text-[#94a3b8]/30' : 'text-gray-300'} />
            <p className={`text-sm ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>
              No recent activity
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LIVE STATS BAR — Animated stats ticker
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function LiveStatsBar({ dark = true }) {
  const { liveStats, connected, lastSyncTime } = useRealtimeStore()
  const [prevStats, setPrevStats] = useState(liveStats)
  
  useEffect(() => {
    const timer = setTimeout(() => setPrevStats(liveStats), 1000)
    return () => clearTimeout(timer)
  }, [liveStats])
  
  const stats = [
    { 
      label: 'Online Now', 
      value: liveStats.onlineNow, 
      prev: prevStats.onlineNow,
      icon: Users, 
      color: '#00e676' 
    },
    { 
      label: 'Submissions', 
      value: liveStats.totalSubmissions, 
      prev: prevStats.totalSubmissions,
      icon: Zap, 
      color: '#00e5ff' 
    },
    { 
      label: 'Active Teams', 
      value: liveStats.activeTeams, 
      prev: prevStats.activeTeams,
      icon: Users, 
      color: '#7c4dff' 
    },
    { 
      label: 'Pending Reviews', 
      value: liveStats.pendingReviews, 
      prev: prevStats.pendingReviews,
      icon: Clock, 
      color: '#ffd600' 
    },
    { 
      label: 'Avg Score', 
      value: liveStats.avgScore.toFixed(1), 
      prev: prevStats.avgScore.toFixed(1),
      icon: Activity, 
      color: '#ff4081',
      suffix: '%'
    },
  ]
  
  return (
    <div className={`flex items-center gap-6 px-6 py-3 rounded-2xl overflow-x-auto ${
      dark ? 'bg-white/[0.02] border border-white/10' : 'bg-white border border-gray-200 shadow-sm'
    }`}>
      {/* Connection status */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {connected ? (
          <>
            <Wifi size={14} className="text-[#00e676]" />
            <span className="text-[10px] text-[#00e676] font-medium">Connected</span>
          </>
        ) : (
          <>
            <WifiOff size={14} className="text-[#ff4081]" />
            <span className="text-[10px] text-[#ff4081] font-medium">Offline</span>
          </>
        )}
      </div>
      
      <div className={`w-px h-6 ${dark ? 'bg-white/10' : 'bg-gray-200'}`} />
      
      {/* Stats */}
      {stats.map((stat, i) => {
        const Icon = stat.icon
        const diff = parseFloat(stat.value) - parseFloat(stat.prev)
        const hasChange = diff !== 0
        
        return (
          <div key={i} className="flex items-center gap-3 flex-shrink-0">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `${stat.color}15` }}
            >
              <Icon size={14} style={{ color: stat.color }} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <motion.span
                  key={stat.value}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className={`text-sm font-heading font-bold ${dark ? 'text-white' : 'text-gray-900'}`}
                >
                  {stat.value}{stat.suffix}
                </motion.span>
                {hasChange && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`flex items-center text-[10px] font-medium ${
                      diff > 0 ? 'text-[#00e676]' : 'text-[#ff4081]'
                    }`}
                  >
                    {diff > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  </motion.span>
                )}
              </div>
              <span className={`text-[10px] ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>
                {stat.label}
              </span>
            </div>
          </div>
        )
      })}
      
      {/* Last sync */}
      <div className={`ml-auto flex items-center gap-1 text-[10px] flex-shrink-0 ${
        dark ? 'text-[#94a3b8]/60' : 'text-gray-400'
      }`}>
        <Clock size={10} />
        Updated {formatTimeAgo(lastSyncTime)}
      </div>
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LIVE LEADERBOARD — Real-time rankings
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function LiveLeaderboard({ dark = true, limit = 5 }) {
  const { leaderboard } = useRealtimeStore()
  const displayTeams = leaderboard.slice(0, limit)
  
  const getRankColor = (rank) => {
    if (rank === 1) return '#ffd600'
    if (rank === 2) return '#94a3b8'
    if (rank === 3) return '#cd7f32'
    return dark ? '#94a3b8' : '#6b7280'
  }
  
  const getRankBg = (rank, dark) => {
    if (rank === 1) return dark ? 'bg-[#ffd600]/10 border-[#ffd600]/30' : 'bg-amber-50 border-amber-200'
    if (rank === 2) return dark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
    if (rank === 3) return dark ? 'bg-orange-500/10 border-orange-500/30' : 'bg-orange-50 border-orange-200'
    return dark ? 'bg-white/[0.02] border-white/5' : 'bg-white border-gray-100'
  }
  
  return (
    <div className={`rounded-2xl overflow-hidden ${
      dark ? 'bg-[#080d1a] border border-[#1e3a5f]' : 'bg-gray-50 border border-gray-200'
    }`}>
      <div className={`flex items-center justify-between px-5 py-4 border-b ${
        dark ? 'border-white/10' : 'border-gray-200'
      }`}>
        <div className="flex items-center gap-3">
          <span className="text-xl">🏆</span>
          <h3 className={`font-heading font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
            Live Leaderboard
          </h3>
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#00e676]/10 text-[#00e676] border border-[#00e676]/20"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e676]" />
            Updating
          </motion.span>
        </div>
      </div>
      
      <div className="p-3 space-y-2">
        <AnimatePresence mode="popLayout">
          {displayTeams.map((team, i) => (
            <motion.div
              key={team.teamName}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition-all ${getRankBg(team.rank, dark)}`}
            >
              {/* Rank */}
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center font-heading font-black text-sm"
                style={{ 
                  color: getRankColor(team.rank),
                  background: `${getRankColor(team.rank)}15`,
                }}
              >
                #{team.rank}
              </div>
              
              {/* Avatar */}
              <span className="text-xl">{team.avatar}</span>
              
              {/* Team name */}
              <div className="flex-1">
                <span className={`font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>
                  {team.teamName}
                </span>
              </div>
              
              {/* Change indicator */}
              <div className="flex items-center gap-1">
                {team.change > 0 && (
                  <motion.span 
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex items-center text-xs text-[#00e676] font-medium"
                  >
                    <TrendingUp size={12} /> +{team.change}
                  </motion.span>
                )}
                {team.change < 0 && (
                  <motion.span 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex items-center text-xs text-[#ff4081] font-medium"
                  >
                    <TrendingDown size={12} /> {team.change}
                  </motion.span>
                )}
                {team.change === 0 && (
                  <span className={`text-xs ${dark ? 'text-[#94a3b8]/50' : 'text-gray-400'}`}>
                    <Minus size={12} />
                  </span>
                )}
              </div>
              
              {/* Score */}
              <motion.div
                key={team.score}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="font-heading font-bold text-lg"
                style={{ color: getRankColor(team.rank) }}
              >
                {team.score}
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default LiveActivityFeed
