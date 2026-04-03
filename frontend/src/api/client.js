import axios from 'axios'

// Determine API URL - check environment variable or use production URL
// Since this runs in the browser, we can check the current hostname at runtime
const API_BASE = import.meta.env.VITE_API_URL || 'https://xinity.onrender.com/api'

const client = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Override baseURL at runtime based on actual hostname
client.interceptors.request.use((config) => {
  // For local development, use localhost
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    config.baseURL = 'http://localhost:5001/api'
  }
  
  // Attach user ID to every request if available
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
