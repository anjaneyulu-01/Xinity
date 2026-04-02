import client from './client'

export const usersApi = {
  // Get all users (admin)
  getAll: async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.role) params.append('role', filters.role)
    if (filters.status) params.append('status', filters.status)
    const { data } = await client.get(`/users?${params}`)
    return data.data
  },

  // Get single user
  getById: async (id) => {
    const { data } = await client.get(`/users/${id}`)
    return data.data
  },

  // Update user
  update: async (id, updates) => {
    const { data } = await client.patch(`/users/${id}`, updates)
    return data.data
  },

  // Suspend user
  suspend: async (id) => {
    const { data } = await client.patch(`/users/${id}/suspend`)
    return data.data
  },

  // Reactivate user
  reactivate: async (id) => {
    const { data } = await client.patch(`/users/${id}/reactivate`)
    return data.data
  },

  // Send email to user
  sendEmail: async (id, subject, message) => {
    const { data } = await client.post(`/users/${id}/email`, { subject, message })
    return data
  },

  // Export users to CSV
  exportCsv: async (filters = {}) => {
    const params = new URLSearchParams(filters)
    const response = await client.get(`/users/export?${params}`, {
      responseType: 'blob'
    })
    // Trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `users-${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
    return true
  },

  // Change user role
  changeRole: async (id, newRole) => {
    const { data } = await client.patch(`/users/${id}/role`, { role: newRole })
    return data.data
  }
}
