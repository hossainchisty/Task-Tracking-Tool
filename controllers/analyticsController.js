// Basic Lib Imports
const asyncHandler = require("express-async-handler");
const Task = require("../models/taskModel");

/**

* @desc  Retrieves analytics data for a specific user's tasks
* @route /api/v2/tasks/analytics
* @method GET
* @access Private
* @returns {object} An object containing analytics data for the user's tasks,       including metrics such as completed tasks, overdue tasks, and task status breakdown
*/
const getTaskAnalytics = asyncHandler(async (req, res) => {
  const completedTasks = await Task.countDocuments({
    user: req.user.id,
    status: "completed",
  });
  const overdueTasks = await Task.countDocuments({
    user: req.user.id,
    status: "overdue",
  });
  const incompleteTasks = await Task.countDocuments({
    user: req.user.id,
    status: { $ne: "completed" },
  });

  const taskAnalytics = {
    completedTasks,
    overdueTasks,
    incompleteTasks,
  };

  res.status(200).json(taskAnalytics);
});

module.exports = {
  getTaskAnalytics,
};
