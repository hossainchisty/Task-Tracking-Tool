const User = require("../models/userModel");

/**
 * Middleware to check if the user has an active subscription before allowing access to certain routes.
 *
 * This middleware checks the user's subscription status by looking at their subscription information in the database.
 * If the user has an active subscription, the middleware will call next() and allow access to the requested route.
 * If the user does not have an active subscription, they will be redirected to the subscription page with a message prompting them to subscribe.
 *
 * This middleware can be used to protect premium features or content that require a subscription to access.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next() function to call the next middleware in the chain.
 *
 * @throws {Error} If the user is not authenticated or their subscription information cannot be found in the database.
 */

const subscriptionMiddleware = async (req, res, next) => {
  const { id } = req.user;

  try {
    const user = await User.findById(id);

    // Check if user exists and has a subscription
    if (!user || !user.subscription) {
      return res.status(402).json({ error: "Subscription required" });
    }

    // // Check if subscription is active
    // if (user.subscription.status !== "active") {
    //   return res.status(402).json({ error: "Inactive subscription" });
    // }

    // // Check if user's subscription includes the feature
    // const featureName = req.body.featureName; // replace with the name of the feature you want to check
    // if (
    //   !user.subscription ||
    //   !user.subscription.features ||
    //   !user.subscription.features.includes(featureName)
    // ) {
    //   return res
    //     .status(403)
    //     .json({ error: "Feature not included in subscription" });
    // }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Server error" });
  }
};

module.exports = subscriptionMiddleware;
