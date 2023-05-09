// Basic Lib Imports
const express = require("express");
const router = express.Router();

const {
  getTask,
  addTask,
  updateTask,
  deleteTask,
  getassignedTasks,
} = require("../controllers/taskController");

const {
  addCollaborator,
  removeCollaborator,
} = require("../controllers/collaboratorController");
const { protect } = require("../middleware/authMiddleware");

// Adding n getting tasks
router.route("/").get(protect, getTask).post(protect, addTask);

// Deleting n updating tasks
router.route("/:id").delete(protect, deleteTask).put(protect, updateTask);

// Assigned Tasks
router.route("/assigned").get(protect, getassignedTasks);

// Adding Collaborators
router.route("/:taskId/collaborators/:userId").post(protect, addCollaborator);

//  Removing Collaborators
router
  .route("/delete/:taskId/collaborators/:userId")
  .post(protect, removeCollaborator);

// Exporting the Router
module.exports = router;
