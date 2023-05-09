// Basic Lib Imports
const asyncHandler = require("express-async-handler");
const Task = require("../models/taskModel");
const scheduleCronJob = require("../service/cron");
let isCronJobScheduled = false;

/**
 * @desc    Get tasks and schedule a cron job for tasks with reminderDate
 * @route   /api/v2/tasks/
 * @method  GET
 * @access  Private
 */

const getTask = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user.id })
  .sort({ createdAt: -1 })
  
  tasks.forEach((task) => {
    if (task.reminderDate) {
      if (!isCronJobScheduled) {
        scheduleCronJob(task.title);
      }
    } else {
      if (isCronJobScheduled) {
        isCronJobScheduled = false;
      }
    }
  });

  res.status(200).json(tasks);
});

/**
 * @desc    Get all assigned tasks for a user that are due today or overdue
 * @route   /api/v2/tasks/assigned
 * @method  GET
 * @access  Private
 * @param   {object} req - The request object containing the user ID
 * @param   {object} res - The response object to send the tasks
 * @returns {array}  - An array of tasks assigned to the user due today or overdue
 */

const getassignedTasks = asyncHandler(async (req, res) => {
  const status = "todo";
  const tasks = await Task.find({
    assignedTo: req.user.id,
    status: status,
    dueDate: { $lte: new Date() },
  })
    .sort({ dueDate: "asc" })
    .exec();

  res.status(200).json(tasks);
});

/**
 * @desc    Create a new task for the authenticated user
 * @route   /api/v2/tasks
 * @method  POST
 * @access  Private
 * @returns {object} Newly added task in json format
 */

const addTask = asyncHandler(async (req, res) => {
  if (!req.body.title) {
    res.status(400);
    throw new Error("Please add task title.");
  }

  const task = await Task.create({
    user: req.user.id,
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority,
    status: req.body.status,
    labels: req.body.labels,
    assignedTo: req.body.assignedTo,
    dueDate: req.body.dueDate,
    reminderDate: req.body.reminderDate,
    collaborators: req.body.collaborators,
    comments: req.body.comments,
  });

  res.status(200).json(task);
});

/**
 * @desc    Update task
 * @route   /api/v2/tasks/:id
 * @method  PUT
 * @access  Private
 */
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(400);
    throw new Error("Goal not found");
  }

  // Check for user
  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  // Make sure the logged in user matches the task user
  if (task.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json(updatedTask);
});

/**
 * @desc    Delete task
 * @route   /api/v2/tasks/:id
 * @method  DELETE
 * @access  Private
 */
const deleteTask = asyncHandler(async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!req.user) {
      res.status(401);
      throw new Error("User not found");
    }

    // Make sure the logged in user matches the task user
    if (task.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error("User not authorized");
    }

    const deletedTask = await Task.findByIdAndRemove(req.params.id, req.body, {
      new: true,
    });

    if (!deletedTask) {
      res.status(400);
      throw new Error("Task not found");
    }

    res.status(200).json({
      data: deletedTask,
      id: req.params.id,
      message: "Task was deleted.",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = {
  getTask,
  addTask,
  updateTask,
  deleteTask,
  getassignedTasks,
};
