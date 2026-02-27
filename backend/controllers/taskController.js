import {
  createTaskService,
  getAllTasksService,
  updateTaskService,
  deleteTaskService,
} from '../services/taskService.js'

// POST /api/tasks — create a new task for logged-in user
export const createTaskController = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body
    if (!title) {
      return res.status(400).json({ message: 'Title is required' })
    }
    const task = await createTaskService({ title, description, priority, dueDate }, req.user.id)
    return res.status(201).json(task)
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}

// GET /api/tasks — get all tasks for logged-in user
export const getAllTaskController = async (req, res) => {
  try {
    const tasks = await getAllTasksService(req.user.id)
    return res.status(200).json(tasks)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

// PUT /api/tasks/:id — update task fields
export const updateTaskController = async (req, res) => {
  try {
    const task = await updateTaskService(req.params.id, req.body, req.user.id)
    return res.status(200).json(task)
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}

// DELETE /api/tasks/:id — delete a task
export const deleteTaskController = async (req, res) => {
  try {
    const result = await deleteTaskService(req.params.id, req.user.id)
    return res.status(200).json(result)
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}