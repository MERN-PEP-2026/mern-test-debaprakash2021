import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import InitiateSignup from './pages/InitiateSignup.jsx'
import VerifySignup from './pages/VerifySignup.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'

// Protects routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" replace />
}

// Redirects logged-in users away from auth pages
const GuestRoute = ({ children }) => {
  const { token } = useAuth()
  return !token ? children : <Navigate to="/dashboard" replace />
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Guest-only routes */}
      <Route path="/initiate-signup" element={<GuestRoute><InitiateSignup /></GuestRoute>} />
      <Route path="/verify-signup" element={<GuestRoute><VerifySignup /></GuestRoute>} />
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />

      {/* Protected routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
