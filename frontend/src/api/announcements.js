import client from './client'

export const announcementsApi = {
  // Get all announcements
  getAll: async () => {
    const { data } = await client.get('/announcements')
    return data.data
  },

  // Get announcement by ID
  getById: async (id) => {
    const { data } = await client.get(`/announcements/${id}`)
    return data.data
  },

  // Create announcement (admin)
  create: async (announcementData) => {
    const { data } = await client.post('/announcements', announcementData)
    return data.data
  },

  // Update announcement (admin)
  update: async (id, updates) => {
    const { data } = await client.patch(`/announcements/${id}`, updates)
    return data.data
  },

  // Delete announcement (admin)
  delete: async (id) => {
    const { data } = await client.delete(`/announcements/${id}`)
    return data
  },

  // Publish announcement
  publish: async (id) => {
    const { data } = await client.patch(`/announcements/${id}/publish`)
    return data.data
  }
}
