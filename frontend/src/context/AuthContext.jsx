import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

// Provides auth state (token, username) and helpers to entire app
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [username, setUsername] = useState(localStorage.getItem('username') || null)

  // Store token and username in state and localStorage after login
  const login = (token, username) => {
    localStorage.setItem('token', token)
    localStorage.setItem('username', username)
    setToken(token)
    setUsername(username)
  }

  // Clear all auth data on logout
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    setToken(null)
    setUsername(null)
  }

  return (
    <AuthContext.Provider value={{ token, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook — use this in any component to access auth context
export const useAuth = () => useContext(AuthContext)
