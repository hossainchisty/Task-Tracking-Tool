// Basic Lib Imports
const express = require("express");
const router = express.Router();

const {
  getTask,
  addTask,
  updateTask,
  deleteTask,
  getassignedTasks,
  getTasksByPriority,
  getTasksByStatus,
} = require("../controllers/taskController");

const {
  getComment,
  addComment,
  deleteComment
} = require("../controllers/commentController");

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

// Get tasks by priority
router.route("/priority/:priority").get(protect, getTasksByPriority);


// Get tasks by status
router.route("/status/:status").get(protect, getTasksByStatus);

// Get comments
router.route("/:id/comments").get(protect, getComment);

// Adding Comments
router.route("/:taskId/comments/").post(protect, addComment);

// Removing comments
router.route("/delete/:taskId/comments/:commentId").delete(protect, deleteComment);

// Adding Collaborators
router.route("/:taskId/collaborators/").post(protect, addCollaborator);

//  Removing Collaborators
router
  .route("/delete/:taskId/collaborators/:userId")
  .post(protect, removeCollaborator);

// Exporting the Router
module.exports = router;
