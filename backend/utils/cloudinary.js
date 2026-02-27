import { v2 as cloudinary } from 'cloudinary'

// Configure cloudinary with env credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Upload a buffer directly to cloudinary and return the result
export const uploadToCloudinary = (buffer, folder = 'task-manager-avatars') => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error) reject(error)
      else resolve(result)
    }).end(buffer)
  })
}

export default cloudinary