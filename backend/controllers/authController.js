import {
  initiateSignupService,
  verifySignupService,
  loginUserService,
} from '../services/authService.js';

// POST /api/auth/initiate-signup — accepts username and password, generates and returns OTP
export const initiateSignupController = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const result = await initiateSignupService(username, password);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// POST /api/auth/verify-signup — accepts username and otp, activates the account on success
export const verifySignupController = async (req, res) => {
  try {
    const { username, otp } = req.body;

    if (!username || !otp) {
      return res.status(400).json({ message: 'Username and OTP are required' });
    }

    const result = await verifySignupService(username, otp);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// POST /api/auth/login — accepts username and password, returns JWT token if verified
export const loginUserController = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const result = await loginUserService(username, password);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};