import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import API from '../api/axios.js'
import { useAuth } from '../context/AuthContext.jsx'
import Navbar from '../components/Navbar.jsx'

// Profile page — GET/PUT /api/user/profile, PUT /api/user/change-password, POST /api/user/upload-avatar
const Profile = () => {
  const { name, email, avatar, updateProfile } = useAuth()
  const navigate  = useNavigate()
  const fileRef   = useRef()

  const [profile, setProfile] = useState({ name: '', mobile: '', bio: '' })
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' })
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [saving, setSaving]   = useState(false)
  const [changingPass, setChangingPass] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(avatar || '')

  // GET /api/user/profile — fetch latest profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/user/profile')
        setProfile({ name: res.data.name, mobile: res.data.mobile || '', bio: res.data.bio || '' })
        setAvatarPreview(res.data.profileImage || '')
      } catch {
        toast.error('Failed to load profile')
      }
    }
    fetchProfile()
  }, [])

  // PUT /api/user/profile — save name, mobile, bio
  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await API.put('/user/profile', profile)
      updateProfile(res.data)
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  // PUT /api/user/change-password
  const handleChangePassword = async (e) => {
    e.preventDefault()
    setChangingPass(true)
    try {
      await API.put('/user/change-password', passwords)
      toast.success('Password changed successfully!')
      setPasswords({ oldPassword: '', newPassword: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    } finally {
      setChangingPass(false)
    }
  }

  // POST /api/user/upload-avatar — upload image to cloudinary
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Show local preview immediately
    setAvatarPreview(URL.createObjectURL(file))

    const formData = new FormData()
    formData.append('avatar', file)
    setUploading(true)
    try {
      const res = await API.post('/user/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      updateProfile(res.data)
      setAvatarPreview(res.data.profileImage)
      toast.success('Avatar updated!')
    } catch {
      toast.error('Failed to upload avatar')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')}
            className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm cursor-pointer">
            ← Back
          </button>
          <h1 className="text-xl font-bold text-zinc-100">My Profile</h1>
        </div>

        {/* Avatar Section */}
        <div className="card flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-zinc-700 overflow-hidden border-2 border-zinc-600">
              {avatarPreview ? (
                <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-zinc-400">
                  {name?.charAt(0)?.toUpperCase()}
                </div>
              )}
            </div>
            {uploading && (
              <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                <span className="text-white text-xs">...</span>
              </div>
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">{name}</h2>
            <p className="text-zinc-500 text-sm">{email}</p>
            <button onClick={() => fileRef.current.click()}
              className="text-green-400 hover:text-green-300 text-sm mt-1 cursor-pointer transition-colors">
              {uploading ? 'Uploading...' : 'Change photo'}
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </div>
        </div>

        {/* Edit Profile */}
        <div className="card">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Edit Profile</h3>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Full Name</label>
              <input type="text" value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="input-base" placeholder="Your full name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Mobile Number</label>
              <input type="tel" value={profile.mobile}
                onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
                className="input-base" placeholder="+91 XXXXX XXXXX" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Bio</label>
              <textarea value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="input-base resize-none" rows={3} placeholder="Tell us about yourself..." />
            </div>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="card">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Change Password</h3>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Current Password</label>
              <div className="relative">
                <input type={showOld ? 'text' : 'password'} value={passwords.oldPassword}
                  onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                  className="input-base pr-12" placeholder="Current password" />
                <button type="button" onClick={() => setShowOld(!showOld)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-sm cursor-pointer">
                  {showOld ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">New Password</label>
              <div className="relative">
                <input type={showNew ? 'text' : 'password'} value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  className="input-base pr-12" placeholder="New password" />
                <button type="button" onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-sm cursor-pointer">
                  {showNew ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <button type="submit" disabled={changingPass} className="btn-primary">
              {changingPass ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>

      </main>
    </div>
  )
}

export default Profile