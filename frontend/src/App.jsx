import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { ThemeProvider, useTheme } from './context/ThemeContext.jsx'
import { Toaster } from 'react-hot-toast'
import InitiateSignup from './pages/InitiateSignup.jsx'
import VerifySignup   from './pages/VerifySignup.jsx'
import Login          from './pages/Login.jsx'
import Dashboard      from './pages/Dashboard.jsx'
import Profile        from './pages/Profile.jsx'

// Protects routes — redirects to login if not authenticated
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" replace />
}

// Prevents logged-in users from accessing auth pages
const GuestRoute = ({ children }) => {
  const { token } = useAuth()
  return !token ? children : <Navigate to="/dashboard" replace />
}

// Updates browser tab title based on current route
const TabTitleUpdater = () => {
  const location = useLocation()
  useEffect(() => {
    const titles = {
      '/dashboard':       'Dashboard — TaskManager',
      '/login':           'Login — TaskManager',
      '/initiate-signup': 'Sign Up — TaskManager',
      '/verify-signup':   'Verify OTP — TaskManager',
      '/profile':         'Profile — TaskManager',
    }
    document.title = titles[location.pathname] || 'TaskManager'
  }, [location.pathname])
  return null
}

// Toaster adapts to current theme
const ThemedToaster = () => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: isDark ? '#27272a' : '#ffffff',
          color:      isDark ? '#f4f4f5' : '#0f172a',
          border:     isDark ? '1px solid #3f3f46' : '1px solid #e2e8f0',
        },
      }}
    />
  )
}

const AppRoutes = () => (
  <>
    <TabTitleUpdater />
    <Routes>
      <Route path="/"                element={<Navigate to="/login" replace />} />
      <Route path="/initiate-signup" element={<GuestRoute><InitiateSignup /></GuestRoute>} />
      <Route path="/verify-signup"   element={<GuestRoute><VerifySignup /></GuestRoute>} />
      <Route path="/login"           element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/dashboard"       element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/profile"         element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="*"                element={<Navigate to="/login" replace />} />
    </Routes>
  </>
)

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <BrowserRouter>
        <ThemedToaster />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
)

export default App