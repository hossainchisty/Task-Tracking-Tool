// Basic Lib Imports
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OTP = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    OTP: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
  { versionKey: false },
);

module.exports = mongoose.model("OTP", OTP);
