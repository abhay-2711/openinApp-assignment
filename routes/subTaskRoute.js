const express = require('express');
const router = express.Router();
const verifyToken = require('../utils/verifyToken');
const isAdmin = require('../utils/isAdmin');
const {createSubTask, getAllSubTasks, updateSubTask, deleteSubTask} = require('../controllers/subTaskController');

router.use(verifyToken);

router.post('/createSubTask/:id', createSubTask);
router.get('/getAllSubTasks/:id', getAllSubTasks);
router.put('/updateSubTask/:id', updateSubTask);
router.delete('/deleteSubTask/:id', deleteSubTask);

module.exports = router;