import nodemailer from 'nodemailer'

// Sends OTP email to user via Gmail SMTP
const sendEmail = async (toEmail, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  const mailOptions = {
    from: `"TaskManager" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Your OTP for TaskManager Signup',
    html: `
      <div style="font-family: sans-serif; max-width: 400px; margin: auto; padding: 24px; border: 1px solid #e4e4e7; border-radius: 12px;">
        <h2 style="color: #22c55e; margin-bottom: 8px;">TaskManager</h2>
        <p style="color: #52525b;">Your One-Time Password for signup verification:</p>
        <div style="background: #f4f4f5; border-radius: 8px; padding: 20px; text-align: center; margin: 16px 0;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #18181b;">${otp}</span>
        </div>
        <p style="color: #71717a; font-size: 13px;">This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

export default sendEmail