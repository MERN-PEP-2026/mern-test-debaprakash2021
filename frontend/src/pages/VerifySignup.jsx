import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import API from '../api/axios.js'
import { useAuth } from '../context/AuthContext.jsx'

// POST /api/auth/verify-signup — OTP sent to email, user enters it here
const VerifySignup = () => {
  const location  = useLocation()
  const navigate  = useNavigate()
  const { login } = useAuth()
  const { email } = location.state || {}
  const [otp, setOtp]       = useState('')
  const [loading, setLoading] = useState(false)

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card text-center max-w-sm w-full mx-4">
          <p className="text-zinc-400 mb-4">Please complete Step 1 first.</p>
          <Link to="/initiate-signup" className="text-green-400 hover:underline text-sm">Go to Signup</Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await API.post('/auth/verify-signup', { email, otp })
      // Auto login after successful verification
      login(res.data.token, res.data.name, res.data.email, '')
      toast.success('Account verified! Welcome 🎉')
      // Restore pending task state if any
      navigate('/dashboard', { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-zinc-950">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500/10 border border-green-500/30 rounded-xl mb-4">
            <span className="text-green-400 text-xl">◉</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-100">Verify Email</h1>
          <p className="text-zinc-500 mt-1 text-sm">Step 2 of 2 — Enter the OTP sent to your email</p>
        </div>

        <div className="card">
          <div className="bg-zinc-800 rounded-lg px-4 py-3 mb-5">
            <p className="text-zinc-500 text-xs mb-0.5">OTP sent to</p>
            <p className="text-zinc-200 text-sm font-medium">{email}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">OTP Code</label>
              <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP" maxLength={6}
                className="input-base text-center text-2xl font-mono tracking-widest" required />
            </div>

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Verifying...' : 'Verify Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-zinc-500 text-sm mt-6">
          Wrong email?{' '}
          <Link to="/initiate-signup" className="text-green-400 hover:text-green-300 font-medium">Go back</Link>
        </p>
      </div>
    </div>
  )
}

export default VerifySignup