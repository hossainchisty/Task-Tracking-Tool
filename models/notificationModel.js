// Basic Lib Imports
const mongoose = require("mongoose");


const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    medium: {
      type: String,
      enum: ["email", "sms", "push"],
      required: true,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
  { timestamps: true }
);
