// Basic Lib Imports
const express = require("express");
const router = express.Router();

const { createSubscription } = require("../controllers/subscriptionController");

const { protect } = require("../middleware/authMiddleware");

// Payment routes
router.route("/").post(protect, createSubscription);

// Exporting the Router
module.exports = router;
