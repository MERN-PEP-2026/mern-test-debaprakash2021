import express from 'express';
import { createTaskController, getAllTaskController, updateTaskController, deleteTaskController } from '../controllers/taskController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createTaskController);
router.get('/', protect, getAllTaskController);
router.put('/:id', protect, updateTaskController);
router.delete('/:id', protect, deleteTaskController);

export default router;