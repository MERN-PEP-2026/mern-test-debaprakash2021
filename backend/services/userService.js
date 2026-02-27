import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import { uploadToCloudinary } from '../utils/cloudinary.js'

// Get logged-in user's profile details
export const getProfileService = async (userId) => {
  const user = await User.findById(userId).select('-password -otp -otpExpiry')
  if (!user) throw new Error('User not found.')
  return user
}

// Update name, mobile, bio fields
export const updateProfileService = async (userId, updateData) => {
  const allowedFields = ['name', 'mobile', 'bio']
  const filteredData = {}
  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) filteredData[field] = updateData[field]
  })

  const user = await User.findByIdAndUpdate(userId, filteredData, { new: true }).select('-password -otp -otpExpiry')
  if (!user) throw new Error('User not found.')
  return user
}

// Change password — verifies old password before updating
export const changePasswordService = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId)
  if (!user) throw new Error('User not found.')

  const isMatch = await bcrypt.compare(oldPassword, user.password)
  if (!isMatch) throw new Error('Current password is incorrect.')

  user.password = newPassword
  await user.save()

  return { message: 'Password changed successfully.' }
}

// Upload avatar buffer to cloudinary and save URL to user profile
export const uploadAvatarService = async (userId, fileBuffer) => {
  const result = await uploadToCloudinary(fileBuffer)

  const user = await User.findByIdAndUpdate(
    userId,
    { profileImage: result.secure_url },
    { new: true }
  ).select('-password -otp -otpExpiry')

  return user
}