// Basic Lib Imports
const asyncHandler = require("express-async-handler");
const Task = require("../models/taskModel");
const User = require("../models/userModel");
const TaskHistory = require("../models/taskHistoryModel");

/**
 * @desc  Add a collaborator to a task
 * @route  /api/v2/tasks/:taskId/collaborators
 * @method POST
 * @access  Private
 * @param  {string} taskId - The ID of the task to add the collaborator to
 * @param  {string} email - The email of the user to add as a collaborator
 * @returns {object} A success message if the collaborator is added successfully
 */

const addCollaborator = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { email } = req.body;
  try {
    const task = await Task.findById(taskId);
    const user = await User.findOne({ email });

    if (!task) {
      return res.status(404).json({
        status: 404,
        error: "Not Found",
        message: "Task not found.",
      });
    }

    if (!user) {
      return res.status(404).json({
        status: 404,
        error: "Not Found",
        message: "User not found.",
      });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        status: 401,
        error: 'Unauthorized',
        message: "You are not authorized to add collaborators to this task",
      });
    }

    if (task.collaborators.includes(user._id)) {
      return res
        .status(409)
        .json({
          status: 409,
          message: "User is already a collaborator on this task"
        });
    }

    task.collaborators.push(user._id);
    user.collaboratingTasks.push(task._id);

    await task.save();
    await user.save();

    await TaskHistory.create({
      task: task._id,
      user: req.user.id,
      action: "Collaborator Added",
    });

    res.status(200).json({
      status: 200,
      message: "Collaborator added successfully"
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      error: error.message,
      message: "An error occurred while processing the request.",
    });
  }
});

/**
 * @desc   Remove a collaborator from a task
 * @route   /api/v2/tasks/delete/:taskId/collaborators/:userId
 * @method  DELETE
 * @access  Private
 * @param  {string} taskId - The ID of the task to remove the collaborator from
 * @param  {string} userId - The ID of the user to remove as a collaborator
 * @returns {object} A success message if the collaborator is removed successfully
 */

const removeCollaborator = asyncHandler(async (req, res) => {
  const { taskId, userId } = req.params;

  try {
    const task = await Task.findById(taskId);
    const user = await User.findById(userId);

    if (!task) {
      return res.status(404).json({
        status: 404,
        error: "Not Found",
        message: "Task not found.",
      });
    }

    if (!user) {
      return res.status(404).json({
        status: 404,
        error: "Not Found",
        message: "User not found.",
      });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).send({
        status: 403,
        message: "You are not authorized to remove collaborators from this task",
      });
    }

    task.collaborators = task.collaborators.filter(
      (collaboratorId) => collaboratorId.toString() !== userId,
    );
    user.collaboratingTasks = user.collaboratingTasks.filter(
      (collaboratingTaskId) => collaboratingTaskId.toString() !== taskId,
    );

    await task.save();
    await user.save();
    await TaskHistory.create({
      task: task._id,
      user: req.user.id,
      action: "Collaborator Deleted",
    });

    res.status(200).json({
      status: 200,
      message: "Collaborator removed successfully"
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      error: error.message,
      message: "An error occurred while processing the request.",
    });
  }
});

module.exports = {
  addCollaborator,
  removeCollaborator,
};
