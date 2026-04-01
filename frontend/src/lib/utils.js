import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date))
}

export function formatCountdown(ms) {
  if (ms <= 0) return { d: '00', h: '00', m: '00', s: '00' }
  const totalSeconds = Math.floor(ms / 1000)
  const d = Math.floor(totalSeconds / 86400)
  const h = Math.floor((totalSeconds % 86400) / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  const pad = (n) => String(n).padStart(2, '0')
  return { d: pad(d), h: pad(h), m: pad(m), s: pad(s) }
}

export const MOCK_USER = {
  uid: 'u1', name: 'Arjun Sharma', email: 'user@xinity.in',
  role: 'participant', university: 'Marwadi University',
  avatar: null, points: 2450, rank: 7,
  badges: ['early-bird', 'team-player', 'first-submission'],
}

export const MOCK_JUDGE = {
  uid: 'j1', name: 'Dr. Priya Mehta', email: 'judge@xinity.in',
  role: 'judge', university: 'Marwadi University',
  avatar: null, reviewsDone: 14, reviewsPending: 6,
}

export const MOCK_ADMIN = {
  uid: 'a1', name: 'Raj Patel', email: 'admin@xinity.in',
  role: 'admin', university: 'Marwadi University', avatar: null,
}
