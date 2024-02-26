const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    title: {
        type: String,
        required: [true, 'Please enter a title'],
        maxLength: [200, 'Title cannot be more than 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Please enter some description'],
    },
    dueDate: {
        type: Date,
        required: [true, 'Please enter a due date']
    }, 
    status: {
        type: String,
        enum: ['TODO', 'IN_PROGRESS', 'DONE'],
        default: 'TODO'
    },
    priority: {
        type: Number,
        default: 0
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deleted_at: {
        type: Date
    },
}, { timestamps: true });

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;