// Basic Lib Imports
const express = require("express");
const router = express.Router();

const {
  getTasks,
  getTask,
  addTask,
  updateTask,
  deleteTask,
  getassignedTasks,
  getTasksByPriority,
  getTasksByStatus,
  markAsComplete,
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

const {getTaskAnalytics} = require('../controllers/analyticsController')


router.route("/").get(protect, getTasks).post(protect, addTask);

router.route("/:id").delete(protect, deleteTask).put(protect, updateTask).post(protect, markAsComplete);

// Retrive single task
router.route("/item/:taskID").get(protect, getTask);
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

// Analytics tasks
router.route("/analytics/").get(protect, getTaskAnalytics);

//  Removing Collaborators
router
  .route("/delete/:taskId/collaborators/:userId")
  .post(protect, removeCollaborator);

// Exporting the Router
module.exports = router;
