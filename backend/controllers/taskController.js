import {
  createTaskService,
  getAllTasksService,
  updateTaskService,
  deleteTaskService,
} from "../services/taskService.js";

export const createTaskController = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await createTaskService({ title, description }, req.user.username);
    return res.status(201).json(task);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getAllTaskController = async (req, res) => {
  try {
    const tasks = await getAllTasksService(req.user.username);
    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateTaskController = async (req, res) => {
  try {
    const task = await updateTaskService(req.params.id, req.body, req.user.username);
    return res.status(200).json(task);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteTaskController = async (req, res) => {
  try {
    const result = await deleteTaskService(req.params.id, req.user.username);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// export { create, getAll, update, remove };
