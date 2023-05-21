// Basic Lib Imports
const mongoose = require("mongoose");
const Subscription = require("../models/subscriptionModel");

const userSchema = mongoose.Schema(
  {
    full_name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
    },
    avatar: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
    token: {
      type: String,
      default: "",
    },
    collaboratingTasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    points: { type: Number, default: 0 },
    badges: [{ type: String }],
    subscription: [Subscription.schema],
  },
  { timestamps: true },
  { versionKey: false }
);

module.exports = mongoose.model("User", userSchema);
