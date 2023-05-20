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
    status: "done",
  });
  const dueTasks = await Task.countDocuments({
    user: req.user.id,
    status: "todo",
  });
  const incompleteTasks = await Task.countDocuments({
    user: req.user.id,
    status: { $ne: "in-progress" },
  });
  const userId = req.user.id;
  const totalTasks = await Task.countDocuments({ user: userId });
  const taskCompleted = await Task.countDocuments({ user: userId, status: 'done' , isCompleted: true });
  const completionRate = Math.round((taskCompleted / totalTasks) * 100)

  const taskAnalytics = {
    incompleteTasks,
    completedTasks,
    dueTasks,
    completionRate,
  };
  res.status(200).json(taskAnalytics);
});

module.exports = {
  getTaskAnalytics,
};
