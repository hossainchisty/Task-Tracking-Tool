// Basic Lib Import
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { generateToken } = require("../helper/generateToken");
const randomString = require("randomstring");
const { sendRestPasswordEmail } = require("../helper/sendEmail");

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { full_name, email, address, password } = req.body;
  if (!full_name || !email || !address || !password) {
    res.status(400);
    throw new Error("Please add all fields.");
  }

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    full_name,
    email,
    address,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      full_name: user.full_name,
      email: user.email,
      address: user.address,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // Check for user email
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      full_name: user.full_name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});

// @desc    Let people reset their own passwords
// @route   POST /api/users/forget-password
// @access  Public
const forgetPassword = asyncHandler(async (req, res) => {
  const { full_name, email } = req.body;
  if (!email) {
    res.status(400);
    throw new Error("Please fillup email field.");
  }
  // Generate random token
  const generateToken = randomString.generateToken();
  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    await User.updateOne({ email: email }, { $set: { token: generateToken } });
    // We will send email here
    sendRestPasswordEmail(full_name, email, generateToken);
    res.status(200);
    res.json({ message: "Link has been send to your email!" });
  } else {
    res.status(400);
    throw new Error("Email doesn't exist!");
  }
  res.json({ message: "Welcome to forget passwrod" });
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
  forgetPassword,
};
