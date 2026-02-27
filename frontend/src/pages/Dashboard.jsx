import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import API from '../api/axios.js'
import { useAuth } from '../context/AuthContext.jsx'
import Navbar from '../components/Navbar.jsx'
import TaskCard from '../components/TaskCard.jsx'

// Dashboard — GET/POST/PUT/DELETE /api/tasks
const Dashboard = () => {
  const { name, token } = useAuth()
  const navigate        = useNavigate()

  const [tasks,     setTasks]     = useState([])
  const [loading,   setLoading]   = useState(true)
  const [filter,    setFilter]    = useState('all')
  const [search,    setSearch]    = useState('')
  const [creating,  setCreating]  = useState(false)
  const [formError, setFormError] = useState('')

  // Restore pending task from sessionStorage if redirected from login
  const pendingTask = JSON.parse(sessionStorage.getItem('pendingTask') || 'null')
  const [form, setForm] = useState(
    pendingTask || { title: '', description: '', priority: 'medium', dueDate: '' }
  )

  useEffect(() => {
    if (pendingTask) {
      sessionStorage.removeItem('pendingTask')
      toast('Your saved task has been restored!', { icon: '📋' })
    }
  }, [])

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

  // Update browser tab title with live pending count
  useEffect(() => {
    const pending = tasks.filter((t) => t.status === 'pending').length
    document.title = pending > 0
      ? `(${pending}) Dashboard — TaskManager`
      : 'Dashboard — TaskManager'
  }, [tasks])

  // Save form to sessionStorage before redirecting unauthenticated users
  const requireAuth = () => {
    if (!token) {
      if (form.title) sessionStorage.setItem('pendingTask', JSON.stringify(form))
      navigate('/login')
      return false
    }
    return true
  }

  // POST /api/tasks — create new task
  const handleCreate = async (e) => {
    e.preventDefault()
    if (!requireAuth()) return
    if (!form.title.trim()) return setFormError('Title is required')
    setCreating(true)
    setFormError('')
    try {
      await API.post('/tasks', {
        title:       form.title,
        description: form.description,
        priority:    form.priority,
        dueDate:     form.dueDate || undefined,
      })
      setForm({ title: '', description: '', priority: 'medium', dueDate: '' })
      toast.success('Task created!')
      fetchTasks()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task')
    } finally {
      setCreating(false)
    }
  }

  // PUT /api/tasks/:id — toggle pending/completed
  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'pending' ? 'completed' : 'pending'
    try {
      await API.put(`/tasks/${task._id}`, { status: newStatus })
      fetchTasks()
    } catch {
      toast.error('Failed to update task')
    }
  }

  // PUT /api/tasks/:id — save inline edit
  const handleEdit = async (id, updatedData) => {
    try {
      await API.put(`/tasks/${id}`, updatedData)
      toast.success('Task updated!')
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

  // Apply status filter then search filter
  const filteredTasks = tasks
    .filter((t) => filter === 'all' || t.status === filter)
    .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Good day, <span className="text-green-400">{name}</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            You have{' '}
            <span style={{ color: 'var(--text-primary)' }}>{counts.pending}</span>{' '}
            pending task{counts.pending !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Create Task */}
        <div className="card mb-6">
          <h2
            className="text-xs font-semibold uppercase tracking-wider mb-4"
            style={{ color: 'var(--text-muted)' }}
          >
            New Task
          </h2>
          <form onSubmit={handleCreate} className="space-y-3">
            <input
              type="text"
              value={form.title}
              onChange={(e) => { setForm({ ...form, title: e.target.value }); setFormError('') }}
              placeholder="Task title *"
              className="input-base"
            />
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Description (optional)"
              className="input-base"
            />
            <div className="flex gap-3">
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="input-base"
              >
                <option value="low">🟢 Low Priority</option>
                <option value="medium">🟡 Medium Priority</option>
                <option value="high">🔴 High Priority</option>
              </select>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="input-base"
              />
            </div>
            {formError && <p className="text-red-400 text-sm">{formError}</p>}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={creating}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg transition-all active:scale-95 text-sm cursor-pointer"
              >
                {creating ? 'Adding...' : '+ Add Task'}
              </button>
            </div>
          </form>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍  Search tasks by title..."
            className="input-base"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-4">
          {['all', 'pending', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize cursor-pointer"
              style={{
                backgroundColor: filter === f ? '#22c55e' : 'var(--bg-tertiary)',
                color:           filter === f ? '#ffffff' : 'var(--text-secondary)',
              }}
            >
              {f}{' '}
              <span
                className="ml-1 text-xs px-1.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: filter === f ? 'rgba(255,255,255,0.2)' : 'var(--bg-hover)',
                }}
              >
                {counts[f]}
              </span>
            </button>
          ))}
        </div>

        {/* Task list */}
        {loading ? (
          <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>
            Loading tasks...
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {search
                ? `No tasks matching "${search}"`
                : filter === 'all'
                ? 'No tasks yet. Create your first one above!'
                : `No ${filter} tasks.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard