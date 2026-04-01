import { Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'
import { useTheme } from './context/ThemeContext'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import UserDashboard from './pages/dashboard/user/UserDashboard'
import JudgeDashboard from './pages/dashboard/judge/JudgeDashboard'
import AdminDashboard from './pages/dashboard/admin/AdminDashboard'

function ProtectedRoute({ children, requiredRole }) {
  const user = useAuthStore(s => s.user)
  if (!user) return <Navigate to="/login" replace />
  if (requiredRole && user.role !== requiredRole) {
    const map = { admin: '/dashboard/admin', judge: '/dashboard/judge', participant: '/dashboard/user', }
    return <Navigate to={map[user.role] || '/'} replace />
  }
  return children
}

export default function App() {
  const { dark } = useTheme()
  
  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? 'bg-[#04040f] text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: dark ? '#0d1b2e' : '#ffffff',
            color: dark ? '#fff' : '#1f2937',
            border: `1px solid ${dark ? '#1e3a5f' : '#e5e7eb'}`,
            borderRadius: '12px',
          },
          success: { iconTheme: { primary: '#00e676', secondary: dark ? '#04040f' : '#ffffff' } },
          error:   { iconTheme: { primary: '#ff4081', secondary: dark ? '#04040f' : '#ffffff' } },
        }}
      />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard/user/*" element={
            <ProtectedRoute requiredRole="participant"><UserDashboard /></ProtectedRoute>
          } />
          <Route path="/dashboard/judge/*" element={
            <ProtectedRoute requiredRole="judge"><JudgeDashboard /></ProtectedRoute>
          } />
          <Route path="/dashboard/admin/*" element={
            <ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}
