// Basic Lib Imports
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

/**
 * @desc   Middleware that verifies user authorization
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      if (
        error.name === "JsonWebTokenError" &&
        error.message === "invalid signature"
      ) {
        // Handle invalid signature error
        res.status(401);
        throw new Error("Invalid token signature");
      } else {
        // Handle other JWT errors
        console.error(error);
        res.status(401);
        throw new Error("Please authenticate");
      }
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect };
