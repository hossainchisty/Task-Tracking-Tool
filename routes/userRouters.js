// Basic Lib Imports
const express = require("express");

const ExpressBrute = require("express-brute");

var store = new ExpressBrute.MemoryStore();
// stores state locally, don't use this in production
var bruteforce = new ExpressBrute(store);

const router = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  forgetPassword,
  resetPassword,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");
const rateLimit = require("express-rate-limit");

const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 create account requests per `window` (here, per hour)
  message:
    "Too many accounts created from this IP, please try again after an hour",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Routing Implement
router.post("/login", bruteforce.prevent, loginUser);
router.post("/logout", protect, logoutUser);
router.get("/me", protect, getMe);
// Apply the rate limiting middleware to API calls only
router.post("/register", createAccountLimiter, registerUser);
router.post("/forget-password", forgetPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
