import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { usersApi } from '../api/users'
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
        
        // Check demo accounts first
        const demoAccount = DEMO_ACCOUNTS[email.toLowerCase()]
        if (demoAccount && demoAccount.password === password) {
          set({ user: demoAccount.data, loading: false })
          return { success: true, role: demoAccount.data.role }
        }
        
        // Try real API login
        try {
          const userData = await usersApi.login(email, password)
          set({ user: userData, loading: false })
          return { success: true, role: userData.role }
        } catch (err) {
          set({ loading: false, error: err.message || 'Invalid credentials' })
          return { success: false, error: err.message }
        }
      },

      register: async (formData) => {
        set({ loading: true, error: null })
        try {
          const userData = await usersApi.register(formData)
          set({ user: userData, loading: false })
          return { success: true, role: userData.role }
        } catch (err) {
          set({ loading: false, error: err.message || 'Registration failed' })
          return { success: false, error: err.message }
        }
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
