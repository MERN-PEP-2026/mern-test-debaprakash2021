import Task from '../models/Task.js';

export const createTaskService = async (taskData, username) => {
  const task = await Task.create({ ...taskData, createdBy: username });
  return task;
};

 export const getAllTasksService = async (username) => {
  const tasks = await Task.find({ createdBy: username }).sort({ createdAt: -1 });
  return tasks;
};

export const updateTaskService = async (taskId, updateData, username) => {
  const task = await Task.findOne({ _id: taskId, createdBy: username });
  if (!task) {
    throw new Error('Task not found or unauthorized');
  }

  const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, { new: true, runValidators: true });
  return updatedTask;
};

export const deleteTaskService = async (taskId, username) => {
  const task = await Task.findOne({ _id: taskId, createdBy: username });
  if (!task) {
    throw new Error('Task not found or unauthorized');
  }

  await Task.findByIdAndDelete(taskId);
  return { message: 'Task deleted successfully' };
};

// export { createTask, getAllTasks, updateTask, deleteTask };