// Basic Lib Imports
const mongoose = require("mongoose");

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
    address: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
    token: {
      type: String,
      default: "",
    },
    collaboratingTasks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    }]
  },
  { timestamps: true },
  { versionKey: false }
);

module.exports = mongoose.model("User", userSchema);
