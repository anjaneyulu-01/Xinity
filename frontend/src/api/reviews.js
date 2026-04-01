import client from './client.js'

export const reviewsApi = {
  /** Fetch all submissions assigned to judge that are still Pending/In Review */
  getQueue: (judgeId) =>
    client.get('/submissions/queue', { params: { judgeId } }).then(r => r.data.data),

  /** Fetch completed reviews by this judge */
  getCompleted: (judgeId) =>
    client.get('/reviews', { params: { judgeId } }).then(r => r.data.data),

  /** Fetch stats: done, pending, avgScore */
  getStats: (judgeId) =>
    client.get('/reviews/stats', { params: { judgeId } }).then(r => r.data.data),

  /** Mark submission as "In Review" (opened the modal) */
  markInReview: (submissionId) =>
    client.patch(`/submissions/${submissionId}/status`, { status: 'In Review' }).then(r => r.data.data),

  /**
   * Submit a completed review
   * @param {{ submissionId, judgeId, judgeName, judgeEmail, scores, comment, privateNote }} payload
   */
  submitReview: (payload) =>
    client.post('/reviews', payload).then(r => r.data.data),
}
