const mongoose = require('mongoose');

const SubTaskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
    },
    title: {
        type: String,
        maxLength: [200, 'Title cannot be more than 200 characters']
    },    
    status: {
        type: Number,
        enum: [0, 1],
        default: 0
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const SubTask = mongoose.model('SubTask', SubTaskSchema);

module.exports = SubTask;