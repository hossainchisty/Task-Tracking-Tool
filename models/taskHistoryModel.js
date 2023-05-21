// Basic Lib Imports
const mongoose = require("mongoose");

/*
    Task History Schema
*/
const TaskHistorySchema = mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: ["Added tasks", "Updated tasks", "Deleted tasks", "Completed tasks", "Uncompleted tasks", "Added comments", "Updated comments", "Deleted comments", "Collaborator Added", "Collaborator Deleted"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("TaskHistory", TaskHistorySchema);
