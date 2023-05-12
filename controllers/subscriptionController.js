// Basic Lib Imports
const asyncHandler = require("express-async-handler");
const Subscription = require("../models/subscriptionModel");
const User = require("../models/userModel");
const moment = require("moment");

/**
 * Creates a new subscription for a user and saves it to the database.
 * @param {string} userId - The ID of the user for whom the subscription is being created.
 * @param {string} planId - The ID of the plan that the user is subscribing to.
 * @param {Date} startDate - The start date of the subscription.
 * @param {number} amount - The amount to be charged for the subscription.
 * @returns {Promise<Subscription>} The newly created subscription object.
 * @throws {Error} If there is an error creating the subscription object or saving it to the database.
 */

const createSubscription = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  try {
    // Create new subscription
    const subscription = new Subscription({
      user: req.user._id,
      status: "active",
      price: req.body.price,
      duration: req.body.duration,
      plan: req.body.plan,
      billingCycle: req.body.billingCycle,
      startDate: new Date(),
      endDate: moment().add(req.body.duration, "days").toDate(),
    });

    // add the subscription to the user's subscription array
    user.subscription.push(subscription);

    // save the updated user document
    await user.save();

    res.status(201).json(subscription);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = {
  createSubscription,
};
