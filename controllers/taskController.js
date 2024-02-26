const Task = require('../models/Task');
const SubTask = require('../models/SubTask');

// create task by user
const createTask = async (req, res, next) => {
    const {title, description} = req.body;
    const newTask = new Task({
        userId: req.user.id,
        title,
        description,
        dueDate: new Date(req.body.dueDate),
    });
    try {
        await newTask.save();
        res.status(200).json(newTask);
    } catch (error) {
        next(error);
    }
}

// get all tasks by user
const getAllTasks = async (req, res, next) => {
    const userId = req.user.id;
    try {
        const tasks = await Task.find({ userId, deleted: false });
        res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
}

// get a single task by user
const getTask = async (req, res, next) => {
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
        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
}

//update a task by user
const updateTask = async (req, res, next) => {
    const taskId = req.params.id;
    const userId = req.user.id;
    const {title, description, dueDate, status} = req.body;
    try {
        const task = await Task.findById({_id: taskId, userId, deleted: false});
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        if (task.userId.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized access to this task' });
        }

        task.title = title;
        task.description = description;
        task.dueDate = new Date(dueDate);
        task.status = status;
        await task.save();

        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
};

// delete a task by user
const deleteTask = async (req, res, next) => {
    const taskId = req.params.id;
    const userId = req.user.id;
    try {
        // soft delete a task
        const task = await Task.findById({_id: taskId, userId, deleted: false});
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        if (task.userId.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized access to this task' });
        }
        task.deleted = true;
        await task.save();

        // soft delete subtasks
        await SubTask.updateMany({ taskId, deleted: false }, { $set: { deleted: true } });

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {createTask, getAllTasks, getTask, updateTask, deleteTask};