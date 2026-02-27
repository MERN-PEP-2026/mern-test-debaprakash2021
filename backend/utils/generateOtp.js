// Generates a random 6-digit numeric OTP with an expiry time of 10 minutes
const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
  return { otp, otpExpiry };
};

export default generateOtp;