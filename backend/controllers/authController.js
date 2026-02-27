import {
  initiateSignupService,
  verifySignupService,
  loginUserService,
} from '../services/authService.js'

// POST /api/auth/initiate-signup — accepts name, email, password and sends OTP to email
export const initiateSignupController = async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' })
    }
    const result = await initiateSignupService(name, email, password)
    return res.status(200).json(result)
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}

// POST /api/auth/verify-signup — accepts email and otp, activates account and returns token
export const verifySignupController = async (req, res) => {
  try {
    const { email, otp } = req.body
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required.' })
    }
    const result = await verifySignupService(email, otp)
    return res.status(200).json(result)
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}

// POST /api/auth/login — accepts email and password, returns JWT token
export const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }
    const result = await loginUserService(email, password)
    return res.status(200).json(result)
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}