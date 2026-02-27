// Displays a single task with toggle status and delete actions
const TaskCard = ({ task, onToggleStatus, onDelete }) => {
  const isPending = task.status === 'pending'

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-start gap-4 hover:border-zinc-700 transition-all duration-200">

      {/* Status indicator dot */}
      <button
        onClick={() => onToggleStatus(task)}
        title="Toggle status"
        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all duration-200 ${
          isPending
            ? 'border-zinc-600 hover:border-brand-400'
            : 'bg-brand-500 border-brand-500'
        }`}
      >
        {!isPending && (
          <span className="flex items-center justify-center text-white text-xs">✓</span>
        )}
      </button>

      {/* Task content */}
      <div className="flex-1 min-w-0">
        <h3 className={`font-medium text-sm leading-snug ${!isPending ? 'line-through text-zinc-500' : 'text-zinc-100'}`}>
          {task.title}
        </h3>
        {task.description && (
          <p className="text-zinc-500 text-xs mt-1 leading-relaxed">{task.description}</p>
        )}
        <div className="flex items-center gap-2 mt-2">
          <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${
            isPending
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
          }`}>
            {task.status}
          </span>
          <span className="text-zinc-600 text-xs">
            {new Date(task.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Delete button */}
      <button
        onClick={() => onDelete(task._id)}
        className="text-zinc-600 hover:text-red-400 transition-colors duration-200 flex-shrink-0 text-lg leading-none"
        title="Delete task"
      >
        ×
      </button>
    </div>
  )
}

export default TaskCard
