// Basic Lib Imports
const mongoose = require("mongoose");

const subscriptionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plan: {
      type: String,
      enum: ["premium", "enterprise"],
      required: true,
    },
    features: {
      type: String,
      required: false,
    },
    billingCycle: {
      type: String,
      enum: ["monthly", "yearly"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["active", "canceled"],
      default: "active",
    },
    duration: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: false,
    },
    endDate: {
      type: Date,
      required: false,
    },
    isCanceled: {
      type: Boolean,
      default: false,
    },
    canceledAt: {
      type: Date,
      required: false,
    },
  },
  { versionKey: false }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;
