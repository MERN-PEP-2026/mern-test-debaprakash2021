import Task from '../models/Task.js'

// Create a new task for the logged-in user
export const createTask = async (taskData, userId) => {
  const task = await Task.create({ ...taskData, createdBy: userId })
  return task
}

// Get all tasks belonging to the logged-in user
export const getAllTasks = async (userId) => {
  const tasks = await Task.find({ createdBy: userId }).sort({ createdAt: -1 })
  return tasks
}

// Update a task — ensures it belongs to the requesting user
export const updateTask = async (taskId, updateData, userId) => {
  const task = await Task.findOne({ _id: taskId, createdBy: userId })
  if (!task) throw new Error('Task not found or unauthorized.')

  const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, { new: true, runValidators: true })
  return updatedTask
}

// Delete a task — ensures it belongs to the requesting user
export const deleteTask = async (taskId, userId) => {
  const task = await Task.findOne({ _id: taskId, createdBy: userId })
  if (!task) throw new Error('Task not found or unauthorized.')

  await Task.findByIdAndDelete(taskId)
  return { message: 'Task deleted successfully.' }
}