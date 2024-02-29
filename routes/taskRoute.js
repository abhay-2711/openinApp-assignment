const express = require('express');
const router = express.Router();
const verifyToken = require('../utils/verifyToken');
const isAdmin = require('../utils/isAdmin');
const {createTask, getAllTasks, getTask, updateTask, deleteTask, filterTaskDueDate, filterTaskPriority} = require('../controllers/taskController');

router.use(verifyToken);

router.post('/createTask', createTask);
router.get('/getAllTasks', getAllTasks);
router.get('/getTask/:id', getTask);
router.put('/updateTask/:id', updateTask);
router.delete('/deleteTask/:id', deleteTask);
router.post('/filterTaskPriority', filterTaskPriority);
router.post('/filterTaskDueDate', filterTaskDueDate);

module.exports = router;