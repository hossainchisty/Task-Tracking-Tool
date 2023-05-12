// Basic Lib Imports
const express = require("express");
const router = express.Router();

const {
    getTaskHistory
} = require("../controllers/historyController");

const { protect } = require("../middleware/authMiddleware");

// Adding n getting tasks
router.route("/").get(protect, getTaskHistory)

// Exporting the Router
module.exports = router;