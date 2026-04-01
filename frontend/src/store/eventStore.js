import { create } from 'zustand'

export const MOCK_EVENTS = [
  {
    id: 'e1', name: 'WebX Challenge 2026', type: 'Hackathon',
    date: '2026-04-10T09:00:00', endDate: '2026-04-11T18:00:00',
    venue: 'Marwadi University', prize: '₹10,000', maxTeams: 50,
    registered: 34, status: 'upcoming', featured: true,
    description: 'Build the future of the web in 48 hours.',
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'e2', name: 'AI Hack Sprint', type: 'Hackathon',
    date: '2026-05-15T09:00:00', endDate: '2026-05-16T18:00:00',
    venue: 'Online', prize: '₹8,000', maxTeams: 40,
    registered: 22, status: 'upcoming', featured: false,
    description: 'LLMs, RAG, agents — build the AI future.',
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    id: 'e3', name: 'DSA Bootcamp', type: 'Workshop',
    date: '2026-04-20T10:00:00', endDate: '2026-04-20T17:00:00',
    venue: 'MU Lab 3', prize: null, maxTeams: null,
    registered: 80, status: 'upcoming', featured: false,
    description: 'Intensive DSA problem-solving with industry mentors.',
    gradient: 'from-green-500 to-teal-600',
  },
  {
    id: 'e4', name: 'Open Source Summit', type: 'Talk',
    date: '2026-04-25T11:00:00', endDate: '2026-04-25T14:00:00',
    venue: 'Seminar Hall', prize: null, maxTeams: null,
    registered: 120, status: 'upcoming', featured: false,
    description: 'From zero to merged PR — your open source journey.',
    gradient: 'from-orange-500 to-red-600',
  },
]

export const MOCK_SUBMISSIONS = [
  {
    id: 's1', teamName: 'Team Nexus', projectName: 'AI Resume Builder',
    eventId: 'e1', eventName: 'WebX Challenge 2026',
    submittedAt: '2026-04-11T16:30:00', status: 'Under Review',
    githubUrl: '#', demoUrl: '#', score: null,
    feedback: null, techStack: ['React', 'Python', 'OpenAI'],
  },
  {
    id: 's2', teamName: 'Team Nexus', projectName: 'Eco Tracker',
    eventId: 'e2', eventName: 'AI Hack Sprint',
    submittedAt: '2026-03-20T14:00:00', status: 'Scored',
    githubUrl: '#', demoUrl: '#', score: 87,
    feedback: 'Excellent innovation. Minor UI polish needed.',
    techStack: ['Next.js', 'TensorFlow', 'Firebase'],
  },
]

export const MOCK_TEAMS = [
  {
    id: 't1', name: 'Team Nexus', eventId: 'e1',
    members: [
      { uid: 'u1', name: 'Arjun Sharma', role: 'leader', online: true },
      { uid: 'u2', name: 'Priya Patel',  role: 'member', online: true },
      { uid: 'u3', name: 'Rohan Mehta',  role: 'member', online: false },
      { uid: 'u4', name: 'Sneha Shah',   role: 'member', online: true },
    ],
    score: 2450, rank: 3,
  },
]

export const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Vikram Nair',    university: 'MU', points: 4200, badges: 8, avatar: null },
  { rank: 2, name: 'Ananya Roy',     university: 'MU', points: 3850, badges: 6, avatar: null },
  { rank: 3, name: 'Arjun Sharma',   university: 'MU', points: 2450, badges: 5, avatar: null },
  { rank: 4, name: 'Priya Patel',    university: 'MU', points: 2100, badges: 4, avatar: null },
  { rank: 5, name: 'Rohan Mehta',    university: 'MU', points: 1980, badges: 3, avatar: null },
]

export const MOCK_REVIEW_QUEUE = [
  {
    id: 'r1', teamName: 'ByteForce', projectName: 'Eco Carbon Tracker',
    eventName: 'WebX Challenge 2026', submittedAt: '2026-04-11T15:00:00',
    status: 'Pending', techStack: ['React', 'Node.js', 'MongoDB'],
    description: 'Real-time carbon footprint tracker with AI suggestions.',
    githubUrl: '#', demoUrl: '#',
  },
  {
    id: 'r2', teamName: 'CipherX', projectName: 'SafeKid AR App',
    eventName: 'WebX Challenge 2026', submittedAt: '2026-04-11T14:30:00',
    status: 'In Review', techStack: ['Unity', 'ARKit', 'Swift'],
    description: 'AR-powered child safety app with geofencing.',
    githubUrl: '#', demoUrl: '#',
  },
  {
    id: 'r3', teamName: 'DataDrive', projectName: 'Student Analytics Hub',
    eventName: 'WebX Challenge 2026', submittedAt: '2026-04-11T13:00:00',
    status: 'Reviewed', techStack: ['Python', 'FastAPI', 'React'],
    description: 'Predictive analytics dashboard for student performance.',
    githubUrl: '#', demoUrl: '#', score: 82,
  },
]

export const useEventStore = create((set, get) => ({
  events: MOCK_EVENTS,
  submissions: MOCK_SUBMISSIONS,
  teams: MOCK_TEAMS,
  leaderboard: MOCK_LEADERBOARD,
  reviewQueue: MOCK_REVIEW_QUEUE,

  getEvent: (id) => get().events.find(e => e.id === id),
  updateSubmissionStatus: (id, status) =>
    set(s => ({
      reviewQueue: s.reviewQueue.map(r => r.id === id ? { ...r, status } : r)
    })),
}))
