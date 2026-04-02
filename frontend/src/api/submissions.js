import client from './client'

export const submissionsApi = {
  // Get all submissions
  getAll: async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.status) params.append('status', filters.status)
    if (filters.eventName) params.append('eventName', filters.eventName)
    if (filters.judgeId) params.append('judgeId', filters.judgeId)
    const { data } = await client.get(`/submissions?${params}`)
    return data.data
  },

  // Get submission by ID
  getById: async (id) => {
    const { data } = await client.get(`/submissions/${id}`)
    return data.data
  },

  // Create submission
  create: async (submissionData) => {
    const { data } = await client.post('/submissions', submissionData)
    return data.data
  },

  // Get review queue for judge
  getQueue: async (judgeId) => {
    const { data } = await client.get(`/submissions/queue?judgeId=${judgeId}`)
    return data.data
  },

  // Update submission status
  updateStatus: async (id, status) => {
    const { data } = await client.patch(`/submissions/${id}/status`, { status })
    return data.data
  },

  // Assign judge to submission
  assignJudge: async (id, judgeId, judgeName) => {
    const { data } = await client.patch(`/submissions/${id}/assign`, { judgeId, judgeName })
    return data.data
  },

  // Score submission
  scoreSubmission: async (id, score, feedback) => {
    const { data } = await client.patch(`/submissions/${id}/score`, { score, feedback })
    return data.data
  }
}
