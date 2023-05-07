// Basic Lib Imports
const express = require("express");
const router = express.Router();

const {
  getGoals,
  setGoal,
  updateGoal,
  deleteGoal,
  getassignedTasks
} = require("../controllers/taskController");
const {protect} = require("../middleware/authMiddleware");


// Routing Implement
router.route('/').get(protect, getGoals).post(protect, setGoal)
router.route('/:id').delete(protect, deleteGoal).put(protect, updateGoal)

router.route('/assigned').get(protect, getassignedTasks)

// Exporting the Router
module.exports = router;
