require('dotenv').config()
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const cron = require('node-cron');
const { scheduleTasks } = require('./utils/taskScheduler');
const { performVoiceCalls } = require('./utils/voiceCalling');

mongoose.connect(process.env.MONGO_DB_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err);
})

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get('/', (req,res) => {
    res.send('<h1>OpenIn App Assignment</h1>');
})

app.listen(5000, () => {
    console.log('Server is running on port 5000');
})

//routes import
const auth = require('./routes/authRoute');
const task = require('./routes/taskRoute');
const subTask = require('./routes/subTaskRoute');

app.use('/api/auth', auth);
app.use('/api/task', task);
app.use('/api/subtask', subTask);

// cron logic
cron.schedule('0 0 * * *', () => {
    scheduleTasks();
})

cron.schedule('0 8 * * *', () => {
    performVoiceCalls();
})

//error handling
app.use((err,req,res,next) => {
    console.error(err);
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        error : message,
        statusCode: statusCode,
    })
})

//404 error handling
app.get("*", (req,res)=>{
    res.status(404).json({
        message: "Route not found",
        status: 404
    })
})

module.exports = app;