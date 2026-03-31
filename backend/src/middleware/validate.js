// Generic request body validator middleware factory
export function requireFields(...fields) {
  return (req, res, next) => {
    const missing = fields.filter((f) => !req.body[f])
    if (missing.length > 0) {
      return res.status(400).json({ error: `Missing fields: ${missing.join(', ')}` })
    }
    next()
  }
}
