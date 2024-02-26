const cron = require('node-cron');
const Task = require('../models/Task');

const scheduleTasks = async () => {
    try {
        const tasks = await Task.find({ deleted: false });
        for(const task of tasks) {
            const taskDueDate = new Date(task.dueDate);
            const today = new Date();
            const timeDiff = Math.abs(taskDueDate.getTime() - today.getTime());
            const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            if (diffDays === 0) {
                task.priority = 0;
            }
            else if (diffDays <= 2) {
                task.priority = 1;
            } else if (diffDays <= 4) {
                task.priority = 2;
            } else if (diffDays >= 5) {
                task.priority = 3;
            }
            await task.save();
        };

        console.log('Task priorities updated successfully.');
    } catch (error) {
        console.error('Error updating task priorities:', error);
    }
};

module.exports = scheduleTasks;