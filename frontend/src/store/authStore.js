import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MOCK_USER, MOCK_JUDGE, MOCK_ADMIN } from '../lib/utils'

const DEMO_ACCOUNTS = {
  'admin@xinity.in':  { password: 'Admin@123', data: MOCK_ADMIN },
  'judge@xinity.in':  { password: 'Judge@123', data: MOCK_JUDGE },
  'user@xinity.in':   { password: 'User@123',  data: MOCK_USER  },
}

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      loading: false,
      error: null,

      login: async (email, password) => {
        set({ loading: true, error: null })
        await new Promise(r => setTimeout(r, 800)) // simulate network
        const account = DEMO_ACCOUNTS[email.toLowerCase()]
        if (account && account.password === password) {
          set({ user: account.data, loading: false })
          return { success: true, role: account.data.role }
        }
        set({ loading: false, error: 'Invalid credentials' })
        return { success: false }
      },

      loginDemo: (role) => {
        const map = { admin: MOCK_ADMIN, judge: MOCK_JUDGE, participant: MOCK_USER }
        set({ user: map[role] || MOCK_USER })
      },

      logout: () => set({ user: null }),
    }),
    { name: 'xinity-auth', partialize: (s) => ({ user: s.user }) }
  )
)
