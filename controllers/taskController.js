// Basic Lib Imports
const asyncHandler = require("express-async-handler");
const Goal = require("../models/taskModel");
const scheduleCronJob = require("../service/cron");
let isCronJobScheduled = false;

/**
 * @desc    Get goals and schedule a cron job for goals with reminderDate
 * @route   GET GET /api/goals
 * @access  Private
 */

const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user.id }).sort({
    createdAt: -1,
  });
  goals.forEach((goal) => {
    if (goal.reminderDate) {
      if (!isCronJobScheduled) {
        scheduleCronJob(goal.title);
      }
    } else {
      if (isCronJobScheduled) {
        isCronJobScheduled = false;
      }
    }
  });

  res.status(200).json(goals);
});

/**
 * @desc    Get all assigned tasks for a user that are due today or overdue
 * @route   GET /api/tasks/assigned
 * @access  Private
 * @param   {object} req - The request object containing the user ID
 * @param   {object} res - The response object to send the tasks
 * @returns {array}  - An array of tasks assigned to the user due today or overdue
 */

const getassignedTasks = asyncHandler(async (req, res) => {
  const status = "todo";
  const tasks = await Goal.find({
    assignedTo: req.user.id,
    status: status,
    dueDate: { $lte: new Date() },
  })
    .sort({ dueDate: "asc" })
    .exec();

  res.status(200).json(tasks);
});

/**
 * @desc    Create a new goal for the authenticated user
 * @route   POST /api/goals
 * @access  Private
 */

const setGoal = asyncHandler(async (req, res) => {
  if (!req.body.title) {
    res.status(400);
    throw new Error("Please add task title.");
  }

  const goal = await Goal.create({
    user: req.user.id,
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority,
    status: req.body.status,
    labels: req.body.labels,
    assignedTo: req.body.assignedTo,
    dueDate: req.body.dueDate,
    reminderDate: req.body.reminderDate,
  });

  res.status(200).json(goal);
});

/**
 * @desc    Update goal
 * @route   PUT /api/goals/:id
 * @access  Private
 */
const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);
  if (!goal) {
    res.status(400);
    throw new Error("Goal not found");
  }

  // Check for user
  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  // Make sure the logged in user matches the goal user
  if (goal.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }
  const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json(updatedGoal);
});

/**
 * @desc    Delete goal
 * @route   DELETE /api/goals/:id
 * @access  Private
 */
const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);
  if (!goal) {
    res.status(400);
    throw new Error("Goal not found");
  }

  // Check for user
  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  // Make sure the logged in user matches the goal user
  if (goal.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const deletedGoal = await Goal.findByIdAndRemove(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json({
    data: deletedGoal,
    id: req.params.id,
    message: "Goal were deleted.",
  });
});

module.exports = {
  getGoals,
  setGoal,
  updateGoal,
  deleteGoal,
  getassignedTasks,
};
