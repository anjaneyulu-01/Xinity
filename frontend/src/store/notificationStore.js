import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NOTIFICATION STORE — Real-time notifications for hackathon platform
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const NOTIFICATION_TYPES = {
  // Submission lifecycle
  SUBMISSION_RECEIVED: { icon: '📤', color: '#00e5ff', priority: 'high' },
  SUBMISSION_REVIEWED: { icon: '⭐', color: '#ffd600', priority: 'high' },
  SCORE_UPDATED: { icon: '📊', color: '#7c4dff', priority: 'high' },
  
  // Team notifications
  TEAM_INVITE: { icon: '👥', color: '#00e676', priority: 'high' },
  TEAM_JOIN: { icon: '🎉', color: '#00e676', priority: 'medium' },
  TEAM_LEAVE: { icon: '👋', color: '#ff4081', priority: 'medium' },
  TEAM_MESSAGE: { icon: '💬', color: '#00e5ff', priority: 'low' },
  
  // Event notifications
  EVENT_STARTING: { icon: '🚀', color: '#00e5ff', priority: 'urgent' },
  EVENT_ENDING: { icon: '⏰', color: '#ff4081', priority: 'urgent' },
  EVENT_RESULTS: { icon: '🏆', color: '#ffd600', priority: 'urgent' },
  NEW_EVENT: { icon: '📅', color: '#7c4dff', priority: 'medium' },
  
  // Judge notifications
  NEW_ASSIGNMENT: { icon: '📋', color: '#00e5ff', priority: 'high' },
  REVIEW_REMINDER: { icon: '⏳', color: '#ffd600', priority: 'medium' },
  
  // Admin notifications
  NEW_USER: { icon: '👤', color: '#00e676', priority: 'low' },
  NEW_SUBMISSION: { icon: '📥', color: '#00e5ff', priority: 'medium' },
  SYSTEM_ALERT: { icon: '⚠️', color: '#ff4081', priority: 'urgent' },
  
  // Achievements
  BADGE_EARNED: { icon: '🏅', color: '#ffd600', priority: 'medium' },
  RANK_UP: { icon: '📈', color: '#00e676', priority: 'high' },
  CERTIFICATE_READY: { icon: '🎓', color: '#7c4dff', priority: 'high' },
}

// Mock notifications for demo
const DEMO_NOTIFICATIONS = [
  {
    id: 'n1',
    type: 'SUBMISSION_REVIEWED',
    title: 'Your submission was reviewed!',
    message: 'Judge Sarah gave your project "AI Weather App" a score of 42/50',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    read: false,
    actionUrl: '/dashboard/submissions',
    meta: { projectName: 'AI Weather App', score: 42 }
  },
  {
    id: 'n2',
    type: 'TEAM_INVITE',
    title: 'Team invitation received',
    message: 'John Doe invited you to join "Code Crushers" for TechHack 2026',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    read: false,
    actionUrl: '/dashboard/team',
    meta: { teamName: 'Code Crushers', inviterId: 'u123' }
  },
  {
    id: 'n3',
    type: 'EVENT_STARTING',
    title: 'TechHack 2026 starts in 24 hours!',
    message: 'Get your team ready! The hackathon begins tomorrow at 9:00 AM',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionUrl: '/dashboard/challenges',
    meta: { eventId: 'e1', eventName: 'TechHack 2026' }
  },
  {
    id: 'n4',
    type: 'BADGE_EARNED',
    title: 'New badge unlocked! 🏅',
    message: 'You earned "First Submission" badge for submitting your first project',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionUrl: '/dashboard/progress',
    meta: { badgeId: 'first-submission', badgeName: 'First Submission' }
  },
  {
    id: 'n5',
    type: 'RANK_UP',
    title: 'Rank increased! 📈',
    message: 'You moved from #15 to #12 on the leaderboard',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionUrl: '/dashboard/progress',
    meta: { oldRank: 15, newRank: 12 }
  },
]

export const useNotificationStore = create(
  persist(
    (set, get) => ({
      notifications: DEMO_NOTIFICATIONS,
      unreadCount: DEMO_NOTIFICATIONS.filter(n => !n.read).length,
      isOpen: false,
      loading: false,
      
      // ── Actions ──────────────────────────────────────────────────────────
      
      setOpen: (isOpen) => set({ isOpen }),
      
      fetchNotifications: async (userId) => {
        set({ loading: true })
        // Simulate API delay
        await new Promise(r => setTimeout(r, 500))
        // In production: fetch from /api/notifications?userId=...
        set({ loading: false })
      },
      
      addNotification: (notification) => {
        const newNotif = {
          id: `n${Date.now()}`,
          timestamp: new Date().toISOString(),
          read: false,
          ...notification,
        }
        set(state => ({
          notifications: [newNotif, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }))
        return newNotif
      },
      
      markAsRead: (notificationId) => {
        set(state => ({
          notifications: state.notifications.map(n =>
            n.id === notificationId ? { ...n, read: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }))
      },
      
      markAllAsRead: () => {
        set(state => ({
          notifications: state.notifications.map(n => ({ ...n, read: true })),
          unreadCount: 0,
        }))
      },
      
      deleteNotification: (notificationId) => {
        set(state => {
          const notif = state.notifications.find(n => n.id === notificationId)
          return {
            notifications: state.notifications.filter(n => n.id !== notificationId),
            unreadCount: notif && !notif.read ? state.unreadCount - 1 : state.unreadCount,
          }
        })
      },
      
      clearAll: () => set({ notifications: [], unreadCount: 0 }),
      
      // ── Helper to get notification meta ──────────────────────────────────
      getNotificationMeta: (type) => NOTIFICATION_TYPES[type] || { 
        icon: '📌', color: '#94a3b8', priority: 'low' 
      },
      
      // ── Filter notifications ─────────────────────────────────────────────
      getUnread: () => get().notifications.filter(n => !n.read),
      getByType: (type) => get().notifications.filter(n => n.type === type),
      getRecent: (count = 5) => get().notifications.slice(0, count),
    }),
    {
      name: 'xinity-notifications',
      partialize: (state) => ({ notifications: state.notifications }),
    }
  )
)

export { NOTIFICATION_TYPES }
