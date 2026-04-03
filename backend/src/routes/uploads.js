import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = Router()

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads')
    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_')
    cb(null, `${uniqueSuffix}-${name}${ext}`)
  }
})

// File filter - only allow PPT, PPTX, PDF
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ]
  const allowedExtensions = ['.pdf', '.ppt', '.pptx']
  
  const ext = path.extname(file.originalname).toLowerCase()
  
  if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
    cb(null, true)
  } else {
    cb(new Error('Only PDF, PPT, and PPTX files are allowed'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024 // 25MB max
  }
})

// POST /api/uploads - Upload a single file
router.post('/', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' })
    }

    // Construct the URL to access the file
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5001}`
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`

    res.json({
      success: true,
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        url: fileUrl
      }
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// Error handling middleware for multer
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, error: 'File too large. Maximum size is 25MB' })
    }
    return res.status(400).json({ success: false, error: err.message })
  }
  if (err) {
    return res.status(400).json({ success: false, error: err.message })
  }
  next()
})

export default router
