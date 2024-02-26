const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        maxlength: [50, 'Email cannot be more than 50 characters']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
    },
    phone_number: {
        type: String,
        required: [true, 'Please enter a phone number'],
        unique: true,
        maxlength: [15, 'Phone number cannot be more than 15 characters']
    },
    priority: {
        type: Number,
        enum: [0, 1, 2, 3],
        default: 1
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;