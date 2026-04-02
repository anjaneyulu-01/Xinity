import client from './client'

export const eventsApi = {
  // Get all events
  getAll: async () => {
    const { data } = await client.get('/events')
    return data.data
  },

  // Get single event
  getById: async (id) => {
    const { data } = await client.get(`/events/${id}`)
    return data.data
  },

  // Create event (admin)
  create: async (eventData) => {
    const { data } = await client.post('/events', eventData)
    return data.data
  },

  // Update event (admin)
  update: async (id, updates) => {
    const { data } = await client.patch(`/events/${id}`, updates)
    return data.data
  },

  // Delete event (admin)
  delete: async (id) => {
    const { data } = await client.delete(`/events/${id}`)
    return data
  },

  // Update event status
  updateStatus: async (id, status) => {
    const { data } = await client.patch(`/events/${id}/status`, { status })
    return data.data
  },

  // Register for event
  register: async (eventId, registrationData) => {
    const { data } = await client.post(`/events/${eventId}/register`, registrationData)
    return data.data
  },

  // Get event registrations
  getRegistrations: async (eventId) => {
    const { data } = await client.get(`/events/${eventId}/registrations`)
    return data.data
  },

  // Get event statistics (admin)
  getStats: async (eventId) => {
    const { data } = await client.get(`/events/${eventId}/stats`)
    return data.data
  }
}
