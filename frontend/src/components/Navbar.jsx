import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

// Top navbar — shows app name, profile avatar, and logout
const Navbar = () => {
  const { name, avatar, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <span className="text-green-400 text-lg">✦</span>
          <span className="font-bold text-zinc-100 tracking-tight">TaskManager</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Profile icon — navigates to profile page */}
          <button onClick={() => navigate('/profile')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-zinc-700 border border-zinc-600 overflow-hidden flex items-center justify-center">
              {avatar ? (
                <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-zinc-300 text-sm font-semibold">
                  {name?.charAt(0)?.toUpperCase()}
                </span>
              )}
            </div>
            <span className="text-zinc-400 text-sm hidden sm:block">{name}</span>
          </button>
          <button onClick={handleLogout} className="btn-secondary cursor-pointer">Logout</button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
