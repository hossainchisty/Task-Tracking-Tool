// Basic Lib Imports
const mongoose = require("mongoose");

/*
  Task Schema Definition
  
*/

const taskSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "Please add a text value"],
    },
    description: {
      type: String,
      required: false,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      required: false,
      index: true,
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
      index: true,
    },
    labels: {
      type: [String],
      required: false,
      index: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },
    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        required: false,
      },
    ],
    isCompleted: { type: Boolean, default: false, index: true },
    dueDate: { type: Date, required: false, index: true },
    reminderDate: { type: Date, index: true },
    notifications: { type: Boolean, default: true },
  },
  { timestamps: true },
  { versionKey: false },
);

module.exports = mongoose.model("Task", taskSchema);
