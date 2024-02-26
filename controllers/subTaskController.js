const SubTask = require('../models/SubTask');
const Task = require('../models/Task');

// create a subtask using taskId
const createSubTask = async (req, res, next) => {
    const taskId = req.params.id;
    const userId = req.user.id;
    const {title, status, deleted} = req.body;
    try {
        const task = await Task.findById({_id: taskId, userId, deleted: false});
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        if (task.userId.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized access to this task' });
        }
        const newSubTask = new SubTask({
            userId,
            taskId,
            title,
            status,
            deleted
        });
        await newSubTask.save();

        // Update task status 
        const allSubTasks = await SubTask.find({ taskId: taskId, deleted: false });
        const isAllCompleted = allSubTasks.every(subtask => subtask.status === 1);
        const isAllInComleted = allSubTasks.every(subtask => subtask.status === 0);
        if (isAllCompleted) {
            task.status = 'DONE';
        } else if (isAllInComleted) {
            task.status = 'TODO';
        } else {
            task.status = 'IN_PROGRESS';
        }
        await task.save();
        res.status(200).json(newSubTask);
    }
    catch (error) {
        next(error);
    }
}

// get all subtasks of a task
const getAllSubTasks = async (req, res, next) => {
    const taskId = req.params.id;
    const userId = req.user.id;
    try {
        const task = await Task.findById({_id: taskId, userId, deleted: false});
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        if (task.userId.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized access to this task' });
        }
        const subTasks = await SubTask.find({ taskId, deleted: false });
        res.status(200).json(subTasks);
    }
    catch (error) {
        next(error);
    }
}

// update a subtask by user only status
const updateSubTask = async (req, res, next) => {
    const subTaskId = req.params.id;
    const userId = req.user.id;
    const {status} = req.body;
    try {
        const subTask = await SubTask.findById({_id: subTaskId, deleted: false});
        if (!subTask) {
            return res.status(404).json({ message: 'SubTask not found' });
        }
        const task = await Task.findById(subTask.taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        if (task.userId.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized access to this task' });
        }
        subTask.status = status;
        await subTask.save();

        // Update task status 
        const allSubTasks = await SubTask.find({ taskId: subTask.taskId, deleted: false });
        const isAllCompleted = allSubTasks.every(subtask => subtask.status === 1);
        const isAllInComleted = allSubTasks.every(subtask => subtask.status === 0);
        if (isAllCompleted) {
            task.status = 'DONE';
        } else if (isAllInComleted) {
            task.status = 'TODO';
        } else {
            task.status = 'IN_PROGRESS';
        }
        await task.save();
        res.status(200).json(subTask);
    }
    catch (error) {
        next(error);
    }
}

// delete a subtask by user
const deleteSubTask = async (req, res, next) => {
    const subTaskId = req.params.id;
    const userId = req.user.id;
    try {
        const subTask = await SubTask.findById({_id: subTaskId, deleted: false});
        if (!subTask) {
            return res.status(404).json({ message: 'SubTask not found' });
        }
        const task = await Task.findById(subTask.taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        if (task.userId.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized access to this task' });
        }
        subTask.deleted = true;
        await subTask.save();

        // Update task status
        const allSubTasks = await SubTask.find({ taskId: subTask.taskId, deleted: false });
        const isAllCompleted = allSubTasks.every(subtask => subtask.status === 1);
        const isAllInComleted = allSubTasks.every(subtask => subtask.status === 0);
        if (isAllCompleted) {
            task.status = 'DONE';
        } else if (isAllInComleted) {
            task.status = 'TODO';
        } else {
            task.status = 'IN_PROGRESS';
        }
        await task.save();
        res.status(200).json({ message: 'SubTask deleted successfully' });
    }
    catch (error) {
        next(error);
    }
}

module.exports = {
    createSubTask,
    getAllSubTasks,
    updateSubTask,
    deleteSubTask
};