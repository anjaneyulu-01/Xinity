import client from './client'

export const certificatesApi = {
  // Get my certificates
  getMyCertificates: async () => {
    const { data } = await client.get('/certificates/my')
    return data.data
  },

  // Get all certificates (admin)
  getAll: async () => {
    const { data } = await client.get('/certificates')
    return data.data
  },

  // Get certificate by ID
  getById: async (id) => {
    const { data } = await client.get(`/certificates/${id}`)
    return data.data
  },

  // Download certificate
  download: async (id, format = 'pdf') => {
    const response = await client.get(`/certificates/${id}/download?format=${format}`, {
      responseType: 'blob'
    })
    // Trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `certificate-${id}.${format}`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
    return true
  },

  // Get LinkedIn share URL
  getLinkedInShareUrl: (certificateId, title, eventName) => {
    const certUrl = `${window.location.origin}/certificates/verify/${certificateId}`
    const text = `I earned a ${title} certificate at ${eventName} via @XinityHacks! 🏆`
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certUrl)}&summary=${encodeURIComponent(text)}`
  },

  // Issue certificate (admin)
  issue: async (certificateData) => {
    const { data } = await client.post('/certificates', certificateData)
    return data.data
  },

  // Resend certificate email
  resend: async (id) => {
    const { data } = await client.post(`/certificates/${id}/resend`)
    return data
  },

  // Verify certificate
  verify: async (certificateId) => {
    const { data } = await client.get(`/certificates/verify/${certificateId}`)
    return data.data
  }
}
