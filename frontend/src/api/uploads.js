import client from './client'

export const uploadsApi = {
  /**
   * Upload a file (PPT, PDF, PPTX)
   * @param {File} file - The file to upload
   * @returns {Promise<{filename, originalName, size, mimetype, url}>}
   */
  uploadFile: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    
    const { data } = await client.post('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 60000 // 60 second timeout for large files
    })
    
    return data.data
  }
}
