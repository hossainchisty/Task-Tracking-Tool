// Basic Lib Imports
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
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

  res.status(200).json({
    status: "success",
    code: 200,
    data: {
        tasks,
    },
});
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
  
  if (!task) {
    return res.status(404).json({
      status: 'forbidden',
      code: 404,
      error: "Not Found",
      message: "Task not found.",
    });
  }
  
  return res.status(200).json({
    status: 'success',
    code: 200,
    data: task,
  });
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
    return res.status(400).json({
      status: 'failed',
      code: 400,
      error: "Bad Request",
      message: "Invalid priority value.",
    });
  }

  try {
    const tasks = await Task.find({ user: req.user.id, priority: priority });

    if (tasks.length === 0) {
      return res.status(204).json({
        status: '404 Not Found',
        code: 404,
        message: "No tasks found with the specified priority.",
      });
    }

    res.status(200).json({
      status: 'success',
      code: 200,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      status: 'failed',
      code: 500,
      error: "Internal Server Error",
      message: "An error occurred while processing the request.",
    });
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
  const validStatuses = ["todo", "in-progress", "done"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      status: 400,
      error: "Bad Request",
      message: "Invalid status value. Allowed values: 'todo', 'in-progress', 'done'."
    });
  }

  try {
    const tasks = await Task.find({ user: req.user.id, status: status });
    if (tasks.length === 0) {
      return res.status(404).json({
        status: 404,
        error: "Not Found",
        message: "No tasks found with the provided status."
      });
    }
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({
      status: 500,
      error: "Internal Server Error",
      message: "An error occurred while processing the request."
    });
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
  try {
    // Destructure request body
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

    // Check for required title field
    if (!title) {
      return res.status(400).json({
        status: 'Bad Request',
        code: 400,
        message: 'Validation error',
        errors: [
          {
            field: 'title',
            message: 'Title field is required',
          },
        ],
      });
    }

    // Create a new task
    const taskData = {
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
    };

    const task = await Task.create(taskData);

    // Log task addition in history
    const taskHistoryData = {
      task: task._id,
      user: req.user.id,
      action: 'Added tasks',
    };
    await TaskHistory.create(taskHistoryData);

    // Send the created task in the response
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({
      status: 'Internal Server Error',
      code: 500,
      message: error.message,
    });
  }
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

  try {
    const task = await Task.findById(id).lean();
    if (!task) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Task not found",
      });
    }

    // Make sure the logged-in user matches the task user
    if (task.user.toString() !== userId) {
      return res.status(403).json({
        status: "error",
        code: 403,
        message: "Unauthorized - User does not have permission to update this task",
      });
    }

    await Task.updateOne({ _id: id, user: userId }, req.body);
    await TaskHistory.create({
      task: id,
      user: req.user.id,
      action: "Updated task",
    });

    const updatedTask = await Task.findById(id);
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: "An error occurred while updating the task",
    });
  }
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
      throw new Error("User not authenticated");
    }

    if (task.user.toString() !== req.user.id) {
      res.status(401).json({
        status: 'failed',
        code: 401,
        error: "Unauthorized",
        message: "User is authenticated but not authorized",
        suggestion: "Please provide a valid authentication information.",
      });
    }

    const deletedTask = await Task.findByIdAndRemove(req.params.id, req.body, {
      new: true,
    });

    if (!deletedTask) {
      res.status(404).json({
        status: "failed",
        code: 404,
        message: "Task not found",
      }); 
    }

    await TaskHistory.create({
      task: task.id,
      user: req.user.id,
      action: "Deleted tasks",
    });

    res.status(200).json({
      data: deletedTask,
      id: req.params.id,
      message: "Task was deleted.",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});


/**
 * @desc     Update task completion status, award points, and badges
 * @route   /api/v1/tasks/:id
 * @method  PATCH
 * @access  Private
 * @addons  We can give additional features to the task completion like when someone completes 5 tasks a day then they only get points and badges.
 */

const markAsComplete = asyncHandler(async (req, res) => {
  try {
    const taskId = req.params.id;

    // Check if the task exists
    const existingTask = await Task.findOneAndUpdate(
      { _id: taskId },
      {
        $set: {
          isCompleted: true,
          status: "done",
          priority: "",
          notifications: false,
          dueDate: "",
          reminderDate: "",
        },
      },
      { new: true, lean: true },
    );

    if (!existingTask) {
      return res.status(404).json({
        status: "failed",
        code: 404,
        message: "Task not found",
      }); 
    }

    // Check if the task was already completed
    if (existingTask.isCompleted) {
      return res
        .status(400)
        .json({
          status: 'failed',
          code: 400,
          message: "Task already marked as completed" 
        });
    }

    // Update action history
    await TaskHistory.create({
      task: existingTask._id,
      user: req.user.id,
      action: "Completed tasks",
    });

    // Get the user who completed the task
    const userUpdateOperations = [
      {
        updateOne: {
          filter: { _id: req.user.id },
          update: {
            $inc: { points: 10 },
            $addToSet: { badges: "Completion Badge" },
          },
        },
      },
    ];

    await User.bulkWrite(userUpdateOperations);

    res.json(existingTask);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
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
