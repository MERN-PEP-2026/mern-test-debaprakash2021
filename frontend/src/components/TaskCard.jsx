import { useState } from 'react'

// Priority badge config
const PRIORITY = {
  high:   { label: 'High',   bg: 'rgba(239,68,68,0.12)',  color: '#f87171', border: 'rgba(239,68,68,0.25)' },
  medium: { label: 'Medium', bg: 'rgba(234,179,8,0.12)',  color: '#facc15', border: 'rgba(234,179,8,0.25)' },
  low:    { label: 'Low',    bg: 'rgba(34,197,94,0.12)',  color: '#4ade80', border: 'rgba(34,197,94,0.25)' },
}

// Returns due date label and color based on how close it is
const getDueDateInfo = (dueDate) => {
  if (!dueDate) return null
  const due  = new Date(dueDate)
  const diff = Math.ceil((due - new Date()) / (1000 * 60 * 60 * 24))
  if (diff < 0)   return { label: `Overdue by ${Math.abs(diff)}d`, color: '#f87171' }
  if (diff === 0) return { label: 'Due today',                      color: '#facc15' }
  if (diff === 1) return { label: 'Due tomorrow',                   color: '#fb923c' }
  return          { label: `Due ${due.toLocaleDateString()}`,       color: 'var(--text-muted)' }
}

// Single task card — inline edit, toggle status, delete, priority, due date
const TaskCard = ({ task, onToggleStatus, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm]   = useState({
    title:       task.title,
    description: task.description || '',
    priority:    task.priority    || 'medium',
    dueDate:     task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
  })

  const isPending   = task.status === 'pending'
  const priority    = PRIORITY[task.priority] || PRIORITY.medium
  const dueDateInfo = getDueDateInfo(task.dueDate)
  const isOverdue   = dueDateInfo?.color === '#f87171' && isPending

  const handleSave = () => {
    onEdit(task._id, editForm)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditForm({
      title:       task.title,
      description: task.description || '',
      priority:    task.priority    || 'medium',
      dueDate:     task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    })
    setIsEditing(false)
  }

  // ── Edit mode ──
  if (isEditing) {
    return (
      <div className="task-card" style={{ borderColor: '#22c55e' }}>
        <div className="space-y-2">
          <input
            value={editForm.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            className="input-base text-sm"
            placeholder="Task title"
          />
          <input
            value={editForm.description}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            className="input-base text-sm"
            placeholder="Description (optional)"
          />
          <div className="flex gap-2">
            <select
              value={editForm.priority}
              onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
              className="input-base text-sm"
            >
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
            <input
              type="date"
              value={editForm.dueDate}
              onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
              className="input-base text-sm"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={handleCancel} className="btn-secondary text-xs px-3 py-1.5">
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
              style={{ backgroundColor: '#22c55e' }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── View mode ──
  return (
    <div
      className="task-card flex items-start gap-4"
      style={ isOverdue ? { borderColor: 'rgba(239,68,68,0.4)' } : {} }
    >
      {/* Status toggle */}
      <button
        onClick={() => onToggleStatus(task)}
        title="Toggle status"
        className="mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all flex items-center justify-center cursor-pointer"
        style={{
          backgroundColor: isPending ? 'transparent' : '#22c55e',
          borderColor:     isPending ? 'var(--border)' : '#22c55e',
        }}
      >
        {!isPending && <span className="text-white text-xs leading-none">✓</span>}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3
          className="font-medium text-sm leading-snug"
          style={{
            color:          isPending ? 'var(--text-primary)' : 'var(--text-muted)',
            textDecoration: isPending ? 'none' : 'line-through',
          }}
        >
          {task.title}
        </h3>

        {task.description && (
          <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {task.description}
          </p>
        )}

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mt-2">

          {/* Status */}
          <span
            className="text-xs font-mono px-2 py-0.5 rounded-full border"
            style={{
              background:  isPending ? 'rgba(251,191,36,0.1)' : 'rgba(34,197,94,0.1)',
              color:       isPending ? '#fbbf24' : '#4ade80',
              borderColor: isPending ? 'rgba(251,191,36,0.25)' : 'rgba(34,197,94,0.25)',
            }}
          >
            {task.status}
          </span>

          {/* Priority */}
          <span
            className="text-xs font-mono px-2 py-0.5 rounded-full border"
            style={{ background: priority.bg, color: priority.color, borderColor: priority.border }}
          >
            {priority.label}
          </span>

          {/* Due date */}
          {dueDateInfo && (
            <span className="text-xs" style={{ color: dueDateInfo.color }}>
              ⏰ {dueDateInfo.label}
            </span>
          )}

          {/* Created */}
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {new Date(task.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => setIsEditing(true)}
          title="Edit"
          className="w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-all cursor-pointer hover:text-green-400"
          style={{ color: 'var(--text-muted)' }}
        >
          ✎
        </button>
        <button
          onClick={() => onDelete(task._id)}
          title="Delete"
          className="w-7 h-7 rounded-lg flex items-center justify-center text-lg leading-none transition-all cursor-pointer hover:text-red-400"
          style={{ color: 'var(--text-muted)' }}
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default TaskCard