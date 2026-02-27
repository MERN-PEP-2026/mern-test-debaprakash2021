import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import generateOtp from '../utils/generateOtp.js';

// Saves user as unverified and returns OTP — replaces old register flow
export const initiateSignupService = async (username, password) => {
  const existingUser = await User.findOne({ username });

  if (existingUser && existingUser.isVerified) {
    throw new Error('Username already exists');
  }

  const { otp, otpExpiry } = generateOtp();

  if (existingUser && !existingUser.isVerified) {
    // User initiated before but never verified — refresh OTP
    existingUser.password = password;
    existingUser.otp = otp;
    existingUser.otpExpiry = otpExpiry;
    await existingUser.save();
  } else {
    // Brand new user — create with isVerified false
    const user = new User({ username, password, otp, otpExpiry, isVerified: false });
    await user.save();
  }

  // In production, send OTP via email or SMS here
  // Returning OTP in response for development/testing purposes
  return { message: 'OTP generated successfully. Please verify to complete signup.', otp };
};

// Verifies OTP and activates the user account
export const verifySignupService = async (username, otp) => {
  const user = await User.findOne({ username });

  if (!user) {
    throw new Error('User not found. Please initiate signup first.');
  }

  if (user.isVerified) {
    throw new Error('User is already verified. Please login.');
  }

  if (user.otp !== otp) {
    throw new Error('Invalid OTP');
  }

  if (user.otpExpiry < new Date()) {
    throw new Error('OTP has expired. Please initiate signup again.');
  }

  // OTP is valid — activate account and clear OTP fields
  user.isVerified = true;
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  return { message: 'Account verified successfully. You can now login.' };
};

// Logs in only verified users and returns JWT token
export const loginUserService = async (username, password) => {
  const user = await User.findOne({ username });

  if (!user) {
    throw new Error('Invalid username or password');
  }

  if (!user.isVerified) {
    throw new Error('Account not verified. Please complete OTP verification.');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid username or password');
  }

  const token = generateToken({ id: user._id, username: user.username });

  return { token, username: user.username };
};