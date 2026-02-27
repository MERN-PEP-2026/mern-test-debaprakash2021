import express from 'express'
import {
  getProfileController,
  updateProfileController,
  changePasswordController,
  uploadAvatarController,
} from '../controllers/userController.js'
import protect from '../middleware/authMiddleware.js'
import { upload } from '../middleware/upload.js'

const router = express.Router()

// GET  /api/user/profile — fetch profile details
router.get('/profile', protect, getProfileController)

// PUT  /api/user/profile — update name, mobile, bio
router.put('/profile', protect, updateProfileController)

// PUT  /api/user/change-password — change password
router.put('/change-password', protect, changePasswordController)

// POST /api/user/upload-avatar — upload profile picture to cloudinary
router.post('/upload-avatar', protect, upload.single('avatar'), uploadAvatarController)

export default router