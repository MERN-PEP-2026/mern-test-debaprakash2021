import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

// Top navigation bar — shows logged-in username and logout button
const Navbar = () => {
  const { username, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-brand-400 text-lg">✦</span>
          <span className="font-bold text-zinc-100 tracking-tight">TaskManager</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-zinc-500 text-sm font-mono hidden sm:block">@{username}</span>
          <button
            onClick={handleLogout}
            className="btn-secondary"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
