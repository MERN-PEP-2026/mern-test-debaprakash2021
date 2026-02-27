import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import API from '../api/axios.js'

// POST /api/auth/verify-signup — verifies OTP and activates account
const VerifySignup = () => {
  const location = useLocation()
  const navigate = useNavigate()

  // Username and dev OTP passed from InitiateSignup via router state
  const { username, otp: devOtp } = location.state || {}

  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Redirect back if user lands here directly without going through step 1
  if (!username) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card text-center max-w-sm w-full mx-4">
          <p className="text-zinc-400 mb-4">Please complete Step 1 first.</p>
          <Link to="/initiate-signup" className="text-brand-400 hover:underline text-sm">
            Go to Signup
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const res = await API.post('/auth/verify-signup', { username, otp })
      setSuccess(res.data.message)
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-500/10 border border-brand-500/30 rounded-xl mb-4">
            <span className="text-brand-400 text-xl">◉</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-100">Verify OTP</h1>
          <p className="text-zinc-500 mt-1 text-sm">Step 2 of 2 — Enter the OTP sent to you</p>
        </div>

        {/* Card */}
        <div className="card">

          {/* Dev helper — shows OTP from API response */}
          {devOtp && (
            <div className="bg-brand-500/10 border border-brand-500/20 rounded-lg px-4 py-3 mb-4">
              <p className="text-zinc-400 text-xs font-mono mb-1">Your OTP (dev mode)</p>
              <p className="text-brand-400 text-2xl font-mono font-bold tracking-widest">{devOtp}</p>
            </div>
          )}

          <div className="mb-4">
            <p className="text-sm text-zinc-500">
              Verifying for: <span className="text-zinc-300 font-medium font-mono">{username}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">OTP Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => { setOtp(e.target.value); setError('') }}
                placeholder="Enter 6-digit OTP"
                className="input-base font-mono text-center text-xl tracking-widest"
                maxLength={6}
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5 text-red-400 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-brand-500/10 border border-brand-500/20 rounded-lg px-4 py-2.5 text-brand-400 text-sm">
                ✓ {success} Redirecting to login...
              </div>
            )}

            <button type="submit" disabled={loading || !!success} className="btn-primary">
              {loading ? 'Verifying...' : 'Verify Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-zinc-500 text-sm mt-6">
          Wrong credentials?{' '}
          <Link to="/initiate-signup" className="text-brand-400 hover:text-brand-300 font-medium">
            Go back
          </Link>
        </p>
      </div>
    </div>
  )
}

export default VerifySignup
