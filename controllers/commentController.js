// Basic Lib Imports
const asyncHandler = require("express-async-handler");
const Task = require("../models/taskModel");
const Comment = require("../models/commentModel");

/**
 * @desc   Create a comment for a task
 * @route  /api/v2/tasks/:taskId/comments/:userId
 * @method POST
 * @access  Private
 * @param  {string} taskId - The ID of the task to add the collaborator to
 * @param  {string} email - The email of the user to add as a collaborator
 * @returns {object} A success message if the collaborator is added successfully
 */

const addComment = asyncHandler(async (req, res) => {
  const taskId = req.params.taskId;
  const userId = req.user._id;
  const { text } = req.body;

  try {
    const task = await Task.findById({ _id: taskId }).lean();
    if (!task) {
      return res.status(404).send({ error: "Task not found" });
    }

    // Create a new Comment object with the comment text, user ID, and task ID
    const comment = new Comment({
      text,
      author: userId,
      task: taskId,
    });

    await comment.save();

    await Task.updateOne({ _id: taskId }, { $push: { comments: comment._id } });

    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Server error" });
  }
});

/**
 * @desc   Remove a collaborator from a task
 * @route   /api/v2/tasks/:taskId/comments/:commentId
 * @method  DELETE
 * @access  Private
 * @param  {string} taskId - The ID of the task to remove the comment from
 * @param  {string} userId - The ID of the user to remove comment
 * @param  {string} commentId - The ID of the comment
 * @returns {object} A success message if the comment is removed successfully
 */

const deleteComment = asyncHandler(async (req, res) => {
  const { taskId, commentId } = req.params;

  const task = await Task.findById(taskId);
  if (!task) {
    return res
      .status(404)
      .send({ error: "Task not found. Please provide a valid task ID." });
  }

  const comment = await Comment.findOneAndDelete({
    _id: commentId,
    task: taskId,
  });
  if (!comment) {
    return res
      .status(404)
      .send({
        error:
          "Comment not found. Please provide a valid comment ID for the given task.",
      });
  }

  res.send({ message: "Comment deleted successfully." });
});

/**
 * @desc    Get all comments for a task
 * @route   /api/v2/tasks/:id/comments
 * @method  GET
 * @access  Private
 * @param  {string} taskId - The ID of the task to get comment
 * @param  {string} userId - The ID of the user to get who wrote this
 * @returns {object} Requested comment
 */

const getComment = asyncHandler(async (req, res) => {
  const taskId = req.params.id;
  const userId = req.user._id;

  try {
    const task = await Task.findOne({ _id: taskId, collaborators: userId });

    if (!task) {
      return res.status(404).send({ error: "Task not found" });
    }

    const comments = await Comment.find({ task: taskId }).populate("author");

    res.send(comments);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Server error" });
  }
});

module.exports = {
  getComment,
  addComment,
  deleteComment,
};
