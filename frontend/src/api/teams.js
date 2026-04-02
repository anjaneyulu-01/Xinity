import client from './client'

export const teamsApi = {
  // Get all teams
  getAll: async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.eventId) params.append('eventId', filters.eventId)
    if (filters.openOnly) params.append('openOnly', 'true')
    const { data } = await client.get(`/teams?${params}`)
    return data.data
  },

  // Get team by ID
  getById: async (id) => {
    const { data } = await client.get(`/teams/${id}`)
    return data.data
  },

  // Get my team
  getMyTeam: async () => {
    const { data } = await client.get('/teams/my')
    return data.data
  },

  // Create team
  create: async (teamData) => {
    const { data } = await client.post('/teams', teamData)
    return data.data
  },

  // Update team
  update: async (id, updates) => {
    const { data } = await client.patch(`/teams/${id}`, updates)
    return data.data
  },

  // Send join request
  sendJoinRequest: async (teamId) => {
    const { data } = await client.post(`/teams/${teamId}/join-request`)
    return data
  },

  // Accept join request (leader only)
  acceptJoinRequest: async (teamId, userId) => {
    const { data } = await client.post(`/teams/${teamId}/accept`, { userId })
    return data.data
  },

  // Reject join request (leader only)
  rejectJoinRequest: async (teamId, userId) => {
    const { data } = await client.post(`/teams/${teamId}/reject`, { userId })
    return data
  },

  // Leave team
  leave: async (teamId) => {
    const { data } = await client.post(`/teams/${teamId}/leave`)
    return data
  },

  // Generate invite link
  getInviteLink: async (teamId) => {
    const { data } = await client.get(`/teams/${teamId}/invite`)
    return data.inviteLink
  },

  // Join via invite link
  joinViaInvite: async (inviteCode) => {
    const { data } = await client.post(`/teams/join/${inviteCode}`)
    return data.data
  },

  // Remove member (leader only)
  removeMember: async (teamId, userId) => {
    const { data } = await client.delete(`/teams/${teamId}/members/${userId}`)
    return data
  }
}
