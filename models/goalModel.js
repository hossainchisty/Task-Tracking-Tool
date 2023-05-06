// Basic Lib Imports
const mongoose = require("mongoose");

const goalSchema = mongoose.Schema(
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
    status: {
      type: String,
      enum: ["pending", "done"],
      default: "pending",
    },
    active: {
      type: Boolean,
      default: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    deadlines: {
      type: Date,
      require: false,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Goal", goalSchema);
