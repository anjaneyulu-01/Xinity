import { create } from 'zustand'
import socketService from '../services/socket'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// REAL-TIME STORE — WebSocket + Simulation for live updates
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Simulated live data updates
const MOCK_LIVE_ACTIVITIES = [
  { id: 'a1', type: 'submission', user: 'Alex Chen', action: 'submitted', target: 'AI Health Assistant', time: Date.now() - 30000, avatar: '🧑‍💻' },
  { id: 'a2', type: 'score', user: 'Judge Sarah', action: 'scored', target: 'Smart City Platform', score: 45, time: Date.now() - 120000, avatar: '👩‍⚖️' },
  { id: 'a3', type: 'team', user: 'Maria Garcia', action: 'joined', target: 'Code Crushers', time: Date.now() - 300000, avatar: '👩‍💻' },
  { id: 'a4', type: 'event', user: 'System', action: 'started', target: 'TechHack 2026', time: Date.now() - 600000, avatar: '🚀' },
  { id: 'a5', type: 'badge', user: 'John Doe', action: 'earned', target: 'First Submission', time: Date.now() - 900000, avatar: '🏅' },
]

const ONLINE_USERS = [
  { id: 'u1', name: 'Alex Chen', avatar: null, role: 'participant', status: 'active', lastSeen: Date.now() },
  { id: 'u2', name: 'Sarah Miller', avatar: null, role: 'judge', status: 'active', lastSeen: Date.now() },
  { id: 'u3', name: 'John Doe', avatar: null, role: 'participant', status: 'idle', lastSeen: Date.now() - 300000 },
  { id: 'u4', name: 'Admin User', avatar: null, role: 'admin', status: 'active', lastSeen: Date.now() },
  { id: 'u5', name: 'Maria Garcia', avatar: null, role: 'participant', status: 'away', lastSeen: Date.now() - 600000 },
]

const LEADERBOARD_UPDATES = [
  { rank: 1, teamName: 'Neural Ninjas', score: 187, change: 0, avatar: '🥇' },
  { rank: 2, teamName: 'Code Crushers', score: 182, change: 2, avatar: '🥈' },
  { rank: 3, teamName: 'Byte Builders', score: 179, change: -1, avatar: '🥉' },
  { rank: 4, teamName: 'Data Dragons', score: 175, change: 1, avatar: '🐉' },
  { rank: 5, teamName: 'Pixel Pirates', score: 168, change: -2, avatar: '🏴‍☠️' },
]

export const useRealtimeStore = create((set, get) => ({
  // Connection state
  connected: true,
  reconnecting: false,
  lastSyncTime: Date.now(),
  
  // Live data
  activities: MOCK_LIVE_ACTIVITIES,
  onlineUsers: ONLINE_USERS,
  leaderboard: LEADERBOARD_UPDATES,
  
  // Stats that update in real-time
  liveStats: {
    totalSubmissions: 247,
    activeTeams: 89,
    onlineNow: 156,
    pendingReviews: 34,
    avgScore: 72.4,
    eventsLive: 3,
  },
  
  // ── Connection management ────────────────────────────────────────────────
  
  connect: (userData = null) => {
    // Try to connect to real WebSocket
    try {
      const socket = socketService.connect(userData)
      
      // Listen for real-time events from server
      socket.on('activity:new', (activity) => {
        get().addActivity(activity)
      })
      
      socket.on('leaderboard:update', (leaderboard) => {
        set({ leaderboard })
      })
      
      socket.on('stats:update', (stats) => {
        set(s => ({ liveStats: { ...s.liveStats, ...stats } }))
      })
      
      socket.on('presence:update', ({ userId, status }) => {
        get().setUserOnline(userId, status)
      })
      
      socket.on('connect', () => {
        set({ connected: true, reconnecting: false })
      })
      
      socket.on('disconnect', () => {
        set({ connected: false })
      })
      
    } catch (err) {
      console.warn('Socket connection failed, using simulation mode:', err)
    }
    
    // Start simulated updates as fallback/supplement
    set({ connected: true, reconnecting: false })
    get().startUpdates()
  },
  
  disconnect: () => {
    socketService.disconnect()
    set({ connected: false })
    get().stopUpdates()
  },
  
  // ── Simulated real-time updates ──────────────────────────────────────────
  
  _intervalId: null,
  
  startUpdates: () => {
    const intervalId = setInterval(() => {
      const state = get()
      
      // Simulate random stat changes
      set({
        lastSyncTime: Date.now(),
        liveStats: {
          ...state.liveStats,
          onlineNow: state.liveStats.onlineNow + Math.floor(Math.random() * 5) - 2,
          totalSubmissions: state.liveStats.totalSubmissions + (Math.random() > 0.7 ? 1 : 0),
          pendingReviews: Math.max(0, state.liveStats.pendingReviews + (Math.random() > 0.6 ? -1 : Math.random() > 0.9 ? 1 : 0)),
        }
      })
      
      // Occasionally add new activity
      if (Math.random() > 0.8) {
        const newActivity = generateRandomActivity()
        set(s => ({
          activities: [newActivity, ...s.activities].slice(0, 20)
        }))
      }
      
      // Update leaderboard positions occasionally
      if (Math.random() > 0.9) {
        set(s => ({
          leaderboard: s.leaderboard.map(team => ({
            ...team,
            score: team.score + Math.floor(Math.random() * 3),
            change: Math.floor(Math.random() * 3) - 1,
          })).sort((a, b) => b.score - a.score).map((t, i) => ({ ...t, rank: i + 1 }))
        }))
      }
    }, 5000) // Update every 5 seconds
    
    set({ _intervalId: intervalId })
  },
  
  stopUpdates: () => {
    const { _intervalId } = get()
    if (_intervalId) clearInterval(_intervalId)
    set({ _intervalId: null })
  },
  
  // ── Manual refresh ───────────────────────────────────────────────────────
  
  refresh: async () => {
    set({ reconnecting: true })
    await new Promise(r => setTimeout(r, 500))
    set({ reconnecting: false, lastSyncTime: Date.now() })
  },
  
  // ── Activity feed ────────────────────────────────────────────────────────
  
  addActivity: (activity) => {
    set(s => ({
      activities: [{ id: `a${Date.now()}`, time: Date.now(), ...activity }, ...s.activities].slice(0, 20)
    }))
  },
  
  // ── Online presence ──────────────────────────────────────────────────────
  
  setUserOnline: (userId, status = 'active') => {
    set(s => ({
      onlineUsers: s.onlineUsers.map(u =>
        u.id === userId ? { ...u, status, lastSeen: Date.now() } : u
      )
    }))
  },
  
  getOnlineCount: () => get().onlineUsers.filter(u => u.status === 'active').length,
}))

// Helper to generate random activities
function generateRandomActivity() {
  const types = ['submission', 'score', 'team', 'badge']
  const type = types[Math.floor(Math.random() * types.length)]
  const names = ['Alex', 'Maria', 'John', 'Sarah', 'David', 'Emma', 'Michael']
  const projects = ['AI Assistant', 'Smart City', 'Health App', 'EcoTracker', 'FinBot']
  const teams = ['Code Crushers', 'Neural Ninjas', 'Byte Builders', 'Data Dragons']
  const badges = ['First Submission', 'Team Player', 'Early Bird', 'High Scorer']
  
  const name = names[Math.floor(Math.random() * names.length)]
  
  switch (type) {
    case 'submission':
      return { id: `a${Date.now()}`, type, user: name, action: 'submitted', target: projects[Math.floor(Math.random() * projects.length)], time: Date.now(), avatar: '🧑‍💻' }
    case 'score':
      return { id: `a${Date.now()}`, type, user: `Judge ${name}`, action: 'scored', target: projects[Math.floor(Math.random() * projects.length)], score: 35 + Math.floor(Math.random() * 15), time: Date.now(), avatar: '👩‍⚖️' }
    case 'team':
      return { id: `a${Date.now()}`, type, user: name, action: 'joined', target: teams[Math.floor(Math.random() * teams.length)], time: Date.now(), avatar: '👥' }
    case 'badge':
      return { id: `a${Date.now()}`, type, user: name, action: 'earned', target: badges[Math.floor(Math.random() * badges.length)], time: Date.now(), avatar: '🏅' }
    default:
      return { id: `a${Date.now()}`, type: 'system', user: 'System', action: 'updated', target: 'platform', time: Date.now(), avatar: '⚙️' }
  }
}
