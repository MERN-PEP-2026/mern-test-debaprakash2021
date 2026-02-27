import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'
import generateOtp from '../utils/generateOtp.js'
import sendEmail from '../utils/sendEmail.js'

// Step 1 of signup — saves user as unverified and sends OTP to email
export const initiateSignupService = async (name, email, password) => {
  const existingUser = await User.findOne({ email })

  if (existingUser && existingUser.isVerified) {
    throw new Error('Email already registered. Please login.')
  }

  const { otp, otpExpiry } = generateOtp()

  if (existingUser && !existingUser.isVerified) {
    // Re-initiate for unverified user — refresh credentials and OTP
    existingUser.name = name
    existingUser.password = password
    existingUser.otp = otp
    existingUser.otpExpiry = otpExpiry
    await existingUser.save()
  } else {
    const user = new User({ name, email, password, otp, otpExpiry, isVerified: false })
    await user.save()
  }

  // Send OTP to user's email via SMTP
  await sendEmail(email, otp)

  return { message: 'OTP sent to your email. Please verify to complete signup.' }
}

// Step 2 of signup — verifies OTP and activates the account
export const verifySignupService = async (email, otp) => {
  const user = await User.findOne({ email })

  if (!user) {
    throw new Error('User not found. Please initiate signup first.')
  }
  if (user.isVerified) {
    throw new Error('Already verified. Please login.')
  }
  if (user.otp !== otp) {
    throw new Error('Invalid OTP.')
  }
  if (user.otpExpiry < new Date()) {
    throw new Error('OTP has expired. Please signup again.')
  }

  // Activate account and clear OTP fields
  user.isVerified = true
  user.otp = null
  user.otpExpiry = null
  await user.save()

  // Auto login — return token immediately after verification
  const token = generateToken({ id: user._id, email: user.email, name: user.name })

  return {
    message: 'Account verified successfully.',
    token,
    name: user.name,
    email: user.email,
  }
}

// Login — validates email + password and returns JWT
export const loginUserService = async (email, password) => {
  const user = await User.findOne({ email })

  if (!user) throw new Error('Invalid email or password.')
  if (!user.isVerified) throw new Error('Account not verified. Please check your email for OTP.')

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) throw new Error('Invalid email or password.')

  const token = generateToken({ id: user._id, email: user.email, name: user.name })

  return { token, name: user.name, email: user.email }
}