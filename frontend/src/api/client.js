import axios from 'axios'

// Auto-detect API URL based on environment
const getApiUrl = () => {
  // Check for environment variable first
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  
  // Auto-detect production environment
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    // If deployed on Render
    if (hostname === 'xinity-1.onrender.com') {
      return 'https://xinity.onrender.com/api'
    }
  }
  
  // Default to localhost for development
  return 'http://localhost:5001/api'
}

const API_BASE = getApiUrl()

const client = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach judge/user ID to every request if available
client.interceptors.request.use((config) => {
  try {
    const auth = JSON.parse(localStorage.getItem('xinity-auth') || '{}')
    const user = auth?.state?.user
    if (user?.uid) config.headers['X-User-Id']   = user.uid
    if (user?.role) config.headers['X-User-Role'] = user.role
  } catch (_) {}
  return config
})

// Global error normalisation
client.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.error || err.message || 'Network error'
    return Promise.reject(new Error(message))
  }
)

export default client
