import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'

// Top navbar — app name, theme toggle, profile avatar, logout
const Navbar = () => {
  const { name, avatar, logout } = useAuth()
  const { theme, toggleTheme }   = useTheme()
  const navigate = useNavigate()
  const isDark   = theme === 'dark'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="navbar">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/dashboard')}
        >
          <span className="text-green-400 text-lg">✦</span>
          <span className="font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            TaskManager
          </span>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3">

          {/* Dark / Light toggle */}
          <button
            onClick={toggleTheme}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer"
            style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          {/* Profile */}
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div
              className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center"
              style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}
            >
              {avatar ? (
                <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  {name?.charAt(0)?.toUpperCase()}
                </span>
              )}
            </div>
            <span className="text-sm hidden sm:block" style={{ color: 'var(--text-secondary)' }}>
              {name}
            </span>
          </button>

          {/* Logout */}
          <button onClick={handleLogout} className="btn-secondary">Logout</button>
        </div>
      </div>
    </header>
  )
}

export default Navbar