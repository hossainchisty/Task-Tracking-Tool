// Basic Lib Imports
const mongoose = require("mongoose");

/*
    Task History Schema
*/
const TaskHistorySchema = mongoose.Schema({
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
    enum: ["created", "updated", "deleted", "completed", "incomplete"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("TaskHistory", TaskHistorySchema);
