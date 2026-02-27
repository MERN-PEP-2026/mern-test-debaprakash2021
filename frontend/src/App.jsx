import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { Toaster } from 'react-hot-toast'
import InitiateSignup from './pages/InitiateSignup.jsx'
import VerifySignup from './pages/VerifySignup.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Profile from './pages/Profile.jsx'

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

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/initiate-signup" element={<GuestRoute><InitiateSignup /></GuestRoute>} />
    <Route path="/verify-signup"   element={<GuestRoute><VerifySignup /></GuestRoute>} />
    <Route path="/login"           element={<GuestRoute><Login /></GuestRoute>} />
    <Route path="/dashboard"       element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/profile"         element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    <Route path="*"                element={<Navigate to="/login" replace />} />
  </Routes>
)

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ style: { background: '#27272a', color: '#f4f4f5', border: '1px solid #3f3f46' } }} />
      <AppRoutes />
    </BrowserRouter>
  </AuthProvider>
)

export default App