import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [token, setToken]   = useState(localStorage.getItem('token') || null)
  const [name, setName]     = useState(localStorage.getItem('name') || null)
  const [email, setEmail]   = useState(localStorage.getItem('email') || null)
  const [avatar, setAvatar] = useState(localStorage.getItem('avatar') || null)

  // Store auth data in state and localStorage after login or verify-signup
  const login = (token, name, email, avatar = '') => {
    localStorage.setItem('token', token)
    localStorage.setItem('name', name)
    localStorage.setItem('email', email)
    localStorage.setItem('avatar', avatar)
    setToken(token)
    setName(name)
    setEmail(email)
    setAvatar(avatar)
  }

  // Update name and avatar in context after profile edit
  const updateProfile = (updatedUser) => {
    localStorage.setItem('name', updatedUser.name)
    localStorage.setItem('avatar', updatedUser.profileImage || '')
    setName(updatedUser.name)
    setAvatar(updatedUser.profileImage || '')
  }

  // Clear everything on logout
  const logout = () => {
    localStorage.clear()
    setToken(null)
    setName(null)
    setEmail(null)
    setAvatar(null)
  }

  return (
    <AuthContext.Provider value={{ token, name, email, avatar, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)