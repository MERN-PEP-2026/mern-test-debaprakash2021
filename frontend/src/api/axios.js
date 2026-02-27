import axios from 'axios'

// Base axios instance pointing to backend
const API = axios.create({
  baseURL: 'http://localhost:5020/api',
})

// Attach JWT token to every request automatically if present in localStorage
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default API
