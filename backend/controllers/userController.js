import {
  getProfileService,
  updateProfileService,
  changePasswordService,
  uploadAvatarService,
} from '../services/userService.js'

// GET /api/user/profile — returns logged-in user's profile
export const getProfileController = async (req, res) => {
  try {
    const user = await getProfileService(req.user.id)
    return res.status(200).json(user)
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}

// PUT /api/user/profile — updates name, mobile, bio
export const updateProfileController = async (req, res) => {
  try {
    const user = await updateProfileService(req.user.id, req.body)
    return res.status(200).json(user)
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}

// PUT /api/user/change-password — changes password after verifying old one
export const changePasswordController = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Both old and new password are required.' })
    }
    const result = await changePasswordService(req.user.id, oldPassword, newPassword)
    return res.status(200).json(result)
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}

// POST /api/user/upload-avatar — uploads image to cloudinary and saves URL
export const uploadAvatarController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' })
    }
    const user = await uploadAvatarService(req.user.id, req.file.buffer)
    return res.status(200).json(user)
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}