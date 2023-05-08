// Basic Lib Imports
const express = require("express");
const router = express.Router();

const {
  getTask,
  addTask,
  updateTask,
  deleteTask,
  getassignedTasks
} = require("../controllers/taskController");
const {protect} = require("../middleware/authMiddleware");


// Routing Implement
router.route('/').get(protect, getTask).post(protect, addTask)
router.route('/:id').delete(protect, deleteTask).put(protect, updateTask)

router.route('/assigned').get(protect, getassignedTasks)

// Exporting the Router
module.exports = router;
