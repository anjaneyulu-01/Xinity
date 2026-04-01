import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

const client = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
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
