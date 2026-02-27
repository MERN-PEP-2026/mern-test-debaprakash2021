import express from 'express'
import {
  initiateSignupController,
  verifySignupController,
  loginUserController,
} from '../controllers/authController.js'

const router = express.Router()

// POST /api/auth/initiate-signup — step 1: submit name, email, password → OTP sent to email
router.post('/register', initiateSignupController)

// POST /api/auth/verify-signup — step 2: submit OTP → account activated + token returned
router.post('/verify-signup', verifySignupController)

// POST /api/auth/login — login with email and password
router.post('/login', loginUserController)

export default router