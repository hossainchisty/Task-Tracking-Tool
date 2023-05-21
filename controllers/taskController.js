// Basic Lib Imports
const asyncHandler = require("express-async-handler");
const Task = require("../models/taskModel");
const scheduleCronJob = require("../service/cron");
const TaskHistory = require("../models/taskHistoryModel");
let isCronJobScheduled = false;

/**
 * @desc  Get tasks and schedule a cron job for tasks with reminderDate
 * @route   /api/v2/tasks/
 * @method  GET
 * @access  Private
 */

const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });

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
 * @desc    Get a tasks
 * @route   /api/v1/tasks/item/:taskID
 * @method  GET
 * @access  Private
 * @return Task based on the given id
 */

const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.taskID).lean();
  // Check if the task exists
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.status(200).json(task);
});

/**
 * @desc    Find tasks based on priority
 * @route   /api/v2/tasks/priority/:priority
 * @method  GET
 * @access  Private
 */

const getTasksByPriority = asyncHandler(async (req, res) => {
  const priority = req.params.priority;

  // Validate priority
  if (priority !== "low" && priority !== "medium" && priority !== "high") {
    return res.status(400).send({ error: "Invalid priority" });
  }

  try {
    const tasks = await Task.find({ user: req.user.id, priority: priority });

    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Server error" });
  }
});

/**
 * @desc    Find tasks based on status
 * @route   /api/v2/tasks/status/:status
 * @method  GET
 * @access  Private
 */

const getTasksByStatus = asyncHandler(async (req, res) => {
  const status = req.params.status;

  // Validate status
  if (status !== "todo" && status !== "in-progress" && status !== "done") {
    return res.status(400).send({ error: "Invalid status" });
  }

  try {
    const tasks = await Task.find({ user: req.user.id, status: status });
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Server error" });
  }
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
  const {
    title,
    description,
    priority,
    status,
    labels,
    assignedTo,
    dueDate,
    reminderDate,
    collaborators,
    comments,
  } = req.body;

  if (!req.body.title) {
    res.status(400);
    throw new Error("Please add task title.");
  }

  const task = await Task.create({
    user: req.user.id,
    title,
    description,
    priority,
    status,
    labels,
    assignedTo,
    dueDate,
    reminderDate,
    collaborators,
    comments,
  });

  await TaskHistory.create({
    task: task._id,
    user: req.user.id,
    action: 'Added tasks',
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
  const { id } = req.params;
  const { id: userId } = req.user;

  const task = await Task.findById(id).lean();
  if (!task) {
    res.status(400);
    throw new Error("Goal not found");
  }

  // Make sure the logged in user matches the task user
  if (task.user.toString() !== userId) {
    res.status(401);
    throw new Error("User not authorized");
  }

  await Task.updateOne({ _id: id, user: userId }, req.body);
  await TaskHistory.create({
    task: id,
    user: req.user.id,
    action: 'Updated tasks',
  });

  const updatedTask = await Task.findById(id);
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

    await TaskHistory.create({
      task: id,
      user: req.user.id,
      action: 'Deleted tasks',
    });

    res.status(200).json({
      data: deletedTask,
      id: req.params.id,
      message: "Task was deleted.",
    });
  } catch (error) {
    res.status(
      error.statusCode || 500,
      { error: error.message }
    )
  }
});

/**
 * @desc    Mark the task as completed
 * @route   /api/v1/tasks/:id
 * @method  PATCH
 * @access  Private
 */

const markAsComplete = asyncHandler(async (req, res) => {
  try {
    const taskId = req.params.id;
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        isCompleted: true, status: "done", priority: "", notifications: false,
        dueDate: "", reminderDate: ""
      },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    await TaskHistory.create({
      task: id,
      user: req.user.id,
      action: 'Completed tasks',
    });

    res.json(updatedTask);
  } catch (error) {
    res.status(
      error.statusCode || 500,
      { error: error.message }
    )
  }
});


module.exports = {
  getTasks,
  getTask,
  addTask,
  updateTask,
  deleteTask,
  getTasksByPriority,
  getassignedTasks,
  getTasksByStatus,
  markAsComplete,
};
