import { create } from 'zustand'
import { reviewsApi } from '../api/reviews.js'

export const useReviewStore = create((set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  queue:      [],      // Pending + In Review submissions from DB
  completed:  [],      // Reviewed submissions (reviews docs)
  stats:      { done: 0, pending: 0, avgScore: 0 },
  loading:    false,
  submitting: false,
  error:      null,

  // ── Actions ────────────────────────────────────────────────────────────────

  /** Load queue + stats fresh from MongoDB */
  fetchQueue: async (judgeId) => {
    set({ loading: true, error: null })
    try {
      const [queue, stats] = await Promise.all([
        reviewsApi.getQueue(judgeId),
        reviewsApi.getStats(judgeId),
      ])
      set({ queue, stats, loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  /** Fetch completed reviews for history */
  fetchCompleted: async (judgeId) => {
    try {
      const completed = await reviewsApi.getCompleted(judgeId)
      set({ completed })
    } catch (_) {}
  },

  /** When judge opens a card → move to "In Review" in DB */
  openSubmission: async (submissionId) => {
    try {
      await reviewsApi.markInReview(submissionId)
      set(s => ({
        queue: s.queue.map(q =>
          q._id === submissionId ? { ...q, status: 'In Review' } : q
        ),
      }))
    } catch (_) {}
  },

  /** Submit a review → remove from queue, update stats */
  submitReview: async (payload) => {
    set({ submitting: true })
    try {
      const review = await reviewsApi.submitReview(payload)
      // Remove the reviewed submission from the queue
      set(s => ({
        queue:     s.queue.filter(q => q._id !== payload.submissionId),
        completed: [review, ...s.completed],
        stats: {
          ...s.stats,
          done:     s.stats.done + 1,
          pending:  Math.max(0, s.stats.pending - 1),
          avgScore: s.completed.length + 1 > 0
            ? Math.round(
                ([review, ...s.completed].reduce((a, r) => a + r.normalised, 0)) /
                (s.completed.length + 1)
              )
            : review.normalised,
        },
        submitting: false,
      }))
      return { success: true }
    } catch (err) {
      set({ submitting: false })
      return { success: false, error: err.message }
    }
  },
}))
