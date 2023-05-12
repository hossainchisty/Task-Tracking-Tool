// Basic Lib Import
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { generateToken } = require("../helper/generateToken");
const randomString = require("randomstring");
const Subscription = require("../models/subscriptionModel");
const { sendRestPasswordEmail } = require("../helper/sendEmail");
 
/**
 * @desc    Register new user
 * @route   /api/v1/users/register
 * @method  POST
 * @access  Public
 */

const registerUser = asyncHandler(async (req, res) => {
  const { full_name, email, password } = req.body;
  if (!full_name || !email || !password) {
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
    password: hashedPassword,
    subscription: [],
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      full_name: user.full_name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

/**
 * @desc    Authenticate a user
 * @route   /api/v1/users/login
 * @method  POST
 * @access  Public
 */

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // Check for user email
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200)
    res.send({
      token: generateToken(user._id),
      message: "Logged in successfully",
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

/**
 * @desc    Get user data
 * @route   /api/V1/users/me
 * @method  GET
 * @access  Private
 */

const getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});

/**
 * @desc    Let people reset their own passwords
 * @route   /api/V1/users/forget-password
 * @method  POST
 * @access  Public
 */

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
    // sendRestPasswordEmail(full_name, email, generateToken);
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
