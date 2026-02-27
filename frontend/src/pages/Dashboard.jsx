import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import API from '../api/axios.js'
import { useAuth } from '../context/AuthContext.jsx'
import Navbar from '../components/Navbar.jsx'
import TaskCard from '../components/TaskCard.jsx'

// Dashboard — GET/POST/PUT/DELETE /api/tasks
// Restores pending task state saved before login redirect
const Dashboard = () => {
  const { name, token } = useAuth()
  const navigate = useNavigate()
  const [tasks, setTasks]     = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('all')
  const [creating, setCreating] = useState(false)
  const [formError, setFormError] = useState('')

  // Restore pending task from sessionStorage if user was redirected to login
  const pendingTask = JSON.parse(sessionStorage.getItem('pendingTask') || 'null')
  const [form, setForm] = useState(
    pendingTask || { title: '', description: '' }
  )

  // Clear pending task after restoring
  useEffect(() => {
    if (pendingTask) {
      sessionStorage.removeItem('pendingTask')
      toast('Your saved task has been restored!', { icon: '📋' })
    }
  }, [])

  // Redirect to login if not authenticated — save current form state first
  const requireAuth = () => {
    if (!token) {
      if (form.title) sessionStorage.setItem('pendingTask', JSON.stringify(form))
      navigate('/login')
      return false
    }
    return true
  }

  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks')
      setTasks(res.data)
    } catch {
      toast.error('Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTasks() }, [])

  // POST /api/tasks — create new task
  const handleCreate = async (e) => {
    e.preventDefault()
    if (!requireAuth()) return
    if (!form.title.trim()) return setFormError('Title is required')
    setCreating(true)
    setFormError('')
    try {
      await API.post('/tasks', form)
      setForm({ title: '', description: '' })
      toast.success('Task created!')
      fetchTasks()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task')
    } finally {
      setCreating(false)
    }
  }

  // PUT /api/tasks/:id — toggle status
  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'pending' ? 'completed' : 'pending'
    try {
      await API.put(`/tasks/${task._id}`, { status: newStatus })
      fetchTasks()
    } catch {
      toast.error('Failed to update task')
    }
  }

  // DELETE /api/tasks/:id
  const handleDelete = async (id) => {
    try {
      await API.delete(`/tasks/${id}`)
      toast.success('Task deleted')
      fetchTasks()
    } catch {
      toast.error('Failed to delete task')
    }
  }

  const counts = {
    all:       tasks.length,
    pending:   tasks.filter((t) => t.status === 'pending').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  }

  const filteredTasks = filter === 'all' ? tasks : tasks.filter((t) => t.status === filter)

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-100">
            Good day, <span className="text-green-400">{name}</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            You have <span className="text-zinc-300">{counts.pending}</span> pending task{counts.pending !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Create Task */}
        <div className="card mb-6">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">New Task</h2>
          <form onSubmit={handleCreate} className="space-y-3">
            <input type="text" value={form.title}
              onChange={(e) => { setForm({ ...form, title: e.target.value }); setFormError('') }}
              placeholder="Task title *" className="input-base" />
            <input type="text" value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Description (optional)" className="input-base" />
            {formError && <p className="text-red-400 text-sm">{formError}</p>}
            <div className="flex justify-end">
              <button type="submit" disabled={creating}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200 active:scale-95 text-sm cursor-pointer">
                {creating ? 'Adding...' : '+ Add Task'}
              </button>
            </div>
          </form>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4">
          {['all', 'pending', 'completed'].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize cursor-pointer ${
                filter === f ? 'bg-green-500 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}>
              {f} <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${filter === f ? 'bg-white/20' : 'bg-zinc-700'}`}>{counts[f]}</span>
            </button>
          ))}
        </div>

        {/* Task List */}
        {loading ? (
          <div className="text-center py-16 text-zinc-600">Loading tasks...</div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-zinc-600 text-sm">
              {filter === 'all' ? 'No tasks yet. Create your first one above!' : `No ${filter} tasks.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <TaskCard key={task._id} task={task}
                onToggleStatus={handleToggleStatus} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard