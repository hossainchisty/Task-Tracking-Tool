// Basic Lib Imports
const asyncHandler = require("express-async-handler");
const TaskHistory = require("../models/taskHistoryModel");

/**
 * @desc Retrieves the history of completed tasks for a specific user
 * @route /api/v1/tasks/history
 * @method GET
 * @access Private
 * @returns {object} An object containing the history of tasks for the user, including the task title, action verbs, and TODO:(duration of completion)v4.0
 */

const getTaskHistory = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  // Get the task history records for the specified task
  const taskHistory = await TaskHistory.find({ taskId }).sort({
    createdAt: "desc",
  });

  res.status(200).json(taskHistory);
});

module.exports = {
  getTaskHistory,
};
