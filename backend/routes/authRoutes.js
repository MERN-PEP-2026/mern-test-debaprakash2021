import express from 'express';
import {
  initiateSignupController,
  verifySignupController,
  loginUserController,
} from '../controllers/authController.js';

const router = express.Router();

// POST /api/auth/initiate-signup — step 1: submit credentials and receive OTP
router.post('/initiate-signup', initiateSignupController);

// POST /api/auth/verify-signup — step 2: submit OTP to activate account
router.post('/verify-signup', verifySignupController);

// POST /api/auth/login — login with verified credentials
router.post('/login', loginUserController);

export default router;