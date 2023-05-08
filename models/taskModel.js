// Basic Lib Imports
const mongoose = require("mongoose");
const moment = require("moment-timezone");


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
      default: "medium",
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },
    labels: {
      type: [String],
      required: false,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    active: { type: Boolean, default: true },
    dueDate: { type: Date, required: false },
    reminderDate: { type: Date },
    notifications: { type: Boolean, default: true },
  },
  { timestamps: true },
  { versionKey: false }
);

taskSchema.pre("save", function (next) {
  if (this.reminderDate) {
    const timeZone = "Asia/Dhaka";
    this.reminderDate = moment.tz(this.reminderDate, timeZone).format();
  }
  next();
});


module.exports = mongoose.model("Goal", taskSchema);
