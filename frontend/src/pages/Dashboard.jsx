import { useState, useEffect } from 'react'
import API from '../api/axios.js'
import { useAuth } from '../context/AuthContext.jsx'
import Navbar from '../components/Navbar.jsx'
import TaskCard from '../components/TaskCard.jsx'

// Dashboard — main page for managing tasks
// GET /api/tasks         — fetch all tasks for logged-in user
// POST /api/tasks        — create a new task
// PUT /api/tasks/:id     — toggle task status
// DELETE /api/tasks/:id  — delete a task
const Dashboard = () => {
  const { username } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // 'all' | 'pending' | 'completed'
  const [form, setForm] = useState({ title: '', description: '' })
  const [formError, setFormError] = useState('')
  const [creating, setCreating] = useState(false)

  // Fetch all tasks on mount
  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks')
      setTasks(res.data)
    } catch (err) {
      console.error('Failed to fetch tasks:', err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  // POST /api/tasks — create new task
  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return setFormError('Title is required')
    setCreating(true)
    setFormError('')
    try {
      await API.post('/tasks', form)
      setForm({ title: '', description: '' })
      fetchTasks()
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create task')
    } finally {
      setCreating(false)
    }
  }

  // PUT /api/tasks/:id — toggle between pending and completed
  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'pending' ? 'completed' : 'pending'
    try {
      await API.put(`/tasks/${task._id}`, { status: newStatus })
      fetchTasks()
    } catch (err) {
      console.error('Failed to update task:', err.message)
    }
  }

  // DELETE /api/tasks/:id — remove task
  const handleDelete = async (id) => {
    try {
      await API.delete(`/tasks/${id}`)
      fetchTasks()
    } catch (err) {
      console.error('Failed to delete task:', err.message)
    }
  }

  // Filter tasks locally based on selected filter tab
  const filteredTasks = tasks.filter((t) => {
    if (filter === 'all') return true
    return t.status === filter
  })

  const counts = {
    all: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-100">
            Good day, <span className="text-brand-400 font-mono">@{username}</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            You have <span className="text-zinc-300">{counts.pending}</span> pending task{counts.pending !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Create Task Form */}
        <div className="card mb-6">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">New Task</h2>
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
            {formError && (
              <p className="text-red-400 text-sm">{formError}</p>
            )}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={creating}
                className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200 active:scale-95 text-sm"
              >
                {creating ? 'Adding...' : '+ Add Task'}
              </button>
            </div>
          </form>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4">
          {['all', 'pending', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${
                filter === f
                  ? 'bg-brand-500 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {f}
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                filter === f ? 'bg-white/20' : 'bg-zinc-700'
              }`}>
                {counts[f]}
              </span>
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
              <TaskCard
                key={task._id}
                task={task}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard
